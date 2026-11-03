<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-fade-in"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-right transition-all flex flex-col max-h-[90vh]"
      dir="rtl"
    >
      <!-- 1. ترويسة المودال: واضحة ومباشرة -->
      <div class="px-5 sm:px-6 py-4.5 sm:py-5 border-b border-rose-100 dark:border-rose-950/40 flex items-center justify-between shrink-0 bg-rose-50/60 dark:bg-rose-950/20">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold shadow-xs shrink-0">
            <XCircle class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading leading-tight">
              رفض طلب الالتحاق
            </h2>
            <p class="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[280px] sm:max-w-md">
              {{ application.trainee?.fullName }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer transition-all border border-slate-200/60 dark:border-slate-700"
          @click="$emit('close')"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- 2. محتوى المودال -->
      <div class="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-sm">
        <!-- كارت ملخص الدورة والطلب -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-sm sm:text-base">
            <span class="text-slate-500 dark:text-slate-400 font-semibold">الدورة:</span>
            <strong class="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[260px]">
              {{ application.courseRound?.courseName }}
            </strong>
          </div>
          <div class="flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 dark:text-slate-400 font-semibold">رقم الطلب:</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
              {{ application.code }}
            </span>
          </div>
        </div>

        <!-- أسباب شائعة للاختيار السريع -->
        <div class="space-y-2.5">
          <label class="block font-bold text-slate-800 dark:text-slate-200 text-sm">
            أسباب شائعة للرفض (اختر للتعبئة السريعة):
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(reason, idx) in COMMON_REJECTION_REASONS"
              :key="idx"
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border text-right transition-all cursor-pointer"
              :class="
                rejectionReason === reason
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-bold shadow-2xs'
                  : 'bg-slate-100/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
              "
              @click="rejectionReason = reason"
            >
              {{ reason }}
            </button>
          </div>
        </div>

        <!-- نص سبب الرفض المخصص -->
        <div class="space-y-2">
          <label class="block font-bold text-slate-800 dark:text-slate-200 text-sm">
            سبب الرفض (يظهر للمتقدم في حسابه):
            <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="rejectionReason"
            rows="3"
            placeholder="اكتب سبب الرفض أو اختر من الأسباب أعلاه..."
            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all text-sm resize-none"
          ></textarea>
        </div>
      </div>

      <!-- 3. تذييل المودال -->
      <div class="px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/80">
        <button
          type="button"
          class="h-11 px-5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          @click="$emit('close')"
        >
          إلغاء
        </button>

        <button
          type="button"
          :disabled="!rejectionReason.trim()"
          class="h-11 px-6 rounded-xl text-sm sm:text-base font-black bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
          @click="handleConfirm"
        >
          <XCircle class="w-4.5 h-4.5" />
          <span>تأكيد رفض الطلب</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X, XCircle } from 'lucide-vue-next';
import { COMMON_REJECTION_REASONS } from '../helpers/applicantConstants';

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

const rejectionReason = ref('');

watch(
  () => props.isOpen,
  (val) => {
    if (val) rejectionReason.value = '';
  }
);

function handleConfirm() {
  if (!rejectionReason.value.trim()) return;
  emit('confirm', {
    applicationId: props.application?.id,
    reason: rejectionReason.value.trim(),
  });
}
</script>