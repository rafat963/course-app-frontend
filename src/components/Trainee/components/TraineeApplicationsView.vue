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
        title="طلبات نشطة (قيد المراجعة)"
        :value="statusCount('UnderReview')"
        :badge="statusCount('UnderReview') ? 'بانتظار قرار الشؤون' : 'لا يوجد'"
        badge-class="text-blue-600 dark:text-blue-400 font-bold"
        icon-bg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
        :icon="Clock"
      />
      <AppKpiCard
        title="في انتظار السداد"
        :value="statusCount('PendingPayment')"
        :badge="nearestDueLabel"
        badge-class="text-amber-600 dark:text-amber-400 font-bold"
        icon-bg="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        :icon="Wallet"
      />
      <AppKpiCard
        title="دورات مكتملة"
        :value="statusCount('CourseEnded')"
        :badge="`${issuedCertificatesCount} شهادة صادرة`"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        :icon="CheckCircle2"
      />
    </div>

    <!-- تنبيه مواعيد السداد العاجلة -->
    <div
      v-if="urgentPayments.length"
      class="rounded-3xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/90 dark:bg-amber-950/40 px-5 py-4 flex items-start gap-3 shadow-xs"
    >
      <AlertTriangle class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div class="text-xs space-y-1.5 flex-1">
        <div class="font-black text-amber-900 dark:text-amber-200 text-sm">
          تنبيه مهلة سداد عاجلة
        </div>
        <p class="text-amber-800 dark:text-amber-300">
          لديك طلبات تم اعتمادها وقيد انتظار السداد بالخزينة قبل انقضاء المهلة لتفادي إلغاء المقعد:
        </p>
        <ul class="space-y-1 text-amber-900 dark:text-amber-200">
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

    <!-- =========================================================
         3. شريط البحث والفلاتر + تبديل العرض (Table / Cards)
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
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

        <!-- أزرار تبديل نمط العرض (جدول / كروت) -->
        <div class="flex items-center justify-end shrink-0">
          <ViewModeToggle v-model="viewMode" />
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
        min-width="840px"
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
            :class="statusConfig(row.status).badge"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig(row.status).dot" />
            {{ statusConfig(row.status).label }}
          </span>
        </template>

        <!-- تفاصيل / مهلة / تنبيه -->
        <template #details="{ row }">
          <div class="text-[11px] max-w-[220px]">
            <!-- قيد المراجعة -->
            <div v-if="row.status === 'UnderReview'" class="text-blue-600 dark:text-blue-400">
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
            <div v-else-if="row.status === 'Rejected'" class="text-rose-600 dark:text-rose-400 truncate" :title="row.rejectionReason">
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

        <!-- الإجراءات -->
        <template #actions="{ row }">
          <div class="flex items-center gap-1.5 justify-end">
            <button
              type="button"
              class="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              title="عرض التفاصيل الكاملة للطلب"
              @click="openDetails(row)"
            >
              <Eye class="w-3.5 h-3.5" />
              <span>تفاصيل</span>
            </button>

            <RouterLink
              v-if="row.status === 'Enrolled'"
              to="/trainee/passes"
              class="h-8 px-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
              title="عرض تصريح الدخول"
            >
              <QrCode class="w-3.5 h-3.5" />
              <span>تصريح</span>
            </RouterLink>

            <RouterLink
              v-else-if="row.status === 'CourseEnded' && row.isCertificateIssued"
              to="/trainee/certificates"
              class="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
              title="عرض الشهادة المعتمدة"
            >
              <Award class="w-3.5 h-3.5" />
              <span>شهادة</span>
            </RouterLink>
          </div>
        </template>
      </AppTable>
    </div>

    <!-- نمط البطاقات (Cards View) -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <article
        v-for="app in filteredApplications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
      >
        <!-- شريط الحالة العلوي -->
        <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
            :class="statusConfig(app.status).badge"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig(app.status).dot" />
            {{ statusConfig(app.status).label }}
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
        <div class="p-5 space-y-3.5 flex-1">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
              <BookOpen class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-snug">
                {{ app.round.courseName }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-1">
                <span>{{ app.round.courseDomain }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span class="font-mono">{{ app.round.roundCode }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span>الدفعة {{ app.round.roundNumber }}</span>
              </div>
            </div>
          </div>

          <!-- بيانات الدفعة -->
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

          <!-- لوحة الحالة: قيد المراجعة (UnderReview) -->
          <div
            v-if="app.status === 'UnderReview'"
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
            class="p-3.5 rounded-2xl border space-y-2"
            :class="getPaymentUrgency(app.paymentDueDate)?.boxClass || 'bg-amber-50 border-amber-200'"
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

          <!-- لوحة الحالة: مرفوض (Rejected) -->
          <div
            v-else-if="app.status === 'Rejected'"
            class="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70 space-y-1.5"
          >
            <div class="flex items-center gap-1.5 text-[11px] font-black text-rose-700 dark:text-rose-300">
              <XCircle class="w-3.5 h-3.5" />
              سبب الرفض الرسمي (شؤون الدارسين)
            </div>
            <p class="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed">
              {{ app.rejectionReason }}
            </p>
            <div class="text-[10px] text-rose-500 dark:text-rose-400">
              تاريخ القرار: {{ formatDateDmy(app.updatedAt) }}
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
              تصريح الدخول برمز QR متاح الآن — أبرزه عند بوابات المعهد.
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

          <RouterLink
            v-if="app.status === 'Enrolled'"
            to="/trainee/passes"
            class="inline-flex items-center gap-1 text-[11px] font-black text-primary-600 dark:text-primary-400 hover:underline"
          >
            عرض تصريح الدخول
            <ArrowLeft class="w-3 h-3" />
          </RouterLink>

          <RouterLink
            v-else-if="app.status === 'CourseEnded'"
            to="/trainee/certificates"
            class="inline-flex items-center gap-1 text-[11px] font-black text-primary-600 dark:text-primary-400 hover:underline"
          >
            عرض الشهادة
            <ArrowLeft class="w-3 h-3" />
          </RouterLink>

          <button
            v-else-if="app.status === 'PendingPayment' || app.status === 'PaymentMissed'"
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            @click="copyCode(app.applicationCode)"
          >
            <Copy class="w-3 h-3" />
            نسخ كود السداد
          </button>

          <RouterLink
            v-else-if="app.status === 'Rejected'"
            to="/trainee/courses"
            class="inline-flex items-center gap-1 text-[11px] font-black text-primary-600 dark:text-primary-400 hover:underline"
          >
            التقديم على دورة بديلة
            <ArrowLeft class="w-3 h-3" />
          </RouterLink>

          <span v-else class="text-[10px] text-slate-400">
            يتم التحديث تلقائياً عند اعتماد الطلب
          </span>
        </div>
      </article>
    </div>

    <!-- مودال تفاصيل الطلب الشاملة -->
    <TraineeApplicationDetailsModal
      :is-open="isDetailsModalOpen"
      :application="selectedApplication"
      :trainee-category="traineeProfile.category"
      @close="isDetailsModalOpen = false"
    />

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.text"
        class="fixed bottom-6 left-6 z-[60] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold max-w-sm"
        :class="
          toast.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
        "
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 shrink-0" />
        <Info v-else class="w-4 h-4 shrink-0" />
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
  BookOpen,
  GraduationCap,
  Award,
  XCircle,
  AlertTriangle,
  FileSearch,
  Info,
  Eye,
  QrCode,
} from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import TraineeApplicationDetailsModal from './TraineeApplicationDetailsModal.vue';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTraineeApplicationsStore } from '../stores/traineeApplicationsStore';
import { TRAINEE_MOCK_PROFILE } from '../helpers/availableCoursesMockData';
import { CATEGORY_CONFIG, formatLectureDays, getPriceByCategory } from '../helpers/availableCoursesHelpers';
import { TRAINEE_APPLICATIONS } from '../helpers/traineePortalMockData';
import {
  getStatusConfig,
  formatDateDmy,
  formatTimeRange,
  getPaymentUrgency,
  daysUntil,
} from '../helpers/traineePortalHelpers';

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

const viewMode = ref('cards'); // 'cards' | 'table'
const isRefreshing = ref(false);
const searchQuery = ref('');
const activeTab = ref('all');

// مودال التفاصيل
const isDetailsModalOpen = ref(false);
const selectedApplication = ref(null);

function openDetails(app) {
  selectedApplication.value = app;
  isDetailsModalOpen.value = true;
}

// أعمدة جدول الطلبات
const tableColumns = [
  { key: 'applicationCode', label: 'كود الطلب', width: '130px' },
  { key: 'course', label: 'الدورة التدريبية', minWidth: '220px' },
  { key: 'createdAt', label: 'تاريخ التقديم', width: '110px' },
  { key: 'price', label: 'الرسوم المقررة', width: '120px' },
  { key: 'status', label: 'حالة الطلب', width: '130px' },
  { key: 'details', label: 'الملاحظات والمهلة', minWidth: '180px' },
  { key: 'actions', label: 'الإجراءات', width: '140px', align: 'left' },
];

// دمج البيانات الأساسية مع أي طلبات حديثة أضافها المتدرب من متجر التقديمات
onMounted(() => {
  traineeStore.load(traineeProfile.userId);
});

const applications = computed(() => {
  const base = [...TRAINEE_APPLICATIONS];
  // دمج الطلبات المنشأة حديثاً عبر المتجر في حال وجودها
  if (traineeStore.applications?.length) {
    traineeStore.applications.forEach((storeApp) => {
      if (!base.some((b) => b.applicationCode === storeApp.applicationCode)) {
        base.unshift({
          id: storeApp.id,
          applicationCode: storeApp.applicationCode,
          status: storeApp.status || 'UnderReview',
          createdAt: storeApp.createdAt || new Date().toISOString(),
          updatedAt: storeApp.updatedAt || new Date().toISOString(),
          qrToken: storeApp.qrToken || 'mock-qr-token',
          rejectionReason: null,
          paymentDueDate: null,
          paymentDate: null,
          receiptNumber: null,
          paidAmount: null,
          certificateCode: null,
          finalGrade: null,
          isCertificateIssued: false,
          extensionCount: 0,
          round: storeApp.round || {
            courseName: storeApp.courseName || 'دورة تدريبية',
            courseCode: storeApp.courseCode || 'CRS-NEW',
            courseDomain: 'عام',
            roundNumber: 1,
            roundCode: 'CR-NEW-1',
            startDate: '2026-12-01',
            endDate: '2027-01-15',
            startTime: '10:00',
            endTime: '14:00',
            lectureDays: ['Sun', 'Tue', 'Thu'],
            totalLectures: 16,
            passingGrade: 60,
            hall: { name: 'قاعة تدريب 1', location: 'المبنى التعليمي' },
            instructor: { name: 'هيئة التدريس بالمعهد', specialty: 'تخصصات تقنية' },
            pricings: { Civilian: 3500, MilitaryOfficer: 1750, MilitaryFamily: 2100, PoliceOfficerOrFamily: 2300 },
          },
        });
      }
    });
  }
  return base;
});

const statusConfig = (status) => getStatusConfig(status);

const statusCount = (status) => applications.value.filter((app) => app.status === status).length;

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
    (app) => app.status === 'PendingPayment' && (daysUntil(app.paymentDueDate) ?? 99) <= 3
  )
);

const tabs = computed(() => [
  { value: 'all', label: 'الكل', count: applications.value.length },
  { value: 'UnderReview', label: 'قيد المراجعة', count: statusCount('UnderReview') },
  { value: 'PendingPayment', label: 'في انتظار السداد', count: statusCount('PendingPayment') },
  { value: 'Enrolled', label: 'مقيد بالدورة', count: statusCount('Enrolled') },
  { value: 'CourseEnded', label: 'مكتملة', count: statusCount('CourseEnded') },
  { value: 'Rejected', label: 'مرفوضة', count: statusCount('Rejected') },
]);

const filteredApplications = computed(() =>
  applications.value.filter((app) => {
    if (activeTab.value !== 'all' && app.status !== activeTab.value) return false;
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return true;
    return (
      app.round.courseName.toLowerCase().includes(q) ||
      app.applicationCode.toLowerCase().includes(q) ||
      app.round.roundCode.toLowerCase().includes(q)
    );
  })
);

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