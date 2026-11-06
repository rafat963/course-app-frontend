<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3.5">
    <!-- الصف العلوي: تبويبات حالة المقاعد + محول طريقة العرض -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
      <!-- تبويبات حالة الحجز -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          v-for="tab in occupancyTabs"
          :key="tab.id"
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0"
          :class="
            activeTab === tab.id
              ? 'bg-primary-600 text-white shadow-2xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/80'
          "
          @click="$emit('update:activeTab', tab.id)"
        >
          <span>{{ tab.label }}</span>
          <span
            class="px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold"
            :class="
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            "
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- محول العرض: كروت أو جدول -->
      <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto shrink-0">
        <button
          type="button"
          class="h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          :class="
            viewMode === 'grid'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-2xs'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          "
          title="عرض كروت"
          @click="$emit('update:viewMode', 'grid')"
        >
          <LayoutGrid class="w-3.5 h-3.5" />
          <span class="hidden md:inline">كروت</span>
        </button>
        <button
          type="button"
          class="h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          :class="
            viewMode === 'table'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-2xs'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          "
          title="عرض جدول"
          @click="$emit('update:viewMode', 'table')"
        >
          <TableProperties class="w-3.5 h-3.5" />
          <span class="hidden md:inline">جدول</span>
        </button>
      </div>
    </div>

    <!-- الصف السفلي: حقل البحث + دروبداون الكورس والقاعة + زر إعادة الضبط -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
      <!-- حقل البحث -->
      <div class="lg:col-span-5 relative">
        <input
          :value="searchQuery"
          type="text"
          placeholder="ابحث باسم الدورة، كود الدفعة، المحاضر، أو القاعة..."
          class="w-full h-10 pr-9 pl-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
        <Search class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <button
          v-if="searchQuery"
          type="button"
          class="w-5 h-5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 flex items-center justify-center absolute left-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
          @click="$emit('update:searchQuery', '')"
        >
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- دروبداون تصفية الكورس (PrimeVue Select) -->
      <div class="lg:col-span-3">
        <Select
          :model-value="selectedCourse"
          :options="courseOptions"
          option-label="name"
          option-value="id"
          placeholder="جميع الكورسات التدريبية"
          :show-clear="true"
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
          @update:model-value="$emit('update:selectedCourse', $event)"
        />
      </div>

      <!-- دروبداون تصفية القاعة (PrimeVue Select) -->
      <div class="lg:col-span-3">
        <Select
          :model-value="selectedHall"
          :options="hallOptions"
          option-label="name"
          option-value="id"
          placeholder="جميع القاعات والمعامل"
          :show-clear="true"
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
          @update:model-value="$emit('update:selectedHall', $event)"
        />
      </div>

      <!-- زر مسح الفلاتر -->
      <div class="lg:col-span-1 flex justify-end">
        <button
          v-if="hasActiveFilters"
          type="button"
          class="h-10 px-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full"
          title="إلغاء جميع الفلاتر"
          @click="$emit('clear-filters')"
        >
          <RotateCcw class="w-3.5 h-3.5 shrink-0" />
          <span class="lg:hidden text-xs">إعادة ضبط</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Select from 'primevue/select';
import {
  Search,
  X,
  RotateCcw,
  LayoutGrid,
  TableProperties,
} from 'lucide-vue-next';

const props = defineProps({
  viewMode: {
    type: String,
    default: 'grid',
  },
  searchQuery: {
    type: String,
    default: '',
  },
  activeTab: {
    type: String,
    default: 'all',
  },
  selectedCourse: {
    type: [String, Number],
    default: '',
  },
  selectedHall: {
    type: [String, Number],
    default: '',
  },
  courseOptions: {
    type: Array,
    default: () => [],
  },
  hallOptions: {
    type: Array,
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  availableCount: {
    type: Number,
    default: 0,
  },
  almostFullCount: {
    type: Number,
    default: 0,
  },
  fullCount: {
    type: Number,
    default: 0,
  },
});

defineEmits([
  'update:viewMode',
  'update:searchQuery',
  'update:activeTab',
  'update:selectedCourse',
  'update:selectedHall',
  'clear-filters',
]);

const occupancyTabs = computed(() => [
  { id: 'all', label: 'الكل', count: props.totalCount },
  { id: 'available', label: 'متاحة للتسجيل', count: props.availableCount },
  { id: 'almostFull', label: 'قاربت على الاكتمال', count: props.almostFullCount },
  { id: 'full', label: 'مكتملة المقاعد', count: props.fullCount },
]);

const hasActiveFilters = computed(() => {
  return (
    Boolean(props.searchQuery) ||
    props.activeTab !== 'all' ||
    Boolean(props.selectedCourse) ||
    Boolean(props.selectedHall)
  );
});
</script>
