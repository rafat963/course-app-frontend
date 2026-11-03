import { QrCode, BookOpen, Award } from 'lucide-vue-next';

export const traineeNav = [
  {
    title: 'بوابة خدمات المتدرب',
    items: [
      {
        label: 'طلباتي وتصاريح الدخول (QR)',
        path: '/trainee/applications',
        icon: QrCode,
      },
      {
        label: 'الدورات المتاحة',
        path: '/trainee/courses',
        icon: BookOpen,
      },
      {
        label: 'شهاداتي المعتمدة',
        path: '/trainee/certificates',
        icon: Award,
      },
    ],
  },
];

export default traineeNav;
