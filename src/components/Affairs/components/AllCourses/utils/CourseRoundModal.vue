<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl xl:max-w-6xl overflow-hidden animate-scale-in text-right flex flex-col max-h-[92vh]"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. ترويسة النافذة -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
            <CalendarPlus class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ modalTitle }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              معالج جدولة الدفعة رقم {{ form.roundNumber }} (تلقائي) — حجز القاعة وتحديد المواعيد بدون تعارض
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 2. شريط خطوات المعالج الثلاثة (3-Step Simple Stepper) -->
      <div class="px-6 py-3 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            v-for="s in STEPS"
            :key="s.step"
            type="button"
            class="flex items-center gap-2.5 p-2 rounded-2xl transition-all cursor-pointer text-right group"
            :class="[
              currentStep === s.step
                ? 'bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700'
                : currentStep > s.step
                  ? 'opacity-90 hover:bg-white/60 dark:hover:bg-slate-900/60'
                  : 'opacity-50 cursor-not-allowed',
            ]"
            @click="goToStep(s.step)"
          >
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors"
              :class="[
                currentStep === s.step
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : currentStep > s.step
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
              ]"
            >
              <Check v-if="currentStep > s.step" class="w-4 h-4 stroke-[3]" />
              <span v-else>{{ s.step }}</span>
            </div>

            <div class="min-w-0">
              <span
                class="text-xs sm:text-sm font-black block truncate"
                :class="currentStep === s.step ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'"
              >
                {{ s.title }}
              </span>
              <span class="text-[10px] text-slate-400 block truncate font-medium hidden sm:block">
                {{ s.desc }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- 3. محتوى النموذج (Scrollable Area) -->
      <form class="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm" @submit.prevent="handleSubmit">
        <!-- رسائل الخطأ والتنبيهات العامة إن وُجدت -->
        <div
          v-if="validationError"
          class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-shake"
        >
          <AlertCircle class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{{ validationError }}</span>
        </div>

        <!-- ========================================================
             الخطوة 1: الدورة التدريبية والمحاضر + السعة والقاعات في نفس التاب
             ======================================================== -->
        <div v-show="currentStep === 1" class="space-y-6 animate-fade-in">
          <!-- ترويسة الخطوة -->
          <div class="flex items-center gap-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div class="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
              <Building2 class="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 font-heading">
                بيانات الدورة التدريبية والمحاضر وتحديد السعة واختيار القاعة
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                حدد الدورة والمحاضر، ثم أدخل سعة الدفعة المطلوبة لاختيار القاعة المستوعبة مباشرة في نفس التاب
              </p>
            </div>
          </div>

          <!-- 1.1 بيانات الدورة والمحاضر المعتمد -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- الدورة التدريبية -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  الدورة التدريبية بالكتالوج <span class="text-rose-500">*</span>
                </label>
                <span class="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-black font-mono">
                  الدفعة رقم {{ form.roundNumber }} (تلقائي)
                </span>
              </div>

              <!-- دورة محددة مسبقاً -->
              <div v-if="isSpecificCourse" class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <strong class="text-sm font-black text-slate-800 dark:text-slate-100 block">
                  {{ selectedCourse?.name }}
                </strong>
                <span class="text-xs text-slate-400 font-bold block mt-0.5">
                  الدفعات السابقة المسجلة: {{ calculatedPreviousRound }} دفعة
                </span>
              </div>

              <!-- اختيار من الكتالوج -->
              <div v-else class="space-y-1">
                <Select
                  v-model="form.courseId"
                  :options="courseOptions"
                  option-label="name"
                  option-value="id"
                  placeholder="اختر الدورة التدريبية..."
                  class="w-full text-sm font-bold rounded-xl h-11 flex items-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  @change="onCourseSelected"
                />
              </div>
            </div>

            <!-- المحاضر المعتمد -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                المحاضر المعتمد للشرح <span class="text-rose-500">*</span>
              </label>

              <Select
                v-model="form.instructorId"
                :options="instructorOptions"
                option-label="name"
                option-value="id"
                filter
                filter-placeholder="ابحث بالاسم أو التخصص..."
                placeholder="اختر المحاضر المعتمد..."
                class="w-full text-sm font-bold rounded-xl h-11 flex items-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />

              <div v-if="selectedInstructor" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between px-1">
                <span>{{ selectedInstructor.specialty }}</span>
                <span class="font-mono">هاتف: {{ selectedInstructor.phone }}</span>
              </div>
            </div>
          </div>

          <!-- 1.2 سعة الدفعة المطلوبة (في نفس التاب فوق القاعات مباشرة) -->
          <div class="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-2xs space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label class="block text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Users class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>سعة الدفعة المستهدفة (عدد المتدربين المطلوب)</span>
                  <span class="text-rose-500">*</span>
                </label>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  أدخل العدد المستهدف، وسيتم فوراً مقارنته بمدى استيعاب كل قاعة في الأسفل
                </p>
              </div>

              <!-- حقل السعة وأزرار التحديد السريع -->
              <div class="flex items-center gap-2">
                <input
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  required
                  class="w-28 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-black text-slate-800 dark:text-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="25"
                />
                <div class="flex items-center gap-1">
                  <button
                    v-for="cap in [20, 25, 30, 35]"
                    :key="cap"
                    type="button"
                    class="h-10 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                    :class="
                      form.capacity === cap
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    "
                    @click="form.capacity = cap"
                  >
                    {{ cap }} مقعد
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 1.3 اختيار القاعة التدريبية (في نفس التاب تحت السعة مباشرة) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                اختر القاعة أو معمل التدريب المستوعب لسعة ({{ form.capacity }} متدرب) <span class="text-rose-500">*</span>
              </label>
              <span v-if="selectedHall" class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                تم اختيار: {{ selectedHall.name }} (سعة {{ selectedHall.maxCapacity }} مقعد)
              </span>
            </div>

            <!-- شبكة كروت القاعات المباشرة -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="hall in hallsList"
                :key="hall.id"
                class="p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden group shadow-2xs"
                :class="[
                  form.hallId === hall.id
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
                  form.capacity > hall.maxCapacity ? 'opacity-60 border-rose-200 dark:border-rose-900/50' : '',
                ]"
                @click="selectHall(hall)"
              >
                <!-- خط تحديد علوي للقاعة المختارة -->
                <div
                  v-if="form.hallId === hall.id"
                  class="absolute top-0 right-0 left-0 h-1 bg-emerald-600"
                ></div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                      :class="
                        hall.type === 'Lab'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      "
                    >
                      {{ hall.type === 'Lab' ? 'معمل حاسب' : 'قاعة محاضرات' }}
                    </span>

                    <!-- شارة مطابقة السعة الفورية -->
                    <span
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                      :class="
                        form.capacity <= hall.maxCapacity
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black'
                      "
                    >
                      <CheckCircle2 v-if="form.capacity <= hall.maxCapacity" class="w-3 h-3 text-emerald-600" />
                      <AlertCircle v-else class="w-3 h-3 text-rose-600" />
                      <span>{{ form.capacity <= hall.maxCapacity ? 'تستوعب السعة' : 'أقل من السعة المطلوبة' }}</span>
                    </span>
                  </div>

                  <strong class="text-sm font-black text-slate-800 dark:text-slate-100 block">
                    {{ hall.name }}
                  </strong>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ hall.location }}
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span class="text-slate-400">السعة القصوى:</span>
                  <strong class="font-bold text-slate-700 dark:text-slate-200">{{ hall.maxCapacity }} مقعد</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================
             الخطوة 2: التواريخ والمواعيد الأسبوعية (طريقة سهلة ومريحة)
             ======================================================== -->
        <div v-show="currentStep === 2" class="space-y-6 animate-fade-in">
          <!-- ترويسة الخطوة -->
          <div class="flex items-center gap-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Clock class="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 font-heading">
                فترة انعقاد الدورة وأيام ومواعيد المحاضرات
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                حدد التواريخ أولاً، ثم اختر أيام الأسبوع وفترة المحاضرة المناسبة بكبسة زر واحدة
              </p>
            </div>
          </div>

          <!-- 2.1 فترة انعقاد الدورة (Dates) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
              <Calendar class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>فترة الانعقاد والتقديم</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  تاريخ بداية الدورة <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  تاريخ انتهاء الدورة <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  آخر موعد للتقديم <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.lastApplicationDate"
                  type="date"
                  required
                  class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- 2.2 أيام المحاضرات في الأسبوع (Lecture Days) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                  أيام المحاضرات في الأسبوع <span class="text-rose-500">*</span>
                </label>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  اختر الأيام التي ستنعقد فيها محاضرات الدورة
                </p>
              </div>

              <!-- أزرار الاختصار السريعة -->
              <div class="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                  @click="setLecturePreset(['Sat', 'Mon', 'Wed'])"
                >
                  سبت / إثنين / أربعاء
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                  @click="setLecturePreset(['Sun', 'Tue', 'Thu'])"
                >
                  أحد / ثلاثاء / خميس
                </button>
              </div>
            </div>

            <!-- أزرار الأيام الـ 7 -->
            <div class="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
              <button
                v-for="day in LECTURE_DAYS_OPTIONS"
                :key="day.value"
                type="button"
                class="h-11 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer relative"
                :class="
                  form.lectureDays.includes(day.value)
                    ? 'bg-primary-600 text-white border-primary-600 shadow-2xs font-black'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                "
                @click="toggleDay(day.value)"
              >
                <span>{{ day.label }}</span>
                <span v-if="form.lectureDays.includes(day.value)" class="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white"></span>
              </button>
            </div>
          </div>

          <!-- 2.3 توقيت المحاضرات بكبسة زر واحدة (Easy Period Cards) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
              <div>
                <label class="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                  توقيت المحاضرات اليومي <span class="text-rose-500">*</span>
                </label>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  اختر الفترة التدريبية بكبسة زر واحدة أو حدد ساعات مخصصة (بين 07:00 ص و 09:00 م)
                </p>
              </div>

              <!-- زر التبديل لتخصيص أوقات مختلفة لكل يوم -->
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                :class="
                  form.isCustomDayTiming
                    ? 'bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-800 font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                "
                @click="form.isCustomDayTiming = !form.isCustomDayTiming"
              >
                <SlidersHorizontal class="w-3.5 h-3.5" />
                <span>{{ form.isCustomDayTiming ? 'مواعيد مخصصة لكل يوم (مفعّل)' : 'هل ترغب في مواعيد مختلفة لكل يوم؟' }}</span>
              </button>
            </div>

            <!-- كروت الفترات السريعة الجاهزة (One-Click Timing Cards) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="p in STANDARD_TIME_PRESETS"
                :key="p.id"
                type="button"
                class="p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs group"
                :class="
                  !form.isCustomDayTiming && form.startTime === p.startTime && form.endTime === p.endTime
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                "
                @click="setQuickPeriod(p)"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black">{{ p.label }}</span>
                  <span class="w-2.5 h-2.5 rounded-full" :class="form.startTime === p.startTime && form.endTime === p.endTime && !form.isCustomDayTiming ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'"></span>
                </div>
                <div class="font-mono text-sm font-black text-slate-900 dark:text-slate-100">
                  {{ formatTime12(p.startTime) }} — {{ formatTime12(p.endTime) }}
                </div>
              </button>
            </div>

            <!-- إمكانية تعديل الساعات بدقة (تظهر دائماً أو عند الرغبة في موعد مخصص) -->
            <div v-if="!form.isCustomDayTiming" class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span class="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                أو ضبط وقت مخصص بالدقائق:
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <span class="text-[11px] font-bold text-slate-400 block">وقت البدء (من 07:00 ص)</span>
                  <select
                    :value="form.startTime"
                    required
                    class="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                    @change="onUnifiedStartTimeChanged($event.target.value)"
                  >
                    <option v-for="opt in ALLOWED_START_TIME_OPTIONS" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1">
                  <span class="text-[11px] font-bold text-slate-400 block">وقت الانتهاء (حتى 09:00 م كحد أقصى)</span>
                  <select
                    v-model="form.endTime"
                    required
                    class="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option v-for="opt in unifiedEndTimeOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- كروت تخصيص المواعيد لكل يوم (تظهر فقط عند تفعيل التخصيص) -->
            <div v-if="form.isCustomDayTiming && form.lectureDays.length > 0" class="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-primary-700 dark:text-primary-300 block">
                تخصيص مواعيد كل يوم من الأيام المختارة بشكل مستقل:
              </span>

              <div class="space-y-2">
                <div
                  v-for="dayKey in form.lectureDays"
                  :key="dayKey"
                  class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-black text-xs">
                      {{ DAY_SHORT_MAP[dayKey] }}
                    </span>
                    <strong class="text-xs font-black text-slate-800 dark:text-slate-200">
                      يوم {{ DAY_NAMES_MAP[dayKey] }}
                    </strong>
                  </div>

                  <!-- حقول وقت هذا اليوم -->
                  <div class="flex items-center gap-2 flex-1 max-w-sm">
                    <div class="flex-1 space-y-0.5">
                      <span class="text-[10px] text-slate-400 block">البدء</span>
                      <select
                        :value="getDayStartTime(dayKey)"
                        class="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                        @change="onDayStartTimeChanged(dayKey, $event.target.value)"
                      >
                        <option v-for="opt in ALLOWED_START_TIME_OPTIONS" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                        </option>
                      </select>
                    </div>

                    <div class="flex-1 space-y-0.5">
                      <span class="text-[10px] text-slate-400 block">الانتهاء</span>
                      <select
                        :value="getDayEndTime(dayKey)"
                        class="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                        @change="onDayTimeChanged(dayKey, getDayStartTime(dayKey), $event.target.value)"
                      >
                        <option v-for="opt in getDayEndTimeOptions(dayKey)" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- مؤشر تعارض اليوم بالتحديد -->
                  <div class="shrink-0 flex items-center gap-1.5 text-[11px] font-bold">
                    <span
                      v-if="getDaySingleConflict(dayKey).hasConflict"
                      class="px-2 py-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1"
                    >
                      <AlertCircle class="w-3 h-3 text-rose-600" />
                      تعارض بالموعد
                    </span>
                    <span
                      v-else
                      class="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1"
                    >
                      <CheckCircle2 class="w-3 h-3 text-emerald-600" />
                      شاغر بالقاعة
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.4 مؤشر التحقق اللحظي من التعارض بالقاعة (Live Conflict Check) -->
            <div class="pt-2">
              <div
                v-if="conflictStatus.hasConflict"
                class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-2 animate-shake"
              >
                <div class="flex items-center gap-2 font-black text-sm">
                  <AlertCircle class="w-5 h-5 text-rose-600 shrink-0" />
                  <span>تنبيه: تعارض في حجز القاعة (الموعد غير متاح)</span>
                </div>
                <p class="text-xs leading-relaxed font-bold pr-7">
                  {{ conflictStatus.message }}
                </p>
                <div class="flex flex-wrap items-center gap-2 pr-7 pt-1">
                  <span class="text-[11px] text-rose-700 dark:text-rose-300 font-bold">حلول سريعة:</span>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 text-xs font-bold text-rose-900 dark:text-rose-200 hover:bg-rose-100 cursor-pointer"
                    @click="setQuickPeriod(STANDARD_TIME_PRESETS[2])"
                  >
                    تطبيق الفترة المسائية الثانية (05:30 م - 09:00 م)
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 text-xs font-bold text-rose-900 dark:text-rose-200 hover:bg-rose-100 cursor-pointer"
                    @click="setQuickPeriod(STANDARD_TIME_PRESETS[1])"
                  >
                    تطبيق الفترة المسائية الأولى (01:30 م - 05:30 م)
                  </button>
                </div>
              </div>

              <div
                v-else-if="form.hallId && form.lectureDays.length > 0"
                class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 text-xs font-bold"
              >
                <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
                <span>القاعة «{{ selectedHall?.name }}» شاغرة ومتاحة بالكامل في كافة الأيام والمواعيد المحددة بدون أي تعارض زمني.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================
             الخطوة 3: المراجعة والاعتماد النهائي
             ======================================================== -->
        <div v-show="currentStep === 3" class="space-y-6 animate-fade-in">
          <!-- ترويسة الخطوة -->
          <div class="flex items-center gap-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div class="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
              <Layers class="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 font-heading">
                مراجعة تفاصيل الدفعة والاعتماد النهائي
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                تأكد من صحة كافة البيانات المدخلة قبل الحفظ النهائي وجدولة مواعيد القاعة في النظام
              </p>
            </div>
          </div>

          <!-- بطاقات الملخص النهائي -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- كارت 1: الدورة والمحاضر والسعة -->
            <div class="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div class="flex items-center gap-2 text-xs font-black text-primary-700 dark:text-primary-300 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <BookOpen class="w-4 h-4" />
                <span>الدورة والمحاضر والسعة</span>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">اسم الدورة:</span>
                  <strong class="text-slate-800 dark:text-slate-100 text-sm">{{ selectedCourse?.name }}</strong>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">رقم الدفعة:</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-black border border-emerald-200 dark:border-emerald-800">
                    الدفعة رقم {{ form.roundNumber }} (تلقائي)
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">المحاضر المعتمد:</span>
                  <strong class="text-slate-800 dark:text-slate-100">{{ selectedInstructor?.name }}</strong>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">سعة الدفعة المستهدفة:</span>
                  <strong class="font-mono text-slate-800 dark:text-slate-100">{{ form.capacity }} متدرب</strong>
                </div>
              </div>
            </div>

            <!-- كارت 2: القاعة وفترة الانعقاد -->
            <div class="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div class="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-300 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <Building2 class="w-4 h-4" />
                <span>القاعة وفترة الانعقاد</span>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">القاعة / المعمل:</span>
                  <strong class="text-slate-800 dark:text-slate-100 text-sm">{{ selectedHall?.name }} ({{ selectedHall?.location }})</strong>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">سعة القاعة القصوى:</span>
                  <span class="font-mono text-slate-700 dark:text-slate-300 font-bold">{{ selectedHall?.maxCapacity }} مقعد</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">فترة الانعقاد:</span>
                  <span class="font-mono text-slate-800 dark:text-slate-100 font-bold">من {{ form.startDate }} إلى {{ form.endDate }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">آخر موعد للتقديم:</span>
                  <span class="font-mono text-slate-700 dark:text-slate-300 font-bold">{{ form.lastApplicationDate || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- كارت 3: جدول الأيام والمواعيد الأسبوعية -->
            <div class="md:col-span-2 p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
                  <Clock class="w-4 h-4 text-amber-500" />
                  <span>جدول مواعيد الأيام التدريبية الأسبوعية</span>
                </div>
                <span class="text-xs text-slate-400 font-bold">
                  {{ form.lectureDays.length }} أيام بالأسبوع
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                <div
                  v-for="d in form.lectureDays"
                  :key="d"
                  class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono"
                >
                  <strong class="text-slate-800 dark:text-slate-200 font-sans font-black">
                    {{ DAY_NAMES_MAP[d] }}
                  </strong>
                  <span class="font-bold text-primary-700 dark:text-primary-300">
                    {{ formatTime12(getDayStartTime(d)) }} - {{ formatTime12(getDayEndTime(d)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- كارت 4: حالة التحقق من خلو التعارض -->
            <div
              class="md:col-span-2 p-4 rounded-2xl border flex items-center gap-3"
              :class="
                conflictStatus.hasConflict
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              "
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                :class="conflictStatus.hasConflict ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'"
              >
                <AlertCircle v-if="conflictStatus.hasConflict" class="w-5 h-5" />
                <CheckCircle2 v-else class="w-5 h-5" />
              </div>
              <div class="text-xs font-bold">
                <strong class="block text-sm">
                  {{ conflictStatus.hasConflict ? 'يوجد تعارض زمني في القاعة' : 'تم التحقق بنجاح: القاعة شاغرة وخالية من التعارض' }}
                </strong>
                <p class="mt-0.5 opacity-90">
                  {{ conflictStatus.hasConflict ? conflictStatus.message : 'المواعيد المختارة خالية من أي تداخل مع أي دورة أخرى وتقع بالكامل ضمن ساعات العمل الرسمية (07:00 ص - 09:00 م).' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- 4. شريط أزرار التنقل والتحكم السفلي (Stepper Navigation Footer) -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <!-- زر التراجع / الإلغاء -->
        <button
          v-if="currentStep === 1"
          type="button"
          class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          @click="handleClose"
        >
          إلغاء
        </button>

        <button
          v-else
          type="button"
          class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="prevStep"
        >
          <ChevronRight class="w-4 h-4" />
          <span>الخطوة السابقة</span>
        </button>

        <!-- عداد الخطوات -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:inline-block">
            الخطوة {{ currentStep }} من 3:
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-black bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            {{ STEPS[currentStep - 1]?.title }}
          </span>
        </div>

        <!-- زر التقدم / الاعتماد -->
        <button
          v-if="currentStep < 3"
          type="button"
          class="h-11 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
          @click="nextStep"
        >
          <span>المتابعة إلى {{ STEPS[currentStep]?.title }}</span>
          <ChevronLeft class="w-4 h-4" />
        </button>

        <button
          v-else
          type="button"
          :disabled="isSubmitting || isCapacityExceeded || conflictStatus.hasConflict || form.lectureDays.length === 0"
          class="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSubmit"
        >
          <CalendarPlus class="w-4.5 h-4.5" />
          <span>
            {{
              isSubmitting
                ? 'جاري الاعتماد...'
                : conflictStatus.hasConflict
                  ? 'تعارض في موعد القاعة'
                  : isCapacityExceeded
                    ? 'تجاوز سعة القاعة'
                    : 'اعتماد وجدولة الدفعة وحجز القاعة'
            }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Select from 'primevue/select';
import {
  CalendarPlus,
  X,
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Building2,
  CheckCircle2,
  Check,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-vue-next';
import {
  LECTURE_DAYS_OPTIONS,
  INITIAL_ROUND_FORM,
  formatLectureDays,
  calculateLectureDuration,
} from '../helpers/courseConstants';
import {
  INITIAL_HALLS,
  INITIAL_INSTRUCTORS,
} from '../helpers/courseMockData';
import {
  checkRoundConflict,
  checkSingleDayConflict,
  getHallActiveReservations,
  getHallWeeklySchedule,
  formatTime12Hour,
  DAY_NAMES_MAP,
  ALLOWED_TIME_OPTIONS,
  ALLOWED_START_TIME_OPTIONS,
  ALLOWED_END_TIME_OPTIONS,
  MIN_OPERATIONAL_TIME,
  MAX_OPERATIONAL_TIME,
} from '../helpers/hallScheduleHelper';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialCourseId: {
    type: Number,
    default: null,
  },
  courses: {
    type: Array,
    default: () => [],
  },
  existingRounds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'save']);

// تعريف الخطوات الثلاث الواضحة والمركزة
const STEPS = [
  { step: 1, title: 'الدورة والقاعة والسعة', desc: 'الدورة والمحاضر والسعة واختيار القاعة في نفس التاب' },
  { step: 2, title: 'التواريخ ومواعيد المحاضرات', desc: 'فترة الانعقاد وأيام ومواعيد المحاضرات السريعة' },
  { step: 3, title: 'المراجعة والاعتماد', desc: 'ملخص شامل وتأكيد جدولة الدفعة وحجز القاعة' },
];

const currentStep = ref(1);

// الفترات القياسية السريعة (07:00 ص إلى 09:00 م)
const STANDARD_TIME_PRESETS = [
  { id: 'morning', label: 'الفترة الصباحية', short: 'صباحي', startTime: '09:00', endTime: '13:00' },
  { id: 'afternoon', label: 'الفترة المسائية الأولى', short: 'مسائي 1', startTime: '13:30', endTime: '17:30' },
  { id: 'evening', label: 'الفترة المسائية الثانية', short: 'مسائي 2', startTime: '17:30', endTime: '21:00' },
];

const DAY_SHORT_MAP = {
  Sat: 'سبت',
  Sun: 'أحد',
  Mon: 'إثنين',
  Tue: 'ثلاثاء',
  Wed: 'أربعاء',
  Thu: 'خميس',
  Fri: 'جمعة',
};

const form = ref({ ...INITIAL_ROUND_FORM });
const isSubmitting = ref(false);
const validationError = ref('');
const calculatedPreviousRound = ref(0);

// قائمة القاعات النشطة
const hallsList = computed(() => {
  return INITIAL_HALLS.filter((h) => h.isActive);
});

// هل تم فتح المودال لكورس محدد مسبقاً (من الكارت أو المودال)
const isSpecificCourse = computed(() => {
  return Boolean(props.initialCourseId);
});

// عنوان النافذة الديناميكي
const modalTitle = computed(() => {
  if (selectedCourse.value?.name) {
    return `فتح دورة جديدة من كورس «${selectedCourse.value.name}»`;
  }
  return 'فتح دورة انعقاد جديدة (Course Round)';
});

// خيارات الدورات المتاحة
const courseOptions = computed(() => {
  return props.courses.map((c) => ({
    id: c.id,
    name: c.name,
    roundsCount: c.roundsCount || 0,
    description: c.description,
  }));
});

// خيارات المحاضرين
const instructorOptions = computed(() => {
  return INITIAL_INSTRUCTORS.filter((i) => i.isActive).map((i) => ({
    id: i.id,
    name: `${i.name} (${i.specialty})`,
    rawName: i.name,
    specialty: i.specialty,
    phone: i.phone,
  }));
});

// الكائنات المحددة حالياً
const selectedCourse = computed(() => {
  return props.courses.find((c) => c.id === form.value.courseId);
});

const selectedInstructor = computed(() => {
  return INITIAL_INSTRUCTORS.find((i) => i.id === form.value.instructorId);
});

const selectedHall = computed(() => {
  return INITIAL_HALLS.find((h) => h.id === form.value.hallId);
});

// فحص تجاوز السعة القصوى للقاعة
const isCapacityExceeded = computed(() => {
  if (!selectedHall.value || !form.value.capacity) return false;
  return form.value.capacity > selectedHall.value.maxCapacity;
});

// استخراج الحجوزات القائمة في القاعة خلال الفترة المحددة
const activeReservationsInHall = computed(() => {
  if (!form.value.hallId) return [];
  return getHallActiveReservations(
    form.value.hallId,
    form.value.startDate,
    form.value.endDate,
    props.existingRounds,
    form.value.id
  );
});

// جدول إشغال القاعة الأسبوعي والمواعيد المتاحة
const weeklyHallSchedule = computed(() => {
  if (!form.value.hallId) return [];
  return getHallWeeklySchedule(
    form.value.hallId,
    form.value.startDate,
    form.value.endDate,
    props.existingRounds
  );
});

// فحص التعارض اللحظي الدقيق مع دعم المواعيد المستقلة لكل يوم
const conflictStatus = computed(() => {
  return checkRoundConflict(form.value, props.existingRounds);
});

// دوال إدارة مواعيد الأيام المستقلة
function getDayStartTime(dayKey) {
  return form.value.daySchedules?.[dayKey]?.startTime || form.value.startTime || '09:00';
}

function getDayEndTime(dayKey) {
  return form.value.daySchedules?.[dayKey]?.endTime || form.value.endTime || '13:00';
}

function calculateDayDuration(dayKey) {
  return calculateLectureDuration(getDayStartTime(dayKey), getDayEndTime(dayKey));
}

// دوال فلترة ومنع اختيار وقت انتهاء يسبق أو يساوي وقت البدء
function getAvailableEndTimes(startTime) {
  if (!startTime) return ALLOWED_END_TIME_OPTIONS;
  return ALLOWED_TIME_OPTIONS.filter((opt) => opt.value > startTime);
}

function findNextEndTime(startTime, desiredDurationHours = 3) {
  if (!startTime) return '13:00';
  const available = getAvailableEndTimes(startTime);
  if (available.length === 0) return '21:00';

  const [sh, sm] = startTime.split(':').map(Number);
  const targetMinutes = sh * 60 + sm + desiredDurationHours * 60;

  const found = available.find((opt) => {
    const [oh, om] = opt.value.split(':').map(Number);
    return oh * 60 + om >= targetMinutes;
  });

  return found ? found.value : available[available.length - 1].value;
}

// قائمة أوقات النهاية المتاحة للتوقيت الموحد (تتغير ديناميكياً حسب وقت البدء المختار)
const unifiedEndTimeOptions = computed(() => {
  return getAvailableEndTimes(form.value.startTime);
});

// عند تغيير وقت البدء الموحد، نحدث النهاية تلقائياً إذا كانت تسبق أو تساوي البداية
function onUnifiedStartTimeChanged(newStart) {
  form.value.startTime = newStart;
  if (!form.value.endTime || form.value.endTime <= newStart) {
    form.value.endTime = findNextEndTime(newStart, 4);
  }
}

// قائمة أوقات النهاية المتاحة لكل يوم على حدة
function getDayEndTimeOptions(dayKey) {
  const dayStart = getDayStartTime(dayKey);
  return getAvailableEndTimes(dayStart);
}

// عند تغيير وقت بدء يوم معين، نحدث نهاية ذلك اليوم تلقائياً إذا كانت تسبق أو تساوي البداية
function onDayStartTimeChanged(dayKey, newStart) {
  let currentEnd = getDayEndTime(dayKey);
  if (!currentEnd || currentEnd <= newStart) {
    currentEnd = findNextEndTime(newStart, 4);
  }
  onDayTimeChanged(dayKey, newStart, currentEnd);
}

function onDayTimeChanged(dayKey, newStart, newEnd) {
  if (!form.value.daySchedules) form.value.daySchedules = {};
  form.value.daySchedules[dayKey] = {
    startTime: newStart,
    endTime: newEnd,
  };
  form.value.isCustomDayTiming = true;
}

function setQuickPeriod(preset) {
  form.value.startTime = preset.startTime;
  form.value.endTime = preset.endTime;
  form.value.isCustomDayTiming = false;
  if (!form.value.daySchedules) form.value.daySchedules = {};
  for (const d of form.value.lectureDays) {
    form.value.daySchedules[d] = {
      startTime: preset.startTime,
      endTime: preset.endTime,
    };
  }
}

function formatTime12(time24) {
  return formatTime12Hour(time24);
}

function getDaySingleConflict(dayKey) {
  const start = getDayStartTime(dayKey);
  const end = getDayEndTime(dayKey);
  return checkSingleDayConflict(
    dayKey,
    start,
    end,
    form.value.hallId,
    form.value.startDate,
    form.value.endDate,
    props.existingRounds,
    form.value.id
  );
}

// التحقق من صحة بيانات الخطوة الحالية
function validateStep(stepIndex) {
  validationError.value = '';

  if (stepIndex === 1) {
    if (!form.value.courseId) {
      validationError.value = 'يرجى اختيار الدورة التدريبية من الكتالوج أولاً.';
      return false;
    }
    if (!form.value.instructorId) {
      validationError.value = 'يرجى اختيار المحاضر المعتمد للدورة.';
      return false;
    }
    if (!form.value.capacity || form.value.capacity <= 0) {
      validationError.value = 'يرجى تحديد سعة الدفعة المستهدفة (عدد المتدربين).';
      return false;
    }
    if (!form.value.hallId) {
      validationError.value = 'يرجى اختيار القاعة أو معمل التدريب المناسب في الأسفل.';
      return false;
    }
    if (isCapacityExceeded.value) {
      validationError.value = `سعة الدفعة (${form.value.capacity}) تتجاوز أقصى سعة للقاعة المحددة (${selectedHall.value?.maxCapacity || 0} مقعد).`;
      return false;
    }
    return true;
  }

  if (stepIndex === 2) {
    if (!form.value.startDate || !form.value.endDate) {
      validationError.value = 'يرجى تحديد تاريخ بداية ونهاية الدورة.';
      return false;
    }
    if (new Date(form.value.endDate) <= new Date(form.value.startDate)) {
      validationError.value = 'تاريخ انتهاء الدورة يجب أن يكون لاحقاً لتاريخ البداية.';
      return false;
    }
    if (form.value.lastApplicationDate && new Date(form.value.lastApplicationDate) > new Date(form.value.startDate)) {
      validationError.value = 'آخر موعد للتقديم يجب أن يكون سابقاً أو مساوياً لتاريخ بداية الدورة.';
      return false;
    }
    if (form.value.lectureDays.length === 0) {
      validationError.value = 'يرجى اختيار يوم واحد على الأقل للمحاضرات الأسبوعية.';
      return false;
    }
    for (const day of form.value.lectureDays) {
      const s = getDayStartTime(day);
      const e = getDayEndTime(day);
      const arabicDay = DAY_NAMES_MAP[day] || day;
      if (!s || !e) {
        validationError.value = `يرجى تحديد وقت بدء وانتهاء المحاضرة ليوم (${arabicDay}).`;
        return false;
      }
      if (s < MIN_OPERATIONAL_TIME) {
        validationError.value = `أبكر موعد متاح لبدء المحاضرات هو 07:00 ص (يوم ${arabicDay}).`;
        return false;
      }
      if (e > MAX_OPERATIONAL_TIME) {
        validationError.value = `أقصى موعد لانتهاء المحاضرات هو 09:00 م (يوم ${arabicDay}). لا يمكن حجز مواعيد بعد 9:00 مساءً.`;
        return false;
      }
      if (s >= e) {
        validationError.value = `وقت انتهاء المحاضرة يجب أن يكون بعد وقت البدء (يوم ${arabicDay}).`;
        return false;
      }
    }
    if (conflictStatus.value.hasConflict) {
      validationError.value = conflictStatus.value.message;
      return false;
    }
    return true;
  }

  return true;
}

function nextStep() {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < 3) {
      currentStep.value += 1;
    }
  }
}

function prevStep() {
  validationError.value = '';
  if (currentStep.value > 1) {
    currentStep.value -= 1;
  }
}

function goToStep(targetStep) {
  if (targetStep < currentStep.value) {
    validationError.value = '';
    currentStep.value = targetStep;
  } else if (targetStep > currentStep.value) {
    for (let s = currentStep.value; s < targetStep; s++) {
      if (!validateStep(s)) return;
    }
    currentStep.value = targetStep;
  }
}

// مراقبة توقيت البداية والنهاية لتحديث الأيام إذا كان النمط موحداً
watch(
  [() => form.value.startTime, () => form.value.endTime],
  ([newStart, newEnd]) => {
    if (!form.value.isCustomDayTiming && newStart && newEnd) {
      if (!form.value.daySchedules) form.value.daySchedules = {};
      for (const d of form.value.lectureDays) {
        form.value.daySchedules[d] = {
          startTime: newStart,
          endTime: newEnd,
        };
      }
    }
  }
);

// عند فتح النافذة
watch(
  () => [props.isOpen, props.initialCourseId],
  ([val]) => {
    if (val) {
      validationError.value = '';
      currentStep.value = 1;
      initForm();
    }
  }
);

// حساب رقم الدفعة القادمة تلقائياً بزيادة 1 عن أعلى دفعة سابقة
function computeNextRoundNumber(courseId) {
  if (!courseId) {
    form.value.roundNumber = 1;
    calculatedPreviousRound.value = 0;
    return 1;
  }

  const matchingRounds = props.existingRounds.filter(
    (r) => Number(r.courseId) === Number(courseId)
  );
  const roundNumsFromRounds = matchingRounds.map((r) => Number(r.roundNumber) || 0);
  const targetCourse = props.courses.find((c) => Number(c.id) === Number(courseId));
  const roundsCountFromCourse = Number(targetCourse?.roundsCount) || 0;

  const maxPrevious = Math.max(0, ...roundNumsFromRounds, roundsCountFromCourse);
  calculatedPreviousRound.value = maxPrevious;

  const nextNum = maxPrevious + 1;
  form.value.roundNumber = nextNum;
  return nextNum;
}

// مراقبة تغيير الدورة لإعادة الحساب الفوري لرقم الدفعة وتحديد المحاضر المعتمد
watch(
  () => form.value.courseId,
  (newCourseId) => {
    if (newCourseId) {
      computeNextRoundNumber(newCourseId);
      const targetCourse = props.courses.find((c) => Number(c.id) === Number(newCourseId));
      if (targetCourse?.instructorId) {
        form.value.instructorId = targetCourse.instructorId;
      }
    }
  }
);

function initForm() {
  const targetCourseId = props.initialCourseId || (props.courses.length > 0 ? props.courses[0].id : null);

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 14);
  const end = new Date(start);
  end.setDate(start.getDate() + 40);
  const lastApp = new Date(start);
  lastApp.setDate(start.getDate() - 7);

  const formatDateYMD = (d) => d.toISOString().split('T')[0];

  form.value = {
    ...INITIAL_ROUND_FORM,
    courseId: targetCourseId,
    roundNumber: 1,
    instructorId: INITIAL_INSTRUCTORS[0]?.id || null,
    hallId: INITIAL_HALLS[0]?.id || null,
    capacity: 25,
    startDate: formatDateYMD(start),
    endDate: formatDateYMD(end),
    lastApplicationDate: formatDateYMD(lastApp),
    startTime: '09:00',
    endTime: '13:00',
    lectureDays: ['Sat', 'Mon', 'Wed'],
    isCustomDayTiming: false,
    daySchedules: {
      Sat: { startTime: '09:00', endTime: '13:00' },
      Mon: { startTime: '09:00', endTime: '13:00' },
      Wed: { startTime: '09:00', endTime: '13:00' },
    },
    status: 'Available',
  };

  if (targetCourseId) {
    computeNextRoundNumber(targetCourseId);
    const targetCourse = props.courses.find((c) => Number(c.id) === Number(targetCourseId));
    if (targetCourse?.instructorId) {
      form.value.instructorId = targetCourse.instructorId;
    }
  }
}

function onCourseSelected() {
  if (form.value.courseId) {
    computeNextRoundNumber(form.value.courseId);
    const targetCourse = props.courses.find((c) => Number(c.id) === Number(form.value.courseId));
    if (targetCourse?.instructorId) {
      form.value.instructorId = targetCourse.instructorId;
    }
  }
}

function selectHall(hall) {
  form.value.hallId = hall.id;
  if (form.value.capacity > hall.maxCapacity) {
    form.value.capacity = hall.maxCapacity;
  }
}

function toggleDay(dayValue) {
  const idx = form.value.lectureDays.indexOf(dayValue);
  if (idx >= 0) {
    form.value.lectureDays.splice(idx, 1);
  } else {
    form.value.lectureDays.push(dayValue);
    if (!form.value.daySchedules) form.value.daySchedules = {};
    if (!form.value.daySchedules[dayValue]) {
      form.value.daySchedules[dayValue] = {
        startTime: form.value.startTime || '09:00',
        endTime: form.value.endTime || '13:00',
      };
    }
  }
}

function setLecturePreset(days) {
  form.value.lectureDays = [...days];
  if (!form.value.daySchedules) form.value.daySchedules = {};
  for (const d of days) {
    if (!form.value.daySchedules[d]) {
      form.value.daySchedules[d] = {
        startTime: form.value.startTime || '09:00',
        endTime: form.value.endTime || '13:00',
      };
    }
  }
}

function handleClose() {
  emit('close');
}

function handleSubmit() {
  if (!validateStep(1) || !validateStep(2)) {
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    const primaryDay = form.value.lectureDays[0];
    const defaultStart = form.value.isCustomDayTiming && primaryDay
      ? (form.value.daySchedules[primaryDay]?.startTime || form.value.startTime)
      : form.value.startTime;
    const defaultEnd = form.value.isCustomDayTiming && primaryDay
      ? (form.value.daySchedules[primaryDay]?.endTime || form.value.endTime)
      : form.value.endTime;

    const newRound = {
      id: Date.now(),
      courseId: form.value.courseId,
      courseName: selectedCourse.value?.name || '',
      roundNumber: Number(form.value.roundNumber || 1),
      instructorId: form.value.instructorId,
      instructorName: selectedInstructor.value?.name || '',
      hallId: form.value.hallId,
      hallName: selectedHall.value?.name || '',
      hallMaxCapacity: selectedHall.value?.maxCapacity || 30,
      capacity: Number(form.value.capacity),
      enrolledCount: 0,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      lastApplicationDate: form.value.lastApplicationDate,
      startTime: defaultStart,
      endTime: defaultEnd,
      lectureDays: [...form.value.lectureDays],
      isCustomDayTiming: form.value.isCustomDayTiming,
      daySchedules: { ...form.value.daySchedules },
      status: 'Available',
      createdAt: new Date().toISOString(),
    };

    emit('save', newRound);
    isSubmitting.value = false;
    handleClose();
  }, 350);
}
</script>
