import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import VisaTemplate from '../components/visa/VisaTemplate';
import VisaPreviewFrame from '../components/visa/VisaPreviewFrame';

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

  return (
    <div className="visa-preview-page min-h-screen bg-white text-gray-900 flex items-start justify-center">
      {loading ? (
        <div className="flex flex-1 w-full items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-ksa-purple" />
        </div>
      ) : !visa ? (
        <section className="flex flex-1 w-full flex-col items-center justify-center gap-4 min-h-screen">
          <p className="text-gray-800">Visa not found</p>
        </section>
      ) : (
        <div className="visa-preview-viewport w-full overflow-x-auto overflow-y-visible py-4">
          <div className="flex justify-center min-w-full">
            <VisaPreviewFrame>
              <VisaTemplate visa={visa} />
            </VisaPreviewFrame>
          </div>
        </div>
      )}
    </div>
  );
}
