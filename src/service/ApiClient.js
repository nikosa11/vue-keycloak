import axios from 'axios';

const API_BASE_URL = '/api'; // Using Vite proxy

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 10000,
});

// Add request interceptor for handling errors
apiClient.interceptors.request.use(
    config => {
        // You can add auth token here if needed
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling errors
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;