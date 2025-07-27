<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBoardStore } from '~/stores/board';
import type { Column } from '~/types/Column';
import type { VForm } from 'vuetify/components';
import type { Task } from '~/types/Task';

const boardStore = useBoardStore();

const taskInput = ref<Record<number, string>>({});
const addTask = ref<Record<number, boolean>>({});
const responsiblePersonDialog = ref(false);
const editedresponsiblePersons = ref<number[]>([]);
const responsiblePersons = ref<number[]>([]);
const isAddingList = ref<boolean[]>([]);
const tags = ref<string[]>([]);
const newTag = ref('');
const isAdding = ref(false);

const editingTask = ref<Task | null>(null);
const editingTaskInput = ref('');
const editingTags = ref<string[]>([]);
const editingResponsiblePersons = ref<number[]>([]);
const editTaskDialog = ref(false);

function startEditTask(task: Task) {
  editingTask.value = { ...task };
  editingTaskInput.value = task.title;
  editingTags.value = [...task.tags];
  editingResponsiblePersons.value = [...task.responsiblePersons];
  editTaskDialog.value = true;

  Object.keys(addTask.value).forEach((id) => {
    addTask.value[Number(id)] = false;
  });
}

function saveEditTask(columnId: number) {
  if (!editingTask.value) return;

  const col = boardStore.columns.find((c) => c.id === columnId);
  const task = col?.tasks.find((t) => t.id === editingTask.value?.id);
  if (task) {
    task.title = editingTaskInput.value.trim();
    task.tags = [...editingTags.value];
    task.responsiblePersons = [...editingResponsiblePersons.value];
  }
  cancelEditTask();
  editTaskDialog.value = false;
}

function cancelEditTask() {
  editingTask.value = null;
  editingTaskInput.value = '';
  editingTags.value = [];
  editingResponsiblePersons.value = [];
  editTaskDialog.value = false;
}

const openAddTask = (columnId: number) => {
  editTaskDialog.value = false;

  Object.keys(addTask.value).forEach((id) => {
    addTask.value[Number(id)] = false;
    taskInput.value[Number(id)] = '';
  });

  addTask.value[columnId] = true;
};

const closeAddTask = (columnId: number) => {
  addTask.value[columnId] = false;
  taskInput.value[columnId] = '';
  tags.value = [];
  responsiblePersons.value = [];
};

const startAdding = () => {
  isAdding.value = true;
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag);
  }
  newTag.value = '';
  isAdding.value = false;
};

const removeTag = (index: number) => {
  tags.value.splice(index, 1);
};

const taskFormRefs = ref<Record<string, VForm | undefined>>({});

const setFormRef = (el: VForm | null, columnId: number) => {
  if (el) {
    taskFormRefs.value[`taskForm_${columnId}`] = el;
  }
};

async function addNewTask(
  name: string,
  tags: string[],
  responsiblePersons: number[],
  columnId: number
) {
  const formToValidate = taskFormRefs.value[`taskForm_${columnId}`];

  if (formToValidate) {
    const { valid } = await formToValidate.validate();

    if (valid) {
      boardStore.addNewTask(name, tags, responsiblePersons, columnId);
      closeAddTask(columnId);
    }
  }
}

watch(
  responsiblePersonDialog,
  (val) => {
    if (val && boardStore.board?.members) {
      editedresponsiblePersons.value = [...boardStore.board.members];

      isAddingList.value = editedresponsiblePersons.value.map((id) =>
        responsiblePersons.value.includes(id)
      );
    }
  },
  { immediate: true }
);

const toggleAdd = (index: number) => {
  isAddingList.value[index] = !isAddingList.value[index];
};

function saveResponsiblePersons() {
  responsiblePersons.value = editedresponsiblePersons.value.filter(
    (_item, index) => isAddingList.value[index]
  );
  responsiblePersonDialog.value = false;
}

function removeResponsiblePerson(id: number) {
  responsiblePersons.value = responsiblePersons.value.filter((i) => i !== id);

  if (responsiblePersonDialog.value) {
    const idx = editedresponsiblePersons.value.findIndex((i) => i === id);
    if (idx !== -1) {
      isAddingList.value[idx] = false;
    }
  }
}

