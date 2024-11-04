// PaymentMethods.vue
<template>
  <div class="grid">
    <!-- Saved Payment Methods -->
    <div class="col-12 lg:col-8">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h2 class="text-xl font-semibold m-0">Αποθηκευμένες Μέθοδοι Πληρωμής</h2>
          <Button label="Προσθήκη Νέας" 
                  icon="pi pi-plus" 
                  @click="openNewMethodDialog" />
        </div>

        <div class="flex flex-column gap-3">
          <div v-for="method in paymentMethods" 
               :key="method.id" 
               class="flex align-items-center justify-content-between p-3 border-1 surface-border border-round">
            
            <!-- Payment Method Info -->
            <div class="flex align-items-center gap-3">
              <div class="flex align-items-center justify-content-center border-circle w-3rem h-3rem"
                   :class="getPaymentMethodStyle(method.type)">
                <i :class="getPaymentMethodIcon(method.type)" class="text-xl"></i>
              </div>
              <div>
                <span class="block font-semibold">{{ method.type }} {{ method.isDefault ? '(Προεπιλογή)' : '' }}</span>
                <span class="text-500">**** {{ method.lastDigits }}</span>
                <span class="block text-500 text-sm">Λήξη: {{ method.expiry }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <Button v-if="!method.isDefault"
                      icon="pi pi-star" 
                      text 
                      rounded 
                      severity="secondary"
                      @click="setDefaultMethod(method)"
                      v-tooltip.top="'Ορισμός ως προεπιλογή'" />
              <Button icon="pi pi-pencil" 
                      text 
                      rounded 
                      @click="editMethod(method)"
                      v-tooltip.top="'Επεξεργασία'" />
              <Button icon="pi pi-trash" 
                      text 
                      rounded 
                      severity="danger"
                      @click="confirmDelete(method)"
                      v-tooltip.top="'Διαγραφή'" />
            </div>
          </div>

          <div v-if="paymentMethods.length === 0" 
               class="text-center p-5 surface-ground border-round">
            <i class="pi pi-credit-card text-4xl text-500 mb-3"></i>
            <div class="text-500">Δεν έχετε αποθηκεύσει καμία μέθοδο πληρωμής</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Method Form -->
    <Dialog v-model:visible="showMethodDialog" 
            :header="editingMethod ? 'Επεξεργασία Μεθόδου Πληρωμής' : 'Προσθήκη Νέας Μεθόδου Πληρωμής'"
            :modal="true"
            :style="{width: '450px'}"
            @hide="resetForm">
      <div class="flex flex-column gap-3">
        <!-- Payment Type Selection -->
        <div class="field">
          <label for="type">Τύπος Κάρτας</label>
          <Dropdown id="type"
                   v-model="methodForm.type"
                   :options="paymentTypes"
                   optionLabel="name"
                   placeholder="Επιλέξτε τύπο"
                   class="w-full" />
        </div>

        <!-- Card Number -->
        <div class="field">
          <label for="cardNumber">Αριθμός Κάρτας</label>
          <div class="p-inputgroup">
            <InputMask id="cardNumber"
                      v-model="methodForm.cardNumber"
                      mask="9999-9999-9999-9999"
                      placeholder="0000-0000-0000-0000"
                      class="w-full" />
            <Button icon="pi pi-camera"
                    @click="scanCard"
                    v-tooltip.left="'Σάρωση κάρτας'" />
          </div>
        </div>

        <!-- Expiry & CVV -->
        <div class="grid">
          <div class="col-6 field">
            <label for="expiry">Ημ. Λήξης</label>
            <InputMask id="expiry"
                      v-model="methodForm.expiry"
                      mask="99/99"
                      placeholder="ΜΜ/ΕΕ"
                      class="w-full" />
          </div>
          <div class="col-6 field">
            <label for="cvv">CVV</label>
            <Password id="cvv"
                     v-model="methodForm.cvv"
                     :feedback="false"
                     inputClass="w-full"
                     maxLength="4"
                     placeholder="***" />
          </div>
        </div>

        <!-- Cardholder Name -->
        <div class="field">
          <label for="name">Όνομα Κατόχου</label>
          <InputText id="name"
                    v-model="methodForm.name"
                    class="w-full"
                    placeholder="Όπως εμφανίζεται στην κάρτα" />
        </div>

        <!-- Set as Default -->
        <div class="field">
          <Checkbox id="isDefault"
                   v-model="methodForm.isDefault"
                   :binary="true" />
          <label for="isDefault" class="ml-2">Ορισμός ως προεπιλογή</label>
        </div>
      </div>

      <template #footer>
        <Button label="Ακύρωση"
                icon="pi pi-times"
                text
                @click="closeMethodDialog" />
        <Button label="Αποθήκευση"
                icon="pi pi-check"
                @click="saveMethod" />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const toast = useToast();
const confirm = useConfirm();

// Payment Types
const paymentTypes = [
  { name: 'Visa', icon: 'pi pi-credit-card', bgClass: 'bg-blue-100 text-blue-500' },
  { name: 'Mastercard', icon: 'pi pi-credit-card', bgClass: 'bg-orange-100 text-orange-500' },
  { name: 'American Express', icon: 'pi pi-credit-card', bgClass: 'bg-purple-100 text-purple-500' }
];

// Dummy Data - Payment Methods
const paymentMethods = ref([
  {
    id: 1,
    type: 'Visa',
    lastDigits: '4242',
    expiry: '12/25',
    name: 'JOHN DOE',
    isDefault: true
  },
  {
    id: 2,
    type: 'Mastercard',
    lastDigits: '5555',
    expiry: '06/24',
    name: 'JOHN DOE',
    isDefault: false
  }
]);

// Form State
const showMethodDialog = ref(false);
const editingMethod = ref(null);
const methodForm = ref({
  type: null,
  cardNumber: '',
  expiry: '',
  cvv: '',
  name: '',
  isDefault: false
});

// Methods
const getPaymentMethodStyle = (type) => {
  const methodType = paymentTypes.find(t => t.name === type);
  return methodType ? methodType.bgClass : 'bg-gray-100 text-gray-500';
};

const getPaymentMethodIcon = (type) => {
  const methodType = paymentTypes.find(t => t.name === type);
  return methodType ? methodType.icon : 'pi pi-credit-card';
};

const openNewMethodDialog = () => {
  editingMethod.value = null;
  showMethodDialog.value = true;
};

const editMethod = (method) => {
  editingMethod.value = method;
  methodForm.value = {
    type: paymentTypes.find(t => t.name === method.type),
    cardNumber: `****-****-****-${method.lastDigits}`,
    expiry: method.expiry,
    cvv: '',
    name: method.name,
    isDefault: method.isDefault
  };
  showMethodDialog.value = true;
};

const closeMethodDialog = () => {
  showMethodDialog.value = false;
  resetForm();
};

const resetForm = () => {
  editingMethod.value = null;
  methodForm.value = {
    type: null,
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    isDefault: false
  };
};

const saveMethod = () => {
  // Validation
  if (!methodForm.value.type || !methodForm.value.cardNumber || !methodForm.value.expiry) {
    toast.add({
      severity: 'error',
      summary: 'Σφάλμα',
      detail: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία',
      life: 3000
    });
    return;
  }

  // Save logic here
  toast.add({
    severity: 'success',
    summary: 'Επιτυχία',
    detail: editingMethod.value 
      ? 'Η μέθοδος πληρωμής ενημερώθηκε'
      : 'Η μέθοδος πληρωμής προστέθηκε',
    life: 3000
  });

  closeMethodDialog();
};

const confirmDelete = (method) => {
  confirm.require({
    message: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη μέθοδο πληρωμής;',
    header: 'Επιβεβαίωση Διαγραφής',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteMethod(method),
    reject: () => {}
  });
};

const deleteMethod = (method) => {
  // Delete logic here
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== method.id);
  toast.add({
    severity: 'success',
    summary: 'Επιτυχία',
    detail: 'Η μέθοδος πληρωμής διαγράφηκε',
    life: 3000
  });
};

const setDefaultMethod = (method) => {
  // Update default method logic here
  paymentMethods.value = paymentMethods.value.map(m => ({
    ...m,
    isDefault: m.id === method.id
  }));
  
  toast.add({
    severity: 'success',
    summary: 'Επιτυχία',
    detail: 'Η προεπιλεγμένη μέθοδος πληρωμής άλλαξε',
    life: 3000
  });
};

const scanCard = () => {
  toast.add({
    severity: 'info',
    summary: 'Σάρωση Κάρτας',
    detail: 'Η λειτουργία σάρωσης κάρτας δεν είναι διαθέσιμη αυτή τη στιγμή',
    life: 3000
  });
};
</script>

<style scoped>
.p-password >>> input {
  width: 100%;
}
</style>