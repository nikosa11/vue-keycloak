<!-- InvoicesReceipts.vue -->
<template>
    <div class="grid">
      <!-- Header -->
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-5">
          <h2 class="text-2xl font-bold m-0">Τιμολόγια & Αποδείξεις</h2>
          <div class="flex gap-2">
            <Button label="Έκδοση Τιμολογίου" 
                    icon="pi pi-plus" 
                    @click="openNewInvoiceDialog" />
            <Button label="Φίλτρα" 
                    icon="pi pi-filter" 
                    outlined 
                    @click="toggleFilters" />
          </div>
        </div>
      </div>
  
      <!-- Filters Panel -->
      <div class="col-12" v-if="showFilters">
        <div class="card mb-4">
          <div class="grid">
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <Calendar v-model="filters.dateRange" 
                         selectionMode="range"
                         :showIcon="true" 
                         dateFormat="dd/mm/yy"
                         inputId="dateRange" />
                <label for="dateRange">Εύρος Ημερομηνιών</label>
              </span>
            </div>
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <Dropdown v-model="filters.status" 
                         :options="statusOptions" 
                         optionLabel="label" 
                         inputId="status" />
                <label for="status">Κατάσταση</label>
              </span>
            </div>
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <Dropdown v-model="filters.type" 
                         :options="typeOptions" 
                         optionLabel="label" 
                         inputId="type" />
                <label for="type">Τύπος</label>
              </span>
            </div>
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <InputNumber v-model="filters.amount" 
                            mode="currency" 
                            currency="EUR" 
                            locale="el-GR"
                            inputId="amount" />
                <label for="amount">Ποσό</label>
              </span>
            </div>
            <div class="col-12 flex justify-content-end">
              <Button label="Καθαρισμός" 
                      icon="pi pi-refresh" 
                      outlined
                      @click="clearFilters"
                      class="mr-2" />
              <Button label="Εφαρμογή" 
                      icon="pi pi-check"
                      @click="applyFilters" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Invoices Table -->
      <div class="col-12">
        <DataTable :value="filteredInvoices"
                   :paginator="true"
                   :rows="10"
                   :rowsPerPageOptions="[10, 20, 50]"
                   v-model:selection="selectedInvoices"
                   :filters="tableFilters"
                   filterDisplay="menu"
                   dataKey="id"
                   :loading="loading"
                   class="p-datatable-sm">
          
          <template #empty>
            <div class="text-center p-4">
              <i class="pi pi-file text-5xl mb-4 text-gray-400"></i>
              <p>Δεν βρέθηκαν τιμολόγια</p>
            </div>
          </template>
  
          <template #loading>
            <div class="text-center p-4">
              <i class="pi pi-spin pi-spinner text-5xl mb-4 text-gray-400"></i>
              <p>Φόρτωση δεδομένων...</p>
            </div>
          </template>
  
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
  
          <Column field="id" header="Αριθμός" sortable>
            <template #body="{ data }">
              <Button class="p-button-link" 
                      @click="viewInvoice(data)">
                {{ data.id }}
              </Button>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" 
                        @keydown.enter="filterCallback()" 
                        placeholder="Αναζήτηση"
                        class="w-full" />
            </template>
          </Column>
  
          <Column field="date" header="Ημερομηνία" sortable>
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
          </Column>
  
          <Column field="amount" header="Ποσό" sortable>
            <template #body="{ data }">
              {{ formatCurrency(data.amount) }}
            </template>
          </Column>
  
          <Column field="status" header="Κατάσταση" sortable>
            <template #body="{ data }">
              <Tag :value="getStatusLabel(data.status)" 
                   :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
  
          <Column field="type" header="Τύπος" sortable>
            <template #body="{ data }">
              <Tag :value="data.type" 
                   :severity="getTypeSeverity(data.type)" />
            </template>
          </Column>
  
          <Column header="Ενέργειες" :exportable="false" style="width: 12rem">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">
                <Button icon="pi pi-eye" 
                        text 
                        rounded 
                        @click="viewInvoice(data)"
                        v-tooltip.top="'Προβολή'" />
                <Button icon="pi pi-download" 
                        text 
                        rounded 
                        severity="success" 
                        @click="downloadInvoice(data)"
                        v-tooltip.top="'Λήψη PDF'" />
                <Button icon="pi pi-envelope" 
                        text 
                        rounded 
                        severity="info" 
                        @click="sendInvoice(data)"
                        v-tooltip.top="'Αποστολή Email'" />
                <Button icon="pi pi-print" 
                        text 
                        rounded 
                        severity="secondary" 
                        @click="printInvoice(data)"
                        v-tooltip.top="'Εκτύπωση'" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
  
      <!-- Invoice Preview Dialog -->
      <Dialog v-model:visible="showPreviewDialog" 
              :header="'Τιμολόγιο ' + selectedInvoice?.id"
              :modal="true"
              :style="{width: '65vw'}"
              :maximizable="true"
              :dismissableMask="true">
        <div v-if="selectedInvoice" class="invoice-preview">
          <div class="grid">
            <!-- Invoice Header -->
            <div class="col-6">
              <h3 class="text-xl font-semibold m-0">Στοιχεία Τιμολογίου</h3>
              <div class="mt-3">
                <p><strong>Αριθμός:</strong> {{ selectedInvoice.id }}</p>
                <p><strong>Ημερομηνία:</strong> {{ formatDate(selectedInvoice.date) }}</p>
                <p><strong>Κατάσταση:</strong> 
                  <Tag :value="getStatusLabel(selectedInvoice.status)" 
                       :severity="getStatusSeverity(selectedInvoice.status)" />
                </p>
              </div>
            </div>
            
            <div class="col-6">
              <h3 class="text-xl font-semibold m-0">Στοιχεία Πελάτη</h3>
              <div class="mt-3">
                <p><strong>Επωνυμία:</strong> {{ selectedInvoice.customer.name }}</p>
                <p><strong>ΑΦΜ:</strong> {{ selectedInvoice.customer.vatNumber }}</p>
                <p><strong>Διεύθυνση:</strong> {{ selectedInvoice.customer.address }}</p>
              </div>
            </div>
  
            <!-- Items Table -->
            <div class="col-12 mt-4">
              <DataTable :value="selectedInvoice.items" 
                        class="p-datatable-sm">
                <Column field="description" header="Περιγραφή"></Column>
                <Column field="quantity" header="Ποσότητα" style="width:150px"></Column>
                <Column field="amount" header="Τιμή">
                  <template #body="{ data }">
                    {{ formatCurrency(data.amount) }}
                  </template>
                </Column>
                <Column header="Σύνολο">
                  <template #body="{ data }">
                    {{ formatCurrency(data.amount * data.quantity) }}
                  </template>
                </Column>
              </DataTable>
            </div>
  
            <!-- Invoice Totals -->
            <div class="col-12 mt-4">
              <div class="flex justify-content-end">
                <div class="w-20rem">
                  <div class="flex justify-content-between mb-3">
                    <span class="font-semibold">Υποσύνολο:</span>
                    <span>{{ formatCurrency(calculateSubtotal()) }}</span>
                  </div>
                  <div class="flex justify-content-between mb-3">
                    <span class="font-semibold">ΦΠΑ (24%):</span>
                    <span>{{ formatCurrency(calculateVAT()) }}</span>
                  </div>
                  <Divider />
                  <div class="flex justify-content-between">
                    <span class="font-bold">Σύνολο:</span>
                    <span class="font-bold text-xl">
                      {{ formatCurrency(calculateTotal()) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-content-end gap-2">
            <Button label="Λήψη PDF" 
                    icon="pi pi-download"
                    @click="downloadInvoice(selectedInvoice)" />
            <Button label="Κλείσιμο"
                    icon="pi pi-times"
                    outlined
                    @click="closePreviewDialog" />
          </div>
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';
  
  const toast = useToast();
  
  // State
  const showFilters = ref(false);
  const selectedInvoices = ref([]);
  const showPreviewDialog = ref(false);
  const selectedInvoice = ref(null);
  const loading = ref(false);
  
  // Filters
  const filters = ref({
    dateRange: null,
    status: null,
    type: null,
    amount: null
  });
  
  // Options for dropdowns
  const statusOptions = [
    { label: 'Πληρώθηκε', value: 'paid' },
    { label: 'Εκκρεμεί', value: 'pending' },
    { label: 'Ακυρώθηκε', value: 'cancelled' }
  ];
  
  const typeOptions = [
    { label: 'Συνδρομή', value: 'subscription' },
    { label: 'Καμπάνια', value: 'campaign' },
    { label: 'Υπηρεσίες', value: 'service' }
  ];
  
  // Table Filters
  const tableFilters = ref({
    global: { value: null, matchMode: 'contains' },
    id: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    type: { value: null, matchMode: 'equals' }
  });
  // Mock data για παράδειγμα
const mockInvoices = [
  {
    id: 'INV-2024-001',
    date: '2024-03-01',
    amount: 1250.50,
    status: 'paid',
    type: 'subscription',
    customer: {
      name: 'Tech Solutions ΙΚΕ',
      vatNumber: '123456789',
      address: 'Λεωφόρος Κηφισίας 123, Αθήνα'
    },
    items: [
      { description: 'Ετήσια συνδρομή Premium', quantity: 1, amount: 1250.50 }
    ]
  },
  // Προσθέστε περισσότερα mock data εδώ
];

// Computed Properties
const filteredInvoices = computed(() => {
  let filtered = [...mockInvoices];

  // Date Range Filter
  if (filters.value.dateRange?.[0] && filters.value.dateRange?.[1]) {
    filtered = filtered.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate >= filters.value.dateRange[0] && 
             invoiceDate <= filters.value.dateRange[1];
    });
  }

  // Status Filter
  if (filters.value.status?.value) {
    filtered = filtered.filter(invoice => 
      invoice.status === filters.value.status.value
    );
  }

  // Type Filter
  if (filters.value.type?.value) {
    filtered = filtered.filter(invoice => 
      invoice.type === filters.value.type.value
    );
  }

  // Amount Filter
  if (filters.value.amount) {
    filtered = filtered.filter(invoice => 
      invoice.amount <= filters.value.amount
    );
  }

  return filtered;
});

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const getStatusLabel = (status) => {
  const statusMap = {
    paid: 'Πληρώθηκε',
    pending: 'Εκκρεμεί',
    cancelled: 'Ακυρώθηκε'
  };
  return statusMap[status] || status;
};

