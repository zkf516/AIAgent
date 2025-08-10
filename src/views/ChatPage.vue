<template>
  <!-- 背景效果 -->
  <div class="bg-effects">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
  </div>
  <div class="container" :class="{ 'sidebar-collapsed': !showSidebar }">
    <!-- 左侧功能区 -->
    <SidebarHistory
      :conversations="conversations"
      :activeConvId="activeConvId"
      :showSidebar="showSidebar"
      @add-conversation="addConversation"
      @select-conversation="selectConversation"
      @go-user-info="goUserInfo"
    />
    <div v-if="isMobile && showSidebar" class="sidebar-mask" @click="toggleSidebar"></div>
    <!-- 主聊天区 -->
    <div class="main-content">
      <div class="top-bar">
        <div style="display: flex; align-items: center; gap: 5px;">
          <button class="tool-btn list-toggle-btn" @click="toggleSidebar" title="历史对话">
            <i class="fas fa-bars"></i>
          </button>
          <div class="model-selector">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-openai" viewBox="0 0 16 16">
              <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z"/>
            </svg>
            <span>qwen-max</span>
            <i class="fas fa-chevron-down" style="margin-left: auto;"></i>
          </div>
        </div>
        <div class="tools">
          <div class="tool-btn" @click="simulateIncomingCall"><i class="fa-solid fa-phone-volume"></i></div>
          <div class="tool-btn"><i class="fas fa-sync-alt"></i></div>
          <div class="tool-btn" @click="toggleFunctionPanel"><i class="fas fa-plug"></i></div>
          <div class="tool-btn"><i class="fas fa-ellipsis-h"></i></div>
        </div>
      </div>
      <div class="chat-container" ref="chatListRef">
        <div v-for="msg in activeMessages" :key="msg.id" :class="['message', msg.role==='user' ? 'user-message' : 'ai-message']">
          <template v-if="msg.role==='ai'">
            <div class="avatar ai-avatar">
              <i class="bi bi-robot"></i>
            </div>
            <div>
              <div class="message-content">
                <MarkdownRenderer :content="msg.text" />
              </div>
              <div class="message-actions">
                <button class="action-btn"><i class="fas fa-copy"></i></button>
                <button class="action-btn"><i class="fas fa-thumbs-up"></i></button>
                <button class="action-btn"><i class="fas fa-thumbs-down"></i></button>
              </div>
            </div>
          </template>
          <template v-else>
            <div>
              <div class="message-content">
                <MarkdownRenderer :content="msg.text" />
              </div>
              <div class="message-actions">
                <button class="action-btn"><i class="fas fa-copy"></i></button>
                <button class="action-btn"><i class="fas fa-thumbs-up"></i></button>
                <button class="action-btn"><i class="fas fa-thumbs-down"></i></button>
              </div>
            </div>
            <div class="avatar user-avatar">
              <i class="fa-solid fa-user-tie"></i>
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
        <ChatInputBox
          :input="input"
          :recognizing="recognizing"
          @update:input="val => { input = val }"
          @send="send"
          @startVoiceInput="startVoiceInput"
        />
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
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { defineComponent, h } from 'vue'
import SidebarHistory from '../components/SidebarHistory.vue'
import ChatInputBox from '../components/ChatInputBox.vue'
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
// const inputRef = ref(null) // 已由ChatInputBox内部管理
const showFunctionPanel = ref(false)
const showTyping = ref(false)
// 语音识别相关
const recognizing = ref(false)
let recognition = null

// WebSocket相关
let ws = null

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('当前浏览器不支持语音识别')
    return null
  }
  const recog = new SpeechRecognition()
  recog.lang = 'zh-CN'
  recog.continuous = false
  recog.interimResults = false
  recog.onstart = () => { recognizing.value = true }
  recog.onend = () => { recognizing.value = false }
  recog.onerror = (e) => {
    recognizing.value = false
    alert('语音识别出错：' + e.error)
  }
  recog.onresult = (e) => {
    const txt = Array.from(e.results).map(r => r[0].transcript).join('')
    input.value = txt
  }
  return recog
}

function startVoiceInput() {
  if (recognizing.value) {
    recognition && recognition.stop()
    return
  }
  if (!recognition) recognition = initSpeechRecognition()
  if (recognition) recognition.start()
}
// showSidebar控制侧边栏显示
const showSidebar = ref(false)
const isMobile = computed(() => window.innerWidth <= 768)
function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

const activeMessages = computed(() => {
  const conv = conversations.value.find(c => c.id === activeConvId.value)
  return conv ? conv.messages : []
})

// 来电插入
function addIncomingCall(number) {
  const conv = conversations.value.find(c => c.id === activeConvId.value)
  if (!conv) return
  const newId = Date.now()
  conv.messages.push({
    id: newId,
    role: 'ai',
    text: `您好，您有一条 ${number} 来电？`
  })
  scrollToBottom()
}

// WebSocket
function initWebSocket() {
  ws = new WebSocket('ws://localhost:3000')

  ws.onopen = () => {
    console.log('✅ WebSocket 已连接')
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'incomingCall') {
        addIncomingCall(data.number)
      }
    } catch (err) {
      console.error('WebSocket消息解析失败:', err)
    }
  }

  ws.onclose = () => {
    console.log('❌ WebSocket 已关闭，5秒后重连...')
    setTimeout(initWebSocket, 5000)
  }

  ws.onerror = (err) => {
    console.error('WebSocket 错误:', err)
    ws.close()
  }
}

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
  // 清空输入后重置高度由ChatInputBox内部处理
  setTimeout(() => {
    conv.messages.push({ id: Date.now() + 1, role: 'ai', text: '感谢您的提问！这是一个模拟的AI回复。在实际应用中，这里会显示AI生成的回答。' })
    showTyping.value = false
    scrollToBottom()
  }, 1000)
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

// === 新增: 模拟来电按钮 ===
function simulateIncomingCall() {
  const randomNumber = '1' + Math.floor(Math.random() * 9000000000 + 1000000000)
  addIncomingCall(randomNumber)
}

onMounted(() => {
  initWebSocket()
})

onBeforeUnmount(() => {
  if (ws) {
    ws.close()
  }
})
</script>


<style scoped>
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
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: none;
  height: 96vh;
  box-sizing: border-box;
  position: relative;
}
/* 让顶部栏绝对定位在 main-content 顶部 */
.top-bar {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
/* 让聊天区可滚动且不撑大页面，顶部预留 top-bar 高度，底部预留输入栏高度 */

/* 输入栏绝对定位在 main-content 底部 */
.input-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
/* 输入栏已用 fixed，无需额外处理 */

/* 手机端侧边栏覆盖全屏 + 遮罩 */
@media (max-width: 768px) {
  /* 遮罩层 */
  .sidebar-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.25);
    z-index: 99;
    transition: opacity 0.3s;
    opacity: 1;
    pointer-events: auto;
  }
  
  .sidebar-mask.hide {
    opacity: 0;
    pointer-events: none;
  }
}

</style>