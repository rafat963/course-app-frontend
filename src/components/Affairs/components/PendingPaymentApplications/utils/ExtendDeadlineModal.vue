<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
      <!-- ترويسة المودال -->
      <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
            <CalendarClock class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              تحديد موعد جديد لسداد الرسوم
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              تمديد المهلة المتاحة للمتدرب للتوجه للخزينة وإصدار إيصال السداد
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

      <!-- محتوى المودال -->
      <form class="p-5 sm:p-6 space-y-5 text-sm" @submit.prevent="handleConfirm">
        <!-- كارت ملخص بيانات المتدرب والطلب -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">اسم المتدرب:</span>
            <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">{{ application.trainee?.fullName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">الدورة التدريبية:</span>
            <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">{{ application.courseRound?.courseName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">الرسوم المستحقة:</span>
            <span class="font-black text-base sm:text-lg text-primary-700 dark:text-primary-300 font-heading">
              {{ formatEgyptianCurrency(application.courseRound?.price) }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">الموعد المنقضي حالياً:</span>
            <span class="font-bold font-mono text-sm sm:text-base text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Clock class="w-4 h-4" />
              <span>{{ formatDateOnly(application.paymentDueDate) }}</span>
            </span>
          </div>
        </div>

        <!-- اختيار الموعد الجديد -->
        <div class="space-y-2.5">
          <label class="block font-bold text-sm text-slate-800 dark:text-slate-200">
            اختر تاريخ السداد الجديد <span class="text-rose-500">*</span>
          </label>

          <!-- أزرار الاختيار السريع للمهلة -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="preset in presets"
              :key="preset.days"
              type="button"
              class="px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer"
              :class="
                selectedDays === preset.days
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              "
              @click="applyPreset(preset.days)"
            >
              {{ preset.label }}
            </button>
          </div>

          <!-- حقل إدخال التاريخ المباشر -->
          <div class="relative pt-1">
            <Calendar class="w-4.5 h-4.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              v-model="newDueDate"
              type="date"
              :min="minDate"
              required
              class="w-full h-11 pr-11 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              @change="selectedDays = null"
            />
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            سيتم تمديد صلاحية رمز QR الخاص بالدخول لمقر الخزينة حتى نهاية هذا التاريخ
          </p>
        </div>

        <!-- سبب أو ملاحظات التمديد -->
        <div class="space-y-2">
          <label class="block font-bold text-sm text-slate-800 dark:text-slate-200">
            سبب التمديد / ملاحظات الشؤون
          </label>
          <input
            v-model="extensionReason"
            type="text"
            placeholder="مثال: بناءً على اتصال تليفوني من المتدرب أو لظروف سفر..."
            class="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <!-- أزرار الحفظ والإلغاء -->
        <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            تراجع
          </button>
          <button
            type="submit"
            :disabled="!newDueDate"
            class="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm sm:text-base font-black flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check class="w-4.5 h-4.5" />
            <span>حفظ وتحديد الموعد الجديد</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { CalendarClock, X, Calendar, Clock, Check } from 'lucide-vue-next';
import {
  formatDateOnly,
  formatEgyptianCurrency,
  getFutureDateString,
} from '../helpers/pendingPaymentConstants';

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

const presets = [
  { label: '+ يومان', days: 2 },
  { label: '+ 3 أيام', days: 3 },
  { label: '+ 5 أيام', days: 5 },
  { label: '+ أسبوع', days: 7 },
];

const selectedDays = ref(3);
const newDueDate = ref(getFutureDateString(3));
const extensionReason = ref('');

const minDate = computed(() => {
  return getFutureDateString(1);
});

watch(
  () => props.application,
  () => {
    selectedDays.value = 3;
    newDueDate.value = getFutureDateString(3);
    extensionReason.value = '';
  },
  { immediate: true }
);

function applyPreset(days) {
  selectedDays.value = days;
  newDueDate.value = getFutureDateString(days);
}

function handleConfirm() {
  if (!newDueDate.value) return;
  emit('confirm', {
    applicationId: props.application.id,
    newDueDate: newDueDate.value,
    reason: extensionReason.value.trim() || 'تمديد مهلة السداد بواسطة شؤون الدارسين',
  });
}
</script>
