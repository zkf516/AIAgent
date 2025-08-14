import { createRouter, createWebHistory } from 'vue-router'

import ChatPage from './views/ChatPage.vue'
import UserInfoPage from './views/UserInfoPage.vue'
import PhoncCallPage from './views/PhoneCallPage.vue'
import ThemeSettingsPage from './views/ThemeSettingsPage.vue'


const routes = [
    { path: '/', name: 'Chat', component: ChatPage },
    { path: '/user', name: 'UserInfo', component: UserInfoPage },
    { path: '/phonecall', name: 'PhoneCall', component: PhoncCallPage },
    { path: '/theme', name: 'ThemeSettings', component: ThemeSettingsPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
