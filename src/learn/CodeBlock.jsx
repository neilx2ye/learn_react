import { useState } from 'react'
import { highlight } from './highlight'

// 只读的代码展示块：带标题和「复制」（手机上长按选中很麻烦，所以给个按钮）
export default function CodeBlock({ code, title }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-block">
      <div className="code-head">
        <span className="code-title">{title || '示例代码'}</span>
        <button type="button" className="copy-btn" onClick={copy}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre>
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}