<!-- 展示执行结果 -->
<script setup>
import { toRefs } from "vue";
import SqlResultTable from "./SqlResultTable.vue";
import { RESULT_STATUS_INFO_MAP } from "../core/result";

const props = defineProps({
  result: {
    type: Array,
    default: () => []
  },
  answerResult: {
    type: Array,
    default: () => []
  },
  resultStatus: {
    type: Number,
    default: 0
  },
  errorMsg: {
    type: String,
    default: ""
  },
  level: {
    type: Object,
    default: null
  }
});

// e.g. [{"columns":["a","b"],"values":[[0,"hello"],[1,"world"]]}]
const { result, answerResult, level, resultStatus } = toRefs(props);

console.log('SqlResult 收到 props:', {
  result: JSON.stringify(result.value)?.substring(0, 100),
  answerResult: JSON.stringify(answerResult.value)?.substring(0, 100),
  resultStatus: resultStatus.value,
  level: level.value?.key
});
</script>

<template>
  <a-card
    id="sqlResult"
    title="执行结果"
    :extra="RESULT_STATUS_INFO_MAP[resultStatus]"
    :bordered="false"
    style="max-height: 420px; overflow-y: auto"
  >
    <sql-result-table v-if="!errorMsg" :result="result" />
    <div v-else>❌ 语句错误：{{ errorMsg }}</div>
    
    <!-- 调试信息 -->
    <a-divider />
    <details>
      <summary>调试信息（点击展开）</summary>
      <div style="font-size: 12px; color: #666;">
        <p><strong>用户结果列名:</strong> {{ result?.[0]?.columns?.join(', ') || '无' }}</p>
        <p><strong>答案结果列名:</strong> {{ answerResult?.[0]?.columns?.join(', ') || '无' }}</p>
        <p><strong>用户结果行数:</strong> {{ result?.[0]?.values?.length || 0 }}</p>
        <p><strong>答案结果行数:</strong> {{ answerResult?.[0]?.values?.length || 0 }}</p>
        <p><strong>答案SQL:</strong> {{ level?.answer ? level.answer.substring(0, 100) : '无' }}...</p>
      </div>
    </details>
  </a-card>
</template>

<style></style>
