<template>
  <div class="profile-page">
    <div class="content">
      <div class="content__cover">
        <div class="content__avatar"></div>
        <div class="content__bull"><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="content__actions">
        <a href="#">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path fill="currentColor" d="M192 256A112 112 0 1 0 80 144a111.94 111.94 0 0 0 112 112zm76.8 32h-8.3a157.53 157.53 0 0 1-68.5 16c-24.6 0-47.6-6-68.5-16h-8.3A115.23 115.23 0 0 0 0 403.2V432a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48v-28.8A115.23 115.23 0 0 0 268.8 288z"></path>
            <path fill="currentColor" d="M480 256a96 96 0 1 0-96-96 96 96 0 0 0 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592a48 48 0 0 0 48-48 111.94 111.94 0 0 0-112-112z"></path>
          </svg>
          <span>Connect</span>
        </a>
        <a href="#">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path fill="currentColor" d="M208 352c-41 0-79.1-9.3-111.3-25-21.8 12.7-52.1 25-88.7 25a7.83 7.83 0 0 1-7.3-4.8 8 8 0 0 1 1.5-8.7c.3-.3 22.4-24.3 35.8-54.5-23.9-26.1-38-57.7-38-92C0 103.6 93.1 32 208 32s208 71.6 208 160-93.1 160-208 160z"></path>
            <path fill="currentColor" d="M576 320c0 34.3-14.1 66-38 92 13.4 30.3 35.5 54.2 35.8 54.5a8 8 0 0 1 1.5 8.7 7.88 7.88 0 0 1-7.3 4.8c-36.6 0-66.9-12.3-88.7-25-32.2 15.8-70.3 25-111.3 25-86.2 0-160.2-40.4-191.7-97.9A299.82 299.82 0 0 0 208 384c132.3 0 240-86.1 240-192a148.61 148.61 0 0 0-1.3-20.1C522.5 195.8 576 253.1 576 320z"></path>
          </svg>
          <span>Message</span>
        </a>
      </div>
      <div class="content__title">
        <h1>{{ userData.name }}</h1><span>New York, United States</span>
      </div>
      <div class="content__description">
        <p><span class="p-menuitem-icon pi pi-fw pi-envelope" data-pc-section="headericon"></span> {{ userData.email }}</p>
        <p><span class="p-menuitem-icon pi pi-fw pi-user" data-pc-section="icon"></span> Username: {{ userData.preferred_username }}</p>
      </div>
      <ul class="content__list">
        <li><span>65</span>Projects</li>
        <li><span>43</span>News</li>
        <li><span>21</span>Comments</li>
      </ul>
      <div class="content__button">
        <a class="button" @click="changePassword">
          <div class="button__border"></div>
          <div class="button__bg"></div>
          <p class="button__text"> Change Password <span class="p-menuitem-icon pi pi-fw pi-user-edit" data-pc-section="icon"></span></p>
        </a>
      </div>
      <div class="content__header">
        <h1 class="button__text">Your Plan</h1>
      </div>
      <div class="package-container" v-if="subscriptionData.currentPlan">
        <SubscriptionPlan 
          :planName="subscriptionData.currentPlan.name || ''"
          :price="subscriptionData.currentPlan.price || ''"
          :features="subscriptionData.currentPlan.features || []"
          :planClass="subscriptionData.currentPlan.class || 'basic'"
          :showButton="false"
        />
      </div>
      <div v-if="showOptions && subscriptionData.availablePlans.length > 0">
        <div class="content__header">
          <h1 class="button__text">Subscription Options</h1>
        </div>
        <div class="package-container">
          <SubscriptionPlan 
            v-for="(plan, index) in subscriptionData.availablePlans"
            :key="index"
            :planName="plan.name"
            :price="plan.price"
            :features="plan.features"
            :planClass="plan.class"
            :buttonName="getButtonName(plan.price)"
            :buttonClass="plan.buttonClass"
            :showButton="true"
            @upgrade="upgradePlan(plan.name)"
            />    
        </div>
      </div>
      <div class="content__button">
        <a class="button" @click="toggleOptions">
          <div class="button__border"></div>
          <div class="button__bg"></div>
          <p class="button__text">
            {{ showOptions ? 'View Less Options' : 'View More Options' }}
            <span :class="showOptions ? 'pi pi-fw pi-arrow-up' : 'pi pi-fw pi-arrow-down'" data-pc-section="icon"></span>
          </p>
        </a>
      </div>
      <Dialog 
        v-model:visible="showPaymentForm" 
        modal 
        header="Complete Payment"
        :style="{ width: '450px' }"
        :closable="!loading"
      >
        <div class="payment-form">
          <div id="card-element"></div>
          <small class="text-gray-500 mb-4 block">
            Test card: 4242 4242 4242 4242, any future date, any CVC
          </small>
          <Button 
            label="Pay Now" 
            @click="processPayment" 
            :loading="loading"
            class="w-full p-button-primary" 
          />
        </div>
      </Dialog>
    </div>
    <div class="bg">
      <div><span></span><span></span><span></span><span></span><span></span><span></span></div>
    </div>
    <div class="theme-switcher-wrapper" id="theme-switcher-wrapper"><span>Themes color</span>
      <ul>
        <li><em class="is-active" data-theme="orange"></em></li>
        <li><em data-theme="green"></em></li>
        <li><em data-theme="purple"></em></li>
        <li><em data-theme="blue"></em></li>
      </ul>
    </div>
    <div class="theme-switcher-button" id="theme-switcher-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path fill="currentColor" d="M352 0H32C14.33 0 0 14.33 0 32v224h384V32c0-17.67-14.33-32-32-32zM0 320c0 35.35 28.66 64 64 64h64v64c0 35.35 28.66 64 64 64s64-28.65 64-64v-64h64c35.34 0 64-28.65 64-64v-32H0v32zm192 104c13.25 0 24 10.74 24 24 0 13.25-10.75 24-24 24s-24-10.75-24-24c0-13.26 10.75-24 24-24z"></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js'
