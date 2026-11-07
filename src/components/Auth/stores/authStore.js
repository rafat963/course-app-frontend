import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { env } from '@/environment';
import { ROLES, DEFAULT_ROLE_ROUTES } from '@/shared/constants/roles';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(env.tokenKey) || null);
  
  const storedUser = localStorage.getItem(env.userKey);
  let parsedUser = null;
  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    parsedUser = null;
  }

  const user = ref(parsedUser);

  const isAuthenticated = computed(() => !!token.value);

  const currentRole = computed(() => user.value?.role || null);

  const defaultHomePath = computed(() => {
    return (currentRole.value && DEFAULT_ROLE_ROUTES[currentRole.value]) || '/dashboard';
  });

  function setAuth(newToken, newUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem(env.tokenKey, newToken);
    localStorage.setItem(env.userKey, JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(env.tokenKey);
    localStorage.removeItem(env.userKey);
  }

  function updateUser(partial) {
    if (!user.value) return;
    user.value = { ...user.value, ...partial };
    try {
      localStorage.setItem(env.userKey, JSON.stringify(user.value));
    } catch {
      // ignore
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    currentRole,
    defaultHomePath,
    setAuth,
    logout,
    updateUser,
  };
});
