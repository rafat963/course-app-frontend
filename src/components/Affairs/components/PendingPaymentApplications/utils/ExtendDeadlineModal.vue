<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in text-right" dir="rtl">
      <!-- ترويسة المودال -->
      <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/40">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <CalendarClock class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              تحديد مهلة جديدة لسداد الرسوم
            </h3>
            <p class="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-0.5 font-bold">
              منح المتدرب مهلة مفتوحة للدفع في أي وقت خلالها (مش يوم محدد)
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
      <form class="p-5 sm:p-6 space-y-4.5 text-sm" @submit.prevent="handleConfirm">
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
            <span class="font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 font-heading font-mono">
              {{ formatEgyptianCurrency(application.courseRound?.price) }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">المهلة السابقة:</span>
            <span class="font-bold font-mono text-xs sm:text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5" />
              <span>حتى {{ formatDateOnly(application.paymentDueDate) }}</span>
            </span>
          </div>
        </div>

        <!-- خيارات تحديد مهلة السداد -->
        <div class="space-y-3">
          <label class="block font-bold text-sm text-slate-800 dark:text-slate-200">
            حدد مدة مهلة الدفع المطلوبة:
          </label>

          <!-- أزرار الاختيار السريع لمدد المهلة (3 أيام، 5 أيام، أسبوع، إلخ) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="preset in presets"
              :key="preset.days"
              type="button"
              class="h-10 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              :class="
                selectedDays === preset.days
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-black'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              "
              @click="applyPreset(preset.days)"
            >
              <Clock class="w-3.5 h-3.5" :class="selectedDays === preset.days ? 'text-white' : 'text-amber-500'" />
              <span>{{ preset.label }}</span>
            </button>
          </div>

          <!-- اختيار تاريخ مخصص يدفع قبله -->
          <div class="pt-1.5">
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              أو حدد تاريخ معين ينتهي عنده قبول السداد (يدفع قبله):
            </label>
            <div class="relative">
              <Calendar class="w-4.5 h-4.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="newDueDate"
                type="date"
                :min="minDate"
                required
                class="w-full h-11 pr-11 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                @change="onManualDateChange"
              />
            </div>
          </div>
        </div>

        <!-- صندوق ملخص المهلة المفتوحة (تأكيد بصري للموظف) -->
        <div class="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1 text-xs sm:text-sm">
          <div class="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
            <CheckCircle2 class="w-4.5 h-4.5 text-amber-600 shrink-0" />
            <span>ملخص المهلة: متاح السداد حتى {{ formattedDueDateWithDay }}</span>
          </div>
          <p class="text-xs text-amber-900/80 dark:text-amber-300/80 pr-6 leading-relaxed">
            يحق للمتدرب التوجه للخزينة وسداد الرسوم في أي وقت خلال المهلة ({{ computedDaysText }}) دون التقيد بيوم محدد.
          </p>
        </div>

        <!-- سبب أو ملاحظات التمديد -->
        <div class="space-y-1.5">
          <label class="block font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            ملاحظات الشؤون / سبب منح المهلة (اختياري)
          </label>
          <input
            v-model="extensionReason"
            type="text"
            placeholder="مثال: بناءً على طلب المتدرب لظروف عمل أو سفر..."
            class="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <!-- أزرار الحفظ والإلغاء -->
        <div class="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
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
            <span>تأكيد مهلة السداد الجديدة</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { CalendarClock, X, Calendar, Clock, Check, CheckCircle2 } from 'lucide-vue-next';
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
  { label: 'مهلة 3 أيام', days: 3 },
  { label: 'مهلة 5 أيام', days: 5 },
  { label: 'مهلة أسبوع (7 أيام)', days: 7 },
  { label: 'مهلة 10 أيام', days: 10 },
  { label: 'مهلة أسبوعين', days: 14 },
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

function onManualDateChange() {
  if (!newDueDate.value) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(newDueDate.value);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  selectedDays.value = diffDays > 0 ? diffDays : null;
}

const formattedDueDateWithDay = computed(() => {
  if (!newDueDate.value) return '';
  try {
    const d = new Date(newDueDate.value + 'T00:00:00');
    return d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return formatDateOnly(newDueDate.value);
  }
});

const computedDaysText = computed(() => {
  if (selectedDays.value) {
    if (selectedDays.value === 1) return 'مهلة يوم واحد';
    if (selectedDays.value === 2) return 'مهلة يومين';
    if (selectedDays.value <= 10) return `مهلة ${selectedDays.value} أيام`;
    return `مهلة ${selectedDays.value} يوماً`;
  }
  return 'حتى التاريخ المحدد أعلاه';
});

function handleConfirm() {
  if (!newDueDate.value) return;
  emit('confirm', {
    applicationId: props.application.id,
    newDueDate: newDueDate.value,
    reason: extensionReason.value.trim() || `تمديد مهلة السداد (${computedDaysText.value})`,
  });
}
</script>
