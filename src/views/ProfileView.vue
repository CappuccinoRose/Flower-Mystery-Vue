<template>
  <div class="profile-page">
    <div class="container profile-container">
      <!-- 左侧侧边栏 -->
      <aside class="profile-sidebar">
        <div class="user-card">
          <div class="avatar">
            <!-- 头像增加柔和光晕 -->
           <img src="https://ts1.tc.mm.bing.net/th/id/OIP-C.-wZKduvEfr6BBKpnRzZXYAHaJ4?w=160&h=211&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2" alt="Avatar" />
          </div>
          <h3 class="user-name-sidebar">{{ userInfo?.name || '花友' }}</h3>
          <p class="user-email">{{ userInfo?.email || '未设置邮箱' }}</p>
        </div>

        <nav class="sidebar-nav">
          <button
            class="nav-item"
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
          >
            <i data-feather="heart" class="icon"></i>
            <span>我的收藏</span>
          </button>
          <button
            class="nav-item"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <i data-feather="clock" class="icon"></i>
            <span>浏览足迹</span>
          </button>
          <button
            class="nav-item"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            <i data-feather="settings" class="icon"></i>
            <span>账户设置</span>
          </button>
        </nav>

        <!-- 退出登录按钮 -->
        <button class="logout-btn" @click="handleLogout">
          <i data-feather="log-out" class="icon"></i>
          <span>退出登录</span>
        </button>
      </aside>

      <!-- 右侧内容区 -->
      <main class="profile-main">
        <!-- 我的收藏 Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'favorites'" key="favorites" class="tab-content">
            <header class="content-header">
              <h2 class="content-title">我的收藏</h2>
              <p class="content-subtitle">那些曾打动瞬间</p>
            </header>

            <div v-if="favoriteFlowers.length === 0" class="empty-state">
              <div class="empty-icon-wrapper">
                <i data-feather="wind" class="empty-icon"></i>
              </div>
              <h3>花园很安静</h3>
              <p>你还没有收藏任何花卉，快去花语百科里寻找喜欢的花吧。</p>
              <router-link to="/flowers" class="action-btn">去逛逛</router-link>
            </div>

            <div v-else class="favorites-grid">
              <div
                v-for="flower in favoriteFlowers"
                :key="flower.id"
                class="flower-card-mini"
                @click="goToDetail(flower.id)"
              >
                <!-- 图片容器，保持比例 -->
                <div class="card-img-wrapper">
                  <img 
                    :src="getFlowerImage(flower)" 
                    :alt="flower.name" 
                    class="card-img" 
                    loading="lazy"
                  />
                </div>
                <div class="card-info">
                  <h4>{{ flower.name }}</h4>
                  <p class="flower-meaning" :title="flower.meaning">{{ flower.meaning }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 浏览历史 Tab -->
          <div v-else-if="activeTab === 'history'" key="history" class="tab-content">
            <header class="content-header">
              <h2 class="content-title">浏览足迹</h2>
              <div class="header-actions">
                <button class="text-btn" @click="clearHistory">清空足迹</button>
              </div>
            </header>
            
            <div class="empty-state history-empty">
              <i data-feather="feather" class="empty-icon"></i>
              <h3>记录还在萌芽</h3>
              <p>功能正在开发中，敬请期待...</p>
            </div>
          </div>

          <!-- 账户设置 Tab -->
          <div v-else-if="activeTab === 'settings'" key="settings" class="tab-content">
            <header class="content-header">
              <h2 class="content-title">账户设置</h2>
            </header>
            
            <div class="settings-card">
              <div class="setting-item">
                <label class="setting-label">用户名</label>
                <div class="setting-value">{{ userInfo?.name }}</div>
              </div>
              <div class="setting-item">
                <label class="setting-label">绑定邮箱</label>
                <div class="setting-value">{{ userInfo?.email || '未绑定' }}</div>
              </div>
              <div class="setting-hint">
                <i data-feather="info" class="hint-icon"></i>
                <span>当前为演示环境，账号信息仅供展示。</span>
              </div>
            </div>
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// 适配 Store 导出方式
import { useUserStore, getFavorites } from '@/store/user.js';
import { flowersData } from '@/data/flowers.js';

const router = useRouter();
// 从 useUserStore 中解构出 userInfo 和 logout
const { userInfo, logout } = useUserStore();
const activeTab = ref('favorites');

// --- 核心逻辑 ---

// 1. 收藏列表获取
const favoriteFlowers = computed(() => {
  // 获取 localStorage 中的收藏数据（返回的是对象数组 [{id, name...}]）
  const favs = getFavorites();
  
  if (!favs || favs.length === 0) return [];

  // 关键步骤：根据 ID 去 flowersData 里找完整数据
  // 这样做的好处：如果 flowersData 里的图片路径修复了，这里也会自动更新
  return favs.map(fav => {
    return flowersData.find(f => f.id === fav.id);
  }).filter(Boolean); // 过滤掉找不到的数据（防止删除了花卉后收藏报错）
});

// 2. 获取图片路径的辅助函数（兼容数组或对象）
const getFlowerImage = (flower) => {
  if (!flower || !flower.images) return '';
  if (Array.isArray(flower.images)) return flower.images[0];
  if (typeof flower.images === 'object') return flower.images.cover || flower.images.detail;
  return flower.images;
};

// 3. 跳转详情
const goToDetail = (id) => {
  router.push(`/flowers/${id}`);
};

// 4. 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    logout(); // 调用 store 里的 logout 方法清除状态和 localStorage
    router.push('/login'); // 跳转回登录页
  }
};

