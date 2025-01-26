import apiClient from './ApiClient';

export default {
    // Create a payment intent with Stripe
    createPaymentIntent(paymentData) {
        return apiClient.post('/payments/create-intent', {
            amount: paymentData.amount,
            currency: paymentData.currency || 'eur',
            planName: paymentData.planName,
            customerId: paymentData.customerId
        });
    },

    // Create subscription
    createSubscription(subscriptionData) {
        return apiClient.post('/payments/create-subscription', {
            paymentMethodId: subscriptionData.paymentMethodId,
            planId: subscriptionData.planId,
            userId: subscriptionData.userId,
            planDetails: {
                name: subscriptionData.planDetails.name,
                price: subscriptionData.planDetails.price,
                interval: subscriptionData.planDetails.interval || 'month',
                email: subscriptionData.planDetails.email
            }
        });
    },

    // Get payment history
    getPaymentHistory() {
        return apiClient.get('/payments/history');
    },

    // Get subscription details
    getSubscriptionDetails(subscriptionId) {
        return apiClient.get(`/payments/subscription/${subscriptionId}`);
    },

    // Cancel subscription
    cancelSubscription(subscriptionId) {
        return apiClient.post('/payments/cancel-subscription', {
            subscriptionId
        });
    },

    // Update payment method
    updatePaymentMethod(paymentMethodId, customerId) {
        return apiClient.post('/payments/update-payment-method', {
            paymentMethodId,
            customerId
        });
    }
};
