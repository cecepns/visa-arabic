import { BACKEND_URL } from './config';

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${normalized}`;
};

export const getVisaQrUrl = (visa) => {
  const path = visa?.qr_url || `/hajvisa/${visa?.id}`;
  return `${window.location.origin}${path}`;
};

export const VISA_TYPES = ['Tourist', 'Business', 'Work', 'Family Visit', 'Umrah', 'Hajj', 'Transit'];
export const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];
