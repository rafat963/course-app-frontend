<template>
  <div class="space-y-4">
    <!-- شبكة كروت المحاضرين -->
    <div
      v-if="instructors.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="instructor in instructors"
        :key="instructor.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group space-y-4"
      >
        <!-- الجزء العلوي: الأفاتار، الاسم، الحالة -->
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-base shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                {{ getInstructorInitials(instructor.name) }}
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading leading-tight">
                  {{ instructor.name }}
                </h3>
                <span class="text-xs sm:text-sm text-slate-400 font-mono">
                  كود: INS-{{ String(instructor.id).padStart(3, '0') }}
                </span>
              </div>
            </div>

            <!-- شارة الحالة -->
            <span
              class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shadow-2xs shrink-0"
              :class="
                instructor.isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              "
            >
              {{ instructor.isActive ? 'معتمد ونشط' : 'معطل' }}
            </span>
          </div>

          <!-- شارة التخصص -->
          <div>
            <span class="inline-block px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm">
              {{ instructor.specialty }}
            </span>
          </div>

          <!-- شريط التدريس الجاري إذا وُجد -->
          <div
            v-if="hasOngoingRound(instructor)"
            class="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs sm:text-sm"
          >
            <div class="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold text-xs sm:text-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>يدرّس حالياً بالدفعة:</span>
            </div>
            <strong class="font-mono text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm font-black">
              {{ getOngoingRoundCode(instructor) }}
            </strong>
          </div>

          <!-- بيانات الاتصال السريعة -->
          <div class="space-y-2 text-xs sm:text-sm pt-1.5 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span class="flex items-center gap-1.5 text-slate-400">
                <Phone class="w-4 h-4" />
                <span>رقم الهاتف:</span>
              </span>
              <strong class="font-mono text-slate-800 dark:text-slate-200 dir-ltr text-xs sm:text-sm font-bold">
                {{ instructor.phone }}
              </strong>
            </div>

            <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span class="flex items-center gap-1.5 text-slate-400">
                <Mail class="w-4 h-4" />
                <span>البريد:</span>
              </span>
              <span class="font-mono text-xs sm:text-sm font-medium truncate max-w-[200px]">
                {{ instructor.email || '—' }}
              </span>
            </div>
          </div>
        </div>

        <!-- الجزء السفلي: المؤشرات الرقمية وأزرار الإجراءات -->
        <div class="space-y-3 pt-2">
          <!-- شريط الإحصائيات المصغرة -->
          <div class="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
            <div>
              <span class="text-xs text-slate-500 dark:text-slate-400 block font-bold mb-0.5">الدفعات المسندة</span>
              <strong class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 font-mono">
                {{ instructor.roundsTaught?.length || 0 }} دفعة
              </strong>
            </div>
            <div>
              <span class="text-xs text-slate-500 dark:text-slate-400 block font-bold mb-0.5">إجمالي الخريجين</span>
              <strong class="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {{ calculateTotalGraduates(instructor) }} دارساً
              </strong>
            </div>
          </div>

          <!-- شريط أزرار الإجراءات بأسماء واضحة لجميع العمليات -->
          <div class="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              class="h-10 px-2 sm:px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="عرض السجل الأكاديمي والتفاصيل"
              @click="$emit('open-details', instructor)"
            >
              <Eye class="w-4 h-4 shrink-0" />
              <span>تفاصيل</span>
            </button>

            <button
              type="button"
              class="h-10 px-2 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="تعديل بيانات المحاضر"
              @click="$emit('open-edit', instructor)"
            >
              <Pencil class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>تعديل</span>
            </button>

            <button
              type="button"
              class="h-10 px-2 sm:px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="حذف المحاضر"
              @click="$emit('open-delete', instructor)"
            >
              <Trash2 class="w-4 h-4 shrink-0" />
              <span>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- رسالة الفراغ في حال عدم وجود نتائج مطابقة -->
    <div
      v-else
      class="min-h-[280px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 p-8 text-center space-y-3"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <GraduationCap class="w-6 h-6" />
      </div>
      <div>
        <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200">
          لا يوجد محاضرون مطابقون لخيارات الفلترة
        </h4>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
          جرّب البحث باسم آخر أو إزالة التصفية لعرض المحاضرين المسجلين
        </p>
      </div>
      <button
        v-if="isFiltered"
        type="button"
        class="h-8.5 px-4 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold transition-colors cursor-pointer"
        @click="$emit('clear-filters')"
      >
        مسح خيارات التصفية
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  GraduationCap,
  Phone,
  Mail,
  Star,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-vue-next';
import { getInstructorInitials } from '../helpers/instructorsConstants';

defineProps({
  instructors: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['open-details', 'open-edit', 'open-delete', 'clear-filters']);

function hasOngoingRound(instructor) {
  return (instructor.roundsTaught || []).some((r) => r.status === 'Ongoing');
}

function getOngoingRoundCode(instructor) {
  const ongoing = (instructor.roundsTaught || []).find((r) => r.status === 'Ongoing');
  return ongoing ? `${ongoing.courseName.slice(0, 22)}... (دفعة ${ongoing.roundNumber})` : '—';
}

function calculateTotalGraduates(instructor) {
  return (instructor.roundsTaught || []).reduce(
    (sum, r) => sum + (r.traineesCount || 0),
    0,
  );
}
</script>
