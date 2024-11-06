<template>
  <div class="influencer-component">
    <div class="card">
      <div class="font-semibold text-xl mb-4">Influencers</div>
      <DataTable
        ref="dt"
        :value="influencers"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['name', 'category', 'followers', 'engagement', 'price']"
        showGridlines
        @row-click="openInfluencerDialog"
        class="influencer-table"
        v-if="isReady"
      >
        <template #header>
          <div class="custom-filter-header">
            <Button 
              type="button" 
              icon="pi pi-filter-slash" 
              label="Καθαρισμός Φίλτρων" 
              outlined 
              @click="clearAllFilters()" 
              class="custom-clear-button p-button-sm"
            />
            <span class="custom-search-wrapper">
              <i class="pi pi-search" />
              <InputText 
                v-model="filters.global.value" 
                placeholder="Αναζήτηση..." 
                class="custom-search-input p-inputtext-sm"
              />
            </span>
          </div>
        </template>

        <template #empty> Δεν βρέθηκαν influencers. </template>
        <template #loading> Φόρτωση δεδομένων... </template>

        <Column field="name" header="Όνομα" style="min-width: 12rem" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              type="text"
              @input="filterCallback()" 
              class="p-column-filter" 
              placeholder="Αναζήτηση ονόματος"
            />
          </template>
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" style="width: 32px; height: 32px; border-radius: 50%;" />
              <span>{{ slotProps.data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="category" header="Κατηγορία" style="min-width: 12rem" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown
              v-model="filterModel.value"
              :options="categories"
              @change="filterCallback()"
              placeholder="Επιλογή κατηγορίας"
              class="p-column-filter"
              :showClear="true"
            />
          </template>
          <template #body="slotProps">
            <Tag :value="slotProps.data.category" severity="info" />
          </template>
        </Column>

        <Column field="followers" header="Ακόλουθοι" style="min-width: 10rem" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <div class="flex gap-2">
              <InputNumber
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Ελάχιστο"
                class="p-column-filter"
                :min="0"
              />
            </div>
          </template>
          <template #body="slotProps">
            {{ formatNumber(slotProps.data.followers) }}
          </template>
        </Column>

        <Column field="engagement" header="Engagement" style="min-width: 8rem" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <div class="flex gap-2">
              <InputNumber
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Ελάχιστο %"
                class="p-column-filter"
                :min="0"
                :max="100"
                suffix="%"
              />
            </div>
          </template>
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <div class="flex-1">
                <ProgressBar :value="slotProps.data.engagement" :showValue="false" />
              </div>
              <span class="font-bold">{{ slotProps.data.engagement }}%</span>
            </div>
          </template>
        </Column>

        <Column field="price" header="Κόστος" style="min-width: 10rem" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <div class="flex flex-column gap-2">
              <InputNumber
                v-model="filterModel.value[0]"
                @input="filterCallback()"
                placeholder="Από"
                class="p-column-filter"
                :min="0"
                mode="currency"
                currency="EUR"
              />
              <InputNumber
                v-model="filterModel.value[1]"
                @input="filterCallback()"
                placeholder="Έως"
                class="p-column-filter"
                :min="0"
                mode="currency"
                currency="EUR"
              />
            </div>
          </template>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>

        <Column field="rating" header="Αξιολόγηση" style="min-width: 10rem" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <Rating
              v-model="filterModel.value"
              @change="filterCallback()"
              :cancel="false"
              :stars="5"
            />
          </template>
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
              <span class="font-bold ml-2">{{ slotProps.data.rating.toFixed(1) }}</span>
            </div>
          </template>
        </Column>

        <Column field="verified" header="Επαλήθευση" bodyClass="text-center" style="min-width: 8rem">
          <template #body="slotProps">
            <i class="pi" :class="{ 'pi-check-circle text-green-500': true }"></i>
          </template>
        </Column>
      </DataTable>

      <!-- Influencer Details Dialog -->
      <Dialog 
        v-model:visible="dialogVisible" 
        :style="{ width: '500px' }" 
        :header="selectedInfluencer?.name || ''" 
        :modal="true" 
        class="p-fluid"
      >
        <div v-if="selectedInfluencer" class="influencer-details">
          <div class="text-center mb-5">
            <img
              :src="selectedInfluencer.image"
              :alt="selectedInfluencer.name"
              class="rounded-circle"
              style="width: 150px; height: 150px; object-fit: cover;"
            />
          </div>

          <div class="grid">
            <div class="col-6">
              <div class="field">
                <label>Κατηγορία</label>
                <Tag :value="selectedInfluencer.category" severity="info" class="w-full justify-content-center"/>
              </div>
            </div>
            <div class="col-6">
              <div class="field">
                <label>Engagement Rate</label>
                <div class="text-center font-bold">{{ selectedInfluencer.engagement }}%</div>
              </div>
            </div>
          </div>

          <div class="field mt-4">
            <label>Κοινωνικά Δίκτυα</label>
            <div class="flex justify-content-around mt-2">
              <div v-if="selectedInfluencer.socialMedia.instagram" class="text-center">
                <i class="pi pi-instagram text-xl"></i>
                <div class="text-sm">{{ selectedInfluencer.socialMedia.instagram }}</div>
              </div>
              <div v-if="selectedInfluencer.socialMedia.youtube" class="text-center">
                <i class="pi pi-youtube text-xl"></i>
                <div class="text-sm">{{ selectedInfluencer.socialMedia.youtube }}</div>
              </div>
              <div v-if="selectedInfluencer.socialMedia.tiktok" class="text-center">
                <i class="pi pi-twitter text-xl"></i>
                <div class="text-sm">{{ selectedInfluencer.socialMedia.tiktok }}</div>
              </div>
            </div>
          </div>

          <div class="field mt-4">
            <label>Πρόσφατες Συνεργασίες</label>
            <div class="flex flex-wrap gap-2 mt-2">
              <Tag v-for="brand in selectedInfluencer.recentBrands" 
                   :key="brand" 
                   :value="brand" 
                   severity="secondary"/>
            </div>
          </div>

          <div class="field mt-4">
            <label>Αξιολόγηση</label>
            <div class="flex align-items-center gap-2 mt-2">
              <Rating 
                v-model="selectedInfluencer.rating" 
                :readonly="true" 
                :cancel="false"
                :stars="5"
              />
              <span class="font-bold ml-2">({{ selectedInfluencer.rating.toFixed(1) }})</span>
            </div>
          </div>

          <div class="flex justify-content-between mt-4">
            <Button 
              label="Προβολή Προφίλ" 
              icon="pi pi-user" 
              class="p-button-outlined"
            />
            <Button 
              :label="`Συνεργασία - ${formatCurrency(selectedInfluencer.price)}`"
              icon="pi pi-send" 
              severity="success"
            />
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { CustomerService } from '@/service/CustomerService';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Rating from 'primevue/rating';

export default {
  components: {
    Rating
  },
  data() {
    return {
      isReady: false,
      influencers: [],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        category: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        followers: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }]
        },
        engagement: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }]
        },
        price: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.BETWEEN }]
        },
        rating: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }]
        }
      },
      loading: true,
      selectedInfluencer: null,
      dialogVisible: false,
      categories: [
        'Music & Entertainment',
        'Lifestyle & TV',
        'Fashion & Beauty',
        'Food & Cooking',
        'Lifestyle & Fashion',
        'Fitness & Health',
        'Lifestyle & Acting',
        'Home & Decoration'
      ]
    };
  },
  async created() {
    try {
      const service = new CustomerService();
      const response = await service.getCustomersLarge();
      this.influencers = response.data;
      this.loading = false;
      this.isReady = true;
    } catch (error) {
      console.error('Error loading influencers:', error);
      this.loading = false;
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    },
    formatNumber(value) {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value;
    },
    clearAllFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        category: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        followers: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }]
        },
        engagement: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }]
        },
        price: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.BETWEEN }]
        },
        rating: { 
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }]
        }
      };
      if (this.$refs.dt) {
        this.$refs.dt.reset();
      }
    },
    openInfluencerDialog(event) {
      this.selectedInfluencer = event.data;
      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped lang="scss">
.influencer-component {
  /* Απομόνωση από το grid system του Dashboard */
  width: 100%;
  display: block;
  
  .card {
    padding: 1.5rem;
    margin-bottom: 0;
    border-radius: 1.5rem;
    background: var(--surface-card);
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    
    /* Επαναφορά του box model */
    box-sizing: border-box;
  }

  /* Επαναφορά των στυλ για το DataTable */
  :deep(.p-datatable) {
    border-radius: 1rem;
    overflow: hidden;
    
    .p-datatable-header {
      border-radius: 1rem 1rem 0 0;
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      padding: 1.25rem;
    }
    
    .p-datatable-thead > tr > th {
      &:first-child {
        border-top-left-radius: 0.8rem;
      }
      &:last-child {
        border-top-right-radius: 0.8rem;
      }
    }
    
    .p-datatable-tbody > tr:last-child > td {
      &:first-child {
        border-bottom-left-radius: 0.8rem;
      }
      &:last-child {
        border-bottom-right-radius: 0.8rem;
      }
    }
  }

  /* Στυλ για τα φίλτρα */
  .custom-filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    gap: 1rem;
    
    /* Επαναφορά του box model για τα inputs */
    .custom-search-wrapper {
      flex: 1;
      max-width: 300px;
      
      .p-inputtext {
        width: 100%;
        box-sizing: border-box;
      }
    }
  }

  /* Στυλ για τα column filters */
  :deep(.p-column-filter) {
    width: 100%;
    
    .p-column-filter-element {
      width: 100%;
      
      .p-inputtext,
      .p-dropdown,
      .p-inputnumber-input {
        width: 100%;
        box-sizing: border-box;
      }
    }
  }

  /* Responsive διορθώσεις */
  @media screen and (max-width: 768px) {
    .custom-filter-header {
      flex-direction: column;
      align-items: stretch;
      
      .custom-search-wrapper {
        max-width: 100%;
      }
    }
  }
}

