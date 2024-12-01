<script setup>
import { ref } from 'vue'

const title = ref('404')
const message = ref('抱歉，你访问的页面不存在。')
</script>
<template>
  <div class="not-found">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f5f5f5;
}

.not-found h1 {
  font-size: 4em;
  margin-bottom: 1em;
}

.not-found p {
  font-size: 1.5em;
  margin-bottom: 2em;
}

.not-found a {
  padding: 0.5em 1em;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.not-found a:hover {
  background-color: #0056b3;
}
</style>
