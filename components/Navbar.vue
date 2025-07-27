<script setup lang="ts">
import { useBoardStore } from '~/stores/board';
import { users } from '~/mock/users';
const boardStore = useBoardStore();
const authStore = useAuthStore();
const dialog = ref(false);
const deleteDialog = ref(false);
const editDialog = ref(false);
const name = ref('');
const editedNnameBoard = ref(boardStore.board?.name || '');
const editedMembers = ref<number[]>([]);

watch(
  () => editDialog.value,
  (val) => {
    if (val && boardStore.board?.members) {
      editedMembers.value = [...boardStore.board.members];
    }
  }
);

watch(
  () => boardStore.board,
  (newBoard) => {
    if (newBoard?.name) {
      editedNnameBoard.value = newBoard.name;
    }
  },
  { immediate: true }
);

const emails = ref<string[]>(['']);
const editEmails = ref<string[]>(['']);

onMounted(() => {
  authStore.getUser();
});

const onSubmit = () => {
  if (!name.value) return;

  const extraMemberIds = emails.value
    .map((email) => boardStore.findUserIdByEmail(email.trim()))
    .filter((id): id is number => !!id);

  boardStore.addBoard(name.value, extraMemberIds);

  dialog.value = false;
  name.value = '';
  emails.value = [''];
};
const deleteBoard = (boardId: number) => {
  boardStore.removeBoard(boardId);
  deleteDialog.value = false;
};

watch(
  () => boardStore.userBoards,
  (boards) => {
    const selectedId = boardStore.selectedBoardId;
    const exists = boards.some((b) => b.id === selectedId);

    if (!exists) {
      boardStore.selectedBoardId = boards.length > 0 ? boards[0]!.id : null;
    }
  },
  { immediate: true, deep: true }
);

const addNewMembers = () => {
  const newMemberIds = editEmails.value
    .map((email) => boardStore.findUserIdByEmail(email.trim()))
    .filter((id): id is number => !!id);

  const uniqueNewMembers = newMemberIds.filter(
    (id) => !editedMembers.value.includes(id)
  );

  editedMembers.value = [...editedMembers.value, ...uniqueNewMembers];

  editEmails.value = [''];
};

const closeAddNewMenbers = () => {
  editDialog.value = false;
  editEmails.value = [''];
};

const confirmEditBoard = () => {
  if (boardStore.board) {
    addNewMembers();

    boardStore.board.name = editedNnameBoard.value;
    boardStore.board.members = [...editedMembers.value];
  }
  editDialog.value = false;
};

const canAddEditEmail = computed(() => {
  return editEmails.value.every((email) => {
    if (!email || email.trim() === '') return false;
    return users.some((u) => u.email === email.trim());
  });
});

const canAddEmail = computed(() => {
  return emails.value.every((email) => {
    if (!email || email.trim() === '') return false;
    return users.some((u) => u.email === email.trim());
  });
});

const canConfirm = computed(() => {
  return canAddEmail.value;
});
</script>

