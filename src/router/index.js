import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
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
                    path: '/uikit/myPage',
                    name: 'myPage',
                    component: () => import('@/views/uikit/MyPage.vue')
                },
                {
                    path: '/uikit/News',
                    name: 'news',
                    component: () => import('@/views/uikit/News.vue')
                },
                {
                    path: '/home/profile',
                    name: 'profile',
                    component: () => import('@/views/pages/home/Profile.vue')
                },
                {
                    path: '/home/influencers',
                    name: 'influencers',
                    component: () => import('@/views/pages/home/Influencer.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/home/crud',
                    name: 'projects',
                    component: () => import('@/views/pages/home/Crud.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
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
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
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
        }
    ]
});

export default router;
