"""
Utility functions and configurations for gesture recognition
"""
import numpy as np

# Gesture shape specifications
GESTURE_SPECS = {
    # Non-ASL gestures
    "THUMBS_UP": {
        "name": "Thumbs Up",
        "checks": [
            {"type": "extended", "finger": "thumb", "weight": 2.0},
            {"type": "curled", "finger": "index", "weight": 1.5},
            {"type": "curled", "finger": "middle", "weight": 1.5},
            {"type": "curled", "finger": "ring", "weight": 1.0},
            {"type": "curled", "finger": "pinky", "weight": 1.0}
        ],
        "min_score": 0.75
    },
    "THUMBS_DOWN": {
        "name": "Thumbs Down",
        "checks": [
            {"type": "extended_down", "finger": "thumb", "weight": 2.0},
            {"type": "curled", "finger": "index", "weight": 1.5},
            {"type": "curled", "finger": "middle", "weight": 1.5},
            {"type": "curled", "finger": "ring", "weight": 1.0},
            {"type": "curled", "finger": "pinky", "weight": 1.0}
        ],
        "min_score": 0.75
    },
    
    # ASL Alphabet - Phase 1: Simple letters
    "ASL_A": {
        "name": "ASL Letter A",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_side", "finger": "thumb", "weight": 2.0}  # Thumb alongside, not across
        ],
        "min_score": 0.80
    },
    "ASL_S": {
        "name": "ASL Letter S",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 2.0}  # Thumb across fingers
        ],
        "min_score": 0.80
    },
    "ASL_B": {
        "name": "ASL Letter B",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "extended", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "index", "weight": 1.5},  # Fingers together
            {"type": "thumb_across", "finger": "thumb", "weight": 2.0}  # Thumb across palm
        ],
        "min_score": 0.80
    },
    "ASL_I": {
        "name": "ASL Letter I",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 3.0},  # Only pinky up
            {"type": "thumb_across", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.80
    },
    "ASL_Y": {
        "name": "ASL Letter Y",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "thumb", "weight": 2.0},  # Thumb and pinky out
            {"type": "spread", "finger": "pinky", "weight": 1.5}  # Spread apart
        ],
        "min_score": 0.80
    },
    "ASL_L": {
        "name": "ASL Letter L",
        "checks": [
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "index", "weight": 2.5},
            {"type": "extended", "finger": "thumb", "weight": 2.5},
            {"type": "perpendicular", "finger": "thumb", "weight": 2.0}  # 90° angle
        ],
        "min_score": 0.80
    }
}

# Landmark indices for each finger
FINGER_LANDMARKS = {
    "thumb": {"tip": 4, "ip": 3, "mcp": 2},
    "index": {"tip": 8, "pip": 7, "mcp": 5},
    "middle": {"tip": 12, "pip": 11, "mcp": 9},
    "ring": {"tip": 16, "pip": 15, "mcp": 13},
    "pinky": {"tip": 20, "pip": 19, "mcp": 17},
    "wrist": 0
}

# Helper functions
def calculate_distance(point1, point2):
    """Calculate Euclidean distance between two points"""
    return np.linalg.norm(point1 - point2)

def are_fingers_together(landmarks, finger1, finger2, threshold=0.05):
    """Check if two fingers are held together (tips close)"""
    tip1 = landmarks[FINGER_LANDMARKS[finger1]["tip"]]
    tip2 = landmarks[FINGER_LANDMARKS[finger2]["tip"]]
    distance = calculate_distance(tip1, tip2)
    return distance < threshold

def are_fingers_spread(landmarks, finger1, finger2, threshold=0.08):
    """Check if two fingers are spread apart"""
    tip1 = landmarks[FINGER_LANDMARKS[finger1]["tip"]]
    tip2 = landmarks[FINGER_LANDMARKS[finger2]["tip"]]
    distance = calculate_distance(tip1, tip2)
    return distance > threshold

