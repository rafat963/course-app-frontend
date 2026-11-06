<!--
  Component: AdminHallsView.vue
  Description: Halls Management strictly managing lecture halls (قاعات فقط).
  All lab (معامل) references, types, and tabs have been removed.
  Uses AppKpiCard, status capsules, search input, PrimeVue Select for filtering, AppTable, AppPagination, and ViewModeToggle.
-->
<template>
  <div class="space-y-4 select-none pb-8" dir="rtl">
    <!-- 1. رأس الصفحة (Header) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 flex items-center justify-center border border-primary-200/60 dark:border-primary-800/60 shrink-0">
          <Building2 class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              إدارة القاعات الدراسية
            </h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              قاعات المحاضرات
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إضافة وتعديل بيانات قاعات المحاضرات وإدارة السعات الاستيعابية وتتبع جاهزيتها
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/admin/halls-schedule"
          class="h-9 px-3.5 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/70 hover:bg-primary-100 dark:hover:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <CalendarDays class="w-3.5 h-3.5" />
          <span>الجدول الشهري لإشغال القاعات</span>
        </RouterLink>

        <button
          type="button"
          class="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="refreshData"
        >
          <RotateCcw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
          <span>تحديث القاعات</span>
        </button>

        <button
          type="button"
          class="h-9 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          @click="openModal()"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>إضافة قاعة جديدة</span>
        </button>
      </div>
    </div>

    <!-- 2. كروت المؤشرات السريعة (AppKpiCard) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AppKpiCard
        title="إجمالي قاعات المحاضرات"
        :value="halls.length"
        badge="قاعة مسجلة"
        badge-class="text-slate-500 dark:text-slate-400 font-bold"
        icon-bg="bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
      >
        <template #icon>
          <Building2 class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="إجمالي السعة المقعدية"
        :value="`${totalCapacity} مقعد`"
        :badge="`متوسط: ${avgCapacity} مقعد`"
        badge-class="text-blue-600 dark:text-blue-400 font-bold"
        icon-bg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
      >
        <template #icon>
          <Users class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="القاعات المتاحة والنشطة"
        :value="`${activeCount} قاعات`"
        badge="جاهزة للدورات"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
      >
        <template #icon>
          <CheckCircle2 class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="القاعات المعطلة / صيانة"
        :value="`${halls.length - activeCount} قاعات`"
        badge="خارج الخدمة"
        badge-class="text-rose-500 font-bold"
        icon-bg="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
      >
        <template #icon>
          <Sliders class="w-5 h-5" />
        </template>
      </AppKpiCard>
    </div>

    <!-- 3. شريط تبويبات الحالة السريعة ومحول العرض المشترك -->
    <div class="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-2 transition-colors">
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
        <!-- كافة القاعات -->
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
          <span>كافة القاعات</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'all' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ halls.length }}
          </span>
        </button>

        <!-- القاعات المفعلة -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            statusTab === 'active'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
          "
          @click="statusTab = 'active'"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span>القاعات الجاهزة والمفعلة</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ activeCount }}
          </span>
        </button>

        <!-- القاعات المعطلة -->
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
          <span>قيد الصيانة / معطلة</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="statusTab === 'inactive' ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ halls.length - activeCount }}
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
          القاعات المعروضة: <strong class="text-slate-800 dark:text-slate-200">{{ filteredHalls.length }}</strong>
        </div>
      </div>
    </div>

    <!-- 4. شريط البحث والفلترة الفوري مع PrimeVue Select -->
    <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3 transition-colors">
      <!-- حقل البحث النصي -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث باسم القاعة، أو الموقع الجغرافي داخل المعهد..."
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

      <!-- فلتر الحالة التشغيلية باستخدام PrimeVue Select -->
      <div class="w-full sm:w-56">
        <Select
          v-model="selectedStatus"
          :options="statusFilterOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="الحالة التشغيلية"
          showClear
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
        />
      </div>

      <!-- زر تفريغ الفلاتر -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        title="تفريغ البحث والعودة لكافة القاعات"
        @click="clearFilters"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>تفريغ البحث</span>
      </button>
    </div>

    <!-- 5. عرض الجدول الرئيسي (Table View) متوافق تماماً مع AppTable و AppPagination -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden transition-colors">
      <AppTable
        :columns="columns"
        :data="paginatedHalls"
        :is-filtered="hasActiveFilters"
        empty-title="لا توجد قاعات مطابقة لمعايير البحث الحالية"
        empty-text="جرّب تعديل كلمات البحث أو تفريغ الفلاتر لعرض كافة قاعات المعهد"
        @clear-filters="clearFilters"
      >
        <!-- اسم القاعة والرمز -->
        <template #name="{ row }">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800">
              <Building2 class="w-4 h-4" />
            </div>
            <div class="min-w-0">
              <div class="font-bold text-slate-800 dark:text-white truncate max-w-[200px]" :title="row.name">
                {{ row.name }}
              </div>
              <div class="text-[11px] text-slate-400 dark:text-slate-400 font-mono mt-0.5">
                كود: HALL-0{{ row.id }}
              </div>
            </div>
          </div>
        </template>

        <!-- تصنيف القاعة -->
        <template #type>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-800">
            قاعة دراسية
          </span>
        </template>

        <!-- الموقع الجغرافي -->
        <template #location="{ row }">
          <span class="text-slate-600 dark:text-slate-300 text-xs font-medium truncate max-w-[170px] block" :title="row.location">
            {{ row.location || '—' }}
          </span>
        </template>

        <!-- السعة والاستيعاب -->
        <template #capacity="{ row }">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
              {{ row.maxCapacity }} مقعد
            </span>
            <div class="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden hidden sm:block">
              <div
                class="h-full rounded-full"
                :class="getOccupancyBarStyle(row)"
                :style="{ width: `${getOccupancyPercentage(row)}%` }"
              ></div>
            </div>
          </div>
        </template>

        <!-- الحالة التشغيلية -->
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
            {{ row.isActive ? 'جاهزة ومتاحة' : 'معطلة / صيانة' }}
          </span>
        </template>

        <!-- الإجراءات -->
        <template #actions="{ row }">
          <div class="flex items-center justify-center gap-1.5">
            <RouterLink
              :to="{ path: '/admin/halls-schedule', query: { hallId: row.id } }"
              class="h-8 px-2.5 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/60 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="عرض الجدول الشهري ومواعيد إشغال هذه القاعة"
            >
              <CalendarDays class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>الجدول الشهري</span>
            </RouterLink>

            <button
              type="button"
              class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="تعديل بيانات القاعة"
              @click="openModal(row)"
            >
              <Edit class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>تعديل</span>
            </button>

            <button
              type="button"
              class="h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              :class="
                row.isActive
                  ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                  : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
              "
              @click="toggleStatus(row)"
            >
              <span>{{ row.isActive ? 'تعطيل' : 'تفعيل' }}</span>
            </button>
          </div>
        </template>
      </AppTable>

      <!-- الباجينيشن المشترك المتوافق مع الثيم -->
      <AppPagination
        v-if="filteredHalls.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-items="filteredHalls.length"
        :per-page-options="perPageOptions"
        item-label="قاعة"
      />
    </div>

    <!-- 6. عرض الكروت البديل (Cards Grid View) -->
    <div v-else class="space-y-4">
      <div v-if="filteredHalls.length === 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <Building2 class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p class="font-bold text-slate-700 dark:text-slate-300">لا توجد قاعات مطابقة لخيارات البحث</p>
        <p class="text-xs text-slate-400 mt-1">جرب تعديل كلمات البحث لعرض القاعات</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="hall in paginatedHalls"
          :key="hall.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col justify-between gap-3.5 hover:shadow-md transition-all relative overflow-hidden"
        >
          <!-- خط الحالة العلوي -->
          <div
            class="absolute top-0 right-0 left-0 h-1"
            :class="hall.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
          ></div>

          <div>
            <!-- رأس الكارت: اسم القاعة + شارة التصنيف -->
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {{ hall.name }}
                </h3>
                <span class="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  {{ hall.location || '—' }}
                </span>
              </div>

              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 border bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-800">
                قاعة محاضرات
              </span>
            </div>

            <!-- قائمة الخصائص -->
            <dl class="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
              <dt class="text-slate-400">التصنيف:</dt>
              <dd class="font-semibold text-slate-700 dark:text-slate-200">
                قاعة محاضرات وتدريب نظري
              </dd>

              <dt class="text-slate-400">الموقع:</dt>
              <dd class="font-semibold text-slate-700 dark:text-slate-200 truncate" :title="hall.location">
                {{ hall.location || '—' }}
              </dd>

              <dt class="text-slate-400">الحالة التشغيلية:</dt>
              <dd>
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border"
                  :class="
                    hall.isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  "
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="hall.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ hall.isActive ? 'مفعلة ومتاحة' : 'معطلة / صيانة' }}
                </span>
              </dd>

              <dt class="text-slate-400">السعة القصوى:</dt>
              <dd class="font-mono font-bold text-slate-900 dark:text-slate-100">
                {{ hall.maxCapacity }} مقعد
              </dd>
            </dl>

            <!-- شريط مقاعد الاستيعاب -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between text-[11px] mb-1.5">
                <span class="text-slate-400">مؤشر الاستيعاب التقديري</span>
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {{ hall.currentOccupancy || Math.round(hall.maxCapacity * 0.75) }} من {{ hall.maxCapacity }} مقعد
                </span>
              </div>
              <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="getOccupancyBarStyle(hall)"
                  :style="{ width: `${getOccupancyPercentage(hall)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- شريط الإجراءات السفلي للكارت -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
            <span
              class="text-[11px] font-semibold px-2 py-0.5 rounded-md"
              :class="
                hall.isActive
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              "
            >
              {{ hall.isActive ? 'جاهزة للتدريب' : 'خارج الخدمة' }}
            </span>

            <div class="flex items-center gap-1.5">
              <RouterLink
                :to="{ path: '/admin/halls-schedule', query: { hallId: hall.id } }"
                class="h-8 px-2.5 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/60 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="عرض الجدول الشهري ومواعيد إشغال هذه القاعة"
              >
                <CalendarDays class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                <span>الجدول الشهري</span>
              </RouterLink>

              <button
                type="button"
                class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                @click="openModal(hall)"
              >
                <Edit class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                <span>تعديل</span>
              </button>

              <button
                type="button"
                class="h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                :class="
                  hall.isActive
                    ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                    : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                "
                @click="toggleStatus(hall)"
              >
                <span>{{ hall.isActive ? 'تعطيل' : 'تفعيل' }}</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- باجينيشن الكروت -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
        <AppPagination
          v-if="filteredHalls.length > 0"
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredHalls.length"
          :per-page-options="perPageOptions"
          item-label="قاعة"
        />
      </div>
    </div>

    <!-- 7. نافذة إضافة وتعديل القاعة باستخدام BaseModal المعتمد -->
    <BaseModal
      v-model="isModalOpen"
      :title="isEditing ? 'تعديل بيانات القاعة' : 'إضافة قاعة دراسية جديدة'"
      max-width="md"
    >
      <form id="hallForm" class="space-y-4" @submit.prevent="saveHall">
        <BaseInput
          v-model="formData.name"
          label="اسم القاعة الدراسية"
          placeholder="مثال: قاعة 1 (المدرج العام)"
          required
        />

        <BaseInput
          v-model.number="formData.maxCapacity"
          type="number"
          label="السعة القصوى (مقعد)"
          placeholder="30"
          required
        />

        <BaseInput
          v-model="formData.location"
          label="الموقع الجغرافي داخل المعهد"
          placeholder="مثال: المبنى الرئيسي - الدور الأول"
          required
        />

        <div class="flex items-center gap-2.5 pt-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            id="hallIsActiveCheckbox"
            v-model="formData.isActive"
            type="checkbox"
            class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 cursor-pointer"
          />
          <label for="hallIsActiveCheckbox" class="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            القاعة مفعلة وجاهزة لاستضافة دورات الانعقاد والمحاضرات
          </label>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="isModalOpen = false">
          إلغاء
        </BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          class="!bg-primary-600 hover:!bg-primary-700 text-white"
          type="submit"
          form="hallForm"
        >
          حفظ البيانات
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Building2,
  Users,
  CheckCircle2,
  Sliders,
  Plus,
  Search,
  Edit,
  RotateCcw,
  X,
  CalendarDays,
} from 'lucide-vue-next';

