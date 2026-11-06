<template>
  <div
    v-if="isOpen && course"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-2xs">
            <Layers class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                سجل دورات الانعقاد (الدفعات)
              </h3>
              <span class="px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {{ courseRounds.length }} دفعة
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ course.name }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- زر فتح دورة انعقاد جديدة لهذه الدورة -->
          <button
            type="button"
            class="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            @click="$emit('open-create-round', course.id)"
          >
            <CalendarPlus class="w-4.5 h-4.5" />
            <span>فتح دفعة جديدة</span>
          </button>

          <!-- زر الإغلاق -->
          <button
            type="button"
            class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 2. محتوى الجدول -->
      <div class="p-6 space-y-4 max-h-[calc(85vh-130px)] overflow-y-auto">
        <!-- جدول الدفعات -->
        <div v-if="courseRounds.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-xs sm:text-sm text-right">
            <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3.5">رقم الدفعة</th>
                <th class="p-3.5">الحالة (Status)</th>
                <th class="p-3.5">المحاضر والقاعة</th>
                <th class="p-3.5">الفترة الزمنية</th>
                <th class="p-3.5">المواعيد والأيام</th>
                <th class="p-3.5 text-center">المقاعد</th>
                <th class="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr
                v-for="round in courseRounds"
                :key="round.id"
                class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <!-- رقم الدفعة -->
                <td class="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
                  الدفعة رقم {{ round.roundNumber }}
                </td>

                <!-- الحالة -->
                <td class="p-3.5 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
                    :class="getStatusBadge(round.status).class"
                  >
                    <span class="w-2 h-2 rounded-full" :class="getStatusBadge(round.status).dotClass"></span>
                    <span>{{ getStatusBadge(round.status).label }}</span>
                  </span>
                </td>

                <!-- المحاضر والقاعة -->
                <td class="p-3.5">
                  <div class="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {{ round.instructorName }}
                  </div>
                  <div class="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin class="w-3.5 h-3.5 text-primary-500" />
                    <span>{{ round.hallName }}</span>
                  </div>
                </td>

                <!-- الفترة الزمنية -->
                <td class="p-3.5 whitespace-nowrap">
                  <div class="text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm">
                    من {{ formatDate(round.startDate) }}
                  </div>
                  <div class="text-slate-500 dark:text-slate-400 font-mono text-xs mt-0.5">
                    إلى {{ formatDate(round.endDate) }}
                  </div>
                </td>

                <!-- المواعيد والأيام -->
                <td class="p-3.5">
                  <div class="text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm">
                    {{ formatLectureDays(round.lectureDays) }}
                  </div>
                  <div class="text-slate-500 dark:text-slate-400 text-xs font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <Clock class="w-3.5 h-3.5 text-amber-500" />
                    <span>من {{ formatTime12Hour(round.startTime) }} إلى {{ formatTime12Hour(round.endTime) }}</span>
                  </div>
                </td>

                <!-- المقاعد والنسبة -->
                <td class="p-3.5 text-center whitespace-nowrap font-mono">
                  <span class="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                    {{ round.enrolledCount || 0 }}
                  </span>
                  <span class="text-slate-400 text-xs sm:text-sm font-bold"> / {{ round.capacity }}</span>
                </td>

                <!-- زر الإجراءات -->
                <td class="p-3.5 text-center whitespace-nowrap">
                  <button
                    type="button"
                    class="h-9 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                    title="عرض تفاصيل الدفعة والطلاب والتكلفة"
                    @click="$emit('open-round-details', round)"
                  >
                    <FolderCheck class="w-4 h-4" />
                    <span>تفاصيل وسجل الدفعة</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- حالة عدم وجود دفعات مسجلة بعد -->
        <div
          v-else
          class="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
        >
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar class="w-6 h-6" />
          </div>
          <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300">
            لا توجد دورات انعقاد مسجلة لهذه الدورة التدريبية بعد
          </h4>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            يمكنك جدولة وفتح أول دفعة تدريبية الآن وتحديد المحاضر والقاعة والمواعيد الأسبوعية
          </p>
          <button
            type="button"
            class="h-9 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            @click="$emit('open-create-round', course.id)"
          >
            <CalendarPlus class="w-4 h-4" />
            <span>جدولة أول دورة انعقاد</span>
          </button>
        </div>
      </div>

      <!-- 3. أسفل النافذة -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-800/80">
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
  Layers,
  X,
  CalendarPlus,
  MapPin,
  Clock,
  Calendar,
  FolderCheck,
} from 'lucide-vue-next';
import {
  ROUND_STATUS_CONFIG,
  formatDate,
  formatLectureDays,
} from '../helpers/courseConstants';
import { formatTime12Hour } from '../helpers/hallScheduleHelper';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Object,
    default: null,
  },
  allRounds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'open-create-round', 'open-round-details']);

const courseRounds = computed(() => {
  if (!props.course) return [];
  return props.allRounds
    .filter((r) => r.courseId === props.course.id)
    .sort((a, b) => (b.roundNumber || 0) - (a.roundNumber || 0));
});

function getStatusBadge(status) {
  return (
    ROUND_STATUS_CONFIG[status] || {
      label: status || 'متاحة',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
      dotClass: 'bg-slate-400',
    }
  );
}

function handleClose() {
  emit('close');
}
</script>
