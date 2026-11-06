/**
 * محرك فحص وحساب إشغال وجداول القاعات التدريبية ومنع التعارض الزمني
 * وفق جداول: Halls, CourseRounds, CourseLectureDays في الـ ERD
 */

export const DAY_NAMES_MAP = {
  Sat: 'السبت',
  Sun: 'الأحد',
  Mon: 'الإثنين',
  Tue: 'الثلاثاء',
  Wed: 'الأربعاء',
  Thu: 'الخميس',
  Fri: 'الجمعة',
};

export const STANDARD_TIME_SLOTS = [
  { id: 'morning', label: 'الفترة الصباحية', startTime: '09:00', endTime: '13:00' },
  { id: 'afternoon', label: 'الفترة المسائية الأولى', startTime: '13:30', endTime: '17:30' },
  { id: 'evening', label: 'الفترة المسائية الثانية', startTime: '17:30', endTime: '21:00' },
];

/**
 * ساعات العمل التشغيلية الرسمية للقاعات
 * من 07:00 ص حتى 09:00 م كحد أقصى لانعقاد وانتهاء أي دورة
 */
export const MIN_OPERATIONAL_TIME = '07:00'; // 07:00 ص
export const MAX_OPERATIONAL_TIME = '21:00'; // 09:00 م

/**
 * الخيارات الزمنية المعتمدة بصيغة 12 ساعة (ص / م) من 07:00 ص إلى 09:00 م
 */
export const ALLOWED_TIME_OPTIONS = [
  { value: '07:00', label: '07:00 ص' },
  { value: '07:30', label: '07:30 ص' },
  { value: '08:00', label: '08:00 ص' },
  { value: '08:30', label: '08:30 ص' },
  { value: '09:00', label: '09:00 ص' },
  { value: '09:30', label: '09:30 ص' },
  { value: '10:00', label: '10:00 ص' },
  { value: '10:30', label: '10:30 ص' },
  { value: '11:00', label: '11:00 ص' },
  { value: '11:30', label: '11:30 ص' },
  { value: '12:00', label: '12:00 م' },
  { value: '12:30', label: '12:30 م' },
  { value: '13:00', label: '01:00 م' },
  { value: '13:30', label: '01:30 م' },
  { value: '14:00', label: '02:00 م' },
  { value: '14:30', label: '02:30 م' },
  { value: '15:00', label: '03:00 م' },
  { value: '15:30', label: '03:30 م' },
  { value: '16:00', label: '04:00 م' },
  { value: '16:30', label: '04:30 م' },
  { value: '17:00', label: '05:00 م' },
  { value: '17:30', label: '05:30 م' },
  { value: '18:00', label: '06:00 م' },
  { value: '18:30', label: '06:30 م' },
  { value: '19:00', label: '07:00 م' },
  { value: '19:30', label: '07:30 م' },
  { value: '20:00', label: '08:00 م' },
  { value: '20:30', label: '08:30 م' },
  { value: '21:00', label: '09:00 م' },
];

export const ALLOWED_START_TIME_OPTIONS = ALLOWED_TIME_OPTIONS.slice(0, -1);
export const ALLOWED_END_TIME_OPTIONS = ALLOWED_TIME_OPTIONS.slice(1);

/**
 * فحص تداخل فترتي تواريخ
 */
export function checkDateOverlap(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false;
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();

  return aStart <= bEnd && aEnd >= bStart;
}

/**
 * تحويل الوقت بصيغة "HH:mm" إلى عدد الدقائق منذ منتصف الليل
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/**
 * فحص تداخل فترتي توقيت بالساعات والدقائق
 */
export function checkTimeOverlap(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false;
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && aEnd > bStart;
}

/**
 * استخراج كافة الدورات التي تحجز القاعة في فترة زمنية معينة
 */
