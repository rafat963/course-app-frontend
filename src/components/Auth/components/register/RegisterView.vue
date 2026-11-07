<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
    <!-- Compact Header -->
    <div
      class="shrink-0 bg-gradient-to-b from-primary-50/60 via-slate-50/30 to-white dark:from-slate-800/80 dark:via-slate-900/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-5 py-3 sm:px-6 sm:py-3.5 transition-colors duration-300"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <img
            src="@/assets/logo.png"
            alt="شعار معهد نظم المعلومات - القوات المسلحة"
            class="w-10 h-10 object-contain drop-shadow-xs shrink-0"
          />
          <div class="text-right">
            <h1 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading leading-tight">
              معهد نظم المعلومات
            </h1>
            <p class="text-[10px] font-bold text-primary-700 dark:text-primary-400">القوات المسلحة</p>
          </div>
        </div>

        <div class="text-left shrink-0">
          <span class="text-[10.5px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80">
            بوابة تسجيل متدرب جديد
          </span>
        </div>
      </div>

      <!-- Compact Type Selector + Stepper -->
      <TraineeTypeSelector v-model="traineeType" @change="onTypeChange" />
      <RegisterStepper
        :steps="currentSteps"
        :current-step="currentStep"
        @step-click="goToStep"
      />
    </div>

    <!-- Form: Flex layout pinned to card height with zero page scroll -->
    <form class="flex-1 flex flex-col min-h-0 overflow-hidden" novalidate @submit.prevent="handleNextOrSubmit">

      <!-- Scrollable steps body (only scrolls internally if viewport is extremely small) -->
      <div class="flex-1 overflow-y-auto px-5 py-3 sm:px-7 sm:py-3.5 space-y-2.5 custom-scrollbar">

        <!-- Error Alert -->
        <div
          v-if="errorMsg"
          class="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold"
        >
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ errorMsg }}</span>
        </div>

        <!-- STEP 1 — البيانات الأساسية -->
        <RegisterStep1Account
          v-show="currentStep === 1"
          :form="form"
          :profile-photo-preview="profilePhotoPreview"
          @profile-photo-upload="handleProfilePhoto"
        />

        <!-- ADULT STEP 2 — بيانات البطاقة -->
        <RegisterStep2NationalId
          v-show="isAdult && currentStep === 2"
          :form="form"
          :front-photo-preview="frontPhotoPreview"
          :back-photo-preview="backPhotoPreview"
          :extracted-info-notice="extractedInfoNotice"
          @national-id-input="onNationalIdInput"
          @front-photo-upload="handleFrontPhoto"
          @back-photo-upload="handleBackPhoto"
        />

        <!-- MINOR STEP 2 — بيانات القاصر وشهادة الميلاد -->
        <RegisterStep2Minor
          v-show="isMinor && currentStep === 2"
          :form="form"
          :birth-cert-preview="birthCertPreview"
          :extracted-info-notice="extractedInfoNotice"
          @national-id-input="onMinorNationalIdInput"
          @birth-cert-upload="handleBirthCert"
        />

        <!-- MINOR STEP 3 — بيانات ولي الأمر ومستنداته -->
        <RegisterStep3Guardian
          v-show="isMinor && currentStep === 3"
          :form="form"
          :guardian-front-preview="guardianFrontPreview"
          :guardian-back-preview="guardianBackPreview"
          @guardian-front-upload="handleGuardianFront"
          @guardian-back-upload="handleGuardianBack"
        />

        <!-- LAST STEP — الفئة والمستندات والإقرار -->
        <RegisterStep3Category
          v-show="(isAdult && currentStep === 3) || (isMinor && currentStep === 4)"
          :form="form"
          :category-proof-preview="categoryProofPreview"
          @category-proof-upload="handleCategoryProof"
        />
      </div>

      <!-- Pinned Footer: Navigation Buttons & Login Link -->
      <div class="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-t border-slate-100 dark:border-slate-800">
        <!-- Buttons Row -->
        <div class="px-5 sm:px-7 py-2.5 flex items-center justify-between gap-3">
          <!-- Back Button -->
          <button
            v-if="currentStep > 1"
            type="button"
            class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            @click="prevStep"
          >
            <ArrowRight class="w-3.5 h-3.5" />
            <span>السابق</span>
          </button>
          <div v-else></div>

          <!-- Step indicator -->
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
            {{ currentStep }} من {{ maxStep }}
          </span>

          <!-- Next / Submit Button -->
          <button
            type="button"
            :disabled="isLoading"
            class="px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            :class="
              isMinor
                ? 'bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-600/20'
                : 'bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-primary-700/20'
            "
            @click="handleNextOrSubmit"
          >
            <svg v-if="isLoading" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <template v-else>
              <span>{{ currentStep === maxStep ? 'إنشاء الحساب' : 'التالي' }}</span>
              <ArrowLeft class="w-3.5 h-3.5" />
            </template>
          </button>
        </div>

        <!-- Back to Login Row -->
        <div class="px-5 sm:px-7 pb-3 pt-0.5">
          <div class="relative flex items-center justify-center mb-2">
            <span class="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800"></span>
            <span class="relative bg-white dark:bg-slate-900 px-3 text-[10.5px] text-slate-400 dark:text-slate-500 font-semibold">أو</span>
          </div>

          <RouterLink
            to="/auth/login"
            class="w-full py-1.5 sm:py-2 border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-950/30
                   text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-primary-400 font-bold rounded-xl text-xs transition-all cursor-pointer
                   flex items-center justify-center gap-2"
          >
            <LogIn class="w-3.5 h-3.5" />
            <span>لديك حساب بالفعل؟ تسجيل الدخول</span>
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { AlertCircle, ArrowRight, ArrowLeft, LogIn } from 'lucide-vue-next';

