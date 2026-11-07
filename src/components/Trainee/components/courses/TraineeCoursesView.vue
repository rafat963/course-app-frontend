<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- العنوان والوصف -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <LayoutGrid class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              الدورات المتاحة للتقديم
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              كتالوج دورات الانعقاد المفتوحة حالياً — تقدّم واحجز مقعدك الآن
            </p>
          </div>
        </div>

        <!-- بطاقة بيانات المتدرب السريعة -->
        <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm">
            {{ userInitials }}
          </div>
          <div>
            <div class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{{ traineeProfile.fullName }}</div>
            <div class="text-[11px] text-slate-400">
              {{ CATEGORY_CONFIG[traineeProfile.category]?.label || traineeProfile.category }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         2. شريط البحث والفلاتر
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <!-- البحث -->
        <div class="relative flex-1 w-full sm:max-w-xs">
          <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ابحث بالاسم أو الدومين..."
            class="w-full h-9 pr-9 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
          />
        </div>

        <!-- فلاتر التبويبات السريعة -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="tab in tabOptions"
            :key="tab.value"
            type="button"
            class="h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border"
            :class="
              activeTab === tab.value
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            "
            @click="activeTab = tab.value; currentPage = 1"
          >
            {{ tab.label }}
            <span
              class="mr-1 font-mono"
              :class="activeTab === tab.value ? 'text-primary-100' : 'text-slate-400'"
            >
              ({{ tab.count }})
            </span>
          </button>
        </div>

        <!-- زر تحديث -->
        <button
          type="button"
          class="h-8 w-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          :class="{ 'animate-spin': isRefreshing }"
          title="تحديث القائمة"
          @click="handleRefresh"
        >
          <RefreshCw class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- =========================================================
         3. شبكة الكروت
         ========================================================= -->

    <!-- حالة: لا يوجد بيانات مطابقة -->
    <div
      v-if="filteredRounds.length === 0"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl px-8 py-16 text-center space-y-3"
    >
      <div class="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
        <BookX class="w-7 h-7 text-slate-400" />
      </div>
      <h3 class="text-sm font-black text-slate-700 dark:text-slate-200 font-heading">لا توجد دورات مطابقة</h3>
      <p class="text-xs text-slate-400 dark:text-slate-500">
        {{ searchQuery ? 'جرّب تغيير مصطلح البحث' : 'لا توجد دورات في هذه الفئة حالياً' }}
      </p>
      <button
        type="button"
        class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
        @click="clearFilters"
      >
        إعادة ضبط الفلاتر
      </button>
    </div>

    <!-- شبكة الكروت الحقيقية -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <AvailableCourseCard
        v-for="round in paginatedRounds"
        :key="round.id"
        :round="round"
        :trainee-category="traineeProfile.category"
        :application="applicationsByRound.get(String(round.id)) || null"
        @open-details="handleOpenDetails"
        @apply="handleOpenApply"
      />
    </div>

    <!-- ترقيم الصفحات -->
    <div
      v-if="filteredRounds.length > itemsPerPage"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <AppPagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredRounds.length"
        :per-page-options="perPageOptions"
        item-label="دورة"
      />
    </div>

    <!-- =========================================================
         4. مودالات
         ========================================================= -->
    <!-- مودال تفاصيل الدورة (يستبدل زر تقديم الآن بحالة تم التقديم في حال وجود طلب سابق) -->
    <CourseDetailsModal
      :is-open="isDetailsModalOpen"
      :round="selectedRound"
      :trainee-category="traineeProfile.category"
      :application="selectedRound ? applicationsByRound.get(String(selectedRound.id)) || null : null"
      @close="isDetailsModalOpen = false"
      @apply="handleOpenApply"
    />

    <!-- مودال التقديم السريع -->
    <ApplyConfirmModal
      :is-open="isApplyModalOpen"
      :round="selectedRound"
      :trainee-profile="traineeProfile"
      @close="isApplyModalOpen = false"
      @submitted="handleApplicationSubmitted"
    />

    <!-- =========================================================
         5. Toast الإشعار العائم
         ========================================================= -->
    <Transition name="slide-up">
      <div
        v-if="toastMessage.text"
        class="fixed bottom-6 left-6 z-[60] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold max-w-sm"
        :class="
          toastMessage.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/95 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
        "
      >
        <CheckCircle2 v-if="toastMessage.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <XCircle v-else class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>{{ toastMessage.text }}</span>
        <button
          type="button"
          class="mr-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          @click="toastMessage.text = ''"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  LayoutGrid,
  Search,
  RefreshCw,
  BookX,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-vue-next';
import AvailableCourseCard from './AvailableCourseCard.vue';
import CourseDetailsModal from './CourseDetailsModal.vue';
import ApplyConfirmModal from './ApplyConfirmModal.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useNotificationsStore } from '@/shared/stores/notificationsStore';
import { AVAILABLE_ROUNDS, TRAINEE_MOCK_PROFILE } from '../../helpers/availableCoursesMockData';
import { TRAINEE_APPLICATIONS } from '../../helpers/traineePortalMockData';
import { CATEGORY_CONFIG } from '../../helpers/availableCoursesHelpers';
import { useTraineeApplicationsStore } from '../../stores/traineeApplicationsStore';

// ============================================================
// المتاجر: المصادقة، الإشعارات، طلبات المتدرب والراوتر
// ============================================================
const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const applicationsStore = useTraineeApplicationsStore();

// ============================================================
// بروفايل المتدرب
// ============================================================
const traineeProfile = computed(() => ({
  ...TRAINEE_MOCK_PROFILE,
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId,
  category: authStore.user?.category || TRAINEE_MOCK_PROFILE.category,
  profilePhotoPath: authStore.user?.profilePhotoPath || TRAINEE_MOCK_PROFILE.profilePhotoPath,
  nationalId: authStore.user?.nationalId || TRAINEE_MOCK_PROFILE.nationalId,
  phone: authStore.user?.phone || TRAINEE_MOCK_PROFILE.phone,
  email: authStore.user?.email || TRAINEE_MOCK_PROFILE.email,
}));

const userInitials = computed(() => {
  const name = traineeProfile.value.fullName?.trim() || 'م';
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
});

// ============================================================
// البيانات الأساسية
// ============================================================
const rounds = ref([...AVAILABLE_ROUNDS]);
const isRefreshing = ref(false);

// تحميل طلبات المتدرب الحالي (محفوظة لكل مستخدم) لاستعادة حالة "تم التقديم"
applicationsStore.load(traineeProfile.value.userId);

/** طلبات التقديم مفهرسة برقم الدفعة لتحديث حالة أزرار الكروت والمودال */
const applicationsByRound = computed(() => {
  const map = new Map();
  // 1. طلبات المتدرب المسبقة المسجلة بالمنظومة
  TRAINEE_APPLICATIONS.forEach((app) => {
    const roundId = app.round?.courseRoundId || app.courseRoundId || app.roundId;
    if (roundId) {
      map.set(String(roundId), app);
    }
  });
  // 2. طلبات المتدرب المنشأة حديثاً عبر المتجر في الجلسة
  applicationsStore.applications.forEach((app) => {
    const roundId = app.courseRoundId || app.round?.courseRoundId || app.roundId;
    if (roundId) {
      map.set(String(roundId), app);
    }
  });
  return map;
});

// ============================================================
// فلاتر وبحث — استبعاد الدورات مكتملة المقاعد تلقائياً
// ============================================================
const searchQuery = ref('');
const activeTab = ref('all');

/** التحقق هل الدورة مكتملة السعة */
function isRoundFull(r) {
  if (!r) return false;
  return r.status === 'Full' || (r.capacity > 0 && (r.enrolledCount || 0) >= r.capacity);
}

const tabOptions = computed(() => [
  {
    value: 'all',
    label: 'الكل المتاح',
    count: rounds.value.filter((r) => !isRoundFull(r)).length,
  },
  {
    value: 'available',
    label: 'متاحة للتقديم',
    count: rounds.value.filter((r) => r.status === 'Available' && !isRoundFull(r)).length,
  },
]);

const filteredRounds = computed(() => {
  // إخفاء الدورات المكتملة تماماً ليظهر فقط الدورات الشاغرة
  let list = rounds.value.filter((r) => !isRoundFull(r));

  if (activeTab.value === 'available') {
    list = list.filter((r) => r.status === 'Available');
  }

  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    list = list.filter((r) => {
      const name = (r.courseName || '').toLowerCase();
      const code = (r.courseCode || '').toLowerCase();
      const roundCode = (r.roundCode || '').toLowerCase();
      const domain = (r.courseDomain || '').toLowerCase();
      const instructor = (r.instructor?.name || '').toLowerCase();
      return (
        name.includes(query) ||
        code.includes(query) ||
        roundCode.includes(query) ||
        domain.includes(query) ||
        instructor.includes(query)
      );
    });
  }

  return list;
});

