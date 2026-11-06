<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
    <!-- 1. الدورات المفتوحة للتسجيل -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          الدورات المفتوحة للتسجيل
        </p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {{ totalRounds }}
          </span>
          <span class="text-xs text-slate-500 font-bold">دفعة متاحة</span>
        </div>
      </div>
      <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
        <BookOpen class="w-5 h-5" />
      </div>
    </div>

    <!-- 2. إجمالي المقاعد المتاحة -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          إجمالي الطاقة الاستيعابية
        </p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {{ totalSeats }}
          </span>
          <span class="text-xs text-slate-500 font-bold">مقعد بالمعامل والقاعات</span>
        </div>
      </div>
      <div class="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
        <Layers class="w-5 h-5" />
      </div>
    </div>

    <!-- 3. المسددون والمقيدون رسمياً -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-1.5">
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
            سددوا وقُيّدوا رسمياً
          </p>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {{ overallOccupancyRate }}%
          </span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {{ totalEnrolled }}
          </span>
          <span class="text-xs text-slate-500 font-bold">دارساً مسدداً</span>
        </div>
      </div>
      <div class="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
        <CheckCircle2 class="w-5 h-5" />
      </div>
    </div>

    <!-- 4. بانتظار سداد الرسوم -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          بانتظار سداد الرسوم
        </p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {{ totalPending }}
          </span>
          <span class="text-xs text-slate-500 font-bold">متقدماً في مهلة السداد</span>
        </div>
      </div>
      <div class="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
        <Clock class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { BookOpen, Layers, CheckCircle2, Clock } from 'lucide-vue-next';

const props = defineProps({
  totalRounds: {
    type: Number,
    default: 0,
  },
  totalSeats: {
    type: Number,
    default: 0,
  },
  totalEnrolled: {
    type: Number,
    default: 0,
  },
  totalPending: {
    type: Number,
    default: 0,
  },
});

const overallOccupancyRate = computed(() => {
  if (!props.totalSeats) return 0;
  return Math.min(100, Math.round((props.totalEnrolled / props.totalSeats) * 100));
});
</script>
