import { useEffect, useState } from 'react';
import { loadPersisted, savePersisted } from './persist-store.js';

export default function App({
  poweredByQiankun,
  appName = 'sub-react',
  actions,
  mainApi,
  appBridge,
}) {
  const initial = poweredByQiankun
    ? loadPersisted(appBridge, appName)
    : { count: 0, input: '' };

  const [count, setCount] = useState(initial.count);
  const [globalState, setGlobalState] = useState(null);
  const [input, setInput] = useState(initial.input);

  useEffect(() => {
    if (!poweredByQiankun || !actions?.onGlobalStateChange) return undefined;

    let active = true;
    actions.onGlobalStateChange((state) => {
      if (active) setGlobalState({ ...state });
    }, true);

    return () => {
      active = false;
    };
  }, [poweredByQiankun, actions]);

  useEffect(() => {
    if (!poweredByQiankun) return;
    savePersisted({ count, input }, appBridge, appName);
  }, [count, input, poweredByQiankun, appBridge, appName]);

  function broadcast() {
    const message = input.trim() || '（来自 React 的空消息）';
    actions?.setGlobalState?.({
      message,
      lastPublisher: appName,
      updatedAt: Date.now(),
    });
    const nextInput = '';
    setInput(nextInput);
    savePersisted({ count, input: nextInput }, appBridge, appName);
  }

  function notifyMain() {
    mainApi?.notify?.(appName, { type: 'ping', count, at: Date.now() });
  }

  return (
    <div className="subapp subapp--react">
      <h2>React 子应用</h2>
      {!poweredByQiankun && <p>独立运行模式（未接入主应用）</p>}
      {poweredByQiankun && (
        <p className="persist-hint">
          切换至其它子应用再返回，本地 count / 输入框会保留（已同步 count={count}）
        </p>
      )}

      {poweredByQiankun && (
        <section className="comm">
          <h3>通信</h3>
          <p className="comm-state">
            全局状态：
            <code>{globalState ? JSON.stringify(globalState) : '—'}</code>
          </p>
          <div className="comm-row">
            <input
              type="text"
              value={input}
              placeholder="广播给主应用与其它子应用"
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="button" onClick={broadcast}>setGlobalState</button>
            <button type="button" className="btn-secondary" onClick={notifyMain}>
              mainApi.notify
            </button>
          </div>
        </section>
      )}

      <button type="button" onClick={() => setCount((c) => c + 1)}>
        本地 count: {count}
      </button>
    </div>
  );
}
