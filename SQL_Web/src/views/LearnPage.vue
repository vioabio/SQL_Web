<!-- 学习页面，显示关卡内容 -->
<template>
  <div id="learnPage">
    <div v-if="currentLevel" class="level-container">
      <!-- 返回按钮 -->
      <div class="page-header">
        <a-button @click="$router.push('/levelpage')" type="text">
          <LeftOutlined /> 返回关卡列表
        </a-button>
        <h1 class="level-title">{{ currentLevel.title }}</h1>
      </div>

      <a-row :gutter="[16, 16]">
        <!-- 左侧：题目描述 -->
        <a-col :md="12" :xs="24">
          <a-card title="题目描述" class="description-card">
            <div class="markdown-content">
              <MdViewer :value="currentLevel.content" />
            </div>
          </a-card>
        </a-col>

        <!-- 右侧：SQL 编辑器 -->
        <a-col :md="12" :xs="24">
          <SqlEditor
            :level="currentLevel"
            :editor-style="{ height: '400px' }"
            :on-submit="onSubmit"
          />
          <a-card title="执行结果" style="margin-top: 16px">
            <SqlResult
              :result="result"
              :answer-result="answerResult"
              :result-status="resultStatus"
              :error-msg="errorMsg"
              :level="currentLevel"
            />
          </a-card>
        </a-col>
      </a-row>

      <!-- 提示信息 -->
      <a-card title="💡 提示" style="margin-top: 16px" v-if="currentLevel.hint">
        <p>{{ currentLevel.hint }}</p>
      </a-card>

      <!-- 答案对比 -->
      <a-card title="参考答案" style="margin-top: 16px" class="answer-card">
        <pre>{{ currentLevel.answer }}</pre>
      </a-card>
    </div>

    <!-- 关卡不存在 -->
    <div v-else class="not-found">
      <a-result
        status="404"
        title="关卡不存在"
        sub-title="抱歉，您访问的关卡不存在或已被删除。"
      >
        <template #extra>
          <a-button type="primary" @click="$router.push('/levelpage')">
            返回关卡列表
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import SqlEditor from "../components/SqlEditor.vue";
import SqlResult from "../components/SqlResult.vue";
import MdViewer from "../components/MdViewer.vue";
import { LeftOutlined } from "@ant-design/icons-vue";
import mainLevels from "../levels/mainLevels";
import customLevels from "../levels/customLevels";
import { addHistory, getUser } from "../core/userStore";
import { RESULT_STATUS_ENUM } from "../core/result";

const route = useRoute();
const result = ref([]);
const answerResult = ref([]);
const errorMsg = ref();
const resultStatus = ref(-1);

// 合并所有关卡
const allLevels = [...mainLevels, ...customLevels];

// 根据 levelKey 获取当前关卡
const currentLevel = computed(() => {
  const levelKey = route.params.levelKey;
  return allLevels.find((level) => level.key === levelKey);
});

/**
 * 执行 SQL 回调
 */
const onSubmit = (sql, res, answerRes, errMsg) => {
  result.value = res;
  answerResult.value = answerRes || [];
  errorMsg.value = errMsg;

  // 使用 checkResult 验证结果
  if (res && res.length > 0 && answerRes && answerRes.length > 0) {
    // 简单比较：列名和数据是否一致
    const isMatch =
      JSON.stringify(res[0]?.columns) === JSON.stringify(answerRes[0]?.columns) &&
      JSON.stringify(res[0]?.values) === JSON.stringify(answerRes[0]?.values);
    resultStatus.value = isMatch ? RESULT_STATUS_ENUM.SUCCEED : RESULT_STATUS_ENUM.ERROR;
  } else if (errMsg) {
    resultStatus.value = 0; // ERROR
  } else {
    resultStatus.value = -1; // DEFAULT
  }

  // 获取当前用户
  const user = getUser();
  if (!user) return;

  // 判断是否通过（结果相同且无错误）
  const isSuccess =
    !errorMsg.value &&
    res &&
    res.length > 0 &&
    answerRes &&
    JSON.stringify(res) === JSON.stringify(answerRes);

  // 保存做题记录
  addHistory({
    username: user.username,
    levelKey: currentLevel.value.key,
    levelTitle: currentLevel.value.title,
    sql,
    status: isSuccess ? "success" : "failed",
    errorMsg: errorMsg.value || null,
  });

  if (isSuccess) {
    console.log("恭喜通过！");
  }
};
</script>

<style scoped>
#learnPage {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

.level-container {
  width: 100%;
}

.page-header {
  margin-bottom: 16px;
}

.level-title {
  font-size: 24px;
  font-weight: bold;
  margin: 8px 0 0 0;
  color: #1f2937;
}

.description-card {
  height: 100%;
}

.markdown-content {
  max-height: 60vh;
  overflow-y: auto;
}

.answer-card pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}

.not-found {
  text-align: center;
  padding: 100px 0;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .level-title {
    color: #f9fafb;
  }

  .answer-card pre {
    background: #2d2d2d;
    color: #e0e0e0;
  }
}
</style>
