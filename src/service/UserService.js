import apiClient from './ApiClient';

export default {
    getProfile() {
        return apiClient.get('/user/profile');
    },
    updateProfile(profileData) {
        return apiClient.put('/user/profile', profileData);
    },
    changeSubscription(planName) {
        return apiClient.post('/user/subscription/change', null, {
            params: { plan_name: planName }
        });
    },
    getSettings() {
        return apiClient.get('/user/settings');
    }
};