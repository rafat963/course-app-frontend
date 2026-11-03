<template>
  <div
    v-if="isOpen && instructor"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- الترويسة الموحدة مع الوضع الليلي -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-2xs">
            <Trash2 class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ hasAssignedRounds ? 'تنبيه: ارتباط المحاضر بدفعات تدريبية' : 'تأكيد حذف المحاضر' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              فحص سلامة البيانات وقواعد التكامل المرجعي وفق الـ ERD
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- محتوى التحذير -->
      <div class="p-6 space-y-4 text-base">
        <!-- بيانات المحاضر المستهدف -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-base shrink-0">
            {{ getInstructorInitials(instructor.name) }}
          </div>
          <div>
            <strong class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 block">
              {{ instructor.name }}
            </strong>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-bold mt-0.5">
              {{ instructor.specialty }} • {{ instructor.phone }}
            </p>
          </div>
        </div>

        <!-- الحالة 1: المحاضر لديه دفعات تدريبية مرتبطة -->
        <div
          v-if="hasAssignedRounds"
          class="p-4.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 space-y-2"
        >
          <div class="flex items-center gap-2 font-black text-base sm:text-lg">
            <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0" />
            <span>لا يمكن حذف المحاضر لارتباطه بـ {{ roundsCount }} دفعة تدريبية!</span>
          </div>
          <p class="text-xs sm:text-sm text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
            حفاظاً على سلامة السجلات الأكاديمية والمالية وفق جدول <code>CourseRounds</code> في الـ ERD، لا يمكن حذف محاضر قام بالتدريس بالفعل. نوصي بتعطيل حالة المحاضر بدلاً من حذفه لمنع إسناد دفعات جديدة له.
          </p>
        </div>

        <!-- الحالة 2: المحاضر ليس لديه أي دفعات تدريبية مسندة -->
        <div
          v-else
          class="p-4.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 space-y-2"
        >
          <div class="flex items-center gap-2 font-black text-base sm:text-lg">
            <AlertCircle class="w-5 h-5 text-rose-600 shrink-0" />
            <span>هل أنت متأكد من رغبتك في حذف هذا المحاضر نهائياً؟</span>
          </div>
          <p class="text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-medium">
            سيتم إزالة المحاضر نهائياً من دليل هيئة التدريس ولن تظهر بياناته في القوائم المنسدلة.
          </p>
        </div>
      </div>

      <!-- أزرار الإجراءات السفلية الموحدة -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <button
          type="button"
          class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          @click="handleClose"
        >
          إلغاء
        </button>

        <div class="flex items-center gap-2">
          <!-- إذا كان لديه دفعات: زر التعطيل بدلاً من الحذف -->
          <button
            v-if="hasAssignedRounds"
            type="button"
            class="h-11 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-black flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="handleDeactivate"
          >
            <ShieldAlert class="w-4.5 h-4.5" />
            <span>تعطيل المحاضر بدلاً من الحذف</span>
          </button>

          <!-- إذا لم يكن لديه دفعات: زر الحذف النهائي -->
          <button
            v-else
            type="button"
            class="h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-black flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="handleConfirmDelete"
          >
            <Trash2 class="w-4.5 h-4.5" />
            <span>حذف نهائي</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Trash2,
  X,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
} from 'lucide-vue-next';
import { getInstructorInitials } from '../helpers/instructorsConstants';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  instructor: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'confirm-delete', 'deactivate']);

const roundsCount = computed(() => {
  return (props.instructor?.roundsTaught || []).length;
});

const hasAssignedRounds = computed(() => {
  return roundsCount.value > 0;
});

function handleClose() {
  emit('close');
}

function handleConfirmDelete() {
  emit('confirm-delete', props.instructor.id);
  handleClose();
}

function handleDeactivate() {
  emit('deactivate', props.instructor.id);
  handleClose();
}
</script>
