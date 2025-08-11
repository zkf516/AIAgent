// WebSocket 管理与事件分发

let ws = null
let reconnectTimer = null

const listeners = []

export function connectWebSocket(url = 'ws://localhost:3000') {
    if (ws) ws.close()
    ws = new window.WebSocket(url)

    ws.onopen = () => {
        console.log('✅ WebSocket 已连接')
        listeners.forEach(l => l({ type: 'open' }))
    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            listeners.forEach(l => l({ type: 'message', data }))
        } catch (err) {
            console.error('WebSocket消息解析失败:', err)
        }
    }

    ws.onclose = () => {
        console.log('❌ WebSocket 已关闭，5秒后重连...')
        listeners.forEach(l => l({ type: 'close' }))
        reconnectTimer = setTimeout(() => connectWebSocket(url), 5000)
    }

    ws.onerror = (err) => {
        console.error('WebSocket 错误:', err)
        ws.close()
    }
}

export function closeWebSocket() {
    if (ws) ws.close()
    if (reconnectTimer) clearTimeout(reconnectTimer)
}

export function sendWebSocketMessage(msg) {
    if (ws && ws.readyState === 1) {
        ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
}

export function addWebSocketListener(fn) {
    if (typeof fn === 'function') listeners.push(fn)
}

export function removeWebSocketListener(fn) {
    const idx = listeners.indexOf(fn)
    if (idx !== -1) listeners.splice(idx, 1)
}
