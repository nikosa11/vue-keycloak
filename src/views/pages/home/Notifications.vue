<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Ειδοποιήσεις</h5>
                <div class="notifications-container">
                    <div v-for="notification in notifications" :key="notification.id" class="notification-item p-4 mb-3 border-round" :class="notification.type">
                        <div class="flex align-items-center">
                            <i :class="getNotificationIcon(notification.type)" style="font-size: 1.5rem; margin-right: 1rem;"></i>
                            <div class="flex-1">
                                <div class="flex justify-content-between align-items-center">
                                    <h6 class="m-0">{{ notification.title }}</h6>
                                    <span class="text-500">{{ notification.time }}</span>
                                </div>
                                <p class="mt-2 mb-0 line-height-3">{{ notification.message }}</p>
                            </div>
                        </div>
                        <div class="flex justify-content-end mt-3" v-if="!notification.read">
                            <Button label="Σήμανση ως αναγνωσμένο" class="p-button-text" @click="markAsRead(notification)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        
        const notifications = computed(() => store.state.notification.notifications);
        
        const getNotificationIcon = (type) => {
            switch (type) {
                case 'info':
                    return 'pi pi-info-circle text-blue-500';
                case 'success':
                    return 'pi pi-check-circle text-green-500';
                case 'warning':
                    return 'pi pi-exclamation-triangle text-orange-500';
                case 'error':
                    return 'pi pi-times-circle text-red-500';
                default:
                    return 'pi pi-info-circle';
            }
        };

        const markAsRead = async (notification) => {
            await store.dispatch('notification/markAsRead', notification.id);
        };

        // Load notifications when component is mounted
        store.dispatch('notification/fetchNotifications');

        return {
            notifications,
            getNotificationIcon,
            markAsRead
        };
    }
};
</script>

<style lang="scss" scoped>
.notifications-container {
    max-height: 600px;
    overflow-y: auto;
}

.notification-item {
    background-color: var(--surface-card);
    transition: all 0.3s;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &.info {
        border-left: 4px solid var(--blue-500);
    }

    &.success {
        border-left: 4px solid var(--green-500);
    }

    &.warning {
        border-left: 4px solid var(--orange-500);
    }

    &.error {
        border-left: 4px solid var(--red-500);
    }
}

h6 {
    font-size: 1.1rem;
    color: var(--text-color);
}

.text-500 {
    font-size: 0.875rem;
}
</style>
