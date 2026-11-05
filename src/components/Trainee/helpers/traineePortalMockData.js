/**
 * بيانات بوابة المتدرب — متوافقة مع ERD
 * Applications + CourseRounds + CourseLectureDays + Halls + Instructors + CoursePricings
 * تُستخدم في صفحات: متابعة الطلبات، تصاريح الدخول (QR)، دوراتي وجدولي، الشهادات.
 */

export const PORTAL_TODAY = '2026-11-05';

/** طلبات المتدرب مع بيانات دفعة الانعقاد المرتبطة بها — مجموعة منقحة ومركزة */
export const TRAINEE_APPLICATIONS = [
  // ============================================================
  // 1. قيد المراجعة — Full Stack (الدفعة 7)
  // ============================================================
  {
    id: 901,
    applicationCode: 'APP-Q7K2M',
    status: 'UnderReview',
    createdAt: '2026-11-01T09:24:00',
    updatedAt: '2026-11-01T09:24:00',
    qrToken: 'a41c9d70-2b6e-4f18-9c33-0d5a7e2f8b14',
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
      courseRoundId: 204,
      courseName: 'تطوير تطبيقات الويب المتكاملة Full Stack (Vue & Node.js)',
      courseCode: 'CRS-WEB-05',
      courseDomain: 'تطوير الويب',
      roundNumber: 7,
      roundCode: 'CR-5-7',
      startDate: '2026-11-25',
      endDate: '2027-01-05',
      startTime: '17:00',
      endTime: '21:00',
      lectureDays: ['Sun', 'Tue', 'Thu'],
      totalLectures: 20,
      passingGrade: 65,
      capacity: 28,
      enrolledCount: 12,
      hall: { name: 'معمل البرمجيات وتطوير الويب (معمل 3)', location: 'المبنى التقني - الطابق الثالث' },
      instructor: { name: 'د. ياسمين خالد سالم', specialty: 'تطوير تطبيقات الويب Full Stack - Vue, React, Node' },
      pricings: { Civilian: 4000, MilitaryOfficer: 2000, MilitaryFamily: 2400, PoliceOfficerOrFamily: 2600 },
    },
  },

  // ============================================================
  // 2. في انتظار السداد — مهلة قريبة عاجلة (CEH CR-1-15)
  // ============================================================
  {
    id: 903,
    applicationCode: 'APP-7X9K2',
    status: 'PendingPayment',
    createdAt: '2026-10-28T11:05:00',
    updatedAt: '2026-10-29T08:40:00',
    qrToken: 'd13b6a45-9c28-4e71-b0f6-aa27c4e91d08',
    rejectionReason: null,
    paymentDueDate: '2026-11-08',
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
      lectureDays: ['Sat', 'Mon', 'Wed'],
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
  // 3. مقيد بالدورة — CEH v12 (CR-1-13) جارية الآن
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
      lectureDays: ['Sat', 'Mon', 'Wed'],
      totalLectures: 18,
      passingGrade: 70,
      capacity: 25,
      enrolledCount: 24,
      hall: { name: 'معمل الأمن السيبراني والشبكات (معمل 1)', location: 'المبنى التقني - الطابق الثاني' },
      instructor: { name: 'د. طارق عبد الرحمن الجندي', specialty: 'أمن سيبراني واختبار اختراق متقدم - CEH, CISSP' },
      pricings: { Civilian: 4200, MilitaryOfficer: 2100, MilitaryFamily: 2500, PoliceOfficerOrFamily: 2750 },
    },
  },

  // ============================================================
  // 4. مقيد بالدورة — CCNA 200-301 (CR-4-13) جارية ولها محاضرة اليوم الخميس
  // ============================================================
  {
    id: 907,
    applicationCode: 'APP-2F6R4',
    status: 'Enrolled',
    createdAt: '2026-09-02T09:05:00',
    updatedAt: '2026-09-14T12:30:00',
    qrToken: '3a9d1c74-58b2-4f60-8c19-6e40d7b25a93',
    rejectionReason: null,
    paymentDueDate: '2026-09-12',
    paymentDate: '2026-09-14T12:30:00',
    receiptNumber: 'REC-2026-09877',
    paidAmount: 3500,
    certificateCode: null,
    finalGrade: null,
    isCertificateIssued: false,
    extensionCount: 0,
    attendedLectures: 14,
    round: {
      courseRoundId: 212,
      courseName: 'إدارة الشبكات المتقدمة Cisco CCNA 200-301',
      courseCode: 'CRS-NET-04',
      courseDomain: 'شبكات وسحابة',
      roundNumber: 13,
      roundCode: 'CR-4-13',
      startDate: '2026-09-20',
      endDate: '2026-12-10',
      startTime: '17:00',
      endTime: '21:00',
      lectureDays: ['Sun', 'Tue', 'Thu'],
      totalLectures: 20,
      passingGrade: 70,
      capacity: 22,
      enrolledCount: 21,
      hall: { name: 'معمل النظم والشبكات المتطورة (معمل 4)', location: 'المبنى التقني - الطابق الأول' },
      instructor: { name: 'م. مصطفى الشناوي', specialty: 'شبكات وسحابة إلكترونية - CCNA, CCNP, AWS' },
      pricings: { Civilian: 3500, MilitaryOfficer: 1750, MilitaryFamily: 2100, PoliceOfficerOrFamily: 2300 },
    },
  },

  // ============================================================
  // 5. انتهت الدورة — Full Stack (شهادة رسمية صادرة بنجاح)
  // ============================================================
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
    attendedLectures: 23,
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
      lectureDays: ['Sun', 'Tue', 'Thu'],
      totalLectures: 24,
      passingGrade: 65,
      capacity: 28,
      enrolledCount: 28,
      hall: { name: 'معمل البرمجيات وتطوير الويب (معمل 3)', location: 'المبنى التقني - الطابق الثالث' },
      instructor: { name: 'د. ياسمين خالد سالم', specialty: 'تطوير تطبيقات الويب Full Stack - Vue, React, Node' },
      pricings: { Civilian: 3800, MilitaryOfficer: 1900, MilitaryFamily: 2300, PoliceOfficerOrFamily: 2500 },
    },
  },

  // ============================================================
  // 6. مرفوض — التسويق الرقمي (شرط المؤهل الدراسي)
  // ============================================================
  {
    id: 905,
    applicationCode: 'APP-3C8N5',
    status: 'Rejected',
    createdAt: '2026-10-20T12:48:00',
    updatedAt: '2026-10-23T09:15:00',
    qrToken: 'b08e5d32-16f4-4a9c-8d27-3c904b6e1f75',
    rejectionReason:
      'عدم استيفاء شرط المؤهل الدراسي المطلوب للدورة، حيث يشترط البرنامج مؤهلاً متخصصاً. يمكنك التقديم على دورة أخرى مناسبة أو مراجعة شؤون الدارسين لاستكمال المستندات.',
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
      lectureDays: ['Sat', 'Mon', 'Wed'],
      totalLectures: 16,
      passingGrade: 60,
      capacity: 30,
      enrolledCount: 30,
      hall: { name: 'قاعة المحاضرات المركزية الكبرى (قاعة أ)', location: 'المبنى الإداري - الدور الأول' },
      instructor: { name: 'م. كريم الدين ممدوح', specialty: 'تسويق رقمي وإعلانات ممولة - Google, Meta' },
      pricings: { Civilian: 3200, MilitaryOfficer: 1600, MilitaryFamily: 1900, PoliceOfficerOrFamily: 2100 },
    },
  },
];

/** الدورات الجارية (مقيد بالدورة) — لصفحة دوراتي وجدولي وتصاريح الدخول */
export const ONGOING_APPLICATIONS = TRAINEE_APPLICATIONS.filter((a) => a.status === 'Enrolled');

/** الدورات المنتهية — لصفحة الشهادات */
export const ENDED_APPLICATIONS = TRAINEE_APPLICATIONS.filter((a) => a.status === 'CourseEnded');
