<template>
  <div class="space-y-4 select-none">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
          <DoorOpen class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>سجل حركات مسح البوابة وتدقيق الـ QR للدارس</span>
        </h3>
        <span class="text-xs text-slate-400 font-bold">
          {{ logs.length }} حركات مسجلة
        </span>
      </div>

      <AppTable
        :columns="columns"
        :data="logs"
        empty-title="لا توجد حركات مسح مسجلة لهذا الدارس"
        empty-text="لم يقم الدارس بأي حركات مسح لتصريح الدخول من البوابات حتى الآن"
      >
        <!-- 1. توقيت المسح -->
        <template #time="{ row }">
          <div class="font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 text-xs">
            <Clock class="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span>{{ formatDateTime(row.scannedAt) }}</span>
          </div>
        </template>

        <!-- 2. البوابة وفرد الأمن -->
        <template #gate="{ row }">
          <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">
            {{ row.gateName }}
          </div>
          <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Shield class="w-3 h-3 text-slate-400" />
            <span>{{ row.officerName }}</span>
          </div>
        </template>

        <!-- 3. الدورة التدريبية -->
        <template #course="{ row }">
          <div class="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[200px]" :title="row.courseName">
            {{ row.courseName }}
          </div>
        </template>

        <!-- 4. قرار الدخول -->
        <template #decision="{ row }">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
            :class="
              row.decision === 'Allowed'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            "
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="row.decision === 'Allowed' ? 'bg-emerald-500' : 'bg-rose-500'"
            ></span>
            <span>{{ row.decision === 'Allowed' ? 'دخول مصرح' : 'دخول مرفوض' }}</span>
          </span>
        </template>

        <!-- 5. سبب القرار -->
        <template #reason="{ row }">
          <div
            class="text-xs font-medium max-w-[240px] truncate"
            :class="row.decision === 'Allowed' ? 'text-slate-600 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-bold'"
            :title="row.reason"
          >
            {{ row.reason }}
          </div>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { DoorOpen, Clock, Shield } from 'lucide-vue-next';
import AppTable from '@/shared/ui/Table/AppTable.vue';
import { formatDateTime } from '../helpers/traineeProfileConstants';

defineProps({
  logs: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  { key: 'time', label: 'توقيت وتاريخ المسح', cellClass: 'whitespace-nowrap' },
  { key: 'gate', label: 'البوابة وفرد الأمن', cellClass: 'whitespace-nowrap' },
  { key: 'course', label: 'الدورة التدريبية' },
  { key: 'decision', label: 'القرار الأمني', cellClass: 'whitespace-nowrap' },
  { key: 'reason', label: 'سبب القرار المسجل' },
];
</script>
