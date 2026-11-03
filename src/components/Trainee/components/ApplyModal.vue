<template>
  <!-- مودال التقديم في الدورة - متعدد الخطوات -->
  <div
    v-if="isOpen && round"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- رأس المودال -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center border"
            :class="stepIconClass"
          >
            <component :is="stepIcon" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">{{ stepTitle }}</h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ stepSubtitle }}</p>
          </div>
        </div>
        <button
          v-if="step < 3"
          type="button"
          class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          @click="handleClose"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- شريط تقدم الخطوات -->
      <div class="flex items-center gap-0 px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shrink-0">
        <div
          v-for="(s, i) in steps"
          :key="i"
          class="flex items-center flex-1"
        >
          <div class="flex items-center gap-1.5 flex-1">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border transition-all"
              :class="
                i + 1 < step
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : i + 1 === step
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              "
            >
              <CheckCircle v-if="i + 1 < step" class="w-3.5 h-3.5" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span
              class="text-[11px] font-bold hidden sm:block"
              :class="i + 1 === step ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'"
            >
              {{ s }}
            </span>
          </div>
          <div v-if="i < steps.length - 1" class="h-0.5 flex-1 mx-1 rounded-full" :class="i + 1 < step ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'" />
        </div>
      </div>

      <!-- محتوى الخطوات -->
      <div class="p-5 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)] custom-scrollbar">

        <!-- ============================================================
             الخطوة 1: تأكيد بيانات المتدرب ورفع الملف
             ============================================================ -->
        <template v-if="step === 1">
          <!-- ملخص الدورة المختارة -->
          <div class="p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 space-y-1.5">
            <div class="text-[11px] font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
              <BookOpen class="w-3.5 h-3.5" />
              الدورة المختارة للتقديم
            </div>
            <div class="text-xs font-black text-slate-800 dark:text-slate-100">{{ round.courseName }}</div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>الدفعة {{ round.roundNumber }} • {{ round.roundCode }}</span>
              <span>•</span>
              <span>{{ formatDateAr(round.startDate) }}</span>
              <span>•</span>
              <span class="font-bold text-emerald-700 dark:text-emerald-400">{{ formatPrice(myPrice) }}</span>
            </div>
          </div>

          <!-- بيانات المتدرب -->
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 mb-2.5">
              <User class="w-3.5 h-3.5 text-slate-400" />
              بياناتك الشخصية (مسجلة بالمنظومة)
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">الاسم الكامل</div>
                <div class="font-bold text-slate-800 dark:text-slate-100">{{ traineeProfile.fullName }}</div>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">الرقم القومي</div>
                <div class="font-mono font-bold text-slate-800 dark:text-slate-100">{{ traineeProfile.nationalId }}</div>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">الفئة</div>
                <div class="font-bold text-slate-800 dark:text-slate-100">{{ CATEGORY_CONFIG[traineeProfile.category]?.labelFull || traineeProfile.category }}</div>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">رقم الهاتف</div>
                <div class="font-mono font-bold text-slate-800 dark:text-slate-100">{{ traineeProfile.phone }}</div>
              </div>
            </div>
          </div>

          <!-- رفع صورة شهادة المؤهل -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Upload class="w-3.5 h-3.5 text-slate-400" />
                صورة شهادة المؤهل الدراسي
                <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400">QualificationPhotoPath</span>
            </div>

            <!-- منطقة رفع الملف -->
            <div
              class="border-2 border-dashed rounded-2xl p-5 text-center transition-colors cursor-pointer"
              :class="
                qualificationFile
                  ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 bg-slate-50/50 dark:bg-slate-800/30'
              "
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*,.pdf"
                class="hidden"
                @change="handleFileChange"
              />

              <div v-if="qualificationFile" class="space-y-2">
                <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto">
                  <FileCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">{{ qualificationFile.name }}</div>
                <div class="text-[11px] text-slate-400">{{ formatFileSize(qualificationFile.size) }}</div>
                <button
                  type="button"
                  class="text-[11px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                  @click.stop="qualificationFile = null"
                >
                  إزالة الملف
                </button>
              </div>

              <div v-else class="space-y-2">
                <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                  <Upload class="w-5 h-5 text-slate-400" />
                </div>
                <div class="text-xs text-slate-600 dark:text-slate-300 font-bold">
                  اسحب الملف هنا أو اضغط للرفع
                </div>
                <div class="text-[11px] text-slate-400">صورة / PDF • الحد الأقصى 5 ميجا</div>
              </div>
            </div>

            <p v-if="showFileError" class="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              يرجى رفع صورة شهادة المؤهل الدراسي لإتمام التقديم
            </p>
          </div>
        </template>

        <!-- ============================================================
             الخطوة 2: جاري تسجيل الطلب...
             ============================================================ -->
        <template v-if="step === 2">
          <div class="py-8 text-center space-y-5">
            <div class="relative w-16 h-16 mx-auto">
              <div class="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 animate-spin" />
              <div class="absolute inset-0 flex items-center justify-center">
                <Send class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="space-y-1.5">
              <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">جاري تسجيل طلبك...</h4>
              <div class="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div v-for="(msg, i) in submittingMessages" :key="i" class="flex items-center justify-center gap-1.5">
                  <CheckCircle class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{{ msg }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ============================================================
             الخطوة 3: نجاح التقديم + كود الطلب
             ============================================================ -->
        <template v-if="step === 3">
          <div class="py-4 text-center space-y-5">
            <!-- أيقونة النجاح -->
            <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
              <CheckCircle2 class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div class="space-y-1">
              <h4 class="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
                تم إرسال طلبك بنجاح! 🎉
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                سيتم مراجعة طلبك من قِبل شؤون الدارسين وإخطارك بالنتيجة
              </p>
            </div>

            <!-- كود الطلب -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="text-[11px] text-slate-400 font-bold">كود طلبك المرجعي (ApplicationCode)</div>
              <div class="text-2xl font-black font-mono text-primary-700 dark:text-primary-400 tracking-widest">
                {{ generatedCode }}
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                قيد المراجعة لدى شؤون الدارسين
              </span>
            </div>

            <!-- ملاحظات ما بعد التقديم -->
            <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-start space-y-1.5">
              <div class="text-[11px] font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Bell class="w-3.5 h-3.5" />
                ملاحظات مهمة
              </div>
              <ul class="space-y-1 text-[11px] text-amber-700 dark:text-amber-400">
                <li class="flex items-start gap-1.5">
                  <span class="font-bold mt-0.5">•</span>
                  <span>احتفظ بكود الطلب <strong>{{ generatedCode }}</strong> للمتابعة</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="font-bold mt-0.5">•</span>
                  <span>ستحتاج لسداد الرسوم ({{ formatPrice(myPrice) }}) بعد الموافقة</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="font-bold mt-0.5">•</span>
                  <span>تابع حالة طلبك من صفحة "طلباتي وتصاريح الدخول"</span>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>

      <!-- أزرار الإجراءات -->
      <div class="flex items-center gap-2.5 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <!-- الخطوة 1: تأكيد وإرسال -->
        <template v-if="step === 1">
          <button
            type="button"
            class="flex-1 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            @click="handleSubmit"
          >
            <Send class="w-3.5 h-3.5" />
            تأكيد وإرسال الطلب
          </button>
          <button
            type="button"
            class="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            @click="handleClose"
          >
            إلغاء
          </button>
        </template>

        <!-- الخطوة 3: إغلاق -->
        <template v-if="step === 3">
          <button
            type="button"
            class="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            @click="handleClose"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            إغلاق وعرض طلباتي
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  X,
  BookOpen,
  User,
  Upload,
  FileCheck,
  AlertCircle,
  Send,
  CheckCircle,
  CheckCircle2,
  Bell,
  Lock,
  ClipboardList,
  PartyPopper,
} from 'lucide-vue-next';
import {
  formatDateAr,
  formatPrice,
  getPriceByCategory,
  generateApplicationCode,
  generateQRToken,
  CATEGORY_CONFIG,
} from '../helpers/availableCoursesHelpers';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Object,
    default: null,
  },
  traineeProfile: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'submitted']);

