<template>
  <div class="grid">
    <!-- Βασικά στατιστικά -->
    <div class="col-12 lg:col-6 xl:col-3" v-for="(stat, index) in basicStats" :key="index">
      <div v-if="loading">
        <Skeleton height="100px" />
      </div>
      <div v-else class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">{{stat.title}}</span>
            <div class="text-900 font-medium text-xl">{{stat.value}}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
            <i :class="stat.icon" class="text-primary-700 text-xl"></i>
          </div>
        </div>
        <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
          <i :class="stat.trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
          {{Math.abs(stat.trend)}}%
        </span>
        <span class="text-500 ml-2">από τον προηγούμενο μήνα</span>
      </div>
    </div>

    <!-- Influencer Performance Chart -->
    <div class="col-12 lg:col-6">
      <div v-if="loading">
        <Skeleton height="350px" />
      </div>
      <div v-else class="card">
        <h5>Απόδοση Influencers ανά Πλατφόρμα</h5>
        <Chart type="bar" :data="platformPerformance" :options="barOptions" />
      </div>
    </div>

    <!-- Engagement Metrics -->
    <div class="col-12 lg:col-6">
      <div v-if="loading">
        <Skeleton height="350px" />
      </div>
      <div v-else class="card">
        <h5>Μετρήσεις Engagement</h5>
        <Chart type="line" :data="engagementData" :options="lineOptions" />
      </div>
    </div>

    <!-- Top Influencers -->
    <div class="col-12">
      <div v-if="loading">
        <Skeleton height="200px" />
      </div>
      <div v-else class="card">
        <h5>Κορυφαίοι Influencers</h5>
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3" v-for="(influencer, index) in topInfluencers" :key="index">
            <div class="flex flex-column align-items-center p-3 border-1 surface-border border-round">
              <span class="inline-flex align-items-center justify-content-center bg-primary-100 border-round p-2 mb-3">
                <i class="pi pi-user text-primary-700 text-2xl"></i>
              </span>
              <span class="font-bold mb-2">{{influencer.name}}</span>
              <span class="text-500 mb-2">{{influencer.platform}}</span>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-users"></i>
                <span>{{influencer.followers}}</span>
              </div>
              <div class="flex align-items-center gap-2 mt-2">
                <i class="pi pi-chart-line"></i>
                <span>{{influencer.engagement}}% engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import InfluencerService from '@/service/InfluencerService';

export default {
  data() {
    return {
      loading: true,
      basicStats: [],
      topInfluencers: [],
      platformPerformance: {
        labels: [],
        datasets: []
      },
      engagementData: {
        labels: [],
        datasets: []
      },
      barOptions: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
      lineOptions: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    }
  },
  methods: {
    async fetchStats() {
      try {
        const response = await InfluencerService.getBasicStats();
        const data = response.data;
        
        // Update all stats
        this.basicStats = data.basicStats;
        this.topInfluencers = data.topInfluencers;
        this.platformPerformance = data.platformPerformance;
        this.engagementData = data.engagementData;
        
      } catch (error) {
        console.error('Error fetching stats:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Σφάλμα',
          detail: 'Αποτυχία φόρτωσης στατιστικών',
          life: 3000
        });
        
        // Fallback data
        this.basicStats = [
          {
            title: 'Συνολικοί Influencers',
            value: '1,286',
            icon: 'pi pi-users',
            trend: 12
          },
          {
            title: 'Συνολικό Reach',
            value: '8.5M',
            icon: 'pi pi-globe',
            trend: 8
          },
          {
            title: 'Μέσο Engagement',
            value: '4.2%',
            icon: 'pi pi-heart',
            trend: -2
          },
          {
            title: 'Ενεργές Καμπάνιες',
            value: '42',
            icon: 'pi pi-megaphone',
            trend: 15
          }
        ];
        this.topInfluencers = [
          {
            name: 'Μαρία Παπαδοπούλου',
            platform: 'Instagram',
            followers: '520K',
            engagement: 5.8
          },
          {
            name: 'Γιώργος Δημητρίου',
            platform: 'YouTube',
            followers: '850K',
            engagement: 4.2
          },
          {
            name: 'Ελένη Κωνσταντίνου',
            platform: 'TikTok',
            followers: '1.2M',
            engagement: 7.1
          },
          {
            name: 'Νίκος Αλεξίου',
            platform: 'Instagram',
            followers: '320K',
            engagement: 6.3
          }
        ];
        this.platformPerformance = {
          labels: ['Instagram', 'YouTube', 'TikTok', 'Facebook'],
          datasets: [{
            label: 'Followers (M)',
            data: [2.5, 1.8, 3.2, 1.1],
            backgroundColor: ['#42A5F5', '#FF4081', '#7E57C2', '#66BB6A']
          }]
        };
        this.engagementData = {
          labels: ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιουν'],
          datasets: [{
            label: 'Μέσο Engagement Rate',
            data: [4.2, 4.5, 4.8, 4.3, 4.6, 5.0],
            borderColor: '#42A5F5',
            tension: 0.4
          }]
        };
      } finally {
        this.loading = false;
      }
    }
  },
  setup() {
    const toast = useToast();
    return { toast }
  },
  mounted() {
    this.fetchStats();
  }
}
</script>

<style scoped>
/* Προσθήκη προσαρμοσμένων στυλ για το dashboard */
</style>