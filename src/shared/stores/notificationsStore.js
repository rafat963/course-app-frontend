import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useNotificationsStore = defineStore('notifications', () => {
  const initialNotifications = [
    {
      id: 1,
      title: 'اقتراب موعد سداد رسوم الدورة (تنبيه عاجل)',
      message: 'متبقي أقل من 24 ساعة لسداد رسوم دورة "الذكاء الاصطناعي وتعلم الآلة" للمتدرب أحمد محمود علي قبل إلغاء الحجز التلقائي وتصعيد المتدرب من قائمة الانتظار.',
      category: 'finance',
      priority: 'urgent',
      isRead: false,
      isStarred: true,
      createdAt: 'منذ 10 دقائق',
      sender: 'شؤون الدارسين — وحدة السداد المالي',
      link: '/affairs/applications/pending-payment',
      actionLabel: 'متابعة السداد',
      referenceId: 'APP-7X9K2',
    },
    {
      id: 2,
      title: 'تم اعتماد 5 طلبات تقديم لدورة الأمن السيبراني',
      message: 'قام مسؤول شؤون الدارسين باعتماد 5 طلبات تقديم جديدة لدورة "الأمن السيبراني والتحقيق الرقمي"، وتحديد المقاعد المحجوزة وتواريخ السداد المقررة.',
      category: 'affairs',
      priority: 'important',
      isRead: false,
      isStarred: false,
      createdAt: 'منذ 35 دقيقة',
      sender: 'إدارة شؤون الدارسين',
      link: '/affairs/applications/applicants',
      actionLabel: 'مراجعة الطلبات',
      referenceId: 'CR-CYBER-2026',
    },
    {
      id: 3,
      title: 'حركة دخول متدرب مصرح له عبر البوابة الشرقية',
      message: 'تم تسجيل حركة مسح QR صحيحة ومصرح بها للمتدرب مصطفى كمال لحضور دورة هندسة الشبكات المتقدمة في تمام 08:45 ص.',
      category: 'security',
      priority: 'normal',
      isRead: false,
      isStarred: false,
      createdAt: 'منذ ساعة',
      sender: 'أمن البوابة — نوبتجية الدخول',
      link: '/security/gate-scan',
      actionLabel: 'سجل البوابة',
      referenceId: 'GATE-LOG-4481',
    },
    {
      id: 4,
      title: 'تغيير قاعة المحاضرات لدورة البرمجة السحابية',
      message: 'نظراً لأعمال الصيانة الدورية بالقاعة السابقة، تم نقل المحاضرات المقررة غداً إلى معمل الحاسب رقم (2) بالطابق الثاني.',
      category: 'courses',
      priority: 'important',
      isRead: true,
      isStarred: false,
      createdAt: 'اليوم 09:15 ص',
      sender: 'إدارة المعامل والقاعات التدريبية',
      link: '/affairs/courses/active',
      actionLabel: 'جدول القاعات',
      referenceId: 'HALL-LAB-02',
    },
    {
      id: 5,
      title: 'تأكيد استلام السداد وتفعيل تصريح الدخول الدائم',
      message: 'تم تسجيل إيصال السداد رقم REC-88421 بنجاح للمتدرب محمود عبد العزيز، وتفعيل تصريح الدخول العسكري الإلكتروني لحضور الدورة.',
      category: 'finance',
      priority: 'success',
      isRead: true,
      isStarred: true,
      createdAt: 'أمس 02:40 م',
      sender: 'الخزينة والمالية',
      link: '/affairs/applications/completed',
      actionLabel: 'عرض الإيصال',
      referenceId: 'REC-88421',
    },
    {
      id: 6,
      title: 'تسجيل دخول ناجح لحسابك بالمنظومة',
      message: 'تم تسجيل الدخول إلى حسابك من متصفح ويب عبر شبكة المعهد الداخلية المؤمنة في تمام 10:15 ص بنجاح.',
      category: 'system',
      priority: 'normal',
      isRead: true,
      isStarred: false,
      createdAt: 'أمس 10:15 ص',
      sender: 'منظومة أمن المعلومات المركزية',
      link: '/settings',
      actionLabel: 'إعدادات الحساب',
      referenceId: 'SEC-AUTH-099',
    },
    {
      id: 7,
      title: 'اكتمال نتائج دورة التحول الرقمي وتجهيز الشهادات',
      message: 'تم اعتماد نتائج الاختبارات النهائية لدورة "التحول الرقمي والحوسبة السحابية" لعدد 32 دارساً، والشهادات المعتمدة جاهزة للطباعة والتسليم.',
      category: 'courses',
      priority: 'success',
      isRead: true,
      isStarred: false,
      createdAt: 'منذ يومين',
      sender: 'قيادة المعهد والامتحانات',
      link: '/affairs/courses/open-registration',
      actionLabel: 'سجل الخريجين',
      referenceId: 'CERT-TR-2026',
    },
  ];

  // Try to load from localStorage
  const saved = localStorage.getItem('isi_notifications');
  let parsed = null;
  try {
    parsed = saved ? JSON.parse(saved) : null;
  } catch {
    parsed = null;
  }

  const notifications = ref(parsed || initialNotifications);

  function persist() {
    try {
      localStorage.setItem('isi_notifications', JSON.stringify(notifications.value));
    } catch {
      // ignore
    }
  }

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.isRead).length;
  });

  const urgentCount = computed(() => {
    return notifications.value.filter((n) => n.priority === 'urgent' && !n.isRead).length;
  });

  function markAsRead(id) {
    const item = notifications.value.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      persist();
    }
  }

  function markAsUnread(id) {
    const item = notifications.value.find((n) => n.id === id);
    if (item) {
      item.isRead = false;
      persist();
    }
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => {
      n.isRead = true;
    });
    persist();
  }

  function toggleStarred(id) {
    const item = notifications.value.find((n) => n.id === id);
    if (item) {
      item.isStarred = !item.isStarred;
      persist();
    }
  }

  function deleteNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
    persist();
  }

  function clearAllRead() {
    notifications.value = notifications.value.filter((n) => !n.isRead);
    persist();
  }

  function resetToDefault() {
    notifications.value = JSON.parse(JSON.stringify(initialNotifications));
    persist();
  }

  return {
    notifications,
    unreadCount,
    urgentCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    toggleStarred,
    deleteNotification,
    clearAllRead,
    resetToDefault,
  };
});
