# 🍌 Banana Leaf Disease Detector (BananaGuard AI)

A premium, full-stack AI-powered application for detecting and classifying diseases in banana leaves using Convolutional Neural Networks (CNN).

## Features

- **Real-time Camera & Batch Scanning**: Upload multiple images or scan via webcam.
- **AI Disease Detection**: Uses a MobileNetV2 Transfer Learning model to identify 7 classes of banana diseases with high confidence.
- **Integrated Disease Library**: Full encyclopedia of symptoms, treatments, and prevention methods.
- **Analytics Dashboard**: View scan history, disease distributions, and total health scores.
- **Premium UI/UX**: Designed with a glassmorphism theme, dynamic animations, and responsive interactions.

## Architecture

- **Frontend**: React 18, Vite, React Router DOM, custom CSS (no Tailwind).
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite.
- **ML Engine**: TensorFlow/Keras (MobileNetV2 architecture).

## Setup & Run

### 1. Backend (Python/FastAPI)

```bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*The backend API will run on `http://localhost:8000`*

### 2. Frontend (React/Vite)

```bash
cd client
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

### 3. Model Training (Optional)
If you have the Kaggle Banana Leaf Disease dataset:
1. Place the dataset in `server/dataset/train` and `server/dataset/val`.
2. Run `python server/train.py`
3. The newly trained model will automatically be saved to `server/app/ml/model/best_model.h5`.

*Note: If no model is found in the `model` folder, the backend will gracefully fallback to a simulation mode so you can still test the UI interactions.*
