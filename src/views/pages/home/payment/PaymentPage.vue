<template>
  <div class="grid">
    <!-- Header Section -->
    <div class="col-12">
      <div class="flex justify-content-between align-items-center mb-5">
        <div>
          <h1 class="text-3xl font-bold m-0">Διαχείριση Πληρωμών</h1>
          <span class="text-500">Επισκόπηση οικονομικών στοιχείων και συναλλαγών</span>
        </div>
        <div class="flex gap-2">
          <Button label="Νέα Πληρωμή" 
                  icon="pi pi-plus" 
                  @click="openNewPaymentDialog" />
          <Button label="Αναφορές" 
                  icon="pi pi-chart-bar" 
                  outlined
                  @click="openReportsDialog" />
        </div>
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
            <span class="text-green-500 font-medium">
              <i class="pi pi-arrow-up"></i> 
              {{ calculateGrowth(monthlyStats.totalIncome) }}%
            </span>
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
            <span class="text-red-500 font-medium">
              <i class="pi pi-arrow-down"></i> 
              {{ calculateGrowth(monthlyStats.totalExpenses) }}%
            </span>
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
            <span class="text-orange-500 font-medium">
              {{ monthlyStats.recentActivityCount }} νέες
            </span>
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
            <span class="text-cyan-500 font-medium">
              {{ calculateSuccessRate() }}% επιτυχία
            </span>
          </div>
          <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" 
               style="width:2.5rem;height:2.5rem">
            <i class="pi pi-check-circle text-cyan-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="col-12 lg:col-4">
      <div class="card">
        <h3>Πρόσφατη Δραστηριότητα</h3>
        <Timeline :value="recentActivity" class="w-full">
          <template #content="slotProps">
            <div class="flex flex-column">
              <small class="text-500">{{ formatDate(slotProps.item.date) }}</small>
              <div class="flex align-items-center gap-2 my-1">
                <i :class="getActivityIcon(slotProps.item.type)" 
                   :style="{ color: getActivityColor(slotProps.item.type) }">
                </i>
                <span class="font-medium">{{ slotProps.item.title }}</span>
              </div>
              <p class="text-500 m-0">{{ slotProps.item.description }}</p>
              <div v-if="slotProps.item.amount" class="mt-1">
                <span :class="getAmountClass(slotProps.item.amount)">
                  {{ formatCurrency(slotProps.item.amount) }}
                </span>
              </div>
            </div>
          </template>
        </Timeline>
      </div>
    </div>

    <!-- Popular Payment Methods -->
    <div class="col-12 lg:col-4">
      <div class="card">
        <h3>Δημοφιλείς Μέθοδοι Πληρωμής</h3>
        <div class="grid">
          <div v-for="(method, key) in paymentTypesConfig" 
               :key="key" 
               class="col-12 mb-3">
            <div :class="['p-3 border-round', method.bgClass]">
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <i :class="method.icon"></i>
                  <span class="font-medium">{{ method.name }}</span>
                </div>
                <span class="text-sm">
                  {{ method.processingFee * 100 }}% χρέωση
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="col-12 lg:col-4">
      <div class="card">
        <h3>Ρυθμίσεις Ειδοποιήσεων</h3>
        <div class="flex flex-column gap-3">
          <div v-for="(setting, key) in notificationSettings" 
               :key="key" 
               class="flex align-items-center justify-content-between p-3 border-round surface-100">
            <div>
              <span class="font-medium">{{ formatSettingName(key) }}</span>
              <div class="text-500 text-sm">
                {{ setting.channels.join(', ') }}
              </div>
            </div>
            <InputSwitch v-model="setting.enabled" />
          </div>
        </div>
      </div>
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

    <!-- Reports Dialog -->
    <Dialog v-model:visible="showReportsDialog" 
            header="Αναφορές" 
            :modal="true" 
            :style="{width: '600px'}">
      <div class="grid">
        <div class="col-12">
          <h3>Επιλογή Χρονικού Διαστήματος</h3>
          <div class="flex gap-2">
            <Button v-for="(label, range) in reportingConfig.defaultDateRanges"
                    :key="range"
                    :label="formatRangeName(range)"
                    :outlined="selectedRange !== range"
                    class="p-button-sm"
                    @click="selectedRange = range" />
          </div>
        </div>
        <div class="col-12">
          <h3>Τύπος Αναφοράς</h3>
          <div class="flex gap-2">
            <Button v-for="format in reportingConfig.exportFormats"
                    :key="format"
                    :label="format.toUpperCase()"
                    :icon="`pi pi-file-${format}`"
                    outlined
                    class="p-button-sm"
                    @click="exportReport(format)" />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { 
  monthlyStats, 
  paymentTypesConfig, 
  paymentStatusTypes,
  notificationSettings,
  reportingConfig 
} from '@/service/paymentData';

