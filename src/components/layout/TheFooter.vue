<template>
  <footer class="footer-wrapper">
    <div class="container footer-content">
      <div class="copyright">
        &copy; 2026 花之谜语 Flower Mystery. All rights reserved.
      </div>
      <div class="contact">
        <a href="mailto:3163880836@qq.com">联系我们</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 暂无逻辑
</script>

<style scoped>
.footer-wrapper {
  background-color: #fff;
  border-top: 1px solid var(--color-border);
  padding: 30px 40px;
  margin-top: auto; /* 粘性底部布局的关键 */
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-sub);
  font-size: 14px;
}

.footer-content a:hover {
  color: var(--color-primary);
}
</style>
