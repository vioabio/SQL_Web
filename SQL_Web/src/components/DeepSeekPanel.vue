<!-- AI 助手悬浮窗 -->
<template>
  <div class="deepseek-container">
    <!-- 悬浮球（待机状态显示一半） -->
    <div
      class="floating-ball"
      :class="{ expanded: isExpanded }"
      @click="toggleExpand"
    >
      <div class="ball-content">
        <video
          class="ball-icon-video"
          src="../assets/video/miku_1.mp4"
          autoplay
          loop
          muted
          playsinline
        ></video>
        <span v-if="isExpanded" class="ball-close">×</span>
      </div>
      <!-- 未展开时的提示 -->
      <div v-if="!isExpanded" class="ball-hint">
        <span>AI助手</span>
      </div>
    </div>

    <!-- API Key 设置弹窗 -->
    <a-modal
      v-model:open="settingsModalVisible"
      title="API Key 设置"
      :footer="null"
      :width="400"
      @cancel="settingsModalVisible = false"
    >
      <div class="settings-content">
        <a-alert
          :message="apiKey ? '已配置 API Key' : '未配置 API Key'"
          :description="apiKey ? '点击下方可修改或清除' : 'DeepSeek API Key 用于调用 AI 服务'"
          :type="apiKey ? 'success' : 'warning'"
          show-icon
          style="margin-bottom: 16px"
        />
        <a-input-password
          v-model:value="inputApiKey"
          placeholder="sk-xxxxxxxxxxxx"
          size="large"
        >
          <template #prefix>
            <span style="color: #999">🔑</span>
          </template>
        </a-input-password>
        <div class="settings-actions">
          <a-button @click="clearApiKey">清除 Key</a-button>
          <a-space>
            <a-button @click="settingsModalVisible = false">取消</a-button>
            <a-button
              type="primary"
              @click="saveApiKeyFn"
              :disabled="!inputApiKey.trim()"
            >
              保存
            </a-button>
          </a-space>
        </div>
        <div class="help-text">
          <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer">
            获取 API Key →
          </a>
        </div>
      </div>
    </a-modal>

    <!-- 对话窗口（点击展开后显示） -->
    <Transition name="panel">
      <div v-if="isExpanded" class="chat-panel" @click.stop>
        <!-- 头部 -->
        <div class="panel-header">
          <div class="header-left">
            <video
              class="header-icon-video"
              src="../assets/video/miku_1.mp4"
              autoplay
              loop
              muted
              playsinline
            ></video>
            <span class="header-title">AI 助手</span>
          </div>
          <div class="header-actions">
            <a-button
              type="text"
              size="small"
              @click="showSettingsModal"
              :title="apiKey ? '修改 API Key' : '设置 API Key'"
              :class="{ 'key-set': apiKey }"
            >
              🔑
            </a-button>
            <a-button
              type="text"
              size="small"
              @click="clearChat"
              title="清空对话"
            >
              🗑️
            </a-button>
            <a-button
              type="text"
              size="small"
              @click="toggleExpand"
              title="收起"
            >
              −
            </a-button>
          </div>
        </div>

        <!-- 状态栏 -->
        <div class="status-bar">
          <div class="status-indicator" :class="apiKey ? 'online' : 'offline'">
            <span class="status-dot"></span>
            <span class="status-text">{{ apiKey ? '已配置 API Key' : '需要配置 API Key' }}</span>
          </div>
          <a-tag color="blue" size="small">
            云端
          </a-tag>
        </div>

        <!-- DeepSeek 配置区 -->
        <div v-if="!apiKey" class="api-key-section">
          <a-alert
            message="需要 DeepSeek API Key"
            description="输入您的 API Key 以使用 AI 助手功能"
            type="warning"
            show-icon
          />
          <a-input-password
            v-model:value="inputApiKey"
            placeholder="sk-xxxxxxxxxxxx"
            size="large"
            style="margin-top: 12px"
          >
            <template #prefix>
              <span style="color: #999">🔑</span>
            </template>
          </a-input-password>
          <a-button
            type="primary"
            block
            style="margin-top: 8px"
            @click="saveApiKeyFn"
            :disabled="!inputApiKey.trim()"
          >
            保存并开始对话
          </a-button>
          <div class="help-text">
            <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer">
              获取 API Key →
            </a>
          </div>
        </div>

        <!-- 消息列表 -->
        <div v-else ref="messagesContainer" class="messages-container">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <video
              class="welcome-icon-video"
              src="../assets/video/miku_1.mp4"
              autoplay
              loop
              muted
              playsinline
            ></video>
            <h3>你好！我是 AI 助手</h3>
            <p class="provider-info">DeepSeek · 云端服务</p>
            <p>我可以帮助你：</p>
            <ul>
              <li>解答 SQL 相关问题</li>
              <li>解释 SQL 语法和函数</li>
              <li>提供解题思路和提示</li>
              <li>优化你的 SQL 查询</li>
            </ul>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
          >
            <div class="message-avatar">
              <img v-if="msg.role === 'user'" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMTFhNS41IDUuNSAwIDAgMS01LjUgNS41IDUuNSA1LjUgMCAwIDEgNS41LTUuNXptLTYgN2EuMy4zIDAgMCAwIC4zLS4zIDMuMyAzLjMgMCAwIDAgLS4zLS4zIDMuMyAzLjMgMCAwIDAgLjMgLjN6bTE1LjUtNS41YTMuMyAzLjMgMCAwIDAtMy4zLTMuMyAzLjMgMy4zIDAgMCAwIDMuMyAzLjN6bS04IDFhMyAzIDAgMSAwIDAtNiAzIDMgMyAwIDAgMCAwIDZ6Ii8+PC9zdmc+" alt="user" />
              <video
                v-else
                class="avatar-video"
                src="../assets/video/miku_1.mp4"
                autoplay
                loop
                muted
                playsinline
              ></video>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(msg.content)"></div>
              <!-- 打字光标 -->
              <span
                v-if="msg.role === 'assistant' && msg.isStreaming"
                class="typing-cursor"
              >|</span>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-if="isLoading" class="message assistant loading">
            <div class="message-avatar">
              <video
                class="avatar-video"
                src="../assets/video/miku_1.mp4"
                autoplay
                loop
                muted
                playsinline
              ></video>
            </div>
            <div class="message-content">
              <div class="thinking">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-section">
          <div class="input-wrapper">
            <a-input
              v-model:value="inputMessage"
              placeholder="输入 SQL 问题..."
              @pressEnter="sendMessage"
              :disabled="isLoading || !apiKey"
              :bordered="false"
            />
            <a-button
              type="primary"
              shape="circle"
              @click="sendMessage"
              :loading="isLoading"
              :disabled="!inputMessage.trim() || !apiKey"
            >
              <template #icon>
                <span v-if="!isLoading">➤</span>
              </template>
            </a-button>
          </div>
          <div class="input-hint">
            <span v-if="currentLevel">
              当前题目：<a-tag color="blue">{{ currentLevel.title }}</a-tag>
            </span>
            <span v-else style="color: #999">未在题目页面</span>
            <a-switch
              v-model:checked="autoContext"
              size="small"
              style="margin-left: 8px"
            />
            <span style="margin-left: 4px; font-size: 12px">自动附带上下文</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { streamChat, buildContextPrompt, saveApiKey as saveApiKeyToStorage, getApiKey } from '../utils/aiClient';

