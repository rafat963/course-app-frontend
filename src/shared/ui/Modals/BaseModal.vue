<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
      @click.self="closeOnOverlay && $emit('update:modelValue', false)"
    >
      <div
        :class="[
          'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 transition-colors',
          maxWidthClass
        ]"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/80">
          <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">{{ title }}</h3>
          <button
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            @click="$emit('update:modelValue', false)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 text-sm">
          <slot />
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-end gap-2.5">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'md', // sm, md, lg, xl, 2xl
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['update:modelValue']);

const maxWidthClass = computed(() => {
  return {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[props.maxWidth];
});
</script>
