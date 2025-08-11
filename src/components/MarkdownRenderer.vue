<script setup>
import { defineComponent, h } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

defineProps({
  content: String
})
</script>

<template>
  <div class="markdown-body" v-html="md.render(content || '')"></div>
</template>

<style scoped>
.markdown-body {
  word-break: break-word;
  padding-left: 0.5em;
}
</style>
