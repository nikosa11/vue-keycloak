<template>
  <div class="grid">
    <Wizzard v-if="WizzardModal" @close="updateCards" />

    <div class="col-12 lg:col-6 xl:col-3" v-for="(card, index) in cards" :key="index">
      <div class="card mb-0">
        <div v-if="loading">
          <Skeleton width="100%" height="2rem" class="mb-2"></Skeleton>
          <Skeleton width="100%" height="1.5rem" class="mb-2"></Skeleton>
          <Skeleton width="100%" height="1rem"></Skeleton>
        </div>
        <div v-else>
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">{{ card.title }}</span>
              <div class="text-900 font-medium text-xl">{{ card.value }}</div>
            </div>
            <div class="flex align-items-center justify-content-center" :class="card.iconBgClass" style="width: 2.5rem; height: 2.5rem">
              <i :class="card.iconClass"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">{{ card.subValue }} </span>
          <span class="text-500">{{ card.description }}</span>
        </div>
      </div>
    </div>
    <div class="col-12 xl:col-6">
      <div v-if="loading">
        <Skeleton width="100%" height="2rem" class="mb-2"></Skeleton>
        <Skeleton width="100%" height="15rem" class="mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem"></Skeleton>
      </div>
      <div v-else>
        <div class="card">
          <h5>Projects</h5>
          <Crud :viewOnly="true"/>

        </div>

      </div>
      
    </div>
    <div class="col-12 xl:col-6 xl:col-5">
      <div v-if="loading">
        <Skeleton width="100%" height="2rem" class="mb-2"></Skeleton>
        <Skeleton width="100%" height="15rem" class="mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem"></Skeleton>
      </div>
      <div v-else>
        <div class="card">
          <h5>Sales Overview</h5>
          <Chart type="line" :data="lineData" :options="lineOptions" />
          <Chart type="line" :data="lineData" :options="lineOptions" />
          <Chart type="line" :data="lineData" :options="lineOptions" />
          <Chart type="line" :data="lineData" :options="lineOptions" />

        </div>

      </div>
      
    </div>
   
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import Chart from 'primevue/chart';
import Wizzard from '@/views/pages/modals/Wizzard.vue';
import MyPage from '@/views/uikit/MyPage.vue';
import Crud from '@/views/pages/home/Crud.vue';

import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useStore } from 'vuex';

import Skeleton from 'primevue/skeleton';

export default {
  components: {
    Chart,
    Button,
    Menu,
    Skeleton,
    Crud,
    MyPage,
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
      items: [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ],
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
          value: '$2.100',
          subValue: '%52+',
          description: 'since last week',
          iconClass: 'pi pi-map-marker text-orange-500 text-xl',
          iconBgClass: 'flex align-items-center justify-content-center bg-orange-100 border-round'
        },
        {
          title: 'Customers',
          value: '28441',
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
      ],
      todayNotifications: [
        {
          text: 'Richard Jones has purchased a blue t-shirt for 79$',
          iconClass: 'pi pi-dollar text-xl text-blue-500',
          iconBgClass: 'w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0'
        },
        {
          text: 'Your request for withdrawal of 2500$ has been initiated.',
          iconClass: 'pi pi-download text-xl text-orange-500',
          iconBgClass: 'w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0'
        }
      ],
      yesterdayNotifications: [
        {
          text: 'Keyser Wick has purchased a black jacket for 59$',
          iconClass: 'pi pi-dollar text-xl text-blue-500',
          iconBgClass: 'w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0'
        },
        {
          text: 'Jane Davis has posted a new question about your product.',
          iconClass: 'pi pi-question text-xl text-pink-500',
          iconBgClass: 'w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0'
        }
      ]
    };
  },
  methods: {
    updateCards(questions) {
      // Logic to update cards based on the data from the modal
      // Example:
      setTimeout(() => {
          this.loading = false;
          console.log("Delayed for 1 second.");
          this.cards[0].value = questions[0].answer;
          this.cards[1].value = questions[1].answer;
          this.cards[2].value = questions[2].answer;
      }, "1000");    
      
    },
    formatCurrency(value) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
    console.log(this.$store.state.wizzardOn);
    if (this.$store.state.wizzardOn){
      this.WizzardModal = true;
      this.$store.commit('setWizzard', false);
    }
    if (!this.WizzardModal) {
      setTimeout(() => {
          this.loading = false;
          console.log("Delayed for 2 second.");
        
      }, "2000");  

    }
  
  }
};
</script>

<style>


</style>
