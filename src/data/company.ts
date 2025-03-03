export const companyData = {
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
        international_linkages: {
            fertilizers: [
                {
                    name: "Global Fertilizers Co.",
                    name_ar: "شركة الأسمدة العالمية",
                    description: "Premium quality fertilizers",
                    description_ar: "أسمدة عالية الجودة",
                    logo: "global-fertilizers.svg"
                },
                {
                    name: "Green Growth Inc.",
                    name_ar: "شركة النمو الأخضر",
                    description: "Organic fertilizer solutions",
                    description_ar: "حلول الأسمدة العضوية",
                    logo: "green-growth.svg"
                }
            ],
            pesticides: [
                {
                    name: "SafeCrop Solutions",
                    name_ar: "حلول المحاصيل الآمنة",
                    description: "Advanced pest control",
                    description_ar: "مكافحة متقدمة للآفات",
                    logo: "safecrop.svg"
                },
                {
                    name: "BioProtect Ltd.",
                    name_ar: "بيوبروتكت المحدودة",
                    description: "Bio-based pesticides",
                    description_ar: "مبيدات حيوية",
                    logo: "bioprotect.svg"
                }
            ]
        }
    },
    products: {
        pesticides: [
            {
                id: "p1",
                name: "Organic Pest Control",
                name_ar: "مكافحة الآفات العضوية",
                type: "Biological",
                type_ar: "حيوي",
                category: "Pesticides",
                category_ar: "المبيدات",
                description: "Safe and effective pest management solution",
                description_ar: "حل آمن وفعال لإدارة الآفات",
                usage: "Apply as directed on specific crops when pest pressure is observed",
                usage_ar: "يتم التطبيق حسب التوجيهات على المحاصيل المحددة عند ملاحظة ضغط الآفات",
                image: "/products/organic-pesticide.jpg"
            },
            {
                id: "p2",
                name: "BioShield Insecticide",
                name_ar: "مبيد حشري بايوشيلد",
                type: "Chemical",
                type_ar: "كيميائي",
                category: "Pesticides",
                category_ar: "المبيدات",
                description: "Advanced biological pest control",
                description_ar: "مكافحة حيوية متقدمة للآفات",
                usage: "Dilute according to crop type and apply during early morning or late evening",
                usage_ar: "يخفف وفقاً لنوع المحصول ويطبق خلال الصباح الباكر أو المساء",
                image: "/products/bioshield.jpg"
            }
        ],
        fertilizers: [
            {
                id: "f1",
                name: "Premium NPK Fertilizer",
                name_ar: "سماد NPK ممتاز",
                composition: "N-P-K 20-20-20",
                composition_ar: "ن-ف-ب 20-20-20",
                category: "Fertilizers",
                category_ar: "الأسمدة",
                description: "Balanced nutrition for optimal crop growth",
                description_ar: "تغذية متوازنة لنمو محصول مثالي",
                usage: "Apply 2-3 times during growing season, mix with soil before planting",
                usage_ar: "يطبق 2-3 مرات خلال موسم النمو، يخلط مع التربة قبل الزراعة",
                image: "/products/npk-fertilizer.jpg"
            },
            {
                id: "f2",
                name: "Organic Growth Booster",
                name_ar: "معزز النمو العضوي",
                composition: "Natural compounds",
                composition_ar: "مركبات طبيعية",
                category: "Fertilizers",
                category_ar: "الأسمدة",
                description: "Natural solution for enhanced plant growth",
                description_ar: "حل طبيعي لتعزيز نمو النبات",
                usage: "Apply weekly as foliar spray during active growth phase",
                usage_ar: "يطبق أسبوعياً كرش ورقي خلال مرحلة النمو النشط",
                image: "/products/growth-booster.jpg"
            }
        ]
    },
    customers: [
        {
            name: "Sudan Farms Co.",
            name_ar: "شركة مزارع السودان",
            logo: "/trusted-customer-logos/customer1.svg"
        },
        {
            name: "Green Valley Agriculture",
            name_ar: "الوادي الأخضر للزراعة",
            logo: "/trusted-customer-logos/customer2.svg"
        },
        {
            name: "Al Nile Farming Group",
            name_ar: "مجموعة النيل للزراعة",
            logo: "/trusted-customer-logos/customer3.svg"
        }
    ]
}
