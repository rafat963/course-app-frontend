<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Award class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                شهاداتي المعتمدة
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ issuedCount }} شهادة صادرة
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              شهادات إتمام الدورات المعتمدة من المعهد — قابلة للطباعة والتحميل والتحقق بالكود
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm">
            {{ userInitials }}
          </div>
          <div>
            <div class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{{ traineeProfile.fullName }}</div>
            <div class="text-[11px] text-slate-400">دارس معتمد بالمعهد</div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         2. مؤشرات سريعة (KPIs)
         ========================================================= -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <AppKpiCard
        title="شهادات صادرة ومعتمدة"
        :value="issuedCount"
        badge="جاهزة للتحميل والطباعة"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        :icon="BadgeCheck"
      />
      <AppKpiCard
        title="متوسط التقييم النهائي"
        :value="`${averageGrade}%`"
        :badge="averageGrade >= 70 ? 'أداء أكاديمي متميز' : 'أداء جيد'"
        badge-class="text-primary-600 dark:text-primary-400 font-bold"
        icon-bg="bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
        :icon="TrendingUp"
      />
      <AppKpiCard
        title="دورات منتهية"
        :value="endedCourses.length"
        :badge="`${pendingIssueCount} غير مستوفية لشروط الإصدار`"
        badge-class="text-amber-600 dark:text-amber-400 font-bold"
        icon-bg="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        :icon="GraduationCap"
      />
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
              placeholder="ابحث باسم الدورة أو كود الشهادة..."
              class="w-full h-9 pr-9 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              type="button"
              class="h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0"
              :class="
                activeFilter === tab.value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              "
              @click="activeFilter = tab.value"
            >
              {{ tab.label }}
              <span class="mr-1 font-mono" :class="activeFilter === tab.value ? 'text-primary-100' : 'text-slate-400'">
                ({{ tab.count }})
              </span>
            </button>
          </div>
        </div>

        <!-- زر تبديل نمط العرض -->
        <div class="flex items-center justify-end shrink-0">
          <ViewModeToggle v-model="viewMode" />
        </div>
      </div>
    </div>

    <!-- =========================================================
         4. محتوى الشهادات (حالة فارغة / جدول / كروت)
         ========================================================= -->
    <!-- حالة عدم وجود بيانات -->
    <div
      v-if="!filteredCertificates.length"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm px-8 py-16 text-center space-y-3"
    >
      <div class="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
        <Award class="w-7 h-7 text-slate-400" />
      </div>
      <h3 class="text-sm font-black text-slate-700 dark:text-slate-200 font-heading">لا توجد شهادات مطابقة</h3>
      <p class="text-xs text-slate-400">
        {{ searchQuery ? 'جرّب البحث باسم دورة آخر' : 'تُصدر الشهادات تلقائياً بعد استكمال متطلبات الدورة واجتياز التقييم النهائي.' }}
      </p>
    </div>

    <!-- نمط الجدول (Table View) -->
    <div
      v-else-if="viewMode === 'table'"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden"
    >
      <AppTable
        :columns="tableColumns"
        :data="filteredCertificates"
        min-width="840px"
      >
        <!-- كود الشهادة الرسمي -->
        <template #certificateCode="{ row }">
          <div class="flex items-center gap-1.5 font-mono text-xs font-bold">
            <span v-if="row.isCertificateIssued" class="text-primary-700 dark:text-primary-300">{{ row.certificateCode }}</span>
            <span v-else class="text-slate-400">—</span>

            <button
              v-if="row.isCertificateIssued"
              type="button"
              class="w-6 h-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              title="نسخ كود الشهادة"
              @click.stop="copyCode(row.certificateCode)"
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

        <!-- التقييم النهائي -->
        <template #grade="{ row }">
          <div class="space-y-0.5">
            <span
              class="inline-block px-2 py-0.5 rounded-full font-mono font-black text-xs border"
              :class="
                row.finalGrade >= row.round.passingGrade
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              "
            >
              {{ row.finalGrade }}%
            </span>
            <span class="block text-[10px] text-slate-400">
              النجاح: {{ row.round.passingGrade }}%
            </span>
          </div>
        </template>

        <!-- حالة إصدار الشهادة -->
        <template #status="{ row }">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
            :class="
              row.isCertificateIssued
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            "
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="row.isCertificateIssued ? 'bg-emerald-500' : 'bg-slate-400'" />
            {{ row.isCertificateIssued ? 'معتمدة وصادرة' : 'لم تُصدر (راسب)' }}
          </span>
        </template>

        <!-- تاريخ الإصدار -->
        <template #issuedAt="{ row }">
          <span class="font-mono text-slate-600 dark:text-slate-300 text-xs">
            {{ row.isCertificateIssued ? formatDateDmy(row.certificateIssuedAt) : '—' }}
          </span>
        </template>

        <!-- الإجراءات (التحميل والطباعة مفعلان فقط إذا صدرت الشهادة) -->
        <template #actions="{ row }">
          <div class="flex items-center gap-1.5 justify-end">
            <button
              type="button"
              class="h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              :class="
                row.isCertificateIssued
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
              "
              :disabled="!row.isCertificateIssued"
              :title="row.isCertificateIssued ? 'عرض وتحميل الشهادة' : 'الشهادة لم تُصدر لعدم اجتياز نسبة النجاح'"
              @click="openCertificate(row)"
            >
              <FileDown class="w-3.5 h-3.5" />
              <span>تحميل</span>
            </button>

            <button
              type="button"
              class="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
              :class="
                row.isCertificateIssued
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
              "
              :disabled="!row.isCertificateIssued"
              :title="row.isCertificateIssued ? 'طباعة فورية' : 'غير قابلة للطباعة'"
              @click="printCertificate(row)"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
          </div>
        </template>
      </AppTable>
    </div>

    <!-- نمط البطاقات (Cards View) -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <article
        v-for="app in filteredCertificates"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
      >
        <!-- شريط علوي -->
        <div
          class="px-5 py-2.5 flex items-center justify-between gap-2 border-b"
          :class="
            app.isCertificateIssued
              ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
          "
        >
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
            :class="
              app.isCertificateIssued
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            "
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="app.isCertificateIssued ? 'bg-emerald-500' : 'bg-slate-400'" />
            {{ app.isCertificateIssued ? 'شهادة معتمدة صادرة' : 'لم تُصدر الشهادة' }}
          </span>

          <div class="flex items-center gap-1.5">
            <span class="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {{ app.certificateCode || 'غير صادر' }}
            </span>
            <button
              v-if="app.isCertificateIssued"
              type="button"
              class="w-6 h-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              title="نسخ كود الشهادة"
              @click="copyCode(app.certificateCode)"
            >
              <Copy class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- 1. صورة / معاينة الشهادة في الجزء العلوي من الكارت بشكل بارز -->
        <div class="px-5 pt-4">
          <div
            class="relative w-full aspect-[16/9] sm:aspect-[16/8.5] rounded-2xl overflow-hidden border-2 transition-all duration-300 group cursor-pointer"
            :class="
              app.isCertificateIssued
                ? 'border-amber-400/50 bg-gradient-to-br from-amber-50/90 via-white to-amber-100/60 dark:from-slate-900 dark:via-slate-800 dark:to-amber-950/20 shadow-md hover:shadow-xl hover:border-amber-500'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 opacity-80'
            "
            :title="app.isCertificateIssued ? 'انقر لمعاينة وتحميل الوثيقة الرسمية' : 'الشهادة لم تُعتمد بعد'"
            @click="app.isCertificateIssued && openCertificate(app)"
          >
            <!-- الزخرفة والإطار المذهب المزدوج -->
            <div class="absolute inset-2 border border-amber-600/20 dark:border-amber-500/20 rounded-xl pointer-events-none" />
            <div class="absolute inset-3 border-2 border-double border-amber-600/30 dark:border-amber-500/30 rounded-lg pointer-events-none" />

            <!-- علامة مائية لشعار المعهد بالخلفية -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] dark:opacity-[0.08]">
              <img :src="instituteLogo" alt="Institute Watermark" class="w-36 h-36 object-contain" />
            </div>

            <!-- محتوى وثيقة الشهادة المصغرة المعاينة -->
            <div class="relative z-10 h-full p-4 flex flex-col justify-between text-center select-none">
              <!-- ترويسة مصغرة للشهادة -->
              <div class="flex items-center justify-between border-b border-amber-700/20 dark:border-amber-500/20 pb-2">
                <div class="text-right leading-tight">
                  <div class="text-[9px] font-black text-slate-800 dark:text-slate-100">جمهورية مصر العربية • وزارة الدفاع</div>
                  <div class="text-[8px] font-bold text-amber-700 dark:text-amber-400">معهد نظم المعلومات للقوات المسلحة</div>
                </div>

                <!-- لوجو المعهد المذهب -->
                <div class="w-9 h-9 rounded-full p-1 bg-white dark:bg-slate-800 border border-amber-400/60 shadow-xs flex items-center justify-center shrink-0">
                  <img :src="instituteLogo" alt="شعار المعهد" class="w-7 h-7 object-contain" />
                </div>

                <div class="text-left font-mono text-[8px] text-slate-500 dark:text-slate-400 leading-tight">
                  <div>{{ app.certificateCode || 'NOT-ISSUED' }}</div>
                  <div>{{ app.isCertificateIssued ? formatDateDmy(app.certificateIssuedAt) : 'قيد المراجعة' }}</div>
                </div>
              </div>

              <!-- قلب الشهادة: عنوان الشهادة واسم الدورة والمتدرب -->
              <div class="my-auto py-1 space-y-1">
                <div class="text-[9px] tracking-[0.2em] font-mono font-black text-amber-600 dark:text-amber-400 uppercase">
                  CERTIFICATE OF COMPLETION
                </div>
                <h4 class="text-xs sm:text-sm font-black font-heading text-slate-900 dark:text-slate-100 tracking-wide">
                  شهـادة اجـتـيـاز وتـخـرج مـعـتـمـدة
                </h4>
                <div class="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                  تُمنح للدارس: <strong class="font-bold text-slate-900 dark:text-white">{{ traineeProfile.fullName }}</strong>
                </div>
                <div class="text-[10px] text-primary-700 dark:text-primary-300 font-bold line-clamp-1">
                  لاجتيازه دورة: {{ app.round.courseName }}
                </div>
              </div>

              <!-- فوتر الشهادة المصغر: الأختام والتقدير والباركود -->
              <div class="pt-2 border-t border-amber-700/20 dark:border-amber-500/20 flex items-center justify-between text-[8px] text-slate-600 dark:text-slate-400">
                <div class="flex items-center gap-1">
                  <Award class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span class="font-bold text-slate-800 dark:text-slate-200">التقدير العام: ممتاز ({{ app.finalGrade }}%)</span>
                </div>
                <div class="flex items-center gap-1 font-mono">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>معتمد ورقمي رسمي</span>
                </div>
              </div>

              <!-- طبقة التفاعل عند التحويم (Hover Overlay) -->
              <div
                v-if="app.isCertificateIssued"
                class="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-2"
              >
                <div class="w-10 h-10 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
                  <Eye class="w-5 h-5" />
                </div>
                <span class="text-xs font-black drop-shadow-sm">انقر لمعاينة وتحميل الشهادة الرسمية</span>
              </div>

              <!-- شارة عدم الإصدار إن وُجدت -->
              <div
                v-else
                class="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] flex flex-col items-center justify-center text-slate-200 gap-1.5 p-4"
              >
                <Info class="w-6 h-6 text-amber-400" />
                <span class="text-xs font-black">الشهادة قيد الاعتماد الأكاديمي</span>
                <span class="text-[10px] text-slate-300">لم تصل لنسبة النجاح المقررة ({{ app.round.passingGrade }}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. كروت/عناصر مؤشرات الأداء الرئيسية (KPIs) أسفل صورة الشهادة مباشرة داخل الكارت -->
        <div class="p-5 pt-3 space-y-4 flex-1">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <!-- 1. الدرجة النهائية -->
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-[10px] text-slate-400">الدرجة النهائية</div>
              <div class="font-bold font-mono text-xs" :class="gradeColor(app)">
                {{ app.finalGrade }}%
              </div>
            </div>

            <!-- 2. نسبة النجاح المطلوبة -->
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-[10px] text-slate-400">نسبة النجاح المقررة</div>
              <div class="font-bold font-mono text-xs text-slate-700 dark:text-slate-200">
                {{ app.round.passingGrade }}%
              </div>
            </div>

            <!-- 3. تاريخ اعتماد الشهادة -->
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-[10px] text-slate-400">تاريخ الاعتماد</div>
              <div class="font-bold font-mono text-xs text-slate-700 dark:text-slate-200">
                {{ app.isCertificateIssued ? formatDateDmy(app.certificateIssuedAt) : '—' }}
              </div>
            </div>

            <!-- 4. سجل حضور المحاضرات -->
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 space-y-0.5">
              <div class="text-[10px] text-slate-400">سجل الحضور</div>
              <div class="font-bold font-mono text-xs text-slate-700 dark:text-slate-200">
                {{ app.attendedLectures }} / {{ app.round.totalLectures }}
              </div>
            </div>
          </div>

          <!-- تفاصيل الدورة التدريبية -->
          <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-snug">
                {{ app.round.courseName }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-1">
                <span class="text-primary-600 dark:text-primary-400 font-bold">{{ app.round.courseDomain }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span class="font-mono">{{ app.round.roundCode }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span>المحاضر: {{ app.round.instructor.name }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span>تاريخ الإتمام: {{ formatDateDmy(app.round.endDate) }}</span>
              </div>
            </div>

            <!-- دائرة التقييم الدائري -->
            <div class="relative w-12 h-12 shrink-0">
              <svg class="w-12 h-12 -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" stroke-width="6" class="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="gradeOffset(app.finalGrade)"
                  :class="gradeColor(app)"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-[11px] font-black font-mono text-slate-800 dark:text-slate-100">{{ app.finalGrade }}%</span>
              </div>
            </div>
          </div>

          <!-- ملاحظة عدم استيفاء الشروط إن وُجدت -->
          <div
            v-if="!app.isCertificateIssued"
            class="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/70 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed flex items-start gap-2"
          >
            <Info class="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
            <span>
              التقييم النهائي ({{ app.finalGrade }}%) أقل من نسبة النجاح المعتمدة ({{ app.round.passingGrade }}%)، لذلك تم حجب إصدار الشهادة. يمكنك التواصل مع إدارة شؤون الدارسين لإعادة الاختبار أو التسجيل بدورة جديدة.
            </span>
          </div>
        </div>

        <!-- أزرار الإجراءات (مفعلة فقط عندما IsCertificateIssued == true) -->
        <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center gap-2">
          <button
            type="button"
            class="flex-1 h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            :class="
              app.isCertificateIssued
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
            "
            :disabled="!app.isCertificateIssued"
            :title="app.isCertificateIssued ? 'عرض وتحميل الشهادة المعتمدة' : 'الشهادة لم تُصدر لعدم اجتياز الدورة'"
            @click="openCertificate(app)"
          >
            <FileDown class="w-3.5 h-3.5" />
            <span>عرض وتحميل الشهادة</span>
          </button>

          <button
            type="button"
            class="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            :class="
              app.isCertificateIssued
                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
            "
            :disabled="!app.isCertificateIssued"
            title="طباعة"
            @click="printCertificate(app)"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </article>
    </div>

    <!-- مودال معاينة الشهادة المعتمدة -->
    <CertificatePreviewModal
      ref="certModalRef"
      :is-open="isModalOpen"
      :application="selectedApplication"
      :trainee-name="traineeProfile.fullName"
      :trainee-profile="traineeProfile"
      @close="isModalOpen = false"
    />

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.text"
        class="fixed bottom-6 left-6 z-[60] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold max-w-sm bg-emerald-50 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
      >
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>{{ toast.text }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import {
  Award,
  BadgeCheck,
  TrendingUp,
  GraduationCap,
  FileDown,
  Printer,
  Info,
  Copy,
  Search,
  CheckCircle2,
  Eye,
} from 'lucide-vue-next';
import instituteLogo from '@/assets/logo.png';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import CertificatePreviewModal from './CertificatePreviewModal.vue';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { TRAINEE_MOCK_PROFILE } from '../../helpers/availableCoursesMockData';
import { ENDED_APPLICATIONS } from '../../helpers/traineePortalMockData';
import { formatDateDmy } from '../../helpers/traineePortalHelpers';

const authStore = useAuthStore();

const traineeProfile = {
  ...TRAINEE_MOCK_PROFILE,
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId,
};

const userInitials = computed(() => {
  const parts = (traineeProfile.fullName || 'م').trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]} ${parts[1][0]}` : traineeProfile.fullName.slice(0, 2);
});

const viewMode = ref('cards'); // 'cards' | 'table'
const searchQuery = ref('');
const activeFilter = ref('all');

const endedCourses = computed(() => ENDED_APPLICATIONS);
const issuedCount = computed(() => endedCourses.value.filter((app) => app.isCertificateIssued).length);
const pendingIssueCount = computed(() => endedCourses.value.length - issuedCount.value);

const filterTabs = computed(() => [
  { value: 'all', label: 'جميع الدورات المنتهية', count: endedCourses.value.length },
  { value: 'issued', label: 'الشهادات المعتمدة الصادرة', count: issuedCount.value },
  { value: 'unissued', label: 'غير مستوفية لشروط الإصدار', count: pendingIssueCount.value },
]);

const filteredCertificates = computed(() => {
  return endedCourses.value.filter((app) => {
    // تصفية حسب التبويب
    if (activeFilter.value === 'issued' && !app.isCertificateIssued) return false;
    if (activeFilter.value === 'unissued' && app.isCertificateIssued) return false;

    // بحث
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return true;
    return (
      app.round.courseName.toLowerCase().includes(q) ||
      (app.certificateCode && app.certificateCode.toLowerCase().includes(q)) ||
      app.round.roundCode.toLowerCase().includes(q)
    );
  });
});

const tableColumns = [
  { key: 'certificateCode', label: 'كود الشهادة الرسمي', width: '170px' },
  { key: 'course', label: 'الدورة التدريبية والدفعة', minWidth: '220px' },
  { key: 'grade', label: 'التقييم النهائي', width: '130px' },
  { key: 'status', label: 'حالة الاعتماد', width: '140px' },
  { key: 'issuedAt', label: 'تاريخ الإصدار', width: '110px' },
  { key: 'actions', label: 'الإجراءات', width: '150px', align: 'left' },
];

const averageGrade = computed(() => {
  if (!endedCourses.value.length) return 0;
  const sum = endedCourses.value.reduce((acc, app) => acc + Number(app.finalGrade || 0), 0);
  return Math.round(sum / endedCourses.value.length);
});

// --- التقييم الدائري ---
const circumference = 2 * Math.PI * 30;

function gradeOffset(grade) {
  const clamped = Math.max(0, Math.min(100, Number(grade) || 0));
  return circumference - (clamped / 100) * circumference;
}

function gradeColor(app) {
  if (Number(app.finalGrade) >= app.round.passingGrade) return 'text-emerald-500';
  return 'text-rose-500';
}

// --- المودال ---
const isModalOpen = ref(false);
const selectedApplication = ref(null);
const certModalRef = ref(null);

function openCertificate(app) {
  if (!app.isCertificateIssued) return;
  selectedApplication.value = app;
  isModalOpen.value = true;
}

function printCertificate(app) {
  if (!app.isCertificateIssued) return;
  selectedApplication.value = app;
  isModalOpen.value = true;
  nextTick(() => {
    setTimeout(() => {
      if (certModalRef.value?.handlePrint) {
        certModalRef.value.handlePrint();
      } else {
        window.print();
      }
    }, 250);
  });
}

// --- Toast ---
const toast = ref({ text: '' });
let toastTimer = null;

function showToast(text) {
  toast.value = { text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = { text: '' };
  }, 3000);
}

async function copyCode(code) {
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    showToast(`تم نسخ كود الشهادة: ${code}`);
  } catch {
    showToast(`كود الشهادة: ${code}`);
  }
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