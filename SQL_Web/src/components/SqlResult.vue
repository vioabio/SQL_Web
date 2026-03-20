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
const { result } = toRefs(props);
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
  </a-card>
</template>

<style></style>
