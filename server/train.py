"""
BananaGuard -- CNN Training Script (PyTorch + MobileNetV2 Transfer Learning)
============================================================================
Trains a banana leaf disease classifier with two-phase transfer learning:
  Phase 1 -- Freeze backbone, train custom head only   (~10 epochs)
  Phase 2 -- Unfreeze top layers, fine-tune end-to-end (~20 epochs)

Dataset layout expected:
  server/dataset/train/<class_name>/*.jpg
  server/dataset/val/<class_name>/*.jpg

Run:
  cd server
  python train.py
"""

import os
import json
import copy
import time

import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader

# --- Configuration (CPU-optimized) ------------------------------------------
DATASET_DIR    = "dataset"
MODEL_SAVE_DIR = os.path.join("app", "ml", "model")
MODEL_PATH     = os.path.join(MODEL_SAVE_DIR, "best_model.pt")
LABELS_PATH    = os.path.join(MODEL_SAVE_DIR, "class_indices.json")

IMG_SIZE    = 96           # Smaller size = much faster on CPU
BATCH_SIZE  = 16           # Smaller batch for CPU memory efficiency
NUM_WORKERS = 0            # Keep 0 on Windows
DEVICE      = torch.device("cpu")

EPOCHS_PHASE1 = 8          # Head-only training
EPOCHS_PHASE2 = 12         # Fine-tuning
LR_PHASE1     = 1e-3
LR_PHASE2     = 5e-5
PATIENCE      = 4          # Early stopping patience

CLASS_NAMES = [
    'healthy',
    'black_sigatoka',
    'yellow_sigatoka',
    'fusarium_wilt',
    'bract_mosaic_virus',
    'cordana',
    'pestalotiopsis',
]
NUM_CLASSES = len(CLASS_NAMES)

# ImageNet statistics (used by pretrained MobileNetV2)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]


# --- Data Loaders -------------------------------------------------------------

def get_transforms():
    train_tf = transforms.Compose([
        transforms.Resize((IMG_SIZE + 20, IMG_SIZE + 20)),
        transforms.RandomCrop(IMG_SIZE),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(30),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.1),
        transforms.RandomGrayscale(p=0.05),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])
    val_tf = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])
    return train_tf, val_tf


def prepare_data():
    train_dir = os.path.join(DATASET_DIR, "train")
    val_dir   = os.path.join(DATASET_DIR, "val")

    if not os.path.exists(train_dir):
        print(f"❌  Dataset not found at '{train_dir}'.")
        print("    Run:  python download_dataset.py")
        return None, None, None

    train_tf, val_tf = get_transforms()

    train_ds = datasets.ImageFolder(train_dir, transform=train_tf)
    val_ds   = datasets.ImageFolder(val_dir,   transform=val_tf)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True,
                              num_workers=NUM_WORKERS, pin_memory=False)
    val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False,
                              num_workers=NUM_WORKERS, pin_memory=False)

    print(f"[DATA] Train: {len(train_ds)} images across {len(train_ds.classes)} classes")
    print(f"[DATA] Val:   {len(val_ds)} images across {len(val_ds.classes)} classes")
    print(f"[DATA] Classes: {train_ds.classes}")

    return train_loader, val_loader, train_ds.class_to_idx


# --- Model --------------------------------------------------------------------

def build_model(num_classes: int):
    """MobileNetV2 pretrained on ImageNet with custom classification head."""
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

    # Freeze entire backbone
    for param in model.features.parameters():
        param.requires_grad = False

    # Replace classifier head
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(in_features, 256),
        nn.ReLU(inplace=True),
        nn.Dropout(p=0.3),
        nn.Linear(256, num_classes),
    )
    return model.to(DEVICE)


def unfreeze_top_layers(model, n_layers: int = 30):
    """Unfreeze the last n_layers of the backbone for fine-tuning."""
    feature_layers = list(model.features.children())
    for layer in feature_layers[-n_layers:]:
        for param in layer.parameters():
            param.requires_grad = True
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total     = sum(p.numel() for p in model.parameters())
    print(f"   [INFO] Trainable params: {trainable:,} / {total:,}")


# --- Training Loop ------------------------------------------------------------

