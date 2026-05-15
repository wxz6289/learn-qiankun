import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';
import App from './App.jsx';
import './style.css';

let root;

function render(props = {}) {
  const container = props.container ?? document;
  const mountEl = container.querySelector('#root') ?? document.getElementById('root');
  root = createRoot(mountEl);
  root.render(
    <App poweredByQiankun={Boolean(qiankunWindow.__POWERED_BY_QIANKUN__)} props={props} />,
  );
}

renderWithQiankun({
  bootstrap() {
    console.log('[sub-react] bootstrap');
  },
  mount(props) {
    console.log('[sub-react] mount', props);
    render(props);
  },
  unmount() {
    console.log('[sub-react] unmount');
    root?.unmount();
    root = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
