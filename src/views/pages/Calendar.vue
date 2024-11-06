<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <div class="flex align-items-center gap-2">
                        <Button 
                            icon="pi pi-home" 
                            rounded 
                            outlined
                            tooltip="Επιστροφή στην αρχική"
                            :tooltipOptions="{ position: 'bottom' }"
                            @click="goHome"
                        />
                        <h5 class="m-0">Ημερολόγιο</h5>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <Button icon="pi pi-plus" label="Νέο Event" @click="openNewEventDialog" severity="success" rounded />
                        <Button icon="pi pi-filter" label="Φίλτρα" @click="toggleFilterSidebar" text rounded />
                    </div>
                </div>

                <FullCalendar 
                    ref="fullCalendar"
                    :options="calendarOptions"
                    class="p-fluid"
                />
            </div>
        </div>

        <!-- Dialog για νέο event -->
        <Dialog v-model:visible="eventDialog" :style="{ width: '450px' }" :header="isNewEvent ? 'Νέο Event' : 'Επεξεργασία Event'" :modal="true" class="p-fluid">
            <div class="field">
                <label for="title">Τίτλος</label>
                <InputText id="title" v-model="event.title" required autofocus class="rounded-input" />
            </div>
            <div class="field">
                <label for="start">Έναρξη</label>
                <Calendar id="start" v-model="event.start" :showTime="true" class="rounded-input" />
            </div>
            <div class="field">
                <label for="end">Λήξη</label>
                <Calendar id="end" v-model="event.end" :showTime="true" class="rounded-input" />
            </div>
            <div class="field">
                <label for="description">Περιγραφή</label>
                <Textarea id="description" v-model="event.description" rows="3" class="rounded-input" />
            </div>
            <div class="field">
                <label for="color">Χρώμα</label>
                <Dropdown id="color" v-model="event.color" :options="colors" optionLabel="name" optionValue="value" class="rounded-input" />
            </div>
            <div class="field-checkbox">
                <Checkbox id="allDay" v-model="event.allDay" :binary="true" />
                <label for="allDay" class="ml-2">Ολοήμερο</label>
            </div>
            <template #footer>
                <div class="flex justify-content-between">
                    <Button v-if="!isNewEvent" 
                            label="Διαγραφή" 
                            icon="pi pi-trash" 
                            severity="danger" 
                            text 
                            rounded 
                            @click="deleteEvent" />
                    <div>
                        <Button label="Ακύρωση" 
                                icon="pi pi-times" 
                                text 
                                rounded 
                                @click="hideEventDialog" 
                                class="mr-2" />
                        <Button label="Αποθήκευση" 
                                icon="pi pi-check" 
                                severity="success" 
                                rounded 
                                @click="saveEvent" />
                    </div>
                </div>
            </template>
        </Dialog>

        <!-- Sidebar για φίλτρα -->
        <Sidebar v-model:visible="filterSidebarVisible" position="right" :baseZIndex="1000" class="p-sidebar-sm">
            <h3>Φίλτρα Ημερολογίου</h3>
            <div class="field-checkbox" v-for="category in categories" :key="category.id">
                <Checkbox :id="category.id" v-model="category.checked" :binary="true" />
                <label :for="category.id" class="ml-2">{{ category.name }}</label>
            </div>
        </Sidebar>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import elLocale from '@fullcalendar/core/locales/el';
import { useRouter } from 'vue-router';

