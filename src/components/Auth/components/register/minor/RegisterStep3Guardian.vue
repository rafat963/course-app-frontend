<template>
  <div class="space-y-2.5">
    <!-- Step Header (emerald accent) -->
    <div class="border-b border-emerald-100 dark:border-emerald-900/40 pb-1.5 mb-2">
      <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <div class="w-4 h-4 rounded-md bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
          <ShieldCheck class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        </div>
        بيانات ومستندات ولي الأمر
      </h2>
      <p class="text-[10.5px] text-slate-400 dark:text-slate-500">
        بيانات ولي الأمر المسؤول عن القاصر لاعتماد التسجيل
      </p>
    </div>

    <!-- Row 1: Guardian Name (2 cols) & Relationship (PrimeVue Select) (1 col) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <div class="space-y-1 text-right sm:col-span-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          اسم ولي الأمر الرباعي <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.guardianName"
          type="text"
          placeholder="محمد أحمد إبراهيم علي"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      <!-- Relationship (PrimeVue Select) -->
      <div class="space-y-1 text-right sm:col-span-1">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          صلة القرابة <span class="text-rose-500">*</span>
        </label>
        <Select
          v-model="form.guardianRelationship"
          :options="GUARDIAN_RELATIONSHIPS"
          option-label="label"
          option-value="value"
          placeholder="صلة القرابة"
          size="small"
          class="w-full !rounded-xl text-xs sm:text-sm"
        />
      </div>
    </div>

    <!-- Row 2: Guardian National ID & Phone (2 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          الرقم القومي لولي الأمر (14 رقم) <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.guardianNationalId"
          type="text"
          maxlength="14"
          placeholder="29901010101234"
          dir="ltr"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm font-mono tracking-wider text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          هاتف ولي الأمر للتواصل <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.guardianPhone"
          type="tel"
          maxlength="11"
          placeholder="01012345678"
          dir="ltr"
          class="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>
    </div>

    <!-- Row 3: Guardian National ID Photos (2 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <ImageUploadBox
        label="وجه بطاقة ولي الأمر"
        :required="true"
        :preview="guardianFrontPreview"
        placeholder-text="رفع وجه البطاقة"
        sub-text="صورة واضحة"
        border-class="border-emerald-300 dark:border-emerald-800/70 hover:border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
        icon-bg-class="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
        @file-change="$emit('guardianFrontUpload', $event)"
      />

      <ImageUploadBox
        label="ظهر بطاقة ولي الأمر"
        :required="true"
        :preview="guardianBackPreview"
        placeholder-text="رفع ظهر البطاقة"
        sub-text="صورة واضحة"
        border-class="border-emerald-300 dark:border-emerald-800/70 hover:border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
        icon-bg-class="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
        @file-change="$emit('guardianBackUpload', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ShieldCheck } from 'lucide-vue-next';
import Select from 'primevue/select';
import ImageUploadBox from '../shared/ImageUploadBox.vue';
import { GUARDIAN_RELATIONSHIPS } from '../../../helpers/authConstants';

defineProps({
  form: {
    type: Object,
    required: true,
  },
  guardianFrontPreview: {
    type: String,
    default: '',
  },
  guardianBackPreview: {
    type: String,
    default: '',
  },
});

defineEmits(['guardianFrontUpload', 'guardianBackUpload']);
</script>
