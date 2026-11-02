<template>
  <div class="space-y-4 select-none pb-6">
    <!-- أ. في حال فتح تفاصيل الحركة: يفتح كمبوننت تفاصيل وسجل المتدرب الكامل ويكون محدداً على سجل حركات مسح البوابة -->
    <TraineeProfileView
      v-if="selectedTraineeForProfile"
      :trainee="selectedTraineeForProfile"
      :trainee-id="selectedTraineeForProfile.id"
      :initial-tab="'gate_logs'"
      from-path="/affairs/gate-attendance/today"
      @back="selectedTraineeForProfile = null"
    />

    <!-- ب. العرض الافتراضي: جدول حضور البوابة لليوم -->
    <template v-else>
      <!-- 1. ترويسة الصفحة مع عداد الحركات وزر التحديث وتاريخ اليوم -->
      <GateAttendanceHeader
        :total-count="logs.length"
        :is-refreshing="isRefreshing"
        @refresh="handleRefresh"
      />

      <!-- 2. بطاقات الإحصائيات الأربعة المتناسقة مع ديزاين النظام -->
      <GateAttendanceStats
        :total-count="totalCount"
        :allowed-count="allowedCount"
        :denied-count="deniedCount"
        :adherence-rate="adherenceRate"
      />

      <!-- 3. شريط تبويبات القرار الأمني وفلاتر الدورة والبوابة والبحث ومحول العرض -->
      <GateAttendanceFilters
        v-model:view-mode="viewMode"
        v-model:decision-filter="decisionFilter"
        v-model:search-query="searchQuery"
        v-model:selected-course="selectedCourse"
        v-model:selected-gate="selectedGate"
        :course-options="courseOptions"
        :gate-options="gateOptions"
        :total-count="totalCount"
        :allowed-count="allowedCount"
        :denied-count="deniedCount"
        :filtered-count="filteredLogs.length"
        @clear-filters="clearFilters"
      />

      <!-- 4. عرض البيانات: جدول أو كروت حسب طريقة العرض -->
      <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
        <!-- جدول الحركات المعتمد على AppTable -->
        <GateAttendanceTable
          :logs="paginatedLogs"
          :is-filtered="hasActiveFilters"
          @open-details="openDetails"
          @clear-filters="clearFilters"
        />

        <!-- شريط الباجينيشن العام AppPagination -->
        <AppPagination
          v-if="filteredLogs.length > 0"
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredLogs.length"
          :per-page-options="perPageOptions"
          item-label="حركة مسح"
        />
      </div>

      <!-- شبكة الكروت في حال اختيار viewMode === 'grid' -->
      <div v-else class="space-y-4">
        <GateAttendanceCardsGrid
          :logs="paginatedLogs"
          :is-filtered="hasActiveFilters"
          @open-details="openDetails"
          @clear-filters="clearFilters"
        />

        <!-- شريط الباجينيشن لشبكة الكروت -->
        <div v-if="filteredLogs.length > 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
          <AppPagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="filteredLogs.length"
            :per-page-options="perPageOptions"
            item-label="حركة مسح"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import GateAttendanceHeader from './utils/GateAttendanceHeader.vue';
import GateAttendanceStats from './utils/GateAttendanceStats.vue';
import GateAttendanceFilters from './utils/GateAttendanceFilters.vue';
import GateAttendanceTable from './utils/GateAttendanceTable.vue';
import GateAttendanceCardsGrid from './utils/GateAttendanceCardsGrid.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import TraineeProfileView from '@/shared/components/TraineeProfile/TraineeProfileView.vue';
import { MOCK_TRAINEES } from '@/shared/components/TraineeProfile/helpers/traineeProfileMockData';
import { INITIAL_GATE_LOGS } from './helpers/gateAttendanceMockData';

// --- نمط العرض (جدول أو كروت) ---
const viewMode = ref(typeof window !== 'undefined' && window.innerWidth < 1024 ? 'grid' : 'table');

// --- الحالة الأساسية للبيانات ---
const logs = ref([...INITIAL_GATE_LOGS]);
const isRefreshing = ref(false);

// --- الفلاتر والبحث ---
const decisionFilter = ref('all'); // 'all' | 'Allowed' | 'Denied'
const searchQuery = ref('');
const selectedCourse = ref(null);
const selectedGate = ref(null);

// --- الترقيم (Pagination) ---
const currentPage = ref(1);
const itemsPerPage = ref(5);
const perPageOptions = [
  { label: '5 حركات', value: 5 },
  { label: '10 حركات', value: 10 },
  { label: '20 حركة', value: 20 },
  { label: '50 حركة', value: 50 },
];

// --- المتدرب المختار لعرض ملفه وسجل حركات البوابة ---
const selectedTraineeForProfile = ref(null);

// --- الحسابات الإحصائية (KPIs) ---
const totalCount = computed(() => logs.value.length);
const allowedCount = computed(() => logs.value.filter((l) => l.decision === 'Allowed').length);
const deniedCount = computed(() => logs.value.filter((l) => l.decision === 'Denied').length);
const adherenceRate = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((allowedCount.value / totalCount.value) * 100);
});

// --- خيارات القوائم المنسدلة ---
const courseOptions = computed(() => {
  const map = new Map();
  logs.value.forEach((l) => {
    if (l.courseRound?.courseName) {
      map.set(l.courseRound.courseName, l.courseRound.courseName);
    }
  });
  return Array.from(map.values()).map((name) => ({ label: name, value: name }));
});

