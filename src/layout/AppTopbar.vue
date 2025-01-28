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
            <!-- <button @click="goToMessaging()" class="p-link layout-topbar-button">
                <i class="pi pi-comments"></i>
                <span>Μηνύματα</span>
                <Badge v-show="unreadMessages > 0" :value="unreadMessages" severity="danger" />
            </button> -->
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
.layout-topbar {
    position: fixed;
    height: 5rem;
    z-index: 997;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 2rem;
    background-color: var(--surface-card);
    transition: left 0.2s;
    display: flex;
    align-items: center;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, .02), 0px 0px 2px rgba(0, 0, 0, .05), 0px 1px 4px rgba(0, 0, 0, .08);

    .layout-topbar-logo {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 500;
        width: 300px;
        border-radius: 12px;
        background: linear-gradient(90deg, #40E0D0, #2F80ED);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        img {
            height: 2.5rem;
            margin-right: .5rem;
        }

        &:focus {
            outline: 0 none;
            outline-offset: 0;
            transition: box-shadow .2s;
            box-shadow: var(--focus-ring);
        }
    }

    .layout-topbar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        color: var(--text-color-secondary);
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        cursor: pointer;

        i {
            font-size: 1.5rem;
            background: linear-gradient(90deg, #40E0D0, #2F80ED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        span {
            font-size: 1rem;
            display: none;
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
            right: 0;
            transform: translate(25%, -25%);
            display: block !important;
        }
    }

    .layout-menu-button {
        margin-left: 2rem;
    }

    .layout-topbar-menu-button {
        display: none;

        i {
            font-size: 1.25rem;
        }
    }

    .layout-topbar-menu {
        margin: 0 0 0 auto;
        padding: 0;
        list-style: none;
        display: flex;

        .layout-topbar-button {
            margin-left: 1rem;
        }
    }
}

.layout-topbar-menu-mobile-active {
    .layout-topbar-menu {
        display: flex;
        position: absolute;
        padding: 0.5rem;
        background-color: var(--surface-overlay);
        border-radius: 12px;
        box-shadow: 0px 3px 5px rgba(0,0,0,.02), 0px 0px 2px rgba(0,0,0,.05), 0px 1px 4px rgba(0,0,0,.08);

        .layout-topbar-button {
            margin-left: 0;
            display: flex;
            width: 100%;
            height: auto;
            justify-content: flex-start;
            border-radius: 12px;
            padding: 1rem;

            i {
                font-size: 1rem;
                margin-right: .5rem;
            }

            span {
                font-weight: medium;
                display: block;
            }
        }
    }
}

@media (max-width: 991px) {
    .layout-topbar {
        justify-content: space-between;

        .layout-topbar-logo {
            width: auto;
            order: 2;
        }

        .layout-menu-button {
            margin-left: 0;
            order: 1;
        }

        .layout-topbar-menu-button {
            display: inline-flex;
            margin-left: 0;
            order: 3;
        }

        .layout-topbar-menu {
            margin-left: 0;
            position: absolute;
            flex-direction: column;
            background-color: var(--surface-overlay);
            box-shadow: 0px 3px 5px rgba(0,0,0,.02), 0px 0px 2px rgba(0,0,0,.05), 0px 1px 4px rgba(0,0,0,.08);
            border-radius: 12px;
            padding: 1rem;
            right: 2rem;
            top: 5rem;
            min-width: 15rem;
            display: none;
            -webkit-animation: scalein 0.15s linear;
            animation: scalein 0.15s linear;

            .layout-topbar-button {
                margin-left: 0;
                display: flex;
                width: 100%;
                height: auto;
                justify-content: flex-start;
                border-radius: 12px;
                padding: 1rem;

                i {
                    font-size: 1rem;
                    margin-right: .5rem;
                }

                span {
                    font-weight: medium;
                    display: block;
                }
            }
        }

        .layout-topbar-menu-mobile-active {
            .layout-topbar-menu {
                display: block;
            }
        }
    }
}
</style>
