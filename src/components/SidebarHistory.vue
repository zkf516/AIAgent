<template>
  <div :class="['sidebar-outer', { collapsed: isSidebarCollapsed }]">
    <div
      :class="['sidebar-abs', { collapsed: !isContentVisible }]"
      ref="sidebarAbsRef"
      @transitionend="onSidebarAbsTransitionEnd"
    >
      <div class="sidebar sidebar-flex">
        <div>
          <div class="logo">
            <div class="logo-icon">
              <i class="fas fa-brain"></i>
            </div>
            <div class="logo-text">智灵联动</div>
          </div>
          <button class="new-chat-btn full-width" @click="$emit('add-conversation')">
            <i class="fas fa-plus"></i>
            <span>新对话</span>
          </button>
          <div class="history-title">最近对话</div>
          <div class="history-list">
            <div v-for="conv in conversations" :key="conv.id" :class="['history-item', {active: conv.id===activeConvId}]" @click="$emit('select-conversation', conv.id)">
              <i class="fas fa-comment"></i>
              <span class="history-text">{{ conv.title }}</span>
            </div>
          </div>
        </div>
        <div class="bottom-menu">
          <div class="menu-item">
            <i class="fas fa-cog"></i>
            <span class="menu-text">设置</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-lightbulb"></i>
            <span class="menu-text">功能</span>
          </div>
          <div class="menu-item" @click="$emit('go-user-info')">
            <i class="fas fa-user"></i>
            <span class="menu-text">账户</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
const props = defineProps({
  conversations: Array,
  activeConvId: Number,
  showSidebar: Boolean
})
const emits = defineEmits(['add-conversation', 'select-conversation', 'go-user-info'])
const sidebarAbsRef = ref(null)
// 内部动画状态
const isContentVisible = ref(false) // 控制内容淡入淡出
const isSidebarCollapsed = ref(true) // 控制宽度收缩

// 监听外部showSidebar变化，驱动动画
watch(() => props.showSidebar, (val) => {
  if (val) {
    // 展开：先展开宽度，再淡入内容
    isSidebarCollapsed.value = false
    nextTick(() => {
      isContentVisible.value = true
    })
  } else {
    // 收起：先淡出内容，动画结束后再收缩宽度
    isContentVisible.value = false
  }
})

function onSidebarAbsTransitionEnd(e) {
  // 内容淡出动画结束后收缩宽度
  if (e.propertyName === 'opacity' && !isContentVisible.value) {
    isSidebarCollapsed.value = true
  }
}
</script>

<style scoped>
.sidebar-flex {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bottom-menu {
  margin-top: auto;
}
.full-width {
  width: 100%;
  box-sizing: border-box;
}
/* sidebar 容器和动画样式 */
.sidebar-outer {
  width: 260px;
  min-width: 0;
  max-width: 260px;
  transition: width 0.3s cubic-bezier(.55,0,.1,1), margin-right 0.3s cubic-bezier(.55,0,.1,1);
  overflow: visible;
  will-change: width, margin-right;
  position: relative;
  flex-shrink: 0;
  margin-right: 15px;
  opacity: 1;
}
.sidebar-outer.collapsed {
  width: 0;
  min-width: 0;
  max-width: 0;
  padding: 0;
  margin-right: 0;
  pointer-events: none;
}
.sidebar-abs {
  position: absolute;
  left: 0;
  top: 0;
  width: 260px;
  height: 100%;
  transition: opacity 0.3s cubic-bezier(.55,0,.1,1);
  display: flex;
  flex-direction: column;
  opacity: 1;
  pointer-events: auto;
}
.sidebar-abs.collapsed {
  opacity: 0;
  pointer-events: none;
}
</style>
