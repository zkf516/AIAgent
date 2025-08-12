<template>
    <div class="ai-welcome-message">
      <div class="welcome-title">
        <img class="welcome-img" src="/hello.webp" alt="👋" />
        <h1>{{ greeting }}</h1>
      </div>
      <div class="welcome-inner">
        <p class="welcome-desc">我是您的联通智能助理 <b>智灵联动</b>，请问现在能帮您做什么？</p>
        <div class="custom-btn-container">
          <button class="custom-btn" @click="onCreateAssistant">
            <span class="plus">+</span> 创建自定义助手
          </button>
        </div>
        <div class="section-title">
          <h3>新增助手推荐：</h3>
          <button class="icon-btn" @click="onRefreshAssistants" title="刷新推荐">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div class="assistants-grid">
          <div class="assistant-card" v-for="a in assistants" :key="a.name" @mouseenter="hoverCard = a.name" @mouseleave="hoverCard = ''" :style="hoverCard === a.name ? 'transform:translateY(-7px);box-shadow:0 12px 30px rgba(0,0,0,0.4);border-color:rgba(143,148,251,0.4);' : ''">
            <a href="#" @click.prevent="onAssistantClick(a)">
              <div class="assistant-avatar">
                <img :src="a.avatar" :alt="a.alt" />
              </div>
              <div class="assistant-info">
                <div class="assistant-name">{{ a.name }}</div>
                <div class="assistant-desc">{{ a.desc }}</div>
              </div>
            </a>
          </div>
        </div>
        <div class="section-title">
          <h3>大家都在问：</h3>
        </div>
        <div class="questions-grid">
          <div class="question-chip" v-for="q in questions" :key="q" @click="onQuestionClick(q)">{{ q }}</div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12 && hour > 5 ) return '早上好'
  if (hour < 18 && hour >= 12) return '下午好'
  return '晚上好'
})

const assistants = [
  {
    name: '海龟汤主持人',
    avatar: 'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f422.webp',
    alt: '🐢',
    desc: '需要自己提供汤面，汤底与关键点'
  },
  {
    name: '美食评论员🍟',
    avatar: 'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f60b.webp',
    alt: '😋',
    desc: '美食评价专家'
  },
  {
    name: '学术写作助手',
    avatar: 'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f4d8.webp',
    alt: '📘',
    desc: '专业的学术研究论文写作和正式文档编写专家'
  },
  {
    name: 'Minecraft资深开发者',
    avatar: 'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/2666-fe0f.webp',
    alt: '♦️',
    desc: '擅长高级 Java 开发及 Minecraft 开发'
  }
]

const questions = [
  '智灵联动 如何部署和使用？',
  '是否有云端服务版？',
  '我在使用时遇到问题怎么办？',
  '智灵联动 的定价是如何的？'
]

const hoverCard = ref('')

function onCreateAssistant() {
  // 可替换为 emit 事件
  alert('打开创建自定义助手面板')
}
function onRefreshAssistants() {
  alert('刷新助手推荐列表')
}
function onAssistantClick(a) {
  alert(`点击了助手：${a.name}`)
}
function onQuestionClick(q) {
  alert(`您选择了问题: "${q}"`)
}
</script>

<style scoped>
/* 欢迎消息主卡片 */
.ai-welcome-message {
  background: var(--ai-msg);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 10px 30px var(--shadow);
  animation: fadeIn 0.5s ease;
  max-width: 100%;
  margin: 20px auto 24px auto;
  padding: 20px 0 15px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-inner {
  width: 95%;
  margin: 0 auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.welcome-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0 20px;
}
.welcome-img {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
.welcome-title h1 {
  font-size: 40px;
  font-weight: 700;
  color: var(--primary);
  text-shadow: 0 0 10px var(--shadow);
  font-family: 'Noto Sans SC', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.welcome-desc {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-secondary);
  font-size: 16px;
}
.custom-btn-container {
  display: flex;
  justify-content: center;
  margin: 25px 0 20px;
}
.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px var(--shadow);
}
.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px var(--shadow);
}
.custom-btn .plus {
  font-size: 20px;
  margin-right: 8px;
  line-height: 1;
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0 5px;
  margin-top: 30px;
  border-top: 3px dashed var(--border);
}
.section-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
}
.section-title h3:before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 22px;
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  border-radius: 3px;
  margin-right: 12px;
}
.icon-btn {
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--primary);
}
.icon-btn:hover {
  background: var(--primary);
  color: white;
  transform: rotate(15deg);
}
.assistants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  padding: 10px 0 10px;
}
.assistant-card {
  background: var(--card-bg);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border);
}
.assistant-card a {
  display: flex;
  padding: 18px;
  text-decoration: none;
  color: inherit;
}
.assistant-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 15px;
  background: var(--primary-light);
}
.assistant-avatar img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}
.assistant-info {
  flex: 1;
  overflow: hidden;
}
.assistant-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 5px;
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.assistant-desc {
  font-size: 13px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
  padding: 15px 0 25px;
}
.question-chip {
  background: var(--primary-light);
  border-radius: 50px;
  padding: 12px 20px;
  text-align: center;
  font-size: 15px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border);
}
.question-chip:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-4px);
  border-color: var(--primary);
}
@media (max-width: 768px) {
  .ai-welcome-message {
    border-radius: 12px;
    padding: 5px 20px 5px 20px;
    margin: 5px 0 10px 0;
  }
  .welcome-inner {
    width: 99%;
    padding: 0;
  }
  .welcome-title h1 {
    font-size: 30px;
  }
  .welcome-img {
    width: 40px;
    height: 40px;
    margin-right: 5px;
  }
  .section-title {
    margin-top: 20px;
  }
  .assistants-grid {
    grid-template-columns: 1fr;
  }
  .questions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