// استيراد مكونات الـ UI المشتركة
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import BaseButton from '@/shared/ui/Buttons/BaseButton.vue';
import BaseInput from '@/shared/ui/Inputs/BaseInput.vue';
import BaseModal from '@/shared/ui/Modals/BaseModal.vue';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import Select from 'primevue/select';
import { INITIAL_HALLS } from '@/components/Affairs/components/AllCourses/helpers/courseMockData';

// بيانات القاعات والمعامل التدريبية المعتمدة وفق الـ ERD
const halls = ref([...INITIAL_HALLS]);

// حالة الفلترة والتنقل
const isRefreshing = ref(false);
const searchQuery = ref('');
const statusTab = ref('all'); // 'all' | 'active' | 'inactive'
const selectedStatus = ref(null);
const viewMode = ref(typeof window !== 'undefined' && window.innerWidth < 1024 ? 'grid' : 'table');

// باجينيشن
const currentPage = ref(1);
const itemsPerPage = ref(10);
const perPageOptions = [
  { label: '5 قاعات', value: 5 },
  { label: '10 قاعات', value: 10 },
  { label: '20 قاعة', value: 20 },
];

// إعدادات أعمدة جدول القاعات
const columns = [
  { key: 'name', label: 'اسم القاعة', headerClass: 'w-64' },
  { key: 'type', label: 'التصنيف', headerClass: 'w-36' },
  { key: 'location', label: 'الموقع الجغرافي داخل المعهد' },
  { key: 'capacity', label: 'السعة القصوى والاستيعاب', headerClass: 'w-48' },
  { key: 'status', label: 'الحالة التشغيلية', headerClass: 'w-36' },
  { key: 'actions', label: 'الإجراءات', align: 'center', headerClass: 'w-36' },
];

