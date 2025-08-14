<template>
  <div class="theme-settings-page">
    <header class="theme-header">
      <button class="back-btn" @click="goBack">返回</button>
      <span class="header-title">主题设置</span>
    </header>
    <div class="theme-content">
      <div class="theme-card">
        <div class="theme-card-title">
          <i class="fas fa-palette"></i> 主题色调
        </div>
        <div class="theme-list">
          <div v-for="theme in themes" :key="theme.name" class="theme-item" :class="{active: theme.name === currentTheme}" @click="applyTheme(theme)">
            <div class="theme-preview" :style="themePreviewStyle(theme)"></div>
            <span>{{ theme.displayName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
const themes = [
  {
    name: 'default',
    displayName: '深海蓝',
    vars: {
      '--primary': '#4a6fff',
      '--primary-light': '#e6f0ff',
      '--secondary': '#6c8eff',
      '--light-bg': '#f5f7fb',
      '--user-msg': '#e6f0ff',
      '--ai-msg': '#f8f9fe',
      '--border': '#dde2ff',
      '--shadow': 'rgba(74, 111, 255, 0.1)'
    }
  },
  {
    name: 'purple',
    displayName: '神秘紫',
    vars: {
      '--primary': '#8f94fb',
      '--primary-light': '#e0e7ff',
      '--secondary': '#4e54c8',
      '--light-bg': '#f6f8fc',
      '--user-msg': '#fff',
      '--ai-msg': '#f3f6ff',
      '--border': '#e0e0e0',
      '--shadow': 'rgba(143,148,251,0.12)'
    }
  },
  {
    name: 'green',
    displayName: '清新绿',
    vars: {
      '--primary': '#4fd18b',
      '--primary-light': '#e0f7ef',
      '--secondary': '#1fa97a',
      '--light-bg': '#f6fcf8',
      '--user-msg': '#fff',
      '--ai-msg': '#f3fff6',
      '--border': '#d0e8dc',
      '--shadow': 'rgba(79,209,139,0.12)'
    }
  },
  {
    name: 'orange',
    displayName: '活力橙',
    vars: {
      '--primary': '#ffb347',
      '--primary-light': '#fff5e6',
      '--secondary': '#ff7f50',
      '--light-bg': '#fffaf3',
      '--user-msg': '#fff',
      '--ai-msg': '#fff8f3',
      '--border': '#ffe0b2',
      '--shadow': 'rgba(255,179,71,0.12)'
    }
  },
  {
    name: 'pink',
    displayName: '少女粉',
    vars: {
      '--primary': '#ff7eb3',
      '--primary-light': '#ffe6f2',
      '--secondary': '#ff758c',
      '--light-bg': '#fff6fa',
      '--user-msg': '#fff',
      '--ai-msg': '#fff3f8',
      '--border': '#ffd1e6',
      '--shadow': 'rgba(255,126,179,0.12)'
    }
  }
]

const currentTheme = ref(localStorage.getItem('themeName') || 'default')

function applyTheme(theme) {
  currentTheme.value = theme.name
  for (const key in theme.vars) {
    document.documentElement.style.setProperty(key, theme.vars[key])
  }
  localStorage.setItem('themeName', theme.name)
}

onMounted(() => {
  const themeName = localStorage.getItem('themeName') || 'default'
  const theme = themes.find(t => t.name === themeName) || themes[0]
  applyTheme(theme)
})

function themePreviewStyle(theme) {
  return {
    background: `linear-gradient(90deg, ${theme.vars['--primary']}, ${theme.vars['--secondary']})`,
    border: `1.5px solid ${theme.vars['--border']}`,
    boxShadow: `0 4px 16px ${theme.vars['--shadow']}`
  }
}
</script>


<style scoped>
.theme-settings-page {
  min-height: 100vh;
  background: var(--light-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.theme-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 40px 20px 15px;
  margin: 0 5px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  border-radius: 0 0 18px 18px;
  box-shadow: 0 2px 8px var(--shadow);
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 2px;
  margin-right: 40px;
}
.back-btn {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn:hover {
  background: var(--primary);
}
.theme-content {
  max-width: 480px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 0 12px 40px;
}
.theme-card {
  background: var(--card-bg);
  border-radius: 18px;
  box-shadow: 0 5px 20px var(--shadow);
  padding: 20px 25px;
  border: 1px solid var(--border);
}
.theme-card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.theme-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.theme-item {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  padding: 14px 18px;
  border-radius: 12px;
  transition: background 0.2s;
  min-width: 180px;
  border: 2px solid transparent;
  background: #fff;
  box-shadow: 0 2px 8px var(--shadow);
}
.theme-item.active, .theme-item:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}
.theme-preview {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  margin-right: 6px;
  border: 1.5px solid #eee;
  box-shadow: 0 2px 8px var(--shadow);
}
.theme-item span {
  font-size: 18px;
  color: var(--primary);
  font-weight: 500;
}
@media (max-width: 768px) {
  .theme-header {
    padding: 40px 20px 15px;
    border-radius: 0 0 12px 12px;
  }
  .header-title {
    font-size: 20px;
    margin-right: 20px;
  }
  .theme-list {
    gap: 12px;
  }
  .theme-item {
    min-width: 120px;
    padding: 10px 8px;
  }
  .theme-preview {
    width: 28px;
    height: 28px;
  }
}
</style>
