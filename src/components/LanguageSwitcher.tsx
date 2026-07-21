import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-gray-500" />
      <div className="flex bg-gray-100 rounded-lg p-0.5">
        {languages.map((lang) => {
          const isActive = i18n.language.startsWith(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-white text-tractor-200 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={`Cambiar idioma a ${lang.label}`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
