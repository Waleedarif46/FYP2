import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiTarget, FiRefreshCcw, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import SignModal from '../components/SignModal';
import WebcamCapture from '../components/WebcamCapture';
import { translationService } from '../services/translationService';
import { searchWLASL, getSuggestions, batchLoadSigns } from '../services/wlasl';

const SIGN_IMAGES = (() => {
  try {
    const context = require.context('../assets/ASLsigns', false, /\.(png|jpe?g|webp|svg)$/);
    const images = {};
    context.keys().forEach((key) => {
      const cleaned = key.replace('./', '').split('.')[0].toLowerCase();
      images[cleaned] = context(key);
    });
    return images;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('ASL sign images not found in assets/ASLsigns', err);
    return {};
  }
})();

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const BASIC_WORDS = [
  'book', 'drink', 'computer', 'before', 'chair', 'go',
  'clothes', 'who', 'candy', 'cousin', 'deaf', 'fine',
  'help', 'no', 'thin', 'walk', 'year', 'yes',
  'all', 'black', 'cool', 'finish', 'hot', 'like',
  'many', 'mother', 'now', 'orange', 'table', 'thanksgiving',
  'what', 'woman', 'bed', 'blue', 'bowling', 'can',
  'dog', 'family', 'fish', 'graduate', 'hat', 'hearing',
  'kiss', 'language', 'later', 'man', 'shirt', 'study',
  'tall'
];

const ASSESSMENT_HISTORY_LIMIT = 6;

