<template>
    <div class="login-wrapper">
        <div class="bg" style="background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);"></div>
        <div class="login-container">
            <img src="https://img.icons8.com/ios-filled/100/C13584/instagram-new.png" alt="Login Icon">
            <h2 style="background: linear-gradient(45deg, #833AB4, #E1306C, #F77737); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Welcome Back</h2>
            <form @submit.prevent="handleSubmit">
                <div class="input-container">
                    <i class="pi pi-user"></i>
                    <input 
                        type="text" 
                        v-model="email" 
                        placeholder="Email or Username"
                        required
                    >
                </div>
                <div class="input-container">
                    <i class="pi pi-lock"></i>
                    <input 
                        :type="showPassword ? 'text' : 'password'" 
                        v-model="password" 
                        placeholder="Password"
                        required
                    >
                    <i 
                        class="pi password-toggle" 
                        :class="showPassword ? 'pi-eye-slash' : 'pi-eye'"
                        @click="togglePassword"
                    ></i>
                </div>
                <div class="remember-forgot">
                    <div class="remember-me">
                        <input type="checkbox" id="remember" v-model="rememberMe">
                        <label for="remember">Remember me</label>
                    </div>
                </div>
                <div class="additional-links">
                    <a href="#" @click.prevent="forgotPassword" class="forgot-link">Forgot Password?</a>
                    <span class="divider">•</span>
                    <a href="/register" class="register-link">Create Account</a>
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js';

export default {
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            showPassword: false
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        async handleSubmit() {
            try {
                const apiService = new ApiService();
                const keycloakData = await apiService.loginToKeycloak(this.email, this.password);
                if (keycloakData.responseEnum === 'OPERATION_SUCCESS') {
                    localStorage.setItem('jwtToken', keycloakData.access_token);
                    localStorage.setItem('jwtRefreshToken', keycloakData.refresh_token);
                    localStorage.setItem('username', this.email);
                    const userInfo = await apiService.getUserInfo();
                    this.$store.commit('setUserData', userInfo);
                    this.$router.push('/');
                } else {
                    this.$router.push('/auth/access');
                }
            } catch (error) {
                this.$router.push('/accessDenied');
                console.error('Σφάλμα κατά την σύνδεση στο Keycloak:', error.message);
            }
        },
        forgotPassword() {
            this.$router.push('/auth/forgot-password');
        }
    },
    created() {
        this.layoutConfig = this.$store.state.layoutConfig || {};  
        this.isLoggedIn = this.$store.state.isLoggedIn;
    }
};
</script>

<style scoped>
.login-wrapper {
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

.login-container {
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

.login-container img {
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
    color: #C13584;
}

.password-toggle {
    left: auto !important;
    right: 1rem;
    cursor: pointer;
}

.remember-forgot {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.additional-links {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0;
    font-size: 0.9rem;
}

.forgot-link, .register-link {
    color: #C13584;
    text-decoration: none;
    transition: all 0.3s;
}

.forgot-link:hover, .register-link:hover {
    color: #E1306C;
}

.divider {
    margin: 0 0.5rem;
    color: #666;
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

@media screen and (max-width: 576px) {
    .login-container {
        margin: 1rem;
        padding: 2rem 1.5rem;
    }
}
</style>
