export default function ProductListView({ products, lang }) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No products found</div>;
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row h-full">
            <div className="relative w-full md:w-48 h-48 md:h-auto flex items-center justify-center bg-gray-50 dark:bg-gray-900 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
              {/* Placeholder icon when no image is available */}
              <svg
                className="w-16 h-16 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name?.[lang]}
                  </h3>
                  <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
                    {product.type && (
                      <p>
                        <span className="font-medium">{lang === 'en' ? 'Type: ' : 'النوع: '}</span>
                        {product.type[lang]}
                      </p>
                    )}
                    {product.form && (
                      <p>
                        <span className="font-medium">{lang === 'en' ? 'Form: ' : 'الشكل: '}</span>
                        {product.form[lang]}
                      </p>
                    )}
                    {product.active_ingredient_content && (
                      <p>
                        <span className="font-medium">{lang === 'en' ? 'Active Ingredient: ' : 'المادة الفعالة: '}</span>
                        {product.active_ingredient_content[lang]}
                      </p>
                    )}
                  </div>
                </div>
                {product.code && (
                  <div className="text-sm md:text-right shrink-0">
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">{product.code[lang]}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-400">
                {product.description && (
                  <p>
                    <span className="font-medium">{lang === 'en' ? 'Description: ' : 'الوصف: '}</span>
                    {product.description[lang]}
                  </p>
                )}
                {product.recommendation && (
                  <p>
                    <span className="font-medium">{lang === 'en' ? 'Recommendation: ' : 'التوصية: '}</span>
                    {product.recommendation[lang]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
