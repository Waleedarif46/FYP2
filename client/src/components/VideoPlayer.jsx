import React, { useState } from 'react';

const VideoPlayer = ({ video, index, word }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-gray-600 text-sm">
          Video unavailable from {video.source}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Source: {video.source} | Signer #{video.signerId}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Video Info Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-sm font-semibold text-gray-700">
            Variation {index + 1}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            Source: {video.source}
          </span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Signer #{video.signerId}
        </span>
      </div>

      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        <video
          controls
          autoPlay
          muted
          loop
          className="w-full max-h-96 object-contain"
          onError={handleError}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onLoadedData={handleCanPlay}
        >
          <source src={video.url} type="video/mp4" />
          <source src={video.url} type="video/webm" />
          Your browser doesn't support video playback.
        </video>
      </div>

      {/* Additional Info */}
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>FPS: {video.fps || 'N/A'}</span>
        {video.frameEnd !== -1 && (
          <span>
            Frames: {video.frameStart} - {video.frameEnd}
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

