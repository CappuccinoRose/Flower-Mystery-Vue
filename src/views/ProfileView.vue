<template>
  <div class="profile-page">
    <div class="container profile-container">
      <!-- 左侧侧边栏 -->
      <aside class="profile-sidebar">
        <div class="user-card">
          <div class="avatar">
            <!-- 使用 Picsum 生成随机头像，使用用户名作为种子 -->
            <img :src="`https://picsum.photos/seed/${userInfo?.email}/200/200`" alt="Avatar" />
          </div>
          <h3 class="user-name-sidebar">{{ userInfo?.name || '花友' }}</h3>
          <p class="user-email">{{ userInfo?.email || '' }}</p>
        </div>

        <nav class="sidebar-nav">
          <button
            class="nav-item"
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
          >
            <i data-feather="heart" class="icon"></i>
            我的收藏
          </button>
          <button
            class="nav-item"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <i data-feather="clock" class="icon"></i>
            浏览历史
          </button>
          <button
            class="nav-item"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            <i data-feather="settings" class="icon"></i>
            账户设置
          </button>
        </nav>
      </aside>

      <!-- 右侧内容区 -->
      <main class="profile-main">
        <!-- 我的收藏 Tab -->
        <div v-if="activeTab === 'favorites'" class="tab-content fade-in">
          <h2 class="content-title">我的收藏</h2>
          <div v-if="favoriteFlowers.length === 0" class="empty-state">
            <i data-feather="inbox" class="empty-icon"></i>
            <p>暂无收藏，快去花语百科看看吧！</p>
            <router-link to="/flowers" class="action-btn">去逛逛</router-link>
          </div>
          <div v-else class="favorites-grid">
            <div
              v-for="flower in favoriteFlowers"
              :key="flower.id"
              class="flower-card-mini"
              @click="goToDetail(flower.id)"
            >
              <img :src="flower.images.cover" :alt="flower.name" class="card-img" />
              <div class="card-info">
                <h4>{{ flower.name }}</h4>
                <p class="flower-meaning">{{ flower.meaning }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 浏览历史 Tab (模拟) -->
        <div v-if="activeTab === 'history'" class="tab-content fade-in">
          <h2 class="content-title">浏览历史</h2>
          <div class="empty-state">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 账户设置 Tab -->
        <div v-if="activeTab === 'settings'" class="tab-content fade-in">
          <h2 class="content-title">账户设置</h2>
          <div class="settings-form">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" :value="userInfo?.name" disabled />
            </div>
            <div class="form-group">
              <label>绑定邮箱</label>
              <input type="email" :value="userInfo?.email" disabled />
            </div>
            <p class="hint">当前为模拟环境，暂不支持修改。</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, getFavorites } from '@/store/user';
import { flowersData } from '@/data/flowers.js';

const router = useRouter();
const { userInfo } = useUserStore();
const activeTab = ref('favorites');

// getFavorites() 返回的是对象数组 [{id, name, meaning, images}, ...]
// 我们用它来过滤 flowersData，保证个人中心能直接展示图片、花语等信息
const favoriteFlowers = computed(() => {
  const favs = getFavorites(); // 对象数组
  if (!favs || favs.length === 0) return [];

  // 取交集：同时存在于收藏列表和 flowersData 中的项
  return favs.filter(fav =>
    flowersData.some(f => f.id === fav.id)
  ).map(fav => {
    // 合并 flowersData 的完整字段（尤其是 images 数组），防止数据不一致
    const full = flowersData.find(f => f.id === fav.id);
    return full ? { ...full } : fav;
  });
});

const goToDetail = (id) => {
  router.push(`/flowers/${id}`);
};

onMounted(() => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
</script>

<style scoped>
.profile-page {
  padding: 40px 0 80px 0;
  min-height: calc(100vh - 150px);
}

.profile-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

/* 侧边栏样式 */
.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.user-card {
  background: #fff;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid var(--color-primary);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name-sidebar {
  font-size: 18px;
  color: var(--color-text-main);
  margin-bottom: 5px;
}

.user-email {
  font-size: 13px;
  color: var(--color-text-sub);
}

.sidebar-nav {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-sub);
  font-size: 15px;
  transition: all 0.2s;
  gap: 12px;
}

.nav-item:hover {
  background-color: var(--color-accent-1);
  color: var(--color-primary);
}

.nav-item.active {
  background-color: rgba(84, 110, 122, 0.05);
  color: var(--color-primary);
  font-weight: 500;
  border-left: 4px solid var(--color-primary);
}

.icon {
  width: 18px;
  height: 18px;
}

/* 主内容区样式 */
.profile-main {
  flex: 1;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  min-height: 500px;
}

.content-title {
  font-size: 22px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border);
}

/* 收藏卡片网格 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.flower-card-mini {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.flower-card-mini:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
}

.card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.card-info {
  padding: 15px;
}

.card-info h4 {
  font-size: 16px;
  margin-bottom: 6px;
}

.flower-meaning {
  font-size: 13px;
  color: var(--color-text-sub);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--color-text-sub);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  color: #d1d5db;
}

.action-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 20px;
  background-color: var(--color-primary);
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
}

/* 设置表单 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-text-sub);
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #999;
}

.hint {
  font-size: 13px;
  color: #e67e22;
}

/* 动画 */
.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式 */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }

  .user-card {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 20px;
  }

  .avatar {
    margin: 0 15px 0 0;
    width: 60px;
    height: 60px;
  }
}
</style>
