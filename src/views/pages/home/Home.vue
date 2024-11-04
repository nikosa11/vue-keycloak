<template>
    <div class="home-container">
      <div class="hero-section">
        <img src="https://picsum.photos/1200/400" alt="Hero Image" class="hero-image" />
        <div class="hero-content">
          <h1 class="hero-title text-white font-bold text-shadow">
            Καλώς ήρθατε στην Πλατφόρμα Προώθησης
          </h1>
          <p class="hero-subtitle text-white text-shadow-sm mb-6">
            Ανακαλύψτε τον ιδανικό influencer για το προϊόν σας και βελτιώστε την καμπάνια σας.
          </p>
          <div class="hero-buttons">
            <Button 
              label="Αναζήτηση Influencers" 
              icon="pi pi-search" 
              class="p-button-raised p-button-rounded mr-2 hero-button" 
              @click="navigateToSearch"
              severity="info"
            />
            <Button 
              label="Προφίλ" 
              icon="pi pi-user" 
              class="p-button-raised p-button-rounded hero-button" 
              @click="navigateToProfile"
              severity="secondary"
            />
          </div>
        </div>
      </div>
      <div class="features-section">
        <div class="grid">
          <div class="col-12 md:col-4">
            <Card class="feature-card">
              <template #header>
                <i class="pi pi-users text-4xl text-primary"></i>
              </template>
              <template #title>
                Εύρεση Influencers
              </template>
              <template #content>
                Βρείτε τους κατάλληλους influencers που ταιριάζουν με το brand σας
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-4">
            <Card class="feature-card">
              <template #header>
                <i class="pi pi-chart-bar text-4xl text-primary"></i>
              </template>
              <template #title>
                Αναλυτικά Στοιχεία
              </template>
              <template #content>
                Παρακολουθήστε τις επιδόσεις των καμπανιών σας σε πραγματικό χρόνο
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-4">
            <Card class="feature-card">
              <template #header>
                <i class="pi pi-comments text-4xl text-primary"></i>
              </template>
              <template #title>
                Άμεση Επικοινωνία
              </template>
              <template #content>
                Επικοινωνήστε απευθείας με τους influencers μέσω της πλατφόρμας
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Button from 'primevue/button';
  import Card from 'primevue/card';
  
  export default {
    components: { 
      Button,
      Card
    },
    methods: {
      navigateToSearch() {
        this.$router.push('/home/influencers');
      },
      navigateToProfile() {
        this.$router.push('/home/profile');
      }
    }
  };
  </script>
  
  <style scoped>
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
  }
  
  .hero-section {
    position: relative;
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-bottom: 3rem;
  }
  
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.5);
    transition: filter 0.3s ease;
  }
  
  .hero-content {
    position: absolute;
    text-align: center;
    max-width: 800px;
    padding: 0 2rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: 0.5px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .hero-button {
    font-weight: 600;
    padding: 1rem 2rem;
    transition: transform 0.2s ease;
  }
  
  .hero-button:hover {
    transform: translateY(-2px);
  }
  
  .features-section {
    width: 100%;
    max-width: 1200px;
    padding: 4rem 2rem;
  }
  
  .feature-card {
    text-align: center;
    background: white;
    border-radius: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.p-card-header) {
    padding: 2rem 0 1rem;
  }
  
  :deep(.p-card-title) {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 1rem 0;
  }
  
  :deep(.p-card-content) {
    padding: 1rem 2rem 2rem;
    color: #666;
    line-height: 1.6;
  }
  
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .text-shadow-sm {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
    }
    
    .hero-buttons {
      flex-direction: column;
      gap: 1rem;
    }
  }
  </style>