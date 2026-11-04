import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * متجر طلبات التقديم الخاصة بالمتدرب
 * يحفظ الطلبات وسجل التدقيق في localStorage لكل مستخدم على حدة،
 * حتى تبقى حالة "تم التقديم" ظاهرة على كروت الدورات بعد إعادة التحميل.
 */
const STORAGE_PREFIX = 'isi_trainee_applications';

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useTraineeApplicationsStore = defineStore('traineeApplications', () => {
  const userId = ref(null);
  const applications = ref([]);
  const auditLogs = ref([]);
  const isLoaded = ref(false);

  const storageKey = computed(() => `${STORAGE_PREFIX}:${userId.value ?? 'guest'}`);

  /** تحميل طلبات المتدرب الحالي من التخزين المحلي */
  function load(id) {
    const nextId = id ?? null;
    if (isLoaded.value && userId.value === nextId) return;

    userId.value = nextId;
    const saved = readStorage(storageKey.value);
    applications.value = Array.isArray(saved?.applications) ? saved.applications : [];
    auditLogs.value = Array.isArray(saved?.auditLogs) ? saved.auditLogs : [];
    isLoaded.value = true;
  }

  function persist() {
    try {
      localStorage.setItem(
        storageKey.value,
        JSON.stringify({
          applications: applications.value,
          auditLogs: auditLogs.value,
        })
      );
    } catch {
      // تجاهل أخطاء التخزين (وضع التصفح الخاص / امتلاء المساحة)
    }
  }

  /** طلب المتدرب على دفعة معينة إن وُجد */
  function getByRound(roundId) {
    if (roundId === null || roundId === undefined) return null;
    return (
      applications.value.find((app) => String(app.courseRoundId) === String(roundId)) || null
    );
  }

  const appliedRoundIds = computed(() => applications.value.map((app) => String(app.courseRoundId)));

  const appliedCount = computed(() => applications.value.length);

  /** إضافة طلب جديد + حركة سجل التدقيق */
  function addApplication(application, auditLog) {
    const id = Date.now();
    const record = { id, ...application };
    applications.value.push(record);

    if (auditLog) {
      auditLogs.value.push({
        id: id + 1,
        applicationId: id,
        ...auditLog,
      });
    }

    persist();
    return record;
  }

  return {
    userId,
    applications,
    auditLogs,
    appliedRoundIds,
    appliedCount,
    load,
    persist,
    getByRound,
    addApplication,
  };
});
