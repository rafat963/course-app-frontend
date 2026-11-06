<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- ترويسة المودال -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <ClipboardCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                تفاصيل طلب الالتحاق
              </h3>
              <span class="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-lg border border-primary-200 dark:border-primary-800">
                {{ application.applicationCode }}
              </span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">
              تاريخ تقديم الطلب: {{ formatDateDmy(application.createdAt) }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- محتوى المودال -->
      <div class="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
        <!-- 1. شريط الحالة الحالي -->
        <div class="p-3.5 rounded-2xl border flex items-center justify-between gap-3 flex-wrap" :class="statusStyle.boxClass">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" :class="statusStyle.dotClass"></span>
            <span class="font-black text-xs" :class="statusStyle.textClass">
              الحالة الحالية: {{ statusConfig(application.status).label }}
            </span>
          </div>
          <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            آخر تحديث: {{ formatDateDmy(application.updatedAt || application.createdAt) }}
          </span>
        </div>

        <!-- 2. تنبيهات خاصة بالحالة (مرفوض / في انتظار السداد) -->
        <!-- حالة الرفض الرسمية -->
        <div
          v-if="application.status === 'Rejected'"
          class="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-2 text-rose-800 dark:text-rose-200"
        >
          <div class="flex items-center gap-2 font-black text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle class="w-4 h-4" />
            قرار إدارة شؤون الدارسين وسبب الرفض الرسمي:
          </div>
          <p class="text-xs leading-relaxed text-rose-900 dark:text-rose-100 bg-white/70 dark:bg-rose-950/60 p-3 rounded-xl border border-rose-200 dark:border-rose-900 font-medium">
            {{ application.rejectionReason || 'لم يتم تحديد سبب إضافي من قبل الإدارة.' }}
          </p>
          <p class="text-[11px] text-rose-600 dark:text-rose-400">
            يمكنك التواصل مع إدارة شؤون الدارسين بالمعهد أو التقديم على دورة أخرى مطابقة لمؤهلك الدراسي.
          </p>
        </div>

        <!-- حالة في انتظار السداد -->
        <div
          v-if="application.status === 'PendingPayment' || application.status === 'PaymentMissed'"
          class="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-3"
        >
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2 font-black text-xs text-amber-800 dark:text-amber-300">
              <Clock class="w-4 h-4 text-amber-600" />
              تم اعتماد الطلب مبدئياً — بانتظار سداد الرسوم المقررة
            </div>
            <span class="font-black text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
              {{ paymentUrgency?.label }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
            <div>
              <div class="text-[11px] text-slate-400">آخر موعد مسموح للسداد:</div>
              <div class="font-mono font-black text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                {{ formatDateDmy(application.paymentDueDate) }}
              </div>
            </div>
            <div>
              <div class="text-[11px] text-slate-400">الرسوم المستحقة حسب فئتك:</div>
              <div class="font-mono font-black text-sm text-slate-800 dark:text-slate-100 mt-0.5">
                {{ formatCurrency(computedPrice) }}
              </div>
            </div>
          </div>
          <p class="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
            يرجى التوجه إلى خزينة المعهد لتقديم كود الطلب (<strong class="font-mono font-bold">{{ application.applicationCode }}</strong>) وسداد المبلغ المطلوب قبل انتهاء المهلة المحددة لتفادي إلغاء الحجز.
          </p>
        </div>

        <!-- 3. بيانات الدورة والدفعة -->
        <div class="space-y-3">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2">
            <BookOpen class="w-4 h-4 text-primary-600" />
            بيانات الدورة التدريبية والدفعة
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div class="space-y-1">
              <span class="text-slate-400 text-[11px] block">اسم الدورة:</span>
              <span class="font-bold text-slate-800 dark:text-slate-100 block">{{ application.round.courseName }}</span>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[11px] block">مجال التخصص:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 block">{{ application.round.courseDomain }}</span>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[11px] block">كود الدفعة ورقمها:</span>
              <span class="font-mono font-bold text-primary-600 dark:text-primary-400 block">
                {{ application.round.roundCode }} (الدفعة {{ application.round.roundNumber }})
              </span>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[11px] block">المحاضر المسؤول:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 block">{{ application.round.instructor.name }}</span>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[11px] block">قاعة المحاضرات ومقرها:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 block">
                {{ application.round.hall.name }} — {{ application.round.hall.location }}
              </span>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[11px] block">فترة الانعقاد والمواعيد:</span>
              <span class="font-mono text-slate-700 dark:text-slate-200 block">
                {{ formatDateDmy(application.round.startDate) }} → {{ formatDateDmy(application.round.endDate) }}
              </span>
            </div>
            <div class="sm:col-span-2 space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700">
              <span class="text-slate-400 text-[11px] block">الأيام والتوقيت الأسبوعي:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 block">
                {{ formatLectureDays(application.round.lectureDays) }} • {{ formatTimeRange(application.round.startTime, application.round.endTime) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 4. التسعير وتفاصيل السداد -->
        <div class="space-y-3">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2">
            <Coins class="w-4 h-4 text-primary-600" />
            التسعير حسب فئة المتدرب (CoursePricings)
          </h4>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500 dark:text-slate-400">فئة المتدرب المسجلة:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">
                {{ CATEGORY_CONFIG[traineeCategory]?.label || traineeCategory }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-center">
              <div
                v-for="(price, cat) in application.round.pricings"
                :key="cat"
                class="p-2 rounded-xl border text-[11px]"
                :class="cat === traineeCategory ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-300 dark:border-primary-700 text-primary-800 dark:text-primary-300 font-black' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'"
              >
                <div class="text-[10px] text-slate-400 truncate">{{ CATEGORY_CONFIG[cat]?.label || cat }}</div>
                <div class="font-mono mt-0.5 font-bold">{{ formatCurrency(price) }}</div>
                <div v-if="cat === traineeCategory" class="text-[9px] text-primary-600 dark:text-primary-400 mt-0.5">فئتك المعتمدة ✓</div>
              </div>
            </div>

            <div v-if="application.paidAmount" class="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span class="text-emerald-700 dark:text-emerald-400 font-bold">المبلغ المسدد بالفعل:</span>
              <div class="text-start">
                <span class="font-mono font-black text-emerald-700 dark:text-emerald-300">{{ formatCurrency(application.paidAmount) }}</span>
                <span class="text-[11px] text-slate-400 block font-mono">رقم الإيصال: {{ application.receiptNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. مسار وسجل تدقيق الطلب (Audit Trail) -->
        <div class="space-y-3">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2">
            <History class="w-4 h-4 text-primary-600" />
            سجل المراحل والمتابعة
          </h4>
          <div class="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-slate-700 dark:text-slate-200 text-xs">تقديم الطلب إلكترونياً</div>
                <div class="text-[11px] text-slate-400">بتاريخ {{ formatDateDmy(application.createdAt) }} — تسجيل الرغبة ورفع الوثائق</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                :class="application.status !== 'UnderReview' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 animate-pulse'"
              >
                <Check v-if="application.status !== 'UnderReview'" class="w-3.5 h-3.5" />
                <Clock v-else class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-slate-700 dark:text-slate-200 text-xs">مراجعة إدارة شؤون الدارسين</div>
                <div class="text-[11px] text-slate-400">
                  {{ application.status === 'UnderReview' ? 'قيد التدقيق الأكاديمي والإداري حالياً' : 'تمت المراجعة والبت في الطلب' }}
                </div>
              </div>
            </div>

            <div v-if="application.status === 'Rejected'" class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <X class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-rose-700 dark:text-rose-300 text-xs">رفض الطلب</div>
                <div class="text-[11px] text-rose-600 dark:text-rose-400">تم رفض الطلب لعدم استيفاء الشروط المحددة</div>
              </div>
            </div>

            <div v-if="application.status === 'PendingPayment' || application.status === 'Enrolled' || application.status === 'CourseEnded'" class="flex items-start gap-3">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                :class="application.paidAmount ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'"
              >
                <Check v-if="application.paidAmount" class="w-3.5 h-3.5" />
                <Clock v-else class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-slate-700 dark:text-slate-200 text-xs">سداد الرسوم بالخزينة</div>
                <div class="text-[11px] text-slate-400">
                  {{ application.paidAmount ? `تم السداد بنجاح بإيصال ${application.receiptNumber}` : 'بانتظار سداد الرسوم قبل انتهاء المهلة' }}
                </div>
              </div>
            </div>

            <div v-if="application.status === 'Enrolled' || application.status === 'CourseEnded'" class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-slate-700 dark:text-slate-200 text-xs">القيد بالدورة وإصدار تصريح الدخول QR</div>
                <div class="text-[11px] text-slate-400">تم تفعيل التصريح الأمني على بوابات المعهد</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- تذييل المودال -->
      <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          class="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق النافذة
        </button>

        <div class="flex items-center gap-2">
          <RouterLink
            v-if="application.status === 'Enrolled'"
            to="/trainee/passes"
            class="h-9 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            @click="$emit('close')"
          >
            <QrCode class="w-3.5 h-3.5" />
            <span>عرض تصريح الدخول</span>
          </RouterLink>

          <RouterLink
            v-if="application.status === 'CourseEnded' && application.isCertificateIssued"
            to="/trainee/certificates"
            class="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            @click="$emit('close')"
          >
            <Award class="w-3.5 h-3.5" />
            <span>عرض الشهادة المعتمدة</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  ClipboardCheck,
  X,
  BookOpen,
  Coins,
  Clock,
  AlertCircle,
  History,
  Check,
  QrCode,
  Award,
} from 'lucide-vue-next';
import {
  getStatusConfig,
  formatDateDmy,
  formatTimeRange,
  getPaymentUrgency,
} from '../../helpers/traineePortalHelpers';
import { formatLectureDays, CATEGORY_CONFIG } from '../../helpers/availableCoursesHelpers';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
  traineeCategory: {
    type: String,
    default: 'Civilian',
  },
});

defineEmits(['close']);

const statusConfig = (status) => getStatusConfig(status);

const paymentUrgency = computed(() => {
  if (!props.application?.paymentDueDate) return null;
  return getPaymentUrgency(props.application.paymentDueDate);
});

const computedPrice = computed(() => {
  if (!props.application?.round?.pricings) return 0;
  return (
    props.application.round.pricings[props.traineeCategory] ??
    props.application.round.pricings.Civilian ??
    0
  );
});

function formatCurrency(val) {
  return `${Number(val || 0).toLocaleString('ar-EG')} ج.م`;
}

const statusStyle = computed(() => {
  const status = props.application?.status;
  if (status === 'UnderReview') {
    return {
      boxClass: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      textClass: 'text-blue-800 dark:text-blue-300',
      dotClass: 'bg-blue-500',
    };
  }
  if (status === 'PendingPayment') {
    return {
      boxClass: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      textClass: 'text-amber-800 dark:text-amber-300',
      dotClass: 'bg-amber-500',
    };
  }
  if (status === 'Rejected') {
    return {
      boxClass: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
      textClass: 'text-rose-800 dark:text-rose-300',
      dotClass: 'bg-rose-500',
    };
  }
  if (status === 'Enrolled') {
    return {
      boxClass: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
      textClass: 'text-emerald-800 dark:text-emerald-300',
      dotClass: 'bg-emerald-500',
    };
  }
  return {
    boxClass: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
    textClass: 'text-slate-800 dark:text-slate-300',
    dotClass: 'bg-slate-500',
  };
});
</script>