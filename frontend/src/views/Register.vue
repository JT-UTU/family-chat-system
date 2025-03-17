<template>
  <div class="register-container">
    <div class="background-animation">
      <div class="bubble" v-for="n in 10" :key="n"></div>
    </div>
    <div class="register-box">
      <div class="welcome-text">
        <h1>创建账号</h1>
        <p>加入家庭聊天，与家人共享精彩瞬间</p>
      </div>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="0" class="register-form">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleRegister" class="register-button">创建账号</el-button>
        </el-form-item>
      </el-form>
      <div class="login-link">
        已有账号？<router-link to="/">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/user';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const registerFormRef = ref(null);
    const loading = ref(false);
    
    const registerForm = reactive({
      username: '',
      password: '',
      confirmPassword: ''
    });
    
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (registerForm.confirmPassword !== '') {
          registerFormRef.value.validateField('confirmPassword');
        }
        callback();
      }
    };
    
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应在3到20个字符之间', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在6到20个字符之间', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
      ]
    };
    
    const handleRegister = async () => {
      if (!registerFormRef.value) return;
      
      await registerFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          try {
            const { username, password } = registerForm;
            const result = await userStore.register({ username, password });
            
            if (result.success) {
              ElMessage.success('注册成功，请登录');
              router.push('/');
            } else {
              ElMessage.error(result.message);
            }
          } catch (error) {
            ElMessage.error('注册失败，请稍后再试');
          } finally {
            loading.value = false;
          }
        }
      });
    };
    
    return {
      registerForm,
      registerFormRef,
      rules,
      loading,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 15s infinite ease-in;
}

.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
}

.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}

.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 10s;
  animation-delay: 2s;
}

.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 7s;
  animation-delay: 0s;
}

.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 55%;
  animation-duration: 6s;
  animation-delay: 1s;
}

.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-duration: 8s;
  animation-delay: 3s;
}

.bubble:nth-child(7) {
  width: 25px;
  height: 25px;
  left: 75%;
  animation-duration: 7s;
  animation-delay: 2s;
}

.bubble:nth-child(8) {
  width: 80px;
  height: 80px;
  left: 80%;
  animation-duration: 6s;
  animation-delay: 1s;
}

.bubble:nth-child(9) {
  width: 15px;
  height: 15px;
  left: 70%;
  animation-duration: 9s;
  animation-delay: 0s;
}

.bubble:nth-child(10) {
  width: 50px;
  height: 50px;
  left: 85%;
  animation-duration: 5s;
  animation-delay: 3s;
}

@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translate(100px, -500px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}

.register-box {
  width: 420px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.8s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-text {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-text h1 {
  color: #409eff;
  font-size: 28px;
  margin-bottom: 10px;
}

.welcome-text p {
  color: #606266;
  font-size: 16px;
}

.register-form {
  margin-bottom: 20px;
}

.register-form :deep(.el-input__inner) {
  height: 50px;
  border-radius: 25px;
  padding-left: 20px;
}

.register-button {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border: none;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #606266;
  margin-top: 15px;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
  font-weight: bold;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.login-link a:hover {
  border-bottom: 1px solid #409eff;
}
</style> 