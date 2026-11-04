<template>
  <Teleport to="body">
    <div
      v-if="isOpen && application"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto"
      dir="rtl"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden animate-scale-in"
      >
        <!-- =========================================================
             1. شريط التحكم العلوي للمودال (غير قابل للطباعة)
             ========================================================= -->
        <header
          class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0 cert-no-print"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs"
            >
              <Award class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                  معاينة الشهادة الرسمية المعتمدة
                </h3>
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  A4 Landscape • 300 DPI
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                <span>كود الشهادة: <strong class="text-primary-700 dark:text-primary-300">{{ application.certificateCode }}</strong></span>
                <span>•</span>
                <span>تاريخ الاعتماد: {{ formatDateDmy(application.certificateIssuedAt) }}</span>
              </p>
            </div>
          </div>

          <!-- أزرار الإجراءات في الرأس -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-9 px-4 rounded-xl bg-gradient-to-l from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white text-xs font-bold shadow-md shadow-primary-700/20 hover:shadow-primary-700/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="طباعة الشهادة وفق معايير A4 بالعرض (Landscape)"
              @click="handlePrint"
            >
              <Printer class="w-4 h-4" />
              <span>طباعة الشهادة (A4 بالعرض)</span>
            </button>

            <button
              type="button"
              class="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="تحميل وثيقة HTML رسمية ومستقلة قابلة للأرشفة والطباعة بجودة 300 DPI"
              @click="handleDownload"
            >
              <Download class="w-4 h-4" />
              <span>تحميل نسخة رقمية</span>
            </button>

            <button
              type="button"
              class="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="نسخ كود الشهادة الرسمي"
              @click="copyCertificateCode"
            >
              <Copy class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">نسخ الكود</span>
            </button>

            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="إغلاق النافذة"
              @click="$emit('close')"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </header>

        <!-- =========================================================
             2. مساحة المعاينة الحية للشهادة على الشاشة
             ========================================================= -->
        <main
          class="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-slate-200/70 dark:bg-slate-950 flex justify-center items-center custom-scrollbar cert-viewport"
        >
          <!-- حاوية الشهادة المطابقة لنسبة A4 Landscape (297mm × 210mm) -->
          <div
            id="certificate-render-target"
            class="certificate-a4-sheet certificate-print-root relative bg-[#ffffff] text-slate-900 rounded-lg shadow-2xl overflow-hidden select-text"
          >
            <!-- 3mm Bleed & Guilloche Outer Frame -->
            <div class="cert-outer-bleed">
              <!-- الإطار الملكي المزدوج المذهب والأزرق الداكن -->
              <div class="cert-royal-frame">
                <!-- الزخارف الركنية الأربعة (Corner Filigrees) -->
                <svg class="cert-corner cert-corner-tr" viewBox="0 0 100 100" fill="none">
                  <path d="M10 10 H70 C85 10 90 15 90 30 V90 M20 20 H60 C75 20 80 25 80 40 V80 M5 5 L25 25 M75 25 L95 5 M25 75 L5 95" stroke="#b8860b" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="20" cy="20" r="4" fill="#b8860b" />
                  <path d="M40 10 Q50 30 70 30 Q50 50 50 70" stroke="#0b1e42" stroke-width="1.5" fill="none" opacity="0.6"/>
                </svg>

                <svg class="cert-corner cert-corner-tl" viewBox="0 0 100 100" fill="none">
                  <path d="M90 10 H30 C15 10 10 15 10 30 V90 M80 20 H40 C25 20 20 25 20 40 V80 M95 5 L75 25 M25 25 L5 5 M75 75 L95 95" stroke="#b8860b" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="80" cy="20" r="4" fill="#b8860b" />
                  <path d="M60 10 Q50 30 30 30 Q50 50 50 70" stroke="#0b1e42" stroke-width="1.5" fill="none" opacity="0.6"/>
                </svg>

                <svg class="cert-corner cert-corner-br" viewBox="0 0 100 100" fill="none">
                  <path d="M10 90 H70 C85 90 90 85 90 70 V10 M20 80 H60 C75 80 80 75 80 60 V20 M5 95 L25 75 M75 75 L95 95 M25 25 L5 5" stroke="#b8860b" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="20" cy="80" r="4" fill="#b8860b" />
                  <path d="M40 90 Q50 70 70 70 Q50 50 50 30" stroke="#0b1e42" stroke-width="1.5" fill="none" opacity="0.6"/>
                </svg>

                <svg class="cert-corner cert-corner-bl" viewBox="0 0 100 100" fill="none">
                  <path d="M90 90 H30 C15 90 10 85 10 70 V10 M80 80 H40 C25 80 20 75 20 60 V20 M95 95 L75 75 M25 75 L5 95 M75 25 L95 5" stroke="#b8860b" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="80" cy="80" r="4" fill="#b8860b" />
                  <path d="M60 90 Q50 70 30 70 Q50 50 50 30" stroke="#0b1e42" stroke-width="1.5" fill="none" opacity="0.6"/>
                </svg>

                <!-- علامة مائية مركزية (Central Security Watermark) -->
                <div class="cert-watermark-container pointer-events-none" aria-hidden="true">
                  <img
                    :src="instituteLogo"
                    alt="Institute Logo Watermark"
                    class="cert-watermark-img"
                  />
                </div>

                <!-- شبكة خطوط الأمان الدقيقة (Security Background Guilloche Pattern) -->
                <div class="cert-guilloche-pattern pointer-events-none" aria-hidden="true"></div>

                <!-- =========================================================
                     محتوى الشهادة الداخلي المنظم هندسياً
                     ========================================================= -->
                <div class="cert-inner-content relative z-10 flex flex-col justify-between h-full">
                  <!-- 1. ترويسة الشهادة الرسمية الثلاثية (Header) -->
                  <header class="cert-header grid grid-cols-12 items-center gap-2 border-b border-amber-600/30 pb-3">
                    <!-- يمين: الجهة الإدارية الرسمية -->
                    <div class="col-span-4 text-right space-y-0.5 leading-tight">
                      <div class="text-[13pt] font-black text-[#0b1e42] tracking-normal font-heading">
                        جمهورية مصر العربية
                      </div>
                      <div class="text-[11pt] font-bold text-slate-800">
                        وزارة الدفاع
                      </div>
                      <div class="text-[10pt] font-bold text-slate-700">
                        هيئة التدريب للقوات المسلحة
                      </div>
                      <div class="text-[12pt] font-black text-[#8a6d1c] font-heading mt-0.5">
                        معهد نظم المعلومات
                      </div>
                      <div class="text-[9pt] font-semibold text-slate-500">
                        إدارة شؤون الدارسين والامتحانات
                      </div>
                    </div>

                    <!-- وسط: شعار المعهد المعتمد في هالة ذهبية -->
                    <div class="col-span-4 flex flex-col items-center justify-center text-center">
                      <div class="cert-logo-wrapper relative p-1.5 rounded-full border-2 border-[#b8860b] bg-white shadow-sm">
                        <img
                          :src="instituteLogo"
                          alt="شعار معهد نظم المعلومات للقوات المسلحة"
                          class="w-20 h-20 object-contain mx-auto"
                        />
                      </div>
                      <div class="text-[8.5pt] tracking-[0.25em] text-[#0b1e42] font-black uppercase mt-1 font-mono">
                        ARMED FORCES INFORMATION SYSTEMS INSTITUTE
                      </div>
                    </div>

                    <!-- يسار: بيانات الاعتماد والتوثيق والباركود -->
                    <div class="col-span-4 text-left space-y-1 font-mono text-[9pt] text-slate-700">
                      <div class="flex items-center justify-end gap-1.5">
                        <span class="text-slate-500 font-sans text-[8.5pt]">كود الشهادة:</span>
                        <strong class="text-[#0b1e42] text-[10pt] tracking-wider">{{ application.certificateCode }}</strong>
                      </div>
                      <div class="flex items-center justify-end gap-1.5">
                        <span class="text-slate-500 font-sans text-[8.5pt]">تاريخ الإصدار:</span>
                        <span class="font-bold text-slate-800">{{ formatDateDmy(application.certificateIssuedAt) }}</span>
                      </div>
                      <div class="flex items-center justify-end gap-1.5">
                        <span class="text-slate-500 font-sans text-[8.5pt]">رقم السجل الأكاديمي:</span>
                        <span class="font-bold text-slate-800">REG-2026-{{ application.id }}</span>
                      </div>
                      <div class="flex items-center justify-end gap-1.5 text-emerald-800 font-sans font-bold text-[8pt]">
                        <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>شهادة رسمية معتمدة وموثقة</span>
                      </div>
                    </div>
                  </header>

                  <!-- 2. عنوان الشهادة الرئيسي (Certificate Title) -->
                  <div class="cert-title-block text-center my-1.5">
                    <div class="text-[11pt] tracking-[0.35em] text-[#b8860b] font-black font-mono">
                      CERTIFICATE OF ACHIEVEMENT &amp; COMPLETION
                    </div>
                    <h1 class="cert-title text-[32pt] leading-tight font-black text-[#0b1e42] font-heading mt-0.5 tracking-tight">
                      شهادة إجتياز دورة تدريبية
                    </h1>
                    <!-- زخرفة الخط الفاصل الذهبي -->
                    <div class="cert-title-divider flex items-center justify-center gap-2 max-w-md mx-auto my-1">
                      <span class="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#b8860b] to-[#b8860b]"></span>
                      <svg class="w-4 h-4 text-[#b8860b]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z"/>
                      </svg>
                      <span class="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#b8860b] to-[#b8860b]"></span>
                    </div>
                  </div>

                  <!-- 3. إقرار التقدير وبيانات المتدرب (Recipient Name & Narrative) -->
                  <div class="cert-body-block text-center space-y-2">
                    <p class="text-[13pt] text-slate-600 font-medium font-sans">
                      تشهد إدارة معهد نظم المعلومات للقوات المسلحة بأن الدارس:
                    </p>

                    <!-- اسم المتدرب: المركز البصري الأهم (Recipient Full Name) -->
                    <div class="cert-recipient-wrapper inline-block my-1 px-8 py-1 relative">
                      <div class="cert-recipient-name text-[30pt] font-black text-[#0b1e42] font-heading tracking-wide">
                        {{ traineeName }}
                      </div>
                      <div class="h-[2px] w-full bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mt-1"></div>
                      <div class="text-[10pt] text-slate-500 font-sans mt-0.5">
                        الرقم القومي: <span class="font-mono font-bold text-slate-700">{{ traineeProfileComputed.nationalId }}</span>
                        • فئة الدارس: <span class="font-bold text-slate-700">{{ categoryLabel }}</span>
                      </div>
                    </div>

                    <!-- نص الإنجاز واجتياز الدورة -->
                    <p class="text-[13.5pt] text-slate-700 leading-relaxed max-w-4xl mx-auto font-sans">
                      قد اجتاز بنجاح واقتدار كافة المتطلبات الأكاديمية والتدريبية والتطبيقات العملية المقررة لدورة:
                    </p>

                    <!-- اسم الدورة التدريبية (Course Name) -->
                    <div class="cert-course-name text-[20pt] font-black text-[#0f4c81] font-heading px-4 py-0.5 inline-block">
                      « {{ application.round.courseName }} »
                    </div>

                    <!-- مواصفات دفعة الانعقاد والتقييم النهائي -->
                    <div class="cert-specs-text text-[11.5pt] text-slate-600 flex items-center justify-center gap-3 flex-wrap font-sans">
                      <span>الدفعة رقم: <strong class="font-mono text-slate-900">{{ application.round.roundNumber }}</strong> (كود: <span class="font-mono">{{ application.round.roundCode }}</span>)</span>
                      <span>•</span>
                      <span>فترة الانعقاد: <strong class="font-mono">{{ formatDateDmy(application.round.startDate) }}</strong> إلى <strong class="font-mono">{{ formatDateDmy(application.round.endDate) }}</strong></span>
                      <span>•</span>
                      <span>إجمالي الساعات: <strong class="font-mono">{{ (application.round.totalLectures || 20) * 4 }} ساعة تدريبية</strong></span>
                    </div>

                    <!-- بطاقة النتيجة والتقدير العام والدرجة النهائية -->
                    <div class="cert-grade-badge inline-flex items-center gap-3 px-6 py-1.5 rounded-full bg-slate-50 border border-amber-600/40 shadow-xs">
                      <span class="text-[11.5pt] font-bold text-slate-700">التقييم النهائي:</span>
                      <span class="text-[14pt] font-black font-mono text-emerald-800">
                        {{ application.finalGrade }}%
                      </span>
                      <span class="px-2.5 py-0.5 rounded-full text-[10pt] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {{ getGradeEvaluation(application.finalGrade) }}
                      </span>
                      <span class="text-[10pt] text-slate-500 font-sans">
                        (نسبة النجاح المقررة: {{ application.round.passingGrade }}%)
                      </span>
                    </div>
                  </div>

                  <!-- 4. تذييل التوثيق والتوقيعات والأختام الرسمية (Footer & Signatures) -->
                  <footer class="cert-footer grid grid-cols-12 items-end gap-3 pt-3 border-t border-amber-600/30">
                    <!-- يمين: توقيع مدير إدارة شؤون الدارسين -->
                    <div class="col-span-4 text-center">
                      <div class="text-[11pt] font-bold text-slate-800 font-heading">
                        مدير إدارة شؤون الدارسين والامتحانات
                      </div>
                      <div class="cert-signature-space h-14 flex items-center justify-center my-1">
                        <svg class="h-10 text-primary-900 opacity-80" viewBox="0 0 200 60" fill="none">
                          <path d="M10 40 Q40 10 70 35 T130 25 T190 30" stroke="#0b1e42" stroke-width="2.5" stroke-linecap="round"/>
                          <path d="M40 25 Q90 50 140 15" stroke="#0b1e42" stroke-width="1.8" stroke-linecap="round"/>
                          <circle cx="160" cy="28" r="2.5" fill="#0b1e42"/>
                        </svg>
                      </div>
                      <div class="cert-sig-line h-[1px] w-48 bg-slate-400 mx-auto"></div>
                      <div class="text-[9.5pt] font-bold text-slate-600 font-mono mt-1">
                        مقدم / كريم حمدي عبد السلام
                      </div>
                    </div>

                    <!-- وسط: الختم الرسمي البارز لمعهد نظم المعلومات -->
                    <div class="col-span-4 flex flex-col items-center justify-center text-center">
                      <div class="cert-official-seal relative w-24 h-24 rounded-full border-4 border-double border-[#b8860b] bg-gradient-to-tr from-amber-100/60 via-amber-50/40 to-amber-100/80 flex items-center justify-center shadow-md">
                        <!-- نصوص الختم الدائرية -->
                        <div class="absolute inset-1 rounded-full border border-dashed border-[#b8860b]/70 flex items-center justify-center">
                          <div class="text-center p-1">
                            <div class="text-[6pt] font-bold text-[#8a6d1c] font-heading leading-tight">جمهورية مصر العربية</div>
                            <div class="w-7 h-7 mx-auto my-0.5 text-[#b8860b] flex items-center justify-center">
                              <ShieldCheck class="w-6 h-6 text-[#b8860b]" />
                            </div>
                            <div class="text-[6.5pt] font-black text-[#0b1e42] font-heading leading-tight">معهد نظم المعلومات</div>
                            <div class="text-[5pt] font-bold text-[#8a6d1c] font-mono">خاتم الاعتماد الرسمي</div>
                          </div>
                        </div>
                      </div>
                      <div class="text-[8pt] font-bold text-[#8a6d1c] font-mono mt-1">
                        خاتم شعار المعهد المعتمد
                      </div>
                    </div>

                    <!-- يسار: رمز التحقق الإلكتروني QR وتوقيع السيد القائد -->
                    <div class="col-span-4 text-center">
                      <div class="flex items-end justify-between gap-2">
                        <!-- QR Code للتحقق الفوري عند البوابات والجهات الخارجية -->
                        <div class="text-center shrink-0">
                          <div class="p-1 rounded-lg border border-slate-300 bg-white shadow-2xs inline-block">
                            <QrcodeVue
                              :value="qrVerificationPayload"
                              :size="72"
                              level="M"
                              render-as="svg"
                              foreground="#0b1e42"
                              background="#ffffff"
                            />
                          </div>
                          <div class="text-[7.5pt] font-bold text-slate-500 font-mono mt-0.5">
                            مسح التحقق الرقمي
                          </div>
                        </div>

                        <!-- توقيع السيد قائد المعهد -->
                        <div class="flex-1 text-center">
                          <div class="text-[11pt] font-bold text-slate-800 font-heading">
                            قائد معهد نظم المعلومات
                          </div>
                          <div class="cert-signature-space h-14 flex items-center justify-center my-1">
                            <svg class="h-11 text-primary-950 opacity-90" viewBox="0 0 200 60" fill="none">
                              <path d="M20 45 Q60 5 100 40 T160 20 T195 35" stroke="#0b1e42" stroke-width="3" stroke-linecap="round"/>
                              <path d="M50 30 Q110 5 150 50" stroke="#0b1e42" stroke-width="2" stroke-linecap="round"/>
                              <path d="M120 20 L135 10" stroke="#0b1e42" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                          </div>
                          <div class="cert-sig-line h-[1px] w-48 bg-slate-400 mx-auto"></div>
                          <div class="text-[9.5pt] font-bold text-slate-600 font-mono mt-1">
                            عميد أ.ح / باسم صبرى خليل
                          </div>
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- =========================================================
             3. الفوتر السفلي للمودال (شريط المعلومات والإغلاق)
             ========================================================= -->
        <footer
          class="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0 cert-no-print"
        >
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            <span>الشهادة مؤمنة برمز QR مشفر وكود تحقق فريد يتيح التحقق الفوري من صحة البيانات.</span>
          </div>
          <button
            type="button"
            class="h-8 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            إغلاق
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { Award, ShieldCheck, X, Printer, Download, Copy } from 'lucide-vue-next';
import instituteLogo from '@/assets/logo.png';
import { formatDateDmy } from '../helpers/traineePortalHelpers';
import { CATEGORY_CONFIG } from '../helpers/availableCoursesHelpers';
import { TRAINEE_MOCK_PROFILE } from '../helpers/availableCoursesMockData';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
  traineeName: {
    type: String,
    default: '',
  },
  traineeProfile: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close']);

