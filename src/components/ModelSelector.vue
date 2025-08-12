<template>
  <div class="model-selector" @click="emit('toggleModelDropdown');console.log('ModelSelector showModelDropdown:', showModelDropdown)" style="position: relative; cursor: pointer;">
    <span class="model-logo-box">
      <template v-if="currentModelObj && currentModelObj.icon && (currentModelObj.icon.endsWith('.svg') || currentModelObj.icon.endsWith('.png') || currentModelObj.icon.startsWith('/') || currentModelObj.icon.startsWith('http'))">
        <img :src="currentModelObj.icon" alt="logo" class="model-logo-img" />
      </template>
      <template v-else>
        <i :class="currentModelObj?.icon || 'bi bi-openai'" class="model-logo-icon"></i>
      </template>
    </span>
    <span class="model-text">{{ currentModel }}</span>
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
import { ref, computed } from 'vue'
const currentModelObj = computed(() => models.find(m => m.name === currentModel))
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

.model-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>