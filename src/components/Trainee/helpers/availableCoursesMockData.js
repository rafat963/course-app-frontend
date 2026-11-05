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
 * الدورات المتاحة للتقديم - قائمة منقحة ومركزة تجمع بيانات الدورات والقاعات والأسعار
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
    lectureDays: ['Sat', 'Mon', 'Wed'],
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
  // 2. تحليل البيانات Python & Power BI - الدفعة 9 (متاحة)
  // ==========================================
  {
    id: 202,
    courseId: 2,
    courseCode: 'CRS-DATA-02',
    courseName: 'تحليل البيانات المتقدم باستخدام Python و Power BI',
    courseDomain: 'تحليل البيانات',
    courseDescription:
      'معالجة البيانات الضخمة، النمذجة الإحصائية، بناء لوحات التحكم التفاعلية، واستخراج المؤشرات الاستراتيجية لصناع القرار. يشمل: Pandas, NumPy, Power BI Desktop، والتحليل التنبؤي المتقدم.',
    totalHours: 50,
    passingGrade: 65,
    roundNumber: 9,
    roundCode: 'CR-2-9',
    instructor: {
      id: 2,
      name: 'م. سارة محمود عزت',
      specialty: 'تحليل البيانات وذكاء الأعمال - Power BI, Python',
    },
    hall: {
      id: 2,
      name: 'معمل الذكاء الاصطناعي وتحليل البيانات (معمل 2)',
      location: 'المبنى التقني - الطابق الثاني',
      type: 'Lab',
      maxCapacity: 28,
    },
    capacity: 26,
    enrolledCount: 11,
    startDate: '2026-11-30',
    endDate: '2027-01-15',
    lastApplicationDate: '2026-11-22',
    startTime: '10:00',
    endTime: '14:00',
    lectureDays: ['Sun', 'Tue', 'Thu'],
    status: 'Available',
    totalLectures: 18,
    pricings: {
      Civilian: 3800,
      MilitaryOfficer: 1900,
      MilitaryFamily: 2300,
      PoliceOfficerOrFamily: 2500,
    },
  },

  // ==========================================
  // 3. إدارة المشروعات PMP - الدفعة 22 (متاحة)
  // ==========================================
  {
    id: 203,
    courseId: 3,
    courseCode: 'CRS-PMP-03',
    courseName: 'إدارة المشروعات الاحترافية PMP الإصدار السابع',
    courseDomain: 'إدارة مشروعات',
    courseDescription:
      'المنهجية الاحترافية العالمية لإدارة المشروعات وفق PMI الإصدار السابع، إدارة المخاطر، الجداول الزمنية، الميزانيات، ونماذج العمل الرشيقة Agile & Hybrid. شامل للتأهيل لاجتياز شهادة PMP الدولية.',
    totalHours: 45,
    passingGrade: 60,
    roundNumber: 22,
    roundCode: 'CR-3-22',
    instructor: {
      id: 3,
      name: 'د. أحمد كمال الدين الشريف',
      specialty: 'إدارة مشروعات احترافية - PMP, PMI-ACP, Agile',
    },
    hall: {
      id: 5,
      name: 'قاعة إدارة الأعمال والمشروعات (قاعة ب)',
      location: 'المبنى الإداري - الدور الثاني',
      type: 'Hall',
      maxCapacity: 35,
    },
    capacity: 32,
    enrolledCount: 19,
    startDate: '2026-12-07',
    endDate: '2027-01-28',
    lastApplicationDate: '2026-11-30',
    startTime: '09:00',
    endTime: '13:00',
    lectureDays: ['Sun', 'Tue', 'Thu'],
    status: 'Available',
    totalLectures: 18,
    pricings: {
      Civilian: 4500,
      MilitaryOfficer: 2250,
      MilitaryFamily: 2700,
      PoliceOfficerOrFamily: 2900,
    },
  },

  // ==========================================
  // 4. شبكات Cisco CCNA - الدفعة 12 (مكتملة المقاعد)
  // ==========================================
  {
    id: 205,
    courseId: 4,
    courseCode: 'CRS-NET-04',
    courseName: 'إدارة الشبكات المتقدمة Cisco CCNA 200-301',
    courseDomain: 'شبكات وسحابة',
    courseDescription:
      'بناء وإدارة البنية التحتية للشبكات المؤسسية، بروتوكولات التوجيه والتبديل، أمن المنافذ وجدران الحماية، والتحكم في الشبكات المعرفة برمجياً SDN. تأهيل لاجتياز CCNA 200-301.',
    totalHours: 60,
    passingGrade: 70,
    roundNumber: 12,
    roundCode: 'CR-4-12',
    instructor: {
      id: 4,
      name: 'م. مصطفى الشناوي',
      specialty: 'شبكات وسحابة إلكترونية - CCNA, CCNP, AWS',
    },
    hall: {
      id: 6,
      name: 'معمل النظم والشبكات المتطورة (معمل 4)',
      location: 'المبنى التقني - الطابق الأول',
      type: 'Lab',
      maxCapacity: 22,
    },
    capacity: 20,
    enrolledCount: 20,
    startDate: '2026-11-15',
    endDate: '2027-01-10',
    lastApplicationDate: '2026-11-08',
    startTime: '16:00',
    endTime: '20:00',
    lectureDays: ['Sat', 'Mon', 'Wed'],
    status: 'Full',
    totalLectures: 20,
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
