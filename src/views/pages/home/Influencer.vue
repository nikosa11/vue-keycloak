<template>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Influencer</div>
      <DataTable
        :value="customers1"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters1"
        filterDisplay="menu"
        :loading="loading1"
        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
        showGridlines
        @row-click="openCustomerDialog"
      >
        <template #header>
          <div class="flex justify-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-if="filters1 && filters1.global" v-model="filters1.global.value" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>
  
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
  
        <Column field="name" header="Name" style="min-width: 12rem">
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
          <template #filter="slotProps">
            <InputText v-model="slotProps.filterModel.value" type="text" placeholder="Search by name" />
          </template>
        </Column>
  
        <Column header="Country" filterField="country.name" style="min-width: 12rem">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.data.country.code}`" style="width: 24px" />
              <span>{{ slotProps.data.country.name }}</span>
            </div>
          </template>
          <template #filter="slotProps">
            <InputText v-model="slotProps.filterModel.value" type="text" placeholder="Search by country" />
          </template>
          <template #filterclear="slotProps">
            <Button type="button" icon="pi pi-times" @click="slotProps.filterCallback()" severity="secondary"></Button>
          </template>
          <template #filterapply="slotProps">
            <Button type="button" icon="pi pi-check" @click="slotProps.filterCallback()" severity="success"></Button>
          </template>
        </Column>
  
        <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <img :alt="slotProps.data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`" style="width: 32px" />
              <span>{{ slotProps.data.representative.name }}</span>
            </div>
          </template>
          <template #filter="slotProps">
            <MultiSelect v-model="slotProps.filterModel.value" :options="representatives" optionLabel="name" placeholder="Any">
              <template #option="optionProps">
                <div class="flex items-center gap-2">
                  <img :alt="optionProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${optionProps.option.image}`" style="width: 32px" />
                  <span>{{ optionProps.option.name }}</span>
                </div>
              </template>
            </MultiSelect>
          </template>
        </Column>
  
        <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date) }}
          </template>
          <template #filter="slotProps">
            <Calendar v-model="slotProps.filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
          </template>
        </Column>
  
        <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.balance) }}
          </template>
          <template #filter="slotProps">
            <InputNumber v-model="slotProps.filterModel.value" mode="currency" currency="USD" locale="en-US" />
          </template>
        </Column>
  
        <Column header="Status" field="status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
          </template>
          <template #filter="slotProps">
            <Dropdown v-model="slotProps.filterModel.value" :options="statuses" placeholder="Select One" showClear>
              <template #option="optionProps">
                <Tag :value="optionProps.option" :severity="getSeverity(optionProps.option)" />
              </template>
            </Dropdown>
          </template>
        </Column>
  
        <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="slotProps">
            <ProgressBar :value="slotProps.data.activity" :showValue="false" style="height: 6px"></ProgressBar>
          </template>
          <template #filter="slotProps">
            <Slider v-model="slotProps.filterModel.value" range class="m-4"></Slider>
            <div class="flex items-center justify-between px-2">
              <span>{{ slotProps.filterModel.value ? slotProps.filterModel.value[0] : 0 }}</span>
              <span>{{ slotProps.filterModel.value ? slotProps.filterModel.value[1] : 100 }}</span>
            </div>
          </template>
        </Column>
  
        <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
          <template #body="slotProps">
            <i class="pi" :class="{ 'pi-check-circle text-green-500 ': slotProps.data.verified, 'pi-times-circle text-red-500': !slotProps.data.verified }"></i>
          </template>
          <template #filter="slotProps">
            <label for="verified-filter" class="font-bold"> Verified </label>
            <TriStateCheckbox v-model="slotProps.filterModel.value" inputId="verified-filter" />
          </template>
        </Column>
      </DataTable>
  
      <!-- Customer Details Dialog -->
      <Dialog v-model:visible="customerDialogVisible" :style="{ width: '450px' }" header="           " :modal="true" class="p-fluid">
        <div v-if="selectedCustomer">
            <div class="field" style="width: 100%;">
                <label  style="font-size: large;" for="name">{{selectedCustomer.name}}</label>
            </div>

          <!-- Εικόνα του καλλιτέχνη στο κέντρο με διαφανές background -->
          <div class="text-center mb-5">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/avatar/${selectedCustomer.representative.image}`"
              :alt="selectedCustomer.representative.name"
              class="rounded-circle shadow-2"
              style="width: 150px; height: 150px; object-fit: cover; background-color: transparent"
            />
          </div>
  
          <!-- Ονομα και χώρα σε δύο στήλες -->
          <div class="flex flex-wrap justify-content-center gap-3">
            <div class="field" style="width: 45%;">
              <label for="name">Name</label>
              <InputText id="name" v-model="selectedCustomer.name" readonly required class="w-full text-center" />
            </div>
            <div class="field" style="width: 45%;">
              <label for="country">Country</label>
              <InputText id="country" v-model="selectedCustomer.country.name" readonly required class="w-full text-center" />
            </div>
          </div>
  
         
  
          <!-- Άλλες γενικές πληροφορίες σε δύο στήλες -->
          <div class="flex flex-wrap justify-content-center gap-3 mt-4">
            <div class="field" style="width: 45%;">
              <label for="status">Status</label>
              <InputText id="status" v-model="selectedCustomer.status" readonly required class="w-full text-center" />
            </div>
            <div class="field" style="width: 45%;">
              <label for="agent">Agent</label>
              <InputText id="agent" v-model="selectedCustomer.representative.name" readonly required class="w-full text-center" />
            </div>
             <!-- Balance ως κουμπί -->
          <div class="text-center mt-4">
            <Button class="p-button-rounded p-button-info w-full" >Pay: {{ formatCurrency(selectedCustomer.balance) }}</Button>
          </div>
          </div>
        </div>
      </Dialog>
    </div>
  </template>
  
  <script>
  import { CustomerService } from '@/service/CustomerService';
  import { FilterMatchMode, FilterOperator } from 'primevue/api';
  import { ref } from 'vue';
  
  export default {
    data() {
      return {
        customers1: [],
        filters1: null,
        loading1: true,
        selectedCustomer: null,
        customerDialogVisible: false,
        statuses: ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'],
        representatives: [
          { name: 'Amy Elsner', image: 'amyelsner.png' },
          { name: 'Anna Fali', image: 'annafali.png' },
          { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
          { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
          { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
          { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
          { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
          { name: 'Onyama Limba', image: 'onyamalimba.png' },
          { name: 'Stephen Shaw', image: 'stephenshaw.png' },
          { name: 'XuXue Feng', image: 'xuxuefeng.png' }
        ]
      };
    },
    methods: {
      formatCurrency(value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
      formatDate(value) {
        if (!value) return '';
        if (typeof value === 'string' || typeof value === 'number') {
          value = new Date(value);
        }
        return value.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      },
      getSeverity(status) {
        switch (status) {
          case 'unqualified':
            return 'danger';
          case 'qualified':
            return 'success';
          case 'new':
            return 'info';
          case 'negotiation':
            return 'warning';
          case 'renewal':
            return 'secondary';
          case 'proposal':
            return 'primary';
          default:
            return null;
        }
      },
      initFilters1() {
        this.filters1 = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
          balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
          status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
          activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        };
      },
      clearFilter() {
        this.initFilters1();
      },
      openCustomerDialog(event) {
        this.selectedCustomer = { ...event.data };
        this.customerDialogVisible = true;
      },
      hideDialog() {
        this.customerDialogVisible = false;
        this.selectedCustomer = null;
      }
    },
    mounted() {
      const customerService = new CustomerService();
      customerService.getCustomersLarge().then((data) => {
        this.customers1 = data;
        this.loading1 = false;
        this.customers1.forEach((customer) => {
          if (customer.date) {
            customer.date = new Date(customer.date);
          }
        });
      });
  
      this.initFilters1();
    }
  };
  </script>
  
  <style scoped lang="scss">
  :deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
  }
  
  :deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
  }
  
  .field {
    text-align: center;
  }
  
  img {
    background-color: transparent;
  }
  
  .balance {
    text-align: center !important;
  }
  .text-center {
    border-radius: 20px;

    text-align: center !important;
}
 .shadow-2{
    box-shadow: none  !important;
}

  </style>
  