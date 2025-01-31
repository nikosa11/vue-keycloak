<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" 
         style="background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 2rem; padding: 0.3rem; background: linear-gradient(45deg, #833AB4, #FD1D1D, #FCAF45);">
                <div class="w-full surface-card py-8 px-5 sm:px-8" 
                     style="border-radius: 1.8rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3" 
                             style="background: linear-gradient(45deg, #833AB4, #E1306C, #F77737); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                             Complete Your Influencer Profile
                        </div>
                        <span class="text-600 font-medium">Tell us about your influence</span>
                    </div>

                    <div class="flex flex-column gap-4">
                        <!-- Instagram Handle -->
                        <div class="flex flex-column gap-2">
                            <label for="instagram" class="text-900 font-medium">Instagram Handle</label>
                            <div class="p-input-icon-left">
                                <i class="pi pi-instagram"></i>
                                <InputText 
                                    id="instagram"
                                    v-model="instagramHandle" 
                                    type="text" 
                                    placeholder="@yourusername"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- Followers Count -->
                        <div class="flex flex-column gap-2">
                            <label for="followers" class="text-900 font-medium">Number of Followers</label>
                            <div class="p-input-icon-left">
                                <i class="pi pi-users"></i>
                                <InputNumber 
                                    id="followers"
                                    v-model="followersCount" 
                                    :min="0" 
                                    placeholder="Enter your followers count"
                                    class="w-full"
                                    mode="decimal"
                                    :use-grouping="true"
                                />
                            </div>
                        </div>

                        <!-- Categories -->
                        <div class="flex flex-column gap-2">
                            <label class="text-900 font-medium">What do you create content about?</label>
                            <div class="categories-container">
                                <div class="category-grid">
                                    <div v-for="category in categories" :key="category.name" 
                                         class="category-chip"
                                         :class="{ 'selected': selectedCategories.includes(category.name) }"
                                         @click="toggleCategory(category.name)">
                                        <i :class="category.icon"></i>
                                        <span>{{ category.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pricing -->
                        <div class="flex flex-column gap-2">
                            <label class="text-900 font-medium">Your Standard Rates</label>
                            <div class="grid">
                                <div class="col-12 md:col-6 mb-2 md:mb-0">
                                    <div class="pricing-card p-3">
                                        <div class="text-900 font-medium mb-2">Story</div>
                                        <InputNumber 
                                            v-model="storyPrice" 
                                            mode="currency" 
                                            currency="EUR" 
                                            locale="el-GR"
                                            class="w-full"
                                            placeholder="Enter price for story"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="pricing-card p-3">
                                        <div class="text-900 font-medium mb-2">Post</div>
                                        <InputNumber 
                                            v-model="postPrice" 
                                            mode="currency" 
                                            currency="EUR" 
                                            locale="el-GR"
                                            class="w-full"
                                            placeholder="Enter price for post"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bio -->
                        <div class="flex flex-column gap-2">
                            <label for="bio" class="text-900 font-medium">Short Bio</label>
                            <Textarea
                                id="bio"
                                v-model="bio"
                                rows="3"
                                placeholder="Tell us a bit about yourself..."
                                :autoResize="true"
                                class="w-full"
                            />
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 mt-3">
                            <Button 
                                label="Skip for Now" 
                                @click="skipForNow" 
                                class="p-button-outlined flex-1"
                            />
                            <Button 
                                label="Complete Profile" 
                                @click="handleSubmit" 
                                class="p-button-primary flex-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ApiService } from '@/common/apiService.js';

export default {
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            instagramHandle: '',
            followersCount: null,
            selectedCategories: [],
            storyPrice: null,
            postPrice: null,
            bio: '',
            categories: [
                { name: 'Fashion', icon: 'pi pi-shopping-bag' },
                { name: 'Beauty', icon: 'pi pi-heart' },
                { name: 'Lifestyle', icon: 'pi pi-home' },
                { name: 'Travel', icon: 'pi pi-globe' },
                { name: 'Food', icon: 'pi pi-apple' },
                { name: 'Fitness', icon: 'pi pi-heart-fill' },
                { name: 'Technology', icon: 'pi pi-desktop' },
                { name: 'Gaming', icon: 'pi pi-discord' },
                { name: 'Art', icon: 'pi pi-palette' },
                { name: 'Music', icon: 'pi pi-volume-up' },
                { name: 'Education', icon: 'pi pi-book' },
                { name: 'Business', icon: 'pi pi-briefcase' },
                { name: 'Photography', icon: 'pi pi-camera' },
                { name: 'Sports', icon: 'pi pi-flag' },
                { name: 'DIY & Crafts', icon: 'pi pi-pencil' },
                { name: 'Pets', icon: 'pi pi-heart' }
            ]
        };
    },
    methods: {
        toggleCategory(categoryName) {
            const index = this.selectedCategories.indexOf(categoryName);
            if (index === -1) {
                this.selectedCategories.push(categoryName);
            } else {
                this.selectedCategories.splice(index, 1);
            }
        },
        async handleSubmit() {
            try {
                // Create the profile data object
                const profileData = {
                    instagramHandle: this.instagramHandle,
                    followers: this.followersCount,
                    categories: this.selectedCategories,
                    pricing: {
                        story: this.storyPrice,
                        post: this.postPrice
                    },
                    bio: this.bio
                };
                
                // Log the data that would be sent to the API
                console.log('Profile data to be sent:', profileData);

                /*
                Example JSON structure:
                {
                    "instagramHandle": "@example",
                    "followers": 10000,
                    "categories": ["Fashion", "Beauty", "Lifestyle"],
                    "pricing": {
                        "story": 100,
                        "post": 200
                    },
                    "bio": "Digital creator passionate about fashion and lifestyle"
                }
                */

                // Commenting out the API call for now
                // await apiService.updateInfluencerProfile(profileData);
                
                // For now, just proceed to home page
                await this.router.push('/');
                
            } catch (error) {
                console.error('Failed to update profile:', error);
            }
        },
        skipForNow() {
            this.$router.push('/');
        }
    }
};
</script>

