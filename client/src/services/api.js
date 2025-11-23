import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('API Error:', error.response ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        } : error.message);
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        console.log('Registering user with data:', userData);
        try {
            const response = await api.post('/auth/register', userData);
            console.log('Registration successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
    }
};

export default api; 