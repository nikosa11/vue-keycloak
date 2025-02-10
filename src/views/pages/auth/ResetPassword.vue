<template>
  <div class="reset-wrapper">
    <div class="bg" style="background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);"></div>
    <div class="reset-container">
      <img src="https://img.icons8.com/ios-filled/100/C13584/forgot-password.png" alt="Reset Password Icon">
      <h2 style="background: linear-gradient(45deg, #833AB4, #E1306C, #F77737); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Reset Password</h2>
      
      <div class="form-container">
        <label for="newPassword" class="input-label">New Password</label>
        <div class="input-container">
          <Password 
            id="newPassword" 
            v-model="newPassword" 
            :toggleMask="true"
            class="w-full" 
            :inputStyle="{ padding: '0.75rem 1rem', borderRadius: '1.5rem', width: '100%', border: '1px solid rgba(131, 58, 180, 0.2)' }"
            :panelStyle="{ borderRadius: '1rem' }"
          />
        </div>

        <label for="retypePassword" class="input-label">Confirm Password</label>
        <div class="input-container">
          <Password 
            id="retypePassword" 
            v-model="retypePassword" 
            :toggleMask="true"
            class="w-full" 
            :inputStyle="{ padding: '0.75rem 1rem', borderRadius: '1.5rem', width: '100%', border: '1px solid rgba(131, 58, 180, 0.2)' }"
            :panelStyle="{ borderRadius: '1rem' }"
          />
        </div>

        <small v-if="passwordError" class="error-message">{{ passwordError }}</small>

        <button 
          class="reset-button" 
          @click="resetPassword" 
          :disabled="!isFormValid"
          :class="{ 'button-disabled': !isFormValid }"
        >
          Reset Password
        </button>

        <div class="additional-links">
          <router-link to="/auth/login" class="back-link">Back to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Password from 'primevue/password';
import { ApiService } from '@/common/apiService.js';

export default {
  components: {
    Password
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const apiService = new ApiService();

    const newPassword = ref('');
    const retypePassword = ref('');
    const passwordError = ref('');

    onMounted(() => {
      const queryUserId = route.query.id;
      if (queryUserId) {
        store.commit('setUserId', queryUserId);
      }
      
      // Check if userId exists in store, if not redirect to landing
      if (!store.state.userId) {
        router.push('/landing');
      }
    });

    const isFormValid = computed(() => {
      return newPassword.value && retypePassword.value && newPassword.value === retypePassword.value;
    });

    const validatePasswords = () => {
      if (!newPassword.value || !retypePassword.value) {
        passwordError.value = 'Both password fields are required.';
        return false;
      }
      if (newPassword.value !== retypePassword.value) {
        passwordError.value = 'Passwords do not match.';
        return false;
      }
      if (newPassword.value.length < 8) {
        passwordError.value = 'Password must be at least 8 characters long.';
        return false;
      }
      passwordError.value = '';
      return true;
    };

    const resetPassword = async () => {
      if (!validatePasswords()) return;

      try {
        const accessToken = await apiService.getAccessToken();
        localStorage.setItem('jwtToken', accessToken);

        const userId = store.state.userId;
        if (!userId) {
          passwordError.value = 'User ID not found';
          return;
        }

        const response = await apiService.resetPassword(userId, newPassword.value);
        
        if (response === 'completted') {
          alert('Password reset successful. Please log in with your new password.');
          router.push('/auth/login');
        } else {
          throw new Error('Password reset failed');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Failed to reset password. Please try again.');
      }
    };

    return {
      newPassword,
      retypePassword,
      passwordError,
      isFormValid,
      resetPassword
    };
  }
};
</script>

<style scoped>
.reset-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 400% 400% !important;
  animation: gradient 15s ease infinite;
  z-index: -1;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.reset-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  margin: 1rem;
  text-align: center;
}

.reset-container img {
  width: 80px;
  margin-bottom: 1.5rem;
}

.form-container {
  margin-top: 2rem;
}

.input-label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.input-container {
  margin-bottom: 1.5rem;
}

.input-container :deep(.p-password) {
  width: 100%;
}

.input-container :deep(.p-password-input) {
  width: 100%;
}

.input-container :deep(.p-password-input:focus) {
  border-color: #C13584 !important;
  box-shadow: 0 0 0 2px rgba(193, 53, 132, 0.2) !important;
}

.error-message {
  color: #E1306C;
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: left;
}

.reset-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 1.5rem;
  background: linear-gradient(45deg, #833AB4, #E1306C);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.reset-button:hover:not(.button-disabled) {
  background: linear-gradient(45deg, #C13584, #FD1D1D);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(193, 53, 132, 0.3);
}

.button-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.additional-links {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.back-link {
  color: #C13584;
  text-decoration: none;
  transition: all 0.3s;
}

.back-link:hover {
  color: #E1306C;
}

@media screen and (max-width: 576px) {
  .reset-container {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }
}

:deep(.pi-eye),
:deep(.pi-eye-slash) {
  color: #C13584;
}
</style>