const toast = useToast();

// State
const showNewPaymentDialog = ref(false);
const showReportsDialog = ref(false);
const selectedRange = ref('thisMonth');
const newPayment = ref({
  amount: null,
  method: null,
  description: ''
});

// Πρόσφατη δραστηριότητα
const recentActivity = ref([
  {
    date: new Date(),
    type: 'payment',
    title: 'Νέα Πληρωμή',
    description: 'Πληρωμή για υπηρεσίες marketing',
    amount: -1500.00
  },
  {
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'invoice',
    title: 'Νέο Τιμολόγιο',
    description: 'Έκδοση τιμολογίου #INV-2024-042',
    amount: 2800.00
  },
  {
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: 'subscription',
    title: 'Ανανέωση Συνδρομής',
    description: 'Αυτόματη ανανέωση Premium πακέτου',
    amount: -99.00
  },
  {
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    type: 'refund',
    title: 'Επιστροφή Χρημάτων',
    description: 'Επιστροφή για ακυρωμένη παραγγελία #ORD-985',
    amount: 150.00
  },
  {
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: 'reminder',
    title: 'Υπενθύμιση Πληρωμής',
    description: 'Επερχόμενη πληρωμή συνδρομής σε 3 ημέρες',
    amount: null
  }
]);

// Computed
const availablePaymentMethods = computed(() => 
  Object.entries(paymentTypesConfig).map(([id, method]) => ({
    id,
    name: method.name
  }))
);

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const formatDate = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `Πριν ${minutes} λεπτά`;
  } else if (hours < 24) {
    return `Πριν ${hours} ώρες`;
  } else if (days === 1) {
    return 'Χθες';
  } else {
    return new Intl.DateTimeFormat('el-GR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
};

const calculateGrowth = (value) => {
  return ((Math.random() * 20) - 10).toFixed(1);
};

const calculateSuccessRate = () => {
  const total = monthlyStats.successfulTransactions + monthlyStats.failedTransactions;
  return ((monthlyStats.successfulTransactions / total) * 100).toFixed(1);
};

const getActivityIcon = (type) => {
  const icons = {
    payment: 'pi pi-wallet',
    invoice: 'pi pi-file',
    subscription: 'pi pi-sync',
    refund: 'pi pi-replay',
    reminder: 'pi pi-bell'
  };
  return icons[type] || 'pi pi-info-circle';
};

const getActivityColor = (type) => {
  const colors = {
    payment: 'var(--blue-500)',
    invoice: 'var(--green-500)',
    subscription: 'var(--purple-500)',
    refund: 'var(--orange-500)',
    reminder: 'var(--yellow-500)'
  };
  return colors[type] || 'var(--primary-color)';
};

const getAmountClass = (amount) => {
  return {
    'text-green-500 font-medium': amount > 0,
    'text-red-500 font-medium': amount < 0
  };
};

const formatSettingName = (key) => {
  const names = {
    paymentReminders: 'Υπενθυμίσεις Πληρωμών',
    paymentConfirmations: 'Επιβεβαιώσεις Πληρωμών',
    failedPayments: 'Αποτυχημένες Πληρωμές',
    newInvoices: 'Νέα Τιμολόγια'
  };
  return names[key] || key;
};

const formatRangeName = (range) => {
  const names = {
    today: 'Σήμερα',
    yesterday: 'Χθες',
    thisWeek: 'Αυτή την εβδομάδα',
    lastWeek: 'Προηγούμενη εβδομάδα',
    thisMonth: 'Αυτό το μήνα',
    lastMonth: 'Προηγούμενο μήνα',
    thisQuarter: 'Αυτό το τρίμηνο',
    lastQuarter: 'Προηγούμενο τρίμηνο',
    thisYear: 'Φέτος',
    lastYear: 'Πέρυσι'
  };
  return names[range] || range;
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

const openReportsDialog = () => {
  showReportsDialog.value = true;
};

const exportReport = (format) => {
  toast.add({
    severity: 'success',
    summary: 'Εξαγωγή Αναφοράς',
    detail: `Η αναφορά εξάγεται σε μορφή ${format.toUpperCase()}`,
    life: 3000
  });
};
</script>

<style scoped>
.p-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--surface-card);
  box-shadow: var(--card-shadow);
  margin-bottom: 1rem;
}

.card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

/* Timeline customization */
:deep(.p-timeline-event-content) {
  padding: 0.5rem 1rem;
}

:deep(.p-timeline-event-connector) {
  background-color: var(--surface-border);
}

:deep(.p-timeline-event-marker) {
  border-color: var(--primary-color);
}

:deep(.p-timeline-event) {
  transition: all 0.2s;
}

:deep(.p-timeline-event:hover) {
  background-color: var(--surface-hover);
  border-radius: 8px;
}
</style>