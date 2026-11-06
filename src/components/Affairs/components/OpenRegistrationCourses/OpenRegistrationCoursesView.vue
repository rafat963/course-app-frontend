<template>
  <div class="space-y-4 select-none pb-8">
    <!-- 1. ترويسة الصفحة مع إحصائيات الدفعات وأزرار التحديث والفتح السريع -->
    <OpenRegistrationHeader
      :total-count="openRounds.length"
      :total-seats="totalCapacitySeats"
      :is-refreshing="isRefreshing"
      @refresh="handleRefresh"
      @open-new-round="handleOpenNewRound"
    />

    <!-- 2. بطاقات الإحصائيات الأربعة (KPIs) -->
    <OpenRegistrationStats
      :total-rounds="openRounds.length"
      :total-seats="totalCapacitySeats"
      :total-enrolled="totalEnrolledCount"
      :total-pending="totalPendingCount"
    />

    <!-- 3. شريط التبويبات والبحث وفلاتر الدورات والقاعات ومحول العرض -->
    <OpenRegistrationFilters
      v-model:view-mode="viewMode"
      v-model:search-query="searchQuery"
      v-model:active-tab="activeTab"
      v-model:selected-course="selectedCourse"
      v-model:selected-hall="selectedHall"
      :course-options="courseOptions"
      :hall-options="hallOptions"
      :total-count="openRounds.length"
      :available-count="availableCount"
      :almost-full-count="almostFullCount"
      :full-count="fullCount"
      @clear-filters="clearFilters"
    />

    <!-- 4. عرض البيانات: جدول أو كروت حسب طريقة العرض المحددة -->
    <!-- أ. وضع جدول البيانات -->
    <div
      v-if="viewMode === 'table'"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <OpenRegistrationTable
        :rounds="paginatedRounds"
        :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedCourse || selectedHall)"
        @open-tracking="handleOpenTracking"
        @clear-filters="clearFilters"
      />

      <AppPagination
        v-if="filteredRounds.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredRounds.length"
        :per-page-options="perPageOptions"
        item-label="دورة مفتوحة"
      />
    </div>

    <!-- ب. وضع شبكة الكروت (Cards Grid View) -->
    <div v-else class="space-y-4">
      <OpenRegistrationCardsGrid
        :rounds="paginatedRounds"
        :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedCourse || selectedHall)"
        @open-tracking="handleOpenTracking"
        @clear-filters="clearFilters"
      />

      <div
        v-if="filteredRounds.length > 0"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
      >
        <AppPagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredRounds.length"
          :per-page-options="perPageOptions"
          item-label="دورة مفتوحة"
        />
      </div>
    </div>

    <!-- 5. نافذة متابعة تسجيل ودارسي الدفعة الشاملة (مين قدم ومين دفع ومين قدم ومدفعش) -->
    <RegistrationTrackingModal
      :is-open="isTrackingModalOpen"
      :round="selectedRoundForTracking"
      @close="isTrackingModalOpen = false"
      @open-trainee-profile="handleOpenTraineeProfile"
      @open-receipt="handleOpenReceiptFromTrainee"
      @record-payment="handleOpenRecordPayment"
      @extend-deadline="handleOpenExtendDeadline"
    />

    <!-- 6. نافذة ملف المتدرب الموحدة TraineeDetailsModal المشتركة -->
    <TraineeDetailsModal
      :is-open="isTraineeProfileModalOpen"
      :application="selectedTraineeForProfile"
      @close="isTraineeProfileModalOpen = false"
    />

    <!-- 7. مودال سداد الرسوم وإصدار الإيصال المالي المباشر -->
    <RecordPaymentModal
      :is-open="isRecordPaymentModalOpen"
      :application="selectedApplicantForAction"
      @close="isRecordPaymentModalOpen = false"
      @confirm="handleConfirmRecordPayment"
    />

    <!-- 8. مودال عرض وطباعة إيصال السداد المالي وقيد الدارس -->
    <PaymentSuccessReceiptModal
      :is-open="isReceiptModalOpen"
      :receipt-data="selectedReceiptData"
      @close="isReceiptModalOpen = false"
    />

    <!-- 9. مودال تمديد مهلة السداد -->
    <ExtendDeadlineModal
      :is-open="isExtendDeadlineModalOpen"
      :application="selectedApplicantForAction"
      @close="isExtendDeadlineModalOpen = false"
      @confirm="handleConfirmExtendDeadline"
    />

    <!-- 10. مودال فتح دورة جديدة للتسجيل -->
    <CourseRoundModal
      :is-open="isNewRoundModalOpen"
      :courses="courseOptions"
      :existing-rounds="openRounds"
      @close="isNewRoundModalOpen = false"
      @save="handleSaveNewRound"
    />

    <!-- 11. رسالة تأكيد عائمة (Toast Alert) -->
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
} from 'lucide-vue-next';

