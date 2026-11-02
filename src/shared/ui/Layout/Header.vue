<template>
  <header
    class="h-16 w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl px-3 sm:px-6 flex items-center justify-between shadow-sm dark:shadow-2xl select-none transition-all duration-300 shrink-0 relative z-30"
  >
    <!-- الجزء الأيمن: زر الموبايل + اللوجو + اسم المعهد + رول/شعار القوات المسلحة -->
    <div class="flex items-center gap-2 sm:gap-3.5 min-w-0">
      <!-- زر تبديل القائمة للموبايل -->
      <button
        type="button"
        class="lg:hidden w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer shadow-xs shrink-0"
        aria-label="تبديل القائمة"
        @click="$emit('toggle-sidebar')"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- اللوجو والعناوين -->
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <!-- إطار دائري للوجو -->
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-1 bg-gradient-to-tr from-primary-600/15 to-primary-600/5 dark:from-primary-500/20 dark:to-primary-500/5 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center shadow-xs shrink-0">
          <img
            src="@/assets/logo.png"
            alt="شعار معهد نظم المعلومات - القوات المسلحة"
            class="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-xs"
          />
        </div>

        <div class="flex flex-col text-right leading-tight min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 font-heading truncate">
              معهد نظم المعلومات
            </span>
            <!-- شارة كبسولية للقوات المسلحة تظهر للشاشات الأكبر -->
            <span class="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/80 text-[10px] sm:text-[11px] font-bold text-primary-800 dark:text-primary-300 shadow-2xs hidden sm:inline-block shrink-0">
              القوات المسلحة
            </span>
          </div>
          <span class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 hidden sm:block">
            منظومة إدارة الدورات التدريبية
          </span>
        </div>
      </div>
    </div>

    <!-- الجزء الأيسر: ملء الشاشة، الدارك مود، الإشعارات، الإعدادات، وتسجيل الخروج -->
    <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <!-- 1. زر ملء الشاشة (Fullscreen) -->
      <button
        type="button"
        class="hidden sm:flex w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/60 items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer shadow-xs border border-transparent dark:border-slate-800"
        :title="isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'"
        @click="toggleFullscreen"
      >
        <Minimize v-if="isFullscreen" class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
        <Maximize v-else class="w-4.5 h-4.5" />
      </button>

      <!-- 2. أيقونة الدارك مود -->
      <button
        type="button"
        class="w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer shadow-xs border border-transparent dark:border-slate-800 shrink-0"
        :title="theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الليلي'"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'dark'" class="w-4.5 h-4.5 text-amber-400" />
        <Moon v-else class="w-4.5 h-4.5 text-slate-600" />
      </button>

      <!-- 3. أيقونة الإشعارات -->
      <div class="relative shrink-0">
        <button
          type="button"
          class="w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer shadow-xs border border-transparent dark:border-slate-800 relative"
          title="الإشعارات"
          @click="showNotifications = !showNotifications"
        >
          <Bell class="w-4.5 h-4.5" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"
          ></span>
        </button>

        <!-- قائمة الإشعارات المنسدلة -->
        <div
          v-if="showNotifications"
          class="absolute left-0 mt-3 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 z-50 animate-fade-in text-right"
        >
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-100">التنبيهات والإشعارات</span>
            <span
              v-if="notificationsStore.unreadCount > 0"
              class="text-[10px] bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 font-bold px-2.5 py-0.5 rounded-full border border-primary-100 dark:border-primary-900/60"
            >
              {{ notificationsStore.unreadCount }} جديدة
            </span>
            <span v-else class="text-[10px] text-slate-400 font-semibold">
              لا توجد جديدة
            </span>
          </div>

          <!-- Notification Items (Latest 4) -->
          <div class="space-y-1.5 max-h-72 overflow-y-auto">
            <div
              v-for="item in notificationsStore.notifications.slice(0, 4)"
              :key="item.id"
              :class="[
                'p-2.5 rounded-2xl transition-all text-xs space-y-0.5 cursor-pointer border',
                item.isRead
                  ? 'bg-slate-50/70 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  : 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-100 dark:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-950/50'
              ]"
              @click="handleNotificationClick(item)"
            >
              <div class="flex items-center justify-between">
                <p class="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate flex-1">
                  {{ item.title }}
                </p>
                <span
                  v-if="!item.isRead"
                  class="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0 mr-1.5"
                ></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 block">
                {{ item.createdAt }} • {{ item.sender }}
              </span>
            </div>
          </div>

          <!-- Dropdown Footer -->
          <div class="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold">
            <RouterLink
              to="/notifications"
              class="text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
              @click="showNotifications = false"
            >
              <span>مركز الإشعارات ({{ notificationsStore.notifications.length }})</span>
            </RouterLink>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              @click="showNotifications = false"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      <!-- 4. زر الإعدادات والملف الشخصي السريع -->
      <RouterLink
        to="/settings"
        class="w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer shadow-xs border border-transparent dark:border-slate-800"
        title="إعدادات الحساب والملف الشخصي"
      >
        <Settings class="w-4.5 h-4.5" />
      </RouterLink>

      <!-- فاصل عمودي خفيف -->
      <span class="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden xs:block"></span>

      <!-- 5. زر تسجيل الخروج -->
      <button
        type="button"
        class="h-10 w-10 sm:w-auto px-0 sm:px-3.5 rounded-full bg-rose-50/70 hover:bg-rose-100/90 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs shrink-0"
        title="تسجيل الخروج"
        @click="handleLogout"
      >
        <LogOut class="w-4 h-4 text-rose-500" />
        <span class="text-xs font-bold hidden sm:inline">خروج</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { Menu, LogOut, Bell, Sun, Moon, Maximize, Minimize, Settings } from 'lucide-vue-next';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTheme } from '@/shared/composables/useTheme';
import { useNotificationsStore } from '@/shared/stores/notificationsStore';

defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();
const notificationsStore = useNotificationsStore();

const showNotifications = ref(false);
const isFullscreen = ref(false);

function handleNotificationClick(item) {
  notificationsStore.markAsRead(item.id);
  showNotifications.value = false;
  if (item.link) {
    router.push(item.link);
  } else {
    router.push('/notifications');
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn('Error attempting to enable fullscreen:', err.message);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn('Error attempting to exit fullscreen:', err.message);
      });
    }
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}
</script>
