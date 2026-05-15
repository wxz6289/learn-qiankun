import { initGlobalState } from 'qiankun';

const defaultAppState = {
  'sub-react': { count: 0, input: '' },
  'sub-vue': { count: 0, input: '' },
};

/** 主应用内存中的子应用状态（不依赖 unmount 时机） */
const appStateStore = structuredClone(defaultAppState);

const initialState = {
  message: '欢迎使用 qiankun',
  lastPublisher: 'main',
  updatedAt: Date.now(),
  appState: structuredClone(appStateStore),
};

/** @type {import('qiankun').MicroAppStateActions} */
export const globalActions = initGlobalState(initialState);

let latestState = { ...initialState };

const commLog = document.getElementById('comm-log');
const stateDisplay = document.getElementById('global-state-display');
const mainInput = document.getElementById('main-message-input');
const mainSendBtn = document.getElementById('main-send-btn');

export const appBridge = {
  getAppState(appName) {
    return { ...(appStateStore[appName] ?? defaultAppState[appName] ?? { count: 0, input: '' }) };
  },
  saveAppState(appName, partial) {
    if (!appName || !appStateStore[appName]) return;
    appStateStore[appName] = {
      ...appStateStore[appName],
      ...partial,
    };
    globalActions.setGlobalState({
      appState: structuredClone(appStateStore),
    });
  },
};

function appendLog(text) {
  if (!commLog) return;
  const item = document.createElement('li');
  item.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  commLog.prepend(item);
  while (commLog.children.length > 12) {
    commLog.lastElementChild?.remove();
  }
}

function renderState(state) {
  if (stateDisplay) {
    stateDisplay.textContent = JSON.stringify(state);
  }
}

export function setupMainCommunication() {
  globalActions.onGlobalStateChange((state) => {
    latestState = state;
    if (state.appState) {
      Object.keys(state.appState).forEach((key) => {
        if (appStateStore[key]) {
          appStateStore[key] = { ...appStateStore[key], ...state.appState[key] };
        }
      });
    }
    renderState(state);
    if (state.lastPublisher !== 'main') {
      appendLog(`收到全局状态 · 来自 ${state.lastPublisher}：${state.message}`);
    }
  }, true);

  mainSendBtn?.addEventListener('click', () => {
    const message = mainInput?.value?.trim() || '（空消息）';
    globalActions.setGlobalState({
      message,
      lastPublisher: 'main',
      updatedAt: Date.now(),
      appState: structuredClone(appStateStore),
    });
    appendLog(`主应用已广播：${message}`);
    if (mainInput) mainInput.value = '';
  });

  return {
    mainApi: {
      notify(from, payload) {
        appendLog(`子应用 ${from} 调用 mainApi.notify：${JSON.stringify(payload)}`);
      },
    },
    actions: globalActions,
    appBridge,
  };
}

export function createMicroAppProps(shared) {
  return {
    actions: shared.actions,
    mainApi: shared.mainApi,
    appBridge: shared.appBridge,
    appName: '',
  };
}
