<template>
  <div class="guide-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">送花指南</h1>
        <p class="page-subtitle">不知道送什么花？根据场景选择最合适的寓意。</p>
        <p class="image-credit">在这里，图片精选自:<a href="https://www.vcg.com/" target="_blank">视觉中国</a></p>
      </div>

      <div class="guide-grid">
        <div 
          v-for="guide in guidesData" 
          :key="guide.id" 
          class="guide-card"
          @click="goToFlowers(guide)"
        >
          <div class="guide-image">
            <img :src="guide.image" :alt="guide.title" />
            <div class="guide-icon-overlay">
              <i :data-feather="guide.icon" class="guide-icon"></i>
            </div>
          </div>
          
          <div class="guide-content">
            <h3>{{ guide.title }}</h3>
            <p>{{ guide.description }}</p>
            <div class="guide-tags">
              <span v-for="tag in guide.tags" :key="tag" class="mini-tag">{{ tag }}</span>
            </div>
            <button class="view-btn">
              查看推荐
              <i data-feather="arrow-right" class="arrow-icon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { guidesData } from '@/data/guides.js';

const router = useRouter();

const goToFlowers = (guide) => {
  // 将标签拼接成逗号分隔的字符串，通过 query 传递给列表页
  const tags = guide.tags.join(',');
  router.push({ path: '/flowers', query: { tags: tags } });
};

onMounted(() => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  color: var(--color-text-main);
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-text-sub);
  max-width: 600px;
  margin: 0 auto;
}

.image-credit{
  font-size: 13px;
  color: var(--color-text-sub);
  margin-top: 10px;
  font-weight: 500;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding-bottom: 60px;
}

.guide-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid var(--color-border);
}

.guide-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.guide-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.guide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.guide-card:hover .guide-image img {
  transform: scale(1.05);
}

/* 调整图标位置和尺寸，确保完整显示 */
.guide-icon-overlay {
  position: absolute;
  bottom: 10px; /* 调整垂直位置，确保图标不被裁切 */
  right: 15px;   /* 调整水平位置 */
  width: 50px;
  height: 50px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  z-index: 2; /* 确保图标在图片上方 */
}

.guide-icon {
  color: #fff;
  width: 24px;
  height: 24px;
}

.guide-content {
  padding: 30px 24px;
  position: relative;
}

.guide-content h3 {
  font-size: 20px;
  color: var(--color-text-main);
  margin-bottom: 10px;
}

.guide-content p {
  font-size: 14px;
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: 15px;
  height: 42px; /* 限制两行高度 */
  overflow: hidden;
}

.guide-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.mini-tag {
  background: var(--color-accent-1);
  color: var(--color-primary);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.guide-card:hover .view-btn {
  background: var(--color-primary);
  color: #fff;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.guide-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>
