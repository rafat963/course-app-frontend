/**
 * بيانات بوابة المتدرب — متوافقة مع ERD
 * Applications + CourseRounds + CourseLectureDays + Halls + Instructors + CoursePricings
 * تُستخدم في صفحات: متابعة الطلبات، تصاريح الدخول (QR)، دوراتي وجدولي، الشهادات.
 */

export const PORTAL_TODAY = '2026-11-06';

/**
 * طلبات المتدرب — مجموعة منقحة وواقعية من 3 طلبات بالضبط:
 * 1. مقيد بالدورة (Enrolled)
 * 2. في انتظار السداد (PendingPayment)
 * 3. مرفوض (Rejected)
 */
export const TRAINEE_APPLICATIONS = [
  // ============================================================
  // 1. قيد المراجعة لدى شؤون الدارسين (UnderReview) — تطوير الويب Full Stack
  // ============================================================
  {
    id: 901,
    applicationCode: 'APP-9W2M4',
    status: 'UnderReview',
    createdAt: '2026-11-04T09:30:00',
    updatedAt: '2026-11-04T09:30:00',
    qrToken: '3a1b2c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6e',
    rejectionReason: null,
    paymentDueDate: null,
    paymentDate: null,
    receiptNumber: null,
    paidAmount: null,
    certificateCode: null,
    finalGrade: null,
    isCertificateIssued: false,
    extensionCount: 0,
    round: {
      courseRoundId: 217,
      courseName: 'تطوير تطبيقات الويب المتكاملة Full Stack (Vue & Node.js)',
      courseCode: 'CRS-WEB-05',
      courseDomain: 'تطوير الويب',
      roundNumber: 7,
      roundCode: 'CR-5-7',
      startDate: '2026-11-25',
      endDate: '2027-01-10',
      startTime: '16:00',
      endTime: '20:00',
      lectureDays: ['Sun', 'Tue'], // يومان أسبوعياً
      totalLectures: 16,
      passingGrade: 65,
      capacity: 25,
      enrolledCount: 14,
      hall: { name: 'معمل البرمجيات وتطوير الويب (معمل 3)', location: 'المبنى التقني - الطابق الثالث' },
      instructor: { name: 'د. ياسمين خالد سالم', specialty: 'تطوير تطبيقات الويب Full Stack - Vue, React, Node' },
      pricings: { Civilian: 3800, MilitaryOfficer: 1900, MilitaryFamily: 2300, PoliceOfficerOrFamily: 2500 },
    },
  },

  // ============================================================
  // 2. في انتظار السداد بالخزينة — مهلة قريبة عاجلة (CR-1-15)
  // ============================================================
  {
    id: 903,
    applicationCode: 'APP-7X9K2',
    status: 'PendingPayment',
    createdAt: '2026-10-28T11:05:00',
    updatedAt: '2026-10-29T08:40:00',
    qrToken: 'd13b6a45-9c28-4e71-b0f6-aa27c4e91d08',
    rejectionReason: null,
    paymentDueDate: '2026-11-09',
    paymentDate: null,
    receiptNumber: null,
    paidAmount: null,
    certificateCode: null,
    finalGrade: null,
    isCertificateIssued: false,
    extensionCount: 0,
    round: {
      courseRoundId: 201,
      courseName: 'الأمن السيبراني واختبار الاختراق المتقدم CEH v12',
      courseCode: 'CRS-CYBER-01',
      courseDomain: 'أمن سيبراني',
      roundNumber: 15,
      roundCode: 'CR-1-15',
      startDate: '2026-11-20',
      endDate: '2026-12-30',
      startTime: '09:00',
      endTime: '13:00',
      lectureDays: ['Sun', 'Tue'], // يومان أسبوعياً
      totalLectures: 16,
      passingGrade: 70,
      capacity: 25,
      enrolledCount: 8,
      hall: { name: 'معمل الأمن السيبراني والشبكات (معمل 1)', location: 'المبنى التقني - الطابق الثاني' },
      instructor: { name: 'د. طارق عبد الرحمن الجندي', specialty: 'أمن سيبراني واختبار اختراق متقدم - CEH, CISSP' },
      pricings: { Civilian: 4200, MilitaryOfficer: 2100, MilitaryFamily: 2500, PoliceOfficerOrFamily: 2750 },
    },
  },

  // ============================================================
  // 3. مرفوض — التسويق الرقمي (عدم استيفاء شرط المؤهل التخصصي)
  // ============================================================
  {
    id: 905,
    applicationCode: 'APP-3C8N5',
    status: 'Rejected',
    createdAt: '2026-10-20T12:48:00',
    updatedAt: '2026-10-23T09:15:00',
    qrToken: 'b08e5d32-16f4-4a9c-8d27-3c904b6e1f75',
    rejectionReason:
      'عدم استيفاء شرط المؤهل الدراسي المطلوب للدورة، حيث يشترط البرنامج مؤهلاً هندسياً أو تخصصياً معتمداً. يمكنك التقديم على دورة أخرى مناسبة أو مراجعة شؤون الدارسين.',
    paymentDueDate: null,
    paymentDate: null,
    receiptNumber: null,
    paidAmount: null,
    certificateCode: null,
    finalGrade: null,
    isCertificateIssued: false,
    extensionCount: 0,
    round: {
      courseRoundId: 206,
      courseName: 'التسويق الرقمي وإدارة الحملات الإعلانية المتقدمة',
      courseCode: 'CRS-MKT-06',
      courseDomain: 'تسويق رقمي',
      roundNumber: 10,
      roundCode: 'CR-6-10',
      startDate: '2026-11-10',
      endDate: '2026-12-20',
      startTime: '10:00',
      endTime: '14:00',
      lectureDays: ['Mon', 'Wed'], // يومان أسبوعياً
      totalLectures: 16,
      passingGrade: 60,
      capacity: 30,
      enrolledCount: 30,
      hall: { name: 'قاعة المحاضرات المركزية الكبرى (قاعة أ)', location: 'المبنى الإداري - الدور الأول' },
      instructor: { name: 'م. كريم الدين ممدوح', specialty: 'تسويق رقمي وإعلانات ممولة - Google, Meta' },
      pricings: { Civilian: 3200, MilitaryOfficer: 1600, MilitaryFamily: 1900, PoliceOfficerOrFamily: 2100 },
    },
  },

  // ============================================================
  // 4. مقيد بالدورة ومسدد للرسوم (Enrolled) — CEH v12 (CR-1-13) جارية الآن
  // تنتقل تلقائياً لجدول دوراتي الدراسي عند اكتمال المرحلة الرابعة
  // ============================================================
  {
    id: 906,
    applicationCode: 'APP-5D1P6',
    status: 'Enrolled',
    createdAt: '2026-09-28T10:18:00',
    updatedAt: '2026-10-10T11:20:00',
    qrToken: '7f8a9b0c-1d2e-4c3b-9a55-1e2f3a4b5c6d',
    rejectionReason: null,
    paymentDueDate: '2026-10-08',
    paymentDate: '2026-10-10T11:20:00',
    receiptNumber: 'REC-2026-10492',
    paidAmount: 4200,
    certificateCode: null,
    finalGrade: null,
    isCertificateIssued: false,
    extensionCount: 0,
    attendedLectures: 11,
    round: {
      courseRoundId: 211,
      courseName: 'الأمن السيبراني واختبار الاختراق المتقدم CEH v12',
      courseCode: 'CRS-CYBER-01',
      courseDomain: 'أمن سيبراني',
      roundNumber: 13,
      roundCode: 'CR-1-13',
      startDate: '2026-10-15',
      endDate: '2026-11-28',
      startTime: '09:00',
      endTime: '13:00',
      lectureDays: ['Sat', 'Mon'], // يومان أسبوعياً
      totalLectures: 16,
      passingGrade: 70,
      capacity: 25,
      enrolledCount: 24,
      hall: { name: 'معمل الأمن السيبراني والشبكات (معمل 1)', location: 'المبنى التقني - الطابق الثاني' },
      instructor: { name: 'د. طارق عبد الرحمن الجندي', specialty: 'أمن سيبراني واختبار اختراق متقدم - CEH, CISSP' },
      pricings: { Civilian: 4200, MilitaryOfficer: 2100, MilitaryFamily: 2500, PoliceOfficerOrFamily: 2750 },
    },
  },
];

