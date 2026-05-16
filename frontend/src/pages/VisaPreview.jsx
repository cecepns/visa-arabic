import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import VisaTemplate from '../components/visa/VisaTemplate';
import VisaPreviewFrame from '../components/visa/VisaPreviewFrame';
import LoadingSpinner from '../components/LoadingSpinner';
import { exportVisaToPDF, printVisa } from '../utils/pdfExport';

export default function VisaPreview() {
  const { id } = useParams();
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/visas/${id}`)
      .then((res) => setVisa(res.data))
      .catch(() => toast.error('Visa not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      await exportVisaToPDF('visa-print-area', `visa-${visa.visa_number}.pdf`);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!visa) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Visa not found</p>
        <Link to="/" className="btn-primary">Home</Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <header className="max-w-4xl mx-auto no-print mb-6 flex flex-wrap gap-3 justify-between items-center">
        <Link to="/" className="btn-secondary text-sm py-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <nav className="flex gap-2">
          <button type="button" onClick={printVisa} className="btn-primary text-sm py-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button type="button" onClick={handleDownload} className="btn-secondary text-sm py-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </nav>
      </header>
      <VisaPreviewFrame>
        <VisaTemplate visa={visa} />
      </VisaPreviewFrame>
    </section>
  );
}
