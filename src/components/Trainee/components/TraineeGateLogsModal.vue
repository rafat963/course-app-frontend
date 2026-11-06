<template>
  <div
    v-if="isOpen && pass"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- ترويسة المودال -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                سجل حركات الدخول الأمنية (GateLogs)
              </h3>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ pass.round.courseName }} — {{ pass.round.roundCode }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- محتوى سجل الحركات -->
      <div class="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span class="text-[11px] text-slate-400 block">رمز التصريح المشفر (QRToken):</span>
            <span class="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{{ pass.qrToken }}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            تصريح ساري ومعتمد
          </span>
        </div>

        <div class="space-y-2">
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
            <History class="w-4 h-4 text-primary-600" />
            أحدث عمليات المسح على بوابات المعهد:
          </h4>

          <div v-if="logs.length" class="space-y-2.5">
            <div
              v-for="log in logs"
              :key="log.id"
              class="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-2 shadow-2xs"
            >
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs font-black">
                    
                  </div>
                  <span class="font-bold text-slate-800 dark:text-slate-100">{{ log.gateName }}</span>
                </div>
                <span class="font-mono text-[11px] text-slate-400">{{ log.scannedAt }}</span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-700/60">
                <div>
                  <span class="text-slate-400">فرد الأمن المناوب:</span>
                  <span class="font-bold text-slate-700 dark:text-slate-300 mr-1">{{ log.officerName }}</span>
                </div>
                <div>
                  <span class="text-slate-400">قرار المنظومة:</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400 mr-1">{{ log.decision }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-slate-400 space-y-1">
            <Inbox class="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>لم يتم تسجيل مسح أمني لهذا التصريح اليوم بعد.</p>
          </div>
        </div>
      </div>

      <!-- تذييل المودال -->
      <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-end shrink-0">
        <button
          type="button"
          class="h-9 px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          @click="$emit('close')"
        >
          تم، إغلاق السجل
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ShieldCheck, X, History, Inbox } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  pass: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

// محاكاة حركات الدخول الأمنية الحقيقية المتوافقة مع GateLogs في الـ ERD
const logs = computed(() => {
  if (!props.pass) return [];
  return [
    {
      id: 101,
      gateName: 'البوابة رقم 1 — المدخل الرئيسي',
      scannedAt: 'اليوم، 08:42 ص',
      officerName: 'رقيب أول / وليد سامي',
      decision: 'مسموح بالدخول (تصريح ساري)',
    },
    {
      id: 102,
      gateName: 'بوابة رقم 3 — مجمع المعامل التقنية',
      scannedAt: 'الأحد، 08:50 ص',
      officerName: 'مساعد أول / هشام عبد الله',
      decision: 'مسموح بالدخول (تصريح ساري)',
    },
    {
      id: 103,
      gateName: 'البوابة رقم 1 — المدخل الرئيسي',
      scannedAt: 'الخميس الماضي، 08:35 ص',
      officerName: 'رقيب / محمود كمال',
      decision: 'مسموح بالدخول (تصريح ساري)',
    },
  ];
});
</script>