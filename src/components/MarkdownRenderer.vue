<script setup>
import MarkdownIt from 'markdown-it'
import texmath from 'markdown-it-texmath'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'markdown-it-texmath/css/texmath.css'

const props = defineProps({
  content: String
})

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
}).use(texmath, {
    engine: katex,
    delimiters: 'dollars',
  })
  .use(texmath, {
    engine: katex,
    delimiters: 'brackets',
  //   katexOptions: {
  //     strict: false,    // 允许未知字符
  //     trust: true,      // 允许特殊命令
  //     fleqn: true       // 可选，左对齐
  // }
  })

import { computed } from 'vue'
const rendered = computed(() => md.render(props.content || ''))
</script>

<template>
  <div class="markdown-body" v-html="rendered"></div>
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
