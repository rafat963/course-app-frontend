<template>
  <div class="space-y-2.5 sm:space-y-3">
    <!-- 1. شريط تبويبات الحالة بالكتالوج ومحول طريقة العرض -->
    <div class="p-1.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
      <!-- التبويبات مع سكرول أفقي ناعم على الموبايل والتابلت -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl overflow-x-auto custom-scrollbar max-w-full">
        <!-- تبويب الكل -->
        <button
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            statusFilter === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          "
          @click="$emit('update:statusFilter', 'all')"
        >
          <span>كافة دورات الكتالوج</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusFilter === 'all' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ totalCount }}
          </span>
        </button>

        <!-- تبويب نشطة -->
        <button
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            statusFilter === 'active'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
          "
          @click="$emit('update:statusFilter', 'active')"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span>دورات نشطة ومتاحة</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusFilter === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ activeCount }}
          </span>
        </button>

        <!-- تبويب معطلة -->
        <button
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            statusFilter === 'inactive'
              ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          "
          @click="$emit('update:statusFilter', 'inactive')"
        >
          <span class="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
          <span>دورات معطلة مؤقتاً</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusFilter === 'inactive' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ totalCount - activeCount }}
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
          الدورات المعروضة: <strong class="text-slate-800 dark:text-slate-200">{{ filteredCount }}</strong>
        </div>
      </div>
    </div>

    <!-- 2. شريط البحث الفوري -->
    <div class="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col sm:flex-row gap-2.5">
      <!-- حقل البحث بالاسم والتوصيف -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          :value="searchQuery"
          type="text"
          placeholder="ابحث باسم الدورة، اسم المحاضر المسؤول، أو التوصيف والمحتوى الأكاديمي..."
          class="w-full h-9.5 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
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

      <!-- زر تفريغ البحث عند وجود نص -->
      <button
        v-if="searchQuery"
        type="button"
        class="h-9.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        @click="$emit('clear-filters')"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>تفريغ الفلتر</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Search, X, RotateCcw } from 'lucide-vue-next';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';

defineProps({
  viewMode: {
    type: String,
    default: 'table',
  },
  searchQuery: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  activeCount: {
    type: Number,
    default: 0,
  },
  filteredCount: {
    type: Number,
    default: 0,
  },
});

defineEmits(['update:viewMode', 'update:searchQuery', 'update:statusFilter', 'clear-filters']);
</script>
