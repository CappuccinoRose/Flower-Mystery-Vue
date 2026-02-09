
<template>
  <div class="home-page">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-content">
        <h1 class="hero-title">花语，心之语</h1>
        <p class="hero-subtitle">探索每种花朵背后的故事与情感</p>
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索你感兴趣的花卉..." 
            class="search-input"
            @input="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <i data-feather="search" class="search-icon"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- 推荐花卉 Section -->
    <section class="featured-section">
      <div class="container">
        <h2 class="section-title">精选推荐</h2>
        <div class="featured-grid">
          <FlowerCard
            v-for="flower in featuredFlowers"
            :key="flower.id"
            :flower="flower"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { flowersData } from '@/data/flowers.js';
import FlowerCard from '@/components/flowers/FlowerCard.vue'; // 导入花卡片组件

const router = useRouter();
const searchQuery = ref('');
const featuredFlowers = ref([]);

// 初始化 Feather Icons
onMounted(() => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  initLazyLoad();
  // 获取前8个花卉作为推荐
  featuredFlowers.value = flowersData.slice(0, 8);
});

// 初始化懒加载
const initLazyLoad = () => {
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  if ('IntersectionObserver' in window) {
    window.lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      window.lazyLoadObserver.observe(img);
    });
  } else {
    // 回退方案：直接加载所有图片
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/flowers?search=${encodeURIComponent(searchQuery.value)}`);
  }
};

// 导航到详情页
const navigateToDetail = (id) => {
  router.push(`/flowers/${id}`);
};

// 处理图片错误
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x200?text=图片加载失败' ;
};

// 处理图片加载
const handleImageLoad = (e) => {
  e.target.classList.add('loaded');
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 透明导航栏样式 */
.transparent-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(247, 249, 251, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(236, 239, 241, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo {
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-main);
}

.header-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: var(--color-text-sub);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--color-primary);
}

/* Hero Section 样式 */
.hero-section {
  background: linear-gradient(135deg, #E0F2F1 0%, #F7F9FB 100%);
  padding: 120px 0;
  margin-top: 60px;
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 40px;
  font-weight: 500;
  color: var(--color-text-main);
  margin-bottom: 20px;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--color-text-sub);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-box {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid var(--color-border);
  border-radius: 30px 0 0 30px;
  font-size: 16px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.9);
}

.search-btn {
  padding: 0 24px;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: var(--color-primary-dark);
}

.search-icon {
  width: 20px;
  height: 20px;
}

/* 推荐花卉 Section 样式 */
.featured-section {
  padding: 80px 0;
  background-color: #fff;
}

.section-title {
  font-size: 28px;
  color: var(--color-text-main);
  text-align: center;
  margin-bottom: 50px;
  font-weight: 500;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.featured-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(84, 110, 122, 0.06);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.featured-image-container {
  height: 200px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
}

.featured-image.loaded {
  opacity: 1;
}

.featured-info {
  padding: 20px;
}

.featured-name {
  font-size: 18px;
  color: var(--color-text-main);
  margin-bottom: 8px;
  font-weight: 500;
}

.featured-meaning {
  font-size: 14px;
  color: var(--color-text-sub);
  margin-bottom: 15px;
  line-height: 1.5;
}

.featured-tags {
  display: flex;
  gap: 8px;
}

.featured-tags .tag {
  padding: 4px 10px;
  background-color: var(--color-accent-1);
  color: var(--color-primary);
  border-radius: 12px;
  font-size: 12px;
}

/* Footer 样式 */
.footer {
  margin-top: auto;
  padding: 40px;
  background-color: #f7f9fb;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright {
  color: var(--color-text-sub);
  font-size: 14px;
}

.email-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.email-link:hover {
  color: var(--color-primary-dark);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .featured-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .header-nav {
    gap: 20px;
  }
  
  .nav-link {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 80px 0;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-input {
    border-radius: 30px;
    margin-bottom: 10px;
  }
  
  .search-btn {
    border-radius: 30px;
  }
}
</style>
