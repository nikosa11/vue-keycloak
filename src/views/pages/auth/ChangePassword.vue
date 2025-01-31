<template>
    <div class="password-wrapper">
        <div class="bg" style="background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);">
        </div>
        <div class="password-container">
            <img src="https://img.icons8.com/ios-filled/100/C13584/password-reset.png" alt="Change Password Icon">
            <h2 style="background: linear-gradient(45deg, #833AB4, #E1306C, #F77737); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Change Password</h2>
            <form @submit.prevent="handleSubmit">
                <div class="input-container">
                    <i class="pi pi-lock"></i>
                    <input 
                        type="password" 
                        v-model="currentPassword" 
                        placeholder="Current Password"
                        required
                    >
                </div>
                <div class="input-container">
                    <i class="pi pi-lock"></i>
                    <input 
                        type="password" 
                        v-model="newPassword" 
                        placeholder="New Password"
                        required
                    >
                </div>
                <div class="input-container">
                    <i class="pi pi-lock"></i>
                    <input 
                        type="password" 
                        v-model="confirmPassword" 
                        placeholder="Confirm New Password"
                        required
                    >
                </div>
                <div v-if="error" class="error-message">{{ error }}</div>
                <button type="submit">Change Password</button>
                <div class="back-link">
                    <a href="/" @click.prevent="$router.push('/')">Back to Home</a>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js';

export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      userId: '',
      checked: false,
      error: '',
      msg: '',
      apiService: new ApiService(),
      router: useRouter()
    };
  },
  methods: {
    async handleSubmit() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Passwords do not match';
      } else {
        try {
          const keycloakData = await this.apiService.loginToKeycloak(localStorage.getItem('username'), this.currentPassword);
          if (keycloakData.responseEnum === 'OPERATION_SUCCESS') {
            const responseData = await this.apiService.resetPassword(this.userId, this.newPassword);
            console.log('Reset password response:', responseData);
            alert('password changed');
            this.router.push('/');
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
        this.userId = response.sub;
      } catch (error) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtRefreshToken');
        localStorage.removeItem('username');
        this.$router.push('/');
      }
    }
  },
  created() {
    this.fetchUserData();
  }
};
</script>

<style scoped>
.password-wrapper {
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
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.password-container {
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

.password-container img {
    width: 80px;
    margin-bottom: 1.5rem;
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
    background: rgba(255, 255, 255, 0.9);
}

.input-container input:focus {
    outline: none;
    border-color: #C13584;
    box-shadow: 0 0 0 2px rgba(193, 53, 132, 0.2);
}

.input-container i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(45deg, #833AB4, #E1306C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

button {
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

button:hover {
    background: linear-gradient(45deg, #C13584, #FD1D1D);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(193, 53, 132, 0.3);
}

.error-message {
    color: #E1306C;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.back-link {
    font-size: 0.9rem;
    color: #666;
}

a {
    color: #C13584;
    text-decoration: none;
    transition: all 0.3s;
}

a:hover {
    color: #E1306C;
}

@media screen and (max-width: 576px) {
    .password-container {
        margin: 1rem;
        padding: 2rem 1.5rem;
    }
}
</style>
