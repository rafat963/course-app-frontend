<!--
  Component: AdminUsersView.vue
  Description: User & Staff Management with Full Admin Control:
  - Full management of ALL user accounts in table & cards view (Staff, Admins, and Trainees).
  - Admin can: Edit details, Change/Reset Password, Deactivate/Activate account, and Delete account permanently (with modal confirmation).
  - Uses AppKpiCard, ViewModeToggle, AppTable, AppPagination, and BaseModal.
-->
<template>
  <div class="space-y-4 select-none pb-8" dir="rtl">
    <!-- 1. رأس الصفحة (Header) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 flex items-center justify-center border border-primary-200/60 dark:border-primary-800/60 shrink-0">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              إدارة المستخدمين والحسابات
            </h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              مسؤول النظام
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            صلاحيات التحكم الكاملة في حسابات المنظومة: طاقم العمل، شؤون الدارسين، الأمن، والمتدربين
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="refreshData"
        >
          <RotateCcw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
          <span>تحديث الحسابات</span>
        </button>

        <button
          type="button"
          class="h-9 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          @click="openUserModal()"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>
    </div>

    <!-- 2. كروت المؤشرات السريعة (AppKpiCard) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- 1. إجمالي حسابات المنظومة -->
      <AppKpiCard
        title="إجمالي حسابات المنظومة"
        :value="users.length"
        badge="طاقم ومتدربين"
        badge-class="text-slate-500 dark:text-slate-400 font-bold"
        icon-bg="bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
      >
        <template #icon>
          <Users class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <!-- 2. إجمالي المتدربين المسجلين -->
      <AppKpiCard
        title="إجمالي المتدربين المسجلين"
        :value="traineesCount"
        badge="حسابات دارسين"
        badge-class="text-blue-600 dark:text-blue-400 font-bold"
        icon-bg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
      >
        <template #icon>
          <GraduationCap class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <!-- 3. طاقم العمل والمسؤولين النشطين -->
      <AppKpiCard
        title="طاقم العمل والمسؤولين"
        :value="activeStaffCount"
        badge="نشط بالخدمة"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
      >
        <template #icon>
          <ShieldCheck class="w-5 h-5" />
        </template>
      </AppKpiCard>
    </div>

    <!-- 3. شريط تبويبات الحالة السريعة ومحول طريقة العرض -->
    <div class="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-2 transition-colors">
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
        <!-- كافة الحسابات -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            statusTab === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          "
          @click="statusTab = 'all'"
        >
          <span>كافة الحسابات</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'all' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ users.length }}
          </span>
        </button>

        <!-- المتدربين -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            statusTab === 'trainees'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
          "
          @click="statusTab = 'trainees'"
        >
          <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
          <span>المتدربين (Trainees)</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'trainees' ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ traineesCount }}
          </span>
        </button>

        <!-- طاقم العمل فقط -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            statusTab === 'staff'
              ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-300'
          "
          @click="statusTab = 'staff'"
        >
          <span class="w-2 h-2 rounded-full bg-primary-600 shrink-0"></span>
          <span>طاقم العمل والمسؤولين</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'staff' ? 'bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ staffOnlyCount }}
          </span>
        </button>

        <!-- الحسابات المعطلة -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            statusTab === 'inactive'
              ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
          "
          @click="statusTab = 'inactive'"
        >
          <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
          <span>حسابات معطلة</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'inactive' ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ disabledCount }}
          </span>
        </button>
      </div>

      <!-- محول طريقة العرض المشترك وعداد النتائج -->
      <div class="flex items-center gap-3">
        <ViewModeToggle
          :model-value="viewMode"
          @update:model-value="viewMode = $event"
        />
        <div class="text-xs text-slate-500 dark:text-slate-400 px-2 font-medium hidden md:block">
          الحسابات المعروضة: <strong class="text-slate-800 dark:text-slate-200">{{ filteredUsers.length }}</strong>
        </div>
      </div>
    </div>

    <!-- 4. شريط البحث والفلترة الفوري مع PrimeVue Select -->
    <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3 transition-colors">
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="بحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
          class="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          @click="searchQuery = ''"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- فلتر الصلاحيات والأدوار -->
      <div class="w-full sm:w-64">
        <Select
          v-model="selectedRole"
          :options="roleFilterOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="جميع الأدوار والصلاحيات"
          showClear
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
        />
      </div>

      <!-- زر تفريغ الفلاتر -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        title="تفريغ البحث والعودة لكافة الحسابات"
        @click="clearFilters"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>تفريغ البحث</span>
      </button>
    </div>

    <!-- 5. عرض الجدول الرئيسي (Table View) -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden transition-colors">
      <AppTable
        :columns="columns"
        :data="paginatedUsers"
        :is-filtered="hasActiveFilters"
        empty-title="لا توجد حسابات مطابقة لمعايير البحث الحالية"
        empty-text="جرّب تعديل كلمات البحث أو تفريغ الفلاتر لعرض كافة مستخدمي المنظومة"
        @clear-filters="clearFilters"
      >
        <!-- اسم المستخدم والأفاتار -->
        <template #fullName="{ row }">
          <div class="flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border"
              :class="getRoleAvatarStyle(row.role)"
            >
              {{ getUserInitials(row.fullName) }}
            </div>
            <div class="min-w-0">
              <div class="font-bold text-slate-800 dark:text-white truncate max-w-[200px]" :title="row.fullName">
                {{ row.fullName }}
              </div>
              <div class="text-[11px] text-slate-400 dark:text-slate-400 font-mono mt-0.5 truncate max-w-[190px]" dir="ltr" :title="row.email">
                {{ row.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- رقم الهاتف -->
        <template #phone="{ row }">
          <span class="font-mono text-slate-700 dark:text-slate-200 font-bold" dir="ltr">
            {{ row.phone }}
          </span>
        </template>

        <!-- الإدارة / القسم -->
        <template #department="{ row }">
          <span class="text-slate-700 dark:text-slate-300 text-xs font-medium truncate max-w-[170px] block" :title="row.department">
            {{ row.department || '—' }}
          </span>
        </template>

        <!-- الدور والصلاحية -->
        <template #role="{ row }">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
            :class="getRoleBadgeStyle(row.role)"
          >
            {{ getRoleArabicLabel(row.role) }}
          </span>
        </template>

        <!-- حالة الحساب -->
        <template #status="{ row }">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
            :class="
              row.isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            "
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="row.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            {{ row.isActive ? 'مفعل ونشط' : 'معطل وموقوف' }}
          </span>
        </template>

        <!-- الإجراءات -->
        <template #actions="{ row }">
          <div class="flex items-center justify-center gap-1.5">
            <!-- 1. تعديل بيانات الحساب -->
            <button
              type="button"
              class="h-8 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              :title="`تعديل بيانات ${row.fullName}`"
              @click="openUserModal(row)"
            >
              <Edit class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>تعديل</span>
            </button>

            <!-- 2. تغيير كلمة المرور للحساب -->
            <button
              type="button"
              class="h-8 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              :title="`تغيير كلمة المرور لـ ${row.fullName}`"
              @click="openChangePasswordModal(row)"
            >
              <KeyRound class="w-3.5 h-3.5" />
              <span>كلمة المرور</span>
            </button>

            <!-- 3. تفعيل / تعطيل الحساب -->
            <button
              type="button"
              class="h-8 px-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              :class="
                row.isActive
                  ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                  : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
              "
              :title="row.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'"
              @click="toggleUserStatus(row)"
            >
              <span>{{ row.isActive ? 'تعطيل' : 'تفعيل' }}</span>
            </button>

            <!-- 4. حذف الحساب نهائياً -->
            <button
              type="button"
              class="h-8 px-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              :title="`حذف حساب ${row.fullName} نهائياً`"
              @click="openDeleteConfirmation(row)"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          </div>
        </template>
      </AppTable>

      <!-- الباجينيشن المشترك المتوافق مع الثيم -->
      <AppPagination
        v-if="filteredUsers.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredUsers.length"
        :per-page-options="perPageOptions"
        item-label="حساب مسجل"
      />
    </div>

    <!-- 6. عرض الكروت البديل (Cards Grid View) -->
    <div v-else class="space-y-4">
      <div v-if="filteredUsers.length === 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <Users class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p class="font-bold text-slate-700 dark:text-slate-300">لا توجد حسابات مطابقة لخيارات البحث</p>
        <p class="text-xs text-slate-400 mt-1">جرب تعديل كلمات البحث لعرض الحسابات</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="user in paginatedUsers"
          :key="user.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between gap-3.5 hover:shadow-md transition-all relative overflow-hidden group"
        >
          <!-- خط الحالة العلوي -->
          <div
            class="absolute top-0 right-0 left-0 h-1"
            :class="user.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
          ></div>

          <div>
            <!-- رأس الكارت: الأفاتار والاسم والدور -->
            <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border"
                  :class="getRoleAvatarStyle(user.role)"
                >
                  {{ getUserInitials(user.fullName) }}
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" :title="user.fullName">
                    {{ user.fullName }}
                  </h3>
                  <div class="text-[11px] text-slate-400 font-mono truncate" dir="ltr" :title="user.email">
                    {{ user.email }}
                  </div>
                </div>
              </div>

              <!-- شارة الدور -->
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0"
                :class="getRoleBadgeStyle(user.role)"
              >
                {{ getRoleArabicLabel(user.role) }}
              </span>
            </div>

            <!-- تفاصيل الاتصال والحالة -->
            <div class="p-2.5 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone class="w-3.5 h-3.5 text-slate-400" />
                  <span>رقم الهاتف:</span>
                </span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200" dir="ltr">
                  {{ user.phone }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500 dark:text-slate-400">حالة الحساب:</span>
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                  :class="
                    user.isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  "
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="user.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ user.isActive ? 'مفعل ونشط' : 'معطل وموقوف' }}
                </span>
              </div>
            </div>
          </div>

          <!-- شريط الإجراءات والتحكم للكارت -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-1.5">
            <button
              type="button"
              class="h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="تعديل البيانات"
              @click="openUserModal(user)"
            >
              <Edit class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span class="text-[11px]">تعديل</span>
            </button>

            <button
              type="button"
              class="h-8 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="تغيير كلمة المرور"
              @click="openChangePasswordModal(user)"
            >
              <KeyRound class="w-3.5 h-3.5" />
              <span class="text-[11px]">المرور</span>
            </button>

            <button
              type="button"
              class="h-8 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
              :class="
                user.isActive
                  ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                  : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
              "
              :title="user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'"
              @click="toggleUserStatus(user)"
            >
              <span class="text-[11px]">{{ user.isActive ? 'تعطيل' : 'تفعيل' }}</span>
            </button>

            <button
              type="button"
              class="h-8 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="حذف الحساب"
              @click="openDeleteConfirmation(user)"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span class="text-[11px]">حذف</span>
            </button>
          </div>
        </article>
      </div>

      <!-- باجينيشن شبكة الكروت -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
        <AppPagination
          v-if="filteredUsers.length > 0"
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredUsers.length"
          :per-page-options="perPageOptions"
          item-label="حساب مسجل"
        />
      </div>
    </div>

    <!-- 7. نافذة إضافة وتعديل الحساب -->
    <BaseModal
      v-model="isUserModalOpen"
      :title="isEditing ? 'تعديل بيانات الحساب والصلاحية' : 'إضافة حساب جديد بالمنظومة'"
      max-width="md"
    >
      <form id="userForm" class="space-y-4" @submit.prevent="saveUser">
        <BaseInput
          v-model="formData.fullName"
          label="الاسم بالكامل (ثلاثي أو رباعي)"
          placeholder="مثال: أحمد طارق محمود"
          required
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="formData.email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="name@m3hd.edu.eg أو بريد شخصي"
            required
          />

          <BaseInput
            v-model="formData.phone"
            type="text"
            label="رقم الهاتف المحمول"
            placeholder="010XXXXXXXX"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
            الدور الوظيفي والصلاحية <span class="text-rose-500">*</span>
          </label>
          <Select
            v-model="formData.role"
            :options="allRolesSelectOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="اختر الصلاحية"
            class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
          />
        </div>

        <div class="flex items-center gap-2.5 pt-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            id="isActiveCheckbox"
            v-model="formData.isActive"
            type="checkbox"
            class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 cursor-pointer"
          />
          <label for="isActiveCheckbox" class="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            الحساب مفعل ومصرح له بالدخول للمنظومة
          </label>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="isUserModalOpen = false">
          إلغاء
        </BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          class="!bg-primary-600 hover:!bg-primary-700 text-white"
          type="submit"
          form="userForm"
        >
          حفظ البيانات
        </BaseButton>
      </template>
    </BaseModal>

    <!-- 8. نافذة تغيير كلمة المرور الآمنة -->
    <BaseModal
      v-model="isChangePasswordModalOpen"
      title="تعديل وتعيين كلمة المرور للحساب"
      max-width="md"
    >
      <form id="changePasswordForm" class="space-y-4" @submit.prevent="saveNewPassword">
        <!-- بيانات المستخدم المستهدف -->
        <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-200/60 dark:border-amber-800/60">
            <KeyRound class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100">
              {{ targetUserForPassword?.fullName }}
            </h4>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {{ targetUserForPassword?.email }}
              </span>
              <span class="text-[10px] px-1.5 py-0.2 rounded font-bold border" :class="getRoleBadgeStyle(targetUserForPassword?.role)">
                {{ getRoleArabicLabel(targetUserForPassword?.role) }}
              </span>
            </div>
          </div>
        </div>

        <!-- حقل كلمة المرور الجديدة -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            كلمة المرور الجديدة <span class="text-rose-500">*</span>
          </label>
          <div class="relative flex items-center">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="أدخل كلمة مرور قوية (8 أحرف على الأقل)"
              class="w-full h-10 pr-3.5 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
              required
            />
            <button
              type="button"
              class="absolute left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              @click="showNewPassword = !showNewPassword"
            >
              <EyeOff v-if="showNewPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <!-- مؤشر قوة كلمة المرور -->
          <div class="mt-2 flex items-center gap-1.5">
            <div class="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <div
                class="h-full transition-all duration-300"
                :class="passwordStrengthColor"
                :style="{ width: `${passwordStrengthPercent}%` }"
              ></div>
            </div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {{ passwordStrengthLabel }}
            </span>
          </div>
        </div>

        <!-- حقل تأكيد كلمة المرور -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            تأكيد كلمة المرور <span class="text-rose-500">*</span>
          </label>
          <div class="relative flex items-center">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="أعد إدخال كلمة المرور للتأكيد"
              class="w-full h-10 pr-3.5 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
              required
            />
            <button
              type="button"
              class="absolute left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="confirmPassword && !isPasswordMatching" class="text-[11px] text-rose-500 font-bold mt-1 flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" />
            <span>كلمة المرور وتأكيدها غير متطابقين.</span>
          </p>
          <p v-else-if="confirmPassword && isPasswordMatching" class="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>كلمتا المرور متطابقتان.</span>
          </p>
        </div>

        <!-- رسالة نجاح الحفظ -->
        <div v-if="passwordSuccessMessage" class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-center">
          {{ passwordSuccessMessage }}
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="isChangePasswordModalOpen = false">
          إلغاء
        </BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          class="!bg-primary-600 hover:!bg-primary-700 text-white"
          type="submit"
          form="changePasswordForm"
          :disabled="!isPasswordValid"
        >
          تحديث كلمة المرور
        </BaseButton>
      </template>
    </BaseModal>

    <!-- 9. نافذة تأكيد حذف الحساب نهائياً -->
    <BaseModal
      v-model="isDeleteModalOpen"
      title="تأكيد حذف الحساب نهائياً"
      max-width="sm"
    >
      <div class="space-y-3">
        <div class="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <div class="text-center">
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">
            هل أنت متأكد من رغبتك في حذف هذا الحساب؟
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            سيتم إزالة حساب 
            <strong class="text-slate-800 dark:text-slate-200 block mt-1 font-bold">{{ userToDelete?.fullName }}</strong>
            ({{ userToDelete?.email }}) [{{ getRoleArabicLabel(userToDelete?.role) }}] نهائياً من المنظومة ولا يمكن التراجع عن هذه العملية.
          </p>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="isDeleteModalOpen = false">
          إلغاء التراجع
        </BaseButton>
        <BaseButton
          variant="danger"
          size="sm"
          @click="confirmDeleteUser"
        >
          تأكيد الحذف النهائي
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Plus,
  Search,
  RotateCcw,
  X,
  Edit,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Phone,
} from 'lucide-vue-next';

import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import BaseButton from '@/shared/ui/Buttons/BaseButton.vue';
import BaseInput from '@/shared/ui/Inputs/BaseInput.vue';
import BaseModal from '@/shared/ui/Modals/BaseModal.vue';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import Select from 'primevue/select';

import { ROLES, ROLE_LABELS } from '@/shared/constants/roles';

// نمط العرض: جدول أو شبكة كروت
const viewMode = ref(typeof window !== 'undefined' && window.innerWidth < 1024 ? 'grid' : 'table');

// حسابات المنظومة (طاقم العمل والمسؤولين والمتدربين)
const users = ref([
  {
    id: 1,
    fullName: 'م/ أحمد طارق السعيد',
    email: 'ahmed.tarek@m3hd.edu.eg',
    phone: '01012345678',
    role: ROLES.ADMIN,
    isActive: true,
  },
  {
    id: 2,
    fullName: 'لواء أ.ح / شريف منصور',
    email: 'sherif.mansour@m3hd.edu.eg',
    phone: '01123456789',
    role: ROLES.COMMANDER,
    isActive: true,
  },
  {
    id: 3,
    fullName: 'أ/ محمود عبد الرحمن',
    email: 'mahmoud.abdelrahman@m3hd.edu.eg',
    phone: '01234567890',
    role: ROLES.AFFAIRS,
    isActive: true,
  },
  {
    id: 4,
    fullName: 'نقيب / خالد عبد العزيز',
    email: 'khaled.aziz@m3hd.edu.eg',
    phone: '01543216789',
    role: ROLES.SECURITY,
    isActive: true,
  },
  {
    id: 5,
    fullName: 'أ/ سارة إبراهيم فتحي',
    email: 'sara.ibrahim@m3hd.edu.eg',
    phone: '01098765432',
    role: ROLES.AFFAIRS,
    isActive: true,
  },
  {
    id: 6,
    fullName: 'رائد / حسام مصطفى',
    email: 'hossam.mostafa@m3hd.edu.eg',
    phone: '01187654321',
    role: ROLES.SECURITY,
    isActive: false,
  },
  // حسابات المتدربين المسجلين
  {
    id: 7,
    fullName: 'محمد إبراهيم حسن',
    email: 'mohamed.ibrahim@gmail.com',
    phone: '01011223344',
    role: ROLES.TRAINEE,
    isActive: true,
  },
  {
    id: 8,
    fullName: 'كريم وائل المنشاوي',
    email: 'karim.wael@yahoo.com',
    phone: '01144556677',
    role: ROLES.TRAINEE,
    isActive: true,
  },
  {
    id: 9,
    fullName: 'سارة عبد الله الشافعي',
    email: 'sara.abdallah@outlook.com',
    phone: '01288990011',
    role: ROLES.TRAINEE,
    isActive: true,
  },
  {
    id: 10,
    fullName: 'أحمد محمود القاضي',
    email: 'ahmed.kadi@gmail.com',
    phone: '01556677889',
    role: ROLES.TRAINEE,
    isActive: false,
  },
]);

// أعمدة الجدول
const columns = [
  { key: 'fullName', label: 'اسم المستخدم والبريد الإلكتروني' },
  { key: 'phone', label: 'رقم الهاتف', cellClass: 'whitespace-nowrap' },
  { key: 'role', label: 'الدور والصلاحية', cellClass: 'whitespace-nowrap' },
  { key: 'status', label: 'حالة الحساب', cellClass: 'whitespace-nowrap' },
  { key: 'actions', label: 'الإجراءات والتحكم', align: 'center', cellClass: 'whitespace-nowrap' },
];

const searchQuery = ref('');
const statusTab = ref('all');
const selectedRole = ref(null);
const isRefreshing = ref(false);

const currentPage = ref(1);
const itemsPerPage = ref(10);

const perPageOptions = [
  { label: '5 حسابات', value: 5 },
  { label: '10 حسابات', value: 10 },
  { label: '20 حساب', value: 20 },
];

const isUserModalOpen = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  fullName: '',
  email: '',
  phone: '',
  role: ROLES.TRAINEE,
  isActive: true,
});

