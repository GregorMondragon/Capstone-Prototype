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

## How to Run

### Prerequisites
Make sure you have the following installed on your computer:
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the Project
```bash
git clone https://github.com/GregorMondragon/Capstone-Prototype.git
cd Capstone-Prototype
```

### 2. Run the Backend (Python/FastAPI)
```bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend API will run at `http://localhost:8000`.

### 3. Run the Frontend (React/Vite)
Open a second terminal and run:
```bash
cd client
npm install
npm run dev
```
The frontend will run at `http://localhost:5173`.

### 4. Access the Application
- Open your browser and go to `http://localhost:5173`
- The frontend will communicate with the backend running at `http://localhost:8000`

### 5. Optional: Train the Model
If you want to retrain the AI model with your own dataset:
1. Place the dataset in `server/dataset/train` and `server/dataset/val`
2. Run `python server/train.py`
3. The trained model will be saved to `server/app/ml/model/best_model.pt`

> Note: If no trained model is found, the backend can still run in a fallback mode for testing the UI.
