<template>
  <div
    v-if="isOpen && receiptData"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none print:p-0 print:bg-white"
    @click.self="$emit('close')"
  >
    <!-- نافذة العرض على الشاشة (Screen Modal UI) -->
    <div
      class="print:hidden relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in text-right"
      dir="rtl"
    >
      <!-- 1. ترويسة المودال مع أيقونة النجاح -->
      <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-emerald-50/70 dark:bg-emerald-950/40 shrink-0">
        <div class="flex items-center gap-3.5">
          <div class="w-13 h-13 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                تأكيد تسجيل السداد وقيد الدارس
              </h3>
            </div>
            <p class="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1 font-bold">
              تم تحصيل الرسوم وقيد المتدرب رسمياً في الدورة التدريبية
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          title="إغلاق النافذة"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 2. محتوى المودال: تفاصيل الإيصال وبيانات القيد -->
      <div class="p-5 sm:p-6 space-y-4.5 overflow-y-auto custom-scrollbar text-sm">
        <!-- كارت رقم الإيصال الرسمي مع إمكانية النسخ -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-1">
              رقم إيصال الخزينة الرسمي:
            </span>
            <div class="flex items-center gap-2">
              <Receipt class="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <strong class="font-mono text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-wider">
                {{ receiptData.receiptNumber }}
              </strong>
            </div>
          </div>

          <button
            type="button"
            class="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            @click="copyReceiptNumber"
          >
            <Check v-if="copied" class="w-4 h-4 text-emerald-600" />
            <Copy v-else class="w-4 h-4 text-slate-400" />
            <span>{{ copied ? 'تم نسخ الرقم!' : 'نسخ رقم الإيصال' }}</span>
          </button>
        </div>

        <!-- كارت تفاصيل الدارس والعملية المالية -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div class="pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="font-bold text-xs sm:text-sm text-slate-500 dark:text-slate-400">اسم المتدرب:</span>
            <strong class="font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {{ receiptData.traineeName }}
            </strong>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 dark:text-slate-500 block font-bold mb-0.5">الرقم القومي:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                {{ receiptData.nationalId }}
              </span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block font-bold mb-0.5">رقم الهاتف:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                {{ receiptData.phone }}
              </span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block font-bold mb-0.5">الدورة التدريبية:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-200">
                {{ receiptData.courseName }} (دفعة {{ receiptData.roundNumber }})
              </strong>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block font-bold mb-0.5">قاعة المحاضرات:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">
                {{ receiptData.hallName || 'المقر المعتمد' }}
              </span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block font-bold mb-0.5">طريقة الدفع:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">
                {{ getPaymentMethodLabel(receiptData.paymentMethod) }}
              </span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block font-bold mb-0.5">المبلغ المحصل بالخزينة:</span>
              <strong class="font-black text-emerald-600 dark:text-emerald-400 font-mono text-base">
                {{ Number(receiptData.paidAmount || 0).toLocaleString('ar-EG') }} ج.م
              </strong>
            </div>
          </div>

          <!-- توقيت العملية وكود الطلب المعتمد -->
          <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>كود الطلب: <strong class="font-mono text-slate-700 dark:text-slate-300 font-bold">{{ receiptData.applicationCode }}</strong></span>
            <span>تاريخ السداد: <strong class="font-mono text-slate-700 dark:text-slate-300">{{ receiptData.paymentDate }} ({{ receiptData.paymentTime }})</strong></span>
          </div>
        </div>

        <!-- شارة الحالة: مقيد بالدورة رسمياً -->
        <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm">
            <CheckCircle2 class="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>حالة القيد الجديدة: تم قيد الدارس بنجاح في كشف الدورة</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 font-mono">
            Enrolled
          </span>
        </div>
      </div>

      <!-- 3. أسفل المودال: أزرار الطباعة والانتقال والإغلاق -->
      <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-2">
          <!-- زر طباعة إيصال السداد -->
          <button
            type="button"
            class="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="handlePrint"
          >
            <Printer class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>طباعة الإيصال الرسمي</span>
          </button>

          <!-- زر الانتقال إلى الطلبات المكتملة -->
          <RouterLink
            to="/affairs/applications/completed"
            class="h-11 px-4 rounded-xl bg-primary-50 dark:bg-primary-950/70 hover:bg-primary-100 dark:hover:bg-primary-900/80 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="$emit('close')"
          >
            <ArrowRight class="w-4.5 h-4.5" />
            <span>عرض الطلبات المكتملة</span>
          </RouterLink>
        </div>

        <!-- زر الإغلاق والمتابعة -->
        <button
          type="button"
          class="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs hover:shadow flex items-center gap-1.5"
          @click="$emit('close')"
        >
          <Check class="w-4 h-4" />
          <span>تم، إغلاق النافذة</span>
        </button>
      </div>
    </div>

    <!-- 4. قسيمة إيصال السداد المالي الرسمية للطباعة المعتمدة (Official Printable Treasury Receipt Voucher) -->
    <div
      class="official-receipt-print hidden print:block bg-white text-slate-900 font-sans p-8 dir-rtl"
      dir="rtl"
    >
      <!-- ترويسة الإيصال الرسمية الحكومية / العسكرية -->
      <div class="border-b-2 border-slate-900 pb-4 mb-5">
        <div class="flex items-center justify-between">
          <div class="text-right space-y-1">
            <h4 class="font-bold text-xs sm:text-sm text-slate-900">جمهورية مصر العربية</h4>
            <h4 class="font-bold text-xs sm:text-sm text-slate-900">وزارة الدفاع - هيئة التدريب</h4>
            <h3 class="font-black text-sm sm:text-base text-slate-900">معهد اللغات ونظم المعلومات</h3>
            <p class="text-xs text-slate-600 font-bold">إدارة الشئون المالية والخزينة</p>
          </div>

          <div class="flex flex-col items-center">
            <img src="@/assets/logo.png" alt="شعار المعهد" class="w-16 h-16 object-contain mb-1" />
            <h2 class="text-base sm:text-lg font-black tracking-wide border-y border-slate-800 py-0.5 px-3">
              إيصال سداد رسوم وقيد دارس
            </h2>
            <span class="text-[10px] text-slate-600 font-bold mt-0.5">نسخة أصلية معتمدة للخزينة والدارس</span>
          </div>

          <div class="text-left text-xs font-mono space-y-1">
            <div>
              <span class="text-slate-600 font-sans font-bold">رقم الإيصال: </span>
              <strong class="text-sm font-black">{{ receiptData.receiptNumber }}</strong>
            </div>
            <div>
              <span class="text-slate-600 font-sans font-bold">كود الطلب: </span>
              <strong>{{ receiptData.applicationCode }}</strong>
            </div>
            <div>
              <span class="text-slate-600 font-sans font-bold">التاريخ: </span>
              <strong>{{ receiptData.paymentDate }}</strong>
            </div>
            <div>
              <span class="text-slate-600 font-sans font-bold">التوقيت: </span>
              <strong>{{ receiptData.paymentTime }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- جدول بيانات الدارس والقيد المالي -->
      <div class="mb-5 border border-slate-800 rounded-lg overflow-hidden">
        <div class="bg-slate-100 border-b border-slate-800 px-4 py-2 font-black text-xs text-slate-900">
          بيانات المتدرب والدورة التدريبية
        </div>
        <table class="w-full text-xs text-right border-collapse">
          <tbody>
            <tr class="border-b border-slate-300">
              <td class="p-2.5 font-bold bg-slate-50 w-32 border-l border-slate-300">اسم المتدرب:</td>
              <td class="p-2.5 font-black text-sm border-l border-slate-300">{{ receiptData.traineeName }}</td>
              <td class="p-2.5 font-bold bg-slate-50 w-28 border-l border-slate-300">الرقم القومي:</td>
              <td class="p-2.5 font-mono font-bold">{{ receiptData.nationalId }}</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2.5 font-bold bg-slate-50 border-l border-slate-300">الدورة المقيد بها:</td>
              <td class="p-2.5 font-bold border-l border-slate-300">{{ receiptData.courseName }}</td>
              <td class="p-2.5 font-bold bg-slate-50 border-l border-slate-300">رقم الدفعة:</td>
              <td class="p-2.5 font-mono font-bold">الدفعة ({{ receiptData.roundNumber }})</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2.5 font-bold bg-slate-50 border-l border-slate-300">رقم الهاتف:</td>
              <td class="p-2.5 font-mono border-l border-slate-300">{{ receiptData.phone }}</td>
              <td class="p-2.5 font-bold bg-slate-50 border-l border-slate-300">القاعة المخصصة:</td>
              <td class="p-2.5 font-bold">{{ receiptData.hallName || 'المقر الرئيسي للمعهد' }}</td>
            </tr>
            <tr>
              <td class="p-2.5 font-bold bg-slate-50 border-l border-slate-300">حالة القيد بالدورة:</td>
              <td class="p-2.5 font-bold text-emerald-800 border-l border-slate-300">مقيد رسمياً بالدورة (Enrolled)</td>
              <td class="p-2.5 font-bold bg-slate-50 border-l border-slate-300">فئة المتدرب:</td>
              <td class="p-2.5 font-bold">{{ receiptData.category || 'متدرب عام' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- جدول تفاصيل السداد المالي -->
      <div class="mb-5 border border-slate-800 rounded-lg overflow-hidden">
        <div class="bg-slate-100 border-b border-slate-800 px-4 py-2 font-black text-xs text-slate-900">
          تفاصيل السداد المالي وقسيمة الخزينة
        </div>
        <table class="w-full text-xs text-right border-collapse">
          <thead>
            <tr class="border-b border-slate-400 bg-slate-50 font-bold">
              <th class="p-2.5 border-l border-slate-300">بيان البند المالي</th>
              <th class="p-2.5 border-l border-slate-300">طريقة التحصيل</th>
              <th class="p-2.5 border-l border-slate-300">المبلغ بالأرقام</th>
              <th class="p-2.5">المبلغ فقط وقدره بالحروف</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-300">
              <td class="p-2.5 font-bold border-l border-slate-300">
                رسوم التسجيل والالتحاق بدورة: {{ receiptData.courseName }}
              </td>
              <td class="p-2.5 font-bold border-l border-slate-300">
                {{ getPaymentMethodLabel(receiptData.paymentMethod) }}
              </td>
              <td class="p-2.5 font-mono font-black text-sm border-l border-slate-300">
                {{ Number(receiptData.paidAmount || 0).toLocaleString('ar-EG') }} ج.م
              </td>
              <td class="p-2.5 font-bold text-slate-800">
                {{ formatArabicTafqeet(receiptData.paidAmount) }}
              </td>
            </tr>
            <tr class="bg-slate-100 font-bold">
              <td colspan="2" class="p-2.5 text-left border-l border-slate-300">
                إجمالي المبلغ المحصل بالخزينة:
              </td>
              <td class="p-2.5 font-mono font-black text-base border-l border-slate-300">
                {{ Number(receiptData.paidAmount || 0).toLocaleString('ar-EG') }} ج.م
              </td>
              <td class="p-2.5 font-bold text-emerald-900">
                خالص الرسوم ومسدد بالكامل
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ملاحظات إن وجدت -->
      <div v-if="receiptData.notes" class="mb-4 p-2.5 bg-slate-50 border border-slate-300 rounded text-xs">
        <strong class="font-bold">ملاحظات الخزينة: </strong>
        <span>{{ receiptData.notes }}</span>
      </div>

      <!-- توقيعات الاعتماد والأختام الرسمية -->
      <div class="mt-8 pt-4 border-t border-slate-400 grid grid-cols-3 gap-6 text-center text-xs">
        <div>
          <p class="font-bold mb-8 text-slate-800">صراف الخزينة</p>
          <div class="border-b border-dotted border-slate-500 w-36 mx-auto mb-1"></div>
          <span class="text-[10px] text-slate-500">التوقيع والاسم ثلاثي</span>
        </div>

        <div>
          <p class="font-bold mb-8 text-slate-800">مراجعة الحسابات</p>
          <div class="border-b border-dotted border-slate-500 w-36 mx-auto mb-1"></div>
          <span class="text-[10px] text-slate-500">التوقيع والاعتماد</span>
        </div>

        <div>
          <p class="font-bold mb-8 text-slate-800">خاتم الخزينة والشئون المالية</p>
          <div class="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 mx-auto flex items-center justify-center text-[10px] text-slate-400">
            موضع الختم
          </div>
        </div>
      </div>

      <!-- تذييل الإيصال وإشعار الأمان -->
      <div class="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-0.5">
        <p class="font-bold">مستند رسمي معتمد - يُرجى الاحتفاظ بهذا الإيصال وإبرازه لشئون الدارسين عند استلام البطاقة التعريفية والحقيبة التدريبية.</p>
        <p class="font-mono">تم الإصدار إلكترونياً عبر منظومة إدارة الدورات التدريبية والشئون المالية - معهد اللغات</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  X,
  CheckCircle2,
  Receipt,
  Copy,
  Check,
  Printer,
  ArrowRight,
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  receiptData: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

const copied = ref(false);

function copyReceiptNumber() {
  if (!props.receiptData?.receiptNumber) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(props.receiptData.receiptNumber);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  }
}

function getPaymentMethodLabel(method) {
  const map = {
    Cash: 'نقدي (خزينة المعهد)',
    Card: 'بطاقة بنكية / فيزا (POS)',
    BankTransfer: 'تحويل بنكي فوري',
  };
  return map[method] || method || 'نقدي';
}

function handlePrint() {
  window.print();
}

/**
 * دالة تفقيط المبلغ المالي باللغة العربية (Tafqeet)
 * تحول الأرقام إلى نص باللغة العربية المعتمدة
 */
function formatArabicTafqeet(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num <= 0) return 'صفر جنيهاً مصرياً';

  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convertGroup(n) {
    let result = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const t = Math.floor(rem / 10);
    const o = rem % 10;

    if (h > 0) {
      result += hundreds[h];
    }

    if (rem > 0) {
      if (result) result += ' و';
      if (rem < 10) {
        result += ones[rem];
      } else if (rem >= 10 && rem < 20) {
        result += teens[rem - 10];
      } else {
        if (o > 0) {
          result += ones[o] + ' و' + tens[t];
        } else {
          result += tens[t];
        }
      }
    }
    return result;
  }

  let words = '';
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  if (thousands > 0) {
    if (thousands === 1) {
      words += 'ألف';
    } else if (thousands === 2) {
      words += 'ألفان';
    } else if (thousands >= 3 && thousands <= 10) {
      words += convertGroup(thousands) + ' آلاف';
    } else {
      words += convertGroup(thousands) + ' ألفاً';
    }
  }

  if (remainder > 0) {
    if (words) words += ' و';
    words += convertGroup(remainder);
  }

  return `فقط وقدره ${words} جنيهاً مصرياً لا غير`;
}
</script>

<style scoped>
@media print {
  /* تفعيل تطابق الألوان الدقيق للطباعة */
  *,
  *::before,
  *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html,
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }

  /* إخفاء واجهة الموقع بالكامل أثناء الطباعة */
  body * {
    visibility: hidden !important;
  }

  /* إظهار كبسولة الإيصال الرسمي فقط بدقة */
  .official-receipt-print,
  .official-receipt-print * {
    visibility: visible !important;
  }

  .official-receipt-print {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 12mm 15mm !important;
    box-sizing: border-box !important;
    z-index: 2147483647 !important;
    background: #ffffff !important;
    color: #09090b !important;
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
  }
}
</style>
