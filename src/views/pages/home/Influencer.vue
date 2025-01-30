<template>
  <div class="influencer-component">
    <div class="card">
      <Toast />
      <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-4">
        <h2 class="text-2xl font-semibold m-0">Influencers</h2>
        <div class="flex gap-2">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters.global.value" placeholder="Αναζήτηση..." class="p-inputtext-sm" />
          </span>
          <Button 
            type="button" 
            icon="pi pi-filter-slash" 
            label="Καθαρισμός" 
            severity="secondary"
            @click="clearAllFilters()" 
            class="p-button-rounded p-button-sm"
          />
        </div>
      </div>

      <DataTable
        ref="dt"
        :value="influencers"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        :loading="loading"
        :globalFilterFields="['name', 'category', 'followers', 'engagement', 'price']"
        class="p-datatable-sm"
        v-if="isReady"
        stripedRows
        @row-click="openInfluencerDialog"
        style="cursor: pointer"
      >
        <template #empty> Δεν βρέθηκαν influencers. </template>
        <template #loading> Φόρτωση δεδομένων... </template>

        <Column field="name" header="Όνομα" style="min-width: 12rem" :sortable="true">
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-3rem h-3rem shadow-2 rounded-circle" />
              <div class="flex flex-column">
                <span class="font-bold">{{ slotProps.data.name }}</span>
                <span class="text-500">{{ slotProps.data.platform || 'Instagram' }}</span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="category" header="Κατηγορία" style="min-width: 12rem" :sortable="true">
          <template #body="slotProps">
            <Tag :value="slotProps.data.category" :style="{ backgroundColor: getCategoryColor(slotProps.data.category), color: '#ffffff' }" class="p-tag-rounded" />
          </template>
        </Column>

        <Column field="followers" header="Ακόλουθοι" style="min-width: 10rem" :sortable="true">
          <template #body="slotProps">
            <span class="font-semibold">{{ formatNumber(slotProps.data.followers) }}</span>
          </template>
        </Column>

        <Column field="engagement" header="Engagement" style="min-width: 8rem" :sortable="true">
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <div class="flex-1">
                <ProgressBar :value="slotProps.data.engagement" :showValue="false" class="h-1rem" :style="{ backgroundColor: 'var(--surface-ground)' }" />
              </div>
              <span class="font-bold">{{ slotProps.data.engagement }}%</span>
            </div>
          </template>
        </Column>

        <Column field="price" header="Κόστος" style="min-width: 10rem" :sortable="true">
          <template #body="slotProps">
            <span class="font-semibold">{{ formatCurrency(slotProps.data.price) }}</span>
          </template>
        </Column>

        <Column field="rating" header="Αξιολόγηση" style="min-width: 10rem" :sortable="true">
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" :stars="5" class="rating-sm" />
              <span class="font-bold ml-2">{{ slotProps.data.rating.toFixed(1) }}</span>
            </div>
          </template>
        </Column>
      </DataTable>

      <Dialog 
        v-model:visible="dialogVisible" 
        :style="{ width: '500px' }" 
        header="Προβολή Influencer" 
        :modal="true" 
        :dismissableMask="true"
        class="p-fluid"
      >
        <div v-if="selectedInfluencer" class="influencer-details">
          <div class="flex align-items-center justify-content-center mb-4">
            <img
              :src="selectedInfluencer.image"
              :alt="selectedInfluencer.name"
              class="w-8rem h-8rem shadow-2 rounded-circle"
            />
          </div>

          <div class="field mb-4">
            <label class="font-medium mb-2 block">Όνομα</label>
            <div class="text-900">{{ selectedInfluencer.name }}</div>
          </div>

          <div class="formgrid grid mb-4">
            <div class="field col">
              <label class="font-medium mb-2 block">Κατηγορία</label>
              <Tag :value="selectedInfluencer.category" :style="{ backgroundColor: getCategoryColor(selectedInfluencer.category), color: '#ffffff' }" class="p-tag-rounded" />
            </div>
            <div class="field col">
              <label class="font-medium mb-2 block">Κόστος</label>
              <div class="text-900">{{ formatCurrency(selectedInfluencer.price) }}</div>
            </div>
          </div>

          <div class="formgrid grid mb-4">
            <div class="field col">
              <label class="font-medium mb-2 block">Ακόλουθοι</label>
              <div class="text-900">{{ formatNumber(selectedInfluencer.followers) }}</div>
            </div>
            <div class="field col">
              <label class="font-medium mb-2 block">Engagement</label>
              <div class="text-900">{{ selectedInfluencer.engagement }}%</div>
            </div>
          </div>

          <div class="field">
            <label class="font-medium mb-2 block">Αξιολόγηση</label>
            <div class="flex align-items-center gap-2">
              <Rating :modelValue="selectedInfluencer.rating" :readonly="true" :cancel="false" />
              <span class="font-bold ml-2">{{ selectedInfluencer.rating.toFixed(1) }}</span>
            </div>
          </div>

          <div class="flex justify-content-between mt-4">
            <Button 
              label="Προβολή Προφίλ" 
              icon="pi pi-user" 
              class="p-button-outlined p-button-rounded"
              @click="navigateToProfile(selectedInfluencer.id)"
            />
            <Button 
              :label="`Συνεργασία - ${formatCurrency(selectedInfluencer.price)}`"
              icon="pi pi-send" 
              severity="success"
              class="p-button-rounded"
            />
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import InfluencerService from '@/service/InfluencerService';

