// 第 12 课 · Context：跨层级共享数据
export default {
  meta: {
    id: 12,
    title: 'Context：跨层级共享数据',
    stage: '阶段三 · 做一个真东西',
    goal: '中间层不用再当传话筒',
    minutes: 35,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '第 11 课你把待办清单拼起来了。现在想加两样东西：一个**主题色**，和标题旁边那句「**还剩 3 件没做**」。',
        '',
        '麻烦来了：这两份数据在 `App` 里，而真正要用它的组件躲在第 3 层。你只能一层层往下写 props，中间那两层自己根本不关心主题色，却必须原封不动地转交一遍。',
        '',
        '这个动作有名字：**props 透传**（英文叫 prop drilling，props 一路往下钻）。这一课就把它干掉。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 三步，把数据放到「天上」',
      md: [
        'Context 的思路一句话：**数据不往下发了，放进一个公共频道，谁要用谁自己去听。**',
        '',
        '搭起来正好三步，记住每一步的分工：',
        '',
        '```',
        '// 1. 建频道：默认值填一个「凑合能用」的',
        'const ListContext = createContext({ color: "gray" })',
        '',
        '// 2. 给值：在外面包一层，把数据广播出去',
        '<ListContext.Provider value={{ color, remaining }}>',
        '  <Board />',
        '</ListContext.Provider>',
        '',
        '// 3. 取值：真正用到数据的组件里，自己拿',
        'const { color, remaining } = useContext(ListContext)',
        '```',
        '',
        '三步别记混：`createContext` 是**建频道**，`Provider` 是**给值**，`useContext` 是**取值**。频道只建一次（写在组件外面），给值只写一处（在最外层），取值写在真正需要数据的组件里。',
        '',
        '`Provider` 里面**所有**组件，不管隔了多少层，`useContext(ListContext)` 拿到的都是同一份值。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · Provider 背后到底发生了什么',
      md: [
        '`Provider` 做的事比你想的简单：把值**挂在树上**，谁调用 `useContext` 谁就读到；**中间那些组件完全不知情，一行 props 都不用写**。',
        '',
        '但有两个后果必须记住：',
        '',
        '1. **value 一变，所有用到这个 Context 的组件都会重新渲染**，不管隔了多少层。所以别把「整个 App 的 state 大对象」一股脑塞进去 —— 那等于每次改动都让一大片界面重画。更细的一层：就算内容没变，只要 `Provider` 每次渲染都新建一个 `{...}` 对象，引用变了，React 也认为「变了」。（怎么控制，第 13 课讲。）',
        '2. **默认值只在「外面根本没有 Provider」时才生效**。外面有 Provider，它连看都不看一眼。所以默认值要填一个「凑合能用、不会崩」的值，而不是你指望它兜底的业务数据。真实项目里更狠：默认值给 `null`，再写个自定义 Hook 检查一下，忘包 Provider 就当场 `throw` 报错 —— 因为**「悄悄显示错的数据」比「直接崩掉」难查一万倍**。',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住（外加一条纪律）',
      md: [
        '**数据不往下发，放进 Provider，谁要谁自己 `useContext`。**',
        '',
        '纪律：**只隔一层，就用 props，别上 Context。**',
        '',
        'Context 的代价不只是多写三行代码：它让「谁在用这份数据」变得看不出来。以后你打开 `Count.js`，只看到一行 `useContext(ListContext)`，得翻到最外层才知道值是谁给的。层级浅的时候，props 反而是最短、最清楚的路径。',
        '',
        '判断标准只有一条：**中间那些组件，是不是被迫写了自己用不上的 props？** 是 → 上 Context；不是 → 老老实实传 props。',
      ],
    },
    {
      type: 'demo',
      title: '反例：props 一层层传，中间漏了一个',
      height: 340,
      task: [
        '数据都在 `App` 里：`color`（主题色）和 `remaining`（还剩几件）。先看屏幕：**颜色是红的，但「还剩 件没做」少了数字**。',
        '',
        '毛病不在最里层，在第 3 层 `Toolbar`：它往下传的时候漏了 `remaining`。漏传不会报错，收到的就是 `undefined` —— 这种「能跑但不对」的 bug 最难找。',
        '',
        '先动手数一数：为了让这个数字出现在最里层，一共有几个组件写到了 props？（答案：4 个，连只是路过的那两层也各写了一遍）',
        '',
        '再验证一下：给 `Toolbar` 里那行 `<Count ... />` 补上 `remaining={remaining}`，点「运行」，数字就回来了。',
        '',
        '最后一个问题：`Panel` 和 `Toolbar` 真的需要这两个数据吗？',
      ],
      code: `export default function App() {
  // 主题色和「还剩几件」，是整棵树都要用的数据
  const color = 'crimson'
  const remaining = 3

  return (
    <div className="card">
      <p className="muted">第 1 层 App：数据从这里出发</p>
      <Panel color={color} remaining={remaining} />
    </div>
  )
}

function Panel({ color, remaining }) {
  // 第 2 层：只管排版，这两个 props 它自己用不上
  return (
    <div className="stack">
      <p className="small muted">第 2 层 Panel：只是路过</p>
      <Toolbar color={color} remaining={remaining} />
    </div>
  )
}

function Toolbar({ color, remaining }) {
  // 第 3 层：往下传了 color，忘了 remaining
  return (
    <div className="stack">
      <p className="small muted">第 3 层 Toolbar：漏了一个</p>
      <Count color={color} />
    </div>
  )
}

function Count({ color, remaining }) {
  // 第 4 层：真正要用数据的地方
  return (
    <div className="stack">
      <p className="big" style={{ color }}>
        还剩 {remaining} 件没做
      </p>
      <p className="small bad">
        remaining = {String(remaining)}
      </p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：同样的四层，中间两层彻底干净',
      height: 300,
      task: [
        '同一份界面换成了 Context：数据在 `App` 里由 `Provider` 给一次，下面几层**一行 props 都没有**。',
        '',
        '先点「**换个颜色**」：第 2 层那行字和下面的「还剩 ? 件没做」**同时**变了颜色。数据一变，用到它的组件自动跟着更新，中间不需要任何人传话。',
        '',
        '再补两处 TODO：',
        '',
        '1. `Count` 里已经取了 `color`，再取出 `remaining`，把「还剩 ? 件没做」的问号换成真数据',
        '2. `Toolbar` 里自己取一次 `color`，把那行灰字染成主题色 —— 它没有收到任何 props，照样能拿到',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `// 练习场会自动备好 hook，真实项目里要写 import
// 1. 建频道。默认值只在「外面没有 Provider」时才露脸
const ListContext = createContext({ color: 'gray' })

export default function App() {
  const [red, setRed] = useState(true)
  const color = red ? 'crimson' : 'steelblue'
  // 2. 给值：value 一换，用到它的组件全都跟着更新
  const value = { color, remaining: 3 }
  const toggle = () => setRed((r) => !r)

  return (
    <ListContext.Provider value={value}>
      <button className="btn primary" onClick={toggle}>
        换个颜色
      </button>
      <Panel />
    </ListContext.Provider>
  )
}

function Panel() {
  const { color } = useContext(ListContext)
  return (
    <div className="card">
      <p className="small" style={{ color }}>第 2 层：直接取</p>
      <Toolbar />
    </div>
  )
}

function Toolbar() {
  // TODO 2：自己取一次 color，把这行字染成主题色
  return (
    <div className="stack">
      <p className="small muted">第 3 层：零 props</p>
      <Count />
    </div>
  )
}

function Count() {
  const { color } = useContext(ListContext)
  // TODO 1：再取出 remaining，把问号换成真数据
  return <p className="big" style={{ color }}>还剩 ? 件没做</p>
}`,
    },
    {
      type: 'demo',
      title: '进阶：默认值什么时候才露面',
      height: 300,
      task: [
        '同一个 `Label` 组件渲染了两次：一次在 `Provider` 里面，一次在外面。',
        '',
        '里面那次显示 `crimson`，外面那次显示 `gray` —— 那个 `gray` 就是 `createContext` 的默认值，**它只在外面找不到 Provider 时才露面**。',
        '',
        '动手：把第二个 `Label` 也用 `ListContext.Provider` 包起来，两行就一样了。包完再改一改默认值，看看外面那行还变不变（不变，Provider 说了算）。',
        '',
        '想一想：如果这个默认值本来是「等你忘了包 Provider，就悄悄用别的数据顶上」，页面会怎样？不报错，只是显示错的东西。',
      ],
      code: `import { createContext, useContext } from 'react'

// 默认值：只在「外面没有 Provider」时才露脸
const ListContext = createContext({ color: 'gray' })

function Label() {
  const { color } = useContext(ListContext)
  return (
    <p className="big" style={{ color }}>主题色 {color}</p>
  )
}

export default function App() {
  // 这个对象一会儿只递给里面那个 Label
  const theme = { color: 'crimson' }

  return (
    <div className="stack">
      <div className="card">
        <p className="muted">里面：包了 Provider</p>
        <ListContext.Provider value={theme}>
          <Label />
        </ListContext.Provider>
      </div>

      <div className="card">
        <p className="muted">外面：同一份代码，没包</p>
        <Label />
      </div>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '`App` 里的一份数据，第 4 层的组件要用，中间两层完全不关心。React 给的答案是？',
      options: [
        {
          text: '建一个 Context，`App` 用 `Provider` 给值，第 4 层自己 `useContext` 取',
          correct: true,
          why: '对。数据「挂在树上」，谁需要谁自己拿，中间两层不用再写一遍跟自己无关的 props。以后插入新的层级、调整组件位置，也不用跟着改。',
        },
        {
          text: '不用传了：把数据存进 `localStorage`，谁用谁自己读一次',
          why: '`localStorage` 是用来「记住」数据的，不是用来在组件之间传数据的。它不归 React 管：值改了，组件不会自动重渲染，你的界面会停在旧数据上；而且它是字符串，存对象还得来回转换。',
        },
        {
          text: '把数据写成全局变量，比如 `let theme = ...`，谁用谁读',
          why: '这和第 4 课的普通变量是一个结局：你改了它，React 完全不知道，页面不会更新。更要命的是，谁都能改它，出了 bug 你根本查不出是谁改的。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '组件树只有两层：`App` 直接渲染 `Card`，`Card` 要用 `App` 里的 `title`。该上 Context 吗？',
      options: [
        {
          text: '不用，写成 `<Card title={title} />` 就完事了',
          correct: true,
          why: '对。只隔一层的时候，props 是最短也最清楚的路径：打开 `Card` 的函数签名，就知道它要什么数据。Context 是给「隔着好几层」准备的。',
        },
        {
          text: '该，Context 更「高级」，一次做好以后就不用改了',
          why: '「以后可能要用」不是理由。Context 会让数据的来路变模糊：打开 `Card.js` 只看到一行 `useContext(XxxContext)`，得翻到最外层才知道值是谁给的。层级浅的时候，props 反而更好读。',
        },
        {
          text: '该，用了 Context 就不用写 props，代码更短',
          why: '少写几个 props 不是目的。Context 的成本是「谁在用这份数据」变得看不出来，而且 value 一变，所有用到它的组件都要重新渲染。判断标准是「中间层是不是被迫写了自己不用的 props」，不是「能不能少写字」。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子：频道单独一个文件',
      code: `// src/context/ThemeContext.js
import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

// 专用的小 Hook：忘包 Provider 就当场报错
export function useTheme() {
  const value = useContext(ThemeContext)
  if (value === null) {
    throw new Error('useTheme 只能放在 Provider 里面用')
  }
  return value
}

// App.jsx —— 整个项目里，值只在这一处给出
<ThemeContext.Provider value={{ color, remaining }}>
  <TodoList />
</ThemeContext.Provider>`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '第一个练习场里，给 `Toolbar` 补上漏掉的那个 prop，让「还剩 3 件没做」显示出来；然后数一遍：为了这一份数据，一共有几个组件写到了 props。',
        '第二个练习场里完成两处 TODO：`Count` 取出 `remaining` 填进问号，`Toolbar` 取一次 `color` 把标题染上主题色（它一行 props 都没有）。',
        '在你自己第 11 课的待办清单里，把主题色抽成 Context：频道写在组件外面，`App` 里用 `Provider` 包住整个列表，「还剩 N 件没做」和需要颜色的组件各自 `useContext` 取。中间层一行都不许改。',
        '改完之后，把 `Provider` 那层临时删掉，看页面变成什么样；再把默认值改成 `"gray"` 试一次。体会一下「不报错，但显示错的东西」。',
      ],
    },
    {
      type: 'check',
      items: [
        '第二个练习场里点「换个颜色」，第 2 层那行字和「还剩 ? 件没做」同时变色 —— 我没有给它们传过任何 props。',
        '第二个练习场里补完两处 TODO 后，问号变成「还剩 3 件没做」，第 3 层那行灰字也染上了主题色，点「运行」显示 ✓ 运行成功。',
        '第三个练习场里，里面那张卡显示 `crimson`、外面那张显示 `gray`，用的是同一个 `Label` 组件。',
        '我的待办清单里，把 Provider 那层临时删掉，页面没崩、颜色退回默认值；包回去颜色就回来了。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 回到第二个练习场：把 `remaining` 做成真的能变（在 `App` 里加一个「删掉一条」按钮，`useState` 减一），看 `Count` 里的数字自己跟着变 —— 它没有收到任何 props。',
        '- 再想一步：如果 Context 里放的是**函数**（比如 `addTodo`），而 `Provider` 的 `value` 是每次渲染都新建的对象，会发生什么？先猜，再看第 13 课对不对。',
      ],
    },
  ],
}