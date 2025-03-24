import { useState, useMemo } from 'react';
import ProductGrid from './ProductGrid';
import ProductListView from './ProductListView';
import ProductSearch from './ProductSearch';

export default function ProductList({ products, categories, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type[lang].toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory, lang]);

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
