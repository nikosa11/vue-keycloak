<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-3">
            <h5 class="m-0">Συνομιλίες</h5>
            <Button icon="pi pi-plus" rounded text aria-label="Νέα συνομιλία" @click="$emit('new-chat')" />
        </div>
        
        <div class="chat-list">
            <ProgressSpinner v-if="loading" />
            <div v-else v-for="chat in chats" 
                 :key="chat.id" 
                 class="chat-item p-3 cursor-pointer"
                 :class="{ 'active': selectedChat?.id === chat.id }"
                 @click="$emit('select-chat', chat)">
                <div class="flex align-items-center">
                    <Avatar :image="`/demo/images/avatar/${chat.avatar}`" size="large" shape="circle" />
                    <div class="ml-3 flex-grow-1">
                        <div class="font-bold">{{ chat.name }}</div>
                        <div class="text-500 text-sm">{{ chat.lastMessage }}</div>
                    </div>
                    <Badge v-if="chat.unread" :value="chat.unread" severity="danger" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        chats: {
            type: Array,
            required: true
        },
        selectedChat: {
            type: Object,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.chat-list {
    height: calc(100vh - 200px);
    overflow-y: auto;
    
    .chat-item {
        border-radius: 1rem;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: var(--surface-100);
        }
        
        &.active {
            background-color: var(--surface-200);
        }
    }
}
</style> 