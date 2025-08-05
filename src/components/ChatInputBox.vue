<template>
  <div class="input-box input-box-vertical">
    <div class="input-tools input-tools-row">
      <div class="input-tool"><i class="fas fa-plus"></i></div>
      <div class="input-tool"><i class="fas fa-image"></i></div>
      <div class="input-tool"><i class="fas fa-file-upload"></i></div>
      <div class="input-tool" :class="{ recording: recognizing }" @click="startVoiceInput" title="语音输入"><i class="fas fa-microphone"></i></div>
    </div>
    <div class="input-bottom-row">
      <textarea
        :value="input"
        ref="inputRef"
        placeholder="输入消息..."
        rows="1"
        @input="onInput"
        @keydown.enter.exact.prevent="send"
        @keydown.enter.shift="insertNewline"
      ></textarea>
      <button class="send-btn" @click="send">
        <template v-if="!recognizing">
          <i class="fas fa-paper-plane"></i>
        </template>
        <template v-else>
          <span class="voice-ellipsis">
            <span class="voice-dot"></span>
            <span class="voice-dot"></span>
            <span class="voice-dot"></span>
          </span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, defineProps, defineEmits } from 'vue'

const props = defineProps({
  input: String,
  recognizing: Boolean
})
const emits = defineEmits(['update:input', 'send', 'startVoiceInput'])
const inputRef = ref(null)

function autoResize() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = inputRef.value.scrollHeight + 'px'
  }
}

function onInput(e) {
  autoResize()
  emits('update:input', e.target.value)
}
function send() {
  emits('send')
}
function insertNewline(e) {
  e.preventDefault();
  if (inputRef.value) {
    const el = inputRef.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    emits('update:input', props.input.slice(0, start) + '\n' + props.input.slice(end));
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + 1;
    });
  }
}
function startVoiceInput() {
  emits('startVoiceInput')
}
</script>

<style scoped>
/* 输入区上下结构样式 */
.input-box-vertical {
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  max-width: 720px;
  width: 100%;
}
.input-tools-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-right: 0;
  height: 32px;
  padding-bottom: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}
.input-bottom-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.input-bottom-row textarea {
  margin: 0;
}

/* 语音识别按钮样式 */
.send-btn {
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 语音识别动画 */
.voice-ellipsis {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0;
}
.voice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  display: inline-block;
  animation: ellipsis-bounce 1.2s infinite;
}
.voice-dot:nth-child(1) { animation-delay: 0s; }
.voice-dot:nth-child(2) { animation-delay: 0.2s; }
.voice-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes ellipsis-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 1; }
  40% { transform: translateY(-6px); opacity: 0.7; }
}

/* 语音录入高亮动画 */
.input-tool.recording {
  color: var(--primary);
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% { filter: drop-shadow(0 0 0 var(--primary)); }
  50% { filter: drop-shadow(0 0 8px var(--primary)); }
  100% { filter: drop-shadow(0 0 0 var(--primary)); }
}
</style>
