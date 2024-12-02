<template>
  <div class="stripe-form">
    <div class="form-row">
      <div id="card-element">
        <!-- A Stripe Element will be inserted here. -->
      </div>
      <!-- Used to display form errors. -->
      <div id="card-errors" role="alert"></div>
    </div>
    <Button 
      :label="loading ? 'Processing...' : 'Pay Now'" 
      :disabled="loading"
      @click="handleSubmit"
      class="p-button-raised p-button-rounded"
    />
  </div>
</template>

<script>
export default {
  name: 'StripePaymentForm',
  props: {
    clientSecret: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      stripe: null,
      elements: null,
      card: null
    };
  },
  async mounted() {
    try {
      // Initialize Stripe
      const stripe = window.Stripe('your_publishable_key'); // Use your actual publishable key
      this.stripe = stripe;
      
      // Create Elements instance
      this.elements = stripe.elements();

      // Create card element
      this.card = this.elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });

      // Mount card element
      this.card.mount('#card-element');

      // Handle real-time validation errors
      this.card.addEventListener('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to initialize payment system',
        life: 3000
      });
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.stripe || !this.card) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Payment system not initialized',
          life: 3000
        });
        return;
      }

      this.loading = true;
      const displayError = document.getElementById('card-errors');
      
      try {
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: this.card
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        this.$emit('payment-success', paymentIntent);
      } catch (err) {
        displayError.textContent = err.message;
        this.$emit('payment-error', err);
      } finally {
        this.loading = false;
      }
    }
  },
  beforeDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }
};
</script>

<style scoped>
.stripe-form {
  padding: 20px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
}

#card-element {
  margin-bottom: 24px;
  padding: 12px;
  border: 1px solid #e6ebf1;
  border-radius: 4px;
  background: white;
}

#card-errors {
  color: #fa755a;
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}

button {
  margin-top: 20px;
}
</style>
