import mediapipe as mp
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
import numpy as np
import cv2

app = FastAPI()

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

def is_thumbs_up(landmarks):
    """
    Detect thumbs up gesture
    Thumb extended, other fingers curled
    """
    # Landmark indices
    thumb_tip = landmarks[4]
    thumb_ip = landmarks[3]
    index_tip = landmarks[8]
    index_mcp = landmarks[5]
    middle_tip = landmarks[12]
    middle_mcp = landmarks[9]
    ring_tip = landmarks[16]
    pinky_tip = landmarks[20]
    wrist = landmarks[0]
    
    # Calculate distances
    thumb_length = np.linalg.norm(thumb_tip - thumb_ip)
    index_length = np.linalg.norm(index_tip - index_mcp)
    
    # Check if thumb is extended (tip far from palm)
    thumb_extended = np.linalg.norm(thumb_tip - wrist) > np.linalg.norm(thumb_ip - wrist)
    
    # Check if fingers are curled (tips close to palm)
    index_curled = np.linalg.norm(index_tip - wrist) < np.linalg.norm(index_mcp - wrist) * 1.3
    middle_curled = np.linalg.norm(middle_tip - wrist) < np.linalg.norm(middle_mcp - wrist) * 1.3
    ring_curled = np.linalg.norm(ring_tip - wrist) < 0.15
    pinky_curled = np.linalg.norm(pinky_tip - wrist) < 0.15
    
    # Thumbs up if thumb extended and fingers curled
    if thumb_extended and index_curled and middle_curled:
        confidence = 0.85 if (ring_curled and pinky_curled) else 0.75
        return True, confidence
    
    return False, 0.0

@app.post("/detect-hand")
async def detect(file: UploadFile = File(...)):
    try:
        # Read uploaded file
        contents = await file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(contents))
        
        # Convert to NumPy array
        image_np = np.array(pil_image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_np.shape) == 3 and image_np.shape[2] == 3:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        
        # Detect hand landmarks
        landmarks = detect_hand_landmarks(image_np)
        
        if landmarks is None:
            return {
                "success": False,
                "sign": "",
                "confidence": 0.0,
                "error": "No hand detected"
            }
        
        # Classify gesture
        is_thumbs, confidence = is_thumbs_up(landmarks)
        
        if is_thumbs:
            return {
                "success": True,
                "sign": "THUMBS_UP",
                "confidence": confidence
            }
        else:
            return {
                "success": False,
                "sign": "UNKNOWN",
                "confidence": 0.0
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
