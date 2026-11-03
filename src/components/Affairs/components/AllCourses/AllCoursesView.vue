<template>
  <div class="space-y-4 select-none pb-8">
    <!-- 1. ترويسة الصفحة مع زر الإضافة بالأعلى يساراً وزر التحديث -->
    <AllCoursesHeader
      :total-count="totalCourses"
      :active-count="activeCourses"
      :is-refreshing="isRefreshing"
      @refresh="handleRefresh"
      @open-create="handleOpenCreate"
      @open-create-round="handleOpenCreateRound"
    />

    <!-- 2. بطاقات الإحصائيات الأربعة المتناسقة مع نظام التصميم الموحد -->
    <AllCoursesStats
      :total-courses="totalCourses"
      :active-courses="activeCourses"
      :total-rounds="totalRounds"
      :total-trainees="totalTrainees"
    />

    <!-- 3. شريط تبويبات الحالة والبحث الفوري ومحول طريقة العرض -->
    <AllCoursesFilters
      v-model:view-mode="viewMode"
      v-model:search-query="searchQuery"
      v-model:status-filter="statusFilter"
      :total-count="totalCourses"
      :active-count="activeCourses"
      :filtered-count="filteredCourses.length"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول أو كروت حسب طريقة العرض -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <!-- جدول الدورات المعتمد على AppTable وفق حقول الـ ERD -->
      <AllCoursesTable
        :courses="paginatedCourses"
        :is-filtered="Boolean(searchQuery || statusFilter !== 'all')"
        @edit-course="handleEditCourse"
        @delete-course="handleDeleteCourse"
        @create-round="handleOpenCreateRound($event.id)"
        @view-rounds="handleViewRounds"
        @view-details="handleViewCourseDetails"
        @clear-filters="clearFilters"
      />

      <!-- شريط الباجينيشن العام AppPagination -->
      <AppPagination
        v-if="filteredCourses.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredCourses.length"
        :per-page-options="perPageOptions"
        item-label="دورة تدريبية"
      />
    </div>

    <!-- شبكة الكروت في حال اختيار viewMode === 'grid' -->
    <div v-else class="space-y-4">
      <AllCoursesCardsGrid
        :courses="paginatedCourses"
        :is-filtered="Boolean(searchQuery || statusFilter !== 'all')"
        @edit-course="handleEditCourse"
        @delete-course="handleDeleteCourse"
        @create-round="handleOpenCreateRound($event.id)"
        @view-rounds="handleViewRounds"
        @view-details="handleViewCourseDetails"
        @clear-filters="clearFilters"
      />

      <!-- شريط الباجينيشن لشبكة الكروت -->
      <div v-if="filteredCourses.length > 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
        <AppPagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredCourses.length"
          :per-page-options="perPageOptions"
          item-label="دورة تدريبية"
        />
      </div>
    </div>

    <!-- 5. نافذة إضافة وتعديل بيانات الدورة والتسعير وفق الـ ERD (CourseFormModal) -->
    <CourseFormModal
      :is-open="isFormModalOpen"
      :course="selectedCourseForEdit"
      @close="isFormModalOpen = false"
      @save="handleSaveCourse"
    />

    <!-- 6. نافذة فتح وجدولة دورة انعقاد جديدة (CourseRoundModal) وفق CourseRounds & CourseLectureDays بالـ ERD -->
    <CourseRoundModal
      :is-open="isRoundModalOpen"
      :initial-course-id="selectedCourseIdForRound"
      :courses="courses"
      :existing-rounds="allCombinedRounds"
      @close="isRoundModalOpen = false"
      @save="handleSaveRound"
    />

    <!-- 7. نافذة استعراض دورات الانعقاد المسجلة للدورة (CourseRoundsListModal) -->
    <CourseRoundsListModal
      :is-open="isRoundsListModalOpen"
      :course="selectedCourseForRoundsList"
      :all-rounds="rounds"
      @close="isRoundsListModalOpen = false"
      @open-create-round="handleOpenCreateRoundFromList"
      @open-round-details="handleOpenArchivedRoundDetails"
    />

    <!-- 8. نافذة تفاصيل الدورة الشاملة واستعراض الدورات السابقة المنعقدة بها (CourseDetailsModal) -->
    <CourseDetailsModal
      :is-open="isCourseDetailsModalOpen"
      :course="selectedCourseForDetails"
      :all-past-rounds="pastRounds"
      :all-operational-rounds="rounds"
      @close="isCourseDetailsModalOpen = false"
      @open-create-round="handleOpenCreateRoundFromList"
      @open-round-details="handleOpenArchivedRoundDetails"
    />

    <!-- 9. نافذة تفاصيل وسجل الدفعة المنعقدة سابقاً (الطلاب والتكلفة والمحاضر) -->
    <ArchivedRoundDetailsModal
      :is-open="isArchivedRoundModalOpen"
      :round="selectedArchivedRound"
      @close="isArchivedRoundModalOpen = false"
      @open-trainee-profile="handleOpenTraineeProfile"
    />

    <!-- 10. نافذة ملف المتدرب الموحدة TraineeDetailsModal -->
    <TraineeDetailsModal
      :is-open="isTraineeModalOpen"
      :log="selectedTraineeForModal"
      @close="isTraineeModalOpen = false"
    />

    <!-- 11. نافذة تأكيد الحذف التحذيرية المطلوبة (CourseDeleteModal) -->
    <CourseDeleteModal
      :is-open="isDeleteModalOpen"
      :course="selectedCourseForDelete"
      @close="isDeleteModalOpen = false"
      @confirm="handleConfirmDelete"
    />

    <!-- 7. رسالة تأكيد عائمة (Floating Toast Alert) عند الإضافة أو التعديل أو الحذف -->
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
import AllCoursesHeader from './utils/AllCoursesHeader.vue';
import AllCoursesStats from './utils/AllCoursesStats.vue';
import AllCoursesFilters from './utils/AllCoursesFilters.vue';
import AllCoursesTable from './utils/AllCoursesTable.vue';
import AllCoursesCardsGrid from './utils/AllCoursesCardsGrid.vue';
import CourseFormModal from './utils/CourseFormModal.vue';
import CourseDeleteModal from './utils/CourseDeleteModal.vue';
import CourseRoundModal from './utils/CourseRoundModal.vue';
import CourseRoundsListModal from './utils/CourseRoundsListModal.vue';
import CourseDetailsModal from './utils/CourseDetailsModal.vue';
import ArchivedRoundDetailsModal from '@/components/Affairs/components/ArchivedCourses/utils/ArchivedRoundDetailsModal.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import { INITIAL_COURSES, INITIAL_COURSE_ROUNDS } from './helpers/courseMockData';
import { INITIAL_ARCHIVED_ROUNDS } from '@/components/Affairs/components/ArchivedCourses/helpers/archivedCoursesMockData';

