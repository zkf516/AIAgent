import './main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

// 只用 window.innerHeight 变化时让 .input-container 上移，键盘弹出时上移，收起时还原
// 只面向 Android，不考虑 iOS
// let originalHeight;

// function recordHeight() {
//     originalHeight = window.innerHeight;
// }

// function moveInputContainerOnKeyboard() {
//     const inputEl = document.querySelector('.input-container');
//     if (!inputEl) return;

//     const dh = originalHeight - window.innerHeight;
//     if (dh > 20) {                       // 阈值改小
//         inputEl.style.transition = 'transform .2s';
//         inputEl.style.transform = `translateY(-${dh}px)`;
//     } else {
//         inputEl.style.transform = '';
//     }
// }

// // 在输入框获得焦点时重新记一次“原始高度”
// window.addEventListener('focusin', recordHeight);
// window.addEventListener('resize', moveInputContainerOnKeyboard);




// 输入框获得焦点时让输入栏整体上移40px，失焦恢复
// function moveInputUpOnFocus() {
//     const inputEl = document.querySelector('.input-container')
//     if (!inputEl) return
//     inputEl.style.transition = 'transform 0.2s';
//     inputEl.style.transform = 'translateY(-100px)';
// }
// function resetInputPosition() {
//     const inputEl = document.querySelector('.input-container')
//     if (!inputEl) return
//     inputEl.style.transform = '';
// }
// window.addEventListener('focusin', e => {
//     if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
//         moveInputUpOnFocus();
//     }
// });
// window.addEventListener('focusout', e => {
//     if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
//         resetInputPosition();
//     }
// });
