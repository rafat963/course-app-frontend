/**
 * دوال وثوابت مساعدة لبوابة المتدرب
 * (متابعة الطلبات، تصاريح الدخول، الجدول الدراسي، الشهادات)
 */

/** حالة الطلب وفق ERD: UnderReview | PendingPayment | PaymentMissed | Enrolled | CourseEnded | Rejected */
export const APPLICATION_STATUS_CONFIG = {
  UnderReview: {
    label: 'قيد المراجعة',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    icon: 'Clock',
  },
  PendingPayment: {
    label: 'في انتظار السداد',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    icon: 'Wallet',
  },
  PaymentMissed: {
    label: 'فات ميعاد السداد',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
    icon: 'AlarmClockOff',
  },
  Enrolled: {
    label: 'مقيد بالدورة',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    icon: 'GraduationCap',
  },
  CourseEnded: {
    label: 'انتهت الدورة',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-500',
    icon: 'Award',
  },
  Rejected: {
    label: 'مرفوض',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    icon: 'XCircle',
  },
};

export function getStatusConfig(status) {
  return APPLICATION_STATUS_CONFIG[status] || APPLICATION_STATUS_CONFIG.UnderReview;
}

/** ترتيب أيام الأسبوع في الجدول (السبت أول الأسبوع) */
export const WEEK_DAYS = [
  { code: 'Sat', label: 'السبت', short: 'سبت' },
  { code: 'Sun', label: 'الأحد', short: 'أحد' },
  { code: 'Mon', label: 'الإثنين', short: 'إثنين' },
  { code: 'Tue', label: 'الثلاثاء', short: 'ثلاثاء' },
  { code: 'Wed', label: 'الأربعاء', short: 'أربعاء' },
  { code: 'Thu', label: 'الخميس', short: 'خميس' },
  { code: 'Fri', label: 'الجمعة', short: 'جمعة' },
];

const DAY_INDEX = { Sat: 6, Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };

/** أكواد الأيام بترتيب JavaScript (0 = الأحد) */
const JS_DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** كود اليوم الحالي بصيغة ERD (Sat|Sun|...) */
export function getDayCode(date = new Date()) {
  return JS_DAY_CODES[date.getDay()];
}

/** اسم اليوم بالعربية من تاريخ */
export function getDayLabel(date = new Date()) {
  const code = getDayCode(date);
  return WEEK_DAYS.find((d) => d.code === code)?.label || '';
}

