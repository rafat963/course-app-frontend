<template>
  <div class="space-y-4 select-none pb-8">
    <!-- 1. ترويسة الصفحة مع إحصائيات سريعة وأزرار التحديث والجدولة -->
    <ActiveCoursesHeader
      :total-count="totalRounds"
      :ongoing-count="ongoingRoundsCount"
      :available-count="availableRoundsCount"
      :today-lectures-count="todayLecturesCount"
      :is-refreshing="isRefreshing"
      @refresh="handleRefresh"
      @open-create-round="isCreateRoundModalOpen = true"
    />

    <!-- 2. بطاقات الإحصائيات الثلاثة (KPIs) المتناسقة مع نظام التصميم -->
    <ActiveCoursesStats
      :total-rounds="totalRounds"
      :today-lectures="todayLecturesCount"
      :total-trainees="totalTrainees"
    />

    <!-- 3. شريط التبويبات السريعة والبحث وفلاتر القاعات والمحاضرين ومحول العرض -->
    <ActiveCoursesFilters
      v-model:view-mode="viewMode"
      v-model:search-query="searchQuery"
      v-model:active-tab="activeTab"
      v-model:selected-hall="selectedHall"
      v-model:selected-instructor="selectedInstructor"
      :hall-options="hallOptions"
      :instructor-options="instructorOptions"
      :total-count="totalRounds"
      :ongoing-count="ongoingRoundsCount"
      :available-count="availableRoundsCount"
      :today-lectures-count="todayLecturesCount"
      :filtered-count="filteredRounds.length"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول أو كروت حسب طريقة العرض المحددة -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <!-- جدول الدورات الجارية -->
      <ActiveCoursesTable
        :rounds="paginatedRounds"
        :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedHall || selectedInstructor)"
        @open-trainees="handleOpenTrainees"
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
        item-label="دورة جارية"
      />
    </div>

    <!-- شبكة الكروت في حال اختيار viewMode === 'grid' -->
    <div v-else class="space-y-4">
      <ActiveCoursesCardsGrid
        :rounds="paginatedRounds"
        :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedHall || selectedInstructor)"
        @open-trainees="handleOpenTrainees"
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
          item-label="دورة جارية"
        />
      </div>
    </div>

    <!-- 5. نافذة كشف الدارسين المقيدين في الدفعة (RoundTraineesModal) -->
    <RoundTraineesModal
      :is-open="isTraineesModalOpen"
      :round="selectedRoundForTrainees"
      @close="isTraineesModalOpen = false"
      @open-trainee-profile="handleOpenTraineeProfile"
    />

    <!-- 6. نافذة تفاصيل ومواعيد الدفعة وقاعتها (RoundDetailsModal) -->
    <RoundDetailsModal
      :is-open="isDetailsModalOpen"
      :round="selectedRoundForDetails"
      @close="isDetailsModalOpen = false"
      @open-trainees="handleOpenTraineesFromDetails"
    />

    <!-- 7. نافذة ملف المتدرب الموحدة TraineeDetailsModal المشتركة -->
    <TraineeDetailsModal
      :is-open="isTraineeProfileModalOpen"
      :log="selectedTraineeForProfile"
      @close="isTraineeProfileModalOpen = false"
    />

    <!-- 8. نافذة فتح دورة انعقاد جديدة (CourseRoundModal) -->
    <CourseRoundModal
      :is-open="isCreateRoundModalOpen"
      :courses="catalogCourses"
      :existing-rounds="allCombinedRounds"
      @close="isCreateRoundModalOpen = false"
      @save="handleSaveNewRound"
    />

    <!-- 9. رسالة تأكيد عائمة (Toast Alert) -->
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
import ActiveCoursesHeader from './utils/ActiveCoursesHeader.vue';
import ActiveCoursesStats from './utils/ActiveCoursesStats.vue';
import ActiveCoursesFilters from './utils/ActiveCoursesFilters.vue';
import ActiveCoursesTable from './utils/ActiveCoursesTable.vue';
import ActiveCoursesCardsGrid from './utils/ActiveCoursesCardsGrid.vue';
import RoundTraineesModal from './utils/RoundTraineesModal.vue';
import RoundDetailsModal from './utils/RoundDetailsModal.vue';
import CourseRoundModal from '@/components/Affairs/components/AllCourses/utils/CourseRoundModal.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import { INITIAL_ACTIVE_ROUNDS } from './helpers/activeCoursesMockData';
import { isRoundLectureToday } from './helpers/activeCoursesConstants';
import { INITIAL_COURSES } from '@/components/Affairs/components/AllCourses/helpers/courseMockData';
import { INITIAL_ARCHIVED_ROUNDS } from '@/components/Affairs/components/ArchivedCourses/helpers/archivedCoursesMockData';

// --- نمط العرض (جدول أو كروت) ---
// الوضع الافتراضي لعرض البيانات: شبكة الكروت أولاً وفق رغبة المستخدم مع إمكانية التبديل للجدول
const viewMode = ref('grid'); // 'grid' | 'table'

// --- الحالة الأساسية للبيانات ---
const rounds = ref([...INITIAL_ACTIVE_ROUNDS]);
const catalogCourses = ref([...INITIAL_COURSES]);
const pastRounds = ref([...INITIAL_ARCHIVED_ROUNDS]);
const allCombinedRounds = computed(() => [...rounds.value, ...pastRounds.value]);
const isRefreshing = ref(false);

// --- الفلاتر والبحث ---
const searchQuery = ref('');
const activeTab = ref('all'); // 'all' | 'ongoing' | 'available' | 'today' | 'labs' | 'halls'
const selectedHall = ref(null);
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
const selectedRoundForTrainees = ref(null);
const isTraineesModalOpen = ref(false);

