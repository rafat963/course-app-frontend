import { BookOpen, QrCode, ClipboardList, Award, Calendar } from 'lucide-vue-next';

export const traineeNav = [
  {
    title: 'بوابة خدمات المتدرب',
    items: [
      {
        label: 'تصاريح الدخول (QR)',
        path: '/trainee/passes',
        icon: QrCode,
      },
      {
        label: 'الدورات المتاحة للتقديم',
        path: '/trainee/courses',
        icon: BookOpen,
      },
      {
        label: 'متابعة الطلبات',
        path: '/trainee/applications',
        icon: ClipboardList,
      },
      {
        label: 'الشهادات المعتمدة',
        path: '/trainee/certificates',
        icon: Award,
      },
      {
        label: 'دوراتي وجدولي الدراسي',
        path: '/trainee/schedule',
        icon: Calendar,
      },
    ],
  },
];

export default traineeNav;
