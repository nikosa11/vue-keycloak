<template>
  <div class="menu-wrapper">
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="i">
            <app-menu-item 
                v-if="!item.separator" 
                :item="item" 
                :index="i"
                class="home-category"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
        <template v-for="(item, i) in generalCategory" :key="i">
            <app-menu-item 
                v-if="!item.separator" 
                :item="item" 
                :index="i"
                :class="{
                    'finance-category': item.label === 'Οικονομικά Στοιχεία',
                    'general-category': item.label === 'General'
                }"
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
.layout-menu {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    background: linear-gradient(145deg, var(--surface-0), var(--surface-50));
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

    :deep(.menu-item) {
        margin: 0.35rem 1rem;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, var(--primary-100), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        &:hover {
            transform: translateX(5px);
            background-color: var(--surface-100);

            &::before {
                opacity: 0.5;
            }
        }

        &.active-route {
            background: linear-gradient(90deg, var(--primary-100), var(--surface-0));
            box-shadow: 0 2px 8px rgba(var(--primary-500), 0.15);
            
            .menu-item-link {
                color: var(--primary-700);
                font-weight: 600;
            }
        }
    }

    :deep(.menu-item-link) {
        padding: 0.85rem 1.2rem;
        color: var(--surface-900);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.8rem;

        i {
            color: var(--primary-600);
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }

        &:hover {
            color: var(--primary-700);

            i {
                transform: scale(1.2) translateX(3px);
                color: var(--primary-800);
            }
        }
    }

    // Οικονομικά Στοιχεία styling
    :deep(.finance-category) {
        .menu-item-link {
            background: linear-gradient(to right, var(--primary-50), transparent);
            border-left: 3px solid var(--primary-500);
            
            i {
                color: var(--primary-700);
            }

            &:hover {
                background: linear-gradient(to right, var(--primary-100), var(--surface-0));
                border-left-color: var(--primary-700);

                i {
                    color: var(--primary-900);
                }
            }
        }
    }

    // Category Headers
    :deep(.menu-category) {
        margin: 1.8rem 1.2rem 1rem;
        font-weight: 700;
        color: var(--surface-600);
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 0.8px;
        position: relative;
        padding-left: 0.8rem;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 1rem;
            background: var(--primary-500);
            border-radius: 2px;
        }
    }

    // Separator styling
    .menu-separator {
        margin: 1.5rem 1rem;
        height: 2px;
        background: linear-gradient(to right, 
            var(--surface-200) 0%, 
            var(--primary-200) 50%, 
            var(--surface-200) 100%
        );
        border-radius: 1px;
    }

    // Home category special styling
    :deep(.home-category) {
        .menu-item-link {
            i {
                color: var(--primary-500);
            }

            &:hover i {
                color: var(--primary-700);
            }
        }
    }

    // General category styling
    :deep(.general-category) {
        .menu-item-link {
            i {
                color: var(--surface-700);
            }

            &:hover i {
                color: var(--surface-900);
            }
        }
    }
}

.paginator {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--surface-50);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &-button {
        background: linear-gradient(145deg, var(--primary-500), var(--primary-600));
        border: none;
        color: white;
        padding: 0.7rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(var(--primary-500), 0.2);

        &:disabled {
            background: linear-gradient(145deg, var(--surface-200), var(--surface-300));
            box-shadow: none;
        }

        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(var(--primary-500), 0.3);
            background: linear-gradient(145deg, var(--primary-600), var(--primary-700));
        }

        &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 10px rgba(var(--primary-500), 0.2);
        }

        i {
            transition: transform 0.3s ease;
        }

        &:hover i {
            transform: scale(1.2);
        }
    }
}

// Προσθήκη dark mode
:deep([data-theme="dark"]) {
    .layout-menu {
        background: linear-gradient(145deg, var(--surface-900), var(--surface-800));
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

        .menu-item-link {
            color: var(--surface-100);

            i {
                color: var(--primary-400);
            }

            &:hover {
                color: var(--primary-300);
                i {
                    color: var(--primary-200);
                }
            }
        }
    }
}
</style>