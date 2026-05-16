import { useState } from 'react';
import { QrCode, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function QRVerification() {
  const [visaId, setVisaId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!visaId.trim()) return toast.error('Enter visa ID');
    setLoading(true);
    try {
      await api.get(`/visas/${visaId}`);
      toast.success('Visa verified');
      navigate(`/hajvisa/${visaId}`);
    } catch {
      toast.error('Visa not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="QR Verification">
      <section className="card max-w-lg mx-auto text-center py-12">
        <QrCode className="w-20 h-20 mx-auto text-ksa-purple mb-6" />
        <h2 className="text-xl font-bold mb-2">Verify Visa by ID</h2>
        <p className="text-gray-500 mb-6">Enter visa ID from QR scan or manual lookup</p>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
          <Search className="w-5 h-5" /> Open Verification
        </button>
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="QR Verification" size="sm">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-sm font-medium">Visa ID</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 1"
            value={visaId}
            onChange={(e) => setVisaId(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying...' : 'Verify & View'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
