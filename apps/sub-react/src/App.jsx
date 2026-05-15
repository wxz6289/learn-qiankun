import { useState } from 'react';

export default function App({ poweredByQiankun, props = {} }) {
  const [count, setCount] = useState(0);

  return (
    <div className="subapp subapp--react">
      <h2>React 子应用</h2>
      <p>
        {poweredByQiankun
          ? `由 qiankun 挂载，主应用传入：${JSON.stringify(props)}`
          : '独立运行模式（未接入主应用）'}
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        count: {count}
      </button>
    </div>
  );
}