<style lang="scss" scoped>
.surface-ground {
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.categories-container {
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1.5rem;
    border: 1px solid rgba(131, 58, 180, 0.2);
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
    width: 100%;
}

.category-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 1.5rem;
    background: white;
    border: 1px solid rgba(131, 58, 180, 0.2);
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
    width: 100%;
    justify-content: center;

    i {
        font-size: 1.1rem;
        background: linear-gradient(45deg, #833AB4, #E1306C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(131, 58, 180, 0.15);
        border-color: #C13584;
    }

    &.selected {
        background: linear-gradient(45deg, #833AB4, #E1306C);
        border: none;
        color: white;
        box-shadow: 0 4px 15px rgba(131, 58, 180, 0.3);

        i {
            background: none;
            -webkit-text-fill-color: white;
        }
    }
}

.pricing-card {
    transition: all 0.3s ease;
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(131, 58, 180, 0.2);
    backdrop-filter: blur(10px);
    
    &:hover {
        transform: translateY(-2px);
        border-color: #C13584;
        box-shadow: 0 4px 15px rgba(131, 58, 180, 0.15);
    }
}

.p-button {
    border-radius: 2rem !important;
    padding: 1rem 2rem;
    height: auto;
}

.p-button.p-button-primary {
    background: linear-gradient(45deg, #833AB4, #E1306C) !important;
    border: none !important;
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(45deg, #C13584, #FD1D1D) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(193, 53, 132, 0.3);
    }
}

.p-button.p-button-outlined {
    border: 2px solid #C13584 !important;
    color: #C13584 !important;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9) !important;

    &:hover {
        background: rgba(193, 53, 132, 0.1) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(193, 53, 132, 0.15);
    }
}

.p-input-icon-left {
    width: 100%;
    
    i {
        background: linear-gradient(45deg, #833AB4, #E1306C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    input, textarea {
        border-radius: 1.5rem !important;
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px);
        
        &:focus {
            border-color: #C13584;
            box-shadow: 0 0 0 1px #C13584;
        }
    }
}

:deep(.p-inputtext),
:deep(.p-inputnumber-input),
:deep(.p-textarea) {
    width: 100%;
    transition: all 0.3s ease;
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(131, 58, 180, 0.2);

    &:hover {
        border-color: #C13584;
    }

    &:focus {
        border-color: #C13584;
        box-shadow: 0 0 0 1px #C13584;
    }
}

:deep(.p-inputnumber),
:deep(.p-textarea) {
    width: 100%;

    .p-inputtext {
        border-radius: 1.5rem;
    }
}

@media screen and (max-width: 768px) {
    .surface-card {
        margin: 1rem;
        max-height: 90vh;
        overflow-y: auto;
    }

    .category-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .category-chip {
        padding: 0.6rem 0.8rem;
        font-size: 0.9rem;

        i {
            font-size: 1rem;
        }
    }

    .p-button {
        padding: 0.75rem 1.5rem;
    }

    :deep(.p-inputtext),
    :deep(.p-inputnumber-input),
    :deep(.p-textarea) {
        padding: 0.75rem 1rem;
    }
}

@media screen and (max-width: 480px) {
    .category-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .surface-card {
        padding: 1.5rem 1rem !important;
    }
}
</style>
