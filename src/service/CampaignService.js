import apiClient from './ApiClient';

export default {
    getCampaigns() {
        return apiClient.get('/campaigns/list');
    },
    getProposals() {
        return apiClient.get('/campaigns/proposals');
    },
    getPortfolio() {
        return apiClient.get('/campaigns/portfolio');
    }
};