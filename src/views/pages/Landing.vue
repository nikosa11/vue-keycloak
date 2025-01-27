<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { layoutConfig } = useLayout();

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const pushing = (id) => {
    console.log('testttt');
    router.push(id);
};

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

// Random avatar images from picsum
const avatar1 = 'https://picsum.photos/200?random=1';
const avatar2 = 'https://picsum.photos/200?random=2';
const avatar3 = 'https://picsum.photos/200?random=3';
</script>

<template>
    <div class="surface-0 flex justify-content-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
                <a class="flex align-items-center" href="#">
                    <img :src="logoUrl" alt="Influencers Logo" height="50" class="mr-0 lg:mr-2" />
                    <span class="text-900 font-medium text-2xl line-height-3 mr-8">INFLUENCERS</span>
                </a>
                <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
                    <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                        <li>
                            <a @click="smoothScroll('#hero')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#features')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Features</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#highlights')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Highlights</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#pricing')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Pricing</span>
                            </a>
                        </li>
                    </ul>
                    <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Button label="Login" @click="pushing('/auth/login')" class="p-button-text p-button-rounded border-none font-light line-height-2 text-blue-500"></Button>
                        <Button label="Register" @click="pushing('/register')" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
                    </div>
                </div>
            </div>

            <div
                id="hero"
                class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
            >
                <div class="mx-4 md:mx-8 mt-0 md:mt-4">
                    <h1 class="text-6xl font-bold text-gray-900 line-height-2">
                        <span class="font-light block">Το #1 Εργαλείο για</span>
                        Influencer Marketing
                    </h1>
                    <p class="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">
                        Απλοποιήστε τις influencer καμπάνιες σας με την πιο ολοκληρωμένη πλατφόρμα διαχείρισης στην Ελλάδα
                    </p>
                    <Button label="Ξεκινήστε Τώρα" class="p-button-rounded text-xl border-none mt-5 bg-blue-500 font-normal text-white line-height-3 px-3"></Button>
                </div>
                <div class="flex justify-content-center md:justify-content-end">
                    <img src="/demo/images/landing/screen-1.png" alt="Hero Image" class="w-9 md:w-auto" style="border-radius: 12px;" />
                </div>
            </div>

            <div id="features" class="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                <div class="grid justify-content-center">
                    <div class="col-12 text-center mt-8 mb-4">
                        <h2 class="text-900 font-normal mb-2">Ισχυρά Εργαλεία για το Brand σας</h2>
                        <span class="text-600 text-2xl">Όλα όσα χρειάζεστε για επιτυχημένες influencer καμπάνιες</span>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-yellow-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-users text-2xl text-yellow-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Εύρεση Influencers</h5>
                                <span class="text-600">Ανακαλύψτε τους κατάλληλους influencers με βάση το κοινό-στόχο σας</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-cyan-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-chart-bar text-2xl text-cyan-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">ROI Analytics</h5>
                                <span class="text-600">Μετρήστε την απόδοση των καμπανιών σας με προηγμένα analytics</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                        <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-check-circle text-2xl text-indigo-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Αυτοματοποίηση</h5>
                                <span class="text-600">Αυτοματοποιήστε τη διαχείριση καμπανιών και συμβολαίων</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="highlights" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div class="text-center">
                    <h2 class="text-900 font-normal mb-2">Ολοκληρωμένη Διαχείριση Καμπανιών</h2>
                    <span class="text-600 text-2xl">Από την εύρεση influencer μέχρι την ολοκλήρωση της καμπάνιας</span>
                </div>

                <div class="grid mt-8 pb-2 md:pb-8">
                    <div class="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup.svg" alt="mockup" class="w-11" style="border-radius: 12px;" />
                    </div>

                    <div class="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                        <div class="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                        </div>
                        <h2 class="line-height-1 text-900 text-4xl font-normal">Διαχειριστείτε τις καμπάνιες σας</h2>
                        <span class="text-700 text-2xl line-height-3 ml-0 md:ml-2" style="max-width: 650px">
                            Από την αναζήτηση του κατάλληλου influencer μέχρι την παρακολούθηση της απόδοσης, έχετε τον πλήρη έλεγχο των καμπανιών σας
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-12 mt-8 mb-8">
                <div class="grid">
                    <div class="col-12 text-center mb-4">
                        <h2 class="text-900 font-normal mb-2">Ιστορίες Επιτυχίας</h2>
                        <span class="text-600 text-2xl">Brands που εμπιστεύονται την πλατφόρμα μας</span>
                    </div>

                    <div class="col-12 lg:col-4 p-3">
                        <div class="p-3 surface-card h-full" style="border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1)">
                            <div class="flex flex-column align-items-center text-center">
                                <img :src="avatar1" class="w-5rem h-5rem border-circle mb-3" alt="Client Avatar" />
                                <h3 class="text-900 mb-2">BeautyBrand</h3>
                                <span class="text-600 mb-3">Καλλυντικά</span>
                                <p class="text-700 line-height-3 m-0">
                                    "Η πλατφόρμα μας βοήθησε να αυξήσουμε το ROI των influencer καμπανιών μας κατά 150% μέσα σε 6 μήνες. Η αυτοματοποίηση και τα analytics είναι απλά εξαιρετικά!"
                                </p>
                                <div class="flex align-items-center gap-2 mt-4">
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 lg:col-4 p-3">
                        <div class="p-3 surface-card h-full" style="border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1)">
                            <div class="flex flex-column align-items-center text-center">
                                <img :src="avatar2" class="w-5rem h-5rem border-circle mb-3" alt="Client Avatar" />
                                <h3 class="text-900 mb-2">FashionNow</h3>
                                <span class="text-600 mb-3">Μόδα</span>
                                <p class="text-700 line-height-3 m-0">
                                    "Η εύρεση των κατάλληλων influencers έγινε παιχνιδάκι. Η πλατφόρμα μας εξοικονομεί πολύτιμο χρόνο και πόρους στη διαχείριση των καμπανιών μας."
                                </p>
                                <div class="flex align-items-center gap-2 mt-4">
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 lg:col-4 p-3">
                        <div class="p-3 surface-card h-full" style="border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1)">
                            <div class="flex flex-column align-items-center text-center">
                                <img :src="avatar3" class="w-5rem h-5rem border-circle mb-3" alt="Client Avatar" />
                                <h3 class="text-900 mb-2">TechPro</h3>
                                <span class="text-600 mb-3">Τεχνολογία</span>
                                <p class="text-700 line-height-3 m-0">
                                    "Τα αναλυτικά στατιστικά και η αυτοματοποίηση των διαδικασιών μας επέτρεψαν να τριπλασιάσουμε τον αριθμό των καμπανιών μας χωρίς επιπλέον προσωπικό."
                                </p>
                                <div class="flex align-items-center gap-2 mt-4">
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="pricing" class="py-4 px-4 lg:px-8 my-2 md:my-4">
                <div class="text-center">
                    <h2 class="text-900 font-normal mb-2">Ευέλικτα Πακέτα</h2>
                    <span class="text-600 text-2xl">Επιλέξτε το πακέτο που ταιριάζει στις ανάγκες σας</span>
                </div>

                <div class="grid justify-content-between mt-8 md:mt-0">
                    <div class="col-12 lg:col-4 p-0 md:p-3">
                        <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                            <h3 class="text-900 text-center my-5">Starter</h3>
                            <img src="/demo/images/landing/free.svg" class="w-10 h-10 mx-auto" alt="free" />
                            <div class="my-5 text-center">
                                <span class="text-5xl font-bold mr-2 text-900">€0</span>
                                <span class="text-600">ανά μήνα</span>
                                <Button label="Δωρεάν Δοκιμή" class="block mx-auto mt-5 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500"></Button>
                            </div>
                            <ul class="list-none p-0 m-0 flex-grow-1">
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Βασική αναζήτηση influencers</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>1 ενεργή καμπάνια</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Βασικά στατιστικά</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
                        <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                            <h3 class="text-900 text-center my-5">Professional</h3>
                            <img src="/demo/images/landing/startup.svg" class="w-10 h-10 mx-auto" alt="startup" />
                            <div class="my-5 text-center">
                                <span class="text-5xl font-bold mr-2 text-900">€49</span>
                                <span class="text-600">ανά μήνα</span>
                                <Button label="Ξεκινήστε Τώρα" class="block mx-auto mt-5 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500"></Button>
                            </div>
                            <ul class="list-none p-0 m-0 flex-grow-1">
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Προηγμένη αναζήτηση influencers</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>5 ενεργές καμπάνιες</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Αναλυτικά στατιστικά</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Chat με influencers</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
                        <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                            <h3 class="text-900 text-center my-5">Enterprise</h3>
                            <img src="/demo/images/landing/enterprise.svg" class="w-10 h-10 mx-auto" alt="enterprise" />
                            <div class="my-5 text-center">
                                <span class="text-5xl font-bold mr-2 text-900">€99</span>
                                <span class="text-600">ανά μήνα</span>
                                <Button label="Επικοινωνήστε μαζί μας" class="block mx-auto mt-5 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500"></Button>
                            </div>
                            <ul class="list-none p-0 m-0 flex-grow-1">
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Όλα τα χαρακτηριστικά του Professional</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Απεριόριστες καμπάνιες</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Προτεραιότητα στην υποστήριξη</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>Προσαρμοσμένα reports</span>
                                </li>
                                <li class="flex align-items-center mb-3">
                                    <i class="pi pi-check text-green-500 mr-2"></i>
                                    <span>API πρόσβαση</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
                <div class="grid justify-content-between">
                    <div class="col-12 md:col-2" style="margin-top: -1.5rem">
                        <a @click="smoothScroll('#home')" class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                            <img :src="logoUrl" alt="footer sections" width="50" height="50" class="mr-2" />
                            <h4 class="font-medium text-3xl text-900">INFLUENCERS</h4>
                        </a>
                    </div>

                    <div class="col-12 md:col-10 lg:col-7">
                        <div class="grid text-center md:text-left">
                            <div class="col-12 md:col-3">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Events<img src="/demo/images/landing/new-badge.svg" class="ml-2" /></a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>