export default {
    components: {
        FullCalendar
    },
    setup() {
        const router = useRouter();

        const events = ref([
            {
                id: '1',
                title: 'Καμπάνια Nike',
                start: '2024-02-20T10:00:00',
                end: '2024-02-20T12:00:00',
                color: '#FF9800',
                description: 'Φωτογράφιση για τη νέα συλλογή αθλητικών'
            },
            {
                id: '2',
                title: 'Φωτογράφιση Sephora',
                start: '2024-02-22',
                allDay: true,
                color: '#4CAF50',
                description: 'Beauty campaign για την άνοιξη'
            },
            {
                id: '3',
                title: 'Meeting με Adidas',
                start: '2024-02-15T14:00:00',
                end: '2024-02-15T15:30:00',
                color: '#2196F3',
                description: 'Συζήτηση για νέα συνεργασία'
            },
            {
                id: '4',
                title: 'Instagram Live',
                start: '2024-02-18T18:00:00',
                end: '2024-02-18T19:00:00',
                color: '#E91E63',
                description: 'Q&A με followers'
            },
            {
                id: '5',
                title: 'YouTube Video Shooting',
                start: '2024-02-25T11:00:00',
                end: '2024-02-25T16:00:00',
                color: '#F44336',
                description: 'Unboxing νέων προϊόντων'
            },
            {
                id: '6',
                title: 'Podcast Recording',
                start: '2024-02-28T13:00:00',
                end: '2024-02-28T14:30:00',
                color: '#9C27B0',
                description: 'Συνέντευξη για το Fashion Weekly'
            }
        ]);

        const colors = [
            { name: 'Μπλε', value: '#2196F3' },
            { name: 'Πράσινο', value: '#4CAF50' },
            { name: 'Πορτοκαλί', value: '#FF9800' },
            { name: 'Κόκκινο', value: '#F44336' },
            { name: 'Ροζ', value: '#E91E63' },
            { name: 'Μωβ', value: '#9C27B0' }
        ];

        const categories = ref([
            { id: 'campaigns', name: 'Καμπάνιες', checked: true },
            { id: 'meetings', name: 'Συναντήσεις', checked: true },
            { id: 'photoshoots', name: 'Φωτογραφίσεις', checked: true }
        ]);

        const calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            weekends: true,
            locale: elLocale,
            events: events.value,
            select: (selectInfo) => {
                openNewEventDialog(selectInfo);
            },
            eventClick: (info) => {
                editEvent(info.event);
            }
        };

        const eventDialog = ref(false);
        const filterSidebarVisible = ref(false);
        const event = ref({
            id: '',
            title: '',
            start: null,
            end: null,
            description: '',
            color: '#2196F3',
            allDay: false
        });
        const isNewEvent = ref(true);

        const openNewEventDialog = (selectInfo = null) => {
            isNewEvent.value = true;
            event.value = {
                id: '',
                title: '',
                start: selectInfo ? selectInfo.start : null,
                end: selectInfo ? selectInfo.end : null,
                description: '',
                color: '#2196F3',
                allDay: selectInfo ? selectInfo.allDay : false
            };
            eventDialog.value = true;
        };

        const editEvent = (eventData) => {
            isNewEvent.value = false;
            event.value = {
                id: eventData.id,
                title: eventData.title,
                start: eventData.start,
                end: eventData.end || eventData.start,
                description: eventData.extendedProps?.description || '',
                color: eventData.backgroundColor,
                allDay: eventData.allDay
            };
            eventDialog.value = true;
        };

        const hideEventDialog = () => {
            eventDialog.value = false;
            event.value = {
                id: '',
                title: '',
                start: null,
                end: null,
                description: '',
                color: '#2196F3',
                allDay: false
            };
        };

        const saveEvent = () => {
            if (event.value.title.trim()) {
                if (isNewEvent.value) {
                    // Προσθήκη νέου event
                    events.value.push({
                        id: Date.now().toString(),
                        ...event.value
                    });
                } else {
                    // Ενημέρωση υπάρχοντος event
                    const index = events.value.findIndex(e => e.id === event.value.id);
                    if (index !== -1) {
                        events.value[index] = { ...event.value };
                    }
                }
                eventDialog.value = false;
            }
        };

        const deleteEvent = () => {
            if (!isNewEvent.value) {
                events.value = events.value.filter(e => e.id !== event.value.id);
                eventDialog.value = false;
            }
        };

        const toggleFilterSidebar = () => {
            filterSidebarVisible.value = !filterSidebarVisible.value;
        };

        const goHome = () => {
            router.push('/');
        };

        return {
            calendarOptions,
            eventDialog,
            filterSidebarVisible,
            event,
            colors,
            categories,
            isNewEvent,
            openNewEventDialog,
            editEvent,
            hideEventDialog,
            saveEvent,
            deleteEvent,
            toggleFilterSidebar,
            goHome
        };
    }
};
</script>

<style lang="scss" scoped>
:deep(.fc) {
    .fc-toolbar {
        flex-wrap: wrap;
        gap: 1rem;
    }

    .fc-toolbar-title {
        font-size: 1.25rem;
    }

    .fc-button {
        background: var(--primary-color);
        border: 1px solid var(--primary-color);
        border-radius: 2rem !important;
        
        &:disabled {
            opacity: 0.6;
        }
        
        &:hover {
            background: var(--primary-600);
            border-color: var(--primary-600);
        }
        
        &.fc-button-active {
            background: var(--primary-700);
            border-color: var(--primary-700);
        }
    }

    .fc-event {
        border-radius: 1rem;
        padding: 0.2rem 0.5rem;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.02);
        }
    }
}

.rounded-input {
    border-radius: 2rem !important;
}

.field-checkbox {
    margin-bottom: 1rem;
    
    label {
        margin-left: 0.5rem;
    }
}

:deep(.p-button) {
    border-radius: 2rem;
}

:deep(.p-dialog) {
    border-radius: 1rem;
    
    .p-dialog-header {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
    
    .p-dialog-content {
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }
}

:deep(.p-sidebar) {
    border-radius: 1rem 0 0 1rem;
}

:deep(.p-button.p-button-outlined) {
    &:hover {
        background: var(--primary-50);
    }
}
</style>