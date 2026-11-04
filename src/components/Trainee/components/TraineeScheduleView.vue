<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <CalendarDays class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                دوراتي الحالية وجدولي
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ courses.length }} دورة جارية
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مواعيد محاضراتك، القاعات التدريبية، المحاضرون، ونسبة تقدمك في المنهج
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
          <CalendarClock class="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <div class="font-bold text-slate-700 dark:text-slate-200">{{ todayLong }}</div>
            <div class="text-[11px] text-slate-400">توقيت منظومة معهد نظم المعلومات</div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         2. مؤشرات سريعة (KPIs)
         ========================================================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <AppKpiCard
        title="الدورات المقيد بها حالياً"
        :value="courses.length"
        badge="دورة نشطة"
        icon-bg="bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
        :icon="BookOpen"
      />
      <AppKpiCard
        title="المحاضرات هذا الأسبوع"
        :value="weeklyTotal"
        badge="محاضرة أسبوعياً"
        badge-class="text-blue-600 dark:text-blue-400 font-bold"
        icon-bg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
        :icon="CalendarRange"
      />
      <AppKpiCard
        title="إجمالي ساعات التدريب الأسبوعية"
        :value="`${weeklyHours} س`"
        badge="ساعات معتمدة"
        badge-class="text-indigo-600 dark:text-indigo-400 font-bold"
        icon-bg="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
        :icon="Clock"
      />
      <AppKpiCard
        title="متوسط نسبة الحضور"
        :value="`${averageAttendance}%`"
        :badge="averageAttendance >= 75 ? 'مستوفٍ لنسبة الحضور' : 'انتبه للغياب'"
        :badge-class="averageAttendance >= 75 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        :icon="TrendingUp"
      />
    </div>

    <!-- =========================================================
         3. لوحة المحاضرة القادمة (Next Lecture Hero Card)
         ========================================================= -->
    <div
      v-if="nextOverall"
      class="rounded-3xl overflow-hidden border border-primary-800/40 bg-gradient-to-l from-primary-950 via-primary-900 to-slate-900 text-white shadow-xl relative"
    >
      <div class="px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <AlarmClock class="w-7 h-7 text-amber-300 animate-bounce" />
          </div>

          <div class="min-w-0 space-y-1.5">
            <div class="flex items-center gap-2 text-xs font-black text-primary-200">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>المحاضرة القادمة حسب الجدول الدراسي</span>
              <span class="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-primary-200">
                {{ nextOverall.app.round.roundCode }}
              </span>
            </div>

            <h2 class="text-base sm:text-lg font-black font-heading leading-snug">
              {{ nextOverall.app.round.courseName }}
            </h2>

            <!-- تفاصيل المحاضر والقاعة والمواعيد -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-primary-100 pt-0.5">
              <span class="inline-flex items-center gap-1.5">
                <CalendarDays class="w-3.5 h-3.5 text-amber-300" />
                <strong>{{ nextOverall.dateLabel }}</strong>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-amber-300" />
                <span class="font-mono font-bold">{{ nextOverall.lecture.timeLabel }}</span>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <MapPin class="w-3.5 h-3.5 text-emerald-300" />
                <span>{{ nextOverall.app.round.hall.name }} ({{ nextOverall.app.round.hall.location }})</span>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <User class="w-3.5 h-3.5 text-primary-300" />
                <span>{{ nextOverall.app.round.instructor.name }} — {{ nextOverall.app.round.instructor.specialty }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- زر التصريح + العد التنازلي -->
        <div class="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <div class="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center shadow-inner">
            <div class="text-[10px] text-primary-200 font-bold">العد التنازلي للمحاضرة</div>
            <div class="text-base font-black font-heading text-amber-300 mt-0.5">{{ nextOverall.lecture.label }}</div>
          </div>

          <RouterLink
            to="/trainee/passes"
            class="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <QrCode class="w-3.5 h-3.5" />
            <span>عرض تصريح الدخول QR</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 flex items-center gap-3 text-slate-500 dark:text-slate-400"
    >
      <CalendarX class="w-6 h-6 text-slate-400 shrink-0" />
      <div class="text-xs">
        لا توجد محاضرات مجدولة حالياً — سيظهر موعد المحاضرة القادمة هنا تلقائياً بمجرد انعقاد دوراتك المقيد بها.
      </div>
    </div>

    <!-- =========================================================
         4. قائمة الدورات الجارية (Enrolled Courses Cards)
         ========================================================= -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
          <GraduationCap class="w-4 h-4 text-primary-600" />
          دوراتي التدريبية الجارية
        </h3>
        <span class="text-xs text-slate-400 font-bold">{{ courses.length }} دورة نشطة</span>
      </div>

      <div v-if="courses.length" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article
          v-for="app in courses"
          :key="app.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <!-- شريط علوي -->
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-snug">
                {{ app.round.courseName }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-1">
                <span>{{ app.round.courseDomain }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">{{ app.round.roundCode }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span>الدفعة {{ app.round.roundNumber }}</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shrink-0">
              مقيد بالدورة
            </span>
          </div>

          <!-- تفاصيل الدورة والمحاضر والقاعة -->
          <div class="p-5 space-y-4 flex-1">
            <!-- المحاضر المسؤول (Instructors.Name & Specialty) -->
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70">
              <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-xs shrink-0">
                {{ instructorInitials(app.round.instructor.name) }}
              </div>
              <div class="min-w-0">
                <div class="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{{ app.round.instructor.name }}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate" :title="app.round.instructor.specialty">
                  {{ app.round.instructor.specialty }}
                </div>
              </div>
            </div>

            <!-- القاعة والتوقيت اليومي (Halls.Name, Location, StartTime, EndTime) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div class="p-3 rounded-2xl border border-slate-100 dark:border-slate-700/70 space-y-0.5 bg-slate-50/50 dark:bg-slate-800/40">
                <div class="text-slate-400 flex items-center gap-1"><MapPin class="w-3.5 h-3.5 text-primary-600" /> قاعة المحاضرات ومقرها</div>
                <div class="font-bold text-slate-700 dark:text-slate-200 truncate">{{ app.round.hall.name }}</div>
                <div class="text-[10px] text-slate-400 truncate">{{ app.round.hall.location }}</div>
              </div>
              <div class="p-3 rounded-2xl border border-slate-100 dark:border-slate-700/70 space-y-0.5 bg-slate-50/50 dark:bg-slate-800/40">
                <div class="text-slate-400 flex items-center gap-1"><Clock class="w-3.5 h-3.5 text-primary-600" /> التوقيت اليومي</div>
                <div class="font-mono font-bold text-slate-700 dark:text-slate-200">
                  {{ formatTimeRange(app.round.startTime, app.round.endTime) }}
                </div>
                <div class="text-[10px] text-slate-400">
                  فترة الانعقاد اليومية المعتمدة
                </div>
              </div>
            </div>

            <!-- أيام المحاضرات النشطة (CourseLectureDays) -->
            <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span class="text-[11px] text-slate-400 ml-1">أيام المحاضرات:</span>
              <span
                v-for="day in app.round.lectureDays"
                :key="day"
                class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-primary-200 dark:border-primary-800 bg-primary-50/70 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300"
              >
                {{ dayLabel(day) }}
              </span>
            </div>

            <!-- نسبة التقدم في المنهج والحضور -->
            <div class="space-y-1.5 pt-1">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <TrendingUp class="w-3.5 h-3.5 text-slate-400" />
                  نسبة حضور المحاضرات
                </span>
                <span class="font-mono font-black" :class="progressTextClass(app)">
                  {{ app.attendedLectures }} / {{ app.round.totalLectures }} محاضرة ({{ getCourseProgress(app) }}%)
                </span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="progressBarClass(app)"
                  :style="{ width: `${getCourseProgress(app)}%` }"
                />
              </div>
            </div>

            <!-- المحاضرة القادمة لهذه الدورة بالتحديد -->
            <div class="flex items-center justify-between gap-2 p-2.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-[11px] bg-slate-50/40 dark:bg-slate-800/30">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlarmClock class="w-3.5 h-3.5 text-amber-500" />
                المحاضرة القادمة للدورة:
              </span>
              <span v-if="nextFor(app)" class="font-bold text-slate-800 dark:text-slate-100">
                {{ nextFor(app).label }} في {{ nextFor(app).timeLabel }}
              </span>
              <span v-else class="font-bold text-slate-400">غير مجدولة</span>
            </div>
          </div>

          <!-- تذييل الكارت -->
          <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-2">
            <button
              type="button"
              class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              @click="openCourseModal(app)"
            >
              تفاصيل المحتوى والمقر
            </button>

            <RouterLink
              to="/trainee/passes"
              class="inline-flex items-center gap-1 text-[11px] font-black text-primary-600 dark:text-primary-400 hover:underline"
            >
              عرض تصريح الدخول (QR)
              <ArrowLeft class="w-3 h-3" />
            </RouterLink>
          </div>
        </article>
      </div>

      <div
        v-else
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm px-8 py-16 text-center space-y-3"
      >
        <div class="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
          <BookOpen class="w-7 h-7 text-slate-400" />
        </div>
        <h3 class="text-sm font-black text-slate-700 dark:text-slate-200 font-heading">لا توجد دورات جارية</h3>
        <p class="text-xs text-slate-400">بعد اعتماد طلبك وسداد الرسوم ستظهر دورتك وجدولك هنا.</p>
        <RouterLink
          to="/trainee/courses"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
        >
          تصفّح الدورات المتاحة للتقديم
          <ArrowLeft class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>

    <!-- =========================================================
         5. الجدول الأسبوعي (Weekly Timetable)
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <CalendarRange class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 font-heading">الجدول الأسبوعي للمحاضرات</h3>
            <p class="text-[10px] text-slate-400">توزيع مواعيد المحاضرات والقاعات على أيام الأسبوع</p>
          </div>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">{{ weeklyTotal }} محاضرة أسبوعياً</span>
      </div>

      <div class="p-4 overflow-x-auto custom-scrollbar">
        <div class="grid grid-cols-7 gap-2.5 min-w-[780px]">
          <div
            v-for="day in weeklySchedule"
            :key="day.code"
            class="rounded-2xl border p-2.5 min-h-[140px] flex flex-col gap-2 transition-all"
            :class="
              isToday(day.code)
                ? 'border-primary-400 dark:border-primary-600 bg-primary-50/60 dark:bg-primary-950/30 ring-2 ring-primary-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30'
            "
          >
            <div class="flex items-center justify-between px-1">
              <span
                class="text-xs font-black"
                :class="isToday(day.code) ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'"
              >
                {{ day.label }}
              </span>
              <span v-if="isToday(day.code)" class="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary-600 text-white shadow-2xs">
                اليوم
              </span>
            </div>

            <div v-if="!day.entries.length" class="flex-1 flex items-center justify-center">
              <span class="text-[10px] text-slate-300 dark:text-slate-600">لا توجد محاضرات</span>
            </div>

            <div
              v-for="entry in day.entries"
              :key="entry.id"
              class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1 shadow-2xs"
            >
              <div class="text-[10px] font-black text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">
                {{ entry.courseName }}
              </div>
              <div class="text-[9px] font-mono text-primary-600 dark:text-primary-400 font-bold">
                {{ entry.timeRange }}
              </div>
              <div class="text-[9px] text-slate-400 truncate" :title="entry.hallName">
                {{ entry.hallName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تفاصيل الدورة والمحتوى -->
    <TraineeCourseScheduleModal
      :is-open="isModalOpen"
      :course="selectedCourse"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  CalendarDays,
  CalendarClock,
  CalendarRange,
  CalendarX,
  AlarmClock,
  Clock,
  MapPin,
  User,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  QrCode,
} from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import TraineeCourseScheduleModal from './TraineeCourseScheduleModal.vue';
import { ONGOING_APPLICATIONS } from '../helpers/traineePortalMockData';
import {
  WEEK_DAYS,
  formatDateDmy,
  formatDateLong,
  formatTimeRange,
  getNextLecture,
  buildWeeklySchedule,
  getCourseProgress,
  getDayCode,
  getDayLabel,
} from '../helpers/traineePortalHelpers';

const courses = computed(() => ONGOING_APPLICATIONS);
const todayLong = computed(() => formatDateLong(new Date()));

const isModalOpen = ref(false);
const selectedCourse = ref(null);

function openCourseModal(app) {
  selectedCourse.value = app;
  isModalOpen.value = true;
}

function instructorInitials(name = '') {
  const parts = name.replace(/^(د\.|م\.|أ\.)\s*/, '').trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]).join('');
}

function dayLabel(code) {
  return WEEK_DAYS.find((d) => d.code === code)?.label || code;
}

function isToday(code) {
  return code === getDayCode(new Date());
}

const nextFor = (app) => getNextLecture(app.round);

/** أقرب محاضرة قادمة بين كل الدورات المقيد بها */
const nextOverall = computed(() => {
  const items = courses.value
    .map((app) => {
      const lecture = getNextLecture(app.round);
      if (!lecture) return null;
      return {
        app,
        lecture,
        dateLabel: `${getDayLabel(lecture.date)} ${formatDateDmy(lecture.date)}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.lecture.date - b.lecture.date);

  return items[0] || null;
});

const weeklySchedule = computed(() => buildWeeklySchedule(courses.value));

const weeklyTotal = computed(() =>
  weeklySchedule.value.reduce((sum, day) => sum + day.entries.length, 0)
);

/** إجمالي الساعات التدريبية الأسبوعية */
const weeklyHours = computed(() => {
  let totalHours = 0;
  courses.value.forEach((app) => {
    const daysCount = app.round?.lectureDays?.length || 0;
    const [startH] = (app.round?.startTime || '00:00').split(':').map(Number);
    const [endH] = (app.round?.endTime || '00:00').split(':').map(Number);
    const diff = Math.max(0, endH - startH);
    totalHours += diff * daysCount;
  });
  return totalHours;
});

/** متوسط نسبة حضور المحاضرات */
const averageAttendance = computed(() => {
  if (!courses.value.length) return 0;
  const sum = courses.value.reduce((acc, app) => acc + getCourseProgress(app), 0);
  return Math.round(sum / courses.value.length);
});

function progressBarClass(app) {
  const progress = getCourseProgress(app);
  if (progress >= 75) return 'bg-emerald-500';
  if (progress >= 40) return 'bg-primary-500';
  return 'bg-amber-500';
}

function progressTextClass(app) {
  const progress = getCourseProgress(app);
  if (progress >= 75) return 'text-emerald-700 dark:text-emerald-400';
  if (progress >= 40) return 'text-primary-700 dark:text-primary-400';
  return 'text-amber-700 dark:text-amber-400';
}
</script>