<template>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2" v-if="!viewOnly">
                <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
              </div>
            </template>
  
            <!-- <template v-slot:end>
              <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
              <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
            </template> -->
          </Toolbar>
  
          <DataTable
            ref="dt"
            :value="products"
            v-model:selection="selectedProducts"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0">Manage Products</h5>
                <IconField iconPosition="left" class="block mt-2 md:mt-0">
                  <InputIcon class="pi pi-search" />
                  <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                </IconField>
              </div>
            </template>
  
            <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="!viewOnly"></Column>
            <Column field="code" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">Code</span>
                {{ slotProps.data.code }}
              </template>
            </Column>
            <Column field="date" header="Date" :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">Date</span>
                {{ slotProps.data.date }}
              </template>
            </Column>
            <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">Name</span>
                {{ slotProps.data.name }}
              </template>
            </Column>
            <Column field="category" header="Category" :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.category }}
              </template>
            </Column>
            <Column headerStyle="min-width:10rem;">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="viewProduct(slotProps.data)" />
                <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" v-if="!viewOnly" />
              </template>
            </Column>
          </DataTable>
  
          <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
            <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
            <div class="field">
              <label for="name">Name</label>
              <InputText id="name" v-model.trim="product.name" :readonly="viewOnly" required="true" autofocus :invalid="submitted && !product.name" />
              <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
            </div>
            <div class="field">
              <label for="description">Description</label>
              <Textarea id="description" v-model="product.description" :readonly="viewOnly" required="true" rows="3" cols="20" />
            </div>
            <div class="field">
              <label for="inventoryStatus" class="mb-3">Inventory Status</label>
              <Dropdown id="inventoryStatus" v-model="product.category" :options="statuses" optionLabel="label" placeholder="Select a Status" :disabled="viewOnly">
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>
            <template #footer>
              <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
              <Button label="Save" icon="pi pi-check" text="" @click="saveProduct" v-if="!viewOnly" />
            </template>
          </Dialog>
  
          <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex align-items-center justify-content-center">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
            </div>
            <template #footer>
              <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
              <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
            </template>
          </Dialog>
  
          <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex align-items-center justify-content-center">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
              <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
              <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { FilterMatchMode } from 'primevue/api';
  import { ref, onMounted, onBeforeMount } from 'vue';
  import { ProductService } from '@/service/ProductService';
  import { useToast } from 'primevue/usetoast';
  
  export default {
    props: {
      viewOnly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        toast: useToast(),
        products: null,
        productDialog: false,
        deleteProductDialog: false,
        deleteProductsDialog: false,
        product: {},
        selectedProducts: null,
        dt: null,
        filters: {},
        submitted: false,
        statuses: [
          { label: 'World', value: 'World' },
          { label: 'Weather', value: 'Weather' },
          { label: 'Technology', value: 'Technology' },
          { label: 'Sports', value: 'Sports' },
          { label: 'Science', value: 'Science' },
          { label: 'Politics', value: 'Politics' },
          { label: 'Health', value: 'Health' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Entertainment', value: 'Entertainment' },
          { label: 'Economy', value: 'Economy' },
          { label: 'Travel', value: 'Travel' }
        ],
      }
    },
    methods: {
      getBadgeSeverity(inventoryStatus) {
        switch (inventoryStatus.toLowerCase()) {
          case 'instock':
            return 'success';
          case 'lowstock':
            return 'warning';
          case 'outofstock':
            return 'danger';
          default:
            return 'info';
        }
      },
      formatCurrency(value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
      openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
      },
      hideDialog() {
        this.productDialog = false;
        this.submitted = false;
      },
      saveProduct() {
        this.submitted = true;
        if (this.product.name && this.product.name.trim()) {
          if (this.product.id) {
            this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
            this.products[this.findIndexById(this.product.id)] = this.product;
            this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          } else {
            console.log('TESTTTTTTTT');
            this.product.id = this.createId();
            this.product.code = this.createId();
            this.product.image = 'product-placeholder.svg';
            this.product.category = this.product.category ? this.product.category.value : 'General';
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
            const customFormattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            this.product.date = customFormattedDate;
  
            console.log(this.product);
  
            this.products.push(this.product);
            this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          }
          this.productDialog = false;
          this.product = {};
        }
      },
      viewProduct(viewProduct) {
        this.product = { ...viewProduct };
        this.productDialog = true;
      },
      editProduct(editProduct) {
        if (this.viewOnly) return; // Prevent editing if viewOnly mode is enabled
        this.product = { ...editProduct };
        this.productDialog = true;
      },
      confirmDeleteProduct(editProduct) {
        this.product = editProduct;
        this.deleteProductDialog = true;
      },
      deleteProduct() {
        this.products = this.products.filter((val) => val.id !== this.product.id);
        this.deleteProductDialog = false;
        this.product = {};
        this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      },
      findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
            index = i;
            break;
          }
        }
        return index;
      },
      createId() {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
      },
      exportCSV() {
        this.dt.exportCSV();
      },
      confirmDeleteSelected() {
        this.deleteProductsDialog = true;
      },
      deleteSelectedProducts() {
        this.products = this.products.filter((val) => !this.selectedProducts.includes(val));
        this.deleteProductsDialog = false;
        this.selectedProducts = null;
        this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      },
      initFilters() {
        this.filters = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
      },
    },
    beforeMount() {
      this.initFilters();
    },
    mounted() {
      const productService = new ProductService();
      productService.getProducts().then((data) => (
        this.products = data));
    },
  };
  </script>
  
  <style>
  .p-invalid {
    color: #f44336;
  }
  </style>
  