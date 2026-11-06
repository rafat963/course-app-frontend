<template>
  <div
    class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 select-none"
  >
    <!-- رأس الكارت: العنوان + الدومين + الكود -->
    <div class="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
      <!-- الكود + الدومين -->
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800"
        >
          <BookOpen class="w-3 h-3" />
          {{ round.courseDomain }}
        </span>

        <!-- حالة الدورة -->
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
          :class="statusConfig.badgeClass"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig.dotClass" />
          {{ statusConfig.label }}
        </span>
      </div>

      <!-- اسم الدورة -->
      <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-snug line-clamp-2">
        {{ round.courseName }}
      </h3>

      <!-- كود الدفعة -->
      <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
        <Tag class="w-3 h-3" />
        <span>{{ round.courseCode }}</span>
        <span class="text-slate-300 dark:text-slate-600">•</span>
        <span>الدفعة رقم {{ round.roundNumber }} ({{ round.roundCode }})</span>
      </div>
    </div>

    <!-- جسم الكارت -->
    <div class="px-5 py-4 space-y-3.5 flex-1">
      <!-- شريط تقدم المقاعد -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Users class="w-3.5 h-3.5 text-slate-400" />
            المقاعد المتاحة
          </span>
          <span class="font-mono font-black" :class="seatsTextClass">
            {{ remainingSeats }} / {{ round.capacity }}
          </span>
        </div>
        <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="seatsBarClass"
            :style="{ width: `${fillRate}%` }"
          />
        </div>
        <p class="text-[11px] text-slate-400 font-medium">
          {{ round.enrolledCount }} متدرب مقيد من إجمالي {{ round.capacity }} مقعد
        </p>
      </div>

      <!-- فترة الدورة -->
      <div class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
        <Calendar class="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
        <div>
          <span class="font-bold text-slate-700 dark:text-slate-300">فترة الانعقاد: </span>
          <span>{{ formatDateAr(round.startDate) }}</span>
          <span class="text-slate-400 mx-1">→</span>
          <span>{{ formatDateAr(round.endDate) }}</span>
        </div>
      </div>

      <!-- الموعد النهائي للتقديم -->
      <div class="flex items-center gap-2 text-xs" :class="deadlineClass">
        <Clock class="w-3.5 h-3.5 shrink-0" />
        <div class="flex items-center gap-1.5">
          <span class="font-bold">آخر موعد للتقديم:</span>
          <span>{{ formatDateAr(round.lastApplicationDate) }}</span>
          <span v-if="daysUntilDeadline !== null && daysUntilDeadline >= 0" class="font-black">
            ({{ daysUntilDeadline === 0 ? 'اليوم' : `بعد ${daysUntilDeadline} يوم` }})
          </span>
        </div>
      </div>

      <!-- الجدول الأسبوعي والتوقيت -->
      <div class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
        <AlarmClock class="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
        <div class="space-y-0.5">
          <div>
            <span class="font-bold text-slate-700 dark:text-slate-300">الأيام: </span>
            <span>{{ formatLectureDays(round.lectureDays) }}</span>
          </div>
          <div>
            <span class="font-bold text-slate-700 dark:text-slate-300">التوقيت: </span>
            <span class="font-mono">{{ formatTimeRange(round.startTime, round.endTime) }}</span>
            <span class="text-slate-400 mr-1">({{ lectureDuration }})</span>
          </div>
        </div>
      </div>

      <!-- سعر الفئة -->
      <div
        class="flex items-center justify-between p-2.5 rounded-2xl border border-dashed"
        :class="priceBoxClass"
      >
        <div class="flex items-center gap-2">
          <Banknote class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span class="text-xs font-bold text-slate-600 dark:text-slate-300">رسوم التسجيل (فئتك)</span>
        </div>
        <span class="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono">
          {{ formatPrice(myPrice) }}
        </span>
      </div>
    </div>

    <!-- أزرار الكارت -->
    <div class="px-5 pb-5 flex items-center gap-2.5">
      <!-- زر التفاصيل -->
      <button
        type="button"
        class="flex-1 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        @click="$emit('open-details', round)"
      >
        <Info class="w-3.5 h-3.5" />
        عرض التفاصيل
      </button>

      <!-- حالة: تم التقديم مسبقاً على هذه الدفعة -->
      <button
        v-if="application"
        type="button"
        disabled
        class="flex-1 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-[11px] font-black flex items-center justify-center gap-1.5 cursor-default select-none"
        :title="`كود الطلب: ${application.applicationCode} — قيد المراجعة`"
      >
        <BadgeCheck class="w-3.5 h-3.5 shrink-0" />
        <span v-if="submittedAtLabel">تم التقديم في {{ submittedAtLabel }}</span>
        <span v-else>تم التقديم</span>
      </button>

      <!-- زر التقديم (Available) أو شارة الاكتمال (Full) -->
      <button
        v-else-if="round.status === 'Available' && remainingSeats > 0"
        type="button"
        class="flex-1 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
        @click="$emit('apply', round)"
      >
        <Send class="w-3.5 h-3.5" />
        تقديم الآن
      </button>

      <div
        v-else
        class="flex-1 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
      >
        <Lock class="w-3.5 h-3.5" />
        المقاعد مكتملة
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  BookOpen,
  Tag,
  Users,
  Calendar,
  Clock,
  AlarmClock,
  Banknote,
  Info,
  Send,
  Lock,
  BadgeCheck,
} from 'lucide-vue-next';
import {
  formatLectureDays,
  formatTimeRange,
  formatDateAr,
  formatSubmissionDate,
  calcLectureDuration,
  getDaysUntilDeadline,
  getPriceByCategory,
  formatPrice,
  calcFillRate,
  calcRemainingSeats,
  getRoundStatusConfig,
} from '../helpers/availableCoursesHelpers';

