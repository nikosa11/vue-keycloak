<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Campaigns</h5>
                <div class="flex justify-content-between mb-3">
                    <Button label="Create Campaign" icon="pi pi-plus" @click="navigateToCreate" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters.global.value" placeholder="Search..." />
                    </span>
                </div>

                <DataTable
                    :value="campaigns"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    dataKey="id"
                    :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} campaigns"
                    responsiveLayout="scroll"
                >
                    <Column field="name" header="Campaign Name" sortable>
                        <template #body="slotProps">
                            <router-link :to="'/campaigns/edit/' + slotProps.data.id" class="text-primary">
                                {{ slotProps.data.name }}
                            </router-link>
                        </template>
                    </Column>
                    <Column field="status" header="Status" sortable>
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column field="startDate" header="Start Date" sortable>
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.startDate) }}
                        </template>
                    </Column>
                    <Column field="budget" header="Budget" sortable>
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.budget) }}
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCampaign(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteCampaign(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            campaigns: [
                // Mock data for development
                {
                    id: 1,
                    name: 'Summer Collection Launch',
                    status: 'active',
                    startDate: '2024-01-15',
                    budget: 5000
                },
                {
                    id: 2,
                    name: 'Holiday Special',
                    status: 'draft',
                    startDate: '2024-02-01',
                    budget: 3000
                }
            ],
            loading: false,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
        };
    },
    methods: {
        navigateToCreate() {
            this.$router.push('/campaigns/create');
        },
        editCampaign(campaign) {
            this.$router.push(`/campaigns/edit/${campaign.id}`);
        },
        confirmDeleteCampaign(campaign) {
            // Implement delete confirmation logic
            if (confirm('Are you sure you want to delete this campaign?')) {
                this.deleteCampaign(campaign);
            }
        },
        deleteCampaign(campaign) {
            // Implement delete logic
            this.campaigns = this.campaigns.filter(c => c.id !== campaign.id);
        },
        getStatusSeverity(status) {
            const severities = {
                'active': 'success',
                'draft': 'warning',
                'completed': 'info',
                'cancelled': 'danger'
            };
            return severities[status] || 'info';
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        }
    }
};
</script>
