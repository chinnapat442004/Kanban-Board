import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockBoards } from '~/mock/boards';

import { useAuthStore } from '#imports';
import type { Board } from '~/types/Board';
import { users } from '~/mock/users';

export const useBoardStore = defineStore('board', () => {
  const authStore = useAuthStore();
  const allBoards = ref<Board[]>([...mockBoards]);
  const selectedBoardId = ref<number | null>(null);
  const addColumn = ref(false);
  const columnName = ref('');

  const userBoards = computed(() => {
    const userId = authStore.userLogin?.id;
    if (!userId) return [];
    return allBoards.value.filter((board) => board.members.includes(userId));
  });

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

  function removeTask(columnId: number, taskId: number) {
    const column = columns.value.find((c) => c.id === columnId);
    if (column) {
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
    }
  }

  const removeBoard = (boardId: number) => {
    allBoards.value = allBoards.value.filter((board) => board.id !== boardId);
  };

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
    await authStore.getUser();
    if (userBoards.value.length > 0) {
      selectedBoardId.value = userBoards.value[0]!.id;
    }
  });

  function closeAddColumn() {
    addColumn.value = false;
    columnName.value = '';
  }

  const findUserIdByEmail = (email: string): number | null => {
    console.log(email);
    const user = users.find((u) => u.email === email.trim());
    return user ? user.id : null;
  };

  const addBoard = (name: string, otherMembers: number[] = []) => {
    if (!authStore.userLogin) {
      throw new Error();
    }
    const ownerId = authStore.userLogin?.id;

    const newBoard: Board = {
      id: allBoards.value.length + 1,
      name: name,
      ownerId: ownerId,
      members: [ownerId, ...otherMembers],
      columns: [],
    };

    allBoards.value.push(newBoard);
  };

  const members = computed(() => {
    const board = userBoards.value.find(
      (boardItem) => boardItem.id === selectedBoardId.value
    );
    return board ? board.members : [];
  });

  const board = computed(() => {
    const item = userBoards.value.find(
      (boardItem) => boardItem.id === selectedBoardId.value
    );
    return item;
  });

  return {
    allBoards,
    userBoards,
    selectedBoardId,
    columns,
    addColumn,
    columnName,
    members,
    board,
    removeBoard,
    findUserIdByEmail,
    closeAddColumn,
    removeTask,
    removeColumn,
    addBoard,
  };
});
