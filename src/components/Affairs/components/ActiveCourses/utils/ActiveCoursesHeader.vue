<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
    <!-- العنوان والشارات الإحصائية -->
    <div>
      <div class="flex flex-wrap items-center gap-2.5">
        <h1 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
          الدورات المنعقدة والتشغيلية
        </h1>

        <!-- شارة إجمالي الدورات النشطة -->
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {{ totalCount }} دورة نشطة
        </span>

        <!-- شارة الدورات الجارية -->
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
          {{ ongoingCount }} جارية حالياً
        </span>

        <!-- شارة الدورات المفتوحة للتسجيل -->
        <span v-if="availableCount > 0" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
          {{ availableCount }} مفتوحة للتسجيل / تبدأ قريباً
        </span>

        <!-- شارة محاضرات اليوم التفاعلية -->
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs"
          :class="
            todayLecturesCount > 0
              ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="todayLecturesCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'"
          ></span>
          <span>{{ todayLecturesCount }} محاضرة مجدولة اليوم</span>
        </span>
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
        <span>شؤون الدارسين • متابعة دورات الانعقاد الجارية، إشغال القاعات، الجداول الزمنية، ونسب الحضور التراكمية</span>
        <span>•</span>
        <span class="font-bold text-slate-700 dark:text-slate-300 font-mono">{{ todayFormattedDate }}</span>
      </p>
    </div>

    <!-- أزرار الإجراءات: زر التحديث والانتقال لكتالوج الدورات -->
    <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
      <!-- زر تحديث -->
      <button
        type="button"
        class="h-9.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
        :disabled="isRefreshing"
        title="تحديث قائمة الدورات الجارية"
        @click="$emit('refresh')"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
        <span class="hidden sm:inline">تحديث</span>
      </button>

      <!-- زر فتح دورة انعقاد جديدة -->
      <button
        type="button"
        class="h-9.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md shrink-0"
        @click="$emit('open-create-round')"
      >
        <CalendarPlus class="w-4 h-4 stroke-[2.2]" />
        <span>فتح دورة انعقاد جديدة</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RefreshCw, CalendarPlus } from 'lucide-vue-next';

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  ongoingCount: {
    type: Number,
    default: 0,
  },
  availableCount: {
    type: Number,
    default: 0,
  },
  todayLecturesCount: {
    type: Number,
    default: 0,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['refresh', 'open-create-round']);

const todayFormattedDate = computed(() => {
  return new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>
