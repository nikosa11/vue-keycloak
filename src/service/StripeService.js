import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default class StripeService {
    // Create a payment intent
    async createPaymentIntent(paymentData) {
        try {
            const response = await axios.post(`${API_URL}/api/create-payment-intent`, {
                amount: paymentData.amount,
                currency: paymentData.currency || 'usd',
                planName: paymentData.planName,
                customerId: paymentData.customerId
            });
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw this.handleError(error);
        }
    }

    // Create a subscription
    async createSubscription(subscriptionData) {
        try {
            const response = await axios.post(`${API_URL}/api/confirm-subscription`, {
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
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw this.handleError(error);
        }
    }

    // Cancel a subscription
    async cancelSubscription(subscriptionId) {
        try {
            const response = await axios.post(`${API_URL}/api/cancel-subscription`, {
                subscriptionId
            });
            return response.data;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw this.handleError(error);
        }
    }

    // Get subscription details
    async getSubscriptionDetails(subscriptionId) {
        try {
            const response = await axios.get(`${API_URL}/api/subscription/${subscriptionId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting subscription details:', error);
            throw this.handleError(error);
        }
    }

    // Update payment method
    async updatePaymentMethod(paymentMethodId, customerId) {
        try {
            const response = await axios.post(`${API_URL}/api/update-payment-method`, {
                paymentMethodId,
                customerId
            });
            return response.data;
        } catch (error) {
            console.error('Error updating payment method:', error);
            throw this.handleError(error);
        }
    }

    // Handle API errors
    handleError(error) {
        if (error.response) {
            // Server responded with error
            return {
                message: error.response.data.detail || 'An error occurred with the payment service',
                status: error.response.status,
                data: error.response.data
            };
        } else if (error.request) {
            // Request made but no response
            return {
                message: 'Unable to connect to payment service',
                status: 0
            };
        } else {
            // Error setting up request
            return {
                message: error.message,
                status: 0
            };
        }
    }
}
