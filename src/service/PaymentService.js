import apiClient from './ApiClient';

export default {
    // Create a payment intent with Stripe
    createPaymentIntent(amount, currency = 'eur') {
        return apiClient.post('/payments/create-intent', {
            amount,
            currency
        });
    },

    // Process subscription payment
    processSubscriptionPayment(planId) {
        return apiClient.post('/payments/process-subscription', {
            planId
        });
    },

    // Get payment history
    getPaymentHistory() {
        return apiClient.get('/payments/history');
    },

    // Get subscription details
    getSubscriptionDetails() {
        return apiClient.get('/payments/subscription');
    },

    // Cancel subscription
    cancelSubscription() {
        return apiClient.post('/payments/cancel-subscription');
    },

    // Update payment method
    updatePaymentMethod(paymentMethodId) {
        return apiClient.post('/payments/update-payment-method', {
            paymentMethodId
        });
    }
};
