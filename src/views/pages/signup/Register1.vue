<template>
    <div class="register-wrapper">
      <div class="bg">
        <div>
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="register-container">
        <img src="https://img.icons8.com/ios-filled/100/000000/user-male-circle.png" alt="User Icon">
        <h2>Register</h2>
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
              Client
            </label>
            <label>
              <input type="radio" v-model="role" value="influencer" required>
              <span></span>
              Influencer
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

                    this.$router.push('/');
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
  body {
    font-family: Arial, sans-serif;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .register-wrapper {
    background: #00f2fe00;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .register-container {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 500px;
    margin-top: 40px;
    text-align: center;
  }
  .register-wrapper .bg {
    width: 100%;
    height: 50%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .register-wrapper .bg div {
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
  .theme-orange .register-wrapper .bg div {
    background: linear-gradient(150deg, #ff4086 20%, #fd8d76 100%);
  }
  .theme-purple .register-wrapper .bg div {
    background: linear-gradient(150deg, #8700ff 20%, #f000ff 100%);
  }
  .theme-green .register-wrapper .bg div {
    background: linear-gradient(150deg, #1dcc45 20%, #42b883 100%);
  }
  .theme-blue .register-wrapper .bg div {
    background: linear-gradient(150deg, #0098f0 20%, #00f2c3 100%);
  }
  .register-wrapper .bg span:nth-child(1) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(2) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(3) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(4) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(5) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(6) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(7) {
    display: block;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    animation: floating 34s infinite;
  }
  .register-wrapper .bg span:nth-child(1) {
    width: 11rem;
    height: 11rem;
    top: 30%;
    left: 16%;
    background: rgba(255,255,255,0.05);
    animation-duration: 34s;
  }
  .register-wrapper .bg span:nth-child(2) {
    width: 8rem;
    height: 8rem;
    top: 18%;
    left: 1%;
    background: rgba(255,255,255,0.12);
    animation-duration: 40s;
  }
  .register-wrapper .bg span:nth-child(3) {
    width: 8rem;
    height: 8rem;
    top: 34%;
    right: 10%;
    background: rgba(255,255,255,0.1);
    animation-duration: 38s;
  }
  .register-wrapper .bg span:nth-child(4) {
    width: 4rem;
    height: 4rem;
    top: 34%;
    right: 3%;
    background: rgba(255,255,255,0.2);
    animation-duration: 34s;
  }
  .register-wrapper .bg span:nth-child(5) {
    width: 12rem;
    height: 12rem;
    top: 42%;
    right: 28%;
    background: rgba(255,255,255,0.1);
    animation-duration: 40s;
  }
  .register-wrapper .bg span:nth-child(6) {
    width: 8rem;
    height: 8rem;
    top: 72%;
    left: 6%;
    background: rgba(255,255,255,0.05);
    animation-duration: 38s;
  }
  .register-wrapper .bg span:nth-child(7) {
    width: 4rem;
    height: 4rem;
    top: 82%;
    right: 8%;
    background: rgba(255,255,255,0.05);
    animation-duration: 34s;
  }
  .register-container img {
    width: 100px;
    margin-bottom: 20px;
  }
  .register-container h2 {
    margin-bottom: 20px;
    color: #333;
  }
  .register-container input {
    width: calc(100% - 60px);
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 25px;
    font-size: 16px;
    padding-left: 60px; /* Increased padding to make space for the icon */
  }
  .register-container input:focus {
    border-color: #007BFF;
    outline: none;
  }
  .register-container button {
    width: 100%;
    padding: 14px;
    background-color: #00aaff; /* Changed button color to light blue */
    border: none;
    color: #fff;
    border-radius: 25px;
    cursor: pointer;
    font-size: 18px;
  }
  .register-container button:hover {
    background-color: #0088cc;
  }
  .register-container .input-container {
    position: relative;
  }
  .register-container .input-container i {
    position: absolute;
    left: 45px; /* Updated left position for better alignment */
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
  }
  .register-container .name-container {
    display: flex;
    flex-direction: column; /* Adjusted to column for single line inputs */
    margin-bottom: 20px;
  }
  .register-container .name-container .input-container {
    flex: 1;
  }
  .register-container .name-container .input-container:first-child {
    margin-right: 0; /* Removed margin right as inputs are now single column */
  }
  .register-container .role-selection {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
  }
  .register-container .role-selection label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .register-container .role-selection input {
    display: none; /* Hide the original radio button */
  }
  .register-container .role-selection input + span {
    display: inline-block;
    width: 25px; /* Adjust the size of the radio button */
    height: 25px; /* Adjust the size of the radio button */
    border-radius: 50%;
    border: 2px solid #007BFF;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
  }
  .register-container .role-selection input:checked + span::before {
    content: '';
    display: block;
    width: 15px; /* Adjust the size of the inner circle */
    height: 15px; /* Adjust the size of the inner circle */
    border-radius: 50%;
    background-color: #007BFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .register-container .role-selection label span {
    font-size: 18px; /* Adjust the font size of the label */
  }
  .register-container .additional-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .register-container .additional-options a {
    color: #007BFF;
    text-decoration: none;
  }
  .register-container .additional-options a:hover {
    text-decoration: underline;
  }
  .custom-checkbox {
    display: flex;
    align-items: center;
  }
  .custom-checkbox input {
    display: none;
  }
  .custom-checkbox input + label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .custom-checkbox input + label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #007BFF;
    border-radius: 4px;
    margin-right: 10px;
    background-color: white;
  }
  .custom-checkbox input:checked + label::before {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAABFklEQVR4nO3VP0oDQRAG4CeogIgYZvIBBl+AEG0iIgpyATKEQd4AQ/QBF6VqBh7jB2dw4bE+DLW9lfe1F/JJk+cfnA/N2d3ZwOhjMA84ye4XYCrPOAJ2O9pG5HXYE+BaF59rjFB12CbjK1QHcJ8sgf/AlPCHGzj4Brga5u5iPq2DdAK86Gf3nHTOKyOrvnPArge9fTXHUuZ3M6HjEvAIyHHHA99qW4m6PgGbYQ5MI/mEl1HoCd42e9tZDFK0o/gP2EyyGSWj1BB0/X/0+0KkUb21MF73mMmTXeKtYbl8lxdR84lqPNlddwrBDTXMe3L60a6OTKKtbKgUonqBXvJ7nxyPwmZ7qnQz+ewq0AAAAAElFTkSuQmCC') no-repeat center center;
    background-size: contain;
  }
  .error {
    color: red;
    font-size: 0.9em;
  }
  </style>
  