const getStatusSeverity = (status) => {
  const severityMap = {
    paid: 'success',
    pending: 'warning',
    cancelled: 'danger'
  };
  return severityMap[status] || 'info';
};

const getTypeSeverity = (type) => {
  const severityMap = {
    subscription: 'info',
    campaign: 'success',
    service: 'warning'
  };
  return severityMap[type] || 'secondary';
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  filters.value = {
    dateRange: null,
    status: null,
    type: null,
    amount: null
  };
  applyFilters();
};

const applyFilters = () => {
  loading.value = true;
  // Εδώ θα μπορούσε να υπάρχει κλήση στο API
  setTimeout(() => {
    loading.value = false;
    showFilters.value = false;
  }, 500);
};

const viewInvoice = (invoice) => {
  selectedInvoice.value = invoice;
  showPreviewDialog.value = true;
};

const closePreviewDialog = () => {
  showPreviewDialog.value = false;
  selectedInvoice.value = null;
};

const downloadInvoice = (invoice) => {
  // Υλοποίηση λήψης PDF
  toast.add({
    severity: 'success',
    summary: 'Λήψη Τιμολογίου',
    detail: `Το τιμολόγιο ${invoice.id} κατέβηκε επιτυχώς`,
    life: 3000
  });
};

const sendInvoice = (invoice) => {
  // Υλοποίηση αποστολής email
  toast.add({
    severity: 'success',
    summary: 'Αποστολή Email',
    detail: `Το τιμολόγιο ${invoice.id} στάλθηκε με επιτυχία`,
    life: 3000
  });
};

