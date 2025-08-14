<!-- UserCard.vue -->
<template>
  <div class="user-info-page">
    <header class="user-header">
      <button class="back-btn" @click="goBack">返回</button>
      <span class="header-title">账户信息</span>
    </header>

    <div class="user-info-content">
      <div v-if="loading" class="loading">加载中...</div>

      <template v-else>
        <!-- 1. 基础信息（姓名 / 手机 / 证件） -->
        <div class="info-card">
          <div class="info-row">
            <i class="fas fa-user"></i>
            <span class="label">姓名：</span>
            <span class="value">{{ user.name }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-mobile-alt"></i>
            <span class="label">手机号：</span>
            <span class="value">{{ user.phone }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-id-card"></i>
            <span class="label">证件类型：</span>
            <span class="value">{{ user.idType }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-fingerprint"></i>
            <span class="label">证件号码：</span>
            <span class="value">{{ user.idNumber }}</span>
          </div>
        </div>

        <!-- 2. 套餐信息（独立卡片 + 小图标） -->
        <div class="plan-card">
          <div class="card-title">
            <i class="fas fa-wifi"></i> 套餐信息
          </div>
          <div class="plan-row">
            <i class="fas fa-tv text-blue"></i>
            <span class="lab">套餐类型：</span>
            <span class="val">{{ user.planType }}</span>
          </div>
          <div class="plan-row">
            <i class="fas fa-coins text-green"></i>
            <span class="lab">月费用：</span>
            <span class="val">{{ user.monthlyFee }} 元</span>
          </div>
          <div class="plan-row">
            <i class="fas fa-calendar-alt text-orange"></i>
            <span class="lab">合约期：</span>
            <span class="val">{{ user.contractMonths }} 个月</span>
          </div>
          <div class="plan-row">
            <i class="fas fa-phone text-red"></i>
            <span class="lab">含电话套餐：</span>
            <span class="val">{{ user.hasPhonePlan ? '是' : '否' }}</span>
          </div>
        </div>

        <!-- 3. VIP 等级 -->
        <div class="vip-card">
          <div class="vip-header">
            <i class="fas fa-crown vip-icon"></i>
            <span class="vip-title">VIP 等级</span>
            <span class="vip-level">{{ user.vipLevel }}</span>
          </div>
          <div class="vip-detail">
            <span>到期时间：</span>
            <span class="vip-expire">{{ user.vipExpire }}</span>
          </div>
        </div>

        <!-- 4. 会员专属权益 -->
        <div class="rights-card">
          <div class="rights-title">
            <i class="fas fa-shield-alt"></i> 会员专属权益
          </div>
          <div class="rights-list">
            <div
              class="right-item"
              v-for="(r, idx) in user.rights"
              :key="'right-' + idx"
            >
              <i :class="r.icon"></i>
              <div class="right-info">
                <div class="right-title">{{ r.title }}</div>
                <div class="right-desc">{{ r.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. 黑名单 -->
        <div class="rights-card">
          <div class="rights-title">
            <i class="fas fa-ban"></i> 电话黑名单
          </div>
          <div class="rights-list">
            <div
              v-for="(num, idx) in user.blacklist"
              :key="idx"
              class="right-item"
            >
              <i class="fas fa-phone-slash"></i>
              <span>{{ num }}</span>
            </div>
            <div v-if="!user.blacklist.length" class="right-item">
              <span class="right-desc">暂无黑名单号码</span>
            </div>
          </div>
        </div>
        <!-- 6. 个人财产（独立卡片） -->
        <div class="asset-card">
          <div class="rights-title">
            <i class="fas fa-piggy-bank"></i> 个人财产
          </div>
          <div class="rights-list">
            <div
              class="right-item"
              v-for="(a, idx) in user.assets"
              :key="'asset-' + idx"
            >
              <i :class="a.icon"></i>
              <div class="right-info">
                <div class="right-title">
                  {{ a.name }}
                  <small class="highlight">×{{ a.amount }}</small>
                </div>
                <div class="right-desc">{{ a.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const user = ref({})

const goBack = () => router.back()

onMounted(() => {
  setTimeout(() => {
    user.value = {
      name: '李雷',
      phone: '176****1234',
      idType: '居民身份证',
      idNumber: '3101**********1234',
      planType: '家庭版单宽200M',
      monthlyFee: 47.0,
      contractMonths: 36,
      hasPhonePlan: false,
      vipLevel: '青铜',
      vipExpire: '2027-08-11',
      rights: [
        {
          icon: 'fas fa-tachometer-alt',
          title: '200M 高速宽带',
          desc: '下行 200Mbps / 上行 30Mbps'
        },
      ],
      assets: [
        { icon: 'fas fa-star', name: '积分', amount: 1680, desc: '可抵话费 / 兑换礼品' },
        { icon: 'fas fa-ticket-alt', name: '话费券', amount: 3, desc: '满 50 减 5 元券' },
        { icon: 'fas fa-sim-card', name: '流量包', amount: 2, desc: '5G 10GB 日包' },
        { icon: 'fas fa-qrcode', name: '电子券', amount: 5, desc: '京东 20 元购物券' },
        { icon: 'fas fa-exchange-alt', name: '兑换券', amount: 1, desc: '腾讯视频月卡' },
        { icon: 'fas fa-phone', name: '语音包', amount: 300, desc: '全国语音 300 分钟' },
        { icon: 'fas fa-gift', name: '实物', amount: 1, desc: '千兆路由器待领取' },
        { icon: 'fas fa-credit-card', name: '卡券', amount: 2, desc: '美团外卖 15 元代金券' },
        { icon: 'fas fa-gem', name: '王钻', amount: 88, desc: '可参与王钻抽奖' },
        { icon: 'fas fa-award', name: '其他奖品', amount: 1, desc: '周年庆神秘盲盒' }
      ],
      blacklist: ['4001008888', '021-6183****']
    }
    loading.value = false
  }, 600)
})
</script>

<style scoped>
/* ===== 通用变量 ===== */
:root {
  --light-bg: #f5f7fa;
  --card-bg: #ffffff;
  --border: #e5e7eb;
  --shadow: rgba(0, 0, 0, 0.04);
  --primary: #3b82f6;
  --primary-light: #dbeafe;
  --text: #111827;
  --text-secondary: #6b7280;
}

.user-info-page {
  min-height: 100vh;
  background: var(--light-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== Header ===== */
.user-header {
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

.user-info-content {
  max-width: 480px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 0 12px 40px;
}
.loading {
  text-align: center;
  color: var(--primary);
  font-size: 18px;
  margin-top: 60px;
}

/* ===== 卡片通用 ===== */
.info-card,
.plan-card,
.vip-card,
.rights-card,
.asset-card {
  background: var(--card-bg);
  border-radius: 18px;
  box-shadow: 0 5px 20px var(--shadow);
  padding: 24px 28px;
  border: 1px solid var(--border);
}

/* ===== 基础信息 ===== */
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
  width: 20px;
  text-align: center;
}
.label {
  color: var(--text-secondary);
  min-width: 100px;
}
.value {
  font-weight: 500;
}

/* ===== 套餐卡片 ===== */
.plan-card .card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.plan-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 15px;
}
.plan-row:last-child {
  margin-bottom: 0;
}
.plan-row .lab {
  color: var(--text-secondary);
  min-width: 100px;
}
.plan-row .val {
  font-weight: 500;
}
.text-blue   { color: #3b82f6; }
.text-green  { color: #10b981; }
.text-orange { color: #f59e0b; }
.text-red    { color: #ef4444; }

/* ===== VIP ===== */
.vip-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  font-size: 24px;
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

/* ===== 权益 / 财产 / 黑名单共用 ===== */
.rights-title,
.asset-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
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
.right-title .highlight {
  color: var(--primary);
  margin-left: 6px;
}
.right-desc {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>