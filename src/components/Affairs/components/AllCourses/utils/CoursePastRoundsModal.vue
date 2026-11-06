<template>
  <div
    v-if="isOpen && course"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in text-right"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. ترويسة المودال -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-2xs">
            <History class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                سجل الدورات السابقة المنعقدة
              </h3>
              <span class="px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                {{ coursePastRounds.length }} دورة سابقة
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ course.name }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 2. محتوى الدورات السابقة -->
      <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-sm">
        <div v-if="coursePastRounds.length > 0" class="space-y-3.5">
          <div
            v-for="round in coursePastRounds"
            :key="round.id"
            class="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-primary-300 dark:hover:border-primary-700/60 transition-all shadow-2xs hover:shadow-xs space-y-3.5"
          >
            <!-- رأس كارت الدورة السابقة مع زر فتح تفاصيلها -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <strong class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                  الدفعة رقم {{ round.roundNumber }}
                </strong>
                <span class="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  {{ round.roundCode || `CR-${round.courseId}-${round.roundNumber}` }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  منتهية ومعتمدة
                </span>
              </div>

              <!-- زر فتح تفاصيل هذه الدورة بالكامل -->
              <button
                type="button"
                class="h-10 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow"
                title="فتح تفاصيل هذه الدورة السابقة والطلاب والمحاضر"
                @click="handleOpenRound(round)"
              >
                <FolderCheck class="w-4.5 h-4.5" />
                <span>عرض تفاصيل وسجل الدورة</span>
              </button>
            </div>

            <!-- شبكة تفاصيل الدورة السابقة (المحاضر، القاعة، الفترة، الخريجون، الإيرادات) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
              <!-- المحاضر -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span class="text-slate-400 dark:text-slate-500 font-bold block flex items-center gap-1">
                  <GraduationCap class="w-3.5 h-3.5 text-emerald-600" />
                  <span>المحاضر:</span>
                </span>
                <strong class="font-bold text-slate-800 dark:text-slate-100 block truncate" :title="round.instructor?.name || round.instructorName">
                  {{ round.instructor?.name || round.instructorName }}
                </strong>
              </div>

              <!-- القاعة ومقر الانعقاد -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span class="text-slate-400 dark:text-slate-500 font-bold block flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-primary-500" />
                  <span>القاعة:</span>
                </span>
                <span class="font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {{ round.hall?.name || round.hallName }}
                </span>
              </div>

              <!-- فترة الانعقاد -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span class="text-slate-400 dark:text-slate-500 font-bold block flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5 text-amber-500" />
                  <span>فترة الانعقاد:</span>
                </span>
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300 block text-[11px] sm:text-xs">
                  {{ formatDate(round.startDate) }} — {{ formatDate(round.endDate) }}
                </span>
              </div>

              <!-- الخريجون والإيرادات -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span class="text-slate-400 dark:text-slate-500 font-bold block flex items-center gap-1">
                  <Users class="w-3.5 h-3.5 text-emerald-600" />
                  <span>الخريجون والإيراد:</span>
                </span>
                <div class="flex items-center justify-between font-mono font-black">
                  <span class="text-slate-800 dark:text-slate-100">{{ round.graduatedCount || round.enrolledCount || 20 }} خريجاً</span>
                  <span class="text-emerald-600 dark:text-emerald-400">{{ formatCurrency(round.totalRevenue || 70000) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- حالة عدم وجود دورات سابقة مسجلة -->
        <div
          v-else
          class="p-10 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
        >
          <History class="w-10 h-10 text-slate-400 mx-auto" />
          <h4 class="text-base font-bold text-slate-700 dark:text-slate-200">
            لا توجد دورات سابقة منتهية مسجلة لهذه الدورة حتى الآن
          </h4>
          <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            تظهر الدورات السابقة هنا تلقائياً بمجرد انتهاء فترة انعقاد الدفعة واعتماد شهادات الخريجين
          </p>
        </div>
      </div>

      <!-- 3. أسفل المودال: أزرار العودة والإغلاق -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <button
          type="button"
          class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          @click="$emit('back')"
        >
          <ArrowRight class="w-4 h-4" />
          <span>العودة لتفاصيل الدورة</span>
        </button>

        <button
          type="button"
          class="h-11 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-bold transition-colors cursor-pointer"
          @click="handleClose"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  History,
  X,
  FolderCheck,
  GraduationCap,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
} from 'lucide-vue-next';
import {
  formatEgyptianCurrency,
  formatDate,
} from '../helpers/courseConstants';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Object,
    default: null,
  },
  pastRounds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'back', 'open-round-details']);

const coursePastRounds = computed(() => {
  if (!props.course) return [];
  return props.pastRounds
    .filter((r) => r.courseId === props.course.id)
    .sort((a, b) => (b.roundNumber || 0) - (a.roundNumber || 0));
});

function formatCurrency(val) {
  return formatEgyptianCurrency(val);
}

function handleClose() {
  emit('close');
}

function handleOpenRound(round) {
  emit('open-round-details', round);
}
</script>
