import { useState } from 'react';
import { Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { admin } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put('/settings/password', {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      toast.success('Password updated');
      setModalOpen(false);
      setForm({ current_password: '', new_password: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <section className="card max-w-xl">
        <h2 className="text-lg font-bold mb-4">Account Settings</h2>
        <ul className="space-y-3 text-sm">
          <li><strong>Name:</strong> {admin?.full_name}</li>
          <li><strong>Email:</strong> {admin?.email}</li>
        </ul>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary mt-6">
          <Key className="w-5 h-5" /> Change Password
        </button>
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Change Password" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">Current Password</label>
          <input type="password" className="input-field" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} required />
          <label className="block text-sm font-medium">New Password</label>
          <input type="password" className="input-field" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} required />
          <label className="block text-sm font-medium">Confirm Password</label>
          <input type="password" className="input-field" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
