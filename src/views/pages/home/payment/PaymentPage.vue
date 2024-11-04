// PaymentPage.vue
<template>
  <div class="grid">
    <!-- Header Section -->
    <div class="col-12">
      <div class="flex justify-content-between align-items-center mb-5">
        <h1 class="text-3xl font-bold m-0">Διαχείριση Πληρωμών</h1>
        <Button label="Νέα Πληρωμή" icon="pi pi-plus" @click="openNewPaymentDialog" />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="col-12 md:col-6 lg:col-3">
      <div class="card">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Συνολικά Έσοδα</span>
            <div class="text-900 font-medium text-xl">
              {{ formatCurrency(monthlyStats.totalIncome) }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-green-100 border-round" 
               style="width:2.5rem;height:2.5rem">
            <i class="pi pi-dollar text-green-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <div class="card">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Συνολικά Έξοδα</span>
            <div class="text-900 font-medium text-xl">
              {{ formatCurrency(monthlyStats.totalExpenses) }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-red-100 border-round" 
               style="width:2.5rem;height:2.5rem">
            <i class="pi pi-wallet text-red-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <div class="card">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Εκκρεμείς Πληρωμές</span>
            <div class="text-900 font-medium text-xl">
              {{ formatCurrency(monthlyStats.pendingPayments) }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-orange-100 border-round" 
               style="width:2.5rem;height:2.5rem">
            <i class="pi pi-clock text-orange-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <div class="card">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Επιτυχείς Συναλλαγές</span>
            <div class="text-900 font-medium text-xl">
              {{ monthlyStats.successfulTransactions }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" 
               style="width:2.5rem;height:2.5rem">
            <i class="pi pi-check-circle text-cyan-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Menu -->
    <div class="col-12">
      <TabMenu :model="menuItems" />
    </div>

    <!-- Content Section -->
    <div class="col-12">
      <router-view></router-view>
    </div>

    <!-- New Payment Dialog -->
    <Dialog v-model:visible="showNewPaymentDialog" 
            header="Νέα Πληρωμή" 
            :modal="true" 
            :style="{width: '450px'}">
      <div class="flex flex-column gap-3">
        <div class="field">
          <label for="amount">Ποσό</label>
          <InputNumber id="amount" 
                      v-model="newPayment.amount" 
                      mode="currency" 
                      currency="EUR" 
                      locale="el-GR" />
        </div>
        <div class="field">
          <label for="paymentMethod">Μέθοδος Πληρωμής</label>
          <Dropdown id="paymentMethod" 
                   v-model="newPayment.method" 
                   :options="availablePaymentMethods" 
                   optionLabel="name" 
                   placeholder="Επιλέξτε μέθοδο" />
        </div>
        <div class="field">
          <label for="description">Περιγραφή</label>
          <Textarea id="description" 
                   v-model="newPayment.description" 
                   rows="3" 
                   autoResize />
        </div>
      </div>
      <template #footer>
        <Button label="Ακύρωση" 
                icon="pi pi-times" 
                text 
                @click="closeNewPaymentDialog" />
        <Button label="Αποθήκευση" 
                icon="pi pi-check" 
                @click="saveNewPayment" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { monthlyStats, paymentMethodsData } from '@/service/paymentData';

const toast = useToast();

// Menu Items
const menuItems = ref([
  {
    label: 'Επισκόπηση',
    icon: 'pi pi-home',
    to: '/payments'
  },
  {
    label: 'Ιστορικό Συναλλαγών',
    icon: 'pi pi-history',
    to: '/payments/transactions'
  },
  {
    label: 'Μέθοδοι Πληρωμής',
    icon: 'pi pi-credit-card',
    to: '/payments/methods'
  },
  {
    label: 'Τιμολόγια & Αποδείξεις',
    icon: 'pi pi-file',
    to: '/payments/invoices'
  }
]);

// New Payment Dialog
const showNewPaymentDialog = ref(false);
const newPayment = ref({
  amount: null,
  method: null,
  description: ''
});

// Available Payment Methods for dropdown
const availablePaymentMethods = ref(paymentMethodsData.map(method => ({
  name: `${method.type} (****${method.lastDigits})`,
  id: method.id
})));

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const openNewPaymentDialog = () => {
  showNewPaymentDialog.value = true;
};

const closeNewPaymentDialog = () => {
  showNewPaymentDialog.value = false;
  newPayment.value = {
    amount: null,
    method: null,
    description: ''
  };
};

const saveNewPayment = () => {
  if (!newPayment.value.amount || !newPayment.value.method) {
    toast.add({
      severity: 'error',
      summary: 'Σφάλμα',
      detail: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία',
      life: 3000
    });
    return;
  }

  toast.add({
    severity: 'success',
    summary: 'Επιτυχία',
    detail: 'Η πληρωμή αποθηκεύτηκε',
    life: 3000
  });
  closeNewPaymentDialog();
};
</script>