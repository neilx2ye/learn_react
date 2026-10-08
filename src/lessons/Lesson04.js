// 第 4 课 · State 与 useState
// 这一份是「课程文件长什么样」的样板，格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 4,
    title: 'State 与 useState',
    stage: '阶段一 · 组件的思维',
    goal: '让页面动起来：数字能被点击改变',
    minutes: 25,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '前三课做出来的东西都是**死的**：数据写在代码里，页面画出来就再也不变了。',
        '',
        '你想做个「点一下加一」的计数器：写 `let count = 0`，点击时 `count = count + 1` —— 结果屏幕上的数字纹丝不动。',
        '',
        'React 的答案是：数据要**存进 state**。state 是 React 亲自记住的那份数据，你改了它，React 就重新画一遍页面。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 一行代码，拿到「值」和「改它的函数」',
      md: [
        '这是 React 里最常见的一行：',
        '',
        '```',
        'const [count, setCount] = useState(0)',
        '```',
        '',
        '拆开看，它同时做了三件事：',
        '',
        '- `useState(0)`：**0 是初始值**，只在组件第一次出现时使用一次',
        '- 返回值是一个数组，用**解构**一次取出两个东西：当前值 `count`、修改它的函数 `setCount`',
        '- 命名是约定：`set` 加上原来的名字。看到 `setCount` 就该知道它管的是 `count`',
        '',
        '想改数字，**只能**通过 `setCount`：',
        '',
        '```',
        'setCount(5)            // 直接给一个新值',
        'setCount(count + 1)    // 在现在的基础上加一',
        '```',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · setCount 之后，到底发生了什么',
      md: [
        '调用 `setCount(1)` 时，React 收到通知，然后：',
        '',
        '1. 把新的值记下来',
        '2. **把这个组件函数从头到尾再执行一遍**',
        '3. 这次执行时，`useState(0)` 返回的不再是 0，而是 1',
        '4. 用新的结果去更新页面',
        '',
        '于是有个反直觉的事实：**组件函数里的普通变量，每次渲染都是崭新的**（`let count = 0` 每次都被重新初始化成 0）；只有 state 是跨渲染被 React 保管着的那一份。',
        '',
        '看懂这一条，你就明白为什么「改普通变量没用，必须用 setXxx」。',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住',
      md: [
        '**setXxx 不是「给变量赋值」，而是「告诉 React：数据变了，请重画」。**',
        '',
        '页面上要跟着变的东西 → 放进 state；只是算出来的中间结果 → 普通变量就够了。',
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子',
      code: `<p>你点了 {count} 次</p>
<button onClick={() => setCount(count + 1)}>再来一次</button>`,
    },
    {
      type: 'demo',
      title: '反例：用普通变量记数字',
      height: 260,
      task: [
        '先连点几下 **+1**，再盯着屏幕上的数字看。',
        '',
        '数字**不会变**，但每次点击其实都执行了 `count = count + 1`。这就是普通变量的结局：改是改了，React 不知道，页面也就不会被重画。',
        '',
        '想一想：如果连点 3 次，`count` 现在是多少？为什么屏幕还是 0？',
      ],
      code: `export default function App() {
  // 普通变量：每次渲染都会被重新初始化成 0
  let count = 0

  function add() {
    count = count + 1
    // 值确实变了，但 React 根本不知道
  }

  return (
    <div className="card">
      <p className="muted">用普通变量记数字</p>
      <p className="big">{count}</p>
      <button className="btn primary" onClick={add}>
        +1
      </button>
      <p className="small muted">点多少次，屏幕上都是 0</p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：同样的计数器，改用 useState',
      height: 300,
      task: [
        '代码几乎没变，只是把普通变量换成了 state。先点几次 **+1**，确认数字真的在变。',
        '',
        '然后补两处 TODO：加一个 **-1** 按钮让 `count` 减一；再加一个「**重置**」按钮，点了回到 0。',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useState } from 'react'

export default function App() {
  // useState(0) 里的 0 是初始值，只在第一次渲染时用
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <p className="muted">点一下试试</p>
      <p className="big">{count}</p>

      <div className="row">
        <button
          className="btn primary"
          onClick={() => setCount(count + 1)}
        >
          +1
        </button>

        {/* TODO 1：照着上面加一个 -1 按钮 */}
        {/* TODO 2：再加一个「重置」，点了回到 0 */}
      </div>

      <p className="small muted">这次数字真的动了</p>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '组件里写 `let x = 0`，点击按钮执行 `x = x + 1`，屏幕上会怎样？',
      options: [
        {
          text: '不会变',
          correct: true,
          why: '普通变量不是 state。就算它真的变大了，React 也不知道数据变了，不会重新渲染；何况组件一旦重新渲染，`let x = 0` 又会把它初始化回 0。',
        },
        {
          text: '会变成 1',
          why: '这是最自然的直觉。但屏幕要不要重画由 React 决定，只有调用 `setXxx`，React 才会收到「数据变了」的通知。',
        },
        {
          text: '会报错',
          why: '不报错，一点提示都没有。这种「静默失效」才是新手最容易被卡住的地方。',
        },
      ],
    },
    {
      type: 'demo',
      title: '进阶：连着更新三次，为什么只加了一',
      height: 380,
      task: [
        '左右两个计数器都想「点一次加 3」。',
        '',
        '左边写了三遍 `setA(a + 1)`，右边写了三遍 `setB((n) => n + 1)`。各点一次，看结果差多少。',
        '',
        '原因：同一轮渲染里 `a` 从头到尾都是**同一个旧值**，三次都算成 `0 + 1`，于是只加了 1。传一个函数进去，React 会把**最新的值**交给它，所以三次都算在最新结果上。',
        '',
        '试着把左边的三遍也改写成函数式写法，看是不是也能加 3 了。',
      ],
      code: `import { useState } from 'react'

export default function App() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)

  function addThreeFixed() {
    setA(a + 1)
    setA(a + 1)
    setA(a + 1)
  }

  function addThreeWithFn() {
    setB((n) => n + 1)
    setB((n) => n + 1)
    setB((n) => n + 1)
  }

  return (
    <div className="stack">
      <div className="card">
        <p className="muted">A：三遍都写成 a + 1</p>
        <p className="big">{a}</p>
        <button className="btn" onClick={addThreeFixed}>
          点一次，想加 3
        </button>
      </div>

      <div className="card">
        <p className="muted">B：三遍都拿最新的 n 算</p>
        <p className="big">{b}</p>
        <button className="btn" onClick={addThreeWithFn}>
          点一次，加 3
        </button>
      </div>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '`setCount(count + 1)` 连着写两遍，最后 `count` 是几（初始值 0）？',
      options: [
        {
          text: '1',
          correct: true,
          why: '对。同一轮渲染里 `count` 一直是 0，两次都算成 0 + 1。React 会依次应用这两个更新，但它们的新值相同，最终就是 1。想每次都基于最新值，就写成 `setCount(c => c + 1)`。',
        },
        {
          text: '2',
          why: '直觉上该是 2。但这两行是在同一轮渲染里执行的，`count` 从头到尾都没有变过，两次算出来的是同一个结果。',
        },
        {
          text: '报错：不能重复更新同一个 state',
          why: '不报错。React 会接受两次更新，只是结果不是你想要的 —— 所以这类 bug 特别难找。',
        },
      ],
    },
    {
      type: 'warn',
      title: '三个必踩的坑，先认脸',
      md: [
        '- **直接改 state**：`count = count + 1`、`items.push(x)` 都不行。state 是只读的，只能交给 `setXxx` 换成一份新的。',
        '- **基于旧值连续更新**：想加 3 就写三遍 `setCount(c => c + 1)`，不能写三遍 `setCount(count + 1)`。',
        '- **在渲染过程中调用 setState**：下面那段「看起来很合理」的代码会让页面卡住，因为每一次渲染都触发了下一次渲染，停不下来。',
      ],
    },
    {
      type: 'code',
      title: '反面教材（别抄）',
      code: `function Broken() {
  const [n, setN] = useState(0)

  setN(n + 1)          // 一渲染就改 state → 又触发渲染
  return <p>{n}</p>    // 结果：Too many re-renders，页面卡死
}`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '在第二个练习场里补齐 **-1** 和「**重置**」两个按钮，三个按钮都能用。',
        '再加一个「**连续 +5**」按钮：点一次加 5，用**函数式写法**实现（可以连着调用五次 `setCount(c => c + 1)`）。',
        '新做一个「点赞」按钮：一行显示 👍 和数字，每点一次数字加一。',
        '把 state 的名字改成 `setN` 试试，看看哪里会报错 —— React 不强制名字，错的只是名字没改干净的地方。',
      ],
    },
    {
      type: 'check',
      items: [
        '第一个练习场的 +1 怎么点数字都不变，第二个练习场的 +1 点一下数字就变 —— 两个的差别我能说清楚。',
        '我自己的计数器里，-1 和重置都能用，重置后回到 0。',
        '「点一次加 3」这个坑，我能说出为什么要写成 `setCount(c => c + 1)`。',
        '练习场里没有红色报错（点「运行」显示 ✓ 运行成功）。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 做一个「心情切换器」：用 `useState` 存一个字符串，比如 `"平静"`，三个按钮分别切成「平静 / 兴奋 / 累了」，页面上用大字显示当前心情。',
        '- 再想一想：如果把心情存在普通变量里会怎样？把答案用一句话发我，答对了才算过关。',
      ],
    },
  ],
}