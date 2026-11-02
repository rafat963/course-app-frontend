<!--
  Component: AdminAuditLogsView.vue
  Description: Audit & Gate Logs Management using standard theme classes identical to AllCoursesFilters & Affairs pages.
  100% Dark & Light mode compatible, with ViewModeToggle (Table & Cards view) and an official printable / PDF report template for military/institute audit logs.
-->
<template>
  <div class="space-y-4 select-none pb-8" dir="rtl">
    <!-- 1. رأس الصفحة (Header) - مخفي عند الطباعة -->
    <div class="print:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 flex items-center justify-center border border-primary-200/60 dark:border-primary-800/60 shrink-0">
          <Shield class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              سجل التدقيق وحركات البوابة
            </h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              سجلات غير قابلة للتعديل
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            سجل العمليات الإدارية وتتبع تغيير حالات التسجيل وتدقيق مسح البوابة الإلكترونية
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
          <span>تحديث السجلات</span>
        </button>

        <button
          type="button"
          class="h-9 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          @click="printOfficialReport"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>طباعة / تصدير المستند (PDF)</span>
        </button>
      </div>
    </div>

    <!-- 2. كروت المؤشرات السريعة (AppKpiCard) - مخفية عند الطباعة -->
    <div class="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AppKpiCard
        title="إجمالي حركات التدقيق"
        :value="auditLogs.length"
        badge="عملية مسجلة"
        badge-class="text-emerald-700 dark:text-emerald-300 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
      >
        <template #icon>
          <History class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="إجمالي مسحات البوابة"
        :value="gateLogs.length"
        badge="حركة عبور"
        badge-class="text-blue-700 dark:text-blue-300 font-bold"
        icon-bg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
      >
        <template #icon>
          <QrCode class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="حركات دخول مسموح"
        :value="allowedGateCount"
        badge="اجتياز سليم"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
      >
        <template #icon>
          <CheckCircle2 class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="محاولات مرفوضة"
        :value="deniedGateCount"
        badge="تنبيه أمني"
        badge-class="text-rose-500 font-bold"
        icon-bg="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
      >
        <template #icon>
          <Ban class="w-5 h-5" />
        </template>
      </AppKpiCard>
    </div>

    <!-- 3. شريط تبويبات الحالة متطابق مع شاشات الشؤون ومحول طريقة العرض المشترك - مخفي عند الطباعة -->
    <div class="print:hidden p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-2 transition-colors">
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
        <!-- تبويب سجل التدقيق الإداري -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            activeTab === 'audit'
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          "
          @click="activeTab = 'audit'"
        >
          <FileText class="w-3.5 h-3.5" />
          <span>سجل التدقيق الإداري (AuditLogs)</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="activeTab === 'audit' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ auditLogs.length }}
          </span>
        </button>

        <!-- تبويب سجل حركات البوابة والأمن -->
        <button
          type="button"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="
            activeTab === 'gate'
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          "
          @click="activeTab = 'gate'"
        >
          <QrCode class="w-3.5 h-3.5" />
          <span>سجل حركات البوابة والأمن (GateLogs)</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="activeTab === 'gate' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'"
          >
            {{ gateLogs.length }}
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
          السجلات المعروضة:
          <strong class="text-slate-800 dark:text-slate-200">
            {{ activeTab === 'audit' ? filteredAuditLogs.length : filteredGateLogs.length }}
          </strong>
        </div>
      </div>
    </div>

    <!-- 4. شريط البحث والفلترة الفوري - مخفي عند الطباعة -->
    <div class="print:hidden p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3 transition-colors">
      <!-- حقل البحث النصي -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-if="activeTab === 'audit'"
          v-model="auditSearchQuery"
          type="text"
          placeholder="ابحث برقم الطلب، اسم المتدرب، أو المسؤول عن التغيير..."
          class="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
        />
        <input
          v-else
          v-model="gateSearchQuery"
          type="text"
          placeholder="ابحث برمز العبور QR، المتدرب، أو حارس الأمن، أو السبب..."
          class="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
        />
        <button
          v-if="(activeTab === 'audit' && auditSearchQuery) || (activeTab === 'gate' && gateSearchQuery)"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          @click="activeTab === 'audit' ? (auditSearchQuery = '') : (gateSearchQuery = '')"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- فلاتر منسدلة باستخدام PrimeVue Select -->
      <div v-if="activeTab === 'audit'" class="w-full sm:w-56">
        <Select
          v-model="selectedAuditStatus"
          :options="auditStatusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="تصفية حسب الحالة الجديدة"
          showClear
          class="w-full text-xs font-bold rounded-xl h-10 flex items-center"
        />
      </div>

      <div v-if="activeTab === 'gate'" class="flex items-center gap-2 w-full sm:w-auto">
        <Select
          v-model="selectedGateDecision"
          :options="decisionOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="القرار (مسموح / مرفوض)"
          showClear
          class="w-full sm:w-48 text-xs font-bold rounded-xl h-10 flex items-center"
        />
        <Select
          v-model="selectedGateLocation"
          :options="gateLocationOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="موقع البوابة"
          showClear
          class="w-full sm:w-48 text-xs font-bold rounded-xl h-10 flex items-center"
        />
      </div>

      <!-- زر تفريغ الفلاتر -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        title="تفريغ البحث والعودة لكافة السجلات"
        @click="clearFilters"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>تفريغ البحث</span>
      </button>
    </div>

    <!-- ==================== TAB 1: SYSTEM AUDIT LOGS ==================== -->
    <div v-if="activeTab === 'audit'" class="print:hidden">
      <!-- عرض الجدول -->
      <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <AppTable
          :columns="auditColumns"
          :data="paginatedAuditLogs"
          :is-filtered="hasActiveFilters"
          empty-title="لا توجد حركات تدقيق مطابقة لمعايير البحث"
          empty-text="جرّب تعديل نص البحث أو تفريغ خيارات الفلترة لعرض كافة الحركات"
          @clear-filters="clearFilters"
        >
          <template #id="{ value }">
            <span class="font-mono text-slate-400 dark:text-slate-500">{{ value }}</span>
          </template>

          <template #applicationId="{ row }">
            <div class="font-mono font-bold text-primary-700 dark:text-primary-400">
              {{ row.applicationId }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {{ row.traineeName }}
            </div>
          </template>

          <template #fromStatus="{ row }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
              :class="getStatusBadgeClass(row.fromStatus)"
            >
              {{ getStatusLabel(row.fromStatus) }}
            </span>
          </template>

          <template #toStatus="{ row }">
            <div class="flex items-center gap-1.5">
              <ArrowLeft class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                :class="getStatusBadgeClass(row.toStatus)"
              >
                {{ getStatusLabel(row.toStatus) }}
              </span>
            </div>
          </template>

          <template #changedByUserName="{ row }">
            <div class="font-semibold text-slate-800 dark:text-slate-100">
              {{ row.changedByUserName }}
            </div>
            <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
              {{ row.userRole }}
            </div>
          </template>

          <template #changedAt="{ row }">
            <div class="font-mono text-xs text-slate-700 dark:text-slate-300">
              {{ formatDateTime(row.changedAt) }}
            </div>
          </template>

          <template #notes="{ row }">
            <span class="text-slate-600 dark:text-slate-300 text-xs">
              {{ row.notes || '—' }}
            </span>
          </template>
        </AppTable>

        <!-- شريط الباجينيشن المشترك -->
        <AppPagination
          v-if="filteredAuditLogs.length > 0"
          v-model:current-page="auditCurrentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredAuditLogs.length"
          :per-page-options="perPageOptions"
          item-label="حركة"
        />
      </div>

      <!-- عرض الكروت -->
      <div v-else class="space-y-4">
        <div v-if="filteredAuditLogs.length === 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <History class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p class="font-bold text-slate-700 dark:text-slate-300">لا توجد حركات تدقيق مطابقة للبحث</p>
          <p class="text-xs text-slate-400 mt-1">جرّب تفريغ خيارات الفلترة لعرض السجلات</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="log in paginatedAuditLogs"
            :key="log.id"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between gap-3 hover:shadow-md transition-all relative overflow-hidden"
          >
            <!-- شريط علوي -->
            <div class="absolute top-0 right-0 left-0 h-1 bg-primary-600"></div>

            <div>
              <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="font-mono font-bold text-xs text-primary-700 dark:text-primary-400">
                    {{ log.applicationId }}
                  </div>
                  <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5">
                    {{ log.traineeName }}
                  </h4>
                </div>
                <span class="font-mono text-[10px] text-slate-400">#{{ log.id }}</span>
              </div>

              <!-- مسار تغيير الحالة -->
              <div class="my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span class="text-[11px] px-2 py-0.5 rounded-full border" :class="getStatusBadgeClass(log.fromStatus)">
                  {{ getStatusLabel(log.fromStatus) }}
                </span>
                <ArrowLeft class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="text-[11px] px-2 py-0.5 rounded-full border" :class="getStatusBadgeClass(log.toStatus)">
                  {{ getStatusLabel(log.toStatus) }}
                </span>
              </div>

              <!-- المسؤول والتاريخ -->
              <div class="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div class="flex items-center justify-between">
                  <span>المسؤول:</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ log.changedByUserName }} ({{ log.userRole }})</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>التوقيت:</span>
                  <span class="font-mono text-[11px] text-slate-700 dark:text-slate-300">{{ formatDateTime(log.changedAt) }}</span>
                </div>
              </div>

              <!-- الملاحظات -->
              <div v-if="log.notes" class="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ log.notes }}
              </div>
            </div>
          </article>
        </div>

        <!-- باجينيشن الكروت -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
          <AppPagination
            v-if="filteredAuditLogs.length > 0"
            v-model:current-page="auditCurrentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="filteredAuditLogs.length"
            :per-page-options="perPageOptions"
            item-label="حركة"
          />
        </div>
      </div>
    </div>

    <!-- ==================== TAB 2: GATE LOGS & SECURITY SCANS ==================== -->
    <div v-if="activeTab === 'gate'" class="print:hidden">
      <!-- عرض الجدول -->
      <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <AppTable
          :columns="gateColumns"
          :data="paginatedGateLogs"
          :is-filtered="hasActiveFilters"
          empty-title="لا توجد حركات مسح بوابة مطابقة للبحث"
          empty-text="جرّب تعديل كلمات البحث أو تصفية القرارات لعرض السجلات"
          @clear-filters="clearFilters"
        >
          <template #id="{ value }">
            <span class="font-mono text-slate-400 dark:text-slate-500">{{ value }}</span>
          </template>

          <template #qrToken="{ row }">
            <div class="font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <QrCode class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>{{ row.qrToken }}</span>
            </div>
            <div class="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
              {{ row.applicationId }}
            </div>
          </template>

          <template #traineeName="{ row }">
            <div class="font-bold text-slate-800 dark:text-slate-100">
              {{ row.traineeName }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]" :title="row.courseTitle">
              {{ row.courseTitle }}
            </div>
          </template>

          <template #gateLocation="{ row }">
            <span class="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-xs">
              <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {{ row.gateLocation }}
            </span>
          </template>

          <template #decision="{ row }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              :class="
                row.decision === 'Allowed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              "
            >
              {{ row.decision === 'Allowed' ? 'مسموح بالدخول' : 'مرفوض العبور' }}
            </span>
          </template>

          <template #reason="{ row }">
            <div
              class="font-medium text-xs"
              :class="row.decision === 'Allowed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
            >
              {{ row.reason }}
            </div>
          </template>

          <template #scannedByUserName="{ row }">
            <div class="font-semibold text-slate-800 dark:text-slate-100">
              {{ row.scannedByUserName }}
            </div>
            <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              أمن البوابة
            </div>
          </template>

          <template #scannedAt="{ row }">
            <div class="font-mono text-xs text-slate-700 dark:text-slate-300">
              {{ formatTimeOnly(row.scannedAt) }}
            </div>
            <div class="text-[10px] text-slate-400 dark:text-slate-500">
              {{ formatDateOnly(row.scannedAt) }}
            </div>
          </template>
        </AppTable>

        <!-- شريط الباجينيشن المشترك -->
        <AppPagination
          v-if="filteredGateLogs.length > 0"
          v-model:current-page="gateCurrentPage"
          v-model:items-per-page="itemsPerPage"
          :total-items="filteredGateLogs.length"
          :per-page-options="perPageOptions"
          item-label="سجل مسح"
        />
      </div>

      <!-- عرض الكروت -->
      <div v-else class="space-y-4">
        <div v-if="filteredGateLogs.length === 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <QrCode class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p class="font-bold text-slate-700 dark:text-slate-300">لا توجد حركات مسح بوابة مطابقة للبحث</p>
          <p class="text-xs text-slate-400 mt-1">جرّب تفريغ خيارات الفلترة لعرض السجلات</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="log in paginatedGateLogs"
            :key="log.id"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between gap-3 hover:shadow-md transition-all relative overflow-hidden"
          >
            <!-- شريط علوي بلون القرار -->
            <div
              class="absolute top-0 right-0 left-0 h-1"
              :class="log.decision === 'Allowed' ? 'bg-emerald-500' : 'bg-rose-500'"
            ></div>

            <div>
              <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="font-mono font-bold text-xs text-primary-700 dark:text-primary-400 flex items-center gap-1">
                    <QrCode class="w-3.5 h-3.5" />
                    <span>{{ log.qrToken }}</span>
                  </div>
                  <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5">
                    {{ log.traineeName }}
                  </h4>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]" :title="log.courseTitle">
                    {{ log.courseTitle }}
                  </div>
                </div>

                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0"
                  :class="
                    log.decision === 'Allowed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
                  "
                >
                  {{ log.decision === 'Allowed' ? 'مسموح' : 'مرفوض' }}
                </span>
              </div>

              <!-- سبب ومبرر القرار -->
              <div
                class="my-3 p-2 rounded-lg text-xs leading-relaxed"
                :class="
                  log.decision === 'Allowed'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                "
              >
                {{ log.reason }}
              </div>

              <!-- البوابة وتوقيت المسح وحارس الأمن -->
              <div class="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div class="flex items-center justify-between">
                  <span>البوابة:</span>
                  <span class="font-medium text-slate-700 dark:text-slate-300">{{ log.gateLocation }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>فرد الأمن:</span>
                  <span class="font-medium text-slate-700 dark:text-slate-300">{{ log.scannedByUserName }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>التوقيت:</span>
                  <span class="font-mono text-[11px] text-slate-700 dark:text-slate-300">{{ formatTimeOnly(log.scannedAt) }} ({{ formatDateOnly(log.scannedAt) }})</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- باجينيشن الكروت -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
          <AppPagination
            v-if="filteredGateLogs.length > 0"
            v-model:current-page="gateCurrentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="filteredGateLogs.length"
            :per-page-options="perPageOptions"
            item-label="سجل مسح"
          />
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 5. الاستنبة الرسمية للطباعة والتصدير (Official Printable Document / PDF) -->
    <!-- ========================================================================= -->
    <div id="official-audit-print-document" class="printable-audit-container hidden print:block p-8 bg-white text-black font-sans dir-rtl">
      <!-- ترويسة الوثيقة الرسمية للمعهد -->
      <div class="border-b-2 border-black pb-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="text-right">
            <h4 class="text-sm font-bold text-gray-800">جمهورية مصر العربية</h4>
            <h4 class="text-sm font-bold text-gray-800">وزارة الدفاع</h4>
            <h3 class="text-base font-black text-black">معهد نظم المعلومات للقوات المسلحة</h3>
            <p class="text-xs text-gray-600 mt-0.5">منظومة إدارة الدورات التدريبية • الرقابة والتدقيق الأمني</p>
          </div>

          <div class="text-center px-4">
            <div class="w-16 h-16 border-2 border-black rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-1">
              M3HD
            </div>
            <span class="text-[10px] tracking-wider uppercase font-mono block">Official Audit Log</span>
          </div>

          <div class="text-left text-xs font-mono">
            <p><strong>تاريخ التصدير:</strong> {{ printDateFormatted }}</p>
            <p><strong>توقيت الاستخراج:</strong> {{ printTimeFormatted }}</p>
            <p><strong>رقم الوثيقة:</strong> AUD-{{ Date.now().toString().slice(-6) }}</p>
            <p><strong>درجة السرية:</strong> <span class="border border-black px-1.5 py-0.5 text-[10px] font-bold">محدود / داخلي</span></p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-300 text-center">
          <h2 class="text-lg font-black text-black underline underline-offset-4">
            {{ activeTab === 'audit' ? 'بيان سجل التدقيق الإداري وتتبع تعديل حالات التسجيل' : 'بيان سجل حركات تدقيق البوابة والأمن الإلكتروني' }}
          </h2>
          <p class="text-xs text-gray-600 mt-1">
            سجل رسمي موثق ومستخرج من المنظومة المركزية - إجمالي السجلات المستخرجة: 
            <strong>{{ activeTab === 'audit' ? filteredAuditLogs.length : filteredGateLogs.length }}</strong> حركة
          </p>
        </div>
      </div>

      <!-- جدول الطباعة: التدقيق الإداري -->
      <div v-if="activeTab === 'audit'">
        <table class="w-full text-right border-collapse border border-slate-300 text-xs">
          <thead>
            <tr class="bg-gray-100 border-b border-black font-bold">
              <th class="border border-slate-300 p-2 text-center">#</th>
              <th class="border border-slate-300 p-2">رقم الطلب</th>
              <th class="border border-slate-300 p-2">اسم المتدرب</th>
              <th class="border border-slate-300 p-2">الحالة السابقة / الجديدة</th>
              <th class="border border-slate-300 p-2">المسؤول عن التغيير</th>
              <th class="border border-slate-300 p-2">تاريخ وتوقيت العملية</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(log, idx) in filteredAuditLogs"
              :key="log.id"
              class="border-b border-slate-300"
            >
              <td class="border border-slate-300 p-2 text-center font-mono font-bold">{{ idx + 1 }}</td>
              <td class="border border-slate-300 p-2 font-mono font-bold">{{ log.applicationId }}</td>
              <td class="border border-slate-300 p-2 font-bold">{{ log.traineeName }}</td>
              <td class="border border-slate-300 p-2">
                <div class="text-[10px] text-gray-500">من: {{ getStatusLabel(log.fromStatus) }}</div>
                <div class="font-bold text-black">إلى: {{ getStatusLabel(log.toStatus) }}</div>
              </td>
              <td class="border border-slate-300 p-2">
                <div class="font-bold">{{ log.changedByUserName }}</div>
                <div class="text-[10px] text-gray-600">{{ log.userRole }}</div>
              </td>
              <td class="border border-slate-300 p-2 font-mono text-[11px]">{{ formatDateTime(log.changedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- جدول الطباعة: حركات البوابة -->
      <div v-else>
        <table class="w-full text-right border-collapse border border-slate-300 text-xs">
          <thead>
            <tr class="bg-gray-100 border-b border-black font-bold">
              <th class="border border-slate-300 p-2 text-center">#</th>
              <th class="border border-slate-300 p-2">كود العبور QR</th>
              <th class="border border-slate-300 p-2">اسم المتدرب والدورة</th>
              <th class="border border-slate-300 p-2">موقع البوابة والقرار</th>
              <th class="border border-slate-300 p-2">حارس الأمن</th>
              <th class="border border-slate-300 p-2">توقيت المسح</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(log, idx) in filteredGateLogs"
              :key="log.id"
              class="border-b border-slate-300"
            >
              <td class="border border-slate-300 p-2 text-center font-mono font-bold">{{ idx + 1 }}</td>
              <td class="border border-slate-300 p-2 font-mono font-bold">
                <div>{{ log.qrToken }}</div>
                <div class="text-[10px] text-gray-500 font-normal">{{ log.applicationId }}</div>
              </td>
              <td class="border border-slate-300 p-2">
                <div class="font-bold">{{ log.traineeName }}</div>
                <div class="text-[10px] text-gray-600">{{ log.courseTitle }}</div>
              </td>
              <td class="border border-slate-300 p-2">
                <div>{{ log.gateLocation }}</div>
                <div class="font-bold text-[11px]" :class="log.decision === 'Allowed' ? 'text-black' : 'text-red-700'">
                  {{ log.decision === 'Allowed' ? 'مسموح بالدخول' : 'مرفوض' }}
                </div>
              </td>
              <td class="border border-slate-300 p-2">{{ log.scannedByUserName }}</td>
              <td class="border border-slate-300 p-2 font-mono text-[11px]">{{ formatDateTime(log.scannedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- خانات التوقيع والاعتماد الرسمية -->
      <div class="mt-12 pt-6 border-t border-black grid grid-cols-3 gap-6 text-center text-xs">
        <div>
          <p class="font-bold mb-10 text-gray-800">مسؤول السجلات والتدقيق</p>
          <p class="border-b border-dashed border-gray-400 w-36 mx-auto mb-1"></p>
          <p class="text-gray-500 text-[10px]">التوقيع: ............................</p>
        </div>

        <div>
          <p class="font-bold mb-10 text-gray-800">رئيس قسم الأمن والحراسة</p>
          <p class="border-b border-dashed border-gray-400 w-36 mx-auto mb-1"></p>
          <p class="text-gray-500 text-[10px]">التوقيع: ............................</p>
        </div>

        <div>
          <p class="font-bold mb-10 text-gray-800">يعتمد، مدير معهد نظم المعلومات</p>
          <p class="border-b border-dashed border-gray-400 w-36 mx-auto mb-1"></p>
          <p class="text-gray-500 text-[10px]">التوقيع والختم الرسمي</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Shield,
  RotateCcw,
  Printer,
  History,
  QrCode,
  CheckCircle2,
  Ban,
  FileText,
  Search,
  X,
  ArrowLeft,
  MapPin,
} from 'lucide-vue-next';

// Shared Components
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import AppPagination from '@/shared/ui/Table/AppPagination.vue';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import Select from 'primevue/select';

// حالة التبويب النشط وطريقة العرض
const activeTab = ref('audit');
const viewMode = ref('table');
const isRefreshing = ref(false);

// ─── Seed Data: AuditLogs ───────────────────────────────────────────────────
const auditLogs = ref([
  {
    id: 1,
    applicationId: 'APP-2026-003',
    traineeName: 'خالد عمر الشريف',
    fromStatus: 'WaitingPayment',
    toStatus: 'Enrolled',
    changedByUserName: 'أحمد محمود',
    userRole: 'شؤون الدارسين (Affairs)',
    changedAt: '2026-11-02T10:15:30',
    notes: 'تم تأكيد استلام إيصال السداد البنكي وقيد المتدرب رسمياً بالدورة',
  },
  {
    id: 2,
    applicationId: 'APP-2026-001',
    traineeName: 'محمد أحمد علي',
    fromStatus: 'PendingReview',
    toStatus: 'WaitingPayment',
    changedByUserName: 'سارة إبراهيم',
    userRole: 'شؤون الدارسين (Affairs)',
    changedAt: '2026-11-02T09:45:10',
    notes: 'تمت مراجعة صورة الرقم القومي والمؤهل الدراسي والموافقة المبدئية',
  },
  {
    id: 3,
    applicationId: 'APP-2026-004',
    traineeName: 'سارة يوسف النجار',
    fromStatus: 'WaitingPayment',
    toStatus: 'PaymentMissed',
    changedByUserName: 'النظام الآلي (System)',
    userRole: 'مهمة مجدولة (Cron Job)',
    changedAt: '2026-11-02T00:00:01',
    notes: 'تجاوز مهلة السداد المحددة (72 ساعة) دون تسجيل إيصال دفع',
  },
  {
    id: 4,
    applicationId: 'APP-2026-002',
    traineeName: 'كريم محمود إسماعيل',
    fromStatus: 'PendingReview',
    toStatus: 'Rejected',
    changedByUserName: 'محمود عبد الرحمن',
    userRole: 'شؤون الدارسين (Affairs)',
    changedAt: '2026-11-01T14:20:00',
    notes: 'المؤهل الدراسي المرفق غير مطابق لمتطلبات الدورة المتقدمة',
  },
  {
    id: 5,
    applicationId: 'APP-2026-005',
    traineeName: 'طارق حسام مصطفى',
    fromStatus: 'Enrolled',
    toStatus: 'Completed',
    changedByUserName: 'أحمد محمود',
    userRole: 'شؤون الدارسين (Affairs)',
    changedAt: '2026-10-30T12:00:00',
    notes: 'أتم الدورة واجتاز الاختبار النهائي بنسبة 92% وإصدار الشهادة',
  },
]);

// ─── Seed Data: GateLogs ────────────────────────────────────────────────────
const gateLogs = ref([
  {
    id: 1,
    qrToken: 'GT-9821-X1',
    applicationId: 'APP-2026-003',
    traineeName: 'خالد عمر الشريف',
    courseTitle: 'الأمن السيبراني المتقدم (SOC)',
    gateLocation: 'بوابة المعهد الرئيسية (1)',
    decision: 'Allowed',
    reason: 'تم التحقق من الـ QR - مصرح له بالدخول اليوم لحضور محاضرة قاعة 1',
    scannedByUserName: 'مساعد أول / خالد عبد العزيز',
    scannedAt: '2026-11-02T08:15:22',
  },
  {
    id: 2,
    qrToken: 'GT-7712-B2',
    applicationId: 'APP-2026-007',
    traineeName: 'أحمد سامي فهمي',
    courseTitle: 'تطوير تطبيقات الويب Full-Stack',
    gateLocation: 'بوابة معمل التطوير (2)',
    decision: 'Denied',
    reason: 'محاولة استخدام كود ملغي / حالة المتدرب معلقة في النظام',
    scannedByUserName: 'رقيب / إسلام بدوي',
    scannedAt: '2026-11-02T08:22:45',
  },
  {
    id: 3,
    qrToken: 'GT-5541-M3',
    applicationId: 'APP-2026-008',
    traineeName: 'ياسر كمال المنشاوي',
    courseTitle: 'إدارة الشبكات والاتصالات CCNA',
    gateLocation: 'بوابة المعهد الرئيسية (1)',
    decision: 'Allowed',
    reason: 'تصريح يومي سارٍ - حضور تدريب عملي معمل الشبكات',
    scannedByUserName: 'مساعد أول / خالد عبد العزيز',
    scannedAt: '2026-11-02T08:40:10',
  },
  {
    id: 4,
    qrToken: 'GT-3310-Z9',
    applicationId: 'APP-2026-009',
    traineeName: 'محمود وجدي غريب',
    courseTitle: 'الذكاء الاصطناعي وتعلم الآلة',
    gateLocation: 'بوابة المعهد الرئيسية (1)',
    decision: 'Denied',
    reason: 'لا توجد محاضرات مجدولة لهذا المتدرب اليوم (خارج أوقات الدورة)',
    scannedByUserName: 'مساعد أول / خالد عبد العزيز',
    scannedAt: '2026-11-02T09:10:05',
  },
  {
    id: 5,
    qrToken: 'GT-1120-P4',
    applicationId: 'APP-2026-010',
    traineeName: 'عمر طارق الشافعي',
    courseTitle: 'قواعد البيانات والتحليل SQL Server',
    gateLocation: 'بوابة معمل التطوير (2)',
    decision: 'Allowed',
    reason: 'تصريح سارٍ - محاضرة قاعة 2',
    scannedByUserName: 'رقيب / إسلام بدوي',
    scannedAt: '2026-11-02T09:30:18',
  },
]);

// ─── Search & Filter States ──────────────────────────────────────────────────
const auditSearchQuery = ref('');
const selectedAuditStatus = ref(null);
const auditCurrentPage = ref(1);

const gateSearchQuery = ref('');
const selectedGateDecision = ref(null);
const selectedGateLocation = ref(null);
const gateCurrentPage = ref(1);

const itemsPerPage = ref(10);
const perPageOptions = [
  { label: '5 عناصر', value: 5 },
  { label: '10 عناصر', value: 10 },
  { label: '20 عنصر', value: 20 },
];

// Columns
const auditColumns = [
  { key: 'id', label: '#', headerClass: 'w-12 text-center' },
  { key: 'applicationId', label: 'رقم الطلب والمتدرب' },
  { key: 'fromStatus', label: 'الحالة السابقة' },
  { key: 'toStatus', label: 'الحالة الجديدة' },
  { key: 'changedByUserName', label: 'المسؤول' },
  { key: 'changedAt', label: 'توقيت التغيير' },
  { key: 'notes', label: 'الملاحظات والسبب' },
];

const gateColumns = [
  { key: 'id', label: '#', headerClass: 'w-12 text-center' },
  { key: 'qrToken', label: 'رمز العبور QR' },
  { key: 'traineeName', label: 'اسم المتدرب والدورة' },
  { key: 'gateLocation', label: 'موقع البوابة' },
  { key: 'decision', label: 'القرار' },
  { key: 'reason', label: 'السبب والمبرر' },
  { key: 'scannedByUserName', label: 'حارس الأمن' },
  { key: 'scannedAt', label: 'توقيت المسح' },
];

const auditStatusOptions = [
  { value: 'Enrolled', label: 'مقيد بالدورة (Enrolled)' },
  { value: 'WaitingPayment', label: 'في انتظار السداد (WaitingPayment)' },
  { value: 'PaymentMissed', label: 'فات ميعاد السداد (PaymentMissed)' },
  { value: 'Completed', label: 'انتهت الدورة (Completed)' },
  { value: 'Rejected', label: 'مرفوض (Rejected)' },
];

const decisionOptions = [
  { value: 'Allowed', label: 'مسموح بالدخول (Allowed)' },
  { value: 'Denied', label: 'مرفوض العبور (Denied)' },
];

const gateLocationOptions = [
  { value: 'بوابة المعهد الرئيسية (1)', label: 'بوابة المعهد الرئيسية (1)' },
  { value: 'بوابة معمل التطوير (2)', label: 'بوابة معمل التطوير (2)' },
];

// ─── Computed ────────────────────────────────────────────────────────────────
const allowedGateCount = computed(() => gateLogs.value.filter((g) => g.decision === 'Allowed').length);
const deniedGateCount = computed(() => gateLogs.value.filter((g) => g.decision === 'Denied').length);

const hasActiveFilters = computed(() => {
  if (activeTab.value === 'audit') {
    return Boolean(auditSearchQuery.value.trim()) || selectedAuditStatus.value !== null;
  }
  return (
    Boolean(gateSearchQuery.value.trim()) ||
    selectedGateDecision.value !== null ||
    selectedGateLocation.value !== null
  );
});

const filteredAuditLogs = computed(() => {
  return auditLogs.value.filter((log) => {
    if (selectedAuditStatus.value && log.toStatus !== selectedAuditStatus.value) {
      return false;
    }
    const q = auditSearchQuery.value.trim().toLowerCase();
    if (q) {
      const match =
        log.applicationId.toLowerCase().includes(q) ||
        log.traineeName.toLowerCase().includes(q) ||
        log.changedByUserName.toLowerCase().includes(q) ||
        (log.notes && log.notes.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
});

const paginatedAuditLogs = computed(() => {
  const start = (auditCurrentPage.value - 1) * itemsPerPage.value;
  return filteredAuditLogs.value.slice(start, start + itemsPerPage.value);
});

const filteredGateLogs = computed(() => {
  return gateLogs.value.filter((log) => {
    if (selectedGateDecision.value && log.decision !== selectedGateDecision.value) {
      return false;
    }
    if (selectedGateLocation.value && log.gateLocation !== selectedGateLocation.value) {
      return false;
    }
    const q = gateSearchQuery.value.trim().toLowerCase();
    if (q) {
      const match =
        log.qrToken.toLowerCase().includes(q) ||
        log.applicationId.toLowerCase().includes(q) ||
        log.traineeName.toLowerCase().includes(q) ||
        log.scannedByUserName.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
});

const paginatedGateLogs = computed(() => {
  const start = (gateCurrentPage.value - 1) * itemsPerPage.value;
  return filteredGateLogs.value.slice(start, start + itemsPerPage.value);
});

// التواريخ للطباعة
const printDateFormatted = computed(() => {
  return new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const printTimeFormatted = computed(() => {
  return new Date().toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clearFilters() {
  if (activeTab.value === 'audit') {
    auditSearchQuery.value = '';
    selectedAuditStatus.value = null;
    auditCurrentPage.value = 1;
  } else {
    gateSearchQuery.value = '';
    selectedGateDecision.value = null;
    selectedGateLocation.value = null;
    gateCurrentPage.value = 1;
  }
}

function getStatusLabel(status) {
  const map = {
    PendingReview: 'قيد المراجعة',
    WaitingPayment: 'في انتظار السداد',
    PaymentMissed: 'فات ميعاد السداد',
    Enrolled: 'مقيد بالدورة',
    Completed: 'انتهت الدورة',
    Rejected: 'مرفوض',
  };
  return map[status] || status;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Enrolled':
      return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'WaitingPayment':
      return 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'PaymentMissed':
    case 'Rejected':
      return 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'PendingReview':
    default:
      return 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  }
}

function formatDateTime(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateOnly(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTimeOnly(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function refreshData() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 400);
}

function printOfficialReport() {
  window.print();
}
</script>

<style scoped>
@media print {
  /* إخفاء شريط التنقل العلوي والأزرار بالكامل أثناء الطباعة */
  nav, 
  header, 
  .navbar, 
  button, 
  .print-hidden {
    display: none !important;
  }

  /* ضبط الهوامش ومقاس الصفحة A4 */
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  /* التأكد من أن حاوية التقرير تبدأ من أعلى الصفحة بدون فراغات */
  body {
    background: white !important;
    color: black !important;
  }

  .printable-audit-container {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* تنسيق الجدول ليتناسب مع العرض بدقة بدون تداخل */
  table {
    width: 100% !important;
    table-layout: fixed !important;
    border-collapse: collapse !important;
  }

  th, td {
    padding: 6px 4px !important;
    font-size: 10pt !important;
    word-wrap: break-word !important;
    border: 1px solid #94a3b8 !important;
  }

  /* تكرار رأس الجدول تلقائياً في الصفحات المتعددة */
  thead {
    display: table-header-group !important;
  }

  tr {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
</style>
