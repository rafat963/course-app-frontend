<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة (Page Header)
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <CalendarDays class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                دوراتي التدريبية والجدول الدراسي
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ courses.length }} دورة جارية
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مواعيد محاضراتك، القاعات التدريبية، المحاضرون، والتقويم التفاعلي لمسار الدورة أسبوعاً بأسبوع
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
          <CalendarClock class="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <div class="font-bold text-slate-700 dark:text-slate-200">{{ todayLong }}</div>
            <div class="text-[11px] text-slate-400">توقيت معهد نظم المعلومات</div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         2. مؤشرات سريعة (KPIs)
         ========================================================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <AppKpiCard
        title="الدورات المقيد بها حالياً"
        :value="courses.length"
        badge="دورة نشطة"
        icon-bg="bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
        :icon="BookOpen"
      />
      <AppKpiCard
        title="المحاضرات هذا الأسبوع"
        :value="weeklyTotal"
        badge="محاضرة أسبوعياً"
        badge-class="text-blue-600 dark:text-blue-400 font-bold"
        icon-bg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
        :icon="CalendarRange"
      />
      <AppKpiCard
        title="إجمالي ساعات التدريب الأسبوعية"
        :value="`${weeklyHours} س`"
        badge="ساعات معتمدة"
        badge-class="text-indigo-600 dark:text-indigo-400 font-bold"
        icon-bg="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
        :icon="Clock"
      />
      <AppKpiCard
        title="متوسط نسبة الحضور"
        :value="`${averageAttendance}%`"
        :badge="averageAttendance >= 75 ? 'مستوفٍ لنسبة الحضور' : 'انتبه للغياب'"
        :badge-class="averageAttendance >= 75 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        :icon="TrendingUp"
      />
    </div>

    <!-- =========================================================
         3. الجدول والتقويم الدراسي التفاعلي (نتيجة الدورة ومسار الأسابيع)
         القسم الأساسي والرئيسي في مقدمة الصفحة
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <!-- ترويسة التقويم وأدوات التحكم في الأسابيع والتنقل -->
      <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-2xl bg-primary-100 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-xs">
            <CalendarRange class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
                الجدول والتقويم الدراسي التفاعلي
              </h2>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                نتيجة ومسار الدورة التدريبية
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تصفح خطة المحاضرات أسبوعاً بأسبوع حتى ختام مدة الدورة — انقر على تفاصيل أي محاضرة للاطلاع على محاورها وقاعتها
            </p>
          </div>
        </div>

        <!-- أزرار التنقل بين الأسابيع ومبدل النمط -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- مبدل الدورة إذا كان هناك أكثر من دورة -->
          <div v-if="courses.length > 1" class="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-white dark:bg-slate-900">
            <button
              v-for="c in courses"
              :key="c.id"
              type="button"
              class="h-7 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              :class="selectedCourseId === c.id ? 'bg-primary-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
              @click="selectedCourseId = c.id"
            >
              {{ c.round.roundCode }}
            </button>
          </div>

          <!-- شريط التنقل بالأسابيع -->
          <div class="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 bg-white dark:bg-slate-900 shadow-2xs">
            <!-- زر الأسبوع السابق -->
            <button
              type="button"
              class="h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              :class="canGoPrev ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer' : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'"
              :disabled="!canGoPrev"
              @click="prevWeek"
              title="الأسبوع السابق"
            >
              <ChevronRight class="w-4 h-4" />
              <span class="hidden sm:inline">السابق</span>
            </button>

            <!-- محدد الأسبوع الحالي -->
            <div class="px-3 py-1 text-center min-w-[150px]">
              <div class="text-xs font-black text-slate-800 dark:text-slate-100">
                الأسبوع {{ currentWeekIndex + 1 }} من {{ totalWeeksCount }}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ currentWeekRangeLabel }}
              </div>
            </div>

            <!-- زر الأسبوع القادم -->
            <button
              type="button"
              class="h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              :class="canGoNext ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer' : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'"
              :disabled="!canGoNext"
              @click="nextWeek"
              title="الأسبوع القادم"
            >
              <span class="hidden sm:inline">القادم</span>
              <ChevronLeft class="w-4 h-4" />
            </button>
          </div>

          <!-- زر العودة للأسبوع الحالي -->
          <button
            v-if="!isViewingCurrentWeek"
            type="button"
            class="h-9 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            @click="jumpToCurrentWeek"
          >
            <Clock class="w-3.5 h-3.5 text-amber-500" />
            <span>الأسبوع الحالي</span>
          </button>
        </div>
      </div>

      <!-- مؤشر ملخص الأسبوع المختار -->
      <div class="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-700 dark:text-slate-300">
            الدورة: <strong class="text-primary-700 dark:text-primary-400 font-heading">{{ activeCourse?.round.courseName }}</strong>
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="text-slate-500 dark:text-slate-400">
            النظام: يومان أسبوعياً ({{ formatLectureDays(activeCourse?.round.lectureDays) }})
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {{ activeWeekLecturesCount }} محاضرة هذا الأسبوع
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {{ activeWeekHours }} ساعات تدريبية
          </span>
        </div>
      </div>

      <!-- محتوى شبكة التقويم (النتيجة — 7 أيام أسبوعية) -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          <div
            v-for="day in currentWeekDays"
            :key="day.dateStr"
            class="rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative"
            :class="[
              day.isToday
                ? 'border-primary-500 dark:border-primary-600 bg-primary-50/40 dark:bg-primary-950/30 ring-2 ring-primary-500/20 shadow-md'
                : day.hasLecture
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs hover:border-primary-300 dark:hover:border-primary-700'
                  : 'border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 opacity-75'
            ]"
          >
            <!-- رأس بطاقة اليوم (اسم اليوم والتاريخ وحالة اليوم) -->
            <div
              class="px-3.5 py-3 border-b flex items-center justify-between gap-1"
              :class="
                day.isToday
                  ? 'bg-primary-600 text-white border-primary-500'
                  : day.hasLecture
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800'
                    : 'bg-transparent border-slate-100 dark:border-slate-800/40'
              "
            >
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-black" :class="day.isToday ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
                  {{ day.dayLabel }}
                </span>
                <span class="text-[10px] font-mono" :class="day.isToday ? 'text-primary-100' : 'text-slate-400'">
                  {{ day.dateShort }}
                </span>
              </div>

              <!-- شارات اليوم / المحاضرة -->
              <span
                v-if="day.isToday"
                class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-slate-950 animate-pulse"
              >
                اليوم
              </span>
              <span
                v-else-if="day.hasLecture"
                class="px-2 py-0.5 rounded-full text-[9px] font-bold"
                :class="
                  day.isPast
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                "
              >
                {{ day.isPast ? 'منتهية ✓' : 'محاضرة' }}
              </span>
            </div>

            <!-- جسم بطاقة اليوم: إن وُجدت محاضرة تُعرض التفاصيل الغنية الكاملة -->
            <div v-if="day.hasLecture" class="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
              <div class="space-y-2">
                <!-- عنوان ورقم المحاضرة -->
                <div class="space-y-0.5">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-[10px] font-black font-mono text-primary-600 dark:text-primary-400">
                      محاضرة {{ day.lectureData.lectureIndex }} من {{ activeCourse.round.totalLectures }}
                    </span>
                    <span
                      class="text-[9px] font-bold px-1.5 py-0.2 rounded-md"
                      :class="day.isPast ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'"
                    >
                      {{ day.isPast ? 'حضور مسجل' : (day.isToday ? 'نشطة الآن' : 'مجدولة') }}
                    </span>
                  </div>
                  <h4 class="text-xs font-black text-slate-800 dark:text-slate-100 font-heading leading-snug line-clamp-2" :title="day.lectureData.title">
                    {{ day.lectureData.title }}
                  </h4>
                </div>

                <!-- توقيت المحاضرة -->
                <div class="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                  <Clock class="w-3.5 h-3.5 text-primary-500 shrink-0" />
                  <span class="font-bold">{{ day.lectureData.timeRange }}</span>
                </div>

                <!-- القاعة التدريبية والموقع -->
                <div class="flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <MapPin class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span class="leading-tight" :title="day.lectureData.hall.location">
                    {{ day.lectureData.hall.name }}
                  </span>
                </div>

                <!-- المحاضر المسؤول -->
                <div class="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <User class="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span class="truncate" :title="day.lectureData.instructor.specialty">
                    {{ day.lectureData.instructor.name }}
                  </span>
                </div>
              </div>

              <!-- زر التوسيع / عرض التفاصيل الموسعة للأكورديون -->
              <button
                type="button"
                class="w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-between gap-1 transition-colors cursor-pointer"
                @click="toggleDayExpanded(day.dateStr)"
              >
                <span>{{ isDayExpanded(day.dateStr) ? 'إخفاء التفاصيل' : 'تفاصيل المنهج والتجهيز' }}</span>
                <ChevronDown
                  class="w-3 h-3 transition-transform duration-200"
                  :class="isDayExpanded(day.dateStr) ? 'rotate-180' : ''"
                />
              </button>

              <!-- المحتوى الموسع للمحاضرة (Accordion Drawer) -->
              <div
                v-if="isDayExpanded(day.dateStr)"
                class="pt-2.5 pb-1 space-y-2 text-[10px] border-t border-dashed border-primary-200 dark:border-primary-800 text-slate-600 dark:text-slate-300 animate-in fade-in duration-200"
              >
                <div class="p-2 rounded-xl bg-primary-50/60 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 space-y-1">
                  <span class="font-bold text-primary-900 dark:text-primary-200 block">أهداف الجلسة والتجهيزات:</span>
                  <p class="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {{ day.lectureData.objectives }}
                  </p>
                </div>

                <div class="flex items-center gap-1.5 pt-1">
                  <RouterLink
                    to="/trainee/passes"
                    class="flex-1 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center gap-1 transition-all"
                  >
                    <QrCode class="w-3 h-3" />
                    <span>تصريح الدخول</span>
                  </RouterLink>
                  <button
                    type="button"
                    class="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[9px] font-bold cursor-pointer"
                    @click="openCourseModal(activeCourse)"
                  >
                    المقرر
                  </button>
                </div>
              </div>
            </div>

            <!-- جسم بطاقة اليوم عندما لا توجد محاضرات -->
            <div v-else class="p-4 flex-1 flex flex-col items-center justify-center text-center space-y-1">
              <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">عطلة / لا توجد محاضرات</span>
              <span class="text-[9px] text-slate-300 dark:text-slate-600">مذاكرة ومراجعة ذاتية</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         4. لوحة المحاضرة القادمة (Next Lecture Hero Card) + زر تصريح الدخول الموحد
         ========================================================= -->
    <div
      v-if="nextOverall"
      class="rounded-3xl overflow-hidden border border-primary-800/40 bg-gradient-to-l from-primary-950 via-primary-900 to-slate-900 text-white shadow-xl relative"
    >
      <div class="px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <AlarmClock class="w-7 h-7 text-amber-300 animate-bounce" />
          </div>

          <div class="min-w-0 space-y-1.5">
            <div class="flex items-center gap-2 text-xs font-black text-primary-200">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>المحاضرة القادمة حسب الجدول الدراسي</span>
              <span class="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-primary-200 font-bold">
                {{ nextOverall.app.round.roundCode }}
              </span>
            </div>

            <h2 class="text-base sm:text-lg font-black font-heading leading-snug">
              {{ nextOverall.app.round.courseName }}
            </h2>

            <!-- تفاصيل المحاضر والقاعة والمواعيد -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-primary-100 pt-0.5">
              <span class="inline-flex items-center gap-1.5">
                <CalendarDays class="w-3.5 h-3.5 text-amber-300" />
                <strong>{{ nextOverall.dateLabel }}</strong>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-amber-300" />
                <span class="font-mono font-bold">{{ nextOverall.lecture.timeLabel }}</span>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <MapPin class="w-3.5 h-3.5 text-emerald-300" />
                <span>{{ nextOverall.app.round.hall.name }} ({{ nextOverall.app.round.hall.location }})</span>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <User class="w-3.5 h-3.5 text-primary-300" />
                <span>{{ nextOverall.app.round.instructor.name }} — {{ nextOverall.app.round.instructor.specialty }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- زر تصريح الدخول الموحد السريع + العد التنازلي -->
        <div class="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <div class="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-center shadow-inner">
            <div class="text-[10px] text-primary-200 font-bold">العد التنازلي للمحاضرة</div>
            <div class="text-base font-black font-heading text-amber-300 mt-0.5">{{ nextOverall.lecture.label }}</div>
          </div>

          <!-- زر تصريح الدخول ينقل مباشرة إلى صفحة التصريح اليومي الموحد -->
          <RouterLink
            to="/trainee/passes"
            class="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
            title="عرض تصريح الدخول الأمني الموحد لليوم"
          >
            <QrCode class="w-3.5 h-3.5" />
            <span>عرض تصريح الدخول (QR)</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 flex items-center gap-3 text-slate-500 dark:text-slate-400"
    >
      <CalendarX class="w-6 h-6 text-slate-400 shrink-0" />
      <div class="text-xs">
        لا توجد محاضرات مجدولة حالياً — سيظهر موعد المحاضرة القادمة هنا تلقائياً بمجرد انعقاد دوراتك المقيد بها.
      </div>
    </div>

    <!-- =========================================================
         5. كروت الدورات التدريبية المقيد بها (Card-Based Layout — 2 Days / Week)
         ========================================================= -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <BookOpen class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
              الدورات المقيد بها حالياً
            </h3>
            <p class="text-[11px] text-slate-400">
              بطاقات الدورات المسجلة — المحاضرات يومان أسبوعياً وفق خطة الانعقاد المعتمدة
            </p>
          </div>
        </div>
        <span class="text-xs font-mono font-bold text-slate-400">{{ courses.length }} دورة جارية</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article
          v-for="app in courses"
          :key="app.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <!-- رأس الكارت -->
          <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              مقيد بالدورة ومسدد ✓
            </span>

            <span class="font-mono text-[11px] font-bold text-slate-400">
              {{ app.round.roundCode }} • الدفعة {{ app.round.roundNumber }}
            </span>
          </div>

          <!-- محتوى الكارت -->
          <div class="p-5 space-y-4 flex-1">
            <div>
              <span class="text-[10px] font-black text-primary-600 dark:text-primary-400">
                {{ app.round.courseDomain }}
              </span>
              <h4 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-snug mt-0.5">
                {{ app.round.courseName }}
              </h4>
            </div>

            <!-- بادج الجدول الأسبوعي البارز (المحاضرات يومان أسبوعياً) -->
            <div class="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 font-bold">
                  <CalendarCheck class="w-4 h-4" />
                </div>
                <div class="text-xs">
                  <span class="font-black text-blue-900 dark:text-blue-200 block">
                    يومان أسبوعياً: {{ formatLectureDays(app.round.lectureDays) }}
                  </span>
                  <span class="text-[10px] text-blue-700/80 dark:text-blue-300/80 font-mono">
                    التوقيت: {{ app.round.startTime }} — {{ app.round.endTime }}
                  </span>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-xs">
                2 أيام / أسبوعياً
              </span>
            </div>

            <!-- شبكة تفاصيل القاعة والمحاضر -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-0.5">
                <span class="text-[10px] text-slate-400 block">مقر الانعقاد:</span>
                <strong class="text-slate-800 dark:text-slate-100 text-[11px] truncate block" :title="app.round.hall.name">
                  {{ app.round.hall.name }}
                </strong>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-0.5">
                <span class="text-[10px] text-slate-400 block">المحاضر المسؤول:</span>
                <strong class="text-slate-800 dark:text-slate-100 text-[11px] truncate block" :title="app.round.instructor.name">
                  {{ app.round.instructor.name }}
                </strong>
              </div>
            </div>

            <!-- شريط تقدم حضور المنهج -->
            <div class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[11px] text-slate-400">نسبة حضور المحاضرات:</span>
                <span class="font-mono font-black text-primary-600 dark:text-primary-400">
                  {{ app.attendedLectures }} / {{ app.round.totalLectures }} محاضرة ({{ getCourseProgress(app) }}%)
                </span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-l from-primary-600 to-emerald-500 transition-all duration-500"
                  :style="{ width: `${getCourseProgress(app)}%` }"
                />
              </div>
            </div>
          </div>

          <!-- تذييل الكارت والأزرار -->
          <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-2">
            <button
              type="button"
              class="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              @click="openCourseModal(app)"
            >
              <BookOpen class="w-3.5 h-3.5 text-slate-400" />
              <span>تفاصيل الخطة</span>
            </button>

            <RouterLink
              to="/trainee/passes"
              class="h-8 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
            >
              <QrCode class="w-3.5 h-3.5" />
              <span>تصريح QR</span>
            </RouterLink>
          </div>
        </article>
      </div>
    </div>

    <!-- مودال تفاصيل الدورة والمحتوى -->
    <TraineeCourseScheduleModal
      :is-open="isModalOpen"
      :course="selectedCourse"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
  CalendarDays,
  CalendarClock,
  CalendarRange,
  CalendarX,
  AlarmClock,
  Clock,
  MapPin,
  User,
  TrendingUp,
  BookOpen,
  QrCode,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import TraineeCourseScheduleModal from './TraineeCourseScheduleModal.vue';
import { ONGOING_APPLICATIONS } from '../../helpers/traineePortalMockData';
import { formatLectureDays } from '../../helpers/availableCoursesHelpers';
import {
  WEEK_DAYS,
  formatDateDmy,
  formatDateLong,
  getNextLecture,
  buildWeeklySchedule,
  getCourseProgress,
  formatTimeRange,
} from '../../helpers/traineePortalHelpers';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTraineeApplicationsStore } from '../../stores/traineeApplicationsStore';

