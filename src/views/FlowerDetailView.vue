<template>
  <div class="container detail-page">
    <div class="back-nav">
      <router-link to="/flowers" class="back-link">
        &larr; 返回列表
      </router-link>
    </div>

    <div v-if="flower" class="detail-wrapper">
      <!-- 图片轮播区域 -->
      <div class="detail-image-gallery">
        <div class="image-container">
          <img 
            v-for="(img, index) in flower.images" 
            :key="index" 
            :src="img" 
            :alt="flower.name"
            class="detail-image"
            v-show="currentImageIndex === index"
          />
          
          <!-- 收藏按钮 -->
          <button 
            class="favorite-btn" 
            :class="{ active: isFavorited }" 
            @click="handleToggleFavorite"
          >
            <i data-feather="heart" class="fav-icon"></i>
            <span class="fav-text">{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
        
        <!-- 图片指示器 -->
        <div class="image-indicators">
          <span 
            v-for="(img, index) in flower.images" 
            :key="index"
            class="indicator"
            :class="{ active: currentImageIndex === index }"
            @click="currentImageIndex = index"
          ></span>
        </div>
      </div>

      <!-- 右侧：信息 -->
      <div class="detail-content">
        <h1 class="detail-title">
          {{ flower.name }} 
          <span class="detail-en">{{ flower.englishName }}</span>
        </h1>
        
        <div class="detail-tags">
          <span v-for="tag in flower.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>

        <div class="info-section" @click="copyToClipboard(flower.meaning)">
          <h3>
            <i data-feather="heart" class="section-icon"></i>
            花语
          </h3>
          <p>{{ flower.meaning }}</p>
        </div>

        <div class="info-section" @click="copyToClipboard(flower.details.description)">
          <h3>
            <i data-feather="book-open" class="section-icon"></i>
            简介
          </h3>
          <p>{{ flower.details.description }}</p>
        </div>

        <div class="info-group">
          <div class="info-item" @click="copyToClipboard(flower.details.bloomTime)">
            <h3>
              <i data-feather="calendar" class="section-icon"></i>
              花期
            </h3>
            <p>{{ flower.details.bloomTime }}</p>
          </div>
          <div class="info-item" @click="copyToClipboard(flower.details.origin)">
            <h3>
              <i data-feather="globe" class="section-icon"></i>
              起源
            </h3>
            <p>{{ flower.details.origin }}</p>
          </div>
        </div>

        <div class="info-section" @click="copyToClipboard(flower.details.care)">
          <h3>
            <i data-feather="droplet" class="section-icon"></i>
            养护指南
          </h3>
          <p>{{ flower.details.care }}</p>
        </div>
        
        <div class="info-section" @click="copyToClipboard(flower.details.match)">
          <h3>
            <i data-feather="gift" class="section-icon"></i>
            推荐搭配
          </h3>
          <p>{{ flower.details.match }}</p>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      加载中或未找到该花卉...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore, toggleFavorite, checkFavorite } from '@/store/user';
import { flowersData } from '@/data/flowers.js';

const route = useRoute();
const router = useRouter();
const { isLoggedIn } = useUserStore();

const flower = ref(null);
const currentImageIndex = ref(0);

// 关键修复：恢复 favKey，用于强制触发 UI 更新
const favKey = ref(0);

// 计算属性：依赖 favKey，当 favKey 变化时，重新检查状态
const isFavorited = computed(() => {
  // 1. 读取 favKey，让 Vue 建立依赖关系
  favKey.value; 
  
  // 2. 检查状态
  if (!flower.value) return false;
  return checkFavorite(flower.value.id);
});

// 切换收藏逻辑
const handleToggleFavorite = () => {
  if (!isLoggedIn.value) {
    showToast('请先登录后再收藏', 'error');
    setTimeout(() => router.push('/login'), 1500);
    return;
  }

  const result = toggleFavorite(flower.value);
  
  if (result.success) {
    // 1. 提示
    const msg = result.type === 'added' ? '已收藏' : '取消收藏';
    showToast(msg, 'success');
    
    // 2. 关键：修改 favKey，强制触发 isFavorited 重新计算
    favKey.value++;
  } else {
    // 如果存储失败（比如浏览器隐私模式），提示用户
    showToast('收藏失败，请检查浏览器设置或稍后重试', 'error');
    console.error('Storage error:', result.message);
  }
};

