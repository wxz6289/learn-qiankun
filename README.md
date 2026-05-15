# qiankun 微前端示例

基于 [qiankun](https://qiankun.umijs.org/) **2.10.16**（当前 npm latest）的 monorepo 示例：一个主应用 + React / Vue 两个子应用，使用 Vite 开发与构建。

## 结构

```
apps/
  main/        # 主应用：注册子应用、路由激活、挂载容器
  sub-react/   # React 子应用（vite-plugin-qiankun）
  sub-vue/     # Vue 3 子应用（vite-plugin-qiankun）
```

| 应用 | 端口 | 激活路由 |
|------|------|----------|
| main | 7100 | `/` |
| sub-react | 7101 | `/react` |
| sub-vue | 7102 | `/vue` |

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:7100](http://localhost:7100)，点击导航切换子应用。

单独启动：

```bash
npm run dev:main    # 仅主应用
npm run dev:react   # 仅 React 子应用（可独立访问 7101）
npm run dev:vue     # 仅 Vue 子应用（可独立访问 7102）
```

## 应用通信

示例演示两种 qiankun 通信方式（见 `apps/main/src/communication.js`）：

| 方式 | 方向 | 说明 |
|------|------|------|
| `initGlobalState` | 主 ↔ 子、子 ↔ 子 | 主应用创建 `globalActions`，通过 `props.actions` 传给子应用；任意一方 `setGlobalState`，其它方 `onGlobalStateChange` 收到更新 |
| `props.mainApi` | 子 → 主 | 主应用传入回调对象，子应用在 `mount(props)` 中调用 `props.mainApi.notify(...)` |

**试用步骤：**

1. `npm run dev`，打开 http://localhost:7100
2. 在顶部「应用通信」面板主应用发送消息 → 进入 React / Vue 子应用可看到全局状态同步
3. 在 React 子应用点击 `setGlobalState` → 切换到 Vue 子应用，状态已更新；主应用日志同步
4. 子应用点击 `mainApi.notify` → 主应用通信日志出现对应条目

### 切换子应用时状态持久化

qiankun 路由切换会 **unmount** 子应用。示例采用双重保障：

1. **子应用模块缓存** `persist-store.js`：bundle 内变量在 unmount 后仍存在，`count` / `input` 变更时实时写入。
2. **主应用 `appBridge`**：同步到 `initGlobalState.appState`，顶部面板可查看，并在 `unmount` 生命周期再次刷盘。

挂载时 `loadPersisted()` 合并主应用与子应用本地缓存后初始化 UI。

## 要点

- 主应用：`registerMicroApps` + `start()`，子应用 `entry` 指向各 dev server。
- 子应用：通过 `vite-plugin-qiankun` 导出 `bootstrap` / `mount` / `unmount`，并支持脱离主应用独立运行。
- **开发注意**：子应用 `useDevMode: true` 时须设置 `server.hmr: false`（见子应用 `vite.config.js`），否则 Vite 注入的 `@react-refresh` 会被 qiankun 当普通脚本执行并报 `Cannot use import statement outside a module`。
- 生产构建时子应用将 `useDevMode` 设为 `false`，并配置 `base` 为部署域名。
- 生产环境需将子应用构建产物部署到可访问 URL，并更新主应用中的 `entry`。

## 参考

- [qiankun 快速上手](https://qiankun.umijs.org/guide/getting-started)
- [vite-plugin-qiankun](https://github.com/tengmaoqing/vite-plugin-qiankun)
