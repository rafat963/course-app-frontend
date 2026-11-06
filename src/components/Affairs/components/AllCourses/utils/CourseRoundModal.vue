<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scale-in text-right"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. ترويسة النافذة -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
            <CalendarPlus class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ modalTitle }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              الدفعة رقم {{ form.roundNumber }} (تلقائي) — جدولة دورة انعقاد جديدة
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

      <!-- 2. محتوى النموذج (Scrollable) -->
      <form class="p-6 space-y-6 max-h-[calc(85vh-130px)] overflow-y-auto text-xs sm:text-sm" @submit.prevent="handleSubmit">
        <!-- رسائل الخطأ العامة إن وُجدت -->
        <div
          v-if="validationError"
          class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-shake"
        >
          <AlertCircle class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{{ validationError }}</span>
        </div>

        <!-- السكشن الأول: الدورة التدريبية ورقم الدفعة التلقائي -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
          <!-- أ. في حال فتح الدورة من كارت دورة محددة (تم إخفاء الدروبداون ورقم الدفعة تلقائي وفق طلبك) -->
          <div v-if="isSpecificCourse" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <BookOpen class="w-5 h-5" />
              </div>
              <div>
                <span class="text-xs text-slate-400 dark:text-slate-500 font-bold block">الدورة التدريبية المعتمدة:</span>
                <strong class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
                  {{ selectedCourse?.name }}
                </strong>
              </div>
            </div>

            <!-- شارة رقم الدفعة التلقائي -->
            <div class="flex items-center gap-2">
              <span class="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono font-black text-xs sm:text-sm shadow-2xs">
                الدفعة رقم {{ form.roundNumber }} (تلقائي)
              </span>
              <span v-if="calculatedPreviousRound > 0" class="text-xs text-slate-500 dark:text-slate-400 font-bold">
                (السابقة: {{ calculatedPreviousRound }})
              </span>
            </div>
          </div>

          <!-- ب. في حال فتح الدورة بشكل عام بدون تحديد كورس مسبق -->
          <div v-else class="space-y-3">
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                اختر الدورة التدريبية بالكتالوج <span class="text-rose-500">*</span>
              </label>
              <Select
                v-model="form.courseId"
                :options="courseOptions"
                option-label="name"
                option-value="id"
                placeholder="اختر الدورة التدريبية..."
                class="w-full text-sm font-bold rounded-xl h-11 flex items-center"
                @change="onCourseSelected"
              />
            </div>

            <div v-if="selectedCourse" class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <span class="text-slate-600 dark:text-slate-300">رقم الدفعة القادمة:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
                الدفعة رقم {{ form.roundNumber }} (يُحسب تلقائياً)
              </span>
            </div>
          </div>
        </div>

        <!-- السكشن الثاني: المحاضر والقاعة وسعة الدفعة -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div class="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
            <Users class="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>المحاضر والقاعة التدريبية والسعة</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- اختيار المحاضر -->
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                المحاضر المعتمد للشرح <span class="text-rose-500">*</span>
              </label>
              <Select
                v-model="form.instructorId"
                :options="instructorOptions"
                option-label="name"
                option-value="id"
                filter
                filter-placeholder="ابحث بالاسم أو التخصص..."
                placeholder="اختر المحاضر من القائمة..."
                class="w-full text-sm font-bold rounded-xl h-11 flex items-center"
              />
              <p v-if="selectedInstructor" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                {{ selectedInstructor.specialty }}
              </p>
            </div>

            <!-- اختيار القاعة / المعمل -->
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                القاعة أو المعمل التدريبي <span class="text-rose-500">*</span>
              </label>
              <Select
                v-model="form.hallId"
                :options="hallOptions"
                option-label="name"
                option-value="id"
                placeholder="اختر القاعة..."
                class="w-full text-sm font-bold rounded-xl h-11 flex items-center"
                @change="onHallSelected"
              />
              <p v-if="selectedHall" class="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <span>أقصى سعة للقاعة:</span>
                <strong class="text-slate-800 dark:text-slate-200 font-bold font-mono">{{ selectedHall.maxCapacity }} مقعد</strong>
              </p>
            </div>

            <!-- السعة المستهدفة للدفعة -->
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                سعة الدفعة (عدد الدارسين) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model.number="form.capacity"
                type="number"
                min="1"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                :class="{ 'border-rose-400 focus:ring-rose-500': isCapacityExceeded }"
                placeholder="مثال: 25"
              />
              <p v-if="isCapacityExceeded" class="text-xs text-rose-600 dark:text-rose-400 font-bold">
                ⚠️ السعة تتجاوز سعة القاعة ({{ selectedHall?.maxCapacity }} مقعد)
              </p>
              <p v-else class="text-xs text-slate-400 font-medium">
                يجب ألا تتعدى السعة القصوى للقاعة
              </p>
            </div>
          </div>
        </div>

        <!-- السكشن الثالث: التواريخ والجدول الزمني -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div class="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
            <Calendar class="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            <span>المواعيد والجدول الزمني للدورة</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- تاريخ البداية -->
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                تاريخ بداية الدورة <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.startDate"
                type="date"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              />
            </div>

            <!-- تاريخ النهاية -->
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                تاريخ انتهاء الدورة <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.endDate"
                type="date"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              />
            </div>

            <!-- آخر موعد للتقديم -->
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                آخر موعد لتلقي الطلبات <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.lastApplicationDate"
                type="date"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- السكشن الرابع: أوقات المحاضرات وأيام الأسبوع -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
            <div class="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
              <Clock class="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
              <span>توقيت المحاضرات وأيام الأسبوع</span>
            </div>
            <span v-if="lectureDurationText" class="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 text-xs font-bold">
              ⏱️ مدة المحاضرة: {{ lectureDurationText }}
            </span>
          </div>

          <!-- توقيت البداية والنهاية -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                وقت بدء المحاضرة <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.startTime"
                type="time"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                وقت انتهاء المحاضرة <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.endTime"
                type="time"
                required
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <!-- اختيار أيام الأسبوع -->
          <div class="space-y-2.5 pt-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                أيام المحاضرات في الأسبوع <span class="text-rose-500">*</span>
              </label>

              <!-- خيارات سريعة جاهزة -->
              <div class="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                  @click="setLecturePreset(['Sat', 'Mon', 'Wed'])"
                >
                  سبت/إثنين/أربعاء
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                  @click="setLecturePreset(['Sun', 'Tue', 'Thu'])"
                >
                  أحد/ثلاثاء/خميس
                </button>
              </div>
            </div>

            <!-- أزرار الأيام التفاعلية -->
            <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
              <button
                v-for="day in LECTURE_DAYS_OPTIONS"
                :key="day.value"
                type="button"
                class="h-10 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer"
                :class="
                  form.lectureDays.includes(day.value)
                    ? 'bg-primary-600 text-white border-primary-600 shadow-2xs font-black'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                "
                @click="toggleDay(day.value)"
              >
                {{ day.label }}
              </button>
            </div>
            <p v-if="form.lectureDays.length === 0" class="text-xs text-rose-500 font-bold">
              يجب اختيار يوم واحد على الأقل للمحاضرات الأسبوعية
            </p>
          </div>
        </div>

        <!-- بطاقة المعاينة والملخص المباشر -->
        <div class="p-4.5 rounded-2xl bg-gradient-to-tr from-primary-50/60 to-emerald-50/60 dark:from-primary-950/30 dark:to-emerald-950/30 border border-primary-200/70 dark:border-primary-800/60 space-y-2">
          <div class="text-sm font-black text-primary-900 dark:text-primary-200 flex items-center gap-2">
            <Layers class="w-4.5 h-4.5 text-primary-600" />
            <span>ملخص دورة الانعقاد الجديدة:</span>
          </div>
          <div class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span><strong>الدورة:</strong> {{ selectedCourse?.name || 'لم تحدد بعد' }}</span>
              <span>•</span>
              <span><strong>الدفعة المعتمدة:</strong> رقم {{ form.roundNumber || 1 }} (تلقائي)</span>
              <span>•</span>
              <span><strong>المحاضر:</strong> {{ selectedInstructor?.name || 'لم يحدد بعد' }}</span>
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 dark:text-slate-400">
              <span><strong>القاعة:</strong> {{ selectedHall?.name || 'لم تحدد' }} (سعة {{ form.capacity }} دارس)</span>
              <span>•</span>
              <span><strong>الأيام:</strong> {{ formattedDaysPreview }}</span>
              <span>•</span>
              <span><strong>المواعيد:</strong> من {{ form.startTime }} إلى {{ form.endTime }}</span>
            </div>
          </div>
        </div>

        <!-- 3. أزرار التحكم السفلية -->
        <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
            @click="handleClose"
          >
            إلغاء
          </button>

          <button
            type="submit"
            :disabled="isSubmitting || isCapacityExceeded"
            class="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarPlus class="w-4.5 h-4.5" />
            <span>{{ isSubmitting ? 'جاري الاعتماد...' : 'اعتماد وجدولة الدفعة الجديدة' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Select from 'primevue/select';
import {
  CalendarPlus,
  X,
  AlertCircle,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Layers,
} from 'lucide-vue-next';
import {
  LECTURE_DAYS_OPTIONS,
  INITIAL_ROUND_FORM,
  formatLectureDays,
  calculateLectureDuration,
} from '../helpers/courseConstants';
import {
  INITIAL_HALLS,
  INITIAL_INSTRUCTORS,
} from '../helpers/courseMockData';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialCourseId: {
    type: Number,
    default: null,
  },
  courses: {
    type: Array,
    default: () => [],
  },
  existingRounds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'save']);

