<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none">
    <!-- 1. إجمالي الطلبات بانتظار السداد -->
    <AppKpiCard
      title="إجمالي بانتظار السداد"
      :value="totalCount"
      badge="طلب معتمد"
      badge-class="text-amber-600 dark:text-amber-400 font-bold"
      icon-bg="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
    >
      <template #icon>
        <Clock class="w-5 h-5" />
      </template>
    </AppKpiCard>

    <!-- 2. سارية ضمن المهلة -->
    <AppKpiCard
      title="سارية ضمن المهلة"
      :value="activeCount"
      badge="مهلة سارية"
      badge-class="text-emerald-600 dark:text-emerald-400 font-bold"
      icon-bg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
    >
      <template #icon>
        <CheckCircle2 class="w-5 h-5" />
      </template>
    </AppKpiCard>

    <!-- 3. انقضت مهلة السداد -->
    <AppKpiCard
      title="انقضت مهلتها"
      :value="overdueCount"
      badge="تتطلب إجراءً"
      badge-class="text-rose-600 dark:text-rose-400 font-bold"
      icon-bg="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
    >
      <template #icon>
        <AlertTriangle class="w-5 h-5" />
      </template>
    </AppKpiCard>

    <!-- 4. إجمالي الرسوم المنتظر تحصيلها -->
    <AppKpiCard
      title="الرسوم المتوقعة"
      :value="formatEgyptianCurrency(totalExpectedAmount)"
      badge="تحصيل"
      badge-class="text-primary-600 dark:text-primary-400 font-bold"
      icon-bg="bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
    >
      <template #icon>
        <Wallet class="w-5 h-5" />
      </template>
    </AppKpiCard>
  </div>
</template>

<script setup>
import { Clock, CheckCircle2, AlertTriangle, Wallet } from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';
import { formatEgyptianCurrency } from '../helpers/pendingPaymentConstants';

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  activeCount: {
    type: Number,
    default: 0,
  },
  overdueCount: {
    type: Number,
    default: 0,
  },
  totalExpectedAmount: {
    type: Number,
    default: 0,
  },
});
</script>
