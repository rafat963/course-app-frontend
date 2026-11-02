<template>
  <div class="space-y-4 select-none pb-8">
    <!-- أ. في حال فتح تفاصيل وسجل المحاضر: يفتح في Component كامل ومستقل وليس Modal -->
    <InstructorDetailsView
      v-if="selectedInstructorForDetails"
      :instructor="selectedInstructorForDetails"
      @back="selectedInstructorForDetails = null"
      @open-edit="handleOpenEdit"
    />

    <!-- ب. في الحالة الافتراضية: عرض دليل المحاضرين الكامل -->
    <template v-else>
      <!-- 1. ترويسة الصفحة مع إحصائيات الدليل وأزرار الإضافة والطباعة والتحديث -->
      <InstructorsHeader
        :total-count="totalInstructors"
        :active-count="activeInstructors"
        :is-refreshing="isRefreshing"
        @refresh="handleRefresh"
        @print-directory="handlePrintDirectory"
        @open-create="handleOpenCreate"
      />

      <!-- 2. بطاقات الإحصائيات الأربعة (KPIs) المتناسقة مع نظام التصميم الموحد -->
      <InstructorsStats
        :total-instructors="totalInstructors"
        :active-instructors="activeInstructors"
        :teaching-now-count="teachingNowCount"
        :total-rounds-assigned="totalRoundsAssigned"
      />

      <!-- 3. شريط التبويبات والبحث ومحدد التخصص ومحول طريقة العرض (جدول / كروت) -->
      <InstructorsFilters
        v-model:search-query="searchQuery"
        v-model:active-tab="activeTab"
        v-model:selected-specialty="selectedSpecialty"
        v-model:view-mode="viewMode"
        :specialty-options="specialtyOptions"
        :total-count="totalInstructors"
        :active-count="activeInstructors"
        :teaching-count="teachingNowCount"
        :inactive-count="inactiveInstructors"
        :filtered-count="filteredInstructors.length"
        @clear-filters="clearFilters"
      />

      <!-- 4. عرض البيانات: جدول بيانات مفصل (Table View) -->
      <div
        v-if="viewMode === 'table'"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
      >
        <InstructorsTable
          :instructors="paginatedInstructors"
          :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedSpecialty)"
          @open-details="handleOpenDetails"
          @open-edit="handleOpenEdit"
          @open-delete="handleOpenDelete"
          @clear-filters="clearFilters"
        />

        <!-- شريط الترقيم المشترك AppPagination -->
        <AppPagination
          v-if="filteredInstructors.length > 0"
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredInstructors.length"
          :per-page-options="perPageOptions"
          item-label="محاضراً"
        />
      </div>

      <!-- 5. عرض البيانات: شبكة بطاقات احترافية (Cards Grid View) -->
      <div v-else class="space-y-4">
        <InstructorsCardsGrid
          :instructors="paginatedInstructors"
          :is-filtered="Boolean(searchQuery || activeTab !== 'all' || selectedSpecialty)"
          @open-details="handleOpenDetails"
          @open-edit="handleOpenEdit"
          @open-delete="handleOpenDelete"
          @clear-filters="clearFilters"
        />

        <!-- شريط الترقيم المشترك AppPagination في وضع الكروت -->
        <div
          v-if="filteredInstructors.length > 0"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs"
        >
          <AppPagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="filteredInstructors.length"
            :per-page-options="perPageOptions"
            item-label="محاضراً"
          />
        </div>
      </div>
    </template>

    <!-- 6. نافذة إضافة وتعديل بيانات المحاضر (InstructorFormModal) -->
    <InstructorFormModal
      :is-open="isFormModalOpen"
      :instructor="selectedInstructorForEdit"
      @close="isFormModalOpen = false"
      @save="handleSaveInstructor"
    />

    <!-- 7. نافذة تأكيد الحذف أو التعطيل لحماية العلاقات وفق ERD (InstructorDeleteModal) -->
    <InstructorDeleteModal
      :is-open="isDeleteModalOpen"
      :instructor="selectedInstructorForDelete"
      @close="isDeleteModalOpen = false"
      @confirm-delete="handleConfirmDelete"
      @deactivate="handleDeactivateInstructor"
    />

    <!-- 8. إشعار التنبيه العائم (Toast Notification) -->
    <Transition name="fade">
      <div
        v-if="feedbackMessage.text"
        class="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border select-none transition-all"
        :class="
          feedbackMessage.type === 'error'
            ? 'bg-rose-600 text-white border-rose-700'
            : feedbackMessage.type === 'info'
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-emerald-600 text-white border-emerald-700'
        "
      >
        <CheckCircle2 v-if="feedbackMessage.type === 'success'" class="w-4 h-4 shrink-0" />
        <Info v-else-if="feedbackMessage.type === 'info'" class="w-4 h-4 shrink-0" />
        <AlertCircle v-else class="w-4 h-4 shrink-0" />
        <span>{{ feedbackMessage.text }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { CheckCircle2, Info, AlertCircle } from 'lucide-vue-next';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';

// استيراد المساعدات والبيانات
import { INITIAL_INSTRUCTORS_DATA } from './helpers/instructorsMockData';
import {
  PER_PAGE_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from './helpers/instructorsConstants';

// استيراد المكونات الفرعية
import InstructorsHeader from './utils/InstructorsHeader.vue';
import InstructorsStats from './utils/InstructorsStats.vue';
import InstructorsFilters from './utils/InstructorsFilters.vue';
import InstructorsTable from './utils/InstructorsTable.vue';
import InstructorsCardsGrid from './utils/InstructorsCardsGrid.vue';
import InstructorFormModal from './utils/InstructorFormModal.vue';
import InstructorDeleteModal from './utils/InstructorDeleteModal.vue';
import InstructorDetailsView from './utils/InstructorDetailsView.vue';

// --- إدارة البيانات وحفظها محلياً ---
const STORAGE_KEY = 'affairs_instructors_records_v1';

function loadStoredInstructors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored instructors:', err);
  }
  return [...INITIAL_INSTRUCTORS_DATA];
}