// --- الحالة الداخلية ---
const step = ref(1); // 1=تأكيد، 2=جاري الإرسال، 3=نجاح
const qualificationFile = ref(null);
const showFileError = ref(false);
const fileInputRef = ref(null);
const generatedCode = ref('');

const submittingMessages = ref([]);

/** خطوات شريط التقدم */
const steps = ['تأكيد البيانات', 'إرسال الطلب', 'تم بنجاح'];

/** سعر الفئة الحالية */
const myPrice = computed(() =>
  getPriceByCategory(props.round?.pricings, props.traineeProfile?.category)
);

/** رأس الخطوة الحالية */
const stepTitle = computed(() => {
  if (step.value === 1) return 'تأكيد التقديم على الدورة';
  if (step.value === 2) return 'جاري تسجيل الطلب...';
  return 'تم تسجيل طلبك بنجاح';
});

const stepSubtitle = computed(() => {
  if (step.value === 1) return 'راجع بياناتك وارفع صورة المؤهل الدراسي';
  if (step.value === 2) return 'يرجى الانتظار، جاري المعالجة';
  return 'قيد المراجعة لدى شؤون الدارسين';
});

const stepIcon = computed(() => {
  if (step.value === 1) return ClipboardList;
  if (step.value === 2) return Send;
  return CheckCircle2;
});

