<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Change Password</div>
          </div>
          <div class="page1" id="page1">
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Password</label>
            <input type="password" id="email1" placeholder="Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" @keyup.enter="loginToKeycloak" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Retype Password</label>
            <input type="password" id="password1" v-model="password" placeholder="Retype Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" @keyup.enter="loginToKeycloak" />

            <div class="flex align-items-center justify-content-between mb-5 gap-5"></div>
            <Button label="Confirm" class="w-full p-3 text-xl" @click="loginToKeycloak"></Button>
          </div>
          <div class="page2" style="display: none;" id="page2">
            <label for="password2" class="block text-900 text-xl font-medium mb-2">New Password</label>
            <Password id="password2" v-model="password2" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

            <Button label="Change Password" class="w-full p-3 text-xl" @click="changePassword"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppConfig simple />
</template>

<script>
import { computed, ref } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { ApiService } from '@/common/apiService.js';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Password from 'primevue/password';
import Button from 'primevue/button';

export default {
  components: {
    AppConfig,
    Password,
    Button
  },
  data() {
    return {
      email: '',
      password: '',
      password2: '',
      userId: '',
      checked: false,
      error: true,
      firstPageCompleted: false,
      msg: '',
      layoutConfig: {},
      isLoggedIn: false,
      toast: null,
      apiService: new ApiService(),
      router: useRouter()
    };
  },
  computed: {
    logoUrl() {
      return `layout/images/${this.layoutConfig.darkTheme ? 'logo-white' : 'logo-dark'}.svg`;
    },
    arePasswordsEqual() {
      return this.email === this.password;
    },
    isFormValid() {
      return this.email !== '' && this.arePasswordsEqual;
    }
  },
  methods: {
    async changePassword() {
      try {
        const responseData = await this.apiService.resetPassword(this.userId, this.password2);
        console.log('Reset password response:', responseData);
        alert('password changed');
        this.router.push('/');
      } catch (error) {
        alert('Reset password failed:');
        console.error('Reset password failed:', error);
      }
    },
    async loginToKeycloak() {
      if (!this.isFormValid) {
        this.msg = 'Passwords do not match or are empty';
        alert('Passwords do not match or are empty');
      } else {
        try {
          const keycloakData = await this.apiService.loginToKeycloak(localStorage.getItem('username'), this.password);
          if (keycloakData.responseEnum === 'OPERATION_SUCCESS') {
            this.$store.commit('login');
            localStorage.setItem('jwtToken', keycloakData.access_token);
            localStorage.setItem('jwtRefreshToken', keycloakData.refresh_token);
            console.log('PassWord verified:', keycloakData);
            this.msg = '';
            this.error = true;
            const userInfo = await this.apiService.getUserInfo();
            this.firstPageCompleted = true;
            document.getElementById('page1').style.display = 'none';
            document.getElementById('page2').style.display = 'block';
            this.userId = userInfo.sub;
            console.log(userInfo.sub);
          } else {
            alert('Wrong Password');
            this.msg = 'Wrong Password';
          }
        } catch (error) {
          this.msg = 'error';
          alert('Wrong Password');
        }
      }
    },
    async fetchUserData() {
      try {
        const response = await this.apiService.getUserInfo();
        this.$store.commit('setUserData', response);
      } catch (error) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtRefreshToken');
        localStorage.removeItem('username');
        this.$router.push('/');
      }
    }
  },
  created() {
    this.layoutConfig = this.$store.state.layoutConfig || {};
    this.isLoggedIn = this.$store.state.isLoggedIn;
    this.fetchUserData();
  }
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
.w-full {
  border-radius: 25px;
}
</style>
