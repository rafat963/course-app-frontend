<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
    <!-- Centered Header -->
    <div
      class="shrink-0 bg-gradient-to-b from-primary-50/60 via-slate-50/30 to-white dark:from-slate-800/80 dark:via-slate-900/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/80 pt-5 pb-3 px-6 sm:px-8 text-center transition-colors duration-300"
    >
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
        <span class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">منظومة إدارة الدورات التدريبية</span>
        <span class="h-px w-6 bg-slate-200 dark:bg-slate-700"></span>
      </div>
    </div>

    <!-- Scrollable Form Body -->
    <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col justify-between">
      <!-- Form Body -->
      <form class="p-5 sm:p-6 space-y-3" @submit.prevent="handleLogin">
        <!-- Email Field -->
        <div class="space-y-1 text-right">
          <label for="login-email" class="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Mail class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            البريد الإلكتروني
          </label>
          <div class="relative">
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="example@isi.gov.eg"
              dir="ltr"
              class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                     focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-1 text-right">
          <label for="login-password" class="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Lock class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            كلمة المرور
          </label>
          <div class="relative">
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              dir="ltr"
              class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2 pl-10 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                     focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
            />
            <button
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between pt-0.5">
          <label class="flex items-center gap-2 cursor-pointer select-none group">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            <span class="text-[11.5px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">تذكرني على هذا الجهاز</span>
          </label>
        </div>

        <!-- Error Alert -->
        <div
          v-if="errorMsg"
          class="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold"
        >
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ errorMsg }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
                 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer
                 shadow-md shadow-primary-700/20 hover:shadow-primary-700/30
                 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
        >
          <svg
            v-if="isLoading"
            class="animate-spin w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <LogIn v-else class="w-4 h-4" />
          <span>{{ isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}</span>
        </button>
      </form>

      <!-- Card Footer: Register Link -->
      <div class="px-5 sm:px-6 pb-4">
        <div class="relative flex items-center justify-center mb-3">
          <span class="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800"></span>
          <span class="relative bg-white dark:bg-slate-900 px-3 text-[10.5px] text-slate-400 dark:text-slate-500 font-semibold">أو</span>
        </div>

        <RouterLink
          to="/auth/register"
          class="w-full py-2 border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-950/30
                 text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-primary-400 font-bold rounded-xl text-xs transition-all cursor-pointer
                 flex items-center justify-center gap-2"
        >
          <UserPlus class="w-3.5 h-3.5" />
          إنشاء حساب متدرب جديد
        </RouterLink>
      </div>
    </div>

    <!-- Quick Role Selector for Fast Dev/Demo Access -->
    <div class="shrink-0 px-5 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10.5px]">
      <span class="text-slate-400 dark:text-slate-500 font-medium">تجربة دور:</span>
      <div class="flex items-center gap-1 flex-wrap justify-end">
        <button
          v-for="r in mockRoles"
          :key="r.role"
          type="button"
          class="px-1.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-300 text-slate-600 dark:text-slate-300 font-semibold text-[10px] transition-all cursor-pointer shadow-2xs"
          @click="quickLogin(r)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { LogIn, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-vue-next';
import { useAuthStore } from '../stores/authStore';
import { ROLES } from '@/shared/constants/roles';
import { authApi } from '@/api/auth.api';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');

const mockRoles = [
  { role: ROLES.TRAINEE, label: 'متدرب', email: 'trainee@isi.gov.eg' },
  { role: ROLES.AFFAIRS, label: 'شؤون', email: 'affairs@isi.gov.eg' },
  { role: ROLES.CASHIER, label: 'خزينة', email: 'cashier@isi.gov.eg' },
  { role: ROLES.SECURITY, label: 'أمن', email: 'security@isi.gov.eg' },
  { role: ROLES.COMMANDER, label: 'قائد', email: 'commander@isi.gov.eg' },
  { role: ROLES.ADMIN, label: 'مدير', email: 'admin@isi.gov.eg' },
];

function quickLogin(r) {
  errorMsg.value = '';

  const mockUsers = {
    [ROLES.TRAINEE]: {
      id: 1,
      fullName: 'أحمد محمود (متدرب تجريبي)',
      email: 'trainee@isi.gov.eg',
      role: ROLES.TRAINEE,
      profilePhotoPath: null,
    },
    [ROLES.AFFAIRS]: {
      id: 2,
      fullName: 'أ/ شريف الشريف (شؤون الدارسين)',
      email: 'affairs@isi.gov.eg',
      role: ROLES.AFFAIRS,
      profilePhotoPath: null,
    },
    [ROLES.CASHIER]: {
      id: 3,
      fullName: 'أ/ هاني كمال (مسؤول الخزينة)',
      email: 'cashier@isi.gov.eg',
      role: ROLES.CASHIER,
      profilePhotoPath: null,
    },
    [ROLES.SECURITY]: {
      id: 4,
      fullName: 'م/ عصام ناصر (مسؤول أمن البوابات)',
      email: 'security@isi.gov.eg',
      role: ROLES.SECURITY,
      profilePhotoPath: null,
    },
    [ROLES.COMMANDER]: {
      id: 5,
      fullName: 'لواء أ.ح / قائد المعهد',
      email: 'commander@isi.gov.eg',
      role: ROLES.COMMANDER,
      profilePhotoPath: null,
    },
    [ROLES.ADMIN]: {
      id: 6,
      fullName: 'م/ أحمد عادل (مدير النظام)',
      email: 'admin@isi.gov.eg',
      role: ROLES.ADMIN,
      profilePhotoPath: null,
    },
  };

  const user = mockUsers[r.role] || {
    id: 99,
    fullName: `مستخدم تجريبي (${r.label})`,
    email: r.email,
    role: r.role,
    profilePhotoPath: null,
  };

  const mockToken = `mock-token-${r.role.toLowerCase()}-${Date.now()}`;
  authStore.setAuth(mockToken, user);

  const redirectPath = route.query.redirect || authStore.defaultHomePath;
  router.push(redirectPath);
}

async function handleLogin() {
  errorMsg.value = '';

  if (!form.value.email || !form.value.password) {
    errorMsg.value = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
    return;
  }

  isLoading.value = true;
  try {
    const res = await authApi.login({
      email: form.value.email.trim(),
      password: form.value.password,
    });

    if (res?.success && res.data?.token) {
      authStore.setAuth(res.data.token, {
        id: res.data.id,
        fullName: res.data.fullName,
        email: res.data.email,
        role: res.data.role,
        profilePhotoPath: res.data.profilePhotoPath,
      });

      const redirectPath = route.query.redirect || authStore.defaultHomePath;
      router.push(redirectPath);
    } else {
      errorMsg.value = res?.message || 'فشل تسجيل الدخول، يرجى مراجعة البيانات المدخلة.';
    }
  } catch (err) {
    const apiError = err.response?.data;
    if (apiError?.message) {
      errorMsg.value = apiError.message;
    } else if (err.code === 'ERR_NETWORK') {
      errorMsg.value = 'تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الـ Backend.';
    } else {
      errorMsg.value = 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
