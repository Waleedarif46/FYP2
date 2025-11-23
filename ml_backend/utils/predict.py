"""
Model prediction module for ASL sign language recognition.
Loads the trained RandomForestClassifier and makes predictions on hand landmark features.
"""

import pickle
import numpy as np
import os
import logging
from pathlib import Path
import threading
from typing import Tuple, List

# Set up logging
logger = logging.getLogger(__name__)

# Class labels - 26 letters + Space + nothing = 28 classes
# Make sure this matches your training data folder names exactly!
CLASSES = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z", "Space", "nothing"
]

# Confidence threshold - predictions below this will be rejected
CONFIDENCE_THRESHOLD = 0.5

# Global model cache
_model = None
_model_lock = threading.Lock()


def _load_model():
    """
    Load the trained RandomForestClassifier model from pickle file.
    Uses thread-safe singleton pattern to load model only once.
    
    Returns:
        Loaded RandomForestClassifier model
        
    Raises:
        FileNotFoundError: If model file not found
        Exception: If model loading fails
    """
    global _model
    
    logger.info(f"[_load_model] Called in PID: {os.getpid()}, _model is {'set' if _model is not None else 'None'}")
    
    # Return cached model if already loaded
    if _model is not None:
        return _model
    
    # Thread-safe loading
    with _model_lock:
        # Double-check after acquiring lock
        if _model is not None:
            return _model
        
        logger.info("Loading RandomForest model for the first time...")
        
        # Get model path from environment variable
        model_path_env = os.getenv('MODEL_PATH')
        
        if not model_path_env:
            raise FileNotFoundError("MODEL_PATH environment variable is not set")
        
        # Resolve the model path
        prospective_model_path = Path(model_path_env).resolve()
        
        if not prospective_model_path.exists():
            raise FileNotFoundError(f"Model file not found at {prospective_model_path}")
        
        logger.info(f"Loading model from: {prospective_model_path}")
        
        try:
            # Load the pickle file
            with open(prospective_model_path, 'rb') as f:
                model_dict = pickle.load(f)
            
            # Extract the model from the dictionary
            # The pickle file contains: {'model': RandomForestClassifier}
            if 'model' not in model_dict:
                raise ValueError("Model dictionary does not contain 'model' key")
            
            _model = model_dict['model']
            
            # Verify it's a valid sklearn model
            if not hasattr(_model, 'predict') or not hasattr(_model, 'predict_proba'):
                raise ValueError("Loaded object is not a valid sklearn classifier")
            
            logger.info("✅ RandomForest model loaded and cached successfully!")
            logger.info(f"Model type: {type(_model).__name__}")
            
            # Log model information if available
            if hasattr(_model, 'n_estimators'):
                logger.info(f"Number of trees: {_model.n_estimators}")
            if hasattr(_model, 'n_features_in_'):
                logger.info(f"Expected features: {_model.n_features_in_}")
            
            return _model
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise


def predict_sign(features: List[float]) -> Tuple[str, float]:
    """
    Predict ASL sign from hand landmark features.
    
    Args:
        features: List of 42 float values (21 landmarks × 2 coordinates)
        
    Returns:
        Tuple of (predicted_sign, confidence)
        - predicted_sign: The predicted class label (A-Z, Space, nothing)
        - confidence: Probability score between 0 and 1
        
    Raises:
        ValueError: If features are invalid
        Exception: If prediction fails
    """
    try:
        logger.info(f"[predict_sign] Called in PID: {os.getpid()}")
        
        # Ensure model is loaded
        model = _load_model()
        
        if model is None:
            logger.error("Model is None after loading attempt")
            raise ValueError("Failed to load model - model is None")
        
        # Validate input features
        if not isinstance(features, (list, np.ndarray)):
            raise ValueError(f"Features must be a list or numpy array, got {type(features)}")
        
        if len(features) != 42:
            raise ValueError(f"Expected 42 features, got {len(features)}")
        
        # Convert to numpy array and reshape for sklearn
        # sklearn expects shape (n_samples, n_features)
        features_array = np.asarray(features).reshape(1, -1)
        
        logger.info(f"Feature array shape: {features_array.shape}")
        logger.info(f"Feature range: [{features_array.min():.3f}, {features_array.max():.3f}]")
        
        # Get prediction probabilities
        # predict_proba returns array of shape (n_samples, n_classes)
        probabilities = model.predict_proba(features_array)[0]
        
        # Get the class with highest probability
        predicted_class_idx = np.argmax(probabilities)
        confidence = float(probabilities[predicted_class_idx])
        
        logger.info(f"Raw prediction - Class index: {predicted_class_idx}, Confidence: {confidence:.4f}")
        
        # Check confidence threshold
        if confidence < CONFIDENCE_THRESHOLD:
            logger.warning(f"Prediction confidence {confidence:.4f} below threshold {CONFIDENCE_THRESHOLD}")
            predicted_sign = "uncertain"
            logger.info(f"Returning 'uncertain' due to low confidence")
        else:
            # Map index to class label
            if predicted_class_idx < len(CLASSES):
                predicted_sign = CLASSES[predicted_class_idx]
            else:
                predicted_sign = f"Unknown_{predicted_class_idx}"
                logger.warning(f"Predicted class index {predicted_class_idx} out of range (max: {len(CLASSES)-1})")
        
        logger.info(f"✅ Final Prediction: {predicted_sign}, Confidence: {confidence:.4f}")
        
        # Log top 3 predictions for debugging
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        logger.info("Top 3 predictions:")
        for idx in top_3_indices:
            if idx < len(CLASSES):
                logger.info(f"  {CLASSES[idx]}: {probabilities[idx]:.4f}")
        
        return predicted_sign, confidence
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise


def get_model_info() -> dict:
    """
    Get information about the loaded model.
    Useful for debugging and verification.
    
    Returns:
        Dictionary with model information
    """
    try:
        model = _load_model()
        
        info = {
            "model_type": type(model).__name__,
            "num_classes": len(CLASSES),
            "classes": CLASSES,
            "confidence_threshold": CONFIDENCE_THRESHOLD,
            "expected_features": 42
        }
        
        # Add model-specific attributes if available
        if hasattr(model, 'n_estimators'):
            info["n_estimators"] = model.n_estimators
        if hasattr(model, 'n_features_in_'):
            info["n_features_in"] = model.n_features_in_
        if hasattr(model, 'max_depth'):
            info["max_depth"] = model.max_depth
        
        return info
        
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return {"error": str(e)}