const instructors = ref(loadStoredInstructors());

function saveInstructors() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructors.value));
  } catch (err) {
    console.error('Failed to save instructors:', err);
  }
}

// --- حالة الواجهة والتحميل ---
const isRefreshing = ref(false);
const viewMode = ref(typeof window !== 'undefined' && window.innerWidth < 1024 ? 'grid' : 'table'); // 'table' | 'grid'

// --- الفلاتر والبحث ---
const searchQuery = ref('');
const activeTab = ref('all'); // 'all' | 'active' | 'teaching' | 'inactive'
const selectedSpecialty = ref(null);

// --- الترقيم Pagination ---
const currentPage = ref(1);
const itemsPerPage = ref(DEFAULT_PAGE_SIZE);
const perPageOptions = PER_PAGE_OPTIONS;

// --- إدارة المودالات والمكونات ---
const isFormModalOpen = ref(false);
const selectedInstructorForEdit = ref(null);

// المحاضر المختار لعرض تفاصيله وسجله في component
const selectedInstructorForDetails = ref(null);

const isDeleteModalOpen = ref(false);
const selectedInstructorForDelete = ref(null);

// --- رسائل التأكيد والإشعارات (Toast) ---
const feedbackMessage = ref({ type: 'success', text: '' });
let feedbackTimer = null;

function showToast(text, type = 'success') {
  feedbackMessage.value = { type, text };
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedbackMessage.value = { type, text: '' };
  }, 4000);
}

// --- الحسابات الإحصائية (KPIs) ---
const totalInstructors = computed(() => instructors.value.length);

const activeInstructors = computed(() => {
  return instructors.value.filter((i) => i.isActive).length;
});

const inactiveInstructors = computed(() => {
  return instructors.value.filter((i) => !i.isActive).length;
});

const teachingNowCount = computed(() => {
  return instructors.value.filter((i) =>
    (i.roundsTaught || []).some((r) => r.status === 'Ongoing'),
  ).length;
});

const totalRoundsAssigned = computed(() => {
  return instructors.value.reduce((sum, i) => sum + (i.roundsTaught?.length || 0), 0);
});

// --- قائمة التخصصات للفلترة ---
const specialtyOptions = computed(() => {
  const set = new Set();
  instructors.value.forEach((i) => {
    if (i.specialty) set.add(i.specialty);
  });
  return Array.from(set).map((spec) => ({ label: spec, value: spec }));
});