import SubscriptionPlan from '@/views/pages/home/SubscriptionPlan.vue';
import SubscriptionService from '@/service/SubscriptionService';
import PaymentService from '@/service/PaymentService';
import { loadStripe } from '@stripe/stripe-js';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { stripeConfig } from '/appProperties';

const stripePromise = loadStripe('pk_test_51QRXL2F0LfKzo9PhsYqfKopm51KXvM1g6EGbB3Z8QggoMTA3dzsJCvQlfvhE4E4jMpzyaHAwkrHJMQ5gOF2AzM0k00d4dGWyQx'); // Replace with your Stripe publishable key

export default {
  components: {
    SubscriptionPlan,
    Button,
    Dialog
  },
  data() {
    return {
      showOptions: false,
      userData: {},
      subscriptionData: {
        currentPlan: null,
        availablePlans: []
      },
      loading: false,
      error: null,
      showPaymentForm: false,
      stripe: null,
      elements: null,
      card: null,
      selectedPlan: null,
      currentSubscription: null,

    };
  },
  methods: {
    changePassword() {
      this.router.push('/auth/changePassword');
    },
    getButtonName(price) {
      if (!this.subscriptionData.currentPlan?.price) return 'Upgrade';
      const userPrice = parseFloat(this.subscriptionData.currentPlan.price.replace('$', ''));
      const planPrice = parseFloat(price.replace('$', ''));
      return planPrice > userPrice ? 'Upgrade' : 'Downgrade';
    },
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
    async fetchUserData() {
      try {
        const response = await this.apiService.getUserInfo();
        this.$store.commit('setUserData', response);
        this.userData = this.$store.state.userData;
      } catch (error) {
        // localStorage.removeItem('jwtToken');
        // localStorage.removeItem('jwtRefreshToken');
        // localStorage.removeItem('username');
        // this.router.push('/');
      }
    },
    async fetchSubscriptionPlans() {
      try {
        const response = await SubscriptionService.getSubscriptionPlans();
        if (response.data.subscriptionData) {
          this.subscriptionData = response.data.subscriptionData;
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load subscription plans', life: 3000 });
      }
    },
    async upgradePlan(planName) {
      console.log('Upgrade plan to:', planName);
      this.selectedPlan = this.subscriptionData.availablePlans.find(p => p.name === planName);
      this.showPaymentForm = true;
      await this.initializeStripe();
    },
    async initializeStripe() {
      this.stripe = await stripePromise;
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');

      // Listen for card input changes
      this.card.on('change', (event) => {
        if (event.error) {
          this.toast.add({
            severity: 'warn',
            summary: 'Card Error',
            detail: event.error.message,
            life: 3000
          });
        }
      });

      // Listen for card ready
      this.card.on('ready', () => {
        console.log('Stripe Card element is ready');
      });
    },
    async processPayment() {
  try {
    this.loading = true;
    console.log('Starting payment process...', this.selectedPlan);

    // 1. Create Payment Intent
    const { data: { clientSecret } } = await PaymentService.createPaymentIntent({
      amount: parseFloat(this.selectedPlan.price.replace('$', '')) * 100,
      currency: 'eur',
      planName: this.selectedPlan.name,
      customerId: this.userData?.stripeCustomerId
    });

    // 2. Create Payment Method with Stripe
    const { error: createError, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        name: this.userData.name,
        email: this.userData.email
      }
    });

    if (createError) {
      throw new Error(createError.message);
    }

    // 3. Confirm Card Payment with Stripe
    const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethod.id
      }
    );

    if (confirmError) {
      throw new Error(confirmError.message);
    }

    // 4. Create Subscription
    const { data: subscription } = await PaymentService.createSubscription({
      paymentMethodId: paymentMethod.id,
      planId: this.selectedPlan.stripePriceId,
      userId: this.userData.id,
      planDetails: {
        name: this.selectedPlan.name,
        price: Math.round(parseFloat(this.selectedPlan.price.replace('$', '')) * 100),
        interval: 'month',
        email: this.userData.email
      }
    });

    // 5. Success message
    this.toast.add({
      severity: 'success',
      summary: 'Subscription Activated',
      detail: `Successfully subscribed to ${this.selectedPlan.name} plan`,
      life: 3000
    });

    // 6. Cleanup and refresh data
    this.showPaymentForm = false;
    this.card.destroy();
    
    // 7. Refresh subscription data
    this.currentSubscription = subscription.currentPlan;

  } catch (error) {
    console.error('Payment error:', error);
    this.toast.add({
      severity: 'error',
      summary: 'Payment Failed',
      detail: error.response?.data?.message || error.message,
      life: 3000
    });
  } finally {
    this.loading = false;
  }
    }
  },
  async created() {
    this.toast = useToast();
    this.router = useRouter();
    this.apiService = new ApiService();
    await this.fetchUserData();
    await this.fetchSubscriptionPlans();
  }
};
</script>

