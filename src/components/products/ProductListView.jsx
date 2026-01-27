import { useState } from 'react';

// Defensive field accessor with fallback chain
const getLocalizedField = (field, lang) => {
  if (!field) return '';
  return field[lang] || field.en || field.ar || '';
};

function ProductListItem({ product, lang }) {
  const [imageError, setImageError] = useState(false);
  const isArabic = lang === 'ar';

  const handleImageError = () => {
    setImageError(true);
  };

  const productName = getLocalizedField(product.name, lang);
  const productType = getLocalizedField(product.type, lang);
  const productForm = getLocalizedField(product.form, lang);
  const productActiveIngredient = getLocalizedField(product.active_ingredient_content, lang);
  const productCode = getLocalizedField(product.code, lang);
  const productDescription = getLocalizedField(product.description, lang);
  const productRecommendation = getLocalizedField(product.recommendation, lang);

  return (
    <div 
      key={product.id} 
      className="bg-bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-400"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className={`flex flex-col ${isArabic ? 'md:flex-row-reverse' : 'md:flex-row'} h-full`}>
        <div className="relative w-full md:w-48 h-48 md:h-auto flex items-center justify-center bg-stone-100 shrink-0 border-b md:border-b-0 md:border-r border-border-muted">
          {!imageError && product.image ? (
            <img
              src={product.image}
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
        <div className="flex-1 p-6">
          <div className={`flex flex-col md:flex-row ${isArabic ? 'md:flex-row-reverse' : ''} justify-between gap-4`}>
            <div className="flex-1">
              <h3 className={`text-xl font-semibold text-text-primary mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                {productName || 'Product Name'}
              </h3>
              <div className={`grid gap-2 text-sm text-text-secondary ${isArabic ? 'text-right' : 'text-left'}`}>
                {productType && (
                  <p>
                    <span className="font-medium">{isArabic ? 'النوع: ' : 'Type: '}</span>
                    {productType}
                  </p>
                )}
                {productForm && (
                  <p>
                    <span className="font-medium">{isArabic ? 'الشكل: ' : 'Form: '}</span>
                    {productForm}
                  </p>
                )}
                {productActiveIngredient && (
                  <p>
                    <span className="font-medium">{isArabic ? 'المادة الفعالة: ' : 'Active Ingredient: '}</span>
                    {productActiveIngredient}
                  </p>
                )}
              </div>
            </div>
            {productCode && (
              <div className={`text-sm shrink-0 ${isArabic ? 'md:text-left' : 'md:text-right'}`}>
                <p className="text-text-brand font-medium">{productCode}</p>
              </div>
            )}
          </div>
          <div className={`mt-4 space-y-3 text-sm text-text-secondary ${isArabic ? 'text-right' : 'text-left'}`}>
            {productDescription && (
              <p>
                <span className="font-medium">{isArabic ? 'الوصف: ' : 'Description: '}</span>
                {productDescription}
              </p>
            )}
            {productRecommendation && (
              <p>
                <span className="font-medium">{isArabic ? 'التوصية: ' : 'Recommendation: '}</span>
                {productRecommendation}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductListView({ products, lang }) {
  const isArabic = lang === 'ar';
  
  if (!products || products.length === 0) {
    return (
      <div className={`text-center text-text-tertiary py-12 ${isArabic ? 'font-arabic' : ''}`}>
        {isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} lang={lang} />
      ))}
    </div>
  );
}
