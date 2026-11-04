<template>
  <!-- مودال تأكيد التقديم الفوري — خطوة واحدة، بدون أي إدخالات أو رفع ملفات -->
  <div
    v-if="isOpen && round"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- رأس المودال -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-2xl flex items-center justify-center border"
            :class="
              phase === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700'
                : 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700'
            "
          >
            <CheckCircle2 v-if="phase === 'success'" class="w-5 h-5" />
            <Zap v-else class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ phase === 'success' ? 'تم تسجيل طلبك بنجاح' : 'تأكيد التقديم على الدورة' }}
            </h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {{ phase === 'success' ? 'قيد المراجعة لدى شؤون الدارسين' : 'تقديم فوري بدون أي إدخالات إضافية' }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
          @click="handleClose"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- المحتوى -->
      <div class="p-5 space-y-4 max-h-[calc(85vh-150px)] overflow-y-auto custom-scrollbar">
        <!-- ============================
             المرحلة 1: التأكيد
             ============================ -->
        <template v-if="phase === 'confirm'">
          <!-- ملخص الدورة -->
          <div class="p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 space-y-1.5">
            <div class="text-[11px] font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
              <BookOpen class="w-3.5 h-3.5" />
              الدورة المطلوب التقديم عليها
            </div>
            <div class="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug">{{ round.courseName }}</div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>الدفعة {{ round.roundNumber }} • {{ round.roundCode }}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <span>{{ formatDateAr(round.startDate) }}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <span class="font-bold text-emerald-700 dark:text-emerald-400">{{ formatPrice(myPrice) }}</span>
            </div>
          </div>

          <!-- البيانات المستخدمة تلقائياً -->
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
              <UserCheck class="w-3.5 h-3.5 text-slate-400" />
              ستُستخدم بياناتك المسجلة في المنظومة تلقائياً
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">الاسم الكامل</div>
                <div class="font-bold text-slate-800 dark:text-slate-100 truncate">{{ traineeProfile.fullName }}</div>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">الرقم القومي</div>
                <div class="font-mono font-bold text-slate-800 dark:text-slate-100">{{ traineeProfile.nationalId }}</div>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">المؤهل الدراسي</div>
                <div class="font-bold text-slate-800 dark:text-slate-100 truncate" :title="traineeProfile.qualification">
                  {{ traineeProfile.qualification || '—' }}
                </div>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <div class="text-[11px] text-slate-400">الفئة</div>
                <div class="font-bold text-slate-800 dark:text-slate-100">
                  {{ CATEGORY_CONFIG[traineeProfile.category]?.labelFull || traineeProfile.category }}
                </div>
              </div>
            </div>
          </div>

          <!-- نص التأكيد -->
          <div class="flex items-start gap-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <HelpCircle class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div class="space-y-1">
              <p class="text-xs font-black text-amber-800 dark:text-amber-300">
                هل ترغب في تأكيد التقديم في هذه الدورة؟
              </p>
              <p class="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                سيتم إنشاء الطلب فوراً بكود مرجعي ورمز QR، ولن تحتاج لرفع أي مستندات إضافية.
              </p>
            </div>
          </div>
        </template>

        <!-- ============================
             المرحلة 2: النجاح
             ============================ -->
        <template v-else>
          <div class="text-center space-y-4">
            <div class="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
              <CheckCircle2 class="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400">
              تم تسجيل طلبك وإحالته إلى شؤون الدارسين للمراجعة والاعتماد
            </p>

            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div class="text-[11px] text-slate-400 font-bold">كود طلبك المرجعي (ApplicationCode)</div>
              <div class="text-2xl font-black font-mono text-primary-700 dark:text-primary-400 tracking-widest">
                {{ generatedCode }}
              </div>
              <div class="text-[11px] text-slate-400 font-mono break-all">QR: {{ generatedQrToken }}</div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                قيد المراجعة (UnderReview)
              </span>
            </div>

            <div class="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-start">
              <Bell class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                تم إشعار شؤون الدارسين وتسجيل الحركة في سجل التدقيق (AuditLogs) تلقائياً. احتفظ بكود الطلب للمتابعة
                وسداد الرسوم بعد الموافقة.
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- أزرار الإجراءات -->
      <div class="flex items-center gap-2.5 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <template v-if="phase === 'confirm'">
          <button
            type="button"
            class="flex-1 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            @click="handleConfirm"
          >
            <span v-if="isSubmitting" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <Zap v-else class="w-3.5 h-3.5" />
            {{ isSubmitting ? 'جاري إنشاء الطلب...' : 'تأكيد التقديم' }}
          </button>
          <button
            type="button"
            class="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            @click="handleClose"
          >
            إلغاء
          </button>
        </template>

        <template v-else>
          <button
            type="button"
            class="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            @click="handleClose"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            تم
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  X,
  Zap,
  BookOpen,
  UserCheck,
  HelpCircle,
  Bell,
  CheckCircle2,
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
const phase = ref('confirm'); // confirm | success
const isSubmitting = ref(false);
const generatedCode = ref('');
const generatedQrToken = ref('');

/** سعر الفئة الحالية */
const myPrice = computed(() =>
  getPriceByCategory(props.round?.pricings, props.traineeProfile?.category)
);

/** إعادة الضبط عند كل فتح */
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      phase.value = 'confirm';
      isSubmitting.value = false;
      generatedCode.value = '';
      generatedQrToken.value = '';
    }
  }
);

// --- منطق التقديم الفوري ---
async function handleConfirm() {
  if (isSubmitting.value || !props.round) return;

  isSubmitting.value = true;

  // محاكاة قصيرة لإنشاء السجل في الـ API
  await sleep(600);

  const applicationCode = generateApplicationCode();
  const qrToken = generateQRToken();
  const createdAt = new Date().toISOString();

  generatedCode.value = applicationCode;
  generatedQrToken.value = qrToken;

  emit('submitted', {
    applicationCode,
    qrToken,
    courseRoundId: props.round.id,
    traineeId: props.traineeProfile.userId,
    status: 'UnderReview',
    qualificationPhotoPath: props.traineeProfile.qualificationPhotoPath || null,
    createdAt,
    // AuditLog
    auditLog: {
      fromStatus: null,
      toStatus: 'UnderReview',
      note: 'تقديم إلكتروني سريع على الدورة',
      changedAt: createdAt,
    },
    // Notification for Affairs
    affairsNotification: {
      title: `طلب تقديم جديد على دورة: ${props.round.courseName}`,
      message: `تقدّم المتدرب ${props.traineeProfile.fullName} للدورة "${props.round.courseName}" (${props.round.roundCode}) بكود الطلب ${applicationCode}. في انتظار المراجعة والاعتماد.`,
      category: 'affairs',
      priority: 'important',
      referenceId: applicationCode,
    },
  });

  isSubmitting.value = false;
  phase.value = 'success';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleClose() {
  if (isSubmitting.value) return; // لا تسمح بالإغلاق أثناء الإنشاء
  phase.value = 'confirm';
  generatedCode.value = '';
  generatedQrToken.value = '';
  emit('close');
}
</script>
