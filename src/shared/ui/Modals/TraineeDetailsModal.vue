<template>
  <div
    v-if="isOpen && trainee"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-in">
      <!-- 1. ترويسة المودال الموحدة -->
      <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <!-- الصورة الشخصية للدارس -->
          <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
            <img
              v-if="trainee.profilePhotoPath"
              :src="trainee.profilePhotoPath"
              :alt="trainee.fullName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-sm font-black text-primary-700 dark:text-primary-300">
              {{ initials }}
            </span>
          </div>

          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {{ trainee.fullName }}
              </h3>
              <!-- شارة الفئة المعتمدة -->
              <span
                class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shadow-2xs"
                :class="categoryBadge.class"
              >
                {{ categoryBadge.label }}
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2 font-bold">
              <span class="font-mono">الرقم القومي: {{ trainee.nationalId }}</span>
              <span>•</span>
              <span class="font-mono text-amber-600 dark:text-amber-400">#TRN-{{ trainee.id }}</span>
              <span>•</span>
              <span class="font-mono text-primary-600 dark:text-primary-400">#USR-{{ trainee.userId || trainee.id }}</span>
              <span>•</span>
              <span class="font-mono">{{ trainee.phone }}</span>
              <span>•</span>
              <span>{{ trainee.governorate }}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          title="إغلاق النافذة"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 2. محتوى التمرير للمودال: بيانات المتدرب الشخصية ومستنداته فقط -->
      <div class="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar text-sm">
        <!-- أ. شبكة بيانات البطاقة المدنية والتواصل -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <h4 class="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
              <IdCard class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              <span>بيانات بطاقة الرقم القومي والحالة المدنية</span>
            </h4>
            <span
              class="px-3 py-1 rounded-full text-xs font-bold border"
              :class="isIdExpired ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
            >
              {{ isIdExpired ? 'البطاقة منتهية' : 'البطاقة سارية' }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">الرقم القومي (14 رقماً):</span>
              <strong class="font-mono font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg">{{ trainee.nationalId }}</strong>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">تاريخ الميلاد والسن:</span>
              <span class="font-mono font-bold">{{ formatDate(trainee.dateOfBirth) }}</span>
              <span v-if="trainee.dateOfBirth" class="text-primary-600 dark:text-primary-400 mr-1 font-bold">({{ age }})</span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">سريان البطاقة حتى:</span>
              <span class="font-mono font-bold" :class="{ 'text-rose-600': isIdExpired }">
                {{ formatDate(trainee.nationalIdExpiryDate) }}
              </span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">النوع والديانة:</span>
              <span class="font-bold">
                {{ trainee.gender === 'Male' ? 'ذكر' : 'أنثى' }} • {{ trainee.religion === 'Muslim' ? 'مسلم' : 'مسيحي' }}
              </span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">الحالة الاجتماعية:</span>
              <span class="font-bold">{{ getMaritalStatusLabel(trainee.maritalStatus) }}</span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">المهنة المدونة بالبطاقة:</span>
              <span class="font-bold truncate block" :title="trainee.occupation">{{ trainee.occupation || '—' }}</span>
            </div>

            <div class="sm:col-span-2">
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">العنوان المدون بالبطاقة:</span>
              <span class="font-bold">{{ trainee.address }} (محافظة {{ trainee.governorate }})</span>
            </div>

            <div>
              <span class="text-slate-400 dark:text-slate-500 block text-xs font-bold">رقم الهاتف للتواصل:</span>
              <span class="font-mono font-bold text-primary-700 dark:text-primary-300 text-sm sm:text-base">{{ trainee.phone }}</span>
            </div>
          </div>
        </div>

        <!-- ج. معرض المستندات المصورة المرفقة -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <h4 class="font-black text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700">
            <FileText class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>المستندات الرسمية المصورة المرفقة (انقر لتكبير أي مستند)</span>
          </h4>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <!-- وجه البطاقة -->
            <div
              class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 cursor-pointer transition-all group"
              @click="activePreviewUrl = trainee.nationalIdFrontPhotoPath; previewTitle = 'وجه بطاقة الرقم القومي'"
            >
              <div class="h-20 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden relative mb-1.5 flex items-center justify-center">
                <img
                  v-if="trainee.nationalIdFrontPhotoPath"
                  :src="trainee.nationalIdFrontPhotoPath"
                  alt="وجه البطاقة"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <IdCard v-else class="w-6 h-6 text-slate-400" />
                <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye class="w-4 h-4" />
                </div>
              </div>
              <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 block text-center truncate">
                وجه البطاقة
              </span>
            </div>

            <!-- ظهر البطاقة -->
            <div
              class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 cursor-pointer transition-all group"
              @click="activePreviewUrl = trainee.nationalIdBackPhotoPath; previewTitle = 'ظهر بطاقة الرقم القومي'"
            >
              <div class="h-20 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden relative mb-1.5 flex items-center justify-center">
                <img
                  v-if="trainee.nationalIdBackPhotoPath"
                  :src="trainee.nationalIdBackPhotoPath"
                  alt="ظهر البطاقة"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <IdCard v-else class="w-6 h-6 text-slate-400" />
                <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye class="w-4 h-4" />
                </div>
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center truncate">
                ظهر البطاقة
              </span>
            </div>

            <!-- شهادة المؤهل -->
            <div
              class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 cursor-pointer transition-all group"
              @click="activePreviewUrl = trainee.qualificationPhotoPath || application?.qualificationPhotoPath; previewTitle = 'شهادة المؤهل الدراسي'"
            >
              <div class="h-20 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden relative mb-1.5 flex items-center justify-center">
                <img
                  v-if="trainee.qualificationPhotoPath || application?.qualificationPhotoPath"
                  :src="trainee.qualificationPhotoPath || application?.qualificationPhotoPath"
                  alt="شهادة المؤهل"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <FileText v-else class="w-6 h-6 text-slate-400" />
                <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye class="w-4 h-4" />
                </div>
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center truncate">
                شهادة المؤهل
              </span>
            </div>

            <!-- كارنيه إثبات الفئة -->
            <div
              v-if="trainee.categoryProofPhotoPath"
              class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 cursor-pointer transition-all group"
              @click="activePreviewUrl = trainee.categoryProofPhotoPath; previewTitle = 'كارنيه إثبات الفئة / صلة القرابة'"
            >
              <div class="h-20 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden relative mb-1.5 flex items-center justify-center">
                <img
                  :src="trainee.categoryProofPhotoPath"
                  alt="كارنيه الفئة"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye class="w-4 h-4" />
                </div>
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 block text-center truncate">
                كارنيه إثبات الفئة
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. أسفل المودال: زر الإغلاق وزر السجل الكامل فقط (عرض تفاصيل بدون أي أكشنز تشغيلية) -->
      <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <!-- زر الإغلاق -->
        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer shadow-2xs"
          @click="$emit('close')"
        >
          إغلاق النافذة
        </button>

        <!-- الزر المرجعي: فتح السجل التدريبي الكامل للدارس في صفحة TraineeProfileView -->
        <RouterLink
          :to="profileUrl"
          class="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title="فتح السجل التدريبي الشامل للدارس بكافة دوراته الحالية والسابقة وشهاداته"
          @click="$emit('close')"
        >
          <ExternalLink class="w-4.5 h-4.5 text-primary-400" />
          <span>السجل التدريبي الكامل</span>
        </RouterLink>
      </div>

      <!-- 4. نافذة تكبير المستندات المصورة المنبثقة فوق المودال (Lightbox) -->
      <div
        v-if="activePreviewUrl"
        class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        @click.self="activePreviewUrl = null"
      >
        <div class="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-700 animate-scale-in">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h5 class="text-xs font-bold text-slate-800 dark:text-slate-100">
              {{ previewTitle }}
            </h5>
            <button
              type="button"
              class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              @click="activePreviewUrl = null"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="p-3 flex items-center justify-center max-h-[70vh] overflow-hidden">
            <img
              :src="activePreviewUrl"
              :alt="previewTitle"
              class="max-w-full max-h-[65vh] object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  X,
  ExternalLink,
  IdCard,
  FileText,
  Eye,
} from 'lucide-vue-next';

