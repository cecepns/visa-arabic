import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogIn } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLandingLanguage } from '../../context/LandingLanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { t, dir } = useLandingLanguage();

  const links = [
    { href: '#services', label: t('nav.services') },
    { href: '#inquiry', label: t('nav.inquiry') },
    { href: '#features', label: t('nav.features') },
    { href: '#faq', label: t('nav.faq') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white rounded-b-2xl shadow-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" dir={dir}>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🇸🇦</span>
          <span className="font-bold text-ksa-dark-blue font-arabic">{t('nav.brand')}</span>
        </Link>
        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-gray-700 hover:text-ksa-purple transition-colors font-arabic">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="icon-btn" aria-label="Theme">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a href="#inquiry" className="hidden sm:inline-flex btn-mofa py-2 px-6 text-sm w-auto font-arabic">
            {t('nav.tryPlatform')}
          </a>
          <Link to="/admin/login" className="hidden lg:inline-flex items-center gap-1 text-sm text-ksa-purple font-arabic hover:underline py-2">
            <LogIn className="w-4 h-4" /> {t('nav.login')}
          </Link>
          <button type="button" className="md:hidden icon-btn" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </span>
      </nav>
      {open && (
        <ul className="md:hidden border-t border-gray-200 px-4 py-4 space-y-3 bg-white" dir={dir}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block py-2 text-gray-700 hover:text-ksa-purple font-arabic">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/admin/login" className="btn-primary w-full justify-center font-arabic" onClick={() => setOpen(false)}>
              {t('nav.adminLogin')}
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