const startDrag = (event: DragEvent, item: Task) => {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('itemId', item.id.toString());

    const target = event.target as HTMLElement;
    const clone = target.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.pointerEvents = 'none';

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

function showAddColumn() {
  boardStore.addColumn = true;
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
                <template v-if="editingTask?.id === item.id && editTaskDialog">
                  <v-card
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
                        v-model="editingTaskInput"
                        placeholder="แก้ไขชื่อ Task"
                        variant="plain"
                      />
                      <div class="mb-3">
                        <v-btn
                          prepend-icon="mdi-account"
                          class="w-100 justify-start px-2"
                          @click="responsiblePersonDialog = true"
                          style="
                            box-shadow: none;
                            background-color: #f2f4f7;
                            border: 1px solid #a0a8b0;
                          "
                        >
                          แก้ไขผู้รับผิดชอบ
                        </v-btn>
                        <div class="mt-2">
                          <v-chip
                            v-for="id in editingResponsiblePersons"
                            :key="id"
                            closable
                            @click:close="
                              editingResponsiblePersons =
                                editingResponsiblePersons.filter(
                                  (i) => i !== id
                                )
                            "
                            class="ma-1"
                          >
                            {{
                              boardStore.getUserById(id)?.username ||
                              'ไม่พบชื่อ'
                            }}
                          </v-chip>
                        </div>
                      </div>

                      <div class="mb-3">
                        <div v-if="isAdding" class="flex gap-2">
                          <input
                            v-model="newTag"
                            type="text"
                            class="border rounded px-2 py-1 w-full"
                            placeholder="ใส่แท็กใหม่"
                          />
                          <v-btn
                            @click="
                              editingTags.push(newTag);
                              newTag = '';
                            "
                            class="bg-green-lighten-1 text-white"
                          >
                            เพิ่ม
                          </v-btn>
                        </div>

                        <v-btn
                          v-else
                          @click="startAdding"
                          prepend-icon="mdi-plus"
                          class="w-100 justify-start px-2"
                          style="
                            box-shadow: none;
                            background-color: #f2f4f7;
                            border: 1px solid #a0a8b0;
                          "
                        >
                          เพิ่มแท็ก
                        </v-btn>

                        <div class="flex flex-wrap gap-2 mt-2">
                          <v-chip
                            v-for="(tag, index) in editingTags"
                            :key="index"
                            closable
                            @click:close="editingTags.splice(index, 1)"
                            class="ma-1"
                          >
                            {{ tag }}
                          </v-chip>
                        </div>
                      </div>
                    </v-card-item>

                    <v-card-actions class="d-flex justify-end">
                      <v-btn class="bg-red-lighten-2" @click="cancelEditTask()"
                        >ยกเลิก</v-btn
                      >
                      <v-btn
                        class="bg-green-lighten-1"
                        @click="saveEditTask(column.id)"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </template>

                <template v-else>
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
                      <v-card-item
                        ><div>
                          <div class="text-h6 mb-1 d-flex">
                            <div>{{ item.title }}</div>
                            <v-spacer />
                            <v-btn
                              v-if="isHovering"
                              icon
                              variant="text"
                              size="30"
                              @click="startEditTask(item)"
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
                              <v-icon size="16">mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-subheader class="mb-3">ผู้รับผิดชอบ:</v-subheader>
                          <v-chip
                            v-for="responsiblePerson in item.responsiblePersons"
                            :key="responsiblePerson"
                            class="ma-1"
                          >
                            {{
                              boardStore.getUserById(responsiblePerson)
                                ?.username || 'ไม่พบชื่อ'
                            }}
                          </v-chip>
                        </div>
                        <v-subheader class="mb-3">แท็ก:</v-subheader>
                        <v-chip
                          v-for="tag in item.tags"
                          :key="tag"
                          class="ma-1"
                        >
                          {{ tag }}
                        </v-chip>
                      </v-card-item>
                    </v-card>
                  </v-hover>
                </template>
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
                  <v-form
                    :ref="(el) => setFormRef(el as VForm, column.id)"
                    lazy-validation
                  >
                    <v-text-field
                      placeholder="เพิ่มชื่อ Task"
                      v-model="taskInput[column.id]"
                      type="text"
                      variant="plain"
                      :rules="[(v) => !!v || 'กรุณาใส่ชื่อ Task']"
                    />
                  </v-form>
                  <div>
                    <v-btn
                      prepend-icon="mdi-account"
                      width="100%"
                      style="
                        box-shadow: none;
                        background-color: #f2f4f7;
                        border: 1px solid #a0a8b0;
                      "
                      class="justify-start px-2 my-2"
                      @click="responsiblePersonDialog = true"
                    >
                      เพิ่มผู้รับผิดชอบ
                    </v-btn>
                    <div>
                      <v-chip
                        v-for="id in responsiblePersons"
                        :key="id"
                        class="mb-3"
                        small
                        closable
                        @click:close="removeResponsiblePerson(id)"
                      >
                        {{
                          boardStore.getUserById(id)?.username || 'ไม่พบชื่อ'
                        }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="p-4">
                    <div v-if="isAdding" class="flex gap-2">
                      <input
                        v-model="newTag"
                        type="text"
                        class="border rounded px-2 py-1 w-full"
                        placeholder="ใส่แท็กใหม่"
                      />

                      <v-btn
                        @click="addTag"
                        class="bg-green-lighten-1 text-white py-1"
                      >
                        เพิ่ม
                      </v-btn>
                    </div>

                    <v-btn
                      v-else
                      @click="startAdding"
                      prepend-icon="mdi-plus"
                      width="100%"
                      style="
                        box-shadow: none;
                        background-color: #f2f4f7;
                        border: 1px solid #a0a8b0;
                      "
                      class="justify-start px-2 mb-2"
                    >
                      เพิ่มแท็ก
                    </v-btn>

                    <div class="flex flex-wrap gap-2 mb-2">
                      <v-chip
                        v-for="(tag, index) in tags"
                        :key="index"
                        class="ma-1"
                        closable
                        @click:close="removeTag(index)"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
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
                    @click="
                      addNewTask(
                        taskInput[column.id] ?? '',
                        tags,
                        responsiblePersons,
                        column.id
                      )
                    "
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
                style="border-radius: 10px; height: 40px; max-width: 100%"
                variant="flat"
                block
              >
                Add Task
              </v-btn>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-main>

  <v-dialog v-model="responsiblePersonDialog" max-width="600">
    <v-card rounded="lg">
      <template #title>
        <span>เพิ่มผู้รับผิดชอบ</span>
      </template>
      <v-card-item>
        <v-col cols="12">
          <v-list>
            <v-list-item
              v-for="(userId, index) in editedresponsiblePersons"
              :key="userId"
              rounded="md"
              prepend-icon="mdi-account"
              style="background-color: #f8f9fb"
            >
              <v-list-item-content
                class="d-flex align-center justify-space-between"
              >
                <div class="d-flex align-center">
                  <span class="mr-2">{{
                    boardStore.getUserById(userId)?.username
                  }}</span>
                  <div class="ml-0 ml-sm-3">
                    <v-chip
                      variant="outlined"
                      color="grey-darken-1"
                      size="small"
                      prepend-icon="mdi-email-outline"
                      class="text-caption"
                    >
                      {{ boardStore.getUserById(userId)?.email }}
                    </v-chip>
                  </div>
                </div>

                <v-btn
                  variant="text"
                  :class="
                    isAddingList[index]
                      ? 'bg-red-lighten-2'
                      : 'bg-green-lighten-2'
                  "
                  size="small"
                  @click="toggleAdd(index)"
                >
                  {{ isAddingList[index] ? 'ยกเลิก' : 'เพิ่ม' }}
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-card-item>

      <template v-slot:actions>
        <v-btn
          variant="text"
          class="bg-red-lighten-2"
          @click="responsiblePersonDialog = false"
        >
          ยกเลิก
        </v-btn>

        <v-btn
          variant="text"
          class="bg-green-lighten-1"
          @click="saveResponsiblePersons"
        >
          บันทึก
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.hover-card:hover {
  border-color: #1976d2 !important;
  box-shadow: 0 0 6px #1976d2 !important;
  cursor: grab;
}
</style>
