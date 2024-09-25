<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Forgot Password</div>
            <span class="text-600 font-medium">Enter your email to reset your password</span>
          </div>

          <div>
            <label for="email" class="block text-900 text-xl font-medium mb-2 email-label">Email</label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              class="w-full mb-3"
              :class="{'p-invalid': emailError}"
              v-model="email"
              :style="{ padding: '1rem', borderRadius: '25px' }"
              @input="validateEmail"
            />
            <small class="p-error" v-if="emailError">{{ emailError }}</small>

            <Button
              label="Reset Password"
              class="w-full p-3 text-xl"
              :style="{ borderRadius: '25px' }"
              @click="handleResetPassword"
              :disabled="!isEmailValid || isLoading"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { ApiService } from '@/common/apiService';

export default {
  name: 'ForgotPassword',
  components: {
    InputText,
    Button
  },
  setup() {
    const apiService = new ApiService();
    const toast = useToast();

    const email = ref('');
    const emailError = ref('');
    const isLoading = ref(false);

    const isEmailValid = computed(() => {
      return email.value && !emailError.value;
    });

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value) {
        emailError.value = 'Email is required';
      } else if (!emailRegex.test(email.value)) {
        emailError.value = 'Please enter a valid email address';
      } else {
        emailError.value = '';
      }
    };

    const handleResetPassword = async () => {
      if (!isEmailValid.value) return;

      isLoading.value = true;
      try {
        // Βήμα 1: Λήψη access token
        const accessToken = await apiService.getAccessToken();

        // Βήμα 2: Αναζήτηση χρήστη με το δοσμένο email
        const userId = await apiService.findUserByEmail(email.value, accessToken);

        if (!userId) {
          throw new Error('User not found');
        }

        // Βήμα 3: Αποστολή email επαναφοράς κωδικού
        await apiService.sendResetPasswordEmail(userId, accessToken);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Password reset email sent successfully', life: 3000 });
      } catch (error) {
        console.error('Error in password reset process:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send reset password email. Please try again.', life: 3000 });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      emailError,
      isEmailValid,
      isLoading,
      validateEmail,
      handleResetPassword
    };
  }
};
</script>

<style scoped>
.w-full {
  border-radius: 25px;
}

.email-label {
  text-align: center;
  width: 100%;
  display: block;
}
</style>