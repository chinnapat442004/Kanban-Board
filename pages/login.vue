<script setup lang="ts">
const username = ref('');
const password = ref('');

const submit = () => {
  if (username.value && password.value) {
    console.log(username.value, password.value);
  }
};
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
        <p>Login</p>
      </v-card-text>
      <v-form fast-fail @submit.prevent @submit="submit">
        <v-text-field
          v-model="username"
          placeholder="Username"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="password"
          placeholder="Password"
          type="password"
          variant="outlined"
        ></v-text-field>

        <v-btn class="mt-2 bg-blue" type="submit" block>เข้าสู่ระบบ</v-btn>
      </v-form>
      <v-card-text class="text-center">
        <p>ยังไม่มีบัญชี? <a href="/register">สมัครสมาชิก </a></p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
