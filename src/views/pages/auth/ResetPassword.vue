<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-column align-items-center justify-content-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
            <div class="text-center mb-5">
              <div class="text-900 text-3xl font-medium mb-3">Reset Password</div>
            </div>
            <div>
              <label for="newPassword" class="block text-900 text-xl font-medium mb-2">New Password</label>
              <Password 
  id="newPassword" 
  v-model="newPassword" 
  placeholder="New Password" 
  :toggleMask="true" 
  class="w-full mb-3 test" 
  inputClass="w-full" 
  :inputStyle="{ padding: '1rem', borderRadius: '25px' }"
></Password>  
              <label for="retypePassword" class="block text-900 text-xl font-medium mb-2">Retype New Password</label>
              <Password id="retypePassword" v-model="retypePassword" placeholder="Retype New Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full"   :inputStyle="{ padding: '1rem', borderRadius: '25px' }"
              ></Password>
  
              <small v-if="passwordError" class="p-error block mb-3">{{ passwordError }}</small>
  
              <Button label="Reset Password" class="w-full p-3 text-xl" @click="resetPassword" :disabled="!isFormValid"></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  import { ApiService } from '@/common/apiService.js';
  
  export default {
    components: {
      Password,
      Button
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const apiService = new ApiService();
  
      const newPassword = ref('');
      const retypePassword = ref('');
      const passwordError = ref('');
      const userId = ref(route.query.id);
  
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

          const response = await apiService.resetPassword(userId.value, newPassword.value);
          
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
  .pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
  }
  
  .pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
  }
  .w-full {
    border-radius: 25px !important;
  }
  </style>