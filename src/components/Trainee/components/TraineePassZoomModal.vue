<template>
  <div
    v-if="isOpen && pass"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/85 dark:bg-black/90 backdrop-blur-sm select-none"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <!-- شريط علوي -->
      <div class="px-5 py-3.5 bg-primary-900 text-white flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-emerald-400" />
          <div>
            <div class="text-xs font-black font-heading">{{ pass.title || 'تصريح بوابة رقمي — فحص فوري' }}</div>
            <div class="text-[10px] text-primary-200 font-mono">{{ pass.code || pass.round?.roundCode || 'UNIFIED-DAILY-PASS' }}</div>
          </div>
        </div>
        <button
          type="button"
          class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- جسم التصريح المكبّر للشاشات وبوابات الدخول -->
      <div class="p-6 text-center space-y-4">
        <!-- بيانات الدارس -->
        <div class="space-y-1">
          <div class="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
            {{ traineeProfile.fullName }}
          </div>
          <div class="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span>الرقم القومي: {{ traineeProfile.nationalId }}</span>
            <span>•</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">مصرح بالدخول</span>
          </div>
        </div>

        <!-- رمز الـ QR المكبر مع خلفية بيضاء عالية التباين -->
        <div class="mx-auto w-[240px] h-[240px] bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-lg flex items-center justify-center">
          <QrcodeVue
            :value="pass.qrToken"
            :size="216"
            level="H"
            render-as="svg"
            foreground="#0b1e42"
            background="#ffffff"
          />
        </div>

        <div class="space-y-1">
          <div class="font-mono text-[10px] text-slate-400 truncate px-4" :title="pass.qrToken">
            {{ pass.qrToken }}
          </div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
            {{ pass.courseName || pass.round?.courseName || 'تصريح الدخول اليومي الموحد' }}
          </div>
          <div v-if="pass.locationInfo || pass.round?.hall?.name" class="text-[11px] text-slate-500 dark:text-slate-400">
            {{ pass.locationInfo || (pass.round?.hall?.name + ' • ' + formatTimeRange(pass.round?.startTime, pass.round?.endTime)) }}
          </div>
        </div>

        <!-- حالة الصلاحية -->
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs px-4">
          <span class="text-slate-400">حالة الصلاحية:</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">
            {{ pass.validityLabel || 'ساري المفعول اليوم' }}
          </span>
        </div>
      </div>

      <!-- أزرار الإجراءات -->
      <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2 shrink-0">
        <button
          type="button"
          class="flex-1 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          @click="handlePrint"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>طباعة التصريح</span>
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';
import { ShieldCheck, X, Printer } from 'lucide-vue-next';
import { formatTimeRange } from '../helpers/traineePortalHelpers';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  pass: {
    type: Object,
    default: null,
  },
  traineeProfile: {
    type: Object,
    required: true,
  },
});

defineEmits(['close']);

function handlePrint() {
  window.print();
}
</script>