.influencer-table {
  :deep(.p-datatable-header) {
    background: var(--surface-0);
    border: 1px solid var(--surface-200);
  }
  
  :deep(.p-column-filter-menu-button) {
    width: 2rem;
    height: 2rem;
  }
  
  :deep(.p-column-filter-overlay) {
    min-width: 220px;
  }
}

/* Επιπλέον στυλ για τα φίλτρα στηλών */
:deep(.p-column-filter-element) {
  width: 100%;
  margin-bottom: 0.5rem;
  
  .p-inputnumber-input,
  .p-dropdown {
    width: 100%;
  }
  
  .p-rating {
    display: flex;
    justify-content: center;
  }
}

.influencer-details {
  .field {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-color-secondary);
    }
  }
}

.rounded-circle {
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
}

.engagement-progress {
  .p-progressbar {
    background: #f5f5f5;
  }
  
  .p-progressbar-value {
    background: var(--primary-color);
    transition: width 0.5s ease;
  }
}

:deep(.p-progressbar) {
  border-radius: 4px;
  background: #f5f5f5;
}

:deep(.p-progressbar-value) {
  border-radius: 4px;
  background: var(--primary-color);
}

:deep(.p-rating) {
  .p-rating-item {
    &.p-rating-item-active {
      color: var(--yellow-500);
    }
    
    &:focus {
      box-shadow: none;
    }
  }
}

