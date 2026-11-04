<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة
         ========================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <QrCode class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                تصاريح الدخول ورمز QR
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ passes.length }} تصريح ساري
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تصاريح دخول بوابات المعهد للدورات المقيد بها — يُبرز الرمز لفرد الأمن عند كل دخول
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm">
            {{ userInitials }}
          </div>
          <div>
            <div class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{{ traineeProfile.fullName }}</div>
            <div class="text-[11px] text-slate-400 font-mono">الرقم القومي: {{ traineeProfile.nationalId }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- تنبيه إرشادي أمني -->
    <div class="rounded-3xl border border-primary-200 dark:border-primary-900 bg-primary-50/70 dark:bg-primary-950/30 px-5 py-4 flex items-start gap-3 shadow-2xs">
      <ShieldCheck class="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
      <div class="text-xs space-y-1">
        <div class="font-black text-primary-800 dark:text-primary-300">إرشادات استخدام تصريح الدخول الأمني</div>
        <p class="text-primary-700/90 dark:text-primary-300/80 leading-relaxed">
          التصريح مرتبط برمز QR مشفر وفريد لكل دورة مسددة الرسوم، ويُسجَّل كل مسح تلقائياً في سجل البوابة (GateLogs) مع قرار مسؤول الأمن. يُرجى إبراز التصريح أو استخدام زر "تكبير الرمز" لتسهيل القراءة عبر قارئات البوابات الإلكترونية.
        </p>
      </div>
    </div>

    <!-- =========================================================
         2. حالة عدم وجود تصاريح
         ========================================================= -->
    <div
      v-if="!passes.length"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm px-8 py-16 text-center space-y-3"
    >
      <div class="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
        <QrCode class="w-7 h-7 text-slate-400" />
      </div>
      <h3 class="text-sm font-black text-slate-700 dark:text-slate-200 font-heading">لا توجد تصاريح دخول فعّالة</h3>
      <p class="text-xs text-slate-400">
        يُصدر التصريح تلقائياً بعد اعتماد طلبك وسداد الرسوم وتقييدك بالدورة التدريبية.
      </p>
      <RouterLink
        to="/trainee/courses"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
      >
        تصفّح الدورات المتاحة للتقديم
        <ArrowLeft class="w-3.5 h-3.5" />
      </RouterLink>
    </div>

    <!-- =========================================================
         3. كروت تصاريح الدخول
         ========================================================= -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <article
        v-for="pass in passes"
        :key="pass.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
      >
        <!-- ترويسة التصريح الأمني -->
        <div class="px-5 py-3.5 bg-gradient-to-l from-primary-900 to-primary-950 text-white flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck class="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div class="text-xs font-black font-heading leading-tight">تصريح دخول المعهد</div>
              <div class="text-[10px] text-primary-200 font-mono">{{ pass.round.roundCode }}</div>
            </div>
          </div>

          <span
            class="px-2.5 py-1 rounded-full text-[10px] font-black border"
            :class="validityOf(pass).badge"
          >
            {{ validityOf(pass).label }}
          </span>
        </div>

        <div class="p-5 space-y-4 flex-1">
          <!-- عنوان الدورة والمجال -->
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
              {{ pass.round.courseName }}
            </h3>
            <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span>{{ pass.round.courseDomain }}</span>
              <span>•</span>
              <span>الدفعة {{ pass.round.roundNumber }}</span>
            </div>
          </div>

          <!-- حاوية رمز QR مع زر التكبير والنسخ -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2.5">
            <div
              class="w-[170px] h-[170px] bg-white p-2 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-center cursor-pointer group/qr relative"
              title="انقر لتكبير رمز الـ QR للعرض على البوابة"
              @click="openZoom(pass)"
            >
              <QrcodeVue
                :value="pass.qrToken"
                :size="150"
                level="M"
                render-as="svg"
                foreground="#0b1e42"
                background="#ffffff"
              />
              <div class="absolute inset-0 bg-primary-900/10 rounded-xl opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity">
                <span class="px-2 py-1 rounded-lg bg-primary-900/90 text-white text-[10px] font-bold shadow-xs">
                  تكبير 🔍
                </span>
              </div>
            </div>

            <div class="w-full flex items-center justify-between gap-1.5 px-1">
              <span class="flex-1 min-w-0 truncate font-mono text-[10px] text-slate-500 dark:text-slate-400" :title="pass.qrToken">
                {{ pass.qrToken }}
              </span>
              <button
                type="button"
                class="w-7 h-7 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                title="نسخ رمز QR المشفر"
                @click="copyToken(pass.qrToken)"
              >
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- تفاصيل التصريح والقاعة والمحاضر -->
          <div class="space-y-2 text-[11px]">
            <div class="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
              <span class="text-slate-400 flex items-center gap-1.5"><User class="w-3.5 h-3.5 text-primary-600" /> المتدرب</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[60%]">{{ traineeProfile.fullName }}</span>
            </div>
            <div class="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
              <span class="text-slate-400 flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5 text-primary-600" /> القاعة والمقر</span>
              <span class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[60%]" :title="pass.round.hall.name">
                {{ pass.round.hall.name }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
              <span class="text-slate-400 flex items-center gap-1.5"><CalendarClock class="w-3.5 h-3.5 text-primary-600" /> المواعيد</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-200">
                {{ formatTimeRange(pass.round.startTime, pass.round.endTime) }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
              <span class="text-slate-400 flex items-center gap-1.5"><CalendarDays class="w-3.5 h-3.5 text-primary-600" /> فترة الصلاحية</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-200">
                {{ formatDateDmy(pass.round.startDate) }} → {{ formatDateDmy(pass.round.endDate) }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
              <span class="text-slate-400 flex items-center gap-1.5"><Receipt class="w-3.5 h-3.5 text-primary-600" /> إيصال السداد</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-200">{{ pass.receiptNumber }}</span>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات السريعة -->
        <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 flex items-center justify-between gap-2">
          <button
            type="button"
            class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
            @click="openZoom(pass)"
          >
            <Maximize2 class="w-3.5 h-3.5" />
            <span>تكبير الرمز للبوابة</span>
          </button>

          <button
            type="button"
            class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            @click="openLogs(pass)"
          >
            <History class="w-3.5 h-3.5 text-slate-400" />
            <span>سجل الدخول</span>
          </button>
        </div>
      </article>
    </div>

    <!-- مودال تكبير رمز التصريح للشاشات -->
    <TraineePassZoomModal
      :is-open="isZoomOpen"
      :pass="selectedPass"
      :trainee-profile="traineeProfile"
      @close="isZoomOpen = false"
    />

    <!-- مودال سجل حركات الدخول الأمنية (GateLogs) -->
    <TraineeGateLogsModal
      :is-open="isLogsOpen"
      :pass="selectedPass"
      @close="isLogsOpen = false"
    />

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.text"
        class="fixed bottom-6 left-6 z-[60] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold max-w-sm bg-emerald-50 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
      >
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>{{ toast.text }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import {
  QrCode,
  ShieldCheck,
  Copy,
  User,
  MapPin,
  CalendarClock,
  CalendarDays,
  Receipt,
  CheckCircle2,
  ArrowLeft,
  Maximize2,
  History,
} from 'lucide-vue-next';
import TraineePassZoomModal from './TraineePassZoomModal.vue';
import TraineeGateLogsModal from './TraineeGateLogsModal.vue';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { TRAINEE_MOCK_PROFILE } from '../helpers/availableCoursesMockData';
import { ONGOING_APPLICATIONS } from '../helpers/traineePortalMockData';
import {
  getPassValidity,
  formatDateDmy,
  formatTimeRange,
} from '../helpers/traineePortalHelpers';

const authStore = useAuthStore();

const traineeProfile = {
  ...TRAINEE_MOCK_PROFILE,
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId,
};

const userInitials = computed(() => {
  const parts = (traineeProfile.fullName || 'م').trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]} ${parts[1][0]}` : traineeProfile.fullName.slice(0, 2);
});

/** تصاريح الدورات المقيد بها فقط (Status = Enrolled) */
const passes = computed(() => ONGOING_APPLICATIONS);

const validityOf = (pass) => getPassValidity(pass.round);

// مودال التكبير وسجل الدخول
const isZoomOpen = ref(false);
const isLogsOpen = ref(false);
const selectedPass = ref(null);

function openZoom(pass) {
  selectedPass.value = pass;
  isZoomOpen.value = true;
}

function openLogs(pass) {
  selectedPass.value = pass;
  isLogsOpen.value = true;
}

// --- Toast ---
const toast = ref({ text: '' });
let toastTimer = null;

function showToast(text) {
  toast.value = { text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = { text: '' };
  }, 3000);
}

async function copyToken(token) {
  try {
    await navigator.clipboard.writeText(token);
    showToast('تم نسخ رمز التصريح الأمني (QRToken)');
  } catch {
    showToast('تعذّر النسخ التلقائي — يمكنك تحديد الرمز يدوياً');
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>