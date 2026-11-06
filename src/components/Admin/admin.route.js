export default [
  {
    path: 'admin',
    meta: { roles: ['Admin'], title: 'إدارة النظام' },
    children: [
      {
        path: '',
        redirect: '/admin/users',
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('./components/AdminUsersView.vue'),
        meta: { title: 'إدارة حسابات الموظفين' },
      },
      {
        path: 'halls',
        name: 'AdminHalls',
        component: () => import('./components/AdminHallsView.vue'),
        meta: { title: 'إدارة القاعات والمعامل' },
      },
      {
        path: 'halls-schedule',
        name: 'AdminHallsSchedule',
        component: () => import('./components/AdminHallsScheduleView.vue'),
        meta: { title: 'الجدول الشهري لإشغال القاعات' },
      },
      {
        path: 'audit-logs',
        name: 'AdminAuditLogs',
        component: () => import('./components/AdminAuditLogsView.vue'),
        meta: { title: 'سجل تدقيق النظام' },
      },
    ],
  },
];
