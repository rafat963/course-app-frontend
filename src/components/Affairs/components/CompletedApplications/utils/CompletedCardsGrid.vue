<template>
  <div class="space-y-4">
    <div
      v-if="applications.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-4.5"
    >
      <div
        v-for="app in applications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4.5 sm:p-5 shadow-2xs hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/60 transition-all flex flex-col justify-between group"
      >
        <!-- 1. ترويسة الكارت: الصورة والاسم ورقم الطلب وحالة التسجيل -->
        <div>
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-3 min-w-0">
              <!-- الصورة الشخصية -->
              <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-sm sm:text-base shrink-0 overflow-hidden shadow-2xs">
                <img
                  v-if="app.trainee?.profilePhotoPath"
                  :src="app.trainee.profilePhotoPath"
                  alt="صورة المتدرب"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ getInitials(app.trainee?.fullName) }}</span>
              </div>

              <!-- الاسم والكود -->
              <div class="min-w-0">
                <h3
                  class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading truncate leading-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                  :title="app.trainee?.fullName"
                  @click="$emit('open-trainee-details', app)"
                >
                  {{ app.trainee?.fullName }}
                </h3>
                <span class="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                  {{ app.code }}
                </span>
              </div>
            </div>

            <!-- شارة الحالة -->
            <span
              class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shrink-0 shadow-2xs"
              :class="
                app.status === 'Enrolled'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
              "
            >
              {{ app.status === 'Enrolled' ? 'مقيد بالدورة' : 'أتم التدريب' }}
            </span>
          </div>

          <!-- 2. بيانات الدورة ورقم الإيصال ونسبة الحضور -->
          <div class="my-4 space-y-3">
            <!-- اسم الدورة والدفعة -->
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 truncate" :title="app.courseRound?.courseName">
                {{ app.courseRound?.courseName }}
              </span>
              <span class="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60 shrink-0">
                دفعة {{ app.courseRound?.roundNumber || 1 }}
              </span>
            </div>

            <!-- صف المعلومات: الإيصال والمبلغ ونسبة الحضور -->
            <div class="flex items-center justify-between pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800/80">
              <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                <span class="font-mono text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{{ app.receiptNumber || 'REC-88421' }}</span>
                <span>•</span>
                <strong class="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-mono">
                  {{ formatCurrency(app.paidAmount || app.courseRound?.price) }}
                </strong>
              </div>
              <div class="flex items-center gap-1.5 text-xs sm:text-sm">
                <span class="text-slate-400 font-medium">حضور:</span>
                <span class="font-black font-mono text-sm sm:text-base" :class="getAttendanceColor(app.attendanceRate)">
                  {{ app.attendanceRate || 90 }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. أزرار الإجراءات: ملف الدارس + تفاصيل الطلب والإيصال -->
        <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <!-- زر ملف الدارس الأساسي -->
          <button
            type="button"
            class="flex-1 h-10 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            title="عرض ملف وسجل المتدرب الكامل والمستندات"
            @click="$emit('open-trainee-details', app)"
          >
            <UserCheck class="w-4.5 h-4.5" />
            <span>ملف الدارس</span>
          </button>

          <!-- زر تفاصيل الطلب والإيصال والتصريح -->
          <button
            type="button"
            class="flex-1 h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            title="عرض تفاصيل القيد، إيصال الخزينة، وتصريح بوابة المعهد"
            @click="$emit('open-application-details', app)"
          >
            <FileText class="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>الإيصال والتصريح</span>
          </button>
        </div>
      </div>
    </div>

    <!-- الحالة الفارغة -->
    <div
      v-else
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-2 text-slate-400"
    >
      <Inbox class="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
      <p class="text-sm font-bold">لا توجد طلبات مكتملة تطابق الفلترة الحالية</p>
    </div>
  </div>
</template>

<script setup>
import { UserCheck, FileText, Inbox } from 'lucide-vue-next';
import { formatEgyptianCurrency } from '../helpers/completedConstants';

defineProps({
  applications: {
    type: Array,
    required: true,
  },
});

defineEmits(['open-trainee-details', 'open-application-details', 'openTrainee', 'printReceipt', 'viewPass']);

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}

function formatCurrency(val) {
  return formatEgyptianCurrency ? formatEgyptianCurrency(val) : `${val} ج.م`;
}

function getAttendanceColor(rate) {
  const r = rate || 90;
  if (r >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (r >= 75) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}
</script>