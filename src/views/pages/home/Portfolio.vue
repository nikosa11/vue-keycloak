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
                    <div v-for="influencer in dummyInfluencers" :key="influencer.id" 
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
export default {
    data() {
        return {
            filters: {
                global: null
            },
            selectedCategory: null,
            categories: [
                { name: 'Όλες οι κατηγορίες' },
                { name: 'Music & Entertainment' },
                { name: 'Lifestyle & TV' },
                { name: 'Fashion & Beauty' },
                { name: 'Food & Cooking' },
                { name: 'Fitness & Health' }
            ],
            loading: false,
            dummyInfluencers: [
                {
                    id: 1,
                    name: 'Ελένη Παπαδοπούλου',
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
                    category: 'Fashion & Beauty',
                    rating: 5,
                    followers: 850000,
                    engagement: 4.8,
                    price: 2500,
                    recentBrands: ['Sephora', 'MAC', 'NYX'],
                    socialMedia: {
                        instagram: '@eleni_style',
                        youtube: '@eleni_beauty',
                        tiktok: '@eleni_official'
                    }
                },
                {
                    id: 2,
                    name: 'Γιώργος Αλεξίου',
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
                    category: 'Fitness & Health',
                    rating: 4,
                    followers: 620000,
                    engagement: 5.2,
                    price: 1800,
                    recentBrands: ['Nike', 'MyProtein', 'Adidas'],
                    socialMedia: {
                        instagram: '@george_fitness',
                        youtube: '@george_workout'
                    }
                },
                {
                    id: 3,
                    name: 'Μαρία Κωνσταντίνου',
                    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604',
                    category: 'Food & Cooking',
                    rating: 5,
                    followers: 420000,
                    engagement: 6.1,
                    price: 1500,
                    recentBrands: ['Kitchen Aid', 'Lidl', 'AB'],
                    socialMedia: {
                        instagram: '@maria_cooks',
                        youtube: '@maria_recipes'
                    }
                },
                {
                    id: 4,
                    name: 'Νίκος Δημητρίου',
                    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
                    category: 'Music & Entertainment',
                    rating: 4,
                    followers: 980000,
                    engagement: 4.5,
                    price: 3000,
                    recentBrands: ['Spotify', 'Sony Music', 'JBL'],
                    socialMedia: {
                        instagram: '@nikos_music',
                        youtube: '@nikos_official',
                        tiktok: '@nikos_beats'
                    }
                }
            ]
        }
    },
    methods: {
        formatNumber(num) {
            return new Intl.NumberFormat().format(num);
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
            this.dummyInfluencers.sort((a, b) => b.engagement - a.engagement);
        },
        sortByRating() {
            this.dummyInfluencers.sort((a, b) => b.rating - a.rating);
        }
    },
    computed: {
        filteredInfluencers() {
            let filtered = [...this.dummyInfluencers];
            
            if (this.filters.global) {
                const searchTerm = this.filters.global.toLowerCase();
                filtered = filtered.filter(inf => 
                    inf.name.toLowerCase().includes(searchTerm) ||
                    inf.category.toLowerCase().includes(searchTerm)
                );
            }

            if (this.selectedCategory && this.selectedCategory.name !== 'Όλες οι κατηγορίες') {
                filtered = filtered.filter(inf => inf.category === this.selectedCategory.name);
            }

            return filtered;
        }
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