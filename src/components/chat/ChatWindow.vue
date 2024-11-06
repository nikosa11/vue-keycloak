<template>
    <div class="card h-full flex flex-column" v-if="chat">
        <div class="chat-messages flex-grow-1 p-3" ref="messageContainer">
            <div v-for="message in chat.messages" 
                 :key="message.id"
                 class="message-item mb-3"
                 :class="{ 'sent': message.sent }">
                <div class="message-content p-3">
                    <div v-if="message.file" class="file-attachment mb-2">
                        <i class="pi pi-file mr-2"></i>
                        <a :href="message.file.url" target="_blank">{{ message.file.name }}</a>
                    </div>
                    {{ message.text }}
                    <div class="message-time text-500 text-sm">
                        {{ formatMessageTime(message.timestamp) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="chat-input p-3 border-top-1 border-300">
            <div class="flex">
                <InputText 
                    v-model="newMessage" 
                    placeholder="Γράψτε ένα μήνυμα..."
                    class="flex-1 mr-3"
                    @keyup.enter="sendMessage"
                />
                <Button icon="pi pi-send" rounded @click="sendMessage" />
            </div>
        </div>
    </div>
    <div class="card flex align-items-center justify-content-center" v-else>
        <div class="text-center">
            <i class="pi pi-comments text-xl mb-3"></i>
            <div>Επιλέξτε μια συνομιλία για να ξεκινήσετε</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        chat: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            newMessage: ''
        }
    },
    methods: {
        formatMessageTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString('el-GR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        },
        sendMessage() {
            if (!this.newMessage.trim()) return;
            
            this.$emit('send-message', {
                text: this.newMessage,
                chatId: this.chat.id
            });
            this.newMessage = '';
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                container.scrollTop = container.scrollHeight;
            });
        }
    },
    watch: {
        'chat.messages': {
            handler() {
                this.scrollToBottom();
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
.chat-messages {
    height: calc(100vh - 300px);
    overflow-y: auto;
    
    .message-item {
        display: flex;
        margin-bottom: 1rem;
        
        &.sent {
            justify-content: flex-end;
            
            .message-content {
                background-color: var(--primary-color);
                color: var(--primary-color-text);
                border-radius: 1rem 1rem 0 1rem;
            }
        }
        
        &:not(.sent) .message-content {
            background-color: var(--surface-200);
            border-radius: 1rem 1rem 1rem 0;
        }
    }
}

.file-attachment {
    padding: 0.5rem;
    background-color: var(--surface-100);
    border-radius: 0.5rem;
    
    a {
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
}
</style> 