// ============================================================
// ترقيم الصفحات (Pagination)
// ============================================================
const currentPage = ref(1);
const itemsPerPage = ref(6);
const perPageOptions = [3, 6, 9, 12];

const paginatedRounds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRounds.value.slice(start, start + itemsPerPage.value);
});

watch(filteredRounds, () => {
  const maxPage = Math.ceil(filteredRounds.value.length / itemsPerPage.value) || 1;
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
  }
});

// ============================================================
// فتح المودالات
// ============================================================
const selectedRound = ref(null);
const isDetailsModalOpen = ref(false);
const isApplyModalOpen = ref(false);

function handleOpenDetails(round) {
  selectedRound.value = round;
  isDetailsModalOpen.value = true;
}

function handleOpenApply(round) {
  selectedRound.value = round;
  isApplyModalOpen.value = true;
}

// ============================================================
// معالجة تأكيد التقديم السريع مع إشعار فوري والانتقال لمتابعة الطلبات
// ============================================================
function handleApplicationSubmitted(payload) {
  const targetRound = payload.round || selectedRound.value;
  if (!targetRound) return;

  const { qualification, qualificationPhotoPath, note, applicationCode } = payload;

  const newApp = {
    courseRoundId: targetRound.id,
    applicationCode,
    status: 'UnderReview',
    qualificationPhotoPath: qualificationPhotoPath || traineeProfile.value.qualificationPhotoPath || null,
    createdAt: new Date().toISOString(),
    round: {
      courseRoundId: targetRound.id,
      courseName: targetRound.courseName,
      courseCode: targetRound.courseCode,
      courseDomain: targetRound.courseDomain,
      roundNumber: targetRound.roundNumber,
      roundCode: targetRound.roundCode,
      startDate: targetRound.startDate,
      endDate: targetRound.endDate,
      startTime: targetRound.startTime,
      endTime: targetRound.endTime,
      lectureDays: targetRound.lectureDays,
      totalLectures: targetRound.totalLectures,
      passingGrade: targetRound.passingGrade,
      capacity: targetRound.capacity,
      enrolledCount: (targetRound.enrolledCount || 0) + 1,
      hall: targetRound.hall,
      instructor: targetRound.instructor,
      pricings: targetRound.pricings,
    },
  };

  const audit = {
    fromStatus: null,
    toStatus: 'UnderReview',
    changedByUserId: traineeProfile.value.userId,
    changedAt: new Date().toISOString(),
    note: `تقديم إلكتروني سريع من المتدرب (المؤهل: ${qualification || 'غير محدد'})`,
  };

  applicationsStore.addApplication(newApp, audit);

  // 1. إشعار المتدرب الرسمي بالتقديم الناجح (المتطلب 4)
  notificationsStore.notifyTraineeRegistered({
    courseName: targetRound.courseName,
    applicationCode,
  });

  // 2. إشعار شؤون الدارسين بورود طلب جديد
  const affairsNotification = notificationsStore.notifyAffairsNewApplication({
    applicationCode,
    traineeName: traineeProfile.value.fullName,
    courseName: targetRound.courseName,
    roundCode: targetRound.roundCode,
  });

  notificationsStore.addNotification({
    title: affairsNotification.title,
    message: affairsNotification.message,
    category: 'affairs',
    priority: 'important',
    isRead: false,
    isStarred: false,
    createdAt: 'الآن',
    sender: `المتدرب: ${traineeProfile.value.fullName}`,
    link: '/affairs/applications/applicants',
    actionLabel: 'مراجعة الطلب',
    referenceId: applicationCode,
  });

  showToast(`تم إرسال طلبك بنجاح! كود الطلب: ${applicationCode} — جاري نقلك لصفحة متابعة الطلبات...`, 'success');

  // 3. الانتقال التلقائي لصفحة "متابعة طلباتي" لرؤية الطلب فوراً (المتطلب 1)
  setTimeout(() => {
    isApplyModalOpen.value = false;
    router.push('/trainee/applications');
  }, 1200);
}

// ============================================================
// Toast
// ============================================================
const toastMessage = ref({ type: '', text: '' });
let toastTimer = null;

function showToast(text, type = 'success') {
  toastMessage.value = { type, text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = { type: '', text: '' };
  }, 5000);
}

// ============================================================
// إجراءات عامة
// ============================================================
function clearFilters() {
  searchQuery.value = '';
  activeTab.value = 'all';
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    rounds.value = [...AVAILABLE_ROUNDS];
    isRefreshing.value = false;
    showToast('تم تحديث قائمة الدورات المتاحة');
  }, 600);
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
