<template>
    <div class="grid">
        <div class="col-12">
            <div class="card border-round-2xl">
                <h5 class="text-center text-3xl mb-5 font-medium">Portfolio Συνεργασιών</h5>
                
                <!-- Φίλτρα με πιο curved σχεδιασμό -->
                <div class="flex flex-column md:flex-row md:justify-content-between mb-5 gap-3">
                    <div class="flex flex-column md:flex-row gap-3">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters.global" placeholder="Αναζήτηση..." 
                                     class="border-round-2xl p-3" />
                        </span>
                        <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name" 
                                placeholder="Κατηγορία" class="w-full md:w-14rem border-round-2xl"/>
                    </div>
                    <div class="flex gap-2">
                        <Button icon="pi pi-sort-amount-down" label="Engagement" @click="sortByEngagement" 
                                class="p-button-outlined border-round-2xl"/>
                        <Button icon="pi pi-sort-alpha-down" label="Rating" @click="sortByRating" 
                                class="p-button-outlined border-round-2xl"/>
                    </div>
                </div>

                <!-- Κάρτες Influencers -->
                <div class="grid">
                    <div v-for="influencer in filteredInfluencers" :key="influencer.id" 
                         class="col-12 md:col-6 lg:col-4 xl:col-3">
                        <div class="card m-2 border-round-2xl shadow-3 hover:shadow-5 transition-duration-300 h-full">
                            <div class="flex flex-column align-items-center text-center mb-3">
                                <div class="relative">
                                    <img :src="influencer.image" :alt="influencer.name" 
                                         class="w-9 shadow-2 border-round-2xl mb-3" 
                                         style="height: 200px; object-fit: cover;"/>
                                    <span class="absolute top-0 right-0 m-2 py-1 px-2 border-round-2xl bg-primary font-bold text-white">
                                        {{influencer.category}}
                                    </span>
                                </div>
                                <div class="text-2xl font-bold">{{ influencer.name }}</div>
                                <Rating :modelValue="influencer.rating" readonly :cancel="false" class="mb-3"/>
                            </div>

                            <div class="surface-50 border-round-xl p-3 mb-3">
                                <div class="flex justify-content-between mb-2">
                                    <span class="text-600">Followers:</span>
                                    <span class="font-bold">{{ formatNumber(influencer.followers) }}</span>
                                </div>
                                <div class="flex justify-content-between mb-2">
                                    <span class="text-600">Engagement:</span>
                                    <span class="font-bold text-primary">{{ influencer.engagement }}%</span>
                                </div>
                                <div class="flex justify-content-between">
                                    <span class="text-600">Rate:</span>
                                    <span class="font-bold">€{{ formatNumber(influencer.price) }}</span>
                                </div>
                            </div>

                            <div class="mb-3">
                                <h6 class="mb-2">Πρόσφατες Συνεργασίες:</h6>
                                <div class="flex flex-wrap gap-2">
                                    <Chip v-for="brand in influencer.recentBrands" 
                                          :key="brand" :label="brand"
                                          class="border-round-2xl"/>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 justify-content-center">
                                <Button v-for="(handle, platform) in influencer.socialMedia" 
                                        :key="platform"
                                        :icon="'pi pi-' + getSocialIcon(platform)"
                                        :label="handle"
                                        class="p-button-rounded p-button-outlined"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CampaignService from '@/service/CampaignService';

export default {
    data() {
        return {
            portfolio: [],
            selectedCategory: null,
            loading: false,
            filters: {
                global: null
            },
            categories: [
                { name: 'Όλες οι κατηγορίες', code: 'all' },
                { name: 'Music & Entertainment', code: 'music' },
                { name: 'Lifestyle & TV', code: 'lifestyle' },
                { name: 'Fashion & Beauty', code: 'fashion' },
                { name: 'Food & Cooking', code: 'food' },
                { name: 'Fitness & Health', code: 'fitness' }
            ]
        };
    },
    methods: {
        async loadPortfolio() {
            try {
                this.loading = true;
                const response = await CampaignService.getPortfolio();
                this.portfolio = response.data;
            } catch (error) {
                console.error('Error loading portfolio:', error);
            } finally {
                this.loading = false;
            }
        },
        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        getSocialIcon(platform) {
            const icons = {
                instagram: 'instagram',
                youtube: 'youtube',
                tiktok: 'video'
            };
            return icons[platform.toLowerCase()] || 'link';
        },
        sortByEngagement() {
            this.portfolio.sort((a, b) => b.engagement - a.engagement);
        },
        sortByRating() {
            this.portfolio.sort((a, b) => b.rating - a.rating);
        }
    },
    computed: {
        filteredInfluencers() {
            if (!this.portfolio) return [];
            
            let filtered = [...this.portfolio];
            
            if (this.filters.global) {
                const searchTerm = this.filters.global.toLowerCase();
                filtered = filtered.filter(inf => 
                    inf.name.toLowerCase().includes(searchTerm) ||
                    inf.category.toLowerCase().includes(searchTerm)
                );
            }
            
            if (this.selectedCategory && this.selectedCategory.code !== 'all') {
                filtered = filtered.filter(inf => 
                    inf.category === this.selectedCategory.code
                );
            }
            
            return filtered;
        }
    },
    mounted() {
        this.loadPortfolio();
    }
}
</script>

<style scoped lang="scss">
.p-rating {
    justify-content: center;
}

.card {
    transition: all 0.3s ease-in-out;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
        transform: translateY(-5px);
    }
}

// Για να έχουν όλες οι εικόνες το ίδιο ύψος
img {
    width: 100%;
    height: 200px !important; // Σταθερό ύψος για όλες τις εικόνες
    object-fit: cover;
}

// Για να ευθυγραμμίζονται τα social media buttons στο κάτω μέρος
.flex-grow-1 {
    flex-grow: 1;
}

// Για να έχουν όλα τα chips το ίδιο μέγεθος
.p-chip {
    height: 2rem;
    display: inline-flex;
    align-items: center;
}

// Για να έχουν όλα τα social media buttons το ίδιο μέγεθος
.p-button {
    width: auto;
    min-width: 120px;
}

// Για να διατηρούν οι κάρτες το ίδιο πλάτος
.col-12.md\:col-6.lg\:col-4.xl\:col-3 {
    display: flex;
}

.transition-duration-300 {
    transition-duration: 300ms;
}

// Προσθήκη animation για το hover effect
@keyframes cardHover {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-5px);
    }
}
</style>