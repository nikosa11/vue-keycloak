<template>
  <ul class="layout-menu">
    ---------------------------------------------------

      <template v-for="(item, i) in model" :key="i">
          <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
      </template>
      
      <!-- <li v-if="showPaginator" class="paginator">
          <button @click="prevPage" :disabled="!canPrevPage" class="paginator-button"><i data-v-23c7af83="" class="text-2xl mb-2 pi pi-arrow-left"></i></button>
          <button @click="nextPage" :disabled="!canNextPage" class="paginator-button"><i data-v-23c7af83="" class="text-2xl mb-2 pi pi-arrow-right"></i></button>
      </li> -->
      ---------------------------------------------------
      <template v-for="(item, i) in generalCategory" :key="i">
          <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
      </template>
  </ul>
</template>

<script>
import AppMenuItem from './AppMenuItem.vue';
import {ProductService} from '@/service/ProductService.js';

export default {
  components: {
      AppMenuItem
  },
  data() {
      return {
          model: [
              {
                  label: 'Home',
                  items: [{ label: 'Dashboard', icon: 'text-2xl mb-2 pi pi-fw pi-home', to: '/' },
                  { label: 'MyPage', icon: 'text-2xl mb-2 pi pi-fw pi-circle', to: '/uikit/myPage' },
                  { label: 'Create - Edit', icon: 'text-2xl mb-2 pi pi-plus', to: '/home/crud' }


                  ]
              },
            //   {
            //       label: 'SEARCH',
            //       items: []
            //   }
          ],
          products: [],
          page: 1,
          pageSize: 5,
          canPrevPage: false,
          canNextPage: true,
          generalCategory : [
              {
                  label: 'General',
                  items: [{ label: 'Daft', icon: 'text-2xl mb-2 pi pi-inbox', to: 'uikit/myPage' },
                  { label: 'Bin', icon: 'text-2xl mb-2 pi pi-trash', to: 'uikit/myPage' },
                  { label: 'Opened', icon: 'text-2xl mb-2 pi pi-folder-open', to: 'uikit/myPage' },
                  { label: 'Favorites', icon: 'text-2xl mb-2 pi pi-heart', to: 'uikit/myPage' },
                  { label: 'Other', icon: 'text-2xl mb-2 pi pi-filter-fill', to: 'uikit/myPage' },

                  ]
              },
          ],
    
      };
  },
  computed: {
      showPaginator() {
          return this.model.find(item => item.label === 'SEARCH').items.length > 0;
      }
  },
  async created() {
      const productService = new ProductService();
      this.products = await productService.getProducts();
    //   this.updateNewsItems();
  },
  methods: {
      paginateProducts(page, pageSize) {
          const start = (page - 1) * pageSize;
          const end = page * pageSize;
          return this.products.slice(start, end).map(product => ({
              label: product.name,
              icon: 'text-2xl mb-2 pi pi-chevron-right',
              to: `/product/${product.id}`
          }));
      },
      nextPage() {
          if (this.page * this.pageSize < this.products.length) {
              this.page++;
              this.updateNewsItems();
          }
      },
      prevPage() {
          if (this.page > 1) {
              this.page--;
              this.updateNewsItems();
          }
      },
      updateNewsItems() {
          const newsItem = this.model.find(item => item.label === 'SEARCH');
          if (newsItem) {
              newsItem.items = this.paginateProducts(this.page, this.pageSize);
              this.canPrevPage = this.page > 1;
              this.canNextPage = this.page * this.pageSize < this.products.length;
          }
      }
  }
};
</script>

<style lang="scss" scoped>
.layout-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-separator {
  margin: 0.5rem 0;
  height: 1px;
  background-color: #e5e5e5;
}

.paginator {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.paginator-button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.paginator-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.paginator-button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
