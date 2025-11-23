import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import SignModal from '../components/SignModal';
import { searchWLASL, getSuggestions, batchLoadSigns } from '../services/wlasl';

const Learn = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('alphabets'); // 'alphabets' | 'digits' | 'words'
  
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

  // Alphabets A-Z
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // Digits 0-9
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  // Basic Words/Phrases - Using words confirmed to be in WLASL dataset
  const basicWords = [
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

  // Preload signs on component mount
  useEffect(() => {
    preloadSigns();
  }, []);

  const preloadSigns = async () => {
    setLoadingState('loading');
    try {
      // Only load basic words from WLASL (alphabets and digits will use placeholders)
      const loadedWords = batchLoadSigns(basicWords);

      setWordSigns(loadedWords);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error preloading signs:', error);
      setLoadingState('error');
    }
  };

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
        setSelectedSign({
          word: term,
          isPlaceholder: true
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
              { key: 'words', label: 'Basic Words' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
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
              {alphabets.map((letter) => (
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
              {digits.map((digit) => (
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
              {basicWords.map((word) => (
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
