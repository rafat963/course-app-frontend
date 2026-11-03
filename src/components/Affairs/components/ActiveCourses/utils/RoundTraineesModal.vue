<template>
  <div
    v-if="isOpen && round"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-2xs">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                كشف الدارسين المقيدين بالدفعة
              </h3>
              <span class="px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 font-mono">
                {{ traineesList.length }} دارساً
              </span>
            </div>
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ round.courseName }} — الدفعة رقم {{ round.roundNumber }} ({{ round.hall?.name }})
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- زر تصدير / طباعة الكشف -->
          <button
            type="button"
            class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="handlePrint"
          >
            <Printer class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>طباعة الكشف</span>
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

      <!-- 2. محتوى الجدول -->
      <div class="p-6 space-y-4 max-h-[calc(85vh-130px)] overflow-y-auto">
        <!-- شريط البحث السريع داخل كشف المتدربين -->
        <div class="relative">
          <input
            v-model="traineeSearchQuery"
            type="text"
            placeholder="ابحث بالاسم أو الرقم القومي أو الهاتف..."
            class="w-full h-11 pr-11 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
          />
          <Search class="w-4.5 h-4.5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>

        <!-- جدول المتدربين -->
        <div v-if="filteredTrainees.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-xs sm:text-sm text-right">
            <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3.5">الدارس</th>
                <th class="p-3.5">الرقم القومي</th>
                <th class="p-3.5">فئة المتدرب</th>
                <th class="p-3.5">رقم الهاتف</th>
                <th class="p-3.5 text-center">حضور المحاضرات</th>
                <th class="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr
                v-for="t in filteredTrainees"
                :key="t.id"
                class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <!-- اسم الدارس وصورته -->
                <td class="p-3.5">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="t.profilePhotoPath"
                      :src="t.profilePhotoPath"
                      :alt="t.fullName"
                      class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div
                      v-else
                      class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-sm shrink-0"
                    >
                      {{ t.fullName?.slice(0, 1) }}
                    </div>
                    <div>
                      <strong class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 block">
                        {{ t.fullName }}
                      </strong>
                      <span class="text-xs text-slate-400 font-mono font-bold">{{ t.applicationCode }}</span>
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
                    class="px-3 py-1 rounded-full text-xs font-bold border"
                    :class="getCategoryBadge(t.category).class"
                  >
                    {{ getCategoryBadge(t.category).label }}
                  </span>
                </td>

                <!-- الهاتف -->
                <td class="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm">
                  {{ t.phone }}
                </td>

                <!-- الحضور -->
                <td class="p-3.5 text-center whitespace-nowrap font-mono">
                  <span
                    v-if="round.status === 'Available'"
                    class="px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"
                  >
                    قيد التسجيل والقبول
                  </span>
                  <span
                    v-else
                    class="px-3 py-1 rounded-md text-xs sm:text-sm font-bold"
                    :class="
                      t.attendanceRate >= 95
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                    "
                  >
                    {{ t.attendanceRate }}% ({{ t.attendedLectures }} محاضرات)
                  </span>
                </td>

                <!-- زر الإجراءات (فتح ملف المتدرب الموحد) -->
                <td class="p-3.5 text-center whitespace-nowrap">
                  <button
                    type="button"
                    class="h-9.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
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

        <!-- حالة فارغة عند البحث -->
        <div v-else class="p-8 text-center text-sm font-bold text-slate-400">
          لا يوجد دارسون مطابقون لنص البحث داخل هذه الدفعة
        </div>
      </div>

      <!-- 3. أسفل النافذة -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-800/80">
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
  Users,
  Printer,
  X,
  Search,
  Eye,
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'open-trainee-profile']);

const traineeSearchQuery = ref('');

const traineesList = computed(() => {
  return props.round?.enrolledTrainees || [];
});

const filteredTrainees = computed(() => {
  if (!traineeSearchQuery.value) return traineesList.value;
  const q = traineeSearchQuery.value.trim().toLowerCase();
  return traineesList.value.filter((t) => {
    const name = t.fullName?.toLowerCase() || '';
    const nid = t.nationalId || '';
    const phone = t.phone || '';
    return name.includes(q) || nid.includes(q) || phone.includes(q);
  });
});

function getCategoryBadge(cat) {
  const map = {
    Civilian: { label: 'مدني', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    MilitaryOfficer: { label: 'ضابط ق.م', class: 'bg-primary-50 text-primary-800 border-primary-200' },
    MilitaryFamily: { label: 'عائلات ق.م', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    PoliceOfficerOrFamily: { label: 'شرطة', class: 'bg-blue-50 text-blue-800 border-blue-200' },
  };
  return map[cat] || { label: cat || 'مدني', class: 'bg-slate-100 text-slate-700 border-slate-200' };
}

function openTraineeModal(trainee) {
  // تغليف بيانات المتدرب لتطابق متطلبات TraineeDetailsModal
  const logCompatible = {
    trainee: {
      userId: trainee.id,
      fullName: trainee.fullName,
      nationalId: trainee.nationalId,
      phone: trainee.phone,
      email: trainee.email,
      category: trainee.category,
      occupation: trainee.occupation,
      governorate: trainee.governorate,
      profilePhotoPath: trainee.profilePhotoPath,
      nationalIdFrontPhotoPath: trainee.nationalIdFrontPhotoPath,
      nationalIdBackPhotoPath: trainee.nationalIdBackPhotoPath,
    },
    courseRound: {
      courseName: props.round.courseName,
      roundNumber: props.round.roundNumber,
      instructorName: props.round.instructor?.name,
      hallName: props.round.hall?.name,
      startDate: props.round.startDate,
      endDate: props.round.endDate,
    },
    decision: 'Allowed',
    scannedAt: new Date().toISOString(),
  };

  emit('open-trainee-profile', logCompatible);
}

function handleClose() {
  emit('close');
}

function handlePrint() {
  window.print();
}
</script>
