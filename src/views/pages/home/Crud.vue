<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-4">
                    <div class="flex flex-wrap gap-2">
                        <Button label="Νέα Καμπάνια" icon="pi pi-plus" severity="success" @click="openNew" class="p-button-rounded" />
                        <Button label="Διαγραφή" icon="pi pi-trash" severity="danger" @click="deleteSelectedCampaigns" :disabled="!selectedCampaigns || !selectedCampaigns.length" class="p-button-rounded" />
                    </div>
                </div>

                <div class="flex justify-content-between align-items-center mb-4">
                    <div class="flex flex-wrap gap-2">
                        <Button v-for="status in ['ACTIVE', 'PENDING', 'COMPLETED']" :key="status"
                            :label="status"
                            :class="[
                                'p-button-rounded status-filter',
                                { 'p-button-outlined': quickFilter !== status },
                                { 'status-active': status === 'ACTIVE' },
                                { 'status-pending': status === 'PENDING' },
                                { 'status-completed': status === 'COMPLETED' }
                            ]"
                            @click="applyQuickFilter(status)" />
                    </div>
                    <div class="flex gap-2">
                        <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name" 
                            placeholder="Κατηγορία" class="w-12rem" @change="onCategoryChange" />
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters.global.value" placeholder="Αναζήτηση..." class="p-inputtext-sm" />
                        </span>
                    </div>
                </div>

                <DataTable ref="dt" :value="campaigns" v-model:selection="selectedCampaigns" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} campaigns"
                    responsiveLayout="scroll" :loading="loading" stripedRows :rowHover="true"
                    class="p-datatable-sm"
                >
                    <template #empty>No campaigns found.</template>
                    <template #loading>Loading campaigns data. Please wait.</template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column field="name" header="Καμπάνια" sortable>
                        <template #body="slotProps">
                            <div class="flex align-items-center gap-2">
                                <img :src="'https://picsum.photos/50/50?random=' + slotProps.data.id" :alt="slotProps.data.name" class="w-3rem h-3rem shadow-2 rounded-circle" />
                                <div class="flex flex-column">
                                    <span class="font-bold">{{ slotProps.data.name }}</span>
                                    <span class="text-500">{{ slotProps.data.influencer }}</span>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="category.name" header="Κατηγορία" sortable>
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.category.name" :style="{ backgroundColor: getTagColor(slotProps.data.category.name), color: '#ffffff' }" class="p-tag-rounded" />
                        </template>
                    </Column>

                    <Column field="budget" header="Προϋπολογισμός" sortable>
                        <template #body="slotProps">
                            <span class="font-semibold">{{ formatCurrency(slotProps.data.budget) }}</span>
                        </template>
                    </Column>

                    <Column field="status" header="Κατάσταση" sortable>
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" rounded />
                        </template>
                    </Column>

                    <Column field="date" header="Ημερομηνία" sortable>
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.date) }}
                        </template>
                    </Column>

                    <Column :exportable="false" style="min-width:8rem">
                        <template #body="slotProps">
                            <div class="flex gap-2 justify-content-end">
                                <Button icon="pi pi-eye" rounded severity="info" @click="viewCampaign(slotProps.data)" class="p-button-sm" />
                                <Button icon="pi pi-pencil" rounded severity="success" @click="editCampaign(slotProps.data)" class="p-button-sm" />
                                <Button icon="pi pi-trash" rounded severity="danger" @click="confirmDeleteCampaign(slotProps.data)" class="p-button-sm" />
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="campaignDialog" :style="{ width: '500px' }" :header="campaign.id ? 'Επεξεργασία Καμπάνιας' : 'Νέα Καμπάνια'" :modal="true" class="p-fluid" :dismissableMask="true">
                    <div class="flex align-items-center justify-content-center mb-4">
                        <img :src="campaign.id ? 'https://picsum.photos/200/200?random=' + campaign.id : 'https://picsum.photos/200/200'" class="w-8rem h-8rem shadow-2 rounded-circle" />
                    </div>
                    <div class="field">
                        <label for="name" class="font-medium">Όνομα</label>
                        <InputText id="name" v-model.trim="campaign.name" required="true" autofocus :class="{ 'p-invalid': submitted && !campaign.name }" />
                        <small class="p-error" v-if="submitted && !campaign.name">Το όνομα είναι υποχρεωτικό.</small>
                    </div>
                    <div class="field">
                        <label for="description" class="font-medium">Περιγραφή</label>
                        <Textarea id="description" v-model="campaign.description" required="true" rows="3" />
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="category" class="font-medium">Κατηγορία</label>
                            <Dropdown id="category" v-model="campaign.category" :options="categories" optionLabel="name" placeholder="Επιλογή" :class="{ 'p-invalid': submitted && !campaign.category }" />
                            <small class="p-error" v-if="submitted && !campaign.category">Η κατηγορία είναι υποχρεωτική.</small>
                        </div>
                        <div class="field col">
                            <label for="budget" class="font-medium">Προϋπολογισμός</label>
                            <InputNumber id="budget" v-model="campaign.budget" :class="{ 'p-invalid': submitted && !campaign.budget }" mode="currency" currency="EUR" locale="el-GR" />
                            <small class="p-error" v-if="submitted && !campaign.budget">Ο προϋπολογισμός είναι υποχρεωτικός.</small>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="status" class="font-medium">Κατάσταση</label>
                            <Dropdown id="status" v-model="campaign.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Επιλογή" />
                        </div>
                        <div class="field col">
                            <label for="influencer" class="font-medium">Influencer</label>
                            <InputText id="influencer" v-model="campaign.influencer" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="targetAudience" class="font-medium">Κοινό-Στόχος</label>
                        <MultiSelect id="targetAudience" v-model="campaign.targetAudience" :options="audiences" display="chip" placeholder="Επιλογή" class="w-full" />
                    </div>

                    <template #footer>
                        <Button label="Ακύρωση" icon="pi pi-times" text @click="hideDialog" class="p-button-rounded" />
                        <Button label="Αποθήκευση" icon="pi pi-check" text @click="saveCampaign" class="p-button-rounded" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="viewDialog" :style="{ width: '500px' }" header="Προβολή Καμπάνιας" :modal="true" :dismissableMask="true">
                    <div v-if="campaign" class="p-fluid">
                        <div class="flex align-items-center justify-content-center mb-4">
                            <img :src="'https://picsum.photos/200/200?random=' + campaign.id" class="w-8rem h-8rem shadow-2 rounded-circle" />
                        </div>
                        <div class="field mb-4">
                            <label class="font-medium mb-2 block">Όνομα</label>
                            <div class="text-900">{{ campaign.name }}</div>
                        </div>
                        <div class="field mb-4">
                            <label class="font-medium mb-2 block">Περιγραφή</label>
                            <div class="text-900">{{ campaign.description }}</div>
                        </div>
                        <div class="formgrid grid mb-4">
                            <div class="field col">
                                <label class="font-medium mb-2 block">Κατηγορία</label>
                                <Tag :value="campaign.category?.name" severity="info" class="p-tag-rounded" />
                            </div>
                            <div class="field col">
                                <label class="font-medium mb-2 block">Προϋπολογισμός</label>
                                <div class="text-900">{{ formatCurrency(campaign.budget) }}</div>
                            </div>
                        </div>
                        <div class="formgrid grid mb-4">
                            <div class="field col">
                                <label class="font-medium mb-2 block">Κατάσταση</label>
                                <Tag :value="campaign.status" :severity="getStatusSeverity(campaign.status)" rounded />
                            </div>
                            <div class="field col">
                                <label class="font-medium mb-2 block">Influencer</label>
                                <div class="text-900">{{ campaign.influencer }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="font-medium mb-2 block">Κοινό-Στόχος</label>
                            <div class="flex flex-wrap gap-2">
                                <Tag v-for="audience in campaign.targetAudience" :key="audience" :value="audience" severity="warning" rounded />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog v-model:visible="deleteCampaignDialog" :style="{ width: '450px' }" header="Επιβεβαίωση" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="campaign">Είστε σίγουροι ότι θέλετε να διαγράψετε την καμπάνια <b>{{ campaign.name }}</b>;</span>
                    </div>
                    <template #footer>
                        <Button label="Όχι" icon="pi pi-times" text @click="deleteCampaignDialog = false" class="p-button-rounded" />
                        <Button label="Ναι" icon="pi pi-check" text @click="deleteCampaign" class="p-button-rounded" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCampaignsDialog" :style="{ width: '450px' }" header="Επιβεβαίωση" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Είστε σίγουροι ότι θέλετε να διαγράψετε τις επιλεγμένες καμπάνιες;</span>
                    </div>
                    <template #footer>
                        <Button label="Όχι" icon="pi pi-times" text @click="deleteCampaignsDialog = false" class="p-button-rounded" />
                        <Button label="Ναι" icon="pi pi-check" text @click="deleteSelectedCampaigns" class="p-button-rounded" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';

const toast = useToast();
const dt = ref(null);
const campaigns = ref([]);
const campaignDialog = ref(false);
const deleteCampaignDialog = ref(false);
const deleteCampaignsDialog = ref(false);
const viewDialog = ref(false);
const campaign = ref({});
const selectedCampaigns = ref(null);
const submitted = ref(false);
const loading = ref(true);
const quickFilter = ref(null);
const selectedCategory = ref(null);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const statuses = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'PENDING', value: 'PENDING' },
    { label: 'COMPLETED', value: 'COMPLETED' }
];

