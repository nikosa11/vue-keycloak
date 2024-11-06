<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2" v-if="!viewOnly">
                            <Button label="Νέο Προϊόν" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Διαγραφή" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" 
                                    :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>
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
                    currentPageReportTemplate="Προβολή {first} έως {last} από {totalRecords} προϊόντα"
                    class="p-datatable-rounded"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Διαχείριση Προϊόντων</h5>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Αναζήτηση..." class="p-inputtext-lg"/>
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="!viewOnly"></Column>
                    
                    <Column field="name" header="Όνομα Προϊόντος" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Όνομα</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>

                    <Column field="category" header="Κατηγορία" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.category" severity="info" rounded />
                        </template>
                    </Column>

                    <Column field="targetAudience" header="Κοινό-Στόχος" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Κοινό-Στόχος</span>
                            {{ slotProps.data.targetAudience }}
                        </template>
                    </Column>

                    <Column field="budget" header="Budget" :sortable="true" headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Budget</span>
                            {{ formatCurrency(slotProps.data.budget) }}
                        </template>
                    </Column>

                    <Column field="date" header="Ημερομηνία" :sortable="true" headerStyle="width:12%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.date) }}
                        </template>
                    </Column>

                    <Column field="status" header="Κατάσταση" :sortable="true" headerStyle="width:12%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" rounded />
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="viewProduct(slotProps.data)" />
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" v-if="!viewOnly" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" v-if="!viewOnly" />
                        </template>
                    </Column>
                </DataTable>

                <!-- Dialog για προσθήκη/επεξεργασία -->
                <Dialog 
                    v-model:visible="productDialog" 
                    :style="{ width: '650px' }" 
                    :header="dialogHeader" 
                    :modal="true" 
                    class="p-fluid"
                >
                    <div class="grid p-fluid">
                        <div class="col-12">
                            <div class="field">
                                <label for="image">Εικόνα Προϊόντος</label>
                                <div class="flex align-items-center">
                                    <div v-if="product.image" class="product-image-preview mr-3">
                                        <img :src="`/demo/images/product/${product.image}`" :alt="product.name" class="product-image" />
                                    </div>
                                    <FileUpload
                                        v-if="!viewMode"
                                        mode="basic"
                                        name="image"
                                        accept="image/*"
                                        :maxFileSize="1000000"
                                        @upload="onUpload"
                                        :auto="true"
                                        chooseLabel="Επιλογή Εικόνας"
                                        class="upload-button"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="name">Όνομα Προϊόντος</label>
                                <InputText 
                                    id="name" 
                                    v-model.trim="product.name" 
                                    :readonly="viewMode"
                                    :class="{'p-invalid': submitted && !product.name}" 
                                />
                                <small class="p-error" v-if="submitted && !product.name">Το όνομα είναι υποχρεωτικό.</small>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="category">Κατηγορία</label>
                                <Dropdown 
                                    id="category" 
                                    v-model="product.category" 
                                    :options="categories" 
                                    optionLabel="name"
                                    placeholder="Επιλέξτε Κατηγορία" 
                                    :disabled="viewMode" 
                                />
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="description">Περιγραφή Προϊόντος</label>
                                <Textarea id="description" v-model="product.description" :readonly="viewMode" required rows="3" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="targetAudience">Κοινό-Στόχος</label>
                                <MultiSelect id="targetAudience" v-model="product.targetAudience" :options="audiences"
                                           placeholder="Επιλέξτε Κοινό" :disabled="viewMode" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="budget">Budget (€)</label>
                                <InputNumber id="budget" v-model="product.budget" mode="currency" currency="EUR"
                                           :readonly="viewMode" required />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="campaignDuration">Διάρκεια Καμπάνιας (ημέρες)</label>
                                <InputNumber id="campaignDuration" v-model="product.campaignDuration" 
                                           :readonly="viewMode" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="status">Κατάσταση</label>
                                <Dropdown id="status" v-model="product.status" :options="statuses" optionLabel="label"
                                        placeholder="Επιλέξτε Κατάσταση" :disabled="viewMode" />
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="requirements">Απαιτήσεις</label>
                                <Textarea 
                                    id="requirements" 
                                    v-model="product.requirements" 
                                    :readonly="viewMode" 
                                    rows="2" 
                                />
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <Button 
                            label="Κλείσιμο" 
                            icon="pi pi-times" 
                            text 
                            @click="hideDialog" 
                            v-if="viewMode"
                        />
                        <template v-else>
                            <Button label="Ακύρωση" icon="pi pi-times" text @click="hideDialog" />
                            <Button label="Αποθήκευση" icon="pi pi-check" text @click="saveProduct" />
                        </template>
                    </template>
                </Dialog>

                <!-- Dialogs για διαγραφή -->
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Επιβεβαίωση" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Είστε σίγουροι ότι θέλετε να διαγράψετε το <b>{{ product.name }}</b>;</span>
                    </div>
                    <template #footer>
                        <Button label="Όχι" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Ναι" icon="pi pi-check" text @click="deleteProduct" />
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
import FileUpload from 'primevue/fileupload';

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
                { label: 'Σε Αναμονή', value: 'PENDING', severity: 'warning' },
                { label: 'Ενεργό', value: 'ACTIVE', severity: 'success' },
                { label: 'Ολοκληρωμένο', value: 'COMPLETED', severity: 'info' },
                { label: 'Ακυρωμένο', value: 'CANCELLED', severity: 'danger' }
            ],
            categories: [
                { name: 'Ένδυση & Μόδα' },
                { name: 'Ομορφιά & Καλλυντικά' },
                { name: 'Τεχνολογία' },
                { name: 'Τρόφιμα & Ποτά' },
                { name: 'Υγεία & Ευεξία' },
                { name: 'Ταξίδια & Lifestyle' },
                { name: 'Αθλητικά Είδη' },
                { name: 'Παιδικά Προϊόντα' }
            ],
            audiences: [
                'Γυναίκες 18-24',
                'Γυναίκες 25-34',
                'Άνδρες 18-24',
                'Άνδρες 25-34',
                'Γονείς',
                'Φοιτητές',
                'Επαγγελματίες',
                'Αθλητικοί Τύποι'
            ],
            viewMode: false,
        }
    },
    computed: {
        dialogHeader() {
            return this.viewMode ? 'Προβολή Προϊόντος' : 'Επεξεργασία Προϊόντος';
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
            if (value == null) return '';
            return new Intl.NumberFormat('el-GR', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        },
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('el-GR');
        },
        getStatusSeverity(status) {
            const statusObj = this.statuses.find(s => s.value === status);
            return statusObj ? statusObj.severity : 'info';
        },
        openNew() {
            this.product = {
                id: null,
                name: '',
                description: '',
                image: null,
                category: null,
                targetAudience: [],
                budget: 0,
                campaignDuration: 0,
                status: 'PENDING',
                requirements: '',
                date: new Date().toISOString()
            };
            this.viewMode = false;
            this.submitted = false;
            this.productDialog = true;
        },
        hideDialog() {
            this.productDialog = false;
            this.submitted = false;
            this.viewMode = false;
        },
        saveProduct() {
            this.submitted = true;

            if (this.product.name.trim()) {
                if (this.product.id) {
                    // Update existing product
                    const index = this.findIndexById(this.product.id);
                    if (index !== -1) {
                        this.products[index] = {...this.product};
                        this.toast.add({
                            severity: 'success',
                            summary: 'Επιτυχία',
                            detail: 'Το προϊόν ενημερώθηκε',
                            life: 3000
                        });
                    }
                } else {
                    // Create new product
                    this.product.id = this.createId();
                    this.product.date = new Date().toISOString();
                    this.products.push({...this.product});
                    this.toast.add({
                        severity: 'success',
                        summary: 'Επιτυχία',
                        detail: 'Το προϊόν δημιουργήθηκε',
                        life: 3000
                    });
                }

                this.productDialog = false;
                this.product = {};
            }
        },
        viewProduct(product) {
            this.product = { ...product };
            this.viewMode = true;
            this.productDialog = true;
        },
        editProduct(product) {
            this.product = { ...product };
            this.viewMode = false;
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
        onUpload(event) {
            const file = event.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                // Στην πραγματική εφαρμογή, εδώ θα κάναμε upload στον server
                // Για τώρα απλά αποθηκεύουμε το όνομα του αρχείου
                this.product.image = file.name;
                this.$toast.add({
                    severity: 'success',
                    summary: 'Επιτυχία',
                    detail: 'Η εικόνα μεταφορτώθηκε',
                    life: 3000
                });
            };
            reader.readAsDataURL(file);
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

<style lang="scss" scoped>
.p-datatable-rounded {
    .p-datatable-header {
        border-radius: 1rem 1rem 0 0;
    }
    .p-datatable-footer {
        border-radius: 0 0 1rem 1rem;
    }
}

.p-button {
    border-radius: 2rem;
}

.p-dialog {
    border-radius: 1rem;
    .p-dialog-header {
        border-radius: 1rem 1rem 0 0;
    }
    .p-dialog-footer {
        border-radius: 0 0 1rem 1rem;
    }
}

.p-dropdown, .p-multiselect, .p-inputtext, .p-inputnumber-input {
    border-radius: 1rem !important;
}

.p-tag {
    border-radius: 1rem;
}

.product-image-preview {
    width: 100px;
    height: 100px;
    border-radius: 1rem;
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.upload-button {
    :deep(.p-button) {
        border-radius: 1rem;
    }
}

.product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

:deep(.p-fileupload-choose) {
    width: auto;
    padding: 0.5rem 1rem;
    
    &:not(.p-disabled):hover {
        background: var(--primary-600);
    }
}
</style>
  