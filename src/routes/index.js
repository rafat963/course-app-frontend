import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/shared/ui/Layout/AppLayout.vue';
import { setupRouteGuards } from './guards';

// 1. Modular routes imports from feature modules
import authRoutes from '@/components/Auth/auth.route';
import dashboardRoutes from '@/components/Dashboard/dashboard.route';
import traineeRoutes from '@/components/Trainee/trainee.route';
import affairsRoutes from '@/components/Affairs/affairs.route';
import securityRoutes from '@/components/Security/security.route';
import adminRoutes from '@/components/Admin/admin.route';

const routes = [
  // Protected Routes within Main App Layout
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'HomeRedirect',
        redirect: (to) => {
          // Defaults to dashboard or feature home
          return '/dashboard';
        },
      },
      ...dashboardRoutes,
      ...traineeRoutes,
      ...affairsRoutes,
      ...securityRoutes,
      ...adminRoutes,
      // Shared cross-feature views
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/shared/components/Notifications/NotificationsView.vue'),
        meta: { title: 'مركز الإشعارات والتنبيهات' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/shared/components/Settings/SettingsView.vue'),
        meta: { title: 'إعدادات الحساب والملف الشخصي' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/shared/components/Settings/SettingsView.vue'),
        meta: { title: 'إعدادات الحساب والملف الشخصي' },
      },
      {
        path: 'trainee-profile/:id?',
        name: 'SharedTraineeProfile',
        component: () => import('@/shared/components/TraineeProfile/TraineeProfileView.vue'),
        meta: { title: 'سجل وبيانات الدارس' },
      },
    ],
  },

  // Public / Standalone Auth Routes (without Sidebar/Header)
  ...authRoutes,

  // 404 Error Catch-All Page
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/shared/ui/ErrorPage.vue'),
    meta: { title: 'الصفحة غير موجودة' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, left: 0 };
  },
});

router.afterEach(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
});

// Attach route guards
setupRouteGuards(router);

export default router;
