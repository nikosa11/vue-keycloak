<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h2 class="">Νέο τοπίο μετά την αμυντική βοήθεια των ΗΠΑ σε Ουκρανία, Ισραήλ και Ταϊβάν - Απειλές από τη Μόσχα</h2>
                <img class="itemInner" src="https://i1.prth.gr/images/1168x656/_webp/files/2024-04-20/ukraine-war-m.jpg"/>
                <div class="text">
                    Νέα δεδομένα σε πολιτικό, διπλωματικό και κυρίως στρατιωτικό επίπεδο δημιουργεί η απόφαση της Βουλής των Αντιπροσώπων των ΗΠΑ να εγκρίνει - μετά από μήνες διαφωνιών-<a href="https://www.protothema.gr/world/article/1489877/ipa-i-vouli-ton-adiprosopon-enekrine-meta-apo-mines-diafonion-to-paketo-voitheias-se-oukrania-kai-israil/" target="_blank" rel="noopener noreferrer"> στρατιωτική βοήθεια «μαμούθ» ύψους 95 δισεκατομμυρίων δολαρίων</a>&nbsp;στην Ουκρανία, το Ισραήλ και την Ταϊβάν.<br>
                     <br> Τη μερίδα του λέοντος, 61 δισ. δολάρια, θα λάβει η Ουκρανία για την <strong>αναπλήρωση των αμερικανικών πυρομαχικών και την αγορά νέων οπλικών συστημάτων</strong> γεγονός το οποίο προκαλεί ήδη την έντονη αντίδραση των Ρώσων αλλά και την ανακούφιση των Ευρωπαίων. Η απόφαση των Αμερικανών βουλευτών προκάλεσε όπως ήταν φυσικό ικανοποίηση στο Κίεβο με τον&nbsp;Ουκρανό πρόεδρο <strong>Βολοντίμιρ Ζελένσκι</strong> να εκφράζει την ευγνωμοσύνη του για τη ψήφιση του νομοσχεδίου και τη χείρα βοηθείας των ΗΠΑ&nbsp; στον πόλεμο της κατά της Ρωσίας.<br>
                     <br>
                </div>
            </div>
        </div>
        <Toast />
    </div>
</template>
<style scoped>
/* Προσαρμόστε τον CSS σύμφωνα με τις ανάγκες σας */


.center {
    text-align: center;

}
.itemInner {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.text {
    margin-top: 20px;
    font-family: cfastystd,Arial,sans-serif;
    font-size: 1.2857142857rem;
    font-weight: 400;
    line-height: 1.4444444444;
}

</style>