def run_epoch(model, loader, criterion, optimizer, training: bool):
    model.train() if training else model.eval()
    total_loss, correct, total = 0.0, 0, 0

    ctx = torch.enable_grad() if training else torch.no_grad()
    with ctx:
        for images, labels in loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            if training:
                optimizer.zero_grad()
            logits = model(images)
            loss   = criterion(logits, labels)
            if training:
                loss.backward()
                optimizer.step()
            total_loss += loss.item() * images.size(0)
            preds       = logits.argmax(dim=1)
            correct    += (preds == labels).sum().item()
            total      += images.size(0)

    return total_loss / total, correct / total


def train_phase(model, train_loader, val_loader, criterion,
                optimizer, scheduler, epochs: int, phase_name: str):
    best_val_acc   = 0.0
    best_state     = None
    patience_count = 0

    for epoch in range(1, epochs + 1):
        t0 = time.time()
        train_loss, train_acc = run_epoch(model, train_loader, criterion, optimizer, True)
        val_loss,   val_acc   = run_epoch(model, val_loader,   criterion, optimizer, False)
        elapsed = time.time() - t0

        scheduler.step(val_loss)
        lr = optimizer.param_groups[0]['lr']

        print(f"  [{phase_name}] Ep {epoch:02d}/{epochs} | "
              f"Train Loss {train_loss:.4f} Acc {train_acc*100:.1f}% | "
              f"Val Loss {val_loss:.4f} Acc {val_acc*100:.1f}% | "
              f"LR {lr:.2e} | {elapsed:.1f}s")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_state   = copy.deepcopy(model.state_dict())
            patience_count = 0
            print(f"  [BEST] New best val accuracy: {val_acc*100:.1f}%")
        else:
            patience_count += 1
            if patience_count >= PATIENCE:
                print(f"  [STOP] Early stopping after {epoch} epochs (no improvement for {PATIENCE}).")  
                break

    # Restore best weights
    if best_state:
        model.load_state_dict(best_state)
    return best_val_acc


# --- Entry Point --------------------------------------------------------------

def train():
    os.makedirs(MODEL_SAVE_DIR, exist_ok=True)

    print("\n" + "="*60)
    print("  BananaGuard -- CNN Training (PyTorch MobileNetV2)")
    print("="*60)

    train_loader, val_loader, class_to_idx = prepare_data()
    if train_loader is None:
        return

    # Save class label mapping
    with open(LABELS_PATH, "w") as f:
        json.dump(class_to_idx, f, indent=2)
    print(f"[SAVE] Class mapping saved -> {LABELS_PATH}")

    model     = build_model(len(class_to_idx))
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

    # -- Phase 1: Train head only ----------------------------------------------
    print(f"\n{'-'*60}")
    print("  PHASE 1 - Training classification head (backbone frozen)")
    print(f"{'-'*60}")
    optimizer1 = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=LR_PHASE1)
    scheduler1 = ReduceLROnPlateau(optimizer1, mode='min', factor=0.3, patience=3, min_lr=1e-6)

    best1 = train_phase(model, train_loader, val_loader, criterion,
                        optimizer1, scheduler1, EPOCHS_PHASE1, "Phase1")

    # Save Phase 1 checkpoint
    torch.save(model.state_dict(), MODEL_PATH)
    print(f"\n[SAVE] Phase 1 model saved -> {MODEL_PATH}  (val acc: {best1*100:.1f}%)")

    # Phase 2: Fine-tune top backbone layers
    print(f"\n{'-'*60}")
    print("  PHASE 2 - Fine-tuning (unfreeze top 30 backbone layers)")
    print(f"{'-'*60}")
    unfreeze_top_layers(model, n_layers=30)
    optimizer2 = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=LR_PHASE2)
    scheduler2 = ReduceLROnPlateau(optimizer2, mode='min', factor=0.3, patience=3, min_lr=1e-7)

    best2 = train_phase(model, train_loader, val_loader, criterion,
                        optimizer2, scheduler2, EPOCHS_PHASE2, "Phase2")

    if best2 >= best1:
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"\n[SAVE] Fine-tuned model saved -> {MODEL_PATH}  (val acc: {best2*100:.1f}%)")
    else:
        print(f"\n[INFO] Phase 1 model was better ({best1*100:.1f}% vs {best2*100:.1f}%). Keeping Phase 1 weights.")

    print("\n" + "="*60)
    print(f"  [DONE] Training complete!  Best val accuracy: {max(best1,best2)*100:.1f}%")
    print(f"  [FILE] Model saved to: {MODEL_PATH}")
    print("="*60 + "\n")


if __name__ == "__main__":
    train()
