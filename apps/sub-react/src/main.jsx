import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';
import App from './App.jsx';
import { savePersisted } from './persist-store.js';
import './style.css';

let root;
let lastProps = {};

function render(props = {}) {
  lastProps = props;
  const container = props.container ?? document;
  const mountEl = container.querySelector('#root') ?? document.getElementById('root');
  root = createRoot(mountEl);
  root.render(
    <App
      poweredByQiankun={Boolean(qiankunWindow.__POWERED_BY_QIANKUN__)}
      appName={props.appName}
      actions={props.actions}
      mainApi={props.mainApi}
      appBridge={props.appBridge}
    />,
  );
}

renderWithQiankun({
  bootstrap() {
    console.log('[sub-react] bootstrap');
  },
  mount(props) {
    console.log('[sub-react] mount', props.appBridge ? 'with appBridge' : 'NO appBridge');
    render(props);
  },
  unmount() {
    const { appBridge, appName } = lastProps;
    savePersisted({}, appBridge, appName);
    console.log('[sub-react] unmount, persisted via appBridge');
    root?.unmount();
    root = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
