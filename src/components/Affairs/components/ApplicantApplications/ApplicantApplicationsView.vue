<template>
  <div class="space-y-4 select-none pb-6">
    <!-- 1. ترويسة الصفحة -->
    <ApplicantApplicationsHeader
      :total-count="filteredApplications.length"
      :is-refreshing="isRefreshing"
      @refresh="resetToInitial"
    />

    <!-- 2. بطاقات الإحصائيات السريعة -->
    <!-- <ApplicantApplicationsStats
      :total-under-review="applications.length"
      :civilian-count="civilianCount"
      :military-and-police-count="militaryAndPoliceCount"
      :approved-today-count="approvedCount"
    /> -->

    <!-- 3. شريط الفلاتر والبحث (مع محول طريقة العرض جدول / كروت) -->
    <ApplicantApplicationsFilters
      v-model:search-query="searchQuery"
      v-model:selected-category="selectedCategory"
      v-model:selected-course="selectedCourse"
      v-model:view-mode="viewMode"
      :category-options="categoryOptions"
      :course-options="courseOptions"
      :filtered-count="filteredApplications.length"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول بيانات أو شبكة كروت -->
    <!-- أ. وضع جدول البيانات (Table View) -->
    <div
      v-if="viewMode === 'table'"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <ApplicantApplicationsTable
        :applications="paginatedApplications"
        :is-filtered="Boolean(searchQuery || selectedCategory || selectedCourse)"
        @open-details="openDetails"
        @open-approval="openApproval"
        @open-rejection="openRejection"
        @clear-filters="clearFilters"
      />

      <AppPagination
        v-if="filteredApplications.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredApplications.length"
        :per-page-options="perPageOptions"
        item-label="طلب"
      />
    </div>

    <!-- ب. وضع شبكة الكروت (Cards Grid View) -->
    <div v-else class="space-y-4">
      <ApplicantApplicationsCardsGrid
        :applications="paginatedApplications"
        @open-details="openDetails"
        @open-approval="openApproval"
        @open-rejection="openRejection"
        @openDetails="openDetails"
        @openApproval="openApproval"
        @openRejection="openRejection"
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
          item-label="طلب"
        />
      </div>
    </div>

    <!-- 5. رسالة تأكيد عائمة (Toast Alert) عند اتخاذ إجراء -->
    <div
      v-if="feedbackMessage.text"
      class="fixed bottom-6 left-6 z-50 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold animate-slide-up"
      :class="
        feedbackMessage.type === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          : 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
      "
    >
      <CheckCircle2 v-if="feedbackMessage.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      <XCircle v-else class="w-5 h-5 text-rose-600 dark:text-rose-400" />
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
    <!-- مودال عرض بيانات المتقدم الموحد من shared -->
    <TraineeDetailsModal
      :is-open="isDetailsOpen"
      :application="selectedApplication"
      @close="isDetailsOpen = false"
    />

    <!-- مودال الموافقة والانتقال للسداد -->
    <ApplicantApprovalModal
      :is-open="isApprovalOpen"
      :application="selectedApplication"
      @close="isApprovalOpen = false"
      @confirm="onConfirmApproval"
    />

    <!-- مودال رفض الطلب مع تدوين السبب -->
    <ApplicantRejectionModal
      :is-open="isRejectionOpen"
      :application="selectedApplication"
      @close="isRejectionOpen = false"
      @confirm="onConfirmRejection"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { CheckCircle2, XCircle, X } from 'lucide-vue-next';

// استيراد المكونات الفرعية المقسمة من utils
import ApplicantApplicationsHeader from './utils/ApplicantApplicationsHeader.vue';
import ApplicantApplicationsStats from './utils/ApplicantApplicationsStats.vue';
import ApplicantApplicationsFilters from './utils/ApplicantApplicationsFilters.vue';
import ApplicantApplicationsTable from './utils/ApplicantApplicationsTable.vue';
import ApplicantApplicationsCardsGrid from './utils/ApplicantApplicationsCardsGrid.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';
import ApplicantApprovalModal from './utils/ApplicantApprovalModal.vue';
import ApplicantRejectionModal from './utils/ApplicantRejectionModal.vue';

