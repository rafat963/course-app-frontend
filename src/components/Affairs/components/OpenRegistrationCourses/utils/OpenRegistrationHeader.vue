<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
    <!-- معلومات العنوان الرئيسي -->
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-2xs">
        <CalendarCheck class="w-6 h-6" />
      </div>
      <div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
            الدورات المفتوحة للتسجيل
          </h2>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{{ totalCount }} دورات متاحة</span>
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            {{ totalSeats }} مقعد إجمالي
          </span>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة حجز المقاعد، أعداد المتقدمين، وتتبع من سدد ومن في انتظار السداد
        </p>
      </div>
    </div>

    <!-- الإجراءات السريعة -->
    <div class="flex items-center gap-2.5 w-full sm:w-auto">
      <!-- زر تحديث البيانات -->
      <button
        type="button"
        class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs shrink-0"
        :disabled="isRefreshing"
        @click="$emit('refresh')"
      >
        <RefreshCw class="w-4 h-4 text-slate-500 dark:text-slate-400" :class="{ 'animate-spin': isRefreshing }" />
        <span class="hidden sm:inline">تحديث</span>
      </button>

      <!-- زر فتح دورة جديدة للتسجيل -->
      <button
        type="button"
        class="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs hover:shadow-sm"
        @click="$emit('open-new-round')"
      >
        <PlusCircle class="w-4.5 h-4.5" />
        <span>فتح دورة جديدة للتسجيل</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { CalendarCheck, RefreshCw, PlusCircle } from 'lucide-vue-next';

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  totalSeats: {
    type: Number,
    default: 0,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['refresh', 'open-new-round']);
</script>
