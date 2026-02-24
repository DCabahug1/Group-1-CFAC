from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe import Image as mp_Image, ImageFormat
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
import pickle
import numpy as np
import cv2
# OpenAI verification moved to Supabase Edge Function

app = FastAPI()

# Add CORS middleware to allow requests from React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Hands (persistent instance for speed)
# Using new Tasks API for mediapipe 0.10.30+
MODEL_ASSET_PATH = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")
base_options = python.BaseOptions(model_asset_path=MODEL_ASSET_PATH)
options = vision.HandLandmarkerOptions(
    base_options=base_options,
    num_hands=1,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5
)
hand_landmarker = vision.HandLandmarker.create_from_options(options)

# Load trained Random Forest model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "signspeak_model.pickle")
model = None
model_classes = []

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        data = pickle.load(f)
    model = data["model"]
    model_classes = data["classes"]
    print(f"Model loaded: {len(model_classes)} classes — {model_classes}")

def detect_hand_landmarks(image_np):
    """Detect hand landmarks using MediaPipe and return raw landmarks"""
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)

    # Create MediaPipe Image object
    mp_image = mp_Image(image_format=ImageFormat.SRGB, data=image_rgb)

    # Process image
    results = hand_landmarker.detect(mp_image)

    if not results.hand_landmarks:
        return None

    # Get first hand landmarks
    hand_landmarks = results.hand_landmarks[0]

    # Extract coordinates
    landmarks = []
    for landmark in hand_landmarks:
        landmarks.append([landmark.x, landmark.y, landmark.z])

    return np.array(landmarks)


def normalize_landmarks(landmarks):
    """
    Normalize landmarks to be position-invariant.
    Takes raw (21, 3) landmarks, returns flattened (42,) array of normalized x, y.
    This matches the format used during training by create_dataset.py.
    """
    x_coords = landmarks[:, 0]
    y_coords = landmarks[:, 1]

    min_x, min_y = x_coords.min(), y_coords.min()
    range_x = x_coords.max() - min_x or 1
    range_y = y_coords.max() - min_y or 1

    normalized = []
    for lm in landmarks:
        normalized.append((lm[0] - min_x) / range_x)
        normalized.append((lm[1] - min_y) / range_y)

    return np.array(normalized)


def classify_sign(landmarks):
    """Classify sign using trained Random Forest model"""
    if model is None:
        return None, 0.0

    # Normalize landmarks to match training format (42 features: 21 points × 2 coords)
    normalized = normalize_landmarks(landmarks)
    features = normalized.reshape(1, -1)

    # Predict
    prediction = model.predict(features)
    probabilities = model.predict_proba(features)

    predicted_class = prediction[0]
    confidence = np.max(probabilities)

    return predicted_class, confidence


def format_landmarks_for_prompt(landmarks):
    """Format hand landmarks into readable text for AI prompt"""
    # MediaPipe hand landmarks: 21 points (0=wrist, 1-4=thumb, 5-8=index, 9-12=middle, 13-16=ring, 17-20=pinky)
    # landmarks is a (21, 3) numpy array with [x, y, z] coordinates
    
    finger_tips = {
        "Thumb": 4,
        "Index": 8,
        "Middle": 12,
        "Ring": 16,
        "Pinky": 20
    }
    
    landmark_text = []
    for finger_name, tip_idx in finger_tips.items():
        tip = landmarks[tip_idx]
        landmark_text.append(f"{finger_name}: ({tip[0]:.2f}, {tip[1]:.2f})")
    
    return "; ".join(landmark_text)


@app.post("/detect-hand")
async def detect(file: UploadFile = File(...)):
    """
    Detect ASL hand sign from uploaded image

    Returns:
        - success: bool - Whether detection was successful
        - sign: str - Detected ASL letter (e.g., "ASL_A", "ASL_B")
        - confidence: float - Confidence score (0.0 to 1.0)
        - error: str (optional) - Error message if detection failed
    """
    try:
        # Read uploaded file
        contents = await file.read()

        print(f"Received file: {file.filename}, size: {len(contents)} bytes, content_type: {file.content_type}")

        if len(contents) == 0:
            return {
                "success": False,
                "sign": "",
                "confidence": 0.0,
                "error": "Empty file received"
            }

        # Try OpenCV first
        nparr = np.frombuffer(contents, np.uint8)
        image_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image_np is None:
            # Fallback to PIL
            try:
                pil_image = Image.open(io.BytesIO(contents))
                image_np = np.array(pil_image)
                # Convert RGB to BGR for OpenCV
                if len(image_np.shape) == 3 and image_np.shape[2] == 3:
                    image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
                print(f"Image loaded via PIL: shape {image_np.shape}")
            except Exception as e:
                return {
                    "success": False,
                    "sign": "",
                    "confidence": 0.0,
                    "error": f"Failed to decode image: {str(e)}"
                }
        else:
            print(f"Image loaded via OpenCV: shape {image_np.shape}")

        # Detect hand landmarks
        landmarks = detect_hand_landmarks(image_np)

        if landmarks is None:
            return {
                "success": False,
                "sign": "",
                "confidence": 0.0,
                "error": "No hand detected"
            }

        # Classify using trained model
        sign, confidence = classify_sign(landmarks)

        if not sign:
            return {
                "success": False,
                "sign": "UNKNOWN",
                "confidence": 0.0,
                "error": "Model not loaded — run train_model.py first"
            }

        # Format landmarks for frontend AI verification
        landmarks_text = format_landmarks_for_prompt(landmarks)

        return {
            "success": True,
            "sign": f"ASL_{sign}",
            "confidence": round(confidence, 2),
            "landmarks": landmarks_text  # For Supabase Edge Function
        }

    except Exception as e:
        return {
            "success": False,
            "sign": "",
            "confidence": 0.0,
            "error": str(e)
        }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "num_classes": len(model_classes),
        "classes": model_classes,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)