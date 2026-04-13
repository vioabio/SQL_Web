<!-- SQL执行 -->
<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  toRefs,
  watch,
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
const isDbReady = ref(false);

// 监听 level 变化，初始化数据库
watch(
  () => props.level,
  async (newLevel) => {
    if (newLevel && newLevel.initSQL) {
      try {
        db.value = await initDB(newLevel.initSQL);
        isDbReady.value = true;
        
        // 更新编辑器内容
        if (inputEditor.value) {
          toRaw(inputEditor.value).setValue(
            "-- 请在此处输入 SQL\n" + (newLevel.defaultSQL || '')
          );
        }
        
        // 数据库初始化完成后执行默认 SQL
        doSubmit();
      } catch (e) {
        console.error('数据库初始化失败:', e);
        message.error('数据库初始化失败');
      }
    }
  },
  { immediate: true }
);

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
  if (inputEditor.value && level.value) {
    toRaw(inputEditor.value).setValue(level.value.defaultSQL || '');
    doSubmit();
  }
};

/**
 * 提交结果
 */
const doSubmit = () => {
  if (!inputEditor.value || !db.value) {
    console.log("编辑器或数据库未初始化");
    return;
  }
  const inputStr = toRaw(inputEditor.value).getValue();
  console.log("inputStr", inputStr);
  try {
    console.log("开始执行用户SQL...");
    const result = runSQL(db.value, inputStr);
    console.log("用户执行结果:", JSON.stringify(result));
    
    console.log("开始执行答案SQL...");
    console.log("答案SQL内容:", level.value?.answer);
    console.log("level对象:", level.value);
    let answerResult;
    try {
      if (!level.value?.answer) {
        console.error("答案SQL为空!");
        answerResult = [];
      } else {
        answerResult = runSQL(db.value, level.value.answer);
        console.log("答案执行结果:", JSON.stringify(answerResult));
      }
    } catch (e) {
      console.error("答案执行失败:", e.message);
      console.error("答案SQL:", level.value?.answer);
      answerResult = [];
    }
    
    // 向外层传递结果
    console.log("传递结果到外层...");
    onSubmit.value(inputStr, result, answerResult);
  } catch (error) {
    console.error("执行出错:", error);
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
