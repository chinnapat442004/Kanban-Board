<script setup lang="ts">
import { ref } from 'vue';
import { useBoardStore } from '~/stores/board';
import type { Column } from '~/types/Column';
import type { Task } from '~/types/Task';

const boardStore = useBoardStore();
const taskInput = ref<Record<number, string>>({});
const addTask = ref<Record<number, boolean>>({});

const openAddTask = (columnId: number) => {
  if (!addTask.value) return;

  Object.keys(addTask.value).forEach((id) => {
    addTask.value[Number(id)] = false;
    taskInput.value[Number(id)] = '';
  });

  addTask.value[columnId] = true;
};

const closeAddTask = (columnId: number) => {
  addTask.value[columnId] = false;
  taskInput.value[columnId] = '';
};

function showAddColumn() {
  boardStore.addColumn = true;
}

function addNewColumn(name: string) {
  boardStore.addNewColumn(name);
}

function addNewTask(name: string, columnId: number) {
  if (name) {
    boardStore.addNewTask(name, columnId);
    closeAddTask(columnId);
  }
}

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

  for (const column of boardStore.columns) {
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

const editingColumnId = ref<number | null>(null);
const editingName = ref('');

function startEdit(column: Column) {
  editingColumnId.value = column.id;
  editingName.value = column.name;
}

function saveEdit() {
  if (editingColumnId.value !== null) {
    const col = boardStore.columns.find((c) => c.id === editingColumnId.value);

    if (col) {
      col.name = editingName.value.trim() || col.name;
    }
    editingColumnId.value = null;
    editingName.value = '';
  }
}
</script>

<template>
  <navbar />
  <v-main style="background-color: #f2f4f7; width: 100%">
    <div class="pa-4" style="max-width: 2000px; margin: auto">
      <v-btn
        class="bg-blue-lighten-3 me-2 text-none"
        prepend-icon="mdi-plus"
        variant="flat"
        @click="showAddColumn()"
        >Add Column</v-btn
      >

      <v-row justify="start" class="py-4">
        <v-col
          v-for="column in boardStore.columns"
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
                <div v-if="editingColumnId !== column.id">
                  {{ column.name }} ({{ column.tasks.length }})
                </div>

                <v-text-field
                  v-else
                  v-model="editingName"
                  hide-details
                  density="compact"
                  type="text"
                  variant="plain"
                  @blur="saveEdit"
                  autofocus
                />
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
                    <v-list-item @click="startEdit(column)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="boardStore.removeColumn(column.id)">
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
                          </v-btn>
                          <v-btn
                            @click="boardStore.removeTask(column.id, item.id)"
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
                class="mx-auto my-4"
                style="
                  border: 2px solid #a0a8b0;
                  box-shadow: none;
                  border-radius: 10px;
                  background-color: #f2f4f7;
                "
              >
                <v-card-item>
                  <v-text-field
                    placeholder="เพิ่มชื่อ Task"
                    v-model="taskInput[column.id]"
                    type="text"
                    variant="plain"
                    hide-details
                  />
                  <div>
                    <v-btn
                      prepend-icon="mdi-account"
                      width="100%"
                      style="box-shadow: none; background-color: #f2f4f7"
                      class="justify-start px-2"
                      >เพิ่มผู้รับผิดชอบ</v-btn
                    >
                  </div>
                  <div>
                    <v-btn
                      prepend-icon="mdi-tag"
                      width="100%"
                      style="box-shadow: none; background-color: #f2f4f7"
                      class="justify-start px-2"
                      >เพิ่ม Tag</v-btn
                    >
                  </div>
                </v-card-item>

                <v-card-actions class="d-flex justify-end">
                  <v-btn
                    @click="closeAddTask(column.id)"
                    variant="text"
                    class="bg-red-lighten-2"
                    text="ยกเลิก"
                  ></v-btn>

                  <v-btn
                    variant="text"
                    class="bg-green-lighten-1"
                    @click="addNewTask(taskInput[column.id] ?? '', column.id)"
                    text="ยืนยัน"
                  ></v-btn>
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
        <v-col cols="3" v-if="boardStore.addColumn">
          <v-card
            style="
              border-radius: 10px;
              box-shadow: none;
              border: 1px solid #e0e0e0;
            "
            ><v-card-title
              class="d-flex flex-column align-start"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <div class="d-flex align-center w-100">
                <v-text-field
                  placeholder="เพิ่มคอลัมน์ใหม่"
                  type="text"
                  variant="plain"
                  hide-details
                  v-model="boardStore.columnName"
                /></div
            ></v-card-title>

            <v-card-actions class="d-flex justify-end">
              <v-btn
                @click="boardStore.closeAddColumn()"
                variant="text"
                class="bg-red-lighten-2"
                text="ยกเลิก"
              ></v-btn>

              <v-btn
                @click="addNewColumn(boardStore.columnName)"
                variant="text"
                class="bg-green-lighten-1"
                text="ยืนยัน"
              ></v-btn>
            </v-card-actions> </v-card
        ></v-col>
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

.v-text-field :deep(input) {
  font-size: 20px;
  padding: 0 !important;
}
</style>