// --- نمط العرض (جدول للديسك توب، وكروت افتراضياً للموبايل والتابلت) ---
// الوضع الافتراضي لعرض البيانات: شبكة الكروت أولاً وفق رغبة المستخدم مع إمكانية التبديل للجدول
const viewMode = ref('grid'); // 'grid' | 'table'

// --- حالة البيانات الرئيسية ---
const courses = ref([...INITIAL_COURSES]);
const rounds = ref([...INITIAL_COURSE_ROUNDS]);
const pastRounds = ref([...INITIAL_ARCHIVED_ROUNDS]);
const allCombinedRounds = computed(() => [...rounds.value, ...pastRounds.value]);
const isRefreshing = ref(false);

// --- الفلاتر والبحث ---
const searchQuery = ref('');
const statusFilter = ref('all'); // 'all' | 'active' | 'inactive'

// --- الترقيم (Pagination) ---
const currentPage = ref(1);
const itemsPerPage = ref(5);
const perPageOptions = [
  { label: '5 دورات', value: 5 },
  { label: '10 دورات', value: 10 },
  { label: '20 دورة', value: 20 },
];

// --- المودالات ---
const isFormModalOpen = ref(false);
const selectedCourseForEdit = ref(null);

const isDeleteModalOpen = ref(false);
const selectedCourseForDelete = ref(null);

