<template>
  <div class="container flower-list">
    <h1 class="page-title">花之谜语</h1>

    <!-- 排序选项 -->
    <div class="sort-options">
      <label class="sort-label">排序方式：</label>
      <select v-model="sortOption" class="sort-select" @change="handleSortChange">
        <option value="name">按名称</option>
        <option value="bloomTime">按花期</option>
        <option value="origin">按起源</option>
      </select>
    </div>

    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <i data-feather="search" class="search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索花卉..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 来自送花指南的提示（仅在有来自指南的标签时显示） -->
    <div v-if="fromGuideTags.length > 0" class="from-guide-hint">
      <i data-feather="arrow-right" class="hint-icon"></i>
      <span class="hint-text">来自送花指南：{{ fromGuideTags.join('、') }}</span>
      <button class="hint-reset" @click="clearGuideTags">
        清除
      </button>
    </div>

    <!-- 筛选标签 + 重置按钮 -->
    <div class="filter-tags">
      <div class="tags-container">
        <span
          v-for="tag in availableTags"
          :key="tag"
          class="tag"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
      <div class="filter-actions">
        <button
          class="reset-btn"
          :disabled="!hasFilter"
          @click="resetFilters"
        >
          <i data-feather="x-circle" class="reset-icon"></i>
          重置筛选
        </button>
      </div>
    </div>

    <!-- 花卉列表：使用 FlowerCard 组件 -->
    <div class="flower-grid">
      <FlowerCard
        v-for="flower in currentFlowers"
        :key="flower.id"
        :flower="flower"
      />
    </div>

    <!-- 加载更多按钮 -->
    <div class="load-more-container" v-if="hasMore">
      <button class="load-more-btn" @click="loadMore">
        加载更多
        <i data-feather="plus" class="plus-icon"></i>
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredFlowers.length === 0" class="empty-state">
      <i data-feather="search" class="empty-icon"></i>
      <p>没有找到匹配的花卉</p>
      <button
        v-if="hasFilter"
        class="reset-link"
        @click="resetFilters"
      >
        清除筛选条件
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore, toggleFavorite, checkFavorite } from '@/store/user';
import { flowersData } from '@/data/flowers.js';
import { debounce } from 'lodash-es';
// 引入花卡片组件
import FlowerCard from '@/components/flowers/FlowerCard.vue';

const router = useRouter();
const route = useRoute();
const { isLoggedIn } = useUserStore();

// 列表筛选相关状态
const searchQuery = ref('');
const selectedTags = ref([]);
const currentPage = ref(1);
const flowersPerPage = 12;
const sortOption = ref('name');
const loadingImages = ref(new Set());

// 收藏功能相关状态
const favKey = ref(0);

// 来自送花指南的标签（用于顶部提示）
const fromGuideTags = ref([]);