const authStore = useAuthStore();
const traineeStore = useTraineeApplicationsStore();

onMounted(() => {
  if (authStore.user?.id) {
    traineeStore.load(authStore.user.id);
  }
});

/** الدورات المقيد بها المتدرب حالياً مع دمج أي دورات انتقلت إلى القيد عبر المتجر */
const courses = computed(() => {
  const base = [...ONGOING_APPLICATIONS];
  if (traineeStore.applications?.length) {
    traineeStore.applications
      .filter((app) => app.status === 'Enrolled')
      .forEach((storeApp) => {
        if (!base.some((b) => b.applicationCode === storeApp.applicationCode)) {
          base.push(storeApp);
        }
      });
  }
  return base;
});

const todayLong = computed(() => formatDateLong(new Date()));

const isModalOpen = ref(false);
const selectedCourse = ref(null);

function openCourseModal(app) {
  selectedCourse.value = app;
  isModalOpen.value = true;
}

// ============================================================
// منطق التقويم الدراسي التفاعلي ومسار الأسابيع (فكرة النتيجة)
// ============================================================
const selectedCourseId = ref(courses.value[0]?.id || null);

const activeCourse = computed(() => {
  if (!courses.value.length) return null;
  return courses.value.find((c) => c.id === selectedCourseId.value) || courses.value[0];
});

