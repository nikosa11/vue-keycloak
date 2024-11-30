import apiClient from './ApiClient';

// Mock data for carousel influencers
const mockCarouselInfluencers = {
    data: [
        {
            id: 1,
            name: 'Sarah Johnson',
            category: 'Lifestyle',
            followers: '250K',
            engagement: '4.5%',
            description: 'Lifestyle and wellness influencer sharing daily inspiration',
            image: 'https://picsum.photos/200?random=1'
        },
        {
            id: 2,
            name: 'Mike Chen',
            category: 'Tech',
            followers: '500K',
            engagement: '3.8%',
            description: 'Tech reviewer and digital lifestyle expert',
            image: 'https://picsum.photos/200?random=2'
        },
        {
            id: 3,
            name: 'Emma Davis',
            category: 'Fashion',
            followers: '750K',
            engagement: '5.2%',
            description: 'Fashion and style tips for the modern woman',
            image: 'https://picsum.photos/200?random=3'
        },
        {
            id: 4,
            name: 'Alex Rodriguez',
            category: 'Fitness',
            followers: '300K',
            engagement: '6.1%',
            description: 'Fitness trainer and nutrition specialist',
            image: 'https://picsum.photos/200?random=4'
        }
    ]
};

export default {
    getInfluencers() {
        return apiClient.get('/influencers/list');
    },
    getInfluencerProfile(id) {
        return apiClient.get(`/influencers/${id}`);
    },
    getCarouselInfluencers() {
        // Return mock data for now
        return Promise.resolve(mockCarouselInfluencers);
        
        // TODO: Uncomment when backend is ready
        // return apiClient.get('/home/carousel');
    },
    getCampaignProposals() {
        return apiClient.get('/campaigns/proposals');
    },
    getBasicStats() {
        return apiClient.get('/stats/basic');
    }
};