# Troubleshooting Guide - ML Backend

## Issue: "No Hand Detected" with Non-Dataset Images

### Problem Description
The system works well with training dataset images but shows "No hand detected" error with:
- Real-world photos
- Webcam captures
- Images from external sources

### Root Cause
MediaPipe hand detection is configured with **90% confidence threshold** (`min_detection_confidence=0.9`) to match training settings. This high threshold was necessary during training but can be too strict for production use.

---

## Solutions

### Solution 1: Lower Detection Confidence (Recommended)

Edit `ml_backend/utils/feature_extraction.py`:

**Current code (line 44-48):**
```python
with mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.9  # Very strict!
) as hands:
```

**Recommended change:**
```python
with mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5  # More flexible for real-world images
) as hands:
```

**Trade-offs:**
- ✅ **Pro**: Works with more diverse images
- ✅ **Pro**: Better for real-world conditions (varying lighting, backgrounds)
- ⚠️ **Con**: Might detect false positives (hands in background noise)

---

### Solution 2: Image Quality Guidelines for Users

If you keep the 0.9 confidence threshold, ensure images meet these criteria:

#### ✅ **Good Image Characteristics:**
1. **Lighting**: Well-lit, even lighting on hand
2. **Background**: Plain or simple background
3. **Hand Position**: Hand clearly visible, not cut off
4. **Distance**: Hand fills 30-60% of frame
5. **Focus**: Sharp, not blurry
6. **Contrast**: Good contrast between hand and background

#### ❌ **Poor Image Characteristics:**
1. **Lighting**: Dark, shadowy, or backlit
2. **Background**: Busy/cluttered background
3. **Hand Position**: Partially outside frame
4. **Distance**: Hand too small or too close
5. **Focus**: Blurry or motion blur
6. **Contrast**: Hand blends with background

---

### Solution 3: Adaptive Detection (Advanced)

Implement a fallback strategy with multiple detection attempts:

```python
def extract_hand_landmarks_adaptive(image):
    """Try detection with decreasing confidence thresholds"""
    thresholds = [0.9, 0.7, 0.5]
    
    for threshold in thresholds:
        with mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=2,
            min_detection_confidence=threshold
        ) as hands:
            results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            if results.multi_hand_landmarks:
                return extract_features(results)
    
    return None, {"status": "no_hand", "message": "..."}
```

---

## Quick Fix Implementation

### Step 1: Lower Detection Confidence

```bash
# Edit the file
nano ml_backend/utils/feature_extraction.py

# Find line 47 and change:
# FROM: min_detection_confidence=0.9
# TO:   min_detection_confidence=0.5
```

### Step 2: Restart Server

```bash
# Press Ctrl+C to stop the server
# Then restart:
python app.py
```

### Step 3: Test

Upload a non-dataset image or try live translation. Should work much better now!

---

## Understanding the Confidence Levels

| Confidence | Use Case | Pros | Cons |
|------------|----------|------|------|
| **0.9** | Training datasets, controlled environments | Very accurate, few false positives | Misses many real-world images |
| **0.7** | Balanced production use | Good accuracy, works with most images | Some false positives possible |
| **0.5** | Real-world, varied conditions | Works with diverse images | More false positives |
| **0.3** | Maximum flexibility | Catches almost all hands | Many false positives |

**Recommendation**: Start with **0.5** for production use.

---

## Debugging Tips

### Check What MediaPipe Sees

Add this to `feature_extraction.py` to save debug images:

```python
# After line 50 (after processing)
if results.multi_hand_landmarks:
    # Draw landmarks on image
    annotated_image = image_rgb.copy()
    for hand_landmarks in results.multi_hand_landmarks:
        mp_drawing.draw_landmarks(
            annotated_image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS
        )
    cv2.imwrite('debug_hand_detected.jpg', cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR))
else:
    cv2.imwrite('debug_no_hand.jpg', image)
```

This creates debug images showing what MediaPipe detected.

---

## Common Issues & Fixes

### Issue: "Works with some images but not others"
**Fix**: Lower `min_detection_confidence` to 0.5 or 0.6

### Issue: "Detects wrong hand when multiple people in frame"
**Fix**: System already selects largest hand (by bounding box area). Ensure subject's hand is closest to camera.

### Issue: "Predictions are wrong"
**Fix**: This is a model issue, not detection. The model might need retraining with more diverse data.

### Issue: "Very slow on first request"
**Fix**: Normal - model loads on first request (~20 seconds). Subsequent requests are fast.

---

## Model Accuracy vs Detection Success

**Important**: These are two separate issues:

1. **Detection Success**: MediaPipe finding a hand → Adjust `min_detection_confidence`
2. **Prediction Accuracy**: Model correctly identifying the sign → Retrain model with better data

If MediaPipe detects the hand but prediction is wrong, the issue is with the model, not the detection threshold.

---

## Monitoring Detection Success Rate

Add this to track detection rates:

```python
# In app.py, add global counters
detection_success = 0
detection_failure = 0

# In process_image function
if error_info and error_info.get("status") == "no_hand":
    detection_failure += 1
    logger.info(f"Detection rate: {detection_success}/{detection_success + detection_failure}")
else:
    detection_success += 1
```

Aim for >80% detection success rate in production.

---

## Recommended Configuration for Production

```python
# ml_backend/utils/feature_extraction.py

# For production use:
with mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5,  # Balanced for real-world use
    min_tracking_confidence=0.5
) as hands:
```

This provides a good balance between accuracy and flexibility for real-world images.

