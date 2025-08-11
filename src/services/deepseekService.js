
// ====== DeepSeek API 配置常量 ======
// API 地址
export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
// 默认模型
export const DEFAULT_MODEL = 'deepseek-reasoner'
// 默认 API Key（建议用安全方式传递，仅作占位）
export const DEFAULT_API_KEY = 'sk-8063db03ab5749099d809c8967f5c951'



// 与 DeepSeek API 通信，发送消息并获取 AI 回复
/**
 * 与 DeepSeek API 通信，支持多轮上下文和流式响应
 * @param {Array} messages - 聊天上下文数组 [{role: 'user'|'assistant', content: '...'}]
 * @param {Object} options - 额外参数，如 model、apiKey、extra
 * @returns {AsyncGenerator} - 异步生成器，逐步产出 AI 回复的 chunk 数据
 */

/**
 * 发送 DeepSeek 请求，返回 fetch Response
 * @param {Array} messages - 聊天上下文
 * @param {Object} options - 额外参数
 * @returns {Promise<Response>} - fetch Response
 */
export async function sendMessageRequest(messages, options = {}) {
    const payload = {
        model: options.model || DEFAULT_MODEL,
        messages,
        stream: true,   // 流式开关
        ...options.extra    //支持其他参数
    }
    const apiKey = options.apiKey || DEFAULT_API_KEY
    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    })
    if (!response.body) throw new Error('No response body')
    //console.log('DeepSeek API Response:', response)
    return response
}

/**
 * 解析 DeepSeek 流式响应，支持思维链(reasoning_content)和最终内容(content)的流式拼接
 * @param {ReadableStream} stream - fetch Response.body
 * @returns {AsyncGenerator<{reasoning_content?: string, content?: string, raw: any}>}
 */
export async function* parseDeepseekStream(stream) {
    // 获取流的 reader，用于逐步读取数据
    const reader = stream.getReader()
    // 创建解码器，将字节流转为字符串
    const decoder = new TextDecoder('utf-8')
    let done = false
    let buffer = '' // 缓存未完整解析的 chunk
    while (!done) {
        // 读取一段数据（value为Uint8Array，done为是否结束）
        const { value, done: doneReading } = await reader.read()
        done = doneReading // 更新循环条件
        // 解码为字符串并拼接到 buffer，stream: !done 保证最后一段完整
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
        // 按行分割，每行理论上是一个 SSE data: 行
        let lines = buffer.split('\n')
        buffer = lines.pop() // 可能有半截，留到下次拼接
        for (const line of lines) {
            // 跳过空行
            if (!line.trim()) continue
            // 只处理以 "data:" 开头的行
            if (!line.startsWith('data:')) continue
            const jsonStr = line.replace(/^data:\s*/, '')
            if (jsonStr === '[DONE]') continue // 结束标记
            try {
                const data = JSON.parse(jsonStr)
                const delta = data.choices?.[0]?.delta || {}
                yield {
                    reasoning_content: delta.reasoning_content, // 思维链内容
                    content: delta.content, // 最终回答内容
                    raw: data // 原始 chunk 数据
                }
                // console.log('DeepSeek API Response:', data)
            } catch (e) {
                // console.log('Parsing DeepSeek stream...', jsonStr)
                // 跳过解析失败的行
            }
        }
    }
}
