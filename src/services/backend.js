// 通用模型请求与响应解析工具，基于 model_schemas.json 配置
import modelSchemas from './model_schemas.json'

/**
 * 动态组装请求
 * @param {string} model - 模型名
 * @param {object} params - 参数， apiKey, model, messages, extra
 * @returns {object} - fetch 请求参数
 */
export function buildRequestBySchema(model, params) {
    const schema = modelSchemas[model]
    // 替换 body.messages
    const body = { ...schema.request.body }
    if (typeof body.messages === 'string' && body.messages === '${messages}') {
        body.messages = params.messages
    }
    // 替换 headers
    const headers = {}
    for (const k in schema.request.headers) {
        headers[k] = schema.request.headers[k].replace(/\$\{(\w+)\}/g, (_, key) => params[key])
    }
    return {
        url: schema.request.url,
        method: schema.request.method,
        headers,
        body: JSON.stringify(body)
    }
}

/**
 * 通用 SSE 流式响应解析
 * @param {object} schema - modelSchemas[model].response
 * @param {Response} response - fetch Response
 * @returns {AsyncGenerator<object>}
 */
export async function* parseResponseBySchema(schema, response) {
    if (schema.type === 'sse-stream') {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        let done = false
        while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
            let lines = buffer.split('\n')
            buffer = lines.pop()
            for (const line of lines) {
                if (!line.trim() || !line.startsWith(schema.linePrefix)) continue
                const jsonStr = line.replace(schema.linePrefix, '').trim()
                if (jsonStr === schema.endFlag) continue
                try {
                    const data = JSON.parse(jsonStr)
                    // 取 jsonPath 字段
                    let delta = data
                    for (const seg of schema.jsonPath.split(/[.\[\]]+/).filter(Boolean)) {
                        delta = delta?.[seg]
                    }
                    if (delta) {
                        const result = {}
                        for (const key in schema.fields) {
                            result[key] = delta[schema.fields[key]]
                        }
                        yield result
                    }
                } catch { }
            }
        }
    } else if (schema.type === 'json') {
        // 非流式，直接解析 json
        const data = await response.json()
        let delta = data
        for (const seg of schema.jsonPath.split(/[.\[\]]+/).filter(Boolean)) {
            delta = delta?.[seg]
        }
        if (delta) {
            const result = {}
            for (const key in schema.fields) {
                result[key] = delta[schema.fields[key]]
            }
            yield result
        }
    }
}

/**
 * 统一入口：发送请求并返回 Response
 * @param {string} model - 模型名
 * @param {object} params - 参数
 * @returns {Promise<Response>}
 */
export async function sendMessageByModel(model, params) {
    const schema = modelSchemas[model]
    const req = buildRequestBySchema(model, params)
    console.log('Sending request:', req)
    const response = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body
    })
    console.log('Received response:', response)
    return response
}

// 用法示例：
// const response = await sendMessageByModel('deepseek', { apiKey, model, messages })
// for await (const chunk of parseResponseBySchema(modelSchemas['deepseek'].response, response)) {
//   // chunk.content, chunk.reasoning_content
// }
