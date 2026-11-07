<template>
  <div class="space-y-2.5">
    <!-- Step Header (amber accent) -->
    <div class="border-b border-amber-100 dark:border-amber-900/40 pb-1.5 mb-2">
      <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <div class="w-4 h-4 rounded-md bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
          <Baby class="w-3 h-3 text-amber-600 dark:text-amber-400" />
        </div>
        بيانات القاصر ومستنداته
      </h2>
      <p class="text-[10.5px] text-slate-400 dark:text-slate-500">بيانات الطفل وشهادة الميلاد والمدرسة</p>
    </div>

    <!-- National ID (optional for minors) & Birth Certificate Upload (Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <!-- National ID (optional) -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>الرقم القومي (14 رقم) <span class="text-[10px] font-normal text-slate-400">(اختياري)</span></span>
          <span v-if="extractedInfoNotice" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {{ extractedInfoNotice }}
          </span>
        </label>
        <input
          v-model="form.nationalId"
          type="text"
          maxlength="14"
          placeholder="29901010101234"
          dir="ltr"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm font-mono tracking-wider text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-400/10"
          @input="$emit('nationalIdInput')"
        />
        <p class="text-[9.5px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
          <Info class="w-3 h-3 shrink-0" />
          مطبوع في شهادة الميلاد المميكنة إن وُجد.
        </p>
      </div>

      <!-- Birth Certificate Photo Upload -->
      <ImageUploadBox
        label="صورة شهادة الميلاد المميكنة"
        :required="true"
        :preview="birthCertPreview"
        placeholder-text="رفع شهادة الميلاد"
        sub-text="صورة واضحة"
        border-class="border-amber-300 dark:border-amber-700/60 hover:border-amber-400 bg-amber-50/40 dark:bg-amber-950/20"
        icon-bg-class="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        @file-change="$emit('birthCertUpload', $event)"
      />
    </div>

    <!-- Row: Date of Birth, Gender (PrimeVue), Education Stage (PrimeVue) (3 Columns) -->
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
                 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-400/10"
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

      <!-- Education Stage (PrimeVue Select) -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          المرحلة الدراسية <span class="text-rose-500">*</span>
        </label>
        <Select
          v-model="form.educationStage"
          :options="EDUCATION_STAGES"
          option-label="label"
          option-value="value"
          placeholder="اختر المرحلة"
          size="small"
          class="w-full !rounded-xl text-xs sm:text-sm"
        />
      </div>
    </div>

    <!-- Row: School Grade & School Name (2 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          الصف الدراسي <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.schoolGrade"
          type="text"
          placeholder="مثال: الثاني الإعدادي"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-400/10"
        />
      </div>

      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          اسم المدرسة <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.schoolName"
          type="text"
          placeholder="اسم المدرسة..."
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-400/10"
        />
      </div>
    </div>

    <!-- Row: Governorate (PrimeVue Select with Search Filter) & Address (3 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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

      <div class="space-y-1 text-right sm:col-span-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          العنوان <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.address"
          type="text"
          placeholder="رقم العقار، اسم الشارع، الحي"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-400/10"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Baby, Info } from 'lucide-vue-next';
import Select from 'primevue/select';
import ImageUploadBox from '../shared/ImageUploadBox.vue';
import {
  EGYPTIAN_GOVERNORATES,
  GENDER_OPTIONS,
  EDUCATION_STAGES,
} from '../../../helpers/authConstants';

defineProps({
  form: {
    type: Object,
    required: true,
  },
  birthCertPreview: {
    type: String,
    default: '',
  },
  extractedInfoNotice: {
    type: String,
    default: '',
  },
});

defineEmits(['nationalIdInput', 'birthCertUpload']);
</script>
