# ProposalComponent.vue

<template>
  <div class="proposal-container">
    <!-- Header section with new styling -->
    <div class="header-section p-6 bg-primary text-white text-center rounded-lg mb-6">
      <h1 class="text-4xl font-bold mb-3">Πρόταση Συνεργασίας</h1>
      <p class="text-lg opacity-90">Επιλέξτε προϋπολογισμό για κάθε influencer</p>
    </div>

    <!-- Add proposal selection section -->
    <div class="mb-4">
      <Button 
        label="Προσθήκη Influencer" 
        icon="pi pi-plus" 
        @click="showInfluencerDialog = true"
        class="p-button-rounded p-button-primary" />
    </div>

    <!-- Cards section with delete option -->
    <div class="grid">
      <div v-for="influencer in cart" 
           :key="influencer.id" 
           class="col-12 md:col-6 lg:col-6 p-3">
        <Card class="proposal-card h-full">
          <template #header>
            <div class="flex align-items-center justify-content-between p-3">
              <div class="flex align-items-center gap-4">
                <img :src="influencer.image" 
                     :alt="influencer.name" 
                     class="proposal-image" />
                <div>
                  <h5 class="text-xl font-semibold mb-2">{{ influencer.name }}</h5>
                  <div class="flex align-items-center gap-2 text-600">
                    <i class="pi pi-users"></i>
                    <span>{{ formatNumber(influencer.followers) }} followers</span>
                  </div>
                </div>
              </div>
              <Button 
                icon="pi pi-trash" 
                @click="removeInfluencer(influencer)"
                class="p-button-rounded p-button-danger p-button-text" />
            </div>
          </template>
          
          <template #content>
            <div class="p-fluid">
              <label class="block mb-2 font-medium">Προϋπολογισμός</label>
              <InputNumber 
                v-model="influencer.budget" 
                :min="0"
                :maxFractionDigits="2"
                locale="el-GR"
                suffix=" €"
                class="p-inputtext-lg" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Influencer Selection Dialog -->
    <Dialog 
      v-model:visible="showInfluencerDialog" 
      modal 
      header="Επιλογή Influencer"
      :style="{ width: '70vw' }">
      <DataTable 
        :value="availableInfluencers"
        v-model:selection="selectedInfluencers"
        selectionMode="single"
        dataKey="id"
        :paginator="true" 
        :rows="5"
        :filters="filters"
        filterDisplay="menu"
        responsiveLayout="scroll"
        class="p-datatable-lg">
        
        <template #header>
          <div class="flex justify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Αναζήτηση..." />
            </span>
          </div>
        </template>

        <Column field="image" header="Φωτογραφία">
          <template #body="slotProps">
            <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-3rem h-3rem rounded-full" />
          </template>
        </Column>
        <Column field="name" header="Όνομα" sortable></Column>
        <Column field="followers" header="Ακόλουθοι" sortable>
          <template #body="slotProps">
            {{ formatNumber(slotProps.data.followers) }}
          </template>
        </Column>
        <Column field="category" header="Κατηγορία" sortable></Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button 
              icon="pi pi-plus" 
              @click="addInfluencer(slotProps.data)"
              class="p-button-rounded p-button-success p-button-sm" 
              :disabled="isInfluencerSelected(slotProps.data)"
              tooltip="Προσθήκη στην πρόταση" />
          </template>
        </Column>
      </DataTable>
    </Dialog>

    <!-- Total and Submit section -->
    <div class="flex justify-content-between align-items-center bg-gray-50 p-4 mt-4 rounded-lg">
      <div class="text-xl">
        Συνολικός Προϋπολογισμός: 
        <span class="font-bold text-primary">{{ formatCurrency(totalBudget) }}</span>
      </div>
      <Button 
        label="Υποβολή Πρότασης" 
        icon="pi pi-send"
        @click="openConfirmDialog"
        class="p-button-lg" />
    </div>

    <!-- Updated Dialogs -->
    <Dialog 
      v-model:visible="showConfirmDialog" 
      modal 
      header="Επιβεβαίωση Υποβολής"
      :style="{ width: '500px' }"
      class="confirmation-dialog">
      
      <div class="confirmation-content">
        <div class="budget-summary">
          <div v-for="inf in cart" :key="inf.id" class="budget-item">
            <div class="flex align-items-center gap-3">
              <img :src="inf.image" class="w-3rem h-3rem rounded-full" />
              <span class="name flex-1">{{ inf.name }}</span>
              <span class="amount font-semibold">{{ formatCurrency(inf.budget) }}</span>
            </div>
          </div>
          <Divider />
          <div class="total-budget">
            <span class="label text-lg">Συνολικός Προϋπολογισμός</span>
            <span class="amount text-xl font-bold text-primary">{{ formatCurrency(totalBudget) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-3">
          <Button 
            icon="pi pi-times"
            @click="showConfirmDialog = false" 
            class="p-button-text" />
          <Button 
            icon="pi pi-check"
            @click="submitProposal" 
            class="p-button-success" />
        </div>
      </template>
    </Dialog>

    <!-- Updated Success Dialog -->
    <Dialog 
      v-model:visible="showSuccessDialog" 
      modal 
      :closable="false"
      :style="{ width: '400px' }">
      <div class="success-content text-center p-5">
        <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
        <h3 class="text-2xl font-bold mb-3">Επιτυχής Υποβολή!</h3>
        <p class="text-gray-600 line-height-3">Η πρότασή σας υποβλήθηκε με επιτυχία.</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import InfluencerService from '@/service/InfluencerService';

const toast = useToast();
const cart = ref([]);
const showInfluencerDialog = ref(false);
const showConfirmDialog = ref(false);
const availableInfluencers = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

const totalBudget = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.budget || 0), 0);
});

