import wlaslData from '../data/wlasl.json';

// Build index for fast lookup on initialization
let wlaslIndex = null;
let allWords = [];

/**
 * Initialize WLASL index for fast lookups
 */
const initializeIndex = () => {
  if (wlaslIndex) return; // Already initialized

  wlaslIndex = {};
  allWords = [];

  wlaslData.forEach(entry => {
    const normalizedGloss = entry.gloss.toLowerCase().trim();
    wlaslIndex[normalizedGloss] = entry;
    allWords.push(normalizedGloss);
  });

  console.log(`WLASL initialized with ${allWords.length} words`);
};

/**
 * Search for a word in WLASL dataset
 * @param {string} query - The word to search for
 * @returns {Object|null} Sign data with videos or null
 */
export const searchWLASL = (query) => {
  initializeIndex();

  const normalizedQuery = query.toLowerCase().trim();
  const exactMatch = wlaslIndex[normalizedQuery];

  if (exactMatch) {
    return {
      word: exactMatch.gloss,
      found: true,
      videos: exactMatch.instances.map(instance => ({
        url: instance.url,
        source: instance.source,
        signerId: instance.signer_id,
        bbox: instance.bbox,
        fps: instance.fps,
        frameStart: instance.frame_start,
        frameEnd: instance.frame_end,
        instanceId: instance.instance_id,
        videoId: instance.video_id,
        split: instance.split
      }))
    };
  }

  return null;
};

/**
 * Get suggestions for partial matches
 * @param {string} query - Partial query
 * @param {number} limit - Maximum number of suggestions
 * @returns {Array<string>} Array of suggested words
 */
export const getSuggestions = (query, limit = 10) => {
  initializeIndex();

  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return [];

  // Find words that start with the query
  const suggestions = allWords
    .filter(word => word.startsWith(normalizedQuery))
    .slice(0, limit);

  return suggestions;
};

/**
 * Get a specific sign by word (convenience method)
 * @param {string} word - The word to look up
 * @returns {Object|null} Sign data or null
 */
export const getSign = (word) => {
  return searchWLASL(word);
};

/**
 * Batch load signs for multiple words
 * @param {Array<string>} words - Array of words to load
 * @returns {Object} Object mapping word to sign data
 */
export const batchLoadSigns = (words) => {
  initializeIndex();

  const results = {};

  words.forEach(word => {
    const sign = searchWLASL(word);
    results[word] = sign;
  });

  return results;
};

/**
 * Get all available words in the dataset
 * @returns {Array<string>} Array of all words
 */
export const getAllWords = () => {
  initializeIndex();
  return [...allWords].sort();
};

/**
 * Get random words from the dataset
 * @param {number} count - Number of random words to get
 * @returns {Array<string>} Array of random words
 */
export const getRandomWords = (count = 10) => {
  initializeIndex();

  const shuffled = [...allWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Check if a word exists in the dataset
 * @param {string} word - Word to check
 * @returns {boolean} True if word exists
 */
export const hasWord = (word) => {
  initializeIndex();
  return wlaslIndex.hasOwnProperty(word.toLowerCase().trim());
};

/**
 * Get dataset statistics
 * @returns {Object} Statistics about the dataset
 */
export const getStats = () => {
  initializeIndex();

  let totalVideos = 0;
  const sources = new Set();

  wlaslData.forEach(entry => {
    totalVideos += entry.instances.length;
    entry.instances.forEach(instance => {
      sources.add(instance.source);
    });
  });

  return {
    totalWords: allWords.length,
    totalVideos,
    sources: Array.from(sources),
    averageVideosPerWord: (totalVideos / allWords.length).toFixed(2)
  };
};

export default {
  searchWLASL,
  getSuggestions,
  getSign,
  batchLoadSigns,
  getAllWords,
  getRandomWords,
  hasWord,
  getStats
};

