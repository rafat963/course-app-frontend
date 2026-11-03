<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة الموحدة مع الوضع الليلي -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
            :class="
              isEdit
                ? 'bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
            "
          >
            <UserCheck v-if="isEdit" class="w-6 h-6" />
            <UserPlus v-else class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ isEdit ? 'تعديل بيانات المحاضر المعتمد' : 'إضافة محاضر جديد لهيئة التدريس' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              توثيق السجل الأكاديمي وبيانات التواصل وفق نموذج Instructors في الـ ERD
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

      <!-- 2. جسم النموذج مع حقول الإدخال -->
      <form @submit.prevent="handleSubmit">
        <div class="p-6 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto text-xs sm:text-sm">
          <!-- رسالة الخطأ العام إن وجدت -->
          <div
            v-if="errorMessage"
            class="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2 text-xs sm:text-sm"
          >
            <AlertCircle class="w-4.5 h-4.5 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- اسم المحاضر -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
              اسم المحاضر بالكامل <span class="text-rose-500 font-black">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="مثال: د. طارق عبد الرحمن الجندي"
              class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
              :class="{ 'border-rose-400 ring-1 ring-rose-400': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-rose-500 font-bold">
              {{ errors.name }}
            </p>
          </div>

          <!-- التخصص العلمي ورقم الهاتف -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- التخصص -->
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                التخصص العلمي والأكاديمي <span class="text-rose-500 font-black">*</span>
              </label>
              <input
                v-model="form.specialty"
                type="text"
                list="specialty-suggestions"
                placeholder="اختر أو اكتب التخصص..."
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                :class="{ 'border-rose-400 ring-1 ring-rose-400': errors.specialty }"
              />
              <datalist id="specialty-suggestions">
                <option v-for="spec in specialties" :key="spec" :value="spec" />
              </datalist>
              <p v-if="errors.specialty" class="text-xs text-rose-500 font-bold">
                {{ errors.specialty }}
              </p>
            </div>

            <!-- رقم الهاتف -->
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                رقم هاتف التواصل <span class="text-rose-500 font-black">*</span>
              </label>
              <input
                v-model="form.phone"
                type="text"
                placeholder="مثال: 01012345671 (11 رقماً)"
                class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono font-bold"
                :class="{ 'border-rose-400 ring-1 ring-rose-400': errors.phone }"
              />
              <p v-if="errors.phone" class="text-xs text-rose-500 font-bold">
                {{ errors.phone }}
              </p>
            </div>
          </div>

          <!-- البريد الإلكتروني -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
              البريد الإلكتروني المهني للتواصل
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@mod-institute.edu.eg"
              class="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono font-medium"
            />
          </div>

          <!-- حالة النشاط والاعتماد بالمنظومة (IsActive في الـ ERD) -->
          <div
            class="p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none"
            :class="
              form.isActive
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            "
            @click="form.isActive = !form.isActive"
          >
            <div>
              <div class="flex items-center gap-2">
                <strong class="text-sm font-black text-slate-800 dark:text-slate-100">
                  حالة الاعتماد والنشاط (IsActive)
                </strong>
                <span
                  class="px-3 py-0.5 rounded-full text-xs font-bold border transition-colors"
                  :class="
                    form.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                  "
                >
                  {{ form.isActive ? 'معتمد ونشط' : 'معطل وغير نشط' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {{ form.isActive ? 'المحاضر مفعل ومتاح لإسناد دورات ودفعات جديدة له' : 'المحاضر معطل مؤقتاً ولن يظهر في القوائم المنسدلة عند فتح دفعات جديدة' }}
              </p>
            </div>

            <!-- الزر التفاعلي للتوجل -->
            <button
              type="button"
              role="switch"
              :aria-checked="form.isActive"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none"
              :class="form.isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'"
              @click.stop="form.isActive = !form.isActive"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out"
                :class="form.isActive ? '-translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>

        <!-- 3. الشريط السفلي للأزرار الموحد -->
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <button
            type="button"
            class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
            @click="handleClose"
          >
            إلغاء
          </button>

          <button
            type="submit"
            class="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm sm:text-base font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
          >
            <Save class="w-4.5 h-4.5" />
            <span>{{ isEdit ? 'حفظ التعديلات' : 'إضافة المحاضر' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import {
  X,
  UserPlus,
  UserCheck,
  AlertCircle,
  Save,
} from 'lucide-vue-next';
import { INSTRUCTOR_SPECIALTIES } from '../helpers/instructorsConstants';

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

const emit = defineEmits(['close', 'save']);

const specialties = INSTRUCTOR_SPECIALTIES;
const isEdit = computed(() => Boolean(props.instructor?.id));
const errorMessage = ref('');

const form = reactive({
  name: '',
  specialty: '',
  phone: '',
  email: '',
  isActive: true,
});

const errors = reactive({
  name: '',
  specialty: '',
  phone: '',
});

function resetForm() {
  if (props.instructor) {
    form.name = props.instructor.name || '';
    form.specialty = props.instructor.specialty || '';
    form.phone = props.instructor.phone || '';
    form.email = props.instructor.email || '';
    form.isActive = props.instructor.isActive !== undefined ? props.instructor.isActive : true;
  } else {
    form.name = '';
    form.specialty = '';
    form.phone = '';
    form.email = '';
    form.isActive = true;
  }
  errorMessage.value = '';
  errors.name = '';
  errors.specialty = '';
  errors.phone = '';
}

watch(
  () => [props.isOpen, props.instructor],
  ([open]) => {
    if (open) resetForm();
  },
  { immediate: true },
);

function validate() {
  let valid = true;
  errors.name = '';
  errors.specialty = '';
  errors.phone = '';
  errorMessage.value = '';

  if (!form.name || form.name.trim().length < 3) {
    errors.name = 'اسم المحاضر مطلوب (3 أحرف على الأقل)';
    valid = false;
  }

  if (!form.specialty || form.specialty.trim().length === 0) {
    errors.specialty = 'التخصص الأكاديمي مطلوب';
    valid = false;
  }

  const phoneClean = (form.phone || '').trim();
  if (!phoneClean) {
    errors.phone = 'رقم الهاتف مطلوب';
    valid = false;
  } else if (!/^01[0125][0-9]{8}$/.test(phoneClean)) {
    errors.phone = 'يرجى إدخال رقم هاتف محمول مصري صحيح (11 رقماً يبدأ بـ 01)';
    valid = false;
  }

  return valid;
}

function handleSubmit() {
  if (!validate()) return;

  const payload = {
    id: props.instructor?.id || Date.now(),
    name: form.name.trim(),
    specialty: form.specialty.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    isActive: Boolean(form.isActive),
    roundsTaught: props.instructor?.roundsTaught || [],
  };

  emit('save', payload);
  handleClose();
}

function handleClose() {
  emit('close');
}
</script>
