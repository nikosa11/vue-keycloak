<template>
    <div class="grid">
        <!-- ROI Overview Cards -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Συνολικό Κόστος</span>
                        <div class="text-900 font-medium text-xl">{{ formatCurrency(totals.totalCost) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-wallet text-cyan-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Έσοδα</span>
                        <div class="text-900 font-medium text-xl">{{ formatCurrency(totals.totalRevenue) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-line text-orange-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">ROI</span>
                        <div class="text-900 font-medium text-xl">{{ totals.totalROI }}%</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-percentage text-green-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Καμπάνιες</span>
                        <div class="text-900 font-medium text-xl">{{ totals.activeCampaigns }} Ενεργές</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-briefcase text-purple-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>ROI Καμπανιών</h5>
                <Chart type="bar" :data="roiChartData" :options="roiOptions" class="h-20rem" />
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Κατανομή Κόστους</h5>
                <Chart type="doughnut" :data="costChartData" :options="costBreakdownOptions" class="h-20rem" />
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Ιστορικό Καμπανιών</h5>
                <DataTable
                    :value="campaignHistory"
                    v-model:selection="selectedCampaigns"
                    :paginator="true"
                    :rows="5"
                    dataKey="id"
                    :filters="filters"
                    filterDisplay="menu"
                    responsiveLayout="scroll"
                    class="p-datatable-sm"
                    :rowHover="true"
                    stripedRows
                >
                    <template #header>
                        <div class="flex justify-content-between align-items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" @click="clearFilter()" />
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Αναζήτηση..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Καμπάνια" sortable></Column>
                    <Column field="category.name" header="Κατηγορία" sortable></Column>
                    <Column field="totalCost" header="Συνολικό Κόστος" sortable>
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.totalCost) }}
                        </template>
                    </Column>
                    <Column field="roi" header="ROI" sortable>
                        <template #body="slotProps">
                            <span :class="'roi-badge status-' + getRoiStatus(slotProps.data.roi)">
                                {{ slotProps.data.roi }}%
                            </span>
                        </template>
                    </Column>
                    <Column field="date" header="Ημερομηνία" sortable></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';

// Initialize chart.js
import('chart.js/auto');

// Κατηγορίες καμπανιών
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

// Campaign data
const campaignData = ref({
    name: '',
    category: null,
    influencerCost: 0,
    productionCost: 0,
    adSpend: 0
});

// Initial campaign data
const initialCampaigns = [
    {
        id: '1000',
        name: 'Nike Air Max Campaign',
        description: 'Προώθηση της νέας σειράς Nike Air Max με έμφαση στον urban lifestyle και την άνεση στην καθημερινότητα',
        image: '2j.jpg',
        totalCost: 2500,
        category: { name: 'Αθλητικά Είδη' },
        targetAudience: ['Άνδρες 18-24', 'Άνδρες 25-34', 'Αθλητικοί Τύποι'],
        campaignDuration: 30,
        status: 'ACTIVE',
        date: '2024-02-15',
        requirements: 'Απαιτείται δημιουργία 3 Instagram posts και 2 stories με το προϊόν',
        influencer: '2J',
        revenue: 7500,
        roi: 200
    },
    {
        id: '1003',
        name: 'Sephora Beauty Collection',
        description: 'Παρουσίαση της νέας συλλογής καλλυντικών Sephora με έμφαση στο natural look',
        image: 'amiyammi.jpg',
        totalCost: 1800,
        category: { name: 'Ομορφιά & Καλλυντικά' },
        targetAudience: ['Γυναίκες 18-24', 'Γυναίκες 25-34'],
        campaignDuration: 15,
        status: 'PENDING',
        date: '2024-02-20',
        requirements: 'Makeup tutorial video και φωτογράφιση με τα προϊόντα',
        influencer: 'Amiyammi',
        revenue: 4500,
        roi: 150
    },
    {
        id: '1004',
        name: 'Samsung Galaxy S24',
        description: 'Launch campaign για το νέο Samsung Galaxy S24 με έμφαση στις AI δυνατότητες',
        image: 'channels4_profile.jpg',
        totalCost: 3500,
        category: { name: 'Τεχνολογία' },
        targetAudience: ['Άνδρες 25-34', 'Επαγγελματίες'],
        campaignDuration: 45,
        status: 'ACTIVE',
        date: '2024-02-10',
        requirements: 'Unboxing video και review των AI features',
        influencer: 'Jeremy',
        revenue: 10500,
        roi: 200
    },
    {
        id: '1006',
        name: 'Adidas Originals',
        description: 'Προώθηση της νέας streetwear collection με έμφαση στο urban style',
        image: 'fipster.jpg',
        totalCost: 2000,
        category: { name: 'Ένδυση & Μόδα' },
        targetAudience: ['Άνδρες 18-24', 'Γυναίκες 18-24'],
        campaignDuration: 20,
        status: 'COMPLETED',
        date: '2024-01-15',
        requirements: 'Street style φωτογράφιση και Instagram reels',
        influencer: 'Fipster',
        revenue: 6000,
        roi: 200
    },
    {
        id: '1008',
        name: 'Kitchen Aid Mixer',
        description: 'Προώθηση του νέου μίξερ με έμφαση στις συνταγές για υγιεινή διατροφή',
        image: 'Mary_Synatsaki111.jpg',
        totalCost: 1500,
        category: { name: 'Τρόφιμα & Ποτά' },
        targetAudience: ['Γυναίκες 25-34', 'Γονείς'],
        campaignDuration: 25,
        status: 'ACTIVE',
        date: '2024-02-01',
        requirements: 'Δημιουργία 3 video με συνταγές χρησιμοποιώντας το προϊόν',
        influencer: 'Mary Synatsaki',
        revenue: 3750,
        roi: 150
    },
    {
        id: '1009',
        name: 'JBL Headphones',
        description: 'Launch campaign για τα νέα JBL ακουστικά με noise cancellation',
        image: 'mikeus.jpg',
        totalCost: 2800,
        category: { name: 'Τεχνολογία' },
        targetAudience: ['Άνδρες 18-24', 'Φοιτητές'],
        campaignDuration: 30,
        status: 'PENDING',
        date: '2024-02-25',
        requirements: 'Review video και Instagram stories με focus στον ήχο',
        influencer: 'Mikeus',
        revenue: 7000,
        roi: 150
    }
];

const campaignHistory = ref(initialCampaigns);
const selectedCampaigns = ref([]);
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Computed properties for totals
const totals = computed(() => {
    const total = campaignHistory.value.reduce((acc, campaign) => {
        acc.totalCost += campaign.totalCost;
        acc.totalRevenue += campaign.revenue;
        if (campaign.status === 'ACTIVE') acc.activeCampaigns++;
        return acc;
    }, { totalCost: 0, totalRevenue: 0, activeCampaigns: 0 });

    return {
        ...total,
        totalROI: Math.round(((total.totalRevenue - total.totalCost) / total.totalCost) * 100)
    };
});

// Chart data
const roiChartData = computed(() => ({
    labels: campaignHistory.value.map(c => c.name),
    datasets: [{
        label: 'ROI %',
        data: campaignHistory.value.map(c => c.roi),
        backgroundColor: ['#00D0DE', '#0EA5E9', '#22C55E', '#EC4899', '#8B5CF6'],
        borderColor: ['#00D0DE', '#0EA5E9', '#22C55E', '#EC4899', '#8B5CF6'],
        borderWidth: 1
    }]
}));

const costChartData = computed(() => {
    const totalInfluencerCost = campaignHistory.value.reduce((sum, c) => sum + (c.totalCost * 0.6), 0);
    const totalProductionCost = campaignHistory.value.reduce((sum, c) => sum + (c.totalCost * 0.25), 0);
    const totalAdSpend = campaignHistory.value.reduce((sum, c) => sum + (c.totalCost * 0.15), 0);

    return {
        labels: ['Influencer', 'Παραγωγή', 'Διαφήμιση'],
        datasets: [{
            data: [totalInfluencerCost, totalProductionCost, totalAdSpend],
            backgroundColor: ['#00D0DE', '#0EA5E9', '#22C55E']
        }]
    };
});

// Chart options
const roiOptions = ref({
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            }
        }
    }
});