// Shared register components
import TraineeTypeSelector from './shared/TraineeTypeSelector.vue';
import RegisterStepper from './shared/RegisterStepper.vue';
import RegisterStep1Account from './shared/RegisterStep1Account.vue';
import RegisterStep3Category from './shared/RegisterStep3Category.vue';

// Adult-specific steps
import RegisterStep2NationalId from './adult/RegisterStep2NationalId.vue';

// Minor-specific steps
import RegisterStep2Minor from './minor/RegisterStep2Minor.vue';
import RegisterStep3Guardian from './minor/RegisterStep3Guardian.vue';

// Store & constants
import { useAuthStore } from '../../stores/authStore';
import { ROLES } from '@/shared/constants/roles';
import { TRAINEE_CATEGORIES } from '@/shared/constants/statuses';
import { extractFromNationalId } from '../../helpers/authConstants';
import { authApi } from '@/api/auth.api';

const router = useRouter();
const authStore = useAuthStore();

// ─── Trainee Type Toggle ───────────────────────────────────────────────────
const traineeType = ref('adult'); // 'adult' | 'minor'
const isAdult = computed(() => traineeType.value === 'adult');
const isMinor = computed(() => traineeType.value === 'minor');

function onTypeChange() {
  currentStep.value = 1;
  errorMsg.value = '';
  extractedInfoNotice.value = '';
}

// ─── Steps Definition ──────────────────────────────────────────────────────
const adultSteps = [
  { number: 1, title: 'البيانات الأساسية' },
  { number: 2, title: 'بيانات البطاقة' },
  { number: 3, title: 'الفئة والمستندات' },
];

const minorSteps = [
  { number: 1, title: 'البيانات الأساسية' },
  { number: 2, title: 'بيانات القاصر' },
  { number: 3, title: 'بيانات ولي الأمر' },
  { number: 4, title: 'الفئة والمستندات' },
];

const currentSteps = computed(() => (isAdult.value ? adultSteps : minorSteps));
const maxStep = computed(() => (isAdult.value ? 3 : 4));

// ─── State ─────────────────────────────────────────────────────────────────
const currentStep = ref(1);
const isLoading = ref(false);
const errorMsg = ref('');
const extractedInfoNotice = ref('');

// ─── Form Data ─────────────────────────────────────────────────────────────
const form = ref({
  // Users table
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  profilePhoto: null,

  // TraineeProfiles — Adult fields (nullable for minor)
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
  agreeTerms: false,

  // TraineeProfiles — Minor-only fields
  isMinor: false,
  birthCertPhoto: null,
  educationStage: 'Preparatory',
  schoolGrade: '',
  schoolName: '',

  // Guardians table fields
  guardianName: '',
  guardianRelationship: 'Father',
  guardianNationalId: '',
  guardianPhone: '',
  guardianFrontPhoto: null,
  guardianBackPhoto: null,
});

