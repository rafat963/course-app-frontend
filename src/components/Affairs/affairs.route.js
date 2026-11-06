export default [
  {
    path: 'affairs',
    meta: { roles: ['Affairs', 'Admin'], title: 'شؤون الدارسين' },
    children: [
      {
        path: '',
        redirect: '/affairs/dashboard',
      },

      // ----------------- 0. لوحة المعلومات -----------------
      {
        path: 'dashboard',
        name: 'AffairsDashboard',
        component: () => import('./components/AffairsDashboard/AffairsDashboardView.vue'),
        meta: { title: 'لوحة المعلومات' },
      },

      // ----------------- 1. سكشن الطلبات -----------------
      {
        path: 'applications/applicants',
        name: 'ApplicantApplications',
        component: () => import('./components/ApplicantApplications/ApplicantApplicationsView.vue'),
        meta: { title: 'طلبات المتقدمين' },
      },
      {
        path: 'applications/pending-payment',
        name: 'PendingPaymentApplications',
        component: () => import('./components/PendingPaymentApplications/PendingPaymentApplicationsView.vue'),
        meta: { title: 'طلبات في انتظار دفع الرسوم' },
      },
      {
        path: 'applications/completed',
        name: 'CompletedApplications',
        component: () => import('./components/CompletedApplications/CompletedApplicationsView.vue'),
        meta: { title: 'طلبات مكتملة' },
      },
      {
        path: 'gate-attendance/today',
        name: 'TodayGateAttendance',
        component: () => import('./components/TodayGateAttendance/TodayGateAttendanceView.vue'),
        meta: { title: 'حضور البوابة اليوم' },
      },

      // ----------------- 2. سكشن الدورات -----------------
      {
        path: 'courses/all',
        name: 'AllCourses',
        component: () => import('./components/AllCourses/AllCoursesView.vue'),
        meta: { title: 'كل الدورات' },
      },
      {
        path: 'courses/active',
        name: 'ActiveCourses',
        component: () => import('./components/ActiveCourses/ActiveCoursesView.vue'),
        meta: { title: 'الدورات المنعقدة حالياً' },
      },
      {
        path: 'courses/open-registration',
        name: 'OpenRegistrationCourses',
        component: () => import('./components/OpenRegistrationCourses/OpenRegistrationCoursesView.vue'),
        meta: { title: 'الدورات المفتوحة للتسجيل' },
      },
      {
        path: 'courses/archived',
        redirect: '/affairs/courses/open-registration',
      },

      // ----------------- 3. سكشن المحاضرون -----------------
      {
        path: 'instructors/all',
        name: 'AllInstructors',
        component: () => import('./components/AllInstructors/AllInstructorsView.vue'),
        meta: { title: 'جميع المحاضرون' },
      },

      // روابط للتوافق مع الروابط السابقة
      {
        path: 'applications',
        redirect: '/affairs/applications/applicants',
      },
      {
        path: 'courses',
        redirect: '/affairs/courses/all',
      },
      {
        path: 'instructors',
        redirect: '/affairs/instructors/all',
      },
      {
        path: 'attendance',
        redirect: '/affairs/gate-attendance/today',
      },
      {
        path: 'gate-logs',
        redirect: '/affairs/gate-attendance/today',
      },
    ],
  },
];
