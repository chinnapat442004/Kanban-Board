<script setup lang="ts">
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
import { useAuthStore } from '#imports';
const visible = ref(false);
const form = ref();

const authStore = useAuthStore();

const submit = async () => {
  const { valid } = await form.value.validate();

  if (valid) {
    authStore.register(username.value, email.value, password.value);
  }
};

const rules = {
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง';
  },
  minPassword: (value: string) =>
    value.length >= 4 || 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร',
  confirmPasswordMatch: (value: string) =>
    value === password.value || 'รหัสผ่านไม่ตรงกัน',
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
    <v-card width="500px" class="pa-4" style="border-radius: 10px">
      <v-card-title class="text-h5" style="text-align: center"
        >Kanban Board</v-card-title
      >
      <v-card-text class="text-center">
        <p>Register</p>
      </v-card-text>
      <v-form ref="form" fast-fail @submit.prevent="submit">
        <v-text-field
          v-model="username"
          placeholder="Username"
          variant="outlined"
          :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          placeholder="Email"
          variant="outlined"
          :rules="[(v) => !!v || 'กรุณากรอกอีเมล', rules.email]"
          required
        ></v-text-field>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน', rules.minPassword]"
          required
        ></v-text-field>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :rules="[
            (v) => !!v || 'กรุณากรอกยืนยันรหัสผ่าน',
            rules.confirmPasswordMatch,
          ]"
          required
        ></v-text-field>

        <v-btn class="mt-2 bg-blue" type="submit" block>สมัครสมาชิก</v-btn>
      </v-form>
      <v-card-text class="text-center">
        <p>มีบัญชีอยู่แล้ว? <NuxtLink to="/login">เข้าสู่ระบบ</NuxtLink></p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
