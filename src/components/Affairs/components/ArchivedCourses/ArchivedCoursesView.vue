<template>
  <div class="space-y-4 select-none pb-8">
    <!-- 1. ترويسة الصفحة مع إحصائيات الأرشيف وأزرار التحديث والطباعة -->
    <ArchivedCoursesHeader
      :total-count="totalRounds"
      :total-graduates="totalGraduates"
      :is-refreshing="isRefreshing"
      @refresh="handleRefresh"
      @print-archive="handlePrintArchive"
    />

    <!-- 2. بطاقات الإحصائيات الأربعة (KPIs) المتناسقة مع ديزاين النظام -->
    <ArchivedCoursesStats
      :total-rounds="totalRounds"
      :total-graduates="totalGraduates"
      :total-revenue="totalRevenue"
      :average-attendance="averageAttendance"
    />

    <!-- 3. شريط التبويبات والبحث وفلاتر الدورات والمحاضرين ومحول العرض -->
    <ArchivedCoursesFilters
      v-model:view-mode="viewMode"
      v-model:search-query="searchQuery"
      v-model:active-tab="activeTab"
      v-model:selected-course="selectedCourse"
      v-model:selected-instructor="selectedInstructor"
      :course-options="courseOptions"
      :instructor-options="instructorOptions"
      :total-count="totalRounds"
      :high-attendance-count="highAttendanceCount"
      :filtered-count="filteredRounds.length"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول أو كروت حسب طريقة العرض المحددة -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <!-- جدول الدورات السابقة -->
      <ArchivedCoursesTable
        :rounds="paginatedRounds"
        :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedCourse || selectedInstructor)"
        @open-details="handleOpenDetails"
        @clear-filters="clearFilters"
      />

      <!-- شريط الترقيم المشترك AppPagination -->
      <AppPagination
        v-if="filteredRounds.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredRounds.length"
        :per-page-options="perPageOptions"
        item-label="دورة سابقة"
      />
    </div>

    <!-- شبكة الكروت في حال اختيار viewMode === 'grid' -->
    <div v-else class="space-y-4">
      <ArchivedCoursesCardsGrid
        :rounds="paginatedRounds"
        :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedCourse || selectedInstructor)"
        @open-details="handleOpenDetails"
        @clear-filters="clearFilters"
      />

      <!-- شريط الباجينيشن لشبكة الكروت -->
      <div v-if="filteredRounds.length > 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
        <AppPagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredRounds.length"
          :per-page-options="perPageOptions"
          item-label="دورة سابقة"
        />
      </div>
    </div>

    <!-- 5. نافذة تفاصيل وسجل الدفعة الشاملة (الطلاب، التكلفة، المحاضر) -->
    <ArchivedRoundDetailsModal
      :is-open="isDetailsModalOpen"
      :round="selectedRoundForDetails"
      @close="isDetailsModalOpen = false"
      @open-trainee-profile="handleOpenTraineeProfile"
    />

    <!-- 6. نافذة ملف المتدرب الموحدة TraineeDetailsModal المشتركة -->
    <TraineeDetailsModal
      :is-open="isTraineeProfileModalOpen"
      :log="selectedTraineeForProfile"
      @close="isTraineeProfileModalOpen = false"
    />

    <!-- 7. رسالة تأكيد عائمة (Toast Alert) -->
    <div
      v-if="feedbackMessage.text"
      class="fixed bottom-6 left-6 z-50 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold animate-slide-up"
      :class="
        feedbackMessage.type === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          : 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
      "
    >
      <CheckCircle2 v-if="feedbackMessage.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { CheckCircle2, XCircle, X } from 'lucide-vue-next';
import ArchivedCoursesHeader from './utils/ArchivedCoursesHeader.vue';
import ArchivedCoursesStats from './utils/ArchivedCoursesStats.vue';
import ArchivedCoursesFilters from './utils/ArchivedCoursesFilters.vue';
import ArchivedCoursesTable from './utils/ArchivedCoursesTable.vue';
import ArchivedCoursesCardsGrid from './utils/ArchivedCoursesCardsGrid.vue';
import ArchivedRoundDetailsModal from './utils/ArchivedRoundDetailsModal.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import { INITIAL_ARCHIVED_ROUNDS } from './helpers/archivedCoursesMockData';

// --- نمط العرض (جدول أو كروت) ---
// الوضع الافتراضي لعرض البيانات: شبكة الكروت أولاً وفق رغبة المستخدم مع إمكانية التبديل للجدول
const viewMode = ref('grid'); // 'grid' | 'table'

// --- الحالة الأساسية للبيانات ---
const rounds = ref([...INITIAL_ARCHIVED_ROUNDS]);
const isRefreshing = ref(false);