const props = defineProps({
  round: {
    type: Object,
    required: true,
  },
  traineeCategory: {
    type: String,
    default: 'Civilian',
  },
  /** طلب التقديم الحالي للمتدرب على هذه الدفعة (إن وُجد) */
  application: {
    type: Object,
    default: null,
  },
});

defineEmits(['open-details', 'apply']);

const statusConfig = computed(() => getRoundStatusConfig(props.round.status));
const submittedAtLabel = computed(() =>
  formatSubmissionDate(props.application?.createdAt || props.application?.appliedAt)
);
const fillRate = computed(() => calcFillRate(props.round.enrolledCount, props.round.capacity));
const remainingSeats = computed(() => calcRemainingSeats(props.round.enrolledCount, props.round.capacity));
const daysUntilDeadline = computed(() => getDaysUntilDeadline(props.round.lastApplicationDate));
const lectureDuration = computed(() => calcLectureDuration(props.round.startTime, props.round.endTime));
const myPrice = computed(() => getPriceByCategory(props.round.pricings, props.traineeCategory));

// ألوان شريط المقاعد
const seatsBarClass = computed(() => {
  if (fillRate.value >= 100) return 'bg-purple-500';
  if (fillRate.value >= 75) return 'bg-amber-500';
  return 'bg-emerald-500';
});

const seatsTextClass = computed(() => {
  if (fillRate.value >= 100) return 'text-purple-700 dark:text-purple-300';
  if (fillRate.value >= 75) return 'text-amber-700 dark:text-amber-300';
  return 'text-emerald-700 dark:text-emerald-300';
});

// لون الموعد النهائي
const deadlineClass = computed(() => {
  const days = daysUntilDeadline.value;
  if (days === null || days < 0) return 'text-slate-400';
  if (days <= 3) return 'text-rose-600 dark:text-rose-400 font-bold';
  if (days <= 7) return 'text-amber-600 dark:text-amber-400';
  return 'text-slate-600 dark:text-slate-400';
});

const priceBoxClass = computed(() => {
  return 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/20';
});
</script>