/** خريطة عناوين ومحاور المحاضرات الواقعية المطابقة لمعايير ERD */
const COURSE_TOPICS_MAP = {
  'CRS-CYBER-01': [
    { title: 'مقدمة في أمن المعلومات ومنهجيات اختبار الاختراق الأخلاقي', objectives: 'التعرف على أطر عمل NIST و MITRE ATT&CK، وفهم دور ومسؤوليات مختبر الاختراق الأخلاقي المعتمد.' },
    { title: 'بروتوكولات الشبكات والتعرف على المنافذ والخدمات (Footprinting)', objectives: 'استخدام أدوات الاستطلاع وجمع المعلومات السلبية والإيجابية عن الأهداف المستهدفة عبر DNS و WHOIS.' },
    { title: 'مسح وتقييم الثغرات الأمنية باستخدام Nmap & Nessus', objectives: 'مسح المنافذ النشطة واكتشاف إصدارات الخدمات وأنظمة التشغيل وفحص الثغرات المعروفة CVE.' },
    { title: 'تعداد الأنظمة واستخلاص معلومات النطاقات (Enumeration)', objectives: 'تعداد خدمات SMB و SNMP و LDAP لاستخراج أسماء المستخدمين والمجموعات والمشاركات الشبكية.' },
    { title: 'تحليل الثغرات والتصنيف وفق معايير CVSS العالمية', objectives: 'تحليل نتائج الفحص الأمني وتصنيف خطورة الثغرات وإعداد مصفوفة المخاطر الأمنية للمؤسسة.' },
    { title: 'أساليب اختراق الأنظمة وتصعيد الصلاحيات (Privilege Escalation)', objectives: 'استغلال الثغرات للوصول غير المصرح به وتطبيق تقنيات رفع الصلاحيات على بيئات Windows و Linux.' },
    { title: 'تحليل البرمجيات الخبيثة والتروجانات وحماية الأنظمة', objectives: 'فهم آليات عمل برمجيات الفدية وأحصنة طروادة وحقن الذاكرة، وطرق الكشف والتحليل العكسي.' },
    { title: 'هجمات حجب الخدمة واعتراض الحزم (Sniffing & DoS Attacks)', objectives: 'محاكاة هجمات SYN Flood و ARP Poisoning واستخدام Wireshark لتحليل حركة المرور الشبكي غير المشفر.' },
    { title: 'الهندسة الاجتماعية واستغلال السلوك البشري', objectives: 'محاكاة حملات التصيد الإلكتروني Phishing وتطبيق إجراءات التوعية الأمنية المعتمدة للمؤسسات.' },
    { title: 'اختراق خوادم الويب وتطبيقات السحاب (Web Server Hacking)', objectives: 'فحص إعدادات خوادم Apache و Nginx وثغرات التهيئة الخاطئة في البيئات السحابية AWS و Azure.' },
    { title: 'ثغرات الويب الشائعة (SQL Injection, XSS, CSRF)', objectives: 'اكتشاف واستغلال ثغرات حقن قواعد البيانات وهجمات السكربتات المتقاطعة وتأمين المدخلات البرمجية.' },
    { title: 'أمن واختبار اختراق الشبكات اللاسلكية (Wireless Security)', objectives: 'تحليل بروتوكولات تشفير WPA2/WPA3 واختبار أمان نقاط الوصول اللاسلكية واكتشاف الأجهزة الدخيلة.' },
    { title: 'اختراق الأجهزة الذكية وبيئات IoT والأنظمة المدمجة', objectives: 'تحليل مخاطر أجهزة إنترنت الأشياء والشبكات الذكية واختبار حماية واجهات التحكم والتطبيقات المصاحبة.' },
    { title: 'التشفير التطبيقي وحماية المفاتيح الرقمية (Cryptography)', objectives: 'تطبيق خوارزميات التشفير المتماثل وغير المتماثل وإدارة الشهادات الرقمية PKI والتوقيع الإلكتروني.' },
    { title: 'المحاكاة الشاملة للاختراق العملي والتقرير الفني (Capstone Lab)', objectives: 'تنفيذ سيناريو اختراق كامل داخل معمل المعهد وإعداد التقرير الفني والتوصيات التنفيذية.' },
    { title: 'الاختبار النهائي الشامل وتقييم الكفاءة والاعتماد', objectives: 'انعقاد الاختبار العملي والنظري الشامل واعتماد درجات التخرج لإصدار الشهادة الرسمية.' },
  ],
  'CRS-WEB-05': [
    { title: 'أساسيات وتصميم واجهات الويب الحديثة بـ Vue 3 Composition API', objectives: 'بناء مكونات تفاعلية، إدارة الحالة التفاعلية، والربط مع Tailwind CSS.' },
    { title: 'التوجيه المتقدم وحماية المسارات بـ Vue Router', objectives: 'إعداد Navigation Guards، حماية مسارات المتدربين، وتمرير المعاملات الديناميكية.' },
    { title: 'إدارة الحالة المركزية باستخدام Pinia Stores', objectives: 'تهيئة المخازن العامة، حفظ البيانات محلياً، ومشاركة الحالة بين المكونات.' },
    { title: 'بناء خوادم API وخدمات الويب بـ Node.js & Express', objectives: 'تصميم RESTful APIs، معالجة الطلبات غير المتزامنة، وإعداد Middleware.' },
    { title: 'قواعد البيانات العلائقية وتصميم الجداول والمخططات', objectives: 'ربط قاعدة البيانات، تنفيذ استعلامات متقدمة، وضمان تكامل البيانات.' },
    { title: 'المصادقة وتأمين جلسات المستخدمين بـ JWT Tokens', objectives: 'تشفير كلمات المرور، إصدار الرموز الأمنية، وفحص الصلاحيات بحسب الأدوار.' },
    { title: 'التكامل الشامل واختبار التطبيق قبل النشر', objectives: 'إجراء اختبارات الوحدات، تحسين زمن الاستجابة، ونشر التطبيق على البيئات السحابية.' },
    { title: 'المشروع التطبيقي الشامل والتقييم النهائي', objectives: 'مناقشة مشروع التخرج المتكامل وتقديم العرض التوضيحي للجنة التقييم الأكاديمي.' },
  ],
};