const props = defineProps({
  currentLevel: {
    type: Object,
    default: null,
  },
});

// 状态
const isExpanded = ref(false);
const apiKey = ref(getApiKey());
const inputApiKey = ref('');
const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const autoContext = ref(true);
const messagesContainer = ref(null);
const settingsModalVisible = ref(false);

// 显示设置弹窗
const showSettingsModal = () => {
  inputApiKey.value = apiKey.value;
  settingsModalVisible.value = true;
};

// 清除对话
const clearChat = () => {
  messages.value = [];
};

// 保存 API Key
const saveApiKeyFn = () => {
  if (inputApiKey.value.trim()) {
    apiKey.value = inputApiKey.value.trim();
    saveApiKeyToStorage(apiKey.value);
    settingsModalVisible.value = false;
  }
};

// 清除 API Key
const clearApiKey = () => {
  apiKey.value = '';
  inputApiKey.value = '';
  saveApiKeyToStorage('');
  settingsModalVisible.value = false;
};

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value || !apiKey.value) {
    return;
  }

  const userMessage = inputMessage.value.trim();
  inputMessage.value = '';

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now(),
  });

  // 添加助手消息占位
  messages.value.push({
    role: 'assistant',
    content: '',
    isStreaming: true,
    timestamp: Date.now(),
  });

  isLoading.value = true;
  await scrollToBottom();

  // 构建消息历史
  const historyMessages = messages.value.slice(0, -1).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // 添加上下文
  if (autoContext.value && props.currentLevel) {
    const contextMessage = buildContextPrompt(userMessage, props.currentLevel);
    historyMessages[historyMessages.length - 1] = {
      role: 'user',
      content: contextMessage,
    };
  }

  try {
    await streamChat({
      messages: historyMessages,
      apiKey: apiKey.value,
      onChunk: (chunk, full) => {
        messages.value[messages.value.length - 1].content = full;
        scrollToBottom();
      },
      onComplete: () => {
        messages.value[messages.value.length - 1].isStreaming = false;
        isLoading.value = false;
      },
      onError: (error) => {
        messages.value[messages.value.length - 1].content =
          '抱歉，发生了错误：' + error.message;
        messages.value[messages.value.length - 1].isStreaming = false;
        isLoading.value = false;
      },
    });
  } catch (error) {
    messages.value[messages.value.length - 1].content =
      '抱歉，发生了错误：' + error.message;
    messages.value[messages.value.length - 1].isStreaming = false;
    isLoading.value = false;
  }
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 格式化消息
const formatMessage = (content) => {
  if (!content) return '';
  let formatted = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  formatted = formatted.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    '<pre class="code-block"><code>$2</code></pre>'
  );

  formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
};

