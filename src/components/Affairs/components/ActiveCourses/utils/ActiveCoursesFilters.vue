<template>
  <div class="space-y-2.5 sm:space-y-3 select-none">
    <!-- 1. شريط تبويبات الحالة ومحول طريقة العرض -->
    <div class="p-1.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
      <!-- أزرار الفلترة السريعة (Segmented Tabs) مع سكرول ناعم -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl overflow-x-auto custom-scrollbar max-w-full">
        <!-- تبويب الكل -->
        <button
          type="button"
          class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          "
          @click="selectTab('all')"
        >
          <span>كافة الدورات المنعقدة</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="
              activeTab === 'all'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
            "
          >
            {{ totalCount }}
          </span>
        </button>

        <!-- تبويب جارية اليوم -->
        <button
          type="button"
          class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            activeTab === 'ongoing'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
          "
          @click="selectTab('ongoing')"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
          <span>جارية حالياً</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="
              activeTab === 'ongoing'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
            "
          >
            {{ ongoingCount }}
          </span>
        </button>

        <!-- تبويب شارفت على الانتهاء -->
        <button
          type="button"
          class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            activeTab === 'finishingSoon'
              ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
          "
          @click="selectTab('finishingSoon')"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
          <span>شارفت على الانتهاء</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="
              activeTab === 'finishingSoon'
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
            "
          >
            {{ finishingSoonCount }}
          </span>
        </button>

        <!-- تبويب انتهت حديثاً -->
        <button
          type="button"
          class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            activeTab === 'ended'
              ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          "
          @click="selectTab('ended')"
        >
          <span class="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
          <span>انتهت حديثاً</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="
              activeTab === 'ended'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
            "
          >
            {{ endedCount }}
          </span>
        </button>
      </div>

      <!-- محول طريقة العرض وعداد النتائج -->
      <div class="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto px-1 md:px-0 shrink-0">
        <ViewModeToggle
          :model-value="viewMode"
          @update:model-value="$emit('update:viewMode', $event)"
        />
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          المعروض: <strong class="text-slate-800 dark:text-slate-200">{{ filteredCount }}</strong> من أصل {{ totalCount }}
        </div>
      </div>
    </div>

    <!-- 2. شريط البحث والفلترة التفصيلية -->
    <div class="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col sm:flex-row gap-2.5">
      <!-- حقل البحث النصي الفوري -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          :value="searchQuery"
          type="text"
          placeholder="ابحث باسم الدورة، المحاضر، أو القاعة..."
          class="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          @click="$emit('update:searchQuery', '')"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- فلتر القاعة -->
      <div class="w-full sm:w-56">
        <Select
          :model-value="selectedHall"
          :options="hallOptions"
          option-label="label"
          option-value="value"
          placeholder="جميع القاعات والمعامل"
          show-clear
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
          @update:model-value="$emit('update:selectedHall', $event)"
        />
      </div>

      <!-- فلتر المحاضر -->
      <div class="w-full sm:w-56">
        <Select
          :model-value="selectedInstructor"
          :options="instructorOptions"
          option-label="label"
          option-value="value"
          placeholder="جميع المحاضرين"
          show-clear
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
          @update:model-value="$emit('update:selectedInstructor', $event)"
        />
      </div>

      <!-- زر مسح الفلاتر إذا وُجد فلتر نشط -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="h-10 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        title="مسح جميع الفلاتر والبحث"
        @click="$emit('clear-filters')"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>مسح التصفية</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Select from 'primevue/select';
import { Search, X, RotateCcw } from 'lucide-vue-next';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';

const props = defineProps({
  viewMode: {
    type: String,
    default: 'table',
  },
  searchQuery: {
    type: String,
    default: '',
  },
  activeTab: {
    type: String,
    default: 'all',
  },
  selectedHall: {
    type: String,
    default: null,
  },
  selectedInstructor: {
    type: String,
    default: null,
  },
  hallOptions: {
    type: Array,
    default: () => [],
  },
  instructorOptions: {
    type: Array,
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  ongoingCount: {
    type: Number,
    default: 0,
  },
  finishingSoonCount: {
    type: Number,
    default: 0,
  },
  endedCount: {
    type: Number,
    default: 0,
  },
  filteredCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  'update:viewMode',
  'update:searchQuery',
  'update:activeTab',
  'update:selectedHall',
  'update:selectedInstructor',
  'clear-filters',
]);

const hasActiveFilters = computed(() => {
  return (
    Boolean(props.searchQuery) ||
    props.activeTab !== 'all' ||
    props.selectedHall !== null ||
    props.selectedInstructor !== null
  );
});

function selectTab(key) {
  emit('update:activeTab', key);
}
</script>