/** الدورات الجارية (مقيد بالدورة) — لصفحة دوراتي وجدولي وتصاريح الدخول */
export const ONGOING_APPLICATIONS = TRAINEE_APPLICATIONS.filter((a) => a.status === 'Enrolled');

/** الدورات المنتهية — لصفحة الشهادات المعتمدة */
export const ENDED_APPLICATIONS = [
  {
    id: 908,
    applicationCode: 'APP-1A3T9',
    status: 'CourseEnded',
    createdAt: '2026-05-18T08:45:00',
    updatedAt: '2026-08-20T10:00:00',
    qrToken: '5c1e8f02-73a4-4b95-a6d8-20f4b7c93e16',
    rejectionReason: null,
    paymentDueDate: '2026-05-30',
    paymentDate: '2026-05-25T10:00:00',
    receiptNumber: 'REC-2025-08119',
    paidAmount: 3800,
    certificateCode: 'CERT-FS-2026-0042',
    finalGrade: 94,
    isCertificateIssued: true,
    certificateIssuedAt: '2026-08-20',
    extensionCount: 0,
    attendedLectures: 16,
    round: {
      courseRoundId: 216,
      courseName: 'تطوير تطبيقات الويب المتكاملة Full Stack (Vue & Node.js)',
      courseCode: 'CRS-WEB-05',
      courseDomain: 'تطوير الويب',
      roundNumber: 6,
      roundCode: 'CR-5-6',
      startDate: '2026-06-01',
      endDate: '2026-08-15',
      startTime: '17:00',
      endTime: '21:00',
      lectureDays: ['Sun', 'Tue'], // يومان أسبوعياً
      totalLectures: 16,
      passingGrade: 65,
      capacity: 28,
      enrolledCount: 28,
      hall: { name: 'معمل البرمجيات وتطوير الويب (معمل 3)', location: 'المبنى التقني - الطابق الثالث' },
      instructor: { name: 'د. ياسمين خالد سالم', specialty: 'تطوير تطبيقات الويب Full Stack - Vue, React, Node' },
      pricings: { Civilian: 3800, MilitaryOfficer: 1900, MilitaryFamily: 2300, PoliceOfficerOrFamily: 2500 },
    },
  },
];
