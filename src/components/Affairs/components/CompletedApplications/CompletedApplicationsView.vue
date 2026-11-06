<template>
  <div class="space-y-4 select-none pb-6">
    <!-- 1. ترويسة الصفحة مع زر التحديث -->
    <CompletedHeader
      :total-count="filteredApplications.length"
      :is-refreshing="isRefreshing"
      @refresh="resetToInitial"
    />

    <!-- 2. بطاقات الإحصائيات الأربعة الموحدة بتصميم AppKpiCard -->
    <!-- <CompletedStats
      :total-count="applications.length"
      :active-rounds-count="activeRoundsCount"
      :total-collected-revenue="totalCollectedRevenue"
      :average-attendance="averageAttendance"
    /> -->

    <!-- 3. شريط الفلاتر والبحث مع تبويب حالة الدارس ومحول طريقة العرض -->
    <CompletedFilters
      v-model:view-mode="viewMode"
      v-model:status-filter="statusFilter"
      v-model:search-query="searchQuery"
      v-model:selected-course="selectedCourse"
      v-model:selected-category="selectedCategory"
      :course-options="courseOptions"
      :category-options="categoryOptions"
      :total-count="applications.length"
      :enrolled-count="enrolledCount"
      :ended-count="endedCount"
      :filtered-count="filteredApplications.length"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول أو كروت حسب طريقة العرض المحددة -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
      <!-- جدول البيانات الرئيسي المستند إلى AppTable العام -->
      <CompletedTable
        :applications="paginatedApplications"
        :is-filtered="Boolean(searchQuery || selectedCourse || selectedCategory || statusFilter !== 'all')"
        @open-trainee-details="openTraineeDetails"
        @open-application-details="openApplicationDetails"
        @clear-filters="clearFilters"
      />

      <!-- شريط الباجينيشن العام المستند إلى AppPagination -->
      <AppPagination
        v-if="filteredApplications.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredApplications.length"
        :per-page-options="perPageOptions"
        item-label="دارس مقيد"
      />
    </div>

    <!-- شبكة الكروت في حال اختيار viewMode === 'grid' -->
    <div v-else class="space-y-4">
      <CompletedCardsGrid
        :applications="paginatedApplications"
        :is-filtered="Boolean(searchQuery || selectedCourse || selectedCategory || statusFilter !== 'all')"
        @open-trainee-details="openTraineeDetails"
        @open-application-details="openApplicationDetails"
        @open-trainee="openTraineeDetails"
        @print-receipt="openApplicationDetails"
        @view-pass="openApplicationDetails"
        @clear-filters="clearFilters"
      />

      <!-- شريط الباجينيشن لشبكة الكروت -->
      <div v-if="filteredApplications.length > 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
        <AppPagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredApplications.length"
          :per-page-options="perPageOptions"
          item-label="دارس مقيد"
        />
      </div>
    </div>

    <!-- 5. النوافذ المنبثقة التفاعلية -->
    <!-- مودال بيانات الدارس الموحد من shared (عرض تفاصيل المتدرب فقط بدون أي إجراءات) -->
    <TraineeDetailsModal
      :is-open="isTraineeModalOpen"
      :application="selectedApplication"
      @close="isTraineeModalOpen = false"
    />

    <!-- مودال تفاصيل الطلب وإيصال السداد وتصريح البوابة -->
    <CompletedApplicationModal
      :is-open="isApplicationModalOpen"
      :application="selectedApplication"
      @close="isApplicationModalOpen = false"
      @switch-to-trainee="switchToTrainee"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// استيراد المكونات المشتركة
import AppPagination from '@/shared/ui/Table/AppPagination.vue';

// استيراد المكونات الفرعية المقسمة من utils
import CompletedHeader from './utils/CompletedHeader.vue';
import CompletedStats from './utils/CompletedStats.vue';
import CompletedFilters from './utils/CompletedFilters.vue';
import CompletedTable from './utils/CompletedTable.vue';
import CompletedCardsGrid from './utils/CompletedCardsGrid.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';
import CompletedApplicationModal from './utils/CompletedApplicationModal.vue';

// استيراد البيانات من helpers
import { INITIAL_COMPLETED_APPLICATIONS } from './helpers/completedMockData';

// نمط العرض: جدول أو شبكة كروت
const viewMode = ref('grid');

// حالة البيانات الرئيسية
const applications = ref([...INITIAL_COMPLETED_APPLICATIONS]);
const isRefreshing = ref(false);

// الفلاتر والبحث
const statusFilter = ref('all'); // 'all' | 'Enrolled' | 'CourseEnded'
const searchQuery = ref('');
const selectedCourse = ref(null);
const selectedCategory = ref(null);

// خيارات القوائم المنسدلة
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
const itemsPerPage = ref(6);

// المودالات
const selectedApplication = ref(null);
const isTraineeModalOpen = ref(false);
const isApplicationModalOpen = ref(false);

// الإحصائيات
const enrolledCount = computed(() => {
  return applications.value.filter((a) => a.status === 'Enrolled').length;
});

const endedCount = computed(() => {
  return applications.value.filter((a) => a.status === 'CourseEnded').length;
});

const activeRoundsCount = computed(() => {
  const set = new Set();
  applications.value.forEach((a) => {
    if (a.courseRound?.status === 'Ongoing') {
      set.add(a.courseRound.id);
    }
  });
  return set.size;
});

const totalCollectedRevenue = computed(() => {
  return applications.value.reduce((sum, a) => sum + (a.paidAmount || 0), 0);
});

const averageAttendance = computed(() => {
  if (applications.value.length === 0) return 0;
  const total = applications.value.reduce((sum, a) => sum + (a.attendanceRate || 0), 0);
  return Math.round(total / applications.value.length);
});

// تصفية الدارسين بناءً على المعايير المختلفة
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    // 1. فلتر حالة القيد
    if (statusFilter.value !== 'all' && app.status !== statusFilter.value) {
      return false;
    }

    // 2. فلتر فئة المتقدم
    if (selectedCategory.value && app.trainee?.category !== selectedCategory.value) {
      return false;
    }

    // 3. فلتر الدورة التدريبية
    if (selectedCourse.value && app.courseRound?.courseName !== selectedCourse.value) {
      return false;
    }

    // 4. فلتر البحث النصي الشامل
    if (searchQuery.value && searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const name = app.trainee?.fullName?.toLowerCase() || '';
      const nid = app.trainee?.nationalId || '';
      const phone = app.trainee?.phone || '';
      const code = app.code?.toLowerCase() || '';
      const receipt = app.receiptNumber?.toLowerCase() || '';
      if (
        !name.includes(q) &&
        !nid.includes(q) &&
        !phone.includes(q) &&
        !code.includes(q) &&
        !receipt.includes(q)
      ) {
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
    applications.value = [...INITIAL_COMPLETED_APPLICATIONS];
    clearFilters();
    isRefreshing.value = false;
  }, 400);
}

// فتح المودالات والتبديل بينها
function openTraineeDetails(app) {
  selectedApplication.value = app;
  isTraineeModalOpen.value = true;
}

function openApplicationDetails(app) {
  selectedApplication.value = app;
  isApplicationModalOpen.value = true;
}

function switchToApplication(app) {
  isTraineeModalOpen.value = false;
  openApplicationDetails(app);
}

function switchToTrainee(app) {
  isApplicationModalOpen.value = false;
  openTraineeDetails(app);
}
</script>
