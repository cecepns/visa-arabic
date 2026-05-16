import { formatDate } from '../utils/helpers';
import StatusBadge from './StatusBadge';

export default function VisaCard({ visa, onClick }) {
  return (
    <button
      onClick={() => onClick?.(visa)}
      className="card text-left w-full hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{visa.full_name}</h3>
          <p className="text-sm text-gray-500 mt-1">{visa.visa_number}</p>
        </div>
        <StatusBadge status={visa.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Passport</span>
          <p className="font-medium">{visa.passport_number}</p>
        </div>
        <div>
          <span className="text-gray-500">Nationality</span>
          <p className="font-medium">{visa.nationality}</p>
        </div>
        <div>
          <span className="text-gray-500">Issue Date</span>
          <p className="font-medium">{formatDate(visa.issue_date)}</p>
        </div>
        <div>
          <span className="text-gray-500">Expiry</span>
          <p className="font-medium">{formatDate(visa.expiry_date)}</p>
        </div>
      </div>
    </button>
  );
}
