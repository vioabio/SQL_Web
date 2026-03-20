<!-- SQL执行 -->
<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  toRefs,
  watchEffect,
} from "vue";
import * as monaco from "monaco-editor";
import { format } from "sql-formatter";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { initDB, runSQL } from "../core/sqlExecutor";
import { message } from "ant-design-vue";

(self.MonacoEnvironment = {
  // eslint-disable-next-line no-unused-vars
  getWorker(_, label) {
    return new EditorWorker();
  },
});

const props = defineProps({
  level: {
    type: Object,
    required: true
  },
  editorStyle: {
    type: Object,
    default: () => ({})
  },
  resultStatus: {
    type: Number,
    default: 0
  },
  onSubmit: {
    type: Function,
    default: null
  }
});

const { level, onSubmit } = toRefs(props);
const inputEditor = ref();
const editorRef = ref();
const db = ref();

watchEffect(async () => {
  // 初始化 / 更新默认 SQL
  if (inputEditor.value) {
    toRaw(inputEditor.value).setValue(
      "-- 请在此处输入 SQL\n" + level.value.defaultSQL
    );
  }
  // 初始化 / 更新 DB
  db.value = await initDB(level.value.initSQL);
  doSubmit();
});

/**
 * SQL 格式化
 */
const doFormat = () => {
  if (!inputEditor.value) {
    return;
  }
  const inputStr = toRaw(inputEditor.value).getValue();
  // https://www.npmjs.com/package/sql-formatter
  const resultStr = format(inputStr, { language: "sqlite" });
  toRaw(inputEditor.value).setValue(resultStr);
};

/**
 * 重置
 */
const doReset = () => {
  if (inputEditor.value) {
    toRaw(inputEditor.value).setValue(level.value.defaultSQL);
    doSubmit();
  }
};

/**
 * 提交结果
 */
const doSubmit = () => {
  if (!inputEditor.value) {
    return;
  }
  const inputStr = toRaw(inputEditor.value).getValue();
  console.log("inputStr", inputStr);
  try {
    const result = runSQL(db.value, inputStr);
    const answerResult = runSQL(db.value, level.value.answer);
    // 向外层传递结果
    onSubmit.value(inputStr, result, answerResult);
  } catch (error) {
    message.error("语句错误，" + error.message);
    // 向外层传递结果
    onSubmit.value(inputStr, [], [], error.message);
  }
};

onMounted(async () => {
  // 初始化代码编辑器
  if (editorRef.value) {
    const initValue = "";
    inputEditor.value = monaco.editor.create(editorRef.value, {
      value: initValue,
      language: "sql",
      theme: "vs-dark",
      formatOnPaste: true,
      automaticLayout: true,
      fontSize: 16,
      minimap: {
        enabled: false,
      },
    });
    // 自动保存草稿
    // 暂不开启，刷新后恢复当前关卡的默认 SQL
    // setInterval(() => {
    //   if (inputEditor.value) {
    //     localStorage.setItem("draft", toRaw(inputEditor.value).getValue());
    //   }
    // }, 3000);
  }
});

/**
 * 释放资源
 */
onUnmounted(() => {
  if (inputEditor.value) {
    toRaw(inputEditor.value).dispose();
  }
});
</script>

<template>
  <div id="sqlEditor">
    <div ref="editorRef" :style="editorStyle" />
    <a-space :size="16" style="margin-top: 16px">
      <a-button type="primary" style="width: 180px" @click="doSubmit">
        运行
      </a-button>
      <a-button @click="doFormat">格式化</a-button>
      <a-button @click="doReset">重置</a-button>
    </a-space>
  </div>
</template>

<style></style>
