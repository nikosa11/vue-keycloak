<template>
    <div class="grid">
        <!-- Header/Breadcrumbs -->
        <div class="col-12 mb-2">
            <div class="flex justify-content-between align-items-center">
                <div class="flex align-items-center gap-2">
                    <!-- Κουμπί επιστροφής στο μενού -->
                    <Button 
                        icon="pi pi-bars" 
                        text 
                        rounded 
                        @click="$emit('toggle-menu')"
                        class="md:hidden"
                    />
                    
                    <!-- Κουμπί πίσω για mobile chat -->
                    <Button 
                        v-if="isMobile && showMobileChat"
                        icon="pi pi-arrow-left" 
                        text 
                        rounded 
                        @click="closeMobileChat"
                        tooltip="Πίσω στις συνομιλίες"
                    />
                    
                    <h5 class="m-0">Μηνύματα</h5>
                </div>

                <!-- Κουμπί επιστροφής στην αρχική -->
                <Button 
                    label="Αρχική" 
                    icon="pi pi-home" 
                    text
                    @click="$router.push('/')" 
                    class="hidden md:inline-flex"
                />
            </div>
        </div>

        <!-- Mobile Layout -->
        <div class="col-12 block md:hidden">
            <!-- Chat List View -->
            <div v-show="!showMobileChat" class="card">
                <div class="flex justify-content-between align-items-center mb-3">
                    <h5 class="m-0">Συνομιλίες</h5>
                    <Button icon="pi pi-plus" rounded text aria-label="Νέα συνομιλία" @click="openNewChat" />
                </div>
                
                <div class="chat-list">
                    <ProgressSpinner v-if="loading" class="flex align-items-center justify-content-center" />
                    <div v-else-if="chats.length === 0" class="text-center p-3">
                        <i class="pi pi-inbox text-xl mb-3"></i>
                        <div>Δεν υπάρχουν συνομιλίες</div>
                    </div>
                    <div v-else v-for="chat in chats" 
                         :key="chat.id" 
                         class="chat-item p-3 cursor-pointer"
                         @click="openMobileChat(chat)">
                        <div class="flex align-items-center">
                            <Avatar :image="`/demo/images/avatar/${chat.avatar}`" :alt="chat.name" size="large" shape="circle" />
                            <div class="ml-3 flex-grow-1">
                                <div class="font-bold">{{ chat.name }}</div>
                                <div class="text-500 text-sm">{{ chat.lastMessage }}</div>
                            </div>
                            <Badge v-if="chat.unread" :value="chat.unread" severity="danger" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile Chat View -->
            <Sidebar v-model:visible="showMobileChat" 
                    position="right" 
                    :modal="false" 
                    class="w-full p-0">
                <template #header>
                    <div class="flex align-items-center p-3 border-bottom-1 surface-border w-full">
                        <Button icon="pi pi-arrow-left" 
                                text 
                                rounded 
                                class="mr-3"
                                @click="closeMobileChat" />
                        <div v-if="selectedChat" class="flex align-items-center">
                            <Avatar :image="`/demo/images/avatar/${selectedChat.avatar}`" 
                                    size="large" 
                                    shape="circle" />
                            <div class="ml-3">
                                <div class="font-bold">{{ selectedChat.name }}</div>
                                <div class="text-500 text-sm">{{ selectedChat.status }}</div>
                            </div>
                        </div>
                    </div>
                </template>

                <div v-if="selectedChat" class="h-full flex flex-column">
                    <div class="chat-messages flex-grow-1 p-3" ref="messageContainer">
                        <div v-for="message in selectedChat.messages" 
                             :key="message.id"
                             class="message-item mb-3"
                             :class="{ 'sent': message.sent }">
                            <div class="message-content p-3">
                                {{ message.text }}
                                <div class="message-time text-500 text-sm">
                                    {{ formatMessageTime(message.timestamp) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="chat-input p-3 border-top-1 surface-border">
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
            </Sidebar>
        </div>

        <!-- Desktop Layout (unchanged) -->
        <div class="hidden md:block col-12 md:col-4">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-3">
                    <h5 class="m-0">Συνομιλίες</h5>
                    <Button icon="pi pi-plus" rounded text aria-label="Νέα συνομιλία" @click="openNewChat" />
                </div>
                
                <div class="chat-list">
                    <ProgressSpinner v-if="loading" class="flex align-items-center justify-content-center" />
                    <div v-else-if="chats.length === 0" class="text-center p-3">
                        <i class="pi pi-inbox text-xl mb-3"></i>
                        <div>Δεν υπάρχουν συνομιλίες</div>
                    </div>
                    <div v-else v-for="chat in chats" 
                         :key="chat.id" 
                         class="chat-item p-3 cursor-pointer"
                         :class="{ 'active': selectedChat?.id === chat.id }"
                         @click="selectChat(chat)">
                        <div class="flex align-items-center">
                            <Avatar :image="`/demo/images/avatar/${chat.avatar}`" :alt="chat.name" size="large" shape="circle" />
                            <div class="ml-3 flex-grow-1">
                                <div class="font-bold">{{ chat.name }}</div>
                                <div class="text-500 text-sm">{{ chat.lastMessage }}</div>
                            </div>
                            <Badge v-if="chat.unread" :value="chat.unread" severity="danger" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="hidden md:block col-12 md:col-8">
            <div v-if="selectedChat" class="card">
                <div class="chat-messages p-3" ref="messageContainer">
                    <div v-for="message in selectedChat.messages" 
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
            <div v-else class="card flex align-items-center justify-content-center min-h-400">
                <div class="text-center">
                    <i class="pi pi-comments text-xl mb-3"></i>
                    <div>Επιλέξτε μια συνομιλία για να ξεκινήσετε</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChatService from '@/service/ChatService';

export default {
    data() {
        return {
            chats: [],
            selectedChat: null,
            newMessage: '',
            loading: false,
            showMobileChat: false
        }
    },
    async created() {
        this.loading = true;
        try {
            this.chats = await ChatService.getChats();
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async sendMessage() {
            if (!this.newMessage.trim() || !this.selectedChat) return;

            const message = {
                chatId: this.selectedChat.id,
                text: this.newMessage,
                timestamp: new Date().toISOString(),
                sent: true
            };

            try {
                await ChatService.sendMessage(message);
                this.selectedChat.messages.push(message);
                this.newMessage = '';
            } catch (error) {
                console.error('Error sending message:', error);
            }
        },
        selectChat(chat) {
            this.selectedChat = chat;
            if (this.isMobile) {
                this.showMobileChat = true;
            }
        },
        formatMessageTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString('el-GR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        },
        openMobileChat(chat) {
            this.selectChat(chat);
            this.showMobileChat = true;
        },
        closeMobileChat() {
            this.showMobileChat = false;
            this.selectedChat = null;
        }
    },
    computed: {
        isMobile() {
            return window.innerWidth < 768;
        }
    }
};
</script>

<style lang="scss" scoped>
/* Προσθήκη στυλ για το header */
.header-buttons {
    .p-button {
        margin-right: 0.5rem;
    }
}

/* Mobile specific styles */
@media screen and (max-width: 768px) {
    .header-buttons {
        .p-button {
            padding: 0.5rem;
        }
    }
}

/* Mobile specific styles */
:deep(.p-sidebar) {
    height: 100vh !important;
    
    .p-sidebar-header {
        padding: 0;
    }
    
    .p-sidebar-content {
        padding: 0;
        display: flex;
        flex-direction: column;
    }
}

.chat-messages {
    height: calc(100vh - 130px);
    overflow-y: auto;
}

.message-item {
    display: flex;
    margin-bottom: 1rem;
    
    &.sent {
        justify-content: flex-end;
        
        .message-content {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
            border-radius: 1rem 1rem 0 1rem;
            max-width: 80%;
        }
    }
    
    &:not(.sent) .message-content {
        background-color: var(--surface-200);
        border-radius: 1rem 1rem 1rem 0;
        max-width: 80%;
    }
}

/* Προσθήκη animation για smooth transitions */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>