const form = ref({ ...INITIAL_ROUND_FORM });
const isSubmitting = ref(false);
const validationError = ref('');
const calculatedPreviousRound = ref(0);

// هل تم فتح المودال لكورس محدد مسبقاً (من الكارت أو المودال)
const isSpecificCourse = computed(() => {
  return Boolean(props.initialCourseId);
});

// عنوان النافذة الديناميكي وفق رغبة المستخدم
const modalTitle = computed(() => {
  if (selectedCourse.value?.name) {
    return `فتح دورة جديدة من كورس «${selectedCourse.value.name}»`;
  }
  return 'فتح دورة انعقاد جديدة (Course Round)';
});

// خيارات الدورات المتاحة
const courseOptions = computed(() => {
  return props.courses.map((c) => ({
    id: c.id,
    name: c.name,
    roundsCount: c.roundsCount || 0,
    description: c.description,
  }));
});

// خيارات المحاضرين
const instructorOptions = computed(() => {
  return INITIAL_INSTRUCTORS.filter((i) => i.isActive).map((i) => ({
    id: i.id,
    name: `${i.name} (${i.specialty})`,
    rawName: i.name,
    specialty: i.specialty,
  }));
});

// خيارات القاعات
const hallOptions = computed(() => {
  return INITIAL_HALLS.filter((h) => h.isActive).map((h) => ({
    id: h.id,
    name: `${h.name} — أقصى سعة: ${h.maxCapacity}`,
    rawName: h.name,
    maxCapacity: h.maxCapacity,
    type: h.type,
  }));
});