// --- الفلاتر والبحث ---
const searchQuery = ref('');
const activeTab = ref('all'); // 'all' | 'high' | 'labs' | 'halls'
const selectedCourse = ref(null);
const selectedInstructor = ref(null);

// --- الترقيم (Pagination) ---
const currentPage = ref(1);
const itemsPerPage = ref(5);
const perPageOptions = [
  { label: '5 دورات', value: 5 },
  { label: '10 دورات', value: 10 },
  { label: '20 دورة', value: 20 },
];

// --- المودالات ---
const selectedRoundForDetails = ref(null);
const isDetailsModalOpen = ref(false);

const selectedTraineeForProfile = ref(null);
const isTraineeProfileModalOpen = ref(false);

// --- رسالة التأكيد (Toast) ---
const feedbackMessage = ref({ type: '', text: '' });
let feedbackTimer = null;

function showToast(text, type = 'success') {
  feedbackMessage.value = { type, text };
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedbackMessage.value = { type, text };
  }, 4500);
}

// --- الحسابات الإحصائية (KPIs) ---
const totalRounds = computed(() => rounds.value.length);
const totalGraduates = computed(() => {
  return rounds.value.reduce((sum, r) => sum + (r.graduatedCount || 0), 0);
});
const totalRevenue = computed(() => {
  return rounds.value.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
});
const averageAttendance = computed(() => {
  if (rounds.value.length === 0) return 0;
  const total = rounds.value.reduce((sum, r) => sum + (r.averageAttendance || 0), 0);
  return Math.round(total / rounds.value.length);
});

const highAttendanceCount = computed(() => {
  return rounds.value.filter((r) => r.averageAttendance >= 95).length;
});

// --- خيارات القوائم المنسدلة ---
const courseOptions = computed(() => {
  const map = new Map();
  rounds.value.forEach((r) => {
    if (r.courseName) {
      map.set(r.courseName, r.courseName);
    }
  });
  return Array.from(map.values()).map((name) => ({ label: name, value: name }));
});

const instructorOptions = computed(() => {
  const map = new Map();
  rounds.value.forEach((r) => {
    if (r.instructor?.name) {
      map.set(r.instructor.name, r.instructor.name);
    }
  });
  return Array.from(map.values()).map((name) => ({ label: name, value: name }));
});

// --- تصفية السجلات ---
const filteredRounds = computed(() => {
  return rounds.value.filter((round) => {
    // 1. فلتر التبويب
    if (activeTab.value === 'high' && round.averageAttendance < 95) {
      return false;
    }

    // 2. فلتر الدورة
    if (selectedCourse.value && round.courseName !== selectedCourse.value) {
      return false;
    }

    // 3. فلتر المحاضر
    if (selectedInstructor.value && round.instructor?.name !== selectedInstructor.value) {
      return false;
    }

    // 4. البحث النصي
    if (searchQuery.value) {
      const q = searchQuery.value.trim().toLowerCase();
      const course = round.courseName?.toLowerCase() || '';
      const roundNum = String(round.roundNumber);
      const roundCode = round.roundCode?.toLowerCase() || '';
      const instructor = round.instructor?.name?.toLowerCase() || '';
      const specialty = round.instructor?.specialty?.toLowerCase() || '';
      const hall = round.hall?.name?.toLowerCase() || '';

      if (
        !course.includes(q) &&
        !roundNum.includes(q) &&
        !roundCode.includes(q) &&
        !instructor.includes(q) &&
        !specialty.includes(q) &&
        !hall.includes(q)
      ) {
        return false;
      }
    }

    return true;
  });
});

// --- السجلات المعروضة في الصفحة الحالية ---
const paginatedRounds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRounds.value.slice(start, start + itemsPerPage.value);
});

// إعادة الصفحة الأولى تلقائياً عند تغيير أي فلتر
watch([activeTab, searchQuery, selectedCourse, selectedInstructor, itemsPerPage], () => {
  currentPage.value = 1;
});

// --- الدوال والإجراءات ---
function clearFilters() {
  searchQuery.value = '';
  activeTab.value = 'all';
  selectedCourse.value = null;
  selectedInstructor.value = null;
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    rounds.value = [...INITIAL_ARCHIVED_ROUNDS];
    isRefreshing.value = false;
    showToast('تم تحديث أرشيف وسجلات الدورات المنعقدة سابقاً');
  }, 400);
}

function handlePrintArchive() {
  window.print();
}

function handleOpenDetails(round) {
  selectedRoundForDetails.value = round;
  isDetailsModalOpen.value = true;
}

function handleOpenTraineeProfile(logCompatible) {
  selectedTraineeForProfile.value = logCompatible;
  isTraineeProfileModalOpen.value = true;
}
</script>
