# ProposalComponent.vue

<template>
  <div class="proposal-container py-5">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">Πρόταση Συνεργασίας</h1>
      <p class="text-gray-500">Επιλέξτε προϋπολογισμό για κάθε influencer</p>
    </div>

    <div class="space-y-4">
      <div v-for="influencer in cart" 
           :key="influencer.id" 
           class="proposal-card">
        <img :src="influencer.image" 
             :alt="influencer.name" 
             class="proposal-image" />
        
        <div class="proposal-info">
          <h5>{{ influencer.name }}</h5>
          <div class="followers-container">
            <i class="pi pi-users"></i>
            <span>{{ formatNumber(influencer.followers) }} followers</span>
          </div>
        </div>

        <div class="budget-container">
          <InputNumber 
            v-model="influencer.budget" 
            :min="0"
            :maxFractionDigits="2"
            locale="el-GR"
            suffix=" €"
            class="budget-input" />
        </div>
      </div>
    </div>

    <Button 
      label="Υποβολή Πρότασης" 
      @click="openConfirmDialog"
      class="btn-submit-proposal" />

    <!-- Confirmation Dialog -->
    <Dialog 
      v-model:visible="showConfirmDialog" 
      modal 
      header="Επιβεβαίωση Υποβολής"
      :style="{ width: '450px' }">
      
      <div class="confirmation-content">
        <div class="budget-summary">
          <div v-for="inf in cart" :key="inf.id" class="budget-item">
            <span class="name">{{ inf.name }}</span>
            <span class="amount">{{ formatCurrency(inf.budget) }}</span>
          </div>
          <div class="total-budget">
            <span class="label">Συνολικός Προϋπολογισμός</span>
            <span class="amount">{{ formatCurrency(totalBudget) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button 
            label="Ακύρωση" 
            @click="showConfirmDialog = false" 
            class="p-button-text" />
          <Button 
            label="Επιβεβαίωση" 
            @click="submitProposal" 
            class="p-button-success" />
        </div>
      </template>
    </Dialog>

    <!-- Success Dialog -->
    <Dialog 
      v-model:visible="showSuccessDialog" 
      modal 
      :closable="false"
      :style="{ width: '350px' }">
      <div class="success-content">
        <i class="pi pi-check-circle success-icon"></i>
        <h3>Επιτυχής Υποβολή!</h3>
        <p>Η πρότασή σας υποβλήθηκε με επιτυχία.</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';

const cart = ref([
  { 
    id: 1, 
    name: 'Maria Papadopoulou', 
    followers: 150000, 
    budget: 1000, 
    image: 'https://picsum.photos/150' 
  },
  { 
    id: 2, 
    name: 'Nikos Oikonomou', 
    followers: 200000, 
    budget: 1500, 
    image: 'https://picsum.photos/150' 
  }
]);

const showConfirmDialog = ref(false);
const showSuccessDialog = ref(false);

const totalBudget = computed(() => {
  return cart.value.reduce((sum, inf) => sum + (inf.budget || 0), 0);
});

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
</script>

<style scoped>
.proposal-container {
  max-width: 900px;
  margin: auto;
  text-align: center;
  padding: 2rem;
}

.proposal-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.proposal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.proposal-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 1.5rem;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.proposal-info {
  flex-grow: 1;
  text-align: left;
}

.proposal-info h5 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.followers-container {
  display: flex;
  align-items: center;
  color: #666;
  gap: 0.5rem;
}

.budget-container {
  min-width: 150px;
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
</style>