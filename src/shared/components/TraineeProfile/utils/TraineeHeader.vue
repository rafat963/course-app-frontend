<template>
  <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
    <!-- السطر العلوي: زر العودة التفاعلي والتنقل السريع -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
      <button
        type="button"
        class="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
        @click="$emit('back')"
      >
        <ArrowRight class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span>{{ backLabel }}</span>
      </button>

      <span class="text-xs text-slate-400 font-bold hidden sm:inline-block">
        سجل وبيانات الدارس الأكاديمية والمدنية
      </span>
    </div>

    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <!-- 1. صورة الدارس والبيانات الرئيسية -->
      <div class="flex items-center gap-4">
        <!-- الصورة الشخصية مع إطار متدرج -->
        <div class="relative shrink-0">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-tr from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-700 shadow-md">
            <div class="w-full h-full bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                v-if="trainee.profilePhotoPath"
                :src="resolveImageUrl(trainee.profilePhotoPath)"
                :alt="trainee.fullName"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xl sm:text-2xl font-black text-primary-700 dark:text-primary-300">
                {{ initials }}
              </span>
            </div>
          </div>
          <span
            class="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs"
            title="دارس نشط بالمنظومة"
          ></span>
        </div>

        <!-- تفاصيل الاسم، الرقم القومي، الفئة -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ trainee.fullName }}
            </h1>
            <!-- شارة الفئة -->
            <span
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs"
              :class="categoryInfo.class"
            >
              {{ categoryInfo.label }}
            </span>
          </div>

          <div class="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-y-1 gap-x-3 font-medium">
            <span class="flex items-center gap-1 font-mono">
              <CreditCard class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>{{ trainee.nationalId }}</span>
            </span>
            <span>•</span>
            <span class="font-mono text-amber-600 dark:text-amber-400 font-bold">#TRN-{{ trainee.id }}</span>
            <span>•</span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">#USR-{{ trainee.userId || trainee.id }}</span>
            <span>•</span>
            <span class="flex items-center gap-1 font-mono">
              <Phone class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ trainee.phone }}</span>
            </span>
            <span>•</span>
            <span class="flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ trainee.governorate }}</span>
            </span>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Briefcase class="w-3.5 h-3.5 text-slate-400" />
            <span>{{ trainee.occupation }}</span>
          </p>
        </div>
      </div>

      <!-- 2. أزرار الإجراءات (مستندات الهوية + طباعة السجل) بدون الدروبداون -->
      <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto self-end lg:self-center">
        <!-- زر استعراض البطاقة الشخصية ومستندات الهوية -->
        <button
          type="button"
          class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0"
          title="معاينة بطاقة الرقم القومي والمستندات"
          @click="$emit('open-id-card')"
        >
          <IdCard class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>مستندات الهوية</span>
        </button>

        <!-- زر طباعة السجل التدريبي -->
        <button
          type="button"
          class="h-10 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md shrink-0"
          title="طباعة السجل التدريبي الكامل للدارس"
          @click="$emit('print-profile')"
        >
          <Printer class="w-4 h-4" />
          <span>طباعة السجل</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { resolveImageUrl } from '@/shared/helpers/formatters';
import { computed } from 'vue';
import {
  CreditCard,
  Phone,
  MapPin,
  Briefcase,
  IdCard,
  Printer,
  ArrowRight,
} from 'lucide-vue-next';
import { APPLICANT_CATEGORIES } from '../helpers/traineeProfileConstants';

const props = defineProps({
  trainee: {
    type: Object,
    required: true,
  },
  fromPath: {
    type: String,
    default: '',
  },
});

defineEmits(['open-id-card', 'print-profile', 'back']);

const initials = computed(() => {
  if (!props.trainee?.fullName) return 'د';
  const parts = props.trainee.fullName.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return props.trainee.fullName.slice(0, 2);
});

const categoryInfo = computed(() => {
  return (
    APPLICANT_CATEGORIES[props.trainee?.category] || {
      label: props.trainee?.category || 'مدني',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
});

const backLabel = computed(() => {
  if (!props.fromPath) return 'العودة للصفحة السابقة';
  if (props.fromPath.includes('applicants')) return 'العودة لطلبات المتقدمين';
  if (props.fromPath.includes('pending-payment')) return 'العودة لطلبات في انتظار السداد';
  if (props.fromPath.includes('completed')) return 'العودة للطلبات المكتملة';
  if (props.fromPath.includes('gate-attendance')) return 'العودة لحضور البوابة';
  return 'العودة للصفحة السابقة';
});
</script>
