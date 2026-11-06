/**
 * دوال وثوابت مساعدة لصفحة الدورات المتاحة للمتدرب
 * TraineeAvailableCourses helpers - وفق الـ ERD
 */

/** خريطة أيام الأسبوع من الإنجليزية إلى العربية */
export const DAY_LABELS = {
  Sat: 'السبت',
  Sun: 'الأحد',
  Mon: 'الإثنين',
  Tue: 'الثلاثاء',
  Wed: 'الأربعاء',
  Thu: 'الخميس',
  Fri: 'الجمعة',
};

/** أيام الأسبوع المختصرة */
export const DAY_LABELS_SHORT = {
  Sat: 'سبت',
  Sun: 'أحد',
  Mon: 'إثنين',
  Tue: 'ثلاثاء',
  Wed: 'أربعاء',
  Thu: 'خميس',
  Fri: 'جمعة',
};

/** تكوين فئات المتدربين مع التسميات العربية */
export const CATEGORY_CONFIG = {
  Civilian: {
    label: 'مدني',
    labelFull: 'دارس مدني',
    color: 'slate',
  },
  MilitaryOfficer: {
    label: 'ضابط عسكري',
    labelFull: 'ضابط بالقوات المسلحة',
    color: 'emerald',
  },
  MilitaryFamily: {
    label: 'أسرة عسكرية',
    labelFull: 'أسرة ذوي العسكريين',
    color: 'amber',
  },
  PoliceOfficerOrFamily: {
    label: 'ضابط/أسرة شرطة',
    labelFull: 'ضابط شرطة وأسرته',
    color: 'blue',
  },
};

/**
 * تنسيق أيام المحاضرات بالعربية
 * @param {string[]} days - مصفوفة أكواد الأيام
 * @returns {string}
 */
export function formatLectureDays(days) {
  if (!Array.isArray(days) || days.length === 0) return '—';
  return days.map((d) => DAY_LABELS[d] || d).join(' • ');
}

/**
 * تنسيق التاريخ بالعربية
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateAr(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * تنسيق تاريخ التقديم بصيغة DD/MM/YYYY
 * @param {string|Date} value - تاريخ التقديم (ISO أو Date)
 * @returns {string}
 */
export function formatSubmissionDate(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}

/**
 * تحويل الوقت بصيغة 24 ساعة إلى 12 ساعة بالعربية (ص / م)
 * @param {string} time24
 * @returns {string}
 */
export function formatTime12Hour(time24) {
  if (!time24) return '';
  const parts = String(time24).split(':');
  let h = parseInt(parts[0], 10) || 0;
  const m = parts[1] || '00';
  const period = h >= 12 ? 'م' : 'ص';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, '0')}:${m} ${period}`;
}

/**
 * تنسيق المدى الزمني للمحاضرة بالعربية 12 ساعة (ص / م)
 * @param {string} startTime
 * @param {string} endTime
 * @returns {string}
 */
export function formatTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return '';
  return `${formatTime12Hour(startTime)} — ${formatTime12Hour(endTime)}`;
}

/**
 * حساب مدة المحاضرة بالساعات
 * @param {string} startTime
 * @param {string} endTime
 * @returns {string}
 */
export function calcLectureDuration(startTime, endTime) {
  if (!startTime || !endTime) return '';
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff <= 0) return '';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m === 0 ? `${h} ساعات` : `${h} ساعة و${m} دقيقة`;
}

/**
 * حساب الأيام المتبقية لآخر موعد للتقديم
 * @param {string} lastApplicationDate
 * @returns {number|null}
 */
export function getDaysUntilDeadline(lastApplicationDate) {
  if (!lastApplicationDate) return null;
  const deadline = new Date(lastApplicationDate).setHours(23, 59, 59, 0);
  const now = new Date().getTime();
  const diffMs = deadline - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * الحصول على سعر الدورة وفق فئة المتدرب
 * @param {Object} pricings - CoursePricings map
 * @param {string} category - TraineeCategory
 * @returns {number}
 */
export function getPriceByCategory(pricings, category) {
  if (!pricings || !category) return 0;
  return pricings[category] || pricings.Civilian || 0;
}

/**
 * تنسيق السعر بالجنيه المصري
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (!price && price !== 0) return '—';
  return price.toLocaleString('ar-EG') + ' جنيه';
}

/**
 * توليد كود طلب فريد بصيغة APP-XXXXX
 * @returns {string}
 */
export function generateApplicationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'APP-';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * توليد QR Token (GUID محاكى)
 * @returns {string}
 */
export function generateQRToken() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

/**
 * حساب نسبة الامتلاء
 * @param {number} enrolled
 * @param {number} capacity
 * @returns {number} نسبة مئوية 0-100
 */
export function calcFillRate(enrolled, capacity) {
  if (!capacity) return 0;
  return Math.min(100, Math.round((enrolled / capacity) * 100));
}

/**
 * حساب المقاعد المتبقية
 * @param {number} enrolled
 * @param {number} capacity
 * @returns {number}
 */
export function calcRemainingSeats(enrolled, capacity) {
  return Math.max(0, (capacity || 0) - (enrolled || 0));
}

/**
 * الحصول على تكوين حالة الدورة
 * @param {string} status
 * @returns {Object}
 */
export function getRoundStatusConfig(status) {
  const configs = {
    Available: {
      label: 'مفتوحة للتسجيل',
      badgeClass:
        'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      dotClass: 'bg-blue-500',
    },
    Full: {
      label: 'المقاعد مكتملة',
      badgeClass:
        'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      dotClass: 'bg-purple-500',
    },
  };
  return configs[status] || configs.Available;
}
