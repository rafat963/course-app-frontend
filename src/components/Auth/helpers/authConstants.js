import { TRAINEE_CATEGORIES } from '@/shared/constants/statuses';

/**
 * All 27 Egyptian Governorates
 */
export const EGYPTIAN_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'البحيرة',
  'الغربية',
  'المنوفية',
  'الشرقية',
  'الدقهلية',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'شمال سيناء',
  'جنوب سيناء',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
];

/**
 * Trainee Category Pricing Options with Descriptions and Badges
 */
export const TRAINEE_CATEGORY_OPTIONS = [
  {
    value: TRAINEE_CATEGORIES.CIVILIAN,
    label: 'مدني',
    discount: 'السعر الكامل',
    desc: 'لجميع المواطنين والخريجين والطلاب المدنيين',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  {
    value: TRAINEE_CATEGORIES.MILITARY_OFFICER,
    label: 'ضباط القوات المسلحة',
    discount: 'خصم 50%',
    desc: 'ضباط القوات المسلحة العاملين والمتقاعدين',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  },
  {
    value: TRAINEE_CATEGORIES.MILITARY_FAMILY,
    label: 'عائلات ضباط ق.م',
    discount: 'خصم 30%',
    desc: 'الزوجة والأبناء لضباط القوات المسلحة',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
  },
  {
    value: TRAINEE_CATEGORIES.POLICE_OFFICER_OR_FAMILY,
    label: 'ضباط وعائلات الشرطة',
    discount: 'خصم 30%',
    desc: 'ضباط هيئة الشرطة المدنية وأسرهم',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-300',
  },
];

/**
 * Gender Options
 */
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'ذكر' },
  { value: 'Female', label: 'أنثى' },
];

/**
 * Religion Options
 */
export const RELIGION_OPTIONS = [
  { value: 'Muslim', label: 'مسلم' },
  { value: 'Christian', label: 'مسيحي' },
  { value: 'Other', label: 'أخرى' },
];

/**
 * Marital Status Options
 */
export const MARITAL_STATUS_OPTIONS = [
  { value: 'Single', label: 'أعزب / آنسة' },
  { value: 'Married', label: 'متزوج / متزوجة' },
  { value: 'Divorced', label: 'مطلق / مطلقة' },
  { value: 'Widowed', label: 'أرمل / أرملة' },
];

/**
 * Trainee Type Options (Adult vs Minor)
 */
export const TRAINEE_TYPE = {
  ADULT: 'adult',
  MINOR: 'minor',
};

/**
 * Guardian Relationship Options
 */
export const GUARDIAN_RELATIONSHIPS = [
  { value: 'Father', label: 'أب' },
  { value: 'Mother', label: 'أم' },
  { value: 'LegalGuardian', label: 'وصي قانوني' },
];

/**
 * Education Stage Options
 */
export const EDUCATION_STAGES = [
  { value: 'Primary', label: 'ابتدائي' },
  { value: 'Preparatory', label: 'إعدادي' },
  { value: 'Secondary', label: 'ثانوي' },
];

/**
 * Smart Auto-Extraction from Egyptian 14-digit National ID
 * Returns { dateOfBirth, gender } or null if invalid
 */
export function extractFromNationalId(nid) {
  if (!nid || nid.length !== 14 || !/^\d{14}$/.test(nid)) return null;

  const centuryDigit = parseInt(nid[0], 10);
  if (centuryDigit !== 2 && centuryDigit !== 3) return null;

  const century = centuryDigit === 2 ? '19' : '20';
  const year = century + nid.substring(1, 3);
  const month = nid.substring(3, 5);
  const day = nid.substring(5, 7);

  const dateOfBirth = `${year}-${month}-${day}`;
  const genderDigit = parseInt(nid[12], 10);
  const gender = genderDigit % 2 !== 0 ? 'Male' : 'Female';

  return { dateOfBirth, gender };
}
