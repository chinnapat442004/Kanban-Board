<script setup lang="ts">
import { useAuthStore } from '#imports';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');

const visible = ref(false);
const form = ref();
const submit = async () => {
  const { valid } = await form.value.validate();

  if (valid) {
    await authStore.login(username.value, password.value);
  }

  if (authStore.isAuthenticated) {
    navigateTo('/');
  }
};

onMounted(() => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
});
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
      <v-form ref="form" fast-fail @submit.prevent @submit="submit">
        <div class="text-subtitle-1 text-medium-emphasis">Username</div>
        <v-text-field
          v-model="username"
          :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
          placeholder="Username"
          variant="outlined"
        ></v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Password</div>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          v-model="password"
          :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน']"
          placeholder="Password"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-btn class="mt-2 bg-blue" type="submit" block>เข้าสู่ระบบ</v-btn>
      </v-form>
      <v-card-text class="text-center">
        <p>ยังไม่มีบัญชี? <NuxtLink to="/register">สมัครสมาชิก </NuxtLink></p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
