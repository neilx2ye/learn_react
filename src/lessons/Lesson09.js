// 第 9 课 · useEffect：管好渲染之外的事
// 格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 9,
    title: 'useEffect：管好渲染之外的事',
    stage: '阶段二 · 数据和状态往哪放',
    goal: '定时器、请求数据这些副作用',
    minutes: 35,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '到第 8 课为止，你手里的工具都在干同一件事：**数据进，JSX 出**。',
        '',
        '但有些事不是「算」出来的：每秒让秒表加一、打开页面时去接口拿一份数据、把网页标题换成待办数量、把设置存进浏览器本地。',
        '',
        '它们有个共同点：**不是渲染的一部分，而是渲染之后顺手要去做的别的事**。React 管这叫**副作用（side effect）**，并给了一个专门的口子：`useEffect`。',
        '',
        '这一课要说清三件事：它什么时候跑、跑几次、什么时候必须收拾干净。顺便预告一下 —— 这一课的 bug 比前面所有课加起来都多。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · useEffect 是「页面画完之后补一句」',
      md: [
        '用法就这么多：',
        '',
        '```',
        'useEffect(() => {',
        '  // 页面画完之后，执行这里',
        '}, [依赖])',
        '```',
        '',
        '**第一件事**：React 先把 JSX 算出来、把屏幕更新好，**然后**才执行你传进去的这个函数。所以它天生不是「渲染时算数值」的地方。',
        '',
        '**第二件事**：第二个参数的数组只回答一个问题 —— 「**这里面有谁和上一次不一样了？**」有不一样的，就把这个函数**再执行一遍**；全都没变，就跳过。',
        '',
        '所以「什么时候执行」不是 `useEffect` 自己决定的，是你写在数组里的东西决定的。这个数组叫**依赖数组**。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 依赖数组的三种写法，背下来',
      md: [
        '```',
        'useEffect(fn)        // 没写第二个参数',
        'useEffect(fn, [])    // 空数组',
        'useEffect(fn, [x])   // 数组里放着 x',
        '```',
        '',
        '- **没写**：每次渲染之后都执行一遍。而 effect 里通常要改 state，改 state 又会触发渲染 —— 于是停不下来。**这种写法几乎总是错的**，看到就该停下来想一秒。',
        '- **空数组 `[]`**：只在组件第一次出现之后执行一次。适合「打开页面时做一次」的事，比如首次去接口拿数据。',
        '- **`[x]`**：x 和上一次不同才执行。适合「x 变了就得重新做一次」的事，比如搜索词变了就重新请求。',
        '',
        '写不准的时候就用这个办法：**这个 effect 里用到了外面哪些值？把它们列进数组。**',
      ],
    },
    {
      type: 'warn',
      title: '知识点 3 · 开出来的东西，要在清理函数里关掉',
      md: [
        'effect 里做的事常常是「开了一个东西」：一个定时器、一个监听、一个连接。这些东西**不会因为你重新渲染就消失**，它们会在后台一直跑。',
        '',
        '语法是：**在 effect 的函数里 `return` 一个函数**，它就叫清理函数。React 会在两个时刻调用它：**这个 effect 要重新执行之前**、**组件被卸载的时候**。',
        '',
        '```',
        'useEffect(() => {',
        '  const id = setInterval(tick, 1000)',
        '  return () => clearInterval(id)',
        '}, [x])',
        '```',
        '',
        '**为什么必须有**：不写的话，effect 每重新执行一次就**新开一个定时器，旧的还活着**。点两次「启动」就有两个定时器在跑，数字一秒跳 2；点得越多越快，而且旧的那些你再也管不着了。',
        '',
        '**再说 StrictMode**：开发环境下 React 会把新组件故意按「挂载 → 卸载 → 再挂载」走一遍，专门用来检查你有没有清理干净，所以你会看到 effect 里的日志打两遍、请求发两次。这不是 bug —— 只要清理函数写对了就不会有任何后果。正式打包上线时只跑一遍。',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住',
      md: [
        '**渲染里只算界面；渲染之外的事交给 `useEffect`；开了什么，就在清理函数里关掉什么。**',
        '',
        '还有一条更省事的规矩：**能用现在的数据算出来的值，不要用 effect 去存**（第 8 课讲过）。effect 只用在该跟「外面」打交道的地方。',
      ],
    },
    {
      type: 'demo',
      title: '反例：点了三次「启动」的秒表',
      height: 300,
      task: [
        '点一次 **启动**，等数字跳到 3 左右（约 3 秒）。',
        '',
        '再点一次 **启动**，盯着数字看 3 秒 —— 现在**每跳一下加几**？',
        '',
        '再点第三次，它跳得比刚才更快了。旁边写着「已启动 N 次」—— N 和每秒跳的数目对得上吗？',
        '',
        '原因：每点一次「启动」都让 effect 重新执行了一遍，但**旧的定时器没有被关掉**。后台的定时器从一个变成两个、三个，每个都在给同一个数字加一。',
      ],
      code: `import { useState, useEffect } from 'react'

export default function App() {
  const [seconds, setSeconds] = useState(0)
  const [starts, setStarts] = useState(0)

  useEffect(() => {
    // 还没点过启动，就先什么都不做
    if (starts === 0) return
    // 这里只开了一个定时器，没有别的了
    setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }, [starts])

  return (
    <div className="card">
      <p className="muted">点「启动」，然后数数字</p>
      <p className="big">{seconds}</p>

      <div className="row">
        <button
          className="btn primary"
          onClick={() => setStarts((n) => n + 1)}
        >
          启动
        </button>
        <span className="chip">已启动 {starts} 次</span>
      </div>

      <p className="small muted">每秒该加 1。点 3 次后加几？</p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：写了清理函数的计时器',
      height: 320,
      task: [
        '这一份和上一份只差两行：把 `setInterval` 的返回值存进变量，effect 最后 `return () => clearInterval(id)`。',
        '',
        '点 **启动** 让它跑起来，再点 **暂停**，数字应该**立刻停住**。反复点几次，确认它只有一份，不会越点越快。',
        '',
        '然后补两处 TODO：加一个「**归零**」按钮，把 `seconds` 变回 0；再把秒数显示成 `1:05` 这种**分:秒**的样子（提示：`String(s).padStart(2, "0")`）。',
      ],
      code: `import { useState, useEffect } from 'react'

export default function App() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    // 把定时器编号留下来，清理时要用
    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  return (
    <div className="card">
      <p className="muted">能暂停的计时器</p>
      <p className="big">{seconds}</p>

      <div className="row">
        <button
          className="btn primary"
          onClick={() => setRunning(!running)}
        >
          {running ? '暂停' : '启动'}
        </button>
        {/* TODO 1：加一个「归零」按钮 */}
        {/* TODO 2：把秒数显示成 1:05 这样 */}
      </div>

      <p className="small muted">暂停后数字停住，说明定时器真关了</p>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '想让「打开页面时去接口拿一次数据」只发一个请求，第二个参数该怎么写？',
      options: [
        {
          text: '`[]` 空数组',
          correct: true,
          why: '空数组的意思是「一个依赖都没有」，React 找不到会变的值，所以只在组件第一次出现之后执行一次 —— 正好是「打开页面时拿一次」。',
        },
        {
          text: '什么都不写',
          why: '不写第二个参数 = 每次渲染后都执行一遍。数据拿回来要 setState，setState 又触发渲染，于是请求一个接一个发出去，很容易滚成停不下来的循环。',
        },
        {
          text: '`[数据]`，把拿到的数据放进去',
          why: '这样会变成：数据回来 → 触发渲染 → 数据变了 → 再请求一次 → 又回来 → 又请求…… 自己把自己喂起来了。',
        },
      ],
    },
    {
      type: 'warn',
      title: '知识点 4 · 最常见的 effect bug：拿到的是旧值',
      md: [
        'effect 里的代码能看到的值，是**它执行那一轮渲染时的那些值**，不像 state 那样总是最新。',
        '',
        '漏写依赖，等于告诉 React「这里没有任何会变的东西」，于是 effect 不再跑，里面的值就从此卡在最初那一刻：',
        '',
        '```',
        'useEffect(() => {',
        '  const id = setInterval(() => {',
        '    setCount(count + 1)   // 这个 count 永远是 0',
        '  }, 1000)',
        '  return () => clearInterval(id)',
        '}, [])',
        '```',
        '',
        '两个解法：**用函数式写法 `setCount((c) => c + 1)`** —— 让 React 把最新的值交给你的函数，根本不用管依赖；或者把 `count` 写进依赖数组，也能跑对，但定时器会每秒被拆掉重建一次，不划算。这种「拿上一个值算下一个值」的场景，函数式写法才是正解。',
      ],
    },
    {
      type: 'demo',
      title: '反例：它一直停在 1',
      height: 300,
      task: [
        '这个数字本该每秒加一。先看一秒：它是不是一直停在 1？',
        '',
        '点一下 **手动 +1**：数字立刻变成 2。然后手别动，盯着看一秒 —— 它又被打回 1 了。',
        '',
        '原因在两处：依赖数组是 `[]`，所以定时器里的 `count` **永远是第一次渲染时的 0**；它每秒执行一次 `setCount(0 + 1)`，等于每秒把数字强行写回 1。',
        '',
        '改法：把定时器里那行改成 `setCount((c) => c + 1)`，看它是不是开始正常往上爬了（第 4 课那个坑的另一个版本）。',
      ],
      code: `import { useState, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // 这个 count 绑死在第一次渲染时的 0
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])   // 依赖空了，count 就一直是 0

  return (
    <div className="card">
      <p className="muted">每秒自动加一，但它停在 1</p>
      <p className="big">{count}</p>

      <div className="row">
        <button
          className="btn"
          onClick={() => setCount(count + 1)}
        >
          手动 +1
        </button>
        <span className="chip">等一秒看看</span>
      </div>

      <p className="small muted">手动点上去，一秒后还是回 1</p>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '开发环境下，effect 里的日志打了两遍。该怎么办？',
      options: [
        {
          text: '检查清理函数写对了没有，写对了就不用管',
          correct: true,
          why: '对。开发模式下 React 会故意按「挂载 → 卸载 → 再挂载」走一遍，专门查你没有清理干净的东西。清理函数写对了，跑两遍不会有任何后果；正式打包上线时只跑一遍。',
        },
        {
          text: '把 `StrictMode` 删掉，问题就没了',
          why: '删掉只是关掉了体检，毛病还在。等组件真的被卸载时，没清理的定时器、监听会留在后台继续跑。',
        },
        {
          text: '这是 React 的 bug，等它修',
          why: '这是故意的行为，从 React 18 就开始了，而且只出现在开发环境 —— 它是帮你提前发现问题的。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子',
      code: `// 打开页面时去接口拿一次数据
useEffect(() => {
  fetch('/api/todos')
    .then((res) => res.json())
    .then((data) => setTodos(data))
}, [])                    // 空数组：只在挂载后跑一次

// 网页标题跟着待办数量走
useEffect(() => {
  document.title = left + ' 件待办'
}, [left])                // left 变了才改标题

// 把待办存到浏览器本地，下次打开还在
useEffect(() => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos))
  } catch {
    // 存不了就跳过，别让页面崩掉
  }
}, [todos])               // todos 一变就存一次`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '在第二个练习场里补完两个 TODO：**归零**能用，秒数显示成 `1:05` 的样子。',
        '在自己电脑上的 Vite 项目里做一个「**窗口宽度**」显示：`useState` 存宽度，effect 里监听 `resize` 并把宽度写进去 —— **别忘了清理**（`return () => window.removeEventListener(...)`）。拖动窗口宽度，看数字跟着变。',
        '验证清理函数到底管什么：把正解练习场里 `return () => clearInterval(id)` 那一行**删掉**，再启动、暂停、启动几次，看数字有没有变快；然后把这一行加回来。',
        '做一个「**打字后才搜索**」的输入框：`useState` 存输入内容，effect 里包一个 `setTimeout`（停手 1 秒才算数），清理函数里 `clearTimeout`。连着打 5 个字，只在停手后出一次结果。',
      ],
    },
    {
      type: 'check',
      items: [
        '第一个练习场里点一次「启动」是每秒 +1，连点三次变成每秒 +3，而且和「已启动 3 次」对得上。',
        '第二个练习场里点「暂停」数字**立刻停住**，反复启动暂停十次也不会变快。',
        '第三个练习场里数字停在 1 不动；改成 `setCount((c) => c + 1)` 之后它会正常往上加。',
        '我自己写的那个 effect（窗口宽度或打字搜索）快速来回试十次，数字不会越来越快、结果也不会越堆越多。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 做一个「**倒计时 10 秒**」：从 10 开始每秒减一，到 0 就自己停住，页面上显示「时间到」。',
        '- 想一道题：为什么 `useEffect(fn)` 不写依赖数组「几乎总是错的」？用一句话说清它和 `[]` 的差别，答对才算过关。',
      ],
    },
  ],
}