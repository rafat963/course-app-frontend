<template>
  <div
    v-if="isOpen && course"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-in">
      <!-- ترويسة المودال -->
      <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/40">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            <Award class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              الشهادة الرسمية المعتمدة
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              رقم الاعتماد: <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ course.certificateNumber }}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- محتوى الشهادة (وثيقة رسمية قابلة للطباعة) -->
      <div class="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-950/30">
        <div class="relative p-8 rounded-2xl bg-white text-slate-900 border-8 border-double border-amber-600/30 shadow-lg text-center space-y-6">
          <!-- ختم النسر / العلامة المائية في الخلفية -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <img src="@/assets/logo.png" alt="علامة مائية" class="w-80 h-80 object-contain" />
          </div>

          <!-- ترويسة الشهادة الرسمية -->
          <div class="flex items-center justify-between border-b-2 border-amber-700/30 pb-4">
            <div class="text-right text-xs font-bold text-slate-700 leading-relaxed">
              <div>جمهورية مصر العربية</div>
              <div>وزارة الدفاع</div>
              <div>هيئة التدريب للقوات المسلحة</div>
              <div class="text-primary-800 font-black">معهد نظم المعلومات</div>
            </div>

            <!-- لوجو المعهد -->
            <div class="w-16 h-16 rounded-full p-1 bg-amber-50 border border-amber-200 flex items-center justify-center">
              <img src="@/assets/logo.png" alt="شعار المعهد" class="w-12 h-12 object-contain" />
            </div>

            <div class="text-left text-xs font-mono font-bold text-slate-700">
              <div>كود الشهادة: {{ course.certificateNumber }}</div>
              <div>تاريخ الإصدار: {{ course.issuedAt }}</div>
            </div>
          </div>

          <!-- عنوان الشهادة -->
          <div class="space-y-1">
            <h2 class="text-2xl font-black font-heading text-slate-900 tracking-wide">
              شـــهـــادة اجـتـيـاز وتـخـرج
            </h2>
            <p class="text-xs text-amber-800 font-bold">
              معتمدة رسمياً ومسجلة بسجلات معهد نظم المعلومات للقوات المسلحة
            </p>
          </div>

          <!-- متن الشهادة -->
          <div class="text-sm text-slate-800 leading-loose max-w-xl mx-auto font-medium">
            يشهد <strong class="font-black text-primary-900">معهد نظم المعلومات للقوات المسلحة</strong> بأن الدارس:
            <div class="my-2 py-1.5 px-4 bg-amber-50/80 rounded-xl border border-amber-200 inline-block font-black text-base text-slate-900">
              {{ trainee?.fullName }}
            </div>
            <br />
            المقيد بالرقم القومي: <span class="font-mono font-bold">{{ trainee?.nationalId }}</span>
            قد أتم بنجاح متطلبات الدورة التدريبية التخصصية:
            <div class="my-2 py-1.5 px-4 bg-primary-50 rounded-xl border border-primary-200 inline-block font-black text-base text-primary-900">
              {{ course.courseName }} (الدفعة {{ course.roundNumber }})
            </div>
            <br />
            بإجمالي عدد ساعات تدريبية معتمدة <strong class="font-bold">{{ course.totalHours }} ساعة</strong> في الفترة من <span class="font-mono">{{ course.startDate }}</span> إلى <span class="font-mono">{{ course.endDate }}</span>
            وقد اجتاز الاختبارات النهائية بنجاح وحصل على تقدير عام:
            <div class="mt-2 text-base font-black text-emerald-800">
              {{ course.grade }} بنسبة نجاح ({{ course.gradeScore }})
            </div>
          </div>

          <!-- التوقيعات والأختام والـ QR -->
          <div class="pt-6 border-t-2 border-amber-700/30 flex items-center justify-between text-xs font-bold text-slate-800">
            <!-- توقيع المحاضر -->
            <div class="text-center space-y-1">
              <div>المحاضر المسؤول</div>
              <div class="font-black text-primary-800">{{ course.instructorName }}</div>
              <div class="text-[10px] text-slate-400 font-mono">توقيع معتمد</div>
            </div>

            <!-- كود التحقق QR -->
            <div class="text-center flex flex-col items-center">
              <div class="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center">
                <QrCode class="w-12 h-12 text-slate-800" />
              </div>
              <span class="text-[9px] text-slate-500 font-mono mt-1">كود التحقق الرقمي</span>
            </div>

            <!-- توقيع قائد المعهد -->
            <div class="text-center space-y-1">
              <div>مدير معهد نظم المعلومات</div>
              <div class="font-black text-slate-900">عميد أ.ح / قائد المعهد</div>
              <div class="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 class="w-3 h-3 text-emerald-600" />
                <span>مختومة بختم النسر</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- أسفل المودال: أزرار الطباعة والإغلاق -->
      <div class="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/40">
        <button
          type="button"
          class="h-11 px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          @click="printCertificate"
        >
          <Printer class="w-4.5 h-4.5" />
          <span>طباعة الشهادة الرسمية</span>
        </button>

        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Award, X, QrCode, CheckCircle2, Printer } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Object,
    default: null,
  },
  trainee: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

function printCertificate() {
  window.print();
}
</script>
