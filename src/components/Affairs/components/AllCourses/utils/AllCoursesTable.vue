<template>
  <AppTable
    :columns="columns"
    :data="courses"
    :is-filtered="isFiltered"
    empty-title="لا توجد دورات تدريبية مطابقة لمعايير البحث"
    empty-text="جرّب مسح نص البحث لعرض كافة دورات الكتالوج"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. اسم الدورة وتوصيفها (Courses.Name & Courses.Description) -->
    <template #name="{ row }">
      <div class="space-y-1">
        <button
          type="button"
          class="text-right font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm block hover:text-primary-600 transition-colors cursor-pointer truncate max-w-[220px] sm:max-w-[280px]"
          :title="`انقر لعرض تفاصيل الدورة: ${row.name}`"
          @click="$emit('view-details', row)"
        >
          {{ row.name }}
        </button>
        <div v-if="row.instructorName" class="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold truncate max-w-[220px]">
          <UserCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span class="truncate">المحاضر: {{ row.instructorName }}</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xs sm:max-w-sm leading-relaxed font-normal" :title="row.description">
          {{ row.description }}
        </p>
      </div>
    </template>

    <!-- 2. حالة الدورة بالكتالوج (Courses.IsActive) -->
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
        <span>{{ row.isActive ? 'نشطة ومتاحة' : 'معطلة مؤقتاً' }}</span>
      </span>
    </template>

    <!-- 3. أسعار الفئات الأربعة المعتمدة (CoursePricings) -->
    <template #pricing="{ row }">
      <div class="grid grid-cols-2 gap-1 text-[11px] min-w-[170px]">
        <div class="p-1 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between px-1.5">
          <span class="text-slate-500 text-[10px]">مدني:</span>
          <strong class="font-mono text-slate-800 dark:text-slate-200 font-bold">
            {{ formatEgyptianCurrency(row.pricings?.Civilian) }}
          </strong>
        </div>
        <div class="p-1 rounded-md bg-primary-50/50 dark:bg-primary-950/40 border border-primary-200/70 dark:border-primary-800/60 flex items-center justify-between px-1.5">
          <span class="text-primary-800 dark:text-primary-300 text-[10px]">ضابط:</span>
          <strong class="font-mono text-primary-900 dark:text-primary-200 font-bold">
            {{ formatEgyptianCurrency(row.pricings?.MilitaryOfficer) }}
          </strong>
        </div>
        <div class="p-1 rounded-md bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-between px-1.5">
          <span class="text-emerald-800 dark:text-emerald-300 text-[10px]">عائلات:</span>
          <strong class="font-mono text-emerald-900 dark:text-emerald-200 font-bold">
            {{ formatEgyptianCurrency(row.pricings?.MilitaryFamily) }}
          </strong>
        </div>
        <div class="p-1 rounded-md bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 flex items-center justify-between px-1.5">
          <span class="text-blue-800 dark:text-blue-300 text-[10px]">شرطة:</span>
          <strong class="font-mono text-blue-900 dark:text-blue-200 font-bold">
            {{ formatEgyptianCurrency(row.pricings?.PoliceOfficerOrFamily) }}
          </strong>
        </div>
      </div>
    </template>

    <!-- 4. دفعات الانعقاد والدارسين -->
    <template #rounds="{ row }">
      <button
        type="button"
        class="text-right group cursor-pointer hover:opacity-85 transition-opacity"
        title="انقر لاستعراض كافة دورات الانعقاد المسجلة لهذه الدورة"
        @click="$emit('view-rounds', row)"
      >
        <div class="space-y-0.5 text-xs">
          <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 group-hover:text-primary-600 transition-colors">
            <Layers class="w-3.5 h-3.5 text-primary-600" />
            <span>{{ row.roundsCount }} دفعة انعقاد</span>
            <span v-if="row.activeRoundsCount > 0" class="text-[10px] text-emerald-600 font-bold">
              ({{ row.activeRoundsCount }} جارية)
            </span>
          </div>
          <div class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Users class="w-3 h-3 text-slate-400" />
            <span>{{ row.traineesCount }} دارساً مسجلاً</span>
          </div>
        </div>
      </button>
    </template>

    <!-- 5. تاريخ الإضافة (Courses.CreatedAt) -->
    <template #createdAt="{ row }">
      <div class="font-mono text-xs text-slate-700 dark:text-slate-300">
        {{ formatDate(row.createdAt) }}
      </div>
    </template>

    <!-- 6. الإجراءات (تفاصيل وسجل الدفعات + فتح دورة انعقاد + تعديل + حذف) -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <!-- زر تفاصيل الدورة والدورات السابقة المنعقدة بها -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="معاينة تفاصيل الدورة، والدورات السابقة المنعقدة بها والطلاب والتكلفة"
          @click="$emit('view-details', row)"
        >
          <FolderOpen class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>تفاصيل الدورة</span>
        </button>

        <!-- زر فتح دورة انعقاد جديدة من هذا الكورس -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="فتح دورة انعقاد جديدة (دفعة تشغيلية) من هذا الكورس"
          @click="$emit('create-round', row)"
        >
          <CalendarPlus class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>فتح دفعة</span>
        </button>

        <!-- زر تعديل بيانات الدورة -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="تعديل بيانات الدورة والتسعير"
          @click="$emit('edit-course', row)"
        >
          <Edit class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span>تعديل</span>
        </button>

        <!-- زر حذف الدورة -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="حذف الدورة من الكتالوج"
          @click="$emit('delete-course', row)"
        >
          <Trash2 class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>حذف</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  Layers,
  Users,
  Edit,
  Trash2,
  CalendarPlus,
  FolderOpen,
  UserCheck,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import { formatEgyptianCurrency, formatDate } from '../helpers/courseConstants';

defineProps({
  courses: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['edit-course', 'delete-course', 'create-round', 'view-rounds', 'view-details', 'clear-filters']);

const columns = [
  { key: 'name', label: 'الدورة التدريبية' },
  { key: 'status', label: 'حالة الاعتماد', cellClass: 'whitespace-nowrap' },
  { key: 'pricing', label: 'تسعير الفئات (ج.م)' },
  { key: 'rounds', label: 'دفعات الانعقاد', cellClass: 'whitespace-nowrap' },
  { key: 'createdAt', label: 'تاريخ الإضافة', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];
</script>
