<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" @keyup.enter="loginToKeycloak" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <InputText type="password" id="password1" v-model="password" placeholder="Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" @keyup.enter="loginToKeycloak" />

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <!-- <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div> -->
              <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)" @click="forgotPassword">Forgot password?</a>
            </div>
            <Button label="Sign In" class="w-full p-3 text-xl"  @click="loginToKeycloak"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppConfig simple />
</template>

<script>
import AppConfig from '@/layout/AppConfig.vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import { ApiService } from '@/common/apiService.js';
import { useRouter } from 'vue-router';

export default {
  components: {
    AppConfig,
    InputText,
    Password,
    Checkbox,
    Button,
  },
  data() {
    return {
      email: '',
      password: '',
      checked: false,
      msg: '',
      layoutConfig: {},
      isLoggedIn: false,
      toast: null,
      apiService: new ApiService(),
      router: useRouter(),
    };
  },
  computed: {
    logoUrl() {
      return `layout/images/${this.layoutConfig.darkTheme ? 'logo-white' : 'logo-dark'}.svg`;
    }
  },
  methods: {
    async loginToKeycloak() {
      try {
        const keycloakData = await this.apiService.loginToKeycloak(this.email, this.password);
        if (keycloakData.responseEnum === 'OPERATION_SUCCESS') {
          this.$store.commit('login');
          localStorage.setItem('jwtToken', keycloakData.access_token);
          localStorage.setItem('jwtRefreshToken', keycloakData.refresh_token);
          localStorage.setItem('username', this.email);
          const userInfo = await this.apiService.getUserInfo();
          this.$store.commit('setUserData', userInfo);
          this.$router.push('/');
        } else {
          this.$router.push('/auth/access');
          this.msg = 'error';
        }
      } catch (error) {
        this.msg = 'error';
        this.$router.push('/accessDenied');
        console.error('Σφάλμα κατά την σύνδεση στο Keycloak:', error.message);
      }
    },
    async fetchUserData() {
      try {
        const response = await this.apiService.getUserInfo();
        this.$store.commit('setUserData', response);
        this.userData = this.$store.state.userData;
      } catch (error) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtRefreshToken');
        localStorage.removeItem('username');
        this.$router.push('/');
      }
    },
    forgotPassword() {
      // Redirect to forgot password page or handle forgot password logic
      this.$router.push('/auth/forgot-password');
    }
  },
  created() {
    this.layoutConfig = this.$store.state.layoutConfig || {};  // Προσθέτουμε fallback σε περίπτωση που το layoutConfig δεν είναι διαθέσιμο
    this.isLoggedIn = this.$store.state.isLoggedIn;
    this.fetchUserData();
  }
};
</script>

<style scoped>
.w-full  {
  border-radius: 25px;
}
</style>
