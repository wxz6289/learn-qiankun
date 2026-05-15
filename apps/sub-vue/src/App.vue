<script setup>
import { onMounted, ref, watch } from 'vue';
import { loadPersisted, savePersisted } from './persist-store.js';

const props = defineProps({
  poweredByQiankun: Boolean,
  appName: { type: String, default: 'sub-vue' },
  actions: { type: Object, default: null },
  mainApi: { type: Object, default: null },
  appBridge: { type: Object, default: null },
});

const initial = props.poweredByQiankun
  ? loadPersisted(props.appBridge, props.appName)
  : { count: 0, input: '' };

const count = ref(initial.count);
const globalState = ref(null);
const input = ref(initial.input);
let active = false;

onMounted(() => {
  if (!props.poweredByQiankun || !props.actions?.onGlobalStateChange) return;
  active = true;
  props.actions.onGlobalStateChange((state) => {
    if (active) globalState.value = { ...state };
  }, true);
});

watch([count, input], () => {
  if (!props.poweredByQiankun) return;
  savePersisted(
    { count: count.value, input: input.value },
    props.appBridge,
    props.appName,
  );
});

function broadcast() {
  const message = input.value.trim() || '（来自 Vue 的空消息）';
  props.actions?.setGlobalState?.({
    message,
    lastPublisher: props.appName,
    updatedAt: Date.now(),
  });
  const nextInput = '';
  input.value = nextInput;
  savePersisted({ count: count.value, input: nextInput }, props.appBridge, props.appName);
}

function notifyMain() {
  props.mainApi?.notify?.(props.appName, { type: 'ping', count: count.value, at: Date.now() });
}
</script>

<template>
  <div class="subapp subapp--vue">
    <h2>Vue 子应用</h2>
    <p v-if="!poweredByQiankun">独立运行模式（未接入主应用）</p>
    <p v-else class="persist-hint">
      切换至其它子应用再返回，本地 count / 输入框会保留（已同步 count={{ count }}）
    </p>

    <section v-if="poweredByQiankun" class="comm">
      <h3>通信</h3>
      <p class="comm-state">
        全局状态：
        <code>{{ globalState ? JSON.stringify(globalState) : '—' }}</code>
      </p>
      <div class="comm-row">
        <input
          v-model="input"
          type="text"
          placeholder="广播给主应用与其它子应用"
        >
        <button type="button" @click="broadcast">setGlobalState</button>
        <button type="button" class="btn-secondary" @click="notifyMain">
          mainApi.notify
        </button>
      </div>
    </section>

    <button type="button" @click="count++">本地 count: {{ count }}</button>
  </div>
</template>
