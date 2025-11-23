#!/usr/bin/env python3
"""
Test script for the new RandomForest ASL sign language recognition model.
Tests model loading, feature extraction, and prediction functionality.
"""

import os
import sys
import logging
from dotenv import load_dotenv
import numpy as np

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.predict import predict_sign, get_model_info, _load_model
from utils.feature_extraction import extract_hand_landmarks

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


def test_model_loading():
    """Test 1: Model loading from pickle file"""
    print("\n" + "="*60)
    print("TEST 1: Model Loading")
    print("="*60)
    
    try:
        logger.info("Attempting to load model...")
        model = _load_model()
        
        if model is None:
            print("❌ FAILED: Model is None!")
            return False
        
        print(f"✅ PASSED: Model loaded successfully!")
        print(f"   Model type: {type(model).__name__}")
        
        if hasattr(model, 'n_estimators'):
            print(f"   Number of trees: {model.n_estimators}")
        if hasattr(model, 'n_features_in_'):
            print(f"   Expected features: {model.n_features_in_}")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_model_info():
    """Test 2: Get model information"""
    print("\n" + "="*60)
    print("TEST 2: Model Information")
    print("="*60)
    
    try:
        info = get_model_info()
        
        if "error" in info:
            print(f"❌ FAILED: {info['error']}")
            return False
        
        print("✅ PASSED: Model info retrieved successfully!")
        print(f"   Model type: {info.get('model_type')}")
        print(f"   Number of classes: {info.get('num_classes')}")
        print(f"   Confidence threshold: {info.get('confidence_threshold')}")
        print(f"   Expected features: {info.get('expected_features')}")
        print(f"   Classes: {', '.join(info.get('classes', []))}")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_prediction_with_dummy_features():
    """Test 3: Prediction with dummy features"""
    print("\n" + "="*60)
    print("TEST 3: Prediction with Dummy Features")
    print("="*60)
    
    try:
        # Create dummy features (42 values between 0 and 1)
        # This simulates normalized hand landmark coordinates
        dummy_features = np.random.rand(42).tolist()
        
        print(f"   Created {len(dummy_features)} dummy features")
        print(f"   Feature range: [{min(dummy_features):.3f}, {max(dummy_features):.3f}]")
        
        # Make prediction
        predicted_sign, confidence = predict_sign(dummy_features)
        
        print(f"✅ PASSED: Prediction successful!")
        print(f"   Predicted sign: {predicted_sign}")
        print(f"   Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_prediction_with_invalid_features():
    """Test 4: Prediction with invalid input (should fail gracefully)"""
    print("\n" + "="*60)
    print("TEST 4: Error Handling with Invalid Features")
    print("="*60)
    
    try:
        # Test with wrong number of features
        invalid_features = [0.5] * 30  # Only 30 features instead of 42
        
        try:
            predicted_sign, confidence = predict_sign(invalid_features)
            print("❌ FAILED: Should have raised ValueError for invalid features")
            return False
        except ValueError as e:
            print(f"✅ PASSED: Correctly raised ValueError: {str(e)}")
            return True
            
    except Exception as e:
        print(f"❌ FAILED: Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_feature_extraction_no_image():
    """Test 5: Feature extraction with invalid input"""
    print("\n" + "="*60)
    print("TEST 5: Feature Extraction Error Handling")
    print("="*60)
    
    try:
        # Test with None image
        features, error_info = extract_hand_landmarks(None)
        
        if features is not None:
            print("❌ FAILED: Should have returned None for invalid image")
            return False
        
        if error_info is None:
            print("❌ FAILED: Should have returned error info")
            return False
        
        print(f"✅ PASSED: Correctly handled invalid input")
        print(f"   Error status: {error_info.get('status')}")
        print(f"   Error message: {error_info.get('message')}")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def run_all_tests():
    """Run all tests and report results"""
    print("\n" + "="*60)
    print("RUNNING ALL TESTS FOR RANDOMFOREST ASL MODEL")
    print("="*60)
    
    tests = [
        ("Model Loading", test_model_loading),
        ("Model Information", test_model_info),
        ("Dummy Feature Prediction", test_prediction_with_dummy_features),
        ("Invalid Feature Handling", test_prediction_with_invalid_features),
        ("Feature Extraction Error Handling", test_feature_extraction_no_image),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, passed))
        except Exception as e:
            logger.error(f"Test '{test_name}' crashed: {str(e)}")
            results.append((test_name, False))
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print("="*60)
    print(f"Results: {passed_count}/{total_count} tests passed")
    print("="*60)
    
    if passed_count == total_count:
        print("\n🎉 ALL TESTS PASSED! 🎉")
        print("The model is ready for use!")
        return True
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed.")
        print("Please review the errors above.")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)

