

<template>
  <!-- 背景效果 -->
  <div class="bg-effects">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
  </div>
  <div class="container" :class="{ 'sidebar-collapsed': !showSidebar }">
    <!-- 左侧功能区 -->
    <SidebarHistory
      v-show="showSidebar"
      :conversations="conversations"
      :activeConvId="activeConvId"
      @add-conversation="addConversation"
      @select-conversation="selectConversation"
      @go-user-info="goUserInfo"
    />
    <!-- 主聊天区 -->
    <div class="main-content">
      <div class="top-bar">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="tool-btn list-toggle-btn" @click="toggleSidebar" title="历史对话">
            <i class="fas fa-bars"></i>
          </button>
          <div class="model-selector">
            <i class="fas fa-robot"></i>
            <span>智灵联动 Pro 智能模型</span>
            <i class="fas fa-chevron-down" style="margin-left: auto;"></i>
          </div>
        </div>
        <div class="tools">
          <div class="tool-btn"><i class="fas fa-sync-alt"></i></div>
          <div class="tool-btn" @click="toggleFunctionPanel"><i class="fas fa-plug"></i></div>
          <div class="tool-btn"><i class="fas fa-ellipsis-h"></i></div>
        </div>
      </div>
      <div class="chat-container" ref="chatListRef">
        <div v-for="msg in activeMessages" :key="msg.id" :class="['message', msg.role==='user' ? 'user-message' : 'ai-message']">
          <template v-if="msg.role==='ai'">
            <div class="avatar ai-avatar">
              <i class="fas fa-brain"></i>
            </div>
            <div class="message-content">
              <div class="message-actions">
                <button class="action-btn"><i class="fas fa-copy"></i></button>
                <button class="action-btn"><i class="fas fa-thumbs-up"></i></button>
                <button class="action-btn"><i class="fas fa-thumbs-down"></i></button>
              </div>
              <MarkdownRenderer :content="msg.text" />
            </div>
          </template>
          <template v-else>
            <div class="message-content">
              <div class="message-actions">
                <button class="action-btn"><i class="fas fa-copy"></i></button>
                <button class="action-btn"><i class="fas fa-edit"></i></button>
              </div>
              <MarkdownRenderer :content="msg.text" />
            </div>
            <div class="avatar user-avatar">
              <i class="fas fa-user"></i>
            </div>
          </template>
        </div>
        <div v-if="showTyping" class="typing-indicator">
          <span>AI正在思考...</span>
          <div class="typing-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
      <!-- 输入区域 -->
      <div class="input-container">
        <div class="input-box">
          <div class="input-tools">
            <div class="input-tool"><i class="fas fa-plus"></i></div>
            <div class="input-tool"><i class="fas fa-image"></i></div>
            <div class="input-tool"><i class="fas fa-file-upload"></i></div>
            <div class="input-tool"><i class="fas fa-microphone"></i></div>
          </div>
          <textarea v-model="input" ref="inputRef" placeholder="输入消息..." rows="1" @input="autoResize" @keydown.enter.exact.prevent="send" @keydown.enter.shift="insertNewline"></textarea>
          <button class="send-btn" @click="send"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
      <!-- 功能面板 -->
      <div class="function-panel" :class="{active: showFunctionPanel}">
        <div class="panel-header">
          <div class="panel-title">AI 功能</div>
          <button class="close-panel" @click="toggleFunctionPanel">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="function-grid">
          <div class="function-card"><div class="function-icon"><i class="fas fa-file-code"></i></div><div class="function-name">代码生成</div></div>
          <div class="function-card"><div class="function-icon"><i class="fas fa-chart-line"></i></div><div class="function-name">数据分析</div></div>
          <div class="function-card"><div class="function-icon"><i class="fas fa-language"></i></div><div class="function-name">翻译助手</div></div>
          <div class="function-card"><div class="function-icon"><i class="fas fa-paint-brush"></i></div><div class="function-name">图像创作</div></div>
          <div class="function-card"><div class="function-icon"><i class="fas fa-book"></i></div><div class="function-name">文档总结</div></div>
          <div class="function-card"><div class="function-icon"><i class="fas fa-robot"></i></div><div class="function-name">AI角色扮演</div></div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { defineComponent, h } from 'vue'
