<script setup></script>

<template>
    <router-view />
    <InactivityModal 
        ref="inactivityModal"
        @continue-session="resetInactivityTimer"
        @session-timeout="handleSessionTimeout"
    />
</template>
<script>
import InactivityModal from './views/pages/modals/InactivityModal.vue';

export default {
    components: {
        InactivityModal
    },
    data() {
        return {
            inactivityTimer: null,
            inactivityTimeout: 2 * 60 * 1000, // 5 minutes in milliseconds
            isActive: true,
            exceptions: [
                '/auth/login',
                '/auth/register',
                '/auth/access',
                '/auth/error',
                'auth/forgot-password',
                'register2'
            ]
        }
    },
    watch: {
        '$route'(to) {
            // Clear timer on public routes
            const publicRoutes = ['/landing', '/auth/login', '/register', '/auth/access', '/auth/error', 'auth/forgot-password'];
            if (publicRoutes.includes(to.path)) {
                this.clearInactivityTimer();
                this.isActive = true;
            } else {
                this.startInactivityTimer();
            }
        }
    },
    mounted() {
        this.setupInactivityTracking();
    },
    methods: {
        clearInactivityTimer() {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        },
        setupInactivityTracking() {
            // Reset timer on any user activity
            document.addEventListener('mousemove', this.handleUserActivity);
            document.addEventListener('mousedown', this.handleUserActivity);
            document.addEventListener('keypress', this.handleUserActivity);
            document.addEventListener('touchstart', this.handleUserActivity);
            document.addEventListener('scroll', this.handleUserActivity);

            // Start initial timer only if not on a public route
            const publicRoutes = ['/landing', '/auth/login', '/register', '/auth/access', '/auth/error', '/auth/forgot-password','register2'];
            if (!publicRoutes.includes(this.$route.path)) {
                this.startInactivityTimer();
            }
        },
        handleUserActivity() {
            // If modal is open, close it on any activity
            if (this.$refs.inactivityModal && !this.isActive) {
                this.$refs.inactivityModal.hide();
            }
            this.isActive = true;
            this.resetInactivityTimer();
        },
        startInactivityTimer() {
            // Don't set timer on public pages
            const publicRoutes = ['/landing', '/auth/login', '/register', '/auth/access', '/auth/error', '/auth/forgot-password','register2'];
            if (publicRoutes.includes(this.$route.path)) {
                return;
            }

            this.inactivityTimer = setTimeout(() => {
                if (this.$refs.inactivityModal && this.isActive) {
                    this.isActive = false;
                    this.$refs.inactivityModal.show();
                }
            }, this.inactivityTimeout);
        },
        resetInactivityTimer() {
            // Don't reset timer on public pages
            const publicRoutes = ['/landing', '/auth/login', '/register', '/auth/access', '/auth/error', '/auth/forgot-password','register2'];
            if (publicRoutes.includes(this.$route.path)) {
                return;
            }
            this.clearInactivityTimer();
            this.startInactivityTimer();
        },
        handleSessionTimeout() {
            this.clearInactivityTimer(); // Clear timer before logout
            // Clear session data
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('jwtRefreshToken');
            localStorage.removeItem('username');
            // Handle session timeout (e.g., logout user)
            this.$store.dispatch('logout');
        }
    },
    beforeUnmount() {
        // Clean up event listeners
        document.removeEventListener('mousemove', this.handleUserActivity);
        document.removeEventListener('mousedown', this.handleUserActivity);
        document.removeEventListener('keypress', this.handleUserActivity);
        document.removeEventListener('touchstart', this.handleUserActivity);
        document.removeEventListener('scroll', this.handleUserActivity);
        
        this.clearInactivityTimer();
    }
}
</script>
<style scoped></style>
