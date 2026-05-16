import { User, Users, Building2 } from 'lucide-react';
import { useLandingLanguage } from '../../context/LandingLanguageContext';

export default function HeroCategoryCards() {
  const { t, dir } = useLandingLanguage();

  const categories = [
    { icon: User, titleKey: 'categories.visitors' },
    { icon: Users, titleKey: 'categories.citizens' },
    { icon: Building2, titleKey: 'categories.business' },
  ];

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 list-none p-0 mt-8" dir={dir}>
      {categories.map((cat) => (
        <li key={cat.titleKey}>
          <a href="#services" className="hero-category-card group">
            <span className="hero-category-icon">
              <cat.icon className="w-8 h-8 text-ksa-purple/70 group-hover:text-ksa-purple transition-colors" strokeWidth={1.5} />
            </span>
            <span className="hero-category-body">
              <span className="text-xs text-gray-500 font-arabic">{t('categories.servicesLabel')}</span>
              <span className="font-bold text-ksa-dark-blue font-arabic text-sm leading-snug block mt-1">
                {t(cat.titleKey)}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
