import { getStatusColor } from '../utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
