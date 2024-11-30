<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2" v-if="!viewOnly">
                            <Button label="Νέα Καμπάνια" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Διαγραφή" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" 
                                    :disabled="!selectedCampaigns || !selectedCampaigns.length" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="campaigns"
                    v-model:selection="selectedCampaigns"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Προβολή {first} έως {last} από {totalRecords} καμπάνιες"
                    class="p-datatable-rounded"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Διαχείριση Καμπανιών</h5>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Αναζήτηση..." class="p-inputtext-lg"/>
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="!viewOnly"></Column>
                    
                    <Column field="name" header="Όνομα Καμπάνιας" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Όνομα</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>

                    <Column field="category" header="Κατηγορία" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.category.name" severity="info" rounded />
                        </template>
                    </Column>

                    <Column field="targetAudience" header="Κοινό-Στόχος" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Κοινό-Στόχος</span>
                            {{ slotProps.data.targetAudience }}
                        </template>
                    </Column>

                    <Column field="budget" header="Προϋπολογισμός" :sortable="true" headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Προϋπολογισμός</span>
                            {{ formatCurrency(slotProps.data.budget) }}
                        </template>
                    </Column>

                    <Column field="campaignDuration" header="Διάρκεια Καμπάνιας" :sortable="true" headerStyle="width:12%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.campaignDuration }} ημέρες
                        </template>
                    </Column>

                    <Column field="status" header="Κατάσταση" :sortable="true" headerStyle="width:12%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" rounded />
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="viewCampaign(slotProps.data)" />
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCampaign(slotProps.data)" v-if="!viewOnly" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteCampaign(slotProps.data)" v-if="!viewOnly" />
                        </template>
                    </Column>
                </DataTable>

                <!-- Dialog για προσθήκη/επεξεργασία -->
                <Dialog 
                    v-model:visible="campaignDialog" 
                    :style="{ width: '650px' }" 
                    :header="dialogHeader" 
                    :modal="true" 
                    class="p-fluid"
                >
                    <div class="grid p-fluid">
                        <div class="col-12">
                            <div class="field">
                                <label for="image">Εικόνα Καμπάνιας</label>
                                <div class="flex align-items-center">
                                    <div v-if="campaign.image" class="product-image-preview mr-3">
                                        <img :src="campaign.image" :alt="campaign.name" class="product-image" />
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
                                <label for="name">Όνομα Καμπάνιας</label>
                                <InputText 
                                    id="name" 
                                    v-model.trim="campaign.name" 
                                    :readonly="viewMode"
                                    :class="{'p-invalid': submitted && !campaign.name}" 
                                />
                                <small class="p-error" v-if="submitted && !campaign.name">Το όνομα είναι υποχρεωτικό.</small>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="category">Κατηγορία</label>
                                <Dropdown 
                                    id="category" 
                                    v-model="campaign.category" 
                                    :options="categories" 
                                    optionLabel="name"
                                    placeholder="Επιλέξτε Κατηγορία" 
                                    :disabled="viewMode" 
                                />
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="description">Περιγραφή Καμπάνιας</label>
                                <Textarea id="description" v-model="campaign.description" :readonly="viewMode" required rows="3" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="targetAudience">Κοινό-Στόχος</label>
                                <MultiSelect id="targetAudience" v-model="campaign.targetAudience" :options="audiences"
                                           placeholder="Επιλέξτε Κοινό" :disabled="viewMode" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="budget">Προϋπολογισμός (€)</label>
                                <InputNumber id="budget" v-model="campaign.budget" mode="currency" currency="EUR"
                                           :readonly="viewMode" required />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="campaignDuration">Διάρκεια Καμπάνιας (ημέρες)</label>
                                <InputNumber id="campaignDuration" v-model="campaign.campaignDuration" 
                                           :readonly="viewMode" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="status">Κατάσταση</label>
                                <Dropdown id="status" v-model="campaign.status" :options="statuses" optionLabel="label"
                                        placeholder="Επιλέξτε Κατάσταση" :disabled="viewMode" />
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="requirements">Απαιτήσεις</label>
                                <Textarea 
                                    id="requirements" 
                                    v-model="campaign.requirements" 
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
                            <Button label="Αποθήκευση" icon="pi pi-check" text @click="saveCampaign" />
                        </template>
                    </template>
                </Dialog>

                <!-- Dialogs για διαγραφή -->
                <Dialog v-model:visible="deleteCampaignDialog" :style="{ width: '450px' }" header="Επιβεβαίωση" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Είστε σίγουροι ότι θέλετε να διαγράψετε την καμπάνια <b>{{ campaign.name }}</b>;</span>
                    </div>
                    <template #footer>
                        <Button label="Όχι" icon="pi pi-times" text @click="deleteCampaignDialog = false" />
                        <Button label="Ναι" icon="pi pi-check" text @click="deleteCampaign" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import CampaignService from '@/service/CampaignService';

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
            campaigns: null,
            campaignDialog: false,
            deleteCampaignDialog: false,
            deleteCampaignsDialog: false,
            campaign: {},
            selectedCampaigns: null,
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
            return this.viewMode ? 'Προβολή Καμπάνιας' : 'Επεξεργασία Καμπάνιας';
        }
    },
    methods: {
        getBadgeSeverity(status) {
            switch (status.toLowerCase()) {
                case 'pending':
                    return 'warning';
                case 'active':
                    return 'success';
                case 'completed':
                    return 'info';
                case 'cancelled':
                    return 'danger';
                default:
                    return null;
            }
        },
        formatCurrency(value) {
            return value.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' });
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('el-GR');
        },
        getStatusSeverity(status) {
            const statusObj = this.statuses.find(s => s.value === status);
            return statusObj ? statusObj.severity : null;
        },
        openNew() {
            this.campaign = {
                status: 'PENDING',
                category: null,
                targetAudience: null,
                requirements: '',
                budget: 0,
                campaignDuration: 30
            };
            this.submitted = false;
            this.campaignDialog = true;
            this.viewMode = false;
        },
        hideDialog() {
            this.campaignDialog = false;
            this.submitted = false;
            this.viewMode = false;
        },
        saveCampaign() {
            this.submitted = true;

            if (this.campaign.name?.trim()) {
                if (this.campaign.id) {
                    // Update existing campaign
                    this.campaigns[this.findIndexById(this.campaign.id)] = this.campaign;
                    this.toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Η καμπάνια ενημερώθηκε', life: 3000 });
                } else {
                    // Create new campaign
                    this.campaign.id = this.createId();
                    this.campaign.date = new Date();
                    this.campaigns.push(this.campaign);
                    this.toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Η καμπάνια δημιουργήθηκε', life: 3000 });
                }

                this.campaignDialog = false;
                this.campaign = {};
            }
        },
        viewCampaign(campaign) {
            this.campaign = { ...campaign };
            this.campaignDialog = true;
            this.viewMode = true;
        },
        editCampaign(campaign) {
            this.campaign = { ...campaign };
            this.campaignDialog = true;
            this.viewMode = false;
        },
        confirmDeleteCampaign(campaign) {
            this.campaign = campaign;
            this.deleteCampaignDialog = true;
        },
        deleteCampaign() {
            this.campaigns = this.campaigns.filter(val => val.id !== this.campaign.id);
            this.deleteCampaignDialog = false;
            this.campaign = {};
            this.toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Η καμπάνια διαγράφηκε', life: 3000 });
        },
        findIndexById(id) {
            let index = -1;
            for (let i = 0; i < this.campaigns.length; i++) {
                if (this.campaigns[i].id === id) {
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
            this.$refs.dt.exportCSV();
        },
        confirmDeleteSelected() {
            this.deleteCampaignsDialog = true;
        },
        deleteSelectedCampaigns() {
            this.campaigns = this.campaigns.filter(val => !this.selectedCampaigns.includes(val));
            this.deleteCampaignsDialog = false;
            this.selectedCampaigns = null;
            this.toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Οι καμπάνιες διαγράφηκαν', life: 3000 });
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
                this.campaign.image = reader.result;
                this.toast.add({ severity: 'info', summary: 'Επιτυχία', detail: 'Η εικόνα μεταφορτώθηκε' });
            };
            reader.readAsDataURL(file);
        }
    },
    beforeMount() {
        this.initFilters();
    },
    mounted() {
        CampaignService.getCampaigns().then(response => {
            // Access the nested data array from the response
            const campaignsData = response.data.data;
            
            // Transform category to match the expected format
            this.campaigns = campaignsData.map(campaign => ({
                ...campaign,
                category: { name: campaign.category }  // Transform category to object format
            }));
        }).catch(error => {
            console.error('Error loading campaigns:', error);
            this.campaigns = []; // Initialize as empty array on error
            this.toast.add({ 
                severity: 'error', 
                summary: 'Σφάλμα', 
                detail: 'Δεν ήταν δυνατή η φόρτωση των καμπανιών', 
                life: 3000 
            });
        });
    }
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