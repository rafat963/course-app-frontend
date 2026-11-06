<template>
  <AuthCardLayout
    max-width-class="max-w-[680px]"
    subtitle="بوابة تسجيل متدرب جديد"
    security-note="جميع البيانات الشخصية والمستندات مشفرة ومحفوظة وفقاً لمعايير أمن المعلومات العسكرية"
  >
    <!-- Stepper in Header -->
    <template #header-extra>
      <RegisterStepper
        :steps="steps"
        :current-step="currentStep"
        @step-click="goToStep"
      />
    </template>

    <!-- Form Body -->
    <form class="p-6 sm:p-8" novalidate @submit.prevent="handleNextOrSubmit">
      <!-- Error Alert at Top -->
      <div
        v-if="errorMsg"
        class="mb-5 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold"
      >
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Step 1: Basic Account Info -->
      <RegisterStep1Account
        v-show="currentStep === 1"
        :form="form"
        :profile-photo-preview="profilePhotoPreview"
        @profile-photo-upload="handleProfilePhoto"
      />

      <!-- Step 2: National ID Data & Photos -->
      <RegisterStep2NationalId
        v-show="currentStep === 2"
        :form="form"
        :front-photo-preview="frontPhotoPreview"
        :back-photo-preview="backPhotoPreview"
        :extracted-info-notice="extractedInfoNotice"
        @national-id-input="onNationalIdInput"
        @front-photo-upload="handleFrontPhoto"
        @back-photo-upload="handleBackPhoto"
      />

      <!-- Step 3: Trainee Category & Documents -->
      <RegisterStep3Category
        v-show="currentStep === 3"
        :form="form"
        :category-proof-preview="categoryProofPreview"
        @category-proof-upload="handleCategoryProof"
      />

      <!-- Error Alert above buttons -->
      <div
        v-if="errorMsg"
        class="mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-shake"
      >
        <AlertCircle class="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Navigation Buttons: Back / Next / Submit -->
      <div class="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <!-- Back Button -->
        <button
          v-if="currentStep > 1"
          type="button"
          class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          @click="prevStep"
        >
          <ArrowRight class="w-4 h-4" />
          <span>السابق</span>
        </button>
        <div v-else></div>

        <!-- Next / Submit Button -->
        <button
          type="button"
          :disabled="isLoading"
          class="px-6 py-2.5 rounded-xl bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-primary-700/20 hover:shadow-primary-700/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          @click="handleNextOrSubmit"
        >
          <svg
            v-if="isLoading"
            class="animate-spin w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <template v-else>
            <span>{{ currentStep === 3 ? 'إنشاء حساب المتدرب' : 'التالي' }}</span>
            <ArrowLeft class="w-4 h-4" />
          </template>
        </button>
      </div>
    </form>

    <!-- Card Footer: Back to Login -->
    <div class="px-6 sm:px-8 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
      <span class="text-slate-500 dark:text-slate-400 font-medium">لديك حساب مسجل بالفعل؟</span>
      <RouterLink
        to="/auth/login"
        class="text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 font-bold mr-1.5 transition-colors underline underline-offset-4"
      >
        تسجيل الدخول
      </RouterLink>
    </div>
  </AuthCardLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-vue-next';
import AuthCardLayout from '../utils/AuthCardLayout.vue';
import RegisterStepper from '../utils/RegisterStepper.vue';
import RegisterStep1Account from '../utils/RegisterStep1Account.vue';
import RegisterStep2NationalId from '../utils/RegisterStep2NationalId.vue';
import RegisterStep3Category from '../utils/RegisterStep3Category.vue';
import { extractFromNationalId } from '../helpers/authConstants';
import { useAuthStore } from '../stores/authStore';
import { ROLES } from '@/shared/constants/roles';
import { TRAINEE_CATEGORIES } from '@/shared/constants/statuses';

const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(1);
const isLoading = ref(false);
const errorMsg = ref('');
const extractedInfoNotice = ref('');

// Step definitions
const steps = [
  { number: 1, title: 'البيانات الأساسية' },
  { number: 2, title: 'بيانات البطاقة' },
  { number: 3, title: 'الفئة والمستندات' },
];

// Form data based on ERD (Users + TraineeProfiles tables)
const form = ref({
  // Users table
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  profilePhoto: null,

  // TraineeProfiles table
  nationalId: '',
  frontPhoto: null,
  backPhoto: null,
  dateOfBirth: '',
  gender: 'Male',
  religion: 'Muslim',
  maritalStatus: 'Single',
  occupation: '',
  address: '',
  governorate: '',
  nationalIdExpiryDate: '',
  category: TRAINEE_CATEGORIES.CIVILIAN,
  categoryProofPhoto: null,

  // Declaration
  agreeTerms: false,
});

// Image preview state
const profilePhotoPreview = ref('');
const frontPhotoPreview = ref('');
const backPhotoPreview = ref('');
const categoryProofPreview = ref('');

