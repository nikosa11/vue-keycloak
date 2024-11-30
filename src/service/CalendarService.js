import apiClient from './ApiClient';

export default {
    getEvents(startDate, endDate) {
        return apiClient.get('/calendar/events', {
            params: { start_date: startDate, end_date: endDate }
        });
    },
    createEvent(event) {
        return apiClient.post('/calendar/events', event);
    },
    updateEvent(eventId, event) {
        return apiClient.put(`/calendar/events/${eventId}`, event);
    },
    deleteEvent(eventId) {
        return apiClient.delete(`/calendar/events/${eventId}`);
    }
};