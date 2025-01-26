import NotificationService from '@/service/NotificationService';

export const notification = {
    namespaced: true,
    state: {
        notifications: [],
        unreadCount: 0
    },
    mutations: {
        SET_NOTIFICATIONS(state, notifications) {
            state.notifications = notifications;
            state.unreadCount = notifications.filter(n => !n.read).length;
        },
        MARK_AS_READ(state, notificationId) {
            const notification = state.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                state.unreadCount = state.notifications.filter(n => !n.read).length;
            }
        }
    },
    actions: {
        async fetchNotifications({ commit }) {
            try {
                const notifications = await NotificationService.getNotifications();
                commit('SET_NOTIFICATIONS', notifications);
                return notifications;
            } catch (error) {
                console.error('Error fetching notifications:', error);
                return [];
            }
        },
        async markAsRead({ commit }, notificationId) {
            try {
                await NotificationService.markAsRead(notificationId);
                commit('MARK_AS_READ', notificationId);
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    },
    getters: {
        unreadNotifications: state => state.notifications.filter(n => !n.read),
        unreadCount: state => state.unreadCount
    }
};