// ─── Image Previews ────────────────────────────────────────────────────────
const profilePhotoPreview = ref('');
const frontPhotoPreview = ref('');
const backPhotoPreview = ref('');
const categoryProofPreview = ref('');
const birthCertPreview = ref('');
const guardianFrontPreview = ref('');
const guardianBackPreview = ref('');

// ─── Image Handlers ────────────────────────────────────────────────────────
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
function handleBirthCert({ file, previewUrl }) {
  form.value.birthCertPhoto = file;
  birthCertPreview.value = previewUrl;
}
function handleGuardianFront({ file, previewUrl }) {
  form.value.guardianFrontPhoto = file;
  guardianFrontPreview.value = previewUrl;
}
function handleGuardianBack({ file, previewUrl }) {
  form.value.guardianBackPhoto = file;
  guardianBackPreview.value = previewUrl;
}

// ─── Auto-extraction from National ID ─────────────────────────────────────
function onNationalIdInput() {
  extractedInfoNotice.value = '';
  const result = extractFromNationalId(form.value.nationalId);
  if (result) {
    form.value.dateOfBirth = result.dateOfBirth;
    form.value.gender = result.gender;
    extractedInfoNotice.value = 'تم استخراج الميلاد والنوع تلقائياً';
  }
}

function onMinorNationalIdInput() {
  extractedInfoNotice.value = '';
  const result = extractFromNationalId(form.value.nationalId);
  if (result) {
    form.value.dateOfBirth = result.dateOfBirth;
    form.value.gender = result.gender;
    extractedInfoNotice.value = 'تم استخراج الميلاد والنوع تلقائياً';
  }
}

