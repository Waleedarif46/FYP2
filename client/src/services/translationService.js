import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const translationService = {
    // Send image for translation (used for uploaded images)
    translateImage: async (imageData) => {
        try {
            const response = await axios.post(`${API_URL}/translate`, {
                image: imageData
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Translation failed');
        }
    },

    // Send image for real-time translation (uses dedicated endpoint for webcam frames)
    translateRealtimeImage: async (imageData) => {
        try {
            const response = await axios.post(`${API_URL}/translate/realtime`, {
                image: imageData
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Real-time translation failed');
        }
    },

    // Send feedback for translation
    sendFeedback: async (feedbackData) => {
        try {
            const response = await axios.post(`${API_URL}/feedback`, feedbackData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to send feedback');
        }
    }
}; 