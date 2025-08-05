<template>
  <!-- 只保留一份sidebar结构，彻底去重 -->
  <div :class="['sidebar-outer', { collapsed: collapsedSidebar }]">
    <div
      :class="['sidebar-abs', { collapsed: !showSidebar }]"
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
import { ref, nextTick } from 'vue'
const props = defineProps({
  conversations: Array,
  activeConvId: Number,
  showSidebar: Boolean,
  collapsedSidebar: Boolean
})
const emits = defineEmits(['update:showSidebar', 'update:collapsedSidebar'])
const sidebarAbsRef = ref(null)

function onSidebarAbsTransitionEnd(e) {
  if (e.propertyName === 'opacity' && !props.showSidebar) {
    emits('update:collapsedSidebar', true)
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
