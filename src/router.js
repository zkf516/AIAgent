import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from './views/ChatPage.vue'
import UserInfoPage from './views/UserInfoPage.vue'

const routes = [
    { path: '/', name: 'Chat', component: ChatPage },
    { path: '/user', name: 'UserInfo', component: UserInfoPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
