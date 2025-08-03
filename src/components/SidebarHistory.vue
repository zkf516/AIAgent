<template>
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
</template>

<script setup>
const props = defineProps({
  conversations: Array,
  activeConvId: Number
})
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
</style>