// نافذة تعديل كلمة المرور
const isChangePasswordModalOpen = ref(false);
const targetUserForPassword = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordSuccessMessage = ref('');

// نافذة تأكيد الحذف
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);

// خيارات الأدوار الكاملة
const allRolesSelectOptions = [
  { value: ROLES.ADMIN, label: 'مسؤول النظام (Admin)' },
  { value: ROLES.AFFAIRS, label: 'شؤون الدارسين (Affairs)' },
  { value: ROLES.SECURITY, label: 'الأمن والحراسة (Security)' },
  { value: ROLES.COMMANDER, label: 'القيادة العليا (Commander)' },
  { value: ROLES.TRAINEE, label: 'متدرب / دارس (Trainee)' },
];

const roleFilterOptions = [...allRolesSelectOptions];

const hasActiveFilters = computed(() => {
  return Boolean(searchQuery.value.trim()) || statusTab.value !== 'all' || selectedRole.value !== null;
});

function clearFilters() {
  searchQuery.value = '';
  statusTab.value = 'all';
  selectedRole.value = null;
  currentPage.value = 1;
}

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const tab = statusTab.value;
  const role = selectedRole.value;

  return users.value.filter((user) => {
    const matchQ =
      !q ||
      user.fullName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.includes(q);

    let matchTab = true;
    if (tab === 'staff') {
      matchTab = user.role !== ROLES.TRAINEE;
    } else if (tab === 'trainees') {
      matchTab = user.role === ROLES.TRAINEE;
    } else if (tab === 'inactive') {
      matchTab = !user.isActive;
    }

    const matchRole = !role || user.role === role;

    return matchQ && matchTab && matchRole;
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

// إحصائيات الكروت
const traineesCount = computed(
  () => users.value.filter((u) => u.role === ROLES.TRAINEE).length
);
const activeStaffCount = computed(
  () => users.value.filter((u) => u.isActive && u.role !== ROLES.TRAINEE).length
);
const staffOnlyCount = computed(
  () => users.value.filter((u) => u.role !== ROLES.TRAINEE).length
);
const disabledCount = computed(() => users.value.filter((u) => !u.isActive).length);

// حساب قوة كلمة المرور والتحقق
const passwordStrengthPercent = computed(() => {
  const pwd = newPassword.value;
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score += 40;
  if (/[A-Z]/.test(pwd)) score += 20;
  if (/[0-9]/.test(pwd)) score += 20;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
  return Math.min(100, score);
});

const passwordStrengthColor = computed(() => {
  const pct = passwordStrengthPercent.value;
  if (pct < 40) return 'bg-rose-500';
  if (pct < 80) return 'bg-amber-500';
  return 'bg-emerald-600';
});

const passwordStrengthLabel = computed(() => {
  const pct = passwordStrengthPercent.value;
  if (pct === 0) return 'أدخل كلمة المرور';
  if (pct < 40) return 'ضعيفة جداً';
  if (pct < 80) return 'متوسطة';
  return 'قوية ومثالية';
});

const isPasswordMatching = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value === confirmPassword.value;
});

