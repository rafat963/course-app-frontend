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
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 flex items-center justify-center shrink-0">
            <UserCheck class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                تفاصيل طلب سداد الرسوم
              </h3>
              <span class="font-mono text-xs sm:text-sm font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 px-2.5 py-0.5 rounded-lg border border-primary-200 dark:border-primary-800">
                {{ application.code }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              مراجعة بيانات المتقدم، الدورة، حالة الاستحقاق، ومستندات التحقق
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
        <!-- 1. شريط حالة مهلة السداد -->
        <div
          class="p-4 rounded-2xl border flex items-center justify-between"
          :class="getDueInfo(application.paymentDueDate).badgeClass"
        >
          <div class="flex items-center gap-3">
            <CalendarClock class="w-6 h-6 shrink-0" />
            <div>
              <div class="font-black text-sm sm:text-base">
                {{ getDueInfo(application.paymentDueDate).statusText }}
              </div>
              <div class="text-xs sm:text-sm opacity-90 mt-0.5 font-medium">
                تاريخ الاستحقاق المحدد: {{ formatDateOnly(application.paymentDueDate) }}
              </div>
            </div>
          </div>
          <div class="text-left font-mono text-xs sm:text-sm font-bold">
            رمز السداد: <strong class="text-sm sm:text-base">{{ application.qrToken }}</strong>
          </div>
        </div>

        <!-- 2. كارت بيانات المتدرب الشخصية -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <User class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>بيانات المتقدم الأساسية</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الاسم الكامل:</span>
              <strong class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">{{ application.trainee?.fullName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الرقم القومي:</span>
              <span class="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5 block">{{ application.trainee?.nationalId }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">رقم الهاتف:</span>
              <span class="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5 block">{{ application.trainee?.phone }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">البريد الإلكتروني:</span>
              <span class="font-medium text-sm sm:text-base mt-0.5 block">{{ application.trainee?.email || '—' }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الوظيفة بالبطاقة:</span>
              <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5 block">{{ application.trainee?.occupation || '—' }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">المحافظة والعنوان:</span>
              <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-0.5 block">{{ application.trainee?.governorate }} - {{ application.trainee?.address }}</span>
            </div>
          </div>
        </div>

        <!-- 3. كارت تفاصيل الدورة والرسوم -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <GraduationCap class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>الدورة التدريبية ومواعيد المحاضرات</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">اسم الدورة:</span>
              <strong class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ application.courseRound?.courseName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">المحاضر والقاعة:</span>
              <span class="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-0.5 block">{{ application.courseRound?.instructorName }} • {{ application.courseRound?.hallName }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">تاريخ الانعقاد:</span>
              <span class="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-0.5 block">من {{ formatDateOnly(application.courseRound?.startDate) }} حتى {{ formatDateOnly(application.courseRound?.endDate) }}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">الرسوم المقررة للسداد:</span>
              <span class="text-base sm:text-lg font-black text-primary-700 dark:text-primary-300 font-heading mt-0.5 block">
                {{ formatEgyptianCurrency(application.courseRound?.price) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 4. المرفقات والمستندات -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-1">
            <FileText class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>المستندات المرفقة بالطلب</span>
          </h4>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <a
              v-if="application.qualificationPhotoPath"
              :href="application.qualificationPhotoPath"
              target="_blank"
              class="h-11 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink class="w-4 h-4" />
              <span>شهادة المؤهل الدراسي</span>
            </a>
            <a
              v-if="application.trainee?.categoryProofPhotoPath"
              :href="application.trainee.categoryProofPhotoPath"
              target="_blank"
              class="h-11 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink class="w-4 h-4" />
              <span>كارنيه إثبات الفئة</span>
            </a>
          </div>
        </div>
      </div>

      <!-- أسفل المودال: زر إغلاق فقط لعرض التفاصيل بأمان -->
      <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-end shrink-0">
        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UserCheck,
  X,
  CalendarClock,
  User,
  GraduationCap,
  FileText,
  ExternalLink,
} from 'lucide-vue-next';
import {
  formatDateOnly,
  formatEgyptianCurrency,
  getPaymentDueStatus,
} from '../helpers/pendingPaymentConstants';

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

defineEmits(['close']);

function getDueInfo(dateStr) {
  return getPaymentDueStatus(dateStr);
}
</script>