const categories = ref([
    { name: 'Ένδυση & Μόδα' },
    { name: 'Ομορφιά & Καλλυντικά' },
    { name: 'Τεχνολογία' },
    { name: 'Τρόφιμα & Ποτά' },
    { name: 'Υγεία & Ευεξία' },
    { name: 'Ταξίδια & Lifestyle' },
    { name: 'Αθλητικά Είδη' },
    { name: 'Παιδικά Προϊόντα' }
]);

const audiences = [
    'Άνδρες 18-24',
    'Άνδρες 25-34',
    'Γυναίκες 18-24',
    'Γυναίκες 25-34',
    'Επαγγελματίες',
    'Φοιτητές',
    'Γονείς',
    'Αθλητικοί Τύποι'
];

const getStatusSeverity = (status) => {
    switch (status) {
        case 'ACTIVE':
            return 'success';
        case 'PENDING':
            return 'warning';
        case 'COMPLETED':
            return 'info';
        default:
            return null;
    }
};

const getTagColor = (category) => {
    const colors = {
        'Αθλητικά Είδη': '#3B82F6', // μπλε
        'Ομορφιά & Καλλυντικά': '#EC4899', // ροζ
        'Τεχνολογία': '#6366F1', // μωβ
        'Ένδυση & Μόδα': '#F59E0B', // πορτοκαλί
        'Τρόφιμα & Ποτά': '#10B981' // πράσινο
    };
    return colors[category] || '#64748B'; // γκρι για άγνωστες κατηγορίες
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(value);
};

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const applyQuickFilter = (status) => {
    if (quickFilter.value === status) {
        quickFilter.value = null;
        filters.value.status.value = null;
    } else {
        quickFilter.value = status;
        filters.value.status.value = status;
    }
};

