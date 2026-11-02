<template>
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
    <!-- العنوان وعداد الدورات -->
    <div>
      <div class="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        <h1 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
          كل الدورات
        </h1>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/80">
          {{ totalCount }} دورة بالكتالوج
        </span>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{{ activeCount }} نشطة ومتاحة</span>
        </span>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        شؤون الدارسين • كتالوج ودليل الدورات التدريبية المعتمدة بالمعهد، التوصيف الأكاديمي، وتسعير الفئات
      </p>
    </div>

    <!-- أزرار الإجراءات: متناسقة ومتجاوبة 100% على الموبايل والتابلت والديسكتوب -->
    <div class="flex items-center gap-2 w-full lg:w-auto">
      <!-- زر تحديث -->
      <button
        type="button"
        class="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
        :disabled="isRefreshing"
        title="تحديث قائمة الدورات"
        @click="$emit('refresh')"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
        <span class="hidden sm:inline">تحديث</span>
      </button>

      <!-- زر فتح دورة انعقاد جديدة (دفعة تشغيلية) -->
      <button
        type="button"
        class="flex-1 lg:flex-initial h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
        title="جدولة وفتح دورة انعقاد جديدة من أي كورس"
        @click="$emit('open-create-round')"
      >
        <CalendarPlus class="w-4 h-4 stroke-[2.2] shrink-0" />
        <span class="truncate">فتح دورة انعقاد (دفعة)</span>
      </button>

      <!-- زر إضافة دورة جديدة للكتالوج -->
      <button
        type="button"
        class="flex-1 lg:flex-initial h-9 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
        @click="$emit('open-create')"
      >
        <Plus class="w-4 h-4 stroke-[2.5] shrink-0" />
        <span class="truncate">إضافة دورة للكتالوج</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Plus, RefreshCw, CalendarPlus } from 'lucide-vue-next';

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  activeCount: {
    type: Number,
    default: 0,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['refresh', 'open-create', 'open-create-round']);
</script>