// 初始化 Feather Icons、懒加载、解析 URL query.tags
onMounted(() => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  initLazyLoad();

  // 检查是否从送花指南跳转过来，query.tags 为逗号分隔的标签字符串
  const tagsParam = route.query.tags;
  if (tagsParam) {
    const tagsArray = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
    selectedTags.value = tagsArray;
    fromGuideTags.value = tagsArray; // 记录下来，用于显示提示

    // 自动滚动到筛选区域，提升体验
    setTimeout(() => {
      const filterSection = document.querySelector('.filter-tags');
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
});

// 清理懒加载观察器
onBeforeUnmount(() => {
  if (window.lazyLoadObserver) {
    window.lazyLoadObserver.disconnect();
  }
});

// 监听搜索和标签变化，重置分页
watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(selectedTags, () => {
  currentPage.value = 1;
});

// 判断是否被收藏 (依赖 favKey，确保状态更新)
const isFavorited = (id) => {
  favKey.value; // 关键：建立依赖
  if (!id) return false;
  return checkFavorite(id);
};

// 处理收藏点击
const handleToggleFavorite = (flower, event) => {
  event.stopPropagation();

  if (!isLoggedIn.value) {
    showToast('请先登录后再收藏', 'error');
    setTimeout(() => router.push('/login'), 1500);
    return;
  }

  const result = toggleFavorite(flower);

  if (result.success) {
    const msg = result.type === 'added' ? '已收藏' : '取消收藏';
    showToast(msg, 'success');

    // 强制更新列表中的收藏状态
    favKey.value++;
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

// 清除"来自送花指南"的提示和对应标签
const clearGuideTags = () => {
  fromGuideTags.value = [];
  selectedTags.value = [];
  currentPage.value = 1;
};

// 是否有筛选条件
const hasFilter = computed(() => {
  return searchQuery.value.trim() !== '' || selectedTags.value.length > 0;
});

// 获取所有可用标签
const availableTags = computed(() => {
  const tags = new Set();
  flowersData.forEach(flower => {
    flower.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
});

// 排序花卉数据
const sortedFlowers = computed(() => {
  let sorted = [...flowersData];

  switch(sortOption.value) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'bloomTime':
      sorted.sort((a, b) => {
        const aTime = a.details.bloomTime;
        const bTime = b.details.bloomTime;
        return aTime.localeCompare(bTime);
      });
      break;
    case 'origin':
      sorted.sort((a, b) => a.details.origin.localeCompare(b.details.origin));
      break;
  }

  return sorted;
});

// 筛选花卉
const filteredFlowers = computed(() => {
  let filtered = sortedFlowers.value;

  // 按搜索词筛选
  if (searchQuery.value) {
    filtered = filtered.filter(flower =>
      flower.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      flower.englishName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      flower.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  // 按标签筛选
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(flower =>
      flower.tags.some(tag => selectedTags.value.includes(tag))
    );
  }

  return filtered;
});

// 获取当前页的花卉
const currentFlowers = computed(() => {
  const start = (currentPage.value - 1) * flowersPerPage;
  const end = start + flowersPerPage;
  return filteredFlowers.value.slice(start, end);
});

// 判断是否有更多内容
const hasMore = computed(() => {
  return filteredFlowers.value.length > currentPage.value * flowersPerPage;
});

// 处理搜索（防抖，使用 lodash-es）
const handleSearch = debounce(() => {
  currentPage.value = 1;
}, 300);

// 处理排序
const handleSortChange = () => {
  currentPage.value = 1;
};

// 切换标签
const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value = [...selectedTags.value, tag];
  }
  currentPage.value = 1;
};

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = '';
  selectedTags.value = [];
  fromGuideTags.value = [];
  currentPage.value = 1;
};

// 导航到详情页（列表页目前其实不需要这个，保留也行，FlowerCard 自己有跳转）
const navigateToDetail = (id) => {
  router.push(`/flowers/${id}`);
};

// 加载更多
const loadMore = () => {
  currentPage.value++;
};

// 初始化懒加载
const initLazyLoad = () => {
  const lazyImages = document.querySelectorAll('.lazy-load');

  if ('IntersectionObserver' in window) {
    window.lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          loadingImages.value.add(img);
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      window.lazyLoadObserver.observe(img);
    });
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
};

// 处理图片加载
const handleImageLoad = (e) => {
  loadingImages.value.delete(e.target);
  e.target.classList.add('loaded');

  // 添加加载完成动画
  e.target.style.animation = 'fadeIn 0.5s ease-in-out';
};

// 处理图片错误
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  font-size: 36px;
  color: var(--color-text-main);
  margin-bottom: 30px;
  font-weight: 600;
}

/* 排序选项样式 */
.sort-options {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: flex-end;
}

.sort-label {
  margin-right: 10px;
  color: var(--color-text-sub);
  font-size: 14px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: #fff;
  color: var(--color-text-main);
  font-size: 14px;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 搜索栏样式 */
.search-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-sub);
}

.search-input {
  width: 100%;
  padding: 12px 45px;
  border: 2px solid var(--color-border);
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: var(--color-primary);
}

/* 来自送花指南的提示 */
.from-guide-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: var(--color-accent-1);
  border-radius: 30px;
  border: 1px solid rgba(0,0,0,0.05);
}

.hint-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

.hint-text {
  font-size: 14px;
  color: var(--color-text-main);
}

.hint-reset {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: #fff;
  color: var(--color-text-sub);
  cursor: pointer;
  transition: all 0.2s;
}

.hint-reset:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 筛选标签 + 重置按钮区域 */
.filter-tags {
  margin-bottom: 30px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  flex: 1;
}

.tag {
  padding: 8px 16px;
  background-color: var(--color-accent-1);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tag:hover {
  background-color: var(--color-primary);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tag.active {
  background-color: var(--color-primary);
  color: #fff;
}

.filter-actions {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background-color: #fff;
  color: var(--color-text-sub);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-accent-1);
}

.reset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.reset-icon {
  width: 16px;
  height: 16px;
}

/* 花卉列表网格 */
.flower-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* 加载更多按钮 */
.load-more-container {
  text-align: center;
  margin-top: 30px;
}

.load-more-btn {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.load-more-btn:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
}

.plus-icon {
  width: 16px;
  height: 16px;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--color-text-sub);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  color: var(--color-text-sub);
}

.reset-link {
  margin-top: 12px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background-color: #fff;
  color: var(--color-text-sub);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-accent-1);
}

/* Toast 样式 (复用) */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .flower-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .page-title {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .search-input-wrapper {
    max-width: 100%;
  }

  .sort-options {
    justify-content: center;
    margin-bottom: 20px;
  }

  .filter-tags {
    flex-direction: column;
    align-items: stretch;
  }

  .tags-container {
    border-bottom: none;
    padding-bottom: 0;
  }

  .filter-actions {
    justify-content: center;
    border-bottom: 1px solid var(--color-border);
  }

  .from-guide-hint {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
}
</style>
