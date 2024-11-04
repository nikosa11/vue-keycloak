<template>
  <ul class="layout-menu">
      <template v-for="(item, i) in model" :key="i">
          <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
      </template>
      
      <template v-for="(item, i) in generalCategory" :key="i">
          <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
      </template>
  </ul>
</template>

<script>
import AppMenuItem from './AppMenuItem.vue';
import { ProductService } from '@/service/ProductService.js';

export default {
    name: 'AppMenu',
    components: {
        AppMenuItem
    },
    data() {
        return {
            model: [
                {
                    label: 'Home',
                    items: [
                        { 
                            label: 'Home', 
                            icon: 'text-2xl mb-2 pi pi-fw pi-home', 
                            to: '/' 
                        },
                        // { 
                        //     label: 'MyPage', 
                        //     icon: 'text-2xl mb-2 pi pi-fw pi-circle', 
                        //     to: '/uikit/myPage' 
                        // },
                        { 
                            label: 'Στατιστικά Στοιχεία', 
                            icon: 'text-2xl mb-2 pi pi-chart-line', 
                            to: '/stats' 
                        },
                        { 
                            label: 'Proposal', 
                            icon: 'text-2xl mb-2 pi pi-file', 
                            to: '/proposal' 
                        },
                        { 
                            label: 'Influencers', 
                            icon: 'text-2xl mb-2 pi pi-fw pi-users', 
                            to: '/home/influencers' 
                        },
                        { 
                            label: 'Προϊόντα', 
                            icon: 'text-2xl mb-2 pi pi-plus', 
                            to: '/home/crud' 
                        }
                    ]
                }
            ],
            generalCategory: [
                {
                    label: 'Οικονομικά Στοιχεία',
                    icon: 'text-2xl mb-2 pi pi-money-bill',
                    items: [
                        { 
                            label: 'Ιστορικό Συναλλαγών', 
                            icon: 'text-2xl mb-2 pi pi-history', 
                            to: '/transactionHistory' 
                        },
                        { 
                            label: 'Διαχείριση Μεθόδων Πληρωμής', 
                            icon: 'text-2xl mb-2 pi pi-credit-card', 
                            to: '/PaymentMethods' 
                        },
                        { 
                            label: 'Διαχείριση Πληρωμών', 
                            icon: 'text-2xl mb-2 pi pi-wallet', 
                            to: '/PaymentPage' 
                        },
                        { 
                            label: 'Τιμολόγια & Αποδείξεις', 
                            icon: 'text-2xl mb-2 pi pi-file-pdf', 
                            to: '/InvoicesReceipts' 
                        }
                    ]
                },
                {
                    label: 'General',
                    icon: 'text-2xl mb-2 pi pi-cog',
                    items: [
                        { 
                            label: 'Πρόχειρα', 
                            icon: 'text-2xl mb-2 pi pi-file-edit', 
                            to: '/drafts' 
                        },
                        { 
                            label: 'Κάδος', 
                            icon: 'text-2xl mb-2 pi pi-trash', 
                            to: '/bin' 
                        },
                        { 
                            label: 'Ανοιχτά', 
                            icon: 'text-2xl mb-2 pi pi-folder-open', 
                            to: '/opened' 
                        },
                        { 
                            label: 'Αγαπημένα', 
                            icon: 'text-2xl mb-2 pi pi-heart', 
                            to: '/favorites' 
                        },
                        { 
                            label: 'Άλλα', 
                            icon: 'text-2xl mb-2 pi pi-filter-fill', 
                            to: '/other' 
                        }
                    ]
                }
            ],
            products: [],
            page: 1,
            pageSize: 5,
            canPrevPage: false,
            canNextPage: true
        };
    },
    computed: {
        showPaginator() {
            return this.model.find(item => item.label === 'SEARCH')?.items.length > 0;
        }
    },
    async created() {
        try {
            const productService = new ProductService();
            this.products = await productService.getProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
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

    .menu-separator {
        margin: 1rem 0;
        height: 1px;
        background-color: var(--surface-border);
        border: 0 none;
    }
}

.paginator {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;

    &-button {
        background-color: var(--primary-color);
        border: none;
        color: var(--primary-color-text);
        padding: 0.5rem 1rem;
        text-align: center;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        margin: 0.25rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:disabled {
            background-color: var(--surface-300);
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            background-color: var(--primary-600);
        }

        i {
            margin: 0;
        }
    }
}
</style>