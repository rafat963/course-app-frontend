<template>
  <div class="mt-2.5 flex items-center justify-center max-w-sm sm:max-w-md mx-auto">
    <div
      v-for="(step, idx) in steps"
      :key="step.number"
      class="flex items-center"
      :class="{ 'flex-1': idx < steps.length - 1 }"
    >
      <!-- Step Circle & Label -->
      <div class="flex flex-col items-center relative">
        <button
          type="button"
          :disabled="currentStep < step.number"
          class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer"
          :class="[
            currentStep === step.number
              ? 'bg-primary-600 text-white ring-3 ring-primary-100 dark:ring-primary-950/60 shadow-xs'
              : currentStep > step.number
              ? 'bg-emerald-500 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          ]"
          @click="$emit('stepClick', step.number)"
        >
          <Check v-if="currentStep > step.number" class="w-3.5 h-3.5 stroke-[3]" />
          <span v-else>{{ step.number }}</span>
        </button>
        <span
          class="text-[10px] font-bold mt-1 whitespace-nowrap transition-colors"
          :class="currentStep === step.number ? 'text-primary-800 dark:text-primary-300 font-extrabold' : 'text-slate-400 dark:text-slate-500'"
        >
          {{ step.title }}
        </span>
      </div>

      <!-- Connecting Line -->
      <div
        v-if="idx < steps.length - 1"
        class="flex-1 h-0.5 mx-1.5 -mt-3.5 transition-all"
        :class="currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';

defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});

defineEmits(['stepClick']);
</script>
