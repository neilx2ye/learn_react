// 第 8 课 · 派生状态：能算出来的就不要存
// 格式契约见同目录的 _FORMAT.md，样板课见 Lesson04.js
export default {
  meta: {
    id: 8,
    title: '别存多余的状态',
    stage: '阶段二 · 数据和状态往哪放',
    goal: '能算出来的就不要存',
    minutes: 30,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '第 7 课你把待办清单的 state 提到了父组件，两个子组件终于共用同一份数据了。',
        '',
        '接着你想在页面上显示「完成了几条」。很自然，你又加了一个 state：`const [doneCount, setDoneCount] = useState(0)`，然后在勾选的时候顺手 `setDoneCount(doneCount + 1)`。',
        '',
        '一开始没问题。后来你加了删除按钮 —— 数字就开始骗人了：删掉一条已完成的，「已完成」还停在 1，可你数一数，一条都没勾上。',
        '',
        '这一课要解决的就是这件事：**能算出来的值，一开始就不要存。**',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 能算出来的，在渲染时直接算',
      md: [
        '「完成了几条」本来就是那个数组的一个性质：数一数就知道了。把它单独存成 state，等于把同一个事实抄了两份 —— 两份数据就会有两个版本，两个版本迟早对不上。',
        '',
        'React 给的答案很省事：**写在渲染里，直接算出来。**',
        '',
        '```',
        'const doneCount = items.filter((it) => it.done).length',
        '```',
        '',
        '这行写在组件函数里，每次渲染都会重新执行一遍，所以它永远是最新的。它不是「数据」，它是一句「怎么算」。',
        '',
        '你可能担心每次都重算会不会慢。不会：这就是把数组遍历一遍，React 一秒能做几十万次。性能的事第 13 课再操心，现在还轮不到它。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 「改 A 的时候顺手改 B」',
      md: [
        '这是最典型的坏味道。列个清单就看得很清楚：',
        '',
        '- 添加时别忘同步 —— 记得',
        '- 勾选时别忘同步 —— 记得',
        '- 删除时别忘同步 —— 忘了',
        '- 以后还要加：一键清空、撤销、从接口拉回来 …… 只要有一条路径漏掉，页面上就出现一个骗人的数字，而且它**不报错**。',
        '',
        '更麻烦的是现场离肇事点很远：你删的是一条任务，出问题的是角落里那个数字，中间隔着好几层代码。',
        '',
        '一句判断标准：写 `setXxx` 的时候，如果你心里想的是「**顺便把另一个 state 也对上**」，那另一个 state 就不该存在。',
      ],
    },
    {
      type: 'note',
      title: '知识点 3 · 什么才算真正的 state',
      md: [
        '不是「页面上会变的东西」都要存。真正跑不掉的只有这几类：',
        '',
        '- **用户的输入**：搜索框里打的字、表单里填的内容',
        '- **开关**：显示 / 隐藏、只看未完成、白天 / 夜晚',
        '- **选中的那一项**：当前是哪个标签页、选中了哪一行',
        '- **从接口拿回来的原始数据**：服务端给的那份列表（原样存着，怎么展示是算出来的）',
        '',
        '共同点：**这些值来自组件外面的世界，React 没法从别的东西推出来，只能老老实实记着。**',
        '',
        '反过来，任何「由它们推出来的结果」—— 条数、合计、过滤后的列表、排好序的副本、拼好的文案 —— 都该现算。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 4 · 「那我用 useEffect 同步一下呢？」',
      md: [
        '有人会说：容易漏是吧，那我加个 `useEffect`，只要 `items` 一变就把数字重新算一遍。下一课才学 useEffect，这里先认个脸：**这不叫解决，只是把问题挪了个地方。**',
        '',
        '原来的风险是「忘了同步」，现在的风险是「忘了把 `items` 写进依赖数组」—— 一模一样的东西换了个名字。而且每多一层同步，就多一次渲染、多一个可能出错的环节。',
        '',
        '**一个值如果能算出来，它就不该先被存下来。不需要同步，是因为根本没有第二份。**',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住',
      md: [
        '**存原料，算成品。**',
        '',
        '原料 = 用户的输入、开关、选中项、接口给的数据；成品 = 条数、合计、过滤后的列表。',
        '',
        '拿到一个东西想存成 state 时，先问一句：**「我能不能用别的东西把它算出来？」能，就别存。**',
      ],
    },
    {
      type: 'demo',
      title: '反例：手动维护的「已完成」条数',
      height: 320,
      task: [
        '先点几下勾选框，数字都跟得上，看起来一切正常。',
        '',
        '然后删掉那条**已经勾上**的任务。数字不动了：上面写着「已完成 1 条」，可一条都没勾。',
        '',
        '看一眼 `remove` 函数 —— 它只改了 `items`，忘了同步 `count`。这就是「同一件事存两份」的代价：每一条改动路径上你都得记得改第二个。',
        '',
        '想一想：如果把 `count` 删掉，那个数字该怎么写？',
      ],
      code: `import { useState } from 'react'

export default function App() {
  const [items, setItems] = useState([
    { id: 1, text: '洗衣服', done: true },
    { id: 2, text: '回邮件', done: false },
    { id: 3, text: '买牛奶', done: false },
  ])
  // 第二份数据：手动维护的「已完成」条数
  const [count, setCount] = useState(1)

  function toggle(id) {
    const next = items.map((it) =>
      it.id === id ? { ...it, done: !it.done } : it,
    )
    setItems(next)
    setCount(next.filter((it) => it.done).length)
  }

  function remove(id) {
    setItems(items.filter((it) => it.id !== id))
    // 删除时忘了同步 count
  }

  return (
    <div className="card">
      <div className="row">
        <span className="tag">已完成 {count} 条</span>
        <span className="chip">共 {items.length} 条</span>
      </div>

      <div className="list">
        {items.map((it) => (
          <div key={it.id} className="list-item">
            <input type="checkbox" className="checkbox"
              checked={it.done}
              onChange={() => toggle(it.id)} />
            <span>{it.text}</span>
            <button className="btn"
              onClick={() => remove(it.id)}>删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '反例：把过滤结果也存成 state',
      height: 300,
      task: [
        '先点一下筛选按钮，切到「只看要写的」，列表剩下两条。',
        '',
        '再点「添加一条」。新加的「写第 4 条」明明带「写」字，却**不出现**；再点两下筛选，它又冒出来了。',
        '',
        '原因：`visible` 是**建列表那一刻算好的旧快照**，添加时没有重算。它的对错取决于你记不记得在每一个改 `all` 的地方都补一句。',
      ],
      code: `import { useState } from 'react'

const isWrite = (t) => t.text.startsWith('写')

export default function App() {
  const [all, setAll] = useState([
    { id: 1, text: '写周报' },
    { id: 2, text: '买牛奶' },
    { id: 3, text: '写代码' },
  ])
  const [onlyWrite, setOnlyWrite] = useState(false)
  // 把「过滤后的结果」也存了一份 state
  const [visible, setVisible] = useState(all)

  function pick(val) {
    setOnlyWrite(val)
    setVisible(val ? all.filter(isWrite) : all)
  }

  function add() {
    const n = all.length + 1
    setAll([...all, { id: n, text: '写第' + n + '条' }])
    // 忘了重新算 visible：新任务看不见
  }

  return (
    <div className="card">
      <div className="row">
        <button className="btn"
          onClick={() => pick(!onlyWrite)}>
          筛选：{onlyWrite ? '只看要写的' : '全部'}
        </button>
        <button className="btn primary" onClick={add}>
          添加一条
        </button>
      </div>

      <ul className="list">
        {visible.map((t) => (
          <li key={t.id} className="list-item">
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '下面四个东西，哪一个才真的必须存成 state？',
      options: [
        {
          text: '搜索框里用户输入的那几个字',
          correct: true,
          why: '用户的输入来自组件外面的世界，React 没有任何办法从别的数据推出它来，只能记着。这就是「原料」。',
        },
        {
          text: '列表一共有多少条',
          why: '`items.length` 一行就拿到了。存成 state 等于多一份会过期的副本：添加时忘了改，数字立刻骗人。',
        },
        {
          text: '过滤之后要显示的那份列表',
          why: '它完全由「原始列表 + 过滤条件」决定。原列表一变，这份存下来的结果就过期了 —— 就是上面第二个反例。',
        },
        {
          text: '已经完成了多少条',
          why: '数一数就行：`items.filter((it) => it.done).length`。存下来你就得在添加、删除、勾选、清空每一条路径上都记得改它，你一定会漏一条。',
        },
      ],
    },
    {
      type: 'demo',
      title: '正解：统计和筛选，全部现算',
      height: 340,
      task: [
        '同一个清单，这次一个多余的 state 都没有：`done`、`visible` 都是渲染时现算出来的。',
        '',
        '勾选、取消、删除，随便折腾，右上角的数字永远和勾选框对得上 —— 因为它每次都是重新数出来的。',
        '',
        '补两个 TODO：加一行「**还剩 X 条没做完**」；再加一个「**全部标为完成**」按钮。两个都不许新加 state。',
      ],
      code: `import { useState } from 'react'

export default function App() {
  const [items, setItems] = useState([
    { id: 1, text: '洗衣服', done: true },
    { id: 2, text: '回邮件', done: false },
    { id: 3, text: '买牛奶', done: false },
  ])
  const [onlyDone, setOnlyDone] = useState(false)
  const done = items.filter((it) => it.done)
  const visible = onlyDone ? done : items

  function toggle(id) {
    setItems(items.map((it) => it.id === id
      ? { ...it, done: !it.done } : it))
  }

  function remove(id) {
    setItems(items.filter((it) => it.id !== id))
  }

  return (
    <div className="card">
      <div className="row">
        <span className="tag">已完成 {done.length} 条</span>
        <button className="btn"
          onClick={() => setOnlyDone(!onlyDone)}>
          {onlyDone ? '看全部' : '只看完成的'}
        </button>
      </div>

      {visible.map((it) => (
        <div key={it.id} className="list-item">
          <input type="checkbox" className="checkbox"
            checked={it.done}
            onChange={() => toggle(it.id)} />
          <span>{it.text}</span>
          <button className="btn"
            onClick={() => remove(it.id)}>删除</button>
        </div>
      ))}

      {/* TODO 1：加一行「还剩 X 条没做完」，现算 */}
      {/* TODO 2：加一个「全部标为完成」按钮 */}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question:
        '我给「过滤后的列表」留了一个 state，再加个 useEffect：只要 items 变了就重新筛一遍。这样算写对了吗？',
      options: [
        {
          text: '还是坏味道：这个值根本不该被存下来',
          correct: true,
          why: '对。它本来能从 `items` 和过滤条件算出来。存下来再想办法同步，就是自己给自己加活：多一次渲染，外加一个「依赖忘了写」的新坑。干净的做法是渲染时现算 —— 不需要同步，因为不存在第二份。',
        },
        {
          text: '完美解决，这是 React 推荐的做法',
          why: '能跑，但这是「先制造问题，再补一层去同步」。判断一个值该不该存成 state，看的是它能不能被算出来，不是你能不能同步得上。',
        },
        {
          text: '不行，useEffect 里不能调用 setState',
          why: '可以调用，React 不报错。问题不在于 useEffect 能不能用，而在于这个值本就不该被存成 state。下一课你会看到 useEffect 真正的用途：定时器、请求接口这类和外部世界打交道的事。',
        },
      ],
    },
    {
      type: 'code',
      title: '对照写法',
      code: `// 存：多一份数据，就多一份要同步的责任
const [doneCount, setDoneCount] = useState(0)

setItems(next)
setDoneCount(next.filter((it) => it.done).length)

// 算：需要的时候现算，永远和源头一致
const doneCount = items.filter((it) => it.done).length

// 拿到一个东西想存 state 时，先问自己：
// 「我能不能用别的东西算出它来？」
//   能   → 它不该是 state，删掉，渲染时现算
//   不能 → 留下，它来自组件外面的世界`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '第一个练习场里，给 `remove` 补上同步 `count` 的那一行，让数字不再撒谎。',
        '补完之后再加一条新路径：一个「把所有任务都标成已完成」的按钮。你会亲手体会到这种写法有多累 —— 每加一个功能都要回头伺候那个数字。',
        '第二个练习场里，把 `visible` 这个 state 整个删掉，改成渲染时现算，确认筛选和添加都正常了。',
        '第三个练习场里补齐两个 TODO，并守住一条规矩：**不许新加任何 state**。',
      ],
    },
    {
      type: 'check',
      items: [
        '第一个练习场里，删掉一条已勾选的任务，数字停在原地不动 —— 我能指着 `remove` 里的哪一行说「就是这里漏了」。',
        '第二个练习场里，切到「只看要写的」再点添加，新任务不出现；来回切一次筛选它才冒出来。我能说出这是「存下来的旧快照」造成的。',
        '第三个练习场里，勾选、取消、删除随便点，右上角的「已完成 X 条」永远和勾上的条数对得上。',
        '三个练习场点「运行」都显示运行成功，没有红色报错。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 做一个小购物车：每件商品有名字、单价、数量，用现算的方式显示「共 3 件 · 合计 ¥58.5」；再加一个「多买一件」按钮，看合计跟着变。做完在代码里标一下：哪部分是原料，哪部分是成品。',
        '- 用一句话答我：为什么 React 不介意你每次渲染都重算一遍？',
      ],
    },
  ],
}