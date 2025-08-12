import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelStore = defineStore('model', () => {
    const models = ref([
        { name: 'DeepSeek', icon: '/deepseek.svg' },
        { name: 'gpt-4o-mini', icon: '/openai-logo.svg' },
        { name: 'qwen-max', icon: '/openai-logo.svg' },
        { name: 'qwen-vl-max', icon: 'bi bi-gem' },
        { name: 'qwen2.5-7b-instruct', icon: 'bi bi-gem' }
    ])
    const currentModel = ref(models.value[0].name)
    const showModelDropdown = ref(false)

    function selectModel(name) {
        currentModel.value = name
        showModelDropdown.value = false
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