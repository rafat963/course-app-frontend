<template>
  <div v-if="round" class="space-y-4 select-none pb-8 animate-fade-in">
    <!-- 1. شريط التنقل العلوي وزر الرجوع وأزرار الإجراءات -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
      <div class="flex items-center gap-3">
        <!-- زر الرجوع إلى قائمة الدورات السابقة -->
        <button
          type="button"
          class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          title="الرجوع إلى قائمة الدورات السابقة"
          @click="$emit('back')"
        >
          <ArrowRight class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>رجوع إلى الدورات السابقة</span>
        </button>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
              سجل تفاصيل الدفعة رقم {{ round.roundNumber }}: {{ round.courseName }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {{ round.roundCode }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              منتهية ومؤرشفة
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            سجل الطلاب الخريجين، تفاصيل التكلفة والإيرادات، وسجل الحضور والمحاضر
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <!-- زر طباعة تقرير الدفعة الشامل -->
        <button
          type="button"
          class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          @click="handlePrint"
        >
          <Printer class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>طباعة التقرير</span>
        </button>
      </div>
    </div>

    <!-- 2. بطاقات الإحصائيات الأربعة (KPIs) للدفعة -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            الخريجون المعتمدون
          </span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {{ round.graduatedCount || 0 }}
            </span>
            <span class="text-xs text-slate-500 font-bold">دارساً ناجحاً</span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <GraduationCap class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            الإيراد المحصل
          </span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-black font-mono text-primary-700 dark:text-primary-300">
              {{ formatEgyptianCurrency(round.totalRevenue) }}
            </span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
          <Wallet class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            صافي العائد التقديري
          </span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {{ formatEgyptianCurrency((round.totalRevenue || 0) - (round.instructorCost || 0) - (round.operationalCost || 0)) }}
            </span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
          <Receipt class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            متوسط حضور البوابة
          </span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
              {{ round.averageAttendance || 0 }}%
            </span>
            <span class="text-xs text-slate-500 font-bold">التزام</span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <CheckCircle2 class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- 3. شريط التبويبات الداخلية -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          :class="
            currentTab === 'trainees'
              ? 'bg-primary-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          "
          @click="currentTab = 'trainees'"
        >
          <Users class="w-4 h-4" />
          <span>الطلاب الخريجون بالدورة ({{ round.graduatedTrainees?.length || round.graduatedCount || 0 }})</span>
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          :class="
            currentTab === 'finance'
              ? 'bg-primary-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          "
          @click="currentTab = 'finance'"
        >
          <Wallet class="w-4 h-4" />
          <span>التكلفة والإيرادات المحصلة</span>
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          :class="
            currentTab === 'instructor'
              ? 'bg-primary-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          "
          @click="currentTab = 'instructor'"
        >
          <GraduationCap class="w-4 h-4" />
          <span>المحاضر وبيانات الانعقاد</span>
        </button>
      </div>

      <!-- محتوى التبويب 1: كشف الخريجين -->
      <div v-if="currentTab === 'trainees'" class="space-y-4">
        <!-- شريط البحث السريع داخل كشف الخريجين -->
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="traineeSearch"
            type="text"
            placeholder="ابحث باسم الخريج، الرقم القومي، رقم الإيصال، أو كود الشهادة..."
            class="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
          />
          <button
            v-if="traineeSearch"
            type="button"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            @click="traineeSearch = ''"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- جدول الخريجين -->
        <div v-if="filteredTrainees.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-xs sm:text-sm text-right">
            <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3.5">الدارس الخريج</th>
                <th class="p-3.5">الرقم القومي</th>
                <th class="p-3.5">الفئة المسجلة</th>
                <th class="p-3.5">الرسوم وإيصال السداد</th>
                <th class="p-3.5 text-center">الحضور والتقييم</th>
                <th class="p-3.5">الشهادة المعتمدة</th>
                <th class="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr
                v-for="t in filteredTrainees"
                :key="t.id"
                class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <!-- اسم الدارس -->
                <td class="p-3.5">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="t.profilePhotoPath"
                      :src="t.profilePhotoPath"
                      :alt="t.fullName"
                      class="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div
                      v-else
                      class="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs shrink-0"
                    >
                      {{ t.fullName?.slice(0, 1) }}
                    </div>
                    <div>
                      <strong class="font-bold text-slate-800 dark:text-slate-100 block text-sm">
                        {{ t.fullName }}
                      </strong>
                      <span class="text-xs text-slate-400 font-medium">{{ t.occupation }}</span>
                    </div>
                  </div>
                </td>

                <!-- الرقم القومي -->
                <td class="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {{ t.nationalId }}
                </td>

                <!-- الفئة -->
                <td class="p-3.5 whitespace-nowrap">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold border"
                    :class="getCategoryBadge(t.category).class"
                  >
                    {{ getCategoryBadge(t.category).label }}
                  </span>
                </td>

                <!-- الرسوم وإيصال السداد -->
                <td class="p-3.5 whitespace-nowrap">
                  <div class="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
                    {{ formatEgyptianCurrency(t.paidAmount) }}
                  </div>
                  <div class="text-xs text-slate-400 font-mono flex items-center gap-1 font-bold mt-0.5">
                    <Receipt class="w-3.5 h-3.5 text-slate-400" />
                    <span>{{ t.receiptNumber }}</span>
                  </div>
                </td>

                <!-- الحضور والتقدير -->
                <td class="p-3.5 text-center whitespace-nowrap font-mono">
                  <div class="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {{ t.attendanceRate }}% ({{ t.attendedLectures }} محاضرة)
                  </div>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {{ t.grade }}
                  </span>
                </td>

                <!-- الشهادة المعتمدة -->
                <td class="p-3.5 whitespace-nowrap font-mono text-xs sm:text-sm">
                  <div class="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                    <Award class="w-4 h-4 text-amber-500" />
                    <span>{{ t.certificateCode }}</span>
                  </div>
                  <span class="text-xs text-slate-400 mt-0.5 block">بتاريخ: {{ formatDate(t.issueDate) }}</span>
                </td>

                <!-- زر عرض ملف المتدرب -->
                <td class="p-3.5 text-center whitespace-nowrap">
                  <button
                    type="button"
                    class="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    @click="openTraineeModal(t)"
                  >
                    <Eye class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span>ملف الدارس</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-8 text-center text-sm font-bold text-slate-400">
          لا يوجد خريجون مطابقون لنص البحث داخل هذه الدفعة
        </div>
      </div>

      <!-- محتوى التبويب 2: التكلفة والإيرادات -->
      <div v-else-if="currentTab === 'finance'" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
            <span class="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">
              إجمالي الإيرادات المحصلة:
            </span>
            <strong class="text-lg sm:text-xl font-black text-emerald-900 dark:text-emerald-200 font-mono block">
              {{ formatEgyptianCurrency(round.totalRevenue) }}
            </strong>
            <p class="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              من {{ round.graduatedCount }} دارساً مسدداً للرسوم
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
            <span class="text-xs text-amber-800 dark:text-amber-300 font-bold block">
              أتعاب المحاضر التقديرية:
            </span>
            <strong class="text-lg sm:text-xl font-black text-amber-900 dark:text-amber-200 font-mono block">
              {{ formatEgyptianCurrency(round.instructorCost) }}
            </strong>
            <p class="text-xs text-amber-700 dark:text-amber-400 font-medium">
              عن {{ round.totalLectures }} محاضرة تدريبية
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5">
            <span class="text-xs text-blue-800 dark:text-blue-300 font-bold block">
              صافي الفائض التشغيلي:
            </span>
            <strong class="text-lg sm:text-xl font-black text-blue-900 dark:text-blue-200 font-mono block">
              {{ formatEgyptianCurrency((round.totalRevenue || 0) - (round.instructorCost || 0) - (round.operationalCost || 0)) }}
            </strong>
            <p class="text-xs text-blue-700 dark:text-blue-400 font-medium">
              بعد خصم مصاريف التشغيل والمحاضر
            </p>
          </div>
        </div>
      </div>

      <!-- محتوى التبويب 3: المحاضر وبيانات الانعقاد -->
      <div v-else-if="currentTab === 'instructor'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- بيانات المحاضر -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <GraduationCap class="w-4 h-4 text-emerald-600" />
              <span>المحاضر المسؤول عن التنفيذ</span>
            </h4>
            <div class="space-y-2 text-xs">
              <div>
                <span class="text-slate-500 block text-[11px]">اسم المحاضر:</span>
                <strong class="text-slate-800 dark:text-slate-200 font-bold text-sm">
                  {{ round.instructor?.name || 'غير محدد' }}
                </strong>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">التخصص الأكاديمي:</span>
                <span class="text-slate-700 dark:text-slate-300 font-medium">
                  {{ round.instructor?.specialty }}
                </span>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">رقم هاتف التواصل:</span>
                <span class="font-mono text-slate-700 dark:text-slate-300">
                  {{ round.instructor?.phone }}
                </span>
              </div>
            </div>
          </div>

          <!-- بيانات القاعة والمواعيد -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <MapPin class="w-4 h-4 text-primary-600" />
              <span>المكان والجدول الزمني المنفذ</span>
            </h4>
            <div class="space-y-2 text-xs">
              <div>
                <span class="text-slate-500 block text-[11px]">القاعة التدريبية:</span>
                <strong class="text-slate-800 dark:text-slate-200 font-bold">
                  {{ round.hall?.name }} (سعة {{ round.hall?.maxCapacity }} مقعداً)
                </strong>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">فترة الانعقاد:</span>
                <span class="font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {{ formatDate(round.startDate) }} إلى {{ formatDate(round.endDate) }}
                </span>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">إجمالي المحاضرات المنفذة:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {{ round.totalLectures }} محاضرة تدريبية كاملة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  ArrowRight,
  Printer,
  GraduationCap,
  Wallet,
  Receipt,
  CheckCircle2,
  Users,
  Search,
  X,
  Award,
  Eye,
  MapPin,
} from 'lucide-vue-next';
import {
  formatDate,
  formatEgyptianCurrency,
} from '../../ArchivedCourses/helpers/archivedCoursesConstants';
import {
  APPLICANT_CATEGORIES,
} from '@/components/Affairs/components/ApplicantApplications/helpers/applicantConstants';

const props = defineProps({
  round: {
    type: Object,
    required: true,
  },
  course: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['back', 'open-trainee-profile']);

const currentTab = ref('trainees');
const traineeSearch = ref('');

function handlePrint() {
  window.print();
}

function getCategoryBadge(cat) {
  return (
    APPLICANT_CATEGORIES[cat] || {
      label: cat || '—',
      class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    }
  );
}

const filteredTrainees = computed(() => {
  const list = props.round?.graduatedTrainees || [];
  const q = traineeSearch.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) => {
    return (
      t.fullName?.toLowerCase().includes(q) ||
      t.nationalId?.includes(q) ||
      t.receiptNumber?.toLowerCase().includes(q) ||
      t.certificateCode?.toLowerCase().includes(q)
    );
  });
});

function openTraineeModal(trainee) {
  const logCompatible = {
    id: trainee.id,
    code: trainee.certificateCode || `TR-${trainee.id}`,
    trainee: {
      fullName: trainee.fullName,
      nationalId: trainee.nationalId,
      phone: trainee.phone,
      category: trainee.category,
      occupation: trainee.occupation,
      governorate: 'القاهرة',
      profilePhotoPath: trainee.profilePhotoPath,
    },
    courseRound: {
      courseName: props.round?.courseName,
      roundNumber: props.round?.roundNumber,
      hallName: props.round?.hall?.name,
      startDate: props.round?.startDate,
    },
    attendanceRate: trainee.attendanceRate,
    grade: trainee.grade,
  };
  emit('open-trainee-profile', logCompatible);
}
</script>
