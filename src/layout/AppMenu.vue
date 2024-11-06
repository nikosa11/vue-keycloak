<template>
  <div class="menu-wrapper">
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="i">
            <app-menu-item 
                v-if="!item.separator" 
                :item="item" 
                :index="i"
                class="menu-item home-category"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
        <template v-for="(item, i) in generalCategory" :key="i">
            <app-menu-item 
                v-if="!item.separator" 
                :item="item" 
                :index="i"
                :class="[
                    'menu-item',
                    {
                        'finance-category': item.label === 'Οικονομικά Στοιχεία',
                        'general-category': item.label === 'General'
                    }
                ]"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
  </div>
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
                            label: 'Portfolio', 
                            icon: 'text-2xl mb-2 pi pi-images', 
                            to: '/portfolio' 
                        }
                    ]
                },
                {
                    label: 'Διαχείριση',
                    items: [
                        { label: 'Προϊόντα', icon: 'pi pi-fw pi-shopping-cart', to: 'home/crud' },
                       
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
                // {
                //     label: 'General',
                //     icon: 'text-2xl mb-2 pi pi-cog',
                //     items: [
                //         { 
                //             label: 'Πρόχειρα', 
                //             icon: 'text-2xl mb-2 pi pi-file-edit', 
                //             to: '/drafts' 
                //         },
                //         { 
                //             label: 'Κάδος', 
                //             icon: 'text-2xl mb-2 pi pi-trash', 
                //             to: '/bin' 
                //         },
                //         { 
                //             label: 'Ανοιχτά', 
                //             icon: 'text-2xl mb-2 pi pi-folder-open', 
                //             to: '/opened' 
                //         },
                //         { 
                //             label: 'Αγαπημένα', 
                //             icon: 'text-2xl mb-2 pi pi-heart', 
                //             to: '/favorites' 
                //         },
                //         { 
                //             label: 'Άλλα', 
                //             icon: 'text-2xl mb-2 pi pi-filter-fill', 
                //             to: '/other' 
                //         }
                //     ]
                // }
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
.menu-wrapper {
    padding: 1rem;
}

.layout-menu {
    list-style: none;
    margin: 0;

    .menu-item {
        margin-bottom: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;

        :deep(.menu-item-link) {
            display: flex;
            align-items: center;
            padding: 0.9rem 1.2rem;
            color: #2c3e50;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 500;
            letter-spacing: 0.2px;

            i {
                margin-right: 12px;
                font-size: 1.1rem;
                color: #1e88e5;
                transition: all 0.3s ease;
            }

            &:hover {
                background: #f5f9ff;
                transform: translateX(3px);

                i {
                    transform: scale(1.1);
                    color: #1976d2;
                }
            }
        }

        &.active-route {
            :deep(.menu-item-link) {
                background: #e3f2fd;
                color: #1565c0;
                font-weight: 600;

                i {
                    color: #1565c0;
                }
            }
        }
    }

    .finance-category {
        :deep(.menu-item-link) {
            background: #fafafa;
            border-left: 3px solid #1e88e5;

            i {
                color: #1976d2;
            }

            &:hover {
                background: #f5f9ff;
            }
        }
    }

    .menu-separator {
        height: 1px;
        background: #e8eaf6;
        margin: 1rem 0;
    }
}

// Dark mode
:deep([data-theme="dark"]) {
    .layout-menu {
        background: #1a1f2c;

        .menu-item {
            :deep(.menu-item-link) {
                color: #e0e6ed;

                i {
                    color: #64b5f6;
                }

                &:hover {
                    background: #252d3b;
                }
            }

            &.active-route {
                :deep(.menu-item-link) {
                    background: #252d3b;
                    color: #90caf9;
                }
            }
        }

        .finance-category {
            :deep(.menu-item-link) {
                background: #1e242e;
                border-left-color: #64b5f6;
            }
        }

        .menu-separator {
            background: #2c3547;
        }
    }
}

:deep(.menu-item-link) {
    background-color: #ffffff !important;
    color: #333333 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    font-weight: 500 !important;
}

:deep(.menu-item-link:hover) {
    background-color: #f0f7ff !important;
    color: #1976d2 !important;
}

:deep(.menu-item.active-route .menu-item-link) {
    background-color: #e3f2fd !important;
    color: #1976d2 !important;
    border-left: 3px solid #1976d2 !important;
}

:deep(.menu-item i) {
    color: #1976d2 !important;
}
</style>