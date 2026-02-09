<template>
  <div class="story-detail-page">
    <div class="container">
      <div class="back-nav">
        <router-link to="/stories" class="back-link">
          &larr; 返回故事列表
        </router-link>
      </div>

      <div v-if="story" class="story-detail-wrapper">
        <div class="story-header">
          <h1 class="story-title">{{ story.title }}</h1>
          <div class="story-tags">
            <span v-for="tag in story.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="story-image-container">
          <img 
            :src="story.image" 
            :alt="story.title"
            class="story-image"
          />
        </div>

        <div class="story-content">
          <div class="story-text" v-html="formattedContent"></div>
        </div>
      </div>

      <div v-else class="loading">
        加载中或未找到该故事...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storiesData } from '@/data/stories.js';

const route = useRoute();
const router = useRouter();

const story = ref(null);

// 格式化内容，保留换行
const formattedContent = computed(() => {
  if (!story.value) return '';
  return story.value.content.replace(/\n/g, '<br>');
});

onMounted(() => {
  const id = route.params.id;
  story.value = storiesData.find(s => s.id === id);

  if (typeof feather !== 'undefined') {
    feather.replace();
  } else {
    console.error('Feather Icons 库未加载，请检查 index.html');
  }
});
</script>

<style scoped>
.story-detail-page {
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

.story-detail-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.story-header {
  margin-bottom: 30px;
}

.story-title {
  font-size: 32px;
  color: var(--color-text-main);
  margin-bottom: 15px;
  font-weight: 600;
}

.story-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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

.story-image-container {
  margin-bottom: 30px;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.story-image {
  width: 100%;
  height: auto;
  display: block;
}

.story-content {
  line-height: 1.8;
  color: var(--color-text-main);
}

.story-text {
  font-size: 16px;
  color: var(--color-text-main);
  white-space: pre-line; /* 保留换行 */
}

.loading {
  text-align: center;
  padding: 100px;
  color: var(--color-text-sub);
}

@media (max-width: 768px) {
  .story-title {
    font-size: 28px;
  }
  
  .story-text {
    font-size: 15px;
  }
}
</style>