<style scoped>
/* Προσαρμόστε τον CSS σύμφωνα με τις ανάγκες σας */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #fff;
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: rgba(0,0,0,0.6);
}

.profile-page {
  display: flex;
  min-height: 100vh;
  padding-top: 5rem;
}

@media (max-width: 990px) {
  .profile-page {
    padding-top: 0;
  }
}

.profile-page .content {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  width: 100%;
  position: relative;
  z-index: 2;
  margin: auto;
  padding: 2rem;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 15px 35px rgba(50,50,93,0.1), 0 5px 15px rgba(0,0,0,0.07);
}

@media (max-width: 990px) {
  .profile-page .content {
    max-width: 420px;
    padding: 0;
    border-radius: 0;
  }
}

.profile-page .content__cover {
  position: relative;
  background: linear-gradient(150deg, #1d8cf8 20%, #3358f4 100%);
}

.theme-orange .profile-page .content__cover {
  background: linear-gradient(150deg, #ff4086 20%, #fd8d76 100%);
}

.theme-purple .profile-page .content__cover {
  background: linear-gradient(150deg, #8700ff 20%, #f000ff 100%);
}

.theme-green .profile-page .content__cover {
  background: linear-gradient(150deg, #1dcc45 20%, #42b883 100%);
}

.theme-blue .profile-page .content__cover {
  background: linear-gradient(150deg, #0098f0 20%, #00f2c3 100%);
}

.profile-page .content__bull {
  display: none;
  height: 12rem;
  position: relative;
  overflow: hidden;
}

@media (max-width: 990px) {
  .profile-page .content__bull {
    display: block;
  }
}

.profile-page .content__bull span:nth-child(1) {
  display: block;
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  top: -6%;
  left: -3%;
  background: rgba(255,255,255,0.12);
}

.profile-page .content__bull span:nth-child(2) {
  display: block;
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  width: 8rem;
  height: 8rem;
  top: 18%;
  left: 18%;
  background: rgba(255,255,255,0.05);
}

.profile-page .content__bull span:nth-child(3) {
  display: block;
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  top: 8%;
  right: 2%;
  background: rgba(255,255,255,0.05);
}

.profile-page .content__bull span:nth-child(4) {
  display: block;
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  top: 28%;
  right: 12%;
  background: rgba(255,255,255,0.1);
}

.profile-page .content__bull span:nth-child(5) {
  display: block;
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  top: 70%;
  left: -6%;
  background: rgba(255,255,255,0.04);
}

.profile-page .content__avatar {
  width: 12rem;
  height: 12rem;
  position: absolute;
  bottom: 0;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, 50%);
  background: #8f6ed5 url("https://image.freepik.com/free-photo/friendly-brunette-looking-camera_23-2147774849.jpg") center center no-repeat;
  background-size: cover;
  border-radius: 50%;
  box-shadow: 0 15px 35px rgba(50,50,93,0.1), 0 5px 15px rgba(0,0,0,0.07);
}

@media (max-width: 990px) {
  .profile-page .content__avatar {
    width: 11rem;
    height: 11rem;
    border: 0.3rem solid #fff;
    box-shadow: none;
  }
}

.profile-page .content__actions {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
}

@media (max-width: 990px) {
  .profile-page .content__actions {
    padding: 0.8rem 2rem;
  }
}

.profile-page .content__actions a {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 3rem;
  padding: 0.2rem 1rem;
  border-radius: 2rem;
  text-decoration: none;
  font-size: 0.9rem;
}

@media (max-width: 990px) {
  .profile-page .content__actions a {
    padding: 0.5rem;
  }
}

@media (max-width: 990px) {
  .profile-page .content__actions a span {
    display: none;
  }
}

.profile-page .content__actions a svg {
  width: 2rem;
  margin-right: 0.4rem;
}

@media (max-width: 990px) {
  .profile-page .content__actions a svg {
    margin: 0;
  }
}

.profile-page .content__actions a svg path:last-child {
  opacity: 0.5;
}

.profile-page .content__actions a:first-child {
  color: #ff4086;
}

.theme-orange .profile-page .content__actions a:first-child {
  color: #ff4086;
}

.theme-purple .profile-page .content__actions a:first-child {
  color: #8700ff;
}

.theme-green .profile-page .content__actions a:first-child {
  color: #1dcc45;
}

.theme-blue .profile-page .content__actions a:first-child {
  color: #0098f0;
}

.profile-page .content__actions a:last-child {
  color: #d782d9;
}

.theme-orange .profile-page .content__actions a:last-child {
  color: #fd8d76;
}

.theme-purple .profile-page .content__actions a:last-child {
  color: #f000ff;
}

.theme-green .profile-page .content__actions a:last-child {
  color: #42b883;
}

.theme-blue .profile-page .content__actions a:last-child {
  color: #00f2c3;
}

.profile-page .content__actions a:hover:first-child {
  background: #1d8cf8;
  color: #fff;
}

.theme-orange .profile-page .content__actions a:hover:first-child {
  background: #ff4086;
}

.theme-purple .profile-page .content__actions a:hover:first-child {
  background: #8700ff;
}

.theme-green .profile-page .content__actions a:hover:first-child {
  background: #1dcc45;
}

.theme-blue .profile-page .content__actions a:hover:first-child {
  background: #0098f0;
}

.profile-page .content__actions a:hover:last-child {
  background: #1d8cf8;
  color: #fff;
}

.theme-orange .profile-page .content__actions a:hover:last-child {
  background: #fd8d76;
}

.theme-purple .profile-page .content__actions a:hover:last-child {
  background: #f000ff;
}

.theme-green .profile-page .content__actions a:hover:last-child {
  background: #42b883;
}

.theme-blue .profile-page .content__actions a:hover:last-child {
  background: #00f2c3;
}

.profile-page .content__title {
  margin-top: 4.5rem;
  text-align: center;
}

@media (max-width: 990px) {
  .profile-page .content__title {
    margin-top: 1.5rem;
  }
}

.profile-page .content__title h1 {
  margin-bottom: 0.1rem;
  font-size: 2.4rem;
}

@media (max-width: 990px) {
  .profile-page .content__title h1 {
    font-size: 1.8rem;
  }
}

.profile-page .content__title span {
  font-size: 1rem;
}

@media (max-width: 990px) {
  .profile-page .content__title span {
    font-size: 0.9rem;
  }
}

.profile-page .content__description {
  margin-top: 2.5rem;
  text-align: center;
}

@media (max-width: 990px) {
  .profile-page .content__description {
    margin-top: 1.5rem;
  }
}

.profile-page .content__description p {
  margin-bottom: 0.2rem;
  font-size: 1.2rem;
}

@media (max-width: 990px) {
  .profile-page .content__description p {
    font-size: 1rem;
  }
}

.profile-page .content__list {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  list-style-type: none;
}

@media (max-width: 990px) {
  .profile-page .content__list {
    margin-top: 1.5rem;
  }
}

.profile-page .content__list li {
  padding: 0 1.5rem;
  text-align: center;
  font-size: 1rem;
}

@media (max-width: 990px) {
  .profile-page .content__list li {
    font-size: 0.8rem;
  }
}

.profile-page .content__list li span {
  display: block;
  margin-bottom: 0.1rem;
  font-weight: bold;
  font-size: 1.6rem;
}

@media (max-width: 990px) {
  .profile-page .content__list li span {
    font-size: 1.2rem;
  }
}

.profile-page .content__header {
  margin: 3rem 0 0rem;
  border-radius: 17px;
  text-align: center;
  padding: 20px;
}

.profile-page .content__header h1 {
  color: rgb(0, 0, 0);
}

@media (max-width: 990px) {
  .profile-page .content__header {
    margin: 1.5rem 0 2.2rem;
  }
}

.profile-page .content__button {
  margin: 3rem 0 2rem;
  border-radius: 17px;
  text-align: center;
}

@media (max-width: 990px) {
  .profile-page .content__button {
    margin: 1.5rem 0 2.2rem;
  }
}

.profile-page .content__button .button {
  display: inline-block;
  padding: 1.2rem 12rem;
  text-align: center;
  text-decoration: none;
  background: linear-gradient(100deg, #1d8cf8 30%, #3358f4 100%);
  border-radius: 2rem;
  box-shadow: 0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0,0,0,0.08);
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
}

.theme-orange .profile-page .content__button .button {
  background: linear-gradient(100deg, #ff4086 10%, #fd8d76 100%);
}

.theme-purple .profile-page .content__button .button {
  background: linear-gradient(100deg, #8700ff 10%, #f000ff 100%);
}

.theme-green .profile-page .content__button .button {
  background: linear-gradient(100deg, #1dcc45 10%, #42b883 100%);
}

.theme-blue .profile-page .content__button .button {
  background: linear-gradient(100deg, #0098f0 10%, #00f2c3 100%);
}

.profile-page .content__button .button:hover {
  color: #fff;
}

@media (max-width: 990px) {
  .profile-page .content__button .button {
    padding: 1rem 1.4rem;
    font-size: 0.9rem;
  }
}

.profile-page .bg {
  width: 100%;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.profile-page .bg div {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
  background: linear-gradient(150deg, #1d8cf8 20%, #3358f4 100%);
}

.theme-orange .profile-page .bg div {
  background: linear-gradient(150deg, #ff4086 20%, #fd8d76 100%);
}

.theme-purple .profile-page .bg div {
  background: linear-gradient(150deg, #8700ff 20%, #f000ff 100%);
}

.theme-green .profile-page .bg div {
  background: linear-gradient(150deg, #1dcc45 20%, #42b883 100%);
}

.theme-blue .profile-page .bg div {
  background: linear-gradient(150deg, #0098f0 20%, #00f2c3 100%);
}

.profile-page .bg span {
  display: block;
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  animation: floating 34s infinite;
}

.profile-page .bg span:nth-child(1) {
  width: 11rem;
  height: 11rem;
  top: 30%;
  left: 16%;
  background: rgba(255,255,255,0.05);
  animation-duration: 34s;
}

.profile-page .bg span:nth-child(2) {
  width: 8rem;
  height: 8rem;
  top: 18%;
  left: 1%;
  background: rgba(255,255,255,0.12);
  animation-duration: 40s;
}

.profile-page .bg span:nth-child(3) {
  width: 8rem;
  height: 8rem;
  top: 34%;
  right: 10%;
  background: rgba(255,255,255,0.1);
  animation-duration: 38s;
}

.profile-page .bg span:nth-child(4) {
  width: 4rem;
  height: 4rem;
  top: 34%;
  right: 3%;
  background: rgba(255,255,255,0.2);
  animation-duration: 34s;
}

.profile-page .bg span:nth-child(5) {
  width: 12rem;
  height: 12rem;
  top: 42%;
  right: 28%;
  background: rgba(255,255,255,0.1);
  animation-duration: 40s;
}

.profile-page .bg span:nth-child(6) {
  width: 8rem;
  height: 8rem;
  top: 72%;
  left: 6%;
  background: rgba(255,255,255,0.05);
  animation-duration: 38s;
}

.profile-page .bg span:nth-child(7) {
  width: 4rem;
  height: 4rem;
  top: 82%;
  right: 8%;
  background: rgba(255,255,255,0.05);
  animation-duration: 34s;
}

.theme-switcher-button {
  position: fixed;
  top: calc(50% - 3.6rem);
  right: 0;
  z-index: 2;
  padding: 1rem;
  background: rgba(0,0,0,0.6);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  font-size: inherit;
  color: #fd7686;
  cursor: pointer;
}

.theme-orange .theme-switcher-button {
  color: #fd7686;
}

.theme-purple .theme-switcher-button {
  color: #80f;
}

.theme-green .theme-switcher-button {
  color: #42b883;
}

.theme-blue .theme-switcher-button {
  color: #1d8cf8;
}

.theme-switcher-button svg {
  width: 1.1rem;
}

.theme-switcher-wrapper {
  width: 200px;
  position: fixed;
  top: calc(50% - 5rem);
  right: 5rem;
  z-index: 2;
  padding: 1.5rem 0;
  background: linear-gradient(#222a42, #1d253b);
  box-shadow: 0 10px 50px 0 rgba(0,0,0,0.2);
  border-radius: 0.25rem;
  opacity: 0;
  text-align: center;
  font-size: 1rem;
  color: inherit;
  visibility: hidden;
  transform: translateY(-15%) translateZ(0);
  transform-origin: 0 0;
  transition: transform 0.15s cubic-bezier(0.43, 0.195, 0.02, 1);
}

.theme-switcher-wrapper.is-open {
  opacity: 1;
  visibility: visible;
  transform: translate3d(0, 1px, 0);
}

.theme-switcher-wrapper span {
  display: block;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.9);
  cursor: default;
}

.theme-switcher-wrapper ul {
  margin-top: 0.8rem;
  list-style-type: none;
  font-size: 0;
}

.theme-switcher-wrapper li {
  display: inline-block;
  vertical-align: middle;
  padding: 0 0.2rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.9);
  cursor: pointer;
}

.theme-switcher-wrapper li em {
  display: block;
  border-radius: 1rem;
}

.theme-switcher-wrapper [data-theme] {
  width: 20px;
  height: 20px;
}

.theme-switcher-wrapper [data-theme="orange"] {
  background: #ff4086;
}

.theme-switcher-wrapper [data-theme="purple"] {
  background: #80f;
}

.theme-switcher-wrapper [data-theme="green"] {
  background: #42b883;
}

.theme-switcher-wrapper [data-theme="blue"] {
  background: #1d8cf8;
}

@-moz-keyframes floating {
  0% {
    -webkit-transform: rotate(0deg) translate(-10px) rotate(0deg);
    transform: rotate(0deg) translate(-10px) rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg) translate(-10px) rotate(-360deg);
    transform: rotate(360deg) translate(-10px) rotate(-360deg);
  }
}

@-webkit-keyframes floating {
  0% {
    -webkit-transform: rotate(0deg) translate(-10px) rotate(0deg);
    transform: rotate(0deg) translate(-10px) rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg) translate(-10px) rotate(-360deg);
    transform: rotate(360deg) translate(-10px) rotate(-360deg);
  }
}

@-o-keyframes floating {
  0% {
    -webkit-transform: rotate(0deg) translate(-10px) rotate(0deg);
    transform: rotate(0deg) translate(-10px) rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg) translate(-10px) rotate(-360deg);
    transform: rotate(360deg) translate(-10px) rotate(-360deg);
  }
}

@keyframes floating {
  0% {
    -webkit-transform: rotate(0deg) translate(-10px) rotate(0deg);
    transform: rotate(0deg) translate(-10px) rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg) translate(-10px) rotate(-360deg);
    transform: rotate(360deg) translate(-10px) rotate(-360deg);
  }
}

.profile-page .package-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.payment-form {
  padding: 1rem;
}

#card-element {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f8f9fa;
}

.text-gray-500 {
  color: #6c757d;
}

.mb-4 {
  margin-bottom: 1rem;
}

.block {
  display: block;
}

.w-full {
  width: 100%;
}
</style>
