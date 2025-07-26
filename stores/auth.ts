import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { users } from '~/mock/users';
import type { User } from '~/types/User';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const userLogin = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const router = useRouter();

  const isLoggedIn = computed(() => isAuthenticated.value);

  const getUser = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedAuth = localStorage.getItem('isLogin');

      if (storedUser && storedAuth === 'true') {
        userLogin.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const initializeAuth = async () => {
    await getUser();
  };

  initializeAuth();

  const login = async (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      userLogin.value = foundUser;
      isAuthenticated.value = true;

      localStorage.setItem('user', JSON.stringify(foundUser));
      localStorage.setItem('isLogin', 'true');

      router.push('/');
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const newUser: User = {
        id: users.length + 1,
        username,
        email,
        password,
      };

      users.push(newUser);

      await login(username, password);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLogin');
    userLogin.value = null;
    isAuthenticated.value = false;
    router.push('/login');
  };

  return {
    userLogin,
    isAuthenticated,
    isLoggedIn,
    getUser,
    initializeAuth,
    login,
    logout,
    register,
  };
});
