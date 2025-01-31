import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                { 
                    path: '/home',
                    name: 'Home',
                    component: () => import('@/views/pages/home/Home.vue') 
                        },
                        { 
                    path: '/home/profile2',
                            name: 'profile2',
                            component: () => import('@/views/pages/home/Profile2.vue') 
                        },
                        { 
                    path: '/home/influencers2', 
                            name: 'influencers2', 
                            component: () => import('@/views/pages/home/Influencer2.vue') 
                        },
                        { 
                    path: '/home/influencers',
                    name: 'influencers',
                    component: () => import('@/views/pages/home/Influencer.vue')
                },
                { 
                    path: '/proposal', 
                            name: 'proposal', 
                            component: () => import('@/views/pages/home/Proposal.vue') 
                        }, 
                        { 
                    path: '/stats', 
                            name: 'statistics', 
                            component: () => import('@/views/pages/home/Stats.vue') 
                        },      
                        {
                    path: '/TransactionHistory',
                            name: 'TransactionHistory',
                            component: () => import('@/views/pages/home/payment/TransactionHistory.vue')
                        },
                        {
                    path: '/PaymentMethods',
                            name: 'PaymentMethods',
                            component: () => import('@/views/pages/home/payment/PaymentMethods.vue')
                        },
                        {
                    path: '/PaymentPage',
                            name: 'PaymentPage',
                            component: () => import('@/views/pages/home/payment/PaymentPage.vue')
                        },   
                        {
                    path: '/InvoicesReceipts',
                            name: 'InvoicesReceipts',
                            component: () => import('@/views/pages/home/payment/InvoicesReceipts.vue')
                        }, 
                        {
                    path: '/profile',
                            name: 'profile',
                            component: () => import('@/views/pages/home/Profile.vue')
                        },
                        {
                    path: '/blocks',
                            name: 'blocks',
                            component: () => import('@/views/utilities/Blocks.vue')
                        },
                        {
                    path: '/crud',
                            name: 'projects',
                            component: () => import('@/views/pages/home/Crud.vue')
                        },
                        {
                    path: '/portfolio',
                            name: 'portfolio',
                            component: () => import('@/views/pages/home/Portfolio.vue')
                        },
                        {
                    path: '/notifications',
                            name: 'notifications',
                            component: () => import('@/views/pages/home/Notifications.vue')
                        },
                    ]
                },
                {
                    path: '/discovery',
                    component: AppLayout,
                    children: [
                        {
                            path: 'roi',
                            name: 'discovery-roi',
                            component: () => import('@/views/pages/discovery/ROIDashboard.vue')
                        }
                    ]
                },
                {
                    path: '/landing',
                    name: 'landing',
                    component: () => import('@/views/pages/Landing.vue')
                },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import('@/views/pages/signup/Register1.vue')
                },
                {
                    path: '/register2',
                    name: 'register2',
                    component: () => import('@/views/pages/signup/Register2.vue')
                },
                {
                    path: '/auth/login',
                    name: 'login',
                    component: () => import('@/views/pages/auth/Login.vue')
                },
                {
                    path: '/auth/forgot-password',
                    name: 'forgot-password',
                    component: () => import('@/views/pages/auth/ForgotPassword.vue')
                },
                {
                    path: '/auth/changePassword',
                    name: 'changePassword',
                    component: () => import('@/views/pages/auth/ChangePassword.vue')
                },
                {
                    path: '/reset-password',
                    name: 'resetpassword',
                    component: () => import('@/views/pages/auth/ResetPassword.vue')
                },
                {
                    path: '/auth/access',
                    name: 'accessDenied',
                    component: () => import('@/views/pages/auth/Access.vue')
                },
                {
                    path: '/auth/error',
                    name: 'error',
                    component: () => import('@/views/pages/auth/Error.vue')
                },
                {
                    path: '/messaging',
                    name: 'messaging',
                    component: () => import('@/views/pages/messaging/Chat.vue'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/calendar',
                    name: 'calendar',
                    component: () => import('@/views/pages/Calendar.vue')
                }
    ],
    // Προσθήκη του scrollBehavior
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            // Αν υπάρχει savedPosition (πχ. όταν χρησιμοποιεί το back button)
            return savedPosition;
        } else {
            // Για όλες τις άλλες περιπτώσεις, πήγαινε στην κορυφή
            return { 
                top: 0,
                behavior: 'smooth'
            };
        }
    }
});

export default router;