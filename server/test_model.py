import os
from app.ml.predictor import predictor

def test_prediction(image_path):
    print(f"Testing {image_path}:")
    if not os.path.exists(image_path):
        print("  File not found!")
        return
        
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        
    results = predictor.predict(image_bytes)
    for r in results[:3]:
        print(f"  {r['class_id']}: {r['confidence']*100:.2f}%")
    print()

if __name__ == "__main__":
    test_prediction("dataset/val/healthy/healthy_val_0000.jpg")
    test_prediction("dataset/val/black_sigatoka/black_sigatoka_val_0000.jpg")
    test_prediction("dataset/val/fusarium_wilt/fusarium_wilt_val_0000.jpg")
