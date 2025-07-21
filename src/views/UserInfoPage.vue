<template>
  <div class="user-info-page">
    <header>
      <span>个人信息</span>
      <button class="back-btn" @click="goBack">返回</button>
    </header>
    <div class="user-info-content">
      <div v-if="loading">加载中...</div>
      <div v-else>
        <div>姓名：{{ user.name }}</div>
        <div>手机号：{{ user.phone }}</div>
        <div>套餐：{{ user.plan }}</div>
        <div>积分：{{ user.points }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const user = ref({})

function goBack() {
  router.push('/')
}

function fetchUserInfo() {
  loading.value = true
  setTimeout(() => {
    user.value = {
      name: '张三',
      phone: '138****8888',
      plan: '5G畅享套餐',
      points: 1200
    }
    loading.value = false
  }, 1000)
}

onMounted(fetchUserInfo)
</script>

<style scoped>
.user-info-page { height: 100vh; background: #f8f8f8; }
header { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f5f5f5; }
.back-btn { background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 6px 12px; }
.user-info-content { padding: 24px; font-size: 16px; }
</style>
