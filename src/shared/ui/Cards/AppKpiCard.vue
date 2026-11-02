<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-center justify-between select-none gap-2">
    <div class="min-w-0">
      <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 block truncate">
        {{ title }}
      </span>
      <div class="mt-1 flex items-baseline gap-1.5">
        <span class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
          {{ value }}
        </span>
        <span
          v-if="badge"
          class="text-[10px] font-bold truncate"
          :class="badgeClass || 'text-slate-400'"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <!-- حاوية الأيقونة الدائرية الموحدة -->
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
      :class="iconBg || 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'"
    >
      <slot name="icon">
        <component :is="icon" v-if="icon" class="w-5 h-5" />
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  badge: {
    type: String,
    default: '',
  },
  badgeClass: {
    type: String,
    default: '',
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconBg: {
    type: String,
    default: '',
  },
});
</script>
