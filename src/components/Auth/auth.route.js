export default [
  {
    path: '/auth',
    component: () => import('./AuthLayout.vue'),
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('./components/LoginView.vue'),
        meta: { requiresAuth: false, title: 'تسجيل الدخول', authOrder: 1 },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('./components/register/RegisterView.vue'),
        meta: { requiresAuth: false, title: 'إنشاء حساب متدرب جديد', authOrder: 2 },
      },
    ],
  },
];
