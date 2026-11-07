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
              مواعيد محاضراتك، القاعات التدريبية، المحاضرون، والجدول التفاعلي لمسار الدورة أسبوعاً بأسبوع
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
         2. الواجهة المدمجة: الجدول الدراسي التفاعلي
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden space-y-0">
      
      <!-- أ. بطاقة التنبيه للمحاضرة القادمة -->
      <div
        v-if="nextOverall"
        class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-l from-primary-950 via-primary-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <AlarmClock class="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div class="text-xs space-y-0.5 min-w-0">
            <div class="flex items-center gap-2 text-primary-200 font-bold flex-wrap">
              <span>المحاضرة القادمة:</span>
              <span class="text-amber-300 font-black">{{ nextOverall.lecture.label }}</span>
              <span>•</span>
              <span class="font-mono text-[11px]">{{ nextOverall.dateLabel }}</span>
              <span>•</span>
              <span class="font-mono text-[11px]">{{ nextOverall.lecture.timeLabel }}</span>
            </div>
            <div class="text-[11px] text-slate-200 truncate">
              {{ nextOverall.app.round.courseName }} — {{ nextOverall.app.round.hall.name }}
            </div>
          </div>
        </div>

        <button
          type="button"
          class="h-8 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer active:scale-95 self-start sm:self-auto"
          title="عرض كود الـ QR الخاص بالتصريح مباشرة"
          @click="openPassQrModal(nextOverall.app)"
        >
          <QrCode class="w-3.5 h-3.5" />
          <span>تصريح الدخول (QR)</span>
        </button>
      </div>

      <!-- ب. ترويسة الجدول والتحكم في الأسابيع -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            <CalendarRange class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                الجدول الدراسي الأسبوعي (العرض الأفقي)
              </h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                عرض أفقي
              </span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              استعراض أفقي لأيام الأسبوع — انقر على أي يوم لفتح خطته ومحتوى الجلسة التدريبية
            </p>
          </div>
        </div>

        <!-- أزرار التنقل بين الأسابيع ومؤشرات الأسبوع -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- شريط التبديل إذا وُجدت أكثر من دورة -->
          <div v-if="courses.length > 1" class="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400">الدورة:</span>
            <button
              v-for="c in courses"
              :key="c.id"
              type="button"
              class="h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              :class="selectedCourseId === c.id ? 'bg-primary-600 text-white shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'"
              @click="selectedCourseId = c.id"
            >
              <span>{{ c.round.roundCode }}</span>
            </button>
          </div>

          <div class="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 bg-white dark:bg-slate-900 shadow-2xs">
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

            <div class="px-3 py-1 text-center min-w-[130px]">
              <div class="text-xs font-black text-slate-800 dark:text-slate-100">
                الأسبوع {{ currentWeekIndex + 1 }} من {{ totalWeeksCount }}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ currentWeekRangeLabel }}
              </div>
            </div>

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

      <!-- د. جدول الأيام بالعرض الأفقي واللوحة التفصيلية (Horizontal Schedule Layout) -->
      <div class="p-6 space-y-6">
        <!-- شريط التلميح ودليل الألوان -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pb-1">
          <div class="flex items-center gap-2 font-medium">
            <CalendarDays class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>أيام الأسبوع (من السبت إلى الجمعة أفقياً):</span>
          </div>

          <div class="flex items-center gap-3 text-[11px] flex-wrap">
            <span class="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <span class="w-2.5 h-2.5 rounded-full bg-primary-600"></span>
              محاضرة مجدولة
            </span>
            <span class="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              اليوم الحالي
            </span>
            <span class="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              حضور مسجل ✓
            </span>
            <span class="flex items-center gap-1.5 text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              عطلة / استذكار
            </span>
          </div>
        </div>

        <!-- مصفوفة الأيام الـ 7 بالعرض الأفقي (Horizontal 7 Columns Grid) -->
        <div class="overflow-x-auto custom-scrollbar pb-3 -mx-2 px-2 sm:mx-0 sm:px-0">
          <div class="grid grid-cols-7 min-w-[920px] gap-3">
            <div
              v-for="day in currentWeekDays"
              :key="day.dateStr"
              class="relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer text-right select-none min-h-[205px] group"
              :class="[
                selectedDateStr === day.dateStr
                  ? 'border-primary-500 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-950/40 ring-2 ring-primary-500/30 shadow-md -translate-y-0.5'
                  : day.isToday
                    ? 'border-amber-400 dark:border-amber-500/70 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-500 shadow-2xs'
                    : day.hasLecture
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xs'
                      : 'border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/20 hover:bg-slate-100/70 opacity-75 hover:opacity-100'
              ]"
              @click="selectDay(day.dateStr)"
            >
              <!-- مؤشر التحديد العلوي -->
              <div
                v-if="selectedDateStr === day.dateStr"
                class="absolute top-0 right-0 left-0 h-1 bg-primary-600 rounded-t-2xl"
              />
              <div
                v-else-if="day.isToday"
                class="absolute top-0 right-0 left-0 h-1 bg-amber-400 rounded-t-2xl"
              />

              <!-- محتوى الكارت اليومي الأفقي -->
              <div class="space-y-2.5">
                <!-- رأس اليوم والتاريخ والشارة -->
                <div class="flex items-start justify-between gap-1">
                  <div>
                    <div
                      class="text-sm font-black font-heading transition-colors"
                      :class="selectedDateStr === day.dateStr ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-100'"
                    >
                      {{ day.dayLabel }}
                    </div>
                    <div class="text-[11px] font-mono text-slate-400 font-bold mt-0.5">
                      {{ day.dateShort }}
                    </div>
                  </div>

                  <div>
                    <span
                      v-if="day.isToday"
                      class="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs"
                    >
                      اليوم
                    </span>
                    <span
                      v-else-if="day.hasLecture"
                      class="px-2 py-0.5 rounded-md text-[10px] font-black"
                      :class="day.isPast ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' : 'bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300'"
                    >
                      م.{{ day.lectureData.lectureIndex }}
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800"
                    >
                      عطلة
                    </span>
                  </div>
                </div>

                <!-- تفاصيل المحاضرة في حال وجودها -->
                <div v-if="day.hasLecture" class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <!-- التوقيت -->
                  <div class="flex items-center gap-1.5 text-[11px] font-mono font-bold text-primary-700 dark:text-primary-300">
                    <Clock class="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span class="truncate">{{ day.lectureData.timeRange }}</span>
                  </div>

                  <!-- عنوان المحاضرة -->
                  <div class="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug" :title="day.lectureData.title">
                    {{ day.lectureData.title }}
                  </div>

                  <!-- القاعة والمحاضر -->
                  <div class="space-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <div class="flex items-center gap-1 truncate" :title="day.lectureData.hall.name">
                      <MapPin class="w-3 h-3 text-emerald-500 shrink-0" />
                      <span class="truncate">{{ day.lectureData.hall.name }}</span>
                    </div>
                    <div class="flex items-center gap-1 truncate" :title="day.lectureData.instructor.name">
                      <User class="w-3 h-3 text-blue-500 shrink-0" />
                      <span class="truncate">{{ day.lectureData.instructor.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- في حال عطلة / عدم وجود محاضرة -->
                <div v-else class="py-5 text-center space-y-1.5 border-t border-slate-100 dark:border-slate-800/60">
                  <Coffee class="w-5 h-5 mx-auto text-slate-300 dark:text-slate-600" />
                  <div class="text-[11px] font-medium text-slate-400 leading-tight">
                    استذكار ذاتي وتطبيق بالمعامل
                  </div>
                </div>
              </div>

              <!-- أسفل الكارت: حالة الاختيار والتوسيع -->
              <div class="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span
                  class="font-black transition-colors"
                  :class="selectedDateStr === day.dateStr ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-primary-600'"
                >
                  {{ selectedDateStr === day.dateStr ? 'محدد أدناه ✓' : 'عرض التفاصيل' }}
                </span>
                <ChevronDown
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="selectedDateStr === day.dateStr ? 'text-primary-600 rotate-180' : 'text-slate-400 group-hover:text-primary-600'"
                />
              </div>

              <!-- مؤشر سهم المثلث المرئي عند التحديد يربط الكارت الأفقي باللوحة أدناه -->
              <div
                v-if="selectedDateStr === day.dateStr"
                class="hidden lg:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-primary-500 z-10"
              />
            </div>
          </div>
        </div>

        <!-- هـ. لوحة تفاصيل اليوم المختار والخطة الدراسية (Selected Day Detailed Panel) -->
        <div
          v-if="selectedDay"
          class="rounded-3xl border border-primary-200/90 dark:border-primary-800/80 bg-gradient-to-br from-white via-slate-50/60 to-primary-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950/20 shadow-sm p-6 space-y-5 animate-in fade-in duration-200"
        >
          <!-- ترويسة اللوحة المحددة -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 border"
                :class="
                  selectedDay.isToday
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                    : selectedDay.hasLecture
                      ? 'bg-primary-600 text-white border-primary-500 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                "
              >
                <span class="text-xs font-black">{{ selectedDay.dayLabel }}</span>
                <span class="text-[9px] font-mono opacity-90">{{ selectedDay.dateShort }}</span>
              </div>

              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-base font-black text-slate-900 dark:text-slate-100 font-heading">
                    تفاصيل ومحتوى يوم {{ selectedDay.dayLabel }} ({{ selectedDay.dateShort }})
                  </h4>
                  <span
                    v-if="selectedDay.isToday"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950"
                  >
                    اليوم الحالي
                  </span>
                  <span
                    v-if="selectedDay.hasLecture"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    :class="selectedDay.isPast ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300 border border-primary-200 dark:border-primary-800'"
                  >
                    {{ selectedDay.isPast ? 'حضور مسجل ✓' : 'محاضرة ' + selectedDay.lectureData.lectureIndex + ' من ' + activeCourse.round.totalLectures }}
                  </span>
                  <span
                    v-else
                    class="px-2.5 py-0.5 rounded-full text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    عطلة / لا توجد محاضرات
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  الدورة: {{ activeCourse.round.courseName }} • كود الدفعة: {{ activeCourse.round.roundCode }} • الدفعة {{ activeCourse.round.roundNumber }}
                </p>
              </div>
            </div>

            <!-- أزرار الإجراء السريع (زر تصريح الدخول QR والمقرر الكامل) -->
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                class="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                title="عرض وتكبير رمز تصريح الدخول (QR) مباشرة"
                @click="openPassQrModal(activeCourse)"
              >
                <QrCode class="w-4 h-4" />
                <span>تصريح الدخول (QR)</span>
              </button>

              <button
                type="button"
                class="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                @click="openCourseModal(activeCourse)"
              >
                <BookOpen class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                <span>المقرر الكامل</span>
              </button>
            </div>
          </div>

          <!-- تفاصيل المحتوى والخطة الدراسية -->
          <template v-if="selectedDay.hasLecture">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <!-- أهداف الجلسة والخطة الدراسية بالتفصيل -->
              <div class="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div class="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-black text-xs">
                  <BookOpen class="w-4 h-4 text-primary-600" />
                  <span>موضوع وخطة الجلسة التدريبية (محاضرة {{ selectedDay.lectureData.lectureIndex }}):</span>
                </div>

                <h5 class="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {{ selectedDay.lectureData.title }}
                </h5>

                <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                  <div class="font-bold text-[11px] text-slate-400">الخطة الدراسية والأهداف التعليمية:</div>
                  <p>{{ selectedDay.lectureData.objectives }}</p>
                </div>
              </div>

              <!-- بطاقات التوقيت والمقر والمحاضر -->
              <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 text-xs">
                <div class="space-y-1">
                  <div class="text-[10px] text-slate-400 font-bold">توقيت المحاضرة وعدد الساعات:</div>
                  <div class="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5 text-primary-500" />
                    <span>{{ selectedDay.lectureData.timeRange }} ({{ selectedDay.lectureData.duration }})</span>
                  </div>
                </div>

                <div class="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div class="text-[10px] text-slate-400 font-bold">مكان ومقر الانعقاد:</div>
                  <div class="font-bold text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span class="leading-tight">{{ selectedDay.lectureData.hall.name }} — {{ selectedDay.lectureData.hall.location }}</span>
                  </div>
                </div>

                <div class="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div class="text-[10px] text-slate-400 font-bold">المحاضر المسؤول:</div>
                  <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <User class="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{{ selectedDay.lectureData.instructor.name }} ({{ selectedDay.lectureData.instructor.specialty }})</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- في حال عطلة أو لا توجد محاضرات لهذا اليوم -->
          <template v-else>
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <Coffee class="w-8 h-8 mx-auto text-amber-500/80" />
              <div class="font-bold text-slate-800 dark:text-slate-200 text-sm">
                لا توجد محاضرات تدريبية مجدولة ليوم {{ selectedDay.dayLabel }} ({{ selectedDay.dateShort }})
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                يوم مخصص للاستذكار والمراجعة الذاتية والتطبيق العملي. معامل المعهد متاحة للتدريب الحر وحل التكليفات والواجبات المعتمدة.
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- مودال تفاصيل الدورة والمحتوى -->
    <TraineeCourseScheduleModal
      :is-open="isModalOpen"
      :course="selectedCourse"
      @close="isModalOpen = false"
      @open-pass="openPassQrModal"
    />

    <!-- مودال تصريح الدخول ورمز QR المنبثق مباشرة في نفس الصفحة -->
    <TraineePassZoomModal
      :is-open="isPassModalOpen"
      :pass="selectedPass"
      :trainee-profile="traineeProfile"
      @close="isPassModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  CalendarDays,
  CalendarClock,
  CalendarRange,
  AlarmClock,
  Clock,
  MapPin,
  User,
  BookOpen,
  QrCode,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Coffee,
} from 'lucide-vue-next';
import TraineeCourseScheduleModal from './TraineeCourseScheduleModal.vue';
import TraineePassZoomModal from '../passes/TraineePassZoomModal.vue';
import { ONGOING_APPLICATIONS } from '../../helpers/traineePortalMockData';
import { TRAINEE_MOCK_PROFILE } from '../../helpers/availableCoursesMockData';
import {
  WEEK_DAYS,
  formatDateDmy,
  formatDateLong,
  getNextLecture,
  formatTimeRange,
} from '../../helpers/traineePortalHelpers';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { useTraineeApplicationsStore } from '../../stores/traineeApplicationsStore';

const authStore = useAuthStore();
const traineeStore = useTraineeApplicationsStore();

const traineeProfile = computed(() => ({
  ...TRAINEE_MOCK_PROFILE,
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId,
}));

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

// مودال تصريح الدخول المنبثق في نفس الصفحة
const isPassModalOpen = ref(false);
const selectedPass = ref(null);

function openPassQrModal(course = null) {
  selectedPass.value = course || activeCourse.value || courses.value[0] || null;
  isPassModalOpen.value = true;
}

// ============================================================
// منطق التقويم الدراسي التفاعلي ومسار الأسابيع
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

// تحديد الأسبوع واليوم المختار تلقائياً
onMounted(() => {
  const foundIndex = allWeeks.value.findIndex((w) => w.containsToday);
  if (foundIndex !== -1) {
    currentWeekIndex.value = foundIndex;
  } else {
    currentWeekIndex.value = 0;
  }
  ensureSelectedDay();
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
    ensureSelectedDay();
  }
}

function nextWeek() {
  if (canGoNext.value) {
    currentWeekIndex.value += 1;
    ensureSelectedDay();
  }
}

function jumpToCurrentWeek() {
  const foundIndex = allWeeks.value.findIndex((w) => w.containsToday);
  if (foundIndex !== -1) {
    currentWeekIndex.value = foundIndex;
    ensureSelectedDay();
  }
}

// ============================================================
// حالة اليوم المحدد في العرض الأفقي لعرض خطته ومحتواه
// ============================================================
const selectedDateStr = ref('');

function selectDay(dateStr) {
  selectedDateStr.value = dateStr;
}

function ensureSelectedDay() {
  const days = currentWeekDays.value;
  if (!days.length) return;
  const exists = days.find((d) => d.dateStr === selectedDateStr.value);
  if (!exists) {
    const todayDay = days.find((d) => d.isToday);
    const firstLecture = days.find((d) => d.hasLecture);
    selectedDateStr.value = todayDay?.dateStr || firstLecture?.dateStr || days[0].dateStr;
  }
}

const selectedDay = computed(() => {
  if (!currentWeekDays.value.length) return null;
  return currentWeekDays.value.find((d) => d.dateStr === selectedDateStr.value) || currentWeekDays.value[0];
});

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
</script>
