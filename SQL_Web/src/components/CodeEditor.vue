<template>
  <div class="code-editor">
    <div ref="editorRef" :style="editorStyle" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, toRaw, watch } from "vue";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

(self.MonacoEnvironment = {
  // eslint-disable-next-line no-unused-vars
  getWorker(_, label) {
    return new EditorWorker();
  },
});

const props = defineProps({
  initValue: {
    type: String,
    default: ""
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  editorStyle: {
    type: Object,
    default: undefined
  }
});

const inputEditor = ref();
const editorRef = ref();

onMounted(async () => {
  // 初始化代码编辑器
  if (editorRef.value) {
    inputEditor.value = monaco.editor.create(editorRef.value, {
      value: props.initValue,
      language: "sql",
      theme: "vs-dark",
      readOnly: props.readOnly,
      formatOnPaste: true,
      automaticLayout: true,
      fontSize: 15,
      minimap: {
        enabled: false,
      },
    });
  }
});

watch(
  () => props.initValue,
  () => {
    if (editorRef.value && inputEditor.value) {
      toRaw(inputEditor.value).setValue(props.initValue);
    }
  }
);

onUnmounted(() => {
  if (inputEditor.value) {
    toRaw(inputEditor.value).dispose();
  }
});
</script>

<style></style>