/** تنسيق التاريخ DD/MM/YYYY */
export function formatDateDmy(value) {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** تنسيق التاريخ بالعربية الطويلة */
export function formatDateLong(value) {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** تنسيق الوقت 12 ساعة: 09:00 → 09:00 ص */
export function formatTimeAr(time) {
  if (!time) return '—';
  const [hRaw, mRaw] = String(time).split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(Number.isNaN(m) ? 0 : m).padStart(2, '0')} ${suffix}`;
}

/** المدى الزمني للمحاضرة */
export function formatTimeRange(startTime, endTime) {
  return `${formatTimeAr(startTime)} — ${formatTimeAr(endTime)}`;
}

/** عدد الأيام حتى تاريخ معيّن (سالب إذا انقضى) */
export function daysUntil(dateValue, now = new Date()) {
  if (!dateValue) return null;
  const target = new Date(dateValue);
  if (Number.isNaN(target.getTime())) return null;
  target.setHours(23, 59, 59, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

/** حالة مهلة السداد: متأخر / عاجل / تنبيه / عادي */
export function getPaymentUrgency(dueDate, now = new Date()) {
  const days = daysUntil(dueDate, now);
  if (days === null) return null;
  if (days < 0) {
    return {
      days,
      label: `تأخر السداد بـ ${Math.abs(days)} يوم`,
      tone: 'danger',
      boxClass: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
      textClass: 'text-rose-700 dark:text-rose-300',
    };
  }
  if (days === 0) {
    return {
      days,
      label: 'آخر يوم للسداد اليوم',
      tone: 'danger',
      boxClass: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
      textClass: 'text-rose-700 dark:text-rose-300',
    };
  }
  if (days <= 3) {
    return {
      days,
      label: `متبقي ${days} ${days === 1 ? 'يوم' : 'أيام'} للسداد`,
      tone: 'danger',
      boxClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      textClass: 'text-amber-700 dark:text-amber-300',
    };
  }
  if (days <= 7) {
    return {
      days,
      label: `متبقي ${days} أيام للسداد`,
      tone: 'warning',
      boxClass: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/70',
      textClass: 'text-amber-700 dark:text-amber-300',
    };
  }
  return {
    days,
    label: `متبقي ${days} يوم للسداد`,
    tone: 'normal',
    boxClass: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
    textClass: 'text-slate-600 dark:text-slate-300',
  };
}

/**
 * موعد المحاضرة القادمة لدورة ما
 * @returns {{date: Date, inDays: number, label: string, timeLabel: string}|null}
 */
export function getNextLecture(round, now = new Date()) {
  if (!round?.lectureDays?.length || !round?.startTime) return null;

  const [startH, startM] = String(round.startTime).split(':').map(Number);
  const roundStart = round.startDate ? new Date(`${round.startDate}T00:00:00`) : null;
  const roundEnd = round.endDate ? new Date(`${round.endDate}T23:59:59`) : null;

  let best = null;

  round.lectureDays.forEach((code) => {
    const targetDay = DAY_INDEX[code];
    if (targetDay === undefined) return;

    const delta = (targetDay - now.getDay() + 7) % 7;
    let candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + delta, startH || 0, startM || 0, 0, 0);
    if (candidate <= now) candidate.setDate(candidate.getDate() + 7);

    // لا تسبق بداية الدورة
    let guard = 0;
    while (roundStart && candidate < roundStart && guard < 52) {
      candidate.setDate(candidate.getDate() + 7);
      guard += 1;
    }
    if (roundEnd && candidate > roundEnd) return;
    if (!best || candidate < best) best = candidate;
  });

  if (!best) return null;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDay = new Date(best.getFullYear(), best.getMonth(), best.getDate());
  const inDays = Math.round((startOfDay - startOfToday) / 86400000);

  return {
    date: best,
    inDays,
    label: inDays === 0 ? 'اليوم' : inDays === 1 ? 'غداً' : `بعد ${inDays} أيام`,
    timeLabel: formatTimeAr(round.startTime),
  };
}

/** صلاحية تصريح الدخول مقارنة بفترة انعقاد الدورة */
export function getPassValidity(round, now = new Date()) {
  if (!round?.startDate || !round?.endDate) {
    return { key: 'unknown', label: 'غير محددة', badge: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
  const start = new Date(`${round.startDate}T00:00:00`);
  const end = new Date(`${round.endDate}T23:59:59`);

  if (now < start) {
    return {
      key: 'pending',
      label: 'لم تبدأ صلاحيته',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    };
  }
  if (now > end) {
    return {
      key: 'expired',
      label: 'منتهي الصلاحية',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  }
  return {
    key: 'active',
    label: 'ساري وفعّال',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  };
}

/** تجميع الجدول الأسبوعي من الدورات الجارية */
export function buildWeeklySchedule(applications) {
  return WEEK_DAYS.map((day) => ({
    ...day,
    entries: applications
      .filter((app) => app.round?.lectureDays?.includes(day.code))
      .map((app) => ({
        id: app.id,
        courseName: app.round.courseName,
        roundCode: app.round.roundCode,
        hallName: app.round.hall?.name,
        timeRange: formatTimeRange(app.round.startTime, app.round.endTime),
        startTime: app.round.startTime,
      }))
      .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime))),
  }));
}

/** نسبة الحضور أو التقدم في المنهج */
export function getCourseProgress(app) {
  const total = Number(app.round?.totalLectures) || 0;
  const attended = Number(app.attendedLectures) || 0;
  if (!total) return 0;
  return Math.min(100, Math.round((attended / total) * 100));
}
