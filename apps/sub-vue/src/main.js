import { createApp } from 'vue';
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';
import App from './App.vue';
import { savePersisted } from './persist-store.js';
import './style.css';

let app;
let lastProps = {};

function render(props = {}) {
  lastProps = props;
  const container = props.container ?? document;
  const mountEl = container.querySelector('#app') ?? document.getElementById('app');
  app = createApp(App, {
    poweredByQiankun: Boolean(qiankunWindow.__POWERED_BY_QIANKUN__),
    appName: props.appName,
    actions: props.actions,
    mainApi: props.mainApi,
    appBridge: props.appBridge,
  });
  app.mount(mountEl);
}

renderWithQiankun({
  bootstrap() {
    console.log('[sub-vue] bootstrap');
  },
  mount(props) {
    console.log('[sub-vue] mount', props.appBridge ? 'with appBridge' : 'NO appBridge');
    render(props);
  },
  unmount() {
    const { appBridge, appName } = lastProps;
    savePersisted({}, appBridge, appName);
    console.log('[sub-vue] unmount, persisted via appBridge');
    app?.unmount();
    app = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
