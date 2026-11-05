/**
 * Application User Roles and Default Routes
 */
export const ROLES = {
  ADMIN: 'Admin',
  TRAINEE: 'Trainee',
  AFFAIRS: 'Affairs',
  SECURITY: 'Security',
  COMMANDER: 'Commander',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'مسؤول النظام',
  [ROLES.TRAINEE]: 'المتدرب',
  [ROLES.AFFAIRS]: 'شؤون الدارسين',
  [ROLES.SECURITY]: 'الأمن والحراسة',
  [ROLES.COMMANDER]: 'القائد / الإدارة العليا',
};

export const DEFAULT_ROLE_ROUTES = {
  [ROLES.ADMIN]: '/admin/users',
  [ROLES.TRAINEE]: '/trainee/passes',
  [ROLES.AFFAIRS]: '/affairs/applications/applicants',
  [ROLES.SECURITY]: '/security/gate-scan',
  [ROLES.COMMANDER]: '/dashboard',
};
