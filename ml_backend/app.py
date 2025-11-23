"""
Flask application for ASL sign language recognition.
Provides REST API endpoints for image-based sign language translation.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64
from dotenv import load_dotenv
from utils.feature_extraction import extract_hand_landmarks
from utils.predict import predict_sign, get_model_info
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("CLIENT_URL", "http://localhost:3000")}})

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# File size limit (2MB)
MAX_FILE_SIZE = 2 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def process_image(image: np.ndarray) -> dict:
    """
    Common processing function for both endpoints.
    Extracts features and makes prediction.
    
    Args:
        image: Input image as numpy array (BGR format)
        
    Returns:
        Dictionary with prediction results or error information
    """
    try:
        # Step 1: Extract hand landmarks (42 features)
        features, error_info = extract_hand_landmarks(image)
        
        # Handle no hand detected (not an error, just no hand in frame)
        if error_info and error_info.get("status") == "no_hand":
            logger.info("No hand detected in frame")
            return {
                "status": "no_hand",
                "message": error_info.get("message", "No hand detected"),
                "predicted_sign": None,
                "confidence": 0.0
            }
        
        # Handle actual errors
        if error_info:
            error_msg = error_info.get("message", "Feature extraction failed")
            logger.error(f"Feature extraction error: {error_msg}")
            return {
                "status": "error",
                "error": error_msg,
                "predicted_sign": None,
                "confidence": 0.0
            }
        
        # Step 2: Make prediction using RandomForest model
        logger.info("Making prediction with extracted features")
        predicted_sign, confidence = predict_sign(features)
        
        logger.info(f"Prediction successful: {predicted_sign} (confidence: {confidence:.4f})")
        
        # Return result
        return {
            "status": "success",
            "predicted_sign": predicted_sign,
            "confidence": float(confidence)
        }
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error in process_image: {error_message}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "status": "error",
            "error": f"Processing failed: {error_message}",
            "predicted_sign": None,
            "confidence": 0.0
        }


@app.route('/api/translate', methods=['POST'])
def translate():
    """
    Endpoint for image upload translation.
    Accepts either file upload or base64 encoded image.
    
    Returns:
        JSON with prediction results:
        - success: {status: "success", predicted_sign: str, confidence: float}
        - no_hand: {status: "no_hand", message: str, predicted_sign: null, confidence: 0}
        - error: {status: "error", error: str}
    """
    image = None
    
    try:
        # Priority 1: Check for direct file upload
        if 'image' in request.files:
            logger.info("Processing direct file upload")
            file = request.files['image']
            
            if file.filename == '':
                logger.error("No selected file in file upload part")
                return jsonify({"status": "error", "error": "No selected file"}), 400
            
            if not allowed_file(file.filename):
                logger.error(f"File type not allowed: {file.filename}")
                return jsonify({
                    "status": "error",
                    "error": "File type not allowed. Only png, jpg, jpeg are accepted."
                }), 400
            
            # Check file size
            file.seek(0, os.SEEK_END)
            file_length = file.tell()
            file.seek(0)
            
            if file_length > MAX_FILE_SIZE:
                logger.error(f"File size ({file_length} bytes) exceeds limit")
                return jsonify({
                    "status": "error",
                    "error": f"File size exceeds limit. Max size is {MAX_FILE_SIZE // (1024*1024)}MB."
                }), 400
            
            # Read and decode file
            image_bytes = file.read()
            image_array = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if image is None or image.size == 0:
                logger.error("Failed to decode image from file upload")
                return jsonify({"status": "error", "error": "Invalid image file"}), 400
            
            logger.info(f"Successfully decoded image from file: {image.shape}")
        
        # Priority 2: Check for base64 encoded image in JSON
        else:
            logger.info("Checking for JSON base64 data")
            data = request.get_json(silent=True)
            
            if data and 'image' in data:
                image_data_base64 = data['image']
                logger.info(f"Received base64 image data with length: {len(image_data_base64)}")
                
                if not image_data_base64.startswith('data:image'):
                    logger.error("Invalid base64 image format")
                    return jsonify({
                        "status": "error",
                        "error": "Invalid base64 image format."
                    }), 400
                
                try:
                    # Remove data URI prefix
                    image_data_base64 = image_data_base64.split(',')[1]
                    image_bytes = base64.b64decode(image_data_base64)
                    
                    if len(image_bytes) > MAX_FILE_SIZE:
                        logger.error(f"Decoded base64 image size exceeds limit")
                        return jsonify({
                            "status": "error",
                            "error": f"Image size exceeds limit. Max size is {MAX_FILE_SIZE // (1024*1024)}MB."
                        }), 400
                    
                    image_array = np.frombuffer(image_bytes, np.uint8)
                    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                    
                    if image is None or image.size == 0:
                        logger.error("Failed to decode base64 image")
                        return jsonify({
                            "status": "error",
                            "error": "Failed to decode base64 image"
                        }), 400
                    
                    logger.info(f"Successfully decoded base64 image: {image.shape}")
                    
                except Exception as e:
                    logger.error(f"Error decoding base64 image: {str(e)}")
                    return jsonify({
                        "status": "error",
                        "error": f"Error decoding base64 image: {str(e)}"
                    }), 400
            else:
                logger.error("No image data received")
                return jsonify({
                    "status": "error",
                    "error": "No image data provided"
                }), 400
        
        # Process the image
        result = process_image(image)
        
        # Return appropriate status code based on result
        if result["status"] == "error":
            return jsonify(result), 400
        else:
            return jsonify(result), 200
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Unhandled error in /api/translate: {error_message}")
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({
            "status": "error",
            "error": f"Translation failed: {error_message}"
        }), 500


@app.route('/api/translate/realtime', methods=['POST'])
def translate_realtime():
    """
    Endpoint for real-time webcam translation.
    Accepts base64 encoded images from webcam.
    
    Note: This endpoint uses the same processing pipeline as /api/translate
    but is kept separate for frontend compatibility and potential future optimizations.
    
    Returns:
        JSON with prediction results (same format as /api/translate)
    """
    image = None
    
    try:
        data = request.get_json(silent=True)
        
        if data and 'image' in data:
            image_data_base64 = data['image']
            logger.info(f"Received real-time base64 image data with length: {len(image_data_base64)}")
            
            if not image_data_base64.startswith('data:image'):
                logger.error("Invalid base64 image format")
                return jsonify({
                    "status": "error",
                    "error": "Invalid base64 image format."
                }), 400
            
            try:
                # Remove data URI prefix
                image_data_base64 = image_data_base64.split(',')[1]
                image_bytes = base64.b64decode(image_data_base64)
                
                if len(image_bytes) > MAX_FILE_SIZE:
                    logger.error(f"Decoded base64 image size exceeds limit")
                    return jsonify({
                        "status": "error",
                        "error": f"Image size exceeds limit. Max size is {MAX_FILE_SIZE // (1024*1024)}MB."
                    }), 400
                
                image_array = np.frombuffer(image_bytes, np.uint8)
                image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                
                if image is None or image.size == 0:
                    logger.error("Failed to decode base64 image")
                    return jsonify({
                        "status": "error",
                        "error": "Failed to decode base64 image"
                    }), 400
                
                logger.info(f"Successfully decoded real-time base64 image: {image.shape}")
                
            except Exception as e:
                logger.error(f"Error decoding base64 image: {str(e)}")
                return jsonify({
                    "status": "error",
                    "error": f"Error decoding base64 image: {str(e)}"
                }), 400
        else:
            logger.error("No image data received in JSON payload")
            return jsonify({
                "status": "error",
                "error": "No image data provided"
            }), 400
        
        # Process the image (same pipeline as /api/translate)
        result = process_image(image)
        
        # Return appropriate status code based on result
        if result["status"] == "error":
            return jsonify(result), 400
        else:
            return jsonify(result), 200
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Unhandled error in /api/translate/realtime: {error_message}")
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({
            "status": "error",
            "error": f"Real-time translation failed: {error_message}"
        }), 500


@app.route('/api/model/info', methods=['GET'])
def model_info():
    """
    Endpoint to get information about the loaded model.
    Useful for debugging and verification.
    
    Returns:
        JSON with model information
    """
    try:
        info = get_model_info()
        return jsonify({
            "status": "success",
            "model_info": info
        }), 200
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    
    Returns:
        JSON with service status
    """
    return jsonify({
        "status": "healthy",
        "service": "ASL Sign Language Recognition",
        "version": "2.0 (RandomForest)"
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    logger.info(f"Starting Flask server on port {port}")
    logger.info(f"CORS enabled for: {os.getenv('CLIENT_URL', 'http://localhost:3000')}")
    app.run(host='0.0.0.0', port=port, debug=True)
