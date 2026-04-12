<!-- 做题历史记录页面 -->
<template>
  <div id="historyPage">
    <div class="page-header">
      <h1 class="page-title">做题记录</h1>
      <div class="header-actions">
        <a-button @click="clearAllHistory" danger>清空记录</a-button>
      </div>
    </div>

    <!-- 统计信息 -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="8">
        <a-statistic
          title="总尝试次数"
          :value="stats.totalAttempts"
          :value-style="{ color: '#1890ff' }"
        />
      </a-col>
      <a-col :xs="8">
        <a-statistic
          title="已通过关卡"
          :value="stats.passedCount"
          :value-style="{ color: '#52c41a' }"
        />
      </a-col>
      <a-col :xs="8">
        <a-statistic
          title="通过率"
          :value="stats.successRate"
          suffix="%"
          :value-style="{ color: '#faad14' }"
        />
      </a-col>
    </a-row>

    <!-- 历史记录列表 -->
    <div class="history-list">
      <a-empty v-if="historyList.length === 0" description="暂无做题记录" />

      <a-timeline v-else>
        <a-timeline-item
          v-for="item in historyList"
          :key="item.id"
          :color="item.status === 'success' ? 'green' : 'gray'"
        >
          <a-card size="small" class="history-card">
            <div class="history-item">
              <div class="history-left">
                <a-tag
                  :color="item.status === 'success' ? 'success' : 'default'"
                >
                  {{ item.status === 'success' ? '通过' : '尝试' }}
                </a-tag>
                <span class="level-title">{{ item.levelTitle }}</span>
              </div>
              <div class="history-time">
                {{ formatTime(item.timestamp) }}
              </div>
            </div>
            <div class="history-sql">
              <div class="sql-label">执行的 SQL：</div>
              <pre class="sql-code">{{ item.sql }}</pre>
            </div>
          </a-card>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getHistory, clearHistory, getUserStats } from '../core/userStore';
import { Modal } from 'ant-design-vue';

const historyList = ref([]);
const stats = computed(() => getUserStats());

const loadHistory = () => {
  historyList.value = getHistory();
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const clearAllHistory = () => {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空所有做题记录吗？此操作不可恢复。',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      clearHistory();
      loadHistory();
    },
  });
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
#historyPage {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.stats-row {
  margin-bottom: 32px;
}

.history-list {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

.history-card {
  width: 100%;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-title {
  font-weight: 600;
  font-size: 16px;
}

.history-time {
  color: #999;
  font-size: 12px;
}

.history-sql {
  margin-top: 8px;
}

.sql-label {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.sql-code {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
