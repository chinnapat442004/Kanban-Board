<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';

import { useBoardStore } from '~/stores/board';
const boardStore = useBoardStore();

const { getUser, userLogin, logout } = useAuth();

onMounted(() => {
  getUser();
});

const createBoard = () => {
  console.log('Create new board');
};
</script>

<template>
  <v-app-bar
    app
    color="white"
    style="box-shadow: none; border-bottom: 1px solid #e0e0e0"
  >
    <v-toolbar-title>Kanban Board</v-toolbar-title>

    <span class="text-h6 mr-4">{{ userLogin?.username }}</span>

    <v-menu transition="slide-y-transition" open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn icon class="bg-blue-lighten-4" v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="logout()">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <!-- SECOND NAVBAR -->
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
      >เพิ่ม Board ใหม่</v-btn
    >

    <template #append></template>
  </v-app-bar>
</template>
