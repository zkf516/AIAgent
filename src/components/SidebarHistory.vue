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
          <div class="menu-item" @click="$emit('go-user-info')">
            <i class="fas fa-user"></i>
            <span class="menu-text">账户</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-cog"></i>
            <span class="menu-text">设置</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-ellipsis-h"></i>
            <span class="menu-text">更多</span>
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
/* 历史记录侧边栏：div */
.sidebar {
    width: 260px;
    background: var(--card-bg);
    border-radius: 18px;
    box-shadow: 0 5px 20px var(--shadow);
    padding: 20px 15px;
    display: flex;
    flex-direction: column;
    z-index: 10;
    margin-right: 15px;
    border: 1px solid var(--border);
}

.sidebar-flex {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部logo样式 */
.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 10px 20px;
    border-bottom: 1px solid var(--border);
}


.logo-icon {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.logo-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
}

/* SkyAI 新UI 全量CSS粘贴 */
.logo-text span {
    color: var(--primary);
}


/* 新对话按钮 */
.new-chat-btn {
    background: linear-gradient(90deg, var(--primary), #5a7dff);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 15px;
    margin: 25px 0;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.new-chat-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px var(--shadow);
}

.full-width {
  width: 100%;
  box-sizing: border-box;
}


/* 历史对话 */
.history-title {
    font-size: 14px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 15px 0 10px 10px;
}

.history-list {
    overflow-y: auto;
    flex: 1;
    max-height: 55vh;
}

.history-item {
    padding: 12px 15px;
    border-radius: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    font-size: 14px;
    color: var(--text);
}

.history-item:hover {
    background: var(--primary-light);
}

.history-item.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 500;
}

.history-item i {
    margin-right: 10px;
    opacity: 0.7;
}

.history-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


/* 底部菜单 */
.bottom-menu {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.menu-item {
    padding: 12px 15px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    font-size: 14px;
    color: var(--text);
}

.menu-item:hover {
    background: var(--primary-light);
}

.menu-item i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
    color: var(--text-secondary);
}

/* sidebar 容器和动画样式 */
.sidebar-outer {
  width: 260px;
  min-width: 0;
  max-width: 260px;
  position: relative;
  transition: width 0.3s cubic-bezier(.55,0,.1,1), margin-right 0.3s cubic-bezier(.55,0,.1,1);
  overflow: visible;
  will-change: width, margin-right;
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


/* 手机端侧边栏覆盖全屏 + 遮罩 */
@media (max-width: 768px) {
  .sidebar {
      padding: 40px 15px;
  }

  .sidebar-outer {
    width: 260px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    box-shadow: 2px 0 20px rgba(0,0,0,0.2);
    transition: transform 0.3s cubic-bezier(.55,0,.1,1);
    background: var(--card-bg);
    /* 默认隐藏在左侧 */
    transform: translateX(-100%);
  }

  .sidebar-outer.collapsed {
    /* 隐藏时左移 */
    transform: translateX(-100%);
  }

  .sidebar-outer:not(.collapsed) {
    /* 展开时滑入 */
    transform: translateX(0);
  }


  .history-list {
    max-height: 45vh;
  }
}

</style>
