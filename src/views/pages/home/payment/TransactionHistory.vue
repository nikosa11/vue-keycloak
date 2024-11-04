// TransactionHistory.vue
<template>
  <div class="card">
    <!-- Filters -->
    <div class="flex flex-column md:flex-row gap-3 mb-4">
      <span class="p-input-icon-left flex-1">
        <i class="pi pi-search" />
        <InputText v-model="filters.search" 
                  placeholder="Αναζήτηση συναλλαγών..." 
                  class="w-full" />
      </span>
      <div class="flex gap-2">
        <Calendar v-model="filters.dateRange" 
                 selectionMode="range" 
                 placeholder="Εύρος ημερομηνιών"
                 :showIcon="true" />
        <Dropdown v-model="filters.status" 
                 :options="statusOptions" 
                 optionLabel="label" 
                 placeholder="Κατάσταση"
                 class="w-10rem" />
      </div>
    </div>

    <!-- Transactions Table -->
    <DataTable :value="filteredTransactions" 
               :paginator="true" 
               :rows="10"
               :rowsPerPageOptions="[10, 20, 50]"
               responsiveLayout="scroll"
               class="p-datatable-sm">
      <Column field="date" header="Ημερομηνία">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
      <Column field="id" header="Κωδικός" />
      <Column field="description" header="Περιγραφή" />
      <Column field="amount" header="Ποσό">
        <template #body="{ data }">
          <span :class="{'text-green-500': data.amount > 0, 'text-red-500': data.amount < 0}">
            {{ formatCurrency(data.amount) }}
          </span>
        </template>
      </Column>
      <Column field="status" header="Κατάσταση">
        <template #body="{ data }">
          <Tag :severity="getStatusSeverity(data.status)" :value="data.status" />
        </template>
      </Column>
      <Column header="Ενέργειες">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-eye" 
                    text 
                    rounded 
                    @click="viewTransaction(data)" />
            <Button icon="pi pi-file-pdf" 
                    text 
                    rounded 
                    severity="success" 
                    @click="downloadReceipt(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Transaction Details Dialog -->
    <Dialog v-model:visible="showDetailsDialog" 
            :header="'Λεπτομέρειες Συναλλαγής #' + selectedTransaction?.id"
            :modal="true"
            :style="{width: '450px'}">
      <div v-if="selectedTransaction" class="flex flex-column gap-3">
        <div class="flex justify-content-between">
          <span class="font-semibold">Ημερομηνία:</span>
          <span>{{ formatDate(selectedTransaction.date) }}</span>
        </div>
        <div class="flex justify-content-between">
          <span class="font-semibold">Ποσό:</span>
          <span :class="{'text-green-500': selectedTransaction.amount > 0, 'text-red-500': selectedTransaction.amount < 0}">
            {{ formatCurrency(selectedTransaction.amount) }}
          </span>
        </div>
        <div class="flex justify-content-between">
          <span class="font-semibold">Κατάσταση:</span>
          <Tag :severity="getStatusSeverity(selectedTransaction.status)" 
               :value="selectedTransaction.status" />
        </div>
        <Divider />
        <div>
          <span class="font-semibold">Περιγραφή:</span>
          <p class="mt-2">{{ selectedTransaction.description }}</p>
        </div>
        <div v-if="selectedTransaction.details">
          <span class="font-semibold">Επιπλέον Πληροφορίες:</span>
          <div class="mt-2">
            <div v-for="(value, key) in selectedTransaction.details" 
                 :key="key" 
                 class="flex justify-content-between py-2">
              <span class="text-500">{{ key }}:</span>
              <span>{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { transactionsData } from '@/service/transactions';

const toast = useToast();

// State
const transactions = ref([
  {
    id: 'TRX-2024-001',
    date: '2024-01-15T10:30:00',
    description: 'Πληρωμή για καμπάνια Instagram',
    amount: -1500.00,
    status: 'Ολοκληρώθηκε',
    paymentMethod: 'Πιστωτική Κάρτα',
    details: {
      campaign: 'Summer Collection 2024',
      influencer: 'John Doe',
      platform: 'Instagram'
    }
  },
  {
    id: 'TRX-2024-002',
    date: '2024-01-20T14:15:00',
    description: 'Είσπραξη από Brand X',
    amount: 2800.00,
    status: 'Ολοκληρώθηκε',
    paymentMethod: 'Τραπεζική Μεταφορά',
    details: {
      campaign: 'Product Launch 2024',
      brand: 'Brand X',
      platform: 'YouTube'
    }
  },
  // Προσθέστε περισσότερα δεδομένα εδώ από το transactions.js
]);

const selectedTransaction = ref(null);
const showDetailsDialog = ref(false);
const filters = ref({
  search: '',
  dateRange: null,
  status: null
});

// Options for status filter
const statusOptions = [
  { label: 'Ολοκληρώθηκε', value: 'Ολοκληρώθηκε' },
  { label: 'Σε Εξέλιξη', value: 'Σε Εξέλιξη' },
  { label: 'Ακυρώθηκε', value: 'Ακυρώθηκε' }
];

// Computed Properties
const filteredTransactions = computed(() => {
  let filtered = [...transactions.value];

  // Search filter
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    filtered = filtered.filter(transaction => 
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.id.toLowerCase().includes(searchLower)
    );
  }

  // Date range filter
  if (filters.value.dateRange && filters.value.dateRange[0] && filters.value.dateRange[1]) {
    filtered = filtered.filter(transaction => {
      const transDate = new Date(transaction.date);
      return transDate >= filters.value.dateRange[0] && 
             transDate <= filters.value.dateRange[1];
    });
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(transaction => 
      transaction.status === filters.value.status.value
    );
  }

  return filtered;
});

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Ολοκληρώθηκε': return 'success';
    case 'Σε Εξέλιξη': return 'warning';
    case 'Ακυρώθηκε': return 'danger';
    default: return 'info';
  }
};

const viewTransaction = (transaction) => {
  selectedTransaction.value = transaction;
  showDetailsDialog.value = true;
};

const downloadReceipt = (transaction) => {
  toast.add({
    severity: 'success',
    summary: 'Λήψη Απόδειξης',
    detail: `Η απόδειξη για τη συναλλαγή #${transaction.id} κατέβηκε`,
    life: 3000
  });
};
</script>