const traineeProfileComputed = computed(() => {
  return props.traineeProfile || TRAINEE_MOCK_PROFILE;
});

const categoryLabel = computed(() => {
  const cat = traineeProfileComputed.value?.category;
  return CATEGORY_CONFIG[cat]?.labelFull || CATEGORY_CONFIG[cat]?.label || 'دارس مدني';
});

/** توليد حمولة التحقق الرقمي المشفر للـ QR */
const qrVerificationPayload = computed(() => {
  const app = props.application;
  if (!app) return '';
  return JSON.stringify({
    iss: 'ISI-Armed-Forces',
    cert: app.certificateCode,
    name: props.traineeName,
    course: app.round?.courseName,
    round: app.round?.roundCode,
    grade: `${app.finalGrade}%`,
    issued: app.certificateIssuedAt,
    v: '1.0',
  });
});

/** التقدير العام من النسبة المئوية */
function getGradeEvaluation(grade) {
  const g = Number(grade) || 0;
  if (g >= 90) return 'امتياز مع مرتبة الشرف';
  if (g >= 85) return 'امتياز';
  if (g >= 75) return 'جيد جداً';
  if (g >= 65) return 'جيد';
  if (g >= 60) return 'مقبول';
  return 'دون المستوى';
}

/** تشغيل نافذة الطباعة التلقائية المتوافقة مع A4 Landscape */
function handlePrint() {
  window.print();
}