const printInvoice = (invoice) => {
  // Υλοποίηση εκτύπωσης
  toast.add({
    severity: 'success',
    summary: 'Εκτύπωση',
    detail: `Το τιμολόγιο ${invoice.id} στάλθηκε για εκτύπωση`,
    life: 3000
  });
};

const calculateSubtotal = () => {
  if (!selectedInvoice.value) return 0;
  return selectedInvoice.value.items.reduce((sum, item) => 
    sum + (item.amount * item.quantity), 0
  );
};

const calculateVAT = () => {
  return calculateSubtotal() * 0.24; // 24% ΦΠΑ
};

const calculateTotal = () => {
  return calculateSubtotal() + calculateVAT();
};

const openNewInvoiceDialog = () => {
  // TODO: Implement new invoice dialog
  toast.add({
    severity: 'info',
    summary: 'Νέο Τιμολόγιο',
    detail: 'Η λειτουργία θα είναι σύντομα διαθέσιμη',
    life: 3000
  });
};

// Lifecycle Hooks
onMounted(async () => {
  loading.value = true;
  try {
    // Εδώ θα μπορούσε να υπάρχει κλήση στο API για αρχικά δεδομένα
    await new Promise(resolve => setTimeout(resolve, 1000)); // Προσομοίωση καθυστέρησης API
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Σφάλμα',
      detail: 'Παρουσιάστηκε σφάλμα κατά τη φόρτωση των δεδομένων',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
});
</script>
<style>
.invoice-preview {
  padding: 1.5rem;
}

.invoice-preview .p-datatable {
  margin-top: 1rem;
}

:deep(.p-float-label) {
  display: block;
  margin-bottom: 1rem;
}

:deep(.p-float-label label) {
  background: var(--surface-ground);
  padding: 0 0.25rem;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-tag) {
  min-width: 7rem;
  justify-content: center;
}

:deep(.p-dialog-content) {
  padding: 0 !important;
}

@media print {
  .no-print {
    display: none !important;
  }
  
  .invoice-preview {
    padding: 20px;
  }
}
</style>