/**
 * بيانات الدورات المتاحة للتقديم - Trainee Available Courses Mock Data
 * وفق نموذج الـ ERD: Courses, CourseRounds, CoursePricings, Halls, Instructors, CourseLectureDays
 */

/** @type {Object} بروفايل المتدرب الافتراضي لعرض السعر المناسب لفئته */
export const TRAINEE_MOCK_PROFILE = {
  id: 401,
  userId: 201,
  fullName: 'أحمد سامي إبراهيم مصطفى',
  email: 'ahmed.sami@trainee.institute.local',
  phone: '01012345678',
  nationalId: '29901150103412',
  category: 'Civilian', // Civilian | MilitaryOfficer | MilitaryFamily | PoliceOfficerOrFamily
  gender: 'Male',
  governorate: 'القاهرة',
  occupation: 'مهندس حاسبات ونظم معلومات',
  qualification: 'بكالوريوس هندسة الحاسبات ونظم التحكم - دفعة 2014',
  qualificationPhotoPath:
    'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&auto=format&fit=crop&q=80',
  profilePhotoPath: null,
};

/**
 * الدورات المتاحة للتقديم - قائمة منقحة وواقعية مطابقة لنموذج الـ ERD
 * تم استبعاد الكورسات الوهمية وغير المطلوبة (مثل دورة تدريبية، تحليل البيانات المتقدم، إدارة المشروعات الاحترافية)
 * @type {Array<Object>}
 */
export const AVAILABLE_ROUNDS = [
  // ==========================================
  // 1. الأمن السيبراني CEH v12 - الدفعة 15 (متاحة)
  // ==========================================
  {
    id: 201,
    courseId: 1,
    courseCode: 'CRS-CYBER-01',
    courseName: 'الأمن السيبراني واختبار الاختراق المتقدم CEH v12',
    courseDomain: 'أمن سيبراني',
    courseDescription:
      'تأهيل المتدربين لاحتراف الأمن السيبراني، الفحص الأمني الشامل، التحقيق الجنائي الرقمي، واكتشاف الثغرات في الأنظمة والشبكات بأدوات الصناعة العالمية. يغطي البرنامج: اختبار الاختراق، تحليل الشبكات، أمن الويب، والتصدي للهجمات المتقدمة APT.',
    totalHours: 60,
    passingGrade: 70,
    roundNumber: 15,
    roundCode: 'CR-1-15',
    instructor: {
      id: 1,
      name: 'د. طارق عبد الرحمن الجندي',
      specialty: 'أمن سيبراني واختبار اختراق متقدم - CEH, CISSP',
    },
    hall: {
      id: 1,
      name: 'معمل الأمن السيبراني والشبكات (معمل 1)',
      location: 'المبنى التقني - الطابق الثاني',
      type: 'Lab',
      maxCapacity: 25,
    },
    capacity: 25,
    enrolledCount: 8,
    startDate: '2026-11-20',
    endDate: '2026-12-30',
    lastApplicationDate: '2026-11-14',
    startTime: '09:00',
    endTime: '13:00',
    lectureDays: ['Sat', 'Mon'], // يومان أسبوعياً
    status: 'Available',
    totalLectures: 16,
    pricings: {
      Civilian: 4200,
      MilitaryOfficer: 2100,
      MilitaryFamily: 2500,
      PoliceOfficerOrFamily: 2750,
    },
  },

  // ==========================================
  // 2. تطوير تطبيقات الويب Full Stack - الدفعة 8 (متاحة)
  // ==========================================
  {
    id: 204,
    courseId: 5,
    courseCode: 'CRS-WEB-05',
    courseName: 'تطوير تطبيقات الويب المتكاملة Full Stack (Vue & Node.js)',
    courseDomain: 'تطوير الويب',
    courseDescription:
      'بناء تطبيقات الويب الحديثة والمؤسسية باستخدام Vue.js 3 و Node.js و Express مع قواعد البيانات وتأمين واجهات برمجة التطبيقات RESTful APIs ونشرها سحابياً.',
    totalHours: 64,
    passingGrade: 65,
    roundNumber: 8,
    roundCode: 'CR-5-8',
    instructor: {
      id: 5,
      name: 'د. ياسمين خالد سالم',
      specialty: 'تطوير تطبيقات الويب Full Stack - Vue, React, Node',
    },
    hall: {
      id: 3,
      name: 'معمل البرمجيات وتطوير الويب (معمل 3)',
      location: 'المبنى التقني - الطابق الثالث',
      type: 'Lab',
      maxCapacity: 28,
    },
    capacity: 28,
    enrolledCount: 14,
    startDate: '2026-11-25',
    endDate: '2027-01-08',
    lastApplicationDate: '2026-11-18',
    startTime: '17:00',
    endTime: '21:00',
    lectureDays: ['Sun', 'Tue'], // يومان أسبوعياً
    status: 'Available',
    totalLectures: 16,
    pricings: {
      Civilian: 4000,
      MilitaryOfficer: 2000,
      MilitaryFamily: 2400,
      PoliceOfficerOrFamily: 2600,
    },
  },

  // ==========================================
  // 3. إدارة الشبكات المتقدمة Cisco CCNA - الدفعة 14 (متاحة)
  // ==========================================
  {
    id: 205,
    courseId: 4,
    courseCode: 'CRS-NET-04',
    courseName: 'إدارة الشبكات المتقدمة Cisco CCNA 200-301',
    courseDomain: 'شبكات وسحابة',
    courseDescription:
      'بناء وإدارة البنية التحتية للشبكات المؤسسية، بروتوكولات التوجيه والتبديل، أمن المنافذ وجدران الحماية، والتحكم في الشبكات المعرفة برمجياً SDN.',
    totalHours: 60,
    passingGrade: 70,
    roundNumber: 14,
    roundCode: 'CR-4-14',
    instructor: {
      id: 4,
      name: 'م. مصطفى الشناوي',
      specialty: 'شبكات وسحابة إلكترونية - CCNA, CCNP, AWS',
    },
    hall: {
      id: 4,
      name: 'معمل النظم والشبكات المتطورة (معمل 4)',
      location: 'المبنى التقني - الطابق الأول',
      type: 'Lab',
      maxCapacity: 24,
    },
    capacity: 22,
    enrolledCount: 10,
    startDate: '2026-12-01',
    endDate: '2027-01-20',
    lastApplicationDate: '2026-11-24',
    startTime: '16:00',
    endTime: '20:00',
    lectureDays: ['Mon', 'Wed'], // يومان أسبوعياً
    status: 'Available',
    totalLectures: 16,
    pricings: {
      Civilian: 3500,
      MilitaryOfficer: 1750,
      MilitaryFamily: 2100,
      PoliceOfficerOrFamily: 2300,
    },
  },
];

/** سجل التدقيق المحلي (في الذاكرة فقط) */
export const MOCK_AUDIT_LOGS = [];

/** طلبات التقديم المحلية (في الذاكرة فقط) */
export const MOCK_APPLICATIONS = [];
