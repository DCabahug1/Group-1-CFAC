"""
Utility functions and configurations for ASL gesture recognition
"""
import numpy as np

# Gesture shape specifications for common ASL letters
GESTURE_SPECS = {
    "ASL_A": {
        "name": "ASL Letter A",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_side", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_B": {
        "name": "ASL Letter B",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "extended", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "index", "weight": 1.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_C": {
        "name": "ASL Letter C",
        "checks": [
            {"type": "curved", "finger": "index", "weight": 2.0},
            {"type": "curved", "finger": "middle", "weight": 2.0},
            {"type": "curved", "finger": "ring", "weight": 2.0},
            {"type": "curved", "finger": "pinky", "weight": 2.0},
            {"type": "curved", "finger": "thumb", "weight": 1.5},
            {"type": "c_shape", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.65
    },
    "ASL_I": {
        "name": "ASL Letter I",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 3.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_L": {
        "name": "ASL Letter L",
        "checks": [
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "index", "weight": 2.5},
            {"type": "extended", "finger": "thumb", "weight": 2.5},
            {"type": "perpendicular", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_O": {
        "name": "ASL Letter O",
        "checks": [
            {"type": "curved", "finger": "index", "weight": 2.0},
            {"type": "curved", "finger": "middle", "weight": 2.0},
            {"type": "curved", "finger": "ring", "weight": 2.0},
            {"type": "curved", "finger": "pinky", "weight": 2.0},
            {"type": "o_shape", "finger": "thumb", "weight": 2.5}
        ],
        "min_score": 0.75
    },
    "ASL_S": {
        "name": "ASL Letter S",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_Y": {
        "name": "ASL Letter Y",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "thumb", "weight": 2.0},
            {"type": "spread", "finger": "pinky", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_D": {
        "name": "ASL Letter D",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.5},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "middle", "weight": 1.0},
            {"type": "extended", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_E": {
        "name": "ASL Letter E",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "curled", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_F": {
        "name": "ASL Letter F",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "extended", "finger": "ring", "weight": 2.0},
            {"type": "extended", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "middle", "weight": 1.0},
            {"type": "extended", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_G": {
        "name": "ASL Letter G",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.5},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "thumb", "weight": 2.5},
            {"type": "perpendicular", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_H": {
        "name": "ASL Letter H",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "index", "weight": 1.5},
            {"type": "extended", "finger": "thumb", "weight": 1.0}
        ],
        "min_score": 0.75
    },
    "ASL_K": {
        "name": "ASL Letter K",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "spread", "finger": "index", "weight": 1.5},
            {"type": "extended", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_M": {
        "name": "ASL Letter M",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.70
    },
    "ASL_N": {
        "name": "ASL Letter N",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.70
    },
    "ASL_P": {
        "name": "ASL Letter P",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "thumb", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_Q": {
        "name": "ASL Letter Q",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.5},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "extended", "finger": "thumb", "weight": 2.5}
        ],
        "min_score": 0.75
    },
    "ASL_R": {
        "name": "ASL Letter R",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "index", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_T": {
        "name": "ASL Letter T",
        "checks": [
            {"type": "curled", "finger": "index", "weight": 2.0},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "thumb_across", "finger": "thumb", "weight": 2.5}
        ],
        "min_score": 0.75
    },
    "ASL_U": {
        "name": "ASL Letter U",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "together", "finger": "index", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_V": {
        "name": "ASL Letter V",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "spread", "finger": "index", "weight": 2.0}
        ],
        "min_score": 0.75
    },
    "ASL_W": {
        "name": "ASL Letter W",
        "checks": [
            {"type": "extended", "finger": "index", "weight": 2.0},
            {"type": "extended", "finger": "middle", "weight": 2.0},
            {"type": "extended", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "spread", "finger": "middle", "weight": 1.5}
        ],
        "min_score": 0.75
    },
    "ASL_X": {
        "name": "ASL Letter X",
        "checks": [
            {"type": "curved", "finger": "index", "weight": 2.5},
            {"type": "curled", "finger": "middle", "weight": 2.0},
            {"type": "curled", "finger": "ring", "weight": 2.0},
            {"type": "curled", "finger": "pinky", "weight": 2.0},
            {"type": "curled", "finger": "thumb", "weight": 1.5}
        ],
        "min_score": 0.75
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

def are_fingers_together(landmarks, finger1, finger2, threshold=0.08):
    """Check if two fingers are held together (tips close)"""
    tip1 = landmarks[FINGER_LANDMARKS[finger1]["tip"]]
    tip2 = landmarks[FINGER_LANDMARKS[finger2]["tip"]]
    distance = calculate_distance(tip1, tip2)
    return distance < threshold

def are_fingers_spread(landmarks, finger1, finger2, threshold=0.15):
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
            tip_dist = np.linalg.norm(tip - wrist)
            ip_dist = np.linalg.norm(ip - wrist)
            is_extended = tip_dist > ip_dist * 1.2
            return 1.0 if is_extended else 0.0
        else:
            mcp = landmarks[finger_lm["mcp"]]
            pip = landmarks[finger_lm["pip"]]
            tip_dist = np.linalg.norm(tip - wrist)
            pip_dist = np.linalg.norm(pip - wrist)
            mcp_dist = np.linalg.norm(mcp - wrist)
            if tip_dist > pip_dist * 1.1 and pip_dist > mcp_dist * 0.9:
                return 1.0
            return max(0.0, min(1.0, (tip_dist - pip_dist) / (mcp_dist * 0.3)))
    
    elif check_type == "curled":
        # Finger is curled if tip is close to palm/wrist
        if finger == "thumb":
            mcp = landmarks[finger_lm["mcp"]]
            tip_dist = np.linalg.norm(tip - wrist)
            mcp_dist = np.linalg.norm(mcp - wrist)
            return 1.0 if tip_dist < mcp_dist * 1.4 else 0.0
        else:
            mcp = landmarks[finger_lm["mcp"]]
            tip_dist = np.linalg.norm(tip - wrist)
            mcp_dist = np.linalg.norm(mcp - wrist)
            if tip_dist < mcp_dist * 1.3:
                return 1.0
            return max(0.0, 1.0 - (tip_dist - mcp_dist * 1.3) / (mcp_dist * 0.5))
    
    elif check_type == "curved":
        # Finger is curved (partially extended, like C or O shape)
        mcp = landmarks[finger_lm["mcp"]]
        tip_dist = np.linalg.norm(tip - wrist)
        mcp_dist = np.linalg.norm(mcp - wrist)
        
        # Curved is between curled and extended (more lenient for C)
        if mcp_dist > 0:
            ratio = tip_dist / mcp_dist
            # More lenient range for curved fingers
            is_curved = 1.1 < ratio < 2.0
        else:
            is_curved = False
        return 1.0 if is_curved else 0.0
    
    elif check_type == "thumb_side":
        # Thumb alongside index finger (ASL A)
        # Thumb rests naturally on the side - doesn't need to stick out much
        if finger == "thumb":
            mcp = landmarks[finger_lm["mcp"]]
            index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
            middle_mcp = landmarks[FINGER_LANDMARKS["middle"]["mcp"]]
            
            tip_to_index = calculate_distance(tip, index_mcp)
            tip_to_middle = calculate_distance(tip, middle_mcp)
            
            # Thumb should be near the side of the fist (very lenient)
            is_near_side = tip_to_index < 0.15 or tip_to_middle < 0.15
            
            # For ASL A: accept a wide range - just not completely tucked in
            # Accept thumb in natural resting position
            is_not_completely_tucked = tip[2] < index_mcp[2] + 0.05
            
            return 1.0 if (is_near_side and is_not_completely_tucked) else 0.0
        return 0.0
    
    elif check_type == "thumb_across":
        # Thumb across fingers (ASL S, B, I)
        # Thumb is TUCKED IN across the front of fingers
        if finger == "thumb":
            index_mcp = landmarks[FINGER_LANDMARKS["index"]["mcp"]]
            middle_mcp = landmarks[FINGER_LANDMARKS["middle"]["mcp"]]
            index_pip = landmarks[FINGER_LANDMARKS["index"]["pip"]]
            
            tip_to_index = calculate_distance(tip, index_mcp)
            tip_to_middle = calculate_distance(tip, middle_mcp)
            tip_to_index_pip = calculate_distance(tip, index_pip)
            
            # Thumb must be very close to the fingers (tucked in tight)
            is_very_close = (tip_to_index < 0.08 or tip_to_middle < 0.08 or tip_to_index_pip < 0.08)
            
            # For ASL S: thumb is LESS visible/tucked back (higher Z = further from camera)
            # Thumb is hidden/wrapped across fingers
            is_tucked = tip[2] > index_mcp[2] - 0.02
            
            return 1.0 if (is_very_close and is_tucked) else 0.0
        return 0.0
    
    elif check_type == "together":
        # Fingers held together (ASL B)
        if finger == "index":
            return 1.0 if are_fingers_together(landmarks, "index", "middle") else 0.0
        elif finger == "middle":
            return 1.0 if are_fingers_together(landmarks, "middle", "ring") else 0.0
        elif finger == "ring":
            return 1.0 if are_fingers_together(landmarks, "ring", "pinky") else 0.0
        return 1.0
    
    elif check_type == "spread":
        # Fingers spread apart (ASL Y)
        if finger == "pinky":
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
    
    elif check_type == "c_shape":
        # C shape - thumb and fingers form a C
        if finger == "thumb":
            index_tip = landmarks[FINGER_LANDMARKS["index"]["tip"]]
            distance = calculate_distance(tip, index_tip)
            # Thumb and index should be apart but not too far (more lenient)
            is_c_shape = 0.05 < distance < 0.25
            return 1.0 if is_c_shape else 0.0
        return 0.0
    
    elif check_type == "o_shape":
        # O shape - thumb touches index finger
        if finger == "thumb":
            index_tip = landmarks[FINGER_LANDMARKS["index"]["tip"]]
            distance = calculate_distance(tip, index_tip)
            # Thumb and index should be very close (touching)
            is_o_shape = distance < 0.06
            return 1.0 if is_o_shape else 0.0
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
