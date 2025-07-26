// stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { users } from '~/mock/users';
import type { User } from '~/types/User';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const userLogin = ref<User | null>(null);
  const router = useRouter();

  const getUser = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userLogin.value = JSON.parse(storedUser);
    }
  };

  const login = async (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      userLogin.value = foundUser;
      router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    userLogin.value = null;
    router.push('/login');
  };

  return {
    userLogin,
    getUser,
    login,
    logout,
  };
});