async function fetchProposals() {
    try {
        const response = await InfluencerService.getCampaignProposals();
        availableInfluencers.value = response.data.map(influencer => ({
            ...influencer,
            budget: influencer.budget || 0
        }));
    } catch (error) {
        console.error('Error fetching proposals:', error);
        toast.add({
            severity: 'error',
            summary: 'Σφάλμα',
            detail: 'Αποτυχία φόρτωσης προτάσεων',
            life: 3000
        });
        // Fallback data
        availableInfluencers.value = [
            {
                id: 1,
                name: "Maria Papadopoulou",
                followers: 150000,
                budget: 1000,
                image: "https://picsum.photos/150"
            },
            {
                id: 2,
                name: "Nikos Oikonomou",
                followers: 200000,
                budget: 1500,
                image: "https://picsum.photos/150"
            }
        ];
    }
}

const formatNumber = (num) => {
    return new Intl.NumberFormat('el-GR').format(num);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' €';
};

const openConfirmDialog = () => {
    showConfirmDialog.value = true;
};

const submitProposal = () => {
    showConfirmDialog.value = false;
    showSuccessDialog.value = true;
  
    console.log('Proposal Submitted:', cart.value);
  
    setTimeout(() => {
        showSuccessDialog.value = false;
    }, 2000);
};

const removeInfluencer = (influencer) => {
    const index = cart.value.findIndex(inf => inf.id === influencer.id);
    if (index > -1) {
        cart.value.splice(index, 1);
    }
};

const addInfluencer = (influencer) => {
    if (!isInfluencerSelected(influencer)) {
        cart.value.push({
            ...influencer,
            budget: influencer.budget || 0
        });
        showInfluencerDialog.value = false;
    }
};

const isInfluencerSelected = (influencer) => {
    return cart.value.some(inf => inf.id === influencer.id);
};

onMounted(() => {
    fetchProposals();
});
</script>

<style scoped>
.proposal-container {
    max-width: 1200px;
    margin: auto;
    padding: 2rem;
}

.header-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-700) 100%);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.proposal-card {
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
}

.proposal-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.proposal-image {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.budget-input {
    width: 100%;
}

.btn-submit-proposal {
    background-color: #28a745;
    border: none;
    color: #fff;
    margin-top: 1.5rem;
    padding: 0.75rem 2rem;
    font-weight: 600;
    transition: background-color 0.2s;
}

.btn-submit-proposal:hover {
    background-color: #218838;
}

.confirmation-content {
    padding: 1.5rem 0;
}

.budget-summary {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.budget-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.total-budget {
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    margin-top: 0.5rem;
    border-top: 2px solid #eee;
    font-weight: 600;
    color: #28a745;
}

.success-content {
    text-align: center;
    padding: 2rem;
}

.success-icon {
    font-size: 3rem;
    color: #28a745;
    margin-bottom: 1rem;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

:deep(.p-inputnumber-input) {
    text-align: right;
}

:deep(.p-dialog-header) {
    padding: 1.5rem;
}

:deep(.p-dialog-content) {
    padding: 0 1.5rem 1.5rem 1.5rem;
}

:deep(.p-dialog-footer) {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
}

.confirmation-content {
    padding: 1.5rem;
}

.budget-summary {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.budget-item {
    padding: 0.75rem;
    border-radius: 0.75rem;
    background: var(--surface-50);
    transition: background-color 0.2s;
}

.budget-item:hover {
    background: var(--surface-100);
}

.total-budget {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 0.75rem;
    background: var(--surface-50);
    margin-top: 0.5rem;
}

/* Button Styling in Dialog */
:deep(.p-dialog-footer) .p-button {
    border-radius: 2rem;
    padding: 0.75rem 1.5rem;
    height: auto;
    width: auto;
}

:deep(.p-dialog-header-close) {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--surface-100);
    color: var(--text-color-secondary);
    transition: all 0.2s ease;
}

:deep(.p-dialog-header-close:hover) {
    background: var(--surface-200);
    transform: rotate(90deg);
}

/* Fix for the close button alignment */
:deep(.p-dialog-header) {
    position: relative;
}

:deep(.p-dialog-header-icons) {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
}
</style>