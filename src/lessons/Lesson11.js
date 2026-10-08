// 第 11 课 · 实战：待办清单
// 格式说明见同目录的 _FORMAT.md；这一课的份量都在「数组怎么改」上。
export default {
  meta: {
    id: 11,
    title: '实战：待办清单',
    stage: '阶段三 · 做一个真东西',
    goal: '增删改查 + 过滤，做一个能用的清单',
    minutes: 45,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '前面十课你手里全是零件：JSX、props、列表渲染、state、受控表单、条件渲染、状态提升、派生状态、useEffect。单看每一课都会，但它们还没凑到一起过。',
        '',
        '这一课把这些零件装成一个**真能用的东西**：待办清单 —— 能加任务、能勾完成、能删掉、能按状态过滤、关了页面数据还在。',
        '',
        '装配的过程中只有一件事是新的：**数组怎么改**。它也是这类代码里最容易写错、最难看出错在哪的一步，所以这一课一半以上的篇幅都在讲它。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 加和删：都要「造一个新数组」',
      md: [
        '先说结论：**state 里的数组不能改，只能换。**所谓「加一条」，不是往数组里塞东西，而是造一个「装着原来的全部 + 新的一条」的新数组，交给 `setTodos`：',
        '',
        '```',
        'setTodos([...todos, 新的一条])',
        '```',
        '',
        '`...todos` 叫**展开**：把旧数组里的每一项摊到新数组里。整句读作「旧的全部照抄，末尾多一条」。',
        '',
        '删也是同一个思路，只是工具换成 `filter`：',
        '',
        '```',
        'setTodos(todos.filter((t) => t.id !== id))',
        '```',
        '',
        '`filter` 的意思是「留下返回 true 的那些项」，它**不改原数组**，返回的是一个新数组。上面这句读作「除了这一条，其它都留下」。',
      ],
    },
    {
      type: 'note',
      title: '知识点 2 · 改一条：map + 一份新对象',
      md: [
        '「把某一条标记成完成」是这类改动里最典型的，写法只有一种：',
        '',
        '```',
        'setTodos(todos.map((t) =>',
        '  t.id === id ? { ...t, done: !t.done } : t))',
        '```',
        '',
        '`map` 把数组一项一项过一遍，每一项都**返回点什么**，凑成一个长度相同的新数组：',
        '',
        '- 是目标那一条：返回 `{ ...t, done: !t.done }` —— 先把旧对象摊开，再用新的 `done` 盖掉它。这是一个**新对象**。',
        '- 其它条：原样返回 `t`，一个字都不动。',
        '',
        '所以别再写 `t.done = !t.done`。那是在**改老对象**。这两句在新手眼里做的是同一件事，区别全在 React 那一侧 —— 下一段就讲。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 3 · 为什么必须造新的：React 比的是「是不是同一份」',
      md: [
        'React 判断「数据变了没有」，不是逐项比对内容，而是**比引用**：这一次的 `todos` 和上一次的，是不是同一个东西。',
        '',
        '于是下面这几种写法全都白改：',
        '',
        '- `todos.push(新的一条)` —— 改的是原来那个数组',
        '- `todos.splice(i, 1)` —— 同上',
        '- `todos[i].done = true` —— 改的是数组里那个对象本身',
        '',
        '改完再 `setTodos(todos)`，交上去的还是同一个引用。React 一看「和上次一模一样」，就当什么都没发生，连渲染都不做 —— 屏幕上自然一动不动。',
        '',
        '还有第二层麻烦，比第一层更阴：**你改的是上一次渲染用的那份数据**。React 不重画时你看不出来，可只要因为别的什么原因（在输入框里敲了个字、换了个过滤条件）触发一次渲染，屏幕上就会突然冒出一条「早就该出现」的任务，或者一个自己勾上的框。这种 bug 最难查，因为它看起来毫无规律。',
        '',
        '这类「不造副本、直接改原数据」的写法有个名字：**原地修改**（mutation）。写 React 要养成的反射是：看见 `push` / `splice` / `sort` / 直接给属性赋值，先问自己一句「我是不是在改原件」。',
      ],
    },
    {
      type: 'tip',
      title: '口诀与速查',
      md: [
        '**源数组不动，交给 setTodos 的必须是新的一份。**',
        '',
        '三个动作三种写法，背下来就够用了：',
        '',
        '- 加：`setTodos([...todos, 新的一条])`',
        '- 删：`setTodos(todos.filter((t) => t.id !== id))`',
        '- 改：`setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t))`',
        '',
        '数组方法顺手分个类：`push` / `splice` / `sort` / `reverse` 改原件；`map` / `filter` / `concat` / `slice` 和展开 `...` 造新件。真需要改原件又必须造新件时，先展开一份再动手：`[...todos].sort(...)`。',
      ],
    },
    {
      type: 'demo',
      title: '反例：push 进去、直接改对象，两条路都不通',
      height: 320,
      task: [
        '先不改代码。在输入框里打几个字，点 **添加** —— 列表里一条都没多，输入框里的字也还在。',
        '',
        '再点一下任务前面的方框 —— 它弹回去，还是没勾上的样子。两条路都不通。',
        '',
        '猜一猜：`todos.push(...)` 确实把新任务塞进数组了，`one.done = true` 也确实把值改了，为什么屏幕上一点反应都没有？',
        '',
        '好奇的话可以试一下：添加之后再在输入框里多打一个字 —— 刚才那条会突然冒出来。因为打字本身触发了重渲染。这恰好证明数据早就变了，只是 React 不知道。',
      ],
      code: `import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: '交周报', done: false },
  ])
  const [text, setText] = useState('')

  function add() {
    // 往原数组里塞一条，再把同一个数组交回去
    todos.push({ id: Date.now(), text, done: false })
    setTodos(todos)
  }

  function check(id) {
    const one = todos.find((t) => t.id === id)
    one.done = true      // 直接改对象里的属性
    setTodos(todos)      // 交回去的还是同一个数组
  }

  return (
    <div className="card">
      <p className="muted">两条路都走不通，先点一下试试</p>
      <div className="row">
        <input className="field" value={text}
          placeholder="打几个字"
          onChange={(e) => setText(e.target.value)} />
        <button className="btn primary"
          onClick={add}>添加</button>
      </div>
      <ul className="list">
        {todos.map((t) => (
          <li key={t.id} className="list-item">
            <input type="checkbox" className="checkbox"
              checked={t.done}
              onChange={() => check(t.id)} />
            <span>{t.text}</span>
          </li>
        ))}
      </ul>
      <p className="small bad">点了没反应，列表一动不动</p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：同样一个清单，全部换成新数组、新对象',
      height: 360,
      task: [
        '这一份是写对的。先随便加点任务、勾几个、删几个，确认屏幕上每一步都跟着变。',
        '',
        '代码里留了一个 TODO：补一个「**清除已完成**」按钮，点一下把所有勾上的任务一次删掉。提示：`todos.filter((t) => !t.done)` 就是「没勾的那些」，交给 `setTodos` 就行。',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: '交周报', done: false },
    { id: 2, text: '买菜', done: true },
  ])
  const [text, setText] = useState('')

  function add() {
    if (text.trim() === '') return
    const one = { id: Date.now(), text, done: false }
    setTodos([...todos, one])
    setText('')
  }
  const toggle = (id) => setTodos(todos.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id) =>
    setTodos(todos.filter((t) => t.id !== id))
  const left = todos.filter((t) => !t.done).length

  return (
    <div className="card">
      <div className="row">
        <input className="field" value={text}
          placeholder="今天要做什么？"
          onChange={(e) => setText(e.target.value)} />
        <button className="btn primary"
          onClick={add}>添加</button>
      </div>
      <ul className="list">
        {todos.map((t) => (
          <li key={t.id} className="list-item">
            <input type="checkbox" className="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)} />
            <span className={t.done ? 'muted' : ''}>
              {t.text}</span>
            <button className="btn"
              onClick={() => remove(t.id)}>删除</button>
          </li>
        ))}
      </ul>
      <p className="small muted">还剩 {left} 件没做</p>
      {/* TODO：加一个「清除已完成」按钮 */}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question:
        '点「添加」时执行了 `todos.push(新的一条)` 又 `setTodos(todos)`，为什么页面上什么都没多出来？',
      options: [
        {
          text: 'push 改的是原来那个数组，交回给 setTodos 的还是同一个引用，React 认为「没变化」，不重画',
          correct: true,
          why: '对。React 比的是「是不是同一份数据」，不是逐项比内容。push 确实把新任务塞进去了，但引用没变，React 就跳过这次渲染。正确写法是 `setTodos([...todos, 新的一条])` —— 新的一份，React 才认。',
        },
        {
          text: 'push 不是数组该有的方法，得用 add',
          why: 'push 是数组自带的、能用的方法，而且它真的把新任务放进去了 —— 数据在内存里早就变了，只是页面上看不到。问题不在方法对不对，在于有没有换出一份新的。',
        },
        {
          text: 'push 之后要再写一次 setTodos(todos) 才生效',
          why: '写十次也一样：交上去的还是同一个引用，React 每次都认为「没变化」。问题不在调用次数，在于没有生成新的那一份。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '想把第 2 条任务标记成已完成，下面哪一种写法是对的？',
      options: [
        {
          text: 'todos.map((t) => t.id === id ? { ...t, done: !t.done } : t)，再交给 setTodos',
          correct: true,
          why: '对。map 返回一个新数组；命中的那一条用 `{ ...t, done: !t.done }` 生成一份新对象，其余的照原样返回。新数组 + 新对象，React 才看得出「变了」。',
        },
        {
          text: 'const one = todos.find((t) => t.id === id)，然后 one.done = true，再交给 setTodos',
          why: '这是原地修改：对象还是原来那个，React 看不出来；而且上一次渲染用的那份数据被你顺手改掉了，之后可能莫名冒出一个勾上的框。',
        },
        {
          text: 'todos.filter((t) => t.id === id)，再交给 setTodos',
          why: 'filter 是「留下哪些」的筛选，这么写的结果是只剩这一条任务，其它全没了 —— 它是删东西用的工具，不是改一条用的。',
        },
      ],
    },
    {
      type: 'note',
      title: '知识点 4 · 过滤：只存「现在看哪一类」，结果是算出来的',
      md: [
        '「全部 / 未完成 / 已完成」三个按钮，很自然的想法是存三个数组：全部一份、未完成一份、已完成一份。**别这么干。**',
        '',
        '这份清单里真正的数据只有两样：任务数组、当前选了哪一类。至于「屏幕上这会儿该显示哪几条」，是**算出来的**，渲染的时候现算：',
        '',
        '```',
        'const shown = todos.filter((t) => {',
        '  if (filter === "未完成") return !t.done',
        '  if (filter === "已完成") return t.done',
        '  return true',
        '})',
        '```',
        '',
        '多存一份就多一个「要记得同步」的东西：加任务时忘了往另一个数组里也加一条，数据就对不上了。这就是第 8 课讲过的**派生状态** —— 凡是能算出来的，就不要存。',
      ],
    },
    {
      type: 'demo',
      title: '过滤：三个按钮切换，列表是算出来的',
      height: 340,
      task: [
        '点 **全部 / 未完成 / 已完成** 三个按钮，看列表跟着换。底部那行「正在看 …」显示的就是当前 state 的值。',
        '',
        '代码里只有两个 state：任务、当前看哪一类。屏幕上的列表是从这两个值**算**出来的。',
        '',
        '补一个 TODO：加一行「已做完 X / 共 Y」的统计。两个数字都得现算（提示：`todos.filter((t) => t.done).length`），不许再新增一个 state。',
      ],
      code: `import { useState } from 'react'

const FILTERS = ['全部', '未完成', '已完成']

export default function App() {
  const [todos] = useState([
    { id: 1, text: '交周报', done: true },
    { id: 2, text: '买菜', done: false },
    { id: 3, text: '跑步 20 分钟', done: false },
  ])
  const [filter, setFilter] = useState('全部')

  // 显示什么是算出来的：filter 一变，它自己就跟着变
  const shown = todos.filter((t) => {
    if (filter === '未完成') return !t.done
    if (filter === '已完成') return t.done
    return true
  })

  return (
    <div className="card">
      <div className="row">
        {FILTERS.map((f) => (
          <button key={f} className="btn"
            onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <ul className="list">
        {shown.map((t) => (
          <li key={t.id} className="list-item">
            <span className={t.done ? 'muted' : ''}>
              {t.text}</span>
          </li>
        ))}
      </ul>

      <p className="small muted">
        正在看 {filter}：这一类有 {shown.length} 件
      </p>
      {/* TODO：加一行「已做完 X / 共 Y」的统计 */}
    </div>
  )
}`,
    },
    {
      type: 'note',
      title: '知识点 5 · 本地存储：进来时读，改动后写，两头都包 try/catch',
      md: [
        '刷新一下页面，清单就空了 —— 因为 state 只活在这一次打开期间。要让它记住，只能存进浏览器自带的小抽屉：`localStorage`。它一次只能存一个字符串，所以数组得先用 `JSON.stringify` 转成字符串，读出来再用 `JSON.parse` 转回去。',
        '',
        '事情分两头做：',
        '',
        '- **读**：放在 `useState` 的初始值里，写成 `useState(() => ...)` 这种「传一个函数」的形式。原理和第 4 课 `setCount(c => c + 1)` 一样：传函数是让 React 在需要的时候才去算，这个函数只会在第一次渲染时执行一次，不会每次渲染都去读一遍硬盘。',
        '- **写**：用 `useEffect`，依赖数组写 `[todos]`，每次任务变了就写回去。',
        '',
        '还有一件容易被漏掉、但必须做的：**两头都要 `try/catch`**。不是所有环境都允许你碰 `localStorage`（隐私模式、被策略禁用的页面会直接抛错），不兜住的话，页面一进来就是白屏加一串红字。',
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子（第 10 课的自定义 Hook 正好用得上）',
      code: `function useSavedTodos() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []        // 读不到就当新用户，从空清单开始
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch {
      // 写不进去就算了，页面照常用，只是记不住
    }
  }, [todos])

  return [todos, setTodos]
}

// 组件里就干净了，用法和 useState 一模一样：
const [todos, setTodos] = useSavedTodos()`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '在「正解」练习场里补上「**清除已完成**」按钮：点一下，所有勾上的任务一次消失（`todos.filter((t) => !t.done)`）。',
        '同一个练习场里加一句空态：任务一条都不剩时显示「今天没有任务」。用 `todos.length === 0 ? ... : ...`（第 6 课学过），别让卡片空着。',
        '在「过滤」练习场里加上「已做完 X / 共 Y」那行统计，两个数字都现算，一个新 state 都不许加。',
        '给自己的清单接上本地存储：照上面 `useSavedTodos` 那段抄。测法 —— 加两条任务，点练习场右上角「运行」，看它们还在不在。要是没回来，多半是当前环境不让存（隐私模式很常见），不是你的代码错。',
      ],
    },
    {
      type: 'check',
      items: [
        '「反例」练习场里，点「添加」列表一条都不多、点方框它自己弹回没勾的样子 —— 这两条为什么不通，我能说出来。',
        '「正解」练习场里，加、勾、删三件事当场生效，底部「还剩 N 件没做」跟着一起变。',
        '我写的「清除已完成」按钮能把勾上的任务一次清掉；任务清空后，屏幕上出现我自己写的空态文字。',
        '练习场里没有红色报错（点「运行」显示 ✓ 运行成功），我的清单代码里搜不到 `push(` 和 `.done =`。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 给任务加「重要 / 普通」两个级别：每行多一个小按钮切换，列表里重要的排在最前面。排序用 `[...todos].sort(...)` —— 注意 `sort` 是改原件的，所以先展开一份再排。',
        '- 把「当前看哪一类」也存进本地存储（它就是普通 state，读写那套照抄一遍），下次打开还停在上次那个筛选。',
      ],
    },
  ],
}