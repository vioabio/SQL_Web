<script setup>
import { RouterLink, RouterView } from 'vue-router';
import ResourceModal from './components/ResourceModal.vue'
import { ref} from 'vue';

const isShowModal = ref(false);

const toggleModal = () => {
  isShowModal.value = !isShowModal.value;
};
</script>

<template>
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
      <div class="top-nav-weblink">
        <img src="./assets/img/MySQL_logo.jpg" alt="MySQL官网">
        <a href="https://www.mysql.com/">MySQL</a>
      </div>
      <div class="top-nav-weblink">
        <img src="./assets/img/Github_logo.jpg" alt="GitHub官网">
        <a href="https://github.com/">GitHub开源</a>
      </div>
      <!-- 添加相关资源：点击按钮出现弹窗，上面给出其他网站的跳转按钮 -->
      <div class="top-nav-link" @click="toggleModal" style="cursor: pointer;">相关资源</div>
      
    </div>
  </header>
  <ResourceModal :isVisible="isShowModal" @close="isShowModal = false" />
  <main class="mian-content">
    <router-view></router-view>
  </main>
  <footer class="footer">
    <div>底部界面</div>
  </footer>
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