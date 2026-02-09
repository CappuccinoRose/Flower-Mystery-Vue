<template>
  <div class="flower-card" @click="goDetail">
    <!-- 图片区域 -->
    <div class="card-img">
      <img :src="flower.images[0]" :alt="flower.name" />
    </div>

    <!-- 文字信息区域 -->
    <div class="card-info">
      <h3 class="flower-name">{{ flower.name }}</h3>
      <p class="flower-english">{{ flower.englishName }}</p>
      <div class="card-tags">
        <span
          v-for="(tag, index) in flower.tags.slice(0, 2)"
          :key="index"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
      <p class="flower-desc">{{ flower.shortDesc }}</p>

      <div class="card-link">
        了解更多 <span>&rarr;</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 接收父组件传来的数据
const props = defineProps({
  flower: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// 点击跳转到详情页
const goDetail = () => {
  router.push(`/flowers/${props.flower.id}`);
};
</script>

<style scoped>
.flower-card {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%; /* 保证卡片在网格中高度一致 */
  display: flex;
  flex-direction: column;
}

.flower-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(84, 110, 122, 0.12);
}

.card-img {
  height: 200px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.flower-card:hover .card-img img {
  transform: scale(1.05);
}

.card-info {
  padding: 20px;
  flex: 1; /* 让内容撑开剩余空间 */
  display: flex;
  flex-direction: column;
}

.flower-name {
  font-size: 18px;
  color: var(--color-text-main);
  margin-bottom: 4px;
  font-weight: 500;
}

.flower-english {
  font-size: 12px;
  color: var(--color-text-sub);
  margin-bottom: 12px;
  font-family: 'Georgia', serif; /* 英文名用衬线体更有格调 */
}

.card-tags {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}

.tag {
  font-size: 12px;
  color: var(--color-primary);
  background-color: var(--color-accent-2); /* 极淡冰蓝 */
  padding: 2px 8px;
  border-radius: 4px;
}

.flower-desc {
  font-size: 14px;
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.card-link {
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-link span {
  transition: transform 0.2s ease;
}

.flower-card:hover .card-link span {
  transform: translateX(4px);
}
</style>
