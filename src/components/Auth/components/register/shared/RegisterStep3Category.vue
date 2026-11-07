<template>
  <div class="space-y-3">
    <!-- Step Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
      <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <Award class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        فئة المتدرب ونسبة الخصم المعتمدة
      </h2>
      <p class="text-[10.5px] text-slate-400 dark:text-slate-500">حدد فئتك بدقة للاستفادة من أسعار وخصومات معهد نظم المعلومات</p>
    </div>

    <!-- Categories Radio Selection Cards (2 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <label
        v-for="cat in categoryOptions"
        :key="cat.value"
        class="relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between"
        :class="[
          form.category === cat.value
            ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/25 shadow-2xs'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-1.5">
            <input
              v-model="form.category"
              type="radio"
              :value="cat.value"
              class="w-3.5 h-3.5 text-primary-600 dark:bg-slate-800 focus:ring-primary-500"
            />
            <span class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ cat.label }}</span>
          </div>
          <span
            class="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full border"
            :class="cat.badgeClass"
          >
            {{ cat.discount }}
          </span>
        </div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pr-5 leading-tight">
          {{ cat.desc }}
        </p>
      </label>
    </div>

    <!-- Category Proof Document Upload (Mandatory if non-Civilian) -->
    <div
      v-if="form.category !== 'Civilian'"
      class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5 transition-all"
    >
      <div class="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
        <ShieldAlert class="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <h3 class="text-xs font-bold">مطلوب إثبات فئة الخصم (كارنيه أو بطاقة علاجية) <span class="text-rose-500">*</span></h3>
        </div>
      </div>

      <ImageUploadBox
        label=""
        height-class="h-16"
        :preview="categoryProofPreview"
        placeholder-text="رفع صورة كارنيه / إثبات الفئة"
        sub-text="صورة واضحة لاعتماد الخصم"
        border-class="border-amber-300 dark:border-amber-800/70 hover:border-amber-400 bg-white dark:bg-slate-800"
        icon-bg-class="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
        @file-change="$emit('categoryProofUpload', $event)"
      />
    </div>

    <!-- Terms & Confirmation Checkbox -->
    <div class="pt-1">
      <label class="flex items-start gap-2 cursor-pointer select-none">
        <input
          v-model="form.agreeTerms"
          type="checkbox"
          class="w-3.5 h-3.5 mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span class="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
          أقر بصحة جميع البيانات والمستندات المرفقة، وأتحمل المسؤولية القانونية في حال عدم صحتها، كما أوافق على شروط ولوائح معهد نظم المعلومات للقوات المسلحة.
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { Award, ShieldAlert } from 'lucide-vue-next';
import ImageUploadBox from './ImageUploadBox.vue';
import { TRAINEE_CATEGORY_OPTIONS } from '../../../helpers/authConstants';

defineProps({
  form: {
    type: Object,
    required: true,
  },
  categoryProofPreview: {
    type: String,
    default: '',
  },
});

defineEmits(['categoryProofUpload']);

const categoryOptions = TRAINEE_CATEGORY_OPTIONS;
</script>