// ESC 键关闭
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isExpanded.value) {
    toggleExpand();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
/* 容器定位 */
.deepseek-container {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
}

/* ========== 悬浮球 ========== */
.floating-ball {
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  border-radius: 50% 0 0 50%;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
}

.floating-ball:hover {
  width: 100px;
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.5);
}

.floating-ball.expanded {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(10px);
}

.ball-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.ball-icon {
  font-size: 60px;
}

/* 悬浮球视频 */
.ball-icon-video {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

/* 头部视频 */
.header-icon-video {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* 欢迎消息视频 */
.welcome-icon-video {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}

/* 消息头像视频 */
.avatar-video {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.ball-close {
  font-size: 20px;
  color: white;
  font-weight: bold;
}

.ball-hint {
  position: absolute;
  left: -80px;
  background: white;
  padding: 4px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.floating-ball:not(.expanded):hover .ball-hint {
  opacity: 1;
  transform: translateX(0);
}

/* ========== 对话窗口 ========== */
.chat-panel {
  position: relative;
  width: 380px;
  height: 560px;
  background: white;
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 20px;
}

.header-title {
  font-weight: 600;
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-actions :deep(.ant-btn) {
  color: white;
}

.header-actions :deep(.ant-btn:hover) {
  background: rgba(255, 255, 255, 0.2);
}

.header-actions :deep(.key-set) {
  color: #52c41a;
}

/* 状态栏 */
.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
}

.status-indicator.online .status-dot {
  background: #52c41a;
}

.status-indicator.offline .status-dot {
  background: #ff4d4f;
}

/* API Key 配置区 */
.api-key-section {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.help-text {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  overscroll-behavior: contain;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-message h3 {
  margin: 0 0 8px;
  color: #333;
}

.provider-info {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.welcome-message p {
  margin: 8px 0;
  font-size: 14px;
}

.welcome-message ul {
  text-align: left;
  padding-left: 24px;
  margin-top: 16px;
}

.welcome-message li {
  margin: 8px 0;
  font-size: 13px;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #e6f7ff;
}

.message.assistant .message-avatar {
  background: #f6ffed;
}

.message-content {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 12px;
  line-height: 1.6;
  font-size: 14px;
}

.message.user .message-content {
  background: #1890ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: #f5f5f5;
  color: #333;
  border-bottom-left-radius: 4px;
}

/* 代码块 */
.message-content :deep(.code-block) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 8px;
  margin: 8px 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.message-content :deep(.inline-code) {
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.message.user .message-content :deep(.inline-code) {
  background: rgba(255, 255, 255, 0.2);
}

/* 打字光标 */
.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: #1890ff;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 加载动画 */
.message.loading .message-content {
  padding: 16px;
}

.thinking {
  display: flex;
  gap: 6px;
}

.thinking .dot {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.thinking .dot:nth-child(1) { animation-delay: -0.32s; }
.thinking .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 输入区域 */
.input-section {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
}

.input-wrapper :deep(.ant-input) {
  background: transparent;
  font-size: 14px;
}

.input-hint {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .chat-panel { background: #1f1f1f; }
  .messages-container { background: #1f1f1f; }
  .message.assistant .message-content { background: #2d2d2d; color: #e0e0e0; }
  .welcome-message { color: #999; }
  .welcome-message h3 { color: #e0e0e0; }
  .input-section { background: #1f1f1f; border-color: #333; }
  .input-wrapper { background: #2d2d2d; }
  .input-wrapper :deep(.ant-input) { color: #e0e0e0; }
  .ball-hint { background: #2d2d2d; color: #e0e0e0; }
  .status-bar { background: #2d2d2d; border-color: #333; }
  .messages-container::-webkit-scrollbar-thumb { background: #555; }
}
</style>
