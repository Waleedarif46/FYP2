import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

const SignModal = ({ isOpen, onClose, sign, isLoading, error }) => {
  const VIDEOS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedVideos, setDisplayedVideos] = useState(VIDEOS_PER_PAGE);

  // Reset pagination when sign changes
  useEffect(() => {
    if (sign) {
      setCurrentPage(1);
      setDisplayedVideos(VIDEOS_PER_PAGE);
    }
  }, [sign?.word]);

  if (!isOpen) return null;

  const totalVideos = sign?.videos?.length || 0;
  const hasMoreVideos = displayedVideos < totalVideos;
  const remainingVideos = totalVideos - displayedVideos;

  const handleLoadMore = () => {
    setDisplayedVideos(prev => Math.min(prev + VIDEOS_PER_PAGE, totalVideos));
    setCurrentPage(prev => prev + 1);
  };

  const handleShowLess = () => {
    setDisplayedVideos(VIDEOS_PER_PAGE);
    setCurrentPage(1);
    // Scroll to top of modal
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto transform transition-all max-h-[90vh] overflow-y-auto modal-content">
          {/* Close button */}
          <button
            onClick={onClose}
            className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-2 shadow-lg"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal content */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading sign...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Sign</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : sign ? (
              <div>
                {/* Sign Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2 uppercase text-center">
                  {sign.word || 'Sign'}
                </h2>
                
                {/* Placeholder Display for Alphabets/Digits */}
                {sign.isPlaceholder ? (
                  <div className="mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 border-2 border-blue-200 text-center">
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-40 h-40 bg-white rounded-full shadow-lg border-4 border-blue-400">
                          <span className="text-8xl font-bold text-blue-600">
                            {sign.word}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-lg font-semibold text-gray-700">
                          ASL Sign for "{sign.word}"
                        </p>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                          Visual demonstration placeholder. Practice this sign with proper hand shape and movement.
                        </p>
                        
                        <div className="pt-4 flex items-center justify-center gap-2 text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">
                            Video demonstration coming soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : sign.videos && sign.videos.length > 0 ? (
                  <div className="space-y-6 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-blue-800 text-sm font-medium">
                        📹 {sign.videos.length} video variation{sign.videos.length > 1 ? 's' : ''} available
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        Showing {Math.min(displayedVideos, totalVideos)} of {totalVideos}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sign.videos.slice(0, displayedVideos).map((video, index) => (
                        <VideoPlayer
                          key={index}
                          video={video}
                          index={index}
                          word={sign.word}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {(hasMoreVideos || displayedVideos > VIDEOS_PER_PAGE) && (
                      <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200">
                        {hasMoreVideos && (
                          <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            Load {Math.min(VIDEOS_PER_PAGE, remainingVideos)} More Video{Math.min(VIDEOS_PER_PAGE, remainingVideos) > 1 ? 's' : ''}
                          </button>
                        )}
                        
                        {displayedVideos > VIDEOS_PER_PAGE && (
                          <button
                            onClick={handleShowLess}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less (Back to Top)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 mb-6 text-center">
                    <div className="text-5xl mb-4">📹</div>
                    <p className="text-gray-600">No video available for this sign</p>
                    <p className="text-sm text-gray-500 mt-2">This word is not in the WLASL dataset</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤷</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Sign Found</h3>
                <p className="text-gray-600 mb-6">We couldn't find a sign for this term.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignModal;

