<template>
  <div class="space-y-4">
    <div
      v-if="applications.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-4.5"
    >
      <div
        v-for="app in applications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4.5 sm:p-5 shadow-2xs hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/60 transition-all flex flex-col justify-between group"
      >
        <!-- 1. ترويسة الكارت: الصورة والاسم ورقم الطلب وفئة المتدرب -->
        <div>
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-3 min-w-0">
              <!-- الصورة الشخصية -->
              <div class="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200/80 dark:border-primary-800/80 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm sm:text-base shrink-0 overflow-hidden shadow-2xs">
                <img
                  v-if="app.trainee?.profilePhotoPath"
                  :src="app.trainee.profilePhotoPath"
                  alt="صورة المتدرب"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ getInitials(app.trainee?.fullName) }}</span>
              </div>

              <!-- الاسم والكود -->
              <div class="min-w-0">
                <h3
                  class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-heading truncate leading-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                  :title="app.trainee?.fullName"
                  @click="$emit('openDetails', app)"
                >
                  {{ app.trainee?.fullName }}
                </h3>
                <span class="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                  {{ app.code || ('#APP-' + app.id) }}
                </span>
              </div>
            </div>

            <!-- شارة الفئة -->
            <span
              class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shrink-0 shadow-2xs"
              :class="getCategoryBadgeClass(app.trainee?.category)"
            >
              {{ getCategoryLabel(app.trainee?.category) }}
            </span>
          </div>

          <!-- 2. بيانات الدورة والرسوم ورقم الهاتف -->
          <div class="my-4 space-y-3">
            <!-- اسم الدورة والدفعة -->
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 truncate" :title="app.courseRound?.courseName">
                {{ app.courseRound?.courseName }}
              </span>
              <span class="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/60 shrink-0">
                دفعة {{ app.courseRound?.roundNumber || 1 }}
              </span>
            </div>

            <!-- صف المعلومات: الهاتف والرسوم -->
            <div class="flex items-center justify-between pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800/80">
              <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
                <Phone class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="font-mono text-xs sm:text-sm font-bold" dir="ltr">{{ app.trainee?.phone || '—' }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs sm:text-sm text-slate-400">الرسوم:</span>
                <strong class="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-mono">
                  {{ formatEgyptianCurrency(app.courseRound?.price) }}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. أزرار الإجراءات: موافقة + رفض + تفاصيل (جميعها بأسماء واضحة) -->
        <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2">
          <!-- زر الموافقة -->
          <button
            type="button"
            class="h-10 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            title="موافقة وتحديد موعد السداد"
            @click="$emit('openApproval', app)"
          >
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>موافقة</span>
          </button>

          <!-- زر الرفض -->
          <button
            type="button"
            class="h-10 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            title="رفض الطلب"
            @click="$emit('openRejection', app)"
          >
            <XCircle class="w-4 h-4 shrink-0" />
            <span>رفض</span>
          </button>

          <!-- زر التفاصيل الكاملة -->
          <button
            type="button"
            class="h-10 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            title="عرض الملف والتفاصيل الكاملة"
            @click="$emit('openDetails', app)"
          >
            <Eye class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>تفاصيل</span>
          </button>
        </div>
      </div>
    </div>

    <!-- الحالة الفارغة -->
    <div
      v-else
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-2 text-slate-400"
    >
      <Inbox class="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
      <p class="text-sm font-bold">لا توجد طلبات تطابق الفلترة الحالية</p>
    </div>
  </div>
</template>

<script setup>
import { Phone, CheckCircle2, XCircle, Eye, Inbox } from 'lucide-vue-next';
import { formatEgyptianCurrency } from '../helpers/applicantConstants';

defineProps({
  applications: {
    type: Array,
    required: true,
  },
});

defineEmits(['openDetails', 'openApproval', 'openRejection']);

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}

function getCategoryLabel(cat) {
  const map = {
    Civilian: 'مدني',
    MilitaryOfficer: 'ضابط ق.م',
    MilitaryFamily: 'عائلات ضباط',
    PoliceOfficerOrFamily: 'شرطة',
  };
  return map[cat] || cat || 'عام';
}

function getCategoryBadgeClass(cat) {
  switch (cat) {
    case 'Civilian':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'MilitaryOfficer':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'MilitaryFamily':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'PoliceOfficerOrFamily':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}
</script>