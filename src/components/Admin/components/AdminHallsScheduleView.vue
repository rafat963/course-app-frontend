<template>
  <div class="space-y-5 select-none pb-12" dir="rtl">
    <!-- 1. رأس الصفحة (Header) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 flex items-center justify-center border border-primary-200/80 dark:border-primary-800 shrink-0 shadow-2xs">
          <CalendarDays class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              الجدول الشهري لإشغال ومواعيد القاعات
            </h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              مسؤول النظام
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            استعراض جدول إشغال القاعات التدريبية والمعامل على مدار الشهر، وتتبع المواعيد المحجوزة وغير المتاحة والفترات الشاغرة
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 shrink-0">
        <!-- زر التحديث -->
        <button
          type="button"
          class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          @click="refreshData"
        >
          <RotateCcw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
          <span>تحديث المواعيد</span>
        </button>

        <!-- زر الذهاب لدليل القاعات -->
        <RouterLink
          to="/admin/halls"
          class="h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
        >
          <Building2 class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>إدارة وتجهيزات القاعات</span>
        </RouterLink>
      </div>
    </div>

    <!-- 2. كروت المؤشرات الإحصائية السريعة للقاعة المحددة (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AppKpiCard
        title="القاعة المحددة حالياً"
        :value="selectedHall?.name || 'اختر قاعة'"
        :badge="selectedHall ? `سعة: ${selectedHall.maxCapacity} مقعد` : '—'"
        badge-class="text-primary-700 dark:text-primary-300 font-bold"
        icon-bg="bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-400"
      >
        <template #icon>
          <Building2 class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="حجوزات الشهر المختار"
        :value="`${monthBookingsCount} موعد تدريبي`"
        :badge="`${monthOccupiedDaysCount} يوماً مشغولاً`"
        badge-class="text-amber-600 dark:text-amber-400 font-bold"
        icon-bg="bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400"
      >
        <template #icon>
          <Clock class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="الأيام المتاحة بالكامل"
        :value="`${monthFreeDaysCount} يوماً متاحاً`"
        badge="جاهزة للحجز"
        badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
        icon-bg="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400"
      >
        <template #icon>
          <CheckCircle2 class="w-5 h-5" />
        </template>
      </AppKpiCard>

      <AppKpiCard
        title="معدل استغلال القاعة بالشهر"
        :value="`${monthUtilizationRate}%`"
        :badge="monthUtilizationLabel"
        :badge-class="monthUtilizationRate > 70 ? 'text-rose-600 font-bold' : 'text-blue-600 font-bold'"
        icon-bg="bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400"
      >
        <template #icon>
          <Layers class="w-5 h-5" />
        </template>
      </AppKpiCard>
    </div>

    <!-- 3. شريط اختيار القاعة التدريبية (Hall Selector Cards) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl space-y-3.5 transition-colors">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
            <Building2 class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
              اختر القاعة أو المعمل لاستعراض جدولها الشهري
            </h2>
            <p class="text-[11px] text-slate-400 font-medium">
              انقر على أي قاعة للتبديل الفوري لجدول إشغالها ومواعيد دوراتها
            </p>
          </div>
        </div>

        <span class="text-xs text-slate-500 font-bold hidden sm:inline-block">
          إجمالي: <strong class="text-slate-800 dark:text-slate-200">{{ hallsList.length }}</strong> قاعة ومعمل
        </span>
      </div>

      <!-- شبكة كروت القاعات للاختيار السريع -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          v-for="hall in hallsList"
          :key="hall.id"
          type="button"
          class="p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden group"
          :class="
            selectedHallId === hall.id
              ? 'bg-primary-50/70 dark:bg-primary-950/50 border-primary-500 ring-2 ring-primary-500/20 shadow-sm'
              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800'
          "
          @click="selectHall(hall.id)"
        >
          <!-- خط تحديد علوي -->
          <div
            v-if="selectedHallId === hall.id"
            class="absolute top-0 right-0 left-0 h-1 bg-primary-600"
          ></div>

          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
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
              <span class="text-[10px] font-mono font-bold text-slate-400">
                #0{{ hall.id }}
              </span>
            </div>

            <h3
              class="text-xs font-black truncate max-w-full font-heading transition-colors"
              :class="selectedHallId === hall.id ? 'text-primary-900 dark:text-primary-100' : 'text-slate-800 dark:text-slate-200'"
              :title="hall.name"
            >
              {{ hall.name }}
            </h3>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
            <span class="flex items-center gap-1 font-mono font-bold">
              <Users class="w-3 h-3 text-slate-400" />
              {{ hall.maxCapacity }} مقعد
            </span>
            <span
              v-if="selectedHallId === hall.id"
              class="text-[10px] font-bold text-primary-700 dark:text-primary-300 flex items-center gap-0.5"
            >
              <CheckCircle2 class="w-3 h-3" />
              محددة
            </span>
            <span v-else class="text-[10px] text-slate-400 group-hover:text-slate-600">
              عرض الجدول
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- 4. محرك التقويم الشهري (Monthly Calendar Controller & Grid) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5 transition-colors">
      <!-- شريط أدوات الشهر والتنقل ودليل الألوان -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <!-- أزرار التنقل بين الأشهر -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="الشهر السابق"
            @click="navigateMonth(-1)"
          >
            <ChevronRight class="w-4 h-4" />
            <span>الشهر السابق</span>
          </button>

          <!-- الشهر والسنة الحالية -->
          <div class="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Calendar class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span class="text-sm font-black text-slate-900 dark:text-slate-100 font-heading">
              {{ currentMonthName }} {{ currentYear }}
            </span>
          </div>

          <button
            type="button"
            class="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="الشهر التالي"
            @click="navigateMonth(1)"
          >
            <span>الشهر التالي</span>
            <ChevronLeft class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="h-9 px-3 rounded-xl bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-bold transition-colors cursor-pointer border border-primary-200/80 dark:border-primary-800"
            @click="goToToday"
          >
            اليوم (الشهر الحالي)
          </button>
        </div>

        <!-- دليل الألوان (Legend) -->
        <div class="flex flex-wrap items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
            <span class="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
            <span>متاحة بالكامل (0 حجز)</span>
          </div>
          <div class="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
            <span class="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
            <span>محجوزة جزئياً (حجز واحد - توجد فترات شاغرة)</span>
          </div>
          <div class="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
            <span class="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
            <span>مشغولة بالكامل (حجزان أو أكثر)</span>
          </div>
        </div>
      </div>

      <!-- مصفوفة أيام الأسبوع والتقويم (7 Columns Matrix) -->
      <div class="overflow-x-auto">
        <div class="min-w-[720px]">
          <!-- ترويسة أيام الأسبوع (السبت -> الجمعة) -->
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div
              v-for="dayName in WEEK_DAY_LABELS"
              :key="dayName"
              class="py-2 px-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 font-heading"
            >
              {{ dayName }}
            </div>
          </div>

          <!-- شبكة خلايا الأيام للشهر -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(day, idx) in calendarMatrix"
              :key="`${day.dateString}-${idx}`"
              class="min-h-[115px] p-2 sm:p-2.5 rounded-2xl border transition-all text-right flex flex-col justify-between gap-1.5 cursor-pointer relative overflow-hidden group"
              :class="[
                // خلفية وحدود الخلية بناءً على الحالة والاختيار
                selectedDateString === day.dateString
                  ? 'ring-2 ring-primary-500 border-primary-500 shadow-md z-10'
                  : 'hover:border-slate-300 dark:hover:border-slate-700',
                day.isCurrentMonth
                  ? day.status === 'free'
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/15 border-slate-200/90 dark:border-slate-800'
                    : day.status === 'partial'
                      ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60'
                      : 'bg-rose-50/30 dark:bg-rose-950/25 border-rose-200/80 dark:border-rose-900/60'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 opacity-40',
              ]"
              @click="selectDay(day)"
            >
              <!-- شريط علوي صغير لتوضيح اليوم الحالي -->
              <div
                v-if="day.isToday"
                class="absolute top-0 right-0 left-0 h-1 bg-primary-600"
              ></div>

              <!-- رأس خلية اليوم: رقم اليوم + بادج الحالة -->
              <div class="flex items-center justify-between">
                <span
                  class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono transition-colors"
                  :class="[
                    day.isToday
                      ? 'bg-primary-600 text-white font-black shadow-xs'
                      : selectedDateString === day.dateString
                        ? 'bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-300'
                        : 'text-slate-800 dark:text-slate-200',
                  ]"
                >
                  {{ day.dayNumber }}
                </span>

                <!-- شارة الحالة التشغيلية المصغرة -->
                <span
                  v-if="day.isCurrentMonth"
                  class="w-2.5 h-2.5 rounded-full shrink-0"
                  :class="[
                    day.status === 'free'
                      ? 'bg-emerald-500'
                      : day.status === 'partial'
                        ? 'bg-amber-500'
                        : 'bg-rose-500',
                  ]"
                  :title="day.status === 'free' ? 'متاحة طوال اليوم' : `محجوزة (${day.bookingsCount} حجز)`"
                ></span>
              </div>

              <!-- قائمة مصغرة بالحجوزات داخل اليوم -->
              <div class="space-y-1 flex-1 overflow-hidden">
                <template v-if="day.bookings.length > 0">
                  <div
                    v-for="booking in day.bookings.slice(0, 2)"
                    :key="booking.id"
                    class="px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate border flex items-center gap-1"
                    :class="[
                      day.status === 'partial'
                        ? 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300/60 dark:border-amber-800/60'
                        : 'bg-rose-100/70 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300/60 dark:border-rose-800/60',
                    ]"
                    :title="`${booking.courseName} (${booking.startTimeFormatted} - ${booking.endTimeFormatted})`"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span class="truncate font-mono">{{ booking.startTimeFormatted }} - {{ booking.endTimeFormatted }}</span>
                    <span class="truncate text-[9px] opacity-80">{{ booking.courseName }}</span>
                  </div>

                  <span
                    v-if="day.bookings.length > 2"
                    class="text-[10px] text-rose-600 dark:text-rose-400 font-bold block"
                  >
                    +{{ day.bookings.length - 2 }} حجز إضافي
                  </span>
                </template>

                <div v-else-if="day.isCurrentMonth" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  متاحة طوال اليوم
                </div>
              </div>

              <!-- مؤشر الفترات الشاغرة السفلي -->
              <div class="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/70 pt-1">
                <span>{{ day.dayLabel }}</span>
                <span v-if="day.bookings.length > 0" class="font-bold text-rose-600 dark:text-rose-400">
                  {{ day.bookings.length }} حجز
                </span>
                <span v-else class="text-emerald-600 dark:text-emerald-400 font-bold">
                  شاغرة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. لوحة تفاصيل اليوم المختار والمواعيد غير المتاحة (Day Unavailability & Slots Drawer/Panel) -->
    <div
      v-if="selectedDay"
      id="dayDetailsSection"
      class="bg-white dark:bg-slate-900 border-2 border-primary-500/40 dark:border-primary-500/30 rounded-3xl p-5 sm:p-7 shadow-lg dark:shadow-2xl space-y-6 transition-all"
    >
      <!-- ترويسة تفاصيل اليوم المختار -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border"
            :class="[
              selectedDay.status === 'free'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : selectedDay.status === 'partial'
                  ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
            ]"
          >
            {{ selectedDay.dayNumber }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-heading">
                تفاصيل إشغال يوم {{ selectedDay.dayLabel }} {{ selectedDay.dayNumber }} {{ currentMonthName }} {{ currentYear }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                :class="[
                  selectedDay.status === 'free'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : selectedDay.status === 'partial'
                      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                ]"
              >
                {{
                  selectedDay.status === 'free'
                    ? 'القاعة متاحة بالكامل'
                    : selectedDay.status === 'partial'
                      ? 'القاعة محجوزة جزئياً'
                      : 'القاعة مشغولة بالكامل'
                }}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              القاعة: <strong class="text-slate-800 dark:text-slate-200">{{ selectedHall?.name }}</strong> — {{ selectedHall?.location }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-500">
            تاريخ اليوم: <strong class="font-mono text-slate-800 dark:text-slate-200">{{ selectedDay.dateString }}</strong>
          </span>
        </div>
      </div>

      <!-- المخطط الزمني البصري للساعات من 07:00 ص إلى 09:00 م -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            المخطط الزمني التشغيلي لليوم (من 07:00 ص حتى 09:00 م):
          </span>
          <span class="text-[11px] text-slate-400">
            الساعات الحمراء = غير متاحة | الساعات الخضراء = متاحة للحجز
          </span>
        </div>

        <!-- شريط البلوكات بالساعات -->
        <div class="grid grid-cols-7 sm:grid-cols-14 gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div
            v-for="h in dayTimelineHours"
            :key="h.hour"
            class="p-2 rounded-xl text-center text-[10px] font-bold border flex flex-col justify-between gap-1 transition-all"
            :class="[
              h.isOccupied
                ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300',
            ]"
            :title="h.isOccupied ? `محجوزة: ${h.booking?.courseName} (${h.rangeLabel})` : `متاحة (${h.rangeLabel})`"
          >
            <span class="font-mono text-[10px] font-black">{{ h.label }}</span>
            <span
              class="px-1 py-0.5 rounded text-[9px]"
              :class="h.isOccupied ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'"
            >
              {{ h.isOccupied ? 'محجوز' : 'شاغر' }}
            </span>
          </div>
        </div>
      </div>

      <!-- القسمان المتقابلان: المواعيد غير المتاحة والمواعيد المتاحة -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <!-- 5.أ: المواعيد غير المتاحة (المحجوزة حالياً) -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-rose-700 dark:text-rose-300 flex items-center gap-2 font-heading">
              <AlertCircle class="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
              <span>المواعيد غير المتاحة في هذا اليوم (المحجوزة)</span>
            </h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {{ selectedDay.bookings.length }} فترات محجوزة
            </span>
          </div>

          <!-- قائمة الكروت الحمراء للحجوزات غير المتاحة -->
          <div v-if="selectedDay.bookings.length > 0" class="space-y-3">
            <div
              v-for="booking in selectedDay.bookings"
              :key="booking.id"
              class="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-800/80 space-y-3 text-right"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white">
                      غير متاح
                    </span>
                    <h4 class="text-sm font-black text-slate-900 dark:text-white font-heading">
                      {{ booking.courseName }}
                    </h4>
                  </div>
                  <p class="text-xs text-rose-700 dark:text-rose-300 font-bold mt-1">
                    الدفعة رقم {{ booking.roundNumber }} (الحالة: {{ booking.status === 'Ongoing' ? 'جارية ومستمرة' : 'متاحة للتسجيل' }})
                  </p>
                </div>

                <div class="text-left shrink-0">
                  <div class="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 font-mono font-black text-rose-700 dark:text-rose-300 text-xs">
                    {{ booking.startTimeFormatted }} — {{ booking.endTimeFormatted }}
                  </div>
                  <span class="text-[11px] text-slate-400 mt-0.5 block text-left">
                    المدة: {{ booking.durationHours }} ساعات
                  </span>
                </div>
              </div>

              <!-- تفاصيل الحجز والمحاضر وتاريخ الدورة الكلي -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2.5 border-t border-rose-200/60 dark:border-rose-800/60 text-slate-600 dark:text-slate-300">
                <div class="flex items-center gap-1.5">
                  <Users class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>المحاضر: <strong>{{ booking.instructorName }}</strong></span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>الفترة الكلية: <strong class="font-mono text-[11px]">{{ booking.startDate }} إلى {{ booking.endDate }}</strong></span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Layers class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>المقاعد المحجوزة: <strong>{{ booking.capacity }} متدرب</strong></span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>أيام الانعقاد: <strong>{{ formatDaysText(booking.lectureDays) }}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1"
          >
            <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">
              لا توجد أي حجوزات في هذا اليوم!
            </p>
            <p class="text-[11px] text-slate-400">
              القاعة متاحة بالكامل طوال ساعات العمل اليومية ويمكن جدولة دورات بها بحرية
            </p>
          </div>
        </div>

        <!-- 5.ب: المواعيد المتاحة والشاغرة في هذا اليوم -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-heading">
              <CheckCircle2 class="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>المواعيد المتاحة والشاغرة في هذا اليوم</span>
            </h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {{ selectedDay.availableSlots.length }} فترات شاغرة
            </span>
          </div>

          <!-- قائمة الكروت الخضراء للفترات المتاحة -->
          <div v-if="selectedDay.availableSlots.length > 0" class="space-y-3">
            <div
              v-for="slot in selectedDay.availableSlots"
              :key="slot.id"
              class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3 text-right"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white">
                    متاح للحجز
                  </span>
                  <h4 class="text-sm font-black text-slate-900 dark:text-white font-heading">
                    {{ slot.label }}
                  </h4>
                </div>
                <p class="text-xs text-emerald-700 dark:text-emerald-300 font-bold mt-1 font-mono">
                  من {{ formatTime12(slot.startTime) }} إلى {{ formatTime12(slot.endTime) }}
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">
                  القاعة جاهزة بكامل طاقتها الاستيعابية ({{ selectedHall?.maxCapacity }} مقعد)
                </p>
              </div>

              <RouterLink
                to="/affairs/all-courses"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              >
                <span>جدولة دفعة</span>
                <ChevronLeft class="w-3.5 h-3.5" />
              </RouterLink>
            </div>
          </div>

          <div
            v-else
            class="p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-dashed border-rose-200 dark:border-rose-800 text-center space-y-1"
          >
            <AlertCircle class="w-8 h-8 text-rose-500 mx-auto mb-1" />
            <p class="text-xs font-bold text-rose-700 dark:text-rose-300">
              لا توجد فترات شاغرة متبقية في هذا اليوم
            </p>
            <p class="text-[11px] text-slate-400">
              القاعة مشغولة في الفترات الصباحية والمسائية بالكامل، يرجى اختيار يوم آخر
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import {
  Building2,
  Calendar,
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Layers,
} from 'lucide-vue-next';

import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import {
  INITIAL_HALLS,
  INITIAL_COURSES,
  INITIAL_INSTRUCTORS,
  INITIAL_COURSE_ROUNDS,
} from '@/components/Affairs/components/AllCourses/helpers/courseMockData';
import {
  ARABIC_MONTH_NAMES,
  DAY_NAMES_MAP,
  getHallMonthCalendar,
  getDayOperationalHours,
  formatTime12Hour,
  formatDateToISO,
} from '@/components/Affairs/components/AllCourses/helpers/hallScheduleHelper';

const route = useRoute();

const WEEK_DAY_LABELS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

// الحالة والبيانات
const isRefreshing = ref(false);
const hallsList = ref([...INITIAL_HALLS]);
const coursesList = ref([...INITIAL_COURSES]);
const instructorsList = ref([...INITIAL_INSTRUCTORS]);
const allRoundsList = ref([]);

// القاعة المحددة
const selectedHallId = ref(1);

// السنة والشهر المحددان (افتراضياً: شهر نوفمبر 2026 تماشياً مع بيانات النظام)
const currentYear = ref(2026);
const currentMonthIndex = ref(10); // 10 = نوفمبر (0-indexed)

// اليوم المختار حالياً للاستعراض
const selectedDateString = ref('');
const selectedDay = ref(null);

const STORAGE_ROUNDS_KEY = 'affairs_course_rounds_v1';

function loadRounds() {
  try {
    const raw = localStorage.getItem(STORAGE_ROUNDS_KEY);
    if (raw) {
      allRoundsList.value = JSON.parse(raw);
      return;
    }
  } catch (e) {
    console.error('Error loading rounds:', e);
  }
  allRoundsList.value = [...INITIAL_COURSE_ROUNDS];
}

// القاعة المحددة كـ Object
const selectedHall = computed(() => {
  return hallsList.value.find((h) => Number(h.id) === Number(selectedHallId.value)) || hallsList.value[0];
});

// اسم الشهر الحالي بالعربية
const currentMonthName = computed(() => {
  return ARABIC_MONTH_NAMES[currentMonthIndex.value] || '';
});

// مصفوفة التقويم الشهري الكاملة للقاعة المحددة
const calendarMatrix = computed(() => {
  return getHallMonthCalendar(
    selectedHallId.value,
    currentYear.value,
    currentMonthIndex.value,
    allRoundsList.value,
    coursesList.value,
    instructorsList.value
  );
});

// مؤشرات إحصائية للشهر المختار للقاعة
const currentMonthDays = computed(() => {
  return calendarMatrix.value.filter((d) => d.isCurrentMonth);
});

const monthBookingsCount = computed(() => {
  return currentMonthDays.value.reduce((sum, d) => sum + d.bookingsCount, 0);
});

const monthOccupiedDaysCount = computed(() => {
  return currentMonthDays.value.filter((d) => d.bookingsCount > 0).length;
});

const monthFreeDaysCount = computed(() => {
  return currentMonthDays.value.filter((d) => d.bookingsCount === 0).length;
});

const monthUtilizationRate = computed(() => {
  const total = currentMonthDays.value.length;
  if (!total) return 0;
  return Math.round((monthOccupiedDaysCount.value / total) * 100);
});

const monthUtilizationLabel = computed(() => {
  const rate = monthUtilizationRate.value;
  if (rate > 70) return 'إشغال مرتفع جداً';
  if (rate > 40) return 'إشغال متوسط';
  return 'إشغال خفيف';
});

// المخطط الزمني التشغيلي بالساعات لليوم المختار
const dayTimelineHours = computed(() => {
  if (!selectedDay.value) return [];
  return getDayOperationalHours(selectedDay.value.bookings || []);
});

// تبديل القاعة
function selectHall(hallId) {
  selectedHallId.value = hallId;
  // تحديث اليوم المختار لليوم الحالي أو أول يوم به حجز
  autoSelectBestDay();
}

// التنقل بين الأشهر
function navigateMonth(offset) {
  let newMonth = currentMonthIndex.value + offset;
  if (newMonth < 0) {
    newMonth = 11;
    currentYear.value -= 1;
  } else if (newMonth > 11) {
    newMonth = 0;
    currentYear.value += 1;
  }
  currentMonthIndex.value = newMonth;
  autoSelectBestDay();
}

function goToToday() {
  const now = new Date();
  // إذا كانت بيانات النظام تعمل بـ 2026 نذهب لنوفمبر 2026
  currentYear.value = 2026;
  currentMonthIndex.value = 10;
  autoSelectBestDay();
}

// اختيار يوم معين
function selectDay(day) {
  selectedDateString.value = day.dateString;
  selectedDay.value = day;
}

// الاختيار التلقائي لأفضل يوم لعرضه في لوحة التفاصيل
function autoSelectBestDay() {
  const days = calendarMatrix.value.filter((d) => d.isCurrentMonth);
  // نفضل اختيار اليوم المحجوز الأول، أو اليوم الحالي
  const busyDay = days.find((d) => d.bookingsCount > 0);
  const target = busyDay || days[0];
  if (target) {
    selectDay(target);
  }
}

function formatTime12(time24) {
  return formatTime12Hour(time24);
}

function formatDaysText(daysArr = []) {
  if (!Array.isArray(daysArr)) return 'غير محدد';
  return daysArr.map((d) => DAY_NAMES_MAP[d] || d).join('، ');
}

function refreshData() {
  isRefreshing.value = true;
  loadRounds();
  setTimeout(() => {
    isRefreshing.value = false;
  }, 400);
}

onMounted(() => {
  loadRounds();

  // فحص إذا كان هناك hallId ممرر عبر الـ Query Params
  if (route.query.hallId) {
    const passedId = parseInt(route.query.hallId, 10);
    if (hallsList.value.some((h) => h.id === passedId)) {
      selectedHallId.value = passedId;
    }
  }

  autoSelectBestDay();
});
</script>
