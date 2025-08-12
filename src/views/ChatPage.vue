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
        <div class="topbar-left">
          <button class="tool-btn list-toggle-btn" @click="toggleSidebar" title="历史对话">
            <i class="fas fa-bars"></i>
          </button>
          <ModelSelector
            :models="modelStore.models"
            :currentModel="modelStore.currentModel"
            :showModelDropdown="modelStore.showModelDropdown"
            @toggleModelDropdown="modelStore.toggleModelDropdown"
            @selectModel="modelStore.selectModel"
            @addModel="modelStore.addModel"
          />
        </div>
        <div class="tools">
          <div class="tool-btn" @click="refreshChatContainer"><i class="fas fa-sync-alt"></i></div>
          <div class="tool-btn" @click="toggleFunctionPanel"><i class="fas fa-plug"></i></div>
          <div class="tool-btn dropdown-trigger" @click="toggleDropdown">
            <i class="fas fa-ellipsis-h"></i>
            <div v-if="showDropdown" class="dropdown-menu">
              <button class="dropdown-item" @click.stop="simulateIncomingCall">
                <i class="fa-solid fa-phone-volume"></i> 电话接打
              </button>
              <button class="dropdown-item">
                <i class="fab fa-weibo"></i> 微博热搜
              </button>
              <button class="dropdown-item">
                <i class="fas fa-map"></i> 出行规划
              </button>
              <button class="dropdown-item">
                <i class="fab fa-twitter"></i> twitter发帖
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-container" ref="chatListRef" :key="chatContainerKey">
        <AIWelcomeMessage />
        <div v-for="msg in activeMessages" :key="msg.id" :class="['message', msg.role==='user' ? 'user-message' : 'ai-message']">
          <template v-if="msg.role==='ai'">
            <div class="avatar ai-avatar">
              <i class="bi bi-robot"></i>
            </div>
            <div>
              <div class="message-content">
                <MarkdownRenderer :content="msg.text" />
                <div v-if="msg.text === '' && showTyping" class="typing-indicator-in-msg" style="display: flex; align-items: center; gap: 4px;">
                  <span>AI正在思考</span>
                  <div class="typing-dots" style="display: inline-flex; margin-left: 2px;">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div>
                </div>
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
import { ref, computed, nextTick, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SidebarHistory from '../components/SidebarHistory.vue'
import ChatInputBox from '../components/ChatInputBox.vue'
import { useModelStore } from '../stores/modelStore'
const modelStore = useModelStore()
import ModelSelector from '../components/ModelSelector.vue'
import AIWelcomeMessage from '@/components/AIWelcomeMessage.vue'
import { connectWebSocket, closeWebSocket, addWebSocketListener, removeWebSocketListener } from '@/services/websocket.js'
//import { sendMessageRequest, parseDeepseekStream } from '@/services/deepseekService.js'

// 导入markdown渲染组件
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'


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
const showTyping = ref(false)

// topbar相关状态
const showFunctionPanel = ref(false)
const showDropdown = ref(false)


// 语音识别相关
const recognizing = ref(false)
let recognition = null

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

// WebSocket 事件监听
function handleWsEvent(evt) {
  if (evt.type === 'message' && evt.data && evt.data.type === 'incomingCall') {
    addIncomingCall(evt.data.number)
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

// 通用发送消息，只处理用户输入和UI
import { sendMessageByModel, parseResponseBySchema } from '@/services/backend.js'
import modelSchemas from '@/services/model_schemas.json'

async function send() {
  const text = input.value.trim()
  if (!text) return
  const conv = conversations.value.find(c => c.id === activeConvId.value)
  if (!conv) return
  const userMsgId = Date.now()
  conv.messages.push({ id: userMsgId, role: 'user', text })
  scrollToBottom()
  showTyping.value = true
  input.value = ''
  // 预添加AI消息
  const aiMsg = reactive({ id: userMsgId + 1, role: 'ai', text: '' })
  conv.messages.push(aiMsg)
  scrollToBottom()
  // 单独处理AI回复
  getAIReply(conv, aiMsg)
}

// 通用获取AI回复，处理流式渲染
async function getAIReply(conv, aiMsg) {
  // 获取当前模型名和 apikey（如有）
  const model = modelStore.currentModel || 'DeepSeek-R1'
  const apiKey = modelStore.apiKey || 'sk-8063db03ab5749099d809c8967f5c951'
  let messages
  // 构造通用上下文
  if ( model === 'DeepSeek-R1') {
    messages = conv.messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    }))
  } else {
    //只发送倒数第二条消息（最新用户输入）
    const lastMsg = conv.messages[conv.messages.length - 2]
    messages = [{
      role: lastMsg.role === 'user' ? 'user' : 'assistant',
      content: [
        { username: '张三' },
        { text: lastMsg.text }
      ]
    }]
  }

  try {
    const response = await sendMessageByModel(model, { apiKey, model, messages })
    const schema = modelSchemas[model]?.response
    if (!schema) throw new Error('模型响应结构未配置')
    if (schema.type === 'sse-stream') {
      let content = ''
      for await (const chunk of parseResponseBySchema(schema, response)) {
        if (chunk.content) {
          content += chunk.content
          aiMsg.text = content
        }
        scrollToBottom()
      }
    } else {
      // 非流式，直接取一次
      const result = await parseResponseBySchema(schema, response).next()
      aiMsg.text = result.value?.text || ''
      scrollToBottom()
    }
  } catch (e) {
    aiMsg.text = 'AI回复失败，请稍后重试。'
  } finally {
    showTyping.value = false
    scrollToBottom()
  }
}


// 对话相关函数
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

// 页面跳转
function goUserInfo() {
  router.push('/user')
}

// topbar按钮功能
const chatContainerKey = ref(Date.now())
function refreshChatContainer() {
  chatContainerKey.value = Date.now() // 每次点击都变，强制重新渲染
}

function toggleFunctionPanel() {
  showFunctionPanel.value = !showFunctionPanel.value
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

// 点击页面其他区域关闭下拉
function handleClickOutsideDropdown(e) {
  const trigger = document.querySelector('.dropdown-trigger')
  if (showDropdown.value && trigger && !trigger.contains(e.target)) {
    showDropdown.value = false
  }
}


// === 新增: 模拟来电按钮 ===
function simulateIncomingCall() {
  const randomNumber = '1' + Math.floor(Math.random() * 9000000000 + 1000000000)
  addIncomingCall(randomNumber)
}


onMounted(() => {
  connectWebSocket()
  addWebSocketListener(handleWsEvent)
  document.addEventListener('click', handleClickOutsideDropdown)
})

onBeforeUnmount(() => {
  closeWebSocket()
  removeWebSocketListener(handleWsEvent)
  document.removeEventListener('click', handleClickOutsideDropdown)
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

/* 输入栏绝对定位在 main-content 底部 */
.input-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
}

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

/* 右上角省略号下拉菜单样式 */
.dropdown-trigger {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #eee);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  min-width: 150px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 6px 0;
}
.dropdown-item {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  text-align: left;
  padding: 8px 20px;
  font-size: 15px;
  color: var(--primary, #3b6cff); /* 与.tool-btn一致 */
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;
  line-height: 1.2;
}
.dropdown-item i {
  color: var(--primary, #3b6cff); /* 图标同样主色 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  width: 22px; /* 统一宽度，可根据实际调整 */
  min-width: 22px;
  text-align: center;
}

.dropdown-item:hover {
  background: var(--primary-light, #f0f4ff);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0; /* 关键，允许子项收缩 */
  flex: 1 1 0%;
}
</style>