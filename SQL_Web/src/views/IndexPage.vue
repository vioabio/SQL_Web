<!-- 默认的学习界面，包含左侧题干内容和右侧答题区 -->
<template>
  <div id="indexPage">
    <a-row :gutter="[16, 16]">
      <a-col :lg="11" :xs="24">
        <question-board :level="level" :result-status="resultStatus" />
      </a-col>
      <a-col :lg="13" :xs="24">
        <sql-editor
          :level="level"
          :editor-style="{ height: '280px' }"
          :result-status="resultStatus"
          :on-submit="onSubmit"
        />
        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <a-collapse v-model:active-key="activeKeys" style="margin-top: 16px">
          <a-collapse-panel
            key="result"
            header="查看执行结果"
            class="result-collapse-panel"
          >
            <sql-result
              :level="level"
              :result="result"
              :result-status="resultStatus"
              :answer-result="answerResult"
              :error-msg="errorMsgRef"
              style="margin-top: 16px"
            />
          </a-collapse-panel>
          <a-collapse-panel v-if="level.hint" key="hint" header="查看提示">
            <p>{{ level.hint }}</p>
          </a-collapse-panel>
          <a-collapse-panel key="ddl" header="查看建表语句">
            <code-editor
              :init-value="level.initSQL"
              :editor-style="{ minHeight: '400px' }"
              read-only
            />
          </a-collapse-panel>
          <a-collapse-panel key="answer" header="查看答案">
            <code-editor
              :init-value="level.answer"
              :editor-style="{ minHeight: '400px' }"
              read-only
            />
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import hljs from 'highlight.js';
// eslint-disable-next-line no-unused-vars
import { format } from "sql-formatter";
import SqlEditor from "../components/SqlEditor.vue";
import QuestionBoard from "../components/QuestionBoard.vue";
import SqlResult from "../components/SqlResult.vue";
import { computed, ref, watch } from "vue";
import { allLevels, getLevelByKey } from "../levels";
import { checkResult } from "../core/result";
import CodeEditor from "../components/CodeEditor.vue";

const props = defineProps({
  levelKey: {
    type: String,
    default: undefined
  }
});

const level = computed(() => {
  if (props.levelKey) {
    return getLevelByKey(props.levelKey);
  }
  return allLevels[0];
});

const result = ref([]);
const answerResult = ref([]);
const errorMsgRef = ref();
const resultStatus = ref(-1);
const defaultActiveKeys = ["result"];
const activeKeys = ref([...defaultActiveKeys]);

/**
 * 切换关卡时，重置状态
 */
watch([level], () => {
  activeKeys.value = [...defaultActiveKeys];
});

/**
 * 执行结果
 * @param {string} sql
 * @param {Array} res
 * @param {Array} answerRes
 * @param {string} errorMsg
 */
const onSubmit = (sql, res, answerRes, errorMsg) => {
  console.log('IndexPage onSubmit 收到:', {
    sqlLength: sql?.length,
    res: JSON.stringify(res)?.substring(0, 100),
    answerRes: JSON.stringify(answerRes)?.substring(0, 100),
    errorMsg
  });
  result.value = res;
  answerResult.value = answerRes;
  errorMsgRef.value = errorMsg;
  resultStatus.value = checkResult(res, answerRes);
  console.log('IndexPage onSubmit 后状态:', {
    result: JSON.stringify(result.value)?.substring(0, 100),
    answerResult: JSON.stringify(answerResult.value)?.substring(0, 100),
    resultStatus: resultStatus.value
  });
};

// eslint-disable-next-line no-unused-vars
const highlightCode = (code) => {
  return hljs.highlightAuto(code).value;
};

</script>

<style>
.result-collapse-panel .ant-collapse-content-box {
  padding: 0 !important;
}
</style>
