// 第 5 课 · 事件与受控表单
// 格式说明见同目录的 _FORMAT.md，样板课见 Lesson04.js
export default {
  meta: {
    id: 5,
    title: '事件与受控表单',
    stage: '阶段一 · 组件的思维',
    goal: '输入框打字，页面实时回显',
    minutes: 25,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '第 4 课你做到了：点一下按钮，屏幕上的数字跟着变。但那份数据是**你自己写死的** —— `useState(0)`，初始值是你给的，用户只能让它加减。',
        '',
        '现在要做的搜索框、表单是另一回事：数据得来自**用户正在敲的键盘**。光有 state 不够，还差一步 —— 用户敲进去的字，怎么才能进到你的 state 里？',
        '',
        '这一课解决这件事。学完你能做出：一个搜索框，打一个字，下面的名单立刻跟着变。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 事件处理器：传的是函数本身',
      md: [
        '在 React 里绑事件很直接，属性名就是 `on` 加上事件名，首字母大写：',
        '',
        '```',
        '<button onClick={handle}>点我</button>',
        '```',
        '',
        '`onClick` 里放的是**一个函数**，React 会在点击发生的那一刻才去调用它。',
        '',
        '**这里有一个新手必踩的坑**：',
        '',
        '```',
        '<button onClick={handle}>    // 对：把函数交给 React',
        '<button onClick={handle()}>  // 错：现在就调用它了',
        '```',
        '',
        '为什么错？`{ }` 里是一段普通的 JavaScript，`handle()` 的意思是「**现在就执行**」。于是：',
        '',
        '1. **渲染的时候**它就被执行了一次 —— 你还没点，事儿已经办了',
        '2. 执行完，它把**返回值**交给了 `onClick`。如果 `handle` 里没有 `return`，返回值是 `undefined`',
        '3. 你点下去时，React 拿着 `undefined` 当处理器，什么都不会发生',
        '',
        '不用背规则，记住一句话：**括号是「现在就执行」，不加括号是「交给 React，等点击时再执行」。**',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 你打的字藏在事件对象 e 里',
      md: [
        '绑在 `<input>` 上的 `onChange`，会在**每次输入**时被调用：敲一个键、删一个字，都算一次。',
        '',
        'React 调用你的函数时，会顺手递过来一个**事件对象**，习惯上叫 `e`。这次事件的信息都在它身上，输入框最常看的是 `e.target.value`：',
        '',
        '- `e.target` 是「事件发生在**哪个元素**上」，这次就是那个输入框',
        '- `e.target.value` 是「输入框**此刻的完整内容**」，也就是你打的那些字',
        '',
        '所以最常见的就是这三行：',
        '',
        '```',
        'const [text, setText] = useState("")',
        '',
        '<input value={text} onChange={(e) => setText(e.target.value)} />',
        '```',
        '',
        '读法：**每次输入 → 把输入框里的字写进 state**。注意是 `e.target.value`（字），不是 `e.target`（那个元素本身）。',
      ],
    },
    {
      type: 'note',
      title: '知识点 3 · 受控组件：value 和 onChange 是一对',
      md: [
        '上面那行 `<input value={text} onChange={...} />` 有个正式名字：**受控组件**。意思是这个输入框显示什么，**由 state 决定**，不由浏览器自己管。',
        '',
        '平时写 HTML，框里有什么字是浏览器自己记着的。React 把「记内容」这件事收回来自己管，靠的就是这两个属性：',
        '',
        '- `value={text}` —— 告诉输入框：**你该显示什么，我说了算**',
        '- `onChange={...}` —— 用户敲字时，**把新内容写回 state**',
        '',
        '两个一起用，这个圈才转得起来：敲字 → 触发 onChange → 更新 state → 重新渲染 → 输入框显示新值。',
        '',
        '**只写 value、不写 onChange，这个圈就断了**：输入框永远只显示 state 里那个值，你敲进去的键会被 React 立刻按回去，一个字都打不进去 —— 就像被锁死了。这是受控组件最经典的翻车现场，下面第一个练习场就是它。',
      ],
    },
    {
      type: 'tip',
      title: '口诀：value 配 onChange，一个 state 管一片',
      md: [
        '**value 和 onChange 永远成对出现。**只写一半，输入框要么锁死，要么行为诡异。',
        '',
        '初始化用 `useState("")`（空字符串），**别用 defaultValue** —— 那是「让浏览器自己管」的写法，React 读不到它，你在别的组件里也拿不到用户打的字。',
        '',
        '不同控件认不同的属性：',
        '',
        '```',
        '<input value={text} onChange={...} />',
        '<input type="checkbox" checked={ok} onChange={...} />',
        '```',
        '',
        '文本框看 `value`，勾选框看 `checked`（勾选框只有「勾上 / 没勾」两种状态，用布尔值更贴切）。勾选框里取的是 `e.target.checked`，不是 `e.target.value`。',
        '',
        '再记住这一课最漂亮的一句话：**同一个 state，可以同时喂给好几个地方**。输入框显示它，下面的名单用 `filter` 过它，页面上还能再显示一遍 —— 一份数据，三处跟着变，这就是「实时回显」的全部秘密。',
      ],
    },
    {
      type: 'demo',
      title: '反例：输入框被锁死了',
      height: 300,
      task: [
        '先在这个输入框里**敲几个字**。光标在闪，可字**就是进不去**。',
        '',
        '再看下面那行「输入框里的字」，它一直是「（空的）」。',
        '',
        '代码只错了一处：`<input>` 上写了 `value`，却没有 `onChange`。',
        '',
        '想一想：键盘没坏、光标也在闪，字为什么进不去？你敲的键，React 本想把它交给谁？',
      ],
      code: `import { useState } from 'react'

export default function App() {
  // setText 定义了，却从头到尾没被用上
  const [text, setText] = useState('')

  return (
    <div className="card">
      <p className="muted">试着在这个框里打字</p>

      {/* 只有 value，没有 onChange */}
      <input className="field" value={text} />

      <p className="small muted">
        输入框里的字：{text || '（空的）'}
      </p>
      <p className="small bad">怎么敲都进不去</p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：搜索框 + 实时过滤名单',
      height: 380,
      task: [
        '答案就是 `onChange` —— 它是那条「回流」的管子：你敲进去的字靠它写回 state，输入框再照着 state 画出来。少了这一环，字当然留不住。',
        '',
        '在框里打个「林」字试试，下面的名单立刻只剩一个人。',
        '',
        '然后补两处 TODO：',
        '',
        '- **TODO 1**：加一个「清空」按钮，点了把 `text` 变回空字符串（是 `setText` 派上用场的时候了）',
        '- **TODO 2**：让比较忽略大小写 —— 输入小写的 `emma` 也能搜到 `Emma`（提示：两边都 `toLowerCase()` 再比）',
        '',
        '改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useState } from 'react'

const NAMES = [
  '林小满', '陈可', '周远航',
  '苏晴', 'Alex', 'Emma',
]

export default function App() {
  const [text, setText] = useState('')

  // 同一个 text 驱动两处：输入框 + 下面的名单
  const shown = NAMES.filter((n) => n.includes(text))

  return (
    <div className="card">
      <p className="muted">找人：打一个字试试</p>

      <input
        className="field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入名字"
      />

      <p className="small muted">
        搜索词：{text || '（还没输入）'}
      </p>

      {/* TODO 1：加一个「清空」按钮，setText('') */}
      {/* TODO 2：两边 toLowerCase 再比，忽略大小写 */}

      {shown.length === 0 ? (
        <p className="empty">没有匹配的人</p>
      ) : (
        <ul className="list">
          {shown.map((name) => (
            <li className="list-item" key={name}>
              {name}
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
      question: '写 `<button onClick={handle()}>点我</button>`，点下去会怎样？',
      options: [
        {
          text: '页面一加载 handle 就先执行了一次，之后点击没反应',
          correct: true,
          why: '对。`{ }` 里是普通表达式，`handle()` 就是「现在就调用」，所以渲染时它已经跑过一次了；它没有 `return`，`onClick` 拿到的是 `undefined`，点下去 React 没有可调用的函数。',
        },
        {
          text: '点击时正常执行，和 `onClick={handle}` 一样',
          why: '这才是它危险的地方：两种写法长得几乎一样，跑起来才发现行为不对。加了括号就是提前调用，交出去的是执行结果，不是那个函数。',
        },
        {
          text: '立刻报错，页面白屏',
          why: '通常不报错，只是行为不对。但如果 `handle` 里改了 state（比如 `setCount(count + 1)`），就会在**渲染过程中改 state** → 触发下一次渲染 → 停不下来，最后以 Too many re-renders 收场。不报错的 bug 更难发现。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '受控组件写成 `<input value={text} />`，忘了 `onChange`，用户敲键盘会怎样？',
      options: [
        {
          text: '一个字都打不进去，输入框像被锁死',
          correct: true,
          why: '对。输入框显示什么完全由 `value` 决定。你敲一个字，浏览器先把它放进去，React 马上按 state 里的旧值重画一遍，又把它抹掉了 —— 看上去就是键盘失灵。',
        },
        {
          text: '能打字，只是 state 不会更新',
          why: '反过来了。`value` 和 state 绑在一起，React 会强行把输入框拉回 state 的值，所以字根本留不住，而不是「留住了但没更新」。',
        },
        {
          text: '能打字，和普通 HTML 输入框一样',
          why: '只有写 `defaultValue`（非受控写法）才是浏览器自己管。一旦写了 `value`，控制权就归 React 了 —— 这也是为什么初始化要用 `useState("")`。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里的样子',
      code: `// 一个「填名字 + 勾选同意」的小表单
const [name, setName] = useState('')
const [agree, setAgree] = useState(false)

<input
  className="field"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="你的名字"
/>

<input
  type="checkbox"
  className="checkbox"
  checked={agree}
  onChange={(e) => setAgree(e.target.checked)}
/>

<p>你选了：{name || '还没填'}</p>`,
    },
    {
      type: 'code',
      title: '反面教材（别抄）',
      code: `// 1. 多了括号：渲染时就执行了
<button onClick={handle()}>重试</button>

// 2. 只有 value：输入框锁死
<input value={text} />

// 3. 语法错误：属性值忘写引号，编译直接过不去
<input className=field value={text} />`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '在「正解」练习场里补齐两个 TODO：**清空**按钮和**忽略大小写**。点完清空，名单要恢复成 6 个人。',
        '在同一个练习场再加一行 `你打了 {text.length} 个字`，看它是不是每敲一下都在变。',
        '给输入框加个「最多 10 个字」的限制：在 `onChange` 里判断，超过 10 个字就不更新 state。先想清楚这样做的后果是什么。',
        '从零写一个自己的小表单：一个名字输入框 + 一个「同意」勾选框，页面上实时显示「你选了：张三，已同意」。',
      ],
    },
    {
      type: 'check',
      items: [
        '反例练习场里我怎么敲字都进不去，正解里一敲就进 —— 我能指着代码说出差别在 `onChange`。',
        '正解练习场：输入「林」，名单只剩一个人；把输入框删空，6 个人全回来。',
        '我补的两个 TODO 都能用：点「清空」输入框变空、名单恢复；输入小写 `emma` 也能搜到 `Emma`。',
        '我自己的小表单里，打「张三」页面立刻显示「你选了：张三」，勾上勾选框会多出「已同意」。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 做一个「实时字数统计 + 超长警告」：输入框下面显示「已输入 12 个字」，超过 20 个字就显示红色的「太长了」。',
        '- 再想一想：`defaultValue` 也能让输入框打进去字，它和 `value + onChange` 差的到底是哪一步？用一句话发我，答对了才算过关。',
      ],
    },
  ],
}