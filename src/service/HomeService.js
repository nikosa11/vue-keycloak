import apiClient from './ApiClient';

export default {
    getCarouselInfluencers() {
        return apiClient.get('/home/carousel');
    }
};