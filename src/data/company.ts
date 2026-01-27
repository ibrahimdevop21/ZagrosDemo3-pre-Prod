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
            social: {
                facebook: string;
                instagram: string;
                youtube: string;
            };
        };
        branches: Array<{
            name: string;
            name_ar: string;
            type: string;
            type_ar: string;
            mapUrl: string;
        }>;
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
            address: "Zagros Trading Enterprises, Khartoum Bahry Industrial Zone Block No.8 Plot 1/3 Portsudan - Sudan",
            phone: "+249 183 123456",
            email: "info@zagros-agriculture.com",
            hours: "Sunday - Thursday: 8:00 AM - 5:00 PM",
            telephones: ["+249 183 123456", "+249 183 789012"],
            branches: ["Khartoum Main Office", "Port Sudan Branch", "El Obeid Branch"],
            social: {
                facebook: "https://facebook.com/zagrosagri",
                instagram: "https://instagram.com/zagrosagri",
                youtube: "https://youtube.com/@zagrosagri"
            }
        },
        branches: [
            {
                name: "Khartoum",
                name_ar: "الخرطوم",
                type: "Headquarters",
                type_ar: "المقر الرئيسي",
                mapUrl: "https://maps.google.com/?q=Khartoum,Sudan"
            },
            {
                name: "Port Sudan",
                name_ar: "بورتسودان",
                type: "Branch",
                type_ar: "فرع",
                mapUrl: "https://maps.google.com/?q=Port+Sudan,Sudan"
            },
            {
                name: "Al Qadarif",
                name_ar: "القضارف",
                type: "Branch",
                type_ar: "فرع",
                mapUrl: "https://maps.google.com/?q=Al+Qadarif,Sudan"
            },
            {
                name: "Al Managil",
                name_ar: "المناقل",
                type: "Branch",
                type_ar: "فرع",
                mapUrl: "https://maps.google.com/?q=Al+Managil,Sudan"
            },
            {
                name: "Ad-Damar",
                name_ar: "الدامر",
                type: "Branch",
                type_ar: "فرع",
                mapUrl: "https://maps.google.com/?q=Ad-Damar,Sudan"
            },
            {
                name: "Ad-Daba",
                name_ar: "الدبة",
                type: "Branch",
                type_ar: "فرع",
                mapUrl: "https://maps.google.com/?q=Ad-Daba,Sudan"
            }
        ],
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
            logo: "ministry-of-agriculture.svg"
        },
        {
            name: "Alrajihi Agriculture Project",
            name_ar: "مشروع الراجحي الزراعي",
            logo: "alrajihi.svg"
        },
        {
            name: "Amtar Agriculture Project",
            name_ar: "مشروع امطار الزراعي",
            logo: "amtaar.svg"
        },
        {
            name: "Dal Agriculture ",
            name_ar: "دال الزراعية",
            logo: "dal.svg"
        },
        {
            name: "Paramount Agriculture",
            name_ar: " باراماونت الزراعية",
            logo: "Paramount.svg"
        },
        {
            name: "Premier Farm",
            name_ar: "بريمير فارم",
            logo: "premier-farm.webp"
        }
    ]
}
