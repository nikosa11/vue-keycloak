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
                        <input  type="password" id="email1"  placeholder="Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Retupe Password</label>
                        <input  type="password" id="password1" v-model="password" placeholder="Retype Password"  class="w-full md:w-30rem mb-5" style="padding: 1rem"/>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <!-- <p v-if="msg && error" style="color: red;"> {{ msg }}    </p> -->

                        </div>
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

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { ApiService } from '@/common/apiService.js'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useStore();
const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const password2 = ref('');
let userId = ref('');

const checked = ref(false);
let error = ref(true);
let firstPageCompleted = ref(false);

const apiService = new ApiService();
const isLoggedIn = store.state.isLoggedIn; // Χρήση της computed που αντιστοιχεί στο isLoggedIn
let  msg = ref('');
console.log(isLoggedIn);


const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
let arePasswordsEqual = computed(() => {
    return email.value === password.value;
});

let isFormValid = computed(() => {
    return email.value !== '' && arePasswordsEqual.value;
});
const changePassword = async () => {
    apiService.resetPassword(userId,  password2.value)
    .then((responseData) => {
        console.log('Reset password response:', responseData);
        alert('password changed');

        router.push('/');
    })
    .catch((error) => {
        alert('Reset password failed:');

        console.error('Reset password failed:', error);
    });
    
};
const loginToKeycloak = async () => {
    try {
        if (!isFormValid.value) {

        msg = 'Passwords do not match or are empty';
        alert('Passwords do not match or are empty');
        } else {
            const keycloakData = await apiService.loginToKeycloak(localStorage.getItem('username'), password.value);
            if (keycloakData.responseEnum === 'OPERATION_SUCCESS'){
                store.commit('login');
                console.log(email.value);
                localStorage.setItem('jwtToken',keycloakData.access_token);
                localStorage.setItem('jwtRefreshToken',keycloakData.refresh_token);
                console.log('PassWord verified:', keycloakData);
                msg = '';
                error = true;
                console.log(error);
                const userInfo = await apiService.getUserInfo();
                firstPageCompleted = true;
                console.log(firstPageCompleted);
                const element = document.getElementById('page1');
                element.style.display = 'none';
                const element1 = document.getElementById('page2');
                element1.style.display = 'block';
                userId = userInfo.sub;
                console.log(userInfo.sub)

                
            } else {
                alert('Wrong Password');

                msg = 'Wrong Password';
            }

        }
       
    } catch (error) {
        msg = 'error';
        alert('Wrong Password');


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
</style>
