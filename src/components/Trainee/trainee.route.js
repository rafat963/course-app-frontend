export default [
  {
    path: 'trainee',
    meta: { roles: ['Trainee', 'Admin'], title: 'بوابة المتدرب' },
    children: [
      {
        path: '',
        redirect: '/trainee/passes',
      },
      {
        path: 'passes',
        name: 'TraineeGatePasses',
        component: () => import('./components/passes/TraineeGatePassesView.vue'),
        meta: { title: 'تصاريح الدخول ورمز QR' },
      },
      {
        path: 'courses',
        name: 'TraineeCourses',
        component: () => import('./components/courses/TraineeCoursesView.vue'),
        meta: { title: 'الدورات المتاحة للتقديم' },
      },
      {
        path: 'applications',
        name: 'TraineeApplications',
        component: () => import('./components/applications/TraineeApplicationsView.vue'),
        meta: { title: 'متابعة الطلبات والمدفوعات' },
      },
      {
        path: 'certificates',
        name: 'TraineeCertificates',
        component: () => import('./components/certificates/TraineeCertificatesView.vue'),
        meta: { title: 'شهاداتي المعتمدة' },
      },
      {
        path: 'schedule',
        name: 'TraineeSchedule',
        component: () => import('./components/schedule/TraineeScheduleView.vue'),
        meta: { title: 'دوراتي الحالية وجدولي' },
      },
      {
        path: 'profile',
        redirect: '/settings',
      },
    ],
  },
];
