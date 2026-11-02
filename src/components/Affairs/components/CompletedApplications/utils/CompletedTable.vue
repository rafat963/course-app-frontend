<template>
  <AppTable
    :columns="columns"
    :data="applications"
    :is-filtered="isFiltered"
    empty-title="لا توجد طلبات مكتملة مطابقة لمعايير البحث"
    empty-text="جرّب تعديل الفلاتر أو مسح نص البحث لعرض كافة الدارسين المقيدين"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. رقم وتاريخ الطلب وحالة القيد -->
    <template #code="{ row }">
      <div class="font-mono font-bold text-primary-700 dark:text-primary-400">
        {{ row.code }}
      </div>
      <div class="mt-1">
        <span
          class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border"
          :class="getStatusBadge(row.status).class"
        >
          {{ getStatusBadge(row.status).label }}
        </span>
      </div>
    </template>

    <!-- 2. بيانات الدارس -->
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
          <div class="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[170px] sm:max-w-[190px]" :title="row.trainee?.fullName">
            {{ row.trainee?.fullName }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate max-w-[170px] sm:max-w-[190px]">
            {{ row.trainee?.nationalId }} • {{ row.trainee?.phone }}
          </div>
        </div>
      </div>
    </template>

    <!-- 3. فئة الدارس -->
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
        title="كارنيه إثبات الفئة معتمد"
      >
        <Check class="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>كارنيه معتمد</span>
      </span>
    </template>

    <!-- 4. الدورة والقاعة -->
    <template #course="{ row }">
      <div class="font-bold text-slate-800 dark:text-slate-200 max-w-[210px] truncate" :title="row.courseRound?.courseName">
        {{ row.courseRound?.courseName }}
      </div>
      <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
        <Building2 class="w-3 h-3 text-slate-400 shrink-0" />
        <span>{{ row.courseRound?.hallName }}</span>
        <span>•</span>
        <span>دفعة {{ row.courseRound?.roundNumber }}</span>
      </div>
    </template>

    <!-- 5. بيانات السداد والإيصال -->
    <template #payment="{ row }">
      <div class="font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
        <Receipt class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>{{ row.receiptNumber }}</span>
      </div>
      <div class="text-[11px] text-emerald-700 dark:text-emerald-400 font-black mt-0.5 font-heading">
        {{ formatEgyptianCurrency(row.paidAmount) }} مسدد بالكامل
      </div>
    </template>

    <!-- 6. الحضور وتصريح البوابة -->
    <template #attendance="{ row }">
      <div class="flex flex-col items-start gap-1">
        <!-- شارة نسبة الحضور -->
        <span
          class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
          :class="getAttendanceBadge(row.attendanceRate).class"
        >
          <QrCode class="w-3 h-3 shrink-0" />
          <span>{{ getAttendanceBadge(row.attendanceRate).label }}</span>
        </span>

        <div class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          حضر {{ row.attendedLecturesCount }} من {{ row.totalScheduledLectures }} محاضرة
        </div>
      </div>
    </template>

    <!-- 7. أزرار الإجراءات (بيانات الدارس + تفاصيل الطلب والسداد) -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <!-- زر فتح بيانات الدارس الكاملة -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="عرض ملف الدارس وبيانات البطاقة الشخصية والمستندات"
          @click="$emit('open-trainee-details', row)"
        >
          <User class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span>بيانات الدارس</span>
        </button>

        <!-- زر فتح تفاصيل الطلب وبيانات السداد والـ QR -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="عرض تفاصيل القيد، إيصال السداد، وتصريح دخول البوابة"
          @click="$emit('open-application-details', row)"
        >
          <FileText class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>تفاصيل الطلب</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  User,
  FileText,
  Building2,
  Receipt,
  Check,
  QrCode,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import {
  APPLICANT_CATEGORIES,
  COMPLETED_STATUSES,
  formatEgyptianCurrency,
  getAttendanceBadge,
} from '../helpers/completedConstants';

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

defineEmits(['open-trainee-details', 'open-application-details', 'clear-filters']);

const columns = [
  { key: 'code', label: 'كود الطلب والحالة', cellClass: 'whitespace-nowrap' },
  { key: 'trainee', label: 'بيانات الدارس' },
  { key: 'category', label: 'فئة الدارس', cellClass: 'whitespace-nowrap' },
  { key: 'course', label: 'الدورة التدريبية' },
  { key: 'payment', label: 'إيصال السداد والمبلغ', cellClass: 'whitespace-nowrap' },
  { key: 'attendance', label: 'حضور البوابة', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}

function getCategoryBadge(cat) {
  return (
    APPLICANT_CATEGORIES[cat] || {
      label: cat || 'مدني',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}

function getStatusBadge(status) {
  return (
    COMPLETED_STATUSES[status] || {
      label: status || 'مقيد',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}
</script>
