import { createApp } from 'vue';
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';
import App from './App.vue';
import './style.css';

let app;

function render(props = {}) {
  const container = props.container ?? document;
  const mountEl = container.querySelector('#app') ?? document.getElementById('app');
  app = createApp(App, {
    poweredByQiankun: Boolean(qiankunWindow.__POWERED_BY_QIANKUN__),
    mainProps: props,
  });
  app.mount(mountEl);
}

renderWithQiankun({
  bootstrap() {
    console.log('[sub-vue] bootstrap');
  },
  mount(props) {
    console.log('[sub-vue] mount', props);
    render(props);
  },
  unmount() {
    console.log('[sub-vue] unmount');
    app?.unmount();
    app = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