const onCategoryChange = () => {
    if (selectedCategory.value) {
        filters.value.category.value = selectedCategory.value.name;
    } else {
        filters.value.category.value = null;
    }
};

const openNew = () => {
    campaign.value = {
        name: '',
        description: '',
        budget: 0,
        category: null,
        targetAudience: [],
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0],
        requirements: ''
    };
    submitted.value = false;
    campaignDialog.value = true;
};

const hideDialog = () => {
    campaignDialog.value = false;
    submitted.value = false;
};

const saveCampaign = () => {
    submitted.value = true;

    if (campaign.value.name?.trim()) {
        if (campaign.value.id) {
            campaigns.value[findIndexById(campaign.value.id)] = campaign.value;
            toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Η καμπάνια ενημερώθηκε', life: 3000 });
        } else {
            campaign.value.id = createId();
            campaign.value.date = new Date().toISOString().split('T')[0];
            campaigns.value.push(campaign.value);
            toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Η καμπάνια δημιουργήθηκε', life: 3000 });
        }

        campaignDialog.value = false;
        campaign.value = {};
    }
};

const editCampaign = (editCampaign) => {
    campaign.value = { ...editCampaign };
    campaignDialog.value = true;
};

const confirmDeleteCampaign = (editCampaign) => {
    campaign.value = editCampaign;
    deleteCampaignDialog.value = true;
};

