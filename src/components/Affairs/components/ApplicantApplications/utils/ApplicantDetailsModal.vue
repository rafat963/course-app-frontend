<template>
  <div
    v-if="isOpen && application"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-fade-in"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-right transition-all"
      dir="rtl"
    >
      <!-- رأس المودال -->
      <div class="px-5 sm:px-6 py-4.5 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/80">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold shadow-xs shrink-0">
            <UserCheck class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                ملف المتقدم • {{ application.trainee?.fullName }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                :class="categoryInfo.class"
              >
                {{ categoryInfo.label }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              رقم الطلب: <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ application.code }}</span> • قُدم في {{ formatDateTime(application.createdAt) }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
          @click="$emit('close')"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- محتوى المودال القابل للتمرير -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-sm">
        
        <!-- 1. بطاقة الدورة المتقدم إليها -->
        <div class="p-4 sm:p-5 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/60">
          <div class="flex items-center justify-between pb-2.5 border-b border-primary-100/70 dark:border-primary-900/40 mb-3.5">
            <div class="flex items-center gap-2 text-primary-800 dark:text-primary-300 font-bold text-sm sm:text-base">
              <BookOpen class="w-4.5 h-4.5" />
              <span>بيانات الدورة التدريبية المختارة</span>
            </div>
            <span class="px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 font-bold text-xs sm:text-sm border border-primary-200 dark:border-primary-800">
              الدفعة رقم {{ application.courseRound?.roundNumber }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">اسم الدورة:</span>
              <span class="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base mt-0.5 block">
                {{ application.courseRound?.courseName }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">المحاضر المسؤول:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.courseRound?.instructorName }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">مكان الانعقاد:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.courseRound?.hallName }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">الرسوم المستحقة للفئة:</span>
              <span class="font-black text-primary-700 dark:text-primary-400 text-base sm:text-lg mt-0.5 block font-mono">
                {{ formatEgyptianCurrency(application.courseRound?.price) }}
              </span>
            </div>
          </div>

          <div class="mt-3.5 pt-3 border-t border-primary-100/60 dark:border-primary-900/40 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>موعد البداية:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ formatDateOnly(application.courseRound?.startDate) }}</strong>
            </span>
            <span class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>موعد الانتهاء:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ formatDateOnly(application.courseRound?.endDate) }}</strong>
            </span>
            <span class="flex items-center gap-1.5">
              <Clock class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>التوقيت:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ formatTime12Hour(application.courseRound?.startTime) }} إلى {{ formatTime12Hour(application.courseRound?.endTime) }}</strong>
            </span>
            <span class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>أيام المحاضرات:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ application.courseRound?.lectureDays?.join(' - ') }}</strong>
            </span>
          </div>
        </div>

        <!-- 2. بيانات الملف الشخصي والبطاقة المدنية -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div class="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3.5 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">
            <IdCard class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>بيانات بطاقة الرقم القومي والملف الشخصي</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">الرقم القومي (14 رقم):</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base mt-0.5 block tracking-wider">
                {{ application.trainee?.nationalId }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">رقم الهاتف للتواصل:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base mt-0.5 block">
                {{ application.trainee?.phone }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">البريد الإلكتروني:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300 text-sm mt-0.5 block truncate">
                {{ application.trainee?.email }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">تاريخ الميلاد:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ formatDateOnly(application.trainee?.dateOfBirth) }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">النوع / الديانة:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.trainee?.gender === 'Male' ? 'ذكر' : 'أنثى' }} • {{ application.trainee?.religion === 'Muslim' ? 'مسلم' : 'مسيحي' }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">الحالة الاجتماعية:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.trainee?.maritalStatus === 'Single' ? 'أعزب' : 'متزوج' }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">المهنة المدونة بالبطاقة:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.trainee?.occupation }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">المحافظة:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.trainee?.governorate }}
              </span>
            </div>
            <div class="sm:col-span-2">
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">العنوان المدون بالبطاقة:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ application.trainee?.address }}
              </span>
            </div>
            <div class="sm:col-span-2">
              <span class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold block">تاريخ انتهاء سريان البطاقة:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base mt-0.5 block">
                {{ formatDateOnly(application.trainee?.nationalIdExpiryDate) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. المستندات والوثائق المرفوعة للمراجعة -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div class="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3.5 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">
            <FileCheck class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>المستندات والوثائق المرفوعة (للتدقيق والمعاينة)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <!-- وجه البطاقة -->
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/60 dark:bg-slate-900/40 text-center">
              <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                وجه البطاقة الشخصية
              </span>
              <div
                class="h-32 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer border border-slate-300/60 dark:border-slate-700"
                @click="openPreview(application.trainee?.nationalIdFrontPhotoPath, 'وجه بطاقة الرقم القومي')"
              >
                <img
                  v-if="application.trainee?.nationalIdFrontPhotoPath"
                  :src="application.trainee.nationalIdFrontPhotoPath"
                  alt="وجه البطاقة"
                  class="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                  <Eye class="w-4 h-4" />
                  <span>معاينة</span>
                </div>
              </div>
            </div>

            <!-- ظهر البطاقة -->
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/60 dark:bg-slate-900/40 text-center">
              <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                ظهر البطاقة الشخصية
              </span>
              <div
                class="h-32 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer border border-slate-300/60 dark:border-slate-700"
                @click="openPreview(application.trainee?.nationalIdBackPhotoPath, 'ظهر بطاقة الرقم القومي')"
              >
                <img
                  v-if="application.trainee?.nationalIdBackPhotoPath"
                  :src="application.trainee.nationalIdBackPhotoPath"
                  alt="ظهر البطاقة"
                  class="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                  <Eye class="w-4 h-4" />
                  <span>معاينة</span>
                </div>
              </div>
            </div>

            <!-- شهادة المؤهل الدراسي -->
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/60 dark:bg-slate-900/40 text-center">
              <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                شهادة المؤهل الدراسي
              </span>
              <div
                class="h-32 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer border border-slate-300/60 dark:border-slate-700"
                @click="openPreview(application.qualificationPhotoPath, 'شهادة المؤهل الدراسي')"
              >
                <img
                  v-if="application.qualificationPhotoPath"
                  :src="application.qualificationPhotoPath"
                  alt="المؤهل الدراسي"
                  class="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                  <Eye class="w-4 h-4" />
                  <span>معاينة</span>
                </div>
              </div>
            </div>

            <!-- إثبات فئة الخصم (إن وجد) -->
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/60 dark:bg-slate-900/40 text-center">
              <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                كارنيه إثبات الفئة
              </span>
              <div
                v-if="application.trainee?.categoryProofPhotoPath"
                class="h-32 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer border border-slate-300/60 dark:border-slate-700"
                @click="openPreview(application.trainee.categoryProofPhotoPath, 'كارنيه إثبات فئة الخصم')"
              >
                <img
                  :src="application.trainee.categoryProofPhotoPath"
                  alt="كارنيه إثبات الفئة"
                  class="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                  <Eye class="w-4 h-4" />
                  <span>معاينة</span>
                </div>
              </div>
              <div
                v-else
                class="h-32 rounded-lg bg-slate-100 dark:bg-slate-800/40 flex flex-col items-center justify-center text-slate-400 text-xs sm:text-sm border border-dashed border-slate-300 dark:border-slate-700"
              >
                <ShieldAlert class="w-6 h-6 mb-1 text-slate-300 dark:text-slate-600" />
                <span>فئة مدنية (لا يتطلب)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- تذييل المودال وأزرار الإجراءات السريعة -->
      <div class="px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/80">
        <button
          type="button"
          class="h-11 px-6 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          @click="$emit('close')"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>

    <!-- نافذة معاينة الصورة بدقة كاملة (Image Lightbox) -->
    <div
      v-if="previewImage.url"
      class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-fade-in"
      @click="previewImage.url = null"
    >
      <div class="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-700">
        <div class="flex items-center justify-between p-2 text-white text-xs font-bold border-b border-slate-800 mb-2">
          <span>{{ previewImage.title }}</span>
          <button
            type="button"
            class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
            @click="previewImage.url = null"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <img
          :src="previewImage.url"
          :alt="previewImage.title"
          class="w-full max-h-[70vh] object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  X,
  UserCheck,
  BookOpen,
  IdCard,
  FileCheck,
  Eye,
  ShieldAlert,
  Calendar,
  Clock,
} from 'lucide-vue-next';
import {
  APPLICANT_CATEGORIES,
  formatEgyptianCurrency,
  formatDateTime,
  formatDateOnly,
} from '../helpers/applicantConstants';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

const previewImage = ref({
  url: null,
  title: '',
});

function openPreview(url, title) {
  if (!url) return;
  previewImage.value = { url, title };
}

const categoryInfo = computed(() => {
  const cat = props.application?.trainee?.category;
  return APPLICANT_CATEGORIES[cat] || {
    label: cat || 'مدني',
    class: 'bg-slate-100 text-slate-700 border-slate-200',
  };
});
</script>
