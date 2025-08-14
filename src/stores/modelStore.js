import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelStore = defineStore('model', () => {
    const models = ref([
        { name: 'deepseek-R1', icon: '/deepseek.svg', apikey: 'sk-8063db03ab5749099d809c8967f5c951'},
        { name: 'gpt-4o-mini', icon: '/openai-logo.svg' },
        { name: 'qwen-max', icon: '/qwen.svg' },
        { name: 'qwen-vl-max', icon: '/qwen.svg' },
        { name: 'qwen2.5-7b-instruct', icon: '/qwen.svg' },
        { name: 'zhiling-chat', icon: '/zhiling-logo.svg' }
    ])
    const currentModel = ref(models.value[0].name)
    const showModelDropdown = ref(false)
    const apikey = ref(models.value[0].apikey)

    function selectModel(model) {
        currentModel.value = model.name
        apikey.value = model.apikey
        showModelDropdown.value = false
        console.log('Selected model:', model.name, 'API Key:', model.apikey)
    }

    function addModel(model) {
        if (model && model.name && model.api) {
            // 检查重名
            if (models.value.some(m => m.name === model.name)) {
                alert('模型名称已存在')
                return
            }
            models.value.push({ name: model.name, icon: model.icon || 'bi bi-openai', api: model.api })
            showModelDropdown.value = false
        } else {
            alert('模型信息不完整')
        }
    }

    function toggleModelDropdown() {
        //console.log('toggle')
        showModelDropdown.value = !showModelDropdown.value
    }

    function closeModelDropdown() {
        showModelDropdown.value = false
    }

    return { models, currentModel, showModelDropdown, selectModel, addModel, toggleModelDropdown, closeModelDropdown }
})