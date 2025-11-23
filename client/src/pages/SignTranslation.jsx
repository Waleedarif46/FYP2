import React, { useState, useEffect } from 'react';
import { FaCamera, FaUpload, FaVolumeUp } from 'react-icons/fa';
import WebcamCapture from '../components/WebcamCapture';
import { translationService } from '../services/translationService';

const SignTranslation = () => {
  const [inputMode, setInputMode] = useState('realtime');
  const [isRecording, setIsRecording] = useState(false);
  const [translation, setTranslation] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [lastTranslatedImage, setLastTranslatedImage] = useState(null);

  useEffect(() => {
    loadTranslationHistory();
  }, []);

  const loadTranslationHistory = async () => {
    try {
      setIsLoading(true);
      setTranslationHistory([
        { text: 'A', time: '3:45 PM' },
        { text: 'B', time: '3:44 PM' },
        { text: 'C', time: '3:43 PM' },
        { text: 'D', time: '3:42 PM' },
        { text: 'E', time: '3:41 PM' }
      ]);
    } catch (err) {
      setError('Failed to load translation history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCamera = () => {
    setIsRecording(true);
    setError(null);
    setInfoMessage(null);
  };

  const handleStopCamera = () => {
    setIsRecording(false);
    setError(null);
    setInfoMessage(null);
  };

  const handleFrameCapture = async (imageSrc) => {
    try {
      setIsLoading(true);
      setError(null);
      setInfoMessage(null);

      const result = await translationService.translateRealtimeImage(imageSrc);

      if (result && result.status === 'success' && result.predicted_sign) {
        setTranslation(result.predicted_sign);
        setConfidence(parseFloat((result.confidence * 100).toFixed(2)));
        setLastTranslatedImage(imageSrc);
        setTranslationHistory((prev) => [
          { text: result.predicted_sign, time: new Date().toLocaleTimeString() },
          ...prev
        ]);
      } else if (result && result.status === 'no_hand') {
        setInfoMessage('No Hand Detected - Please show your hand clearly in the frame');
        setTranslation('');
        setConfidence(0);
      } else if (result && result.error) {
        setError(result.error);
      } else {
        setError('Translation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      setInfoMessage(null);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageData = e.target.result;
          const result = await translationService.translateImage(imageData);

          if (result && result.status === 'success' && result.predicted_sign) {
            setTranslation(result.predicted_sign);
            setConfidence(parseFloat((result.confidence * 100).toFixed(2)));
            setLastTranslatedImage(imageData);
            setTranslationHistory((prev) => [
              { text: result.predicted_sign, time: new Date().toLocaleTimeString() },
              ...prev
            ]);
          } else if (result && result.status === 'no_hand') {
            setInfoMessage('No Hand Detected - Please upload an image with a clear hand sign');
            setTranslation('');
            setConfidence(0);
          } else if (result && result.error) {
            setError(result.error);
          } else {
            setError('Translation failed');
          }
        } catch (err) {
          setError(err.message || 'Failed to process uploaded image');
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to read file');
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!translation) return;

    try {
      const utterance = new SpeechSynthesisUtterance(translation);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError('Failed to speak translation');
    }
  };

  const ErrorState = () => (
    <div className="page-shell">
      <div className="surface-card p-8 max-w-2xl mx-auto space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600">Something went wrong</h2>
        <p className="text-ink/70">{error}</p>
        {error?.includes('preprocessing') && (
          <div className="glass-panel p-4 text-left text-sm text-ink/80">
            <p className="font-semibold mb-2">Troubleshooting tips</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure your hand is fully inside the frame</li>
              <li>Use soft, even lighting</li>
              <li>Stand against a plain background</li>
              <li>Hold each sign steady for a moment</li>
            </ul>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              setError(null);
              setInfoMessage(null);
            }}
            className="btn-primary flex-1 justify-center"
          >
            Try again
          </button>
          <button
            onClick={() => {
              setInputMode((prev) => (prev === 'realtime' ? 'upload' : 'realtime'));
              setError(null);
              setInfoMessage(null);
            }}
            className="btn-secondary flex-1 justify-center"
          >
            Switch mode
          </button>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="page-shell space-y-10">
      <div className="text-center space-y-3">
        <p className="section-eyebrow mx-auto">Realtime Studio</p>
        <h1 className="text-4xl font-semibold text-ink">Sign Language Translator</h1>
        <p className="text-lg text-ink/70">
          Switch between live capture or uploads to interpret signs instantly, with tips that keep each session calm and
          clear.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="surface-card p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              {[
                { key: 'realtime', label: 'Real-time mode', icon: <FaCamera /> },
                { key: 'upload', label: 'Upload image', icon: <FaUpload /> }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setInputMode(key);
                    setInfoMessage(null);
                  }}
                  disabled={isLoading}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-semibold transition ${
                    inputMode === key
                      ? 'bg-brand-600 text-white shadow-glow border-transparent'
                      : 'bg-white/80 text-ink/70 border-white'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {inputMode === 'realtime' ? (
              <div className="aspect-video rounded-3xl bg-ink/90 relative overflow-hidden">
                <WebcamCapture isRecording={isRecording} onFrameCapture={handleFrameCapture} />
                {!isRecording ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/60 text-white">
                    <button onClick={handleStartCamera} className="btn-primary rounded-2xl px-6 py-3" disabled={isLoading}>
                      <div className="flex items-center gap-2">
                        <FaCamera />
                        <span>Start translation</span>
                      </div>
                    </button>
                    <div className="bg-white/10 rounded-2xl p-4 text-sm max-w-md">
                      <p className="font-semibold mb-2">Session tips</p>
                      <ul className="list-disc list-inside space-y-1 text-white/80">
                        <li>Sit near a soft light source</li>
                        <li>Keep a calm background behind you</li>
                        <li>Hold the sign steady for two seconds</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-x-0 bottom-4 flex justify-center">
                    <button onClick={handleStopCamera} className="btn-ghost bg-white/20 text-white" disabled={isLoading}>
                      Stop capture
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-3xl border-2 border-dashed border-white/70 flex items-center justify-center relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                  id="image-upload"
                  disabled={isLoading}
                />
                {lastTranslatedImage ? (
                  <div className="absolute inset-0">
                    <img src={lastTranslatedImage} alt="Last translated sign" className="h-full w-full object-cover rounded-3xl" />
                    <label
                      htmlFor="image-upload"
                      className="absolute inset-0 bg-ink/50 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white font-semibold cursor-pointer"
                    >
                      Upload new image
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center text-ink/60 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FaUpload className="text-3xl mb-3" />
                    <p>{isLoading ? 'Processing...' : 'Drop an image or click to browse'}</p>
                    <p className="text-sm text-ink/50">Supports JPG, PNG, WEBP</p>
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="surface-card p-6">
            <h3 className="text-lg font-semibold text-ink mb-3">Session checklist</h3>
            <div className="grid gap-3 text-sm text-ink/70">
              <p>• Align shoulders and hand within the frame.</p>
              <p>• Use the same background for consistent results.</p>
              <p>• Hover over the result card to hear a pronunciation.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-ink">Translation result</h2>
            {infoMessage ? (
              <div className="glass-panel p-4">
                <p className="font-semibold text-ink">{infoMessage}</p>
                <p className="text-sm text-ink/70 mt-2">
                  Adjust lighting, keep your hand steady, and ensure the camera focuses on your palm.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-mist p-6 text-center">
                <p className="text-3xl font-semibold text-ink">
                  {isLoading ? 'Processing…' : translation || 'Your translation will appear here'}
                </p>
                {confidence > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-ink/60">
                      <span>Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white">
                      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${confidence}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
            <button onClick={handleSpeak} disabled={!translation || isLoading} className="btn-primary w-full justify-center disabled:opacity-60">
              <div className="flex items-center gap-2">
                <FaVolumeUp />
                <span>Play audio</span>
              </div>
            </button>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-ink mb-4">Recent moments</h2>
            <div className="space-y-2">
              {translationHistory.length > 0 ? (
                translationHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-ink">
                    <span className="font-semibold">{item.text}</span>
                    <span className="text-sm text-ink/60">{item.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-ink/60 text-center">No recent translations</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignTranslation;