// مكونات الصفحة الرئيسية
import OpenRegistrationHeader from './utils/OpenRegistrationHeader.vue';
import OpenRegistrationStats from './utils/OpenRegistrationStats.vue';
import OpenRegistrationFilters from './utils/OpenRegistrationFilters.vue';
import OpenRegistrationCardsGrid from './utils/OpenRegistrationCardsGrid.vue';
import OpenRegistrationTable from './utils/OpenRegistrationTable.vue';
import RegistrationTrackingModal from './utils/RegistrationTrackingModal.vue';

// المكونات المشتركة والنوافذ المساعدة
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import TraineeDetailsModal from '@/shared/ui/Modals/TraineeDetailsModal.vue';
import RecordPaymentModal from '../PendingPaymentApplications/utils/RecordPaymentModal.vue';
import PaymentSuccessReceiptModal from '../PendingPaymentApplications/utils/PaymentSuccessReceiptModal.vue';
import ExtendDeadlineModal from '../PendingPaymentApplications/utils/ExtendDeadlineModal.vue';
import CourseRoundModal from '../AllCourses/utils/CourseRoundModal.vue';

// البيانات التجريبية
import { INITIAL_OPEN_REGISTRATION_ROUNDS } from './helpers/openRegistrationMockData';
import { INITIAL_COURSES, INITIAL_HALLS } from '../AllCourses/helpers/courseMockData';

// الحالة الرئيسية للبيانات
const openRounds = ref(JSON.parse(JSON.stringify(INITIAL_OPEN_REGISTRATION_ROUNDS)));
const isRefreshing = ref(false);

// الفلاتر والبحث
const viewMode = ref('grid'); // 'grid' | 'table'
const searchQuery = ref('');
const activeTab = ref('all'); // 'all' | 'available' | 'almostFull' | 'full'
const selectedCourse = ref('');
const selectedHall = ref('');

// الترقيم (Pagination)
const currentPage = ref(1);
const itemsPerPage = ref(6);
const perPageOptions = [6, 12, 24];

// نوافذ المودال
const isTrackingModalOpen = ref(false);
const selectedRoundForTracking = ref(null);

const isTraineeProfileModalOpen = ref(false);
const selectedTraineeForProfile = ref(null);

const isRecordPaymentModalOpen = ref(false);
const selectedApplicantForAction = ref(null);

const isReceiptModalOpen = ref(false);
const selectedReceiptData = ref(null);

const isExtendDeadlineModalOpen = ref(false);
const isNewRoundModalOpen = ref(false);

// رسائل التأكيد (Toast)
const feedbackMessage = ref({ text: '', type: 'success' });
let toastTimer = null;
function showToast(text, type = 'success') {
  feedbackMessage.value = { text, type };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    feedbackMessage.value.text = '';
  }, 4000);
}

// خيارات الكورسات والقاعات
const courseOptions = computed(() => {
  return INITIAL_COURSES.map((c) => ({
    id: c.id,
    name: c.name,
  }));
});

const hallOptions = computed(() => {
  return INITIAL_HALLS.map((h) => ({
    id: h.id,
    name: h.name,
  }));
});

