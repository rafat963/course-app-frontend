/**
 * ثوابت ودوال مساعدة خاصة بكتالوج الدورات وتسعير الفئات وفق الـ ERD
 * جدول Courses: (Id, Name, Description, IsActive, CreatedAt)
 * جدول CoursePricings: (Id, CourseId, TraineeCategory, Price)
 */

export const CATEGORY_PRICING_LABELS = {
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

export const INITIAL_COURSE_FORM = {
  id: null,
  name: '',
  description: '',
  instructorId: null,
  isActive: true,
  pricings: {
    Civilian: 4000,
    MilitaryOfficer: 2000,
    MilitaryFamily: 2400,
    PoliceOfficerOrFamily: 2600,
  },
};

/**
 * خيارات أيام المحاضرات الأسبوعية وفق جدول CourseLectureDays بالـ ERD
 */
export const LECTURE_DAYS_OPTIONS = [
  { value: 'Sat', label: 'السبت', short: 'سبت' },
  { value: 'Sun', label: 'الأحد', short: 'أحد' },
  { value: 'Mon', label: 'الإثنين', short: 'إثنين' },
  { value: 'Tue', label: 'الثلاثاء', short: 'ثلاثاء' },
  { value: 'Wed', label: 'الأربعاء', short: 'أربعاء' },
  { value: 'Thu', label: 'الخميس', short: 'خميس' },
  { value: 'Fri', label: 'الجمعة', short: 'جمعة' },
];

/**
 * حالات دورة الانعقاد وفق حقل CourseRounds.Status بالـ ERD
 */
export const ROUND_STATUS_CONFIG = {
  Available: {
    label: 'متاحة للتسجيل',
    class: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
  },
  Full: {
    label: 'مكتملة العدد',
    class: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotClass: 'bg-amber-500',
  },
  Ongoing: {
    label: 'جارية حالياً',
    class: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dotClass: 'bg-blue-500',
  },
  Ended: {
    label: 'منتهية',
    class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dotClass: 'bg-slate-400',
  },
};

/**
 * النموذج المبدئي لإنشاء دورة انعقاد جديدة وفق الـ ERD تماماً
 * جدول CourseRounds + جدول CourseLectureDays
 */
export const INITIAL_ROUND_FORM = {
  id: null,
  courseId: null,
  roundNumber: 1,
  instructorId: null,
  hallId: null,
  capacity: 25,
  startDate: '',
  endDate: '',
  lastApplicationDate: '',
  startTime: '09:00',
  endTime: '13:00',
  lectureDays: ['Sat', 'Mon', 'Wed'],
  isCustomDayTiming: false,
  daySchedules: {
    Sat: { startTime: '09:00', endTime: '13:00' },
    Mon: { startTime: '09:00', endTime: '13:00' },
    Wed: { startTime: '09:00', endTime: '13:00' },
  },
  status: 'Available',
};

export function formatEgyptianCurrency(amount) {
  if (amount === null || amount === undefined) return '—';
  return `${Number(amount).toLocaleString('ar-EG')} ج.م`;
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

/**
 * تنسيق أيام المحاضرات المحددة كنص عربي مقروء
 */
export function formatLectureDays(days) {
  if (!Array.isArray(days) || days.length === 0) return '—';
  const map = {
    Sat: 'السبت',
    Sun: 'الأحد',
    Mon: 'الإثنين',
    Tue: 'الثلاثاء',
    Wed: 'الأربعاء',
    Thu: 'الخميس',
    Fri: 'الجمعة',
  };
  return days.map((d) => map[d] || d).join(' • ');
}

/**
 * حساب مدة المحاضرة بالساعات والدقائق من وقت البدء والانتهاء
 */
export function calculateLectureDuration(startTime, endTime) {
  if (!startTime || !endTime) return '';
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = (startH || 0) * 60 + (startM || 0);
  const endMinutes = (endH || 0) * 60 + (endM || 0);
  const diffMinutes = endMinutes - startMinutes;
  if (diffMinutes <= 0) return '';
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (minutes === 0) return `${hours} ساعات`;
  return `${hours} ساعة و ${minutes} دقيقة`;
}