const selectedRoundForDetails = ref(null);
const isDetailsModalOpen = ref(false);

const selectedTraineeForProfile = ref(null);
const isTraineeProfileModalOpen = ref(false);

const isCreateRoundModalOpen = ref(false);

// --- رسالة التأكيد (Toast) ---
const feedbackMessage = ref({ type: '', text: '' });
let feedbackTimer = null;

function showToast(text, type = 'success') {
  feedbackMessage.value = { type, text };
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedbackMessage.value = { type: '', text: '' };
  }, 4500);
}

// --- الحسابات الإحصائية (KPIs) ---
const totalRounds = computed(() => rounds.value.length);
const ongoingRoundsCount = computed(() => rounds.value.filter((r) => r.status === 'Ongoing').length);
const availableRoundsCount = computed(() => rounds.value.filter((r) => r.status === 'Available').length);
const todayLecturesCount = computed(() => {
  return rounds.value.filter((r) => r.status === 'Ongoing' && isRoundLectureToday(r.lectureDays)).length;
});
const totalTrainees = computed(() => {
  return rounds.value.reduce((sum, r) => sum + (r.enrolledCount || 0), 0);
});
const averageAttendance = computed(() => {
  const ongoing = rounds.value.filter((r) => r.status === 'Ongoing');
  if (ongoing.length === 0) return 0;
  const total = ongoing.reduce((sum, r) => sum + (r.attendanceRate || 0), 0);
  return Math.round(total / ongoing.length);
});

// --- خيارات القوائم المنسدلة ---
const hallOptions = computed(() => {
  const map = new Map();
  rounds.value.forEach((r) => {
    if (r.hall?.name) {
      map.set(r.hall.name, r.hall.name);
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
    // 1. فلتر التبويب السريع
    if (activeTab.value === 'ongoing' && round.status !== 'Ongoing') {
      return false;
    }
    if (activeTab.value === 'available' && round.status !== 'Available') {
      return false;
    }
    if (activeTab.value === 'today' && (!isRoundLectureToday(round.lectureDays) || round.status !== 'Ongoing')) {
      return false;
    }

    // 2. فلتر القاعة
    if (selectedHall.value && round.hall?.name !== selectedHall.value) {
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
      const instructor = round.instructor?.name?.toLowerCase() || '';
      const specialty = round.instructor?.specialty?.toLowerCase() || '';
      const hall = round.hall?.name?.toLowerCase() || '';

      if (
        !course.includes(q) &&
        !roundNum.includes(q) &&
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
watch([activeTab, searchQuery, selectedHall, selectedInstructor, itemsPerPage], () => {
  currentPage.value = 1;
});

// --- الدوال والإجراءات ---
function clearFilters() {
  searchQuery.value = '';
  activeTab.value = 'all';
  selectedHall.value = null;
  selectedInstructor.value = null;
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    rounds.value = [...INITIAL_ACTIVE_ROUNDS];
    isRefreshing.value = false;
    showToast('تم تحديث قائمة الدورات المنعقدة حالياً ومحاضرات اليوم');
  }, 400);
}

function handleOpenTrainees(round) {
  selectedRoundForTrainees.value = round;
  isTraineesModalOpen.value = true;
}

function handleOpenDetails(round) {
  selectedRoundForDetails.value = round;
  isDetailsModalOpen.value = true;
}

function handleOpenTraineesFromDetails(round) {
  isDetailsModalOpen.value = false;
  handleOpenTrainees(round);
}

function handleOpenTraineeProfile(logCompatible) {
  selectedTraineeForProfile.value = logCompatible;
  isTraineeProfileModalOpen.value = true;
}

function handleSaveNewRound(newRound) {
  const isOngoing = newRound.status === 'Ongoing';
  
  // إضافة الدفعة الجديدة بحالتها المحددة (Available أو Ongoing)
  rounds.value.unshift({
    id: newRound.id,
    courseId: newRound.courseId,
    courseName: newRound.courseName,
    roundNumber: newRound.roundNumber,
    instructor: {
      id: newRound.instructorId,
      name: newRound.instructorName,
      specialty: 'هيئة تدريس معتمدة',
      phone: '01012345678',
    },
    hall: {
      id: newRound.hallId,
      name: newRound.hallName,
      type: newRound.hallName.includes('معمل') ? 'Lab' : 'Hall',
      maxCapacity: newRound.hallMaxCapacity,
    },
    capacity: newRound.capacity,
    enrolledCount: 0,
    startDate: newRound.startDate,
    endDate: newRound.endDate,
    lastApplicationDate: newRound.lastApplicationDate,
    startTime: newRound.startTime,
    endTime: newRound.endTime,
    lectureDays: newRound.lectureDays,
    status: newRound.status || 'Available',
    attendanceRate: isOngoing ? 100 : 0,
    completedLectures: 0,
    totalLectures: 16,
    enrolledTrainees: [],
  });

  // تحديث عداد الدورة في الكتالوج لضمان زيادة الدفعة التالية تلقائياً
  const matchedCourse = catalogCourses.value.find((c) => c.id === newRound.courseId);
  if (matchedCourse) {
    matchedCourse.roundsCount = Math.max(matchedCourse.roundsCount || 0, newRound.roundNumber);
    if (isOngoing) {
      matchedCourse.activeRoundsCount = (matchedCourse.activeRoundsCount || 0) + 1;
    }
  }

  showToast(
    `تم فتح دورة الانعقاد (الدفعة رقم ${newRound.roundNumber}) بنجاح وإدراجها ضمن الدفعات ${isOngoing ? 'الجارية' : 'المفتوحة للتسجيل'}!`
  );
}
</script>
