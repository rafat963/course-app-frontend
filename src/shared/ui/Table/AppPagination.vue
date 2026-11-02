<template>
  <div
    v-if="totalItems > 0"
    class="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs select-none"
  >
    <!-- اليمين: عناصر وأزرار الباجينيشن (السابق / أرقام الصفحات / التالي / عدد العناصر) -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- أزرار التنقل بين الصفحات -->
      <div class="flex items-center gap-1.5">
        <!-- زر السابق (في الـ RTL يعود للخلف جهة اليمين) -->
        <button
          type="button"
          :disabled="currentPage <= 1"
          class="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-1 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer font-bold shadow-2xs"
          title="الصفحة السابقة"
          @click="changePage(currentPage - 1)"
        >
          <ChevronRight class="w-4 h-4" />
          <span>السابق</span>
        </button>

        <!-- أرقام الصفحات التفاعلية -->
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer text-xs"
            :class="
              currentPage === page
                ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-xs font-black'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            "
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>

        <!-- زر التالي (في الـ RTL يتقدم للأمام جهة اليسار) -->
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-1 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer font-bold shadow-2xs"
          title="الصفحة التالية"
          @click="changePage(currentPage + 1)"
        >
          <span>التالي</span>
          <ChevronLeft class="w-4 h-4" />
        </button>
      </div>

      <!-- فاصل عمودي خفيف -->
      <span class="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:inline"></span>

      <!-- تحديد عدد العناصر بالصفحة (PrimeVue Select) -->
      <div v-if="showPerPage" class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <span>لكل صفحة:</span>
        <Select
          :model-value="itemsPerPage"
          :options="normalizedPerPageOptions"
          option-label="label"
          option-value="value"
          size="small"
          class="w-28 text-xs font-bold rounded-lg h-8 flex items-center"
          @update:model-value="changePerPage"
        />
      </div>
    </div>

    <!-- اليسار: ملخص عدد السجلات وظهورها بنمط متناسق مع الدارك مود -->
    <div class="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
      <span>عرض من</span>
      <span class="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
        {{ startIndex + 1 }} - {{ Math.min(endIndex, totalItems) }}
      </span>
      <span>من إجمالي</span>
      <span class="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
        {{ totalItems }}
      </span>
      <span>{{ itemLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import Select from 'primevue/select';
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  perPageOptions: {
    type: Array,
    default: () => [
      { label: '5 عناصر', value: 5 },
      { label: '10 عناصر', value: 10 },
      { label: '20 عنصر', value: 20 },
      { label: '50 عنصر', value: 50 },
    ],
  },
  showPerPage: {
    type: Boolean,
    default: true,
  },
  itemLabel: {
    type: String,
    default: 'عنصر',
  },
  maxVisiblePages: {
    type: Number,
    default: 7,
  },
});

const emit = defineEmits([
  'update:currentPage',
  'update:current-page',
  'update:itemsPerPage',
  'update:items-per-page',
  'page-change',
]);

// توحيد خيارات عدد العناصر بالصفحة سواء مُررت كأرقام [5, 10] أو كائنات [{ label, value }]
const normalizedPerPageOptions = computed(() => {
  if (!Array.isArray(props.perPageOptions) || props.perPageOptions.length === 0) {
    return [
      { label: `5 ${props.itemLabel}`, value: 5 },
      { label: `10 ${props.itemLabel}`, value: 10 },
      { label: `20 ${props.itemLabel}`, value: 20 },
    ];
  }

  return props.perPageOptions.map((opt) => {
    if (typeof opt === 'number' || typeof opt === 'string') {
      const num = Number(opt);
      return {
        label: `${num} ${props.itemLabel}`,
        value: num,
      };
    }
    if (opt && typeof opt === 'object') {
      return {
        label: opt.label ?? `${opt.value} ${props.itemLabel}`,
        value: Number(opt.value),
      };
    }
    return { label: String(opt), value: Number(opt) || 5 };
  });
});

const totalPages = computed(() => {
  const perPage = Number(props.itemsPerPage) || 5;
  return Math.max(1, Math.ceil(props.totalItems / perPage));
});

const startIndex = computed(() => {
  const current = Number(props.currentPage) || 1;
  const perPage = Number(props.itemsPerPage) || 5;
  return (current - 1) * perPage;
});

const endIndex = computed(() => {
  const perPage = Number(props.itemsPerPage) || 5;
  return startIndex.value + perPage;
});

// حساب الصفحات المرئية ديناميكياً
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = Number(props.currentPage) || 1;
  const max = props.maxVisiblePages;

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - Math.floor(max / 2));
  let end = start + max - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - max + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// ضبط الصفحة في حال تقلص عدد السجلات بعد البحث أو الفلترة أو الحذف
watch(
  [() => props.totalItems, () => props.itemsPerPage],
  () => {
    const perPage = Number(props.itemsPerPage) || 5;
    const maxPage = Math.max(1, Math.ceil(props.totalItems / perPage));
    if (props.currentPage > maxPage) {
      changePage(maxPage);
    }
  }
);

function changePage(page) {
  const numPage = Number(page);
  if (numPage >= 1 && numPage <= totalPages.value && numPage !== props.currentPage) {
    emit('update:currentPage', numPage);
    emit('update:current-page', numPage);
    emit('page-change', { page: numPage, itemsPerPage: props.itemsPerPage });
  }
}

function changePerPage(val) {
  const numericVal = typeof val === 'object' && val !== null ? Number(val.value) : Number(val);
  const finalVal = isNaN(numericVal) || numericVal <= 0 ? 5 : numericVal;
  emit('update:itemsPerPage', finalVal);
  emit('update:items-per-page', finalVal);
  // عند تغيير عدد العناصر في الصفحة نعود تلقائياً للصفحة الأولى
  emit('update:currentPage', 1);
  emit('update:current-page', 1);
  emit('page-change', { page: 1, itemsPerPage: finalVal });
}
</script>
