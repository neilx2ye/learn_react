# React 以练代学

一个「手机上随时能学」的 React 自学环境：读一小段知识点 → 在浏览器里直接改代码看结果 → 打勾自查。
14 节课，从 JSX 一路做到待办清单和数据看板，进度存在手机本地。

**怎么在手机上打开：看 [ROADMAP.md](./ROADMAP.md)。**

```bash
npm install
npm run dev       # 终端里的 Network 地址就是手机要打开的网址
```

## 技术栈与结构

- Vite + React 19，没有 UI 框架，没有状态库，全部自己写
- `src/learn/` —— 学习环境本身
  - `Playground.jsx`：练习场。浏览器里用 `@babel/standalone` 把 JSX 编译成可执行代码（点「运行」时才动态加载这个编译器），渲染进一个独立 iframe，样式互不干扰；带错误边界和渲染次数护栏，写出死循环也不会把页面卡死
  - `md.jsx` / `highlight.jsx` / `CodeBlock.jsx`：课程正文用的极简 Markdown 和代码高亮（自己写的，不引库）
  - `Quiz.jsx` / `TaskList.jsx`：小测与打勾清单
  - `progress.js`：学习进度（localStorage + `useSyncExternalStore`）
- `src/lessons/LessonNN.js` —— 课程内容，纯数据；格式契约见 `src/lessons/_FORMAT.md`
- `src/styles/base.css` 是设计变量与通用零件（预览窗口共用），`src/styles/app.css` 是手机优先的外壳
- `public/sw.js` —— Service Worker，打包后离线可用（只在生产构建里注册）

## 命令

```bash
npm run dev        # 开发（同一 Wi-Fi 下的手机可直接访问）
npm run build      # 打包
npm run preview    # 预览打包结果，端口 4173，带离线能力
npm run lint       # oxlint
npm run check      # 课程自检：结构 + 每个练习场真编译真渲染一遍
```