const Learn = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state
  const [activeTab, setActiveTab] = useState('alphabets'); // 'alphabets' | 'digits' | 'words' | 'assessment'
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSign, setSelectedSign] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  
  const [wordSigns, setWordSigns] = useState({});
  const [loadingState, setLoadingState] = useState('loading'); // 'loading' | 'loaded' | 'error'

  // Assessment state
  const [assessmentTarget, setAssessmentTarget] = useState('A');
  const [assessmentStatus, setAssessmentStatus] = useState('idle'); // 'idle' | 'active'
  const [assessmentAttempts, setAssessmentAttempts] = useState(0);
  const [assessmentCorrect, setAssessmentCorrect] = useState(0);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [assessmentRecording, setAssessmentRecording] = useState(false);
  const [assessmentAwaitCapture, setAssessmentAwaitCapture] = useState(false);
  const [assessmentProcessing, setAssessmentProcessing] = useState(false);
  const [assessmentFeedback, setAssessmentFeedback] = useState(null);
  const [assessmentConfidence, setAssessmentConfidence] = useState(null);
  const [assessmentError, setAssessmentError] = useState(null);

  const latestFrameRef = useRef(null);
  const awaitingCaptureRef = useRef(false);
  const pendingTargetRef = useRef('A');
  const statsRef = useRef(null);

  // Preload signs on component mount
  useEffect(() => {
    const preloadSigns = () => {
      setLoadingState('loading');
      try {
        const loadedWords = batchLoadSigns(BASIC_WORDS);
        setWordSigns(loadedWords);
        setLoadingState('loaded');
      } catch (error) {
        console.error('Error preloading signs:', error);
        setLoadingState('error');
      }
    };

    preloadSigns();
  }, []);

  useEffect(() => {
    if (searchParams.get('view') === 'assessment') {
      setActiveTab('assessment');
    }
  }, [searchParams]);

  // Handle search - WLASL only
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSuggestions([]);
    
    try {
      // Search WLASL (instant, no API call)
      const sign = searchWLASL(searchQuery.trim());
      
      if (sign) {
        // Found - open modal with videos
        setSelectedSign(sign);
        setModalOpen(true);
        setModalLoading(false);
        setModalError(null);
      } else {
        // Not found - show suggestions
        const wlaslSuggestions = getSuggestions(searchQuery.trim(), 10);
        
        if (wlaslSuggestions.length > 0) {
          setSuggestions(wlaslSuggestions);
          setSearchError(`No exact match found for "${searchQuery}"`);
        } else {
          setSearchError(`No results found for "${searchQuery}". Try searching common ASL words.`);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Search error. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle card click - use preloaded WLASL data or placeholder
  const handleCardClick = (term, preloadedSign = null, isAlphabetOrDigit = false) => {
    setModalOpen(true);
    setModalLoading(false);
    setModalError(null);
    setSelectedSign(null);

    try {
      // If alphabet or digit, show placeholder
      if (isAlphabetOrDigit) {
        const key = term.toLowerCase();
        setSelectedSign({
          word: term,
          isPlaceholder: true,
          image: SIGN_IMAGES[key] || null
        });
        return;
      }

      // Use preloaded sign if available (for basic words)
      if (preloadedSign) {
        setSelectedSign(preloadedSign);
        return;
      }

      // Search WLASL for basic words
      const sign = searchWLASL(term);
      
      if (sign) {
        setSelectedSign(sign);
      } else {
        setModalError(`Sign not available for "${term}". This word is not in the WLASL dataset.`);
      }
    } catch (error) {
      console.error('Error loading sign:', error);
      setModalError('Failed to load sign. Please try again.');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    setSearchError(null);
    // Auto-search the suggestion
    setTimeout(() => handleSearch(), 100);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'assessment') {
      setSearchParams({ view: 'assessment' });
    } else {
      setSearchParams({});
    }
  };

  const startAssessmentSession = () => {
    setAssessmentStatus('active');
    setAssessmentAttempts(0);
    setAssessmentCorrect(0);
    setAssessmentHistory([]);
    setAssessmentFeedback(null);
    setAssessmentConfidence(null);
    setAssessmentError(null);
  };

  const ensureSessionActive = () => {
    if (assessmentStatus !== 'active') {
      startAssessmentSession();
    }
  };

  const endAssessmentSession = () => {
    setAssessmentStatus('idle');
    setAssessmentRecording(false);
    setAssessmentAwaitCapture(false);
    setAssessmentFeedback(null);
  };

  const handleTargetChange = (event) => {
    setAssessmentTarget(event.target.value.toUpperCase());
    setAssessmentFeedback(null);
  };

  const handleRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * ALPHABETS.length);
    setAssessmentTarget(ALPHABETS[randomIndex]);
    setAssessmentFeedback(null);
  };

  const handleStartCamera = () => {
    ensureSessionActive();
    setAssessmentRecording(true);
    setAssessmentError(null);
  };

  const handleStopCamera = () => {
    setAssessmentRecording(false);
    setAssessmentAwaitCapture(false);
  };

  const scoreAssessmentImage = async (imageSrc, targetSnapshot) => {
    if (!imageSrc) {
      setAssessmentError('Camera frame not ready. Keep your hand steady and try again.');
      setAssessmentAwaitCapture(false);
      awaitingCaptureRef.current = false;
      setAssessmentProcessing(false);
      return;
    }

    awaitingCaptureRef.current = false;
    setAssessmentAwaitCapture(false);

    try {
      const result = await translationService.translateRealtimeImage(imageSrc);
      setAssessmentAttempts((prev) => prev + 1);

      if (result?.status === 'success' && result?.predicted_sign) {
        const predicted = result.predicted_sign.trim().toUpperCase();
        const confidence = result?.confidence ? Math.round(result.confidence * 100) : null;
        const isCorrect = predicted === targetSnapshot;

        if (isCorrect) {
          setAssessmentCorrect((prev) => prev + 1);
        }

        setAssessmentHistory((prev) => [
          {
            id: Date.now(),
            target: targetSnapshot,
            predicted,
            correct: isCorrect,
            confidence
          },
          ...prev
        ].slice(0, ASSESSMENT_HISTORY_LIMIT));

        setAssessmentFeedback(
          isCorrect
            ? `Great! Your ${targetSnapshot} sign looks accurate${confidence ? ` (${confidence}% confidence)` : ''}.`
            : `Detected ${predicted}. Adjust your form so it matches ${targetSnapshot}.`
        );
        setAssessmentConfidence(confidence);
        setAssessmentError(null);
      } else if (result?.status === 'no_hand') {
        setAssessmentHistory((prev) => [
          {
            id: Date.now(),
            target: targetSnapshot,
            predicted: 'No Hand',
            correct: false,
            confidence: null
          },
          ...prev
        ].slice(0, ASSESSMENT_HISTORY_LIMIT));

        setAssessmentFeedback('No hand detected. Raise your hand into the frame and keep it steady.');
        setAssessmentConfidence(null);
      } else if (result?.error) {
        setAssessmentError(result.error);
      } else {
        setAssessmentError('Translation failed. Please try again.');
      }
    } catch (error) {
      setAssessmentError(error.message || 'Failed to score your attempt. Please try again.');
    } finally {
      setAssessmentProcessing(false);
    }
  };

  const handleCaptureAttempt = () => {
    if (!assessmentRecording) {
      setAssessmentError('Enable the camera to capture your sign.');
      return;
    }

    ensureSessionActive();

    if (assessmentProcessing) return;

    setAssessmentError(null);
    setAssessmentFeedback(null);
    setAssessmentConfidence(null);

    pendingTargetRef.current = assessmentTarget;
    awaitingCaptureRef.current = true;
    setAssessmentAwaitCapture(true);
    setAssessmentProcessing(true);

    if (statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (latestFrameRef.current) {
      scoreAssessmentImage(latestFrameRef.current, pendingTargetRef.current);
    }
  };

  const handleAssessmentFrame = (imageSrc) => {
    latestFrameRef.current = imageSrc;

    if (awaitingCaptureRef.current) {
      scoreAssessmentImage(imageSrc, pendingTargetRef.current);
    }
  };

  const assessmentAccuracy = assessmentAttempts
    ? Math.round((assessmentCorrect / assessmentAttempts) * 100)
    : 0;

  const targetImage = SIGN_IMAGES[assessmentTarget.toLowerCase()];

  // Render loading state
  if (loadingState === 'loading') {
    return (
      <div className="page-shell">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-semibold text-ink">Learn Sign Language</h1>
          <div className="surface-card py-16 flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin" />
            <p className="text-lg text-ink/70">Loading your practice studio...</p>
            <p className="text-sm text-ink/60">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-ink">Learn Sign Language</h1>
          <p className="text-xl text-ink/70">Master ASL through interactive lessons and practice</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="surface-card p-8 space-y-4">
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                placeholder="Search 2,000+ ASL words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pr-14"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="btn-primary shrink-0 px-4 py-3 disabled:opacity-60"
              >
                {isSearching ? (
                  <div className="h-5 w-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaSearch className="w-5 h-5" />
                )}
              </button>
            </div>

            {searchError && (
              <div className="glass-panel p-4 text-left">
                <p className="text-ink font-semibold mb-2">{searchError}</p>
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="surface-card p-4 max-w-3xl mx-auto">
          <nav className="flex flex-wrap gap-3 justify-center" aria-label="Tabs">
            {[
              { key: 'alphabets', label: 'Alphabets (A-Z)' },
              { key: 'digits', label: 'Digits (0-9)' },
              { key: 'words', label: 'Basic Words' },
              { key: 'assessment', label: 'Self Assessment' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                  activeTab === key
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'bg-white/70 text-ink/60 hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {/* Alphabets Tab */}
          {activeTab === 'alphabets' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-4">
              {ALPHABETS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleCardClick(letter, null, true)}
                  className="aspect-square surface-card flex items-center justify-center hover:shadow-glow transition border border-white/80"
                >
                  <span className="text-2xl font-semibold text-ink">{letter}</span>
                </button>
              ))}
            </div>
          )}

          {/* Digits Tab */}
          {activeTab === 'digits' && (
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4 max-w-4xl mx-auto">
              {DIGITS.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleCardClick(digit, null, true)}
                  className="aspect-square surface-card flex items-center justify-center hover:shadow-glow transition border border-white/80"
                >
                  <span className="text-2xl font-semibold text-ink">{digit}</span>
                </button>
              ))}
            </div>
          )}

          {/* Basic Words Tab */}
          {activeTab === 'words' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {BASIC_WORDS.map((word) => (
                <button
                  key={word}
                  onClick={() => handleCardClick(word, wordSigns[word])}
                  className="surface-card text-left hover:shadow-glow transition border border-white/80 p-5"
                >
                  <span className="text-lg font-semibold text-ink capitalize">
                    {word}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="surface-card p-6 space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="section-eyebrow w-fit mb-2">Self assessment</p>
                      <h3 className="text-2xl font-semibold text-ink">Practice alphabet accuracy</h3>
                      <p className="text-sm text-ink/60">
                        Pick a letter, show the sign, and let Signverse score your attempt.
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wide text-ink/60">Accuracy</p>
                      <p className="text-3xl font-semibold text-ink">{assessmentAccuracy}%</p>
                    </div>
                  </div>

                  <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center">
                    {targetImage ? (
                      <img
                        src={targetImage}
                        alt={`ASL for ${assessmentTarget}`}
                        className="w-28 h-28 object-contain rounded-2xl border border-white shadow-card"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-3xl bg-brand-50 text-brand-700 flex items-center justify-center text-4xl font-semibold">
                        {assessmentTarget}
                      </div>
                    )}
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-ink/60">Current target</p>
                      <p className="text-3xl font-semibold text-ink flex items-center gap-2 justify-center sm:justify-start">
                        <FiTarget />
                        {assessmentTarget}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRandomLetter}
                      className="btn-ghost inline-flex items-center gap-2 text-sm font-semibold"
                    >
                      <FiRefreshCcw className="text-base" /> Surprise me
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-sm font-semibold text-ink/70">Choose alphabet</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select value={assessmentTarget} onChange={handleTargetChange} className="input-field">
                        {ALPHABETS.map((letter) => (
                          <option key={letter} value={letter}>
                            {letter}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={startAssessmentSession} className="btn-primary flex-1">
                        {assessmentStatus === 'active' ? 'Reset session' : 'Start session'}
                      </button>
                    </div>
                    {assessmentStatus === 'active' && (
                      <button
                        type="button"
                        onClick={endAssessmentSession}
                        className="btn-ghost text-sm font-semibold text-ink/70"
                      >
                        End session
                      </button>
                    )}
                  </div>
                </div>

                <div className="surface-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-ink">Live camera</h4>
                    <span className={`text-sm font-semibold ${assessmentRecording ? 'text-brand-600' : 'text-ink/50'}`}>
                      {assessmentRecording ? 'Camera on' : 'Camera paused'}
                    </span>
                  </div>

                  <div className="aspect-video rounded-3xl bg-ink/90 relative overflow-hidden">
                    <WebcamCapture isRecording={assessmentRecording} onFrameCapture={handleAssessmentFrame} />
                    {!assessmentRecording && (
                      <div className="absolute inset-0 bg-ink/70 text-white flex flex-col items-center justify-center gap-3 text-center px-6">
                        <p className="text-lg font-semibold">Camera paused</p>
                        <p className="text-sm text-white/80">
                          Enable your webcam whenever you are ready to score an attempt.
                        </p>
                        <button type="button" onClick={handleStartCamera} className="btn-primary">
                          Enable camera
                        </button>
                      </div>
                    )}
                    {assessmentAwaitCapture && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/40 text-white font-semibold">
                        Capturing...
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCaptureAttempt}
                      disabled={assessmentProcessing || assessmentStatus !== 'active'}
                      className="btn-primary flex-1 justify-center disabled:opacity-60"
                    >
                      {assessmentProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        'Check attempt'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleStopCamera}
                      disabled={!assessmentRecording}
                      className="btn-ghost flex-1 justify-center disabled:opacity-60"
                    >
                      Pause camera
                    </button>
                  </div>

                  {assessmentFeedback && (
                    <div className="glass-panel p-4 flex items-start gap-3 text-brand-700">
                      <FiCheckCircle className="text-xl flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{assessmentFeedback}</p>
                        {assessmentConfidence !== null && (
                          <p className="text-sm text-ink/60 mt-1">Confidence {assessmentConfidence}%</p>
                        )}
                      </div>
                    </div>
                  )}

                  {assessmentError && (
                    <div className="glass-panel p-4 flex items-start gap-3 text-red-600">
                      <FiAlertTriangle className="text-xl flex-shrink-0" />
                      <p className="text-sm">{assessmentError}</p>
                    </div>
                  )}
                </div>
              </div>

              <div ref={statsRef} className="surface-card p-6 space-y-5">
                <h4 className="text-lg font-semibold text-ink">Session stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4">
                    <p className="text-xs uppercase text-ink/60">Attempts</p>
                    <p className="text-2xl font-semibold text-ink">{assessmentAttempts}</p>
                  </div>
                  <div className="glass-panel p-4">
                    <p className="text-xs uppercase text-ink/60">Correct</p>
                    <p className="text-2xl font-semibold text-ink">{assessmentCorrect}</p>
                  </div>
                  <div className="glass-panel p-4">
                    <p className="text-xs uppercase text-ink/60">Accuracy</p>
                    <p className="text-2xl font-semibold text-ink">{assessmentAccuracy}%</p>
                  </div>
                  <div className="glass-panel p-4">
                    <p className="text-xs uppercase text-ink/60">Camera</p>
                    <p className="text-2xl font-semibold text-ink">{assessmentRecording ? 'On' : 'Off'}</p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-ink/70 mb-3">Recent attempts</h5>
                  {assessmentHistory.length > 0 ? (
                    <div className="space-y-2">
                      {assessmentHistory.map((entry) => (
                        <div key={entry.id} className="glass-panel p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-semibold">
                              {entry.target}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-ink">
                                Detected {entry.predicted}
                              </p>
                              <p className="text-xs text-ink/60">
                                {entry.correct ? 'Correct form' : 'Needs practice'}
                                {entry.confidence !== null && ` • ${entry.confidence}%`}
                              </p>
                            </div>
                          </div>
                          <span className={`text-lg font-semibold ${entry.correct ? 'text-green-600' : 'text-red-500'}`}>
                            {entry.correct ? '✓' : '✕'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel p-4 text-sm text-ink/60 text-center">
                      Start a session and your attempts will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="surface-card surface-card-emphasis p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-ink mb-3">Learning Rituals</h3>
          <p className="text-ink/70 mb-5">Steady habits make expressive signing feel natural.</p>
          <div className="grid gap-4 text-left text-ink/80">
            <p>• <strong>Basic Words:</strong> Tap any card to watch ASL variations and cues.</p>
            <p>• <strong>Alphabets & Digits:</strong> Practice shape memory while we prep videos.</p>
            <p>• <strong>Search:</strong> Quickly jump to phrases you need for real conversations.</p>
            <p>• Revisit saved favorites to build muscle memory.</p>
          </div>
        </div>
      </div>

      {/* Sign Modal */}
      <SignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sign={selectedSign}
        isLoading={modalLoading}
        error={modalError}
      />
    </div>
  );
};

export default Learn;