const JS_DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** توليد كافة أسابيع الدورة من تاريخ البداية إلى النهاية */
function generateWeeksForRound(round) {
  if (!round?.startDate || !round?.endDate) return [];
  const start = new Date(`${round.startDate}T00:00:00`);
  const end = new Date(`${round.endDate}T23:59:59`);

  const dayOfWeek = start.getDay();
  const diffToSat = (dayOfWeek + 1) % 7;
  const firstSat = new Date(start);
  firstSat.setDate(start.getDate() - diffToSat);
  firstSat.setHours(0, 0, 0, 0);

  const topics = COURSE_TOPICS_MAP[round.courseCode] || [];
  let lectureCounter = 0;

  const weeks = [];
  const currentSat = new Date(firstSat);
  let weekIndex = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  while (currentSat <= end && weekIndex < 24) {
    const endOfWeek = new Date(currentSat);
    endOfWeek.setDate(currentSat.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentSat);
      d.setDate(currentSat.getDate() + i);
      d.setHours(0, 0, 0, 0);

      const dayCode = JS_DAY_CODES[d.getDay()];
      const dayLabel = WEEK_DAYS.find((wd) => wd.code === dayCode)?.label || '';
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const isWithinCourse = d >= start && d <= end;
      const isLectureDay = isWithinCourse && round.lectureDays?.includes(dayCode);

      let lectureData = null;
      if (isLectureDay) {
        lectureCounter += 1;
        const topic = topics[lectureCounter - 1] || {
          title: `محاضرة ${lectureCounter}: محاور ومفاهيم ${round.courseName}`,
          objectives: `دراسة المحاور التدريبية للوحدة ${lectureCounter}، التطبيق العملي، ومراجعة التكليفات المعتمدة.`,
        };

        const isPast = d < today;
        const isCurrentDay = dateStr === todayStr;

        lectureData = {
          lectureIndex: lectureCounter,
          title: topic.title,
          objectives: topic.objectives,
          timeRange: formatTimeRange(round.startTime, round.endTime),
          duration: `${Math.max(1, (Number(round.endTime?.split(':')[0]) || 0) - (Number(round.startTime?.split(':')[0]) || 0))} ساعات`,
          hall: round.hall || { name: 'المعمل التدريبي', location: 'المبنى الرئيسي' },
          instructor: round.instructor || { name: 'هيئة التدريس بالمعهد', specialty: 'تخصص معتمد' },
          status: isPast ? 'completed' : isCurrentDay ? 'active_today' : 'upcoming',
        };
      }

      const dateShort = d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });

      days.push({
        date: d,
        dateStr,
        dayCode,
        dayLabel,
        dateShort,
        isToday: dateStr === todayStr,
        isPast: d < today,
        hasLecture: isLectureDay,
        lectureData,
      });
    }

    const startMonth = currentSat.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });

    weeks.push({
      weekIndex,
      weekNumber: weekIndex + 1,
      startOfWeek: new Date(currentSat),
      endOfWeek,
      rangeLabel: `${startMonth} — ${endMonth}`,
      days,
      containsToday: days.some((day) => day.isToday),
    });

    currentSat.setDate(currentSat.getDate() + 7);
    weekIndex += 1;
  }

  return weeks;
}