// مودال إنشاء دورة انعقاد جديدة (Round)
const isRoundModalOpen = ref(false);
const selectedCourseIdForRound = ref(null);

// مودال استعراض دفعات دورة معينة
const isRoundsListModalOpen = ref(false);
const selectedCourseForRoundsList = ref(null);

// مودال تفاصيل الدورة والدورات السابقة المنعقدة بها (CourseDetailsModal)
const isCourseDetailsModalOpen = ref(false);
const selectedCourseForDetails = ref(null);

// مودال تفاصيل وسجل الدفعة المنعقدة سابقاً (ArchivedRoundDetailsModal)
const isArchivedRoundModalOpen = ref(false);
const selectedArchivedRound = ref(null);

// مودال ملف المتدرب الموحد
const isTraineeModalOpen = ref(false);
const selectedTraineeForModal = ref(null);

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
const totalCourses = computed(() => courses.value.length);
const activeCourses = computed(() => courses.value.filter((c) => c.isActive).length);
const totalRounds = computed(() => courses.value.reduce((sum, c) => sum + (c.roundsCount || 0), 0));
const totalTrainees = computed(() => courses.value.reduce((sum, c) => sum + (c.traineesCount || 0), 0));

// --- تصفية الدورات ---
const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    // 1. فلتر الحالة (Courses.IsActive)
    if (statusFilter.value === 'active' && !course.isActive) return false;
    if (statusFilter.value === 'inactive' && course.isActive) return false;

    // 2. البحث النصي بالاسم أو الوصف أو المحاضر المعتمد
    if (searchQuery.value) {
      const q = searchQuery.value.trim().toLowerCase();
      const name = course.name?.toLowerCase() || '';
      const desc = course.description?.toLowerCase() || '';
      const inst = course.instructorName?.toLowerCase() || '';

      if (!name.includes(q) && !desc.includes(q) && !inst.includes(q)) {
        return false;
      }
    }

    return true;
  });
});

// --- الدورات المعروضة في الصفحة الحالية ---
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCourses.value.slice(start, start + itemsPerPage.value);
});

// إعادة الصفحة الأولى تلقائياً عند تغيير أي فلتر
watch([statusFilter, searchQuery, itemsPerPage], () => {
  currentPage.value = 1;
});

// --- الإجراءات والدوال ---
function clearFilters() {
  searchQuery.value = '';
  statusFilter.value = 'all';
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    courses.value = [...INITIAL_COURSES];
    rounds.value = [...INITIAL_COURSE_ROUNDS];
    pastRounds.value = [...INITIAL_ARCHIVED_ROUNDS];
    isRefreshing.value = false;
    showToast('تم تحديث قائمة الدورات والأرشيف بالكتالوج');
  }, 400);
}

// أ. إضافة دورة جديدة بالكتالوج
function handleOpenCreate() {
  selectedCourseForEdit.value = null;
  isFormModalOpen.value = true;
}

// ب. تعديل دورة موجودة
function handleEditCourse(course) {
  selectedCourseForEdit.value = course;
  isFormModalOpen.value = true;
}

