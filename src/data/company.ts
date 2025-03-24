export interface CompanyData {
    company: {
        name: string;
        name_ar: string;
        specialization: string;
        specialization_ar: string;
        description: string;
        description_ar: string;
        established: string;
        subsidiary: string;
        membership: string;
        distribution_network: string;
        management: {
            description: string;
            staff: number;
        };
        services: string[];
        services_ar: string[];
        contact: {
            address: string;
            phone: string;
            email: string;
            hours: string;
            telephones: string[];
            branches: string[];
        };
        international_linkages: {
            vegetable_seeds: Array<{
                name: string;
                name_ar: string;
                description: string;
                description_ar: string;
                logo: string;
                country: string;
            }>;
            forage_crops_seeds: Array<{
                name: string;
                name_ar: string;
                description: string;
                description_ar: string;
                logo: string;
                country: string;
            }>;
            seeds: Array<{
                name: string;
                name_ar: string;
                description: string;
                description_ar: string;
                logo: string;
                country: string;
            }>;
            fertilizers: Array<{
                name: string;
                name_ar: string;
                description: string;
                description_ar: string;
                logo: string;
                country: string;
            }>;
            pesticides: Array<{
                name: string;
                name_ar: string;
                description: string;
                description_ar: string;
                logo: string;
                country: string;
            }>;
        };
    };
    customers: Array<{
        name: string;
        name_ar: string;
        logo: string;
    }>;
}

export const companyData: CompanyData = {
    company: {
        name: "Zagros Trading",
        name_ar: "تجارة زاغروس",
        specialization: "Your trusted partner in agricultural solutions",
        specialization_ar: "شريكك الموثوق في الحلول الزراعية",
        description: "Zagros Trading is a leading agricultural solutions provider, offering high-quality fertilizers and pesticides to enhance crop productivity and sustainable farming practices.",
        description_ar: "زاغروس للتجارة هي شركة رائدة في مجال الحلول الزراعية، تقدم أسمدة ومبيدات عالية الجودة لتحسين إنتاجية المحاصيل وممارسات الزراعة المستدامة.",
        services: [
            "Agricultural Consultancy",
            "Premium Fertilizers",
            "Pest Control Solutions"
        ],
        services_ar: [
            "استشارات زراعية",
            "أسمدة متميزة",
            "حلول مكافحة الآفات"
        ],
        established: "2010",
        subsidiary: "a subsidiary of Zagros Group",
        membership: "International Agricultural Trade Association",
        distribution_network: "Our extensive distribution network covers major agricultural regions across Sudan, with strategic partnerships enabling efficient delivery of our products to farmers nationwide.",
        management: {
            description: "led by experienced agricultural professionals",
            staff: 50
        },
        contact: {
            address: "123 Agricultural District, Khartoum, Sudan",
            phone: "+249 183 123456",
            email: "info@zagros-trading.com",
            hours: "Sunday - Thursday: 8:00 AM - 5:00 PM",
            telephones: ["+249 183 123456", "+249 183 789012"],
            branches: ["Khartoum Main Office", "Port Sudan Branch", "El Obeid Branch"]
        },
        international_linkages: {
            vegetable_seeds: [
                {
                    name: "East West Seeds International",
                    name_ar: "إيست ويست سيدز انترناشونال",
                    description: "Vegetables seeds from Thailand",
                    description_ar: "بذور الخضروات من تايلاند",
                    logo: "east-west-seeds.webp",
                    country: "Thailand"
                }
            ],
            forage_crops_seeds: [
                {
                    name: "Barenbrug Australia (Heritage Seeds)",
                    name_ar: "بارينبرج أستراليا (هيريتاج سيدز)",
                    description: "Forage crops seeds from Australia",
                    description_ar: "بذور محاصيل الأعلاف من أستراليا",
                    logo: "barenbrug.png",
                    country: "Australia"
                }
            ],
            seeds: [
                {
                    name: "East West Seeds International",
                    name_ar: "إيست ويست سيدز انترناشونال",
                    description: "Vegetables seeds from Thailand",
                    description_ar: "بذور الخضروات من تايلاند",
                    logo: "east-west-seeds.webp",
                    country: "Thailand"
                }
            ],
            fertilizers: [
                {
                    name: "Global Fertilizers Co.",
                    name_ar: "شركة الأسمدة العالمية",
                    description: "Premium quality fertilizers",
                    description_ar: "أسمدة عالية الجودة",
                    logo: "k&s.webp",
                    country: "Germany"
                },
                {
                    name: "Green Growth Inc.",
                    name_ar: "شركة النمو الأخضر",
                    description: "Organic fertilizer solutions",
                    description_ar: "حلول الأسمدة العضوية",
                    logo: "agro-dragon.webp",
                    country: "Netherlands"
                }
            ],
            pesticides: [
                {
                    name: "SafeCrop Solutions",
                    name_ar: "حلول المحاصيل الآمنة",
                    description: "Advanced pest control",
                    description_ar: "مكافحة متقدمة للآفات",
                    logo: "saf.webp",
                    country: "Switzerland"
                },
                {
                    name: "BioProtect Ltd.",
                    name_ar: "بيوبروتكت المحدودة",
                    description: "Bio-based pesticides",
                    description_ar: "مبيدات حيوية",
                    logo: "kz.webp",
                    country: "United Kingdom"
                }
            ]
        }
    },
    customers: [
        {
            name: "Ministry of Agriculture & Natural Resources Sudan",
            name_ar: "وزارة الزراعة و الموارد الطبيعية السودان",
            logo: "ministry-of-agriculture.webp"
        },
        {
            name: "Alrajihi Agriculture Project",
            name_ar: "مشروع الراجحي الزراعي",
            logo: "alrajihi.webp"
        },
        {
            name: "Amtar Agriculture Project",
            name_ar: "مشروع امطار الزراعي",
            logo: "amtar.webp"
        },
        {
            name: "Dal Agriculture ",
            name_ar: "دال الزراعية",
            logo: "dal.webp"
        },
        {
            name: "Paramount Agriculture",
            name_ar: " باراماونت الزراعية",
            logo: "paramount.webp"
        }
    ]
}
