<template>
  <div
    v-if="isOpen && instructor"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl h-[680px] max-h-[92vh] overflow-hidden flex flex-col animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة الموحدة مع الوضع الليلي -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-base shrink-0 shadow-2xs">
            {{ getInstructorInitials(instructor.name) }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {{ instructor.name }}
              </h3>
              <span
                class="px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold border shadow-2xs"
                :class="
                  instructor.isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
                "
              >
                {{ instructor.isActive ? 'عضو هيئة تدريس معتمد' : 'معطل مؤقتاً' }}
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ instructor.specialty }} — كود المحاضر: INS-{{ String(instructor.id).padStart(3, '0') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- زر طباعة السيرة والسجل -->
          <button
            type="button"
            class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            @click="handlePrint"
          >
            <Printer class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span class="hidden sm:inline">طباعة السجل</span>
          </button>

          <!-- زر الإغلاق -->
          <button
            type="button"
            class="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            @click="handleClose"
          >
            <X class="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <!-- 2. بطاقة المؤشرات التراكمية وسجل الاتصال (ثابتة في الأعلى) -->
      <div class="p-6 pb-2 space-y-3 shrink-0">
        <!-- بيانات التواصل السريعة -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-slate-400" />
            <span class="text-slate-500 dark:text-slate-400 font-medium">الهاتف:</span>
            <strong class="font-mono text-slate-800 dark:text-slate-200 dir-ltr font-bold">
              {{ instructor.phone }}
            </strong>
          </div>

          <div class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-slate-400" />
            <span class="text-slate-500 dark:text-slate-400 font-medium">البريد:</span>
            <span class="font-mono text-slate-700 dark:text-slate-300 font-bold">
              {{ instructor.email || '—' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <Layers class="w-4 h-4 text-slate-400" />
            <span class="text-slate-500 dark:text-slate-400 font-medium">إجمالي الدفعات:</span>
            <strong class="font-mono text-slate-800 dark:text-slate-200 font-bold">
              {{ instructor.roundsTaught?.length || 0 }} دفعة
            </strong>
          </div>
        </div>

        <!-- شبكة المؤشرات الرقمية المصغرة -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div class="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">إجمالي الدفعات المسندة:</span>
            <div class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-mono">
              {{ instructor.roundsTaught?.length || 0 }} دفعات
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الدفعات الجارية حالياً:</span>
            <div class="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {{ activeRoundsCount }} دفعات
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">إجمالي الخريجين:</span>
            <div class="text-sm sm:text-base font-black text-primary-600 dark:text-primary-400 font-mono">
              {{ totalGraduates }} دارساً
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">متوسط الحضور بالدفعات:</span>
            <div class="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">
              {{ averageAttendance }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 3. جدول سجل الدورات والدفعات المسندة للمحاضر مباشرة بدون تابات -->
      <div class="px-6 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2 font-black text-sm text-slate-800 dark:text-slate-100 font-heading">
          <Layers class="w-4.5 h-4.5 text-primary-600" />
          <span>سجل الدورات والدفعات التدريبية المسندة ({{ instructor.roundsTaught?.length || 0 }})</span>
        </div>
        <span class="text-xs text-slate-400 font-mono">
          {{ activeRoundsCount }} جارية ومتاحة للتسجيل
        </span>
      </div>

      <!-- 4. محتوى الجدول مع تثبيت الارتفاع لمنع أي قفز بصري -->
      <div class="p-6 pt-4 flex-1 min-h-0 overflow-y-auto space-y-4 text-xs sm:text-sm">
        <div v-if="(instructor.roundsTaught || []).length > 0" class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-xs sm:text-sm text-right">
            <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3.5">الدورة التدريبية والدفعة</th>
                <th class="p-3.5">مقر وقاعة الانعقاد</th>
                <th class="p-3.5">فترة الانعقاد</th>
                <th class="p-3.5 text-center">الدارسون</th>
                <th class="p-3.5 text-center">متوسط الحضور</th>
                <th class="p-3.5 text-center">حالة الدفعة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr
                v-for="r in instructor.roundsTaught"
                :key="r.id"
                class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <!-- الدورة ورقم الدفعة -->
                <td class="p-3.5">
                  <strong class="text-slate-800 dark:text-slate-100 block font-bold text-sm">
                    {{ r.courseName }}
                  </strong>
                  <span class="text-xs text-slate-400 font-mono">
                    الدفعة رقم {{ r.roundNumber }} ({{ r.roundCode }})
                  </span>
                </td>

                <!-- القاعة -->
                <td class="p-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                  <div class="flex items-center gap-1.5">
                    <MapPin class="w-4 h-4 text-primary-600 shrink-0" />
                    <span>{{ r.hallName }}</span>
                  </div>
                </td>

                <!-- الفترة -->
                <td class="p-3.5 whitespace-nowrap font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bold">
                  من {{ formatDate(r.startDate) }} إلى {{ formatDate(r.endDate) }}
                </td>

                <!-- الدارسون -->
                <td class="p-3.5 text-center whitespace-nowrap">
                  <strong class="font-mono text-slate-800 dark:text-slate-200 font-black text-sm sm:text-base">
                    {{ r.traineesCount }}
                  </strong>
                  <span class="text-xs text-slate-400 mr-1 font-bold">دارساً</span>
                </td>

                <!-- الحضور -->
                <td class="p-3.5 text-center whitespace-nowrap font-mono font-black text-sm sm:text-base">
                  <span
                    :class="
                      r.averageAttendance >= 95
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-300'
                    "
                  >
                    {{ r.averageAttendance > 0 ? r.averageAttendance + '%' : '—' }}
                  </span>
                </td>

                <!-- الحالة -->
                <td class="p-3.5 text-center whitespace-nowrap">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold border"
                    :class="ROUND_STATUS_CONFIG[r.status]?.class || 'bg-slate-100 text-slate-600'"
                  >
                    {{ ROUND_STATUS_CONFIG[r.status]?.label || r.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else
          class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold text-sm"
        >
          لا توجد دورات تدريبية مسندة لهذا المحاضر حتى الآن.
        </div>
      </div>

      <!-- 5. الشريط السفلي الموحد -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <button
          type="button"
          class="h-11 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          @click="$emit('open-edit', instructor)"
        >
          <Pencil class="w-4 h-4" />
          <span>تعديل بيانات المحاضر</span>
        </button>

        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          @click="handleClose"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  X,
  Printer,
  Phone,
  Mail,
  Layers,
  MapPin,
  Pencil,
} from 'lucide-vue-next';
import {
  formatDate,
  getInstructorInitials,
  ROUND_STATUS_CONFIG,
} from '../helpers/instructorsConstants';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  instructor: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'open-edit']);

const activeRoundsCount = computed(() => {
  return (props.instructor?.roundsTaught || []).filter(
    (r) => r.status === 'Ongoing' || r.status === 'Available',
  ).length;
});

const totalGraduates = computed(() => {
  return (props.instructor?.roundsTaught || []).reduce(
    (sum, r) => sum + (r.traineesCount || 0),
    0,
  );
});

const averageAttendance = computed(() => {
  const rounds = (props.instructor?.roundsTaught || []).filter((r) => r.averageAttendance > 0);
  if (rounds.length === 0) return 96;
  const total = rounds.reduce((sum, r) => sum + r.averageAttendance, 0);
  return Math.round(total / rounds.length);
});

function handleClose() {
  emit('close');
}

function handlePrint() {
  window.print();
}
</script>
