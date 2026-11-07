<template>
  <div class="h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col p-1.5 sm:p-2 lg:p-2 gap-1.5 sm:gap-2 font-sans select-none transition-colors duration-200 overflow-hidden relative" dir="rtl">
    <!-- 1. الهيدر العلوي كبسولة عائمة بنفس تصميم السايدبار -->
    <Header
      :is-collapsed="isCollapsed"
      @toggle-sidebar="handleToggleSidebar"
    />

    <!-- 2. الجزء السفلي: القائمة الجانبية (يمين) + منطقة المحتوى الرئيسية (يسار) بتصميم كبسولات عائمة متطابقة -->
    <div class="flex-1 flex relative gap-1.5 sm:gap-2 min-h-0 overflow-hidden">
      <!-- القائمة الجانبية كبسولة عائمة (Sidebar Floating Capsule) -->
      <Sidebar
        :is-open="isMobileOpen"
        :is-collapsed="isCollapsed"
        @toggle-collapse="isCollapsed = !isCollapsed"
        @close="isMobileOpen = false"
      />

      <!-- المنطقة الرئيسية كبسولة محتوى متطابقة الحواف (Main Content Area) -->
      <div class="flex-1 flex flex-col min-w-0 bg-[#f1f5f9] dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors duration-200 h-full">
        <!-- شريط المسار (Breadcrumbs) -->
        <div class="px-3 sm:px-4.5 lg:px-5 pt-2 pb-0.5 shrink-0">
          <Breadcrumbs />
        </div>

        <!-- منطقة عرض محتوى الصفحات (Router View) -->
        <main
          ref="mainContentRef"
          class="flex-1 px-3 sm:px-4.5 lg:px-5 pb-3.5 sm:pb-4 pt-1 overflow-y-auto custom-scrollbar"
        >
          <RouterView v-slot="{ Component }">
            <Transition
              name="page-fade"
              mode="out-in"
              @before-enter="handleBeforeEnter"
              @after-enter="handleAfterEnter"
            >
              <component :is="Component" :key="route.path" />
            </Transition>
          </RouterView>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Breadcrumbs from './Breadcrumbs.vue';

const route = useRoute();

const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const mainContentRef = ref(null);

function handleToggleSidebar() {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    isMobileOpen.value = !isMobileOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
}

// إعادة تمرير مساحة المحتوى الرئيسية لأول الصفحة فور انتهاء الصفحة السابقة وبدء ظهور الصفحة الجديدة
function handleBeforeEnter() {
  if (mainContentRef.value) {
    mainContentRef.value.scrollTop = 0;
  }
}

function handleAfterEnter() {
  if (mainContentRef.value) {
    mainContentRef.value.scrollTop = 0;
  }
}
</script>

<style>
/* تأثير الانتقال السريع والرشيق بين الصفحات (Fast & Snappy Page Fade) */
.page-fade-enter-active {
  transition: opacity 0.14s ease-out,
              transform 0.14s ease-out !important;
  will-change: opacity, transform;
}

.page-fade-leave-active {
  transition: opacity 0.08s ease-in !important;
  will-change: opacity;
}

.page-fade-enter-from {
  opacity: 0 !important;
  transform: translateY(4px) !important;
}

.page-fade-enter-to {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.page-fade-leave-from {
  opacity: 1 !important;
}

.page-fade-leave-to {
  opacity: 0 !important;
}
</style>
