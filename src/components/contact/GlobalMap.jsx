import { useEffect, useRef } from 'react';

export default function GlobalMap({ branches, partners, customers, lang = 'en' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current, {
        center: [15.5007, 32.5599],
        zoom: 3,
        scrollWheelZoom: false,
        zoomControl: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5
      });
      
      // Force map container to stay within bounds
      mapRef.current.style.position = 'relative';
      mapRef.current.style.zIndex = '0';

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const greenIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const yellowIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #f59e0b; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const branchCoordinates = {
        'Khartoum': [15.5007, 32.5599],
        'Port Sudan': [19.6158, 37.2164],
        'Al Qadarif': [14.0350, 35.3833],
        'Al Managil': [14.3833, 33.5000],
        'Ad-Damar': [17.5933, 33.9600],
        'Ad-Daba': [18.0500, 30.9500]
      };

      const partnerCoordinates = {
        'Sudan': [15.5007, 32.5599],
        'Egypt': [26.8206, 30.8025],
        'Saudi Arabia': [23.8859, 45.0792],
        'UAE': [23.4241, 53.8478],
        'Qatar': [25.3548, 51.1839],
        'Kuwait': [29.3117, 47.4818],
        'Oman': [21.4735, 55.9754],
        'Bahrain': [26.0667, 50.5577],
        'Jordan': [30.5852, 36.2384],
        'Lebanon': [33.8547, 35.8623],
        'Iraq': [33.2232, 43.6793],
        'Yemen': [15.5527, 48.5164],
        'Germany': [51.1657, 10.4515],
        'Netherlands': [52.1326, 5.2913],
        'Thailand': [15.8700, 100.9925],
        'China': [35.8617, 104.1954],
        'India': [20.5937, 78.9629],
        'United Kingdom': [55.3781, -3.4360],
        'Australia': [-25.2744, 133.7751],
        'Switzerland': [46.8182, 8.2275]
      };

      if (branches && Array.isArray(branches)) {
        branches.forEach(branch => {
          const coords = branchCoordinates[branch.name];
          if (coords) {
            const branchName = lang === 'ar' ? branch.name_ar : branch.name;
            const branchType = lang === 'ar' ? branch.type_ar : branch.type;
            L.marker(coords, { icon: greenIcon })
              .addTo(map)
              .bindPopup(`<strong>${branchName}</strong><br/>${branchType}`);
          }
        });
      }

      const addedCountries = new Set();
      
      const allCountries = [
        { name: 'Sudan', name_ar: 'السودان' },
        { name: 'Egypt', name_ar: 'مصر' },
        { name: 'Saudi Arabia', name_ar: 'السعودية' },
        { name: 'UAE', name_ar: 'الإمارات' },
        { name: 'Qatar', name_ar: 'قطر' },
        { name: 'Kuwait', name_ar: 'الكويت' },
        { name: 'Oman', name_ar: 'عمان' },
        { name: 'Bahrain', name_ar: 'البحرين' },
        { name: 'Jordan', name_ar: 'الأردن' },
        { name: 'Lebanon', name_ar: 'لبنان' },
        { name: 'Iraq', name_ar: 'العراق' },
        { name: 'Yemen', name_ar: 'اليمن' },
        { name: 'Germany', name_ar: 'ألمانيا' },
        { name: 'Netherlands', name_ar: 'هولندا' },
        { name: 'Thailand', name_ar: 'تايلاند' },
        { name: 'China', name_ar: 'الصين' },
        { name: 'India', name_ar: 'الهند' },
        { name: 'United Kingdom', name_ar: 'المملكة المتحدة' }
      ];

      allCountries.forEach(country => {
        const coords = partnerCoordinates[country.name];
        if (coords && country.name !== 'Sudan') {
          const countryName = lang === 'ar' ? country.name_ar : country.name;
          L.marker(coords, { icon: yellowIcon })
            .addTo(map)
            .bindPopup(`<strong>${countryName}</strong><br/>${lang === 'ar' ? 'شريك/عميل' : 'Partner/Customer'}`);
          addedCountries.add(country.name);
        }
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [branches, partners, customers, lang]);

  return (
    <div className="w-full max-w-full overflow-hidden relative z-0">
      <div ref={mapRef} className="w-full h-[500px] rounded-lg shadow-lg border border-border-default overflow-hidden relative z-0" style={{position: 'relative', zIndex: 0}}></div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
          <span className="text-text-secondary">
            {lang === 'ar' ? 'فروعنا في السودان' : 'Our Branches in Sudan'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow"></div>
          <span className="text-text-secondary">
            {lang === 'ar' ? 'شركاؤنا وعملاؤنا' : 'Our Partners & Customers'}
          </span>
        </div>
      </div>
    </div>
  );
}
