<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
      <!-- ترويسة المودال -->
      <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
            <FileCheck2 class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                تفاصيل الطلب والسداد وبطاقة البوابة
              </h3>
              <span class="font-mono text-xs sm:text-sm font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 px-2.5 py-0.5 rounded-lg border border-primary-200 dark:border-primary-800">
                {{ application.code }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              بيانات الدورة، إيصال الخزينة المعتمد، وتصريح الدخول الذكي للبوابة
            </p>
          </div>
        </div>
        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- محتوى التمرير -->
      <div class="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar text-sm">
        <!-- 1. شريط ملخص القيد والدارس -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <div class="w-13 h-13 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              <img
                v-if="application.trainee?.profilePhotoPath"
                :src="application.trainee.profilePhotoPath"
                :alt="application.trainee.fullName"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-base font-bold text-primary-700">
                {{ application.trainee?.fullName?.slice(0, 2) }}
              </span>
            </div>
            <div>
              <h4 class="font-black text-base sm:text-lg text-slate-800 dark:text-slate-100">
                {{ application.trainee?.fullName }}
              </h4>
              <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                الرقم القومي: {{ application.trainee?.nationalId }}
              </div>
            </div>
          </div>

          <span
            class="px-3.5 py-1 rounded-full text-xs sm:text-sm font-black border shadow-2xs"
            :class="getStatusBadge(application.status).class"
          >
            {{ getStatusBadge(application.status).label }}
          </span>
        </div>

        <!-- 2. كارت إيصال السداد المالي بالخزينة -->
        <div class="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3.5">
          <h4 class="font-black text-emerald-800 dark:text-emerald-300 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-emerald-200/60 dark:border-emerald-800/60">
            <Receipt class="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>بيانات إيصال السداد المالي (معتمد)</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">رقم إيصال الخزينة:</span>
              <strong class="font-mono text-base font-black text-slate-800 dark:text-slate-100 mt-0.5 block">
                {{ application.receiptNumber }}
              </strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">المبلغ المسدد:</span>
              <strong class="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 font-heading mt-0.5 block">
                {{ formatEgyptianCurrency(application.paidAmount) }}
              </strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">تاريخ ووقت السداد:</span>
              <span class="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ formatDateTime(application.paymentDate) }}</span>
            </div>
          </div>
        </div>

        <!-- 3. كارت تفاصيل الدورة والقاعة -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <GraduationCap class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>بيانات الدورة التدريبية المقيد بها</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">اسم الدورة:</span>
              <strong class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">{{ application.courseRound?.courseName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">رقم الدفعة / الانعقاد:</span>
              <span class="font-bold text-sm sm:text-base">الدفعة رقم {{ application.courseRound?.roundNumber }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">المحاضر المسؤول:</span>
              <span class="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200">{{ application.courseRound?.instructorName }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">مكان الانعقاد:</span>
              <span class="flex items-center gap-1.5 font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                <Building2 class="w-4 h-4 text-primary-600 shrink-0" />
                <span>{{ application.courseRound?.hallName }}</span>
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">أيام المحاضرات:</span>
              <span class="font-bold text-sm sm:text-base">{{ application.courseRound?.lectureDays?.join('، ') }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">توقيت المحاضرة:</span>
              <span class="font-mono font-bold text-sm sm:text-base">{{ formatTime12Hour(application.courseRound?.startTime) }} - {{ formatTime12Hour(application.courseRound?.endTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 4. كارت تصريح دخول البوابة ونسبة الحضور -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2">
              <QrCode class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              <span>تصريح دخول البوابة وسجل الحضور (Gate Pass)</span>
            </h4>
            <span
              class="px-3 py-1 rounded-full text-xs font-bold border"
              :class="getAttendanceBadge(application.attendanceRate).class"
            >
              {{ getAttendanceBadge(application.attendanceRate).label }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4">
            <!-- شكل بطاقة الـ QR الرقمية -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 shadow-2xs">
              <div class="w-24 h-24 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center p-2 text-white dark:text-slate-900">
                <QrCode class="w-20 h-20" />
              </div>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1.5 font-bold">مسح أمني نشط</span>
            </div>

            <!-- تفاصيل الرمز والحضور -->
            <div class="space-y-2.5 text-slate-700 dark:text-slate-200 flex-1">
              <div>
                <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">رمز تصريح الدخول (QR Token):</span>
                <span class="font-mono font-bold text-sm sm:text-base text-primary-700 dark:text-primary-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-block mt-0.5">
                  {{ application.qrToken }}
                </span>
              </div>
              <div class="text-xs sm:text-sm">
                تم تسجيل حضور <strong class="text-slate-800 dark:text-slate-100 font-bold">{{ application.attendedLecturesCount }}</strong> محاضرة من إجمالي <strong class="text-slate-800 dark:text-slate-100 font-bold">{{ application.totalScheduledLectures }}</strong> محاضرة مجدولة حتى الآن.
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  class="bg-emerald-500 h-full rounded-full transition-all"
                  :style="{ width: `${application.attendanceRate || 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- أسفل المودال -->
      <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق
        </button>

        <button
          type="button"
          class="h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          @click="$emit('switch-to-trainee', application)"
        >
          <User class="w-4 h-4" />
          <span>عرض بيانات وبطاقة الدارس</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FileCheck2,
  X,
  Receipt,
  GraduationCap,
  Building2,
  QrCode,
  User,
} from 'lucide-vue-next';
import {
  COMPLETED_STATUSES,
  formatEgyptianCurrency,
  formatDateTime,
  getAttendanceBadge,
} from '../helpers/completedConstants';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
});

defineEmits(['close', 'switch-to-trainee']);

function getStatusBadge(status) {
  return (
    COMPLETED_STATUSES[status] || {
      label: status || 'مقيد',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}
</script>
