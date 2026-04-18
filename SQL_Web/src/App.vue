<script setup>
import { RouterLink, RouterView, useRoute} from 'vue-router';
import ResourceModal from './components/ResourceModal.vue'
import LoginModal from './components/LoginModal.vue'
import DeepSeekPanel from './components/DeepSeekPanel.vue'
import { ref, onMounted, computed } from 'vue';
import { getUser, clearUser } from './core/userStore';
import mainLevels from './levels/mainLevels';
import customLevels from './levels/customLevels';

const route = useRoute();

const isShowModal = ref(false);
const isShowLoginModal = ref(false);
const currentUser = ref(null);

// 获取当前关卡信息（用于传递给 AI 助手）
const currentLevel = computed(() => {
  if (route.name === 'learnpage' && route.params.levelKey) {
    const allLevels = [...mainLevels, ...customLevels];
    return allLevels.find(l => l.key === route.params.levelKey) || null;
  }
  return null;
});

const toggleModal = () => {
  isShowModal.value = !isShowModal.value;
};

// 检查登录状态
const checkLogin = () => {
  currentUser.value = getUser();
};

const handleLoginSuccess = (user) => {
  currentUser.value = user;
  isShowLoginModal.value = false;
};

const handleLogout = () => {
  clearUser();
  currentUser.value = null;
};

onMounted(() => {
  checkLogin();
});
</script>

<template>
  <div id="app-container">
    <header class="top-nav">
      <!-- logo -->
      <div class="top-nav-logo">
        <img src="./assets/img/SQL_Web_logo.png" alt="SQL_Web" class="logo-img">
        <span class="logo-name">SQL Web</span>
      </div>
      <!-- 导航栏内容 -->
      <div class="top-nav-links">
        <router-link to="/" class="top-nav-link">MySQL学习</router-link>
        <router-link to="/levelpage" class="top-nav-link">MySQL关卡</router-link>
        <router-link to="/playgroundpage" class="top-nav-link">MySQL广场</router-link>
        <!-- 设置MySQL和Git的打开方式为_blank，另外打开一个新界面 -->
        <div class="top-nav-weblink">
          <img src="./assets/img/MySQL_logo.jpg" alt="MySQL官网">
          <a href="https://www.mysql.com/" target="_blank" rel="noopener noreferrer">MySQL</a>
        </div>
        <div class="top-nav-weblink">
          <img src="./assets/img/Github_logo.jpg" alt="GitHub官网">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub开源</a>
        </div>
        <!-- 添加相关资源：点击按钮出现弹窗，上面给出其他网站的跳转按钮 -->
        <div class="top-nav-link" @click="toggleModal" style="cursor: pointer;">相关资源</div>

        <!-- 用户登录/历史记录 -->
        <div v-if="currentUser" class="user-info">
          <router-link to="/history" class="top-nav-link">做题记录</router-link>
          <a-dropdown>
            <a class="user-name">{{ currentUser.username }}</a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="history">
                  <router-link to="/history">做题记录</router-link>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else class="top-nav-link" @click="isShowLoginModal = true" style="cursor: pointer;">
          登录
        </div>

      </div>
    </header>
    <ResourceModal :isVisible="isShowModal" @close="isShowModal = false" />
    <LoginModal :visible="isShowLoginModal" @close="isShowLoginModal = false" @success="handleLoginSuccess" />
    
    <!-- DeepSeek AI 助手悬浮窗 -->
    <DeepSeekPanel :current-level="currentLevel" />
    
    <div class="page-container">
      <main class="main-content">
        <router-view></router-view>
      </main>
      <footer class="footer">
        <div>底部界面</div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 顶部导航栏 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 80px;
  background-color: #2c2c2c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.top-nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.logo-name {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.top-nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.top-nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.top-nav-link:hover {
  background-color: #4a4a4a;
  color: #ffffff;
}

.top-nav-link.router-link-active {
  background-color: #505050;
  color: #ffffff;
}

.top-nav-weblink {
  display: flex;
  align-items: center;
  gap: 6px;
}

.top-nav-weblink img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 4px;
}

.top-nav-weblink a {
  color: #e0e0e0;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.top-nav-weblink a:hover {
  color: #ffffff;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  color: #4ade80;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-name:hover {
  background-color: #4a4a4a;
}

/* 主内容区 */
.mian-content {
  min-height: calc(100vh - 120px);
  padding: 20px;
  background-color: #ffffff;
}

/* 底部页脚 */
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: #2c2c2c;
  color: #a0a0a0;
  font-size: 14px;
  border-top: 1px solid #3a3a3a;
}
</style>