import SidebarHistory from '../components/SidebarHistory.vue'
// markdown渲染组件
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})
const MarkdownRenderer = defineComponent({
  name: 'MarkdownRenderer',
  props: { content: String },
  setup(props) {
    return () => h('div', { class: 'markdown-body', innerHTML: md.render(props.content || '') })
  }
})

const router = useRouter()
const conversations = ref([
  {
    id: 1,
    title: '如何学习React框架？',
    messages: [
      { id: 1, role: 'ai', text: '你好！我是DeepSeek AI助手，有什么可以帮您的吗？我可以回答问题、提供建议、协助创作，或者与您讨论各种话题。无论您需要学习新知识、解决技术问题，还是仅仅想聊天，我都在这儿为您服务！' },
      { id: 2, role: 'user', text: '你好！我正在开发一个网页应用，可以给我一些前端设计的建议吗？' },
      { id: 3, role: 'ai', text: '当然可以！以下是一些现代网页设计的最佳实践建议：\n\n1. 响应式设计：确保您的网站能在各种设备上良好显示，使用媒体查询和弹性布局（Flexbox/Grid）\n2. 性能优化：优化图片、使用懒加载、最小化CSS/JavaScript文件\n3. 深色模式：提供深色/浅色主题切换，减少眼睛疲劳\n4. 交互动画：添加微妙的动画提升用户体验，但要避免过度使用\n5. 可访问性：确保网站对所有用户友好，包括使用适当对比度和ARIA属性\n\n您有特定的设计风格或功能需求吗？我可以提供更具体的建议。' }
    ]
  },
  {
    id: 2,
    title: '解释量子计算基础',
    messages: []
  },
  {
    id: 3,
    title: '旅行计划建议',
    messages: []
  },
  {
    id: 4,
    title: 'Python数据分析技巧',
    messages: []
  },
  {
    id: 5,
    title: '健身计划定制',
    messages: []
  }
])
const activeConvId = ref(1)
const input = ref('')
const chatListRef = ref(null)
const inputRef = ref(null)
const showFunctionPanel = ref(false)
const showTyping = ref(false)
const showSidebar = ref(true)
function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

const activeMessages = computed(() => {
  const conv = conversations.value.find(c => c.id === activeConvId.value)
  return conv ? conv.messages : []
})

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

function send() {
  if (!input.value.trim()) return
  const conv = conversations.value.find(c => c.id === activeConvId.value)
  if (!conv) return
  conv.messages.push({ id: Date.now(), role: 'user', text: input.value })
  scrollToBottom()
  showTyping.value = true
  const userInput = input.value
  input.value = ''
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = '24px'
    }
  })
  setTimeout(() => {
    conv.messages.push({ id: Date.now() + 1, role: 'ai', text: '感谢您的提问！这是一个模拟的AI回复。在实际应用中，这里会显示AI生成的回答。' })
    showTyping.value = false
    scrollToBottom()
  }, 1000)
}

function insertNewline(e) {
  // Shift+Enter 换行
  if (inputRef.value) {
    const el = inputRef.value
    const start = el.selectionStart
    const end = el.selectionEnd
    input.value = input.value.slice(0, start) + '\n' + input.value.slice(end)
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + 1
    })
  }
}

function autoResize() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = inputRef.value.scrollHeight + 'px'
  }
}

function addConversation() {
  const newId = Date.now()
  conversations.value.push({
    id: newId,
    title: '新对话',
    messages: [
      { id: newId, role: 'ai', text: '您好，有什么可以帮您？' }
    ]
  })
  activeConvId.value = newId
  scrollToBottom()
}

function selectConversation(id) {
  activeConvId.value = id
  scrollToBottom()
}

function goUserInfo() {
  router.push('/user')
}

function toggleFunctionPanel() {
  showFunctionPanel.value = !showFunctionPanel.value
}
</script>


<style scoped>
/* 仅保留必要的定位和结构样式，所有布局、色彩、字体等交给全局style.css */
.bg-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
.circle {
  position: absolute;
  border-radius: 50%;
}
.markdown-body {
  word-break: break-word;
}

.list-toggle-btn {
  margin-right: 8px;
}

.sidebar-collapsed .sidebar {
  display: none !important;
}
.sidebar-collapsed .main-content {
  margin-left: 0 !important;
  transition: margin-left 0.3s;
}
.container {
  transition: all 0.3s;
}
.sidebar + .main-content {
  transition: margin-left 0.3s;
}
</style>
