<template>
  <div class="space-y-5 select-none pb-8 animate-fade-in">
    <!-- 1. شريط التنقل العلوي وزر الرجوع وأزرار الإجراءات -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
      <div class="flex items-center gap-3">
        <!-- زر الرجوع إلى دليل الدورات -->
        <button
          type="button"
          class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          title="الرجوع إلى دليل كل الدورات"
          @click="$emit('back')"
        >
          <ArrowRight class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>رجوع إلى كل الدورات</span>
        </button>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              تفاصيل وبيانات الدورة: {{ course.name }}
            </h2>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs"
              :class="
                course.isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              "
            >
              {{ course.isActive ? 'دورة نشطة ومتاحة' : 'معطلة مؤقتاً' }}
            </span>
            <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
              CRS-{{ String(course.id).padStart(3, '0') }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ملف متكامل لتوصيف الدورة وهيكل الرسوم المعتمدة وسجل كافة الدورات السابقة المنعقدة
          </p>
        </div>
      </div>

      <!-- أزرار الإجراءات العلوية -->
      <div class="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
        <!-- زر فتح دورة انعقاد جديدة لهذا الكورس -->
        <button
          type="button"
          class="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow"
          title="فتح دورة انعقاد جديدة (دفعة تشغيلية) من هذا الكورس"
          @click="$emit('open-create-round', course.id)"
        >
          <CalendarPlus class="w-4 h-4" />
          <span>فتح دفعة جديدة</span>
        </button>
      </div>
    </div>

    <!-- 2. السكشن الأول: البيانات والتفاصيل الأساسية والأكاديمية والتشغيلية -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Info class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>البيانات والتفاصيل الأكاديمية والتشغيلية</span>
        </h3>
        <span class="text-xs text-slate-400 font-mono">
          معتمد بكتالوج معهد نظم المعلومات
        </span>
      </div>

      <!-- بطاقة المحاضر والوصف -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- بطاقة المحاضر المعتمد -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <GraduationCap class="w-5 h-5" />
            </div>
            <div>
              <span class="text-xs text-slate-500 dark:text-slate-400 block font-bold">المحاضر المعتمد للدورة:</span>
              <strong class="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base block">
                {{ course.instructorName || 'لم يُحدد بعد' }}
              </strong>
            </div>
          </div>
          <p class="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
            مسؤول التدريب وإعداد المادة العلمية المعتمدة
          </p>
        </div>

        <!-- بطاقة التوصيف والمحتوى الأكاديمي -->
        <div class="lg:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block">وصف ومحتوى الدورة:</span>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {{ course.description || 'لا يوجد توصيف مسجل حالياً لهذه الدورة.' }}
          </p>
        </div>
      </div>

      <!-- المؤشرات التراكمية الإجمالية للدورة -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">إجمالي الدفعات:</span>
          <div class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {{ course.roundsCount || 0 }} دفعة
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الدورات السابقة:</span>
          <div class="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {{ pastRounds.length }} دورة منتهية
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الخريجون المعتمدون:</span>
          <div class="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {{ totalGraduates }} خريجاً
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الإيرادات المحصلة:</span>
          <div class="text-lg sm:text-xl font-black text-primary-700 dark:text-primary-300 font-mono">
            {{ formatEgyptianCurrency(totalRevenue) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 3. السكشن الثاني: هيكل الرسوم والأسعار المعتمدة للفئات التدريبية -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard class="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
              هيكل الرسوم والأسعار المعتمدة للفئات التدريبية
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              الرسوم الرسمية المقررة لكل فئة معتمدة عند فتح باب التسجيل والسداد
            </p>
          </div>
        </div>
        <span class="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          4 فئات معتمدة
        </span>
      </div>

      <!-- شبكة كروت الأسعار للفئات الأربعة -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
        <!-- 1. مدني -->
        <div class="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2 shadow-2xs hover:border-slate-400 transition-colors">
          <span class="text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>فئة مدني:</span>
          </span>
          <strong class="font-mono text-slate-900 dark:text-slate-100 font-black text-base sm:text-xl">
            {{ formatEgyptianCurrency(course.pricings?.Civilian) }}
          </strong>
          <span class="text-[11px] text-slate-400 font-medium">السعر الأساسي المعتمد</span>
        </div>

        <!-- 2. ضابط ق.م -->
        <div class="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-200/80 dark:border-primary-800 flex flex-col justify-between gap-2 shadow-2xs hover:border-primary-400 transition-colors">
          <span class="text-primary-800 dark:text-primary-300 text-xs font-bold flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-primary-600"></span>
            <span>ضابط ق.م:</span>
          </span>
          <strong class="font-mono text-primary-900 dark:text-primary-200 font-black text-base sm:text-xl">
            {{ formatEgyptianCurrency(course.pricings?.MilitaryOfficer) }}
          </strong>
          <span class="text-[11px] text-primary-700 dark:text-primary-400 font-medium">فئة ضباط القوات المسلحة</span>
        </div>

        <!-- 3. عائلات ق.م -->
        <div class="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 flex flex-col justify-between gap-2 shadow-2xs hover:border-emerald-400 transition-colors">
          <span class="text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>عائلات ق.م:</span>
          </span>
          <strong class="font-mono text-emerald-900 dark:text-emerald-200 font-black text-base sm:text-xl">
            {{ formatEgyptianCurrency(course.pricings?.MilitaryFamily) }}
          </strong>
          <span class="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">عائلات وأسر القوات المسلحة</span>
        </div>

        <!-- 4. شرطة / عائلاتهم -->
        <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800 flex flex-col justify-between gap-2 shadow-2xs hover:border-blue-400 transition-colors">
          <span class="text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>شرطة / عائلاتهم:</span>
          </span>
          <strong class="font-mono text-blue-900 dark:text-blue-200 font-black text-base sm:text-xl">
            {{ formatEgyptianCurrency(course.pricings?.PoliceOfficerOrFamily) }}
          </strong>
          <span class="text-[11px] text-blue-700 dark:text-blue-400 font-medium">ضباط وأسر هيئة الشرطة</span>
        </div>
      </div>
    </div>

    <!-- 4. السكشن الثالث: سجل الدورات السابقة المنعقدة لدورة «{{ course.name }}» -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <History class="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
              سجل الدورات السابقة المنعقدة لدورة «{{ course.name }}»
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              سجل تاريخي كامل لجميع دفعات الدورة المنتهية ومتابعة الخريجين وتكاليف التشغيل
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {{ filteredRounds.length }} دورة سابقة مؤرشفة
          </span>
          <!-- محول طريقة العرض للكروت أو الجدول -->
          <ViewModeToggle
            :model-value="viewMode"
            @update:model-value="viewMode = $event"
          />
        </div>
      </div>

      <!-- بطاقات الإحصائيات الأربعة لسجل الدورات السابقة -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              إجمالي الدورات السابقة
            </span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
                {{ pastRounds.length }}
              </span>
              <span class="text-xs text-slate-500 font-bold">دفعة منتهية</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <History class="w-5 h-5" />
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              الخريجون المعتمدون
            </span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {{ totalGraduates }}
              </span>
              <span class="text-xs text-slate-500 font-bold">خريجاً معتمداً</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <GraduationCap class="w-5 h-5" />
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              إجمالي الإيرادات المحصلة
            </span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black font-mono text-primary-700 dark:text-primary-300">
                {{ formatEgyptianCurrency(totalRevenue) }}
              </span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <Wallet class="w-5 h-5" />
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              متوسط حضور البوابة
            </span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
                {{ averageAttendanceRate }}%
              </span>
              <span class="text-xs text-slate-500 font-bold">التزام بالحضور</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <CheckCircle2 class="w-5 h-5" />
          </div>
        </div>
      </div>

      <!-- شريط البحث والفلترة السريعة داخل أرشيف الدورة -->
      <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative flex-1 w-full">
          <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ابحث بكود الدفعة، اسم المحاضر، أو القاعة..."
            class="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
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

        <div class="text-xs text-slate-500 font-bold shrink-0">
          عرض {{ filteredRounds.length }} من أصل {{ pastRounds.length }} دورة سابقة
        </div>
      </div>

      <!-- عرض الدفعات: كروت أو جدول -->
      <!-- أ. في حال لا توجد دورات سابقة -->
      <div
        v-if="filteredRounds.length === 0"
        class="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3"
      >
        <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <History class="w-7 h-7" />
        </div>
        <h4 class="text-base font-bold text-slate-800 dark:text-slate-100">
          لا توجد دورات سابقة مسجلة لدورة «{{ course.name }}»
        </h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          لم يتم أرشفة دفعات منتهية لهذه الدورة حتى الآن، أو لا توجد نتائج مطابقة لبحثك.
        </p>
      </div>

      <!-- ب. شبكة الكروت (Cards Grid) -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="round in filteredRounds"
          :key="round.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group space-y-3.5 shadow-2xs"
        >
          <div class="absolute top-0 right-0 left-0 h-1.5 bg-amber-500"></div>

          <div>
            <!-- رأس الكارت: الدفعة والكود والحالة -->
            <div class="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
              <div>
                <strong class="font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg block">
                  الدفعة رقم {{ round.roundNumber }}
                </strong>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
                    {{ round.roundCode }}
                  </span>
                  <span class="text-xs text-slate-400 font-mono">
                    CRS-{{ round.courseId }}
                  </span>
                </div>
              </div>

              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                منتهية ومؤرشفة
              </span>
            </div>

            <!-- تفاصيل المحاضر والقاعة والفترة -->
            <div class="py-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex items-center gap-2">
                <UserCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>المحاضر: <strong>{{ round.instructor?.name || '—' }}</strong></span>
              </div>

              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span>القاعة: <strong>{{ round.hall?.name || '—' }}</strong></span>
              </div>

              <div class="flex items-center gap-2 font-mono text-slate-500 dark:text-slate-400">
                <Calendar class="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {{ formatDate(round.startDate) }} إلى {{ formatDate(round.endDate) }}
                </span>
              </div>
            </div>

            <!-- إحصائيات الخريجين والإيرادات -->
            <div class="grid grid-cols-2 gap-2 text-center text-xs">
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="text-[11px] text-slate-500 block mb-0.5">الخريجون:</span>
                <strong class="font-mono font-black text-slate-800 dark:text-slate-100 text-sm">
                  {{ round.graduatedCount || 0 }} خريج
                </strong>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="text-[11px] text-slate-500 block mb-0.5">الإيراد المحصل:</span>
                <strong class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {{ formatEgyptianCurrency(round.totalRevenue) }}
                </strong>
              </div>
            </div>
          </div>

          <!-- زر الإجراء المطلوب: فتح تفاصيل وسجل الدورة في صفحة كاملة -->
          <div class="pt-2">
            <button
              type="button"
              class="w-full h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
              @click="$emit('open-round-details', round)"
            >
              <FolderCheck class="w-4 h-4" />
              <span>عرض تفاصيل وسجل الدورة</span>
            </button>
          </div>
        </div>
      </div>

      <!-- جـ. وضع الجدول (Table View) -->
      <div
        v-else
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden"
      >
        <table class="w-full text-right text-xs">
          <thead class="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold select-none">
            <tr>
              <th class="py-3.5 px-4">#</th>
              <th class="py-3.5 px-4">رقم وكود الدفعة</th>
              <th class="py-3.5 px-4">المحاضر والقاعة</th>
              <th class="py-3.5 px-4">فترة الانعقاد</th>
              <th class="py-3.5 px-4 text-center">الخريجون</th>
              <th class="py-3.5 px-4 text-center">الإيراد المحصل</th>
              <th class="py-3.5 px-4 text-center">نسبة الحضور</th>
              <th class="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr
              v-for="(round, idx) in filteredRounds"
              :key="round.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td class="py-3 px-4 font-mono font-bold text-slate-400">
                {{ idx + 1 }}
              </td>
              <td class="py-3 px-4">
                <div class="font-bold text-slate-800 dark:text-slate-100">
                  الدفعة رقم {{ round.roundNumber }}
                </div>
                <div class="text-[11px] font-mono text-slate-400">
                  {{ round.roundCode }}
                </div>
              </td>
              <td class="py-3 px-4 space-y-0.5">
                <div class="font-bold text-slate-700 dark:text-slate-300">
                  {{ round.instructor?.name || '—' }}
                </div>
                <div class="text-[11px] text-slate-500">
                  {{ round.hall?.name || '—' }}
                </div>
              </td>
              <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                <div>{{ formatDate(round.startDate) }}</div>
                <div class="text-[11px] text-slate-400">إلى {{ formatDate(round.endDate) }}</div>
              </td>
              <td class="py-3 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-100">
                {{ round.graduatedCount || 0 }} خريج
              </td>
              <td class="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {{ formatEgyptianCurrency(round.totalRevenue) }}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                  {{ round.averageAttendance || 0 }}%
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  type="button"
                  class="h-8 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  @click="$emit('open-round-details', round)"
                >
                  <FolderCheck class="w-3.5 h-3.5" />
                  <span>تفاصيل وسجل الدورة</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  ArrowRight,
  History,
  GraduationCap,
  Wallet,
  CheckCircle2,
  Search,
  X,
  UserCheck,
  MapPin,
  Calendar,
  FolderCheck,
  Info,
  CreditCard,
  CalendarPlus,
} from 'lucide-vue-next';
import ViewModeToggle from '@/shared/ui/Buttons/ViewModeToggle.vue';
import {
  formatDate,
  formatEgyptianCurrency,
} from '../../ArchivedCourses/helpers/archivedCoursesConstants';

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  pastRounds: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['back', 'open-round-details', 'open-create-round']);

const viewMode = ref('grid');
const searchQuery = ref('');

const filteredRounds = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return props.pastRounds;
  return props.pastRounds.filter((r) => {
    return (
      String(r.roundNumber).includes(q) ||
      (r.roundCode && r.roundCode.toLowerCase().includes(q)) ||
      (r.instructor?.name && r.instructor.name.toLowerCase().includes(q)) ||
      (r.hall?.name && r.hall.name.toLowerCase().includes(q))
    );
  });
});

const totalGraduates = computed(() => {
  return props.pastRounds.reduce((sum, r) => sum + (r.graduatedCount || 0), 0);
});

const totalRevenue = computed(() => {
  return props.pastRounds.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
});

const averageAttendanceRate = computed(() => {
  if (props.pastRounds.length === 0) return 0;
  const total = props.pastRounds.reduce((sum, r) => sum + (r.averageAttendance || 0), 0);
  return Math.round(total / props.pastRounds.length);
});
</script>
