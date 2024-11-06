<template>
    <Dialog v-model:visible="visible" header="Μεταφόρτωση Αρχείου" :modal="true">
        <FileUpload
            mode="basic"
            name="file"
            :url="`/api/chats/${chatId}/files`"
            accept="image/*,application/pdf"
            :maxFileSize="5000000"
            @upload="onUpload"
            :auto="true"
            chooseLabel="Επιλογή Αρχείου"
        />
    </Dialog>
</template>

<script>
export default {
    props: {
        chatId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = true;
        },
        onUpload(event) {
            this.$emit('file-uploaded', event.files[0]);
            this.visible = false;
        }
    }
}
</script> 