const allWeeks = computed(() => {
  if (!activeCourse.value?.round) return [];
  return generateWeeksForRound(activeCourse.value.round);
});

const totalWeeksCount = computed(() => allWeeks.value.length);

/** مؤشر الأسبوع المعروض حالياً — افتراضياً الأسبوع الذي يحتوي على تاريخ اليوم */
const currentWeekIndex = ref(0);

// تحديد الأسبوع الحالي تلقائياً
onMounted(() => {
  const foundIndex = allWeeks.value.findIndex((w) => w.containsToday);
  if (foundIndex !== -1) {
    currentWeekIndex.value = foundIndex;
  } else {
    currentWeekIndex.value = 0;
  }
});

const currentWeek = computed(() => {
  if (!allWeeks.value.length) return null;
  const idx = Math.min(Math.max(0, currentWeekIndex.value), allWeeks.value.length - 1);
  return allWeeks.value[idx];
});

const currentWeekDays = computed(() => currentWeek.value?.days || []);

const currentWeekRangeLabel = computed(() => currentWeek.value?.rangeLabel || '');

const isViewingCurrentWeek = computed(() => currentWeek.value?.containsToday || false);

const canGoPrev = computed(() => currentWeekIndex.value > 0);
const canGoNext = computed(() => currentWeekIndex.value < totalWeeksCount.value - 1);

