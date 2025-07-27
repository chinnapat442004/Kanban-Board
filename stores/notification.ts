import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from '~/types/Notification';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  let nextId = 1;

  function notify(userId: number, message: string) {
    notifications.value.push({
      id: nextId++,
      userId,
      message,
    });
  }

  return { notifications, notify };
});
