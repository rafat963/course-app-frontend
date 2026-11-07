/**
 * Centralized Environment Configuration
 */
export const env = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5218/api/v1',
  appTitle: 'معهد نظم المعلومات - القوات المسلحة',
  subTitle: 'منظومة إدارة الدورات التدريبية',
  instituteName: 'معهد نظم المعلومات - القوات المسلحة',
  isProduction: import.meta.env.PROD,
  tokenKey: 'sys_auth_token',
  userKey: 'sys_auth_user',
};