// إحصائيات المقاعد الكلية
const totalCapacitySeats = computed(() => {
  return openRounds.value.reduce((sum, r) => sum + (r.capacity || 0), 0);
});

const totalEnrolledCount = computed(() => {
  return openRounds.value.reduce((sum, r) => sum + (r.enrolledTrainees?.length || 0), 0);
});

const totalPendingCount = computed(() => {
  return openRounds.value.reduce((sum, r) => sum + (r.pendingPaymentApplicants?.length || 0), 0);
});

// أعداد تبويبات الحالات
const availableCount = computed(() => {
  return openRounds.value.filter((r) => {
    const enrolled = r.enrolledTrainees?.length || 0;
    const capacity = r.capacity || 25;
    return (enrolled / capacity) < 0.8;
  }).length;
});

const almostFullCount = computed(() => {
  return openRounds.value.filter((r) => {
    const enrolled = r.enrolledTrainees?.length || 0;
    const capacity = r.capacity || 25;
    return (enrolled / capacity) >= 0.8 && enrolled < capacity;
  }).length;
});

const fullCount = computed(() => {
  return openRounds.value.filter((r) => {
    const enrolled = r.enrolledTrainees?.length || 0;
    const capacity = r.capacity || 25;
    return enrolled >= capacity;
  }).length;
});

// تصفية الدورات
const filteredRounds = computed(() => {
  let list = [...openRounds.value];

  // 1. فلتر البحث
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((r) => {
      const matchName = r.courseName?.toLowerCase().includes(q);
      const matchCode = r.roundCode?.toLowerCase().includes(q);
      const matchHall = r.hall?.name?.toLowerCase().includes(q);
      const matchInstructor = r.instructor?.name?.toLowerCase().includes(q);
      return matchName || matchCode || matchHall || matchInstructor;
    });
  }

  // 2. فلتر الكورس
  if (selectedCourse.value) {
    list = list.filter((r) => String(r.courseId) === String(selectedCourse.value));
  }

  // 3. فلتر القاعة
  if (selectedHall.value) {
    list = list.filter((r) => String(r.hall?.id) === String(selectedHall.value));
  }

  // 4. فلتر التبويب (حالة الحجز)
  if (activeTab.value === 'available') {
    list = list.filter((r) => {
      const enrolled = r.enrolledTrainees?.length || 0;
      const capacity = r.capacity || 25;
      return (enrolled / capacity) < 0.8;
    });
  } else if (activeTab.value === 'almostFull') {
    list = list.filter((r) => {
      const enrolled = r.enrolledTrainees?.length || 0;
      const capacity = r.capacity || 25;
      return (enrolled / capacity) >= 0.8 && enrolled < capacity;
    });
  } else if (activeTab.value === 'full') {
    list = list.filter((r) => {
      const enrolled = r.enrolledTrainees?.length || 0;
      const capacity = r.capacity || 25;
      return enrolled >= capacity;
    });
  }

  return list;
});

// تقسيم الصفحات (Pagination)
const paginatedRounds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRounds.value.slice(start, start + itemsPerPage.value);
});

// إعادة الترقيم للصفحة الأولى عند تغيير الفلاتر
watch([searchQuery, activeTab, selectedCourse, selectedHall, itemsPerPage], () => {
  currentPage.value = 1;
});

function clearFilters() {
  searchQuery.value = '';
  activeTab.value = 'all';
  selectedCourse.value = '';
  selectedHall.value = '';
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    showToast('تم تحديث بيانات الدورات المفتوحة للتسجيل ونسب الإشغال بنجاح');
  }, 600);
}

// فتح متابعة التقديم والدارسين
function handleOpenTracking(round) {
  selectedRoundForTracking.value = round;
  isTrackingModalOpen.value = true;
}

