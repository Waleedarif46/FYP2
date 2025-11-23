"""
Feature extraction module for ASL sign language recognition.
Uses MediaPipe to detect hand landmarks and extract coordinates as features.
"""

import cv2
import numpy as np
import mediapipe as mp
import logging
from typing import Tuple, Optional, Dict, List

# Set up logging
logger = logging.getLogger(__name__)

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles


def get_hand_bounding_box(hand_landmarks, image_width: int, image_height: int) -> float:
    """
    Calculate the area of the bounding box for a hand.
    Used to determine which hand is largest when multiple hands are detected.
    
    Args:
        hand_landmarks: MediaPipe hand landmarks
        image_width: Width of the image
        image_height: Height of the image
        
    Returns:
        Area of the bounding box in pixels
    """
    x_coords = []
    y_coords = []
    
    for landmark in hand_landmarks.landmark:
        x_coords.append(landmark.x * image_width)
        y_coords.append(landmark.y * image_height)
    
    x_min, x_max = min(x_coords), max(x_coords)
    y_min, y_max = min(y_coords), max(y_coords)
    
    width = x_max - x_min
    height = y_max - y_min
    area = width * height
    
    return area


def extract_hand_landmarks(image: np.ndarray) -> Tuple[Optional[List[float]], Optional[Dict[str, str]]]:
    """
    Extract hand landmarks from an image using MediaPipe.
    Matches the preprocessing done during model training.
    
    Args:
        image: Input image as numpy array (BGR format from OpenCV)
        
    Returns:
        Tuple of (features, error_info)
        - If successful: (list of 42 features [x1,y1,x2,y2,...], None)
        - If no hand: (None, {"status": "no_hand", "message": "..."})
        - If error: (None, {"status": "error", "message": "..."})
    """
    try:
        # Validate input
        if image is None or image.size == 0:
            logger.error("Input image is None or empty")
            return None, {
                "status": "error",
                "message": "Input image is empty or corrupted"
            }
        
        # Log image details
        logger.info(f"Input image shape: {image.shape}, dtype: {image.dtype}")
        
        # Convert BGR to RGB (MediaPipe expects RGB)
        if len(image.shape) == 2:  # Grayscale
            logger.info("Converting grayscale image to RGB")
            image_rgb = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:  # RGBA
            logger.info("Converting RGBA image to RGB")
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
        elif image.shape[2] == 3:  # BGR
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        else:
            logger.error(f"Unexpected image format: {image.shape}")
            return None, {
                "status": "error",
                "message": f"Unexpected image format: {image.shape}"
            }
        


        #Comments
        # Initialize MediaPipe Hands
        # static_image_mode=True for better accuracy on single images
        # min_detection_confidence=0.5 for better real-world image detection
        with mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=2,  # Detect up to 2 hands, we'll pick the largest
            min_detection_confidence=0.5  # Lowered from 0.9 for production use
        ) as hands:
            
            # Process the image
            results = hands.process(image_rgb)
            
            # Check if any hands were detected
            if not results.multi_hand_landmarks:
                logger.warning("No hand landmarks detected in the image")
                return None, {
                    "status": "no_hand",
                    "message": "No hand detected in the frame. Please show your hand clearly."
                }
            
            # If multiple hands detected, select the largest one
            selected_hand = None
            if len(results.multi_hand_landmarks) > 1:
                logger.info(f"Multiple hands detected ({len(results.multi_hand_landmarks)}), selecting largest")
                h, w, _ = image_rgb.shape
                
                largest_area = 0
                for hand_landmarks in results.multi_hand_landmarks:
                    area = get_hand_bounding_box(hand_landmarks, w, h)
                    if area > largest_area:
                        largest_area = area
                        selected_hand = hand_landmarks
                
                logger.info(f"Selected hand with bounding box area: {largest_area:.2f} pixels")
            else:
                selected_hand = results.multi_hand_landmarks[0]
                logger.info("Single hand detected")
            
            # Extract features: 21 landmarks × 2 coordinates (x, y) = 42 features
            # This matches the exact preprocessing done during training
            features = []
            for landmark in selected_hand.landmark:
                features.append(landmark.x)
                features.append(landmark.y)
            
            logger.info(f"Extracted {len(features)} features from hand landmarks")
            
            # Verify we have exactly 42 features
            if len(features) != 42:
                logger.error(f"Expected 42 features, got {len(features)}")
                return None, {
                    "status": "error",
                    "message": f"Feature extraction error: expected 42 features, got {len(features)}"
                }
            
            return features, None
            
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error during feature extraction: {error_message}")
        import traceback
        logger.error(traceback.format_exc())
        return None, {
            "status": "error",
            "message": f"Feature extraction failed: {error_message}"
        }


def extract_features_from_base64(image_data_base64: str) -> Tuple[Optional[List[float]], Optional[Dict[str, str]]]:
    """
    Convenience function to extract features from base64 encoded image.
    
    Args:
        image_data_base64: Base64 encoded image string (with or without data URI prefix)
        
    Returns:
        Tuple of (features, error_info) - same as extract_hand_landmarks()
    """
    import base64
    
    try:
        # Remove data URI prefix if present
        if image_data_base64.startswith('data:image'):
            image_data_base64 = image_data_base64.split(',')[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_data_base64)
        
        # Convert to numpy array
        image_array = np.frombuffer(image_bytes, np.uint8)
        
        # Decode image
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        if image is None or image.size == 0:
            logger.error("Failed to decode base64 image")
            return None, {
                "status": "error",
                "message": "Failed to decode base64 image"
            }
        
        # Extract features
        return extract_hand_landmarks(image)
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error processing base64 image: {error_message}")
        return None, {
            "status": "error",
            "message": f"Base64 decoding failed: {error_message}"
        }

