// 第 13 课 · 性能优化：什么时候才需要
// 格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 13,
    title: '性能优化：什么时候才需要',
    stage: '阶段三 · 做一个真东西',
    goal: 'memo / useMemo / useCallback 的时机',
    minutes: 40,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '到这一课，你手上的页面已经不是两三个组件了：第 11 课的清单页、第 12 课的 Context，一层套一层，底下挂着几十个子组件。',
        '',
        '然后你发现一个问题：**在一个输入框里打字，整棵树都在重新渲染**。电脑上看不出来，手机上那种一顿一顿的黏，手指头能感觉出来。',
        '',
        '这一课给你三样东西：`React.memo`、`useCallback`、`useMemo`。它们能解决这个问题，但**也经常被用错地方，白白把代码搞得又长又难读**。所以先学会看清「谁在重渲染」，再决定动手。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 先测量，再优化',
      md: [
        '有个事实要先接受：**React 每次渲染都会把你的组件函数从头到尾再执行一遍**。这不是 bug，这就是它的工作方式。慢不慢，取决于有多少组件、每个组件里干了多少活。',
        '',
        '所以「感觉卡」和「这里卡」是两件事。你还不知道是谁在重渲染，这时候加的 `memo` 只是猜。',
        '',
        '手机上最省事的测量办法：**给组件加一个渲染计数**。',
        '',
        '```',
        'const renders = useRef(0)',
        'renders.current += 1   // 每执行一次组件函数就加一',
        '```',
        '',
        '放进你怀疑的那个组件里，然后打字、点按钮，看哪个数字在涨。',
        '',
        '**数字在涨，而它显示的数据根本没变 —— 那个地方就是白干的活。** 那才是值得优化的地方。（真项目里会用 React DevTools 的 Profiler 来看，手机上先用这个计数就够了。它是测量工具，量完记得删掉。）',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · React.memo 是「浅比较 props」',
      md: [
        '`memo` 的用法是把组件包一层：',
        '',
        '```',
        'const Row = memo(function Row({ task }) { ... })',
        '```',
        '',
        '之后父组件重渲染时，React 会先做一件事：**把新旧 props 逐个比一遍**（浅比较，用 `Object.is`）。全都相等，就跳过这次渲染，直接复用上次画好的结果；只要有一个不相等，就照常重渲染。',
        '',
        '「浅」的意思是：**只比第一层，不往对象里面看**。',
        '',
        '- `text` 是字符串，两次都是 `"今天"` → 相等，跳过',
        '- `{ done: false }` 和 `{ done: false }` → **不相等**，它们是两个不同的对象',
        '- 两个长得一模一样的函数 → **也不相等**，函数比的是「是不是同一个」',
        '',
        '还有一件事要记住：`memo` 只管 props。**它自己的 state 变了、它用的 Context 变了，照样重渲染**（第 12 课的知识点，别搞混）。',
      ],
    },
    {
      type: 'note',
      title: '知识点 3 · 内联写法会让 memo 直接失效',
      md: [
        '这是「memo 白写了」最常见的原因，没有之一：',
        '',
        '```',
        '<Row task={task} onPick={() => pick(task.id)} />',
        '```',
        '',
        '`() => pick(task.id)` 这个东西，**每次父组件渲染都会重新造一个**。它里面的代码一个字都没变，但它是个新函数，引用不一样。',
        '',
        '同样会造出新引用的还有内联对象和内联数组：',
        '',
        '```',
        '<Row opts={{ onlyDone: false }} />',
        '<Row ids={[task.id]} />',
        '```',
        '',
        '于是浅比较必然得出「props 变了」，`memo` 一次都跳不过去：你包了 memo，等于没包，还多花了一次比较的时间。',
        '',
        '**不是 memo 没用，是 props 一直在变。**',
      ],
    },
    {
      type: 'tip',
      title: '口诀 · 传下去的函数用 useCallback，算出来的结果用 useMemo',
      md: [
        '先看长相：',
        '',
        '```',
        'const onSave = useCallback(() => save(id), [id])',
        'const left = useMemo(() => countUndone(items), [items])',
        '```',
        '',
        '两个是同一个套路：**把上次那一份存起来，依赖没变就发上次的**。所以 `useCallback(fn, deps)` 其实就是 `useMemo(() => fn, deps)` 的简写 —— 一个缓存函数，一个缓存值。',
        '',
        '它们本身不会让代码变快，只是让「引用」稳住，好让 `memo` 能挡住重渲染。',
        '',
        '还有一句更省事的：**值永远不变成新对象的东西，直接提到组件外面去**，不用 `useMemo`。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 4 · 依赖数组写错，会「一直用旧值」',
      md: [
        '`useCallback` / `useMemo` 的第二个参数是**依赖数组**，意思是「这些东西变了，就重新算一遍」。',
        '',
        '写 `[]` 就是「永远不用重算」。于是下面这种写法会出事：',
        '',
        '```',
        'const onAdd = useCallback(() => setCount(count + 1), [])',
        '```',
        '',
        '这个函数被冻在**第一次渲染那一刻**，它眼里 `count` 永远是 `0`。所以点多少次，屏幕上都只会变成 1。',
        '',
        '**这种 bug 不报错、不卡顿，数字就是不动或者少加 —— 比性能问题难查得多。**',
        '',
        '两条保命规则：',
        '',
        '- 函数体里用到的每个外部值，都要出现在依赖数组里（编辑器能自动补的，就让它补）',
        '- 用「函数式更新」写就不依赖旧值了：`setCount((c) => c + 1)`，这时依赖数组写 `[]` 才是安全的',
      ],
    },
    {
      type: 'demo',
      title: '反例：包了 memo，渲染次数却一直涨',
      height: 320,
      task: [
        '先在输入框里打几个字，盯着子组件的 **渲染次数** 看。',
        '',
        '`Preview` 明明包了 `memo`，传给它的 `text` 一直是同一句话，按理说它不该重渲染。可你每打一个字，那个数字就往上跳一次。',
        '',
        '原因在 `onClear={() => setKeyword("")}` 这一行：这个箭头函数**每次渲染都会重新造一个**，引用和上一次不同，浅比较直接判「变了」。',
        '',
        '把 `onClear` 这一行整个删掉（按钮留着，点了没反应而已），再打字 —— 数字停住了。这就说明：**问题出在 props，不在 memo。**',
      ],
      code: `import { memo, useRef, useState } from 'react'

// 子组件包了 memo：props 没变就该跳过渲染
const Preview = memo(function Preview({ text, onClear }) {
  const renders = useRef(0)
  renders.current += 1   // 每执行一次组件函数加一

  return (
    <div className="card">
      <p className="muted">子组件：今天的日程</p>
      <p className="big">{text}</p>
      <p className="small">渲染次数：{renders.current}</p>
      <button className="btn" onClick={onClear}>
        清空输入框
      </button>
    </div>
  )
})

export default function App() {
  const [keyword, setKeyword] = useState('')

  return (
    <div className="stack">
      <input
        className="field"
        value={keyword}
        placeholder="在这里打字，比如：买菜"
        onChange={(e) => setKeyword(e.target.value)}
      />
      {/* 下面这个 prop，每次渲染都是新造的函数 */}
      <Preview
        text="今天要做的事"
        onClear={() => setKeyword('')}
      />
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：用 useCallback 稳住 props',
      height: 360,
      task: [
        '这次 props 稳住了：`task` 是 state 里的原对象，`finish` 被 `useCallback` 包着。先打几个字，确认子项的渲染次数**一个都不涨**。',
        '',
        '然后补齐两个 TODO：',
        '',
        '- TODO 1：数出还剩几条没做完，用 `useMemo` 包住（依赖数组写 `[tasks]`），显示在输入框下面，点「完成」数字要跟着减',
        '- TODO 2：加一个「**全部完成**」按钮，处理函数用 `useCallback` 包住（依赖数组写 `[]`，里面用 `setTasks([])`），点一下列表要空',
        '',
        '做完再打字：子项的计数还是不动，说明你的新代码没有破坏 memo。',
        '',
        '最后做一个实验：把 `onDone={finish}` 改成 `onDone={(id) => finish(id)}`，打字时计数立刻又涨了 —— **memo 只看引用，不看内容。**',
      ],
      code: `import {
  memo, useCallback, useMemo, useRef, useState,
} from 'react'

// 任务项包了 memo：props 不变就不重渲染
const Item = memo(function Item({ task, onDone }) {
  const renders = useRef(0)
  renders.current += 1
  // 只给自己用的函数，不用 useCallback
  const finish = () => onDone(task.id)
  return (
    <div className="list-item">
      <span>{task.text}</span>
      <span className="tag">渲染 {renders.current}</span>
      <button className="btn" onClick={finish}>完成</button>
    </div>
  )
})

export default function App() {
  const [draft, setDraft] = useState('')
  const [tasks, setTasks] = useState([
    { id: 1, text: '买菜' }, { id: 2, text: '回邮件' },
  ])
  // useCallback 稳住它：引用不再每次渲染都变
  const finish = useCallback((id) => {
    setTasks((list) => list.filter((t) => t.id !== id))
  }, [])

  return (
    <div className="card">
      <input
        className="field"
        value={draft}
        placeholder="随手打几个字试试"
        onChange={(e) => setDraft(e.target.value)}
      />
      <p className="small muted">打了 {draft.length} 个字</p>
      {/* TODO 1：数出还剩几条没做完，用 useMemo，依赖 [tasks] */}
      {tasks.map((task) => (
        <Item key={task.id} task={task} onDone={finish} />
      ))}
      {/* TODO 2：加「全部完成」按钮，处理函数用 useCallback */}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question:
        '给子组件包了 `memo`，父组件这样传值：`<Child onPick={() => pick(id)} />`。父组件重渲染时，子组件会重渲染吗？',
      options: [
        {
          text: '会，每一次都重渲染',
          correct: true,
          why: '`() => pick(id)` 每次渲染都重新造一个函数，引用和上一次不同。`memo` 的浅比较得出「props 变了」，于是照常渲染 —— 写法上包了 memo，实际等于没包。',
        },
        {
          text: '不会，有 memo 挡着',
          why: '这是最自然的期待。但 memo 只做浅比较，它不会去看两个函数的内容是不是一样：函数是引用类型，两个不同的函数就是两个不同的值。',
        },
        {
          text: '会，但只多渲染一次',
          why: '不是一次的事。父组件每渲染一次，这个函数就新造一次，memo 每次都拦不住，次数是跟着父组件一起涨的。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '`useCallback(fn, [])` 到底做了什么？',
      options: [
        {
          text: '把 fn 缓存起来：依赖没变时，返回的是同一个函数',
          correct: true,
          why: '对。它不改变 fn 什么时候执行，只是让传下去的那个值保持稳定，这样 memo 的浅比较才能通过。',
        },
        {
          text: '让 fn 跑得更快',
          why: '它一点都没让函数变快，函数体该执行多少行还是多少行。它稳住的只是「引用」，好处是让子组件能跳过重渲染。',
        },
        {
          text: '让 fn 只执行一次',
          why: '它不改变 fn 什么时候被调用，那是你自己决定的（比如 `onClick`）。反过来，依赖数组写错时，它还会让你一直用旧值 —— 这是这一课最危险的坑。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里的一整套改动',
      code: `// 判断顺序永远是：先加计数 → 看清谁在重渲染 → 再动手
// 值得优化时，通常是这样一组改动

// 组件内容不动，只是在外面多包一层 memo
const Row = memo(function Row({ task, onDone }) {
  // ...原来写好的那些
})

const onDone = useCallback((id) => {
  setTasks((list) => list.filter((t) => t.id !== id))
}, [])

const left = useMemo(
  () => tasks.filter((t) => !t.done),
  [tasks],
)

// 永远不变成新对象的东西，提到组件外面就够了
const OPTS = { compact: true }`,
    },
    {
      type: 'note',
      title: '放回原位：这是优化手段，不是必须写的规矩',
      md: [
        '把这一课的三样东西放回它们的真实位置：**它们都不是「写 React 必须写」的东西**。',
        '',
        '前面 12 课你一个 `memo` 都没用，页面照样跑得好好的。而下面这些写法，是把「优化」当成了「规矩」：',
        '',
        '- 每个组件都套一层 `memo`',
        '- 每个函数都包 `useCallback`，依赖数组随手写 `[]`',
        '- 每个变量都包 `useMemo`，连 `a + b` 这种计算也不放过',
        '',
        '结果只有一个：**代码变长、更难读，还多出一堆「一直用旧值」的怪 bug**。',
        '',
        '正确的顺序是：**先把功能写对 → 手机上真的感觉到卡 → 加计数看清谁在重渲染 → 再动手。** 在你还没把功能写完写对之前，优化是不划算的。',
      ],
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '在反例练习场里打字，记下渲染次数；然后写一句 `const clear = useCallback(() => setKeyword(""), [])`，把 `onClear` 换成 `clear`（别忘了在 import 里补上 `useCallback`），再打字，确认数字停住了。',
        '补齐正解练习场的两个 TODO：点「完成」数字要减，点「全部完成」列表要空。',
        '在正解练习场里做一次犯错实验：把 `onDone={finish}` 改成 `onDone={(id) => finish(id)}`，打字看计数涨起来，再改回去。记住：**memo 只看引用，不看内容**。',
        '回到你自己第 11 课做的清单页，给任务项组件加一个渲染计数，然后在搜索框里打字：涨得最凶的那个组件，才是你该动手的地方（可能一个都不涨，那就不需要优化）。',
      ],
    },
    {
      type: 'check',
      items: [
        '反例练习场里，我在输入框每打一个字，子组件的「渲染次数」就涨一次 —— 这个数字我看在眼里。',
        '把反例里 `onClear` 那一行去掉之后，同样打字，渲染次数不再涨了 —— 前后的差别我对照过。',
        '正解练习场里两个 TODO 都补齐了：点「全部完成」列表会空，打字时子项的渲染次数纹丝不动。',
        '我在正解练习场里改成 `onDone={(id) => finish(id)}` 之后，打字时计数又开始涨 —— 我能指着屏幕说出这是为什么。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- `memo` 还有第二个参数：自定义比较函数，写成 `memo(Item, (prev, next) => prev.task.id === next.task.id)`。它会**顶替**默认的浅比较。想一想：什么时候值得这么写？什么时候它反而会制造 bug？（提示：比得太松，props 明明变了却跳过渲染，屏幕上就是「点了没反应」。）',
        '- 用一句话回答我：为什么不建议给每个组件都套 `memo`？（提示：比较本身也要花时间；引用稳不住的话，它一点好处都没有。）',
      ],
    },
  ],
}