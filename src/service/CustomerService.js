export class CustomerService {
    getCustomersSmall() {
        return fetch('demo/data/customers-small.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomersMedium() {
        return fetch('demo/data/customers-medium.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomersLarge() {
        return Promise.resolve({
            data: [
                {
                    id: 1,
                    name: 'Ελένη Φουρέιρα',
                    category: 'Music & Entertainment',
                    followers: 1200000,
                    engagement: 4.8,
                    price: 5000,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
                    socialMedia: {
                        instagram: '@foureira',
                        tiktok: '@elenifoureira',
                        youtube: 'Eleni Foureira Official'
                    },
                    recentBrands: ['Maybelline', 'Intimissimi', 'L\'Oréal Paris'],
                    rating: 4.8
                },
                {
                    id: 2,
                    name: 'Σάκης Τανιμανίδης',
                    category: 'Lifestyle & TV',
                    followers: 950000,
                    engagement: 5.2,
                    price: 4500,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png',
                    socialMedia: {
                        instagram: '@sakiswp',
                        youtube: 'Sakis Tanimanidis'
                    },
                    recentBrands: ['Samsung', 'Adidas', 'Vodafone'],
                    rating: 4.9
                },
                {
                    id: 3,
                    name: 'Μαρία Σολωμού',
                    category: 'Fashion & Beauty',
                    followers: 580000,
                    engagement: 3.9,
                    price: 2800,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png',
                    socialMedia: {
                        instagram: '@mariasolomou',
                        tiktok: '@solomoumaria'
                    },
                    recentBrands: ['MAC Cosmetics', 'Zara', 'Sephora'],
                    rating: 4.5
                },
                {
                    id: 4,
                    name: 'Γιώργος Λέντζας',
                    category: 'Food & Cooking',
                    followers: 320000,
                    engagement: 6.7,
                    price: 1800,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png',
                    socialMedia: {
                        instagram: '@lentzas',
                        youtube: 'Γιώργος Λέντζας'
                    },
                    recentBrands: ['ΑΒ Βασιλόπουλος', 'Miele', 'Knorr'],
                    rating: 4.7
                },
                {
                    id: 5,
                    name: 'Κωνσταντίνα Σπυροπούλου',
                    category: 'Lifestyle & Fashion',
                    followers: 850000,
                    engagement: 4.1,
                    price: 3500,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png',
                    socialMedia: {
                        instagram: '@spyropoulou_konstantina'
                    },
                    recentBrands: ['Dior', 'Calzedonia', 'Nuxe'],
                    rating: 4.3
                },
                {
                    id: 6,
                    name: 'Δημήτρης Μακρυνιώτης',
                    category: 'Fitness & Health',
                    followers: 420000,
                    engagement: 7.2,
                    price: 2200,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/bernardodominic.png',
                    socialMedia: {
                        instagram: '@dimakriniotis',
                        youtube: 'DimitrisFit'
                    },
                    recentBrands: ['MyProtein', 'Under Armour', 'Garmin'],
                    rating: 4.6
                },
                {
                    id: 7,
                    name: 'Αθηνά Οικονομάκου',
                    category: 'Lifestyle & Acting',
                    followers: 780000,
                    engagement: 4.5,
                    price: 3800,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/ivanmagalhaes.png',
                    socialMedia: {
                        instagram: '@athinao1konomakou'
                    },
                    recentBrands: ['Pantene', 'Marks & Spencer', 'Piaget'],
                    rating: 4.4
                },
                {
                    id: 8,
                    name: 'Στέφανος Σούλης',
                    category: 'Home & Decoration',
                    followers: 290000,
                    engagement: 5.8,
                    price: 1500,
                    image: 'https://primefaces.org/cdn/primevue/images/avatar/elwinsharvill.png',
                    socialMedia: {
                        instagram: '@stefanossoulis',
                        youtube: 'Stefanos Soulis'
                    },
                    recentBrands: ['IKEA', 'Praktiker', 'Nef-Nef'],
                    rating: 4.5
                }
            ]
        });
    }

    getCustomersXLarge() {
        return fetch('demo/data/customers-xlarge.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomers(params) {
        const queryParams = Object.keys(params)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        return fetch('https://www.primefaces.org//demo/data/customers?' + queryParams).then((res) => res.json());
    }
}
