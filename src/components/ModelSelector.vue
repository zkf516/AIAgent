<template>
  <div class="model-selector" @click="emit('toggleModelDropdown');console.log('ModelSelector showModelDropdown:', showModelDropdown)" style="position: relative; cursor: pointer;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-openai" viewBox="0 0 16 16">
      <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z"/>
    </svg>
    <span>{{ currentModel }}</span>
    <i class="fas fa-chevron-down" style="margin-left: auto;"></i>
    <div v-if="showModelDropdown" class="model-dropdown" @click.stop>
      <div
        v-for="m in models"
        :key="m.name"
        class="model-dropdown-item model-item-flex"
        :class="{active: m.name === currentModel}"
        @click.stop="emit('selectModel', m.name)"
      >
        <span class="model-logo-box">
          <template v-if="m.icon && (m.icon.endsWith('.svg') || m.icon.endsWith('.png') || m.icon.startsWith('/') || m.icon.startsWith('http'))">
            <img :src="m.icon" alt="logo" class="model-logo-img" />
          </template>
          <template v-else>
            <i :class="m.icon" class="model-logo-icon"></i>
          </template>
        </span>
        <span class="model-name-text">{{ m.name }}</span>
      </div>
      <div class="model-dropdown-item add-model" @click.stop="showAddModelDialog = true">
        <i class="fas fa-plus" style="margin-right:6px;"></i>添加新模型
      </div>
    </div>
    <!-- 添加模型弹窗 -->
    <div v-if="showAddModelDialog" class="add-model-dialog-mask" @click.self="showAddModelDialog = false">
      <div class="add-model-dialog">
        <div class="dialog-title">添加新模型</div>
        <div class="dialog-body">
          <label>模型名称：</label>
          <input v-model="newModelName" placeholder="如 gpt-4" />
          <label style="margin-top:10px;">API地址：</label>
          <input v-model="newModelApi" placeholder="如 https://api.xxx.com" />
        </div>
        <div class="dialog-actions">
          <button @click="onAddModelSave">保存</button>
          <button @click="showAddModelDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const { models, currentModel, showModelDropdown } = defineProps({
  models: Array,
  currentModel: String,
  showModelDropdown: Boolean
})
const emit = defineEmits(['toggleModelDropdown', 'selectModel', 'addModel'])

const showAddModelDialog = ref(false)
const newModelName = ref('')
const newModelApi = ref('')

function onAddModelSave() {
  if (!newModelName.value.trim() || !newModelApi.value.trim()) {
    alert('请填写完整信息')
    return
  }
  // 默认icon
  const newModel = {
    name: newModelName.value.trim(),
    icon: 'bi bi-openai',
    api: newModelApi.value.trim()
  }
  emit('addModel', newModel)
  showAddModelDialog.value = false
  newModelName.value = ''
  newModelApi.value = ''
}
</script>

<style scoped>
.model-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 140px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 100;
  padding: 6px 0;
}

.model-dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
}

.model-dropdown-item:hover,
.model-dropdown-item.active {
  background: #f5f5f5;
}

.model-dropdown-item.add-model {
  color: #007aff;
  font-weight: bold;
  border-top: 1px solid #eee;
  margin-top: 4px;
}

.model-item-flex {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
}
.model-logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.model-logo-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
}
.model-logo-icon {
  font-size: 20px;
}
.model-name-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-model-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.2);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-model-dialog {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 24px 28px 18px 28px;
  min-width: 320px;
  max-width: 90vw;
}
.dialog-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dialog-body input {
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 6px 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  font-size: 15px;
}
.dialog-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>