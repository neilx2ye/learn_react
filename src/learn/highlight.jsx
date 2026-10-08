// 给代码块上色：一个够用的正则分词器，不引第三方库。
// 顺序很重要：注释 → 字符串 → 关键字 → 数字 → 标签。
const RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|for|of|in|while|do|switch|case|default|break|continue|import|from|export|new|typeof|instanceof|delete|void|class|extends|super|this|try|catch|finally|throw|async|await|yield|null|undefined|true|false)\b|\b(\d+(?:\.\d+)?)\b|(<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*|\/>|<\/>)/g

export function highlight(code) {
  const out = []
  let last = 0
  let i = 0
  let m
  RE.lastIndex = 0

  while ((m = RE.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const kind = m[1] ? 'comment' : m[2] ? 'string' : m[3] ? 'keyword' : m[4] ? 'number' : 'tag'
    out.push(
      <span key={i++} className={'tk-' + kind}>
        {m[0]}
      </span>,
    )
    last = RE.lastIndex
  }

  if (last < code.length) out.push(code.slice(last))
  return out
}