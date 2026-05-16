import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import api from '../services/api';
import { VISA_TYPES, STATUS_OPTIONS } from '../utils/helpers';
import { digitsOnly } from '../utils/visaDocument';

const DEFAULT_PLACE_OF_ISSUE = 'Saudi Digital Embassy - السفارة السعودية الرقمية';

const emptyForm = {
  full_name: '',
  passport_number: '',
  nationality: '',
  visa_type: 'Tourist',
  sponsor_name: '',
  place_of_issue: DEFAULT_PLACE_OF_ISSUE,
  border_no: '',
  local_service: '',
  visa_number: '',
  application_number: '',
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
        place_of_issue: visa.place_of_issue || DEFAULT_PLACE_OF_ISSUE,
        border_no: visa.border_no || String(visa.id || ''),
        local_service:
          visa.local_service ||
          digitsOnly(visa.application_number).slice(-12) ||
          digitsOnly(visa.visa_number) ||
          '',
        visa_number: visa.visa_number || '',
        application_number: visa.application_number || '',
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300">Applicant</legend>
          <FormGrid>
            <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
            <Field label="Passport Number" name="passport_number" value={form.passport_number} onChange={handleChange} required />
            <Field label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} required />
            <SelectField label="Visa Type" name="visa_type" value={form.visa_type} onChange={handleChange}>
              {VISA_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </SelectField>
            <SelectField label="Status" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </SelectField>
            <Field label="Issue Date" name="issue_date" type="date" value={form.issue_date} onChange={handleChange} required />
            <Field label="Expiry Date" name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} required />
          </FormGrid>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300">Visa document (preview)</legend>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Fields shown on the printed visa. Leave visa/application numbers empty when creating to auto-generate.
          </p>
          <FormGrid>
            <Field
              label="Visa Number"
              name="visa_number"
              value={form.visa_number}
              onChange={handleChange}
              required={isEdit}
              placeholder={isEdit ? undefined : 'Auto-generated if empty'}
            />
            <Field
              label="Application Number"
              name="application_number"
              value={form.application_number}
              onChange={handleChange}
              required={isEdit}
              placeholder={isEdit ? undefined : 'Auto-generated if empty'}
            />
            <Field
              label="Place of Issue"
              name="place_of_issue"
              value={form.place_of_issue}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <Field
              label="Service Provider"
              name="sponsor_name"
              value={form.sponsor_name}
              onChange={handleChange}
              placeholder="Ministry of Foreign Affairs - وزارة الخارجية"
            />
            <Field label="Border No" name="border_no" value={form.border_no} onChange={handleChange} />
            <Field
              label="Local Service"
              name="local_service"
              value={form.local_service}
              onChange={handleChange}
              placeholder="Digits shown under الخدمة الميدانية"
            />
          </FormGrid>
        </fieldset>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
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

function FormGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function SelectField({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="input-field">
        {children}
      </select>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required, placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
