<template>
  <div v-if="rounds.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
      <Layers class="w-8 h-8" />
    </div>
    <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
      لا توجد دورات منعقدة حالياً مطابقة لمعايير البحث
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
      جرّب تعديل خيارات التصفية أو مسح نص البحث لعرض الدورات الجارية
    </p>
    <button
      v-if="isFiltered"
      type="button"
      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
      @click="$emit('clear-filters')"
    >
      <RotateCcw class="w-3.5 h-3.5" />
      <span>إعادة ضبط الفلاتر</span>
    </button>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div
      v-for="row in rounds"
      :key="row.id"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group space-y-3"
    >
      <!-- شريط الحالة العلوي -->
      <div
        class="absolute top-0 right-0 left-0 h-1"
        :class="row.status === 'Ongoing' ? 'bg-emerald-500' : 'bg-blue-500'"
      ></div>

      <div>
        <!-- رأس الكارت: اسم الدورة + الدفعة + شارات الحالة -->
        <div class="pb-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <strong class="font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg block truncate leading-tight" :title="row.courseName">
                {{ row.courseName }}
              </strong>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="px-3 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 text-xs sm:text-sm font-mono font-bold">
                  دفعة {{ row.roundNumber }}
                </span>
                <span class="text-xs sm:text-sm text-slate-400 font-mono">
                  CR-{{ row.courseId }}-{{ row.roundNumber }}
                </span>
              </div>
            </div>

            <!-- شارات الحالة -->
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span
                v-if="row.status === 'Available'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
              >
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>مفتوحة للتسجيل 📝</span>
              </span>
              <span
                v-else-if="row.status === 'Ongoing'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>جارية حالياً 🟢</span>
              </span>

              <span
                v-if="row.status === 'Ongoing' && isTodayLecture(row.lectureDays)"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs"
              >
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>محاضرة اليوم 📍</span>
              </span>
            </div>
          </div>
        </div>

        <!-- معلومات المحاضر والقاعة والمواعيد -->
        <div class="p-3.5 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm">
          <!-- المحاضر -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">المحاضر:</span>
            <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[180px]">
              <GraduationCap class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{{ row.instructor?.name }}</span>
            </span>
          </div>

          <!-- القاعة -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">المكان:</span>
            <span class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              <span class="font-bold">{{ row.hall?.name }}</span>
              <span
                class="px-2 py-0.5 rounded text-xs sm:text-sm font-bold border"
                :class="
                  row.hall?.type === 'Lab'
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                "
              >
                {{ row.hall?.type === 'Lab' ? 'معمل' : 'قاعة' }}
              </span>
            </span>
          </div>

          <!-- المواعيد -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">الأيام والمواعيد:</span>
            <span class="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
              <CalendarDays class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{{ formatDays(row.lectureDays) }}</span>
              <span class="text-slate-400">|</span>
              <span class="font-mono text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">{{ row.startTime }}</span>
            </span>
          </div>
        </div>

        <!-- الإنجاز الأكاديمي والفترة -->
        <div class="p-3.5 mb-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
          <!-- حالة Available -->
          <div v-if="row.status === 'Available'" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                <CalendarClock class="w-4 h-4" />
                <span>{{ getStartCountdownText(row.startDate) }}</span>
              </span>
              <span class="font-mono text-slate-500 text-xs sm:text-sm font-bold">
                {{ Math.round(((row.enrolledCount || 0) / (row.capacity || 25)) * 100) }}% حجز
              </span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
              <div
                class="h-full rounded-full bg-blue-500 transition-all duration-500"
                :style="{ width: `${Math.min(100, Math.round(((row.enrolledCount || 0) / (row.capacity || 25)) * 100))}%` }"
              ></div>
            </div>
            <div class="text-xs sm:text-sm text-slate-400 font-mono flex items-center justify-between pt-0.5">
              <span>تبدأ: {{ formatDate(row.startDate) }}</span>
              <span>آخر تقديم: {{ formatDate(row.lastApplicationDate) }}</span>
            </div>
          </div>

          <!-- حالة Ongoing -->
          <div v-else class="space-y-1.5">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-slate-600 dark:text-slate-400 font-bold">
                الأسبوع {{ getWeeks(row.startDate, row.endDate).currentWeek }} من {{ getWeeks(row.startDate, row.endDate).totalWeeks }}
              </span>
              <strong class="font-mono text-slate-800 dark:text-slate-200 font-black text-sm sm:text-base">
                {{ getProgress(row.startDate, row.endDate) }}%
              </strong>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${getProgress(row.startDate, row.endDate)}%` }"
                :class="
                  getProgress(row.startDate, row.endDate) >= 75
                    ? 'bg-amber-500'
                    : 'bg-primary-600 dark:bg-primary-500'
                "
              ></div>
            </div>
            <div class="text-xs sm:text-sm text-slate-400 font-mono flex items-center justify-between pt-0.5">
              <span>{{ formatDate(row.startDate) }}</span>
              <span>إلى {{ formatDate(row.endDate) }}</span>
            </div>
          </div>
        </div>

        <!-- المقاعد ونسبة الحضور -->
        <div class="flex items-center justify-between text-xs sm:text-sm px-1 py-1 mb-1 text-slate-600 dark:text-slate-400">
          <div class="flex items-center gap-1.5">
            <span class="font-medium">المقاعد المحجوزة:</span>
            <span class="font-mono font-black text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {{ row.enrolledCount }} / {{ row.capacity }}
            </span>
          </div>

          <div v-if="row.status === 'Ongoing'" class="flex items-center gap-1.5">
            <span class="font-medium">حضور البوابة:</span>
            <span
              class="px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-mono font-bold"
              :class="
                row.attendanceRate >= 95
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
              "
            >
              {{ row.attendanceRate }}%
            </span>
          </div>
          <div v-else>
            <span class="px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
              تلقي الطلبات
            </span>
          </div>
        </div>
      </div>

      <!-- الإجراءات -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 mt-2">
        <button
          type="button"
          class="h-10 rounded-xl bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/60 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="استعراض كشف الدارسين المقيدين في هذه الدفعة"
          @click="$emit('open-trainees', row)"
        >
          <Users class="w-4 h-4" />
          <span>كشف الدارسين</span>
        </button>

        <button
          type="button"
          class="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="معاينة الجدول الدراسي والتفاصيل التشغيلية للدفعة"
          @click="$emit('open-details', row)"
        >
          <Info class="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>التفاصيل</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  GraduationCap,
  MapPin,
  CalendarDays,
  Users,
  Info,
  CalendarClock,
  Layers,
  RotateCcw,
} from 'lucide-vue-next';
import {
  isRoundLectureToday,
  formatLectureDays,
  calculateProgress,
  calculateWeeksInfo,
  formatDate,
  getDaysUntilStart,
} from '../helpers/activeCoursesConstants';

defineProps({
  rounds: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['open-trainees', 'open-details', 'clear-filters']);

function isTodayLecture(days) {
  return isRoundLectureToday(days);
}

function formatDays(days) {
  return formatLectureDays(days);
}

function getProgress(start, end) {
  return calculateProgress(start, end);
}

function getWeeks(start, end) {
  return calculateWeeksInfo(start, end);
}

function getStartCountdownText(startDate) {
  const diffDays = getDaysUntilStart(startDate);
  if (diffDays === null) return 'قريباً';
  if (diffDays <= 0) return 'تبدأ اليوم';
  if (diffDays === 1) return 'تبدأ غداً';
  if (diffDays === 2) return 'تبدأ بعد يومين';
  return `تبدأ بعد ${diffDays} يوم`;
}
</script>