const deleteCampaign = () => {
    campaigns.value = campaigns.value.filter(val => val.id !== campaign.value.id);
    deleteCampaignDialog.value = false;
    campaign.value = {};
    toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Η καμπάνια διαγράφηκε', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < campaigns.value.length; i++) {
        if (campaigns.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const deleteSelectedCampaigns = () => {
    campaigns.value = campaigns.value.filter(val => !selectedCampaigns.value.includes(val));
    deleteCampaignsDialog.value = false;
    selectedCampaigns.value = null;
    toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Οι καμπάνιες διαγράφηκαν', life: 3000 });
};

const viewCampaign = (data) => {
    campaign.value = { ...data };
    viewDialog.value = true;
};

onMounted(() => {
    loading.value = true;
    // Simulate API call
    setTimeout(() => {
        campaigns.value = [
            {
                id: '1000',
                name: 'Nike Air Max Campaign',
                description: 'Προώθηση της νέας σειράς Nike Air Max με έμφαση στον urban lifestyle και την άνεση στην καθημερινότητα',
                image: '2j.jpg',
                budget: 2500,
                category: { name: 'Αθλητικά Είδη' },
                targetAudience: ['Άνδρες 18-24', 'Άνδρες 25-34', 'Αθλητικοί Τύποι'],
                campaignDuration: 30,
                status: 'ACTIVE',
                date: '2024-02-15',
                requirements: 'Απαιτείται δημιουργία 3 Instagram posts και 2 stories με το προϊόν',
                influencer: '2J'
            },
            {
                id: '1003',
                name: 'Sephora Beauty Collection',
                description: 'Παρουσίαση της νέας συλλογής καλλυντικών Sephora με έμφαση στο natural look',
                image: 'amiyammi.jpg',
                budget: 1800,
                category: { name: 'Ομορφιά & Καλλυντικά' },
                targetAudience: ['Γυναίκες 18-24', 'Γυναίκες 25-34'],
                campaignDuration: 15,
                status: 'PENDING',
                date: '2024-02-20',
                requirements: 'Makeup tutorial video και φωτογράφιση με τα προϊόντα',
                influencer: 'Amiyammi'
            },
            {
                id: '1004',
                name: 'Samsung Galaxy S24',
                description: 'Launch campaign για το νέο Samsung Galaxy S24 με έμφαση στις AI δυνατότητες',
                image: 'channels4_profile.jpg',
                budget: 3500,
                category: { name: 'Τεχνολογία' },
                targetAudience: ['Άνδρες 25-34', 'Επαγγελματίες'],
                campaignDuration: 45,
                status: 'ACTIVE',
                date: '2024-02-10',
                requirements: 'Unboxing video και review των AI features',
                influencer: 'Jeremy'
            },
            {
                id: '1006',
                name: 'Adidas Originals',
                description: 'Προώθηση της νέας streetwear collection με έμφαση στο urban style',
                image: 'fipster.jpg',
                budget: 2000,
                category: { name: 'Ένδυση & Μόδα' },
                targetAudience: ['Άνδρες 18-24', 'Γυναίκες 18-24'],
                campaignDuration: 20,
                status: 'COMPLETED',
                date: '2024-01-15',
                requirements: 'Street style φωτογράφιση και Instagram reels',
                influencer: 'Fipster'
            },
            {
                id: '1008',
                name: 'Kitchen Aid Mixer',
                description: 'Προώθηση του νέου μίξερ με έμφαση στις συνταγές για υγιεινή διατροφή',
                image: 'Mary_Synatsaki111.jpg',
                budget: 1500,
                category: { name: 'Τρόφιμα & Ποτά' },
                targetAudience: ['Γυναίκες 25-34', 'Γονείς'],
                campaignDuration: 25,
                status: 'ACTIVE',
                date: '2024-02-01',
                requirements: 'Δημιουργία 3 video με συνταγές χρησιμοποιώντας το προϊόν',
                influencer: 'Mary Synatsaki'
            },
            {
                id: '1009',
                name: 'JBL Headphones',
                description: 'Launch campaign για τα νέα JBL ακουστικά με noise cancellation',
                image: 'mikeus.jpg',
                budget: 2800,
                category: { name: 'Τεχνολογία' },
                targetAudience: ['Άνδρες 18-24', 'Φοιτητές'],
                campaignDuration: 30,
                status: 'PENDING',
                date: '2024-02-25',
                requirements: 'Review video και Instagram stories με focus στον ήχο',
                influencer: 'Mikeus'
            }
        ];
        loading.value = false;
    }, 1000);
});
</script>

<style lang="scss" scoped>
.card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-datatable) {
    .p-datatable-thead > tr > th {
        background: var(--surface-section);
        color: var(--text-color);
        border: none;
        font-weight: 600;
        padding: 1rem;
    }

    .p-datatable-tbody > tr {
        background: var(--surface-section);
        transition: background-color 0.2s;
        
        &:nth-child(even) {
            background: var(--surface-ground);
        }
        
        > td {
            border: none;
            padding: 1rem;
        }

        &:hover {
            background: var(--surface-hover);
        }
    }

    .p-paginator {
        background: transparent;
        border: none;
        padding: 1rem 0 0 0;
    }
}

:deep(.p-tag) {
    &.p-tag-rounded {
        border-radius: 2rem;
        padding: 0.3rem 0.8rem;
        font-weight: 500;
    }
}

:deep(.p-button) {
    &.p-button-sm {
        padding: 0.5rem;
        
        .p-button-icon {
            font-size: 0.875rem;
            color: #ffffff;
        }
    }
    
    &.p-button-rounded {
        border-radius: 2rem;
    }
    
    &.p-button-success {
        background: #10B981;
        border-color: #10B981;
        
        &:enabled:hover {
            background: #059669;
            border-color: #059669;
        }
    }

    &.p-button-warning {
        background: #F59E0B;
        border-color: #F59E0B;
        
        &:enabled:hover {
            background: #D97706;
            border-color: #D97706;
        }
    }

    &.p-button-info {
        background: #3B82F6;
        border-color: #3B82F6;
        
        &:enabled:hover {
            background: #2563EB;
            border-color: #2563EB;
        }
    }

    &.p-button-danger {
        background: #EF4444;
        border-color: #EF4444;
        
        &:enabled:hover {
            background: #DC2626;
            border-color: #DC2626;
        }
    }

    &.p-button-outlined:not(.p-button-plain) {
        &.p-button-success {
            color: #10B981;
            border-color: #10B981;
            
            &:hover {
                background: rgba(16, 185, 129, 0.04);
                color: #059669;
                border-color: #059669;
            }
        }

        &.p-button-warning {
            color: #F59E0B;
            border-color: #F59E0B;
            
            &:hover {
                background: rgba(245, 158, 11, 0.04);
                color: #D97706;
                border-color: #D97706;
            }
        }

        &.p-button-info {
            color: #3B82F6;
            border-color: #3B82F6;
            
            &:hover {
                background: rgba(59, 130, 246, 0.04);
                color: #2563EB;
                border-color: #2563EB;
            }
        }

        &.p-button-danger {
            color: #EF4444;
            border-color: #EF4444;
            
            &:hover {
                background: rgba(239, 68, 68, 0.04);
                color: #DC2626;
                border-color: #DC2626;
            }
        }
    }
}

:deep(.p-dialog) {
    .p-dialog-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background: var(--surface-card);
    }

    .p-dialog-content {
        padding: 2rem;
        background: var(--surface-card);
    }

    .p-dialog-footer {
        padding: 1.5rem;
        background: var(--surface-card);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

:deep(.p-dropdown), :deep(.p-multiselect), :deep(.p-inputtext), :deep(.p-inputnumber-input) {
    border-radius: 2rem !important;
    
    &:enabled:focus {
        border-color: #3B82F6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
}

:deep(.p-inputtext), :deep(.p-dropdown-label), :deep(.p-multiselect-label) {
    padding: 0.5rem 1rem;
}

:deep(.status-filter) {
    &.status-active {
        background-color: #34D399 !important;
        border-color: #34D399 !important;
        color: #ffffff !important;
        
        &.p-button-outlined {
            background-color: transparent !important;
            color: #34D399 !important;
            
            &:hover {
                background-color: rgba(52, 211, 153, 0.04) !important;
            }
        }
        
        &:not(.p-button-outlined):hover {
            background-color: #10B981 !important;
            border-color: #10B981 !important;
        }
    }
    
    &.status-pending {
        background-color: #FBBF24 !important;
        border-color: #FBBF24 !important;
        color: #ffffff !important;
        
        &.p-button-outlined {
            background-color: transparent !important;
            color: #FBBF24 !important;
            
            &:hover {
                background-color: rgba(251, 191, 36, 0.04) !important;
            }
        }
        
        &:not(.p-button-outlined):hover {
            background-color: #F59E0B !important;
            border-color: #F59E0B !important;
        }
    }
    
    &.status-completed {
        background-color: #60A5FA !important;
        border-color: #60A5FA !important;
        color: #ffffff !important;
        
        &.p-button-outlined {
            background-color: transparent !important;
            color: #60A5FA !important;
            
            &:hover {
                background-color: rgba(96, 165, 250, 0.04) !important;
            }
        }
        
        &:not(.p-button-outlined):hover {
            background-color: #3B82F6 !important;
            border-color: #3B82F6 !important;
        }
    }
}
</style>