<template>
  <div :class="['w-full relative z-10 flex flex-col max-h-[calc(100dvh-1.5rem)] my-auto transition-all', maxWidthClass]">
    <!-- Rounded Card with Layered Shadow -->
    <div
      class="bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 dark:border-slate-800 shadow-[0_15px_40px_-10px_rgba(15,87,118,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-slate-900/[0.04] dark:ring-slate-800/80 overflow-hidden flex flex-col max-h-full transition-colors duration-300"
    >
      <!-- Card Header: Compact or Standard -->
      <div
        class="shrink-0 bg-gradient-to-b from-primary-50/60 via-slate-50/30 to-white dark:from-slate-800/80 dark:via-slate-900/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300"
        :class="compact ? 'px-5 py-3 sm:px-6 sm:py-3.5' : 'pt-5 pb-3 px-6 sm:px-8 text-center'"
      >
        <!-- COMPACT INLINE HEADER (used in Multi-step Register) -->
        <template v-if="compact">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <img
                src="@/assets/logo.png"
                alt="شعار معهد نظم المعلومات - القوات المسلحة"
                class="w-10 h-10 object-contain drop-shadow-xs shrink-0"
              />
              <div class="text-right">
                <h1 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-tight">
                  معهد نظم المعلومات
                </h1>
                <p class="text-[10px] font-bold text-primary-700 dark:text-primary-400">القوات المسلحة</p>
              </div>
            </div>

            <div class="text-left shrink-0">
              <span class="text-[10.5px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80">
                {{ subtitle }}
              </span>
            </div>
          </div>

          <slot name="header-extra" />
        </template>

        <!-- STANDARD CENTERED HEADER (used in Login) -->
        <template v-else>
          <div class="flex justify-center mb-1.5">
            <img
              src="@/assets/logo.png"
              alt="شعار معهد نظم المعلومات - القوات المسلحة"
              class="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
            />
          </div>

          <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading leading-tight">
            معهد نظم المعلومات
          </h1>
          <p class="text-[11px] font-bold text-primary-700 dark:text-primary-400 mt-0.5">القوات المسلحة</p>

          <div class="flex items-center justify-center gap-2 mt-1.5">
            <span class="h-px w-6 bg-slate-200 dark:bg-slate-700"></span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{{ subtitle }}</span>
            <span class="h-px w-6 bg-slate-200 dark:bg-slate-700"></span>
          </div>

          <slot name="header-extra" />
        </template>
      </div>

      <!-- Main Card Body (can scroll internally if viewport is extremely small, but never the browser page!) -->
      <div class="flex-1 min-h-0 overflow-y-auto flex flex-col custom-scrollbar">
        <slot />
      </div>
    </div>

    <!-- Security Note Footer -->
    <div class="shrink-0 flex items-center justify-center gap-1.5 mt-2 text-[10.5px] text-slate-400 dark:text-slate-500 text-center">
      <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span>{{ securityNote }}</span>
    </div>
  </div>
</template>

<script setup>
import { ShieldCheck } from 'lucide-vue-next';

defineProps({
  maxWidthClass: {
    type: String,
    default: 'max-w-[430px]',
  },
  subtitle: {
    type: String,
    default: 'منظومة إدارة الدورات التدريبية',
  },
  securityNote: {
    type: String,
    default: 'المنظومة تعمل داخل شبكة المعهد فقط — جميع الاتصالات مؤمنة',
  },
  compact: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}
</style>