const statusFilterOptions = [
  { value: true, label: 'مفعلة وجاهزة' },
  { value: false, label: 'معطلة / صيانة' },
];

// مؤشر الفلاتر النشطة
const hasActiveFilters = computed(() => {
  return (
    Boolean(searchQuery.value.trim()) ||
    statusTab.value !== 'all' ||
    selectedStatus.value !== null
  );
});

function clearFilters() {
  searchQuery.value = '';
  statusTab.value = 'all';
  selectedStatus.value = null;
  currentPage.value = 1;
}

// التصفية الخاصة بالقاعات
const filteredHalls = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const tab = statusTab.value;
  const status = selectedStatus.value;

  return halls.value.filter((h) => {
    // بحث نصي
    const matchQ =
      !q ||
      h.name.toLowerCase().includes(q) ||
      (h.location && h.location.toLowerCase().includes(q));

    // شريط التبويبات
    const matchTab =
      tab === 'all' ||
      (tab === 'active' && h.isActive) ||
      (tab === 'inactive' && !h.isActive);

    // فلتر الحالة المنسدل
    const matchStatus = status === null || h.isActive === status;

    return matchQ && matchTab && matchStatus;
  });
});

// البيانات المقسمة لصفحات
const paginatedHalls = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredHalls.value.slice(start, start + itemsPerPage.value);
});