function prevWeek() {
  if (canGoPrev.value) {
    currentWeekIndex.value -= 1;
  }
}

function nextWeek() {
  if (canGoNext.value) {
    currentWeekIndex.value += 1;
  }
}

function jumpToCurrentWeek() {
  const foundIndex = allWeeks.value.findIndex((w) => w.containsToday);
  if (foundIndex !== -1) {
    currentWeekIndex.value = foundIndex;
  }
}

const activeWeekLecturesCount = computed(() =>
  currentWeekDays.value.filter((d) => d.hasLecture).length
);

const activeWeekHours = computed(() => {
  const round = activeCourse.value?.round;
  if (!round) return 0;
  const [startH] = (round.startTime || '00:00').split(':').map(Number);
  const [endH] = (round.endTime || '00:00').split(':').map(Number);
  const diff = Math.max(0, endH - startH);
  return diff * activeWeekLecturesCount.value;
});

// حالة توسيع الأيام لعرض تفاصيل المحاضرة (Accordion)
const expandedDays = ref({});

function toggleDayExpanded(dateStr) {
  expandedDays.value[dateStr] = !expandedDays.value[dateStr];
}

function isDayExpanded(dateStr) {
  return !!expandedDays.value[dateStr];
}

// ============================================================
// حسابات الجدول والمحاضرة القادمة
// ============================================================
const nextOverall = computed(() => {
  const items = courses.value
    .map((app) => {
      const lecture = getNextLecture(app.round);
      if (!lecture) return null;
      return {
        app,
        lecture,
        dateLabel: `${formatDateLong(lecture.date)}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.lecture.date - b.lecture.date);

  return items[0] || null;
});

const weeklySchedule = computed(() => buildWeeklySchedule(courses.value));

const weeklyTotal = computed(() =>
  weeklySchedule.value.reduce((sum, day) => sum + day.entries.length, 0)
);

const weeklyHours = computed(() => {
  let totalHours = 0;
  courses.value.forEach((app) => {
    const daysCount = app.round?.lectureDays?.length || 0;
    const [startH] = (app.round?.startTime || '00:00').split(':').map(Number);
    const [endH] = (app.round?.endTime || '00:00').split(':').map(Number);
    const diff = Math.max(0, endH - startH);
    totalHours += diff * daysCount;
  });
  return totalHours;
});

const averageAttendance = computed(() => {
  if (!courses.value.length) return 0;
  const sum = courses.value.reduce((acc, app) => acc + getCourseProgress(app), 0);
  return Math.round(sum / courses.value.length);
});
</script>
