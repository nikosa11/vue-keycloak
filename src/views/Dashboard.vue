<template>
  <div class="grid">
    <!-- Ενσωμάτωση του Home.vue component -->
    <div class="col-12">
      <Home />
    </div>

    <!-- Ενσωμάτωση του Influencer2.vue component -->
    <div class="col-12">
      <Influencer2 />
    </div>

    <!-- Wizzard Modal που ανοίγει αν είναι ενεργοποιημένο -->
    <Wizzard v-if="WizzardModal" @close="updateCards" />

    <!-- Στατιστικά και άλλες πληροφορίες του Dashboard -->
   </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import Chart from 'primevue/chart';
import Wizzard from '@/views/pages/modals/Wizzard.vue';
import Home from '@/views/pages/home/Home.vue';
import Influencer2 from '@/views/pages/home/Influencer2.vue';
import Crud from '@/views/pages/home/Crud.vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Skeleton from 'primevue/skeleton';

export default {
  components: {
    Chart,
    Button,
    Menu,
    Skeleton,
    Crud,
    Home,
    Influencer2,
    Wizzard
  },
  data() {
    return {
      loading: true,
      WizzardModal: false,
      products: null,
      lineData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
          },
          {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
          }
        ]
      },
      lineOptions: null,
      cards: [
        {
          title: 'Orders',
          value: '152',
          subValue: '24 new',
          description: 'since last visit',
          iconClass: 'pi pi-shopping-cart text-blue-500 text-xl',
          iconBgClass: 'flex align-items-center justify-content-center bg-blue-100 border-round'
        },
        {
          title: 'Revenue',
          value: '$2,100',
          subValue: '%52+',
          description: 'since last week',
          iconClass: 'pi pi-map-marker text-orange-500 text-xl',
          iconBgClass: 'flex align-items-center justify-content-center bg-orange-100 border-round'
        },
        {
          title: 'Customers',
          value: '28,441',
          subValue: '520',
          description: 'newly registered',
          iconClass: 'pi pi-inbox text-cyan-500 text-xl',
          iconBgClass: 'flex align-items-center justify-content-center bg-cyan-100 border-round'
        },
        {
          title: 'Comments',
          value: '152 Unread',
          subValue: '85',
          description: 'responded',
          iconClass: 'pi pi-comment text-purple-500 text-xl',
          iconBgClass: 'flex align-items-center justify-content-center bg-purple-100 border-round'
        }
      ]
    };
  },
  methods: {
    updateCards(questions) {
      setTimeout(() => {
        this.loading = false;
        this.cards[0].value = questions[0].answer;
        this.cards[1].value = questions[1].answer;
        this.cards[2].value = questions[2].answer;
      }, 1000);
    },
    applyLightTheme() {
      this.lineOptions = {
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          },
          y: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          }
        }
      };
    },
    applyDarkTheme() {
      this.lineOptions = {
        plugins: {
          legend: {
            labels: {
              color: '#ebedef'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#ebedef'
            },
            grid: {
              color: 'rgba(160, 167, 181, .3)'
            }
          },
          y: {
            ticks: {
              color: '#ebedef'
            },
            grid: {
              color: 'rgba(160, 167, 181, .3)'
            }
          }
        }
      };
    }
  },
  mounted() {
    const productService = new ProductService();
    productService.getProductsSmall().then((data) => {
      this.products = data;
    });

    const { isDarkTheme } = useLayout();
    this.$watch(
      () => isDarkTheme.value,
      (val) => {
        if (val) {
          this.applyDarkTheme();
        } else {
          this.applyLightTheme();
        }
      },
      { immediate: true }
    );

    if (this.$store.state.wizzardOn) {
      this.WizzardModal = true;
      this.$store.commit('setWizzard', false);
    }

    if (!this.WizzardModal) {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  }
};
</script>

<style scoped>
/* Προσθήκη προσαρμοσμένων στυλ για το dashboard */

</style>
