<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="!isSubmitting && $emit('close')"
  >
    <div class="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
      
      <!-- لودر معالجة وتوثيق السداد المالي بالخزينة (Processing Loader Overlay) -->
      <div
        v-if="isSubmitting"
        class="absolute inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex flex-col items-center justify-center gap-4 p-6 animate-fade-in text-center"
      >
        <div class="relative flex items-center justify-center">
          <div class="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-xl shadow-emerald-500/10">
            <Receipt class="w-10 h-10 animate-bounce text-emerald-600 dark:text-emerald-400" />
          </div>
          <div class="absolute -inset-2 rounded-3xl border-3 border-emerald-500/30 border-t-emerald-600 animate-spin"></div>
        </div>

        <div class="space-y-1">
          <h4 class="font-black text-slate-800 dark:text-slate-100 text-lg sm:text-xl font-heading">
            جاري تسجيل السداد المالي بالخزينة...
          </h4>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
            يتم توثيق إيصال التحصيل وقيد الدارس رسمياً في كشف الدورة
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
          <Loader2 class="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
          <span>إصدار الإيصال: {{ receiptNumber }}</span>
        </div>
      </div>

      <!-- 1. ترويسة المودال -->
      <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-50/70 dark:bg-emerald-950/40">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs">
            <Receipt class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              تسجيل إيصال سداد الرسوم
            </h3>
            <p class="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
              إثبات السداد المالي بالخزينة وتحويل الدارس رسمياً إلى حالة «مقيد بالدورة»
            </p>
          </div>
        </div>
        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 2. محتوى المودال -->
      <form class="p-5 space-y-4.5 text-sm" @submit.prevent="handleConfirm">
        <!-- كارت ملخص الدارس والدورة والمبلغ المطلوب -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm">اسم المتدرب:</span>
            <span class="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              {{ application.trainee?.fullName }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm">الدورة التدريبية:</span>
            <span class="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {{ application.courseRound?.courseName }} (دفعة {{ application.courseRound?.roundNumber || 1 }})
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm">كود الطلب المعتمد:</span>
            <span class="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">
              {{ application.code }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-2.5 border-t border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-600 dark:text-slate-300 font-bold text-xs sm:text-sm">الرسوم المقررة للفئة:</span>
            <strong class="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-mono">
              {{ formatEgyptianCurrency(application.courseRound?.price) }}
            </strong>
          </div>
        </div>

        <!-- حقول بيانات السداد المالي -->
        <div class="space-y-3.5 pt-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- رقم الإيصال -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-xs sm:text-sm">
                رقم إيصال الخزينة <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="receiptNumber"
                type="text"
                required
                placeholder="REC-88421"
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <!-- طريقة السداد (PrimeVue Select) -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-xs sm:text-sm">
                طريقة الدفع <span class="text-rose-500">*</span>
              </label>
              <Select
                v-model="paymentMethod"
                :options="paymentMethodOptions"
                option-label="label"
                option-value="value"
                placeholder="اختر طريقة الدفع..."
                class="w-full text-sm font-bold rounded-xl h-11 flex items-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <!-- المبلغ الفعلي المحصل وتاريخ السداد -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-xs sm:text-sm">
                المبلغ المحصل (ج.م) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model.number="paidAmount"
                type="number"
                min="1"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-xs sm:text-sm">
                تاريخ التحصيل <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="paymentDate"
                type="date"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- ملاحظات الخزينة (اختياري) -->
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-xs sm:text-sm">
              ملاحظات التحصيل (اختياري)
            </label>
            <input
              v-model="notes"
              type="text"
              placeholder="مثال: تم السداد بخزينة معهد نظم المعلومات - مبنى الإدارة"
              class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <!-- 3. أزرار التحكم -->
        <div class="pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            :disabled="isSubmitting"
            class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            @click="$emit('close')"
          >
            تراجع
          </button>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
            <CheckCircle2 v-else class="w-5 h-5" />
            <span>{{ isSubmitting ? 'جاري معالجة السداد...' : 'تأكيد تسجيل السداد وقيد الدارس' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Select from 'primevue/select';
import { Receipt, X, CheckCircle2, Loader2 } from 'lucide-vue-next';
import { formatEgyptianCurrency } from '../helpers/pendingPaymentConstants';

const paymentMethodOptions = [
  { label: 'نقدي (خزينة المعهد)', value: 'Cash' },
  { label: 'بطاقة بنكية / فيزا (POS)', value: 'Card' },
  { label: 'تحويل بنكي فوري', value: 'BankTransfer' },
];

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'confirm']);

const isSubmitting = ref(false);
const receiptNumber = ref('');
const paymentMethod = ref('Cash');
const paidAmount = ref(0);
const paymentDate = ref(new Date().toISOString().slice(0, 10));
const notes = ref('');

watch(
  () => props.application,
  (app) => {
    if (app) {
      isSubmitting.value = false;
      receiptNumber.value = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
      paymentMethod.value = 'Cash';
      paidAmount.value = app.courseRound?.price || 0;
      paymentDate.value = new Date().toISOString().slice(0, 10);
      notes.value = '';
    }
  },
  { immediate: true }
);

function handleConfirm() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  // تأخير واقعي لمعالجة السداد المالي (Loader Feedback) قبل فتح إيصال السداد
  setTimeout(() => {
    emit('confirm', {
      applicationId: props.application?.id,
      receiptNumber: receiptNumber.value,
      paymentMethod: paymentMethod.value,
      paidAmount: paidAmount.value,
      paymentDate: paymentDate.value,
      notes: notes.value,
    });
    isSubmitting.value = false;
  }, 950);
}
</script>
