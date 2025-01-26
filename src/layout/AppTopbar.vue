<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ApiService } from '@/common/apiService.js';
import Badge from 'primevue/badge';
import ChatService from '@/service/ChatService';
import NotificationService from '@/service/NotificationService';

const { layoutConfig, onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const store = useStore();
const apiService = new ApiService();
const unreadMessages = ref(0);

const unreadNotifications = computed(() => store.getters['notification/unreadCount']);

const checkUnreadMessages = async () => {
    try {
        const count = await ChatService.getUnreadCount();
        unreadMessages.value = count;
    } catch (error) {
        console.error('Error checking unread messages:', error);
        unreadMessages.value = 0;
    }
};

const checkUnreadNotifications = async () => {
    await store.dispatch('notification/fetchNotifications');
};

onMounted(() => {
    bindOutsideClickListener();
    checkUnreadMessages();
    checkUnreadNotifications();
    // Check for new messages and notifications every minute
    const messageInterval = setInterval(checkUnreadMessages, 60000);
    const notificationInterval = setInterval(checkUnreadNotifications, 60000);
    
    onBeforeUnmount(() => {
        clearInterval(messageInterval);
        clearInterval(notificationInterval);
        unbindOutsideClickListener();
    });
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`
});
const profile = async () => {
    router.push('/profile');
    
};
const logOut = async () => {
    apiService.logoutFromKeycloak();
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtRefreshToken');
    localStorage.removeItem('username');
    router.push('/auth/login');
}
const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const goToMessaging = () => {
    router.push('/messaging');
    topbarMenuActive.value = false;
};

const goToCalendar = () => {
    router.push('/calendar');
    topbarMenuActive.value = false;
};

const goToNotifications = () => {
    router.push('/notifications');
    topbarMenuActive.value = false;
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>INFLUENCERS</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="goToNotifications()" class="p-link layout-topbar-button">
                <i class="pi pi-bell"></i>
                <span>Ειδοποιήσεις</span>
                <Badge v-show="unreadNotifications > 0" :value="unreadNotifications" severity="danger" />
            </button>
            <button @click="goToMessaging()" class="p-link layout-topbar-button">
                <i class="pi pi-comments"></i>
                <span>Μηνύματα</span>
                <Badge v-show="unreadMessages > 0" :value="unreadMessages" severity="danger" />
            </button>
            <button @click="goToCalendar()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button @click="profile()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button @click="logOut()" class="p-link layout-topbar-button">
                <i class="pi pi-fw pi-sign-in layout-menuitem-icon"></i> <span>Εξοδος</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar-button {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    
    .pi {
        font-size: 1.25rem;
        margin-right: 0.5rem;
    }

    :deep(.p-badge) {
        position: absolute;
        min-width: 1.25rem;
        height: 1.25rem;
        line-height: 1.25rem;
        font-size: 0.75rem;
        padding: 0 0.25rem;
        background-color: var(--red-500);
        border-radius: 50%;
        top: 0;
        right: 0.5rem;
    }

    span {
        margin-right: 1.5rem;
    }
}

.layout-topbar-menu {
    .layout-topbar-button {
        :deep(.p-badge) {
            display: block !important;
        }
    }
}

@media screen and (max-width: 960px) {
    .layout-topbar-button {
        padding: 0.5rem;
        
        :deep(.p-badge) {
            top: -0.2rem;
            right: -0.2rem;
        }

        span {
            display: none;
        }
    }
}
</style>