// الكائنات المحددة حالياً
const selectedCourse = computed(() => {
  return props.courses.find((c) => c.id === form.value.courseId);
});

const selectedInstructor = computed(() => {
  return INITIAL_INSTRUCTORS.find((i) => i.id === form.value.instructorId);
});

const selectedHall = computed(() => {
  return INITIAL_HALLS.find((h) => h.id === form.value.hallId);
});

// فحص تجاوز السعة القصوى للقاعة
const isCapacityExceeded = computed(() => {
  if (!selectedHall.value || !form.value.capacity) return false;
  return form.value.capacity > selectedHall.value.maxCapacity;
});

// مدة المحاضرة
const lectureDurationText = computed(() => {
  return calculateLectureDuration(form.value.startTime, form.value.endTime);
});

// معاينة الأيام
const formattedDaysPreview = computed(() => {
  return formatLectureDays(form.value.lectureDays);
});

// عند فتح النافذة
watch(
  () => [props.isOpen, props.initialCourseId],
  ([val]) => {
    if (val) {
      validationError.value = '';
      initForm();
    }
  }
);

// حساب رقم الدفعة القادمة تلقائياً بزيادة 1 عن أعلى دفعة سابقة
function computeNextRoundNumber(courseId) {
  if (!courseId) {
    form.value.roundNumber = 1;
    calculatedPreviousRound.value = 0;
    return 1;
  }

  // 1. استخراج كل أرقام الدفعات المسجلة لهذا الكورس من جدول الدفعات
  const matchingRounds = props.existingRounds.filter(
    (r) => Number(r.courseId) === Number(courseId)
  );
  const roundNumsFromRounds = matchingRounds.map((r) => Number(r.roundNumber) || 0);

  // 2. فحص عداد الدورة في الكتالوج إن وُجد
  const targetCourse = props.courses.find((c) => Number(c.id) === Number(courseId));
  const roundsCountFromCourse = Number(targetCourse?.roundsCount) || 0;

  // 3. أعلى رقم سابق مسجل
  const maxPrevious = Math.max(0, ...roundNumsFromRounds, roundsCountFromCourse);
  calculatedPreviousRound.value = maxPrevious;

  // 4. الرقم التلقائي الجديد = أعلى رقم + 1
  const nextNum = maxPrevious + 1;
  form.value.roundNumber = nextNum;
  return nextNum;
}

// مراقبة تغيير الدورة لإعادة الحساب الفوري لرقم الدفعة وتحديد المحاضر المعتمد
watch(
  () => form.value.courseId,
  (newCourseId) => {
    if (newCourseId) {
      computeNextRoundNumber(newCourseId);
      const targetCourse = props.courses.find((c) => Number(c.id) === Number(newCourseId));
      if (targetCourse?.instructorId) {
        form.value.instructorId = targetCourse.instructorId;
      }
    }
  }
);

