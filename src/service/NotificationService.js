import { ApiService } from '@/common/apiService';

export default class NotificationService {
    static apiService = new ApiService();

    static async getUnreadCount() {
        // For testing purposes, return a fixed number
        return 3;
    }

    static async markAsRead(notificationId) {
        // TODO: Implement actual API call
        return true;
    }

    static async getNotifications() {
        // TODO: Replace with actual API call
        const dummyNotifications = [
            {
                id: 1,
                type: 'info',
                title: 'Νέα Καμπάνια',
                message: 'Μια νέα καμπάνια έχει δημιουργηθεί για το προϊόν σας.',
                time: '10 λεπτά πριν',
                read: false
            },
            {
                id: 2,
                type: 'success',
                title: 'Επιτυχής Πληρωμή',
                message: 'Η πληρωμή σας για την καμπάνια #12345 έχει επιβεβαιωθεί.',
                time: '1 ώρα πριν',
                read: false
            },
            {
                id: 3,
                type: 'warning',
                title: 'Ενημέρωση Προφίλ',
                message: 'Παρακαλούμε ενημερώστε τα στοιχεία του προφίλ σας.',
                time: '2 ώρες πριν',
                read: true
            }
        ];
        return dummyNotifications;
    }
}
