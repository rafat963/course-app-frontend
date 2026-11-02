<template>
  <div class="space-y-4 select-none pb-6">
    <!-- 1. ترويسة الصفحة مع زر التحديث -->
    <PendingPaymentHeader
      :total-count="filteredApplications.length"
      :is-refreshing="isRefreshing"
      @refresh="resetToInitial"
    />

    <!-- 2. بطاقات الإحصائيات الأربعة (سارية، متأخرة، إجمالي، والرسوم المتوقعة) -->
    <PendingPaymentStats
      :total-count="applications.length"
      :active-count="activeCount"
      :overdue-count="overdueCount"
      :total-expected-amount="totalExpectedAmount"
    />

    <!-- 3. شريط الفلاتر والبحث مع تبويب واضح للطلبات المنتهية والسارية -->
    <PendingPaymentFilters
      v-model:status-filter="statusFilter"
      v-model:search-query="searchQuery"
      v-model:selected-course="selectedCourse"
      v-model:selected-category="selectedCategory"
      v-model:view-mode="viewMode"
      :course-options="courseOptions"
      :category-options="categoryOptions"
      :total-count="applications.length"
      :active-count="activeCount"
      :overdue-count="overdueCount"
      :filtered-count="filteredApplications.length"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول بيانات أو شبكة كروت -->
    <!-- أ. وضع جدول البيانات (Table View) -->
    <div
      v-if="viewMode === 'table'"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <PendingPaymentTable
        :applications="paginatedApplications"
        :is-filtered="Boolean(searchQuery || selectedCourse || selectedCategory || statusFilter !== 'all')"
        @open-details="openDetails"
        @open-reschedule="openReschedule"
        @open-cancel="openCancel"
        @clear-filters="clearFilters"
      />

      <AppPagination
        v-if="filteredApplications.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredApplications.length"
        :per-page-options="perPageOptions"
        item-label="طلب سداد"
      />
    </div>

    <!-- ب. وضع شبكة الكروت (Cards Grid View) -->
    <div v-else class="space-y-4">
      <PendingPaymentCardsGrid
        :applications="paginatedApplications"
        @open-details="openDetails"
        @record-payment="openDetails"
        @extend-deadline="openReschedule"
        @cancel-application="openCancel"
      />

      <div
        v-if="filteredApplications.length > 0"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs"
      >
        <AppPagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredApplications.length"
          :per-page-options="perPageOptions"
          item-label="طلب سداد"
        />
      </div>
    </div>

    <!-- 5. تنبيه تأكيد الإجراء العائم (Floating Toast Alert) -->
    <div
      v-if="feedbackMessage.text"
      class="fixed bottom-6 left-6 z-50 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold animate-slide-up"
      :class="
        feedbackMessage.type === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          : feedbackMessage.type === 'warning'
            ? 'bg-amber-50 dark:bg-amber-950/90 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
      "
    >
      <CheckCircle2 v-if="feedbackMessage.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <AlertTriangle v-else-if="feedbackMessage.type === 'warning'" class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
      <XCircle v-else class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
      <span>{{ feedbackMessage.text }}</span>
      <button
        type="button"
        class="mr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
        @click="feedbackMessage.text = ''"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- 6. النوافذ المنبثقة التفاعلية المساعدة -->
    <!-- مودال تحديد موعد جديد / تمديد مهلة السداد -->
    <ExtendDeadlineModal
      :is-open="isRescheduleOpen"
      :application="selectedApplication"
      @close="isRescheduleOpen = false"
      @confirm="onConfirmReschedule"
    />

    <!-- مودال إلغاء الطلب -->
    <CancelPaymentApplicationModal
      :is-open="isCancelOpen"
      :application="selectedApplication"
      @close="isCancelOpen = false"
      @confirm="onConfirmCancel"
    />

    <!-- مودال عرض بيانات المتقدم الموحد من shared -->
    <TraineeDetailsModal
      :is-open="isDetailsOpen"
      :application="selectedApplication"
      @close="isDetailsOpen = false"
      @reschedule="onModalReschedule"
      @cancel="onModalCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-vue-next';

// استيراد المكونات المشتركة
import AppPagination from '@/shared/ui/Table/AppPagination.vue';

// استيراد المكونات الفرعية المقسمة من utils
import PendingPaymentHeader from './utils/PendingPaymentHeader.vue';
import PendingPaymentStats from './utils/PendingPaymentStats.vue';
import PendingPaymentFilters from './utils/PendingPaymentFilters.vue';
import PendingPaymentTable from './utils/PendingPaymentTable.vue';
import PendingPaymentCardsGrid from './utils/PendingPaymentCardsGrid.vue';
import ExtendDeadlineModal from './utils/ExtendDeadlineModal.vue';
import CancelPaymentApplicationModal from './utils/CancelPaymentApplicationModal.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';

// استيراد البيانات والمساعدات من helpers
import { INITIAL_PENDING_PAYMENT_APPLICATIONS } from './helpers/pendingPaymentMockData';
import {
  formatDateOnly,
  getPaymentDueStatus,
} from './helpers/pendingPaymentConstants';

// حالة البيانات الرئيسية
const applications = ref([...INITIAL_PENDING_PAYMENT_APPLICATIONS]);
const isRefreshing = ref(false);

// الفلاتر والبحث
const statusFilter = ref('all'); // 'all' | 'active' | 'overdue'
const searchQuery = ref('');
const selectedCourse = ref(null);
const selectedCategory = ref(null);
const viewMode = ref(typeof window !== 'undefined' && window.innerWidth < 1024 ? 'grid' : 'table');

