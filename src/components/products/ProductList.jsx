import { useState, useMemo, useEffect, useRef } from 'react';
import ProductGrid from './ProductGrid';
import ProductListView from './ProductListView';
import ProductSearch from './ProductSearch';

export default function ProductList({ products, categories, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const debounceTimerRef = useRef(null);
  const isArabic = lang === 'ar';

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Precompute searchable fields once per product
  const searchableProducts = useMemo(() => {
    return products.map((product) => {
      const getField = (field) => field?.[lang] || field?.en || '';
      return {
        ...product,
        categoryId: product.categoryId || 'uncategorized',
        searchableText: [
          getField(product.name),
          getField(product.description),
          getField(product.code),
          getField(product.type),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      };
    });
  }, [products, lang]);

  const translations = {
    search: {
      en: 'Search products...',
      ar: 'البحث عن المنتجات...',
    },
    category: {
      en: 'Category',
      ar: 'الفئة',
    },
    all: {
      en: 'All Categories',
      ar: 'جميع الفئات',
    },
    viewMode: {
      grid: {
        en: 'Grid View',
        ar: 'عرض الشبكة',
      },
      list: {
        en: 'List View',
        ar: 'عرض القائمة',
      },
    },
  };

  const filteredProducts = useMemo(() => {
    return searchableProducts.filter((product) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        product.searchableText.includes(debouncedSearchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchableProducts, debouncedSearchQuery, selectedCategory]);

  // Log warning for products without categoryId in dev mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const uncategorized = products.filter((p) => !p.categoryId);
      if (uncategorized.length > 0) {
        console.warn(
          `Warning: ${uncategorized.length} product(s) missing categoryId:`,
          uncategorized.map((p) => p.id || p.name?.en)
        );
      }
    }
  }, [products]);

  console.log('Filtered Products:', filteredProducts);
  console.log('View Mode:', viewMode);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductSearch
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        categories={categories}
        lang={lang}
        translations={translations}
      />
      
      {/* Result count */}
      <div className={`mb-4 text-sm text-text-secondary ${isArabic ? 'text-right font-arabic' : 'text-left'}`}>
        {isArabic
          ? `عرض ${filteredProducts.length} من ${products.length} منتج`
          : `Showing ${filteredProducts.length} of ${products.length} products`}
      </div>

      <div className="mt-4">
        {viewMode === 'grid' ? (
          <ProductGrid products={filteredProducts} lang={lang} />
        ) : (
          <ProductListView products={filteredProducts} lang={lang} />
        )}
      </div>
    </div>
  );
}
