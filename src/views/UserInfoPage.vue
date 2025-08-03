<template>
  <div class="user-info-page">
    <header>
      <span>个人信息</span>
      <button class="back-btn" @click="goBack">返回</button>
    </header>
    <div class="user-info-content">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <!-- 基本信息卡片 -->
        <div class="info-card">
          <div class="info-row">
            <i class="fas fa-user"></i>
            <span class="label">昵称：</span>
            <span class="value">{{ user.name }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-mobile-alt"></i>
            <span class="label">手机号：</span>
            <span class="value">{{ user.phone }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-gift"></i>
            <span class="label">套餐：</span>
            <span class="value">{{ user.plan }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-coins"></i>
            <span class="label">积分：</span>
            <span class="value">{{ user.points }}</span>
          </div>
        </div>
        <!-- VIP 等级卡片 -->
        <div class="vip-card">
          <div class="vip-header">
            <i class="fas fa-crown vip-icon"></i>
            <span class="vip-title">VIP等级</span>
            <span class="vip-level">{{ user.vipLevel }}</span>
          </div>
          <div class="vip-detail">
            <span>到期时间：</span>
            <span class="vip-expire">{{ user.vipExpire }}</span>
          </div>
        </div>
        <!-- 会员权益卡片 -->
        <div class="rights-card">
          <div class="rights-title"><i class="fas fa-shield-alt"></i> 会员专属权益</div>
          <div class="rights-list">
            <div class="right-item" v-for="r in user.rights" :key="r.title">
              <i :class="r.icon"></i>
              <div class="right-info">
                <div class="right-title">{{ r.title }}</div>
                <div class="right-desc">{{ r.desc }}</div>
              </div>
            </div>
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
      points: 1200,
      vipLevel: '黄金会员',
      vipExpire: '2025-12-31',
      rights: [
        { icon: 'fas fa-badge-check', title: '专属标识', desc: '昵称旁专属VIP标识' },
        { icon: 'fas fa-rocket', title: '优先响应', desc: 'AI回复速度优先' },
        { icon: 'fas fa-gem', title: '积分加速', desc: '积分获取速度提升50%' },
        { icon: 'fas fa-gift', title: '专属活动', desc: '参与会员专属活动' },
        { icon: 'fas fa-headset', title: '专属客服', desc: '专属人工客服通道' }
      ]
    }
    loading.value = false
  }, 1000)
}

onMounted(fetchUserInfo)
</script>

<style scoped>
.user-info-page {
  min-height: 100vh;
  background: var(--light-bg);
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px 30px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  border-radius: 0 0 18px 18px;
  box-shadow: 0 2px 8px var(--shadow);
}
.back-btn {
  background: linear-gradient(90deg, var(--primary), #5a7dff);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn:hover {
  background: var(--primary);
}
.user-info-content {
  max-width: 480px;
  margin: 30px auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.loading {
  text-align: center;
  color: var(--primary);
  font-size: 18px;
  margin-top: 60px;
}
.info-card, .vip-card, .rights-card {
  background: var(--card-bg);
  border-radius: 18px;
  box-shadow: 0 5px 20px var(--shadow);
  padding: 24px 28px;
  border: 1px solid var(--border);
}
.info-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: var(--text);
}
.info-row i {
  color: var(--primary);
  font-size: 18px;
}
.label {
  color: var(--text-secondary);
  min-width: 60px;
}
.value {
  font-weight: 500;
}
.vip-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  border-left: 6px solid var(--primary);
}
.vip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
}
.vip-icon {
  color: #ffd700;
  font-size: 26px;
  filter: drop-shadow(0 2px 6px #ffe066);
}
.vip-title {
  color: var(--primary);
}
.vip-level {
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 8px;
  padding: 2px 12px;
  font-size: 15px;
  margin-left: 8px;
}
.vip-detail {
  color: var(--text-secondary);
  font-size: 15px;
  margin-left: 38px;
}
.vip-expire {
  color: var(--primary);
  margin-left: 6px;
}
.rights-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.rights-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.rights-title i {
  color: var(--primary);
}
.rights-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.right-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.right-item i {
  color: var(--primary);
  font-size: 20px;
  margin-top: 2px;
}
.right-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.right-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
}
.right-desc {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
