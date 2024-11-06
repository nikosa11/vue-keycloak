export class ChatService {
    async getChats() {
        try {
            const response = await fetch('/demo/data/chats.json');
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error loading chats:', error);
            throw error;
        }
    }

    async getChatMessages(chatId) {
        return this.getChats()
            .then(chats => {
                const chat = chats.find(c => c.id === chatId);
                return chat ? chat.messages : [];
            });
    }

    async sendMessage(chatId, message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Date.now(),
                    text: message.text,
                    timestamp: new Date().toISOString(),
                    sent: true
                });
            }, 500);
        });
    }

    async uploadFile(chatId, file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/chats/${chatId}/files`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    }

    async markAsRead(chatId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 300);
        });
    }
} 