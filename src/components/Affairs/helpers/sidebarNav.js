import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle2,
  DoorOpen,
  BookOpen,
  PlayCircle,
  CalendarCheck,
  GraduationCap,
} from 'lucide-vue-next';

export const affairsNav = [
  // الرئيسية: لوحة المعلومات
  {
    title: 'الرئيسية',
    items: [
      {
        label: 'لوحة المعلومات',
        path: '/affairs/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  // 1. عنوان فرعي: الطلبات
  {
    title: 'الطلبات',
    items: [
      {
        label: 'طلبات المتقدمين',
        path: '/affairs/applications/applicants',
        icon: FileText,
      },
      {
        label: 'طلبات في انتظار دفع الرسوم',
        path: '/affairs/applications/pending-payment',
        icon: Clock,
      },
      {
        label: 'طلبات مكتملة',
        path: '/affairs/applications/completed',
        icon: CheckCircle2,
      },
      {
        label: 'حضور البوابة اليوم',
        path: '/affairs/gate-attendance/today',
        icon: DoorOpen,
      },
    ],
  },
  // 2. عنوان فرعي: الدورات
  {
    title: 'الدورات',
    items: [
      {
        label: 'كل الدورات',
        path: '/affairs/courses/all',
        icon: BookOpen,
      },
      {
        label: 'الدورات المنعقدة حالياً',
        path: '/affairs/courses/active',
        icon: PlayCircle,
      },
      {
        label: 'الدورات المفتوحة للتسجيل',
        path: '/affairs/courses/open-registration',
        icon: CalendarCheck,
      },
    ],
  },
  // 3. عنوان فرعي: المحاضرون
  {
    title: 'المحاضرون',
    items: [
      {
        label: 'جميع المحاضرين',
        path: '/affairs/instructors/all',
        icon: GraduationCap,
      },
    ],
  },
];

export default affairsNav;
