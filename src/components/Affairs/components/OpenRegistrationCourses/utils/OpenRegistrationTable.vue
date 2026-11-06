<template>
  <div class="overflow-x-auto">
    <table class="w-full text-right text-xs">
      <!-- ترويسة الجدول -->
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold select-none">
          <th class="py-3.5 px-4">#</th>
          <th class="py-3.5 px-4 min-w-[220px]">الدورة التدريبية والدفعة</th>
          <th class="py-3.5 px-4 min-w-[160px]">المحاضر والمكان</th>
          <th class="py-3.5 px-4 min-w-[170px]">حجز المقاعد ونسبة الإشغال</th>
          <th class="py-3.5 px-4 text-center">دفعوا رسمياً</th>
          <th class="py-3.5 px-4 text-center">بانتظار السداد</th>
          <th class="py-3.5 px-4 min-w-[140px]">المواعيد والبدء</th>
          <th class="py-3.5 px-4 text-center">الإجراءات</th>
        </tr>
      </thead>

      <!-- جسم الجدول -->
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
        <tr v-if="rounds.length === 0">
          <td colspan="8" class="py-12 text-center text-slate-400">
            <div class="flex flex-col items-center justify-center gap-2">
              <CalendarCheck class="w-8 h-8 text-slate-300 dark:text-slate-600" />
              <p class="font-bold text-sm text-slate-600 dark:text-slate-400">
                لا توجد دورات مفتوحة للتسجيل مطابقة للبحث
              </p>
              <button
                v-if="isFiltered"
                type="button"
                class="mt-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                @click="$emit('clear-filters')"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>إعادة ضبط الفلاتر</span>
              </button>
            </div>
          </td>
        </tr>

        <tr
          v-for="(round, index) in rounds"
          :key="round.id"
          class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
        >
          <!-- # -->
          <td class="py-3 px-4 font-mono text-slate-400 text-xs">
            {{ index + 1 }}
          </td>

          <!-- اسم الدورة والدفعة -->
          <td class="py-3 px-4">
            <div class="space-y-1">
              <strong class="font-bold text-slate-800 dark:text-slate-100 block text-sm">
                {{ round.courseName }}
              </strong>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold">
                  الدفعة {{ round.roundNumber }}
                </span>
                <span class="font-mono text-slate-400 text-[11px]">
                  {{ round.roundCode }}
                </span>
              </div>
            </div>
          </td>

          <!-- المحاضر والقاعة -->
          <td class="py-3 px-4">
            <div class="space-y-1 text-xs">
              <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <GraduationCap class="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <span class="truncate max-w-[150px]">{{ round.instructor?.name || '—' }}</span>
              </div>
              <div class="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{{ round.hall?.name || '—' }}</span>
              </div>
            </div>
          </td>

          <!-- حجز المقاعد ونسبة الإشغال -->
          <td class="py-3 px-4">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {{ round.enrolledTrainees?.length || 0 }} / {{ round.capacity }} مقعد
                </span>
                <span
                  class="font-mono text-[11px] font-black"
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
              <!-- شريط التقدم -->
              <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  class="h-full bg-emerald-500"
                  :style="{ width: `${getOccupancyRate(round)}%` }"
                ></div>
                <div
                  class="h-full bg-amber-400"
                  :style="{ width: `${getPendingRate(round)}%` }"
                ></div>
              </div>
              <span class="text-[10px] text-slate-500 block">
                متبقي {{ getRemainingSeats(round) }} مقاعد شاغرة
              </span>
            </div>
          </td>

          <!-- دفعوا رسمياً -->
          <td class="py-3 px-4 text-center">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-block">
              {{ round.enrolledTrainees?.length || 0 }} دارساً
            </span>
          </td>

          <!-- بانتظار السداد -->
          <td class="py-3 px-4 text-center">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 inline-block">
              {{ round.pendingPaymentApplicants?.length || 0 }} متقدماً
            </span>
          </td>

          <!-- المواعيد والبدء -->
          <td class="py-3 px-4">
            <div class="space-y-1 text-xs">
              <div class="text-slate-600 dark:text-slate-400">
                <span>غلق التقديم: </span>
                <strong class="font-mono text-slate-800 dark:text-slate-200">
                  {{ formatDate(round.lastApplicationDate) }}
                </strong>
              </div>
              <div class="text-emerald-600 dark:text-emerald-400 font-bold">
                <span>بدء الدورة: </span>
                <span class="font-mono">{{ formatDate(round.startDate) }}</span>
              </div>
            </div>
          </td>

          <!-- الإجراءات -->
          <td class="py-3 px-4 text-center">
            <button
              type="button"
              class="h-8 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              @click="$emit('open-tracking', round)"
            >
              <UserCheck class="w-3.5 h-3.5" />
              <span>متابعة التقديم</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {
  CalendarCheck,
  RotateCcw,
  GraduationCap,
  MapPin,
  UserCheck,
} from 'lucide-vue-next';
import { formatDate } from '../helpers/openRegistrationConstants';

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

function getRemainingSeats(round) {
  const enrolled = round.enrolledTrainees?.length || 0;
  return Math.max(0, (round.capacity || 0) - enrolled);
}
</script>
