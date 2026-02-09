<template>
  <header class="the-header" :class="{ 'is-transparent': isTransparent }">
    <div class="container header-content">
      <div class="logo" @click="$router.push('/')">
        花之谜语
      </div>
      <nav class="header-nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/flowers" class="nav-link">花语百科</router-link>
        <router-link to="/guide" class="nav-link">送花指南</router-link>
        <router-link to="/stories" class="nav-link">故事专栏</router-link>
      </nav>
      <div class="header-auth">
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="user-name">
            {{ userInfo?.name || '花友' }}
          </router-link>
          <a href="#" class="auth-link" @click.prevent="handleLogout">退出</a>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link">登录 / 注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';

const route = useRoute();
const { isLoggedIn, userInfo, logout } = useUserStore();

// 只有首页头部是透明的
const isTransparent = computed(() => route.name === 'home');

// 处理退出
const handleLogout = () => {
  logout();
  // 退出后刷新页面或跳转首页
  window.location.reload();
};
</script>

<style scoped>
.the-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s, border-color 0.3s;
  padding: 0 20px;
}

.the-header.is-transparent {
  background-color: rgba(247, 249, 251, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(236, 239, 241, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  /* 固定高度 */
}

.logo {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  letter-spacing: 1px;
}

.header-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: var(--color-text-sub);
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

/* 导航下划线动画 */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: var(--color-primary);
  transition: width 0.3s;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.header-auth {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-size: 14px;
  color: var(--color-text-main);
  text-decoration: none;
  transition: color 0.3s;
}

.user-name:hover {
  color: var(--color-primary);
}


.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 16px;
  border: 1px solid var(--color-primary);
  border-radius: 20px;
  transition: all 0.3s;
}

.auth-link:hover {
  background-color: var(--color-primary);
  color: #fff;
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
    /* 简化处理，移动端暂时隐藏导航链接 */
  }
}
</style>
