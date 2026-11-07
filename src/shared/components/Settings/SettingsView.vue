<template>
  <div class="space-y-5 pb-8 max-w-6xl mx-auto select-none" dir="rtl">
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
              إعدادات الحساب وملف المتدرب
            </h1>
            <span class="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-[10px] font-bold text-primary-700 dark:text-primary-300">
              سجل المتدرب المعتمد
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            إدارة بيانات الهوية الوطنية (ERD Trainee)، بطاقة الرقم القومي، فئة المتدرب، والمستندات الرسمية
          </p>
        </div>
      </div>

      <!-- Header Quick Badges -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- National ID Validity Badge -->
        <div
          class="px-3 py-1.5 rounded-xl border text-right text-xs font-bold flex items-center gap-1.5"
          :class="isIdExpired
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            : isIdExpiringSoon
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'"
        >
          <CreditCard class="w-4 h-4 shrink-0" />
          <span>{{ idExpiryLabel }}</span>
        </div>

        <!-- Account Verification Badge -->
        <div class="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-right">
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">حالة التحقق</div>
          <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            موثق ومعتمد رسمياً
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
          <!-- Avatar Box with Upload Trigger -->
          <div class="relative group shrink-0">
            <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-primary-400 to-amber-400 shadow-xl overflow-hidden cursor-pointer" @click="openImageZoom('الصورة الشخصية', profileForm.profilePhotoPath)">
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
              @change="handlePhotoUpload($event, 'profilePhotoPath')"
            />
          </div>

          <!-- User Texts -->
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg sm:text-xl font-black font-heading tracking-tight text-white">
                {{ profileForm.fullName || 'أحمد سامي إبراهيم مصطفى' }}
              </h2>
              <span class="px-2.5 py-0.5 rounded-full bg-primary-500/20 border border-primary-400/40 text-[11px] font-bold text-primary-200">
                {{ currentCategoryConfig.label }}
              </span>
              <span
                v-if="currentCategoryConfig.discountRate > 0"
                class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10.5px] font-bold text-emerald-300"
              >
                خصم {{ currentCategoryConfig.discountRate }}%
              </span>
            </div>

            <p class="text-xs text-slate-300 flex items-center gap-1.5">
              <Shield class="w-3.5 h-3.5 text-amber-400" />
              <span>معهد نظم المعلومات للقوات المسلحة — جناح التعليم والتدريب</span>
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
              <span>•</span>
              <span class="flex items-center gap-1 text-slate-300 font-medium">
                <MapPin class="w-3.5 h-3.5 text-rose-400" />
                <span>محافظة {{ profileForm.governorate || 'القاهرة' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Meta Indicators Grid: Schema Keys (Id, UserId, NationalId, Category) -->
        <div class="grid grid-cols-2 sm:grid-cols-2 gap-2.5 shrink-0 text-right">
          <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[10px] text-slate-400 block">كود المتدرب (Id)</span>
            <span class="text-xs font-mono font-bold text-amber-300" dir="ltr">#TRN-{{ profileForm.id || '401' }}</span>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[10px] text-slate-400 block">كود الحساب (UserId)</span>
            <span class="text-xs font-mono font-bold text-primary-300" dir="ltr">#USR-{{ profileForm.userId || '201' }}</span>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[10px] text-slate-400 block">الرقم القومي</span>
            <span class="text-xs font-mono font-bold text-slate-200" dir="ltr">{{ profileForm.nationalId || '—' }}</span>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[10px] text-slate-400 block">العمر التقديري</span>
            <span class="text-xs font-bold text-emerald-400">{{ calculatedAge }}</span>
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
        class="flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
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
          v-if="hasUnsavedProfileChanges"
          class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
          title="تغييرات غير محفوظة"
        ></span>
      </button>
    </div>

    <!-- ================= 4. TAB CONTENTS ================= -->

    <!-- ================= TAB 1: البيانات الشخصية والملف الشخصي للمتدرب ================= -->
    <div v-show="activeTab === 'personal'" class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-colors">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
              <UserCheck class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              تعديل البيانات الشخصية وملف المتدرب
            </h3>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              يمكنك تحديث بيانات الاتصال والاسم وصورتك الشخصية، ومستندات الهوية الوطنية، والمؤهل الدراسي، وفئة الخصم
            </p>
          </div>
          <span
            v-if="hasUnsavedProfileChanges"
            class="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-700 dark:text-amber-300 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            توجد تعديلات غير محفوظة
          </span>
        </div>

        <form @submit.prevent="handleSaveProfile" class="space-y-8">
          <!-- 1. الحساب الأساسي والصورة الشخصية -->
          <div class="space-y-4">
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 border-r-2 border-primary-500 pr-2.5">
              <User class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>بيانات الحساب الأساسية والصورة الرمزية</span>
            </h4>

            <!-- Profile Photo Box -->
            <div class="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-200 dark:border-primary-800 overflow-hidden flex items-center justify-center shrink-0 shadow-xs cursor-pointer group relative"
                  @click="openImageZoom('الصورة الشخصية', profileForm.profilePhotoPath)"
                >
                  <img
                    v-if="profileForm.profilePhotoPath"
                    :src="profileForm.profilePhotoPath"
                    alt="معاينة الصورة"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <User v-else class="w-7 h-7 text-slate-400" />
                  <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye class="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h5 class="text-xs font-bold text-slate-800 dark:text-slate-100">الصورة الرمزية والشخصية</h5>
                  <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    تظهر في الشريط الجانبي وتصاريح الحضور وبوابة الدخول (JPG / PNG بحد أقصى 3MB)
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload($event, 'profilePhotoPath')"
                />
                <label
                  for="profile-photo-input"
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
                  @click="profileForm.profilePhotoPath = ''"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  <span>إزالة</span>
                </button>
              </div>
            </div>

            <!-- Fields Grid: Full Name, Email, Phone, Role, Id, UserId -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="الاسم الرباعي كما في بطاقة الرقم القومي"
                    class="w-full pr-4 pl-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                           focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>البريد الإلكتروني الرسمي <span class="text-rose-500">*</span></span>
                  <span class="text-[10.5px] font-normal text-slate-400">لتسجيل الدخول والإشعارات</span>
                </label>
                <div class="relative">
                  <input
                    v-model="profileForm.email"
                    type="email"
                    required
                    dir="ltr"
                    placeholder="trainee@isi.edu.eg"
                    class="w-full pr-4 pl-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                           focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <!-- Phone -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>رقم الهاتف المحمول للتواصل <span class="text-rose-500">*</span></span>
                  <span class="text-[10.5px] font-normal text-slate-400">11 رقماً</span>
                </label>
                <div class="relative">
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    maxlength="11"
                    required
                    dir="ltr"
                    placeholder="01012345678"
                    class="w-full pr-4 pl-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                           focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <!-- Role (Match user screenshot widget) -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>الدور الوظيفي في المنظومة</span>
                  <span class="text-[10.5px] font-normal text-slate-400">يُعين بواسطة الإدارة العليا</span>
                </label>
                <div class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                  <span class="flex items-center gap-2">
                    <ShieldCheck class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span>المتدرب</span>
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                    صلاحية موثقة
                  </span>
                </div>
              </div>

              <!-- Trainee ID (PK) -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>كود المتدرب (Id)</span>
                  <span class="text-[10px] font-normal text-slate-400">Identity PK</span>
                </label>
                <div class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 px-4 py-2.5 text-sm font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                  <span>#TRN-{{ profileForm.id || '401' }}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">رقم قيّد</span>
                </div>
              </div>

              <!-- User ID (FK) -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>كود حساب المستخدم (UserId)</span>
                  <span class="text-[10px] font-normal text-slate-400">FK -> Users.Id</span>
                </label>
                <div class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 px-4 py-2.5 text-sm font-mono font-bold text-primary-700 dark:text-primary-300 flex items-center justify-between">
                  <span>#USR-{{ profileForm.userId || '201' }}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300">موثق ومعتمد</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. وثائق ومستندات بطاقة الرقم القومي المصرية (NationalId & Photos) -->
          <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 border-r-2 border-primary-500 pr-2.5">
                <CreditCard class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>مستندات الهوية الوطنية وبطاقة الرقم القومي المصرية</span>
              </h4>

              <!-- Expiry Alert Indicator -->
              <div
                class="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 self-start sm:self-auto"
                :class="isIdExpired
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'"
              >
                <span class="w-2 h-2 rounded-full" :class="isIdExpired ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'"></span>
                <span>{{ isIdExpired ? 'بطاقة منتهية الصلاحية (مطلوب التجديد)' : 'بطاقة الرقم القومي سارية' }}</span>
              </div>
            </div>

            <!-- National ID Front & Back Photo Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Front Photo Card -->
              <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                    صورة وجه البطاقة الشخصية <span class="text-rose-500">*</span>
                  </span>
                  <button
                    v-if="profileForm.nationalIdFrontPhotoPath"
                    type="button"
                    class="text-[11px] text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    @click="openImageZoom('وجه بطاقة الرقم القومي', profileForm.nationalIdFrontPhotoPath)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>معاينة مكبرة</span>
                  </button>
                </div>

                <div class="h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden relative group flex items-center justify-center transition-all hover:border-primary-400">
                  <img
                    v-if="profileForm.nationalIdFrontPhotoPath"
                    :src="profileForm.nationalIdFrontPhotoPath"
                    alt="وجه البطاقة"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div v-else class="text-center p-3 text-slate-400">
                    <CreditCard class="w-8 h-8 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                    <span class="text-xs block font-semibold">لم يتم رفع وجه البطاقة بعد</span>
                  </div>

                  <!-- Overlay Buttons -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <label
                      for="front-card-input"
                      class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Upload class="w-3.5 h-3.5" />
                      <span>{{ profileForm.nationalIdFrontPhotoPath ? 'تغيير' : 'رفع' }}</span>
                    </label>
                    <button
                      v-if="profileForm.nationalIdFrontPhotoPath"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      title="حذف"
                      @click="profileForm.nationalIdFrontPhotoPath = ''"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  id="front-card-input"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload($event, 'nationalIdFrontPhotoPath')"
                />
                <span class="text-[10.5px] text-slate-400 block">صورة واضحة للبيانات والاسم والرقم القومي بالوجه</span>
              </div>

              <!-- Back Photo Card -->
              <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                    صورة ظهر البطاقة الشخصية <span class="text-rose-500">*</span>
                  </span>
                  <button
                    v-if="profileForm.nationalIdBackPhotoPath"
                    type="button"
                    class="text-[11px] text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    @click="openImageZoom('ظهر بطاقة الرقم القومي', profileForm.nationalIdBackPhotoPath)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>معاينة مكبرة</span>
                  </button>
                </div>

                <div class="h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden relative group flex items-center justify-center transition-all hover:border-primary-400">
                  <img
                    v-if="profileForm.nationalIdBackPhotoPath"
                    :src="profileForm.nationalIdBackPhotoPath"
                    alt="ظهر البطاقة"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div v-else class="text-center p-3 text-slate-400">
                    <CreditCard class="w-8 h-8 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                    <span class="text-xs block font-semibold">لم يتم رفع ظهر البطاقة بعد</span>
                  </div>

                  <!-- Overlay Buttons -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <label
                      for="back-card-input"
                      class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Upload class="w-3.5 h-3.5" />
                      <span>{{ profileForm.nationalIdBackPhotoPath ? 'تغيير' : 'رفع' }}</span>
                    </label>
                    <button
                      v-if="profileForm.nationalIdBackPhotoPath"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      title="حذف"
                      @click="profileForm.nationalIdBackPhotoPath = ''"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  id="back-card-input"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload($event, 'nationalIdBackPhotoPath')"
                />
                <span class="text-[10.5px] text-slate-400 block">صورة واضحة للوظيفة، الحالة، الديانة، وتاريخ الانتهاء بالظهر</span>
              </div>
            </div>

            <!-- 14-digit National ID Input with Real-time Smart Extraction -->
            <div class="p-4 rounded-2xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-200/80 dark:border-primary-900/40 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>الرقم القومي المصري (14 رقماً) <span class="text-rose-500">*</span></span>
                </label>
                <span v-if="extractedNotice" class="text-[11px] font-bold text-primary-700 dark:text-primary-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-primary-200 dark:border-primary-800">
                  {{ extractedNotice }}
                </span>
              </div>

              <div class="relative">
                <input
                  v-model="profileForm.nationalId"
                  type="text"
                  maxlength="14"
                  dir="ltr"
                  placeholder="29901150103412"
                  class="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold tracking-widest text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  @input="handleNationalIdChange"
                />
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard class="w-5 h-5" />
                </div>
              </div>

              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                * يقوم النظام بالاستخراج التلقائي لتاريخ الميلاد، النوع (ذكر/أنثى)، والمحافظة فور إدخال الرقم القومي المكون من 14 رقماً.
              </p>
            </div>
          </div>

          <!-- 3. الحالة المدنية والبيانات المستخرجة من البطاقة -->
          <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 border-r-2 border-primary-500 pr-2.5">
              <FileText class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>الحالة المدنية والبيانات الشخصية المدونة بالبطاقة</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Date of Birth -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>تاريخ الميلاد <span class="text-rose-500">*</span></span>
                  <span class="text-[10.5px] font-bold text-primary-600 dark:text-primary-400">({{ calculatedAge }})</span>
                </label>
                <input
                  v-model="profileForm.dateOfBirth"
                  type="date"
                  required
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <!-- Gender -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                  النوع (Gender) <span class="text-rose-500">*</span>
                </label>
                <select
                  v-model="profileForm.gender"
                  required
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                >
                  <option value="Male">ذكر (Male)</option>
                  <option value="Female">أنثى (Female)</option>
                </select>
              </div>

              <!-- Religion -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الديانة (Religion) <span class="text-rose-500">*</span>
                </label>
                <select
                  v-model="profileForm.religion"
                  required
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                >
                  <option value="Muslim">مسلم (Muslim)</option>
                  <option value="Christian">مسيحي (Christian)</option>
                  <option value="Other">أخرى (Other)</option>
                </select>
              </div>

              <!-- Marital Status -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الحالة الاجتماعية <span class="text-rose-500">*</span>
                </label>
                <select
                  v-model="profileForm.maritalStatus"
                  required
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                >
                  <option value="Single">أعزب / آنسة (Single)</option>
                  <option value="Married">متزوج / متزوجة (Married)</option>
                  <option value="Divorced">مطلق / مطلقة (Divorced)</option>
                  <option value="Widowed">أرمل / أرملة (Widowed)</option>
                </select>
              </div>
            </div>

            <!-- Occupation, Expiry Date, Governorate, Address -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Occupation -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>المهنة والوظيفة المدونة في البطاقة <span class="text-rose-500">*</span></span>
                </label>
                <input
                  v-model="profileForm.occupation"
                  type="text"
                  required
                  placeholder="مهندس برمجيات / ضابط مهندس / طالب..."
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <!-- National ID Expiry Date -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>تاريخ انتهاء سريان البطاقة <span class="text-rose-500">*</span></span>
                  <span
                    class="text-[10px] font-bold px-2 py-0.2 rounded"
                    :class="isIdExpired ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'"
                  >
                    {{ isIdExpired ? 'منتهية' : 'سارية' }}
                  </span>
                </label>
                <input
                  v-model="profileForm.nationalIdExpiryDate"
                  type="date"
                  required
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <!-- Governorate -->
              <div class="space-y-1.5 text-right">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>المحافظة <span class="text-rose-500">*</span></span>
                  <span class="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">لخريطة توزيع القائد</span>
                </label>
                <select
                  v-model="profileForm.governorate"
                  required
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                >
                  <option v-for="gov in governoratesList" :key="gov" :value="gov">
                    {{ gov }}
                  </option>
                </select>
              </div>

              <!-- Official Address on Card -->
              <div class="space-y-1.5 text-right sm:col-span-2 lg:col-span-3">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>العنوان المدون بالبطاقة بالكامل <span class="text-rose-500">*</span></span>
                  <span class="text-[10.5px] font-normal text-slate-400">كما هو مطبوع في ظهر البطاقة الشخصية</span>
                </label>
                <input
                  v-model="profileForm.address"
                  type="text"
                  required
                  placeholder="رقم العقار، اسم الشارع، الحي، المركز أو القسم، المحافظة"
                  class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>
          </div>

          <!-- 4. المؤهل الدراسي وصورة شهادة التخرج (اختياري / أوبشن) -->
          <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 border-r-2 border-primary-500 pr-2.5">
                <GraduationCap class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>المؤهل الدراسي والشهادة العلمية</span>
              </h4>
              <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                (اختياري / أوبشن)
              </span>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Qualification Title -->
                <div class="space-y-1.5 text-right sm:col-span-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>المؤهل الدراسي المسجل بالمنظومة (Qualification)</span>
                    <span class="text-[10px] text-slate-400">اختياري</span>
                  </label>
                  <input
                    v-model="profileForm.qualification"
                    type="text"
                    placeholder="بكالوريوس هندسة الحاسبات ونظم التحكم - دفعة 2021"
                    class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                           focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>

                <!-- Qualification Certificate Photo Preview & Upload -->
                <div class="space-y-1.5 text-right">
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>صورة شهادة المؤهل</span>
                    <button
                      v-if="profileForm.qualificationPhotoPath"
                      type="button"
                      class="text-[10.5px] text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer"
                      @click="openImageZoom('شهادة المؤهل الدراسي', profileForm.qualificationPhotoPath)"
                    >
                      معاينة مكبرة
                    </button>
                  </label>

                  <div class="relative flex items-center gap-2">
                    <input
                      id="qualification-photo-input"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handlePhotoUpload($event, 'qualificationPhotoPath')"
                    />
                    <label
                      for="qualification-photo-input"
                      class="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-400 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Upload class="w-3.5 h-3.5" />
                      <span>{{ profileForm.qualificationPhotoPath ? 'تغيير صورة الشهادة' : 'رفع شهادة المؤهل' }}</span>
                    </label>
                    <button
                      v-if="profileForm.qualificationPhotoPath"
                      type="button"
                      class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 cursor-pointer"
                      title="حذف"
                      @click="profileForm.qualificationPhotoPath = ''"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. فئة المتدرب ومستند إثبات الفئة / الخصم -->
          <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 border-r-2 border-primary-500 pr-2.5">
              <Award class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>فئة المتدرب ومستند إثبات الخصم المعتمد</span>
            </h4>

            <!-- Category Radio Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label
                v-for="cat in categoryOptions"
                :key="cat.value"
                class="relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
                :class="[
                  profileForm.category === cat.value
                    ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/25 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-2.5">
                    <input
                      v-model="profileForm.category"
                      type="radio"
                      :value="cat.value"
                      class="w-4 h-4 text-primary-600 dark:bg-slate-800 focus:ring-primary-500 cursor-pointer"
                    />
                    <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ cat.label }}</span>
                  </div>
                  <span
                    class="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border"
                    :class="cat.badgeClass"
                  >
                    {{ cat.discount }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pr-6 leading-relaxed">
                  {{ cat.desc }}
                </p>
              </label>
            </div>

            <!-- Category Proof Photo Box (Mandatory if non-Civilian) -->
            <div
              v-if="profileForm.category !== 'Civilian'"
              class="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-4 transition-all"
            >
              <div class="flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
                <ShieldAlert class="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h5 class="text-xs font-bold flex items-center gap-2">
                    <span>صورة كارنيه إثبات الفئة / صلة القرابة</span>
                    <span class="text-rose-500 font-bold">* إلزامي لاعتماد خصم {{ currentCategoryConfig.discountRate }}%</span>
                  </h5>
                  <p class="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    يرجى إرفاق صورة واضحة لكارنيه القوات المسلحة أو الشرطة أو البطاقة العلاجية / إثبات صلة القرابة.
                  </p>
                </div>
              </div>

              <!-- Upload / Preview Box -->
              <div class="flex flex-col sm:flex-row items-center gap-4">
                <div
                  class="w-full sm:w-60 h-36 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 overflow-hidden relative group flex items-center justify-center shrink-0"
                >
                  <img
                    v-if="profileForm.categoryProofPhotoPath"
                    :src="profileForm.categoryProofPhotoPath"
                    alt="كارنيه إثبات الفئة"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div v-else class="text-center p-3 text-slate-400">
                    <Award class="w-8 h-8 mx-auto mb-1 text-amber-400/80" />
                    <span class="text-xs block font-bold text-amber-900 dark:text-amber-300">رفع صورة الكارنيه</span>
                  </div>

                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <label
                      for="category-proof-input"
                      class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Upload class="w-3.5 h-3.5" />
                      <span>{{ profileForm.categoryProofPhotoPath ? 'تغيير' : 'رفع' }}</span>
                    </label>
                    <button
                      v-if="profileForm.categoryProofPhotoPath"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      title="حذف"
                      @click="profileForm.categoryProofPhotoPath = ''"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  id="category-proof-input"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload($event, 'categoryProofPhotoPath')"
                />

                <div class="space-y-2 text-xs">
                  <button
                    v-if="profileForm.categoryProofPhotoPath"
                    type="button"
                    class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                    @click="openImageZoom('كارنيه إثبات الفئة والخصم', profileForm.categoryProofPhotoPath)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>معاينة المستند بحجم كامل</span>
                  </button>
                  <p class="text-[11px] text-amber-800/80 dark:text-amber-400">
                    سيتم تدقيق ومطابقة الكارنيه بواسطة شؤون الدارسين قبل اعتماد سداد رسوم الدورات بنسبة الخصم.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions Footer -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
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
              <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </div>
              <input
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                dir="ltr"
                class="w-full pr-10 pl-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                       focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
              />
              <button
                type="button"
                class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-primary-600 cursor-pointer"
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
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound class="w-4 h-4" />
                </div>
                <input
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  placeholder="••••••••"
                  dir="ltr"
                  class="w-full pr-10 pl-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all
                         focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-primary-600 cursor-pointer"
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
                <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  placeholder="••••••••"
                  dir="ltr"
                  class="w-full pr-10 pl-11 py-2.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
                  :class="[
                    passwordForm.confirmPassword && !passwordsMatch
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/10'
                  ]"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-primary-600 cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Password Strength Meter -->
          <div v-if="passwordForm.newPassword" class="max-w-3xl p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-600 dark:text-slate-300 font-bold">مستوى قوة كلمة المرور:</span>
              <span class="font-bold text-xs" :class="passwordStrength.color">
                {{ passwordStrength.label }}
              </span>
            </div>

            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300 rounded-full"
                :class="passwordStrength.barColor"
                :style="{ width: `${passwordStrength.percent}%` }"
              ></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div class="flex items-center gap-1.5" :class="hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                <CheckCircle2 v-if="hasMinLength" class="w-3.5 h-3.5" />
                <Circle v-else class="w-3.5 h-3.5" />
                <span>8 أحرف على الأقل</span>
              </div>
              <div class="flex items-center gap-1.5" :class="hasNumbersAndLetters ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                <CheckCircle2 v-if="hasNumbersAndLetters" class="w-3.5 h-3.5" />
                <Circle v-else class="w-3.5 h-3.5" />
                <span>حروف وأرقام معاً</span>
              </div>
              <div class="flex items-center gap-1.5" :class="hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                <CheckCircle2 v-if="hasSpecialChar" class="w-3.5 h-3.5" />
                <Circle v-else class="w-3.5 h-3.5" />
                <span>رمز خاص (@#$%)</span>
              </div>
            </div>
          </div>

          <!-- Password Actions Footer -->
          <div class="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              @click="resetPasswordForm"
            >
              <RotateCcw class="w-3.5 h-3.5 inline ml-1" />
              <span>إعادة تعيين</span>
            </button>

            <button
              type="submit"
              :disabled="isChangingPassword || !isPasswordValid"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-l from-primary-600 to-primary-700 text-white text-xs font-bold shadow-md shadow-primary-700/20 hover:shadow-primary-700/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <KeyRound class="w-4 h-4 inline ml-1" />
              <span>{{ isChangingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور' }}</span>
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

    <!-- ================= TAB 6: سكشن التفضيلات والمظهر ================= -->
    <div v-show="activeTab === 'preferences'" class="space-y-5 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-colors">
        <!-- Section Header -->
        <div class="pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Palette class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            تفضيلات المظهر وعرض الشاشات
          </h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            تخصيص نمط المظهر والتنبيهات الصوتية في منظومة معهد نظم المعلومات
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
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">مريح للعينين ومناسب للمناوبات الليلية</p>
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

    <!-- ================= 5. MODAL: IMAGE ZOOM / FULL PREVIEW ================= -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="zoomModal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="zoomModal.isOpen = false"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl space-y-3 p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Eye class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>{{ zoomModal.title }}</span>
            </h3>
            <button
              type="button"
              class="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
              @click="zoomModal.isOpen = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="max-h-[70vh] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2">
            <img
              v-if="zoomModal.url"
              :src="zoomModal.url"
              :alt="zoomModal.title"
              class="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-md"
            />
            <div v-else class="py-12 text-center text-slate-400 text-xs">
              لا توجد صورة متاحة للعرض
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between text-xs">
            <span class="text-slate-400">وثيقة رسمية مشفرة ومحفوظة بالمنظومة</span>
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
              @click="zoomModal.isOpen = false"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================= 6. MODAL: IN-PAGE QR GATE PASS ZOOM ================= -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showQrModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="showQrModal = false"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 text-center space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <QrCode class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تصريح الدخول الأمني للبوابة</span>
            </h3>
            <button
              type="button"
              class="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              @click="showQrModal = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-4 bg-white rounded-2xl border-2 border-emerald-500/40 inline-block shadow-inner">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ISI-PASS-TRN401-CEH12"
              alt="QR Pass"
              class="w-44 h-44 mx-auto"
            />
          </div>

          <div class="space-y-1 text-xs">
            <div class="font-black text-slate-800 dark:text-slate-100">{{ profileForm.fullName }}</div>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">TOKEN: QR-7F8A-9B0C-1D2E</div>
            <p class="text-[10.5px] text-slate-400 pt-1">يُبرز هذا الرمز عند بوابات معهد نظم المعلومات للقوات المسلحة للتحقق الآلي.</p>
          </div>

          <button
            type="button"
            class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            @click="showQrModal = false"
          >
            إغلاق
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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
  Briefcase,
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
  FileImage,
  FileText,
  Award,
  GraduationCap,
  Sparkles,
  MapPin,
  BookOpen,
  QrCode,
} from 'lucide-vue-next';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTheme } from '@/shared/composables/useTheme';
import { TRAINEE_MOCK_PROFILE } from '@/components/Trainee/helpers/availableCoursesMockData';
import { EGYPTIAN_GOVERNORATES } from '@/components/Auth/helpers/authConstants';

const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();

// ================= TABS DEFINITIONS =================
const tabs = [
  { id: 'personal', label: 'البيانات الشخصية', icon: UserCheck },
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

// ================= CATEGORIES OPTIONS & HELPERS =================
const categoryOptions = [
  {
    value: 'Civilian',
    label: 'مدني',
    discount: 'السعر الكامل (0% خصم)',
    discountRate: 0,
    desc: 'لجميع المواطنين والخريجين والطلاب المدنيين',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    requiresProof: false,
  },
  {
    value: 'MilitaryOfficer',
    label: 'ضباط القوات المسلحة',
    discount: 'خصم 50%',
    discountRate: 50,
    desc: 'ضباط القوات المسلحة العاملين والمتقاعدين',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    requiresProof: true,
  },
  {
    value: 'MilitaryFamily',
    label: 'عائلات ضباط ق.م',
    discount: 'خصم 30%',
    discountRate: 30,
    desc: 'الزوجة والأبناء لضباط القوات المسلحة (إثبات صلة القرابة)',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    requiresProof: true,
  },
  {
    value: 'PoliceOfficerOrFamily',
    label: 'ضباط وعائلات الشرطة',
    discount: 'خصم 30%',
    discountRate: 30,
    desc: 'ضباط هيئة الشرطة المدنية وأسرهم',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    requiresProof: true,
  },
];

const governoratesList = EGYPTIAN_GOVERNORATES;

// Egyptian National ID Governorate Codes Mapping
const GOVERNORATE_CODES = {
  '01': 'القاهرة',
  '02': 'الإسكندرية',
  '03': 'بورسعيد',
  '04': 'السويس',
  '11': 'دمياط',
  '12': 'الدقهلية',
  '13': 'الشرقية',
  '14': 'القليوبية',
  '15': 'كفر الشيخ',
  '16': 'الغربية',
  '17': 'المنوفية',
  '18': 'البحيرة',
  '19': 'الإسماعيلية',
  '21': 'الجيزة',
  '22': 'بني سويف',
  '23': 'الفيوم',
  '24': 'المنيا',
  '25': 'أسيوط',
  '26': 'سوهاج',
  '27': 'قنا',
  '28': 'أسوان',
  '29': 'الأقصر',
  '31': 'البحر الأحمر',
  '32': 'الوادي الجديد',
  '33': 'مطروح',
  '34': 'شمال سيناء',
  '35': 'جنوب سيناء',
};

// ================= TRAINEE PROFILE STATE (ALL 15 ERD FIELDS) =================
const profileForm = ref({
  // 1. Id (PK)
  id: authStore.user?.traineeId || TRAINEE_MOCK_PROFILE.id || 401,
  // 2. UserId (FK)
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId || 201,
  // Basic info from Users
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  email: authStore.user?.email || TRAINEE_MOCK_PROFILE.email,
  phone: authStore.user?.phone || TRAINEE_MOCK_PROFILE.phone,
  profilePhotoPath: authStore.user?.profilePhotoPath || TRAINEE_MOCK_PROFILE.profilePhotoPath,

  // 3. NationalId (14 digits)
  nationalId: authStore.user?.nationalId || TRAINEE_MOCK_PROFILE.nationalId,
  // 4. NationalIdFrontPhotoPath
  nationalIdFrontPhotoPath: authStore.user?.nationalIdFrontPhotoPath || TRAINEE_MOCK_PROFILE.nationalIdFrontPhotoPath,
  // 5. NationalIdBackPhotoPath
  nationalIdBackPhotoPath: authStore.user?.nationalIdBackPhotoPath || TRAINEE_MOCK_PROFILE.nationalIdBackPhotoPath,
  // 6. DateOfBirth
  dateOfBirth: authStore.user?.dateOfBirth || TRAINEE_MOCK_PROFILE.dateOfBirth,
  // 7. Gender
  gender: authStore.user?.gender || TRAINEE_MOCK_PROFILE.gender,
  // 8. Religion
  religion: authStore.user?.religion || TRAINEE_MOCK_PROFILE.religion,
  // 9. MaritalStatus
  maritalStatus: authStore.user?.maritalStatus || TRAINEE_MOCK_PROFILE.maritalStatus,
  // 10. Occupation
  occupation: authStore.user?.occupation || TRAINEE_MOCK_PROFILE.occupation,
  // 11. Address
  address: authStore.user?.address || TRAINEE_MOCK_PROFILE.address,
  // 12. Governorate
  governorate: authStore.user?.governorate || TRAINEE_MOCK_PROFILE.governorate,
  // 13. NationalIdExpiryDate
  nationalIdExpiryDate: authStore.user?.nationalIdExpiryDate || TRAINEE_MOCK_PROFILE.nationalIdExpiryDate,
  // 14. Category
  category: authStore.user?.category || TRAINEE_MOCK_PROFILE.category || 'Civilian',
  // 15. CategoryProofPhotoPath
  categoryProofPhotoPath: authStore.user?.categoryProofPhotoPath || TRAINEE_MOCK_PROFILE.categoryProofPhotoPath,

  // Dependent academic fields
  qualification: authStore.user?.qualification || TRAINEE_MOCK_PROFILE.qualification,
  qualificationPhotoPath: authStore.user?.qualificationPhotoPath || TRAINEE_MOCK_PROFILE.qualificationPhotoPath,
});

const originalProfile = ref({ ...profileForm.value });
const isSavingProfile = ref(false);
const extractedNotice = ref('');

// Sync profileForm with authStore.user whenever it changes or hydrates
watch(
  () => authStore.user,
  (user) => {
    if (!user) return;
    if (user.fullName) profileForm.value.fullName = user.fullName;
    if (user.email) profileForm.value.email = user.email;
    if (user.phone) profileForm.value.phone = user.phone;
    if (user.profilePhotoPath) profileForm.value.profilePhotoPath = user.profilePhotoPath;
    if (user.nationalId) profileForm.value.nationalId = user.nationalId;
    if (user.nationalIdFrontPhotoPath) profileForm.value.nationalIdFrontPhotoPath = user.nationalIdFrontPhotoPath;
    if (user.nationalIdBackPhotoPath) profileForm.value.nationalIdBackPhotoPath = user.nationalIdBackPhotoPath;
    if (user.dateOfBirth) profileForm.value.dateOfBirth = user.dateOfBirth;
    if (user.gender) profileForm.value.gender = user.gender;
    if (user.religion) profileForm.value.religion = user.religion;
    if (user.maritalStatus) profileForm.value.maritalStatus = user.maritalStatus;
    if (user.occupation) profileForm.value.occupation = user.occupation;
    if (user.address) profileForm.value.address = user.address;
    if (user.governorate) profileForm.value.governorate = user.governorate;
    if (user.nationalIdExpiryDate) profileForm.value.nationalIdExpiryDate = user.nationalIdExpiryDate;
    if (user.category) profileForm.value.category = user.category;
    if (user.categoryProofPhotoPath) profileForm.value.categoryProofPhotoPath = user.categoryProofPhotoPath;
    if (user.qualification) profileForm.value.qualification = user.qualification;
    if (user.qualificationPhotoPath) profileForm.value.qualificationPhotoPath = user.qualificationPhotoPath;
    originalProfile.value = { ...profileForm.value };
  },
  { immediate: true, deep: true }
);

// Computed: Initials
const userInitials = computed(() => {
  const name = profileForm.value.fullName?.trim() || 'أحمد سامي';
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return parts[0][0] + ' ' + parts[1][0];
  }
  return name.slice(0, 2);
});

// Computed: Current Category Config
const currentCategoryConfig = computed(() => {
  return (
    categoryOptions.find((c) => c.value === profileForm.value.category) ||
    categoryOptions[0]
  );
});

// Computed: Calculated Age
const calculatedAge = computed(() => {
  if (!profileForm.value.dateOfBirth) return '—';
  try {
    const birth = new Date(profileForm.value.dateOfBirth);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age} سنة` : '—';
  } catch {
    return '—';
  }
});

// Computed: National ID Expiry Status
const isIdExpired = computed(() => {
  if (!profileForm.value.nationalIdExpiryDate) return false;
  return new Date(profileForm.value.nationalIdExpiryDate) < new Date();
});

const isIdExpiringSoon = computed(() => {
  if (!profileForm.value.nationalIdExpiryDate) return false;
  const expiry = new Date(profileForm.value.nationalIdExpiryDate);
  const now = new Date();
  const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= 90;
});

const idExpiryLabel = computed(() => {
  if (isIdExpired.value) return 'البطاقة منتهية الصلاحية';
  if (isIdExpiringSoon.value) return 'البطاقة تنتهي قريباً (خلال 3 أشهر)';
  return 'البطاقة سارية وموثقة';
});

// Computed: Check for Unsaved Changes
const hasUnsavedProfileChanges = computed(() => {
  return (
    profileForm.value.fullName !== originalProfile.value.fullName ||
    profileForm.value.email !== originalProfile.value.email ||
    profileForm.value.phone !== originalProfile.value.phone ||
    profileForm.value.profilePhotoPath !== originalProfile.value.profilePhotoPath ||
    profileForm.value.nationalId !== originalProfile.value.nationalId ||
    profileForm.value.nationalIdFrontPhotoPath !== originalProfile.value.nationalIdFrontPhotoPath ||
    profileForm.value.nationalIdBackPhotoPath !== originalProfile.value.nationalIdBackPhotoPath ||
    profileForm.value.dateOfBirth !== originalProfile.value.dateOfBirth ||
    profileForm.value.gender !== originalProfile.value.gender ||
    profileForm.value.religion !== originalProfile.value.religion ||
    profileForm.value.maritalStatus !== originalProfile.value.maritalStatus ||
    profileForm.value.occupation !== originalProfile.value.occupation ||
    profileForm.value.address !== originalProfile.value.address ||
    profileForm.value.governorate !== originalProfile.value.governorate ||
    profileForm.value.nationalIdExpiryDate !== originalProfile.value.nationalIdExpiryDate ||
    profileForm.value.category !== originalProfile.value.category ||
    profileForm.value.categoryProofPhotoPath !== originalProfile.value.categoryProofPhotoPath ||
    profileForm.value.qualification !== originalProfile.value.qualification ||
    profileForm.value.qualificationPhotoPath !== originalProfile.value.qualificationPhotoPath
  );
});

// ================= SMART AUTO-EXTRACTION FROM 14-DIGIT NATIONAL ID =================
function handleNationalIdChange() {
  const nid = profileForm.value.nationalId?.trim();
  if (!nid || nid.length !== 14 || !/^\d{14}$/.test(nid)) {
    extractedNotice.value = '';
    return;
  }

  // 1. Extract Century & DOB
  const centuryDigit = parseInt(nid[0], 10);
  if (centuryDigit !== 2 && centuryDigit !== 3) {
    extractedNotice.value = 'الرقم القومي غير مطابق للمواصفات المصرية';
    return;
  }

  const century = centuryDigit === 2 ? '19' : '20';
  const year = century + nid.substring(1, 3);
  const month = nid.substring(3, 5);
  const day = nid.substring(5, 7);
  profileForm.value.dateOfBirth = `${year}-${month}-${day}`;

  // 2. Extract Gender
  const genderDigit = parseInt(nid[12], 10);
  profileForm.value.gender = genderDigit % 2 !== 0 ? 'Male' : 'Female';

  // 3. Extract Governorate from digits 8-9
  const govCode = nid.substring(7, 9);
  if (GOVERNORATE_CODES[govCode]) {
    profileForm.value.governorate = GOVERNORATE_CODES[govCode];
  }

  extractedNotice.value = `تم استخراج: الميلاد ${profileForm.value.dateOfBirth} • ${profileForm.value.gender === 'Male' ? 'ذكر' : 'أنثى'} • ${profileForm.value.governorate}`;
  showToast('تم الاستخراج الذكي لبيانات الميلاد والنوع والمحافظة بنجاح.');
}

// ================= PHOTO UPLOAD HELPER =================
function handlePhotoUpload(e, field) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    showToast('حجم الصورة يجب ألا يتجاوز 3 ميجابايت.', 'error');
    return;
  }

  const url = URL.createObjectURL(file);
  profileForm.value[field] = url;
  showToast('تم اختيار الصورة بنجاح. يرجى الضغط على حفظ التعديلات.');
}

// ================= IMAGE ZOOM MODAL =================
const zoomModal = ref({
  isOpen: false,
  title: '',
  url: '',
});

function openImageZoom(title, url) {
  if (!url) return;
  zoomModal.value = {
    isOpen: true,
    title,
    url,
  };
}

// ================= QR MODAL =================
const showQrModal = ref(false);

// ================= SAVE & RESET PROFILE =================
function resetProfileForm() {
  profileForm.value = { ...originalProfile.value };
  extractedNotice.value = '';
}

function handleSaveProfile() {
  if (!profileForm.value.fullName?.trim()) {
    showToast('يرجى إدخال الاسم بالكامل.', 'error');
    return;
  }

  if (!profileForm.value.email?.trim()) {
    showToast('يرجى إدخال البريد الإلكتروني.', 'error');
    return;
  }

  if (profileForm.value.nationalId && profileForm.value.nationalId.length !== 14) {
    showToast('الرقم القومي يجب أن يتكون من 14 رقماً بالضبط.', 'error');
    return;
  }

  if (profileForm.value.category !== 'Civilian' && !profileForm.value.categoryProofPhotoPath) {
    showToast('يرجى رفع صورة كارنيه إثبات الفئة للحصول على الخصم المعتمد.', 'error');
    return;
  }

  isSavingProfile.value = true;

  setTimeout(() => {
    isSavingProfile.value = false;

    // Update pinia authStore user & localStorage
    authStore.updateUser({
      ...profileForm.value,
      role: 'Trainee',
    });

    originalProfile.value = { ...profileForm.value };
    showToast('تم حفظ وتحديث بيانات ملف المتدرب بنجاح وفق سجلات المعهد.');
  }, 600);
}

// ================= TAB 5: CHANGE PASSWORD =================
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

// ================= TAB 6: PREFERENCES =================
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
