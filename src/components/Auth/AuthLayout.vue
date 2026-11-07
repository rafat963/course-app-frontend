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

    <!-- ================= ANIMATED AUTH CARD CONTAINER ================= -->
    <div class="w-full h-full flex items-center justify-center relative z-10">
      <RouterView v-slot="{ Component }">
        <Transition
          :name="transitionName"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { Sun, Moon } from 'lucide-vue-next';
import { useTheme } from '@/shared/composables/useTheme';

const route = useRoute();
const { theme, toggleTheme } = useTheme();

const transitionName = ref('auth-slide-forward');

watch(
  () => route.path,
  (toPath, fromPath) => {
    if (toPath?.includes('register') && fromPath?.includes('login')) {
      // Transitioning from Login to Register
      transitionName.value = 'auth-slide-forward';
    } else if (toPath?.includes('login') && fromPath?.includes('register')) {
      // Transitioning from Register to Login
      transitionName.value = 'auth-slide-back';
    } else {
      transitionName.value = 'auth-fade';
    }
  }
);
</script>

<style>
/* ================= SMOOTH AUTH TRANSITIONS ================= */

.auth-slide-forward-enter-active,
.auth-slide-forward-leave-active,
.auth-slide-back-enter-active,
.auth-slide-back-leave-active,
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}

/* Forward: Login leaves to right, Register enters from left (in RTL) */
.auth-slide-forward-leave-to {
  opacity: 0;
  transform: translateX(28px) scale(0.97);
  filter: blur(2px);
}
.auth-slide-forward-enter-from {
  opacity: 0;
  transform: translateX(-28px) scale(0.97);
  filter: blur(2px);
}

/* Back: Register leaves to left, Login enters from right (in RTL) */
.auth-slide-back-leave-to {
  opacity: 0;
  transform: translateX(-28px) scale(0.97);
  filter: blur(2px);
}
.auth-slide-back-enter-from {
  opacity: 0;
  transform: translateX(28px) scale(0.97);
  filter: blur(2px);
}

/* Fallback Fade */
.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
