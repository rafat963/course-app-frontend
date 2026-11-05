<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة
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
                دوراتي الحالية وجدولي
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ courses.length }} دورة جارية
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مواعيد محاضراتك، القاعات التدريبية، المحاضرون، والخط الزمني لتقدمك الأكاديمي
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
         3. لوحة المحاضرة القادمة (Next Lecture Hero Card) + زر تصريح الدخول الموحد
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
         4. الخط الزمني التفاعلي للدورات الجارية (Interactive Timeline Component)
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <!-- ترويسة قسم الخط الزمني مع مبدل الدورات -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <Milestone class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
              <span>دوراتي التدريبية الجارية — الخط الزمني ومسار التقدم</span>
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              متابعة المحطات المرحلية، نسبة إنجاز المنهج، وتوقيتات التقييمات والشهادات
            </p>
          </div>
        </div>

        <!-- مبدل اختيار الدورة النشطة بالخط الزمني -->
        <div v-if="courses.length > 1" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          <button
            v-for="app in courses"
            :key="app.id"
            type="button"
            class="h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap flex items-center gap-1.5"
            :class="
              selectedTimelineCourse?.id === app.id
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            "
            @click="selectedTimelineCourseId = app.id; activeMilestoneIndex = 1"
          >
            <span class="font-mono text-[11px] font-bold" :class="selectedTimelineCourse?.id === app.id ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'">
              {{ app.round.roundCode }}
            </span>
            <span>{{ app.round.courseDomain }}</span>
          </button>
        </div>
      </div>

      <!-- محتوى الخط الزمني للدورة المختارة -->
      <div v-if="selectedTimelineCourse" class="p-6 space-y-6">
        <!-- 1. شريط ملخص الدورة ونسبة التقدم الكلية -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {{ selectedTimelineCourse.round.courseDomain }}
              </span>
              <span class="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {{ selectedTimelineCourse.round.roundCode }} • الدفعة {{ selectedTimelineCourse.round.roundNumber }}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                مقيد بالدورة
              </span>
            </div>
            <h4 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ selectedTimelineCourse.round.courseName }}
            </h4>
            <div class="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono pt-0.5">
              <span>القاعة: <strong class="text-slate-700 dark:text-slate-200 font-sans">{{ selectedTimelineCourse.round.hall.name }}</strong></span>
              <span>•</span>
              <span>المحاضر: <strong class="text-slate-700 dark:text-slate-200 font-sans">{{ selectedTimelineCourse.round.instructor.name }}</strong></span>
              <span>•</span>
              <span>الموعد: {{ selectedTimelineCourse.round.startTime }} — {{ selectedTimelineCourse.round.endTime }}</span>
            </div>
          </div>

          <!-- شريط الحضور والإنجاز والزر السريع -->
          <div class="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
            <div class="space-y-1 w-full md:w-52">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[11px] text-slate-400">نسبة تقدم المنهج:</span>
                <span class="font-mono font-black text-primary-700 dark:text-primary-400">
                  {{ selectedTimelineCourse.attendedLectures }} / {{ selectedTimelineCourse.round.totalLectures }} محاضرة ({{ getCourseProgress(selectedTimelineCourse) }}%)
                </span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-l from-primary-600 to-emerald-500 transition-all duration-500"
                  :style="{ width: `${getCourseProgress(selectedTimelineCourse)}%` }"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                @click="openCourseModal(selectedTimelineCourse)"
              >
                <BookOpen class="w-3.5 h-3.5 text-slate-400" />
                <span>المقرر</span>
              </button>

              <RouterLink
                to="/trainee/passes"
                class="h-8 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                title="عرض تصريح الدخول الأمني الموحد لليوم"
              >
                <QrCode class="w-3.5 h-3.5" />
                <span>تصريح الدخول</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- 2. محطات الخط الزمني التفاعلية (Interactive Stepper Timeline Track) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-400 px-1">
            <span class="font-bold text-slate-600 dark:text-slate-300">مسار المحطات والمعالم (انقر على أي محطة للاطلاع على تفاصيلها):</span>
            <span class="font-mono text-[11px]">5 محطات رئيسية</span>
          </div>

          <!-- العرض الأفقي للشاشات المتوسطة والكبيرة -->
          <div class="hidden md:grid grid-cols-5 gap-2 relative pt-3 pb-2">
            <!-- خط الربط الممتد خلف المحطات -->
            <div class="absolute top-[28px] right-[10%] left-[10%] h-1 bg-slate-200 dark:bg-slate-700 z-0">
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: activeMilestoneWidth }"
              />
            </div>

            <!-- عناصر المحطات الخمس -->
            <button
              v-for="(milestone, idx) in currentTimelineMilestones"
              :key="milestone.id"
              type="button"
              class="relative z-10 flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl transition-all"
              :class="activeMilestoneIndex === idx ? 'bg-primary-50/70 dark:bg-primary-950/40 ring-2 ring-primary-500/40 shadow-xs' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'"
              @click="activeMilestoneIndex = idx"
            >
              <!-- دائرة المحطة والأيقونة -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-110 mb-2 relative"
                :class="milestoneBadgeClass(milestone.status, activeMilestoneIndex === idx)"
              >
                <component :is="milestone.icon" class="w-4 h-4" />
                <!-- نبضة المحطة النشطة الحالية -->
                <span
                  v-if="milestone.status === 'current'"
                  class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-ping"
                />
              </div>

              <!-- عنوان وتاريخ المحطة -->
              <span
                class="text-xs font-black leading-tight max-w-[120px]"
                :class="activeMilestoneIndex === idx ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200'"
              >
                {{ milestone.title }}
              </span>
              <span class="text-[10px] text-slate-400 font-mono mt-1">
                {{ milestone.dateLabel }}
              </span>
              <span
                class="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border"
                :class="milestoneStatusTag(milestone.status)"
              >
                {{ milestone.statusLabel }}
              </span>
            </button>
          </div>

          <!-- العرض الرأسي للموبايل -->
          <div class="md:hidden space-y-3 relative pr-6">
            <div class="absolute top-2 bottom-2 right-2.5 w-0.5 bg-slate-200 dark:bg-slate-700" />
            <div
              v-for="(milestone, idx) in currentTimelineMilestones"
              :key="milestone.id"
              class="relative flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer"
              :class="
                activeMilestoneIndex === idx
                  ? 'bg-primary-50/70 dark:bg-primary-950/40 border-primary-300 dark:border-primary-700 shadow-xs'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              "
              @click="activeMilestoneIndex = idx"
            >
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs -mr-[22px] relative z-10"
                :class="milestoneBadgeClass(milestone.status, activeMilestoneIndex === idx)"
              >
                <component :is="milestone.icon" class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1 flex-wrap">
                  <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ milestone.title }}</span>
                  <span class="font-mono text-[10px] text-slate-400">{{ milestone.dateLabel }}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ milestone.summary }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. بطاقة تفاصيل المحطة المحددة (Selected Milestone Detail Card) -->
        <div
          v-if="selectedMilestone"
          class="p-4 rounded-2xl bg-gradient-to-l from-slate-50 to-primary-50/40 dark:from-slate-800/60 dark:to-primary-950/20 border border-primary-200/80 dark:border-primary-800/60 space-y-3 animate-in fade-in duration-200"
        >
          <div class="flex items-start justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold">
                <component :is="selectedMilestone.icon" class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="text-xs font-black text-slate-800 dark:text-slate-100 font-heading">
                    تفاصيل المحطة: {{ selectedMilestone.title }}
                  </h5>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    :class="milestoneStatusTag(selectedMilestone.status)"
                  >
                    {{ selectedMilestone.statusLabel }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  تاريخ المحطة: <strong>{{ selectedMilestone.dateLabel }}</strong>
                </div>
              </div>
            </div>

            <!-- زر الإجراء السريع للمحطة -->
            <RouterLink
              to="/trainee/passes"
              class="h-8 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <QrCode class="w-3.5 h-3.5" />
              <span>عرض تصريح الدخول (QR)</span>
            </RouterLink>
          </div>

          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ selectedMilestone.fullDescription }}
          </p>

          <!-- شريط المتطلبات والتعليمات الخاصة بالمحطة -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-200/70 dark:border-slate-700/70">
            <div class="space-y-0.5">
              <span class="text-slate-400">القاعة المخصصة:</span>
              <div class="font-bold text-slate-700 dark:text-slate-200">{{ selectedTimelineCourse.round.hall.name }}</div>
            </div>
            <div class="space-y-0.5">
              <span class="text-slate-400">الإشراف الأكاديمي:</span>
              <div class="font-bold text-slate-700 dark:text-slate-200">{{ selectedTimelineCourse.round.instructor.name }}</div>
            </div>
            <div class="space-y-0.5">
              <span class="text-slate-400">شرط النجاح المعتمد:</span>
              <div class="font-bold font-mono text-emerald-600 dark:text-emerald-400">حضور ≥ 75% • درجة ≥ {{ selectedTimelineCourse.round.passingGrade }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="p-8 text-center space-y-2 text-slate-400 text-xs"
      >
        <BookOpen class="w-8 h-8 text-slate-300 mx-auto" />
        <p>لا توجد دورات تدريبية جارية لعرض خطها الزمني حالياً.</p>
      </div>
    </div>

    <!-- =========================================================
         5. الجدول الأسبوعي للمحاضرات (Weekly Timetable)
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <CalendarRange class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 font-heading">الجدول الأسبوعي للمحاضرات</h3>
            <p class="text-[10px] text-slate-400">توزيع مواعيد المحاضرات والقاعات على أيام الأسبوع</p>
          </div>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">{{ weeklyTotal }} محاضرة أسبوعياً</span>
      </div>

      <div class="p-4 overflow-x-auto custom-scrollbar">
        <div class="grid grid-cols-7 gap-2.5 min-w-[780px]">
          <div
            v-for="day in weeklySchedule"
            :key="day.code"
            class="rounded-2xl border p-2.5 min-h-[140px] flex flex-col gap-2 transition-all"
            :class="
              isToday(day.code)
                ? 'border-primary-400 dark:border-primary-600 bg-primary-50/60 dark:bg-primary-950/30 ring-2 ring-primary-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30'
            "
          >
            <div class="flex items-center justify-between px-1">
              <span
                class="text-xs font-black"
                :class="isToday(day.code) ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'"
              >
                {{ day.label }}
              </span>
              <span v-if="isToday(day.code)" class="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary-600 text-white shadow-2xs">
                اليوم
              </span>
            </div>

            <div v-if="!day.entries.length" class="flex-1 flex items-center justify-center">
              <span class="text-[10px] text-slate-300 dark:text-slate-600">لا توجد محاضرات</span>
            </div>

            <div
              v-for="entry in day.entries"
              :key="entry.id"
              class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1 shadow-2xs"
            >
              <div class="text-[10px] font-black text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">
                {{ entry.courseName }}
              </div>
              <div class="text-[9px] font-mono text-primary-600 dark:text-primary-400 font-bold">
                {{ entry.timeRange }}
              </div>
              <div class="text-[9px] text-slate-400 truncate" :title="entry.hallName">
                {{ entry.hallName }}
              </div>
            </div>
          </div>
        </div>
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
import { ref, computed } from 'vue';
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
  Milestone,
  CheckCircle2,
  Flag,
  Award,
  Layers,
  Sparkles,
} from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import TraineeCourseScheduleModal from './TraineeCourseScheduleModal.vue';
import { ONGOING_APPLICATIONS } from '../helpers/traineePortalMockData';
import {
  WEEK_DAYS,
  formatDateDmy,
  formatDateLong,
  getNextLecture,
  buildWeeklySchedule,
  getCourseProgress,
  getDayCode,
  getDayLabel,
} from '../helpers/traineePortalHelpers';

