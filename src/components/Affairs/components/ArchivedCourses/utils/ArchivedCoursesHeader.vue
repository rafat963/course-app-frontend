<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
    <!-- العنوان والشارات -->
    <div>
      <div class="flex flex-wrap items-center gap-2.5">
        <h1 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
          الدورات المنعقدة سابقاً
        </h1>

        <!-- شارة إجمالي الدورات المنتهية -->
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {{ totalCount }} دورة منتهية
        </span>

        <!-- شارة الخريجين المعتمدين -->
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1">
          <GraduationCap class="w-3.5 h-3.5" />
          <span>{{ totalGraduates }} خريجاً معتمداً</span>
        </span>
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        شؤون الدارسين • أرشيف وسجلات الدفعات المنتهية، بيانات المحاضرين، كشوف الخريجين، والإيرادات والتكاليف المحصلة
      </p>
    </div>

    <!-- أزرار الإجراءات -->
    <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
      <!-- زر تحديث -->
      <button
        type="button"
        class="h-9.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
        :disabled="isRefreshing"
        title="تحديث الأرشيف"
        @click="$emit('refresh')"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
        <span class="hidden sm:inline">تحديث</span>
      </button>

      <!-- زر طباعة تقرير الأرشيف -->
      <button
        type="button"
        class="h-9.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
        @click="$emit('print-archive')"
      >
        <Printer class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span>طباعة تقرير الأرشيف</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { RefreshCw, Printer, GraduationCap } from 'lucide-vue-next';

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  totalGraduates: {
    type: Number,
    default: 0,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['refresh', 'print-archive']);
</script>