function handleProfilePhoto({ file, previewUrl }) {
  form.value.profilePhoto = file;
  profilePhotoPreview.value = previewUrl;
}

function handleFrontPhoto({ file, previewUrl }) {
  form.value.frontPhoto = file;
  frontPhotoPreview.value = previewUrl;
}

function handleBackPhoto({ file, previewUrl }) {
  form.value.backPhoto = file;
  backPhotoPreview.value = previewUrl;
}

function handleCategoryProof({ file, previewUrl }) {
  form.value.categoryProofPhoto = file;
  categoryProofPreview.value = previewUrl;
}

// Auto-extract info from National ID
function onNationalIdInput() {
  const result = extractFromNationalId(form.value.nationalId);
  extractedInfoNotice.value = '';

  if (result) {
    form.value.dateOfBirth = result.dateOfBirth;
    form.value.gender = result.gender;
    extractedInfoNotice.value = 'تم استخراج تاريخ الميلاد والنوع تلقائياً';
  }
}

// Validation per step
function validateCurrentStep() {
  errorMsg.value = '';

  if (currentStep.value === 1) {
    if (!form.value.fullName || form.value.fullName.trim().length < 3) {
      errorMsg.value = 'يرجى إدخال الاسم كاملاً.';
      return false;
    }
    if (!form.value.email || !form.value.email.includes('@')) {
      errorMsg.value = 'يرجى إدخال بريد إلكتروني صحيح.';
      return false;
    }
    if (!form.value.phone || form.value.phone.trim().length < 8) {
      errorMsg.value = 'يرجى إدخال رقم هاتف صحيح للتواصل.';
      return false;
    }
    if (!form.value.password || form.value.password.length < 4) {
      errorMsg.value = 'كلمة المرور يجب أن لا تقل عن 4 خانات.';
      return false;
    }
    if (form.value.password !== form.value.confirmPassword) {
      errorMsg.value = 'كلمتا المرور غير متطابقتين.';
      return false;
    }
    return true;
  }

  if (currentStep.value === 2) {
    if (!form.value.nationalId || form.value.nationalId.length < 14) {
      errorMsg.value = 'يرجى إدخال الرقم القومي المكون من 14 رقماً.';
      return false;
    }
    if (!form.value.frontPhoto && !frontPhotoPreview.value) {
      errorMsg.value = 'يرجى رفع صورة واضحة لوجه بطاقة الرقم القومي.';
      return false;
    }
    if (!form.value.backPhoto && !backPhotoPreview.value) {
      errorMsg.value = 'يرجى رفع صورة واضحة لظهر بطاقة الرقم القومي.';
      return false;
    }
    if (!form.value.dateOfBirth) {
      errorMsg.value = 'يرجى تحديد تاريخ الميلاد.';
      return false;
    }
    if (!form.value.occupation) {
      errorMsg.value = 'يرجى إدخال المهنة المدونة بالبطاقة.';
      return false;
    }
    if (!form.value.nationalIdExpiryDate) {
      errorMsg.value = 'يرجى تحديد تاريخ سريان / انتهاء البطاقة.';
      return false;
    }
    if (!form.value.governorate) {
      errorMsg.value = 'يرجى اختيار المحافظة.';
      return false;
    }
    if (!form.value.address) {
      errorMsg.value = 'يرجى إدخال العنوان المدون بالبطاقة.';
      return false;
    }
    return true;
  }

  if (currentStep.value === 3) {
    if (form.value.category !== TRAINEE_CATEGORIES.CIVILIAN) {
      if (!form.value.categoryProofPhoto && !categoryProofPreview.value) {
        errorMsg.value = 'يرجى رفع صورة إثبات الفئة (كارنيه أو بطاقة علاجية) للحصول على الخصم.';
        return false;
      }
    }
    if (!form.value.agreeTerms) {
      errorMsg.value = 'يجب الموافقة على صحة البيانات والشروط لمتابعة التسجيل.';
      return false;
    }
    return true;
  }

  return true;
}

function handleNextOrSubmit() {
  if (!validateCurrentStep()) return;

  if (currentStep.value < 3) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    submitRegistration();
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
    errorMsg.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goToStep(stepNum) {
  if (stepNum < currentStep.value) {
    currentStep.value = stepNum;
    errorMsg.value = '';
  }
}

function submitRegistration() {
  isLoading.value = true;
  errorMsg.value = '';

  setTimeout(() => {
    isLoading.value = false;

    authStore.setAuth('mock-jwt-trainee-token', {
      id: 99,
      fullName: form.value.fullName,
      email: form.value.email,
      role: ROLES.TRAINEE,
      category: form.value.category,
      nationalId: form.value.nationalId,
    });

    router.push('/trainee/courses');
  }, 900);
}
</script>
