<template>
  <div class="app">
    <TheHeader />
    <main class="main-content">
      <router-view />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import { initAuth } from './store/user'

// 初始化 Feather Icons 和 用户登录状态
onMounted(() => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  initAuth(); // 检查本地存储的登录状态
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
  background-color: #F7F9FB;
  color: var(--color-text-main);
  line-height: 1.7;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画过渡 */
.router-view-enter-active,
.router-view-leave-active {
  transition: opacity 0.3s;
}

.router-view-enter-from,
.router-view-leave-to {
  opacity: 0;
}

.main-content {
  /* 给 Header 留出空间，防止内容被遮挡 */
  padding-top: 70px; 
  min-height: calc(100vh - 200px); /* 简单的最小高度 */
}
</style>