const gateOptions = computed(() => {
  const map = new Map();
  logs.value.forEach((l) => {
    if (l.officer?.gateName) {
      map.set(l.officer.gateName, l.officer.gateName);
    }
  });
  return Array.from(map.values()).map((gate) => ({ label: gate, value: gate }));
});

const hasActiveFilters = computed(() => {
  return (
    Boolean(searchQuery.value) ||
    selectedCourse.value !== null ||
    selectedGate.value !== null ||
    decisionFilter.value !== 'all'
  );
});

// --- تصفية السجلات ---
const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    // 1. فلتر قرار الدخول
    if (decisionFilter.value !== 'all' && log.decision !== decisionFilter.value) {
      return false;
    }

    // 2. فلتر الدورة
    if (selectedCourse.value && log.courseRound?.courseName !== selectedCourse.value) {
      return false;
    }

    // 3. فلتر البوابة
    if (selectedGate.value && log.officer?.gateName !== selectedGate.value) {
      return false;
    }

    // 4. البحث النصي
    if (searchQuery.value) {
      const q = searchQuery.value.trim().toLowerCase();
      const name = log.trainee?.fullName?.toLowerCase() || '';
      const nid = log.trainee?.nationalId || '';
      const phone = log.trainee?.phone || '';
      const qr = log.qrToken?.toLowerCase() || '';
      const course = log.courseRound?.courseName?.toLowerCase() || '';
      const officer = log.officer?.name?.toLowerCase() || '';
      const reason = log.reason?.toLowerCase() || '';

      if (
        !name.includes(q) &&
        !nid.includes(q) &&
        !phone.includes(q) &&
        !qr.includes(q) &&
        !course.includes(q) &&
        !officer.includes(q) &&
        !reason.includes(q)
      ) {
        return false;
      }
    }

    return true;
  });
});

// --- السجلات المعروضة في الصفحة الحالية ---
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredLogs.value.slice(start, start + itemsPerPage.value);
});

// إعادة الصفحة الأولى تلقائياً عند تغيير أي فلتر
watch(
  [decisionFilter, searchQuery, selectedCourse, selectedGate, itemsPerPage],
  () => {
    currentPage.value = 1;
  }
);

// --- الإجراءات والدوال ---
function clearFilters() {
  decisionFilter.value = 'all';
  searchQuery.value = '';
  selectedCourse.value = null;
  selectedGate.value = null;
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    logs.value = [...INITIAL_GATE_LOGS];
    isRefreshing.value = false;
  }, 450);
}

// فتح كمبوننت تفاصيل وسجل المتدرب مع تحديد تبويب سجل حركات مسح البوابة
function openDetails(log) {
  // 1. البحث عن المتدرب المطابق في قاعدة بيانات المتدربين (بالرقم القومي أو الاسم أو المعرف)
  const found = MOCK_TRAINEES.find(
    (t) =>
      (log.trainee?.nationalId && t.nationalId === log.trainee.nationalId) ||
      (log.trainee?.fullName && t.fullName === log.trainee.fullName) ||
      t.id === log.trainee?.id
  );

  let targetTrainee = null;
  if (found) {
    targetTrainee = JSON.parse(JSON.stringify(found));
  } else {
    // إنشاء كائن متدرب متوافق مع كافة أقسام الشاشة إذا لم يكن مسجلاً في Mock المتدربين
    targetTrainee = {
      ...MOCK_TRAINEES[0],
      id: log.trainee?.id || Date.now(),
      fullName: log.trainee?.fullName || 'دارس بالمنظومة',
      nationalId: log.trainee?.nationalId || '—',
      phone: log.trainee?.phone || '—',
      email: log.trainee?.email || '—',
      category: log.trainee?.category || 'Civilian',
      profilePhotoPath: log.trainee?.profilePhotoPath || null,
      currentCourses: [
        {
          id: log.courseRound?.id || 101,
          courseName: log.courseRound?.courseName || 'الدورة التدريبية',
          roundNumber: log.courseRound?.roundNumber || 1,
          hallName: log.courseRound?.hallName || 'قاعة التدريب',
          instructorName: log.courseRound?.instructorName || 'المحاضر المسؤول',
          status: 'Ongoing',
          timeRange: log.courseRound?.timeRange || '09:00 ص - 01:00 م',
          attendanceRate: log.academicStanding?.attendanceRate || 85,
          qrToken: log.qrToken || 'QR-PASS',
        },
      ],
      pastCourses: [],
      gateLogs: [],
    };
  }

  // 2. تجميع كل حركات هذا المتدرب من جدول حضور اليوم لإضافتها في سجل البوابة
  const todayScansForThisTrainee = logs.value
    .filter(
      (l) =>
        (log.trainee?.nationalId && l.trainee?.nationalId === log.trainee.nationalId) ||
        (log.trainee?.fullName && l.trainee?.fullName === log.trainee.fullName) ||
        l.id === log.id
    )
    .map((l) => ({
      id: l.id,
      scannedAt: l.scannedAt,
      gateName: l.officer?.gateName || 'البوابة الرئيسية 1',
      officerName: l.officer?.name || 'فرد أمن البوابة',
      courseName: l.courseRound?.courseName || 'الدورة التدريبية',
      decision: l.decision || 'Allowed',
      reason: l.reason || 'مصرح بالدخول',
    }));

  // دمج الحركات السابقة وحركات اليوم بدون تكرار
  const existingLogs = (targetTrainee.gateLogs || []).filter(
    (g) => !todayScansForThisTrainee.some((ts) => ts.id === g.id)
  );
  targetTrainee.gateLogs = [...todayScansForThisTrainee, ...existingLogs];

  selectedTraineeForProfile.value = targetTrainee;
}
</script>
