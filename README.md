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

## 要点

- 主应用：`registerMicroApps` + `start()`，子应用 `entry` 指向各 dev server。
- 子应用：通过 `vite-plugin-qiankun` 导出 `bootstrap` / `mount` / `unmount`，并支持脱离主应用独立运行。
- 生产环境需将子应用构建产物部署到可访问 URL，并更新主应用中的 `entry`。

## 参考

- [qiankun 快速上手](https://qiankun.umijs.org/guide/getting-started)
- [vite-plugin-qiankun](https://github.com/tengmaoqing/vite-plugin-qiankun)
