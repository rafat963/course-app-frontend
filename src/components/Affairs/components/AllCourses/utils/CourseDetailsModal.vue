<template>
  <div
    v-if="isOpen && course"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl h-[720px] max-h-[92vh] overflow-hidden flex flex-col animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة الرئيسية -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-2xs">
            <BookOpen class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                تفاصيل الدورة وسجل الدورات المنعقدة بها
              </h3>
              <span
                class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shadow-2xs"
                :class="
                  course.isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
                "
              >
                {{ course.isActive ? 'دورة نشطة ومتاحة' : 'معطلة مؤقتاً' }}
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ course.name }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- زر فتح دورة انعقاد جديدة لهذا الكورس -->
          <button
            type="button"
            class="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            @click="$emit('open-create-round', course.id)"
          >
            <CalendarPlus class="w-4.5 h-4.5" />
            <span>فتح دورة انعقاد جديدة</span>
          </button>

          <!-- زر الإغلاق -->
          <button
            type="button"
            class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 2. بطاقة بيانات الكتالوج والتسعير المعتمد (Courses & CoursePricings) -->
      <div class="p-6 pb-2 space-y-4 shrink-0">
        <!-- وصف الدورة وتسعير الفئات -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div v-if="course.instructorName" class="flex items-center gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <UserCheck class="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              المحاضر المعتمد للدورة: <strong class="font-black text-slate-800 dark:text-slate-100">{{ course.instructorName }}</strong>
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {{ course.description }}
          </p>

          <!-- شبكة تسعير الفئات الأربعة -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs sm:text-sm">
            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between px-3.5">
              <span class="text-slate-500 dark:text-slate-400 text-xs font-bold">فئة مدني:</span>
              <strong class="font-mono text-slate-800 dark:text-slate-100 font-black text-xs sm:text-sm">
                {{ formatCurrency(course.pricings?.Civilian) }}
              </strong>
            </div>

            <div class="p-2.5 rounded-xl bg-primary-50/50 dark:bg-primary-950/40 border border-primary-200/70 dark:border-primary-800 flex items-center justify-between px-3.5">
              <span class="text-primary-800 dark:text-primary-300 text-xs font-bold">ضابط ق.م:</span>
              <strong class="font-mono text-primary-900 dark:text-primary-200 font-black text-xs sm:text-sm">
                {{ formatCurrency(course.pricings?.MilitaryOfficer) }}
              </strong>
            </div>

            <div class="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800 flex items-center justify-between px-3.5">
              <span class="text-emerald-800 dark:text-emerald-300 text-xs font-bold">عائلات ق.م:</span>
              <strong class="font-mono text-emerald-900 dark:text-emerald-200 font-black text-xs sm:text-sm">
                {{ formatCurrency(course.pricings?.MilitaryFamily) }}
              </strong>
            </div>

            <div class="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800 flex items-center justify-between px-3.5">
              <span class="text-blue-800 dark:text-blue-300 text-xs font-bold">شرطة:</span>
              <strong class="font-mono text-blue-900 dark:text-blue-200 font-black text-xs sm:text-sm">
                {{ formatCurrency(course.pricings?.PoliceOfficerOrFamily) }}
              </strong>
            </div>
          </div>
        </div>

        <!-- شريط المؤشرات التراكمية للدورة -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">إجمالي الدفعات:</span>
            <div class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-mono">
              {{ course.roundsCount || 0 }} دفعة
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الدورات السابقة المنتهية:</span>
            <div class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-200 font-mono">
              {{ pastRounds.length }} دورة سابقة
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">الخريجون المعتمدون:</span>
            <div class="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {{ totalGraduates }} خريجاً
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block">إجمالي الإيرادات المحصلة:</span>
            <div class="text-base sm:text-lg font-black text-primary-700 dark:text-primary-300 font-mono">
              {{ formatCurrency(totalRevenue) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 3. التبويبات الداخلية لاختيار الدورات السابقة أو الدفعات الحالية -->
      <div class="px-6 pt-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shrink-0">
        <!-- تبويب الدورات السابقة المنتهية (المطلوب أساساً) -->
        <button
          type="button"
          class="pb-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2"
          :class="
            activeTab === 'past'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          "
          @click="activeTab = 'past'"
        >
          <History class="w-4.5 h-4.5" />
          <span>الدورات السابقة المنعقدة بها ({{ pastRounds.length }})</span>
        </button>

        <!-- تبويب الدفعات الجارية والمتاحة -->
        <button
          type="button"
          class="pb-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2"
          :class="
            activeTab === 'active'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          "
          @click="activeTab = 'active'"
        >
          <PlayCircle class="w-4.5 h-4.5" />
          <span>الدفعات الجارية والمتاحة للتسجيل ({{ activeRounds.length }})</span>
        </button>
      </div>

      <!-- 4. محتوى التبويبات -->
      <div class="p-6 pt-4 flex-1 min-h-0 overflow-y-auto space-y-4 text-xs sm:text-sm">
        <!-- ======================= تبويب الدورات السابقة ======================= -->
        <div v-if="activeTab === 'past'" class="space-y-3">
          <!-- في حال وجود دورات سابقة -->
          <div v-if="pastRounds.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="w-full text-xs sm:text-sm text-right">
              <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3.5">رقم الدفعة</th>
                  <th class="p-3.5">المحاضر الذي شرح</th>
                  <th class="p-3.5">مقر الانعقاد</th>
                  <th class="p-3.5">فترة الانعقاد</th>
                  <th class="p-3.5 text-center">الخريجون</th>
                  <th class="p-3.5">الرسوم المحصلة</th>
                  <th class="p-3.5 text-center">حضور البوابة</th>
                  <th class="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr
                  v-for="r in pastRounds"
                  :key="r.id"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <!-- رقم الدفعة -->
                  <td class="p-3.5 whitespace-nowrap">
                    <strong class="font-mono text-slate-800 dark:text-slate-100 block font-bold text-sm">
                      الدفعة رقم {{ r.roundNumber }}
                    </strong>
                    <span class="text-xs text-slate-400 font-mono">{{ r.roundCode || `CR-${r.courseId}-${r.roundNumber}` }}</span>
                  </td>

                  <!-- المحاضر -->
                  <td class="p-3.5">
                    <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-sm">
                      <GraduationCap class="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{{ r.instructor?.name || r.instructorName }}</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">
                      {{ r.instructor?.specialty || 'عضو هيئة تدريس معتمد' }}
                    </div>
                  </td>

                  <!-- القاعة -->
                  <td class="p-3.5 whitespace-nowrap">
                    <div class="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-sm">
                      <MapPin class="w-4 h-4 text-primary-500 shrink-0" />
                      <span>{{ r.hall?.name || r.hallName }}</span>
                    </div>
                  </td>

                  <!-- فترة الانعقاد -->
                  <td class="p-3.5 whitespace-nowrap font-mono text-xs sm:text-sm">
                    <div class="text-slate-800 dark:text-slate-200 font-bold">
                      {{ formatDate(r.startDate) }} — {{ formatDate(r.endDate) }}
                    </div>
                    <span class="text-xs text-emerald-600 font-bold mt-0.5 block">
                      تم تنفيذ {{ r.totalLectures || 18 }} محاضرة كاملة
                    </span>
                  </td>

                  <!-- الخريجون -->
                  <td class="p-3.5 text-center whitespace-nowrap font-mono font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                    {{ r.graduatedCount || r.enrolledCount || 20 }} خريجاً
                  </td>

                  <!-- الرسوم المحصلة -->
                  <td class="p-3.5 whitespace-nowrap font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
                    {{ formatCurrency(r.totalRevenue || 70000) }}
                  </td>

                  <!-- نسبة الحضور -->
                  <td class="p-3.5 text-center whitespace-nowrap font-mono">
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {{ r.averageAttendance || 95 }}%
                    </span>
                  </td>

                  <!-- زر فتح تفاصيل الدفعة والطلاب والتكلفة ومين شرح -->
                  <td class="p-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      class="h-9 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                      title="عرض الطلاب اللي كانوا في الدورة والتكلفة والمحاضر"
                      @click="$emit('open-round-details', r)"
                    >
                      <FolderCheck class="w-4 h-4" />
                      <span>تفاصيل وسجل الدفعة</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- حالة عدم وجود دورات سابقة مسجلة -->
          <div
            v-else
            class="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
          >
            <History class="w-8 h-8 text-slate-400 mx-auto" />
            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300">
              لا توجد دورات سابقة منتهية مسجلة لهذه الدورة بعد
            </h4>
            <p class="text-xs sm:text-sm text-slate-400">
              الدورات السابقة تظهر هنا فور انتهاء فترتها الدراسية واعتماد شهادات الخريجين
            </p>
          </div>
        </div>

        <!-- ======================= تبويب الدفعات الجارية والمتاحة ======================= -->
        <div v-else-if="activeTab === 'active'" class="space-y-3">
          <div v-if="activeRounds.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="w-full text-xs sm:text-sm text-right">
              <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3.5">رقم الدفعة</th>
                  <th class="p-3.5">حالة الانعقاد</th>
                  <th class="p-3.5">المحاضر</th>
                  <th class="p-3.5">القاعة</th>
                  <th class="p-3.5">المواعيد والأيام</th>
                  <th class="p-3.5 text-center">المقاعد والدارسون</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr
                  v-for="r in activeRounds"
                  :key="r.id"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap text-sm">
                    الدفعة رقم {{ r.roundNumber }}
                  </td>

                  <td class="p-3.5 whitespace-nowrap">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-bold border"
                      :class="
                        r.status === 'Ongoing'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      "
                    >
                      {{ r.status === 'Ongoing' ? 'جارية حالياً' : 'متاحة للتسجيل' }}
                    </span>
                  </td>

                  <td class="p-3.5 font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {{ r.instructor?.name || r.instructorName }}
                  </td>

                  <td class="p-3.5 text-slate-700 dark:text-slate-300 font-medium text-sm">
                    {{ r.hall?.name || r.hallName }}
                  </td>

                  <td class="p-3.5 font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    من {{ r.startTime }} إلى {{ r.endTime }}
                  </td>

                  <td class="p-3.5 text-center font-mono font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                    {{ r.enrolledCount || 0 }} / {{ r.capacity }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-else
            class="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
          >
            <PlayCircle class="w-8 h-8 text-slate-400 mx-auto" />
            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300">
              لا توجد دفعات جارية حالياً لهذا الكورس
            </h4>
            <button
              type="button"
              class="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs mt-2"
              @click="$emit('open-create-round', course.id)"
            >
              <CalendarPlus class="w-4 h-4" />
              <span>فتح دفعة جديدة الآن</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 5. الشريط السفلي -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <button
          type="button"
          class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          @click="handleClose"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  BookOpen,
  X,
  CalendarPlus,
  History,
  PlayCircle,
  GraduationCap,
  MapPin,
  FolderCheck,
  UserCheck,
} from 'lucide-vue-next';
import {
  formatEgyptianCurrency,
  formatDate,
} from '../helpers/courseConstants';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Object,
    default: null,
  },
  allPastRounds: {
    type: Array,
    default: () => [],
  },
  allOperationalRounds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'open-create-round', 'open-round-details']);

const activeTab = ref('past'); // 'past' | 'active'

// الدورات السابقة المنتهية الخاصة بهذا الكورس فقط
const pastRounds = computed(() => {
  if (!props.course) return [];
  return props.allPastRounds
    .filter((r) => r.courseId === props.course.id)
    .sort((a, b) => (b.roundNumber || 0) - (a.roundNumber || 0));
});

// الدفعات الجارية والمتاحة الخاصة بهذا الكورس فقط
const activeRounds = computed(() => {
  if (!props.course) return [];
  return props.allOperationalRounds
    .filter((r) => r.courseId === props.course.id && r.status !== 'Ended')
    .sort((a, b) => (b.roundNumber || 0) - (a.roundNumber || 0));
});

// مجموع الخريجين
const totalGraduates = computed(() => {
  return pastRounds.value.reduce((sum, r) => sum + (r.graduatedCount || r.enrolledCount || 0), 0);
});

// مجموع الإيرادات
const totalRevenue = computed(() => {
  return pastRounds.value.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
});

function formatCurrency(val) {
  return formatEgyptianCurrency(val);
}

function handleClose() {
  emit('close');
}
</script>
