import mediapipe as mp
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import numpy as np
import cv2
from utils import match_gesture

app = FastAPI()

# Add CORS middleware to allow requests from React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5
)

def detect_hand_landmarks(image_np):
    """Detect hand landmarks using MediaPipe"""
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
    
    # Process image
    results = hands.process(image_rgb)
    
    if not results.multi_hand_landmarks:
        return None
    
    # Get first hand landmarks
    hand_landmarks = results.multi_hand_landmarks[0]
    
    # Extract coordinates
    landmarks = []
    for landmark in hand_landmarks.landmark:
        landmarks.append([landmark.x, landmark.y, landmark.z])
    
    return np.array(landmarks)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok", 
        "message": "ASL Recognition API is running",
        "supported_letters": "A-Y (except J, Z)"
    }


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
        
        # Match gesture against all specifications
        gesture_id, confidence = match_gesture(landmarks)
        
        if gesture_id:
            return {
                "success": True,
                "sign": gesture_id,
                "confidence": round(confidence, 2)
            }
        else:
            return {
                "success": False,
                "sign": "UNKNOWN",
                "confidence": 0.0,
                "error": "No matching ASL sign detected"
            }
    
    except Exception as e:
        return {
            "success": False,
            "sign": "",
            "confidence": 0.0,
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