const route = useRoute();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
  trainee: {
    type: Object,
    default: null,
  },
  log: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

const activePreviewUrl = ref(null);
const previewTitle = ref('');

// استخلاص كائن المتدرب بشكل موحد سواء تم تمرير تطبيق أو سجل أو متدرب
const trainee = computed(() => {
  return props.trainee || props.application?.trainee || props.log?.trainee || null;
});

// الأحرف الأولى للأفاتار
const initials = computed(() => {
  if (!trainee.value?.fullName) return 'م';
  const parts = trainee.value.fullName.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return trainee.value.fullName.slice(0, 2);
});

// شارة الفئة
const categoryBadge = computed(() => {
  const cat = trainee.value?.category;
  const map = {
    Civilian: { label: 'مدني', class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200' },
    MilitaryOfficer: { label: 'ضابط ق.م', class: 'bg-primary-50 text-primary-800 dark:bg-primary-950/70 dark:text-primary-300 border-primary-200' },
    MilitaryFamily: { label: 'عائلات ضباط ق.م', class: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200' },
    PoliceOfficerOrFamily: { label: 'شرطة / عائلاتهم', class: 'bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200' },
  };
  return map[cat] || { label: cat || 'مدني', class: 'bg-slate-100 text-slate-700 border-slate-200' };
});

// عمر المتدرب
const age = computed(() => {
  if (!trainee.value?.dateOfBirth) return '';
  const birth = new Date(trainee.value.dateOfBirth);
  const now = new Date();
  let a = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) a--;
  return `${a} سنة`;
});

// سريان البطاقة
const isIdExpired = computed(() => {
  if (!trainee.value?.nationalIdExpiryDate) return false;
  return new Date(trainee.value.nationalIdExpiryDate) < new Date();
});

// مسار الرابط لسجل المتدرب مع باراميتر العودة للصفحة السابقة (?from=...)
const profileUrl = computed(() => {
  const id = trainee.value?.id || 1;
  const from = encodeURIComponent(route.fullPath);
  return `/trainee-profile/${id}?from=${from}`;
});

// دوال التنسيق
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getMaritalStatusLabel(status) {
  const map = {
    Single: 'أعزب / آنسة',
    Married: 'متزوج',
    Divorced: 'مطلق',
    Widowed: 'أرمل',
  };
  return map[status] || status || '—';
}
</script>
