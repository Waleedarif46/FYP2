import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ isRecording, onFrameCapture }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [handDetected, setHandDetected] = useState(false);
    const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [usingFallback, setUsingFallback] = useState(false);
    const prevFrameRef = useRef(null);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    };

    const captureFrame = useCallback(() => {
        if (webcamRef.current && isRecording) {
            // Visual feedback that capture is happening
            setIsCapturing(true);
            setTimeout(() => setIsCapturing(false), 300); // Flash for 300ms
            
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc && onFrameCapture) {
                onFrameCapture(imageSrc);
            }
        }
    }, [isRecording, onFrameCapture]);

    // Set up interval for frame capture when recording
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(captureFrame, 2000); // Capture frame every 2 seconds
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRecording, captureFrame]);

    // Load MediaPipe scripts
    useEffect(() => {
        if (!mediaPipeLoaded && isRecording) {
            // Load MediaPipe scripts dynamically
            const loadMediaPipe = async () => {
                try {
                    // Check if scripts are already loaded
                    if (window.drawConnectors && window.drawLandmarks && window.Hands) {
                        console.log("MediaPipe already loaded");
                        setMediaPipeLoaded(true);
                        return;
                    }

                    console.log("Starting MediaPipe script loading");

                    // Load MediaPipe scripts - in a real app these would be properly imported via npm
                    const importScript = (src) => {
                        return new Promise((resolve, reject) => {
                            console.log(`Loading script: ${src}`);
                            const script = document.createElement('script');
                            script.src = src;
                            script.onload = () => {
                                console.log(`Script loaded: ${src}`);
                                resolve();
                            };
                            script.onerror = (err) => {
                                console.error(`Script failed to load: ${src}`, err);
                                reject(new Error(`Failed to load ${src}`));
                            };
                            document.head.appendChild(script);
                        });
                    };

                    // Load required scripts in sequence
                    await importScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js');
                    await importScript('https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js');
                    await importScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js');
                    await importScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js');
                    
                    console.log("MediaPipe scripts loaded successfully");
                    // Check if objects are actually available
                    if (!window.drawConnectors || !window.drawLandmarks || !window.Hands) {
                        throw new Error("MediaPipe objects not available after loading");
                    }
                    
                    setMediaPipeLoaded(true);
                    setErrorMsg(null);
                } catch (error) {
                    console.error("Error loading MediaPipe scripts:", error);
                    setErrorMsg(`MediaPipe load error: ${error.message}`);
                    setUsingFallback(true);
                }
            };

            loadMediaPipe();
        }
    }, [isRecording, mediaPipeLoaded]);

    // Fallback motion detection if MediaPipe fails
    const startFallbackDetection = useCallback(() => {
        if (!webcamRef.current || !canvasRef.current) return;
        
        const videoElement = webcamRef.current.video;
        const canvasElement = canvasRef.current;
        
        if (!videoElement || !canvasElement) return;
        
        const ctx = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth || 640;
        canvasElement.height = videoElement.videoHeight || 480;
        
        const width = canvasElement.width;
        const height = canvasElement.height;
        
        // Motion detection loop
        const detectMotion = () => {
            if (!isRecording || !usingFallback) return;
            
            try {
                ctx.drawImage(videoElement, 0, 0, width, height);
                const currentFrame = ctx.getImageData(0, 0, width, height);
                
                if (prevFrameRef.current) {
                    // Compare with previous frame to detect motion
                    const prev = prevFrameRef.current.data;
                    const curr = currentFrame.data;
                    const motionPixels = [];
                    
                    // Sample pixels to detect motion (check every 10th pixel)
                    for (let i = 0; i < curr.length; i += 40) {
                        // Simple difference between frames
                        const diff = Math.abs(curr[i] - prev[i]) + 
                                    Math.abs(curr[i+1] - prev[i+1]) + 
                                    Math.abs(curr[i+2] - prev[i+2]);
                        
                        if (diff > 50) { // Threshold for motion
                            const pixelIndex = i / 4;
                            const x = pixelIndex % width;
                            const y = Math.floor(pixelIndex / width);
                            motionPixels.push({ x, y });
                        }
                    }
                    
                    // Clear canvas for drawing
                    ctx.clearRect(0, 0, width, height);
                    
                    if (motionPixels.length > 50) { // Threshold for significant motion
                        setHandDetected(true);
                        
                        // Find motion bounding box
                        let minX = width, minY = height, maxX = 0, maxY = 0;
                        motionPixels.forEach(pixel => {
                            minX = Math.min(minX, pixel.x);
                            minY = Math.min(minY, pixel.y);
                            maxX = Math.max(maxX, pixel.x);
                            maxY = Math.max(maxY, pixel.y);
                        });
                        
                        // Add padding
                        const padding = 30;
                        minX = Math.max(0, minX - padding);
                        minY = Math.max(0, minY - padding);
                        maxX = Math.min(width, maxX + padding);
                        maxY = Math.min(height, maxY + padding);
                        
                        // Draw bounding box
                        ctx.strokeStyle = '#FFEB3B';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
                        
                        // Add text
                        ctx.fillStyle = '#FFEB3B';
                        ctx.font = '14px Arial';
                        ctx.fillText('Motion Detected', minX, minY - 5);
                    } else {
                        setHandDetected(false);
                        // Draw no motion message
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                        ctx.font = '16px Arial';
                        ctx.fillText('No Motion Detected', width/2 - 60, 30);
                    }
                }
                
                prevFrameRef.current = currentFrame;
                
                // Continue loop
                if (isRecording && usingFallback) {
                    requestAnimationFrame(detectMotion);
                }
            } catch (err) {
                console.error("Error in motion detection:", err);
            }
        };
        
        // Start detection loop
        requestAnimationFrame(detectMotion);
        
        console.log("Fallback motion detection started");
    }, [isRecording, usingFallback]);

    // Start fallback detection if needed
    useEffect(() => {
        if (isRecording && usingFallback) {
            const timeout = setTimeout(() => {
                startFallbackDetection();
            }, 1000);
            
            return () => clearTimeout(timeout);
        }
    }, [isRecording, usingFallback, startFallbackDetection]);

    // Hand tracking effect with MediaPipe
    useEffect(() => {
        let hands = null;
        let camera = null;

        const startHandTracking = async () => {
            if (!mediaPipeLoaded || !webcamRef.current || !canvasRef.current || usingFallback) return;

            try {
                console.log("Starting MediaPipe hand tracking");
                const videoElement = webcamRef.current.video;
                const canvasElement = canvasRef.current;
                
                if (!videoElement || !canvasElement) {
                    console.error("Video or canvas element not found");
                    return;
                }
                
                const canvasCtx = canvasElement.getContext('2d');
                
                // Make sure canvas matches video dimensions
                canvasElement.width = videoElement.videoWidth || 640;
                canvasElement.height = videoElement.videoHeight || 480;
                console.log(`Canvas dimensions set to: ${canvasElement.width}x${canvasElement.height}`);
                
                // Initialize MediaPipe Hands solution
                console.log("Creating Hands instance");
                hands = new window.Hands({
                    locateFile: (file) => {
                        console.log(`Loading MediaPipe file: ${file}`);
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
                    }
                });
                
                console.log("Setting MediaPipe options");
                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });
                
                console.log("Setting up results handler");
                hands.onResults((results) => {
                    // Clear canvas
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    
                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        console.log("Hand detected!");
                        setHandDetected(true);
                        
                        // Draw hand landmarks
                        for (const landmarks of results.multiHandLandmarks) {
                            // Draw landmarks
                            window.drawLandmarks(
                                canvasCtx, landmarks, { 
                                    color: '#FFEB3B',
                                    fillColor: '#FFEB3B', 
                                    radius: (x) => {
                                    return 3;
                                }
                            });
                            
                            // Draw connections
                            window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {
                                color: '#FFEB3B',
                                lineWidth: 2
                            });
                            
                            // Calculate bounding box of the hand
                            const boundingBox = calculateBoundingBox(landmarks, canvasElement.width, canvasElement.height);
                            
                            // Draw bounding box
                            canvasCtx.strokeStyle = '#FFEB3B';
                            canvasCtx.lineWidth = 3;
                            canvasCtx.strokeRect(
                                boundingBox.x, 
                                boundingBox.y, 
                                boundingBox.width, 
                                boundingBox.height
                            );
                            
                            // Add "Hand Detected" text
                            canvasCtx.fillStyle = '#FFEB3B';
                            canvasCtx.font = '14px Arial';
                            canvasCtx.fillText('Hand Detected', boundingBox.x, boundingBox.y - 5);
                        }
                    } else {
                        setHandDetected(false);
                        // Show "No Hand Detected" message
                        canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                        canvasCtx.font = '16px Arial';
                        canvasCtx.fillText('No Hand Detected', canvasElement.width/2 - 60, 30);
                    }
                });
                
                // Start camera
                console.log("Starting camera with MediaPipe");
                camera = new window.Camera(videoElement, {
                    onFrame: async () => {
                        if (hands) {
                            try {
                                await hands.send({image: videoElement});
                            } catch (e) {
                                console.error("Error in hand tracking:", e);
                            }
                        }
                    },
                    width: videoElement.videoWidth || 640,
                    height: videoElement.videoHeight || 480
                });
                
                camera.start().then(() => {
                    console.log("Camera started successfully");
                }).catch(err => {
                    console.error("Camera failed to start:", err);
                    setErrorMsg(`Camera error: ${err.message}`);
                    setUsingFallback(true);
                });
                
            } catch (error) {
                console.error("Error in hand tracking:", error);
                setErrorMsg(`Hand tracking error: ${error.message}`);
                setUsingFallback(true);
            }
        };
        
        // Helper function to calculate hand bounding box
        const calculateBoundingBox = (landmarks, width, height) => {
            let minX = width;
            let minY = height;
            let maxX = 0;
            let maxY = 0;
            
            for (const landmark of landmarks) {
                const x = landmark.x * width;
                const y = landmark.y * height;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            
            // Add padding
            const padding = 20;
            minX = Math.max(0, minX - padding);
            minY = Math.max(0, minY - padding);
            maxX = Math.min(width, maxX + padding);
            maxY = Math.min(height, maxY + padding);
            
            return {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        };

        // Start hand tracking when MediaPipe is loaded and we're recording
        if (isRecording && mediaPipeLoaded && !usingFallback) {
            console.log("Setting up hand tracking with delay");
            setTimeout(() => {
                startHandTracking();
            }, 1000); // Give webcam a moment to initialize fully
        }
        
        // Cleanup
        return () => {
            console.log("Cleaning up hand tracking");
            if (camera) {
                camera.stop();
            }
            if (hands) {
                hands.close();
            }
        };
    }, [isRecording, mediaPipeLoaded, usingFallback]);

    return (
        <div className="relative w-full h-full">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMediaError={(err) => {
                    console.error("Webcam error:", err);
                    setErrorMsg(`Webcam error: ${err.name}`);
                }}
            />
            {isRecording && (
                <canvas 
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
            )}
            {isRecording && (
                <div className="absolute top-2 right-2">
                    <div className="animate-pulse bg-red-500 rounded-full w-3 h-3"></div>
                </div>
            )}
            {isCapturing && (
                <div className="absolute inset-0 bg-white bg-opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
                        Capturing...
                    </div>
                </div>
            )}
            {errorMsg && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
                    {errorMsg}
                    {usingFallback && " (Using fallback motion detection)"}
                </div>
            )}
            {usingFallback && (
                <div className="absolute top-2 left-2 bg-yellow-600 bg-opacity-70 text-white p-2 rounded text-xs">
                    Using motion detection instead of hand tracking
                </div>
            )}
        </div>
    );
};

export default WebcamCapture; 