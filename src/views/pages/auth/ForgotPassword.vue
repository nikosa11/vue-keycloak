<template>
  <div class="forgot-wrapper">
    <div class="bg" style="background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);"></div>
    <div class="forgot-container">
      <img src="https://img.icons8.com/ios-filled/100/C13584/forgot-password.png" alt="Forgot Password Icon">
      <h2 style="background: linear-gradient(45deg, #833AB4, #E1306C, #F77737); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Forgot Password</h2>
      <p class="description">Enter your email and we'll send you instructions to reset your password.</p>
      
      <div class="form-container">
        <label for="email" class="input-label">Email Address</label>
        <div class="input-container">
          <i class="pi pi-envelope"></i>
          <input 
            id="email"
            type="email" 
            v-model="email" 
            placeholder="Enter your email"
            :class="{ 'error': emailError }"
          />
        </div>

        <small v-if="emailError" class="error-message">{{ emailError }}</small>
        <small v-if="successMessage" class="success-message">{{ successMessage }}</small>

        <button 
          class="submit-button" 
          @click="handleSubmit"
          :disabled="isLoading"
          :class="{ 'button-disabled': isLoading }"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
          <span v-else>Send Reset Link</span>
        </button>

        <div class="additional-links">
          <router-link to="/auth/login" class="back-link">Back to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js';

export default {
  setup() {
    const router = useRouter();
    const apiService = new ApiService();
    
    const email = ref('');
    const emailError = ref('');
    const successMessage = ref('');
    const isLoading = ref(false);

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async () => {
      emailError.value = '';
      successMessage.value = '';

      if (!email.value) {
        emailError.value = 'Email is required';
        return;
      }

      if (!validateEmail(email.value)) {
        emailError.value = 'Please enter a valid email address';
        return;
      }

      isLoading.value = true;

      try {
        // Get access token
        const accessToken = await apiService.getAccessToken();
        
        // Find user by email
        const userId = await apiService.findUserByEmail(email.value, accessToken);
        
        if (!userId) {
          emailError.value = 'No account found with this email address';
          return;
        }

        // Send reset password email
        await apiService.sendResetPasswordEmail(userId, accessToken);
        
        successMessage.value = 'Password reset instructions have been sent to your email';
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);

      } catch (error) {
        console.error('Password reset request failed:', error);
        emailError.value = 'Failed to process your request. Please try again later.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      emailError,
      successMessage,
      isLoading,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.forgot-wrapper {
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

.forgot-container {
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

.forgot-container img {
  width: 80px;
  margin-bottom: 1.5rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.5;
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
  position: relative;
  margin-bottom: 1.5rem;
}

.input-container input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid rgba(131, 58, 180, 0.2);
  border-radius: 1.5rem;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #C13584;
  box-shadow: 0 0 0 2px rgba(193, 53, 132, 0.2);
}

.input-container input.error {
  border-color: #E1306C;
}

.input-container i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #C13584;
}

.error-message {
  color: #E1306C;
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: left;
}

.success-message {
  color: #4CAF50;
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: left;
}

.submit-button {
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button:hover:not(.button-disabled) {
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
  .forgot-container {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }
}
</style>
