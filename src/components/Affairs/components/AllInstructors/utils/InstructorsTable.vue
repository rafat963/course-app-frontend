<template>
  <AppTable
    :columns="columns"
    :data="instructors"
    :is-filtered="isFiltered"
    empty-title="لا يوجد محاضرون مطابقون لمعايير البحث"
    empty-text="جرّب تعديل خيارات الفلترة أو مسح نص البحث لعرض دليل المحاضرين"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. المحاضر والاسم والأفاتار -->
    <template #instructor="{ row }">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-xs shrink-0 shadow-2xs">
          {{ getInstructorInitials(row.name) }}
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-1.5">
            <strong class="font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm block truncate max-w-[170px]" :title="row.name">
              {{ row.name }}
            </strong>
            <!-- شارة التدريس حالياً إذا كان لديه دفعة جارية -->
            <span
              v-if="hasOngoingRound(row)"
              class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>يدرّس حالياً</span>
            </span>
          </div>
          <p class="text-[11px] text-slate-400 font-mono">
            كود المحاضر: INS-{{ String(row.id).padStart(3, '0') }}
          </p>
        </div>
      </div>
    </template>

    <!-- 2. التخصص العلمي المعتمد -->
    <template #specialty="{ row }">
      <span class="inline-block px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-[11px]">
        {{ row.specialty }}
      </span>
    </template>

    <!-- 3. بيانات التواصل (الهاتف والبريد) -->
    <template #contact="{ row }">
      <div class="space-y-1 text-xs">
        <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono font-bold">
          <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{{ row.phone }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span class="truncate max-w-[170px]">{{ row.email || '—' }}</span>
        </div>
      </div>
    </template>

    <!-- 4. الدفعات وسجل التدريس -->
    <template #rounds="{ row }">
      <div class="space-y-0.5 text-xs">
        <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <Layers class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span class="font-mono">{{ row.roundsTaught?.length || 0 }}</span>
          <span>دفعات مسندة</span>
        </div>
        <div class="text-[11px] text-slate-400">
          <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ countActiveRounds(row) }} جارية ومتاحة</span>
        </div>
      </div>
    </template>

    <!-- 5. الدارسون الخريجون ونسبة الحضور -->
    <template #graduates="{ row }">
      <div class="space-y-0.5 text-xs">
        <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <GraduationCap class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span class="font-mono font-black">{{ calculateTotalGraduates(row) }}</span>
          <span>دارساً خريجاً</span>
        </div>
        <div class="text-[11px] text-slate-400">
          متوسط حضور: <span class="font-mono font-bold text-slate-600 dark:text-slate-300">{{ calculateAverageAttendance(row) }}%</span>
        </div>
      </div>
    </template>

    <!-- 6. حالة الاعتماد بالمنظومة -->
    <template #status="{ row }">
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs"
        :class="
          row.isActive
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
        "
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="row.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
        ></span>
        <span>{{ row.isActive ? 'معتمد ونشط' : 'معلق / غير نشط' }}</span>
      </span>
    </template>

    <!-- 8. أزرار الإجراءات -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center gap-1">
        <!-- زر عرض السجل وتفاصيل المحاضر -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          title="عرض السجل التدريبي الشامل"
          @click="$emit('open-details', row)"
        >
          <Eye class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span class="hidden xl:inline">التفاصيل</span>
        </button>

        <!-- زر تعديل بيانات المحاضر -->
        <button
          type="button"
          class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          title="تعديل بيانات المحاضر"
          @click="$emit('open-edit', row)"
        >
          <Pencil class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        </button>

        <!-- زر حذف المحاضر -->
        <button
          type="button"
          class="w-8 h-8 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          title="حذف المحاضر"
          @click="$emit('open-delete', row)"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  GraduationCap,
  Phone,
  Mail,
  Layers,
  Star,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import { getInstructorInitials } from '../helpers/instructorsConstants';

defineProps({
  instructors: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['open-details', 'open-edit', 'open-delete', 'clear-filters']);

const columns = [
  { key: 'instructor', label: 'المحاضر المعتمد' },
  { key: 'specialty', label: 'التخصص العلمي' },
  { key: 'contact', label: 'بيانات الاتصال' },
  { key: 'rounds', label: 'الدفعات المسندة', cellClass: 'whitespace-nowrap' },
  { key: 'graduates', label: 'الخريجون والحضور', cellClass: 'whitespace-nowrap' },
  { key: 'status', label: 'الحالة', align: 'center', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];

function hasOngoingRound(instructor) {
  return (instructor.roundsTaught || []).some((r) => r.status === 'Ongoing');
}

function countActiveRounds(instructor) {
  return (instructor.roundsTaught || []).filter(
    (r) => r.status === 'Ongoing' || r.status === 'Available',
  ).length;
}

function calculateTotalGraduates(instructor) {
  return (instructor.roundsTaught || []).reduce(
    (sum, r) => sum + (r.traineesCount || 0),
    0,
  );
}

function calculateAverageAttendance(instructor) {
  const rounds = (instructor.roundsTaught || []).filter((r) => r.averageAttendance > 0);
  if (rounds.length === 0) return 95;
  const total = rounds.reduce((sum, r) => sum + r.averageAttendance, 0);
  return Math.round(total / rounds.length);
}
</script>
