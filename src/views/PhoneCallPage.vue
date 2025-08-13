<!-- PhoneCall.vue -->
<template>
  <div class="phone-call-page">
    <div class="call-content">
      <div class="avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="phone-number">{{ phoneNumber }}</div>
      <div class="call-status">{{ customStatusText || statusText }}</div>

      <div class="control-buttons">
        <!-- 静音按钮 -->
        <button class="side-btn">
          <i class="fas fa-microphone-slash"></i>
        </button>

        <!-- 接通按钮 -->
        <button
          class="answer-btn"
          @click="answerCall"
          :class="{ ringing: status === 'success' }"
        >
          <i class="fas fa-phone"></i>
        </button>

        <!-- 挂断按钮 -->
        <button
          class="hangup-btn"
          @click="goBack"
          :class="{ ringing: status === 'success' }"
        >
          <i class="fas fa-phone-slash"></i>
        </button>

        <!-- 智能回复按钮 -->
        <button
          class="ai-btn"
          @click="changestatusText"
          :class="{ ringing: status === 'success' }"
        >
          <i class="fas fa-robot"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phoneNumber = ref('79797979')
const loading = ref(false)
const status = ref('idle')
const rawResponse = ref(null)
const callType = ref('')
const customStatusText = ref('')

const API_BASE = 'http://localhost:12000'

const statusText = computed(() => {
  switch (status.value) {
    case 'idle':
      return '正在呼叫...'
    case 'calling':
      return '拨号中...'
    case 'success':
      return '推销来电，已经为您拦截'
    case 'error':
      return '黑名单来电，已经为您拦截'
    default:
      return ''
  }
})

function goBack() {
  router.back()
}

function resolveAudioUrl(audioField) {
  if (!audioField) return ''
  if (audioField.startsWith('data:audio')) return audioField
  try {
    return new URL(audioField, window.location.origin).toString()
  } catch {
    return audioField
  }
}

async function callNow() {
  loading.value = true
  status.value = 'calling'
  rawResponse.value = null
  callType.value = '' // 清空旧值
  try {
    const resp = await fetch(API_BASE + '/phonecallhandle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber.value })
    })
    const data = await resp.json()
    rawResponse.value = data
    if (data.status === 'success') {
      // 从返回结果中提取 call_type
      callType.value = data.result?.call_type || ''
      status.value = 'success'
    } else {
      status.value = 'error'
    }
  } catch (err) {
    rawResponse.value = { error: String(err) }
    status.value = 'error'
  } finally {
    loading.value = false
  }
}

function changestatusText() {
  if (callType.value === '正常') {
    customStatusText.value = '为您回复：您拨打的用户很想接通，但实在有事暂时走不开'
  } else if (callType.value === '骚扰' || callType.value === '黑名单电话') {
    customStatusText.value = '为您回复：您拨打的用户暂时不感兴趣，请勿打扰'
  } else {
    customStatusText.value = '为您回复：您拨打的用户暂时不感兴趣，请勿打扰'
  }
}

onMounted(() => {
  callNow()
})
</script>

<style scoped>
.phone-call-page {
  background: rgba(0, 0, 0, 0.85);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: sans-serif;
}

.call-content {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.phone-number {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.call-status {
  font-size: 16px;
  margin-bottom: 40px;
  opacity: 0.8;
}

.control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px; /* 按钮间距 */
}

.side-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 20px;
  color: white;
  opacity: 0.6;
  cursor: default;
}

.answer-btn {
  position: relative;
  background: rgb(86, 246, 134);
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 1;
}
.answer-btn:hover {
  background: rgb(2, 100, 46);
}

.hangup-btn {
  position: relative;
  background: red;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 1;
}
.hangup-btn:hover {
  background: darkred;
}

.ai-btn {
  position: relative;
  background: rgb(77, 168, 243);
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 1;
}
.ai-btn:hover {
  background: rgb(4, 45, 156);
}

/* 波纹动画 */
.hangup-btn.ringing::before,
.hangup-btn.ringing::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.4);
  transform: translate(-50%, -50%);
  z-index: -1;
  animation: ripple 1.5s infinite;
}

.hangup-btn.ringing::after {
  animation-delay: 0.75s;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}
</style>
