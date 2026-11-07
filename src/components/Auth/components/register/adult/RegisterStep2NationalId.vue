<template>
  <div class="space-y-2.5">
    <!-- Step Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
      <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <CreditCard class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        بيانات ومستندات بطاقة الرقم القومي
      </h2>
      <p class="text-[10.5px] text-slate-400 dark:text-slate-500">وفقاً لاشتراطات معهد نظم المعلومات للقوات المسلحة</p>
    </div>

    <!-- National ID Number (14 digits) -->
    <div class="space-y-1 text-right">
      <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
        <span>الرقم القومي (14 رقم) <span class="text-rose-500">*</span></span>
        <span v-if="extractedInfoNotice" class="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold">
          {{ extractedInfoNotice }}
        </span>
      </label>
      <input
        v-model="form.nationalId"
        type="text"
        maxlength="14"
        placeholder="29901010101234"
        dir="ltr"
        class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-1.5 text-xs sm:text-sm font-mono tracking-wider text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
               focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
        @input="$emit('nationalIdInput')"
      />
    </div>

    <!-- National ID Front & Back Photo Uploads Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <!-- Front Photo -->
      <ImageUploadBox
        label="صورة وجه البطاقة"
        :required="true"
        :preview="frontPhotoPreview"
        placeholder-text="رفع وجه البطاقة"
        sub-text="صورة واضحة"
        @file-change="$emit('frontPhotoUpload', $event)"
      />

      <!-- Back Photo -->
      <ImageUploadBox
        label="صورة ظهر البطاقة"
        :required="true"
        :preview="backPhotoPreview"
        placeholder-text="رفع ظهر البطاقة"
        sub-text="صورة واضحة للبيانات"
        @file-change="$emit('backPhotoUpload', $event)"
      />
    </div>

    <!-- Row 1: Date of Birth, Gender (PrimeVue), Religion (PrimeVue) (3 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <!-- Date of Birth -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          تاريخ الميلاد <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.dateOfBirth"
          type="date"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
        />
      </div>

      <!-- Gender (PrimeVue Select) -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          النوع <span class="text-rose-500">*</span>
        </label>
        <Select
          v-model="form.gender"
          :options="GENDER_OPTIONS"
          option-label="label"
          option-value="value"
          placeholder="اختر النوع"
          size="small"
          class="w-full !rounded-xl text-xs sm:text-sm"
        />
      </div>

      <!-- Religion (PrimeVue Select) -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          الديانة <span class="text-rose-500">*</span>
        </label>
        <Select
          v-model="form.religion"
          :options="RELIGION_OPTIONS"
          option-label="label"
          option-value="value"
          placeholder="اختر الديانة"
          size="small"
          class="w-full !rounded-xl text-xs sm:text-sm"
        />
      </div>
    </div>

    <!-- Row 2: Marital Status (PrimeVue), Occupation, Expiry Date (3 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <!-- Marital Status (PrimeVue Select) -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          الحالة الاجتماعية <span class="text-rose-500">*</span>
        </label>
        <Select
          v-model="form.maritalStatus"
          :options="MARITAL_STATUS_OPTIONS"
          option-label="label"
          option-value="value"
          placeholder="اختر الحالة"
          size="small"
          class="w-full !rounded-xl text-xs sm:text-sm"
        />
      </div>

      <!-- Occupation -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          المهنة بالبطاقة <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.occupation"
          type="text"
          placeholder="طالب / مهندس / موظف..."
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
        />
      </div>

      <!-- National ID Expiry Date -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          انتهاء البطاقة <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.nationalIdExpiryDate"
          type="date"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition-all
                 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
        />
      </div>
    </div>

    <!-- Row 3: Governorate (PrimeVue with filter) & Detailed Address (3 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <!-- Governorate (PrimeVue Select with Search Filter) -->
      <div class="space-y-1 text-right sm:col-span-1">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          المحافظة <span class="text-rose-500">*</span>
        </label>
        <Select
          v-model="form.governorate"
          :options="EGYPTIAN_GOVERNORATES"
          filter
          placeholder="اختر المحافظة"
          filter-placeholder="ابحث..."
          size="small"
          class="w-full !rounded-xl text-xs sm:text-sm"
        />
      </div>

      <!-- Address -->
      <div class="space-y-1 text-right sm:col-span-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          العنوان المدون بالبطاقة <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.address"
          type="text"
          placeholder="رقم العقار، اسم الشارع، الحي/المنطقة"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { CreditCard } from 'lucide-vue-next';
import Select from 'primevue/select';
import ImageUploadBox from '../shared/ImageUploadBox.vue';
import {
  EGYPTIAN_GOVERNORATES,
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../../../helpers/authConstants';

defineProps({
  form: {
    type: Object,
    required: true,
  },
  frontPhotoPreview: {
    type: String,
    default: '',
  },
  backPhotoPreview: {
    type: String,
    default: '',
  },
  extractedInfoNotice: {
    type: String,
    default: '',
  },
});

defineEmits(['nationalIdInput', 'frontPhotoUpload', 'backPhotoUpload']);
</script>
