<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';

const { getUser, userLogin, logout } = useAuth();

onMounted(() => {
  getUser();
});
</script>
<template>
  <v-app-bar app style="box-shadow: none">
    <v-toolbar-title>Kanban Board </v-toolbar-title>

    <v-spacer></v-spacer>
    <span class="text-h6 mr-4"> {{ userLogin?.username }}</span>

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
</template>
