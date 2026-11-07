/**
 * Application Lifecycle Statuses and Trainee Categories
 */
export const APPLICATION_STATUS = {
  PENDING_REVIEW: 'PendingReview',
  PENDING_AFFAIRS: 'pending_affairs',
  WAITING_PAYMENT: 'WaitingPayment',
  PAYMENT_MISSED: 'PaymentMissed',
  ENROLLED: 'Enrolled',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  REJECTED_EXPIRED: 'rejected_expired',
};

export const APPLICATION_STATUS_CONFIG = {
  [APPLICATION_STATUS.PENDING_REVIEW]: {
    label: 'قيد المراجعة',
    variant: 'info',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [APPLICATION_STATUS.PENDING_AFFAIRS]: {
    label: 'قيد المراجعة لدى الشؤون',
    variant: 'info',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [APPLICATION_STATUS.WAITING_PAYMENT]: {
    label: 'في انتظار السداد',
    variant: 'warning',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  [APPLICATION_STATUS.PAYMENT_MISSED]: {
    label: 'فات ميعاد السداد',
    variant: 'danger',
    bg: 'bg-red-50 text-red-700 border-red-200',
  },
  [APPLICATION_STATUS.ENROLLED]: {
    label: 'مقيد بالدورة',
    variant: 'success',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  [APPLICATION_STATUS.COMPLETED]: {
    label: 'انتهت الدورة',
    variant: 'secondary',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'مرفوض',
    variant: 'danger',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  [APPLICATION_STATUS.REJECTED_EXPIRED]: {
    label: 'مرفوض (تجاوز المهلة الزمنية)',
    variant: 'danger',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const TRAINEE_CATEGORIES = {
  CIVILIAN: 'Civilian',
  MILITARY_OFFICER: 'MilitaryOfficer',
  MILITARY_FAMILY: 'MilitaryFamily',
  POLICE_OFFICER_OR_FAMILY: 'PoliceOfficerOrFamily',
};

export const TRAINEE_CATEGORY_CONFIG = {
  [TRAINEE_CATEGORIES.CIVILIAN]: {
    label: 'مدني',
    discount: 'سعر كامل',
    bg: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  [TRAINEE_CATEGORIES.MILITARY_OFFICER]: {
    label: 'ضباط القوات المسلحة',
    discount: 'خصم 50%',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  [TRAINEE_CATEGORIES.MILITARY_FAMILY]: {
    label: 'عائلات ضباط ق.م',
    discount: 'خصم 30%',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
  },
  [TRAINEE_CATEGORIES.POLICE_OFFICER_OR_FAMILY]: {
    label: 'ضباط الشرطة وعائلاتهم',
    discount: 'خصم 30%',
    bg: 'bg-blue-50 text-blue-800 border-blue-300',
  },
};
