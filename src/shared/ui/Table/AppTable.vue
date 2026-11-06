<template>
  <div class="w-full overflow-hidden">
    <!-- إشعار التمرير الأفقي الذكي للموبايل والتابلت -->
    <div class="lg:hidden flex items-center justify-between px-3 py-1.5 bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 select-none">
      <div class="flex items-center gap-1.5 font-medium">
        <ArrowLeftRight class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0 animate-pulse" />
        <span>اسحب أفقياً لتصفح بقية أعمدة الجدول</span>
      </div>
      <span class="text-[10px] text-primary-700 dark:text-primary-300 font-bold bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-full border border-primary-200 dark:border-primary-800/60">
        يمكنك التبديل لعرض الكروت ⊞
      </span>
    </div>

    <div class="overflow-x-auto custom-scrollbar w-full">
      <table class="w-full text-right text-xs border-collapse" :style="minWidth ? { minWidth } : {}">
        <!-- ترويسة الجدول: تباين واضح ولون خلفية ونص مميز بالرمادي الفاتح في الدارك موود -->
        <thead>
          <tr class="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-bold select-none tracking-wide">
            <th
              v-for="col in columns"
              :key="col.key"
              class="py-2.5 sm:py-3 px-3 sm:px-3.5 font-black text-xs uppercase whitespace-nowrap"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'left' ? 'text-left' : 'text-right',
                col.headerClass || ''
              ]"
              :style="col.width ? { width: col.width, minWidth: col.minWidth || col.width } : (col.minWidth ? { minWidth: col.minWidth } : {})"
            >
              <slot :name="`header-${col.key}`" :col="col">
                {{ col.label }}
              </slot>
            </th>
          </tr>
        </thead>

        <!-- جسم الجدول: نصوص بألوان نظام التصميم الافتراضية عالية التباين -->
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-800 dark:text-slate-200 font-medium">
          <!-- حالة التحميل -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="py-10 text-center text-slate-400">
              <slot name="loading">
                <div class="flex flex-col items-center justify-center gap-2 min-h-[380px] sm:min-h-[420px]">
                  <div class="w-6 h-6 border-2 border-slate-200 dark:border-slate-700 border-t-primary-600 rounded-full animate-spin"></div>
                  <span class="text-xs font-bold text-slate-500 dark:text-slate-400">جاري تحميل البيانات...</span>
                </div>
              </slot>
            </td>
          </tr>

          <!-- حالة عدم وجود بيانات -->
          <tr v-else-if="!data || data.length === 0">
            <td :colspan="columns.length" class="py-8 text-center">
              <slot name="empty">
                <div class="flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px]">
                  <div class="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                    <Inbox class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                    {{ emptyTitle }}
                  </h4>
                  <p class="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-sm">
                    {{ emptyText }}
                  </p>
                  <button
                    v-if="isFiltered"
                    type="button"
                    class="mt-2.5 px-3 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors cursor-pointer"
                    @click="$emit('clear-filters')"
                  >
                    إلغاء الفلاتر
                  </button>
                </div>
              </slot>
            </td>
          </tr>

          <!-- صفوف البيانات مع نص ناصع ومشرق في الدارك موود -->
          <tr
            v-for="(row, idx) in data"
            :key="row.id || idx"
            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group dark:text-slate-100"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="py-2.5 sm:py-3 px-3 sm:px-3.5 align-middle"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'left' ? 'text-left' : 'text-right',
                col.cellClass || ''
              ]"
              :style="col.width ? { width: col.width, minWidth: col.minWidth || col.width } : (col.minWidth ? { minWidth: col.minWidth } : {})"
            >
              <slot :name="col.key" :row="row" :value="row[col.key]" :index="idx">
                {{ row[col.key] ?? '—' }}
              </slot>
            </td>
          </tr>

          <!-- صفوف تكميلية فارغة لتثبيت ارتفاع الجدول على 6 عناصر لمنع قفز وتذبذب الشاشة -->
          <tr
            v-for="fIdx in fillerRowsCount"
            :key="`filler-row-${fIdx}`"
            class="pointer-events-none select-none transition-colors"
            aria-hidden="true"
          >
            <td
              v-for="col in columns"
              :key="`filler-col-${col.key}-${fIdx}`"
              class="py-2.5 sm:py-3 px-3 sm:px-3.5 align-middle"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'left' ? 'text-left' : 'text-right',
                col.cellClass || ''
              ]"
              :style="col.width ? { width: col.width, minWidth: col.minWidth || col.width } : (col.minWidth ? { minWidth: col.minWidth } : {})"
            >
              <div class="h-10 sm:h-11 invisible" aria-hidden="true">&nbsp;</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Inbox, ArrowLeftRight } from 'lucide-vue-next';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyTitle: {
    type: String,
    default: 'لا توجد بيانات مطابقة حالياً',
  },
  emptyText: {
    type: String,
    default: 'جرّب مسح نص البحث أو إعادة ضبط خيارات الفلترة لعرض كافة البيانات',
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
  minWidth: {
    type: String,
    default: '',
  },
  minRows: {
    type: Number,
    default: 6,
  },
});

defineEmits(['clear-filters']);

// حساب عدد الصفوف التكميلية لتثبيت ارتفاع الجدول على minRows (افتراضياً 6 عناصر)
const fillerRowsCount = computed(() => {
  if (props.loading) return 0;
  if (!props.data || props.data.length === 0) return 0;
  const currentCount = props.data.length;
  if (props.minRows > 0 && currentCount < props.minRows) {
    return props.minRows - currentCount;
  }
  return 0;
});
</script>