def is_thumb_perpendicular(landmarks):
    """Check if thumb is perpendicular to index finger (L shape)"""
    thumb_tip = landmarks[FINGER_LANDMARKS["thumb"]["tip"]]
    thumb_mcp = landmarks[FINGER_LANDMARKS["thumb"]["mcp"]]
    index_tip = landmarks[FINGER_LANDMARKS["index"]["tip"]]
    index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
    
    # Vector from thumb mcp to tip
    thumb_vector = thumb_tip - thumb_mcp
    # Vector from index mcp to tip
    index_vector = index_tip - index_mcp
    
    # Calculate angle between vectors
    cos_angle = np.dot(thumb_vector, index_vector) / (
        np.linalg.norm(thumb_vector) * np.linalg.norm(index_vector) + 1e-6
    )
    angle = np.arccos(np.clip(cos_angle, -1.0, 1.0))
    angle_degrees = np.degrees(angle)
    
    # Check if angle is close to 90 degrees (70-110 range)
    return 70 <= angle_degrees <= 110

def check_finger_state(landmarks, finger, check_type):
    """
    Check if a finger meets a specific condition
    Returns a score between 0.0 and 1.0
    """
    finger_lm = FINGER_LANDMARKS[finger]
    wrist = landmarks[FINGER_LANDMARKS["wrist"]]
    
    tip = landmarks[finger_lm["tip"]]
    
    if check_type == "extended":
        # Finger is extended if tip is far from wrist
        if finger == "thumb":
            ip = landmarks[finger_lm["ip"]]
            mcp = landmarks[finger_lm["mcp"]]
            index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
            
            # Check if thumb is extended (tip farther than ip from wrist)
            tip_dist = np.linalg.norm(tip - wrist)
            ip_dist = np.linalg.norm(ip - wrist)
            
            # For thumbs up, thumb must be:
            # 1. Extended significantly (not just alongside)
            # 2. Pointing upward (tip Y < mcp Y)
            # 3. Far from the fist (not touching index finger)
            is_extended = tip_dist > ip_dist * 1.3  # Stricter extension requirement
            is_pointing_up = tip[1] < mcp[1] - 0.05  # Significantly above mcp
            is_away_from_fist = calculate_distance(tip, index_mcp) > 0.10  # Far from index
            
            return 1.0 if (is_extended and is_pointing_up and is_away_from_fist) else 0.0
        else:
            mcp = landmarks[finger_lm["mcp"]]
            pip = landmarks[finger_lm["pip"]]
            tip_dist = np.linalg.norm(tip - wrist)
            pip_dist = np.linalg.norm(pip - wrist)
            mcp_dist = np.linalg.norm(mcp - wrist)
            # Finger extended if tip is farther than pip and pip is farther than mcp
            if tip_dist > pip_dist * 1.1 and pip_dist > mcp_dist * 0.9:
                return 1.0
            return max(0.0, min(1.0, (tip_dist - pip_dist) / (mcp_dist * 0.3)))
    
    elif check_type == "extended_down":
        # Thumb extended downward
        if finger == "thumb":
            ip = landmarks[finger_lm["ip"]]
            mcp = landmarks[finger_lm["mcp"]]
            index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
            
            # Check if thumb is extended (tip farther than ip from wrist)
            tip_dist = np.linalg.norm(tip - wrist)
            ip_dist = np.linalg.norm(ip - wrist)
            
            # For thumbs down, thumb must be:
            # 1. Extended significantly (not just alongside)
            # 2. Pointing downward (tip Y > mcp Y)
            # 3. Far from the fist (not touching index finger)
            is_extended = tip_dist > ip_dist * 1.3  # Stricter extension requirement
            is_pointing_down = tip[1] > mcp[1] + 0.05  # Significantly below mcp
            is_away_from_fist = calculate_distance(tip, index_mcp) > 0.10  # Far from index
            
            return 1.0 if (is_extended and is_pointing_down and is_away_from_fist) else 0.0
        return 0.0
    
    elif check_type == "curled":
        # Finger is curled if tip is close to palm/wrist
        if finger == "thumb":
            mcp = landmarks[finger_lm["mcp"]]
            tip_dist = np.linalg.norm(tip - wrist)
            mcp_dist = np.linalg.norm(mcp - wrist)
            return 1.0 if tip_dist < mcp_dist * 1.4 else 0.0
        else:
            mcp = landmarks[finger_lm["mcp"]]
            pip = landmarks[finger_lm["pip"]]
            tip_dist = np.linalg.norm(tip - wrist)
            mcp_dist = np.linalg.norm(mcp - wrist)
            # Curled if tip is closer to wrist than expected
            if tip_dist < mcp_dist * 1.3:
                return 1.0
            return max(0.0, 1.0 - (tip_dist - mcp_dist * 1.3) / (mcp_dist * 0.5))
    
    elif check_type == "thumb_side":
        # Thumb alongside index finger (ASL A)
        if finger == "thumb":
            index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
            index_pip = landmarks[FINGER_LANDMARKS["index"]["pip"]]
            
            # Thumb tip should be near the side of index finger
            # Check X distance (horizontal) - thumb should be to the side
            tip_to_index_mcp = calculate_distance(tip, index_mcp)
            tip_to_index_pip = calculate_distance(tip, index_pip)
            
            # Thumb should be close to index finger side
            is_alongside = min(tip_to_index_mcp, tip_to_index_pip) < 0.08
            
            # Thumb should not be across the palm (Y position check)
            mcp = landmarks[finger_lm["mcp"]]
            is_not_across = abs(tip[0] - mcp[0]) < 0.15  # Not too far horizontally
            
            return 1.0 if (is_alongside and is_not_across) else 0.0
        return 0.0
    
    elif check_type == "thumb_across":
        # Thumb across fingers (ASL S, B, I)
        if finger == "thumb":
            index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
            middle_mcp = landmarks[FINGER_LANDMARKS["middle"]["mcp"]]
            
            # Thumb should be across the palm/fingers
            # Check if thumb tip is between index and middle knuckles
            tip_to_index = calculate_distance(tip, index_mcp)
            tip_to_middle = calculate_distance(tip, middle_mcp)
            
            # Thumb should be close to the front of the hand
            is_across = (tip_to_index < 0.12 or tip_to_middle < 0.12)
            
            return 1.0 if is_across else 0.0
        return 0.0
    
    elif check_type == "together":
        # Fingers held together (ASL B)
        # Check if this finger is close to adjacent fingers
        if finger == "index":
            return 1.0 if are_fingers_together(landmarks, "index", "middle") else 0.0
        elif finger == "middle":
            return 1.0 if are_fingers_together(landmarks, "middle", "ring") else 0.0
        elif finger == "ring":
            return 1.0 if are_fingers_together(landmarks, "ring", "pinky") else 0.0
        return 1.0  # Default for other fingers
    
    elif check_type == "spread":
        # Fingers spread apart (ASL Y)
        if finger == "pinky":
            # Check if pinky is spread from thumb
            thumb_tip = landmarks[FINGER_LANDMARKS["thumb"]["tip"]]
            pinky_tip = landmarks[FINGER_LANDMARKS["pinky"]["tip"]]
            distance = calculate_distance(thumb_tip, pinky_tip)
            return 1.0 if distance > 0.15 else 0.0
        return 1.0
    
    elif check_type == "perpendicular":
        # Thumb perpendicular to index (ASL L)
        if finger == "thumb":
            return 1.0 if is_thumb_perpendicular(landmarks) else 0.0
        return 0.0
    
    return 0.0

def match_gesture(landmarks):
    """
    Match landmarks against all gesture specifications
    Returns the best matching gesture and its confidence score
    """
    best_match = None
    best_score = 0.0
    
    for gesture_id, spec in GESTURE_SPECS.items():
        total_weight = sum(check["weight"] for check in spec["checks"])
        weighted_score = 0.0
        
        # Calculate score for each check
        for check in spec["checks"]:
            finger_score = check_finger_state(landmarks, check["finger"], check["type"])
            weighted_score += finger_score * check["weight"]
        
        # Normalize score
        normalized_score = weighted_score / total_weight
        
        # Only consider if above minimum threshold
        if normalized_score >= spec["min_score"] and normalized_score > best_score:
            best_score = normalized_score
            best_match = gesture_id
    
    return best_match, best_score
