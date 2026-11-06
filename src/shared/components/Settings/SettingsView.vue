<template>
  <div class="space-y-5 pb-8 max-w-6xl mx-auto" dir="rtl">
    <!-- ================= FLOATING TOAST NOTIFICATION ================= -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toast.visible"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-xs sm:text-sm font-bold"
        :class="[
          toast.type === 'success'
            ? 'bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
        ]"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <AlertCircle v-else class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>{{ toast.message }}</span>
        <button
          type="button"
          class="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer mr-2"
          @click="toast.visible = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <!-- ================= 1. PAGE HEADER ================= -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-700 text-white flex items-center justify-center shadow-md shadow-primary-700/20 shrink-0">
          <Settings class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              إعدادات الحساب والملف الشخصي
            </h1>
            <span class="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-[10px] font-bold text-primary-700 dark:text-primary-300">
              إعدادات عامة
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            إدارة وتحديث بياناتك الشخصية، كلمة المرور، وتفضيلات الأمان لمنظومة معهد نظم المعلومات
          </p>
        </div>
      </div>

      <!-- Header Quick Badge -->
      <div class="flex items-center gap-2">
        <div class="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-right">
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">حالة الحساب</div>
          <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            نشط وموثق
          </div>
        </div>
      </div>
    </div>

    <!-- ================= 2. USER HERO CARD ================= -->
    <div class="bg-gradient-to-l from-primary-900 via-slate-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md border border-slate-800 relative overflow-hidden">
      <!-- Background Architectural Grid Pattern -->
      <div
        class="absolute inset-0 pointer-events-none opacity-10"
        style="
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 24px 24px;
        "
      ></div>

      <!-- Soft Glow Orbs -->
      <div class="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <!-- User Avatar & Identity Details -->
        <div class="flex items-center gap-4 sm:gap-5">
          <!-- Avatar Box with Upload Badge -->
          <div class="relative group shrink-0">
            <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-primary-400 to-amber-400 shadow-xl overflow-hidden">
              <div class="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                <img
                  v-if="profileForm.profilePhotoPath"
                  :src="profileForm.profilePhotoPath"
                  alt="الصورة الشخصية"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-2xl font-black text-primary-300">
                  {{ userInitials }}
                </span>
              </div>
            </div>

            <!-- Fast change photo hover trigger -->
            <label
              for="hero-avatar-input"
              class="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer backdrop-blur-2xs"
              title="تغيير الصورة"
            >
              <Camera class="w-5 h-5 mb-0.5" />
              <span>تغيير</span>
            </label>
            <input
              id="hero-avatar-input"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handlePhotoUpload"
            />
          </div>

          <!-- User Texts -->
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg sm:text-xl font-black font-heading tracking-tight text-white">
                {{ profileForm.fullName || 'مستخدم المنظومة' }}
              </h2>
              <span class="px-2.5 py-0.5 rounded-full bg-primary-500/20 border border-primary-400/40 text-[11px] font-bold text-primary-200">
                {{ roleLabel }}
              </span>
            </div>

            <p class="text-xs text-slate-300 flex items-center gap-1.5">
              <Shield class="w-3.5 h-3.5 text-amber-400" />
              <span>معهد نظم المعلومات — القوات المسلحة</span>
            </p>

            <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
              <span class="flex items-center gap-1">
                <Mail class="w-3.5 h-3.5 text-slate-400" />
                <span dir="ltr">{{ profileForm.email || '—' }}</span>
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Phone class="w-3.5 h-3.5 text-slate-400" />
                <span dir="ltr">{{ profileForm.phone || '—' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Meta Indicators Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-2 gap-2.5 shrink-0 text-right">
          <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[10px] text-slate-400 block">كود المستخدم</span>
            <span class="text-xs font-mono font-bold text-amber-300" dir="ltr">#ISI-USR-0{{ authStore.user?.id || '1' }}</span>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[10px] text-slate-400 block">تاريخ الانضمام</span>
            <span class="text-xs font-semibold text-slate-200">أكتوبر 2026</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= 3. TABS NAVIGATION ================= -->
    <div class="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-x-auto select-none">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        :class="[
          activeTab === t.id
            ? 'bg-primary-600 text-white shadow-md shadow-primary-700/20'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
        ]"
        @click="activeTab = t.id"
      >
        <component :is="t.icon" class="w-4 h-4 shrink-0" />
        <span>{{ t.label }}</span>
        <span
          v-if="t.id === 'personal' && hasUnsavedProfileChanges"
          class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
          title="تغييرات غير محفوظة"
        ></span>
      </button>
    </div>

    <!-- ================= 4. TAB CONTENTS ================= -->

    <!-- ================= TAB 1: سكشن البيانات الشخصية ================= -->
    <div v-show="activeTab === 'personal'" class="space-y-5 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-colors">
        <!-- Section Header -->
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
              <UserCheck class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              تعديل البيانات الشخصية
            </h3>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              يمكنك تحديث بيانات الاتصال والاسم وصورتك الشخصية لجميع تعاملاتك في المنظومة
            </p>
          </div>
          <span
            v-if="hasUnsavedProfileChanges"
            class="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-[10.5px] font-bold text-amber-700 dark:text-amber-300"
          >
            توجد تعديلات غير محفوظة
          </span>
        </div>

        <form @submit.prevent="handleSaveProfile">
          <!-- Photo Upload & Actions Block -->
          <div class="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-200 dark:border-primary-800 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <img
                  v-if="profileForm.profilePhotoPath"
                  :src="profileForm.profilePhotoPath"
                  alt="معاينة الصورة"
                  class="w-full h-full object-cover"
                />
                <User v-else class="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100">الصورة الرمزية والشخصية</h4>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  تظهر في الشريط الجانبي وتصاريح الحضور وبوابة الدخول (JPG / PNG بحد أقصى 2MB)
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <input
                id="profile-file-picker"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handlePhotoUpload"
              />
              <label
                for="profile-file-picker"
                class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Upload class="w-3.5 h-3.5" />
                <span>رفع صورة جديدة</span>
              </label>

              <button
                v-if="profileForm.profilePhotoPath"
                type="button"
                class="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="حذف الصورة"
                @click="removePhoto"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>إزالة</span>
              </button>
            </div>
          </div>

          <!-- Form Fields Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Full Name -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>الاسم بالكامل باللغة العربية <span class="text-rose-500">*</span></span>
                <span class="text-[10.5px] font-normal text-slate-400">الرسمي في المنظومة</span>
              </label>
              <div class="relative">
                <input
                  v-model="profileForm.fullName"
                  type="text"
                  required
                  placeholder="الاسم الرباعي الرسمي"
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <!-- Email Address -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>البريد الإلكتروني الرسمي <span class="text-rose-500">*</span></span>
                <span class="text-[10.5px] font-normal text-slate-400">لتسجيل الدخول والإشعارات</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail class="w-4 h-4" />
                </div>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  dir="ltr"
                  placeholder="user@isi.gov.eg"
                  class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <!-- Phone Number -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>رقم الهاتف المحمول للتواصل <span class="text-rose-500">*</span></span>
                <span class="text-[10.5px] font-normal text-slate-400">11 رقماً</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Phone class="w-4 h-4" />
                </div>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  maxlength="11"
                  required
                  dir="ltr"
                  placeholder="01012345678"
                  class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <!-- Role (Read-only Badge Field) -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>الدور الوظيفي في المنظومة</span>
                <span class="text-[10.5px] font-normal text-slate-400">يُعين بواسطة الإدارة العليا</span>
              </label>
              <div class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 px-4 py-2.5 text-sm flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span class="font-bold text-slate-700 dark:text-slate-200">{{ roleLabel }}</span>
                </div>
                <span class="text-[10px] bg-primary-100 dark:bg-primary-950/80 text-primary-800 dark:text-primary-300 px-2 py-0.5 rounded-md font-bold">
                  صلاحية موثقة
                </span>
              </div>
            </div>

            <!-- National ID / Military ID -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>الرقم القومي / العسكري</span>
                <span class="text-[10.5px] font-normal text-slate-400">مطابق للهوية الرسمية</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <CreditCard class="w-4 h-4" />
                </div>
                <input
                  v-model="profileForm.nationalId"
                  type="text"
                  maxlength="14"
                  dir="ltr"
                  placeholder="29901010101234"
                  class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <!-- Department / Branch -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>الجهة / الفرع التابع له</span>
                <span class="text-[10.5px] font-normal text-slate-400">مقر العمل</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Building2 class="w-4 h-4" />
                </div>
                <input
                  v-model="profileForm.department"
                  type="text"
                  placeholder="معهد نظم المعلومات - القوات المسلحة"
                  class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions Footer -->
          <div class="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              :disabled="!hasUnsavedProfileChanges || isSavingProfile"
              class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              @click="resetProfileForm"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>إلغاء التعديلات</span>
            </button>

            <button
              type="submit"
              :disabled="isSavingProfile"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-primary-700/20 hover:shadow-primary-700/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isSavingProfile"
                class="animate-spin w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <Check v-else class="w-4 h-4" />
              <span>{{ isSavingProfile ? 'جاري الحفظ والمزامنة...' : 'حفظ التعديلات' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= TAB 2: سكشن تغيير كلمة المرور ================= -->
    <div v-show="activeTab === 'security'" class="space-y-5 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-colors">
        <!-- Section Header -->
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
              <KeyRound class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              تغيير كلمة المرور وإعدادات الأمان
            </h3>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              احرص على استخدام كلمة مرور قوية وغير مكررة لحماية حسابك في شبكة المعهد
            </p>
          </div>

          <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <Lock class="w-3.5 h-3.5" />
            <span>تشفير عسكري آمن</span>
          </div>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-5">
          <!-- Current Password -->
          <div class="max-w-xl space-y-1.5 text-right">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>كلمة المرور الحالية <span class="text-rose-500">*</span></span>
              <span class="text-[10.5px] font-normal text-slate-400">للتأكد من هويتك</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock class="w-4 h-4" />
              </div>
              <input
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                dir="ltr"
                class="w-full pr-10 pl-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                       focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
              />
              <button
                type="button"
                class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <EyeOff v-if="showCurrentPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- New Password Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
            <!-- New Password -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>كلمة المرور الجديدة <span class="text-rose-500">*</span></span>
                <span class="text-[10.5px] font-normal text-slate-400">8 أحرف كحد أدنى</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <KeyRound class="w-4 h-4" />
                </div>
                <input
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  placeholder="••••••••"
                  dir="ltr"
                  class="w-full pr-10 pl-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                  @click="showNewPassword = !showNewPassword"
                >
                  <EyeOff v-if="showNewPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-1.5 text-right">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>تأكيد كلمة المرور الجديدة <span class="text-rose-500">*</span></span>
                <span
                  v-if="passwordForm.confirmPassword"
                  class="text-[10.5px] font-bold"
                  :class="passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                >
                  {{ passwordsMatch ? 'متطابقتان' : 'غير متطابقتين' }}
                </span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  placeholder="••••••••"
                  dir="ltr"
                  class="w-full pr-10 pl-11 py-2.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                  :class="[
                    passwordForm.confirmPassword && !passwordsMatch
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10'
                  ]"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Password Strength Meter & Guidelines -->
          <div v-if="passwordForm.newPassword" class="max-w-3xl p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-600 dark:text-slate-300 font-bold">مستوى قوة كلمة المرور:</span>
              <span class="font-bold text-xs" :class="passwordStrength.color">
                {{ passwordStrength.label }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300 rounded-full"
                :class="passwordStrength.barColor"
                :style="{ width: `${passwordStrength.percent}%` }"
              ></div>
            </div>

            <!-- Checklist -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div class="flex items-center gap-1.5" :class="hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
                <CheckCircle2 v-if="hasMinLength" class="w-3.5 h-3.5" />
                <Circle v-else class="w-3.5 h-3.5" />
                <span>8 أحرف على الأقل</span>
              </div>
              <div class="flex items-center gap-1.5" :class="hasNumbersAndLetters ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
                <CheckCircle2 v-if="hasNumbersAndLetters" class="w-3.5 h-3.5" />
                <Circle v-else class="w-3.5 h-3.5" />
                <span>حروف وأرقام معاً</span>
              </div>
              <div class="flex items-center gap-1.5" :class="hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
                <CheckCircle2 v-if="hasSpecialChar" class="w-3.5 h-3.5" />
                <Circle v-else class="w-3.5 h-3.5" />
                <span>رمز خاص (@#$%) أو حرف كبير</span>
              </div>
            </div>
          </div>

          <!-- Password Actions Footer -->
          <div class="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              @click="resetPasswordForm"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>إعادة تعيين</span>
            </button>

            <button
              type="submit"
              :disabled="isChangingPassword || !isPasswordValid"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-primary-700/20 hover:shadow-primary-700/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isChangingPassword"
                class="animate-spin w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <KeyRound v-else class="w-4 h-4" />
              <span>{{ isChangingPassword ? 'جاري تحديث كلمة المرور...' : 'تحديث كلمة المرور' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Security Extra Box: Active Session Overview -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm transition-colors">
        <h4 class="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 font-heading mb-3 flex items-center gap-2">
          <ShieldAlert class="w-4 h-4 text-amber-500" />
          جلسة تسجيل الدخول الحالية
        </h4>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Laptop class="w-4 h-4" />
            </div>
            <div>
              <div class="font-bold text-slate-800 dark:text-slate-100">الجهاز الحالي (متصفح الويب)</div>
              <div class="text-[11px] text-slate-400 dark:text-slate-500">القاهرة، جمهورية مصر العربية • شبكة المعهد الداخلية</div>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            جلسة نشطة الآن
          </span>
        </div>
      </div>
    </div>

    <!-- ================= TAB 3: سكشن التفضيلات والمظهر ================= -->
    <div v-show="activeTab === 'preferences'" class="space-y-5 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-colors">
        <!-- Section Header -->
        <div class="pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Palette class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            تفضيلات المظهر وعرض الشاشات
          </h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            خصص تجربة استخدامك لمنظومة معهد نظم المعلومات بما يناسب بيئة عملك
          </p>
        </div>

        <!-- Theme Selection Grid -->
        <div class="space-y-3">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            نمط السمة والمظهر العام (Theme):
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <!-- Light Mode Card -->
            <button
              type="button"
              class="p-4 rounded-2xl border-2 text-right transition-all cursor-pointer flex items-center gap-3.5"
              :class="[
                theme === 'light'
                  ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
              ]"
              @click="setThemeMode('light')"
            >
              <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Sun class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200">الوضع الفاتح (Light Mode)</span>
                  <CheckCircle2 v-if="theme === 'light'" class="w-4 h-4 text-primary-600" />
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">مناسب لبيئات العمل ذات الإضاءة العالية والنهارية</p>
              </div>
            </button>

            <!-- Dark Mode Card -->
            <button
              type="button"
              class="p-4 rounded-2xl border-2 text-right transition-all cursor-pointer flex items-center gap-3.5"
              :class="[
                theme === 'dark'
                  ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
              ]"
              @click="setThemeMode('dark')"
            >
              <div class="w-10 h-10 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center shrink-0">
                <Moon class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200">الوضع الداكن (Dark Mode)</span>
                  <CheckCircle2 v-if="theme === 'dark'" class="w-4 h-4 text-primary-400" />
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">مريح للعينين ومناسب لغرف العمليات والمناوبات الليلية</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Notification Toggles -->
        <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            تفضيلات التنبيهات والإشعارات:
          </label>

          <div class="space-y-3 max-w-2xl">
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <BellRing class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <div>
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200 block">التنبيهات الصوتية</span>
                  <span class="text-[11px] text-slate-400 dark:text-slate-500">تشغيل نغمة صوتية خفيفة عند وصول إشعار جديد أو حركة حضور</span>
                </div>
              </div>
              <input
                v-model="notificationPrefs.sound"
                type="checkbox"
                class="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>

            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <Mail class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <div>
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200 block">الرسائل البريدية التلقائية</span>
                  <span class="text-[11px] text-slate-400 dark:text-slate-500">إرسال ملخص بالطلبات المعتمدة والتقارير الأسبوعية</span>
                </div>
              </div>
              <input
                v-model="notificationPrefs.emailDigest"
                type="checkbox"
                class="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Settings,
  User,
  UserCheck,
  KeyRound,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Phone,
  CreditCard,
  Building2,
  Camera,
  Upload,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Circle,
  Laptop,
  Palette,
  BellRing,
  X,
} from 'lucide-vue-next';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTheme } from '@/shared/composables/useTheme';
import { ROLE_LABELS } from '@/shared/constants/roles';

const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();

// ================= TABS =================
const tabs = [
  { id: 'personal', label: 'البيانات الشخصية', icon: User },
  { id: 'security', label: 'تغيير كلمة المرور والأمان', icon: KeyRound },
  { id: 'preferences', label: 'المظهر والتفضيلات', icon: Palette },
];
const activeTab = ref('personal');

// ================= TOAST NOTIFICATION =================
const toast = ref({
  visible: false,
  message: '',
  type: 'success',
});

function showToast(message, type = 'success') {
  toast.value = { visible: true, message, type };
  setTimeout(() => {
    toast.value.visible = false;
  }, 4000);
}

// ================= USER ROLE & INITIALS =================
const roleLabel = computed(() => {
  return ROLE_LABELS[authStore.user?.role] || authStore.user?.role || 'مستخدم النظام';
});

const userInitials = computed(() => {
  const name = profileForm.value.fullName?.trim() || authStore.user?.fullName?.trim() || 'م';
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return parts[0][0] + ' ' + parts[1][0];
  }
  return name.slice(0, 2);
});

// ================= TAB 1: PERSONAL INFO STATE =================
const profileForm = ref({
  fullName: authStore.user?.fullName || 'مسؤول شؤون الدارسين',
  email: authStore.user?.email || 'affairs@isi.gov.eg',
  phone: authStore.user?.phone || '01098765432',
  nationalId: authStore.user?.nationalId || '28505120102345',
  department: authStore.user?.department || 'إدارة شؤون الدارسين والامتحانات - معهد نظم المعلومات',
  profilePhotoPath: authStore.user?.profilePhotoPath || '',
});

const originalProfile = ref({ ...profileForm.value });
const isSavingProfile = ref(false);

const hasUnsavedProfileChanges = computed(() => {
  return (
    profileForm.value.fullName !== originalProfile.value.fullName ||
    profileForm.value.email !== originalProfile.value.email ||
    profileForm.value.phone !== originalProfile.value.phone ||
    profileForm.value.nationalId !== originalProfile.value.nationalId ||
    profileForm.value.department !== originalProfile.value.department ||
    profileForm.value.profilePhotoPath !== originalProfile.value.profilePhotoPath
  );
});

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validation: Max 2MB
  if (file.size > 2 * 1024 * 1024) {
    showToast('حجم الصورة يجب ألا يتجاوز 2 ميجابايت.', 'error');
    return;
  }

  const url = URL.createObjectURL(file);
  profileForm.value.profilePhotoPath = url;
  showToast('تم اختيار الصورة بنجاح. اضغط على حفظ التعديلات لاعتمادها.', 'success');
}

function removePhoto() {
  profileForm.value.profilePhotoPath = '';
}

function resetProfileForm() {
  profileForm.value = { ...originalProfile.value };
}

function handleSaveProfile() {
  if (!profileForm.value.fullName.trim()) {
    showToast('يرجى إدخال الاسم بالكامل.', 'error');
    return;
  }

  if (!profileForm.value.email.trim()) {
    showToast('يرجى إدخال البريد الإلكتروني.', 'error');
    return;
  }

  isSavingProfile.value = true;

  setTimeout(() => {
    isSavingProfile.value = false;

    // Update pinia store & localStorage
    authStore.updateUser({
      fullName: profileForm.value.fullName,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
      nationalId: profileForm.value.nationalId,
      department: profileForm.value.department,
      profilePhotoPath: profileForm.value.profilePhotoPath,
    });

    originalProfile.value = { ...profileForm.value };
    showToast('تم حفظ وتحديث بياناتك الشخصية بنجاح.');
  }, 600);
}

// ================= TAB 2: CHANGE PASSWORD STATE =================
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isChangingPassword = ref(false);

const hasMinLength = computed(() => passwordForm.value.newPassword.length >= 8);
const hasNumbersAndLetters = computed(() => {
  const p = passwordForm.value.newPassword;
  return /[a-zA-Z]/.test(p) && /[0-9]/.test(p);
});
const hasSpecialChar = computed(() => {
  const p = passwordForm.value.newPassword;
  return /[^a-zA-Z0-9]/.test(p) || /[A-Z]/.test(p);
});

const passwordsMatch = computed(() => {
  return (
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
  );
});

const passwordStrength = computed(() => {
  let score = 0;
  if (hasMinLength.value) score += 40;
  if (hasNumbersAndLetters.value) score += 30;
  if (hasSpecialChar.value) score += 30;

  if (score < 40) {
    return {
      percent: Math.max(score, 20),
      label: 'ضعيفة',
      color: 'text-rose-600 dark:text-rose-400',
      barColor: 'bg-rose-500',
    };
  } else if (score < 80) {
    return {
      percent: score,
      label: 'متوسطة',
      color: 'text-amber-600 dark:text-amber-400',
      barColor: 'bg-amber-500',
    };
  } else {
    return {
      percent: 100,
      label: 'قوية وممتازة',
      color: 'text-emerald-600 dark:text-emerald-400',
      barColor: 'bg-emerald-500',
    };
  }
});

const isPasswordValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    hasMinLength.value &&
    passwordsMatch.value
  );
});

function resetPasswordForm() {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}

function handleChangePassword() {
  if (!passwordForm.value.currentPassword) {
    showToast('يرجى إدخال كلمة المرور الحالية.', 'error');
    return;
  }

  if (!hasMinLength.value) {
    showToast('يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.', 'error');
    return;
  }

  if (!passwordsMatch.value) {
    showToast('كلمتا المرور غير متطابقتين.', 'error');
    return;
  }

  isChangingPassword.value = true;

  setTimeout(() => {
    isChangingPassword.value = false;
    resetPasswordForm();
    showToast('تم تغيير كلمة المرور بنجاح. يرجى استخدام كلمة المرور الجديدة في الدخول القادم.');
  }, 700);
}

// ================= TAB 3: PREFERENCES STATE =================
const notificationPrefs = ref({
  sound: true,
  emailDigest: true,
});

function setThemeMode(mode) {
  if (theme.value !== mode) {
    toggleTheme();
    showToast(`تم التبديل إلى ${mode === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح'}.`);
  }
}
</script>