// 显示 Toast 提示
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="toast-icon"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  if (typeof feather !== 'undefined') feather.replace();

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

// 复制到剪贴板功能
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
  } catch (err) {
    console.error('复制失败:', err);
    showToast('复制失败，请手动复制', 'error');
  }
};

onMounted(async () => {
  const id = route.params.id;
  flower.value = flowersData.find(f => f.id === id);

  await new Promise(resolve => setTimeout(resolve, 0));

  if (typeof feather !== 'undefined') {
    feather.replace();
  } else {
    console.error('Feather Icons 库未加载，请检查 index.html');
  }
});
</script>

<style scoped>
.detail-page {
  padding-top: 40px;
  padding-bottom: 80px;
}

.back-nav {
  margin-bottom: 30px;
}

.back-link {
  color: var(--color-text-sub);
  font-size: 14px;
}

.back-link:hover {
  color: var(--color-primary);
}

.detail-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.detail-image-gallery {
  position: relative;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.image-container {
  position: relative;
  height: 400px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 收藏按钮样式 */
.favorite-btn {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}

.favorite-btn:hover {
  transform: scale(1.05);
  background: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.favorite-btn .fav-icon {
  width: 20px;
  height: 20px;
  color: #ccc;
  transition: all 0.3s ease;
  fill: none; /* 默认空心 */
}

.favorite-btn.active {
  background: rgba(255, 240, 240, 0.95);
  border-color: #e74c3c;
}

.favorite-btn.active .fav-icon {
  color: #e74c3c;
  fill: #e74c3c; /* 激活实心 */
  stroke: #e74c3c;
}

.fav-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-main);
}

.image-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.2s;
}

.indicator.active {
  background-color: #fff;
}

.detail-content {
  padding-right: 20px;
}

.detail-title {
  font-size: 32px;
  color: var(--color-text-main);
  margin-bottom: 8px;
  font-weight: 500;
}

.detail-en {
  font-size: 18px;
  color: var(--color-text-sub);
  font-family: 'Georgia', serif;
  font-weight: 400;
  margin-left: 12px;
}

.detail-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
}

.tag {
  background-color: var(--color-accent-1);
  color: var(--color-primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.2s;
  cursor: pointer;
}

.tag:hover {
  background-color: var(--color-primary);
  color: #fff;
  transform: translateY(-2px);
}

.section-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
  stroke: var(--color-primary);
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.3s ease;
  cursor: pointer;
}

.info-section:hover .section-icon,
.info-item:hover .section-icon {
  transform: scale(1.2);
  stroke: var(--color-accent-1);
}

.info-section h3 {
  font-size: 16px;
  color: var(--color-primary);
  margin-bottom: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  cursor: pointer;
}

.info-section {
  margin-bottom: 30px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.info-section:hover {
  transform: translateX(5px);
}

.info-section p {
  color: var(--color-text-main);
  font-size: 15px;
  line-height: 1.8;
  transition: color 0.3s ease;
}

.info-section:hover p {
  color: var(--color-text-main);
}

.info-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: var(--radius-card);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: box-shadow 0.3s ease;
}

.info-group:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.info-item h3 {
  font-size: 14px;
  color: var(--color-text-sub);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  cursor: pointer;
}

.info-item:hover h3 {
  color: var(--color-primary);
}

.info-item p {
  font-size: 15px;
  color: var(--color-text-main);
  transition: color 0.3s ease;
}

.info-item:hover p {
  color: var(--color-text-main);
}

/* Toast 样式 */
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  color: var(--color-text-main);
  padding: 12px 24px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  z-index: 2000;
  font-size: 14px;
  font-weight: 500;
}

.toast-notification.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-notification.error {
  color: #e74c3c;
  border-left: 4px solid #e74c3c;
}

.toast-notification.success {
  color: #27ae60;
  border-left: 4px solid #27ae60;
}

.loading {
  text-align: center;
  padding: 100px;
  color: var(--color-text-sub);
}

@media (max-width: 768px) {
  .detail-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .detail-image-gallery {
    position: static;
  }
  
  .image-container {
    height: 300px;
  }
  
  .image-indicators {
    position: static;
    transform: none;
    margin-top: 15px;
    justify-content: center;
  }
  
  .info-group {
    grid-template-columns: 1fr;
  }
}
</style>