export function getHallActiveReservations(hallId, startDate, endDate, allRounds = [], excludeRoundId = null) {
  if (!hallId) return [];

  return allRounds.filter((round) => {
    if (!round) return false;
    if (excludeRoundId && Number(round.id) === Number(excludeRoundId)) return false;
    if (Number(round.hallId) !== Number(hallId)) return false;

    // استبعاد الدورات المنتهية
    if (round.status === 'Ended') return false;

    // فحص تداخل التواريخ إذا حُددت
    if (startDate && endDate && round.startDate && round.endDate) {
      if (!checkDateOverlap(startDate, endDate, round.startDate, round.endDate)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * فحص التعارض الدقيق عند محاولة حجز دورة جديدة
 * يدعم المواعيد الموحدة وكذلك المواعيد المخصصة لكل يوم على حدة (daySchedules)
 */
export function checkRoundConflict(candidate, existingRounds = []) {
  if (!candidate || !candidate.hallId || !candidate.startDate || !candidate.endDate) {
    return { hasConflict: false };
  }

  const candidateDays = Array.isArray(candidate.lectureDays) ? candidate.lectureDays : [];
  if (candidateDays.length === 0) {
    return { hasConflict: false };
  }

  const activeInHall = getHallActiveReservations(
    candidate.hallId,
    candidate.startDate,
    candidate.endDate,
    existingRounds,
    candidate.id
  );

  for (const round of activeInHall) {
    const roundDays = Array.isArray(round.lectureDays) ? round.lectureDays : [];

    // الأيام المشتركة بين المرشح والدورة القائمة في هذه القاعة
    const commonDays = candidateDays.filter((day) => roundDays.includes(day));

    for (const day of commonDays) {
      // توقيت المرشح لهذا اليوم (من daySchedules أو التوقيت العام)
      const candStart = candidate.daySchedules?.[day]?.startTime || candidate.startTime;
      const candEnd = candidate.daySchedules?.[day]?.endTime || candidate.endTime;

      // توقيت الدورة القائمة لهذا اليوم (من daySchedules أو التوقيت العام)
      const roundStart = round.daySchedules?.[day]?.startTime || round.startTime;
      const roundEnd = round.daySchedules?.[day]?.endTime || round.endTime;

      if (candStart && candEnd && roundStart && roundEnd) {
        if (checkTimeOverlap(candStart, candEnd, roundStart, roundEnd)) {
          const arabicDay = DAY_NAMES_MAP[day] || day;
          const candStart12 = formatTime12Hour(candStart);
          const candEnd12 = formatTime12Hour(candEnd);
          const roundStart12 = formatTime12Hour(roundStart);
          const roundEnd12 = formatTime12Hour(roundEnd);

          return {
            hasConflict: true,
            conflictingRound: round,
            conflictingDays: [day],
            conflictingDaysText: arabicDay,
            conflictingDayKey: day,
            conflictingTime: `${roundStart} - ${roundEnd}`,
            candidateTime: `${candStart} - ${candEnd}`,
            message: `تعارض زمني في القاعة يوم (${arabicDay}): القاعة محجوزة بالفعل من [${roundStart12} إلى ${roundEnd12}] لصالح دورة «${round.courseName || 'دورة تدريبية'}» (الدفعة ${round.roundNumber || 1})، بينما موعدك المطلوب هو من [${candStart12} إلى ${candEnd12}].`,
          };
        }
      }
    }
  }

  return { hasConflict: false };
}

/**
 * فحص تعارض يوم تدريبي محدد بتوقيته المستقل
 */
export function checkSingleDayConflict(dayKey, startTime, endTime, hallId, startDate, endDate, existingRounds = [], excludeRoundId = null) {
  if (!dayKey || !startTime || !endTime || !hallId || !startDate || !endDate) {
    return { hasConflict: false };
  }

  const activeInHall = getHallActiveReservations(hallId, startDate, endDate, existingRounds, excludeRoundId);

  for (const round of activeInHall) {
    const roundDays = Array.isArray(round.lectureDays) ? round.lectureDays : [];
    if (roundDays.includes(dayKey)) {
      const roundStart = round.daySchedules?.[dayKey]?.startTime || round.startTime;
      const roundEnd = round.daySchedules?.[dayKey]?.endTime || round.endTime;

      if (checkTimeOverlap(startTime, endTime, roundStart, roundEnd)) {
        return {
          hasConflict: true,
          conflictingRound: round,
          roundStart,
          roundEnd,
          message: `محجوزة لدورة «${round.courseName || 'أخرى'}» من ${formatTime12Hour(roundStart)} إلى ${formatTime12Hour(roundEnd)}`,
        };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * توليد تقرير جدول إشغال القاعة الأسبوعي ومواعيدها المتاحة
 */
export function getHallWeeklySchedule(hallId, startDate, endDate, existingRounds = []) {
  const daysKeys = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const activeInHall = getHallActiveReservations(hallId, startDate, endDate, existingRounds);

  const weeklySchedule = daysKeys.map((dayKey) => {
    const dayLabel = DAY_NAMES_MAP[dayKey];
    // الدورات التي تعقد في هذا اليوم في هذه القاعة
    const bookings = activeInHall
      .filter((r) => Array.isArray(r.lectureDays) && r.lectureDays.includes(dayKey))
      .map((r) => {
        const roundStart = r.daySchedules?.[dayKey]?.startTime || r.startTime || '09:00';
        const roundEnd = r.daySchedules?.[dayKey]?.endTime || r.endTime || '13:00';
        return {
          id: r.id,
          courseName: r.courseName || `دورة رقم ${r.courseId}`,
          roundNumber: r.roundNumber || 1,
          startTime: roundStart,
          endTime: roundEnd,
          startDate: r.startDate,
          endDate: r.endDate,
          instructorName: r.instructorName || r.instructor?.name || '',
        };
      })
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    // تحديد الفترات القياسية المتاحة في هذا اليوم
    const availableSlots = STANDARD_TIME_SLOTS.filter((slot) => {
      // لا تتداخل مع أي حجز
      return !bookings.some((b) => checkTimeOverlap(slot.startTime, slot.endTime, b.startTime, b.endTime));
    });

    return {
      dayKey,
      dayLabel,
      bookingsCount: bookings.length,
      bookings,
      isFullyFree: bookings.length === 0,
      isOccupied: bookings.length > 0,
      availableSlots,
    };
  });

  return weeklySchedule;
}

export const ARABIC_MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

/**
 * تحويل تاريخ JS إلى مفتاح اليوم الأسبوعي (Sat, Sun, Mon, ...)
 */
export function getDayKeyFromDate(date) {
  if (!date) return 'Sat';
  const jsDay = date.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return map[jsDay];
}

/**
 * تحويل كائن تاريخ إلى صيغة YYYY-MM-DD
 */
export function formatDateToISO(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * تحويل الوقت بصيغة 24 ساعة (مثال "14:30") إلى 12 ساعة بالعربية (مثال "02:30 م")
 */
export function formatTime12Hour(time24) {
  if (!time24) return '';
  const parts = time24.split(':');
  let h = parseInt(parts[0], 10) || 0;
  const m = parts[1] || '00';
  const period = h >= 12 ? 'م' : 'ص';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, '0')}:${m} ${period}`;
}

/**
 * استخراج كافة الدورات والمحاضرات المنعقدة في قاعة معينة في يوم تاريخي محدد (YYYY-MM-DD)
 */
export function getHallBookingsForDate(hallId, dateStr, allRounds = [], courses = [], instructors = []) {
  if (!hallId || !dateStr) return [];
  const targetDate = new Date(dateStr);
  const dayKey = getDayKeyFromDate(targetDate);

  return allRounds
    .filter((r) => {
      if (!r || Number(r.hallId) !== Number(hallId)) return false;
      if (r.status === 'Ended') return false;

      // التأكد أن التاريخ يقع ضمن فترة انعقاد الدفعة
      if (r.startDate && dateStr < r.startDate) return false;
      if (r.endDate && dateStr > r.endDate) return false;

      // التأكد أن اليوم يوافق أحد أيام محاضرات الدفعة
      const lectureDays = Array.isArray(r.lectureDays) ? r.lectureDays : [];
      return lectureDays.includes(dayKey);
    })
    .map((r) => {
      const course = courses.find((c) => Number(c.id) === Number(r.courseId));
      const instructor = instructors.find((i) => Number(i.id) === Number(r.instructorId));
      const dayStart = r.daySchedules?.[dayKey]?.startTime || r.startTime || '09:00';
      const dayEnd = r.daySchedules?.[dayKey]?.endTime || r.endTime || '13:00';
      const start12 = formatTime12Hour(dayStart);
      const end12 = formatTime12Hour(dayEnd);
      const durationHours = Math.max(1, Math.round((timeToMinutes(dayEnd) - timeToMinutes(dayStart)) / 60));

      return {
        id: r.id,
        courseId: r.courseId,
        courseName: r.courseName || course?.name || `دورة تدريبية #${r.courseId}`,
        roundNumber: r.roundNumber || 1,
        status: r.status || 'Ongoing',
        capacity: r.capacity || 25,
        startTime: dayStart,
        endTime: dayEnd,
        startTimeFormatted: start12,
        endTimeFormatted: end12,
        durationHours,
        startDate: r.startDate,
        endDate: r.endDate,
        lectureDays: r.lectureDays || [],
        daySchedules: r.daySchedules || {},
        instructorId: r.instructorId,
        instructorName: r.instructorName || instructor?.name || 'محاضر معتمد',
        instructorSpecialty: instructor?.specialty || '',
        instructorPhone: instructor?.phone || '',
      };
    })
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

/**
 * حساب مصفوفة التقويم الشهري الكاملة لقاعة معينة
 * يبدأ الأسبوع بيوم السبت وينتهي بيوم الجمعة
 */
export function getHallMonthCalendar(hallId, year, monthIndex, allRounds = [], courses = [], instructors = []) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // إزاحة بداية الشهر بحيث يكون السبت هو العمود الأول (0)
  // JS getDay: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  // Desired: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
  const startDayJS = firstDayOfMonth.getDay();
  const startOffset = (startDayJS + 1) % 7;

  const calendarDays = [];

  // 1. أيام الشهر السابق لملء بداية الأسبوع
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const padDay = prevMonthLastDay - i;
    const d = new Date(year, monthIndex - 1, padDay);
    const dateStr = formatDateToISO(d);
    const bookings = hallId ? getHallBookingsForDate(hallId, dateStr, allRounds, courses, instructors) : [];

    calendarDays.push({
      date: d,
      dateString: dateStr,
      dayNumber: padDay,
      isCurrentMonth: false,
      isToday: false,
      dayKey: getDayKeyFromDate(d),
      dayLabel: DAY_NAMES_MAP[getDayKeyFromDate(d)],
      bookings,
    });
  }

  // 2. أيام الشهر الحالي
  const todayStr = formatDateToISO(new Date());
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    const dateStr = formatDateToISO(d);
    const bookings = hallId ? getHallBookingsForDate(hallId, dateStr, allRounds, courses, instructors) : [];

    calendarDays.push({
      date: d,
      dateString: dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      dayKey: getDayKeyFromDate(d),
      dayLabel: DAY_NAMES_MAP[getDayKeyFromDate(d)],
      bookings,
    });
  }

  // 3. أيام الشهر القادم لإكمال شبكة الأسابيع (مضاعفات 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const dateStr = formatDateToISO(d);
    const bookings = hallId ? getHallBookingsForDate(hallId, dateStr, allRounds, courses, instructors) : [];

    calendarDays.push({
      date: d,
      dateString: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      dayKey: getDayKeyFromDate(d),
      dayLabel: DAY_NAMES_MAP[getDayKeyFromDate(d)],
      bookings,
    });
  }

  // 4. تقييم حالة كل يوم وحساب الفترات المتاحة
  return calendarDays.map((item) => {
    const count = item.bookings.length;
    let status = 'free'; // 'free' (متاح) | 'partial' (محجوز جزئياً) | 'busy' (مشغول بالكامل)
    if (count === 1) status = 'partial';
    else if (count >= 2) status = 'busy';

    // استخراج الفترات الزمنية القياسية المتاحة
    const availableSlots = STANDARD_TIME_SLOTS.filter((slot) => {
      return !item.bookings.some((b) => checkTimeOverlap(slot.startTime, slot.endTime, b.startTime, b.endTime));
    });

    return {
      ...item,
      status,
      bookingsCount: count,
      isFree: count === 0,
      isPartial: count === 1,
      isBusy: count >= 2,
      availableSlots,
    };
  });
}

/**
 * توليد مخطط زمني تشغيلي على مدار ساعات اليوم الرسمية (من 07:00 ص حتى 09:00 م)
 */
export function getDayOperationalHours(bookings = []) {
  const hours = [];
  for (let h = 7; h <= 20; h++) {
    const startStr = `${String(h).padStart(2, '0')}:00`;
    const endStr = `${String(h + 1).padStart(2, '0')}:00`;
    const label = `${formatTime12Hour(startStr)}`;
    const endLabel = `${formatTime12Hour(endStr)}`;

    // هل هذه الساعة مغطاة بأي حجز؟
    const matchedBooking = bookings.find((b) => {
      return checkTimeOverlap(startStr, endStr, b.startTime, b.endTime);
    });

    hours.push({
      hour: h,
      startStr,
      endStr,
      label,
      endLabel,
      rangeLabel: `${label} - ${endLabel}`,
      isOccupied: Boolean(matchedBooking),
      booking: matchedBooking || null,
    });
  }
  return hours;
}

