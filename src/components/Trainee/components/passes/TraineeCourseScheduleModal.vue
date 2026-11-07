<template>
  <div
    v-if="isOpen && course"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- ترويسة المودال -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <BookOpen class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                تفاصيل الدورة والجدول التدريبي
              </h3>
              <span class="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-lg border border-primary-200 dark:border-primary-800">
                {{ course.round.roundCode }}
              </span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ course.round.courseDomain }} — الدفعة {{ course.round.roundNumber }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- محتوى المودال -->
      <div class="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
        <!-- 1. المحاضر والقاعة -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- بطاقة المحاضر -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
              <User class="w-3.5 h-3.5 text-primary-600" />
              المحاضر المسؤول (Instructors)
            </div>
            <div class="font-black text-sm text-slate-800 dark:text-slate-100">
              {{ course.round.instructor.name }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              التخصص: {{ course.round.instructor.specialty }}
            </div>
          </div>

          <!-- بطاقة القاعة وموقعها -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
              <MapPin class="w-3.5 h-3.5 text-primary-600" />
              قاعة المحاضرات (Halls)
            </div>
            <div class="font-black text-sm text-slate-800 dark:text-slate-100">
              {{ course.round.hall.name }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              المقر الجغرافي: {{ course.round.hall.location }}
            </div>
          </div>
        </div>

        <!-- 2. المواعيد والأيام الأسبوعية -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CalendarClock class="w-4 h-4 text-primary-600" />
              المواعيد الأسبوعية وأيام الانعقاد (CourseLectureDays)
            </span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">
              {{ formatTimeRange(course.round.startTime, course.round.endTime) }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
            <span class="text-slate-400 text-[11px]">أيام المحاضرات:</span>
            <span
              v-for="day in course.round.lectureDays"
              :key="day"
              class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
            >
              {{ dayLabel(day) }}
            </span>
          </div>
        </div>

        <!-- 3. نسبة الحضور والتقدم في المنهج -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-700 dark:text-slate-300">سجل حضور المحاضرات:</span>
            <span class="font-mono font-black text-emerald-600 dark:text-emerald-400">
              {{ course.attendedLectures }} من إجمالي {{ course.round.totalLectures }} محاضرة ({{ getCourseProgress(course) }}%)
            </span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-500"
              :style="{ width: `${getCourseProgress(course)}%` }"
            />
          </div>
          <p class="text-[10px] text-slate-400">
            يشترط المعهد ألا تقل نسبة الحضور عن 75% للتأهل لاختبار التقييم النهائي واستحقاق الشهادة.
          </p>
        </div>

        <!-- 4. محاور المنهج التدريبي -->
        <div class="space-y-2">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-xs">مخطط المنهج التدريبي المعتمد</h4>
          <div class="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div class="p-3 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-mono font-black text-[10px] shrink-0">1</span>
              <div>
                <div class="font-bold text-slate-800 dark:text-slate-200">المفاهيم التأسيسية وهندسة البيئة التطبيقية</div>
                <div class="text-[10px] text-slate-400">مكتمل ومُجتاز بحضور المعمل</div>
              </div>
            </div>
            <div class="p-3 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-mono font-black text-[10px] shrink-0">2</span>
              <div>
                <div class="font-bold text-slate-800 dark:text-slate-200">التطبيقات العملية والمشاريع المتوسطة</div>
                <div class="text-[10px] text-slate-400">جاري التدريب والاختبارات الدورية</div>
              </div>
            </div>
            <div class="p-3 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-mono font-black text-[10px] shrink-0">3</span>
              <div>
                <div class="font-bold text-slate-700 dark:text-slate-300">مشروع التخرج النهائي والتقييم الشامل</div>
                <div class="text-[10px] text-slate-400">مجدول بنهاية فترة الانعقاد</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- تذييل المودال -->
      <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          class="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق
        </button>

        <RouterLink
          to="/trainee/passes"
          class="h-9 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          @click="$emit('close')"
        >
          <QrCode class="w-3.5 h-3.5" />
          <span>عرض تصريح الدخول</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import {
  BookOpen,
  X,
  User,
  MapPin,
  CalendarClock,
  QrCode,
} from 'lucide-vue-next';
import {
  formatTimeRange,
  getCourseProgress,
  WEEK_DAYS,
} from '../../helpers/traineePortalHelpers';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

function dayLabel(code) {
  return WEEK_DAYS.find((d) => d.code === code)?.label || code;
}
</script>