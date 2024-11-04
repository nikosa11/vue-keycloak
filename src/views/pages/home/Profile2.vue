<template>
    <div class="profile-page">
      <div class="content">
        <div class="content__cover">
          <div class="content__avatar"></div>
          <div class="content__bull">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="content__actions">
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path fill="currentColor" d="M192 256A112 112 0 1 0 80 144a111.94 111.94 0 0 0 112 112zm76.8 32h-8.3a157.53 157.53 0 0 1-68.5 16c-24.6 0-47.6-6-68.5-16h-8.3A115.23 115.23 0 0 0 0 403.2V432a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48v-28.8A115.23 115.23 0 0 0 268.8 288z"/>
            </svg>
            <span>Ακολούθησε</span>
          </a>
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path fill="currentColor" d="M208 352c-41 0-79.1-9.3-111.3-25-21.8 12.7-52.1 25-88.7 25a7.83 7.83 0 0 1-7.3-4.8 8 8 0 0 1 1.5-8.7c.3-.3 22.4-24.3 35.8-54.5-23.9-26.1-38-57.7-38-92C0 103.6 93.1 32 208 32s208 71.6 208 160-93.1 160-208 160z"/>
            </svg>
            <span>Μήνυμα</span>
          </a>
        </div>
        <div class="content__title">
          <h1>{{ influencer.name }}</h1>
          <span>{{ influencer.location }}</span>
        </div>
        <div class="content__description">
          <p><span class="pi pi-instagram"></span> {{ influencer.socialMedia.instagram }}</p>
          <p><span class="pi pi-facebook"></span> {{ influencer.socialMedia.facebook }}</p>
          <p><span class="pi pi-twitter"></span> {{ influencer.socialMedia.twitter }}</p>
        </div>
        <ul class="content__list">
          <li>
            <span>{{ formatNumber(influencer.followers) }}</span>
            Ακόλουθοι
          </li>
          <li>
            <span>{{ influencer.engagement }}%</span>
            Εμπλοκή
          </li>
          <li>
            <span>{{ influencer.campaigns }}</span>
            Καμπάνιες
          </li>
        </ul>
        <div class="content__description">
          <p class="about-text">{{ influencer.description }}</p>
        </div>
        <div class="content__categories">
          <div class="categories-container">
            <Tag v-for="category in influencer.categories" 
                 :key="category"
                 :value="category"
                 severity="info"
                 class="category-tag" />
          </div>
        </div>
        <div class="content__achievements">
          <div class="achievements-grid">
            <Card v-for="achievement in influencer.achievements" 
                  :key="achievement.title" 
                  class="achievement-card">
              <template #content>
                <div class="achievement-content">
                  <i :class="achievement.icon"></i>
                  <h4>{{ achievement.title }}</h4>
                  <p>{{ achievement.description }}</p>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <div class="content__button">
          <a class="button" @click="contactInfluencer">
            <p class="button__text">
              Επικοινωνία
              <i class="pi pi-send"></i>
            </p>
          </a>
        </div>
      </div>
      <div class="bg">
        <div><span></span><span></span><span></span><span></span><span></span><span></span></div>
      </div>
    </div>
  </template>
  
  <script>
  import { useToast } from 'primevue/usetoast';
  import Card from 'primevue/card';
  import Tag from 'primevue/tag';
  
  export default {
    components: {
      Card,
      Tag
    },
    data() {
      return {
        influencer: {
          name: 'Maria Papadopoulou',
          location: 'Αθήνα, Ελλάδα',
          followers: 150000,
          engagement: 7.5,
          campaigns: 45,
          socialMedia: {
            instagram: '@mariapapadopoulou',
            facebook: 'Maria Papadopoulou',
            twitter: '@maria_p'
          },
          categories: ['Fashion', 'Lifestyle', 'Beauty', 'Travel'],
          description: 'Fashion enthusiast και lifestyle blogger με πάθος για τη μόδα και τα ταξίδια. Μοιράζομαι καθημερινά tips για στυλ και ομορφιά.',
          achievements: [
            {
              title: 'Top Influencer 2023',
              description: 'Αναγνωρίστηκε ως κορυφαίος fashion influencer',
              icon: 'pi pi-star text-yellow-500 text-3xl'
            },
            {
              title: 'Best Campaign',
              description: 'Καλύτερη καμπάνια μόδας για το 2023',
              icon: 'pi pi-trophy text-yellow-500 text-3xl'
            },
            {
              title: 'Brand Ambassador',
              description: 'Επίσημη πρέσβειρα για κορυφαίες μάρκες',
              icon: 'pi pi-verified text-blue-500 text-3xl'
            }
          ]
        }
      };
    },
    methods: {
      formatNumber(num) {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        }
        return num;
      },
      contactInfluencer() {
        this.toast.add({ 
          severity: 'success', 
          summary: 'Επιτυχία', 
          detail: 'Το μήνυμά σας στάλθηκε στον influencer', 
          life: 3000 
        });
      }
    },
    created() {
      this.toast = useToast();
    }
  };
  </script>
  
  <style scoped>
  /* Base Styles */
  .profile-page {
    display: flex;
    min-height: 100vh;
    padding-top: 5rem;
  }
  
  @media (max-width: 990px) {
    .profile-page {
      padding-top: 0;
    }
  }
  
  .profile-page .content {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
    position: relative;
    z-index: 2;
    margin: auto;
    padding: 2rem;
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 15px 35px rgba(50,50,93,0.1), 0 5px 15px rgba(0,0,0,0.07);
  }
  
  @media (max-width: 990px) {
    .profile-page .content {
      max-width: 420px;
      padding: 0;
      border-radius: 0;
    }
  }
  
  .profile-page .content__cover {
    position: relative;
    background: linear-gradient(150deg, #1d8cf8 20%, #3358f4 100%);
  }
  
  .theme-orange .profile-page .content__cover {
    background: linear-gradient(150deg, #ff4086 20%, #fd8d76 100%);
  }
  
  .theme-purple .profile-page .content__cover {
    background: linear-gradient(150deg, #8700ff 20%, #f000ff 100%);
  }
  
  .theme-green .profile-page .content__cover {
    background: linear-gradient(150deg, #1dcc45 20%, #42b883 100%);
  }
  
  .theme-blue .profile-page .content__cover {
    background: linear-gradient(150deg, #0098f0 20%, #00f2c3 100%);
  }
  
  .profile-page .content__bull {
    display: none;
    height: 12rem;
    position: relative;
    overflow: hidden;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__bull {
      display: block;
    }
  }
  
  .profile-page .content__bull span {
    display: block;
    position: absolute;
    z-index: 1;
    border-radius: 50%;
  }
  
  .profile-page .content__bull span:nth-child(1) {
    width: 5rem;
    height: 5rem;
    top: -6%;
    left: -3%;
    background: rgba(255,255,255,0.12);
  }
  
  .profile-page .content__bull span:nth-child(2) {
    width: 8rem;
    height: 8rem;
    top: 18%;
    left: 18%;
    background: rgba(255,255,255,0.05);
  }
  
  .profile-page .content__bull span:nth-child(3) {
    width: 3rem;
    height: 3rem;
    top: 8%;
    right: 2%;
    background: rgba(255,255,255,0.05);
  }
  
  .profile-page .content__bull span:nth-child(4) {
    width: 6rem;
    height: 6rem;
    top: 28%;
    right: 12%;
    background: rgba(255,255,255,0.1);
  }
  
  .profile-page .content__bull span:nth-child(5) {
    width: 4rem;
    height: 4rem;
    top: 70%;
    left: -6%;
    background: rgba(255,255,255,0.04);
  }
  
  .profile-page .content__avatar {
    width: 12rem;
    height: 12rem;
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, 50%);
    background: #8f6ed5 url("https://image.freepik.com/free-photo/friendly-brunette-looking-camera_23-2147774849.jpg") center center no-repeat;
    background-size: cover;
    border-radius: 50%;
    box-shadow: 0 15px 35px rgba(50,50,93,0.1), 0 5px 15px rgba(0,0,0,0.07);
  }
  
  @media (max-width: 990px) {
    .profile-page .content__avatar {
      width: 11rem;
      height: 11rem;
      border: 0.3rem solid #fff;
      box-shadow: none;
    }
  }
  
  .profile-page .content__actions {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__actions {
      padding: 0.8rem 2rem;
    }
  }
  
  .profile-page .content__actions a {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    height: 3rem;
    padding: 0.2rem 1rem;
    border-radius: 2rem;
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__actions a {
      padding: 0.5rem;
    }
  }
  
  @media (max-width: 990px) {
    .profile-page .content__actions a span {
      display: none;
    }
  }
  
  .profile-page .content__actions a svg {
    width: 2rem;
    margin-right: 0.4rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__actions a svg {
      margin: 0;
    }
  }
  
  .profile-page .content__actions a svg path:last-child {
    opacity: 0.5;
  }
  
  .profile-page .content__actions a:first-child {
    color: #ff4086;
  }
  
  .theme-orange .profile-page .content__actions a:first-child {
    color: #ff4086;
  }
  
  .theme-purple .profile-page .content__actions a:first-child {
    color: #8700ff;
  }
  
  .theme-green .profile-page .content__actions a:first-child {
    color: #1dcc45;
  }
  
  .theme-blue .profile-page .content__actions a:first-child {
    color: #0098f0;
  }
  /* Content Styles */
  .profile-page .content__title {
    margin-top: 4.5rem;
    text-align: center;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__title {
      margin-top: 1.5rem;
    }
  }
  
  .profile-page .content__title h1 {
    margin-bottom: 0.1rem;
    font-size: 2.4rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__title h1 {
      font-size: 1.8rem;
    }
  }
  
  .profile-page .content__title span {
    font-size: 1rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__title span {
      font-size: 0.9rem;
    }
  }
  
  .profile-page .content__description {
    margin-top: 2.5rem;
    text-align: center;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__description {
      margin-top: 1.5rem;
    }
  }
  
  .profile-page .content__description p {
    margin-bottom: 0.2rem;
    font-size: 1.2rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__description p {
      font-size: 1rem;
    }
  }
  
  .profile-page .content__list {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    list-style-type: none;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__list {
      margin-top: 1.5rem;
    }
  }
  
  .profile-page .content__list li {
    padding: 0 1.5rem;
    text-align: center;
    font-size: 1rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__list li {
      font-size: 0.8rem;
    }
  }
  
  .profile-page .content__list li span {
    display: block;
    margin-bottom: 0.1rem;
    font-weight: bold;
    font-size: 1.6rem;
  }
  
  @media (max-width: 990px) {
    .profile-page .content__list li span {
      font-size: 1.2rem;
    }
  }
  
  /* Custom Components Styles */
  .categories-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin: 1rem 0;
    padding: 0 1rem;
  }
  
  .category-tag {
    margin: 0.25rem;
  }
  
  .about-text {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  
  .achievement-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .achievement-content {
    text-align: center;
    padding: 1.5rem;
  }
  
  .achievement-content i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #1d8cf8;
  }
  
  .achievement-content h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }
  
  .achievement-content p {
    font-size: 0.9rem;
    color: #666;
  }
  
  /* PrimeVue Components Overrides */
  :deep(.p-card) {
    background: transparent;
    box-shadow: none;
  }
  
  :deep(.p-card .p-card-content) {
    padding: 0;
  }
  
  :deep(.p-tag) {
    padding: 0.5rem 1rem;
  }
  
  .content__description .pi {
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
  
  /* Button Styles */
  .content__button {
    margin: 3rem 0 2rem;
    border-radius: 17px;
    text-align: center;
  }
  
  @media (max-width: 990px) {
    .content__button {
      margin: 1.5rem 0 2.2rem;
    }
  }
  
  .content__button .button {
    display: inline-block;
    padding: 1.2rem 12rem;
    text-align: center;
    text-decoration: none;
    background: linear-gradient(100deg, #1d8cf8 30%, #3358f4 100%);
    border-radius: 2rem;
    box-shadow: 0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0,0,0,0.08);
    font-size: 1rem;
    color: #fff;
    cursor: pointer;
  }
  
  /* Theme Variations */
  .theme-orange .content__button .button {
    background: linear-gradient(100deg, #ff4086 10%, #fd8d76 100%);
  }
  
  .theme-purple .content__button .button {
    background: linear-gradient(100deg, #8700ff 10%, #f000ff 100%);
  }
  
  .theme-green .content__button .button {
    background: linear-gradient(100deg, #1dcc45 10%, #42b883 100%);
  }
  
  .theme-blue .content__button .button {
    background: linear-gradient(100deg, #0098f0 10%, #00f2c3 100%);
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .achievements-grid {
      grid-template-columns: 1fr;
    }
  
    .about-text {
      padding: 0 1rem;
    }
  
    .content__button .button {
      padding: 1rem 2rem;
    }
  
    .categories-container {
      padding: 0 0.5rem;
    }
  }
  </style>