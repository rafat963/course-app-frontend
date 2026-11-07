<template>
  <!-- 1. القائمة الجانبية للشاشات الكبيرة (Desktop Sidebar): تظهر فقط على الشاشات الكبيرة lg:block -->
  <div class="hidden lg:block shrink-0 h-full">
    <aside
      :class="[
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col select-none transition-all duration-300 ease-in-out relative h-full',
        isCollapsed ? 'w-20' : 'w-64 lg:w-72',
        'rounded-2xl sm:rounded-3xl shadow-sm dark:shadow-2xl'
      ]"
    >
      <!-- زر طي / فتح القائمة على حافة السايدبار (Desktop Edge Toggle Button) -->
      <button
        type="button"
        class="flex absolute -left-3.5 top-6 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-500 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md cursor-pointer z-50 transition-transform duration-200 hover:scale-110"
        :title="isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'"
        @click="$emit('toggle-collapse')"
      >
        <ChevronRight v-if="!isCollapsed" class="w-4 h-4 pointer-events-none" />
        <ChevronLeft v-else class="w-4 h-4 pointer-events-none" />
      </button>

      <!-- الجزء العلوي: الصورة الشخصية + الاسم + الرول -->
      <RouterLink
        to="/settings"
        :title="isCollapsed ? 'الملف الشخصي والإعدادات' : 'تعديل الملف الشخصي والإعدادات'"
        @mouseenter="prefetchRoute('/settings')"
        @focus="prefetchRoute('/settings')"
        :class="[
          'group/user flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300 shrink-0 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/30',
          isCollapsed ? 'py-4 px-2' : 'py-4 px-4'
        ]"
      >
        <div class="relative transition-all duration-300 pointer-events-none">
          <div
            :class="[
              'p-0.5 shadow-md bg-gradient-to-tr from-primary-600 to-primary-700 rounded-full transition-all duration-300 group-hover/user:scale-105',
              isCollapsed ? 'w-11 h-11' : 'w-14 h-14'
            ]"
          >
            <div
              class="w-full h-full bg-white dark:bg-slate-800 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300"
            >
              <img
                v-if="authStore.user?.profilePhotoPath"
                :src="authStore.user.profilePhotoPath"
                alt="الصورة الشخصية"
                class="w-full h-full object-cover rounded-full"
              />
              <div
                v-else
                class="w-full h-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-black transition-all rounded-full"
                :class="isCollapsed ? 'text-xs' : 'text-base'"
              >
                {{ userInitials }}
              </div>
            </div>
          </div>

          <span
            :class="[
              'absolute rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 transition-all',
              isCollapsed ? 'bottom-0 left-0 w-2.5 h-2.5' : 'bottom-0.5 left-0.5 w-3 h-3'
            ]"
          ></span>
        </div>

        <div
          class="transition-all duration-200 pointer-events-none"
          :class="isCollapsed ? 'opacity-0 h-0 overflow-hidden pointer-events-none mt-0' : 'opacity-100 mt-2'"
        >
          <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 group-hover/user:text-primary-600 dark:group-hover/user:text-primary-400 font-heading leading-tight max-w-[200px] truncate transition-colors">
            {{ authStore.user?.fullName || 'مستخدم المنظومة' }}
          </h2>
          <div class="mt-1">
            <span class="inline-block px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/80 text-[10px] font-bold text-primary-800 dark:text-primary-300">
              {{ roleLabel }}
            </span>
          </div>
        </div>
      </RouterLink>

      <!-- القائمة التنقلية (Desktop Nav) -->
      <nav class="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar px-2.5 py-3 overflow-x-hidden">
        <div v-for="group in navGroups" :key="group.title" class="mb-3">
          <span
            v-if="group.title"
            class="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-2 transition-all duration-200 whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 h-0 my-0 overflow-hidden pointer-events-none' : 'opacity-100'"
          >
            {{ group.title }}
          </span>

          <div class="space-y-1.5">
            <RouterLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              :title="isCollapsed ? item.label : ''"
              @mouseenter="prefetchRoute(item.path)"
              @focus="prefetchRoute(item.path)"
              :class="[
                'flex items-center transition-colors duration-150 cursor-pointer group select-none relative outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border',
                isCollapsed
                  ? 'w-11 h-11 rounded-full mx-auto justify-center'
                  : 'w-full h-11 px-2 rounded-2xl gap-2.5',
                isActive(item.path)
                  ? isCollapsed
                    ? 'bg-primary-50 text-primary-800 border-primary-300 dark:bg-slate-800 dark:border-primary-500/60 dark:text-white shadow-sm font-bold'
                    : 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-slate-800 dark:border-primary-500/50 dark:text-white shadow-2xs font-bold'
                  : isCollapsed
                    ? 'border-transparent bg-slate-100/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              ]"
            >
              <div
                v-if="!isCollapsed"
                class="pointer-events-none"
                :class="[
                  'w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors',
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-500/25 text-primary-700 dark:text-primary-300'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                ]"
              >
                <component :is="item.icon" class="w-4 h-4 shrink-0" />
              </div>
              <component
                v-else
                :is="item.icon"
                class="w-5 h-5 shrink-0 transition-colors pointer-events-none"
                :class="[
                  isActive(item.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                ]"
              />

              <span
                v-if="!isCollapsed"
                class="truncate text-sm font-bold whitespace-nowrap flex-1 pointer-events-none"
              >
                {{ item.label }}
              </span>
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- الجزء السفلي للديسك توب -->
      <div class="border-t border-slate-100 dark:border-slate-800/80 p-3 space-y-1.5 overflow-x-hidden shrink-0">
        <RouterLink
          to="/notifications"
          :title="isCollapsed ? 'مركز الإشعارات' : ''"
          @mouseenter="prefetchRoute('/notifications')"
          @focus="prefetchRoute('/notifications')"
          :class="[
            'flex items-center transition-colors duration-150 cursor-pointer relative group select-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border',
            isCollapsed
              ? 'w-11 h-11 rounded-full mx-auto justify-center'
              : 'w-full h-10 px-2 rounded-2xl gap-2.5',
            isActive('/notifications')
              ? isCollapsed
                ? 'bg-primary-50 text-primary-800 border-primary-300 dark:bg-slate-800 dark:border-primary-500/60 dark:text-white shadow-sm font-bold'
                : 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-slate-800 dark:border-primary-500/50 dark:text-white shadow-2xs font-bold'
              : isCollapsed
                ? 'border-transparent bg-slate-100/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
          ]"
        >
          <div
            v-if="!isCollapsed"
            class="pointer-events-none"
            :class="[
              'w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-colors',
              isActive('/notifications')
                ? 'bg-primary-100 dark:bg-primary-500/25 text-primary-700 dark:text-primary-300'
                : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
            ]"
          >
            <Bell class="w-3.5 h-3.5" />
          </div>
          <div v-else class="relative flex items-center justify-center pointer-events-none">
            <Bell
              class="w-5 h-5 transition-colors"
              :class="isActive('/notifications') ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'"
            />
            <span
              v-if="notificationsStore.unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"
            ></span>
          </div>

          <span
            v-if="!isCollapsed"
            class="truncate text-xs font-bold whitespace-nowrap flex-1 pointer-events-none"
          >
            مركز الإشعارات
          </span>
          <span
            v-if="!isCollapsed && notificationsStore.unreadCount > 0"
            class="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black text-[10px] shrink-0 mr-auto pointer-events-none"
          >
            {{ notificationsStore.unreadCount }}
          </span>
        </RouterLink>

        <RouterLink
          to="/settings"
          :title="isCollapsed ? 'الإعدادات والملف الشخصي' : ''"
          @mouseenter="prefetchRoute('/settings')"
          @focus="prefetchRoute('/settings')"
          :class="[
            'flex items-center transition-colors duration-150 cursor-pointer group select-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border',
            isCollapsed
              ? 'w-11 h-11 rounded-full mx-auto justify-center'
              : 'w-full h-10 px-2 rounded-2xl gap-2.5',
            isActive('/settings') || isActive('/profile')
              ? isCollapsed
                ? 'bg-primary-50 text-primary-800 border-primary-300 dark:bg-slate-800 dark:border-primary-500/60 dark:text-white shadow-sm font-bold'
                : 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-slate-800 dark:border-primary-500/50 dark:text-white shadow-2xs font-bold'
              : isCollapsed
                ? 'border-transparent bg-slate-100/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
          ]"
        >
          <div
            v-if="!isCollapsed"
            class="pointer-events-none"
            :class="[
              'w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-colors',
              isActive('/settings') || isActive('/profile')
                ? 'bg-primary-100 dark:bg-primary-500/25 text-primary-700 dark:text-primary-300'
                : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
            ]"
          >
            <Settings class="w-3.5 h-3.5" />
          </div>
          <div v-else class="flex items-center justify-center pointer-events-none">
            <Settings
              class="w-5 h-5 transition-colors"
              :class="isActive('/settings') || isActive('/profile') ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'"
            />
          </div>
          <span
            v-if="!isCollapsed"
            class="truncate text-xs font-bold whitespace-nowrap flex-1 pointer-events-none"
          >
            الإعدادات والملف الشخصي
          </span>
        </RouterLink>
      </div>
    </aside>
  </div>

  <!-- 2. القائمة الجانبية للموبايل والتابلت (Mobile Drawer): تطوف فوق المحتوى بالكامل عبر Teleport -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="lg:hidden fixed inset-0 z-50 select-none overflow-hidden"
      dir="rtl"
    >
      <!-- خلفية معتمة للموبايل -->
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        @click="$emit('close')"
      ></div>

      <!-- حاوية السايدبار المنزلق للموبايل -->
      <aside
        class="fixed inset-y-2 right-2 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
      >
        <!-- زر إغلاق للموبايل -->
        <button
          type="button"
          class="absolute top-3 left-3 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer z-20"
          aria-label="إغلاق القائمة"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- الجزء العلوي: الصورة الشخصية والاسم -->
        <RouterLink
          to="/settings"
          class="group/user flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800/80 p-4 transition-all shrink-0 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
          @mouseenter="prefetchRoute('/settings')"
          @touchstart.passive="prefetchRoute('/settings')"
        >
          <div class="relative transition-all duration-300 pointer-events-none">
            <div class="p-0.5 shadow-md bg-gradient-to-tr from-primary-600 to-primary-700 rounded-full w-14 h-14">
              <div class="w-full h-full bg-white dark:bg-slate-800 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  v-if="authStore.user?.profilePhotoPath"
                  :src="authStore.user.profilePhotoPath"
                  alt="الصورة الشخصية"
                  class="w-full h-full object-cover rounded-full"
                />
                <div
                  v-else
                  class="w-full h-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-black rounded-full text-base"
                >
                  {{ userInitials }}
                </div>
              </div>
            </div>
            <span class="absolute bottom-0.5 left-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </div>

          <div class="mt-2 text-center pointer-events-none">
            <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-tight max-w-[200px] truncate">
              {{ authStore.user?.fullName || 'مستخدم المنظومة' }}
            </h2>
            <div class="mt-1">
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/80 text-[10px] font-bold text-primary-800 dark:text-primary-300">
                {{ roleLabel }}
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- القائمة التنقلية للموبايل -->
        <nav class="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar px-3 py-3 overflow-x-hidden">
          <div v-for="group in navGroups" :key="group.title" class="mb-3">
            <span
              v-if="group.title"
              class="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-2 whitespace-nowrap"
            >
              {{ group.title }}
            </span>

            <div class="space-y-1">
              <RouterLink
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                @mouseenter="prefetchRoute(item.path)"
                @touchstart.passive="prefetchRoute(item.path)"
                class="flex items-center w-full h-11 px-2.5 rounded-2xl gap-2.5 transition-colors duration-150 border cursor-pointer"
                :class="
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-slate-800 dark:border-primary-500/50 dark:text-white shadow-2xs font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                "
              >
                <div
                  class="w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors pointer-events-none"
                  :class="
                    isActive(item.path)
                      ? 'bg-primary-100 dark:bg-primary-500/25 text-primary-700 dark:text-primary-300'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400'
                  "
                >
                  <component :is="item.icon" class="w-4 h-4 shrink-0" />
                </div>
                <span class="truncate text-sm font-bold flex-1 pointer-events-none">{{ item.label }}</span>
              </RouterLink>
            </div>
          </div>
        </nav>

        <!-- الفوتر للموبايل -->
        <div class="border-t border-slate-100 dark:border-slate-800/80 p-3 space-y-1.5 shrink-0">
          <RouterLink
            to="/notifications"
            @mouseenter="prefetchRoute('/notifications')"
            @touchstart.passive="prefetchRoute('/notifications')"
            class="flex items-center w-full h-10 px-2.5 rounded-2xl gap-2.5 border transition-colors cursor-pointer"
            :class="
              isActive('/notifications')
                ? 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-slate-800 dark:border-primary-500/50 dark:text-white shadow-2xs font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            "
          >
            <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 pointer-events-none">
              <Bell class="w-3.5 h-3.5" />
            </div>
            <span class="truncate text-xs font-bold flex-1 pointer-events-none">مركز الإشعارات</span>
            <span
              v-if="notificationsStore.unreadCount > 0"
              class="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black text-[10px] shrink-0 mr-auto pointer-events-none"
            >
              {{ notificationsStore.unreadCount }}
            </span>
          </RouterLink>

          <RouterLink
            to="/settings"
            @mouseenter="prefetchRoute('/settings')"
            @touchstart.passive="prefetchRoute('/settings')"
            class="flex items-center w-full h-10 px-2.5 rounded-2xl gap-2.5 border transition-colors cursor-pointer"
            :class="
              isActive('/settings') || isActive('/profile')
                ? 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-slate-800 dark:border-primary-500/50 dark:text-white shadow-2xs font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            "
          >
            <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 pointer-events-none">
              <Settings class="w-3.5 h-3.5" />
            </div>
            <span class="truncate text-xs font-bold flex-1 pointer-events-none">الإعدادات والملف الشخصي</span>
          </RouterLink>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import {
  Settings,
  Bell,
  ChevronRight,
  ChevronLeft,
  X,
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  BookOpen,
} from 'lucide-vue-next';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useNotificationsStore } from '@/shared/stores/notificationsStore';
import { ROLES, ROLE_LABELS } from '@/shared/constants/roles';
import { prefetchRoute } from '@/routes/prefetch';
import { useNavigationState } from '@/shared/composables/useNavigationState';

