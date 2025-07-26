import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockBoards } from '~/mock/boards';

import { useAuth } from '@/composables/useAuth';
import type { Board } from '~/types/Board';

export const useBoardStore = defineStore('board', () => {
  const { userLogin, getUser } = useAuth();

  const allBoards = ref<Board[]>([...mockBoards]);
  const selectedBoardId = ref<number | null>(null);

  const addColumn = ref(false);
  const columnName = ref('');
  const columns = computed({
    get() {
      const board = userBoards.value.find(
        (boardItem) => boardItem.id === selectedBoardId.value
      );
      return board ? board.columns : [];
    },
    set(newColumns) {
      const board = userBoards.value.find(
        (boardItem) => boardItem.id === selectedBoardId.value
      );
      if (board) board.columns = newColumns;
    },
  });

  const userBoards = computed(() => {
    const userId = userLogin.value?.id;
    if (!userId) return [];
    return allBoards.value.filter((board) => board.members.includes(userId));
  });

  function removeTask(columnId: number, taskId: number) {
    const column = columns.value.find((c) => c.id === columnId);
    if (column) {
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
    }
  }

  function removeColumn(columnId: number) {
    columns.value = columns.value.filter((c) => c.id !== columnId);
  }

  watch(
    () => selectedBoardId.value,
    (newId) => {
      const board = userBoards.value.find((b) => b.id === newId);
      columns.value = board ? [...board.columns] : [];
      closeAddColumn();
    },
    { immediate: true }
  );
  onMounted(async () => {
    await getUser();
    if (userBoards.value.length > 0) {
      selectedBoardId.value = userBoards.value[0]!.id;
    }
  });

  function closeAddColumn() {
    addColumn.value = false;
    columnName.value = '';
  }

  return {
    allBoards,
    userBoards,
    selectedBoardId,
    columns,
    addColumn,
    columnName,
    closeAddColumn,
    removeTask,
    removeColumn,
  };
});
