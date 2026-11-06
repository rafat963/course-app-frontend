<template>
  <AppTable
    :columns="columns"
    :data="rounds"
    :is-filtered="isFiltered"
    empty-title="لا توجد دورات منعقدة حالياً مطابقة لمعايير البحث"
    empty-text="جرّب تعديل خيارات التصفية أو مسح نص البحث لعرض الدورات الجارية"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. الدورة التدريبية ورقم الدفعة -->
    <template #course="{ row }">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-1.5">
          <strong class="font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm block truncate max-w-[200px]" :title="row.courseName">
            {{ row.courseName }}
          </strong>
          <!-- شارة رقم الدفعة -->
          <span class="px-2 py-0.2 rounded-md bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 text-[10px] font-mono font-bold">
            دفعة {{ row.roundNumber }}
          </span>

          <!-- شارة حالة الدفعة: مفتوحة للتسجيل vs جارية حالياً -->
          <span
            v-if="row.status === 'Available'"
            class="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
            title="دفعة جديدة مفتوحة للتسجيل وتلقي طلبات المتقدمين"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>مفتوحة للتسجيل</span>
          </span>
          <span
            v-else-if="row.status === 'Ongoing'"
            class="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>جارية حالياً</span>
          </span>

          <!-- شارة محاضرة اليوم النابضة -->
          <span
            v-if="row.status === 'Ongoing' && isTodayLecture(row.lectureDays)"
            class="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs"
            title="توجد محاضرة مجدولة لهذه الدفعة اليوم"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>محاضرة اليوم</span>
          </span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-mono">
          كود الدفعة: CR-{{ row.courseId }}-{{ row.roundNumber }}
        </p>
      </div>
    </template>

    <!-- 2. المحاضر المعتمد -->
    <template #instructor="{ row }">
      <div class="space-y-0.5 text-xs">
        <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <GraduationCap class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{{ row.instructor?.name }}</span>
        </div>
        <div class="text-[11px] text-slate-400 font-medium">
          {{ row.instructor?.specialty }}
        </div>
      </div>
    </template>

    <!-- 3. القاعة أو المعمل التدريبي -->
    <template #hall="{ row }">
      <div class="space-y-1 text-xs">
        <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <MapPin class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span>{{ row.hall?.name }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="px-1.5 py-0.2 rounded text-[10px] font-bold border"
            :class="
              row.hall?.type === 'Lab'
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            "
          >
            {{ row.hall?.type === 'Lab' ? 'معمل تدريب' : 'قاعة محاضرات' }}
          </span>
          <span class="text-[10px] text-slate-400 font-mono">
            أقصى سعة: {{ row.hall?.maxCapacity }}
          </span>
        </div>
      </div>
    </template>

    <!-- 4. المواعيد وأيام الأسبوع -->
    <template #schedule="{ row }">
      <div class="space-y-1 text-xs">
        <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <CalendarDays class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span class="text-[11px]">{{ formatDays(row.lectureDays) }}</span>
        </div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
          <Clock class="w-3 h-3 text-amber-500" />
          <span>{{ formatTime12Hour(row.startTime) }} - {{ formatTime12Hour(row.endTime) }}</span>
        </div>
      </div>
    </template>

    <!-- 5. نسبة الإنجاز الأكاديمي والفترة -->
    <template #progress="{ row }">
      <!-- في حالة الدفعة المفتوحة للتسجيل والتي لم تبدأ بعد -->
      <div v-if="row.status === 'Available'" class="space-y-1.5 min-w-[155px]">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
            <CalendarClock class="w-3.5 h-3.5" />
            <span>{{ getStartCountdownText(row.startDate) }}</span>
          </span>
          <span class="font-mono text-slate-500 text-[10px]">
            {{ Math.round(((row.enrolledCount || 0) / (row.capacity || 25)) * 100) }}% حجز
          </span>
        </div>

        <!-- شريط نسبة الحجز والتسجيل -->
        <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div
            class="h-full rounded-full bg-blue-500 transition-all duration-500"
            :style="{ width: `${Math.min(100, Math.round(((row.enrolledCount || 0) / (row.capacity || 25)) * 100))}%` }"
          ></div>
        </div>

        <div class="text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>تبدأ: {{ formatDate(row.startDate) }}</span>
          <span>آخر تقديم: {{ formatDate(row.lastApplicationDate) }}</span>
        </div>
      </div>

      <!-- في حالة الدورة الجارية بدأت الدراسة -->
      <div v-else class="space-y-1.5 min-w-[150px]">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-500 dark:text-slate-400 font-medium">
            الأسبوع {{ getWeeks(row.startDate, row.endDate).currentWeek }} من {{ getWeeks(row.startDate, row.endDate).totalWeeks }}
          </span>
          <strong class="font-mono text-slate-800 dark:text-slate-200 font-bold">
            {{ getProgress(row.startDate, row.endDate) }}%
          </strong>
        </div>

        <!-- شريط التقدم التفاعلي -->
        <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="
              getProgress(row.startDate, row.endDate) >= 75
                ? 'bg-amber-500'
                : 'bg-primary-600 dark:bg-primary-500'
            "
            :style="{ width: `${getProgress(row.startDate, row.endDate)}%` }"
          ></div>
        </div>

        <div class="text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>{{ formatDate(row.startDate) }}</span>
          <span>إلى {{ formatDate(row.endDate) }}</span>
        </div>
      </div>
    </template>

    <!-- 6. المقاعد ونسبة الحضور -->
    <template #attendance="{ row }">
      <div class="space-y-1 text-xs min-w-[110px]">
        <!-- نسبة المقاعد المسجلة -->
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-slate-500">المقاعد:</span>
          <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
            {{ row.enrolledCount }} / {{ row.capacity }}
          </span>
        </div>

        <!-- حالة الحضور أو القبول -->
        <div v-if="row.status === 'Available'" class="flex items-center justify-between">
          <span class="text-[11px] text-slate-500">القبول:</span>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
            تلقي الطلبات
          </span>
        </div>
        <div v-else class="flex items-center justify-between">
          <span class="text-[11px] text-slate-500">حضور البوابة:</span>
          <span
            class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
            :class="
              row.attendanceRate >= 95
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
            "
          >
            {{ row.attendanceRate }}%
          </span>
        </div>
      </div>
    </template>

    <!-- 7. الإجراءات -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <!-- زر كشف الدارسين -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/60 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="استعراض كشف الدارسين المقيدين في هذه الدفعة"
          @click="$emit('open-trainees', row)"
        >
          <Users class="w-3.5 h-3.5" />
          <span>كشف الدارسين</span>
        </button>

        <!-- زر تفاصيل الدفعة والجدول -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="معاينة الجدول الدراسي والتفاصيل التشغيلية للدفعة"
          @click="$emit('open-details', row)"
        >
          <Info class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>التفاصيل</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  GraduationCap,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Info,
  CalendarClock,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import {
  isRoundLectureToday,
  formatLectureDays,
  calculateProgress,
  calculateWeeksInfo,
  formatDate,
  getDaysUntilStart,
} from '../helpers/activeCoursesConstants';
import { formatTime12Hour } from '@/components/Affairs/components/AllCourses/helpers/hallScheduleHelper';

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

const columns = [
  { key: 'course', label: 'الدورة التدريبية والدفعة' },
  { key: 'instructor', label: 'المحاضر المعتمد', cellClass: 'whitespace-nowrap' },
  { key: 'hall', label: 'القاعة / المعمل', cellClass: 'whitespace-nowrap' },
  { key: 'schedule', label: 'الأيام والمواعيد', cellClass: 'whitespace-nowrap' },
  { key: 'progress', label: 'الإنجاز الأكاديمي والفترة' },
  { key: 'attendance', label: 'المقاعد والحضور', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];

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
