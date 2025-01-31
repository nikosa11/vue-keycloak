<template>
    <div class="register-wrapper">
      <div class="bg" style="background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);">
        <div>
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="register-container">
        <img src="https://img.icons8.com/ios-filled/100/C13584/user-male-circle.png" alt="User Icon">
        <h2 style="background: linear-gradient(45deg, #833AB4, #E1306C, #F77737); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Register</h2>
        <form @submit.prevent="handleSubmit">
          <div class="input-container">
            <i class="fa fa-user"></i>
            <input v-model="firstName" type="text" placeholder="First Name" required>
          </div>
          <div v-if="nameError" class="error">{{ nameError }}</div>
  
          <div class="input-container">
            <i class="fa fa-user"></i>
            <input v-model="lastName" type="text" placeholder="Last Name" required>
          </div>
          <div v-if="nameError" class="error">{{ nameError }}</div>
  
          <div class="input-container">
            <i class="fa fa-user"></i>
            <input v-model="username" type="text" placeholder="Username" required>
          </div>
          <div v-if="usernameError" class="error">{{ usernameError }}</div>
          
          <div class="input-container">
            <i class="fa fa-envelope"></i>
            <input v-model="email" type="email" placeholder="Email" required>
          </div>
          <div v-if="emailError" class="error">{{ emailError }}</div>
          
          <div class="input-container">
            <i class="fa fa-lock"></i>
            <input v-model="password" type="password" placeholder="Password" required>
          </div>
          <div v-if="passwordError" class="error">{{ passwordError }}</div>
          
          <div class="input-container">
            <i class="fa fa-lock"></i>
            <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required>
          </div>
          <div v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</div>
          
          <div class="role-selection">
            <label>
              <input type="radio" v-model="role" value="client" required>
              <span></span>
              <span>Client</span>
            </label>
            <label>
              <input type="radio" v-model="role" value="influencer" required>
              <span></span>
              <span>Influencer</span>
            </label>
          </div>
          <div v-if="roleError" class="error">{{ roleError }}</div>
          
          <button type="submit">Register</button>
          
          <div class="additional-options">
            <div class="custom-checkbox">
              <input type="checkbox" id="remember" v-model="remember">
              <label for="remember">Remember me</label>
            </div>
            <a href="#">Forgot password?</a>
          </div>
          <div v-if="serverError" class="error">{{ serverError }}</div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ApiService } from '@/common/apiService.js'
  
  export default {
    data() {
      return {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        remember: false,
        nameError: '',
        usernameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        roleError: '',
        serverError: ''
      };
    },
    methods: {
      async handleSubmit() {
        this.clearErrors();
        let valid = true;
  
        if (!this.firstName || !this.lastName) {
          this.nameError = 'First Name and Last Name are required';
          valid = false;
        }
  
        if (!this.username) {
          this.usernameError = 'Username is required';
          valid = false;
        }
  
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!this.email.match(emailPattern)) {
          this.emailError = 'Valid email is required';
          valid = false;
        }
  
        if (!this.password) {
          this.passwordError = 'Password is required';
          valid = false;
        }
  
        if (this.password !== this.confirmPassword) {
          this.confirmPasswordError = 'Passwords do not match';
          valid = false;
        }
  
        if (!this.role) {
          this.roleError = 'Role selection is required';
          valid = false;
        }
  
        if (valid) {
          try {
            const apiService = new ApiService();
            const userData = {
              username: this.username,
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              password: this.password,
              role: this.role
            };
            const result = await apiService.createUserInKeycloak(userData);
            if (result === "SUCCESS") {
                const keycloakData = await apiService.loginToKeycloak(this.email, this.password);
                if (keycloakData.responseEnum === 'OPERATION_SUCCESS') {
                    this.$store.commit('login');
                    localStorage.setItem('jwtToken', keycloakData.access_token);
                    localStorage.setItem('jwtRefreshToken', keycloakData.refresh_token);
                    localStorage.setItem('username', this.email);

                    const userInfo = await apiService.getUserInfo();
                    this.$store.commit('setUserData', userInfo);
                    this.$store.commit('setWizzard', true);

                    if (this.role === 'influencer') {
                        this.$router.push('/register2');
                    } else {
                        this.$router.push('/');
                    }
                }
            } else if (result === "ALREADY_REGISTER") {
              this.serverError = 'User is already registered.';
            } else {
              this.serverError = 'Server error. Please try again later.';
            }
          } catch (error) {
            this.serverError = 'Failed to register user.';
          }
        }
      },
      clearErrors() {
        this.nameError = '';
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';
        this.confirmPasswordError = '';
        this.roleError = '';
        this.serverError = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .register-wrapper {
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

  .register-container {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    backdrop-filter: blur(10px);
    margin: 1rem;
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

  .role-selection {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
    justify-content: center;
  }

  .role-selection label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(131, 58, 180, 0.2);
    transition: all 0.3s;
  }

  .role-selection label:hover {
    border-color: #C13584;
    transform: translateY(-2px);
  }

  .role-selection input[type="radio"]:checked + span + span {
    background: linear-gradient(45deg, #833AB4, #E1306C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }

  .role-selection input[type="radio"]:checked + span {
    background: linear-gradient(45deg, #833AB4, #E1306C);
  }

  button[type="submit"] {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 1.5rem;
    background: linear-gradient(45deg, #833AB4, #E1306C);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  button[type="submit"]:hover {
    background: linear-gradient(45deg, #C13584, #FD1D1D);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(193, 53, 132, 0.3);
  }

  .additional-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .custom-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .error {
    color: #E1306C;
    font-size: 0.9rem;
    margin-top: 0.25rem;
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
    .register-container {
      margin: 1rem;
      padding: 1.5rem;
    }

    .role-selection {
      flex-direction: column;
    }

    .role-selection label {
      width: 100%;
      justify-content: center;
    }
  }
  </style>