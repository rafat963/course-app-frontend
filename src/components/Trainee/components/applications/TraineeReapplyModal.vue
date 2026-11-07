<template>
  <Teleport to="body">
    <div
      v-if="isOpen && application"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
      dir="rtl"
      @click.self="handleClose"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <!-- 1. رأس المودال -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <RefreshCw class="w-5 h-5 animate-spin-reverse-once" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                  {{ actionConfig.label }}
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {{ actionConfig.badge }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                تعديل وتقديم المستندات المطلوبة لإعادة فحص واعتماد طلب الالتحاق بالدورة
              </p>
            </div>
          </div>

          <button
            type="button"
            class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            @click="handleClose"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- 2. محتوى المودال القابل للتمرير -->
        <div class="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-right">
          <!-- كارت ملخص الدورة وسبب الرفض الحالي -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span class="text-xs font-black text-slate-800 dark:text-slate-100">
                  {{ application.round.courseName }}
                </span>
              </div>
              <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {{ application.round.roundCode }} • كود الطلب: {{ application.applicationCode }}
              </span>
            </div>

            <!-- صندوق سبب الرفض الصادر من شؤون الدارسين -->
            <div class="p-3.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
              <div class="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-200">
                <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
                <span>سبب الرفض الصادر من إدارة شؤون الدارسين:</span>
              </div>
              <p class="text-xs text-rose-900 dark:text-rose-100 font-medium leading-relaxed pr-6">
                {{ application.rejectionReason }}
              </p>
            </div>
          </div>

          <!-- نموذج تعديل ورفع المستندات المطلوبة -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileCheck class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>المستندات المطلوب تعديلها أو تقديمها:</span>
              </h4>
              <RouterLink
                to="/settings"
                class="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                @click="handleClose"
              >
                <span>تعديل في صفحة الإعدادات</span>
                <ExternalLink class="w-3 h-3" />
              </RouterLink>
            </div>

            <!-- 1. صور بطاقة الرقم القومي (وجه وظهر) -->
            <div v-if="actionConfig.needsId || showAllFields" class="space-y-3 p-4 rounded-2xl bg-primary-50/30 dark:bg-primary-950/20 border border-primary-200/60 dark:border-primary-900/40">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CreditCard class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>تعديل صورة بطاقة الرقم القومي (وجه وظهر)</span>
                  <span class="text-rose-500 font-bold">*</span>
                </label>
                <span class="text-[10.5px] text-amber-700 dark:text-amber-400 font-medium">يجب أن تكون الصورة واضحة بالكامل وغير مقتصة</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <!-- وجه البطاقة -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>وجه البطاقة الشخصية</span>
                    <button
                      v-if="form.nationalIdFrontPhotoPath"
                      type="button"
                      class="text-primary-600 hover:underline cursor-pointer flex items-center gap-1"
                      @click="openZoom('وجه بطاقة الرقم القومي', form.nationalIdFrontPhotoPath)"
                    >
                      <Eye class="w-3 h-3" />
                      <span>معاينة</span>
                    </button>
                  </div>

                  <div class="h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden relative group flex items-center justify-center">
                    <img
                      v-if="form.nationalIdFrontPhotoPath"
                      :src="form.nationalIdFrontPhotoPath"
                      alt="وجه البطاقة"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div v-else class="text-center p-2 text-slate-400">
                      <CreditCard class="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                      <span class="text-[11px] block">لم يتم رفع وجه البطاقة</span>
                    </div>

                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                      <label
                        for="reapply-front-card"
                        class="px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Upload class="w-3 h-3" />
                        <span>{{ form.nationalIdFrontPhotoPath ? 'تغيير' : 'رفع' }}</span>
                      </label>
                      <button
                        v-if="form.nationalIdFrontPhotoPath"
                        type="button"
                        class="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                        @click="form.nationalIdFrontPhotoPath = ''"
                      >
                        <Trash2 class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <input
                    id="reapply-front-card"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload($event, 'nationalIdFrontPhotoPath')"
                  />
                </div>

                <!-- ظهر البطاقة -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>ظهر البطاقة الشخصية</span>
                    <button
                      v-if="form.nationalIdBackPhotoPath"
                      type="button"
                      class="text-primary-600 hover:underline cursor-pointer flex items-center gap-1"
                      @click="openZoom('ظهر بطاقة الرقم القومي', form.nationalIdBackPhotoPath)"
                    >
                      <Eye class="w-3 h-3" />
                      <span>معاينة</span>
                    </button>
                  </div>

                  <div class="h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden relative group flex items-center justify-center">
                    <img
                      v-if="form.nationalIdBackPhotoPath"
                      :src="form.nationalIdBackPhotoPath"
                      alt="ظهر البطاقة"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div v-else class="text-center p-2 text-slate-400">
                      <CreditCard class="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                      <span class="text-[11px] block">لم يتم رفع ظهر البطاقة</span>
                    </div>

                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                      <label
                        for="reapply-back-card"
                        class="px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Upload class="w-3 h-3" />
                        <span>{{ form.nationalIdBackPhotoPath ? 'تغيير' : 'رفع' }}</span>
                      </label>
                      <button
                        v-if="form.nationalIdBackPhotoPath"
                        type="button"
                        class="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                        @click="form.nationalIdBackPhotoPath = ''"
                      >
                        <Trash2 class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <input
                    id="reapply-back-card"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload($event, 'nationalIdBackPhotoPath')"
                  />
                </div>
              </div>
            </div>

            <!-- 2. صورة شهادة المؤهل الدراسي -->
            <div v-if="actionConfig.needsQualification || showAllFields" class="space-y-3 p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>تقديم صورة شهادة المؤهل الدراسي</span>
                  <span class="text-rose-500 font-bold">*</span>
                </label>
                <button
                  v-if="form.qualificationPhotoPath"
                  type="button"
                  class="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  @click="openZoom('شهادة المؤهل الدراسي', form.qualificationPhotoPath)"
                >
                  <Eye class="w-3 h-3" />
                  <span>معاينة الشهادة</span>
                </button>
              </div>

              <!-- اسم المؤهل المكتوب إن وُجد -->
              <div>
                <input
                  v-model="form.qualification"
                  type="text"
                  placeholder="المؤهل الدراسي (مثال: بكالوريوس حاسبات ومعلومات / ليسانس آداب)"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-primary-500 transition-all"
                />
              </div>

              <!-- منطقة رفع شهادة المؤهل -->
              <div class="h-32 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700/80 bg-white dark:bg-slate-900 overflow-hidden relative group flex items-center justify-center">
                <img
                  v-if="form.qualificationPhotoPath"
                  :src="form.qualificationPhotoPath"
                  alt="شهادة المؤهل"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div v-else class="text-center p-3 text-slate-400">
                  <GraduationCap class="w-8 h-8 mx-auto mb-1 text-blue-300 dark:text-blue-600" />
                  <span class="text-xs block font-bold text-slate-700 dark:text-slate-300">رفع صورة واضحة لشهادة المؤهل</span>
                  <span class="text-[10px] text-slate-400">JPG أو PNG أو PDF بحد أقصى 5MB</span>
                </div>

                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <label
                    for="reapply-qualification-file"
                    class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Upload class="w-3.5 h-3.5" />
                    <span>{{ form.qualificationPhotoPath ? 'تغيير الشهادة' : 'رفع الشهادة' }}</span>
                  </label>
                  <button
                    v-if="form.qualificationPhotoPath"
                    type="button"
                    class="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                    @click="form.qualificationPhotoPath = ''"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                id="reapply-qualification-file"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileUpload($event, 'qualificationPhotoPath')"
              />
            </div>

            <!-- زر إضافي لإظهار جميع المستندات إن رغب في تحديث شيء آخر -->
            <div class="flex justify-start">
              <button
                type="button"
                class="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1"
                @click="showAllFields = !showAllFields"
              >
                <span>{{ showAllFields ? 'إخفاء المستندات الإضافية' : '+ عرض وتعديل مستندات أخرى' }}</span>
              </button>
            </div>

            <!-- ملاحظة المتدرب الموجهة لشؤون الدارسين -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>ملاحظات إضافية لشؤون الدارسين (اختياري):</span>
                <span class="text-[10px] text-slate-400">لتوضيح ما تم تعديله</span>
              </label>
              <textarea
                v-model="traineeNote"
                rows="2"
                placeholder="مثال: تم إعادة تصوير وجه وظهر البطاقة بجودة عالية، وإرفاق صورة شهادة التخرج الأصلية."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-primary-500 transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 3. تذييل المودال وأزرار الإجراء -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            :disabled="isSubmitting"
            class="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            @click="handleClose"
          >
            إلغاء
          </button>

          <button
            type="button"
            :disabled="isSubmitting"
            class="h-10 px-6 rounded-xl bg-gradient-to-l from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-700/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            @click="handleSubmitReapply"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <RefreshCw v-else class="w-4 h-4" />
            <span>{{ isSubmitting ? 'جاري تحديث البيانات وإعادة إرسال الطلب...' : 'تأكيد التعديل وإعادة التقديم الآن' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- نافذة معاينة الصورة المكبرة -->
    <div
      v-if="zoomModal.isOpen"
      class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      dir="rtl"
      @click.self="zoomModal.isOpen = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ zoomModal.title }}</span>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            @click="zoomModal.isOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="max-h-[60vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 p-2">
          <img :src="zoomModal.url" :alt="zoomModal.title" class="max-h-[55vh] object-contain rounded-lg" />
        </div>
        <button
          type="button"
          class="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
          @click="zoomModal.isOpen = false"
        >
          إغلاق المعاينة
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import {
  RefreshCw,
  X,
  AlertCircle,
  CreditCard,
  GraduationCap,
  Upload,
  Trash2,
  Eye,
  FileCheck,
  ExternalLink,
} from 'lucide-vue-next';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { getRejectionActionConfig } from '../../helpers/traineePortalHelpers';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
  traineeProfile: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'reapplied', 'toast']);

const authStore = useAuthStore();
const isSubmitting = ref(false);
const showAllFields = ref(false);
const traineeNote = ref('');

const form = ref({
  nationalIdFrontPhotoPath: '',
  nationalIdBackPhotoPath: '',
  qualification: '',
  qualificationPhotoPath: '',
});

const actionConfig = computed(() => {
  return getRejectionActionConfig(props.application);
});

// مزامنة البيانات الأولية مع المستخدم الحالي
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      isSubmitting.value = false;
      showAllFields.value = false;
      traineeNote.value = '';
      form.value = {
        nationalIdFrontPhotoPath:
          authStore.user?.nationalIdFrontPhotoPath ||
          props.traineeProfile?.nationalIdFrontPhotoPath ||
          'https://images.unsplash.com/photo-1589330694653-dad6ef019912?w=800&auto=format&fit=crop&q=80',
        nationalIdBackPhotoPath:
          authStore.user?.nationalIdBackPhotoPath ||
          props.traineeProfile?.nationalIdBackPhotoPath ||
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        qualification:
          authStore.user?.qualification ||
          props.traineeProfile?.qualification ||
          'بكالوريوس هندسة الحاسبات ونظم التحكم',
        qualificationPhotoPath:
          authStore.user?.qualificationPhotoPath ||
          props.traineeProfile?.qualificationPhotoPath ||
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      };
    }
  },
  { immediate: true }
);