// ج. حفظ الإضافة أو التعديل
function handleSaveCourse(formData) {
  if (formData.id) {
    // تعديل دورة قائمة
    const idx = courses.value.findIndex((c) => c.id === formData.id);
    if (idx !== -1) {
      courses.value[idx] = {
        ...courses.value[idx],
        name: formData.name,
        description: formData.description,
        instructorId: formData.instructorId,
        instructorName: formData.instructorName,
        isActive: formData.isActive,
        pricings: { ...formData.pricings },
      };
      showToast(`تم تعديل بيانات الدورة "${formData.name}" بنجاح`);
    }
  } else {
    // إضافة دورة جديدة
    const newCourse = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      instructorId: formData.instructorId,
      instructorName: formData.instructorName,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      pricings: { ...formData.pricings },
      roundsCount: 0,
      activeRoundsCount: 0,
      traineesCount: 0,
    };
    courses.value.unshift(newCourse);
    showToast(`تمت إضافة الدورة الجديدة "${formData.name}" بنجاح إلى الكتالوج`);
  }
  isFormModalOpen.value = false;
  selectedCourseForEdit.value = null;
}

// د. فتح دورة انعقاد جديدة (Round) من أي كورس
function handleOpenCreateRound(courseId = null) {
  selectedCourseIdForRound.value = courseId;
  isRoundModalOpen.value = true;
}

// هـ. فتح دورة انعقاد من داخل مودال استعراض الدفعات
function handleOpenCreateRoundFromList(courseId) {
  isRoundsListModalOpen.value = false;
  isCourseDetailsModalOpen.value = false;
  handleOpenCreateRound(courseId);
}

// و. حفظ واعتماد دورة انعقاد جديدة (CourseRound)
function handleSaveRound(newRound) {
  rounds.value.unshift(newRound);

  // تحديث عداد الدفعات في كورس الكتالوج
  const matchedCourse = courses.value.find((c) => c.id === newRound.courseId);
  if (matchedCourse) {
    matchedCourse.roundsCount = Math.max(matchedCourse.roundsCount || 0, newRound.roundNumber);
    if (newRound.status === 'Ongoing') {
      matchedCourse.activeRoundsCount = (matchedCourse.activeRoundsCount || 0) + 1;
    }
  }

  showToast(
    `تم فتح دورة الانعقاد (الدفعة رقم ${newRound.roundNumber}) لدورة "${matchedCourse?.name || ''}" بنجاح!`,
    'success'
  );
}

// ز. استعراض دفعات دورة تدريبية معينة
function handleViewRounds(course) {
  selectedCourseForRoundsList.value = course;
  isRoundsListModalOpen.value = true;
}

// ح. استعراض تفاصيل الدورة والدورات السابقة المنعقدة بها (الطلب الأساسي)
function handleViewCourseDetails(course) {
  selectedCourseForDetails.value = course;
  isCourseDetailsModalOpen.value = true;
}

// ط. فتح تفاصيل وسجل أي دورة سابقة (الطلاب، التكلفة، المحاضر)
function handleOpenArchivedRoundDetails(round) {
  // البحث عن بيانات الدفعة الكاملة بالأرشيف إذا توفرت
  const fullArchivedRound = pastRounds.value.find(
    (r) => r.id === round.id || (r.courseId === round.courseId && r.roundNumber === round.roundNumber)
  );

  selectedArchivedRound.value = fullArchivedRound || round;
  isArchivedRoundModalOpen.value = true;
}

// ي. فتح ملف المتدرب الموحد من داخل كشف الدفعة السابقة
function handleOpenTraineeProfile(logCompatible) {
  selectedTraineeForModal.value = logCompatible;
  isTraineeModalOpen.value = true;
}

// ك. طلب حذف دورة (فتح مودال التأكيد)
function handleDeleteCourse(course) {
  selectedCourseForDelete.value = course;
  isDeleteModalOpen.value = true;
}

// ل. تأكيد الحذف
function handleConfirmDelete(course) {
  courses.value = courses.value.filter((c) => c.id !== course.id);
  isDeleteModalOpen.value = false;
  selectedCourseForDelete.value = null;
  showToast(`تم حذف الدورة "${course.name}" نهائياً من الكتالوج`, 'error');
}
</script>
