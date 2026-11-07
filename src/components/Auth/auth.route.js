export default [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('./components/LoginView.vue'),
    meta: { requiresAuth: false, title: 'تسجيل الدخول' },
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('./components/register/RegisterView.vue'),
    meta: { requiresAuth: false, title: 'إنشاء حساب متدرب جديد' },
  },
];
