<script setup lang="ts">
import type { Column } from '~/types/Column';

const addTask = ref<{ [key: number]: boolean }>({});

const openAddTask = (columnId: number) => {
  addTask.value[columnId] = true;
};

const closeAddTask = (columnId: number) => {
  addTask.value[columnId] = false;
};

const columns = ref<Column[]>([
  {
    id: 1,
    name: 'To Do',
    tasks: [{ id: 1, title: 'Design Homepage', tags: ['UI', 'UX'] }],
  },
  {
    id: 2,
    name: 'In Progress',
    tasks: [
      { id: 2, title: 'Setup Database', tags: ['DB'] },
      { id: 3, title: 'Create API Endpoints', tags: ['Backend'] },
    ],
  },
]);

const removeTask = (columnId: number, taskId: number) => {
  console.log(columnId, taskId);
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
    // clone.style.opacity = '1';
    document.body.appendChild(clone);
    event.dataTransfer.setDragImage(clone, 0, 0);
  }
};

const onDrop = (event: DragEvent, targetColumn: any) => {
  const itemId = Number(event.dataTransfer?.getData('itemId'));
  if (!itemId) return;

  let sourceColumnIndex = -1;
  let taskToMove: any = null;

  for (let i = 0; i < columns.value.length; i++) {
    const taskIndex = columns.value[i]!.tasks.findIndex(
      (task: any) => task.id === itemId
    );
    if (taskIndex !== -1) {
      sourceColumnIndex = i;
      taskToMove = columns.value[i]!.tasks.splice(taskIndex, 1)[0];
      break;
    }
  }

  if (taskToMove && targetColumn.tasks) {
    targetColumn.tasks.push(taskToMove);
  }
};
</script>

<template>
  <navbar />
  <v-main style="background-color: #f2f4f7; width: 100%">
    <div class="pa-4" style="max-width: 2000px; margin: auto">
      <v-btn
        class="bg-blue-lighten-3 me-2 text-none"
        prepend-icon="mdi-plus"
        variant="flat"
        >Add Column</v-btn
      >

      <v-row justify="start" class="py-4">
        <v-col
          v-for="column in columns"
          :key="column.id"
          cols="3"
          @drop="onDrop($event, column)"
          @dragover.prevent
          @dragenter.prevent
        >
          <v-card
            style="
              border-radius: 10px;
              box-shadow: none;
              border: 1px solid #e0e0e0;
            "
          >
            <v-card-title
              class="d-flex flex-column align-start"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <div class="d-flex align-center w-100">
                <div>{{ column.name }} ({{ column.tasks.length }})</div>
                <v-spacer />
                <v-btn
                  @click="openAddTask(column.id)"
                  icon="mdi-plus"
                  variant="text"
                ></v-btn>
                <v-menu offset-y>
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      variant="text"
                      v-bind="props"
                    ></v-btn>
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeColumn(column.id)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                    <template #title="slotProps"></template>
                  </v-list>
                </v-menu>
              </div>
            </v-card-title>

            <v-card-text class="px-5">
              <div
                v-for="item in column.tasks"
                :key="item.id"
                class="mx-auto my-4"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    draggable="true"
                    @dragstart="startDrag($event, item)"
                    v-bind="props"
                    class="hover-card"
                    style="
                      border: 1px solid #e0e0e0;
                      box-shadow: none;
                      border-radius: 10px;
                    "
                  >
                    <v-card-item>
                      <div class="">
                        <div class="text-h6 mb-1 d-flex">
                          <div>{{ item.title }}</div>
                          <v-spacer />
                          <v-btn
                            v-if="isHovering"
                            icon
                            variant="text"
                            size="30"
                          >
                            <v-icon size="16">mdi-pencil</v-icon>
                            <!-- ปรับขนาดไอคอนตรงนี้ -->
                          </v-btn>
                          <v-btn
                            @click="removeTask(column.id, item.id)"
                            v-if="isHovering"
                            icon="mdi-delete"
                            variant="text"
                            size="30"
                          >
                            <v-icon size="16">mdi-delete</v-icon></v-btn
                          >
                        </div>

                        <v-chip
                          v-for="tag in item.tags"
                          :key="tag"
                          class="ma-1"
                        >
                          {{ tag }}
                        </v-chip>
                      </div>
                    </v-card-item>

                    <v-card-actions></v-card-actions>
                  </v-card>
                </v-hover>
              </div>

              <v-card
                v-show="addTask[column.id]"
                class="mx-auto my-4 hover-card"
                style="
                  border: 1px solid #e0e0e0;
                  box-shadow: none;
                  border-radius: 10px;
                  background-color: #e0e0e0;
                "
              >
                <v-card-item>
                  <v-text-field
                    placeholder="Card title"
                    type="text"
                    variant="plain"
                  />
                </v-card-item>

                <v-card-actions class="d-flex justify-end">
                  <v-btn
                    @click="closeAddTask(column.id)"
                    variant="text"
                    color="red"
                    text="ยกเลิก"
                  ></v-btn>

                  <v-btn variant="text" color="green" text="บันทึก"></v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>
            <template v-slot:actions>
              <v-btn
                @click="openAddTask(column.id)"
                prepend-icon="mdi-plus"
                class="mb-4 bg-blue-lighten-3 font-weight-medium"
                style="
                  border-radius: 10px;
                  box-shadow: none;
                  text-transform: none;
                "
                variant="flat"
                block
              >
                Add Task
              </v-btn></template
            >
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<style scoped>
.hover-card {
  transition: all 0.4s ease;
  cursor: pointer;
}
.hover-card:hover {
  border: 1px solid black;
  background-color: #efefef;
}
</style>
