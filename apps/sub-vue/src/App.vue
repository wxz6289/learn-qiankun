<script setup>
import { ref } from 'vue';

defineProps({
  poweredByQiankun: Boolean,
  mainProps: { type: Object, default: () => ({}) },
});

const count = ref(0);
</script>

<template>
  <div class="subapp subapp--vue">
    <h2>Vue 子应用</h2>
    <p v-if="poweredByQiankun">
      由 qiankun 挂载，主应用传入：{{ JSON.stringify(mainProps) }}
    </p>
    <p v-else>独立运行模式（未接入主应用）</p>
    <button type="button" @click="count++">count: {{ count }}</button>
  </div>
</template>
