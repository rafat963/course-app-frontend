<template>
  <div class="space-y-4">
    <div
      v-if="applications.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-4.5"
    >
      <div
        v-for="app in applications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4.5 sm:p-5 shadow-2xs hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900/60 transition-all flex flex-col justify-between group"
      >
        <!-- 1. ترويسة الكارت: الصورة والاسم ورقم الطلب وحالة المهلة -->
        <div>
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-3 min-w-0">
              <!-- الصورة الشخصية -->
              <div class="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-amber-700 dark:text-amber-300 font-black text-sm sm:text-base shrink-0 overflow-hidden shadow-2xs">
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
                  {{ app.code }}
                </span>
              </div>
            </div>

            <!-- شارة حالة المهلة -->
            <span
              class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shrink-0 shadow-2xs"
              :class="
                isOverdue(app.paymentDueDate)
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
              "
            >
              {{ isOverdue(app.paymentDueDate) ? 'فات موعدها' : getRemainingText(app.paymentDueDate) }}
            </span>
          </div>

          <!-- 2. بيانات الدورة وتفاصيل الاستحقاق -->
          <div class="my-4 space-y-3">
            <!-- اسم الدورة والدفعة -->
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 truncate" :title="app.courseRound?.courseName">
                {{ app.courseRound?.courseName }}
              </span>
              <span class="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                دفعة {{ app.courseRound?.roundNumber || 1 }}
              </span>
            </div>

            <!-- صف المعلومات: تاريخ المهلة والمبلغ المطلوب -->
            <div class="flex items-center justify-between pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800/80">
              <div class="flex flex-col items-start gap-0.5 text-xs sm:text-sm">
                <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Clock class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>متاح السداد حتى:</span>
                </div>
                <span
                  class="font-mono font-bold text-xs sm:text-sm"
                  :class="isOverdue(app.paymentDueDate) ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'"
                >
                  {{ formatDate(app.paymentDueDate) }} <span class="text-[10px] font-sans font-normal text-slate-400">(يدفع قبله)</span>
                </span>
              </div>
              <div class="flex flex-col items-end gap-0.5">
                <span class="text-[11px] text-slate-400">المبلغ المطلوب:</span>
                <strong class="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-mono">
                  {{ formatCurrency(app.courseRound?.price) }}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. أزرار الإجراءات: تسجيل السداد + تمديد + إلغاء + تفاصيل (جميعها بأسماء واضحة) -->
        <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <!-- زر تسجيل السداد الأساسي -->
          <button
            type="button"
            class="w-full h-10 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            title="تسجيل إيصال السداد وتحويل الدارس لمقيد"
            @click="$emit('recordPayment', app)"
          >
            <Receipt class="w-4.5 h-4.5" />
            <span>تسجيل السداد</span>
          </button>

          <!-- صف الأزرار الثانوية بأسماء واضحة لجميع الإجراءات -->
          <div class="grid grid-cols-3 gap-2">
            <!-- زر التفاصيل الكاملة -->
            <button
              type="button"
              class="h-9 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              title="عرض التفاصيل والملف"
              @click="$emit('openDetails', app)"
            >
              <Eye class="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>تفاصيل</span>
            </button>

            <!-- زر تمديد المهلة -->
            <button
              type="button"
              class="h-9 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              title="تمديد مهلة السداد (3 أيام، 5 أيام، أو حتى تاريخ محدد)"
              @click="$emit('extendDeadline', app)"
            >
              <CalendarPlus class="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>تمديد المهلة</span>
            </button>

            <!-- زر إلغاء الطلب -->
            <button
              type="button"
              class="h-9 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              title="إلغاء إذن السداد لانتهاء المهلة"
              @click="$emit('cancelApplication', app)"
            >
              <XCircle class="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>إلغاء</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- الحالة الفارغة -->
    <div
      v-else
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-2 text-slate-400"
    >
      <Inbox class="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
      <p class="text-sm font-bold">لا توجد طلبات في انتظار السداد تطابق الفلترة الحالية</p>
    </div>
  </div>
</template>

<script setup>
import { Clock, Receipt, CalendarPlus, XCircle, Eye, Inbox } from 'lucide-vue-next';
import { formatDateOnly, formatEgyptianCurrency } from '../helpers/pendingPaymentConstants';

defineProps({
  applications: {
    type: Array,
    required: true,
  },
});

defineEmits(['openDetails', 'recordPayment', 'extendDeadline', 'cancelApplication']);

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + ' ' + parts[1][0];
  return name.slice(0, 2);
}

function formatDate(dateStr) {
  return formatDateOnly ? formatDateOnly(dateStr) : dateStr;
}

function formatCurrency(val) {
  return formatEgyptianCurrency ? formatEgyptianCurrency(val) : `${val} ج.م`;
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

function getRemainingText(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `متأخر منذ ${Math.abs(diffDays)} يوم`;
  if (diffDays === 0) return 'ينتهي اليوم';
  return `متبقي ${diffDays} يوم`;
}
</script>