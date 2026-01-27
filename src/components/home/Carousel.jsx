import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Carousel.css';

const Carousel = ({ isArabic = false }) => {

  const slides = [
    {
      id: 1,
      image: '/hero/vegetable.webp',
      title: {
        en: 'High-Quality Vegetable Seeds',
        ar: 'بذور خضروات عالية الجودة '
      },
      description: {
        en: 'Boost your yield with our premium seeds.',
        ar: 'عزز إنتاجك مع بذورنا الممتازة.'
      }
    },
    {
      id: 2,
      image: '/hero/crop.webp',
      title: {
        en: 'Fresh Vegetables ',
        ar: 'خضروات طازجة '
      },
      description: {
        en: 'Healthy, organic, and farm-fresh produce.',
        ar: 'منتجات صحية وعضوية وطازجة من المزرعة.'
      }
    },
    {
      id: 3,
      image: '/hero/crop2.webp',
      title: {
        en: 'Fertilizers & Soil Enhancers ',
        ar: 'الأسمدة ومحسنات التربة '
      },
      description: {
        en: 'Improve soil quality with our expert solutions.',
        ar: 'حسن جودة التربة مع حلولنا المتخصصة.'
      }
    },
    {
      id: 4,
      image: '/hero/pest.webp',
      title: {
        en: 'Pesticides & Crop Protection ',
        ar: 'المبيدات وحماية المحاصيل '
      },
      description: {
        en: 'Protect crops with safe, effective solutions.',
        ar: 'احمِ محاصيلك بحلول آمنة وفعالة.'
      }
    },
    {
      id: 5,
      image: '/hero/irrigation.webp',
      title: {
        en: 'Irrigation ',
        ar: 'الإرتعاش '
      },
      description: {
        en: 'Optimize irrigation for better crop yields.',
        ar: 'تحسين إرتعاش المحاصيل لزيادة إنتاج المحاصيل.'
      }
    }
  ];


  return (
    <div className="w-full relative min-h-screen">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="h-screen"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title[isArabic ? 'ar' : 'en']}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${isArabic ? 'from-black/60 to-transparent' : 'from-black/60 to-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                  <div className="max-w-2xl text-white w-full md:w-3/4 lg:w-1/2 space-y-6">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">{slide.title[isArabic ? 'ar' : 'en']}</h2>
                    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed opacity-95">{slide.description[isArabic ? 'ar' : 'en']}</p>
                    <div className={`flex gap-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                      <a
                        href={isArabic ? '/ar/products' : '/products'}
                        className="bg-bg-brand hover:bg-bg-brand-hover text-text-inverse px-8 py-4 rounded-[var(--radius-xl)] font-semibold transition-all duration-[var(--duration-normal)] inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        {isArabic ? 'تصفح منتجاتنا' : 'Browse Our Products'}
                        <svg className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                      <a
                        href={isArabic ? '/ar/contact' : '/contact'}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-[var(--radius-xl)] font-semibold transition-all duration-[var(--duration-normal)] inline-flex items-center gap-2 border border-white/30 hover:border-white/50"
                      >
                        {isArabic ? 'تواصل معنا' : 'Contact Us'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className={`swiper-button-prev absolute z-10 left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 ${isArabic ? 'rotate-180' : ''}`}>
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div className={`swiper-button-next absolute z-10 right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 ${isArabic ? 'rotate-180' : ''}`}>
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default Carousel;
