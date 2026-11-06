<template>
  <div v-if="rounds.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
      <CalendarCheck class="w-8 h-8" />
    </div>
    <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
      لا توجد دورات مفتوحة للتسجيل مطابقة للبحث
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
      جرّب تغيير خيارات التصفية أو مسح نص البحث لعرض الدورات المفتوحة للتسجيل
    </p>
    <button
      v-if="isFiltered"
      type="button"
      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
      @click="$emit('clear-filters')"
    >
      <RotateCcw class="w-3.5 h-3.5" />
      <span>إعادة ضبط الفلاتر</span>
    </button>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div
      v-for="round in rounds"
      :key="round.id"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group space-y-3"
    >
      <!-- شريط علوي ملون يعبر عن حالة الإشغال -->
      <div
        class="absolute top-0 right-0 left-0 h-1.5"
        :class="getTopAccentClass(round)"
      ></div>

      <div>
        <!-- رأس الكارت: اسم الدورة + الدفعة + حالة الحجز -->
        <div class="pb-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <strong
                class="font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg block truncate leading-tight"
                :title="round.courseName"
              >
                {{ round.courseName }}
              </strong>
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
                  دفعة {{ round.roundNumber }}
                </span>
                <span class="text-xs text-slate-400 font-mono">
                  {{ round.roundCode }}
                </span>
              </div>
            </div>

            <!-- بادج حالة المقاعد -->
            <span
              class="px-3 py-1 rounded-full text-xs font-bold border shrink-0 flex items-center gap-1.5"
              :class="getStatusBadgeClass(round)"
            >
              <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(round)"></span>
              <span>{{ getStatusLabel(round) }}</span>
            </span>
          </div>

          <!-- شريط تنبيه آخر موعد للتقديم -->
          <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
            <div class="flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>آخر موعد للتقديم:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {{ formatDate(round.lastApplicationDate) }}
              </strong>
            </div>

            <!-- عداد الأيام المتبقية -->
            <span
              v-if="getDaysLeft(round) !== null"
              class="px-2 py-0.5 rounded-md text-[11px] font-bold"
              :class="
                getDaysLeft(round) <= 3
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              "
            >
              {{ getDaysLeft(round) > 0 ? `متبقي ${getDaysLeft(round)} أيام` : 'اليوم آخر موعد' }}
            </span>
          </div>
        </div>

        <!-- 2. بلوك متابعة حجز المقاعد ونسبة الإشغال (المطلوب في الطلب بدقة) -->
        <div class="p-4 my-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div class="space-y-0.5">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 block">حالة حجز المقاعد:</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
                  {{ round.enrolledTrainees?.length || 0 }}
                </span>
                <span class="text-xs text-slate-500">من أصل</span>
                <span class="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">
                  {{ round.capacity }} مقعد
                </span>
              </div>
            </div>

            <!-- بادج المقاعد المتبقية -->
            <div class="text-left">
              <span
                class="px-2.5 py-1 rounded-xl text-xs font-bold border inline-block"
                :class="
                  getRemainingSeats(round) === 0
                    ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : getRemainingSeats(round) <= 5
                      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                "
              >
                {{ getRemainingSeats(round) === 0 ? 'لا توجد مقاعد شاغرة' : `متبقي ${getRemainingSeats(round)} مقاعد شاغرة` }}
              </span>
            </div>
          </div>

          <!-- شريط تقدم نسبة الإشغال الملون -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-mono font-bold">
              <span class="text-slate-600 dark:text-slate-400 text-[11px]">نسبة الإشغال المؤكدة</span>
              <span
                class="text-xs"
                :class="
                  getOccupancyRate(round) >= 90
                    ? 'text-rose-600 dark:text-rose-400'
                    : getOccupancyRate(round) >= 75
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                "
              >
                {{ getOccupancyRate(round) }}%
              </span>
            </div>

            <div class="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-inner">
              <!-- الجزء المسدد (أخضر) -->
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: `${getOccupancyRate(round)}%` }"
                title="المقيدون والمسددون"
              ></div>
              <!-- الجزء بانتظار السداد (برتقالي) -->
              <div
                class="h-full bg-amber-400 transition-all duration-500"
                :style="{ width: `${getPendingRate(round)}%` }"
                title="بانتظار سداد الرسوم"
              ></div>
            </div>
          </div>

          <!-- تفصيل المقيدين ومن في الانتظار وإجمالي من قدم -->
          <div class="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-center text-xs">
            <!-- 1. سددوا وقيدوا -->
            <div class="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40">
              <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">دفعوا رسمياً</span>
              <strong class="font-mono font-black text-emerald-800 dark:text-emerald-200 text-xs">
                {{ round.enrolledTrainees?.length || 0 }} دارساً
              </strong>
            </div>

            <!-- 2. بانتظار السداد -->
            <div class="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/40">
              <span class="text-[10px] text-amber-700 dark:text-amber-400 font-medium block">بانتظار السداد</span>
              <strong class="font-mono font-black text-amber-800 dark:text-amber-200 text-xs">
                {{ round.pendingPaymentApplicants?.length || 0 }} متقدماً
              </strong>
            </div>

            <!-- 3. إجمالي من قدم -->
            <div class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span class="text-[10px] text-slate-600 dark:text-slate-400 font-medium block">إجمالي من قدم</span>
              <strong class="font-mono font-black text-slate-800 dark:text-slate-200 text-xs">
                {{ getTotalApplicants(round) }} طلباً
              </strong>
            </div>
          </div>
        </div>

        <!-- 3. تفاصيل المحاضر والمكان والمواعيد -->
        <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <!-- المحاضر -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <GraduationCap class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>المحاضر:</span>
            </span>
            <span class="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[190px]">
              {{ round.instructor?.name || 'غير محدد' }}
            </span>
          </div>

          <!-- القاعة -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>المكان:</span>
            </span>
            <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>{{ round.hall?.name || 'غير محدد' }}</span>
              <span
                class="px-2 py-0.2 rounded text-[10px] font-bold border"
                :class="
                  round.hall?.type === 'Lab'
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                "
              >
                {{ round.hall?.type === 'Lab' ? 'معمل' : 'قاعة' }}
              </span>
            </span>
          </div>

          <!-- المواعيد وأيام المحاضرات -->
          <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span class="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Clock class="w-4 h-4 text-amber-500 shrink-0" />
              <span>أيام المحاضرات:</span>
            </span>
            <span class="font-bold text-slate-700 dark:text-slate-300">
              {{ formatLectureDays(round.lectureDays) }}
            </span>
          </div>

          <!-- موعد بدء الدورة -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">انطلاق المحاضرات:</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
              {{ formatDate(round.startDate) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 4. زر الإجراء الرئيسي: متابعة التقديم والدارسين -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
        <button
          type="button"
          class="w-full h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
          title="متابعة تفاصيل من قدم ومن دفع ومن لم يسدد بعد"
          @click="$emit('open-tracking', round)"
        >
          <UserCheck class="w-4 h-4" />
          <span>متابعة التقديم والدارسين ({{ getTotalApplicants(round) }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CalendarCheck,
  RotateCcw,
  Calendar,
  GraduationCap,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-vue-next';
import {
  formatDate,
  formatLectureDays,
  calculateDaysRemaining,
} from '../helpers/openRegistrationConstants';

defineProps({
  rounds: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['open-tracking', 'clear-filters']);

function getTotalApplicants(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  const pending = round.pendingPaymentApplicants?.length || 0;
  return enrolled + pending;
}

function getRemainingSeats(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  return Math.max(0, (round.capacity || 0) - enrolled);
}

function getOccupancyRate(round) {
  if (!round.capacity) return 0;
  const enrolled = round.enrolledTrainees?.length || 0;
  return Math.min(100, Math.round((enrolled / round.capacity) * 100));
}

function getPendingRate(round) {
  if (!round.capacity) return 0;
  const pending = round.pendingPaymentApplicants?.length || 0;
  const enrolled = round.enrolledTrainees?.length || 0;
  const enrolledRate = (enrolled / round.capacity) * 100;
  const pendingRate = (pending / round.capacity) * 100;
  return Math.min(100 - enrolledRate, Math.round(pendingRate));
}

function getDaysLeft(round) {
  return calculateDaysRemaining(round.lastApplicationDate);
}

function getStatusLabel(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  const capacity = round.capacity || 25;
  if (enrolled >= capacity) return 'مكتملة المقاعد';
  if ((enrolled / capacity) >= 0.8) return 'قاربت على الاكتمال';
  return 'متاحة للتسجيل';
}

function getStatusBadgeClass(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  const capacity = round.capacity || 25;
  if (enrolled >= capacity) {
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  }
  if ((enrolled / capacity) >= 0.8) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
}

function getStatusDotClass(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  const capacity = round.capacity || 25;
  if (enrolled >= capacity) return 'bg-rose-500';
  if ((enrolled / capacity) >= 0.8) return 'bg-amber-500 animate-pulse';
  return 'bg-emerald-500 animate-pulse';
}

function getTopAccentClass(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  const capacity = round.capacity || 25;
  if (enrolled >= capacity) return 'bg-rose-500';
  if ((enrolled / capacity) >= 0.8) return 'bg-amber-500';
  return 'bg-emerald-500';
}
</script>
