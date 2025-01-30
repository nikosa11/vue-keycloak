<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
      <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
      <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item)" :class="item.class" :target="item.target" tabindex="0">
          <i :class="item.icon" class="layout-menuitem-icon"></i>
          <span class="layout-menuitem-text">{{ item.label }}</span>
          <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
      </a>
      <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
          <i :class="item.icon" class="layout-menuitem-icon"></i>
          <span class="layout-menuitem-text">{{ item.label }}</span>
          <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
      </router-link>
      <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
          <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
              <app-menu-item v-for="(child, i) in item.items" :key="i" :index="i" :item="child" :parent-item-key="itemKey" :root="false"></app-menu-item>
          </ul>
      </Transition>
  </li>
</template>

<script setup>
import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRoute, useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js'

const { onMenuToggle } = useLayout();
const route = useRoute();
const router = useRouter();

const active = ref(false);

const props = defineProps({
  item: {
      type: Object,
      default: () => ({})
  },
  index: {
      type: Number,
      default: 0
  },
  root: {
      type: Boolean,
      default: true
  },
  parentItemKey: {
      type: String,
      default: null
  }
});

const itemKey = ref(null);
const isActiveMenu = ref(false);

const itemClick = (event, item) => {
    if (item.label === 'Logout') {
        ApiService.logoutFromKeycloak();
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtRefreshToken');
        localStorage.removeItem('username');
        router.push('/auth/login');
    }
    onMenuToggle();

    if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
        onMenuToggle();
    }
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    const { overlayMenuActive, staticMenuMobileActive } = useLayout();

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey.value) : itemKey.value;

    setActiveMenuItem(foundItemKey);
};

const checkActiveRoute = (item) => {
    return route.path === item.to;
};

const setActiveMenuItem = (foundItemKey) => {
    // implement setActiveMenuItem logic here
};
</script>

<style lang="scss" scoped>
.layout-menuitem-icon {
    margin-right: 0.5rem;
    background: linear-gradient(90deg, #40E0D0, #2F80ED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.layout-root-menuitem {
    > div {
        font-weight: 600;
        padding: 0.75rem 1rem;
        color: #495057;
    }
}

a {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    text-decoration: none;
    margin: 0 0.5rem;
    
    &:hover {
        background: rgba(0, 0, 0, 0.08);
    }
}

.router-link-active:not([href="/"]) {
    background: rgba(0, 0, 0, 0.08);
}

.active-route:not([href="/"]) {
    background: rgba(0, 0, 0, 0.08);
}

.layout-menuitem-text {
    color: #495057;
}

.layout-submenu-toggler {
  margin-left: auto;
}

.layout-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  
  a {
      padding-left: 2.5rem;
  }
}
</style>