const dt = ref();
const toast = useToast();
const loading = ref(true);
const dialogVisible = ref(false);
const selectedInfluencer = ref(null);
const isReady = ref(false);
const influencers = ref([]);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.EQUALS },
    followers: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL },
    engagement: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL },
    price: { 
        operator: FilterOperator.AND,
        constraints: [
            { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL },
            { value: null, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL }
        ]
    },
    rating: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }
});

const fetchInfluencers = async () => {
    try {
        const response = await InfluencerService.getInfluencers();
        influencers.value = response.data.data;
    } catch (error) {
        console.error('Error fetching influencers:', error);
        toast.add({
            severity: 'error',
            summary: 'Σφάλμα',
            detail: 'Αποτυχία φόρτωσης influencers',
            life: 3000
        });
    } finally {
        loading.value = false;
        isReady.value = true;
    }
};

const getCategoryColor = (category) => {
    const colors = {
        'Music & Entertainment': '#3B82F6',
        'Fashion & Beauty': '#EC4899',
        'Lifestyle': '#6366F1',
        'Travel': '#F59E0B',
        'Food': '#10B981',
        'Sports': '#8B5CF6',
        'Technology': '#64748B'
    };
    return colors[category] || '#64748B';
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

const formatNumber = (value) => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value;
};

const clearAllFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        category: { value: null, matchMode: FilterMatchMode.EQUALS },
        followers: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL },
        engagement: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL },
        price: { 
            operator: FilterOperator.AND,
            constraints: [
                { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL },
                { value: null, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL }
            ]
        },
        rating: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL }
    };
    if (dt.value) {
        dt.value.reset();
    }
};

const navigateToProfile = (influencerId) => {
    dialogVisible.value = false;
    router.push({
        path: '/home/profile2',
        query: { 
            userId: influencerId,
            type: 'influencer'
        }
    });
};

const openInfluencerDialog = (event) => {
    selectedInfluencer.value = event.data;
    dialogVisible.value = true;
};

onMounted(() => {
    fetchInfluencers();
});
</script>

<style lang="scss" scoped>
.card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-datatable) {
    .p-datatable-thead > tr > th {
        background: var(--surface-section);
        color: var(--text-color);
        border: none;
        font-weight: 600;
        padding: 1rem;
    }

    .p-datatable-tbody > tr {
        background: var(--surface-section);
        transition: background-color 0.2s;
        
        &:nth-child(even) {
            background: var(--surface-ground);
        }
        
        > td {
            border: none;
            padding: 1rem;
        }

        &:hover {
            background: var(--surface-hover);
        }
    }

    .p-paginator {
        background: transparent;
        border: none;
        padding: 1rem 0 0 0;
    }
}

:deep(.p-tag) {
    &.p-tag-rounded {
        border-radius: 2rem;
        padding: 0.3rem 0.8rem;
        font-weight: 500;
    }
}

:deep(.p-button) {
    &.p-button-sm {
        padding: 0.5rem;
        
        .p-button-icon {
            font-size: 0.875rem;
            color: #ffffff;
        }
    }
    
    &.p-button-rounded {
        border-radius: 2rem;
    }
}

:deep(.p-progressbar) {
    border-radius: 2rem;
    height: 0.5rem !important;
    background: var(--surface-ground);
    
    .p-progressbar-value {
        background: #3B82F6;
        transition: width 0.5s ease;
    }
}

:deep(.p-rating) {
    &.rating-sm {
        .p-rating-icon {
            font-size: 0.875rem;
            
            &.p-rating-icon-active {
                color: #F59E0B;
            }
        }
    }
}

:deep(.p-dialog) {
    .p-dialog-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background: var(--surface-card);
    }

    .p-dialog-content {
        padding: 2rem;
        background: var(--surface-card);
    }

    .p-dialog-footer {
        padding: 1.5rem;
        background: var(--surface-card);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

:deep(.p-dropdown), :deep(.p-multiselect), :deep(.p-inputtext), :deep(.p-inputnumber-input) {
    border-radius: 2rem !important;
    
    &:enabled:focus {
        border-color: #3B82F6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
}

:deep(.p-inputtext), :deep(.p-dropdown-label), :deep(.p-multiselect-label) {
    padding: 0.5rem 1rem;
}
</style>