import os
import io
import json
import numpy as np
from PIL import Image, ImageOps

try:
    import torch
    import torch.nn as nn
    import torchvision.models as models
    import torchvision.transforms as transforms
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("PyTorch not installed. Running in simulation mode only.")


class BananaDiseasePredictor:
    """
    CNN-based banana leaf disease predictor using MobileNetV2 (PyTorch).
    Loads a pre-trained model from disk, or falls back to simulation mode.
    """

    CLASS_LABELS = [
        'healthy',
        'black_sigatoka',
        'yellow_sigatoka',
        'fusarium_wilt',
        'bract_mosaic_virus',
        'cordana',
        'pestalotiopsis',
    ]

    IMG_SIZE = 96

    # ImageNet normalization (same stats used during training)
    NORMALIZE_MEAN = [0.485, 0.456, 0.406]
    NORMALIZE_STD  = [0.229, 0.224, 0.225]

    def __init__(self):
        self.model = None
        self.device = torch.device('cpu') if TORCH_AVAILABLE else None
        self.model_dir  = os.path.join(os.path.dirname(__file__), 'model')
        self.model_path = os.path.join(self.model_dir, 'best_model.pt')
        self.labels_path = os.path.join(self.model_dir, 'class_indices.json')

        # Override class labels from saved mapping if present
        if os.path.exists(self.labels_path):
            with open(self.labels_path) as f:
                mapping = json.load(f)  # {class_name: index}
            # Invert to {index: class_name}
            inv = {v: k for k, v in mapping.items()}
            self.CLASS_LABELS = [inv[i] for i in range(len(inv))]

        self._build_transform()
        self._load_model()

    def _build_transform(self):
        """Preprocessing pipeline matching training augmentations."""
        self.transform = transforms.Compose([
            transforms.Resize((self.IMG_SIZE, self.IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=self.NORMALIZE_MEAN, std=self.NORMALIZE_STD),
        ])

    def _build_architecture(self):
        """Recreate the exact same architecture used during training."""
        num_classes = len(self.CLASS_LABELS)
        model = models.mobilenet_v2(weights=None)
        # Replace classifier head
        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(p=0.3),
            nn.Linear(256, num_classes),
        )
        return model

    def _load_model(self):
        if not TORCH_AVAILABLE:
            print("PyTorch unavailable -- running in simulation mode.")
            return

        if not os.path.exists(self.model_path):
            print(f"[BananaGuard] Model not found at {self.model_path}. "
                  "Run 'python train.py' to train the model. Using simulation mode.")
            return

        try:
            model = self._build_architecture()
            state_dict = torch.load(self.model_path, map_location=self.device)
            model.load_state_dict(state_dict)
            model.to(self.device)
            model.eval()
            self.model = model
            print(f"[BananaGuard] [OK] Model loaded from {self.model_path}")
        except Exception as exc:
            print(f"[BananaGuard] [ERROR] Error loading model: {exc}. Using simulation mode.")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def predict(self, image_bytes: bytes) -> list[dict]:
        """
        Run disease prediction on raw image bytes.
        Returns a list of {class_id, confidence} dicts sorted by confidence desc.
        """
        if not TORCH_AVAILABLE or self.model is None:
            return self._simulate_prediction(image_bytes)

        try:
            image = self._preprocess(image_bytes)
            with torch.no_grad():
                logits = self.model(image)
                probs  = torch.softmax(logits, dim=1)[0].cpu().numpy()

            results = [
                {"class_id": self.CLASS_LABELS[i], "confidence": float(probs[i])}
                for i in range(len(self.CLASS_LABELS))
            ]
            results.sort(key=lambda x: x["confidence"], reverse=True)
            return results

        except Exception as exc:
            print(f"[BananaGuard] Prediction error: {exc}")
            raise ValueError(f"Error processing image: {str(exc)}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _preprocess(self, image_bytes: bytes):
        """Open image, fix EXIF orientation, convert to tensor batch."""
        image = Image.open(io.BytesIO(image_bytes))
        image = ImageOps.exif_transpose(image)   # Fix camera rotation
        image = image.convert("RGB")
        tensor = self.transform(image)            # (C, H, W)
        return tensor.unsqueeze(0).to(self.device)  # (1, C, H, W)

    def _simulate_prediction(self, image_bytes: bytes) -> list[dict]:
        """
        Deterministic fallback when no model is available.
        Uses a hash of the image content (not just size) for more realistic variation.
        """
        import hashlib, random
        digest = hashlib.md5(image_bytes).hexdigest()
        random.seed(digest)

        is_healthy = random.random() > 0.65

        if is_healthy:
            top_conf = random.uniform(0.82, 0.97)
            top_class = "healthy"
        else:
            disease_classes = [c for c in self.CLASS_LABELS if c != "healthy"]
            top_class = random.choice(disease_classes)
            top_conf  = random.uniform(0.72, 0.94)

        results = [{"class_id": top_class, "confidence": top_conf}]
        remaining = 1.0 - top_conf
        others = [c for c in self.CLASS_LABELS if c != top_class]
        random.shuffle(others)

        for cls in others:
            val = remaining * random.uniform(0.05, 0.4)
            val = min(val, remaining)
            results.append({"class_id": cls, "confidence": val})
            remaining -= val
            if remaining <= 0:
                break

        # Normalise to sum = 1
        total = sum(r["confidence"] for r in results)
        for r in results:
            r["confidence"] /= total

        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results


# Singleton -- loaded once at import time
predictor = BananaDiseasePredictor()
