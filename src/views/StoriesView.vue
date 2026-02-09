<template>
  <div class="story-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">故事专栏</h1>
        <p class="page-subtitle">探索花卉背后的文化与传说，感受自然与人文的交融。</p>
        <p class="image-credit">在这里，图片精选自:<a href="https://www.vcg.com/" target="_blank">视觉中国</a></p>
      </div>

      <div class="story-grid">
        <div 
          v-for="story in storiesData" 
          :key="story.id" 
          class="story-card"
          @click="navigateToDetail(story.id)"
        >
          <div class="story-image">
            <img :src="story.image" :alt="story.title" />
          </div>
          
          <div class="story-content">
            <h3>{{ story.title }}</h3>
            <p class="story-summary">{{ story.summary }}</p>
            
            <div class="story-tags">
              <span v-for="tag in story.tags" :key="tag" class="mini-tag">{{ tag }}</span>
            </div>
            
            <div class="story-meta">
              <span class="read-more">阅读全文</span>
              <i data-feather="arrow-right" class="arrow-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storiesData } from '@/data/stories.js';

const router = useRouter();

const navigateToDetail = (id) => {
  router.push(`/stories/${id}`);
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
  font-weight: 600;
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

.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  padding-bottom: 60px;
}

.story-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.story-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.story-image {
  height: 200px;
  overflow: hidden;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.story-card:hover .story-image img {
  transform: scale(1.05);
}

.story-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.story-content h3 {
  font-size: 20px;
  color: var(--color-text-main);
  margin-bottom: 12px;
  line-height: 1.4;
}

.story-summary {
  font-size: 14px;
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.story-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.mini-tag {
  background: var(--color-accent-1);
  color: var(--color-primary);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.story-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
}

.story-meta:hover {
  color: var(--color-primary-dark);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.story-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>