// استيراد إعدادات السايدبار المقسمة لكل كمبوننت / دومين
import { affairsNav } from '@/components/Affairs/helpers/sidebarNav';
import { adminNav } from '@/components/Admin/helpers/sidebarNav';
import { dashboardNav } from '@/components/Dashboard/helpers/sidebarNav';
import { securityNav } from '@/components/Security/helpers/sidebarNav';
import { traineeNav } from '@/components/Trainee/helpers/sidebarNav';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'toggle-collapse']);

const route = useRoute();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const { navigatingToPath } = useNavigationState();

// عند تغيير المسار في الراوتر، نغلق قائمة الموبايل بنعومة ودون قطع التنقل
watch(
  () => route.path,
  () => {
    emit('close');
  }
);

const roleLabel = computed(() => {
  return ROLE_LABELS[authStore.user?.role] || authStore.user?.role || 'مستخدم النظام';
});

const userInitials = computed(() => {
  const name = authStore.user?.fullName?.trim() || 'م';
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return parts[0][0] + ' ' + parts[1][0];
  }
  return name.slice(0, 2);
});

function isActive(path) {
  const isTarget = navigatingToPath.value === path;
  if (path === '/') return route.path === '/' || isTarget;
  return route.path === path || isTarget;
}

const navGroups = computed(() => {
  const role = authStore.user?.role;

  // شؤون الدارسين
  if (role === ROLES.AFFAIRS) {
    return affairsNav;
  }

  // Commander (القائد / لوحة التحكم)
  if (role === ROLES.COMMANDER) {
    return dashboardNav;
  }

  // Trainee (المتدرب)
  if (role === ROLES.TRAINEE) {
    return traineeNav;
  }

  // Security (الأمن)
  if (role === ROLES.SECURITY) {
    return securityNav;
  }

  // Admin (مسؤول النظام)
  if (role === ROLES.ADMIN) {
    return adminNav;
  }

  // معاينة عامة في حال عدم تحديد الدور
  return [
    {
      title: 'روابط النظام العامة',
      items: [
        { label: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
        { label: 'شؤون الدارسين', path: '/affairs/dashboard', icon: FileText },
        { label: 'المتدرب', path: '/trainee/courses', icon: BookOpen },
        { label: 'البوابة', path: '/security/gate-scan', icon: ShieldCheck },
        { label: 'مسؤول النظام', path: '/admin/users', icon: Users },
      ],
    },
  ];
});

// تحميل صفحات دور المستخدم الحالي مسبقاً في خلفية المتصفح أثناء الخمول
onMounted(() => {
  const prefetchAllCurrentUserRoutes = () => {
    if (navGroups.value) {
      navGroups.value.forEach((group) => {
        if (group.items) {
          group.items.forEach((item) => {
            if (item.path) prefetchRoute(item.path);
          });
        }
      });
    }
    prefetchRoute('/notifications');
    prefetchRoute('/settings');
  };

  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchAllCurrentUserRoutes, { timeout: 1500 });
    } else {
      setTimeout(prefetchAllCurrentUserRoutes, 800);
    }
  }
});
</script>
