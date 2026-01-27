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
          maxLength={100}
          aria-label={translations.search[lang]}
          className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-bg-surface text-text-primary placeholder-text-tertiary"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-full md:w-48">
          <select
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-bg-surface text-text-primary"
          >
            <option value="">{translations.all[lang]}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name[lang]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-bg-surface p-1 rounded-lg border border-border-default shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-bg-brand-muted text-text-brand' : 'hover:bg-bg-surface-hover text-text-secondary'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden md:inline">{translations.viewMode.grid[lang]}</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-bg-brand-muted text-text-brand' : 'hover:bg-bg-surface-hover text-text-secondary'}`}
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