const stepIconClass = computed(() => {
  if (step.value === 3)
    return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700';
  return 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700';
});

// --- إجراءات الملف ---
function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (file) {
    qualificationFile.value = file;
    showFileError.value = false;
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files?.[0];
  if (file) {
    qualificationFile.value = file;
    showFileError.value = false;
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// --- منطق الإرسال ---
async function handleSubmit() {
  if (!qualificationFile.value) {
    showFileError.value = true;
    return;
  }

  // الانتقال إلى الخطوة 2
  step.value = 2;
  submittingMessages.value = [];

  // محاكاة رفع الملف والمعالجة
  await sleep(400);
  submittingMessages.value.push('تم رفع صورة المؤهل الدراسي بنجاح ✓');

  await sleep(500);
  const code = generateApplicationCode();
  generatedCode.value = code;
  submittingMessages.value.push(`تم إنشاء كود الطلب: ${code} ✓`);

  await sleep(400);
  const qrToken = generateQRToken();
  submittingMessages.value.push('تم توليد رمز QR Token آمن ✓');

  await sleep(400);
  submittingMessages.value.push('تم تسجيل الطلب بحالة "قيد المراجعة" ✓');

  await sleep(400);
  submittingMessages.value.push('تم تسجيل حركة AuditLog للطلب ✓');

  await sleep(400);
  submittingMessages.value.push('تم إشعار شؤون الدارسين بطلبك الجديد ✓');

  await sleep(300);

  // إطلاق حدث الإرسال الناجح مع بيانات الطلب
  emit('submitted', {
    applicationCode: code,
    qrToken,
    courseRoundId: props.round.id,
    traineeId: props.traineeProfile.userId,
    status: 'UnderReview',
    qualificationPhotoPath: qualificationFile.value?.name || 'uploaded_file',
    createdAt: new Date().toISOString(),
    // AuditLog
    auditLog: {
      fromStatus: null,
      toStatus: 'UnderReview',
      note: 'تقديم إلكتروني جديد على الدورة',
      changedAt: new Date().toISOString(),
    },
    // Notification for Affairs
    affairsNotification: {
      title: `طلب تقديم جديد على دورة: ${props.round.courseName}`,
      message: `تقدّم المتدرب ${props.traineeProfile.fullName} للدورة "${props.round.courseName}" (${props.round.roundCode}) بكود الطلب ${code}. في انتظار المراجعة والاعتماد.`,
      category: 'affairs',
      priority: 'important',
      referenceId: code,
    },
  });

  // الانتقال إلى خطوة النجاح
  step.value = 3;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleClose() {
  if (step.value === 2) return; // لا تسمح بالإغلاق أثناء الإرسال
  // إعادة الضبط
  step.value = 1;
  qualificationFile.value = null;
  showFileError.value = false;
  submittingMessages.value = [];
  generatedCode.value = '';
  emit('close');
}
</script>
