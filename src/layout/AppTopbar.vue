<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js'
import Badge from 'primevue/badge';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const apiService = new ApiService();
const unreadMessages = ref(0);

const goToMessaging = () => {
    router.push('/messaging');
    topbarMenuActive.value = false;
};

const goToCalendar = () => {
    router.push('/calendar');
    topbarMenuActive.value = false;
};

const checkUnreadMessages = async () => {
    try {
        const response = await fetch('/demo/data/chats.json');
        const result = await response.json();
        const totalUnread = result.data.reduce((sum, chat) => sum + (chat.unread || 0), 0);
        unreadMessages.value = totalUnread;
    } catch (error) {
        console.error('Error checking unread messages:', error);
    }
};

onMounted(() => {
    bindOutsideClickListener();
    checkUnreadMessages();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
const profile = async () => {
    router.push('/home/profile');
    
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
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
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
            <button @click="goToMessaging()" class="p-link layout-topbar-button">
                <i class="pi pi-comments"></i>
                <span>Μηνύματα</span>
                <Badge v-if="unreadMessages" :value="unreadMessages" severity="danger" class="message-badge" />
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
    
    .message-badge {
        position: absolute;
        top: -5px;
        right: -5px;
    }
}

.layout-topbar-button:hover {
    background-color: var(--surface-hover);
}

@media screen and (max-width: 960px) {
    .layout-topbar-button {
        .message-badge {
            top: 0;
            right: 0;
        }
    }
}
</style>
