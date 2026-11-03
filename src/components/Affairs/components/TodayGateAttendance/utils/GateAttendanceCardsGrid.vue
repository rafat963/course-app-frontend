<template>
  <div v-if="logs.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
      <ShieldAlert class="w-8 h-8" />
    </div>
    <h3 class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
      لا توجد حركات مسح مطابقة لمعايير البحث
    </h3>
    <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
      جرّب تغيير تبويب قرار الدخول أو مسح نص البحث لعرض كافة حركات البوابة لليوم
    </p>
    <button
      v-if="isFiltered"
      type="button"
      class="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
      @click="$emit('clear-filters')"
    >
      <RotateCcw class="w-4 h-4" />
      <span>إعادة ضبط الفلاتر</span>
    </button>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-4.5">
    <div
      v-for="row in logs"
      :key="row.id"
      class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group shadow-2xs"
    >
      <!-- شريط الحالة العلوي -->
      <div
        class="absolute top-0 right-0 left-0 h-1"
        :class="row.decision === 'Allowed' ? 'bg-emerald-500' : 'bg-rose-500'"
      ></div>

      <div>
        <!-- رأس الكارت: توقيت المسح + شارة القرار -->
        <div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div class="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
            <span>{{ formatTimeOnly(row.scannedAt) }}</span>
            <span class="text-xs text-slate-400 font-sans font-normal">({{ formatDateOnly(row.scannedAt) }})</span>
          </div>

          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
            :class="
              row.decision === 'Allowed'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
            "
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="row.decision === 'Allowed' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'"
            ></span>
            <span>{{ row.decision === 'Allowed' ? 'دخول مصرح' : 'دخول مرفوض' }}</span>
          </span>
        </div>

        <!-- بيانات الدارس -->
        <div class="flex items-center gap-3 my-3.5">
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
            <img
              v-if="row.trainee?.profilePhotoPath"
              :src="row.trainee.profilePhotoPath"
              :alt="row.trainee.fullName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-sm font-bold text-primary-700 dark:text-primary-300">
              {{ getInitials(row.trainee?.fullName) }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <button
              type="button"
              class="font-black text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 text-base sm:text-lg truncate text-right cursor-pointer transition-colors block w-full leading-tight"
              :title="`عرض تفاصيل وسجل الدارس ${row.trainee?.fullName}`"
              @click="$emit('open-details', row)"
            >
              {{ row.trainee?.fullName }}
            </button>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {{ row.trainee?.nationalId }} • {{ row.trainee?.phone }}
            </div>
          </div>
        </div>

        <!-- تفاصيل الدورة والقاعة -->
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs sm:text-sm mb-3.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">الدورة التدريبية:</span>
            <span class="font-bold text-slate-800 dark:text-slate-100 text-left truncate max-w-[190px]" :title="row.courseRound?.courseName">
              {{ row.courseRound?.courseName }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">القاعة / الدفعة:</span>
            <span class="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
              <Building2 class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{{ row.courseRound?.hallName }}</span>
              <span>•</span>
              <span>الدفعة {{ row.courseRound?.roundNumber }}</span>
            </span>
          </div>
        </div>

        <!-- سبب القرار الأمني -->
        <div class="mb-3.5">
          <div class="text-xs text-slate-400 dark:text-slate-500 mb-1 font-medium">سبب القرار المسجل:</div>
          <div
            class="p-2.5 rounded-xl text-xs sm:text-sm leading-relaxed font-bold border"
            :class="
              row.decision === 'Allowed'
                ? 'bg-slate-50/70 text-slate-700 border-slate-200/80 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-800'
                : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60'
            "
          >
            {{ row.reason }}
          </div>
        </div>
      </div>

      <!-- أسفل الكارت: فرد الأمن + زر التفاصيل -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div class="text-xs">
          <span class="text-slate-400 block font-medium">فرد الأمن:</span>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ row.officer?.name }}</span>
        </div>

        <button
          type="button"
          class="h-9.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="عرض التقرير الكامل للحركة وموقف الدارس"
          @click="$emit('open-details', row)"
        >
          <Eye class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>تفاصيل الحركة</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Clock,
  Building2,
  ShieldAlert,
  RotateCcw,
  Eye,
} from 'lucide-vue-next';
import {
  formatTimeOnly,
  formatDateOnly,
} from '../helpers/gateAttendanceConstants';

defineProps({
  logs: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['open-details', 'clear-filters']);

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}
</script>