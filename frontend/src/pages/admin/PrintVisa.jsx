import { useState } from 'react';
import { Printer, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function PrintVisa() {
  const [modalOpen, setModalOpen] = useState(false);
  const [passport, setPassport] = useState('');
  const [visaNumber, setVisaNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/visas/inquiry', { passport_number: passport, visa_number: visaNumber });
      window.open(`/visa/${res.data.id}`, '_blank');
      toast.success('Visa found');
      setModalOpen(false);
    } catch {
      toast.error('Visa not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Print Visa">
      <section className="card max-w-lg mx-auto text-center py-12">
        <Printer className="w-20 h-20 mx-auto text-ksa-purple mb-6" />
        <h2 className="text-xl font-bold mb-2">Print Visa Document</h2>
        <p className="text-gray-500 mb-6">Search applicant to open printable visa</p>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
          <Search className="w-5 h-5" /> Search Visa
        </button>
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Search Visa to Print" size="md">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-sm font-medium">Passport Number</label>
          <input className="input-field" value={passport} onChange={(e) => setPassport(e.target.value)} required />
          <label className="block text-sm font-medium">Visa Number</label>
          <input className="input-field" value={visaNumber} onChange={(e) => setVisaNumber(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Searching...' : 'Open & Print'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
