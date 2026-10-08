// 第 3 课 · 列表渲染与 key
// 由旧版 lesson 3 搬过来，知识点、四个 TODO、自查、加分题都保留
export default {
  meta: {
    id: 3,
    title: '列表渲染与 key',
    stage: '阶段一 · 组件的思维',
    goal: '数组里有几个人，就画几张卡',
    minutes: 30,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '第 2 课你已经能让一张卡片显示不同的人，但那是**换来换去**：数据变了，JSX 里那一行还得你自己改。',
        '',
        '试一件小事：往名单里再加一个人。你需要动的不是数据，而是再抄一遍 `<NameCard />`。那要是 20 个人呢？',
        '',
        'React 的答案是：**把整个数组交给它，让它自己重复**。学会这一课，以后数据多一条少一条，渲染代码一行都不用改。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 数组 → 一堆标签，靠 .map()',
      md: [
        '`.map()` 的作用一句话说完：**把数组里的每一项，变成另一样东西，然后返回一个新数组**。',
        '',
        '```',
        'const nums = [1, 2, 3]',
        'const doubled =',
        '  nums.map((n) => n * 2)',
        '// → [2, 4, 6]',
        '```',
        '',
        '它能用在 JSX 里，是因为两件事刚好凑上了：**map 的返回值正好是一个数组**，而花括号 `{}` 里可以放任何**表达式**。数组里装的是 JSX，React 就把它一个个铺开画出来：',
        '',
        '```',
        '{PEOPLE.map((person) => (',
        '  <NameCard',
        '    key={person.id}',
        '    name={person.name}',
        '  />',
        '))}',
        '```',
        '',
        '注意这里没有 `for`、没有 `if`：JSX 里只能放**表达式**（有值的东西），`for` 和 `if` 是**语句**（不产生值）。要循环就用 `.map()`，要筛选就用 `.filter()`。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 忘了 return：页面空白，而且不报错',
      md: [
        '下面这种写法你一定要认出来 —— 它长得像对的：',
        '',
        '```',
        '{PEOPLE.map((person) => {',
        '  <NameCard',
        '    key={person.id}',
        '    name={person.name}',
        '  />',
        '})}',
        '```',
        '',
        '它不报错，但页面上**一个人都没有**。原因在这里：',
        '',
        '- `(person) => (` 的圆括号是「把这个值直接返回」',
        '- `(person) => {` 的大括号是「函数体」，你写的是一个多行的普通函数',
        '- 普通函数**不写 return 就等于返回 undefined**',
        '- React 收到一串 `undefined`，每个都当成「这里什么都不画」',
        '',
        '这就是**静默失效**：语法合法、能跑、控制台没有红线，只是结果不对。卡住你的 90% 是这种事，而且没有任何报错给你指路 —— 只能靠眼睛去对。',
      ],
    },
    {
      type: 'tip',
      title: '知识点 3 · key 是发给 React 的身份证',
      md: [
        '列表会变：中间插一条、删一条、按名字重排。React 必须判断「屏幕上这一项，还是不是原来那一项」，才能决定复用还是重画。**key 就是它手里的对照表，不是给你看的。**',
        '',
        '- 要**唯一**：同一次列表里不能重复',
        '- 要**稳定**：这一项今天是什么 key，明天还得是 —— 所以用数据自带的 `person.id`',
        '- **别拿数组下标当 key**：下标跟着位置走。你在前面插一条，原来的第 0 项变成第 1 项，下标就换了主人，React 会把内容甚至状态认错人（第 4 课学了 state，你会看到「输入框里的字跑到别人身上」）',
        '',
        '现在就把 `key` 换成下标试一下：页面看起来一模一样 —— **它是错的，只是这个列表还没到会暴露的时候**。所以这种错只能靠懂，眼睛看不出来。',
        '',
        '顺口记一句：**箭头函数想直接返回值，就别加大括号。**',
      ],
    },
    {
      type: 'note',
      title: '知识点 4 · 要筛选，就在前面接一个 .filter()',
      md: [
        '`.filter()` 同一个套路：给它一个条件，它返回**只包含符合条件那些项的新数组**。',
        '',
        '```',
        'const seniors = PEOPLE.filter(',
        '  (person) => person.years >= 3,',
        ')',
        '```',
        '',
        '然后照常 `.map()` 这一份新的就行。两个事实要记住：**filter 和 map 都不会改动原数组**，它们都是造一份新的出来。所以 `PEOPLE` 永远是完整的那几个 —— 你可以放心地筛。',
      ],
    },
    {
      type: 'demo',
      title: '反例：少了一个 return，一个人都没画出来',
      height: 300,
      task: [
        '先看下面的预览：**一张名片都没有**，只有一句话告诉你数据里有 4 个人。',
        '',
        '`.map()` 写了，`<div>` 也在，为什么一个都不出现？下面也不会有红字报错 —— 这正是最需要提防的「静默失效」。',
        '',
        '去找回调那一行：它结尾是 `{` 还是 `(`？把 `{` 改成 `(`、`)` 补上闭合，或者在大括号里加一句 `return`，再点「运行」。',
      ],
      code: `const PEOPLE = [
  { id: 'p1', name: '小李', role: '产品经理' },
  { id: 'p2', name: '老王', role: '后端工程师' },
  { id: 'p3', name: '阿珍', role: 'UI 设计师' },
  { id: 'p4', name: '阿豪', role: '前端实习生' },
]

export default function App() {
  return (
    <div className="stack">
      <div className="card">
        <h2>团队成员</h2>
        <p className="small muted">
          数据里明明有 {PEOPLE.length} 个人
        </p>
      </div>

      {/* 就是这里：大括号 + 忘了 return */}
      {PEOPLE.map((person) => {
        <div key={person.id} className="card">
          <strong>{person.name}</strong>
          <span className="muted"> {person.role}</span>
        </div>
      })}

      <div className="hint small">
        这里本该有 {PEOPLE.length} 张名片，现在一张都没有
      </div>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：一列名片 + 人数 + 只显示老员工',
      height: 360,
      task: [
        '先点几次「运行」，确认「全部成员 · 共 4 位」这句话和下面画出来的名片**张数对得上**。',
        '',
        '然后补两个 TODO：',
        '',
        '- TODO 1：照上面那段 `.map()` 再写一遍，把 `PEOPLE` 换成 `seniors`',
        '- TODO 2：在新列表前面加一句「从业满 3 年 · 共 {`seniors.length`} 位」',
        '',
        '做完应该只剩 3 张卡 —— 从业 1 年的阿豪被 filter 挡掉了，但上面那份全部成员里他还在。',
      ],
      code: `const PEOPLE = [
  { id: 'p1', name: '小李', role: '产品经理', years: 3 },
  { id: 'p2', name: '老王', role: '后端工程师', years: 8 },
  { id: 'p3', name: '阿珍', role: 'UI 设计师', years: 5 },
  { id: 'p4', name: '阿豪', role: '前端实习生', years: 1 },
]

function NameCard({ name, role, years }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p className="small muted">
        {role}，从业 {years} 年
      </p>
    </div>
  )
}

export default function App() {
  // filter 造一份新数组，PEOPLE 本身不动
  const seniors = PEOPLE.filter(
    (person) => person.years >= 3,
  )

  return (
    <div className="stack">
      <p className="muted">全部成员 · 共 {PEOPLE.length} 位</p>

      {PEOPLE.map((person) => (
        <NameCard
          key={person.id}
          name={person.name}
          role={person.role}
          years={person.years}
        />
      ))}

      {/* TODO 1：照上面那段再写一遍，换成 seniors */}
      {/* TODO 2：在新列表前加一句 */}
      {/*「从业满 3 年 · 共 {seniors.length} 位」*/}
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '回调写成 `(person) => { <Card /> }`（大括号里没有 return），页面会怎样？',
      options: [
        {
          text: '一片空白，而且没有任何报错',
          correct: true,
          why: '大括号是函数体，没有 return 就等于返回 `undefined`；React 拿到一串 `undefined`，每个都当成「这里什么都不画」。代码合法、能跑、不报错，就是不显示 —— 只能靠眼睛发现。',
        },
        {
          text: '报错：map 的回调必须返回值',
          why: '不报错。JS 允许函数不返回值（返回的就是 `undefined`），React 也不会为 `undefined` 报错，所以这类问题最难查。',
        },
        {
          text: '正常显示，只是控制台警告 key 重复',
          why: '一个都没画出来，轮不到 key 的问题。key 警告只出现在真的渲染出了元素、但其中某个没写 key 的时候。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '每项数据都有 `id`，为什么还要用 `id` 当 key，而不是直接用数组下标？',
      options: [
        {
          text: '因为顺序一变，下标就换了主人',
          correct: true,
          why: '在第一条前面插入一条，原来的第 0 项就变成第 1 项，下标跟着位置走了。React 靠 key 认人，认错人就会把内容甚至状态串到别的行上。`id` 跟着数据走，怎么排序都还是他自己。',
        },
        {
          text: '因为下标不唯一',
          why: '在同一个列表里，下标恰好是唯一的 —— 问题不在这儿，而在于它**不稳定**：插入、删除、排序之后，它指代的已经不是原来那一项了。',
        },
        {
          text: '因为用下标会直接报错',
          why: '不报错，页面看着也正常。只有在「列表会变 + 每一行带状态（输入框、勾选框）」时，才会以状态串位的形式暴露出来，所以现在先记个印象。',
        },
      ],
    },
    {
      type: 'code',
      title: '你写出来的答案（存档）',
      code: `// 你当时写的，代码一字没改

// ① 技能：一个技能一个标签
{props.skills.map((skill) => (
  <span key={skill} className="tag">
    {skill}
  </span>
))}

// ② 人数
共 {PEOPLE.length} 名成员

// ③ 只留满 3 年的人：filter + map
//    你当时一口气写完的，左右滑动看全
{PEOPLE.filter((person) => person.years >= 3).map((person) => (
  <NameCard
    key={person.id}
    name={person.name}
    role={person.role}
    years={person.years}
    skills={person.skills}
  />
))}`,
    },
    {
      type: 'code',
      title: '真实项目里的样子',
      code: `// 后端返回的数组，每项都自带 id
<ul className="list">
  {todos.map((todo) => (
    <li
      key={todo.id}
      className="list-item"
    >
      <span>{todo.title}</span>
      <span className="chip">
        {todo.tag}
      </span>
    </li>
  ))}
</ul>`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '把第一个练习场里那个缺失的 `return` 补上（回调改成 `(person) => (`，或在大括号里加一句 `return`），点「运行」，让 4 张名片出现。',
        '在第二个练习场里补齐两个 TODO：用 `seniors` 渲染出「满 3 年」的那一列，并在它前面写上人数。做完只剩 3 张卡。',
        '改数据：给 `PEOPLE` 加一个人（**记得给一个没人用过的 id**），一行 JSX 都不动，看页面是不是自动多出一张卡。',
        '把技能标签补回来：给每个人加 `skills` 数组，卡片里写 `{person.skills.map((skill) => (<span key={skill} className="tag">{skill}</span>))}`，生成一排小标签。',
      ],
    },
    {
      type: 'check',
      items: [
        '第一个练习场里一张名片都没有，状态栏却是「✓ 运行成功」、没有红字 —— 我能指认出那个缺失的 `return`。',
        '第二个练习场里「全部成员 · 共 4 位」的数字，和屏幕上画出来的名片张数对得上；往数据里加一个人、不改任何 JSX，卡片自己就多出一张。',
        '换成 `seniors` 的那一列里，从业 1 年的阿豪不见了，而上面「全部成员」里他还在 —— 说明 filter 没动原数组。',
        '每张卡里的技能是一个个独立的小圆标签，不是挤在一起的一串文字（我先给数据补上了 `skills`）。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 筛完一个人都不剩的时候，页面会空一大片 —— 给个兜底提示，比如 `<p className="empty">没有符合条件的人</p>`。**当心一种写法**：`seniors.length && <p>...</p>`，空数组时 `0` 会被 React 原样画成一个 **0** 在屏幕上。写清楚就好：`seniors.length === 0 ? ... : ...`。',
        '- 把技能那一块抽成独立的小组件 `SkillList`（它自己内部 `props.skills.map(...)`），让卡片组件里再套一个组件。',
      ],
    },
  ],
}