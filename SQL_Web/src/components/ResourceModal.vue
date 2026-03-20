<!-- 添加相关资源部分的模块组件 -->
 <script setup>

// 接收父组件传递的可见性状态
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  isVisible: Boolean
});

const emit = defineEmits(['close']);

// 资源数据列表 (你可以根据需要修改这里)
const resources = [
  { name: 'W3School SQL', url: 'https://www.w3school.com.cn/sql/index.asp', logo: 'https://www.w3school.com.cn/ui2019/logo_60.png' },
  { name: 'LeetCode 数据库', url: 'https://leetcode.cn/problemset/database/', logo: 'https://leetcode.cn/favicon.ico' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/questions/tagged/sql', logo: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png' },
  { name: 'CSDN 社区', url: 'https://www.csdn.net/', logo: 'https://img-home.csdnimg.cn/images/20201124032511.png' }
];

const close = () => {
  emit('close');
};
</script>
<template>
  <Transition name="fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h3>相关资源</h3>
          <button class="close-btn" @click="close">&times;</button>
        </div>
        
        <div class="resource-grid">
          <a 
            v-for="item in resources" 
            :key="item.name" 
            :href="item.url" 
            target="_blank" 
            class="resource-item"
          >
            <img :src="item.logo" :alt="item.name" class="resource-icon">
            <span class="resource-name">{{ item.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.resource-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s;
}

.resource-item:hover {
  background: #f5f5f5;
}

.resource-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 8px;
}

.resource-name {
  font-size: 14px;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>