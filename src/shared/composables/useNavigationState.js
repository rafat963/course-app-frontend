import { ref } from 'vue';

const isNavigating = ref(false);
const navigatingToPath = ref(null);

export function useNavigationState() {
  function startNavigation(toPath) {
    isNavigating.value = true;
    navigatingToPath.value = toPath || null;
  }

  function finishNavigation() {
    isNavigating.value = false;
    navigatingToPath.value = null;
  }

  return {
    isNavigating,
    navigatingToPath,
    startNavigation,
    finishNavigation,
  };
}
