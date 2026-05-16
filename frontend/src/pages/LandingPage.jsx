import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Printer,
  QrCode,
  LogIn,
  ChevronDown,
  Shield,
  Globe,
  Clock,
  Award,
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import HeroInquiryCard from '../components/landing/HeroInquiryCard';
import HeroCategoryCards from '../components/landing/HeroCategoryCards';
import InquiryModal from '../modals/InquiryModal';
import { LandingLanguageProvider, useLandingLanguage } from '../context/LandingLanguageContext';
import heroBanner from '../assets/banners_lrg_2.jpg';

const SERVICE_ICONS = [FileText, Search, Printer, QrCode, LogIn];
const SERVICE_ACTIONS = [null, 'inquiry', 'inquiry', null, null];
const SERVICE_LINKS = [null, null, null, null, '/admin/login'];
const FEATURE_ICONS = [Shield, Globe, Clock, Award];

function LandingPageContent() {
  const { t, dir } = useLandingLanguage();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryVisa, setInquiryVisa] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const services = t('services.items');
  const features = t('features.items');
  const faqs = t('faq.items');

  const handleService = (index) => {
    if (SERVICE_ACTIONS[index] === 'inquiry') {
      setInquiryVisa(null);
      setInquiryOpen(true);
    }
  };

  const handleVisaFound = (visa) => {
    setInquiryVisa(visa);
    setInquiryOpen(true);
  };


  return (
    <>
      <Navbar />
      <main className="pt-16" dir={dir}>
        {/* Hero */}
        <section
          id="inquiry"
          className="relative min-h-[92vh] flex items-center text-white overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <span className="absolute inset-0 bg-gradient-to-br from-[#2D2E5F]/85 via-ksa-navy/80 to-ksa-purple/50" aria-hidden />
          <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden />

          <article className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-28 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start" dir="ltr">
              <div className="order-2 lg:order-1 flex justify-center lg:justify-start animate-slide-up">
                <HeroInquiryCard onVisaFound={handleVisaFound} />
              </div>

              <div className="order-1 lg:order-2 text-right animate-fade-in" dir="rtl">
                <p className="text-ksa-gold/90 text-sm font-arabic mb-3 hidden sm:block">{t('hero.badge')}</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-arabic drop-shadow-lg leading-tight">
                  {t('hero.title')}
                </h1>
                <h2 className="text-xl md:text-2xl text-white/90 font-arabic mt-4 font-medium">{t('hero.subtitle')}</h2>
                <p className="text-white/70 text-sm mt-2 font-arabic hidden md:block">{t('hero.tagline')}</p>
                <HeroCategoryCards />
              </div>
            </div>
          </article>

          <span className="absolute bottom-0 left-0 right-0 h-1.5 hero-pattern-border z-10" aria-hidden />
        </section>

        {/* Services */}
        <section id="services" className="py-20 bg-white border-y border-gray-100">
          <article className="max-w-7xl mx-auto px-4">
            <header className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ksa-dark-blue font-arabic">{t('services.title')}</h2>
            </header>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 list-none p-0">
              {services.map((s, i) => {
                const Icon = SERVICE_ICONS[i];
                const link = SERVICE_LINKS[i];
                const card = (
                  <>
                    <Icon className="w-10 h-10 mx-auto text-ksa-purple mb-4" />
                    <h3 className="font-bold text-ksa-dark-blue font-arabic">{s.title}</h3>
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed font-arabic">{s.desc}</p>
                  </>
                );
                return (
                  <li key={i}>
                    {link ? (
                      <Link to={link} className="service-card block h-full">{card}</Link>
                    ) : (
                      <button type="button" onClick={() => handleService(i)} className="service-card w-full h-full">
                        {card}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        </section>

        {/* Inquiry CTA */}
        <section id="inquiry-cta" className="py-20 bg-gradient-to-r from-ksa-purple to-ksa-navy text-white">
          <article className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 font-arabic">{t('inquiryCta.title')}</h2>
            <p className="text-white/80 mb-8 font-arabic">{t('inquiryCta.subtitle')}</p>
            <button type="button" onClick={() => setInquiryOpen(true)} className="btn-hero-light font-arabic">
              <Search className="w-5 h-5" /> {t('inquiryCta.button')}
            </button>
          </article>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-white">
          <article className="max-w-7xl mx-auto px-4">
            <header className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ksa-dark-blue font-arabic">{t('features.title')}</h2>
            </header>
            <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <li key={i} className="service-card text-center">
                    <Icon className="w-12 h-12 mx-auto text-ksa-purple mb-4" />
                    <h3 className="font-bold mb-2 text-ksa-dark-blue font-arabic">{f.title}</h3>
                    <p className="text-gray-600 text-sm font-arabic">{f.desc}</p>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-gray-50">
          <article className="max-w-3xl mx-auto px-4">
            <header className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ksa-dark-blue font-arabic">{t('faq.title')}</h2>
            </header>
            <ul className="space-y-4 list-none p-0">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <li key={i}>
                    <article
                      className={`faq-card ${isOpen ? 'faq-card-open' : ''}`}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setOpenFaq(isOpen ? null : i);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                    >
                      <header className="flex items-center justify-between gap-4 p-5 select-none text-right">
                        <h3 className={`font-semibold flex-1 font-arabic ${isOpen ? 'text-ksa-purple' : 'text-ksa-dark-blue'}`}>
                          {faq.q}
                        </h3>
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isOpen ? 'bg-ksa-purple text-white' : 'bg-gray-100 text-ksa-purple'
                          }`}
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </span>
                      </header>
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 font-arabic text-right">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 text-gray-800 py-12">
          <article className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8" dir={dir}>
            <span className="text-right">
              <p className="text-2xl font-bold mb-2 text-ksa-dark-blue font-arabic">{t('footer.brand')}</p>
              <p className="text-gray-500 text-sm font-arabic">{t('footer.desc')}</p>
            </span>
            <span className="text-right">
              <p className="font-semibold mb-3 text-ksa-dark-blue font-arabic">{t('footer.quickLinks')}</p>
              <ul className="space-y-2 text-sm text-gray-600 font-arabic">
                <li><a href="#services" className="hover:text-ksa-purple transition-colors">{t('footer.services')}</a></li>
                <li><a href="#inquiry" className="hover:text-ksa-purple transition-colors">{t('footer.inquiry')}</a></li>
                <li><Link to="/admin/login" className="hover:text-ksa-purple transition-colors">{t('footer.adminLogin')}</Link></li>
              </ul>
            </span>
            <span className="text-right">
              <p className="font-semibold mb-3 font-arabic text-ksa-dark-blue">{t('footer.mofa')}</p>
              <p className="text-sm text-gray-500 font-arabic">{t('footer.mofaEn')}</p>
              <p className="text-sm text-gray-500 mt-2 font-arabic">{t('footer.copyright')}</p>
            </span>
          </article>
        </footer>
      </main>
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => {
          setInquiryOpen(false);
          setInquiryVisa(null);
        }}
        initialVisa={inquiryVisa}
      />
    </>
  );
}

export default function LandingPage() {
  return (
    <LandingLanguageProvider>
      <LandingPageContent />
    </LandingLanguageProvider>
  );
}