function handleFileUpload(e, field) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    emit('toast', 'حجم الملف يجب ألا يتجاوز 5 ميجابايت', 'error');
    return;
  }

  const url = URL.createObjectURL(file);
  form.value[field] = url;
  emit('toast', 'تم اختيار الملف بنجاح. اضغط على تأكيد التعديل وإعادة التقديم.');
}

const zoomModal = ref({
  isOpen: false,
  title: '',
  url: '',
});

function openZoom(title, url) {
  if (!url) return;
  zoomModal.value = { isOpen: true, title, url };
}

function handleClose() {
  if (isSubmitting.value) return;
  emit('close');
}

function handleSubmitReapply() {
  if (actionConfig.value.needsId && (!form.value.nationalIdFrontPhotoPath || !form.value.nationalIdBackPhotoPath)) {
    emit('toast', 'يرجى التأكد من رفع صورة واضحة لوجه وظهر البطاقة الشخصية.', 'error');
    return;
  }

  if (actionConfig.value.needsQualification && !form.value.qualificationPhotoPath) {
    emit('toast', 'يرجى رفع صورة شهادة المؤهل الدراسي المطلوبة.', 'error');
    return;
  }

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;

    // 1. تحديث authStore ببيانات الصور الجديدة
    authStore.updateUser({
      nationalIdFrontPhotoPath: form.value.nationalIdFrontPhotoPath,
      nationalIdBackPhotoPath: form.value.nationalIdBackPhotoPath,
      qualification: form.value.qualification,
      qualificationPhotoPath: form.value.qualificationPhotoPath,
    });

    // 2. تحديث كائن الطلب المُعاد تقديمه
    const updatedApplication = {
      ...props.application,
      status: 'UnderReview',
      statusLabel: 'قيد المراجعة لدى الشؤون (مُعاد تقديمه بعد استكمال البيانات)',
      updatedAt: new Date().toISOString(),
      rejectionReason: null,
      traineeNote: traineeNote.value || 'تم استكمال البيانات وتعديل المستندات المطلوبة بنجاح.',
    };

    emit('reapplied', updatedApplication);
    emit('close');
  }, 650);
}
</script>

<style scoped>
@keyframes spin-reverse-once {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.animate-spin-reverse-once {
  animation: spin-reverse-once 0.6s ease-out;
}
</style>
