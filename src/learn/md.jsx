// 极简 Markdown：只支持课程里真正会用到的一点语法，不引第三方库。
//   · 空行分段；连续的行会自动合并成一段（中文之间不加空格）
//   · 每行都以 "- " 开头 → 无序列表；以 "1. " 开头 → 有序列表；以 "> " 开头 → 引用
//   · 三个反引号围起来 → 代码块（会用和只读代码块一样的配色）
//   · 行内：**加粗**、`代码`
import { highlight } from './highlight'

const CJK =
  /[\u2e80-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/

function joinLines(lines) {
  let out = ''
  for (const line of lines) {
    if (out === '') {
      out = line
    } else if (CJK.test(out.slice(-1)) || CJK.test(line.slice(0, 1))) {
      out += line
    } else {
      out += ' ' + line
    }
  }
  return out
}

function inline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function group(text) {
  const blocks = []
  let lines = []
  let fence = null

  function flush() {
    if (lines.length === 0) return
    const items = lines
    if (items.every((l) => l.startsWith('- '))) {
      blocks.push({ kind: 'ul', items: items.map((l) => l.slice(2)) })
    } else if (items.every((l) => /^\d+\.\s/.test(l))) {
      blocks.push({ kind: 'ol', items: items.map((l) => l.replace(/^\d+\.\s/, '')) })
    } else if (items.every((l) => l.startsWith('> '))) {
      blocks.push({ kind: 'quote', items: [joinLines(items.map((l) => l.slice(2)))] })
    } else {
      blocks.push({ kind: 'p', items: [joinLines(items)] })
    }
    lines = []
  }

  for (const raw of String(text).split('\n')) {
    const line = raw.trim()

    if (fence !== null) {
      if (line.startsWith('```')) {
        blocks.push({ kind: 'pre', text: fence.join('\n') })
        fence = null
      } else {
        fence.push(raw.replace(/\s+$/, ''))
      }
      continue
    }

    if (line.startsWith('```')) {
      flush()
      fence = []
      continue
    }

    if (line === '') {
      flush()
      continue
    }

    lines.push(line)
  }

  if (fence !== null) blocks.push({ kind: 'pre', text: fence.join('\n') })
  flush()
  return blocks
}

export function Md({ text }) {
  // text 可以是字符串，也可以是「一行一个字符串」的数组（推荐，省去转义的麻烦）
  const source = Array.isArray(text) ? text.join('\n') : String(text ?? '')
  return (
    <>
      {group(source).map((block, i) => {
        if (block.kind === 'ul') {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          )
        }
        if (block.kind === 'ol') {
          return (
            <ol key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ol>
          )
        }
        if (block.kind === 'pre') {
          return (
            <pre key={i} className="md-pre">
              {highlight(block.text)}
            </pre>
          )
        }
        return <p key={i}>{inline(block.items[0])}</p>
      })}
    </>
  )
}