// ─── Validation Per Step ───────────────────────────────────────────────────
function validateCurrentStep() {
  errorMsg.value = '';

  // Step 1: Basic Account
  if (currentStep.value === 1) {
    if (!form.value.fullName || form.value.fullName.trim().length < 3) {
      errorMsg.value = 'يرجى إدخال الاسم كاملاً (3 أحرف على الأقل).';
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

  // Step 2 — Adult: National ID data
  if (isAdult.value && currentStep.value === 2) {
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

  // Step 2 — Minor: Minor data & birth cert
  if (isMinor.value && currentStep.value === 2) {
    if (!form.value.dateOfBirth) {
      errorMsg.value = 'يرجى تحديد تاريخ ميلاد الطفل.';
      return false;
    }
    if (!form.value.birthCertPhoto && !birthCertPreview.value) {
      errorMsg.value = 'يرجى رفع صورة شهادة الميلاد المميكنة.';
      return false;
    }
    if (!form.value.educationStage) {
      errorMsg.value = 'يرجى اختيار المرحلة الدراسية.';
      return false;
    }
    if (!form.value.schoolGrade) {
      errorMsg.value = 'يرجى إدخال الصف الدراسي.';
      return false;
    }
    if (!form.value.schoolName) {
      errorMsg.value = 'يرجى إدخال اسم المدرسة.';
      return false;
    }
    if (!form.value.governorate) {
      errorMsg.value = 'يرجى اختيار المحافظة.';
      return false;
    }
    if (!form.value.address) {
      errorMsg.value = 'يرجى إدخال العنوان.';
      return false;
    }
    return true;
  }

  // Step 3 — Adult: Category & documents
  if (isAdult.value && currentStep.value === 3) {
    return validateCategoryStep();
  }

  // Step 3 — Minor: Guardian data
  if (isMinor.value && currentStep.value === 3) {
    if (!form.value.guardianName || form.value.guardianName.trim().length < 3) {
      errorMsg.value = 'يرجى إدخال اسم ولي الأمر كاملاً.';
      return false;
    }
    if (!form.value.guardianNationalId || form.value.guardianNationalId.length < 14) {
      errorMsg.value = 'يرجى إدخال الرقم القومي لولي الأمر (14 رقماً).';
      return false;
    }
    if (!form.value.guardianPhone || form.value.guardianPhone.trim().length < 8) {
      errorMsg.value = 'يرجى إدخال رقم هاتف ولي الأمر.';
      return false;
    }
    if (!form.value.guardianFrontPhoto && !guardianFrontPreview.value) {
      errorMsg.value = 'يرجى رفع صورة وجه بطاقة ولي الأمر.';
      return false;
    }
    if (!form.value.guardianBackPhoto && !guardianBackPreview.value) {
      errorMsg.value = 'يرجى رفع صورة ظهر بطاقة ولي الأمر.';
      return false;
    }
    return true;
  }

  // Step 4 — Minor: Category & documents
  if (isMinor.value && currentStep.value === 4) {
    return validateCategoryStep();
  }

  return true;
}

function validateCategoryStep() {
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

// ─── Navigation ────────────────────────────────────────────────────────────
function handleNextOrSubmit() {
  if (!validateCurrentStep()) return;

  if (currentStep.value < maxStep.value) {
    currentStep.value++;
  } else {
    submitRegistration();
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
    errorMsg.value = '';
  }
}

function goToStep(stepNum) {
  if (stepNum < currentStep.value) {
    currentStep.value = stepNum;
    errorMsg.value = '';
  }
}

// ─── Submit ────────────────────────────────────────────────────────────────
async function submitRegistration() {
  isLoading.value = true;
  errorMsg.value = '';

  form.value.isMinor = isMinor.value;

  try {
    const fd = new FormData();

    // 1. Common Account Info
    fd.append('FullName', form.value.fullName.trim());
    fd.append('Email', form.value.email.trim());
    fd.append('Password', form.value.password);
    fd.append('Phone', form.value.phone.trim());
    fd.append('NationalId', form.value.nationalId.trim());
    fd.append('DateOfBirth', form.value.dateOfBirth);
    fd.append('Gender', form.value.gender || 'Male');
    fd.append('Address', form.value.address.trim());
    fd.append('Governorate', form.value.governorate);
    fd.append('Category', form.value.category || 'Civilian');

    if (form.value.profilePhoto) {
      fd.append('ProfilePhoto', form.value.profilePhoto);
    }
    if (form.value.categoryProofPhoto) {
      fd.append('CategoryProof', form.value.categoryProofPhoto);
    }

    let res;
    if (isAdult.value) {
      // 2. Adult-specific fields
      fd.append('Religion', form.value.religion || 'Muslim');
      fd.append('MaritalStatus', form.value.maritalStatus || 'Single');
      fd.append('Occupation', form.value.occupation.trim());
      fd.append('NationalIdExpiryDate', form.value.nationalIdExpiryDate);
      if (form.value.frontPhoto) {
        fd.append('NationalIdFront', form.value.frontPhoto);
      }
      if (form.value.backPhoto) {
        fd.append('NationalIdBack', form.value.backPhoto);
      }

      res = await authApi.registerAdult(fd);
    } else {
      // 3. Minor-specific fields
      if (form.value.birthCertPhoto) {
        fd.append('BirthCertificate', form.value.birthCertPhoto);
      }
      fd.append('GuardianFullName', form.value.guardianName.trim());
      fd.append('GuardianNationalId', form.value.guardianNationalId.trim());
      fd.append('GuardianPhone', form.value.guardianPhone.trim());
      fd.append('GuardianRelationship', form.value.guardianRelationship || 'Father');
      if (form.value.guardianFrontPhoto) {
        fd.append('GuardianNationalIdFront', form.value.guardianFrontPhoto);
      }
      if (form.value.guardianBackPhoto) {
        fd.append('GuardianNationalIdBack', form.value.guardianBackPhoto);
      }

      res = await authApi.registerMinor(fd);
    }

    if (res?.success && res.data?.token) {
      authStore.setAuth(res.data.token, {
        id: res.data.id,
        fullName: res.data.fullName,
        email: res.data.email,
        role: res.data.role,
        category: form.value.category,
        nationalId: form.value.nationalId,
        isMinor: isMinor.value,
        profilePhotoPath: res.data.profilePhotoPath,
      });

      router.push(authStore.defaultHomePath);
    } else {
      errorMsg.value = res?.message || 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً.';
    }
  } catch (err) {
    const apiError = err.response?.data;
    if (apiError?.data && typeof apiError.data === 'object') {
      const firstFieldErr = Object.values(apiError.data)[0];
      errorMsg.value = Array.isArray(firstFieldErr) ? firstFieldErr[0] : apiError.message;
    } else if (apiError?.message) {
      errorMsg.value = apiError.message;
    } else if (err.code === 'ERR_NETWORK') {
      errorMsg.value = 'تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الـ Backend.';
    } else {
      errorMsg.value = 'حدث خطأ أثناء إرسال بيانات التسجيل، يرجى مراجعة المدخلات.';
    }
  } finally {
    isLoading.value = false;
  }
}

</script>