const isPasswordValid = computed(() => {
  return newPassword.value.length >= 8 && isPasswordMatching.value;
});

function refreshData() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 400);
}

function getUserInitials(name) {
  if (!name) return '—';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]} ${parts[1][0]}`;
  return parts[0].slice(0, 2);
}

function getRoleArabicLabel(role) {
  return ROLE_LABELS[role] || role;
}

function getRoleBadgeStyle(role) {
  switch (role) {
    case ROLES.ADMIN:
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300';
    case ROLES.COMMANDER:
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300';
    case ROLES.AFFAIRS:
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300';
    case ROLES.SECURITY:
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300';
    case ROLES.TRAINEE:
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
  }
}

function getRoleAvatarStyle(role) {
  switch (role) {
    case ROLES.ADMIN:
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/60 dark:text-purple-200';
    case ROLES.COMMANDER:
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/60 dark:text-amber-200';
    case ROLES.AFFAIRS:
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200';
    case ROLES.SECURITY:
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/60 dark:text-blue-200';
    case ROLES.TRAINEE:
      return 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/60 dark:text-sky-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
  }
}

function openUserModal(user = null) {
  if (user) {
    isEditing.value = true;
    formData.value = { ...user };
  } else {
    isEditing.value = false;
    formData.value = {
      id: null,
      fullName: '',
      email: '',
      phone: '',
      role: ROLES.TRAINEE,
      isActive: true,
    };
  }
  isUserModalOpen.value = true;
}

function toggleUserStatus(user) {
  user.isActive = !user.isActive;
}

function saveUser() {
  if (!formData.value.fullName || !formData.value.email) return;

  if (isEditing.value && formData.value.id) {
    const idx = users.value.findIndex((u) => u.id === formData.value.id);
    if (idx !== -1) {
      users.value[idx] = { ...formData.value };
    }
  } else {
    const newId = users.value.length ? Math.max(...users.value.map((u) => u.id)) + 1 : 1;
    users.value.unshift({ ...formData.value, id: newId });
  }

  isUserModalOpen.value = false;
}

function openChangePasswordModal(user) {
  targetUserForPassword.value = user;
  newPassword.value = '';
  confirmPassword.value = '';
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  passwordSuccessMessage.value = '';
  isChangePasswordModalOpen.value = true;
}

function saveNewPassword() {
  if (!isPasswordValid.value) return;

  passwordSuccessMessage.value = `تم بنجاح تغيير وتحديث كلمة المرور لحساب (${targetUserForPassword.value.fullName})`;
  setTimeout(() => {
    isChangePasswordModalOpen.value = false;
    passwordSuccessMessage.value = '';
  }, 1200);
}

// إجراء حذف الحساب
function openDeleteConfirmation(user) {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
}

function confirmDeleteUser() {
  if (!userToDelete.value) return;
  users.value = users.value.filter((u) => u.id !== userToDelete.value.id);
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
}
</script>
