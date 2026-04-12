<!-- 登录模态框 -->
<template>
  <a-modal
    :open="visible"
    title="用户登录"
    :footer="null"
    @cancel="handleClose"
    width="400px"
  >
    <a-form
      :model="formState"
      @finish="handleSubmit"
      layout="vertical"
      class="login-form"
    >
      <a-form-item
        name="username"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input
          v-model:value="formState.username"
          placeholder="请输入用户名"
          size="large"
        />
      </a-form-item>

      <a-form-item
        name="password"
        label="密码"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="请输入密码"
          size="large"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block size="large">
          登录
        </a-button>
      </a-form-item>

      <div class="login-tips">
        <p>提示：本地存储模式，无需注册</p>
        <p>输入任意用户名和密码即可登录</p>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { saveUser } from '../core/userStore';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'success']);

const formState = reactive({
  username: '',
  password: '',
});

const handleSubmit = () => {
  const user = {
    username: formState.username,
    loginTime: new Date().toISOString(),
  };
  saveUser(user);
  message.success(`欢迎 ${formState.username}！`);
  emit('success', user);
  handleClose();
};

const handleClose = () => {
  formState.username = '';
  formState.password = '';
  emit('close');
};
</script>

<style scoped>
.login-form {
  margin-top: 16px;
}

.login-tips {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}

.login-tips p {
  margin: 4px 0;
}
</style>
