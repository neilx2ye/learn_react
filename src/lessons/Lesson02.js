// 第 2 课 · Props：让组件接收数据
// 这一课是把旧版 Lesson02.jsx 搬进新格式，格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 2,
    title: 'Props：让组件接收数据',
    stage: '阶段一 · 组件的思维',
    goal: '同一个组件，喂不同数据',
    minutes: 25,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '上一课你写了两次 `<NameCard />`，两张名片长得一模一样 —— 因为那段标签是你抄了两遍的。',
        '',
        '要显示 3 个不同的人，就得抄 3 遍；哪天改一处样式，三个地方都得跟着改一次。抄得越多，漏改的机会越大。',
        '',
        'React 的解法：把「会变的那部分」变成**参数**传进去。这个参数就叫 **props**。组件还是那一个组件，喂进去的数据不同，长出来就不一样。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 组件就是个函数，props 就是它的参数',
      md: [
        '把组件当函数看，这件事立刻就通了：',
        '',
        '```',
        'function NameCard(props) { ... }',
        '',
        '<NameCard name="X" years={3} />',
        '```',
        '',
        '你写的那个标签，其实就是**调用这个函数**；写在标签上的每个属性，会被收进**一个对象**递进去 —— 这个对象就是 props。',
        '',
        '所以标签上写 `name="X"`，函数里就拿到 `props.name`，值就是 `"X"`。**属性名必须和你传进去的 key 一模一样**：组件里写 `props.nane`，页面上就是空的。',
        '',
        '换句话说，你收到的不是「一堆参数」，而是**一个普通的对象**，形如 `{ name: "X", years: 3 }`。想拿哪个字段，就点哪个 key。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 引号还是花括号，差的是「类型」',
      md: [
        '同一个 `years`，写引号和写花括号，传进去的是**两种不同的东西**：',
        '',
        '```',
        'years="3"    // 字符串：一串文本，不能当数字用',
        'years={3}    // 数字：能直接拿来算',
        '```',
        '',
        '规矩只有一条：**要传字符串，用双引号；要传数字、布尔值、变量或表达式，用花括号。**',
        '',
        '为什么这条最容易踩？因为页面上 `"3"` 和 `3` **显示出来一模一样**，都是 3，看着毫无问题 —— 直到你拿它去做加法。',
        '',
        '`"3" + 1` 的结果是 `"31"` 而不是 4：`+` 一旦碰到字符串，就从前面的加法变成后面的**拼接**。下面第一个练习场就会让你亲眼看到这一下。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 3 · props 是只读的，数据只从上往下流',
      md: [
        'React 传下来的这份 props，**你只能读，不能改**。在组件里写 `props.name = "别人"` 是无效的：这份对象被视为只读，你改了它也传不回去，页面不会因此变化（下次渲染时父组件又会传一份新的下来）。',
        '',
        '要改数据，得由**拥有这份数据的那个组件**去改，然后重新渲染、传一份新的下来。这件事的具体做法是第 7 课「状态提升」的主角。',
        '',
        '方向也是固定的：**父组件 → 子组件**，一路向下。子组件没法反过来往上塞数据，也不能偷偷改父组件给的东西 —— 这个「只往下走」就是大家说的 props 单向流动。',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住',
      md: [
        '**组件只负责「长什么样」，数据从外面喂进来。** 同一个组件喂不同的数据，就长成不同的样子 —— 这就叫复用。',
        '',
        '传值时：字符串用引号 `name="X"`，数字、布尔、变量用花括号 `years={3}`。',
        '',
        '还有一句：**props 只能读，不能改；数据只往下流。**',
      ],
    },
    {
      type: 'demo',
      title: '反例：三张卡片，两处不对',
      height: 330,
      task: [
        '三张卡片用的是**同一个组件**，只是喂进去的数据不同。第一张一切正常：X / 前端工程师 / 从业 3 年 / 明年第 4 年。',
        '',
        '另外两张各有一处不对 —— 一张**算出来的数字很离谱**，一张**少了一整行内容**（看卡片是不是矮了一截）。先别急着改，把它们找出来。',
        '',
        '提示：组件一个字都没写错，问题全在下面三次 `<NameCard />` 的**传值**上。找到后把两处改对，点「运行」确认。',
      ],
      code: `// 同一个组件，喂三份数据
function NameCard(props) {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p className="muted">{props.role}</p>
      <p className="small">从业 {props.years} 年</p>
      <p className="muted">明年第 {props.years + 1} 年</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <NameCard name="X" role="前端工程师" years={3} />
      <NameCard name="小李" role="产品经理" years="3" />
      <NameCard name="老王" years={8} />
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：组件照旧，三份数据',
      height: 360,
      task: [
        '同样的组件、同样三张卡片，这次数据都传对了。先看技能那一块：现在挤成了 `JavaScriptCSS`，中间没有任何分隔。',
        '',
        '**TODO 1**：把 `{props.skills}` 改成先 `join` 再显示，让它变成 `JavaScript / CSS`。',
        '',
        '**TODO 2**：照着上面再加一张卡片，换成你自己编的人和职位。改完点「运行」。',
      ],
      code: `const SKILLS = ['JavaScript', 'CSS']

function NameCard(props) {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p className="muted">{props.role}</p>
      <p className="small">从业 {props.years} 年</p>
      <div className="row">
        {/* TODO 1：让技能带 / 分隔，提示 .join() */}
        <span className="tag">{props.skills}</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <NameCard name="X" role="前端工程师"
        years={3} skills={SKILLS} />
      <NameCard name="小李" role="产品经理"
        years={3} skills={SKILLS} />
      <NameCard name="老王" role="后端工程师"
        years={8} skills={SKILLS} />

      {/* TODO 2：照着上面再加一张，换个人 */}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '组件里写 `props.years + 1`，那 `<NameCard years="3" />` 和 `<NameCard years={3} />` 各会得到什么？',
      options: [
        {
          text: '前者是 `"31"`，后者是 `4`',
          correct: true,
          why: '对。引号里的 3 是字符串，`+` 碰到字符串就变成拼接，"3" + 1 得到 "31"；花括号里是数字 3，3 + 1 才是 4。页面上光看「从业 3 年」两行是一样的，一算才露馅。',
        },
        {
          text: '两个都是 `4`',
          why: '这是最省事的假设。但 JSX 里的引号不是装饰：`years="3"` 传进去的确实是字符串，不是数字，运算规则也不一样。',
        },
        {
          text: '两个都报错',
          why: '都不报错，这正是它难被发现的原因 —— 字符串参与运算得到一个看起来还挺像样子的 "31"，页面照常渲染，安安静静地错着。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '在 `NameCard` 里面写 `props.name = "小李"`，页面上的名字会怎样？',
      options: [
        {
          text: '不会变，还是父组件传下来的那个名字',
          correct: true,
          why: '对。props 是只读的：改了它既不会通知 React 重新渲染，下次渲染时父组件又会传一份新的下来，你的修改立刻被冲掉。要改数据，得让拥有数据的组件去改。',
        },
        {
          text: '立刻变成小李',
          why: '这是最自然的直觉 —— 赋值嘛。但页面要不要重画由 React 说了算，而它根本不知道你动了 props；何况渲染一次就被父组件的新值覆盖了。',
        },
        {
          text: '编译不过，会报语法错误',
          why: '这是一句合法的 JS，编译照样通过。React 不靠编译器拦你，靠的是「props 只读」这条约定，所以这类 bug 得自己心里有数。',
        },
      ],
    },
    {
      type: 'text',
      md: [
        '你在旧版已经完整做过这一课，四个 TODO 全部填对了：名字、职位、年限各显示一处，再加上三次调用各传一份数据。',
        '',
        '下面这份是**你的答案存档** —— 写法是对的，尤其是 `years` 那三个花括号。今天要补的是「为什么这样写才对」。',
      ],
    },
    {
      type: 'code',
      title: '你写出来的答案（存档）',
      code: `// 你当时的写法（为了手机上好看，长行我折了一下）
const PEOPLE = [
  { name: 'X', role: 'Front End Developer', years: 1 },
  { name: '小李', role: '产品经理', years: 3 },
  { name: '老王', role: '后端工程师', years: 8 },
]

// 三次调用都传的是变量（花括号），数字没被引号变成字符串
<NameCard name={PEOPLE[0].name} role={PEOPLE[0].role}
  years={PEOPLE[0].years} skills={['JavaScript', 'CSS']} />

<NameCard name={PEOPLE[1].name} role={PEOPLE[1].role}
  years={PEOPLE[1].years} skills={['JavaScript', 'CSS']} />

<NameCard name={PEOPLE[2].name} role={PEOPLE[2].role}
  years={PEOPLE[2].years} skills={['JavaScript', 'CSS']} />`,
    },
    {
      type: 'code',
      title: '真实项目里的样子：把 props 拆开写',
      code: `// 每次都写 props.name / props.role 有点啰嗦，
// 直接在参数位置把要用的 key 拆出来（这叫解构）
function NameCard({ name, role, years, skills }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p className="muted">{role}</p>
      <p className="small">从业 {years} 年</p>
      <span className="tag">{skills.join(' / ')}</span>
    </div>
  )
}`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '正解练习场：补齐 TODO 1（让技能显示成 `JavaScript / CSS`）和 TODO 2（加第四张卡片）。',
        '反例练习场：把 `years="3"` 改成 `years={3}`，再给老王补上 `role`，三张卡片全部恢复正常。',
        '把正解练习场里的 `SKILLS` 改成 `["React", "CSS"]`，页面上的技能跟着变了，而组件那几行一个字没动 —— 体会一下什么叫「数据从外面喂进来」。',
        '给自己熟悉的三样东西（咖啡、书、游戏都行）各做一张卡片：同一个组件、三份数据。想清楚每个字段该用引号还是花括号。',
      ],
    },
    {
      type: 'check',
      items: [
        '反例练习场里，我把 `years="3"` 改成 `years={3}` 之后，小李那张卡从「明年第 31 年」变成了「明年第 4 年」。',
        '正解练习场里三张卡片的姓名、职位、年限都对得上，技能显示成 `JavaScript / CSS`，不再是 `JavaScriptCSS`。',
        '我加的第四张卡片显示的是我自己写的数据，外形和前三张完全一样。',
        '两个练习场点「运行」都显示 ✓ 运行成功，没有红色报错。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- **弄坏它**：把正解练习场里 `name="X"` 的 key 改成 `nane`，看第一张卡片的姓名那里变成了什么（空了一块），再改回去。这就是「属性名必须和你传的 key 对上」的直接后果。',
        '- **让数字参与计算**：把「从业 N 年」那行改成 `入职约 {2026 - props.years} 年`，看看三张卡片各是多少。数字类型的 props 能直接拿来算 —— 换成字符串就会出上文那种怪数字。',
      ],
    },
  ],
}