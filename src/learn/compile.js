// 把课程里的示例代码，在手机浏览器里现编译现运行（不联网、不用装任何东西）。
//
// 做法：
//   1. 预处理：把 import / export default 换成这个「小环境」能跑的写法
//   2. 用 @babel/standalone 把 JSX 编译成普通的 React.createElement 调用
//   3. new Function(...) 执行，拿回组件
//
// 这个文件不依赖浏览器 API，所以 Node 脚本（scripts/check-lessons.mjs）能直接复用。
import React from 'react'

let babelPromise = null

function loadBabel() {
  if (!babelPromise) {
    babelPromise = import('@babel/standalone').then((m) => m.default ?? m)
  }
  return babelPromise
}

// 没写 import 时兜底注入这些名字（写了 import 就按 import 来，不重复注入）
const HOOKS = [
  'useState',
  'useEffect',
  'useMemo',
  'useCallback',
  'useRef',
  'useReducer',
  'useContext',
  'useLayoutEffect',
  'useId',
  'useDeferredValue',
  'useTransition',
  'createContext',
  'memo',
  'forwardRef',
  'Fragment',
  'StrictMode',
  'createElement',
  'cloneElement',
]

// import xxx from 'yyy'（允许跨行、允许行尾注释）
const IMPORT_RE =
  /^[ \t]*import\s+([\s\S]*?)\s+from\s*['"]([^'"]+)['"][ \t]*;?[ \t]*(?:\/\/[^\n]*)?$/gm
// import 'yyy'（只引样式之类的副作用导入，直接删掉）
const SIDE_IMPORT_RE = /^[ \t]*import\s*['"][^'"]+['"][ \t]*;?[ \t]*(?:\/\/[^\n]*)?$/gm

function namedSpecifiers(clause) {
  const brace = clause.match(/\{([\s\S]*)\}/)
  if (!brace) return []
  return brace[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const alias = s.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/)
      return alias ? `${alias[1]}: ${alias[2]}` : s
    })
}

function usesHooks(src) {
  return /\buse[A-Z]|createContext|\bmemo\b|\bforwardRef\b/.test(src)
}

/** 预处理：让示例代码能在「只有 React 一个变量」的环境里跑起来 */
export function prepare(code) {
  let src = String(code).replace(/^[ \t]*export\s+default\s+/gm, 'const __default = ')
  let gotNamed = false

  src = src.replace(IMPORT_RE, (_all, clause, source) => {
    if (!/^react$/i.test(source)) return ''
    const names = namedSpecifiers(clause)
    if (names.length === 0) return ''
    gotNamed = true
    return `const { ${names.join(', ')} } = React;`
  })
  src = src.replace(SIDE_IMPORT_RE, '')

  const declaresOwnHooks = /const\s*\{[^}]*\}\s*=\s*React/.test(src)
  if (!gotNamed && !declaresOwnHooks && usesHooks(src)) {
    src = `const { ${HOOKS.join(', ')} } = React;\n${src}`
  }
  return src
}

/** 编译：JSX → React.createElement */
export async function compileDemo(code) {
  const Babel = await loadBabel()
  return Babel.transform(prepare(code), {
    filename: 'demo.jsx',
    sourceType: 'script',
    presets: [['react', { runtime: 'classic' }]],
  }).code
}

/** 执行编译结果，拿回组件（约定：名叫 App，或者 export default 出来的那个） */
export function evaluate(transformed) {
  const body =
    `${transformed}\n` +
    'return (typeof __default !== "undefined" && __default) || ' +
    '(typeof App !== "undefined" && App) || null;'
  return new Function('React', body)(React) // eslint-disable-line no-new-func
}

/** 一步到位：编译 + 执行 */
export async function compileAndRun(code) {
  const Component = evaluate(await compileDemo(code))
  if (!Component) {
    throw new Error(
      '没有找到要渲染的组件：请把组件命名为 App，或者在代码最后写 export default 你的组件名',
    )
  }
  return Component
}