// 5. 清空历史（模拟）
const clearHistory = () => {
  alert('足迹已清空（模拟）');
};

// --- 生命周期 ---
onMounted(() => {
  if (typeof feather !== 'undefined') feather.replace();
});

// 监听 Tab 切换重新渲染图标
import { watch } from 'vue';
watch(activeTab, () => {
  if (typeof feather !== 'undefined') feather.replace();
});
</script>

<style scoped>
/* --- 布局基础 --- */
.profile-page {
  padding: 40px 0 80px;
  min-height: calc(100vh - 140px);
  background-color: var(--color-bg-page); /* 使用变量：极淡冷灰 */
}

.profile-container {
  display: flex;
  gap: 32px;
  max-width: var(--container-width); /* 使用变量：1200px */
  margin: 0 auto;
  align-items: flex-start;
}

/* --- 左侧侧边栏 --- */
.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}

.user-card {
  background: var(--color-bg-card); /* 使用变量：纯白 */
  padding: 40px 24px;
  border-radius: 12px; /* 可以考虑改成 var(--radius-card) 如果想统一圆角 */
  text-align: center;
  margin-bottom: 24px;
  box-shadow: var(--shadow-card); /* 使用变量：统一阴影 */
}

.avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto 16px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, var(--color-accent-1) 0%, var(--color-bg-card) 100%); 
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.user-name-sidebar {
  font-size: 20px;
  color: var(--color-text-main); 
  margin-bottom: 4px;
  font-weight: 500;
}

.user-email {
  font-size: var(--font-size-sub); 
  color: var(--color-text-sub); 
}

/* 侧边栏导航 */
.sidebar-nav {
  background: var(--color-bg-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  margin-bottom: 20px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-primary); 
  font-size: 15px;
  transition: all 0.2s;
  gap: 12px;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: var(--color-bg-page); 
}

.nav-item.active {
  background-color: var(--color-accent-1); 
  color: var(--color-text-main);
  border-left-color: var(--color-primary); 
  font-weight: 500;
}

.icon {
  width: 18px;
  height: 18px;
  stroke-width: 1.5;
}

/* 退出登录按钮 */
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--color-border); 
  background: #fff;
  color: #EF5350; 
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #FFEBEE;
  border-color: #FFCDD2;
}

/* --- 右侧主内容区 --- */
.profile-main {
  flex: 1;
  background: var(--color-bg-card);
  padding: 40px;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  min-height: 600px;
}

.content-header {
  margin-bottom: 32px;
  border-bottom: 1px solid var(--color-border); 
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.content-title {
  font-size: 26px;
  color: var(--color-text-main); 
  margin: 0;
}

.content-subtitle {
  font-size: var(--font-size-body); 
  color: var(--color-text-sub); 
  margin-top: 8px;
  font-weight: 400;
}

.header-actions .text-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
}

/* --- 收藏卡片网格 --- */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.flower-card-mini {
  border-radius: var(--radius-card); 
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s;
  background: #fff;
  border: 1px solid var(--color-border); 
  display: flex;
  flex-direction: column;
}

.flower-card-mini:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(84, 110, 122, 0.1);
  border-color: var(--color-accent-1); 
}

.card-img-wrapper {
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--color-bg-page); 
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.flower-card-mini:hover .card-img {
  transform: scale(1.05);
}

.card-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-info h4 {
  font-size: 16px;
  color: var(--color-text-main); 
  margin: 0 0 8px 0;
  font-weight: 500;
}

.flower-meaning {
  font-size: var(--font-size-sub); 
  color: var(--color-text-sub); 
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
}

/* --- 空状态 --- */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-sub); 
}

.empty-icon-wrapper {
  margin-bottom: 24px;
  color: var(--color-accent-1); 
}

.empty-icon {
  width: 64px;
  height: 64px;
}

.empty-state h3 {
  font-size: 18px;
  color: var(--color-primary); 
  margin-bottom: 12px;
}

.empty-state p {
  font-size: var(--font-size-body);
  margin-bottom: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.action-btn {
  display: inline-block;
  padding: 10px 32px;
  background-color: var(--color-primary); 
  color: #fff;
  border-radius: 24px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background-color: var(--color-primary-dark); 
}

/* --- 设置页面样式 --- */
.settings-card {
  max-width: 600px;
  background: var(--color-bg-page); 
  border-radius: 8px;
  padding: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: var(--color-text-sub);
  font-weight: 500;
}

.setting-value {
  font-size: 15px;
  color: var(--color-text-main);
  font-weight: 500;
}

.setting-hint {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-sub);
  background: #FFF3E0;
  padding: 12px;
  border-radius: 6px;
}

/* --- 动画 --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- 响应式 --- */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
    position: static;
  }
  
  .user-card {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 20px;
    gap: 20px;
  }

  .avatar {
    width: 60px;
    height: 60px;
    margin: 0;
    background: none;
    padding: 0;
  }
  
  .avatar img {
    border: 2px solid var(--color-accent-1);
  }

  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>

