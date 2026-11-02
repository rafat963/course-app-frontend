<template>
  <AppTable
    :columns="columns"
    :data="applications"
    :is-filtered="isFiltered"
    empty-title="لا توجد طلبات تطابق معايير البحث الحالية"
    empty-text="جرّب مسح نص البحث أو إعادة ضبط خيارات الفلترة لعرض كافة طلبات المتقدمين"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. رقم وتاريخ الطلب -->
    <template #code="{ row }">
      <div class="font-mono font-bold text-primary-700 dark:text-primary-400">
        {{ row.code }}
      </div>
      <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
        <Clock class="w-3 h-3" />
        <span>{{ formatDateTime(row.createdAt) }}</span>
      </div>
    </template>

    <!-- 2. بيانات المتقدم -->
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
          <div class="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[170px] sm:max-w-[200px]" :title="row.trainee?.fullName">
            {{ row.trainee?.fullName }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate max-w-[170px] sm:max-w-[200px]">
            {{ row.trainee?.nationalId }} • {{ row.trainee?.phone }}
          </div>
        </div>
      </div>
    </template>

    <!-- 3. فئة المتقدم -->
    <template #category="{ row }">
      <span
        class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
        :class="getCategoryBadge(row.trainee?.category).class"
      >
        {{ getCategoryBadge(row.trainee?.category).label }}
      </span>
      <span
        v-if="row.trainee?.categoryProofPhotoPath"
        class="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5"
        title="مرفق كارنيه الإثبات"
      >
        <Check class="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>كارنيه معتمد</span>
      </span>
    </template>

    <!-- 4. الدورة التدريبية -->
    <template #course="{ row }">
      <div class="font-bold text-slate-800 dark:text-slate-200 max-w-[220px] truncate" :title="row.courseRound?.courseName">
        {{ row.courseRound?.courseName }}
      </div>
      <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
        <span>دفعة {{ row.courseRound?.roundNumber }}</span>
        <span>•</span>
        <span>تبدأ {{ formatDateOnly(row.courseRound?.startDate) }}</span>
      </div>
      <!-- شارة المقاعد الشاغرة للدفعة -->
      <div v-if="row.courseRound?.capacity" class="mt-1 flex items-center gap-1.5 text-[10px]">
        <span
          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold border"
          :class="
            (row.courseRound.capacity - row.courseRound.enrolledCount) <= 0
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
              : (row.courseRound.capacity - row.courseRound.enrolledCount) <= 5
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="
              (row.courseRound.capacity - row.courseRound.enrolledCount) <= 0
                ? 'bg-rose-500'
                : (row.courseRound.capacity - row.courseRound.enrolledCount) <= 5
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
            "
          ></span>
          <span>
            {{
              (row.courseRound.capacity - row.courseRound.enrolledCount) <= 0
                ? 'السعة مكتملة سداداً'
                : `متبقي ${row.courseRound.capacity - row.courseRound.enrolledCount} مقعد شاغر`
            }}
          </span>
        </span>
        <span class="text-slate-400 dark:text-slate-500 font-mono">
          ({{ row.courseRound.enrolledCount || 0 }}/{{ row.courseRound.capacity || 0 }})
        </span>
      </div>
    </template>

    <!-- 5. الرسوم المقررة -->
    <template #price="{ row }">
      <div class="font-black text-slate-800 dark:text-slate-100 font-heading">
        {{ formatEgyptianCurrency(row.courseRound?.price) }}
      </div>
      <span class="text-[10px] text-slate-400">سعر الفئة المعتمَد</span>
    </template>

    <!-- 6. القاعة ومواعيد المحاضرة -->
    <template #schedule="{ row }">
      <div class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <Building2 class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
        <span>{{ row.courseRound?.hallName }}</span>
      </div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium whitespace-nowrap">
        <Calendar class="w-3 h-3 text-slate-400 shrink-0" />
        <span>{{ row.courseRound?.lectureDays?.slice(0, 2).join('، ') }}</span>
        <span class="text-slate-300 dark:text-slate-600">•</span>
        <Clock class="w-3 h-3 text-slate-400 shrink-0" />
        <span>{{ row.courseRound?.startTime?.slice(0, 5) }} - {{ row.courseRound?.endTime?.slice(0, 5) }}</span>
      </div>
    </template>

    <!-- 7. الإجراءات -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <!-- زر فتح بيانات المتقدم -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="عرض وتدقيق كافة البيانات والمستندات"
          @click="$emit('open-details', row)"
        >
          <Eye class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span>بيانات المتقدم</span>
        </button>

        <!-- زر الموافقة على الطلب -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="الموافقة على الطلب وتحديد مهلة السداد"
          @click="$emit('open-approval', row)"
        >
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span class="hidden md:inline">موافقة</span>
        </button>

        <!-- زر رفض الطلب -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="رفض الطلب مع تدوين السبب"
          @click="$emit('open-rejection', row)"
        >
          <XCircle class="w-3.5 h-3.5 text-rose-500" />
          <span class="hidden md:inline">رفض</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Check,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import {
  APPLICANT_CATEGORIES,
  formatEgyptianCurrency,
  formatDateTime,
  formatDateOnly,
} from '../helpers/applicantConstants';

defineProps({
  applications: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['open-details', 'open-approval', 'open-rejection', 'clear-filters']);

const columns = [
  { key: 'code', label: 'رقم وتاريخ الطلب', cellClass: 'whitespace-nowrap' },
  { key: 'trainee', label: 'بيانات المتقدم' },
  { key: 'category', label: 'فئة المتقدم', cellClass: 'whitespace-nowrap' },
  { key: 'course', label: 'الدورة التدريبية' },
  { key: 'price', label: 'الرسوم المستحقة', cellClass: 'whitespace-nowrap' },
  { key: 'schedule', label: 'القاعة والمواعيد', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}

function getCategoryBadge(cat) {
  return APPLICANT_CATEGORIES[cat] || {
    label: cat || 'مدني',
    class: 'bg-slate-100 text-slate-700 border-slate-200',
  };
}
</script>
