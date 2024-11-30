import apiClient from './ApiClient';

export default {
    getSubscriptionPlans() {
        return apiClient.get('/user/profile');
    },
    upgradePlan(planName) {
        return apiClient.post('/user/upgrade-plan', { plan: planName });
    }
};
