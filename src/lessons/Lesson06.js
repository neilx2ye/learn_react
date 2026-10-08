// 第 6 课 · 条件渲染
// 格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 6,
    title: '条件渲染',
    stage: '阶段一 · 组件的思维',
    goal: '一个页面，三种状态',
    minutes: 25,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '上一课，输入框里的字已经能实时跑到页面上了 —— 数据活了，可**页面还是只有一副面孔**。',
        '',
        '真实的应用永远不止一副面孔：刚打开在转圈圈（加载中）、筛了半天一条都没有（空列表）、选了「未完成」只剩三条（筛选结果）。',
        '',
        '这些都不是「另一个页面」，而是**同一个组件的不同状态**。这一课要学的就是：看着数据，决定屏幕上哪一块画、哪一块不画。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 三种写法，对应三种需求',
      md: [
        '条件渲染翻来覆去只有三招，用一句需求就能记住每一招：',
        '',
        '**一、要么 A，要么 B —— 三元 `? :`**',
        '',
        '```',
        '{done ? <p>已完成</p> : <p>还没做完</p>}',
        '```',
        '',
        '两边都必须给出结果，屏幕上永远有其中一个。',
        '',
        '**二、满足条件才显示 —— `&&`**',
        '',
        '```',
        '{error && <p>没连上网络</p>}',
        '```',
        '',
        '条件为真就画出来，为假就什么都不画。适合可有可无的提示、警告、徽标。',
        '',
        '**三、后面整块都不要了 —— 提前 return**',
        '',
        '```',
        'if (loading) return <p>正在加载…</p>',
        '// 能走到这里，说明不是加载中，下面照常写',
        '```',
        '',
        '在组件函数的开头把特殊情况处理掉，剩下的代码就不用一层层缩进到最深。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 大括号里只能放「表达式」，不能放「语句」',
      md: [
        '`if`、`for`、`return` 是**语句** —— 它们让程序「去做一件事」，本身不是一个值。',
        '',
        '而 JSX 的大括号 `{}` 只接受**表达式** —— 能算出一个值的东西，比如 `count + 1`、`name`、`done ? "A" : "B"`。',
        '',
        '所以 `{ if (loading) { … } }` 这种写法**连编译都过不去**，报错长什么样，下面那块只读代码里给你看。',
        '',
        '想在页面上做判断只有两条路：把结果先算进变量，或者写成三元 / `&&`。整块不要了就用提前 return —— 那个 `if` 写在 JSX **外面**，完全合法。',
      ],
    },
    {
      type: 'code',
      title: '别抄：这些写法直接报错',
      code: `// ✗ 大括号里塞语句，编译时报 Unexpected token
{ if (loading) { <p>加载中</p> } }

// ✗ for 也一样
{ for (const t of tabs) { <p>{t}</p> } }

// ✓ 换成表达式就没问题
{loading && <p>加载中</p>}
{tabs.map((t) => <p key={t}>{t}</p>)}`,
    },
    {
      type: 'tip',
      title: '一句话选写法',
      md: [
        '- **二选一**（屏幕上必须有 A，或者必须有 B）→ 三元 `? :`',
        '- **可有可无**（有就多一句提示，没有就算了）→ `&&`，左边一定写成明确的布尔判断，比如 `list.length > 0`',
        '- **整块都不要了**（后面几十行是另一码事）→ 提前 `return`',
        '',
        '判断标准只有一句：**看屏幕上有没有「第二个结果」**。没有第二个结果，就别用三元。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 3 · 那个凭空冒出来的 0',
      md: [
        '这是 React 里最有名的一个坑，几乎人人踩过一次：',
        '',
        '```',
        '{list.length && <p>共 {list.length} 条</p>}   // ✗',
        '```',
        '',
        '列表有数据时一切正常，一旦**一条都没有**，页面上就多出一个孤零零的 `0`。',
        '',
        '原因在 `&&` 的行为：左边是假值时，它**不会变成 `false`，而是把这个假值原样返回出去**。空数组的 `length` 是数字 `0`，于是这一格算出来的结果就是 `0`，React 照常把数字 `0` 当文字画了出来。',
        '',
        '改法只有一个动作：把左边写成**明确的判断**。',
        '',
        '```',
        '{list.length > 0 && <p>共 {list.length} 条</p>}   // ✓',
        '```',
        '',
        'React 遇到 `null`、`undefined`、`true`、`false` 会直接跳过、什么都不画。数字 `0` 不在跳过之列 —— 所以 `&&` 的左边一定要写成布尔值，`list.length > 0` 就是干这个的。',
      ],
    },
    {
      type: 'demo',
      title: '反例：筛不出东西时，页面上多了个 0',
      height: 300,
      task: [
        '先点「全部」「工作」「生活」，一切正常，条数都对。',
        '',
        '然后点 **「其他」** —— 列表空了，可按钮下面多出一个**孤零零的 0**。',
        '',
        '一格一格地找它：那一格写着 `{list.length && <p>共 {list.length} 条</p>}`。没有数据时 `list.length` 是数字 `0`，而 `0 && 别的` 不返回 `false`，返回的是左边那个 `0`；React 把数字照原样画出来，就成了你看到的那个 0。',
        '',
        '把这一行改成 `list.length > 0 && …`，再点「其他」，看 0 是不是没了。',
      ],
      code: `import { useState } from 'react'

const ALL = [
  { id: 1, text: '写周报', tag: '工作' },
  { id: 2, text: '交报销', tag: '工作' },
  { id: 3, text: '约牙医', tag: '生活' },
]

export default function App() {
  const [tab, setTab] = useState('全部')

  const list = ALL.filter(
    (item) => tab === '全部' || item.tag === tab,
  )

  return (
    <div className="card">
      <div className="row">
        {['全部', '工作', '生活', '其他'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={t === tab ? 'btn primary' : 'btn'}>
            {t}
          </button>
        ))}
      </div>

      {/* 病根就在下面这一行 */}
      {list.length && <p>共 {list.length} 条</p>}

      <ul className="list">
        {list.map((item) => (
          <li className="list-item" key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
    },
    {
      type: 'warn',
      title: '知识点 4 · 空的时候，一定要开口说话',
      md: [
        '筛完之后一条都不剩，页面会安静得可怕：没有列表、没有提示，只剩上面一排按钮。',
        '',
        '用户看到空白的第一反应不是「原来没有数据」，而是「**是不是坏了 / 是不是还没加载出来**」。所以要主动给他一句话：',
        '',
        '```',
        '{list.length === 0 && <p>这个筛选下没有待办</p>}',
        '```',
        '',
        '`.empty` 这个 class 就是为这种句子准备的：灰色、斜体，一眼看出是提示，不是正文。',
        '',
        '再贴心一点：空提示还能**分场合**。点「未完成」空着，是「全干完了」；点「已完成」空着，是「还没开工」—— 完全是两件事，文案当然不该一样。',
      ],
    },
    {
      type: 'demo',
      title: '正解：三态切换 + 空状态兜底',
      height: 340,
      task: [
        '三种状态已经能切了：点「未完成」「已完成」，列表和条数都跟着变。',
        '',
        '看一眼计数那一行 —— `list.length > 0 && …`，就是刚修好的写法，空的时候不会再冒 0。',
        '',
        'TODO 1：`done` 为 true 的条目后面显示一个 **✓**（用 `&&`，别用三元）。',
        '',
        'TODO 2：让空状态那句能区分 tab —— 点「未完成」空着时说「全干完了，休息一下」，其他情况还是「这个筛选下没有待办」。这就要在空状态里面再判断一次。',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useState } from 'react'

const TODOS = [
  { id: 1, text: '写周报', done: true },
  { id: 2, text: '交报销', done: false },
  { id: 3, text: '约牙医', done: false },
]

export default function App() {
  const [tab, setTab] = useState('全部')
  const list = TODOS.filter((t) => {
    if (tab === '未完成') return !t.done
    if (tab === '已完成') return t.done
    return true
  })

  return (
    <div className="card">
      <div className="row">
        {['全部', '未完成', '已完成'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={t === tab ? 'btn primary' : 'btn'}>
            {t}
          </button>
        ))}
      </div>

      {list.length > 0 && <p>共 {list.length} 条</p>}

      {list.length === 0 ? (
        // TODO 2：让这句能区分 tab
        <p className="empty">这个筛选下没有待办</p>
      ) : (
        <ul className="list">
          {list.map((item) => (
            <li className="list-item" key={item.id}>
              <span>{item.text}</span>
              {/* TODO 1：done 时显示 ✓ */}
              <span className="chip">
                {item.done ? '已完成' : '未完成'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question:
        '`{list.length && <p>共 {list.length} 条</p>}` 里的 `list` 是空数组时，这个位置在屏幕上会出现什么？',
      options: [
        {
          text: '一个孤零零的 0',
          correct: true,
          why: '对。`[].length` 是 0，而 `0 && 别的` 不会短路成 `false`，它返回的就是左边那个 0；React 把数字 0 当普通文字画出来，于是你就看到了一个 0。改成 `list.length > 0 && …` 就干净了。',
        },
        {
          text: '什么都不显示',
          why: '这是最自然的直觉：假值就等于不渲染。但 React 对 `null`、`undefined`、`true`、`false` 会跳过不画，数字 0 不在跳过之列。',
        },
        {
          text: '报错：0 不能渲染成节点',
          why: '不报错，一点提示都没有。页面看起来「差不多是对的」，这才是它难被发现的原因。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '一条待办要显示「已完成」或「未完成」两个标签之一，哪种写法是对的？',
      options: [
        {
          text: '三元：`{done ? "已完成" : "未完成"}`',
          correct: true,
          why: '屏幕上永远要出现两者之一，这就是「要么 A 要么 B」，只有三元（或者提前 return）能表达。`&&` 只会「有或没有」，给不出第二个结果。',
        },
        {
          text: '`&&`：`{done && "已完成"}`',
          why: '这条能跑，但没完成的时候那个位置是空的 —— 标签「缺了一半」。需求是二选一，写法里就必须有两个分支。',
        },
        {
          text: '两个 `&&` 拼：`{done && "已完成"}{!done && "未完成"}`',
          why: '确实能跑出正确结果，但同一个条件读了两遍，还得自己补个 `!`，以后改起来容易漏。两个分支都要出现时，一个 `? :` 就把话说清楚了 —— 能跑，不等于该这么写。',
        },
      ],
    },
    {
      type: 'code',
      title: '对照：同一个判断，三种写法',
      code: `// 写法 1：嵌套三元 —— 能跑，但读到第二层眼睛就开始打架
{state === 'loading' ? (
  <p>加载中…</p>
) : state === 'error' ? (
  <p>出错了</p>
) : (
  <p>数据来了</p>
)}

// 写法 2：先把「要画什么」算进一个变量，JSX 里只放变量
let content = <p>数据来了</p>
if (state === 'loading') content = <p>加载中…</p>
if (state === 'error') content = <p>出错了</p>
return <div className="card">{content}</div>

// 写法 3：提前 return，把特殊情况挡在门口
if (state === 'loading') return <p>加载中…</p>
if (state === 'error') return <p>出错了</p>
return <p>数据来了</p>`,
    },
    {
      type: 'demo',
      title: '进阶：提前 return，一个页面三种状态',
      height: 300,
      task: [
        '一个页面，三种状态：**加载中 / 出错 / 有数据**。点那个按钮，它会带着你转一圈：重新加载 → 没加载出来 → 重试，三种界面轮流出现。',
        '',
        '看开头那两个 `if`：它们直接 `return`，所以能走到最后一段 `return` 的，一定是「数据已经到手」这一种情况 —— 正常情况的代码不用缩进到 `else` 里。',
        '',
        '试着把开头的初始状态从 `ok` 改成 `loading`，页面一进来就是加载中。',
      ],
      code: `import { useState } from 'react'

export default function App() {
  const [state, setState] = useState('ok')

  if (state === 'loading') {
    return (
      <div className="card">
        <p className="muted">正在加载…</p>
        <p className="small muted">这会儿在等接口回来</p>
        <button className="btn"
          onClick={() => setState('error')}>
          没加载出来
        </button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="card">
        <p className="bad">没拿到数据</p>
        <p className="small muted">可能是没网，点重试</p>
        <button className="btn"
          onClick={() => setState('ok')}>
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <p className="muted">今天的待办</p>
      <ul className="list">
        <li className="list-item">写周报</li>
        <li className="list-item">交报销</li>
      </ul>
      <button className="btn"
        onClick={() => setState('loading')}>
        重新加载
      </button>
    </div>
  )
}`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '第一个练习场里，把 `list.length &&` 改成 `list.length > 0 &&`，点「其他」确认那个 0 消失。',
        '第二个练习场里补两处 TODO：`done` 为 true 的条目后面显示一个 ✓（用 `&&`）；空状态那句能区分 tab，点「未完成」空着时说「全干完了，休息一下」。',
        '第二个练习场里，把三条待办的 `done` 全部改成 `true`，再分别点「未完成」和「已完成」，这两个界面应该长得完全不一样。',
        '第三个练习场里加第四个状态 `empty`（请求成功、但一条都没有），加个按钮切过去，用提前 return 写。',
      ],
    },
    {
      type: 'check',
      items: [
        '第一个练习场点「其他」时，原来那个 0 不见了；点回「工作」能看到「共 2 条」。',
        '第二个练习场里 `done` 为 true 的条目后面有个 ✓；把三条待办的 `done` 都改成 `true` 再点「未完成」，屏幕上出现的是兜底文案，不是一片空白。',
        '第二个练习场里空状态那句话会跟着 tab 变：点「未完成」空着时写的是「全干完了，休息一下」，不是一句放到哪都一样的通用文案。',
        '第三个练习场那个按钮点三下，加载中 / 出错 / 有数据三种界面都能看到，点「运行」显示运行成功、没有红色报错。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- **反着来一次**：把第二个练习场改成「列表为空时，连筛选按钮都不显示，整页只剩一句『今天没有安排』」。想想这句该用提前 return，还是三元？为什么？',
        '- **一个真需求**：给第三个练习场加「有数据、但一条都没有」的状态。真实项目里最麻烦的不是加载中，而是「请求成功了，结果居然是空的」—— 这两种界面长得完全不一样，用户看错一次就会来找你。想清楚这两种情况你分别要画什么。',
      ],
    },
  ],
}