// فتح ملف المتدرب
function handleOpenTraineeProfile(item) {
  // تغليف العنصر ليتطابق مع مواصفات TraineeDetailsModal
  selectedTraineeForProfile.value = {
    code: item.applicationCode || `APP-2026-${item.id}`,
    trainee: {
      fullName: item.fullName,
      nationalId: item.nationalId,
      phone: item.phone,
      email: item.email || 'trainee@example.com',
      category: item.category,
      occupation: item.occupation || 'متدرب معتمد',
      address: item.address || 'القاهرة، جمهورية مصر العربية',
      governorate: 'القاهرة',
      nationalIdFrontPhotoPath: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      nationalIdBackPhotoPath: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    },
    courseRound: {
      courseName: selectedRoundForTracking.value?.courseName || 'الدورة التدريبية',
      roundNumber: selectedRoundForTracking.value?.roundNumber || 1,
      hallName: selectedRoundForTracking.value?.hall?.name || '',
      startDate: selectedRoundForTracking.value?.startDate || '',
    },
  };
  isTraineeProfileModalOpen.value = true;
}

// معاينة إيصال السداد لدارس مسدد
function handleOpenReceiptFromTrainee(trainee) {
  selectedReceiptData.value = {
    receiptNumber: trainee.receiptNumber,
    code: trainee.applicationCode || `APP-2026-${trainee.id}`,
    traineeName: trainee.fullName,
    nationalId: trainee.nationalId,
    phone: trainee.phone,
    category: trainee.category,
    courseName: selectedRoundForTracking.value?.courseName || 'الدورة التدريبية',
    roundNumber: selectedRoundForTracking.value?.roundNumber || 1,
    hallName: selectedRoundForTracking.value?.hall?.name || 'قاعة التدريب',
    instructorName: selectedRoundForTracking.value?.instructor?.name || 'المحاضر المسؤول',
    paidAmount: trainee.paidAmount,
    amountInWords: 'فقط وقدره المبلغ المسدد لا غير',
    paymentMethod: 'نقدي (خزينة المعهد)',
    paidAt: trainee.paymentDate || new Date().toISOString(),
    cashierName: 'أحمد محمود مصطفى',
  };
  isReceiptModalOpen.value = true;
}

// فتح مودال سداد الرسوم لمتقدم بانتظار السداد
function handleOpenRecordPayment(applicant) {
  selectedApplicantForAction.value = {
    id: applicant.id,
    code: applicant.applicationCode,
    requiredAmount: applicant.requiredAmount,
    trainee: {
      fullName: applicant.fullName,
      nationalId: applicant.nationalId,
      phone: applicant.phone,
      category: applicant.category,
    },
    courseRound: {
      courseName: selectedRoundForTracking.value?.courseName,
      roundNumber: selectedRoundForTracking.value?.roundNumber,
      hallName: selectedRoundForTracking.value?.hall?.name,
      instructorName: selectedRoundForTracking.value?.instructor?.name,
    },
  };
  isRecordPaymentModalOpen.value = true;
}

// تأكيد سداد الرسوم ونقل المتقدم من قائمة الانتظار إلى قائمة المسددين
function handleConfirmRecordPayment(receiptPayload) {
  isRecordPaymentModalOpen.value = false;

  const targetRound = selectedRoundForTracking.value;
  if (!targetRound) return;

  const applicantId = selectedApplicantForAction.value?.id;
  const applicantIndex = targetRound.pendingPaymentApplicants?.findIndex((p) => p.id === applicantId);

  let removedApplicant = null;
  if (applicantIndex !== -1 && applicantIndex != null) {
    removedApplicant = targetRound.pendingPaymentApplicants.splice(applicantIndex, 1)[0];
  }

  // إضافة المتدرب إلى قائمة المسددين
  const newEnrolled = {
    id: removedApplicant?.id || Date.now(),
    applicationCode: removedApplicant?.applicationCode || receiptPayload.code,
    fullName: removedApplicant?.fullName || receiptPayload.traineeName,
    nationalId: removedApplicant?.nationalId || receiptPayload.nationalId,
    category: removedApplicant?.category || receiptPayload.category,
    phone: removedApplicant?.phone || receiptPayload.phone,
    email: removedApplicant?.email || 'trainee@example.com',
    receiptNumber: receiptPayload.receiptNumber,
    paidAmount: receiptPayload.paidAmount,
    paymentDate: new Date().toISOString(),
    occupation: 'متدرب معتمد',
  };

  if (!targetRound.enrolledTrainees) targetRound.enrolledTrainees = [];
  targetRound.enrolledTrainees.unshift(newEnrolled);

  // فتح إيصال السداد المالي
  selectedReceiptData.value = receiptPayload;
  isReceiptModalOpen.value = true;

  showToast(`تم تأكيد سداد الرسوم بنجاح وقيد المتدرب «${newEnrolled.fullName}» بالدفعة`);
}

