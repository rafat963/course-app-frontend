<template>
  <div class="space-y-4 select-none">
    <!-- شبكة البيانات المدنية وبطاقة الرقم القومي -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
          <IdCard class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>بيانات بطاقة الرقم القومي والحالة المدنية</span>
        </h3>
        <span
          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
          :class="isExpired ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
        >
          {{ isExpired ? 'البطاقة منتهية السريان' : 'البطاقة سارية' }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <!-- 0. كود المتدرب وكود الحساب (Id / UserId) -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">كود المتدرب والحساب (Id / UserId):</span>
          <div class="flex items-center gap-2 font-mono font-bold">
            <span class="text-amber-600 dark:text-amber-400">#TRN-{{ trainee.id }}</span>
            <span class="text-slate-300 dark:text-slate-600">•</span>
            <span class="text-primary-600 dark:text-primary-400">#USR-{{ trainee.userId || trainee.id }}</span>
          </div>
        </div>

        <!-- 1. الرقم القومي -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">الرقم القومي (14 رقماً):</span>
          <strong class="font-mono text-sm font-black text-slate-800 dark:text-slate-100">
            {{ trainee.nationalId }}
          </strong>
        </div>

        <!-- 2. تاريخ الميلاد والعمر -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">تاريخ الميلاد والسن:</span>
          <div class="flex items-center justify-between">
            <strong class="font-mono text-slate-800 dark:text-slate-100">
              {{ trainee.dateOfBirth }}
            </strong>
            <span class="text-[11px] font-bold text-primary-600 dark:text-primary-400">
              ({{ age }})
            </span>
          </div>
        </div>

        <!-- 3. تاريخ انتهاء البطاقة -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">تاريخ انتهاء سريان البطاقة:</span>
          <strong class="font-mono text-slate-800 dark:text-slate-100" :class="{ 'text-rose-600': isExpired }">
            {{ trainee.nationalIdExpiryDate }}
          </strong>
        </div>

        <!-- 4. النوع والديانة -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">النوع والديانة:</span>
          <strong class="text-slate-800 dark:text-slate-100">
            {{ trainee.gender === 'Male' ? 'ذكر' : 'أنثى' }} • {{ trainee.religion === 'Muslim' ? 'مسلم' : 'مسيحي' }}
          </strong>
        </div>

        <!-- 5. الحالة الاجتماعية -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">الحالة الاجتماعية:</span>
          <strong class="text-slate-800 dark:text-slate-100">
            {{ getMaritalStatusLabel(trainee.maritalStatus) }}
          </strong>
        </div>

        <!-- 6. فئة المتدرب والخصم -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">فئة المتدرب (Category):</span>
          <strong class="text-primary-700 dark:text-primary-300 font-bold">
            {{ getCategoryLabel(trainee.category) }}
          </strong>
        </div>

        <!-- 7. المهنة المدونة بالبطاقة -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span class="text-slate-400 block text-[11px] mb-0.5">المهنة المدونة بالبطاقة:</span>
          <strong class="text-slate-800 dark:text-slate-100 block truncate" :title="trainee.occupation">
            {{ trainee.occupation }}
          </strong>
        </div>

        <!-- 8. العنوان والمحافظة (عمودين) -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 sm:col-span-2">
          <span class="text-slate-400 block text-[11px] mb-0.5">العنوان والمحافظة (تُستخدم لخريطة توزيع القائد):</span>
          <strong class="text-slate-800 dark:text-slate-100">
            {{ trainee.address }} (محافظة {{ trainee.governorate }})
          </strong>
        </div>

        <!-- 9. المؤهل الدراسي -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 sm:col-span-2 lg:col-span-3">
          <span class="text-slate-400 block text-[11px] mb-0.5">المؤهل الدراسي المسجل:</span>
          <strong class="text-slate-800 dark:text-slate-100 block truncate" :title="trainee.qualification">
            {{ trainee.qualification }}
          </strong>
        </div>
      </div>
    </div>

    <!-- معرض صور المستندات الرسمية المرفقة -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
      <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <FileText class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span>المستندات المرفقة والمصورة (انقر للمعاينة بحجم كامل)</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <!-- 1. وجه البطاقة -->
        <div
          class="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-primary-500 cursor-pointer transition-all group"
          @click="$emit('preview-doc', { title: 'وجه بطاقة الرقم القومي', url: trainee.nationalIdFrontPhotoPath })"
        >
          <div class="h-28 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative mb-2">
            <img
              v-if="trainee.nationalIdFrontPhotoPath"
              :src="trainee.nationalIdFrontPhotoPath"
              alt="وجه البطاقة"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Eye class="w-5 h-5" />
            </div>
          </div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center">
            وجه بطاقة الرقم القومي
          </span>
        </div>

        <!-- 2. ظهر البطاقة -->
        <div
          class="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-primary-500 cursor-pointer transition-all group"
          @click="$emit('preview-doc', { title: 'ظهر بطاقة الرقم القومي', url: trainee.nationalIdBackPhotoPath })"
        >
          <div class="h-28 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative mb-2">
            <img
              v-if="trainee.nationalIdBackPhotoPath"
              :src="trainee.nationalIdBackPhotoPath"
              alt="ظهر البطاقة"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Eye class="w-5 h-5" />
            </div>
          </div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center">
            ظهر بطاقة الرقم القومي
          </span>
        </div>

        <!-- 3. شهادة المؤهل -->
        <div
          class="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-primary-500 cursor-pointer transition-all group"
          @click="$emit('preview-doc', { title: 'شهادة المؤهل الدراسي', url: trainee.qualificationPhotoPath })"
        >
          <div class="h-28 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative mb-2">
            <img
              v-if="trainee.qualificationPhotoPath"
              :src="trainee.qualificationPhotoPath"
              alt="شهادة المؤهل"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Eye class="w-5 h-5" />
            </div>
          </div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center">
            شهادة المؤهل الدراسي
          </span>
        </div>

        <!-- 4. كارنيه إثبات الفئة إن وجد -->
        <div
          v-if="trainee.categoryProofPhotoPath"
          class="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-primary-500 cursor-pointer transition-all group"
          @click="$emit('preview-doc', { title: 'كارنيه إثبات الفئة / الخصم', url: trainee.categoryProofPhotoPath })"
        >
          <div class="h-28 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative mb-2">
            <img
              :src="trainee.categoryProofPhotoPath"
              alt="كارنيه الفئة"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Eye class="w-5 h-5" />
            </div>
          </div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center">
            كارنيه إثبات الفئة
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IdCard, FileText, Eye } from 'lucide-vue-next';
import { calculateAge, isIdExpired } from '../helpers/traineeProfileConstants';

const props = defineProps({
  trainee: {
    type: Object,
    required: true,
  },
});

defineEmits(['preview-doc']);

const age = computed(() => calculateAge(props.trainee?.dateOfBirth));
const isExpired = computed(() => isIdExpired(props.trainee?.nationalIdExpiryDate));

function getMaritalStatusLabel(status) {
  const map = {
    Single: 'أعزب / آنسة',
    Married: 'متزوج',
    Divorced: 'مطلق',
    Widowed: 'أرمل',
  };
  return map[status] || status || '—';
}

function getCategoryLabel(category) {
  const map = {
    Civilian: 'مدني (السعر الكامل)',
    MilitaryOfficer: 'ضابط ق.م (خصم 50%)',
    MilitaryFamily: 'عائلات ضباط ق.م (خصم 30%)',
    PoliceOfficerOrFamily: 'شرطة / عائلاتهم (خصم 30%)',
  };
  return map[category] || category || '—';
}
</script>
