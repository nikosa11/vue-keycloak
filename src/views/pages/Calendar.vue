<template>
    <div class="card">
        <div class="flex flex-column md:flex-row justify-content-between gap-3 mb-3">
            <div class="flex align-items-center gap-2">
                <Button
                    icon="pi pi-arrow-left"
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

        <FullCalendar :options="calendarOptions" />

        <!-- Dialog για δημιουργία/επεξεργασία event -->
        <Dialog v-model:visible="eventDialog" :style="{ width: '450px' }" header="Λεπτομέρειες Event" :modal="true" class="p-fluid">
            <div class="field">
                <label for="title">Τίτλος</label>
                <InputText id="title" v-model="event.title" required autofocus class="rounded-input" />
            </div>
            <div class="field">
                <label for="start">Έναρξη</label>
                <Calendar id="start" v-model="event.start" showTime class="rounded-input" />
            </div>
            <div class="field">
                <label for="end">Λήξη</label>
                <Calendar id="end" v-model="event.end" showTime class="rounded-input" />
            </div>
            <div class="field">
                <label for="description">Περιγραφή</label>
                <Textarea id="description" v-model="event.description" rows="3" class="rounded-input" />
            </div>
            <div class="field">
                <label for="location">Τοποθεσία</label>
                <InputText id="location" v-model="event.location" class="rounded-input" />
            </div>
            <div class="field-checkbox">
                <Checkbox id="allDay" v-model="event.allDay" :binary="true" />
                <label for="allDay" class="ml-2">Ολοήμερο</label>
            </div>
            <template #footer>
                <div class="flex justify-content-between">
                    <Button 
                        v-if="!isNewEvent" 
                        label="Διαγραφή" 
                        icon="pi pi-trash" 
                        severity="danger" 
                        text 
                        rounded 
                        @click="deleteEventDialog = true" />
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

        <!-- Dialog για διαγραφή event -->
        <Dialog v-model:visible="deleteEventDialog" :style="{ width: '450px' }" header="Διαγραφή Event" :modal="true" class="p-fluid">
            <div class="field">
                <p>Είσαι σίγουρος ότι θέλεις να διαγράψεις το event {{ selectedEvent?.title }};</p>
            </div>
            <template #footer>
                <div class="flex justify-content-between">
                    <Button label="Ακύρωση" 
                            icon="pi pi-times" 
                            text 
                            rounded 
                            @click="hideDeleteEventDialog" 
                            class="mr-2" />
                    <Button label="Διαγραφή" 
                            icon="pi pi-trash" 
                            severity="danger" 
                            rounded 
                            @click="deleteEvent" />
                </div>
            </template>
        </Dialog>

        <!-- Sidebar για φίλτρα -->
        <Sidebar v-model:visible="filterSidebar" position="right" :baseZIndex="1000" class="p-sidebar-sm">
            <h3>Φίλτρα Ημερολογίου</h3>
            <div class="field-checkbox" v-for="category in categories" :key="category.id">
                <Checkbox :id="category.id" v-model="category.checked" :binary="true" />
                <label :for="category.id" class="ml-2">{{ category.name }}</label>
            </div>
        </Sidebar>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import calendarService from '@/service/CalendarService';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import elLocale from '@fullcalendar/core/locales/el';

const router = useRouter();
const toast = useToast();
const events = ref([]);
const eventDialog = ref(false);
const deleteEventDialog = ref(false);
const event = ref({
    title: '',
    start: '',
    end: '',
    allDay: false,
    location: '',
    description: ''
});
const selectedEvent = ref(null);
const filterSidebar = ref(false);

// Add categories data
const categories = ref([
    { id: 'campaigns', name: 'Καμπάνιες', checked: true },
    { id: 'meetings', name: 'Συναντήσεις', checked: true },
    { id: 'photoshoots', name: 'Φωτογραφίσεις', checked: true }
]);

const calendarOptions = ref({
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
    eventClick: (e) => {
        const clickedEvent = e.event;
        selectedEvent.value = {
            id: clickedEvent.id,
            title: clickedEvent.title,
            start: clickedEvent.start,
            end: clickedEvent.end,
            allDay: clickedEvent.allDay,
            location: clickedEvent.extendedProps.location,
            description: clickedEvent.extendedProps.description
        };
        eventDialog.value = true;
        isNewEvent.value = false;
    },
    locale: elLocale,
    events: events
});
const isNewEvent = ref(true);

const loadEvents = async () => {
    try {
        console.log("AAAAAAAAAAA");
        const response = await calendarService.getEvents();
        events.value = response.data;
    } catch (error) {
        console.error('Error loading events:', error);
    }
};

const saveEvent = async () => {
    try {
        if (isNewEvent.value) {
            await calendarService.createEvent(event.value);
            toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Το event δημιουργήθηκε', life: 3000 });
        } else {
            await calendarService.updateEvent(selectedEvent.value.id, event.value);
            toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Το event ενημερώθηκε', life: 3000 });
        }
        eventDialog.value = false;
        await loadEvents();
    } catch (error) {
        console.error('Error saving event:', error);
        toast.add({ severity: 'error', summary: 'Σφάλμα', detail: 'Υπήρξε πρόβλημα με την αποθήκευση', life: 3000 });
    }
};

const deleteEvent = async () => {
    try {
        await calendarService.deleteEvent(selectedEvent.value.id);
        deleteEventDialog.value = false;
        eventDialog.value = false;
        toast.add({ severity: 'success', summary: 'Επιτυχία', detail: 'Το event διαγράφηκε', life: 3000 });
        await loadEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        toast.add({ severity: 'error', summary: 'Σφάλμα', detail: 'Υπήρξε πρόβλημα με την διαγραφή', life: 3000 });
    }
};

const openNewEventDialog = () => {
    event.value = {
        title: '',
        start: '',
        end: '',
        allDay: false,
        location: '',
        description: ''
    };
    eventDialog.value = true;
    isNewEvent.value = true;
};

const hideEventDialog = () => {
    eventDialog.value = false;
};

const hideDeleteEventDialog = () => {
    deleteEventDialog.value = false;
};

const toggleFilterSidebar = () => {
    filterSidebar.value = !filterSidebar.value;
};

const goHome = () => {
    router.push('/');
};

onMounted(() => {
    console.log("Calendar mounted");
    loadEvents();
});
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