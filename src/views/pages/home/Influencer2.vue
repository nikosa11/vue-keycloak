<template>
    <div class="influencer-carousel-container">
      <h2 class="section-title">Προτεινόμενοι Influencers</h2>
      <Swiper
        :modules="[autoplay, pagination]"
        :slides-per-view="3"
        :space-between="30"
        :pagination="{
          clickable: true,
          dynamicBullets: true
        }"
        :loop="true"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false
        }"
        class="influencer-carousel"
        :breakpoints="{
          '320': {
            slidesPerView: 1,
            spaceBetween: 20
          },
          '768': {
            slidesPerView: 2,
            spaceBetween: 30
          },
          '1024': {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }"
      >
        <SwiperSlide v-for="influencer in influencers" :key="influencer.id">
          <Card class="influencer-card">
            <template #header>
              <div class="image-container">
                <img :src="influencer.image" :alt="influencer.name" class="influencer-image" />
              </div>
            </template>
            <template #title>
              <h3 class="card-title text-center">{{ influencer.name }}</h3>
            </template>
            <template #subtitle>
              <div class="text-center">
                <Tag :value="influencer.category" severity="info" class="category-tag" />
              </div>
            </template>
            <template #content>
              <div class="stats-container">
                <div class="stat-item text-center">
                  <i class="pi pi-users"></i>
                  <div class="stat-value">{{ influencer.followers.toLocaleString() }}</div>
                  <div class="stat-label">Ακόλουθοι</div>
                </div>
                <div class="stat-item text-center">
                  <i class="pi pi-chart-line"></i>
                  <div class="stat-value">{{ influencer.engagement }}%</div>
                  <div class="stat-label">Εμπλοκή</div>
                </div>
              </div>
              <p class="description text-center">{{ influencer.description }}</p>
              <div class="button-container text-center">
                <Button 
                  label="Προβολή Προφίλ" 
                  icon="pi pi-user" 
                  class="p-button-raised p-button-rounded" 
                  severity="info"
                  @click="navigateToProfile(influencer.id)"
                />
              </div>
            </template>
          </Card>
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Pagination } from 'swiper';
  import Button from 'primevue/button';
  import Card from 'primevue/card';
  import Tag from 'primevue/tag';
  import InfluencerService from '@/service/InfluencerService';

  import 'swiper/css';
  import 'swiper/css/pagination';

  export default {
    components: {
      Swiper,
      SwiperSlide,
      Button,
      Card,
      Tag
    },
    data() {
      return {
        autoplay: Autoplay,
        pagination: Pagination,
        influencers: []
      };
    },
    methods: {
      navigateToProfile(influencerId) {
        this.$router.push({
          path: '/home/profile2',
          query: { 
            userId: influencerId,
            type: 'influencer'
          }
        });
      },
      async fetchInfluencers() {
        try {
          const response = await InfluencerService.getCarouselInfluencers();
          this.influencers = response.data.map(influencer => ({
            id: influencer.id,
            name: influencer.name,
            category: influencer.category,
            followers: influencer.followers,
            engagement: influencer.engagement,
            description: influencer.description,
            image: influencer.image || 'https://picsum.photos/200?random=' + influencer.id
          }));
        } catch (error) {
          console.error('Error fetching influencers:', error);
          // Fallback data in case of error
          this.influencers = [
            {
              id: 1,
              name: 'Maria Papadopoulou',
              category: 'Fashion',
              followers: 150000,
              engagement: 7.5,
              description: 'Expert in fashion and lifestyle.',
              image: 'https://picsum.photos/200?random=1'
            },
            {
              id: 2,
              name: 'Nikos Oikonomou',
              category: 'Travel',
              followers: 200000,
              engagement: 6.0,
              description: 'Exploring new destinations worldwide.',
              image: 'https://picsum.photos/200?random=2'
            },
            {
              id: 3,
              name: 'Elena Kosta',
              category: 'Fitness',
              followers: 180000,
              engagement: 8.2,
              description: 'Fitness trainer and wellness coach.',
              image: 'https://picsum.photos/200?random=3'
            },
            {
              id: 4,
              name: 'Giorgos Dimitriou',
              category: 'Technology',
              followers: 250000,
              engagement: 5.5,
              description: 'Tech enthusiast and gadget reviewer.',
              image: 'https://picsum.photos/200?random=4'
            }
          ];
        }
      }
    },
    mounted() {
      this.fetchInfluencers();
    }
  };
  </script>
  
  <style scoped>
  .influencer-carousel-container {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 2rem;
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .influencer-carousel {
    padding: 1rem;
  }
  
  .influencer-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
  }
  
  .influencer-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .image-container {
    width: 100%;
    padding-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .influencer-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .text-center {
    text-align: center;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0.5rem 0;
  }
  
  .category-tag {
    margin: 0.5rem 0;
  }
  
  .stats-container {
    display: flex;
    justify-content: space-around;
    margin: 1.5rem 0;
    padding: 1rem 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    flex: 1;
  }
  
  .stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0.2rem 0;
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: #666;
  }
  
  .description {
    color: #666;
    line-height: 1.6;
    margin: 1rem 0;
    padding: 0 1rem;
    height: 3em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .button-container {
    margin-top: 1.5rem;
  }
  
  :deep(.p-card) {
    box-shadow: none !important;
  }
  
  :deep(.p-card-content) {
    padding: 0 !important;
  }
  
  :deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background: #007bff;
    opacity: 0.5;
  }
  
  :deep(.swiper-pagination-bullet-active) {
    opacity: 1;
    background: #007bff;
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
  
    .influencer-carousel-container {
      padding: 1rem;
    }
  
    .stats-container {
      flex-direction: column;
      gap: 1rem;
    }
  
    .stat-item {
      padding: 0.5rem 0;
    }
  }
  </style>