const costBreakdownOptions = ref({
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
});

// Helper functions
const formatCurrency = (value) => {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(value);
};

const getRoiStatus = (roi) => {
    if (roi >= 200) return 'success';
    if (roi >= 150) return 'warning';
    return 'danger';
};

const clearFilter = () => {
    filters.value = {
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const saveCampaignCost = () => {
    const newCampaign = {
        id: (campaignHistory.value.length + 1).toString(),
        name: campaignData.value.name,
        category: campaignData.value.category,
        totalCost: campaignData.value.influencerCost + campaignData.value.productionCost + campaignData.value.adSpend,
        revenue: 0,
        roi: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
    };
    
    campaignHistory.value = [newCampaign, ...campaignHistory.value];
    
    campaignData.value = {
        name: '',
        category: null,
        influencerCost: 0,
        productionCost: 0,
        adSpend: 0
    };
};
</script>

<style lang="scss" scoped>
.roi-badge {
    border-radius: 2rem;
    padding: 0.25rem 0.5rem;
    font-weight: 700;
    font-size: 0.75rem;

    &.status-success {
        background: #DCFCE7;
        color: #16A34A;
    }

    &.status-warning {
        background: #FEF9C3;
        color: #CA8A04;
    }

    &.status-danger {
        background: #FEE2E2;
        color: #DC2626;
    }
}

.card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: var(--card-shadow);

    &:last-child {
        margin-bottom: 0;
    }
}

:deep(.p-datatable) {
    .p-datatable-header {
        background: transparent;
        border: none;
        padding: 0;
    }

    .p-datatable-thead > tr > th {
        background: var(--surface-section);
        color: var(--text-color);
        border: none;
        font-weight: 600;
    }

    .p-datatable-tbody > tr {
        background: var(--surface-section);
        
        &:nth-child(even) {
            background: var(--surface-ground);
        }
        
        > td {
            border: none;
            padding: 1rem;
        }
    }

    .p-paginator {
        background: transparent;
        border: none;
        padding: 1rem 0 0 0;
    }
}
</style>
