<template>
  <AppTable
    :columns="columns"
    :data="rounds"
    :is-filtered="isFiltered"
    empty-title="لا توجد دورات سابقة مطابقة لمعايير البحث"
    empty-text="جرّب تعديل خيارات التصفية أو مسح نص البحث لعرض الأرشيف"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. الدورة التدريبية ورقم الدفعة المنتهية -->
    <template #course="{ row }">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-1.5">
          <strong class="font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm block truncate max-w-[200px]" :title="row.courseName">
            {{ row.courseName }}
          </strong>
          <!-- شارة رقم الدفعة -->
          <span class="px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold">
            دفعة {{ row.roundNumber }}
          </span>
          <!-- شارة منتهية -->
          <span class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            منتهية ومؤرشفة
          </span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          كود الدفعة: {{ row.roundCode }}
        </p>
      </div>
    </template>

    <!-- 2. المحاضر الذي شرح الدورة -->
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
        </div>
      </div>
    </template>

    <!-- 4. فترة الانعقاد وتاريخ الانتهاء -->
    <template #period="{ row }">
      <div class="space-y-0.5 text-xs">
        <div class="font-mono text-slate-800 dark:text-slate-200 font-bold">
          {{ formatDate(row.startDate) }} — {{ formatDate(row.endDate) }}
        </div>
        <div class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <CheckCircle2 class="w-3 h-3 text-emerald-500" />
          <span>تم إنجاز {{ row.totalLectures }} محاضرة كاملة</span>
        </div>
      </div>
    </template>

    <!-- 5. الخريجون والشهادات -->
    <template #graduates="{ row }">
      <div class="space-y-0.5 text-xs">
        <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <Users class="w-3.5 h-3.5 text-primary-600" />
          <span class="font-mono">{{ row.graduatedCount }} خريجاً معتمداً</span>
        </div>
        <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          صدرت شهادات التخرج
        </div>
      </div>
    </template>

    <!-- 6. الرسوم والإيرادات المحصلة وحضور البوابة -->
    <template #financials="{ row }">
      <div class="space-y-1 text-xs min-w-[120px]">
        <div class="flex items-center justify-between">
          <span class="text-slate-400 text-[11px]">المحصل:</span>
          <strong class="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            {{ formatCurrency(row.totalRevenue) }}
          </strong>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-400 text-[11px]">حضور البوابة:</span>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {{ row.averageAttendance }}%
          </span>
        </div>
      </div>
    </template>

    <!-- 7. الإجراءات -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center">
        <!-- زر فتح تفاصيل وسجل الدفعة (الطلاب، التكلفة، المحاضر) -->
        <button
          type="button"
          class="h-8 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
          title="معاينة تفاصيل الدفعة، الطلاب الخريجين، والإيرادات والتكاليف"
          @click="$emit('open-details', row)"
        >
          <FolderCheck class="w-3.5 h-3.5" />
          <span>تفاصيل الدفعة</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  GraduationCap,
  MapPin,
  CheckCircle2,
  Users,
  FolderCheck,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import {
  formatDate,
  formatEgyptianCurrency,
} from '../helpers/archivedCoursesConstants';

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

defineEmits(['open-details', 'clear-filters']);

const columns = [
  { key: 'course', label: 'الدورة التدريبية والدفعة' },
  { key: 'instructor', label: 'المحاضر المعتمد', cellClass: 'whitespace-nowrap' },
  { key: 'hall', label: 'القاعة التدريبية', cellClass: 'whitespace-nowrap' },
  { key: 'period', label: 'فترة الانعقاد والمحاضرات' },
  { key: 'graduates', label: 'الخريجون', cellClass: 'whitespace-nowrap' },
  { key: 'financials', label: 'الرسوم والإيراد المحصل', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];

function formatCurrency(val) {
  return formatEgyptianCurrency(val);
}
</script>