function initForm() {
  const targetCourseId = props.initialCourseId || (props.courses.length > 0 ? props.courses[0].id : null);

  // تواريخ افتراضية مريحة للمستخدم
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 14);
  const end = new Date(start);
  end.setDate(start.getDate() + 40);
  const lastApp = new Date(start);
  lastApp.setDate(start.getDate() - 7);

  const formatDateYMD = (d) => d.toISOString().split('T')[0];

  form.value = {
    ...INITIAL_ROUND_FORM,
    courseId: targetCourseId,
    roundNumber: 1, // سيتم حسابه بالأسفل
    instructorId: INITIAL_INSTRUCTORS[0]?.id || null,
    hallId: INITIAL_HALLS[0]?.id || null,
    capacity: 25,
    startDate: formatDateYMD(start),
    endDate: formatDateYMD(end),
    lastApplicationDate: formatDateYMD(lastApp),
    startTime: '09:00',
    endTime: '13:00',
    lectureDays: ['Sat', 'Mon', 'Wed'],
    status: 'Available',
  };

  if (targetCourseId) {
    computeNextRoundNumber(targetCourseId);
    const targetCourse = props.courses.find((c) => Number(c.id) === Number(targetCourseId));
    if (targetCourse?.instructorId) {
      form.value.instructorId = targetCourse.instructorId;
    }
  }
}

function onCourseSelected() {
  if (form.value.courseId) {
    computeNextRoundNumber(form.value.courseId);
    const targetCourse = props.courses.find((c) => Number(c.id) === Number(form.value.courseId));
    if (targetCourse?.instructorId) {
      form.value.instructorId = targetCourse.instructorId;
    }
  }
}

function onHallSelected() {
  if (selectedHall.value && form.value.capacity > selectedHall.value.maxCapacity) {
    form.value.capacity = selectedHall.value.maxCapacity;
  }
}

function toggleDay(dayValue) {
  const idx = form.value.lectureDays.indexOf(dayValue);
  if (idx >= 0) {
    form.value.lectureDays.splice(idx, 1);
  } else {
    form.value.lectureDays.push(dayValue);
  }
}

function setLecturePreset(days) {
  form.value.lectureDays = [...days];
}

function handleClose() {
  emit('close');
}

function handleSubmit() {
  validationError.value = '';

  if (!form.value.courseId) {
    validationError.value = 'يرجى اختيار الدورة التدريبية بالكتالوج أولاً.';
    return;
  }
  if (!form.value.instructorId) {
    validationError.value = 'يرجى اختيار المحاضر المعتمد للدورة.';
    return;
  }
  if (!form.value.hallId) {
    validationError.value = 'يرجى اختيار قاعة أو معمل التدريب.';
    return;
  }
  if (isCapacityExceeded.value) {
    validationError.value = `سعة الدفعة (${form.value.capacity}) تتجاوز أقصى سعة للقاعة المحددة (${selectedHall.value.maxCapacity}).`;
    return;
  }
  if (!form.value.startDate || !form.value.endDate) {
    validationError.value = 'يرجى تحديد تاريخ بداية ونهاية الدورة.';
    return;
  }
  if (new Date(form.value.endDate) <= new Date(form.value.startDate)) {
    validationError.value = 'تاريخ انتهاء الدورة يجب أن يكون لاحقاً لتاريخ البداية.';
    return;
  }
  if (form.value.lastApplicationDate && new Date(form.value.lastApplicationDate) > new Date(form.value.startDate)) {
    validationError.value = 'آخر موعد للتقديم يجب أن يكون سابقاً أو مساوياً لتاريخ بداية الدورة.';
    return;
  }
  if (form.value.lectureDays.length === 0) {
    validationError.value = 'يرجى اختيار يوم واحد على الأقل للمحاضرات الأسبوعية.';
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    const newRound = {
      id: Date.now(),
      courseId: form.value.courseId,
      courseName: selectedCourse.value?.name || '',
      roundNumber: Number(form.value.roundNumber || 1),
      instructorId: form.value.instructorId,
      instructorName: selectedInstructor.value?.name || '',
      hallId: form.value.hallId,
      hallName: selectedHall.value?.name || '',
      hallMaxCapacity: selectedHall.value?.maxCapacity || 30,
      capacity: Number(form.value.capacity),
      enrolledCount: 0,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      lastApplicationDate: form.value.lastApplicationDate,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      lectureDays: [...form.value.lectureDays],
      status: 'Available',
      createdAt: new Date().toISOString(),
    };

    emit('save', newRound);
    isSubmitting.value = false;
    handleClose();
  }, 350);
}
</script>
