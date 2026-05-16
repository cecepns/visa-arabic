import { Printer, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getImageUrl } from '../utils/helpers';

export default function VisaDetailModal({ isOpen, onClose, visa, onPrint, onDownload }) {
  if (!visa) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visa Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100 border">
            {visa.profile_photo ? (
              <img src={getImageUrl(visa.profile_photo)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{visa.full_name}</h3>
            <p className="text-ksa-purple font-mono mt-1">{visa.visa_number}</p>
            <div className="mt-2"><StatusBadge status={visa.status} /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Passport" value={visa.passport_number} />
          <Detail label="Nationality" value={visa.nationality} />
          <Detail label="Visa Type" value={visa.visa_type} />
          <Detail label="Application No." value={visa.application_number} />
          <Detail label="Place of Issue" value={visa.place_of_issue || '-'} />
          <Detail label="Service Provider" value={visa.sponsor_name || '-'} />
          <Detail label="Border No" value={visa.border_no || String(visa.id)} />
          <Detail label="Local Service" value={visa.local_service || '-'} />
          <Detail label="Issue Date" value={formatDate(visa.issue_date)} />
          <Detail label="Expiry Date" value={formatDate(visa.expiry_date)} />
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Link to={`/visa/${visa.id}`} target="_blank" className="btn-primary text-sm py-2">
            <ExternalLink className="w-4 h-4" /> Preview
          </Link>
          <button type="button" onClick={() => onPrint?.(visa)} className="btn-secondary text-sm py-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button type="button" onClick={() => onDownload?.(visa)} className="btn-secondary text-sm py-2">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="text-gray-500">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
