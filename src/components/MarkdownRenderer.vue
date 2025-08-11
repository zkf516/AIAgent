<script setup>
import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import 'katex/dist/katex.min.css'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
}).use(markdownItKatex)

defineProps({
  content: String
})
</script>

<template>
  <div class="markdown-body" v-html="md.render(content || '')"></div>
</template>

<style src="github-markdown-css/github-markdown-light.css"></style>
<style>
.markdown-body {
  word-break: break-word;
  background: transparent !important;
  font-size: inherit !important;
  line-height: inherit !important;
}
</style>
