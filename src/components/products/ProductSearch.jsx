import { useState } from 'react';

export default function ProductSearch({
  onSearch,
  onCategoryChange,
  onViewModeChange,
  viewMode,
  categories,
  lang,
  translations,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-8 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={translations.search[lang]}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-full md:w-48">
          <select
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{translations.all[lang]}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name[lang]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-1 rounded-lg border border-gray-300 dark:border-gray-600 shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden md:inline">{translations.viewMode.grid[lang]}</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden md:inline">{translations.viewMode.list[lang]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
