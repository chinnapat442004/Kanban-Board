<script setup lang="ts">
import { useAuthStore } from '#imports';

import { useBoardStore } from '~/stores/board';
import { users } from '~/mock/users';
const boardStore = useBoardStore();
const dialog = ref(false);
const authStore = useAuthStore();

const name = ref('');
const emails = ref<string[]>(['']);

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
      <v-select
        hide-details
        :items="boardStore.userBoards"
        item-title="name"
        item-value="id"
        v-model="boardStore.selectedBoardId"
        density="compact"
        variant="outlined"
        class="mr-4"
        style="max-width: 300px"
      ></v-select>
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
                @click="emails.push('')"
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

          <v-btn variant="text" class="bg-green-lighten-1" type="submit">
            บันทึก
          </v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>
