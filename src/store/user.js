import { ref, computed } from 'vue';

// 模拟数据库存储的 Key
const USERS_KEY = 'flower_app_users';

// 当前登录会话状态
const state = ref({
  isLoggedIn: false,
  userInfo: null
});

// --- 数据库操作模拟 (CRUD) ---

// 获取所有已注册用户
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// 注册新用户（写入 localStorage）
export const registerUser = (userData) => {
  const users = getUsers();
  // 检查邮箱是否已存在
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: '该邮箱已被注册' };
  }
  // 写入新用户
  users.push(userData);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
};

// 验证用户登录（查询 localStorage）
export const authenticateUser = (email, password) => {
  const users = getUsers();
  // 查找邮箱和密码匹配的用户
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: '账号不存在或密码错误' };
  }
};

// --- 状态管理 ---

// 登录动作（仅更新当前状态）
export const login = (user) => {
  state.value.isLoggedIn = true;
  state.value.userInfo = user;
  localStorage.setItem('isLogin', 'true');
  localStorage.setItem('currentUser', JSON.stringify(user)); // 存储当前会话用户
};

// 登出动作
export const logout = () => {
  state.value.isLoggedIn = false;
  state.value.userInfo = null;
  localStorage.removeItem('isLogin');
  localStorage.removeItem('currentUser');
};

// 初始化状态（检查 localStorage）
export const initAuth = () => {
  const isLogin = localStorage.getItem('isLogin');
  const userInfo = localStorage.getItem('currentUser');
  if (isLogin === 'true' && userInfo) {
    state.value.isLoggedIn = true;
    state.value.userInfo = JSON.parse(userInfo);
  }
};

// 导出状态和操作
export const useUserStore = () => {
  return {
    isLoggedIn: computed(() => state.value.isLoggedIn),
    userInfo: computed(() => state.value.userInfo),
    login,
    logout
  };
};

// 获取当前用户的收藏列表
export const getFavorites = () => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return [];
  const user = JSON.parse(userStr);
  const key = `flower_favs_${user.email}`; // 按邮箱区分收藏数据
  const favs = localStorage.getItem(key);
  return favs ? JSON.parse(favs) : [];
};

// 切换收藏状态（添加或移除）
export const toggleFavorite = (flower) => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return { success: false, message: '请先登录' };
  
  const user = JSON.parse(userStr);
  const key = `flower_favs_${user.email}`;
  let favs = getFavorites();
  
  // 查找是否已存在（使用严格相等比较）
  const index = favs.findIndex(f => f.id === flower.id);
  
  if (index > -1) {
    // 存在则移除
    favs.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(favs));
    return { success: true, type: 'removed' };
  } else {
    // 不存在则添加（只保存必要信息，减少空间）
    favs.push({
      id: flower.id,
      name: flower.name,
      meaning: flower.meaning,
      images: flower.images
    });
    localStorage.setItem(key, JSON.stringify(favs));
    return { success: true, type: 'added' };
  }
};

// 检查单个花卉是否被收藏
export const checkFavorite = (flowerId) => {
  const favs = getFavorites();
  return favs.some(f => f.id === flowerId);
};
