import apiClient from './ApiClient';

const ChatService = {
    async getChats() {
        const response = await apiClient.get('/chat/messages');
        return response.data.data;
    },

    async sendMessage(message) {
        return apiClient.post('/chat/send', message);
    },

    async getUnreadCount() {
        const response = await apiClient.get('/chat/unread');
        return response.data.unread_count;
    }
};

export default ChatService;