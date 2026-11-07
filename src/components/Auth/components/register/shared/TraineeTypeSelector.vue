<template>
  <!-- Compact Trainee Type Selector -->
  <div class="mt-2.5 flex items-center justify-center">
    <div class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
      <!-- Adult Option -->
      <button
        type="button"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
        :class="
          modelValue === 'adult'
            ? 'bg-primary-600 shadow-sm text-white'
            : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        "
        @click="select('adult')"
      >
        <UserCircle2 class="w-3.5 h-3.5" />
        <span>متدرب بالغ</span>
        <span
          class="text-[9.5px] px-1.5 py-0.2 rounded-md font-medium"
          :class="modelValue === 'adult' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'"
        >
          +16 سنة
        </span>
      </button>

      <!-- Minor Option -->
      <button
        type="button"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
        :class="
          modelValue === 'minor'
            ? 'bg-amber-500 shadow-sm text-white'
            : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        "
        @click="select('minor')"
      >
        <Star class="w-3.5 h-3.5" />
        <span>طفل أو ناشئ</span>
        <span
          class="text-[9.5px] px-1.5 py-0.2 rounded-md font-medium"
          :class="modelValue === 'minor' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'"
        >
          أقل من 16
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { UserCircle2, Star } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'adult', // 'adult' | 'minor'
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

function select(type) {
  if (props.modelValue === type) return;
  emit('update:modelValue', type);
  emit('change', type);
}
</script>