// إحصائيات
const totalCapacity = computed(() =>
  halls.value.reduce((sum, h) => sum + (Number(h.maxCapacity) || 0), 0)
);
const activeCount = computed(() => halls.value.filter((h) => h.isActive).length);
const avgCapacity = computed(() =>
  halls.value.length ? Math.round(totalCapacity.value / halls.value.length) : 0
);

function getOccupancyPercentage(hall) {
  const occ = hall.currentOccupancy !== undefined ? hall.currentOccupancy : Math.round(hall.maxCapacity * 0.75);
  return Math.min(100, Math.round((occ / hall.maxCapacity) * 100));
}

function getOccupancyBarStyle(hall) {
  const pct = getOccupancyPercentage(hall);
  if (pct > 90) return 'bg-rose-500';
  if (pct > 75) return 'bg-amber-500';
  return 'bg-primary-600 dark:bg-primary-500';
}

function refreshData() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 500);
}

// مودال القاعة
const isModalOpen = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  name: '',
  type: 'Hall',
  maxCapacity: 30,
  location: '',
  isActive: true,
});

function openModal(hall = null) {
  if (hall) {
    isEditing.value = true;
    formData.value = { ...hall };
  } else {
    isEditing.value = false;
    formData.value = {
      id: null,
      name: '',
      type: 'Hall',
      maxCapacity: 30,
      location: '',
      isActive: true,
    };
  }
  isModalOpen.value = true;
}

function toggleStatus(hall) {
  hall.isActive = !hall.isActive;
}

function saveHall() {
  if (!formData.value.name) return;

  if (isEditing.value && formData.value.id) {
    const idx = halls.value.findIndex((h) => h.id === formData.value.id);
    if (idx !== -1) {
      halls.value[idx] = { ...formData.value };
    }
  } else {
    const newId = halls.value.length ? Math.max(...halls.value.map((h) => h.id)) + 1 : 1;
    halls.value.unshift({
      ...formData.value,
      id: newId,
      currentOccupancy: Math.round(formData.value.maxCapacity * 0.6),
    });
  }

  isModalOpen.value = false;
}
</script>
