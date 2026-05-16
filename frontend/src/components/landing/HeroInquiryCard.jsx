import { useState, useMemo } from 'react';
import { RefreshCw, HelpCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useLandingLanguage } from '../../context/LandingLanguageContext';

const SEARCH_METHODS = ['visa_request', 'visa_doc', 'order'];

const FIELD_KEYS = {
  visa_request: ['visa_request_1', 'visa_request_2'],
  visa_doc: ['visa_doc_1', 'visa_doc_2'],
  order: ['order_1', 'order_2'],
};

function generateCaptcha() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function HeroInquiryCard({ onVisaFound }) {
  const { t, dir } = useLandingLanguage();
  const [searchMethod, setSearchMethod] = useState('visa_request');
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [loading, setLoading] = useState(false);

  const fieldLabels = useMemo(() => {
    const keys = FIELD_KEYS[searchMethod];
    return [t(`inquiry.fields.${keys[0]}`), t(`inquiry.fields.${keys[1]}`)];
  }, [searchMethod, t]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      toast.error(t('inquiry.captchaError'));
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      let passport_number = '';
      let visa_number = '';

      if (searchMethod === 'order') {
        const res = await api.post('/visas/inquiry', {
          application_number: field1,
          passport_number: field2,
        });
        onVisaFound?.(res.data);
        toast.success(t('inquiry.foundOrder'));
        return;
      }

      if (searchMethod === 'visa_doc') {
        passport_number = field1;
        visa_number = field2;
      } else {
        visa_number = field1;
        passport_number = field2;
      }

      const res = await api.post('/visas/inquiry', { passport_number, visa_number });
      onVisaFound?.(res.data);
      toast.success(t('inquiry.foundVisa'));
    } catch {
      toast.error(t('inquiry.notFound'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="hero-inquiry-card w-full max-w-md lg:max-w-none" dir={dir}>
      <header className="mb-5">
        <h2 className="text-xl font-bold text-ksa-dark-blue font-arabic">{t('inquiry.title')}</h2>
        <p className="text-sm text-gray-500 mt-1 font-arabic leading-relaxed">{t('inquiry.subtitle')}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">{t('inquiry.searchMethod')}</label>
          <select
            className="hero-input font-arabic text-right"
            value={searchMethod}
            onChange={(e) => {
              setSearchMethod(e.target.value);
              setField1('');
              setField2('');
            }}
          >
            {SEARCH_METHODS.map((m) => (
              <option key={m} value={m}>{t(`inquiry.methods.${m}`)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">{fieldLabels[0]}</label>
          <input
            className="hero-input font-arabic text-right"
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            required
            placeholder={fieldLabels[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic flex items-center gap-1 justify-end">
            {fieldLabels[1]}
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </label>
          <input
            className="hero-input font-arabic text-right"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            required
            placeholder={fieldLabels[1]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">{t('inquiry.captcha')}</label>
          <div className="flex items-center gap-2">
            <input
              className="hero-input flex-1 font-mono text-center"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
              placeholder="••••••"
              maxLength={6}
            />
            <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-lg tracking-widest text-ksa-navy select-none">{captcha}</span>
              <button type="button" onClick={refreshCaptcha} className="icon-btn p-1" aria-label="Refresh captcha">
                <RefreshCw className="w-4 h-4 text-ksa-purple" />
              </button>
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-mofa w-full mt-2 font-arabic">
          <Search className="w-5 h-5" />
          {loading ? t('inquiry.searching') : t('inquiry.submit')}
        </button>
      </form>
    </article>
  );
}
