import { Users, Building2, CalendarDays, ShieldCheck } from 'lucide-vue-next';

export const adminNav = [
  {
    title: 'لوحة تحكم مسؤول النظام',
    items: [
      {
        label: 'إدارة حسابات المستخدمين',
        path: '/admin/users',
        icon: Users,
      },
      {
        label: 'القاعات والمعامل التدريبية',
        path: '/admin/halls',
        icon: Building2,
      },
      {
        label: 'الجدول الشهري لإشغال القاعات',
        path: '/admin/halls-schedule',
        icon: CalendarDays,
      },
      // {
      //   label: 'سجل تدقيق وحركات البوابة',
      //   path: '/admin/audit-logs',
      //   icon: ShieldCheck,
      // },
    ],
  },
];

export default adminNav;
