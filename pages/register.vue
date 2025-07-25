<script setup lang="ts">
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const submit = () => {};
</script>
<template>
  <v-container
    fluid
    class="fill-height"
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f2f4f7;
    "
  >
    <v-card width="500px " class="pa-4" style="border-radius: 10px">
      <v-card-title class="text-h5" style="text-align: center"
        >Kanban Board</v-card-title
      >
      <v-card-text class="text-center">
        <p>Register</p>
      </v-card-text>
      <v-form fast-fail @submit.prevent @submit="submit">
        <v-text-field
          v-model="username"
          placeholder="Username"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="email"
          placeholder="Email"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="password"
          placeholder="Password"
          type="password"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          variant="outlined"
        ></v-text-field>

        <v-btn class="mt-2 bg-blue" type="submit" block>สมัครสมาชิก</v-btn>
      </v-form>
      <v-card-text class="text-center">
        <p>มีบัญชีอยู่แล้ว? <NuxtLink to="/login">เข้าสู่ระบบ</NuxtLink></p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
