import { memo, useState } from 'react';

// Defensive field accessor with fallback chain
const getLocalizedField = (field, lang) => {
  if (!field) return '';
  return field[lang] || field.en || field.ar || '';
};

function ProductCard({ product = {}, lang = 'en' }) {
  const [imageError, setImageError] = useState(false);
  
  const {
    image = '',
    name = { en: '', ar: '' },
    composition = { en: '', ar: '' },
    description = { en: '', ar: '' },
    manufacturer = { en: '', ar: '' },
    country = { en: '', ar: '' }
  } = product;

  const productName = getLocalizedField(name, lang);
  const productComposition = getLocalizedField(composition, lang);
  const productDescription = getLocalizedField(description, lang);
  const productManufacturer = getLocalizedField(manufacturer, lang);
  const productCountry = getLocalizedField(country, lang);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-400 hover:-translate-y-1">
      <div className="relative h-48 bg-stone-100 flex items-center justify-center">
        {!imageError && image ? (
          <img
            src={image}
            alt={productName}
            className="w-full h-full object-contain p-2"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <img
            src="/logo.svg"
            alt="Zagros Agriculture"
            className="w-24 h-24 object-contain opacity-30"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-text-primary line-clamp-2">
          {productName || 'Product Name'}
        </h3>
        <p className="text-sm text-text-secondary mb-2 line-clamp-1">
          {productComposition}
        </p>
        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
          {productDescription}
        </p>
        <div className="text-sm text-text-secondary">
          <p className="mb-1 truncate">{productManufacturer}</p>
          <p className="truncate">{productCountry}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