<template>
  <v-app-bar
    app
    color="white"
    style="box-shadow: none; border-bottom: 1px solid #e0e0e0"
  >
    <v-toolbar-title>Kanban Board</v-toolbar-title>

    <span class="text-h6 mr-4">{{ authStore.userLogin?.username }}</span>

    <v-menu transition="slide-y-transition" open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn icon class="bg-blue-lighten-4" v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="authStore.logout()">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-app-bar flat height="64" color="white" elevation="0">
    <v-toolbar-title>
      <div class="d-flex align-center">
        <v-select
          hide-details
          :items="boardStore.userBoards"
          item-title="name"
          item-value="id"
          v-model="boardStore.selectedBoardId"
          density="compact"
          variant="outlined"
          class="mr-2"
          style="max-width: 280px"
        ></v-select>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              icon
              variant="text"
              v-bind="props"
              class="pa-0"
              style="min-width: 36px"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="editDialog = true">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteDialog = true">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-icon class="mr-3" size="small" icon="mdi-account-multiple "></v-icon>
        <div>{{ boardStore.members.length }} member</div>
      </div>
    </v-toolbar-title>

    <v-btn
      class="bg-blue-lighten-3 me-2 text-none"
      prepend-icon="mdi-plus"
      variant="flat"
      @click="dialog = true"
      >เพิ่ม Board ใหม่</v-btn
    >
  </v-app-bar>

  <v-dialog v-model="dialog" max-width="600">
    <v-form fast-fail @submit.prevent="onSubmit">
      <v-card rounded="lg">
        <template #title>
          <span style="font-weight: 700">เพิ่ม Board ใหม่</span>
        </template>

        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <div class="text-subtitle-1">ชื่อ Board</div>
              <v-text-field
                placeholder="ชื่อ Board"
                required
                variant="outlined"
                v-model="name"
                :rules="[(v) => !!v || 'กรุณากรอกชื่อ Board']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <div class="text-subtitle-1 mb-2">เพิ่มสมาชิก (email)</div>

              <div
                v-for="(emailItem, index) in emails"
                :key="index"
                class="d-flex mb-2 align-center"
              >
                <v-text-field
                  v-model="emails[index]"
                  placeholder="กรอก email"
                  variant="outlined"
                  dense
                  class="flex-grow-1 mr-2"
                  :rules="[
                    (v) => {
                      if (!v || v.trim() === '') return true;
                      return users.some((u) => u.email === v.trim())
                        ? true
                        : 'อีเมลนี้ไม่มีในระบบ';
                    },
                  ]"
                />

                <v-btn
                  v-if="emails.length > 1"
                  @click="emails.splice(index, 1)"
                  size="small"
                  color="red"
                  icon="mdi-close"
                  variant="text"
                ></v-btn>
              </div>

              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-plus"
                class="bg-blue-lighten-3"
                @click="editEmails.push('')"
                :disabled="!canAddEmail"
              >
                เพิ่มอีเมล
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <template v-slot:actions>
          <v-btn
            variant="text"
            class="bg-red-lighten-2"
            @click="dialog = false"
          >
            ยกเลิก
          </v-btn>

          <v-btn
            variant="text"
            class="bg-green-lighten-1"
            type="submit"
            @click=""
          >
            ยืนยัน
          </v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="600">
    <v-card rounded="lg">
      <template #title>
        <span>คุณต้องการลบ {{ boardStore.board?.name }} ใช่หรือไม่ </span>
      </template>

      <template v-slot:actions>
        <v-btn
          variant="text"
          class="bg-red-lighten-2"
          @click="deleteDialog = false"
        >
          ยกเลิก
        </v-btn>

        <v-btn
          variant="text"
          class="bg-green-lighten-1"
          type="submit"
          @click="deleteBoard(boardStore.board!.id)"
        >
          บันทึก
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialog" max-width="600">
    <v-form fast-fail @submit.prevent="onSubmit">
      <v-card rounded="lg">
        <template #title>
          <span style="font-weight: 700">แก้ไข Board</span>
        </template>

        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <div class="text-subtitle-1 mb-2">ชื่อ Board</div>
              <v-text-field
                placeholder="ชื่อ Board"
                required
                variant="outlined"
                v-model="editedNnameBoard"
                :rules="[(v) => !!v || 'กรุณากรอกชื่อ Board']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <div class="text-subtitle-1 mb-2">สมาชิก</div>

              <v-list>
                <v-list-item
                  v-for="(emailItem, index) in editedMembers"
                  :key="index"
                  rounded="md"
                  prepend-icon="mdi-account"
                  style="background-color: #f8f9fb"
                >
                  <v-list-item-content
                    class="d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center">
                      <span class="mr-2">{{
                        boardStore.getUserById(emailItem)?.username
                      }}</span>

                      <div class="ml-0 ml-sm-3">
                        <v-chip
                          variant="outlined"
                          color="grey-darken-1"
                          size="small"
                          prepend-icon="mdi-email-outline"
                          class="text-caption"
                        >
                          {{ boardStore.getUserById(emailItem)?.email }}
                        </v-chip>
                      </div>
                      <v-chip
                        v-if="boardStore.board?.ownerId === emailItem"
                        size="x-small"
                        class="ml-2"
                      >
                        เจ้าของ
                      </v-chip>
                    </div>

                    <v-btn
                      v-if="boardStore.board?.ownerId !== emailItem"
                      icon
                      variant="text"
                      color="red"
                      size="small"
                      @click="editedMembers.splice(index, 1)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <div class="text-subtitle-1 font-weight-medium mb-2 mt-5">
                เพิ่มสมาชิกใหม่ (email)
              </div>

              <div
                v-for="(emailItem, index) in editEmails"
                :key="index"
                class="d-flex mb-2 align-center"
              >
                <v-text-field
                  v-model="editEmails[index]"
                  placeholder="กรอก email"
                  variant="outlined"
                  dense
                  class="flex-grow-1 mr-2"
                  :rules="[
                    (v) => {
                      if (!v || v.trim() === '') return true;
                      return users.some((u) => u.email === v.trim())
                        ? true
                        : 'อีเมลนี้ไม่มีในระบบ';
                    },
                  ]"
                />

                <v-btn
                  v-if="editEmails.length > 1"
                  @click="editEmails.splice(index, 1)"
                  size="small"
                  color="red"
                  icon="mdi-close"
                  variant="text"
                ></v-btn>
              </div>
              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-plus"
                class="bg-blue-lighten-3"
                @click="editEmails.push('')"
                :disabled="!canAddEditEmail"
              >
                เพิ่มอีเมล
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <template v-slot:actions>
          <v-btn
            variant="text"
            class="bg-red-lighten-2"
            @click="closeAddNewMenbers"
          >
            ยกเลิก
          </v-btn>

          <v-btn
            variant="text"
            class="bg-green-lighten-1"
            type="submit"
            @click="confirmEditBoard"
          >
            ยืนยัน
          </v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>
