import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import api from '../services/api';
import { VISA_TYPES, STATUS_OPTIONS } from '../utils/helpers';

const emptyForm = {
  full_name: '',
  passport_number: '',
  nationality: '',
  visa_type: 'Tourist',
  sponsor_name: '',
  issue_date: '',
  expiry_date: '',
  status: 'pending',
};

export default function VisaFormModal({ isOpen, onClose, visa, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!visa;

  useEffect(() => {
    if (visa) {
      setForm({
        full_name: visa.full_name || '',
        passport_number: visa.passport_number || '',
        nationality: visa.nationality || '',
        visa_type: visa.visa_type || 'Tourist',
        sponsor_name: visa.sponsor_name || '',
        issue_date: visa.issue_date?.split('T')[0] || '',
        expiry_date: visa.expiry_date?.split('T')[0] || '',
        status: visa.status || 'pending',
      });
    } else {
      setForm(emptyForm);
    }
    setPhoto(null);
  }, [visa, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (photo) data.append('profile_photo', photo);

      if (isEdit) {
        await api.put(`/visas/${visa.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Visa updated successfully');
      } else {
        await api.post('/visas', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Visa created successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Visa Applicant' : 'Add Visa Applicant'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
          <Field label="Passport Number" name="passport_number" value={form.passport_number} onChange={handleChange} required />
          <Field label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium mb-1">Visa Type</label>
            <select name="visa_type" value={form.visa_type} onChange={handleChange} className="input-field">
              {VISA_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Field label="Sponsor Name" name="sponsor_name" value={form.sponsor_name} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Field label="Issue Date" name="issue_date" type="date" value={form.issue_date} onChange={handleChange} required />
          <Field label="Expiry Date" name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="input-field"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input-field"
      />
    </div>
  );
}
