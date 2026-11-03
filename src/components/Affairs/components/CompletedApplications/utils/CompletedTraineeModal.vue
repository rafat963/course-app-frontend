<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
      <!-- ترويسة المودال -->
      <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 flex items-center justify-center shrink-0">
            <User class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                ملف بيانات الدارس
              </h3>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                :class="getCategoryBadge(application.trainee?.category).class"
              >
                {{ getCategoryBadge(application.trainee?.category).label }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              بيانات الرقم القومي، المستندات المرفقة، ومعلومات التواصل المعتمدة
            </p>
          </div>
        </div>
        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- محتوى التمرير لبيانات المتدرب -->
      <div class="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar text-sm">
        <!-- كارت الهوية الأساسي -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <!-- الصورة الشخصية -->
          <div class="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
            <img
              v-if="application.trainee?.profilePhotoPath"
              :src="application.trainee.profilePhotoPath"
              :alt="application.trainee.fullName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xl font-bold text-primary-700 dark:text-primary-300">
              {{ getInitials(application.trainee?.fullName) }}
            </span>
          </div>

          <!-- تفاصيل سريعة -->
          <div class="space-y-1.5 text-center sm:text-right flex-1">
            <h4 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              {{ application.trainee?.fullName }}
            </h4>
            <div class="font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              الرقم القومي: <strong class="text-slate-800 dark:text-slate-200">{{ application.trainee?.nationalId }}</strong>
            </div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span>{{ application.trainee?.occupation || 'مهنة غير محددة' }}</span>
              <span>•</span>
              <span>{{ application.trainee?.governorate }}</span>
              <span>•</span>
              <span>{{ application.trainee?.religion === 'Muslim' ? 'مسلم' : 'مسيحي' }}</span>
              <span>•</span>
              <span>{{ application.trainee?.gender === 'Male' ? 'ذكر' : 'أنثى' }}</span>
            </div>
          </div>
        </div>

        <!-- شبكة بيانات البطاقة والمستندات -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <IdCard class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>بيانات بطاقة الرقم القومي والتواصل</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-700 dark:text-slate-200">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">تاريخ الميلاد:</span>
              <strong class="font-mono text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ formatDateOnly(application.trainee?.dateOfBirth) }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">سريان البطاقة حتى:</span>
              <strong class="font-mono text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ formatDateOnly(application.trainee?.nationalIdExpiryDate) }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">رقم الهاتف المحمول:</span>
              <strong class="font-mono text-sm sm:text-base text-primary-700 dark:text-primary-300 mt-0.5 block">{{ application.trainee?.phone }}</strong>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">البريد الإلكتروني:</span>
              <span class="font-medium text-sm sm:text-base mt-0.5 block">{{ application.trainee?.email || '—' }}</span>
            </div>
            <div class="sm:col-span-2">
              <span class="text-slate-500 dark:text-slate-400 block text-xs sm:text-sm font-medium">العنوان المدون بالبطاقة:</span>
              <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-0.5 block">{{ application.trainee?.address }} - محافظة {{ application.trainee?.governorate }}</span>
            </div>
          </div>
        </div>

        <!-- صور المستندات والبطاقة الشخصية -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2 pb-1">
            <FileText class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>صور المستندات الرسمية المرفقة</span>
          </h4>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <!-- وجه البطاقة -->
            <a
              v-if="application.trainee?.nationalIdFrontPhotoPath"
              :href="application.trainee.nationalIdFrontPhotoPath"
              target="_blank"
              class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
            >
              <ExternalLink class="w-4.5 h-4.5 text-primary-600 group-hover:scale-110 transition-transform" />
              <span class="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200">وجه البطاقة</span>
            </a>

            <!-- ظهر البطاقة -->
            <a
              v-if="application.trainee?.nationalIdBackPhotoPath"
              :href="application.trainee.nationalIdBackPhotoPath"
              target="_blank"
              class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
            >
              <ExternalLink class="w-4.5 h-4.5 text-primary-600 group-hover:scale-110 transition-transform" />
              <span class="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200">ظهر البطاقة</span>
            </a>

            <!-- كارنيه إثبات الفئة (إذا وجد) -->
            <a
              v-if="application.trainee?.categoryProofPhotoPath"
              :href="application.trainee.categoryProofPhotoPath"
              target="_blank"
              class="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
            >
              <ExternalLink class="w-4.5 h-4.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span class="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">كارنيه الفئة المعتمد</span>
            </a>

            <!-- شهادة المؤهل -->
            <a
              v-if="application.qualificationPhotoPath"
              :href="application.qualificationPhotoPath"
              target="_blank"
              class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
            >
              <ExternalLink class="w-4.5 h-4.5 text-primary-600 group-hover:scale-110 transition-transform" />
              <span class="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200">شهادة المؤهل</span>
            </a>
          </div>
        </div>
      </div>

      <!-- أسفل المودال -->
      <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق
        </button>
        <div class="flex items-center gap-2">
          <RouterLink
            :to="`/trainee-profile/${application.trainee?.id || 1}`"
            class="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            @click="$emit('close')"
          >
            <ExternalLink class="w-4 h-4 text-primary-400" />
            <span>السجل التدريبي الكامل</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, X, FileText, ExternalLink, Contact as IdCard } from 'lucide-vue-next';
import {
  APPLICANT_CATEGORIES,
  formatDateOnly,
} from '../helpers/completedConstants';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
});

defineEmits(['close', 'switch-to-application']);

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}

function getCategoryBadge(cat) {
  return (
    APPLICANT_CATEGORIES[cat] || {
      label: cat || 'مدني',
      class: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}
</script>
