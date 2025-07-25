import { user } from '~/mock/users';
import type { User } from '~/types/User';

export function useAuth() {
  const userLogin = ref<User | null>(null);

  const getUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userLogin.value = JSON.parse(storedUser);
    }
  };

  const login = async (username: string, password: string) => {
    const foundUser = user.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      getUser();
      console.log(userLogin.value);
      navigateTo('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    userLogin.value = null;
    navigateTo('/login');
  };

  return { userLogin, login, logout, getUser };
}
