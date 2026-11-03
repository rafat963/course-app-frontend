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
      <div class="px-5 sm:px-6 py-4.5 sm:py-5 border-b border-emerald-100 dark:border-emerald-950/40 flex items-center justify-between shrink-0 bg-emerald-50/60 dark:bg-emerald-950/20">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold shadow-xs shrink-0">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading leading-tight">
              الموافقة على الطلب
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

      <!-- 2. محتوى المودال: مختصر ومركّز -->
      <div class="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-sm">
        <!-- كارت ملخص الدورة والرسوم المباشر -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-sm sm:text-base font-bold">
            <span class="text-slate-800 dark:text-slate-100 truncate" :title="application.courseRound?.courseName">
              {{ application.courseRound?.courseName }}
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/60 text-xs sm:text-sm font-bold shrink-0">
              دفعة {{ application.courseRound?.roundNumber || 1 }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80">
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">الرسوم المستحقة:</span>
              <strong class="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {{ formatEgyptianCurrency(application.courseRound?.price) }}
              </strong>
            </div>

            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">المقاعد المتاحة بالدفعة:</span>
              <strong class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {{ remainingSeats }} <span class="text-xs sm:text-sm font-normal text-slate-400">مقعد من أصل {{ capacity }}</span>
              </strong>
            </div>
          </div>
        </div>

        <!-- حقل تحديد مهلة السداد -->
        <div class="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <label class="block font-bold text-slate-800 dark:text-slate-200 text-sm">
              آخر موعد لسداد الرسوم بالخزينة:
            </label>
            <span v-if="dueDate" class="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
              {{ formatSelectedDueDate }}
            </span>
          </div>

          <input
            v-model="dueDate"
            type="date"
            :min="todayDateString"
            class="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm"
          />

          <!-- أزرار الاختيار السريع للمهلة -->
          <div class="flex items-center gap-2 pt-1 flex-wrap">
            <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold ml-1">مهلة سريعة:</span>
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
              @click="setQuickDueDate(2)"
            >
              بعد يومين
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
              @click="setQuickDueDate(3)"
            >
              بعد 3 أيام
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
              @click="setQuickDueDate(7)"
            >
              بعد أسبوع
            </button>
          </div>
        </div>

        <!-- ملاحظات اختيارية للمتدرب -->
        <div class="space-y-2">
          <label class="block font-bold text-slate-800 dark:text-slate-200 text-sm">
            ملاحظات أو توجيهات للمتدرب (اختياري):
          </label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="اكتب أي ملاحظات أو اتركها فارغة..."
            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm resize-none"
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
          :disabled="!dueDate"
          class="h-11 px-6 rounded-xl text-sm sm:text-base font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
          @click="handleConfirm"
        >
          <CheckCircle2 class="w-4.5 h-4.5" />
          <span>تأكيد الموافقة</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, CheckCircle2 } from 'lucide-vue-next';
import { formatEgyptianCurrency } from '../helpers/applicantConstants';

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

const dueDate = ref('');
const notes = ref('');

const todayDateString = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const capacity = computed(() => {
  return Number(props.application?.courseRound?.capacity) || 25;
});

const enrolledCount = computed(() => {
  return Number(props.application?.courseRound?.enrolledCount) || 0;
});

const remainingSeats = computed(() => {
  const rem = capacity.value - enrolledCount.value;
  return rem > 0 ? rem : 0;
});

const formatSelectedDueDate = computed(() => {
  if (!dueDate.value) return '';
  try {
    const d = new Date(dueDate.value + 'T00:00:00');
    return d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dueDate.value;
  }
});

function setDefaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  dueDate.value = d.toISOString().split('T')[0];
  notes.value = '';
}

function setQuickDueDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  dueDate.value = d.toISOString().split('T')[0];
}

watch(
  () => props.isOpen,
  (val) => {
    if (val) setDefaultDueDate();
  }
);

function handleConfirm() {
  if (!dueDate.value) return;
  emit('confirm', {
    applicationId: props.application?.id,
    dueDate: dueDate.value,
    notes: notes.value,
  });
}
</script>