// --- تصفية المحاضرين ---
const filteredInstructors = computed(() => {
  return instructors.value.filter((instructor) => {
    // 1. فلتر التبويب
    if (activeTab.value === 'active' && !instructor.isActive) {
      return false;
    }
    if (activeTab.value === 'inactive' && instructor.isActive) {
      return false;
    }
    if (activeTab.value === 'teaching') {
      const isTeaching = (instructor.roundsTaught || []).some((r) => r.status === 'Ongoing');
      if (!isTeaching) return false;
    }

    // 2. فلتر التخصص
    if (selectedSpecialty.value && instructor.specialty !== selectedSpecialty.value) {
      return false;
    }

    // 3. البحث النصي
    if (searchQuery.value) {
      const q = searchQuery.value.trim().toLowerCase();
      const name = (instructor.name || '').toLowerCase();
      const spec = (instructor.specialty || '').toLowerCase();
      const phone = (instructor.phone || '');
      const email = (instructor.email || '').toLowerCase();

      if (!name.includes(q) && !spec.includes(q) && !phone.includes(q) && !email.includes(q)) {
        return false;
      }
    }

    return true;
  });
});

// إعادة الترقيم للصفحة 1 عند تغيير أي فلتر
watch([searchQuery, activeTab, selectedSpecialty, itemsPerPage], () => {
  currentPage.value = 1;
});

// --- تقسيم الصفحات Pagination ---
const paginatedInstructors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredInstructors.value.slice(start, start + itemsPerPage.value);
});

// --- الإجراءات والعمليات ---
function clearFilters() {
  searchQuery.value = '';
  activeTab.value = 'all';
  selectedSpecialty.value = null;
  currentPage.value = 1;
}

function handleRefresh() {
  isRefreshing.value = true;
  setTimeout(() => {
    instructors.value = loadStoredInstructors();
    isRefreshing.value = false;
    showToast('تم تحديث بيانات دليل المحاضرين بنجاح', 'info');
  }, 500);
}

function handlePrintDirectory() {
  window.print();
}

function handleOpenCreate() {
  selectedInstructorForEdit.value = null;
  isFormModalOpen.value = true;
}

function handleOpenEdit(instructor) {
  selectedInstructorForEdit.value = { ...instructor };
  isFormModalOpen.value = true;
}

function handleOpenDetails(instructor) {
  selectedInstructorForDetails.value = instructor;
}

function handleOpenDelete(instructor) {
  selectedInstructorForDelete.value = instructor;
  isDeleteModalOpen.value = true;
}

function handleSaveInstructor(payload) {
  const index = instructors.value.findIndex((i) => i.id === payload.id);
  if (index !== -1) {
    // تعديل
    instructors.value[index] = {
      ...instructors.value[index],
      ...payload,
    };
    // إذا كان المكون الحالي يعرض هذا المحاضر، حدّثه أيضاً
    if (selectedInstructorForDetails.value?.id === payload.id) {
      selectedInstructorForDetails.value = {
        ...selectedInstructorForDetails.value,
        ...payload,
      };
    }
    showToast(`تم تحديث بيانات المحاضر "${payload.name}" بنجاح`, 'success');
  } else {
    // إضافة جديد
    instructors.value.unshift(payload);
    showToast(`تمت إضافة المحاضر الجديد "${payload.name}" بنجاح`, 'success');
  }
  saveInstructors();
}

function handleConfirmDelete(instructorId) {
  const target = instructors.value.find((i) => i.id === instructorId);
  const name = target ? target.name : '';
  instructors.value = instructors.value.filter((i) => i.id !== instructorId);
  if (selectedInstructorForDetails.value?.id === instructorId) {
    selectedInstructorForDetails.value = null;
  }
  saveInstructors();
  showToast(`تم حذف المحاضر "${name}" من المنظومة`, 'error');
}

function handleDeactivateInstructor(instructorId) {
  const target = instructors.value.find((i) => i.id === instructorId);
  if (target) {
    target.isActive = false;
    if (selectedInstructorForDetails.value?.id === instructorId) {
      selectedInstructorForDetails.value.isActive = false;
    }
    saveInstructors();
    showToast(`تم تعطيل المحاضر "${target.name}" بنجاح بدلاً من الحذف`, 'info');
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