const courses = computed(() => ONGOING_APPLICATIONS);
const todayLong = computed(() => formatDateLong(new Date()));

const isModalOpen = ref(false);
const selectedCourse = ref(null);

function openCourseModal(app) {
  selectedCourse.value = app;
  isModalOpen.value = true;
}

function isToday(code) {
  return code === getDayCode(new Date());
}

// ============================================================
// منطق الخط الزمني التفاعلي للدورات الجارية
// ============================================================
const selectedTimelineCourseId = ref(courses.value[0]?.id || null);

const selectedTimelineCourse = computed(() => {
  if (!courses.value.length) return null;
  return courses.value.find((c) => c.id === selectedTimelineCourseId.value) || courses.value[0];
});

const activeMilestoneIndex = ref(1); // افتراضياً المحطة الحالية النشطة

/** المحطات الخمس الرئيسية للخط الزمني للدورة المختارة */
const currentTimelineMilestones = computed(() => {
  const app = selectedTimelineCourse.value;
  if (!app) return [];

  const round = app.round;
  const progressPercent = getCourseProgress(app);

  return [
    {
      id: 'm1_kickoff',
      title: 'انطلاق الدورة والتسجيل',
      dateLabel: formatDateDmy(round.startDate),
      status: 'completed',
      statusLabel: 'مكتمل بنجاح',
      icon: Flag,
      summary: 'تدشين البرنامج التدريبي واستلام الحقيبة العلمية',
      fullDescription: `تم انطلاق الدورة رسمياً بتاريخ ${formatDateDmy(round.startDate)} بالقاعة التدريبية (${round.hall.name}) بإشراف المحاضر المعتمد ${round.instructor.name}. تم تسليم خطة العمل والحقيبة العلمية المقررة.`,
    },
    {
      id: 'm2_lectures',
      title: 'المحاضرات والحضور الفعلي',
      dateLabel: 'اليوم (مستمر)',
      status: 'current',
      statusLabel: 'جاري الآن',
      icon: Clock,
      summary: `إنجاز ${app.attendedLectures} من ${round.totalLectures} محاضرة بنسبة ${progressPercent}%`,
      fullDescription: `أنت الآن في مرحلة المحاضرات العملية والتطبيقية. تم إنجاز ${app.attendedLectures} محاضرة حضورية فعلية من إجمالي ${round.totalLectures} محاضرة (${progressPercent}% من المنهج). نسبة الحضور الحالية مستوفية للحد الأدنى المسموح به للدخول للاختبار النهائي.`,
    },
    {
      id: 'm3_midterm',
      title: 'المشروع العملي والتقييم النصفي',
      dateLabel: 'منتصف المدة',
      status: 'upcoming',
      statusLabel: 'المحطة القادمة',
      icon: Layers,
      summary: 'تسليم النموذج التطبيقي والتقييم في المعمل',
      fullDescription: `تقييم عملي نصفي داخل معمل التدريب لقياس المهارات التطبيقية التي تم تدريسها في المنهج، وتجهيز المتدربين لبيئات العمل الواقعية ومشاريع التخرج العملية.`,
    },
    {
      id: 'm4_final_exam',
      title: 'الاختبار الشامل وانقضاء الدورة',
      dateLabel: formatDateDmy(round.endDate),
      status: 'scheduled',
      statusLabel: 'مجدول',
      icon: Award,
      summary: `الاختبار النهائي واشتراط نسبة نجاح ${round.passingGrade}%`,
      fullDescription: `انعقاد الاختبار النهائي الشامل (النظري والعملي) بتاريخ ${formatDateDmy(round.endDate)}. يشترط اجتياز الاختبار بنسبة لا تقل عن ${round.passingGrade}% للحصول على الاعتماد والتخرج.`,
    },
    {
      id: 'm5_certificate',
      title: 'اعتماد وإصدار الشهادة الرسمية',
      dateLabel: 'أسبوع بعد الختام',
      status: 'future',
      statusLabel: 'محطة التخرج',
      icon: Sparkles,
      summary: 'إصدار شهادة معتمدة موثقة برقم كودي وختم المعهد',
      fullDescription: `بعد اعتماد النتائج، تُصدر الشهادة الرسمية المعتمدة من قيادة معهد نظم المعلومات مع منح الكود الرقمي الموحد (CertificateCode) المتاح للمعاينة والتحميل الرقمي والطباعة.`,
    },
  ];
});

const selectedMilestone = computed(() => {
  return currentTimelineMilestones.value[activeMilestoneIndex.value] || currentTimelineMilestones.value[0];
});

const activeMilestoneWidth = computed(() => {
  const count = currentTimelineMilestones.value.length;
  if (count <= 1) return '0%';
  const pct = (activeMilestoneIndex.value / (count - 1)) * 100;
  return `${pct}%`;
});

function milestoneBadgeClass(status, isActive) {
  if (isActive) {
    return 'bg-primary-600 text-white ring-4 ring-primary-500/30 scale-110';
  }
  if (status === 'completed') {
    return 'bg-emerald-500 text-white';
  }
  if (status === 'current') {
    return 'bg-amber-500 text-white ring-2 ring-amber-400';
  }
  return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700';
}

function milestoneStatusTag(status) {
  if (status === 'completed') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
  }
  if (status === 'current') {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 animate-pulse';
  }
  if (status === 'upcoming') {
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
  }
  return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
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
        dateLabel: `${getDayLabel(lecture.date)} ${formatDateDmy(lecture.date)}`,
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