// فتح مودال تمديد مهلة السداد
function handleOpenExtendDeadline(applicant) {
  selectedApplicantForAction.value = {
    id: applicant.id,
    code: applicant.applicationCode,
    paymentDueDate: applicant.paymentDueDate,
    trainee: {
      fullName: applicant.fullName,
      nationalId: applicant.nationalId,
      phone: applicant.phone,
      category: applicant.category,
    },
    courseRound: {
      courseName: selectedRoundForTracking.value?.courseName,
      roundNumber: selectedRoundForTracking.value?.roundNumber,
    },
  };
  isExtendDeadlineModalOpen.value = true;
}

// تأكيد تمديد مهلة السداد
function handleConfirmExtendDeadline(payload) {
  isExtendDeadlineModalOpen.value = false;

  const targetRound = selectedRoundForTracking.value;
  if (!targetRound) return;

  const applicant = targetRound.pendingPaymentApplicants?.find((p) => p.id === selectedApplicantForAction.value?.id);
  if (applicant) {
    applicant.paymentDueDate = payload.newDueDate;
    applicant.gracePeriodDaysRemaining = payload.additionalDays || 5;
    showToast(`تم تمديد مهلة السداد للمتقدم «${applicant.fullName}» حتى ${payload.newDueDate}`);
  }
}

// فتح مودال فتح دورة جديدة للتسجيل
function handleOpenNewRound() {
  isNewRoundModalOpen.value = true;
}

// حفظ واعتماد دورة جديدة للتسجيل
function handleSaveNewRound(roundData) {
  isNewRoundModalOpen.value = false;

  const selectedCourseObj = INITIAL_COURSES.find((c) => c.id === roundData.courseId);
  const selectedHallObj = INITIAL_HALLS.find((h) => h.id === roundData.hallId);

  const newRound = {
    id: Date.now(),
    courseId: roundData.courseId,
    courseName: selectedCourseObj?.name || 'دورة تدريبية جديدة',
    roundNumber: roundData.roundNumber || 1,
    roundCode: `RND-${new Date().getFullYear()}-${String(roundData.roundNumber || 1).padStart(3, '0')}`,
    status: 'Available',
    capacity: roundData.capacity || selectedHallObj?.maxCapacity || 25,
    startDate: roundData.startDate,
    endDate: roundData.endDate,
    lastApplicationDate: roundData.lastApplicationDate,
    startTime: roundData.startTime,
    endTime: roundData.endTime,
    lectureDays: roundData.lectureDays || ['Sat', 'Mon', 'Wed'],
    createdAt: new Date().toISOString(),
    instructor: {
      id: roundData.instructorId,
      name: 'د. محاضر معتمد',
      phone: '01000000000',
    },
    hall: {
      id: roundData.hallId,
      name: selectedHallObj?.name || 'قاعة معتمدة',
      type: selectedHallObj?.type || 'Lab',
      maxCapacity: selectedHallObj?.maxCapacity || 25,
    },
    pricings: selectedCourseObj?.pricings || {
      Civilian: 3500,
      MilitaryOfficer: 1750,
      MilitaryFamily: 2100,
      PoliceOfficerOrFamily: 2300,
    },
    enrolledTrainees: [],
    pendingPaymentApplicants: [],
  };

  openRounds.value.unshift(newRound);
  showToast(`تم فتح «${newRound.courseName} - الدفعة ${newRound.roundNumber}» للتسجيل بنجاح`);
}
</script>