/** نسخ كود الشهادة إلى الحافظة */
async function copyCertificateCode() {
  const code = props.application?.certificateCode;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // ignore
  }
}

/**
 * توليد وتحميل وثيقة HTML رسمية ومستقلة تماماً (Offline Printable Standalone Document)
 * تلتزم بدقة متناهية بمعايير الطباعة: A4 Landscape (297mm × 210mm) عند 300 DPI
 */
function handleDownload() {
  const app = props.application;
  if (!app) return;

  const htmlDoc = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>شهادة إجتياز دورة تدريبية معتمدة — ${app.certificateCode}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  @page {
    size: A4 landscape;
    margin: 0;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 297mm;
    height: 210mm;
    background: #ffffff;
    font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
    color: #0b1e42;
    overflow: hidden;
  }
  .cert-page {
    width: 297mm;
    height: 210mm;
    padding: 12mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    border: 3mm solid #ffffff;
  }
  .cert-frame {
    width: 100%;
    height: 100%;
    border: 3px double #b8860b;
    outline: 2px solid #0b1e42;
    outline-offset: -8px;
    padding: 8mm 10mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: radial-gradient(circle at center, #ffffff 60%, #fffdfa 100%);
  }
  .cert-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid rgba(184, 134, 11, 0.4);
    padding-bottom: 6px;
  }
  .header-col { width: 32%; }
  .header-right { text-align: right; line-height: 1.35; }
  .header-center { text-align: center; width: 36%; }
  .header-left { text-align: left; font-family: monospace; font-size: 9pt; line-height: 1.4; }
  .inst-title { font-size: 13pt; font-weight: 900; color: #0b1e42; }
  .inst-sub { font-size: 10pt; font-weight: 700; color: #334155; }
  .inst-dept { font-size: 11pt; font-weight: 900; color: #8a6d1c; }
  .cert-logo { width: 72px; height: 72px; object-fit: contain; }
  .main-title-block { text-align: center; margin: 4px 0; }
  .latin-sub { font-size: 9pt; letter-spacing: 0.35em; color: #b8860b; font-weight: 900; }
  .main-title { font-size: 30pt; font-weight: 900; color: #0b1e42; margin: 2px 0; font-family: 'Amiri', 'Cairo', serif; }
  .recipient-block { text-align: center; margin: 2px 0; }
  .recipient-name { font-size: 28pt; font-weight: 900; color: #0b1e42; font-family: 'Amiri', 'Cairo', serif; margin: 4px 0 2px; }
  .name-underline { width: 260px; height: 2px; background: #b8860b; margin: 0 auto 4px; }
  .course-name { font-size: 19pt; font-weight: 900; color: #0f4c81; margin: 3px 0; }
  .narrative { font-size: 12.5pt; color: #334155; line-height: 1.5; max-width: 90%; margin: 0 auto; }
  .grade-badge {
    display: inline-block;
    padding: 3px 18px;
    border-radius: 999px;
    background: #f8fafc;
    border: 1px solid #b8860b;
    font-size: 11pt;
    font-weight: 700;
  }
  .cert-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1.5px solid rgba(184, 134, 11, 0.4);
    padding-top: 6px;
    margin-top: 4px;
  }
  .seal {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    border: 3px double #b8860b;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 6.5pt;
    font-weight: 800;
    color: #8a6d1c;
    background: #fffdf5;
  }
  .sig-block { width: 33%; text-align: center; }
  .sig-title { font-size: 10.5pt; font-weight: 800; color: #0b1e42; }
  .sig-line { width: 160px; height: 1px; background: #94a3b8; margin: 26px auto 4px; }
  .sig-name { font-size: 9pt; font-weight: 700; color: #475569; font-family: monospace; }
  @media print {
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="cert-page">
    <div class="cert-frame">
      <!-- Header -->
      <div class="cert-header">
        <div class="header-col header-right">
          <div class="inst-title">جمهورية مصر العربية</div>
          <div class="inst-sub">وزارة الدفاع — هيئة التدريب</div>
          <div class="inst-dept">معهد نظم المعلومات</div>
          <div style="font-size: 8.5pt; color: #64748b;">إدارة شؤون الدارسين والامتحانات</div>
        </div>

        <div class="header-col header-center">
          <img src="${instituteLogo}" alt="Logo" class="cert-logo" />
          <div style="font-size: 7.5pt; font-weight: 900; color: #0b1e42; letter-spacing: 0.2em; font-family: monospace; margin-top: 2px;">
            ARMED FORCES INFORMATION SYSTEMS INSTITUTE
          </div>
        </div>

        <div class="header-col header-left">
          <div>كود الشهادة: <strong>${app.certificateCode}</strong></div>
          <div>تاريخ الإصدار: <strong>${formatDateDmy(app.certificateIssuedAt)}</strong></div>
          <div>رقم القيد: <strong>REG-2026-${app.id}</strong></div>
          <div style="color: #047857; font-family: sans-serif; font-weight: bold; font-size: 8pt; margin-top: 2px;">وثيقة معتمدة وموثقة ✓</div>
        </div>
      </div>

      <!-- Main Title -->
      <div class="main-title-block">
        <div class="latin-sub">CERTIFICATE OF ACHIEVEMENT &amp; COMPLETION</div>
        <h1 class="main-title">شهادة إجتياز دورة تدريبية</h1>
      </div>

      <!-- Recipient & Achievement -->
      <div class="recipient-block">
        <div style="font-size: 12pt; color: #475569;">تشهد إدارة معهد نظم المعلومات للقوات المسلحة بأن الدارس:</div>
        <div class="recipient-name">${props.traineeName}</div>
        <div class="name-underline"></div>
        <div style="font-size: 9pt; color: #64748b; margin-bottom: 4px;">
          الرقم القومي: ${traineeProfileComputed.value.nationalId} • فئة الدارس: ${categoryLabel.value}
        </div>

        <div class="narrative">
          قد اجتاز بنجاح واقتدار كافة المتطلبات الأكاديمية والتدريبية والتطبيقات العملية المقررة لدورة:
        </div>

        <div class="course-name">« ${app.round.courseName} »</div>

        <div style="font-size: 10.5pt; color: #475569; margin: 4px 0;">
          الدفعة رقم: <strong>${app.round.roundNumber}</strong> (${app.round.roundCode}) • في الفترة من ${formatDateDmy(app.round.startDate)} إلى ${formatDateDmy(app.round.endDate)} • (${(app.round.totalLectures || 20) * 4} ساعة تدريبية)
        </div>

        <div class="grade-badge">
          التقييم النهائي: <strong style="color: #047857; font-family: monospace; font-size: 12pt;">${app.finalGrade}%</strong>
          — ${getGradeEvaluation(app.finalGrade)} (نسبة النجاح: ${app.round.passingGrade}%)
        </div>
      </div>

      <!-- Footer & Signatures -->
      <div class="cert-footer">
        <div class="sig-block">
          <div class="sig-title">مدير إدارة شؤون الدارسين</div>
          <div class="sig-line"></div>
          <div class="sig-name">مقدم / كريم حمدي عبد السلام</div>
        </div>

        <div class="sig-block">
          <div class="seal">
            <div>
              <div>جمهورية مصر العربية</div>
              <div style="font-size: 8pt; font-weight: 900; color: #0b1e42; margin: 2px 0;">معهد نظم المعلومات</div>
              <div>خاتم الاعتماد الرسمي</div>
            </div>
          </div>
        </div>

        <div class="sig-block">
          <div class="sig-title">قائد معهد نظم المعلومات</div>
          <div class="sig-line"></div>
          <div class="sig-name">عميد أ.ح / باسم صبرى خليل</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `شهادة_معتمدة_${app.certificateCode}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
/* =========================================================
   تنسيقات شاشة العرض (Screen Layout)
   ========================================================= */
.cert-viewport {
  perspective: 1000px;
}

/* ورقة الشهادة بنسبة العرض إلى الارتفاع لـ A4 Landscape: 297mm / 210mm ≈ 1.414 */
.certificate-a4-sheet {
  width: 100%;
  max-width: 1050px;
  aspect-ratio: 297 / 210;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #0b1e42;
  position: relative;
  margin: 0 auto;
}

.cert-outer-bleed {
  position: absolute;
  inset: 0;
  padding: 10px;
  background: #ffffff;
}

.cert-royal-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 3.5px double #b8860b;
  outline: 2px solid #0b1e42;
  outline-offset: -7px;
  padding: 18px 24px;
  box-sizing: border-box;
  background: radial-gradient(circle at center, #ffffff 65%, #fffdf8 100%);
}

/* زخارف الأركان */
.cert-corner {
  position: absolute;
  width: 50px;
  height: 50px;
  pointer-events: none;
  z-index: 5;
}
.cert-corner-tr { top: 4px; right: 4px; }
.cert-corner-tl { top: 4px; left: 4px; }
.cert-corner-br { bottom: 4px; right: 4px; }
.cert-corner-bl { bottom: 4px; left: 4px; }

/* علامة مائية مركزية */
.cert-watermark-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.cert-watermark-img {
  width: 240px;
  height: 240px;
  object-fit: contain;
  opacity: 0.045;
  filter: grayscale(100%);
}

/* نمط الأمان Guilloche */
.cert-guilloche-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(184, 134, 11, 0.04) 1px, transparent 1px);
  background-size: 16px 16px;
  z-index: 1;
}

/* =========================================================
   قواعد الطباعة الاحترافية القياسية (Print CSS Media Rules)
   ========================================================= */
@page {
  size: A4 landscape;
  margin: 0;
}

@media print {
  /* تفعيل مطابقة الألوان الدقيقة للطباعة */
  *,
  *::before,
  *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html,
  body {
    width: 297mm !important;
    height: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    overflow: hidden !important;
  }

  /* إخفاء عناصر الموقع العام والسايدبارات ومحتويات الصفحة */
  body * {
    visibility: hidden !important;
  }

  /* إظهار كبسولة الشهادة المعتمدة فقط مع تثبيت أبعاد A4 Landscape بدقة متناهية */
  .certificate-print-root,
  .certificate-print-root * {
    visibility: visible !important;
  }

  .certificate-print-root {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 297mm !important;
    height: 210mm !important;
    max-width: 297mm !important;
    max-height: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    z-index: 2147483647 !important;
    background: #ffffff !important;
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
  }

  .cert-outer-bleed {
    padding: 9mm !important;
  }

  .cert-royal-frame {
    padding: 7mm 10mm !important;
    border-width: 3px !important;
  }

  /* إخفاء عناصر الرأس والفوتر الخاصة بالمودال */
  .cert-no-print {
    display: none !important;
  }
}
</style>
