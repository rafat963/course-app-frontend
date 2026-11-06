<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 select-none">
    <!-- 1. إجمالي الدورات -->
    <AppKpiCard
      title="إجمالي الدورات"
      :value="totalRounds"
      label="دورة تدريبية"
      status-text="كافة الدورات المنعقدة والتشغيلية"
      status-type="success"
      :icon="BookOpen"
      variant="default"
    />

    <!-- 2. إجمالي محاضرات اليوم -->
    <AppKpiCard
      title="إجمالي محاضرات اليوم"
      :value="todayLectures"
      label="محاضرة مجدولة"
      status-text="وفق جداول أيام الانعقاد المعتمدة"
      :status-type="todayLectures > 0 ? 'warning' : 'default'"
      :icon="CalendarCheck"
      variant="warning"
    />

    <!-- 3. إجمالي المتدربين -->
    <AppKpiCard
      title="إجمالي المتدربين"
      :value="totalTrainees"
      label="متدرباً مقيداً"
      status-text="المسجلون بالدفعات التدريبية"
      status-type="info"
      :icon="Users"
      variant="primary"
    />
  </div>
</template>

<script setup>
import {
  BookOpen,
  CalendarCheck,
  Users,
} from 'lucide-vue-next';
import AppKpiCard from '@/shared/ui/Cards/AppKpiCard.vue';

defineProps({
  totalRounds: {
    type: Number,
    default: 0,
  },
  todayLectures: {
    type: Number,
    default: 0,
  },
  totalTrainees: {
    type: Number,
    default: 0,
  },
});
</script>
