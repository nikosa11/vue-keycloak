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

<script>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import { ApiService } from '@/common/apiService.js'

export default {
  props: {
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
  },
  data() {
      return {
          isActiveMenu: false,
          itemKey: null,
          route: useRoute(),
          router: useRouter(),
          apiService: new ApiService(),
          layoutConfig: useLayout().layoutConfig,
          layoutState: useLayout().layoutState,
          onMenuToggle:useLayout().onMenuToggle
      };
  },
  mounted() {
    const { layoutConfig, layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

      this.itemKey = this.parentItemKey ? this.parentItemKey + '-' + this.index : String(this.index);
      const activeItem = this.layoutState.activeMenuItem;

      this.isActiveMenu = activeItem === this.itemKey || activeItem ? activeItem.startsWith(this.itemKey + '-') : false;

      // watch(
      //     () => this.layoutConfig.activeMenuItem.value,
      //     (newVal) => {
      //         this.isActiveMenu = newVal === this.itemKey || newVal.startsWith(this.itemKey + '-');
      //     }
      // );
  },
  methods: {
      itemClick(event, item) {

          if (item.label === 'Logout') {
              this.apiService.logoutFromKeycloak();
              localStorage.removeItem('jwtToken');
              localStorage.removeItem('jwtRefreshToken');
              localStorage.removeItem('username');
              this.router.push('/auth/login');
          }
          this.onMenuToggle();

          if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
              this.onMenuToggle();
          }
          if (item.disabled) {
              event.preventDefault();
              return;
          }

          const { overlayMenuActive, staticMenuMobileActive } = this.layoutState;

         

          if (item.command) {
              item.command({ originalEvent: event, item: item });
          }

          const foundItemKey = item.items ? (this.isActiveMenu ? this.parentItemKey : this.itemKey) : this.itemKey;

          this.setActiveMenuItem(foundItemKey);

      },
      checkActiveRoute(item) {
          return this.route.path === item.to;
      }
  }
};
</script>

<style lang="scss" scoped>
.layout-root-menuitem {
  font-weight: bold;
  margin-top: 1rem;
}

.active-menuitem {
  background-color: #f4f4f4;
}

.layout-menuitem-root-text {
  padding: 1rem;
  font-size: 1.25rem;
}

.layout-menuitem-icon {
  margin-right: 0.5rem;
}

.layout-menuitem-text {
  font-size: 1.3rem;
}

.layout-submenu-toggler {
  margin-left: auto;
}

.layout-submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 1rem;
}
</style>