.p-input-icon-left {
  .p-inputtext {
    padding-left: 2.5rem;
    min-width: 300px;
  }
  
  i {
    left: 0.75rem;
  }
}

/* Προσθήκη responsive styles */
@media screen and (max-width: 768px) {
  .p-input-icon-left .p-inputtext {
    min-width: 200px;
  }
}

@media screen and (max-width: 480px) {
  .p-input-icon-left .p-inputtext {
    min-width: 150px;
  }
}

:deep(.p-datatable-header) {
  padding: 1rem;
  background-color: var(--surface-0);
}

:deep(.p-button-sm) {
  font-size: 0.875rem;
  padding: 0.4rem 0.8rem;
}

:deep(.p-inputtext-sm) {
  font-size: 0.875rem;
  padding: 0.4rem 0.8rem;
}

.p-column-filter {
  width: 100%;
  
  &.p-inputnumber {
    .p-inputnumber-input {
      width: 100%;
    }
  }
}

/* Στυλ για το DataTable */
:deep(.p-datatable) {
  border-radius: 1rem;
  overflow: hidden;
  
  .p-datatable-header {
    border-radius: 1rem 1rem 0 0;
    background: var(--surface-section);
    border: 1px solid var(--surface-border);
    padding: 1.25rem;
  }
  
  .p-datatable-thead > tr > th {
    &:first-child {
      border-top-left-radius: 0.8rem;
    }
    &:last-child {
      border-top-right-radius: 0.8rem;
    }
  }
  
  .p-datatable-tbody > tr:last-child > td {
    &:first-child {
      border-bottom-left-radius: 0.8rem;
    }
    &:last-child {
      border-bottom-right-radius: 0.8rem;
    }
  }
}

/* Στυλ για τα inputs και buttons */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-button) {
  border-radius: 1rem !important;
}

:deep(.p-tag) {
  border-radius: 2rem;
  padding: 0.4rem 1rem;
}

:deep(.p-progressbar) {
  border-radius: 1rem;
  overflow: hidden;
  
  .p-progressbar-value {
    border-radius: 1rem;
  }
}

/* Dialog στυλ */
:deep(.p-dialog) {
  border-radius: 1.5rem;
  overflow: hidden;
  
  .p-dialog-header {
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
  }
  
  .p-dialog-content {
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
  }
}

/* Column filter menu */
:deep(.p-column-filter-overlay) {
  border-radius: 1rem;
  .p-column-filter-constraint {
    border-radius: 0.8rem;
  }
}

/* Rating stars */
:deep(.p-rating) {
  .p-rating-item {
    border-radius: 50%;
    
    &.p-rating-item-active {
      transform: scale(1.1);
      transition: transform 0.2s ease;
    }
  }
}

/* Search input */
.p-input-icon-left {
  .p-inputtext {
    border-radius: 2rem !important;
    padding-left: 2.8rem;
  }
}

/* Chips/Tags */
:deep(.p-chip) {
  border-radius: 2rem;
}

/* Dialog content */
.influencer-details {
  .field {
    .p-tag {
      border-radius: 2rem;
    }
    
    .p-button {
      border-radius: 2rem;
    }
  }
}

/* Progress bar */
:deep(.p-progressbar) {
  border-radius: 1rem;
  
  .p-progressbar-value {
    border-radius: 1rem;
  }
}

/* Dropdown menus */
:deep(.p-dropdown-panel) {
  border-radius: 1rem;
  overflow: hidden;
  
  .p-dropdown-items {
    padding: 0.5rem;
    
    .p-dropdown-item {
      border-radius: 0.8rem;
      margin: 0.2rem 0;
    }
  }
}

/* Input number */
:deep(.p-inputnumber) {
  .p-inputtext {
    border-radius: 1rem !important;
  }
}
</style>
  