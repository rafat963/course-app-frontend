<template>
  <div
    v-if="isOpen && course"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in text-right"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة الرئيسية -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-2xs">
            <BookOpen class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                تفاصيل وبيانات الدورة التدريبية
              </h3>
              <span
                class="px-3 py-0.5 rounded-full text-xs font-bold border shadow-2xs"
                :class="
                  course.isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
                "
              >
                {{ course.isActive ? 'دورة نشطة ومتاحة' : 'معطلة مؤقتاً' }}
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ course.name }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- زر فتح دورة انعقاد جديدة لهذا الكورس -->
          <button
            type="button"
            class="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            @click="$emit('open-create-round', course.id)"
          >
            <CalendarPlus class="w-4.5 h-4.5" />
            <span>فتح دفعة جديدة</span>
          </button>

          <!-- زر الإغلاق -->
          <button
            type="button"
            class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 2. محتوى تفاصيل الدورة (مقسم بدقة إلى سكشن البيانات وسكشن الأسعار) -->
      <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-sm">
        
        <!-- =================== السكشن الأول: البيانات والتفاصيل الأساسية والأكاديمية =================== -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 class="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Info class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              <span>البيانات والتفاصيل الأكاديمية والتشغيلية</span>
            </h4>
            <span class="text-xs text-slate-400 font-mono">
              كود الدورة: CRS-{{ String(course.id).padStart(3, '0') }}
            </span>
          </div>

          <!-- بطاقة المحاضر والوصف -->
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div v-if="course.instructorName" class="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap class="w-4.5 h-4.5" />
              </div>
              <div class="text-xs sm:text-sm">
                <span class="text-slate-500 dark:text-slate-400 block text-[11px]">المحاضر المعتمد للدورة:</span>
                <strong class="font-black text-slate-800 dark:text-slate-100">{{ course.instructorName }}</strong>
              </div>
            </div>

            <div>
              <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">وصف ومحتوى الدورة:</span>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {{ course.description }}
              </p>
            </div>
          </div>

          <!-- شريط المؤشرات التراكمية للدورة -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">إجمالي الدفعات:</span>
              <div class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-mono">
                {{ course.roundsCount || 0 }} دفعة
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الدفعات السابقة:</span>
              <div class="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                {{ pastRounds.length }} دورة منتهية
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الخريجون المعتمدون:</span>
              <div class="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {{ totalGraduates }} خريجاً
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الإيرادات المحصلة:</span>
              <div class="text-base sm:text-lg font-black text-primary-700 dark:text-primary-300 font-mono">
                {{ formatCurrency(totalRevenue) }}
              </div>
            </div>
          </div>
        </div>

        <!-- =================== السكشن الثاني: هيكل الرسوم والأسعار المعتمدة =================== -->
        <div class="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CreditCard class="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">
                  هيكل الرسوم والأسعار المعتمدة للفئات التدريبية
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  الرسوم الرسمية المقررة لكل فئة معتمدة عند فتح باب التسديد
                </p>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              4 فئات معتمدة
            </span>
          </div>

          <!-- شبكة كروت الأسعار للفئات الأربعة -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
            <!-- 1. مدني -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-1.5 shadow-2xs hover:border-slate-400 transition-colors">
              <span class="text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>فئة مدني:</span>
              </span>
              <strong class="font-mono text-slate-900 dark:text-slate-100 font-black text-base sm:text-lg">
                {{ formatCurrency(course.pricings?.Civilian) }}
              </strong>
              <span class="text-[10px] text-slate-400">السعر الأساسي المعتمد</span>
            </div>

            <!-- 2. ضابط ق.م -->
            <div class="p-3.5 rounded-2xl bg-primary-50/60 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800 flex flex-col justify-between gap-1.5 shadow-2xs hover:border-primary-400 transition-colors">
              <span class="text-primary-800 dark:text-primary-300 text-xs font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-primary-600"></span>
                <span>ضابط ق.م:</span>
              </span>
              <strong class="font-mono text-primary-900 dark:text-primary-200 font-black text-base sm:text-lg">
                {{ formatCurrency(course.pricings?.MilitaryOfficer) }}
              </strong>
              <span class="text-[10px] text-primary-700 dark:text-primary-400">خصم الضباط</span>
            </div>

            <!-- 3. عائلات ق.م -->
            <div class="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 flex flex-col justify-between gap-1.5 shadow-2xs hover:border-emerald-400 transition-colors">
              <span class="text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>عائلات ق.م:</span>
              </span>
              <strong class="font-mono text-emerald-900 dark:text-emerald-200 font-black text-base sm:text-lg">
                {{ formatCurrency(course.pricings?.MilitaryFamily) }}
              </strong>
              <span class="text-[10px] text-emerald-700 dark:text-emerald-400">خصم أسر القوات المسلحة</span>
            </div>

            <!-- 4. شرطة / عائلاتهم -->
            <div class="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 flex flex-col justify-between gap-1.5 shadow-2xs hover:border-blue-400 transition-colors">
              <span class="text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>شرطة / عائلاتهم:</span>
              </span>
              <strong class="font-mono text-blue-900 dark:text-blue-200 font-black text-base sm:text-lg">
                {{ formatCurrency(course.pricings?.PoliceOfficerOrFamily) }}
              </strong>
              <span class="text-[10px] text-blue-700 dark:text-blue-400">خصم ضباط وأسر الشرطة</span>
            </div>
          </div>
        </div>

      </div>

      <!-- 4. الشريط السفلي: إغلاق النافذة -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
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
  BookOpen,
  X,
  CalendarPlus,
  History,
  GraduationCap,
  ArrowLeft,
  Info,
  CreditCard,
} from 'lucide-vue-next';
import {
  formatEgyptianCurrency,
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
  allPastRounds: {
    type: Array,
    default: () => [],
  },
  allOperationalRounds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'close',
  'open-create-round',
  'open-past-rounds',
  'open-active-rounds',
]);

function handleClose() {
  emit('close');
}

function formatCurrency(val) {
  return formatEgyptianCurrency(val);
}

// الدورات السابقة المنتهية الخاصة بهذا الكورس فقط
const pastRounds = computed(() => {
  if (!props.course) return [];
  return props.allPastRounds.filter((r) => r.courseId === props.course.id);
});

// الدورات التشغيلية المتاحة أو الجارية حالياً
const activeRounds = computed(() => {
  if (!props.course) return [];
  return props.allOperationalRounds.filter(
    (r) => r.courseId === props.course.id && (r.status === 'Ongoing' || r.status === 'Available')
  );
});

// إجمالي الخريجين المعتمدين من الدورات السابقة
const totalGraduates = computed(() => {
  return pastRounds.value.reduce((sum, r) => sum + (r.graduatedCount || 0), 0);
});

// إجمالي الإيرادات التراكمية المحصلة من الدورات السابقة
const totalRevenue = computed(() => {
  return pastRounds.value.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
});
</script>
