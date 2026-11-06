<template>
  <AppTable
    :columns="columns"
    :data="applications"
    :is-filtered="isFiltered"
    empty-title="لا توجد طلبات سداد مطابقة للبحث أو الفلتر"
    empty-text="جرّب تغيير تبويب حالة الاستحقاق أو مسح الفلاتر لعرض طلبات السداد"
    @clear-filters="$emit('clear-filters')"
  >
    <!-- 1. رقم وتاريخ الطلب -->
    <template #code="{ row }">
      <div class="font-mono font-bold text-primary-700 dark:text-primary-400">
        {{ row.code }}
      </div>
      <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
        <Clock class="w-3 h-3 shrink-0" />
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
          <div class="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[170px] sm:max-w-[190px]" :title="row.trainee?.fullName">
            {{ row.trainee?.fullName }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate max-w-[170px] sm:max-w-[190px]">
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
        title="كارنيه إثبات الفئة مرفق ومعتمد"
      >
        <Check class="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>كارنيه معتمد</span>
      </span>
    </template>

    <!-- 4. الدورة التدريبية -->
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

    <!-- 5. الرسوم المقررة -->
    <template #price="{ row }">
      <div class="font-black text-slate-800 dark:text-slate-100 font-heading">
        {{ formatEgyptianCurrency(row.courseRound?.price) }}
      </div>
      <span class="text-[10px] text-slate-400">بانتظار السداد</span>
    </template>

    <!-- 6. مهلة السداد وحالة الاستحقاق -->
    <template #dueDate="{ row }">
      <div class="flex flex-col items-start gap-1">
        <!-- شارة الحالة الزمنية للاستحقاق -->
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
          :class="getDueInfo(row.paymentDueDate).badgeClass"
        >
          <AlertCircle v-if="getDueInfo(row.paymentDueDate).isOverdue" class="w-3 h-3 shrink-0" />
          <Clock v-else class="w-3 h-3 shrink-0" />
          <span>{{ getDueInfo(row.paymentDueDate).statusText }}</span>
        </span>

        <!-- تاريخ نهاية المهلة (متاح السداد حتى يدفع قبله) -->
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          متاح السداد حتى: <strong class="text-slate-700 dark:text-slate-300 font-mono font-bold">{{ formatDateOnly(row.paymentDueDate) }}</strong>
        </div>
      </div>
    </template>

    <!-- 7. أزرار الإجراءات (تسجيل سداد / تمديد / إلغاء / تفاصيل) -->
    <template #actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <!-- زر تسجيل السداد الأساسي -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="تسجيل إيصال السداد وتحويل الدارس لمقيد"
          @click="$emit('record-payment', row)"
        >
          <Receipt class="w-3.5 h-3.5" />
          <span>سداد</span>
        </button>

        <!-- زر فتح بيانات المتقدم الكاملة -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="عرض بيانات المتقدم والمستندات"
          @click="$emit('open-details', row)"
        >
          <Eye class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span>تفاصيل</span>
        </button>

        <!-- زر تمديد مهلة السداد -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs border"
          :class="
            getDueInfo(row.paymentDueDate).isOverdue
              ? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
              : 'bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/50 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800/80'
          "
          title="تمديد مهلة السداد (3 أيام، 5 أيام، أو حتى تاريخ محدد)"
          @click="$emit('open-reschedule', row)"
        >
          <CalendarClock class="w-3.5 h-3.5" />
          <span>تمديد المهلة</span>
        </button>

        <!-- زر إلغاء الطلب -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="إلغاء طلب السداد مع تدوين السبب"
          @click="$emit('open-cancel', row)"
        >
          <XCircle class="w-3.5 h-3.5 text-rose-500" />
          <span>إلغاء</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import {
  Clock,
  Eye,
  CalendarClock,
  XCircle,
  Building2,
  Calendar,
  Check,
  AlertCircle,
  Receipt,
} from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import {
  APPLICANT_CATEGORIES,
  formatEgyptianCurrency,
  formatDateTime,
  formatDateOnly,
  getPaymentDueStatus,
} from '../helpers/pendingPaymentConstants';

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

defineEmits(['open-details', 'open-reschedule', 'open-cancel', 'record-payment', 'clear-filters']);

const columns = [
  { key: 'code', label: 'رقم وتاريخ الطلب', cellClass: 'whitespace-nowrap' },
  { key: 'trainee', label: 'بيانات المتقدم' },
  { key: 'category', label: 'فئة المتقدم', cellClass: 'whitespace-nowrap' },
  { key: 'course', label: 'الدورة التدريبية' },
  { key: 'price', label: 'الرسوم المستحقة', cellClass: 'whitespace-nowrap' },
  { key: 'dueDate', label: 'مهلة السداد (يدفع قبلها)', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات', align: 'center', cellClass: 'whitespace-nowrap' },
];

function getDueInfo(dateStr) {
  return getPaymentDueStatus(dateStr);
}

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
</script>
