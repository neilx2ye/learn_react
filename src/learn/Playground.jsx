import { Component, useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import baseCss from '../styles/base.css?raw'
import { compileDemo, evaluate } from './compile'
import { Md } from './md'
import { pick, progress, useProgress } from './progress'

const PREVIEW_CSS = `
html, body { height: auto; }
body { padding: 14px; }
#root { min-height: 1px; }
`

// 渲染次数护栏：万一写出「无限循环」，及时刹住，别让手机发烫
let guard = { t: 0, n: 0 }

function Guard({ children }) {
  const now = Date.now()
  if (now - guard.t > 400) {
    guard = { t: now, n: 1 }
  } else if (++guard.n > 90) {
    guard.n = 0
    throw new Error(
      '渲染次数异常，可能是无限循环。检查 useEffect 的依赖数组，也不要在渲染过程中直接调用 setState。',
    )
  }
  return children
}

class PreviewBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    this.props.onError(error?.message || String(error))
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

// 把组件渲染进一个独立的 iframe：自己的小窗口，样式互不干扰
function paint(frame, Component, onError) {
  guard = { t: 0, n: 0 }
  const doc = frame.contentDocument
  doc.open()
  doc.write(
    '<!doctype html><html><head><meta charset="utf-8">' +
      `<style>${baseCss}${PREVIEW_CSS}</style>` +
      '</head><body><div id="root"></div></body></html>',
  )
  doc.close()
  const root = createRoot(doc.getElementById('root'))
  root.render(
    <PreviewBoundary key={Date.now()} onError={onError}>
      <Guard>
        <Component />
      </Guard>
    </PreviewBoundary>,
  )
}

export default function Playground({ demoKey, code, task, height = 240 }) {
  const state = useProgress()
  const saved = pick.demo(state, demoKey)
  const [text, setText] = useState(() => (saved === undefined ? code : saved))
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const frameRef = useRef(null)
  const firstText = useRef(text)
  const pending = useRef(null)
  const saveTimer = useRef(null)
  const mountedFor = useRef(demoKey)

  const run = useCallback(async (source) => {
    const frame = frameRef.current
    if (!frame) return
    setStatus('running')
    setMessage('')

    let Comp
    try {
      Comp = evaluate(await compileDemo(source))
      if (!Comp) {
        throw new Error(
          '没有找到要渲染的组件：请把组件命名为 App，或者在代码最后写 export default 你的组件名',
        )
      }
    } catch (err) {
      setStatus('error')
      setMessage(String(err?.message || err))
      return
    }

    try {
      paint(frame, Comp, (msg) => {
        setStatus('error')
        setMessage('运行出错：' + msg)
      })
      setStatus('ok')
    } catch (err) {
      setStatus('error')
      setMessage('运行出错：' + String(err?.message || err))
    }
  }, [])

  // 进来就自动跑一次，先看到结果再动手改
  useEffect(() => {
    run(firstText.current)
  }, [run])

  // 兜底：万一这个练习场被复用到了另一课（上层没用 key 包），也要换成新那一课的代码
  useEffect(() => {
    if (mountedFor.current === demoKey) return
    mountedFor.current = demoKey
    const next = saved === undefined ? code : saved
    firstText.current = next
    setText(next)
    run(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoKey])

  // 离开这一课时，把还没保存的改动补上
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (pending.current !== null) progress.setDemo(demoKey, pending.current)
    },
    [demoKey],
  )

  function change(next) {
    setText(next)
    pending.current = next
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => progress.setDemo(demoKey, next), 600)
  }

  function reset() {
    // 连「还没存盘的改动」也要一起丢掉，否则离开这一课时会被补存回去
    if (saveTimer.current) clearTimeout(saveTimer.current)
    pending.current = null
    progress.clearDemo(demoKey)
    setText(code)
    run(code)
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      run(text)
    }
  }

  return (
    <div className="playground">
      {task ? (
        <div className="pg-task">
          <Md text={task} />
        </div>
      ) : null}

      <div className="pg-head">
        <span className="pg-label">可以改的代码</span>
        <button type="button" className="btn" onClick={reset}>
          还原
        </button>
        <button type="button" className="btn primary" onClick={() => run(text)}>
          运行
        </button>
      </div>

      <textarea
        className="editor"
        value={text}
        onChange={(e) => change(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="示例代码，可以编辑"
      />

      <div className={'pg-status ' + (status === 'error' ? 'err' : status === 'ok' ? 'ok' : '')}>
        {status === 'running' ? '编译中…' : null}
        {status === 'ok' ? '✓ 运行成功' : null}
        {status === 'error' ? '✗ 没跑起来' : null}
        <span className="muted">改动会存在手机上，下次打开还在</span>
      </div>

      {message ? <pre className="pg-error">{message}</pre> : null}

      <div className="preview">
        <iframe ref={frameRef} className="preview-frame" style={{ height }} title="运行结果" />
      </div>
    </div>
  )
}