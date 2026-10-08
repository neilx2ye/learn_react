// 第 7 课 · 状态提升
// 格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 7,
    title: '状态提升',
    stage: '阶段二 · 数据和状态往哪放',
    goal: '两个组件共享同一份数据',
    minutes: 30,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '第 6 课的筛选能用了：点「未完成」，列表只剩两条，旁边那句「共 2 条」也跟着变。',
        '',
        '现在你想再往前走一步 —— 把这句「共 2 条」也显示在页面另一处的小统计卡上（顶上一张卡，或者底部的角标）。可你马上卡住了：`tab` 存在筛选组件里，统计卡是它的兄弟，**props 只能从父往子流，兄弟之间递不了东西**。',
        '',
        'React 的答案不是「想办法把这个数据传过去」，而是**换个地方存**：把它提到两个组件的共同父级里。这个动作有名字，叫**状态提升**（Lifting State Up）。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · state 放在「需要它的那些组件的最近共同父级」',
      md: [
        '判断一份 state 该放哪，只问一句话：**页面上有几个地方要用到它？**',
        '',
        '1. 只有它自己用 → 就放在它自己那里（第 4、5、6 课都是这样）',
        '2. 有两个或更多组件要用 → 往上找，放到它们**最近的共同父级**里',
        '',
        '第 2 句就是状态提升。父级自己拿着这份 state（要用就直接用），同时往下发给需要的子组件。',
        '',
        '「最近」两个字别忽略：提到爷爷那一层也能跑，但中间那些压根不关心这份数据的组件，就都得当二传手白传一遍 —— 是给以后的自己找麻烦。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 往下传的是两样东西：值 + 改它的函数',
      md: [
        'state 提上去以后，子组件怎么知道数字是几？想改又该怎么办？答案是父级往下传两个 props：',
        '',
        '```',
        '<StatCard count={count} onAdd={add} />',
        '```',
        '',
        '- `count`：当前的值，子组件拿去显示',
        '- `onAdd`：改它的那个函数，子组件被点了就调它',
        '',
        '于是子组件里的按钮长这样：`<button onClick={onAdd}>`。它手里没有数据，只是**替父组件按下了那一下**。',
        '',
        '命名有约定：父级里定义的那个函数叫 `add` 或 `handleAdd`，传到子组件手里的 props 叫 `onAdd`（`on` 开头 = 一个事件）。看到 `onAdd` 就该想到「这里会往上喊一声」。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 3 · 子组件里别再存一份副本',
      md: [
        '第一次写状态提升的人，很容易在子组件里顺手又写一遍 `useState` —— 心里想的是「先在这儿存一份，省得一层层传」。',
        '',
        '这是**两份真相**。两份存储互不相干：父级改了，子组件那份不知道；子组件改了，父级那份也不知道。它们各走各的，而且永远不会自己对齐。',
        '',
        '结果不是「其中一份是错的」，而是页面上**根本没有哪一份是对的**。这种错一定会露馅，区别只在于什么时候 —— 下一个练习场，你点两下就看见了。',
        '',
        '顺带说一句：还有一类数据**压根就不该存成 state**（比如「已完成几条」这种能算出来的数字）。这是同一个问题的反面，第 8 课专门讲。',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住：单向数据流',
      md: [
        '**数据从上往下流：props 一层层往下发。事件从下往上喊：子组件调用父组件传下来的函数。**',
        '',
        '以后在子组件里想敲 `useState` 之前，先停三秒问自己：这份数据是不是只有它自己用？如果别处也要看同一个数字，答案就是往上提。',
      ],
    },
    {
      type: 'demo',
      title: '反例：父子各存一份，各点各的',
      height: 340,
      task: [
        '先点上面那张卡的「打卡」三次：**上面变成 3，下面还是 0**。',
        '',
        '再点下面那张卡的「打卡」两次：**下面变成 2，上面还是 3**。',
        '',
        '两个数字都在认真地变，可「今天到底打卡了几次」，页面已经回答不了了。注意看代码：两个组件里写着几乎一模一样的 `useState` 和 `go`。',
      ],
      code: `import { useState } from 'react'

// 子组件：自己也存了一份打卡次数
function CheckinCard() {
  const [count, setCount] = useState(0)

  function go() {
    setCount(count + 1)
  }

  return (
    <div className="card">
      <p className="muted">打卡卡</p>
      <p>今日打卡 {count} 次</p>
      <button className="btn" onClick={go}>
        打卡
      </button>
    </div>
  )
}

export default function App() {
  // 父组件也存了一份，写法跟上面几乎一样
  const [count, setCount] = useState(0)

  function go() {
    setCount(count + 1)
  }

  return (
    <div className="stack">
      <div className="card">
        <p className="muted">统计卡</p>
        <p>今日打卡 {count} 次</p>
        <button className="btn primary" onClick={go}>
          打卡
        </button>
      </div>

      <CheckinCard />
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：state 提到父组件，两处共用一份',
      height: 340,
      task: [
        '这次只有一份 `count`，它住在父组件里，两张卡片都从 props 收到同一个数。',
        '',
        '随便点哪边的「打卡」，两个数字始终一模一样 —— 因为它们本来就是同一个数。',
        '',
        '然后补两处 TODO：加一个「**清空**」按钮（点了回到 0）；再给 `Card` 传一个 `onSub`，在卡片里加一个「**撤销**」按钮。',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useState } from 'react'

// 卡片自己不留数据：显示靠 props，被点了就喊一声
function Card(props) {
  return (
    <div className="card">
      <p className="muted">{props.title}</p>
      <p>今日打卡 {props.count} 次</p>
      <button className="btn" onClick={props.onAdd}>
        打卡
      </button>
    </div>
  )
}

export default function App() {
  // 只有一份 count，放在两张卡片的共同父级里
  const [count, setCount] = useState(0)

  function add() {
    setCount(count + 1)
  }

  return (
    <div className="stack">
      <Card title="统计卡" count={count} onAdd={add} />
      <Card title="打卡卡" count={count} onAdd={add} />

      {/* TODO 1：加一个「清空」按钮，点了回到 0 */}
      {/* TODO 2：给 Card 多传一个 onSub，
          在卡片里加「撤销」，点了让 count 减 1 */}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '两个组件都要读同一份数字，其中一个还要能改它。这份 state 该放在哪？',
      options: [
        {
          text: '放在两个组件的最近共同父级里',
          correct: true,
          why: '对。父级用 state 存着，往下发两个 props：值给要显示的那个，改它的函数给要改的那个。这就是状态提升。',
        },
        {
          text: '放在要改它的那个组件里，另一个从它那儿拿',
          why: '方向错了。props 只能从父往子流，兄弟之间递不了东西 —— 弟弟拿不到哥哥的数据。真想这么干，只能往上绕一层，那就又回到状态提升了。',
        },
        {
          text: '两边各存一份，用的时候再对齐',
          why: '这就是刚才反例里的写法。两份存储没有任何机制保证同步，迟早对不上，而且往往是在最不该出错的时候对不上。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '父组件和子组件各写了 `const [n, setN] = useState(0)`，各自都有按钮能改。点几下之后会怎样？',
      options: [
        {
          text: '两个数字各改各的，永远不会自动同步',
          correct: true,
          why: '两个 `useState` 是两份独立的存储，写在两个组件里，互相不知道对方存在。不报错、看着都在变，但屏幕上那两个数说的不是一回事。',
        },
        {
          text: '改子组件的会顺手把父组件那个也更新',
          why: 'React 里没有这种「自动同步」。想让两边一致，唯一办法是让它们读同一个 state —— 也就是把它提上去。',
        },
        {
          text: '会报错：父子不能有同名的 state',
          why: '不报错。它们只是两个不同作用域里的同名变量而已。这也是这个坑最阴的地方：安安静静地跑着，数字却是错的。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子',
      code: `// 子组件：解构 props，自己一个 state 都没有
function StatCard({ count, onAdd }) {
  return (
    <div className="card">
      <p>当前共 {count} 条</p>
      <button onClick={onAdd}>再加一条</button>
    </div>
  )
}

// 父组件里：一份 state，两处下发
function Toolbar() {
  const [count, setCount] = useState(0)

  function add() {
    setCount(count + 1)
  }

  return (
    <div>
      <StatCard count={count} onAdd={add} />
      {/* 这个只读不写，给它值就够了 */}
      <CountBadge count={count} />
    </div>
  )
}`,
    },
    {
      type: 'code',
      title: '对照：子组件该管什么，不该管什么',
      code: `// ✗ 子组件自己又存了一份
function Card() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>+1</button>
}

// ✓ 子组件只收值和函数
function Card({ n, onAdd }) {
  return <button onClick={onAdd}>+1</button>
}`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '在「正解」练习场里补完两处 TODO：「清空」按钮点了回到 0；`onSub` 传下去，卡片里多一个「撤销」按钮，点了让数字减一。',
        '给正解里的 `Card` 再加一个 `tag` prop：标题右边显示一个小标签 `<span className="tag">`，两张卡片写不同的字。',
        '把状态提升搬回第 6 课的筛选：`tab` 提到父级，按钮那一排抽成一个子组件，父级把 `tab` 和 `setTab` 一起传下去，页面另一处再显示「共 N 条」—— 点哪个按钮，两处一起变。',
        '用一句话回答我：反例里两个数字为什么始终不一致？我要听到关于「几份数据」的说法，不要听到「没同步」。',
      ],
    },
    {
      type: 'check',
      items: [
        '反例练习场里：先点上面「打卡」三次得到 3 / 0，再点下面两次得到 3 / 2 —— 这两个数我记下来了。',
        '正解练习场里：随便点哪边的「打卡」，两张卡片里的数字永远一模一样。',
        '正解练习场里：我补的「清空」按下之后，两张卡片的数字**一起**回到 0。',
        '正解练习场里，`Card` 组件内部没有 `useState` 这一行 —— 我能指着代码说出这一点。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 把正解里的两张卡片改成三张（就是复制一行），想想为什么**只加一行代码就够了**：数据没变多，只是看它的人多了一个。',
        '- 挑一个你自己生活里「两个地方要显示同一个数字」的场景（记账、健身、背单词都行），画一下组件树，标出这个数字该停在哪一层。',
      ],
    },
  ],
}