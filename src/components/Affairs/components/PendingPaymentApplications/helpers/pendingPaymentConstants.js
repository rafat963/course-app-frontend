/**
 * ثوابت ودوال مساعدة خاصة بطلبات في انتظار دفع الرسوم
 */

export const APPLICANT_CATEGORIES = {
  Civilian: {
    label: 'مدني',
    class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    requiresProof: false,
  },
  MilitaryOfficer: {
    label: 'ضابط ق.م',
    class: 'bg-primary-50 text-primary-800 dark:bg-primary-950/70 dark:text-primary-300 border-primary-200 dark:border-primary-800/80',
    requiresProof: true,
  },
  MilitaryFamily: {
    label: 'عائلات ضباط ق.م',
    class: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    requiresProof: true,
  },
  PoliceOfficerOrFamily: {
    label: 'شرطة / عائلاتهم',
    class: 'bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
    requiresProof: true,
  },
};

export const COMMON_CANCELLATION_REASONS = [
  'انقضاء مهلة السداد المحددة دون سداد أو تواصل من المتقدم',
  'اعتذار المتقدم عن استكمال الدورة التدريبية لظروف شخصية',
  'تعذر التواصل مع المتقدم عبر رقم الهاتف والبريد الإلكتروني',
  'طلب المتقدم استرداد أوراقه وإلغاء التسجيل بالدورة',
  'تضارب مواعيد العمل أو الدراسة مع جدول محاضرات الدورة',
];

export function formatEgyptianCurrency(val) {
  if (val == null) return '—';
  return Number(val).toLocaleString('ar-EG') + ' ج.م';
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

export function formatDateOnly(dateStr) {
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
 * حساب حالة مهلة السداد نسبة إلى تاريخ اليوم
 * @param {string} dueDateStr تاريخ الاستحقاق بصيغة YYYY-MM-DD
 * @returns {object} { isOverdue, daysDiff, badgeClass, statusText, alertLevel }
 */
export function getPaymentDueStatus(dueDateStr) {
  if (!dueDateStr) {
    return {
      isOverdue: false,
      daysDiff: 0,
      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      statusText: 'مهلة غير محددة',
      alertLevel: 'info',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // انقضت مهلة السداد (Overdue)
    const overdueCount = Math.abs(diffDays);
    const countText =
      overdueCount === 1
        ? 'يوم واحد'
        : overdueCount === 2
          ? 'يومين'
          : `${overdueCount} أيام`;

    return {
      isOverdue: true,
      daysDiff: diffDays,
      badgeClass:
        'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80',
      statusText: `انقضت المهلة منذ ${countText}`,
      alertLevel: 'danger',
    };
  }

  if (diffDays === 0) {
    return {
      isOverdue: false,
      daysDiff: 0,
      badgeClass:
        'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
      statusText: 'تنتهي المهلة اليوم (آخر موعد)',
      alertLevel: 'warning',
    };
  }

  if (diffDays === 1) {
    return {
      isOverdue: false,
      daysDiff: 1,
      badgeClass:
        'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
      statusText: 'متبقي يوم واحد في المهلة',
      alertLevel: 'warning',
    };
  }

  return {
    isOverdue: false,
    daysDiff: diffDays,
    badgeClass:
      'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    statusText: `متبقي ${diffDays} أيام في المهلة`,
    alertLevel: 'safe',
  };
}

/**
 * الحصول على تاريخ مستقبلي بتنسيق YYYY-MM-DD
 */
export function getFutureDateString(daysToAdd = 3) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
}
