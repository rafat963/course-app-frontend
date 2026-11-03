<template>
  <div
    v-if="isOpen && log"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
      <!-- ترويسة المودال مع بانر القرار الأمني -->
      <div
        class="p-5 sm:p-6 border-b flex items-center justify-between shrink-0"
        :class="
          log.decision === 'Allowed'
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80'
            : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80'
        "
      >
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0"
            :class="
              log.decision === 'Allowed'
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-700'
            "
          >
            <CheckCircle2 v-if="log.decision === 'Allowed'" class="w-6 h-6" />
            <XCircle v-else class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                تقرير مسح تصريح البوابة
              </h3>
              <span
                class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border"
                :class="
                  log.decision === 'Allowed'
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border-rose-300'
                "
              >
                {{ log.decision === 'Allowed' ? 'دخول مصرح به' : 'دخول مرفوض' }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              سجل تدقيق حركة الدخول من البوابة • {{ formatTimeOnly(log.scannedAt) }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- محتوى التمرير -->
      <div class="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar text-sm">
        <!-- 1. كارت تفاصيل قرار فرد الأمن والسبب -->
        <div
          class="p-4 sm:p-5 rounded-2xl border space-y-2.5"
          :class="
            log.decision === 'Allowed'
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/60'
          "
        >
          <div class="flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm">السبب المسجل للقرار:</span>
            <span
              class="font-black text-sm sm:text-base"
              :class="log.decision === 'Allowed' ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'"
            >
              {{ log.reason }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <span class="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm">فرد الأمن المسؤول عن المسح:</span>
            <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">{{ log.officer?.name }} ({{ log.officer?.gateName }})</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm">رمز تصريح الـ QR الممسوح:</span>
            <span class="font-mono font-bold text-sm sm:text-base text-primary-700 dark:text-primary-400">{{ log.qrToken }}</span>
          </div>
        </div>

        <!-- 2. كارت بيانات الدارس / المتقدم -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <User class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>بيانات الدارس / صاحب التصريح</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الاسم الكامل:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base mt-0.5 block">{{ log.trainee?.fullName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الرقم القومي:</span>
              <span class="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5 block">{{ log.trainee?.nationalId }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">رقم الهاتف:</span>
              <span class="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5 block">{{ log.trainee?.phone }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الفئة المعتمدة:</span>
              <span
                class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mt-0.5"
                :class="getCategoryBadge(log.trainee?.category).class"
              >
                {{ getCategoryBadge(log.trainee?.category).label }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. كارت بيانات الدورة والقاعة التدريبية -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <GraduationCap class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>الدورة التدريبية ومقر الانعقاد</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">اسم الدورة:</span>
              <strong class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ log.courseRound?.courseName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">مكان الانعقاد:</span>
              <span class="flex items-center gap-1.5 font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5">
                <Building2 class="w-4 h-4 text-primary-600 shrink-0" />
                <span>{{ log.courseRound?.hallName }}</span>
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">المحاضر المسؤول:</span>
              <span class="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-0.5 block">{{ log.courseRound?.instructorName }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">توقيت المحاضرة:</span>
              <span class="font-mono font-bold text-sm sm:text-base mt-0.5 block">{{ log.courseRound?.timeRange }}</span>
            </div>
          </div>
        </div>

        <!-- 4. الموقف الأكاديمي والمالي وسجل الحضور -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <ShieldCheck class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>الموقف الأكاديمي وسجل الحضور الكلي</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">حالة القيد:</span>
              <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ log.academicStanding?.statusText }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">إيصال السداد:</span>
              <span class="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ log.academicStanding?.receiptNumber || 'غير مسدد' }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">نسبة الحضور حتى الآن:</span>
              <span class="font-black text-emerald-700 dark:text-emerald-400 text-sm sm:text-base mt-0.5 block">
                {{ log.academicStanding?.attendanceRate }}% ({{ log.academicStanding?.attendedLectures }} من {{ log.academicStanding?.totalLectures }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- أسفل المودال -->
      <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-end shrink-0">
        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CheckCircle2,
  XCircle,
  X,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
} from 'lucide-vue-next';
import {
  APPLICANT_CATEGORIES,
  formatTimeOnly,
} from '../helpers/gateAttendanceConstants';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  log: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

function getCategoryBadge(cat) {
  return (
    APPLICANT_CATEGORIES[cat] || {
      label: cat || 'مدني',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}
</script>