// خيارات القوائم المنسدلة
const categoryOptions = [
  { label: 'فئة مدني', value: 'Civilian' },
  { label: 'ضباط القوات المسلحة', value: 'MilitaryOfficer' },
  { label: 'عائلات ضباط ق.م', value: 'MilitaryFamily' },
  { label: 'ضباط الشرطة وعائلاتهم', value: 'PoliceOfficerOrFamily' },
];

const perPageOptions = [
  { label: '5 عناصر', value: 5 },
  { label: '10 عناصر', value: 10 },
  { label: '20 عنصر', value: 20 },
];

// قائمة الدورات الفريدة
const uniqueCourses = computed(() => {
  const set = new Set();
  applications.value.forEach((a) => {
    if (a.courseRound?.courseName) set.add(a.courseRound.courseName);
  });
  return Array.from(set);
});

const courseOptions = computed(() => {
  return uniqueCourses.value.map((c) => ({ label: c, value: c }));
});

// الباجينيشن
const currentPage = ref(1);
const itemsPerPage = ref(5);

// النوافذ المنبثقة
const selectedApplication = ref(null);
const isRescheduleOpen = ref(false);
const isCancelOpen = ref(false);
const isDetailsOpen = ref(false);

// رسائل التغذية الراجعة
const feedbackMessage = ref({ text: '', type: 'success' });
let feedbackTimer = null;

function showFeedback(text, type = 'success') {
  feedbackMessage.value = { text, type };
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedbackMessage.value.text = '';
  }, 4500);
}

// الإحصائيات
const activeCount = computed(() => {
  return applications.value.filter((a) => !getPaymentDueStatus(a.paymentDueDate).isOverdue).length;
});

const overdueCount = computed(() => {
  return applications.value.filter((a) => getPaymentDueStatus(a.paymentDueDate).isOverdue).length;
});

const totalExpectedAmount = computed(() => {
  return applications.value.reduce((sum, a) => sum + (a.courseRound?.price || 0), 0);
});

// تصفية الطلبات بناءً على المعايير المختلفة
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    // 1. فلتر حالة الاستحقاق (سارية / متأخرة)
    if (statusFilter.value !== 'all') {
      const isOverdue = getPaymentDueStatus(app.paymentDueDate).isOverdue;
      if (statusFilter.value === 'active' && isOverdue) return false;
      if (statusFilter.value === 'overdue' && !isOverdue) return false;
    }

    // 2. فلتر فئة المتقدم
    if (selectedCategory.value && app.trainee?.category !== selectedCategory.value) {
      return false;
    }

    // 3. فلتر الدورة التدريبية
    if (selectedCourse.value && app.courseRound?.courseName !== selectedCourse.value) {
      return false;
    }

    // 4. فلتر البحث النصي
    if (searchQuery.value && searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const name = app.trainee?.fullName?.toLowerCase() || '';
      const nid = app.trainee?.nationalId || '';
      const phone = app.trainee?.phone || '';
      const code = app.code?.toLowerCase() || '';
      if (!name.includes(q) && !nid.includes(q) && !phone.includes(q) && !code.includes(q)) {
        return false;
      }
    }

    return true;
  });
});

// إعادة التعيين للصفحة الأولى عند تغير أي فلتر
watch([statusFilter, searchQuery, selectedCourse, selectedCategory], () => {
  currentPage.value = 1;
});

// حسابات الباجينيشن
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedApplications = computed(() => {
  return filteredApplications.value.slice(startIndex.value, endIndex.value);
});

function clearFilters() {
  statusFilter.value = 'all';
  searchQuery.value = '';
  selectedCourse.value = null;
  selectedCategory.value = null;
  currentPage.value = 1;
}

function resetToInitial() {
  isRefreshing.value = true;
  setTimeout(() => {
    applications.value = [...INITIAL_PENDING_PAYMENT_APPLICATIONS];
    clearFilters();
    isRefreshing.value = false;
    showFeedback('تم تحديث قائمة طلبات في انتظار السداد بنجاح', 'success');
  }, 400);
}

// فتح النوافذ المنبثقة
function openDetails(app) {
  selectedApplication.value = app;
  isDetailsOpen.value = true;
}

function openReschedule(app) {
  selectedApplication.value = app;
  isRescheduleOpen.value = true;
}

function openCancel(app) {
  selectedApplication.value = app;
  isCancelOpen.value = true;
}

function onModalReschedule(app) {
  isDetailsOpen.value = false;
  openReschedule(app);
}

function onModalCancel(app) {
  isDetailsOpen.value = false;
  openCancel(app);
}

// تأكيد تحديد الموعد الجديد (تمديد المهلة)
function onConfirmReschedule({ applicationId, newDueDate, reason }) {
  const target = applications.value.find((a) => a.id === applicationId);
  if (target) {
    target.paymentDueDate = newDueDate;
    target.updatedAt = new Date().toISOString();
    target.notes = reason;

    showFeedback(
      `تم تحديد موعد سداد جديد للمتقدم «${target.trainee?.fullName}» حتى ${formatDateOnly(newDueDate)} بنجاح`,
      'success'
    );
  }
  isRescheduleOpen.value = false;
  selectedApplication.value = null;
}

// تأكيد إلغاء الطلب
function onConfirmCancel({ applicationId, reason }) {
  const target = applications.value.find((a) => a.id === applicationId);
  if (target) {
    applications.value = applications.value.filter((a) => a.id !== applicationId);
    showFeedback(
      `تم إلغاء طلب «${target.trainee?.fullName}» بنجاح (السبب: ${reason})`,
      'error'
    );
  }
  isCancelOpen.value = false;
  selectedApplication.value = null;
}
</script>
