<template>
  <!-- نافذة تفاصيل الدورة والدفعة -->
  <div
    v-if="isOpen && round"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. رأس المودال -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <BookOpen class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">تفاصيل الدورة التدريبية</h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">بيانات الدورة والدفعة والأسعار التفصيلية</p>
          </div>
        </div>
        <button
          type="button"
          class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- 2. المحتوى القابل للتمرير -->
      <div class="p-5 space-y-4 overflow-y-auto max-h-[calc(85vh-130px)] text-xs custom-scrollbar">
        <!-- بطاقة العنوان والحالة -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
              {{ round.courseDomain }}
            </span>
            <span class="text-[11px] font-mono text-slate-400">
              {{ round.courseCode }} • {{ round.roundCode }}
            </span>
          </div>
          <h2 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading leading-snug">
            {{ round.courseName }}
          </h2>
          <p class="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ round.courseDescription }}
          </p>
        </div>

        <!-- القسم الأكاديمي: الساعات + النسبة + المحاضرات -->
        <div>
          <div class="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 mb-2.5 text-xs">
            <GraduationCap class="w-4 h-4 text-primary-500" />
            المعطيات الأكاديمية
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-center space-y-1">
              <div class="text-lg font-black text-blue-700 dark:text-blue-400 font-mono">{{ round.totalHours }}</div>
              <div class="text-[11px] text-slate-500">إجمالي الساعات</div>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center space-y-1">
              <div class="text-lg font-black text-amber-700 dark:text-amber-400 font-mono">{{ round.totalLectures }}</div>
              <div class="text-[11px] text-slate-500">إجمالي المحاضرات</div>
            </div>
          </div>
        </div>

        <!-- قاعة الانعقاد والمحاضر -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- القاعة -->
          <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-2">
            <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <MapPin class="w-3.5 h-3.5 text-primary-500" />
              مقر الانعقاد
            </div>
            <div class="font-black text-xs text-slate-800 dark:text-slate-100">{{ round.hall?.name }}</div>
            <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span
                class="px-1.5 py-0.5 rounded font-bold border"
                :class="round.hall?.type === 'Lab'
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'"
              >
                {{ round.hall?.type === 'Lab' ? 'معمل تدريب' : 'قاعة محاضرات' }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span class="font-bold">الموقع:</span>
              <span>{{ round.hall?.location }}</span>
            </div>
          </div>

          <!-- المحاضر -->
          <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-2">
            <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <User class="w-3.5 h-3.5 text-emerald-500" />
              المحاضر المعتمد
            </div>
            <div class="font-black text-xs text-slate-800 dark:text-slate-100">{{ round.instructor?.name }}</div>
            <p class="text-[11px] text-slate-400 dark:text-slate-500">{{ round.instructor?.specialty }}</p>
          </div>
        </div>

        <!-- جدول مواعيد الدورة -->
        <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
          <div class="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
            <Clock class="w-4 h-4 text-amber-500" />
            <span>الجدول الزمني ومواعيد المحاضرات</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-0.5">
              <div class="text-[11px] text-slate-400">فترة الانعقاد:</div>
              <div class="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                {{ formatDateAr(round.startDate) }} → {{ formatDateAr(round.endDate) }}
              </div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[11px] text-slate-400">توقيت المحاضرة:</div>
              <div class="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                {{ round.startTime }} — {{ round.endTime }}
              </div>
            </div>
            <div class="col-span-2 space-y-0.5">
              <div class="text-[11px] text-slate-400">أيام المحاضرات الأسبوعية:</div>
              <div class="flex flex-wrap gap-1.5 mt-1">
                <span
                  v-for="day in round.lectureDays"
                  :key="day"
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                >
                  {{ DAY_LABELS[day] || day }}
                </span>
              </div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[11px] text-slate-400">آخر موعد للتقديم:</div>
              <div class="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">
                {{ formatDateAr(round.lastApplicationDate) }}
              </div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[11px] text-slate-400">المقاعد المتبقية:</div>
              <div class="font-mono font-bold text-xs" :class="round.status === 'Full' ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'">
                {{ calcRemainingSeats(round.enrolledCount, round.capacity) }} من {{ round.capacity }} مقعد
              </div>
            </div>
          </div>
        </div>

        <!-- جدول الأسعار الكامل حسب الفئات -->
        <div>
          <div class="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 mb-2.5">
            <Banknote class="w-4 h-4 text-emerald-500" />
            الأسعار التفصيلية حسب الفئة
          </div>
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden">
            <div
              v-for="(item, idx) in pricingRows"
              :key="item.key"
              class="flex items-center justify-between px-4 py-2.5 text-xs"
              :class="[
                idx < pricingRows.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : '',
                item.isActive ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-white dark:bg-slate-800/40'
              ]"
            >
              <div class="flex items-center gap-2">
                <span
                  v-if="item.isActive"
                  class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                />
                <span class="font-bold" :class="item.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'">
                  {{ item.label }}
                </span>
                <span v-if="item.isActive" class="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold">← فئتك</span>
              </div>
              <span class="font-mono font-black" :class="item.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'">
                {{ formatPrice(item.price) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. الأزرار السفلية -->
      <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <!-- حالة: تم التقديم مسبقاً — إزالة زر "تقديم الآن" واستبداله ببادج/نص معطل يوضح تاريخ التقديم -->
        <div
          v-if="application"
          class="flex-1 h-10 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed select-none shadow-xs"
        >
          <BadgeCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>تم التقديم في {{ appliedDateLabel }}</span>
          <span v-if="application.applicationCode" class="text-[11px] font-mono text-emerald-600/80 dark:text-emerald-400/80 mr-1">
            ({{ application.applicationCode }})
          </span>
        </div>

        <!-- أزرار التقديم / الاكتمال تظهر فقط عندما لا يكون هناك تقديم مسبق -->
        <template v-else>
          <button
            v-if="round.status === 'Available' && calcRemainingSeats(round.enrolledCount, round.capacity) > 0"
            type="button"
            class="flex-1 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            @click="$emit('apply', round); $emit('close')"
          >
            <Send class="w-3.5 h-3.5" />
            تقديم الآن
          </button>
          <div
            v-else
            class="flex-1 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
          >
            <Lock class="w-3.5 h-3.5" />
            المقاعد مكتملة
          </div>
        </template>

        <button
          type="button"
          class="h-10 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  X,
  BookOpen,
  GraduationCap,
  MapPin,
  User,
  Clock,
  Banknote,
  Send,
  Lock,
  BadgeCheck,
} from 'lucide-vue-next';
import {
  formatDateAr,
  formatPrice,
  calcRemainingSeats,
  formatSubmissionDate,
  DAY_LABELS,
  CATEGORY_CONFIG,
} from '../../helpers/availableCoursesHelpers';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Object,
    default: null,
  },
  traineeCategory: {
    type: String,
    default: 'Civilian',
  },
  application: {
    type: Object,
    default: null,
  },
});

defineEmits(['close', 'apply']);

/** تاريخ التقديم المنسق بصيغة [التاريخ] */
const appliedDateLabel = computed(() => {
  if (!props.application) return '';
  const dateVal = props.application.createdAt || props.application.appliedAt;
  return formatSubmissionDate(dateVal) || 'تاريخ معتمد';
});

/** صفوف جدول الأسعار مع تمييز فئة المتدرب الحالي */
const pricingRows = computed(() => {
  if (!props.round?.pricings) return [];
  const categories = [
    { key: 'Civilian', label: CATEGORY_CONFIG.Civilian.labelFull },
    { key: 'MilitaryOfficer', label: CATEGORY_CONFIG.MilitaryOfficer.labelFull },
    { key: 'MilitaryFamily', label: CATEGORY_CONFIG.MilitaryFamily.labelFull },
    { key: 'PoliceOfficerOrFamily', label: CATEGORY_CONFIG.PoliceOfficerOrFamily.labelFull },
  ];
  return categories.map((cat) => ({
    ...cat,
    price: props.round.pricings[cat.key] || 0,
    isActive: cat.key === props.traineeCategory,
  }));
});
</script>
