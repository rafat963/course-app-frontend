<template>
  <div
    class="h-screen h-dvh w-full bg-[#f4f8fa] dark:bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none transition-colors duration-300"
    dir="rtl"
  >
    <!-- ================= FLOATING THEME SWITCHER BUTTON ================= -->
    <div class="absolute top-3 left-3 sm:top-5 sm:left-5 z-50">
      <button
        type="button"
        class="h-8.5 px-3 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
        :title="theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن'"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'dark'" class="w-3.5 h-3.5 text-amber-400" />
        <Moon v-else class="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
        <span class="text-[11px] font-bold hidden sm:inline">
          {{ theme === 'dark' ? 'فاتح' : 'داكن' }}
        </span>
      </button>
    </div>

    <!-- ================= ARCHITECTURAL BACKGROUND LAYER ================= -->
    <div
      class="absolute inset-0 pointer-events-none opacity-70 dark:opacity-20 transition-opacity duration-300"
      style="
        background-image:
          linear-gradient(to right, rgba(15, 87, 118, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(15, 87, 118, 0.08) 1px, transparent 1px);
        background-size: 28px 28px;
      "
    ></div>

    <!-- Radial Mask to soften edges -->
    <div
      class="absolute inset-0 pointer-events-none transition-all duration-300 opacity-80 dark:opacity-90"
      :style="{
        background: theme === 'dark'
          ? 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(2, 6, 23, 0.95) 100%)'
          : 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(244, 248, 250, 0.75) 100%)'
      }"
    ></div>

    <!-- Soft Ambient Glow Orbs -->
    <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-400/15 dark:bg-primary-600/10 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl pointer-events-none"></div>

    <!-- ================= PERSISTENT / FIXED AUTH CARD CONTAINER ================= -->
    <div
      class="w-full relative z-10 flex flex-col my-auto transition-[max-width] duration-300 ease-in-out"
      :class="isRegister ? 'max-w-[740px]' : 'max-w-[430px]'"
    >
      <!-- Fixed Outer Card Frame: Never unmounts, never slides, perfectly centered -->
      <div
        class="bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 dark:border-slate-800 shadow-[0_15px_40px_-10px_rgba(15,87,118,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-slate-900/[0.04] dark:ring-slate-800/80 overflow-hidden flex flex-col max-h-[calc(100dvh-2.5rem)] transition-colors duration-300"
      >
        <!-- RouterView with pure fade transition for inner content only -->
        <RouterView v-slot="{ Component }">
          <Transition name="auth-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>

      <!-- Persistent Security Footer Note -->
      <div class="shrink-0 flex items-center justify-center gap-1.5 mt-2 text-[10.5px] text-slate-400 dark:text-slate-500 text-center">
        <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>{{ isRegister ? 'جميع البيانات مشفرة وفقاً لمعايير أمن المعلومات' : 'المنظومة تعمل داخل شبكة المعهد فقط — اتصالات مؤمنة' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { Sun, Moon, ShieldCheck } from 'lucide-vue-next';
import { useTheme } from '@/shared/composables/useTheme';

const route = useRoute();
const { theme, toggleTheme } = useTheme();

const isRegister = computed(() => route.path?.includes('register'));
</script>

<style>
/* Pure opacity fade transition for interior contents — No sliding, No layout jumps */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
}
</style>
