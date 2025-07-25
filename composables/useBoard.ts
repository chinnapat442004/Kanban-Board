import { ref } from 'vue';
import { mockColumns } from '~/mock/columns';
import type { Column } from '~/types/Column';

export function useBoard() {
  const columns = ref<Column[]>([...mockColumns]);
  const addTask = ref<{ [key: number]: boolean }>({});

  const openAddTask = (columnId: number) => {
    addTask.value[columnId] = true;
  };

  const closeAddTask = (columnId: number) => {
    addTask.value[columnId] = false;
  };

  const removeTask = (columnId: number, taskId: number) => {
    const column = columns.value.find((col) => col.id === columnId);
    if (column) {
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
    }
  };

  const removeColumn = (columnId: number) => {
    columns.value = columns.value.filter((col) => col.id !== columnId);
  };

  const startDrag = (event: DragEvent, item: any) => {
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('itemId', item.id.toString());

      const target = event.target as HTMLElement;
      const clone = target.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      document.body.appendChild(clone);
      event.dataTransfer.setDragImage(clone, 0, 0);
    }
  };

  const onDrop = (event: DragEvent, targetColumn: Column) => {
    const itemId = Number(event.dataTransfer?.getData('itemId'));
    if (!itemId) return;

    let taskToMove: any = null;

    for (const column of columns.value) {
      const taskIndex = column.tasks.findIndex((task) => task.id === itemId);
      if (taskIndex !== -1) {
        taskToMove = column.tasks.splice(taskIndex, 1)[0];
        break;
      }
    }

    if (taskToMove) {
      targetColumn.tasks.push(taskToMove);
    }
  };

  return {
    columns,
    addTask,
    openAddTask,
    closeAddTask,
    removeTask,
    removeColumn,
    startDrag,
    onDrop,
  };
}
