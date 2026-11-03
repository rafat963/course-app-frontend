<template>
  <AppTable
    :columns="columns"
    :data="logs"
    :is-filtered="isFiltered"
    empty-title="لا توجد حركات مسح مطابقة لمعايير البحث"
    empty-text="جرّب تغيير تبويب قرار الدخول أو مسح نص البحث لعرض كافة حركات البوابة لليوم"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. توقيت المسح -->
    <template #time="{ row }">
      <div class="font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
        <Clock class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
        <span>{{ formatTimeOnly(row.scannedAt) }}</span>
      </div>
      <div class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
        {{ formatDateOnly(row.scannedAt) }}
      </div>
    </template>

    <!-- 2. بيانات الدارس / المتقدم -->
    <template #trainee="{ row }">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
          <img
            v-if="row.trainee?.profilePhotoPath"
            :src="row.trainee.profilePhotoPath"
            :alt="row.trainee.fullName"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-xs font-bold text-primary-700 dark:text-primary-300">
            {{ getInitials(row.trainee?.fullName) }}
          </span>
        </div>

        <div class="min-w-0">
          <button
            type="button"
            class="font-bold text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 truncate max-w-[180px] text-right cursor-pointer transition-colors block"
            :title="`عرض تفاصيل وسجل الدارس ${row.trainee?.fullName}`"
            @click="$emit('open-details', row)"
          >
            {{ row.trainee?.fullName }}
          </button>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
            {{ row.trainee?.nationalId }} • {{ row.trainee?.phone }}
          </div>
        </div>
      </div>
    </template>

    <!-- 3. الدورة والقاعة -->
    <template #course="{ row }">
      <div class="font-bold text-slate-800 dark:text-slate-200 max-w-[200px] truncate" :title="row.courseRound?.courseName">
        {{ row.courseRound?.courseName }}
      </div>
      <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
        <Building2 class="w-3 h-3 text-slate-400 shrink-0" />
        <span>{{ row.courseRound?.hallName }}</span>
        <span>•</span>
        <span>الدفعة {{ row.courseRound?.roundNumber }}</span>
      </div>
    </template>

    <!-- 4. قرار الدخول (Allowed / Denied) -->
    <template #decision="{ row }">
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs"
        :class="
          row.decision === 'Allowed'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
        "
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="row.decision === 'Allowed' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'"
        ></span>
        <span>{{ row.decision === 'Allowed' ? 'دخول مصرح' : 'دخول مرفوض' }}</span>
      </span>
    </template>

    <!-- 6. سبب القرار الأمني -->
    <template #reason="{ row }">
      <div
        class="text-xs font-medium max-w-[200px] truncate"
        :class="row.decision === 'Allowed' ? 'text-slate-600 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-bold'"
        :title="row.reason"
      >
        {{ row.reason }}
      </div>
    </template>

    <!-- 7. فرد الأمن والبوابة -->
    <template #officer="{ row }">
      <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">
        {{ row.officer?.name }}
      </div>
      <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
        <Shield class="w-3 h-3 text-slate-400" />
        <span>{{ row.officer?.gateName }}</span>
      </div>
    </template>

    <!-- 8. الإجراءات (عرض تفاصيل الحركة) -->
    <template #actions="{ row }">
      <button
        type="button"
        class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs mx-auto"
        title="عرض التقرير الكامل للحركة وموقف الدارس"
        @click="$emit('open-details', row)"
      >
        <Eye class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        <span>تفاصيل الحركة</span>
      </button>
    </template>
  </AppTable>
</template>

<script setup>
import {
  Clock,
  Building2,
  Shield,
  Eye,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
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

const columns = [
  { key: 'time', label: 'توقيت المسح', cellClass: 'whitespace-nowrap' },
  { key: 'trainee', label: 'الدارس / المتقدم' },
  { key: 'course', label: 'الدورة التدريبية والقاعة' },
  { key: 'decision', label: 'القرار الأمني', cellClass: 'whitespace-nowrap' },
  { key: 'reason', label: 'سبب القرار المسجل' },
  { key: 'officer', label: 'فرد الأمن والبوابة', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];
</script>
