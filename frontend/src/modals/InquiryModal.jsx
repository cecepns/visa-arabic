import { useState, useEffect } from 'react';
import { Search, Printer, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import VisaTemplate from '../components/visa/VisaTemplate';
import VisaPreviewFrame from '../components/visa/VisaPreviewFrame';
import api from '../services/api';
import { exportVisaToPDF, printVisa } from '../utils/pdfExport';
import { useLandingLanguage } from '../context/LandingLanguageContext';

export default function InquiryModal({ isOpen, onClose, initialVisa = null }) {
  const { t, dir } = useLandingLanguage();
  const [passport, setPassport] = useState('');
  const [visaNumber, setVisaNumber] = useState('');
  const [visa, setVisa] = useState(initialVisa);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialVisa) setVisa(initialVisa);
    if (!isOpen) setVisa(null);
  }, [isOpen, initialVisa]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVisa(null);
    try {
      const res = await api.post('/visas/inquiry', {
        passport_number: passport,
        visa_number: visaNumber,
      });
      setVisa(res.data);
      toast.success(t('modal.found'));
    } catch {
      toast.error(t('modal.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await exportVisaToPDF('visa-print-area', `visa-${visa.visa_number}.pdf`);
      toast.success(t('modal.pdfSuccess'));
    } catch {
      toast.error(t('modal.pdfError'));
    }
  };

  const handleClose = () => {
    setVisa(null);
    setPassport('');
    setVisaNumber('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('modal.title')} size="full">
      {!visa ? (
        <form onSubmit={handleSearch} className="space-y-4 max-w-md mx-auto" dir={dir}>
          <label className="block text-sm font-medium font-arabic">{t('modal.passport')}</label>
          <input className="input-field" value={passport} onChange={(e) => setPassport(e.target.value)} required dir={dir} />
          <label className="block text-sm font-medium font-arabic">{t('modal.visaNumber')}</label>
          <input className="input-field" value={visaNumber} onChange={(e) => setVisaNumber(e.target.value)} required dir={dir} />
          <button type="submit" disabled={loading} className="btn-primary w-full font-arabic">
            <Search className="w-5 h-5" />
            {loading ? t('modal.searching') : t('modal.search')}
          </button>
        </form>
      ) : (
        <section dir={dir}>
          <span className="flex gap-2 mb-4 no-print justify-center flex-wrap">
            <button type="button" onClick={printVisa} className="btn-primary text-sm py-2 font-arabic">
              <Printer className="w-4 h-4" /> {t('modal.print')}
            </button>
            <button type="button" onClick={handleDownload} className="btn-secondary text-sm py-2 font-arabic">
              <Download className="w-4 h-4" /> {t('modal.download')}
            </button>
            <button type="button" onClick={() => setVisa(null)} className="btn-secondary text-sm py-2 font-arabic">
              {t('modal.newSearch')}
            </button>
          </span>
          <div className="visa-preview-viewport w-full overflow-x-auto -mx-2 px-2">
            <div className="flex justify-center min-w-full py-2">
              <VisaPreviewFrame>
                <VisaTemplate visa={visa} />
              </VisaPreviewFrame>
            </div>
          </div>
        </section>
      )}
    </Modal>
  );
}
