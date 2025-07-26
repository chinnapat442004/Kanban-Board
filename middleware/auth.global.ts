import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  await authStore.getUser();

  const publicPages = ['/login', '/register'];

  if (!publicPages.includes(to.path) && !authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  if (publicPages.includes(to.path) && authStore.isAuthenticated) {
    return navigateTo('/');
  }
});
