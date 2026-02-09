<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- 切换标签 -->
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登录
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册
        </button>
      </div>

      <!-- 登录表单 -->
      <div v-if="activeTab === 'login'" class="auth-form">
        <h2 class="form-title">欢迎回来</h2>
        <p class="form-subtitle">请登录您的账户</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-email" class="form-label">邮箱</label>
            <input 
              id="login-email" 
              v-model="loginForm.email" 
              type="email" 
              class="form-input" 
              :class="{ error: loginErrors.email }"
              placeholder="请输入邮箱"
              @blur="validateEmail('login')"
              @input="loginErrors.email = ''"
              required
            />
            <div v-if="loginErrors.email" class="error-message">
              {{ loginErrors.email }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="login-password" class="form-label">密码</label>
            <input 
              id="login-password" 
              v-model="loginForm.password" 
              type="password" 
              class="form-input" 
              :class="{ error: loginErrors.password }"
              placeholder="请输入密码"
              @input="loginErrors.password = ''"
              required
            />
            <div v-if="loginErrors.password" class="error-message">
              {{ loginErrors.password }}
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="!isLoginValid"
            >
              登录
            </button>
            <router-link to="#" class="forgot-link">忘记密码？</router-link>
          </div>
        </form>
        
        <div class="social-login">
          <p class="social-text">或使用其他方式登录</p>
          <div class="social-buttons">
            <button class="social-btn social-wechat">
              <i data-feather="message-circle" class="social-icon"></i>
              微信登录
            </button>
            <button class="social-btn social-qq">
              <i data-feather="navigation" class="social-icon"></i>
              QQ登录
            </button>
          </div>
        </div>
      </div>

      <!-- 注册表单 -->
      <div v-else class="auth-form">
        <h2 class="form-title">创建账户</h2>
        <p class="form-subtitle">加入花之谜语，探索花的世界</p>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="register-name" class="form-label">用户名</label>
            <input 
              id="register-name" 
              v-model="registerForm.name" 
              type="text" 
              class="form-input" 
              :class="{ error: registerErrors.name }"
              placeholder="请输入用户名"
              @blur="validateName"
              @input="registerErrors.name = ''"
              required
            />
            <div v-if="registerErrors.name" class="error-message">
              {{ registerErrors.name }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="register-email" class="form-label">邮箱</label>
            <input 
              id="register-email" 
              v-model="registerForm.email" 
              type="email" 
              class="form-input" 
              :class="{ error: registerErrors.email }"
              placeholder="请输入邮箱"
              @blur="validateEmail('register')"
              @input="registerErrors.email = ''"
              required
            />
            <div v-if="registerErrors.email" class="error-message">
              {{ registerErrors.email }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="register-password" class="form-label">密码</label>
            <input 
              id="register-password" 
              v-model="registerForm.password" 
              type="password" 
              class="form-input" 
              :class="{ error: registerErrors.password }"
              placeholder="请输入密码"
              @blur="validatePassword"
              @input="registerErrors.password = ''"
              required
            />
            <div v-if="registerErrors.password" class="error-message">
              {{ registerErrors.password }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="register-confirm" class="form-label">确认密码</label>
            <input 
              id="register-confirm" 
              v-model="registerForm.confirmPassword" 
              type="password" 
              class="form-input" 
              :class="{ error: registerErrors.confirmPassword }"
              placeholder="请再次输入密码"
              @blur="validateConfirmPassword"
              @input="registerErrors.confirmPassword = ''"
              required
            />
            <div v-if="registerErrors.confirmPassword" class="error-message">
              {{ registerErrors.confirmPassword }}
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="!isRegisterValid"
            >
              注册
            </button>
          </div>
        </form>
        
        <div class="social-login">
          <p class="social-text">或使用其他方式注册</p>
          <div class="social-buttons">
            <button class="social-btn social-wechat">
              <i data-feather="message-circle" class="social-icon"></i>
              微信注册
            </button>
            <button class="social-btn social-qq">
              <i data-feather="navigation" class="social-icon"></i>
              QQ注册
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, registerUser, authenticateUser } from '@/store/user';

const router = useRouter();
const { login } = useUserStore();
const activeTab = ref('login');

// 登录表单数据
const loginForm = ref({
  email: '',
  password: ''
});

// 注册表单数据
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 错误信息
const loginErrors = ref({
  email: '',
  password: ''
});

const registerErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 验证邮箱格式
const validateEmail = (type) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (type === 'login') {
    if (!loginForm.value.email) {
      loginErrors.value.email = '请输入邮箱地址';
    } else if (!emailRegex.test(loginForm.value.email)) {
      loginErrors.value.email = '请输入有效的邮箱地址';
    } else {
      loginErrors.value.email = '';
    }
  } else {
    if (!registerForm.value.email) {
      registerErrors.value.email = '请输入邮箱地址';
    } else if (!emailRegex.test(registerForm.value.email)) {
      registerErrors.value.email = '请输入有效的邮箱地址';
    } else {
      registerErrors.value.email = '';
    }
  }
};

// 验证用户名
const validateName = () => {
  if (!registerForm.value.name) {
    registerErrors.value.name = '请输入用户名';
  } else if (registerForm.value.name.length < 2) {
    registerErrors.value.name = '用户名至少2个字符';
  } else if (registerForm.value.name.length > 20) {
    registerErrors.value.name = '用户名最多20个字符';
  } else {
    registerErrors.value.name = '';
  }
};

// 验证密码
const validatePassword = () => {
  if (!registerForm.value.password) {
    registerErrors.value.password = '请输入密码';
  } else if (registerForm.value.password.length < 6) {
    registerErrors.value.password = '密码至少6个字符';
  } else if (registerForm.value.password.length > 20) {
    registerErrors.value.password = '密码最多20个字符';
  } else {
    registerErrors.value.password = '';
    validateConfirmPassword();
  }
};

// 验证确认密码
const validateConfirmPassword = () => {
  if (!registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = '请确认密码';
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = '两次密码不一致';
  } else {
    registerErrors.value.confirmPassword = '';
  }
};

// 计算登录表单是否有效
const isLoginValid = computed(() => {
  return loginForm.value.email && loginForm.value.password && 
         !loginErrors.value.email && !loginErrors.value.password;
});

// 计算注册表单是否有效
const isRegisterValid = computed(() => {
  return registerForm.value.name && registerForm.value.email && registerForm.value.password && registerForm.value.confirmPassword &&
         !registerErrors.value.name && !registerErrors.value.email && !registerErrors.value.password && !registerErrors.value.confirmPassword;
});

// 处理登录
const handleLogin = () => {
  if (!isLoginValid.value) {
    alert('请填写正确的信息');
    return;
  }
  
  const result = authenticateUser(loginForm.value.email, loginForm.value.password);

  if (!result.success) {
    alert(result.message);
    return;
  }

  login(result.user);
  alert('登录成功！');
  router.push('/');
};

// 处理注册
const handleRegister = () => {
  if (!isRegisterValid.value) {
    alert('请填写正确的信息');
    return;
  }

  const result = registerUser({
    name: registerForm.value.name,
    email: registerForm.value.email,
    password: registerForm.value.password
  });

  if (!result.success) {
    alert(result.message);
    return;
  }

  login({
    name: registerForm.value.name,
    email: registerForm.value.email
  });
  
  alert('注册成功！已自动登录。');
  router.push('/');
};

// 初始化 Feather Icons
onMounted(() => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E0F2F1 0%, #F7F9FB 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(84, 110, 122, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.auth-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(84, 110, 122, 0.12);
}

.auth-tabs {
  display: flex;
  background-color: var(--color-accent-1);
}

.tab-btn {
  flex: 1;
  padding: 18px;
  border: none;
  background: none;
  color: var(--color-text-sub);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab-btn.active {
  background-color: var(--color-primary);
  color: #fff;
}

.tab-btn:hover:not(.active) {
  background-color: rgba(84, 110, 122, 0.1);
  color: var(--color-primary);
}

.auth-form {
  padding: 35px;
}

.form-title {
  font-size: 26px;
  color: var(--color-text-main);
  margin-bottom: 10px;
  font-weight: 500;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 15px;
  color: var(--color-text-sub);
  margin-bottom: 30px;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-text-sub);
  font-weight: 400;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s;
  background-color: #fff;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(84, 110, 122, 0.1);
}

.form-input.error {
  border-color: #e74c3c !important;
  background-color: #fff5f5;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 6px;
  animation: fadeIn 0.3s ease-in-out;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 35px;
}

.submit-btn {
  flex: 1;
  padding: 14px 24px;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  margin-right:10px;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(84, 110, 122, 0.2);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.forgot-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: color 0.3s;
  margin-left: 15px;
}

.forgot-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.social-login {
  margin-top: 35px;
  padding-top: 35px;
  border-top: 1px solid var(--color-border);
}

.social-text {
  text-align: center;
  color: var(--color-text-sub);
  font-size: 14px;
  margin-bottom: 24px;
}

.social-buttons {
  display: flex;
  gap: 16px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: #fff;
  color: var(--color-text-main);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.social-btn:hover {
  background-color: var(--color-accent-1);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(84, 110, 122, 0.1);
}

.social-btn:active {
  transform: translateY(0);
}

.social-icon {
  width: 18px;
  height: 18px;
}

.social-wechat {
  color: #07C160;
}

.social-wechat:hover {
  color: #07C160;
  border-color: #07C160;
  background-color: rgba(7, 193, 96, 0.05);
}

.social-qq {
  color: #12B7F5;
}

.social-qq:hover {
  color: #12B7F5;
  border-color: #12B7F5;
  background-color: rgba(18, 183, 245, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-form {
  animation: fadeIn 0.5s ease-out;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .auth-container {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    max-width: 100%;
  }
  
  .auth-container:hover {
    transform: none;
    box-shadow: none;
  }
  
  .auth-form {
    padding: 25px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-subtitle {
    font-size: 14px;
    margin-bottom: 25px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-input {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 12px 20px;
    font-size: 15px;
  }
  
  .social-buttons {
    gap: 12px;
  }
  
  .social-btn {
    padding: 10px;
    font-size: 13px;
  }
}
</style>
