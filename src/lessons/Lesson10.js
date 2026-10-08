// 第 10 课 · 自定义 Hook
// 把重复逻辑抽成一个 useXxx；格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 10,
    title: '自定义 Hook',
    stage: '阶段二 · 数据和状态往哪放',
    goal: '把重复逻辑抽成一个 useXxx',
    minutes: 30,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '第 9 课那套计时器，你在一个组件里写完了：`useState` 记秒数、`useEffect` 起定时器、离开时 `clearInterval`。它跑得挺好。',
        '',
        '现在第二个地方也想要一个秒表 —— 一个「专注计时」，一个「炖菜计时」。最省事的办法是复制粘贴：把那一整坨 `useState` + `useEffect` 再抄一遍。',
        '',
        '问题就出在「再抄一遍」：抄的时候十有八九会漏一行，漏的那一行往往是 `return () => clearInterval(id)`。之后你要对着两个长得一模一样的组件，一行一行找哪里不一样。',
        '',
        'React 的答案是：**把这段逻辑抽成一个函数**，名字以 `use` 开头，两个组件都去调用它。这个函数叫**自定义 Hook**。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 自定义 Hook 就是个普通函数',
      md: [
        '它没有新语法，没有新 API，只是一条规矩：',
        '',
        '- 它是个**普通函数**，和 `function add(a, b)` 一样普通，你平常怎么写函数就怎么写',
        '- 名字**必须**以 `use` 开头：`useTimer`、`useCounter`、`useDraft`',
        '- 函数**里面可以调用别的 Hook**：`useState`、`useEffect` 随便用',
        '',
        '用的时候也是直接调用，看不出半点特殊：',
        '',
        '```',
        'const { count, add } = useCounter(0)',
        '```',
        '',
        '所以判断标准只有一条：函数里出现了 `useState` 或 `useEffect`，它的名字就**必须**以 `use` 开头。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 为什么必须是 use 开头',
      md: [
        'React 不会读你的心思，它（和它的检查工具）靠**函数名**认东西：',
        '',
        '- React 官方的 Hooks 规则里写着：自定义 Hook 的名字必须以 `use` 开头',
        '- 检查工具（eslint / oxlint 的 react-hooks 规则）见到 `use` 开头，就按 Hook 的规矩来查它：只能在组件或别的 Hook 里调用，不能写在 `if`、循环或者普通函数里',
        '- 同事、还有三个月后的你，看到 `useCounter()` 就知道：**这里面有状态，调用它会影响渲染**',
        '',
        '不写 `use` 前缀，代码当场也能跑起来 —— 运行时并不检查名字。但检查工具不再罩着它，读代码的人也会把它当成一个纯计算函数。这种「能跑但违规」的写法，等你发现用错位置时，bug 往往已经埋了几个月。',
      ],
    },
    {
      type: 'tip',
      title: '知识点 3 · 最要紧的一句：state 是各自的',
      md: [
        '「存钱罐」和「俯卧撑」两张卡片都调用 `useCounter()`。你在存钱罐上点 +1，俯卧撑那个数字**一动不动**。',
        '',
        '因为 `useCounter` 每次被调用，`useState` 就为**调用它的那个组件**记下一份新的 state。两张卡片各有一份自己的 `count`，谁也动不了谁。',
        '',
        '**Hook 复用的是逻辑，不是状态。** 想让两个组件共享同一份数据，那是第 7 课状态提升的活：把 state 挪到共同的父组件，再用 props 传下去。',
      ],
    },
    {
      type: 'note',
      title: '知识点 4 · 返回什么，你自己定',
      md: [
        '`useState` 返回的是数组，所以要用解构按**位置**接：`const [count, setCount] = useState(0)`，顺序写反了就把函数当成数字用。',
        '',
        '自定义 Hook 没有这个限制，返回什么你说了算。返回**对象**，用的人按名字拿，不用记顺序：',
        '',
        '```',
        'return { count, add, reset }',
        '',
        'const { count, add, reset } = useCounter(0)',
        '```',
        '',
        '什么时候用数组？只有返回值少、顺序天然固定的时候（`useState` 就是这种）。其余一律返回对象 —— 几个月后回来改代码，你也不想再翻一遍函数定义去数顺序。',
      ],
    },
    {
      type: 'demo',
      title: '反例：复制粘贴过来的那一份，漏了一行',
      height: 430,
      task: [
        '两张卡片都是计时器，逻辑一模一样 —— 区别只有一处：B 是从 A 复制过来的，`return () => clearInterval(id)` 那一行**忘了抄**。',
        '',
        '先看 5 秒，两张卡的秒数都一秒加一。然后连点三下 **重新计时**，再盯着看：A 还是稳稳地一秒加一，B 一次能跳好几下。',
        '',
        '想一下：B 多出来的那几秒，是谁在加？那些旧的定时器现在在哪里跑？',
      ],
      code: `import { useEffect, useState } from 'react'

// 第 9 课那份计时器：换了场景就重新计时
function TimerA({ scene }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const id = setInterval(() => setN((v) => v + 1), 1000)
    return () => clearInterval(id)  // 走之前关掉旧的
  }, [scene])
  return (
    <div className="card">
      <p className="muted">A · 有清理函数</p>
      <p className="big good">{n}</p>
    </div>
  )
}

// B 的代码是从 A 复制来的，清理那行没抄
function TimerB({ scene }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    setInterval(() => setN((v) => v + 1), 1000)
  }, [scene])
  return (
    <div className="card">
      <p className="muted">B · 忘了清理函数</p>
      <p className="big bad">{n}</p>
    </div>
  )
}

export default function App() {
  const [scene, setScene] = useState(1)
  const next = () => setScene((s) => s + 1)
  return (
    <div className="stack">
      <TimerA scene={scene} />
      <TimerB scene={scene} />
      <button className="btn primary" onClick={next}>
        重新计时
      </button>
      <p className="small muted">连点几下按钮，看 B 跳得多快</p>
    </div>
  )
}`,
    },
    {
      type: 'tip',
      title: '反例里到底发生了什么',
      md: [
        '每点一次「重新计时」，`scene` 就变了；依赖数组里有它，所以这两个 effect 都会**先收尾、再重跑**一遍：',
        '',
        '- A 的收尾是 `return () => clearInterval(id)`：上一轮的定时器被关掉，永远只剩一个在跑 → 稳稳地一秒加一',
        '- B 没写收尾：旧的定时器谁也不管，还在后台一秒加一。点三次就有四个定时器一起改同一个 `count` → 越点越快',
        '',
        '更要紧的是：这些没人管的定时器**不会自己停**。就算 B 这个组件从页面上消失了，它们照跑不误 —— 第 9 课那句「组件走了要清理」，就是为这个准备的。',
      ],
    },
    {
      type: 'demo',
      title: '正解：计时逻辑抽成 useCounter，两张卡各用各的',
      height: 420,
      task: [
        '这次逻辑只写了一遍，写在 `useCounter` 里。两张卡片都调用它，起点不同（0 和 20）。',
        '',
        '先点「存钱罐」的 **+5** 三下，看「俯卧撑」的数字有没有动 —— 没有，因为它们各有各的 state。',
        '',
        '再补两处 TODO：',
        '',
        '- TODO 1：加一张起点 100 的卡片',
        '- TODO 2：在卡片上补一个 **-1** 按钮（现成的 `add(-1)` 就能用）',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useState } from 'react'

// 自定义 Hook：一个 use 开头的普通函数
function useCounter(start) {
  const [count, setCount] = useState(start)
  const add = (step) => setCount((c) => c + step)
  return { count, add, reset: () => setCount(start) }
}

// 卡片只管“长什么样”，数字从哪来不归它管
function CounterCard({ title, start }) {
  const { count, add, reset } = useCounter(start)

  return (
    <div className="card">
      <p className="muted">{title}</p>
      <p className="big">{count}</p>
      <div className="row">
        <button className="btn" onClick={() => add(1)}>
          +1
        </button>
        <button className="btn" onClick={() => add(5)}>
          +5
        </button>
        <button className="btn" onClick={reset}>
          归零
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <CounterCard title="存钱罐" start={0} />
      <CounterCard title="俯卧撑" start={20} />
      {/* TODO 1：再加一张卡片，起点 100 */}
      {/* TODO 2：卡片上补一个 -1 按钮：add(-1) */}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '把一段用了 `useState` 的逻辑抽成函数给组件用，下面哪个名字是对的？',
      options: [
        {
          text: 'useVisible',
          correct: true,
          why: '对。自定义 Hook 必须以 `use` 开头，这是 React 官方 Hooks 规则里的一条。检查工具靠这个前缀认出它是 Hook，才能按规则帮你查：有没有写在 `if` 里、有没有在普通函数里被调用。',
        },
        {
          text: 'getVisible',
          why: '`get` 开头一看就是个取数据的普通函数，可它里面藏着 state。名字骗了读代码的人，也躲过了检查工具。这类函数不会当场报错，等你发现它在 `if` 里被调用时，已经很难找了。',
        },
        {
          text: 'Visible',
          why: '大写开头是**组件**的命名习惯（`App`、`CounterCard`），React 和读代码的人都会当它是组件。组件和 Hook 是两种东西，用法也不一样，名字别串用。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '「存钱罐」和「俯卧撑」两张卡都调用同一个 `useCounter()`。点存钱罐的 +1，俯卧撑的数字会怎样？',
      options: [
        {
          text: '不动。每次调用 useCounter 都拿到自己那份 count',
          correct: true,
          why: '对。state 由 React 按「谁调用了这个 Hook」分别保管：`useCounter` 搬来的是逻辑，不是数据。想让两个地方显示同一个数字，得把 state 提到共同的父组件（第 7 课状态提升），再用 props 传下去。',
        },
        {
          text: '跟着一起涨，同一个 Hook 就是同一份数据',
          why: '这正是最容易混的一点：**复用逻辑不等于共享状态**。两个组件调用同一个 Hook，等于各自把那段函数执行了一遍，`useState` 就各自记了一份，两份互不相干。',
        },
        {
          text: '不一定，看两个组件哪个先出现',
          why: '跟顺序没关系。调用几次就有几份独立的 state，和组件出现的先后、位置都无关。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子',
      code: `// 这种小 Hook 会单独放一个文件，别人 import 去用
// src/hooks/useCounter.js
export function useCounter(start = 0) {
  const [count, setCount] = useState(start)

  const add = (step = 1) => setCount((c) => c + step)
  const reset = () => setCount(start)

  return { count, add, reset }  // 对象返回，用的人不用记顺序
}

// 组件里一行就拿到全部能力
// const { count, add, reset } = useCounter(10)`,
    },
    {
      type: 'warn',
      title: '知识点 5 · 只用过一次的逻辑，先别急着抽',
      md: [
        '学会 `useXxx` 之后容易上头，看什么都想抽一个 Hook。先停一下 —— 抽 Hook 是为了**消除重复**，不是为了好看。',
        '',
        '判断标准就一句：**这段逻辑已经出现两遍了吗？**',
        '',
        '- 出现了两处以上，而且改一处想同时改另一处 → 抽出来',
        '- 只在一个组件里用过一次 → 就放在组件里，等第二处出现再抽。那时候你也更清楚它该怎么长',
        '',
        '还有一条：Hook 里的逻辑要能**一口气说完**。「计时」是一个 Hook，「点赞 + 搜索 + 保存到本地」塞在一个 `useEverything` 里，那它不是 Hook，是一整个模块。',
      ],
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '补完正解练习场里的两处 TODO（起点 100 的新卡片 + `-1` 按钮），确认三张卡片的数字各管各的。',
        '把 `useCounter` 里的 `add` 改动一下，比如改成 `setCount((c) => c + step * 2)`，运行看看 —— 三张卡片**一起**变成每次加两步。一次改动、到处生效，这就是抽 Hook 省下来的力气，改完记得改回来。',
        '写一个自己的 `useTimer()`：里面用 `useState` 记秒数、`useEffect` 起定时器并且**写好清理函数**，在两张卡片里各用一次，确认两张卡的数字互不干扰。',
        '回头翻你自己的代码，找一段写了两遍的逻辑抽成 `useXxx`。找不到也不用硬凑 —— 那说明你现在还不需要它。',
      ],
    },
    {
      type: 'check',
      items: [
        '反例练习场里连点三下「重新计时」，下面那张卡的秒数明显比上面那张跳得快，我能说出 B 多出来的秒数是谁在加。',
        '正解练习场里点「存钱罐」的 +5 三下，「俯卧撑」的数字一动不动。',
        '我把 `useCounter` 的算法改成乘 2 之后，两张卡片一起变了，我没有去改卡片里的任何一行。',
        '两个练习场点「运行」都是 ✓ 运行成功，没有红色报错。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '**让 Hook 里再套 Hook。** 自定义 Hook 里可以调用另一个自定义 Hook，名字一样要 `use` 开头：',
        '',
        '```',
        'function useLikes() {',
        '  const { count, add } = useCounter(0)',
        '  return { likes: count, like: () => add(1) }',
        '}',
        '```',
        '',
        '**再想一层。** 如果两个地方真的要共用同一个数字（比如两处都要显示购物车里的件数），把 `useCounter` 改成共享是没用的 —— 它做不到。该动的是 state 的位置：回忆第 7 课，把 state 提到共同的父组件里去。',
      ],
    },
  ],
}