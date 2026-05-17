export const formatVisaDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const NATIONALITY_AR = {
  Indonesia: 'إندونيسيا',
  Pakistan: 'باكستان',
  Egypt: 'مصر',
  Jordan: 'الأردن',
  'United Arab Emirates': 'الإمارات',
  India: 'الهند',
  Bangladesh: 'بنغلاديش',
  Turkey: 'تركيا',
  Malaysia: 'ماليزيا',
};

const VISA_TYPE_AR = {
  Tourist: 'سياحة',
  Business: 'أعمال',
  Work: 'عمل',
  'Family Visit': 'زيارة عائلية',
  Umrah: 'عمرة',
  Hajj: 'حج',
  Transit: 'عبور',
};

export const getNationalityBilingual = (nationality) => {
  const ar = NATIONALITY_AR[nationality] || nationality;
  return `${nationality} - ${ar}`;
};

export const getVisaTypeBilingual = (type) => {
  const ar = VISA_TYPE_AR[type] || type;
  if (type === 'Umrah' || type === 'Hajj') return `${type} - ${ar}`;
  return `${type} - ${ar}`;
};

export const HAJJ_SEASON_AR = 'موسم الحج';
export const HAJJ_SEASON_EN = 'Hajj Season';

/** Bilingual center value: Arabic - English */
export const getHajjSeasonLabel = () => `${HAJJ_SEASON_AR} - ${HAJJ_SEASON_EN}`;

export const getDurationLabel = (visa) => {
  if (visa.visa_type === 'Hajj') return getHajjSeasonLabel();
  if (visa.visa_type === 'Umrah') return 'موسم العمرة - Umrah Season';
  return `${formatVisaDate(visa.issue_date)} - ${formatVisaDate(visa.expiry_date)}`;
};

export const digitsOnly = (str) => (str || '').replace(/\D/g, '');

export const getVisaBarcodeValue = (visa) => {
  const digits = digitsOnly(visa?.visa_number);
  return digits || String(visa?.visa_number || '0');
};

export const getApplicationBarcodeValue = (visa) => {
  const clean = String(visa?.application_number || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return clean || '0';
};

export const generateBarcodeWidths = (value, count = 60) => {
  const seed = digitsOnly(value) || '1234567890';
  const widths = [];
  for (let i = 0; i < count; i++) {
    const n = parseInt(seed[i % seed.length], 10);
    widths.push(n % 3 === 0 ? 3 : n % 2 === 0 ? 2 : 1);
  }
  return widths;
};

const padMRZ = (str, len, filler = '<') => String(str || '').toUpperCase().replace(/[^A-Z0-9<]/g, filler).padEnd(len, filler).slice(0, len);

export const generateMRZ = (visa) => {
  const parts = (visa.full_name || 'HOLDER').trim().split(/\s+/);
  const surname = padMRZ(parts.length > 1 ? parts[parts.length - 1] : parts[0], 20);
  const given = padMRZ(parts.slice(0, -1).join(' ') || parts[0], 24);
  const passport = padMRZ(visa.passport_number?.replace(/[^A-Za-z0-9]/g, ''), 9);
  const visaNum = digitsOnly(visa.visa_number).padStart(10, '0').slice(-10);
  const appNum = (visa.application_number || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10);

  const line1 = padMRZ(`V<SAU${surname}<<${given}`, 44);
  const line2 = padMRZ(`${passport}9SAU${visaNum}0${appNum}4`, 44);

  return [line1, line2];
};
