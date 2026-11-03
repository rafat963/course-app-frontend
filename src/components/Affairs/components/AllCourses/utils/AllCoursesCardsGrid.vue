<template>
  <div v-if="courses.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
      <GraduationCap class="w-8 h-8" />
    </div>
    <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
      لا توجد دورات تدريبية مطابقة لمعايير البحث
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
      جرّب تغيير تبويب حالة الدورة أو مسح نص البحث لعرض كافة دورات الكتالوج
    </p>
    <button
      v-if="isFiltered"
      type="button"
      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
      @click="$emit('clear-filters')"
    >
      <RotateCcw class="w-3.5 h-3.5" />
      <span>إعادة ضبط الفلاتر</span>
    </button>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div
      v-for="row in courses"
      :key="row.id"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all relative overflow-hidden group space-y-4"
    >
      <!-- الشريط العلوي للبطاقة -->
      <div
        class="absolute top-0 right-0 left-0 h-1.5"
        :class="row.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
      ></div>

      <div class="space-y-3.5">
        <!-- رأس البطاقة: الاسم وشارة النشاط -->
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div class="min-w-0 flex-1">
            <button
              type="button"
              class="text-right font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer block truncate w-full leading-tight font-heading"
              :title="`معاينة تفاصيل دورة ${row.name}`"
              @click="$emit('view-details', row)"
            >
              {{ row.name }}
            </button>
            <div v-if="row.instructorName" class="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold mt-1">
              <UserCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>المحاضر: {{ row.instructorName }}</span>
            </div>
          </div>

          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs shrink-0"
            :class="
              row.isActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            "
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="row.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
            ></span>
            <span>{{ row.isActive ? 'نشطة' : 'معطلة' }}</span>
          </span>
        </div>

        <!-- التوصيف المختصر -->
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed" :title="row.description">
          {{ row.description }}
        </p>

        <!-- شبكة التسعير المعتمد للفئات الأربعة -->
        <div class="space-y-1.5 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300">الرسوم المعتمدة للفئات:</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between px-2.5">
              <span class="text-slate-500 font-medium text-xs">مدني:</span>
              <strong class="font-mono text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm">
                {{ formatEgyptianCurrency(row.pricings?.Civilian) }}
              </strong>
            </div>
            <div class="p-2 rounded-xl bg-primary-50/50 dark:bg-primary-950/40 border border-primary-200/70 dark:border-primary-800/60 flex items-center justify-between px-2.5">
              <span class="text-primary-800 dark:text-primary-300 font-medium text-xs">ضابط ق.م:</span>
              <strong class="font-mono text-primary-900 dark:text-primary-100 font-bold text-xs sm:text-sm">
                {{ formatEgyptianCurrency(row.pricings?.MilitaryOfficer) }}
              </strong>
            </div>
            <div class="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-between px-2.5">
              <span class="text-emerald-800 dark:text-emerald-300 font-medium text-xs">عائلات ق.م:</span>
              <strong class="font-mono text-emerald-900 dark:text-emerald-100 font-bold text-xs sm:text-sm">
                {{ formatEgyptianCurrency(row.pricings?.MilitaryFamily) }}
              </strong>
            </div>
            <div class="p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 flex items-center justify-between px-2.5">
              <span class="text-blue-800 dark:text-blue-300 font-medium text-xs">شرطة:</span>
              <strong class="font-mono text-blue-900 dark:text-blue-100 font-bold text-xs sm:text-sm">
                {{ formatEgyptianCurrency(row.pricings?.PoliceOfficerOrFamily) }}
              </strong>
            </div>
          </div>
        </div>

        <!-- إحصاءات الدفعات والدارسين -->
        <button
          type="button"
          class="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors text-xs sm:text-sm"
          title="انقر لاستعراض كافة دورات الانعقاد"
          @click="$emit('view-rounds', row)"
        >
          <div class="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Layers class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
            <span>{{ row.roundsCount }} دفعة انعقاد</span>
            <span v-if="row.activeRoundsCount > 0" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              ({{ row.activeRoundsCount }} جارية)
            </span>
          </div>

          <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">
            <Users class="w-4 h-4 text-slate-400" />
            <span>{{ row.traineesCount }} دارساً</span>
          </div>
        </button>

        <!-- تاريخ الإضافة -->
        <div class="flex items-center justify-between text-xs sm:text-sm text-slate-400 dark:text-slate-500 px-1 font-mono">
          <span>تاريخ الإضافة:</span>
          <span>{{ formatDate(row.createdAt) }}</span>
        </div>
      </div>

      <!-- شريط الإجراءات -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 mt-1">
        <!-- زر تفاصيل الدورة -->
        <button
          type="button"
          class="h-10 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="معاينة تفاصيل الدورة، والدورات السابقة المنعقدة بها"
          @click="$emit('view-details', row)"
        >
          <FolderOpen class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>تفاصيل الدورة</span>
        </button>

        <!-- زر فتح دفعة انعقاد -->
        <button
          type="button"
          class="h-10 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="فتح دورة انعقاد جديدة من هذا الكورس"
          @click="$emit('create-round', row)"
        >
          <CalendarPlus class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>فتح دفعة</span>
        </button>

        <!-- زر تعديل -->
        <button
          type="button"
          class="h-10 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="تعديل بيانات الدورة والتسعير"
          @click="$emit('edit-course', row)"
        >
          <Edit class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>تعديل</span>
        </button>

        <!-- زر حذف -->
        <button
          type="button"
          class="h-10 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          title="حذف الدورة من الكتالوج"
          @click="$emit('delete-course', row)"
        >
          <Trash2 class="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>حذف</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Layers,
  Users,
  Edit,
  Trash2,
  CalendarPlus,
  FolderOpen,
  UserCheck,
  GraduationCap,
  RotateCcw,
} from 'lucide-vue-next';
import { formatEgyptianCurrency, formatDate } from '../helpers/courseConstants';

defineProps({
  courses: {
    type: Array,
    default: () => [],
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  'edit-course',
  'delete-course',
  'create-round',
  'view-rounds',
  'view-details',
  'clear-filters',
]);
</script>
