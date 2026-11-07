<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <ClipboardList class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              متابعة طلباتي
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تتبّع مسار كل طلب من التقديم حتى الاعتماد والسداد وإصدار التصريح
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- بطاقة المتدرب السريعة -->
          <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm">
              {{ userInitials }}
            </div>
            <div>
              <div class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{{ traineeProfile.fullName }}</div>
              <div class="text-[11px] text-slate-400">
                {{ CATEGORY_CONFIG[traineeProfile.category]?.label || traineeProfile.category }}
              </div>
            </div>
          </div>

          <button
            type="button"
            class="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            :class="{ 'animate-spin': isRefreshing }"
            title="تحديث الطلبات"
            @click="handleRefresh"
          >
            <RefreshCw class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- =========================================================
         2. مؤشرات سريعة (KPIs)
         ========================================================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <AppKpiCard
        title="إجمالي الطلبات"
        :value="applications.length"
        badge="طلب"
        icon-bg="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        :icon="ClipboardList"
      />
      <AppKpiCard
        title="طلبات مقبولة ومقيدة"
        :value="statusCount('Enrolled')"
        :badge="statusCount('Enrolled') ? 'تم القيد رسمياً ✓' : 'لا يوجد'"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        :icon="GraduationCap"
      />
      <AppKpiCard
        title="طلبات مرفوضة"
        :value="statusCount('Rejected')"
        :badge="statusCount('Rejected') ? 'تجاوز المهلة الزمنية' : 'لا يوجد'"
        badge-class="text-rose-600 dark:text-rose-400 font-bold"
        icon-bg="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
        :icon="XCircle"
      />
      <AppKpiCard
        title="في انتظار السداد"
        :value="statusCount('PendingPayment')"
        :badge="nearestDueLabel"
        badge-class="text-amber-600 dark:text-amber-400 font-bold"
        icon-bg="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        :icon="Wallet"
        class="cursor-pointer transition-all hover:scale-[1.01]"
        @click="filterToPendingPayment"
      />
    </div>

    <!-- تنبيه مواعيد السداد — تفاعلي للتصفية الفورية على طلبات PendingPayment -->
    <div
      v-if="statusCount('PendingPayment') > 0"
      id="pending-payment-alert-banner"
      class="group rounded-3xl border border-amber-300 dark:border-amber-800/80 bg-gradient-to-l from-amber-50 via-amber-50/90 to-amber-100/60 dark:from-amber-950/40 dark:via-amber-950/30 dark:to-amber-900/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-all hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md cursor-pointer select-none active:scale-[0.995]"
      role="button"
      tabindex="0"
      title="انقر لتصفية الجدول وعرض طلبات السداد المعلقة فوراً"
      @click="filterToPendingPayment"
      @keydown.enter="filterToPendingPayment"
    >
      <div class="flex items-start gap-3.5 flex-1 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <AlertTriangle class="w-5 h-5 animate-pulse" />
        </div>
        <div class="text-xs space-y-1.5 min-w-0">
          <div class="font-black text-amber-900 dark:text-amber-200 text-sm flex items-center gap-2 flex-wrap">
            <span>تنبيه مهلة سداد عاجلة بالخزينة</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/90 dark:bg-amber-900 text-amber-950 dark:text-amber-100 border border-amber-300 dark:border-amber-700">
              {{ statusCount('PendingPayment') }} طلب بانتظار السداد
            </span>
            <span
              v-if="activeTab === 'PendingPayment'"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300"
            >
              مفعّل في العرض حالياً ✓
            </span>
          </div>
          <p class="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            لديك طلبات تم اعتمادها وقيد انتظار السداد بالخزينة قبل انقضاء المهلة لتفادي إلغاء المقعد. <strong>انقر على هذا الإشعار لتصفية الجدول وعرض طلبات السداد فقط.</strong>
          </p>
          <ul v-if="urgentPayments.length" class="space-y-0.5 pt-1 text-amber-950 dark:text-amber-100 font-medium">
            <li v-for="app in urgentPayments" :key="app.id" class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span class="font-bold">{{ app.round.courseName }}</span>
              <span class="text-amber-500">•</span>
              <span class="font-mono">الكود: {{ app.applicationCode }}</span>
              <span class="text-amber-500">•</span>
              <span>آخر موعد: <strong>{{ formatDateDmy(app.paymentDueDate) }}</strong></span>
              <span class="text-amber-500">•</span>
              <span class="font-black underline">{{ getPaymentUrgency(app.paymentDueDate)?.label }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <span class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-transform flex items-center gap-1.5 group-hover:scale-105">
          <span>تصفية وعرض السداد</span>
          <Filter class="w-3.5 h-3.5" />
        </span>
      </div>
    </div>

    <!-- =========================================================
         3. شريط البحث والفلاتر + تبديل العرض (Table / Cards)
         ========================================================= -->
    <div
      id="applications-data-container"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <div class="px-5 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <!-- البحث والفلاتر -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div class="relative w-full sm:max-w-xs">
            <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ابحث باسم الدورة أو كود الطلب..."
              class="w-full h-9 pr-9 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              class="h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0"
              :class="
                activeTab === tab.value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              "
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
              <span class="mr-1 font-mono" :class="activeTab === tab.value ? 'text-primary-100' : 'text-slate-400'">
                ({{ tab.count }})
              </span>
            </button>
          </div>
        </div>

        <!-- أزرار تبديل نمط العرض (المخطط الزمني / جدول / كروت) -->
        <div class="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 select-none shrink-0">
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="
              viewMode === 'timeline'
                ? 'bg-primary-600 text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            "
            title="عرض المخطط الزمني التفاعلي"
            @click="viewMode = 'timeline'"
          >
            <GitBranch class="w-3.5 h-3.5" />
            <span>المخطط الزمني</span>
          </button>
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            "
            title="عرض كجدول"
            @click="viewMode = 'table'"
          >
            <LayoutList class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">جدول</span>
          </button>
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs font-black'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            "
            title="عرض ككروت"
            @click="viewMode = 'cards'"
          >
            <LayoutGrid class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">كروت</span>
          </button>
        </div>
      </div>
    </div>

    <!-- =========================================================
         4. محتوى قائمة الطلبات (حالة فارغة / جدول / كروت)
         ========================================================= -->
    <!-- حالة عدم وجود بيانات -->
    <div
      v-if="!filteredApplications.length"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm px-8 py-16 text-center space-y-3"
    >
      <div class="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
        <FileSearch class="w-7 h-7 text-slate-400" />
      </div>
      <h3 class="text-sm font-black text-slate-700 dark:text-slate-200 font-heading">لا توجد طلبات مطابقة</h3>
      <p class="text-xs text-slate-400">
        {{ searchQuery ? 'جرّب تغيير مصطلح البحث أو الفلتر المختار' : 'لم يتم تسجيل طلبات في هذه الحالة حتى الآن' }}
      </p>
      <RouterLink
        to="/trainee/courses"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
      >
        تصفّح الدورات المتاحة للتقديم
        <ArrowLeft class="w-3.5 h-3.5" />
      </RouterLink>
    </div>

    <!-- نمط الجدول (Table View) -->
    <div
      v-else-if="viewMode === 'table'"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <AppTable
        :columns="tableColumns"
        :data="filteredApplications"
        min-width="880px"
      >
        <!-- كود الطلب -->
        <template #applicationCode="{ row }">
          <div class="flex items-center gap-1.5 font-mono text-xs font-bold">
            <span class="text-slate-800 dark:text-slate-100">{{ row.applicationCode }}</span>
            <button
              type="button"
              class="w-6 h-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              title="نسخ كود الطلب"
              @click.stop="copyCode(row.applicationCode)"
            >
              <Copy class="w-3 h-3" />
            </button>
          </div>
        </template>

        <!-- الدورة والرمز -->
        <template #course="{ row }">
          <div class="min-w-0 max-w-[260px] py-1">
            <div class="font-bold text-slate-800 dark:text-slate-100 truncate text-xs" :title="row.round.courseName">
              {{ row.round.courseName }}
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-mono">
              <span>{{ row.round.roundCode }}</span>
              <span>•</span>
              <span>الدفعة {{ row.round.roundNumber }}</span>
            </div>
          </div>
        </template>

        <!-- تاريخ التقديم -->
        <template #createdAt="{ row }">
          <span class="font-mono text-slate-600 dark:text-slate-300 text-xs">
            {{ formatDateDmy(row.createdAt) }}
          </span>
        </template>

        <!-- الرسوم المقررة -->
        <template #price="{ row }">
          <div class="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
            {{ formatCurrency(categoryPrice(row)) }}
            <span v-if="row.paidAmount" class="block text-[10px] text-emerald-600 dark:text-emerald-400 font-sans">
              (مسدد ✓)
            </span>
          </div>
        </template>

        <!-- حالة الطلب -->
        <template #status="{ row }">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
            :class="statusConfig(row.status, row.statusLabel).badge"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig(row.status, row.statusLabel).dot" />
            {{ row.statusLabel || statusConfig(row.status).label }}
          </span>
        </template>

        <!-- تفاصيل / مهلة / تنبيه -->
        <template #details="{ row }">
          <div class="text-[11px] max-w-[220px]">
            <!-- قيد المراجعة -->
            <div v-if="row.status === 'UnderReview' || row.status === 'pending_affairs'" class="text-blue-600 dark:text-blue-400">
              قيد فحص المستندات بالشؤون
            </div>

            <!-- في انتظار السداد -->
            <div v-else-if="row.status === 'PendingPayment' || row.status === 'PaymentMissed'" class="space-y-0.5">
              <span class="font-bold" :class="getPaymentUrgency(row.paymentDueDate)?.textClass">
                {{ getPaymentUrgency(row.paymentDueDate)?.label }}
              </span>
              <span class="block text-[10px] text-slate-400 font-mono">
                آخر موعد: {{ formatDateDmy(row.paymentDueDate) }}
              </span>
            </div>

            <!-- مرفوض -->
            <div v-else-if="row.status === 'Rejected' || row.status === 'rejected_expired'" class="text-rose-600 dark:text-rose-400 truncate" :title="row.rejectionReason">
              {{ row.rejectionReason }}
            </div>

            <!-- مقيد بالدورة -->
            <div v-else-if="row.status === 'Enrolled'" class="text-emerald-600 dark:text-emerald-400 font-mono">
              إيصال: {{ row.receiptNumber }}
            </div>

            <!-- انتهت الدورة -->
            <div v-else-if="row.status === 'CourseEnded'" class="space-y-0.5">
              <span class="font-bold font-mono" :class="row.finalGrade >= row.round.passingGrade ? 'text-emerald-600' : 'text-rose-600'">
                الدرجة: {{ row.finalGrade }}%
              </span>
              <span v-if="row.isCertificateIssued" class="block text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                {{ row.certificateCode }}
              </span>
            </div>
          </div>
        </template>

        <!-- الإجراءات (Direct Action Links) -->
        <template #actions="{ row }">
          <div class="flex items-center gap-1.5 justify-end">
            <!-- تفاصيل الطلب -->
            <button
              type="button"
              class="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              title="عرض التفاصيل الكاملة للطلب"
              @click="openDetails(row)"
            >
              <Eye class="w-3.5 h-3.5" />
              <span>تفاصيل</span>
            </button>

            <!-- زر تصريح QR يفتح مودال الـ QR مباشرة دون مغادرة الصفحة -->
            <button
              v-if="row.status === 'Enrolled'"
              type="button"
              class="h-8 px-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="عرض تصريح الدخول ورمز الـ QR المعتمد"
              @click="openPassQr(row)"
            >
              <QrCode class="w-3.5 h-3.5" />
              <span>تصريح QR</span>
            </button>

            <!-- زر الشهادة يفتح مودال المعاينة الرسمي مباشرة دون مغادرة الصفحة -->
            <button
              v-else-if="row.status === 'CourseEnded' && row.isCertificateIssued"
              type="button"
              class="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="معاينة وطباعة الشهادة المعتمدة"
              @click="openCertificate(row)"
            >
              <Award class="w-3.5 h-3.5" />
              <span>شهادة</span>
            </button>

            <!-- إجراءات الرفض: إعادة التقديم بعد تعديل المستندات أو دورة بديلة -->
            <template v-else-if="row.status === 'Rejected' || row.status === 'rejected_expired'">
              <button
                v-if="isDocRejection(row)"
                type="button"
                class="h-8 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                :title="getRejectionActionConfig(row).label"
                @click="openReapplyModal(row)"
              >
                <RefreshCw class="w-3.5 h-3.5" />
                <span>{{ getRejectionActionConfig(row).shortLabel }}</span>
              </button>
              <RouterLink
                v-else
                to="/trainee/courses"
                class="h-8 px-2.5 rounded-xl border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-xs font-bold transition-colors flex items-center gap-1"
                title="التقديم على دورة بديلة"
              >
                <span>دورة بديلة</span>
                <ArrowLeft class="w-3.5 h-3.5" />
              </RouterLink>
            </template>
          </div>
        </template>
      </AppTable>
    </div>

    <!-- نمط البطاقات (Cards View) -->
    <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <article
        v-for="app in filteredApplications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
      >
        <!-- شريط الحالة العلوي -->
        <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
            :class="statusConfig(app.status, app.statusLabel).badge"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig(app.status, app.statusLabel).dot" />
            {{ app.statusLabel || statusConfig(app.status).label }}
          </span>

          <div class="flex items-center gap-2">
            <span class="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {{ app.applicationCode }}
            </span>
            <button
              type="button"
              class="w-6 h-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              title="نسخ كود الطلب"
              @click="copyCode(app.applicationCode)"
            >
              <Copy class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- جسم الكارت -->
        <div class="p-5 space-y-4 flex-1">
          <!-- اسم الدورة والدفعة -->
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-snug">
              {{ app.round.courseName }}
            </h3>
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mt-1 font-mono">
              <span class="text-primary-600 dark:text-primary-400 font-bold">{{ app.round.courseDomain }}</span>
              <span>•</span>
              <span>{{ app.round.courseCode }}</span>
              <span>•</span>
              <span>الدفعة {{ app.round.roundNumber }} ({{ app.round.roundCode }})</span>
            </div>
          </div>

          <!-- شبكة معلومات الدفعة -->
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-slate-400">المحاضر المسؤول</div>
              <div class="font-bold text-slate-700 dark:text-slate-200 truncate" :title="app.round.instructor.name">
                {{ app.round.instructor.name }}
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-slate-400">قاعة المحاضرات</div>
              <div class="font-bold text-slate-700 dark:text-slate-200 truncate" :title="app.round.hall.name">
                {{ app.round.hall.name }}
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-slate-400">فترة الانعقاد</div>
              <div class="font-bold text-slate-700 dark:text-slate-200 font-mono">
                {{ formatDateDmy(app.round.startDate) }} → {{ formatDateDmy(app.round.endDate) }}
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-slate-400">الموعد والتوقيت</div>
              <div class="font-bold text-slate-700 dark:text-slate-200">
                {{ formatLectureDays(app.round.lectureDays) }} • {{ formatTimeRange(app.round.startTime, app.round.endTime) }}
              </div>
            </div>
          </div>

          <!-- لوحة الحالة: قيد المراجعة (UnderReview / pending_affairs) -->
          <div
            v-if="app.status === 'UnderReview' || app.status === 'pending_affairs'"
            class="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/70 space-y-1"
          >
            <div class="flex items-center gap-1.5 text-[11px] font-black text-blue-700 dark:text-blue-300">
              <Clock class="w-3.5 h-3.5" />
              طلبك قيد المراجعة لدى شؤون الدارسين
            </div>
            <p class="text-[11px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              تم استلام الطلب بتاريخ {{ formatDateDmy(app.createdAt) }} باستخدام بياناتك المسجلة ورفع المؤهل.
              سيتم إخطارك بالقرار وتحديد مهلة السداد فور الاعتماد الأكاديمي.
            </p>
          </div>

          <!-- لوحة الحالة: في انتظار السداد (PendingPayment) -->
          <div
            v-else-if="app.status === 'PendingPayment' || app.status === 'PaymentMissed'"
            class="p-3.5 rounded-2xl border space-y-2 cursor-pointer transition-all hover:shadow-xs"
            :class="getPaymentUrgency(app.paymentDueDate)?.boxClass || 'bg-amber-50 border-amber-200'"
            @click="copyCode(app.applicationCode)"
            title="انقر لنسخ كود السداد"
          >
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-1.5 text-[11px] font-black" :class="getPaymentUrgency(app.paymentDueDate)?.textClass">
                <Wallet class="w-3.5 h-3.5" />
                رسوم الدورة المستحقة
              </div>
              <span class="text-[11px] font-bold" :class="getPaymentUrgency(app.paymentDueDate)?.textClass">
                {{ getPaymentUrgency(app.paymentDueDate)?.label }}
              </span>
            </div>

            <div class="flex items-end justify-between gap-2 flex-wrap">
              <div class="font-black text-lg text-slate-800 dark:text-slate-100 font-mono">
                {{ formatCurrency(categoryPrice(app)) }}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">
                آخر موعد للسداد:
                <strong class="font-mono text-slate-700 dark:text-slate-200">{{ formatDateDmy(app.paymentDueDate) }}</strong>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span class="px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                فئة: {{ CATEGORY_CONFIG[traineeProfile.category]?.label || traineeProfile.category }}
              </span>
              <span v-if="app.extensionCount" class="px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                تم تمديد المهلة {{ app.extensionCount }} مرة
              </span>
            </div>
          </div>

          <!-- لوحة الحالة: مرفوض (Rejected / rejected_expired) -->
          <div
            v-else-if="app.status === 'Rejected' || app.status === 'rejected_expired'"
            class="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70 space-y-2"
          >
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-1.5 text-[11px] font-black text-rose-700 dark:text-rose-300">
                <XCircle class="w-3.5 h-3.5" />
                <span>سبب الرفض الرسمي (شؤون الدارسين)</span>
              </div>
              <span class="text-[10px] text-rose-500 dark:text-rose-400">
                تاريخ القرار: {{ formatDateDmy(app.updatedAt) }}
              </span>
            </div>
            <p class="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed">
              {{ app.rejectionReason }}
            </p>

            <!-- زر سريع لإعادة التقديم إذا كان سبب الرفض مستندات أو بيانات -->
            <div v-if="isDocRejection(app)" class="pt-1.5 flex items-center justify-between gap-2 border-t border-rose-200/60 dark:border-rose-900/40 flex-wrap">
              <span class="text-[10.5px] font-bold text-amber-800 dark:text-amber-300">
                متاح إعادة تقديم الطلب بعد تعديل المستندات
              </span>
              <button
                type="button"
                class="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                @click="openReapplyModal(app)"
              >
                <RefreshCw class="w-3.5 h-3.5" />
                <span>{{ getRejectionActionConfig(app).label }}</span>
              </button>
            </div>
          </div>

          <!-- لوحة الحالة: مقيد بالدورة (Enrolled) -->
          <div
            v-else-if="app.status === 'Enrolled'"
            class="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-1.5"
          >
            <div class="flex items-center gap-1.5 text-[11px] font-black text-emerald-700 dark:text-emerald-300">
              <GraduationCap class="w-3.5 h-3.5" />
              أنت مقيد بهذه الدورة ومسدد للرسوم
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-emerald-700/90 dark:text-emerald-300/90">
              <span>الإيصال: <strong class="font-mono">{{ app.receiptNumber }}</strong></span>
              <span class="text-emerald-400">•</span>
              <span>المسدد: <strong class="font-mono">{{ formatCurrency(app.paidAmount) }}</strong></span>
            </div>
            <p class="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
              تصريح الدخول برمز QR متاح الآن — يمكنك فتحه مباشرة من الزر أدناه.
            </p>
          </div>

          <!-- لوحة الحالة: انتهت الدورة (CourseEnded) -->
          <div
            v-else-if="app.status === 'CourseEnded'"
            class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5"
          >
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-1.5 text-[11px] font-black text-slate-700 dark:text-slate-200">
                <Award class="w-3.5 h-3.5" />
                التقييم النهائي
              </div>
              <span
                class="text-[11px] font-black font-mono px-2 py-0.5 rounded-full border"
                :class="
                  app.finalGrade >= app.round.passingGrade
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                "
              >
                {{ app.finalGrade }}% / النجاح {{ app.round.passingGrade }}%
              </span>
            </div>
            <div class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <template v-if="app.isCertificateIssued">
                الشهادة صادرة بكود
                <strong class="font-mono">{{ app.certificateCode }}</strong>
              </template>
              <template v-else>
                لم تُصدر الشهادة — التقييم أقل من نسبة النجاح المطلوبة. يمكنك التواصل مع شؤون الدارسين.
              </template>
            </div>
          </div>
        </div>

        <!-- تذييل الكارت -->
        <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-400">
              تاريخ التقديم: <span class="font-mono">{{ formatDateDmy(app.createdAt) }}</span>
            </span>
            <button
              type="button"
              class="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              @click="openDetails(app)"
            >
              عرض التفاصيل
            </button>
          </div>

          <!-- زر تصريح الدخول يفتح المودال مباشرة -->
          <button
            v-if="app.status === 'Enrolled'"
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-black text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
            @click="openPassQr(app)"
          >
            <QrCode class="w-3.5 h-3.5" />
            <span>عرض تصريح QR</span>
          </button>

          <!-- زر الشهادة يفتح مودال المعاينة مباشرة -->
          <button
            v-else-if="app.status === 'CourseEnded' && app.isCertificateIssued"
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            @click="openCertificate(app)"
          >
            <Award class="w-3.5 h-3.5" />
            <span>معاينة الشهادة</span>
          </button>

          <button
            v-else-if="app.status === 'PendingPayment' || app.status === 'PaymentMissed'"
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            @click="copyCode(app.applicationCode)"
          >
            <Copy class="w-3 h-3" />
            نسخ كود السداد
          </button>

          <template v-else-if="app.status === 'Rejected' || app.status === 'rejected_expired'">
            <button
              v-if="isDocRejection(app)"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-l from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-[11px] font-black transition-all shadow-xs cursor-pointer active:scale-95"
              @click="openReapplyModal(app)"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>{{ getRejectionActionConfig(app).label }}</span>
            </button>
            <RouterLink
              v-else
              to="/trainee/courses"
              class="inline-flex items-center gap-1 text-[11px] font-black text-primary-600 dark:text-primary-400 hover:underline"
            >
              التقديم على دورة بديلة
              <ArrowLeft class="w-3 h-3" />
            </RouterLink>
          </template>

          <span v-else class="text-[10px] text-slate-400">
            يتم التحديث تلقائياً عند اعتماد الطلب
          </span>
        </div>
      </article>
    </div>

    <!-- =========================================================
         نمط المخطط الزمني التفاعلي (Interactive Timeline View)
         ========================================================= -->
    <div v-else class="space-y-6">
      <article
        v-for="app in filteredApplications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
      >
        <!-- ترويسة الطلب بالمسار -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 shrink-0">
              <Milestone class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-heading">
                  {{ app.round.courseName }}
                </h3>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                  :class="statusConfig(app.status, app.statusLabel).badge"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig(app.status, app.statusLabel).dot" />
                  {{ app.statusLabel || statusConfig(app.status).label }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                <span class="text-primary-600 dark:text-primary-400 font-bold">{{ app.round.courseDomain }}</span>
                <span>•</span>
                <span>{{ app.round.roundCode }}</span>
                <span>•</span>
                <span>الدفعة {{ app.round.roundNumber }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center">
            <div class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
              <span class="text-[10px] text-slate-400 font-sans">كود الطلب:</span>
              <span>{{ app.applicationCode }}</span>
              <button
                type="button"
                class="w-6 h-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="نسخ كود الطلب"
                @click="copyCode(app.applicationCode)"
              >
                <Copy class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <!-- مسار المخطط الزمني التفاعلي (Interactive Timeline Track) -->
        <div class="p-6 space-y-6">
          <!-- مسار الشاشات المتوسطة والكبيرة (Horizontal Timeline Track) -->
          <div class="hidden lg:block relative pt-4 pb-2">
            <!-- خط المسار الخلفي الممتد -->
            <div class="absolute top-[36px] right-[12.5%] left-[12.5%] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full z-0 overflow-hidden">
              <div
                class="h-full bg-gradient-to-l from-emerald-500 via-primary-500 to-emerald-400 transition-all duration-700"
                :style="{ width: `${getMetroProgressPercent(app)}%` }"
              />
            </div>

            <!-- محطات المخطط الزمني الأربع -->
            <div class="grid grid-cols-4 gap-2 relative z-10 text-center">
              <div
                v-for="station in getMetroStations(app)"
                :key="station.id"
                class="flex flex-col items-center group select-none"
              >
                <!-- دائرة المحطة وأيقونتها -->
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shadow-md border-2 transition-all relative mb-2.5"
                  :class="[
                    station.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
                      : station.status === 'active'
                        ? 'bg-amber-500 border-amber-300 text-white ring-4 ring-amber-400/30 scale-110 shadow-amber-500/30'
                        : station.status === 'active-success'
                          ? 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-500/30 scale-110 shadow-emerald-500/30'
                          : station.status === 'rejected'
                            ? 'bg-rose-500 border-rose-300 text-white ring-4 ring-rose-400/30 scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  ]"
                >
                  <component :is="station.icon" class="w-5 h-5" />
                  <!-- نبضة للمحطة النشطة الحالية -->
                  <span
                    v-if="station.status === 'active' || station.status === 'active-success'"
                    class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary-400 ring-2 ring-white dark:ring-slate-900 animate-ping"
                  />
                </div>

                <!-- مسمى المحطة والتاج -->
                <span class="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                  {{ station.title }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono mt-1">
                  {{ station.subtitle }}
                </span>
                <span
                  class="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border"
                  :class="[
                    station.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : station.status === 'active'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 animate-pulse'
                        : station.status === 'active-success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 animate-pulse'
                          : station.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  ]"
                >
                  {{ station.tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- مسار الشاشات الصغيرة للموبايل (Vertical Timeline Track) -->
          <div class="lg:hidden space-y-3 relative pr-7">
            <!-- خط السكة الرأسي -->
            <div class="absolute top-3 bottom-3 right-3 w-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div
              v-for="station in getMetroStations(app)"
              :key="station.id"
              class="relative flex items-start gap-3 p-3 rounded-2xl border transition-all"
              :class="
                station.status === 'active' || station.status === 'active-success'
                  ? 'bg-primary-50/70 dark:bg-primary-950/30 border-primary-300 dark:border-primary-700'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              "
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs -mr-[29px] relative z-10"
                :class="[
                  station.status === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : station.status === 'active'
                      ? 'bg-amber-500 text-white ring-2 ring-amber-400'
                      : station.status === 'active-success'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : station.status === 'rejected'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                ]"
              >
                <component :is="station.icon" class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1 flex-wrap">
                  <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ station.title }}</span>
                  <span class="font-mono text-[10px] text-slate-400">{{ station.subtitle }}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {{ station.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- لوحة المحطة النشطة والإجراءات الفورية -->
          <div
            v-if="app.status === 'Enrolled'"
            class="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                <GraduationCap class="w-5 h-5" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-black text-emerald-800 dark:text-emerald-200">
                  أنت مقيد رسمياً بهذه الدورة ومسدد للرسوم
                </div>
                <div class="text-emerald-700/80 dark:text-emerald-300/80">
                  رقم الإيصال: <strong class="font-mono">{{ app.receiptNumber }}</strong> • المبلغ: <strong class="font-mono">{{ formatCurrency(app.paidAmount) }}</strong> • تصريح المرور الأمني (QR) مفعل.
                </div>
              </div>
            </div>
            <button
              type="button"
              class="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 active:scale-95"
              @click="openPassQr(app)"
            >
              <QrCode class="w-4 h-4" />
              <span>عرض تصريح الدخول (QR)</span>
            </button>
          </div>

          <div
            v-else-if="app.status === 'PendingPayment' || app.status === 'PaymentMissed'"
            class="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
                <Wallet class="w-5 h-5" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>طلبك معتمد وبانتظار سداد الرسوم بالخزينة</span>
                  <span class="text-[10px] font-bold underline" :class="getPaymentUrgency(app.paymentDueDate)?.textClass">
                    {{ getPaymentUrgency(app.paymentDueDate)?.label }}
                  </span>
                </div>
                <div class="text-amber-800/80 dark:text-amber-300/80">
                  المبلغ المستحق: <strong class="font-mono">{{ formatCurrency(categoryPrice(app)) }}</strong> • آخر مهلة للسداد: <strong class="font-mono">{{ formatDateDmy(app.paymentDueDate) }}</strong>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 active:scale-95"
              @click="copyCode(app.applicationCode)"
            >
              <Copy class="w-4 h-4" />
              <span>نسخ كود السداد</span>
            </button>
          </div>

          <div
            v-else-if="app.status === 'Rejected' || app.status === 'rejected_expired'"
            class="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold shrink-0">
                <XCircle class="w-5 h-5" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-black text-rose-900 dark:text-rose-200">
                  سبب الرفض الرسمي (شؤون الدارسين)
                </div>
                <p class="text-rose-800/80 dark:text-rose-300/80 leading-relaxed max-w-2xl">
                  {{ app.rejectionReason }}
                </p>
              </div>
            </div>

            <!-- أزرار الإجراء في حالة الرفض -->
            <div class="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                v-if="isDocRejection(app)"
                type="button"
                class="h-9 px-4 rounded-xl bg-gradient-to-l from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-700/20 cursor-pointer shrink-0 active:scale-95"
                @click="openReapplyModal(app)"
              >
                <RefreshCw class="w-4 h-4" />
                <span>{{ getRejectionActionConfig(app).label }}</span>
              </button>
              <RouterLink
                v-else
                to="/trainee/courses"
                class="h-9 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0"
              >
                <span>التقديم على دورة بديلة</span>
                <ArrowLeft class="w-4 h-4" />
              </RouterLink>
            </div>
          </div>

          <div
            v-else-if="app.status === 'UnderReview' || app.status === 'pending_affairs'"
            class="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/70 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shrink-0">
                <Clock class="w-5 h-5" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-black text-blue-900 dark:text-blue-200">
                  طلبك قيد الفحص والتدقيق الأكاديمي لدى شؤون الدارسين
                </div>
                <div class="text-blue-800/80 dark:text-blue-300/80">
                  تاريخ التقديم: <strong class="font-mono">{{ formatDateDmy(app.createdAt) }}</strong> — سيتم إشعارك فور الاعتماد وتحديد مهلة السداد بالخزينة.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- تذييل الكارت التفاعلي -->
        <div class="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>القاعة: <strong class="text-slate-700 dark:text-slate-200 font-sans">{{ app.round.hall.name }}</strong></span>
            <span>•</span>
            <span>المحاضر: <strong class="text-slate-700 dark:text-slate-200 font-sans">{{ app.round.instructor.name }}</strong></span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              @click="openDetails(app)"
            >
              <Eye class="w-3.5 h-3.5" />
              <span>عرض تفاصيل الطلب</span>
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- =========================================================
         5. المودالات التفاعلية المباشرة
         ========================================================= -->
    <!-- 1. مودال تفاصيل الطلب الشاملة -->
    <TraineeApplicationDetailsModal
      :is-open="isDetailsModalOpen"
      :application="selectedApplication"
      :trainee-category="traineeProfile.category"
      @close="isDetailsModalOpen = false"
      @open-pass="openPassQr"
      @open-reapply="openReapplyModal"
    />

    <!-- 2. مودال تصريح الدخول ورمز QR المباشر (Direct Gate Pass Modal) -->
    <TraineePassZoomModal
      :is-open="isPassModalOpen"
      :pass="selectedPass"
      :trainee-profile="traineeProfile"
      @close="isPassModalOpen = false"
    />

    <!-- 3. مودال معاينة الشهادة الرسمية المعتمدة المباشر (Direct Certificate Modal) -->
    <CertificatePreviewModal
      :is-open="isCertModalOpen"
      :application="selectedCertApplication"
      :trainee-profile="traineeProfile"
      @close="isCertModalOpen = false"
    />

    <!-- 4. مودال إعادة التقديم بعد تعديل المستندات والبيانات المطلوبة -->
    <TraineeReapplyModal
      :is-open="isReapplyModalOpen"
      :application="selectedReapplyApplication"
      :trainee-profile="traineeProfile"
      @close="isReapplyModalOpen = false"
      @reapplied="handleApplicationReapplied"
      @toast="showToast"
    />

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.text"
        class="fixed bottom-6 left-6 z-[60] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold max-w-sm"
        :class="
          toast.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
            : 'bg-primary-50 dark:bg-primary-950/95 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-800'
        "
      >
        <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>{{ toast.text }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
  ClipboardList,
  Clock,
  Wallet,
  CheckCircle2,
  Search,
  RefreshCw,
  Copy,
  ArrowLeft,
  GraduationCap,
  Award,
  XCircle,
  AlertTriangle,
  FileSearch,
  Eye,
  QrCode,
  Filter,
  GitBranch,
  LayoutList,
  LayoutGrid,
  Check,
  Milestone,
  Send,
} from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import TraineeApplicationDetailsModal from './TraineeApplicationDetailsModal.vue';
import TraineePassZoomModal from '../passes/TraineePassZoomModal.vue';
import CertificatePreviewModal from '../certificates/CertificatePreviewModal.vue';
import TraineeReapplyModal from './TraineeReapplyModal.vue';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTraineeApplicationsStore } from '../../stores/traineeApplicationsStore';
import { TRAINEE_MOCK_PROFILE } from '../../helpers/availableCoursesMockData';
import { CATEGORY_CONFIG, formatLectureDays, getPriceByCategory } from '../../helpers/availableCoursesHelpers';
import { TRAINEE_APPLICATIONS } from '../../helpers/traineePortalMockData';
import {
  getStatusConfig,
  formatDateDmy,
  formatTimeRange,
  getPaymentUrgency,
  daysUntil,
  isDocumentRejection,
  getRejectionActionConfig,
} from '../../helpers/traineePortalHelpers';

const authStore = useAuthStore();
const traineeStore = useTraineeApplicationsStore();

const traineeProfile = {
  ...TRAINEE_MOCK_PROFILE,
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId,
};

const userInitials = computed(() => {
  const name = traineeProfile.fullName?.trim() || 'م';
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
});

const viewMode = ref('timeline'); // النمط الافتراضي: المخطط الزمني التفاعلي
const isRefreshing = ref(false);
const searchQuery = ref('');
const activeTab = ref('all');

// مودال تفاصيل الطلب
const isDetailsModalOpen = ref(false);
const selectedApplication = ref(null);

function openDetails(app) {
  selectedApplication.value = app;
  isDetailsModalOpen.value = true;
}

// مودال تصريح الدخول المباشر (QR Modal)
const isPassModalOpen = ref(false);
const selectedPass = ref(null);

function openPassQr(app) {
  selectedPass.value = app;
  isPassModalOpen.value = true;
}

// مودال معاينة الشهادة المباشر (Certificate Modal)
const isCertModalOpen = ref(false);
const selectedCertApplication = ref(null);

function openCertificate(app) {
  selectedCertApplication.value = app;
  isCertModalOpen.value = true;
}

// مودال إعادة التقديم بعد تعديل المستندات
const isReapplyModalOpen = ref(false);
const selectedReapplyApplication = ref(null);

function openReapplyModal(app) {
  selectedReapplyApplication.value = app;
  isReapplyModalOpen.value = true;
}

function handleApplicationReapplied(updatedApp) {
  const idx = rawApplications.value.findIndex((a) => a.id === updatedApp.id);
  if (idx !== -1) {
    rawApplications.value[idx] = updatedApp;
  }
  showToast('تم استلام البيانات وإعادة إرسال طلب التقديم بنجاح للمراجعة والتدقيق.');
}

const isDocRejection = (app) => isDocumentRejection(app);

// أعمدة جدول الطلبات
const tableColumns = [
  { key: 'applicationCode', label: 'كود الطلب', width: '130px' },
  { key: 'course', label: 'الدورة التدريبية', minWidth: '220px' },
  { key: 'createdAt', label: 'تاريخ التقديم', width: '110px' },
  { key: 'price', label: 'الرسوم المقررة', width: '120px' },
  { key: 'status', label: 'حالة الطلب', width: '130px' },
  { key: 'details', label: 'الملاحظات والمهلة', minWidth: '180px' },
  { key: 'actions', label: 'الإجراءات', width: '160px', align: 'left' },
];

onMounted(() => {
  traineeStore.load(traineeProfile.userId);
});

const rawApplications = ref([...TRAINEE_APPLICATIONS]);

const allApplications = computed(() => {
  return rawApplications.value;
});

// قائمة الطلبات المعروضة (تشمل المقبول والمرفوض)
const applications = computed(() => allApplications.value);

// الدورات التي اكتمل قبولها بالدورة
const enrolledCourses = computed(() =>
  allApplications.value.filter((app) => app.status === 'Enrolled')
);

const statusConfig = (status, statusLabel = null) => getStatusConfig(status, statusLabel);

const statusCount = (status) => {
  if (status === 'UnderReview' || status === 'pending_affairs') {
    return applications.value.filter((app) => app.status === 'UnderReview' || app.status === 'pending_affairs').length;
  }
  if (status === 'Rejected' || status === 'rejected_expired') {
    return applications.value.filter((app) => app.status === 'Rejected' || app.status === 'rejected_expired').length;
  }
  if (status === 'Enrolled') {
    return applications.value.filter((app) => app.status === 'Enrolled').length;
  }
  return applications.value.filter((app) => app.status === status).length;
};

const issuedCertificatesCount = computed(
  () => applications.value.filter((app) => app.isCertificateIssued).length
);

/** أقرب مهلة سداد معلّقة */
const nearestDue = computed(() => {
  const pendings = applications.value
    .filter((app) => app.status === 'PendingPayment' && app.paymentDueDate)
    .map((app) => ({ app, days: daysUntil(app.paymentDueDate) ?? 99 }))
    .sort((a, b) => a.days - b.days);
  return pendings[0] || null;
});

const nearestDueLabel = computed(() => {
  if (!nearestDue.value) return 'لا يوجد';
  return `أقرب مهلة ${formatDateDmy(nearestDue.value.app.paymentDueDate)}`;
});

const urgentPayments = computed(() =>
  applications.value.filter(
    (app) => app.status === 'PendingPayment' && (daysUntil(app.paymentDueDate) ?? 99) <= 5
  )
);

const tabs = computed(() => [
  { value: 'all', label: 'الكل', count: applications.value.length },
  { value: 'Enrolled', label: 'مقبولة', count: statusCount('Enrolled') },
  { value: 'Rejected', label: 'مرفوضة', count: statusCount('Rejected') },
]);

const filteredApplications = computed(() =>
  applications.value.filter((app) => {
    if (activeTab.value !== 'all') {
      if (activeTab.value === 'Enrolled') {
        if (app.status !== 'Enrolled') return false;
      } else if (activeTab.value === 'Rejected') {
        if (app.status !== 'Rejected' && app.status !== 'rejected_expired') return false;
      } else if (activeTab.value === 'UnderReview') {
        if (app.status !== 'UnderReview' && app.status !== 'pending_affairs') return false;
      } else if (app.status !== activeTab.value) {
        return false;
      }
    }
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return true;
    return (
      app.round.courseName.toLowerCase().includes(q) ||
      app.applicationCode.toLowerCase().includes(q) ||
      app.round.roundCode.toLowerCase().includes(q)
    );
  })
);

/** تصفية الجدول لعرض طلبات في انتظار السداد فورياً */
function filterToPendingPayment() {
  activeTab.value = 'PendingPayment';
  searchQuery.value = '';
  showToast('تم تصفية العرض: طلبات في انتظار السداد');
  setTimeout(() => {
    const el = document.getElementById('applications-data-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

/** سعر فئة المتدرب من CoursePricings */
function categoryPrice(app) {
  return getPriceByCategory(app.round.pricings, traineeProfile.category);
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '—';
  return `${Number(amount).toLocaleString('ar-EG')} ج.م`;
}

// --- Toast ---
const toast = ref({ type: '', text: '' });
let toastTimer = null;

function showToast(text, type = 'success') {
  toast.value = { type, text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = { type: '', text: '' };
  }, 3500);
}

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    showToast(`تم نسخ كود الطلب: ${code}`, 'success');
  } catch {
    showToast(`كود الطلب: ${code}`, 'info');
  }
}

function handleRefresh() {
  isRefreshing.value = true;
  traineeStore.load(traineeProfile.userId);
  setTimeout(() => {
    isRefreshing.value = false;
    showToast('تم تحديث حالة الطلبات بنجاح');
  }, 500);
}

// ============================================================
// حسابات مسار المخطط الزمني للطلبات (4 مراحل متسلسلة)
// 1. التقديم والحجز (Application & Booking)
// 2. متابعة الشؤون (Affairs Review)
// 3. سداد الرسوم (Fee Payment)
// 4. القبول بالدورة (Course Enrollment / Acceptance)
// ============================================================
function getMetroStations(app) {
  const isRejected = app.status === 'Rejected' || app.status === 'rejected_expired';
  const isUnderReview = app.status === 'UnderReview' || app.status === 'pending_affairs';
  const isPendingPayment = app.status === 'PendingPayment' || app.status === 'PaymentMissed';
  const isEnrolled = app.status === 'Enrolled';
  const isCourseEnded = app.status === 'CourseEnded';

  return [
    {
      id: 1,
      title: 'التقديم والحجز',
      subtitle: formatDateDmy(app.createdAt),
      status: 'completed',
      tag: 'مكتمل ✓',
      description: `تم إرسال طلب الالتحاق وحجز المقعد مبدئياً برقم (${app.applicationCode}).`,
      icon: Send,
    },
    {
      id: 2,
      title: 'متابعة الشؤون',
      subtitle: isUnderReview ? 'قيد الفحص والمطابقة' : formatDateDmy(app.updatedAt),
      status: isRejected ? 'rejected' : (isUnderReview ? 'active' : 'completed'),
      tag: isRejected ? 'مرفوض ✕' : (isUnderReview ? 'المرحلة النشطة ●' : 'معتمد ✓'),
      description: isRejected
        ? (app.rejectionReason || 'عدم استيفاء شروط المؤهل والتخصص المطلوب للدورة.')
        : (isUnderReview
          ? 'المستندات والمؤهل قيد الفحص والتدقيق الأكاديمي لدى شؤون الدارسين.'
          : 'تم فحص المستندات والاعتماد الأكاديمي بنجاح من شؤون الدارسين.'),
      icon: isRejected ? XCircle : (isUnderReview ? Clock : Check),
    },
    {
      id: 3,
      title: 'سداد الرسوم',
      subtitle: isPendingPayment
        ? (app.paymentDueDate ? `مهلة حتى: ${formatDateDmy(app.paymentDueDate)}` : 'مفتوح للسداد')
        : (app.paymentDate ? formatDateDmy(app.paymentDate) : 'المرحلة 3'),
      status: isPendingPayment ? 'active' : ((isEnrolled || isCourseEnded) ? 'completed' : 'pending'),
      tag: isPendingPayment ? 'بانتظار السداد ●' : ((isEnrolled || isCourseEnded) ? 'مسدد بالكامل ✓' : 'مجدول'),
      description: (isEnrolled || isCourseEnded)
        ? `تم سداد ${Number(app.paidAmount || categoryPrice(app)).toLocaleString('ar-EG')} ج.م — إيصال: ${app.receiptNumber || 'معتمد'}`
        : (isPendingPayment
          ? `المبلغ المطلوب: ${formatCurrency(categoryPrice(app))}. يرجى التوجه للخزينة للسداد قبل انتهاء المهلة.`
          : 'يُفتح شباك السداد فور اعتماد شؤون الدارسين للطلب والمستندات.'),
      icon: Wallet,
    },
    {
      id: 4,
      title: 'القبول بالدورة',
      subtitle: isEnrolled ? 'مقبول ومقيد' : (isCourseEnded ? 'مكتمل' : 'المرحلة الختامية'),
      status: isEnrolled ? 'active-success' : (isCourseEnded ? 'completed' : 'pending'),
      tag: isEnrolled ? 'تم القيد رسمياً ★' : (isCourseEnded ? 'مكتمل ✓' : 'مجدول'),
      description: (isEnrolled || isCourseEnded)
        ? 'تم قبولك رسمياً وتفعيل تصريح المرور الأمني الموحد بالبوابة (QR) والجدول الدراسي.'
        : 'المرحلة النهائية: يتم القيد الرسمي وتفعيل الجدول فور استكمال السداد والاعتماد.',
      icon: CheckCircle2,
    },
  ];
}

function getMetroProgressPercent(app) {
  if (app.status === 'CourseEnded' || app.status === 'Enrolled') return 100;
  if (app.status === 'PendingPayment' || app.status === 'PaymentMissed') return 66;
  if (app.status === 'Rejected' || app.status === 'rejected_expired') return 33;
  if (app.status === 'UnderReview' || app.status === 'pending_affairs') return 33;
  return 15;
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