// استيراد البيانات والمساعدات من helpers
import { INITIAL_APPLICANT_APPLICATIONS } from './helpers/applicantMockData';
import { formatDateOnly } from './helpers/applicantConstants';

// حالة البيانات الرئيسية
const applications = ref([...INITIAL_APPLICANT_APPLICATIONS]);
const isRefreshing = ref(false);
const approvedCount = ref(0);

// الفلاتر والبحث
const searchQuery = ref('');
const selectedCategory = ref(null);
const selectedCourse = ref(null);
const viewMode = ref('grid');

// خيارات القوائم المنسدلة لـ PrimeVue Select
const categoryOptions = [
  { label: 'فئة مدني', value: 'Civilian' },
  { label: 'ضباط القوات المسلحة', value: 'MilitaryOfficer' },
  { label: 'عائلات ضباط ق.م', value: 'MilitaryFamily' },
  { label: 'ضباط الشرطة وعائلاتهم', value: 'PoliceOfficerOrFamily' },
];

const perPageOptions = [
  { label: '6 عناصر', value: 6 },
  { label: '12 عنصر', value: 12 },
  { label: '24 عنصر', value: 24 },
];

// قائمة الدورات الفريدة للفلتر
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
const itemsPerPage = ref(6);

// المودالات
const selectedApplication = ref(null);
const isDetailsOpen = ref(false);
const isApprovalOpen = ref(false);
const isRejectionOpen = ref(false);

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

// إحصائيات
const civilianCount = computed(() => {
  return applications.value.filter((a) => a.trainee?.category === 'Civilian').length;
});

const militaryAndPoliceCount = computed(() => {
  return applications.value.filter((a) => a.trainee?.category !== 'Civilian').length;
});

// تصفية الطلبات
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    if (selectedCategory.value && app.trainee?.category !== selectedCategory.value) {
      return false;
    }

    if (selectedCourse.value && app.courseRound?.courseName !== selectedCourse.value) {
      return false;
    }

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

// حسابات الباجينيشن
const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / itemsPerPage.value) || 1;
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedApplications = computed(() => {
  return filteredApplications.value.slice(startIndex.value, endIndex.value);
});

function clearFilters() {
  searchQuery.value = '';
  selectedCategory.value = null;
  selectedCourse.value = null;
  currentPage.value = 1;
}

function resetToInitial() {
  isRefreshing.value = true;
  setTimeout(() => {
    applications.value = [...INITIAL_APPLICANT_APPLICATIONS];
    clearFilters();
    isRefreshing.value = false;
    showFeedback('تم تحديث قائمة طلبات المتقدمين بنجاح', 'success');
  }, 400);
}

// فتح المودالات
function openDetails(app) {
  selectedApplication.value = app;
  isDetailsOpen.value = true;
}

function openApproval(app) {
  selectedApplication.value = app;
  isApprovalOpen.value = true;
}

function openRejection(app) {
  selectedApplication.value = app;
  isRejectionOpen.value = true;
}

// تأكيد الموافقة
function onConfirmApproval({ applicationId, dueDate }) {
  const target = applications.value.find((a) => a.id === applicationId);
  if (target) {
    applications.value = applications.value.filter((a) => a.id !== applicationId);
    approvedCount.value++;
    showFeedback(
      `تمت الموافقة بنجاح على طلب «${target.trainee?.fullName}» وتحديد مهلة السداد حتى ${formatDateOnly(dueDate)}`,
      'success'
    );
  }
  isApprovalOpen.value = false;
  selectedApplication.value = null;
}

// تأكيد الرفض
function onConfirmRejection({ applicationId, reason }) {
  const target = applications.value.find((a) => a.id === applicationId);
  if (target) {
    applications.value = applications.value.filter((a) => a.id !== applicationId);
    showFeedback(
      `تم رفض طلب «${target.trainee?.fullName}» وتدوين سبب الرفض: (${reason})`,
      'error'
    );
  }
  isRejectionOpen.value = false;
  selectedApplication.value = null;
}
</script>
