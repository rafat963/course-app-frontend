/**
 * ثوابت ومساعدات خاصة بالدورات المفتوحة للتسجيل
 */

export const APPLICANT_CATEGORIES = {
  Civilian: {
    label: 'مدني',
    class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  MilitaryOfficer: {
    label: 'ضابط ق.م',
    class: 'bg-primary-50 text-primary-800 dark:bg-primary-950/70 dark:text-primary-300 border-primary-200 dark:border-primary-800/80',
  },
  MilitaryFamily: {
    label: 'عائلات ضباط ق.م',
    class: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
  },
  PoliceOfficerOrFamily: {
    label: 'شرطة / عائلاتهم',
    class: 'bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
  },
};

export const DAY_NAMES_MAP = {
  Sat: 'السبت',
  Sun: 'الأحد',
  Mon: 'الاثنين',
  Tue: 'الثلاثاء',
  Wed: 'الأربعاء',
  Thu: 'الخميس',
  Fri: 'الجمعة',
};

export function formatEgyptianCurrency(val) {
  if (val == null) return '—';
  return Number(val).toLocaleString('ar-EG') + ' ج.م';
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatLectureTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const isPm = h >= 12;
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  const amPm = isPm ? 'م' : 'ص';
  return `${h}:${minutes || '00'} ${amPm}`;
}

export function formatLectureDays(daysArr) {
  if (!daysArr || !Array.isArray(daysArr)) return '—';
  return daysArr.map((d) => DAY_NAMES_MAP[d] || d).join('، ');
}

export function calculateDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(deadlineStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getOccupancyStatus(enrolledCount, capacity) {
  if (capacity <= 0) {
    return {
      label: 'غير محدد',
      color: 'slate',
      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    };
  }

  const rate = Math.round((enrolledCount / capacity) * 100);

  if (enrolledCount >= capacity) {
    return {
      label: 'مكتملة المقاعد',
      color: 'rose',
      rate,
      badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  }

  if (rate >= 80) {
    return {
      label: 'قاربت على الاكتمال',
      color: 'amber',
      rate,
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    };
  }

  return {
    label: 'متاحة للتسجيل',
    color: 'emerald',
    rate,
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  };
}
