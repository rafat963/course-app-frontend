import { env } from '@/environment';

/**
 * Arabic Date, Currency, and String Formatters
 */
const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  return `${formatDate(dateStr)} - ${time}`;
}

export function formatFullDayDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${ARABIC_DAYS[d.getDay()]} ${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]}`;
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '—';
  return `${Number(amount).toLocaleString('ar-EG')} ج.م`;
}

export function formatDaysOfWeek(daysArray) {
  if (!daysArray || !daysArray.length) return '—';
  return daysArray.map(d => ARABIC_DAYS[d] || d).join(' و');
}

/**
 * تحويل مسار الصورة النسبي في السيرفر إلى رابط كامل صالح للعرض
 */
export function resolveImageUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const serverOrigin = env.apiBaseUrl.replace(/\/api(\/v\d+)?\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  try {
    return `${serverOrigin}${encodeURI(decodeURI(cleanPath))}`;
  } catch {
    return `${serverOrigin}${cleanPath}`;
  }
}
