export default function ProductCard({ product = {}, lang = 'en' }) {
  const {
    image = '',
    name = { en: '', ar: '' },
    composition = { en: '', ar: '' },
    description = { en: '', ar: '' },
    manufacturer = { en: '', ar: '' },
    country = { en: '', ar: '' }
  } = product;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48">
        <img
          src={image}
          alt={name[lang] || ''}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{name[lang] || ''}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{composition[lang] || ''}</p>
        <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">{description[lang] || ''}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-1">{manufacturer[lang] || ''}</p>
          <p>{country[lang] || ''}</p>
        </div>
      </div>
    </div>
  );
}
