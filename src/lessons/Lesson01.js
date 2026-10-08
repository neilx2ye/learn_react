// 第 1 课 · JSX 与组件
// 旧版 Lesson01.jsx 的知识点、四个 TODO、自查清单、加分题都在这里，
// 只是换成了「数据 + 可交互练习场」的写法。格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 1,
    title: 'JSX 与组件',
    stage: '阶段一 · 组件的思维',
    goal: '写出第一张能复用的技术名片',
    minutes: 20,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '这一课你其实**做过一遍**了：旧文件里两个 TODO 你都填过，页面上出现过两张名片和一个用花括号算出来的年份。',
        '',
        '只是那次你只看到「这样写是对的」，没看到「那样写会怎样」。',
        '',
        '这一课换成练习场：代码可以随手改、随手运行。要拿下的就一件事 —— **React 到底靠什么，把一个普通函数认成组件**。答案藏在名字的第一个字母里。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 组件，就是一个返回 JSX 的函数',
      md: [
        '组件没有那么神秘，它就是一个普通函数，只有两个要求：**返回一段 JSX**，**名字大写开头**。',
        '',
        '```',
        'function NameCard() {',
        '  return <div className="card">你好</div>',
        '}',
        '```',
        '',
        '然后像标签一样使用它：`<NameCard />`。',
        '',
        'React 判断「这是组件，还是浏览器标签」，用的就是首字母：',
        '',
        '- **大写开头** → 我自己写的组件，去调用这个函数',
        '- **小写开头** → 一个 HTML 标签名，比如 `div`、`span`、`p`',
        '',
        '所以 `function nameCard()` 配 `<nameCard />` 时，React 会老老实实去找浏览器要一个 `namecard` 标签。浏览器说不认识它，那块地方就**什么都不画**。',
        '',
        '关键在于：**页面上不报错、不崩溃，就是空的**（React 顶多在浏览器控制台里嘀咕一句，手机上你根本看不到）。空白比报错难找一百倍 —— 报错会指明哪一行，空白只会让你盯着屏幕发呆。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · JSX 长得像 HTML，但它其实是 JavaScript',
      md: [
        'JSX 最后会被转成一堆 JavaScript 值（`React.createElement(...)` 那一类调用）。既然它是 JavaScript，就得守 JavaScript 的规矩。三处最容易翻车：',
        '',
        '- **class 要写成 className**：在 JavaScript 里 `class` 是关键字，不能拿来当属性名。正确写法 `<div className="card">`',
        '- **每个标签都要闭合**：`<br />`、`<img />`，写 `<br>` 就是留了个没关上的标签',
        '- **return 后面只能有一个根标签**：想并列两个，就在外面套一层空的 `<>...</>`（这叫 Fragment，它自己不画任何东西）',
        '',
        '还有注释：JSX 里的注释是 `{/* 想说的话 */}`。在标签中间用 `//` 打注释，会直接崩。',
        '',
        '这三条都是**语法错误**，一写错整个页面就编译不过（下面有对照表可以看）。好消息是：这类错误最难忍，也最好改 —— 报错会明确告诉你第几行。',
      ],
    },
    {
      type: 'note',
      title: '知识点 3 · 花括号里只放「能算出值的东西」',
      md: [
        '`{}` 是 JSX 留给 JavaScript 的插口：里面的东西会先被算出来，再画到页面上。',
        '',
        '能放的是**表达式** —— 说出来就有值的东西：',
        '',
        '- 变量和算式：`{count}`、`{price * 2}`',
        '- 函数调用：`{new Date().getFullYear()}`、`{name.toUpperCase()}`',
        '- 三元判断：`{ok ? "在" : "不在"}`',
        '',
        '不能放的是**语句** —— 只做事、不产生值的东西：`if`、`for`、`const x = 1`。想写判断就用三元 `? :`，或者在 `return` 之前先把结果算好存进变量。',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住',
      md: [
        '**大写开头是组件，小写开头是浏览器标签。**',
        '',
        'JSX 的四条硬规矩也一起背下来：`className`、每个标签都闭合、`return` 只留一个根、`{}` 里只放表达式。',
        '',
        '拿不准的时候回想一句：**你写的不是 HTML，是一个长得像 HTML 的 JavaScript 值。**',
      ],
    },
    {
      type: 'demo',
      title: '反例：小写开头的组件',
      height: 260,
      task: [
        '先看预览：页面上写着「下面这一块，本该有一张名片」，但**下面什么都没有**。',
        '',
        '再看代码，找一处只差一个字母的错误 —— 那是个小写字母。',
        '',
        '猜一猜：React 把 `<nameCard />` 当成什么了？页面上为什么一点反应都没有？',
        '',
        '把 `nameCard` 改成 `NameCard`（**函数定义和用它那一行都要改**），点「运行」，空白处立刻长出一张名片。',
      ],
      code: `// 这个名字是小写开头，React 不会把它当组件
function nameCard() {
  return (
    <div className="card">
      <h2>你的名字</h2>
      <p className="muted">一句话介绍自己</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <p className="muted">下面这一块，本该有一张名片</p>
      {/* 小写：React 去找一个叫 namecard 的标签 */}
      <nameCard />
      <p className="hint">现在这里是空的</p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：可以自己改的技术名片',
      height: 360,
      task: [
        '这张名片能跑，而且**已经用了两次**：同一个 `<NameCard />` 写两遍，就是两张名片 —— 这就是「复用」。',
        '',
        '补齐两处 TODO：把占位文字换成你自己的名字和一句话介绍；再复制一个技能标签，换个技能名。',
        '',
        '最后看最下面那行：`{new Date().getFullYear()}` 用花括号把年份算了出来。明年再打开这个页面，它会自己变成新数字。',
        '',
        '改完点「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `// 组件：名字大写开头，返回一段 JSX
function NameCard() {
  return (
    <div className="card">
      {/* TODO 1：把这两行换成你自己的信息 */}
      <h2>你的名字</h2>
      <p className="muted">一句话介绍自己</p>

      <div className="row">
        <span className="tag">JavaScript</span>
        {/* TODO 2：照着上面复制一个，换个技能名 */}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      {/* 同一个组件用两次，就是两张名片 */}
      <NameCard />
      <NameCard />

      <p className="small muted">
        今年是 {new Date().getFullYear()} 年
      </p>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: '把组件写成 `function nameCard()`，页面里写 `<nameCard />`，屏幕上会怎样？',
      options: [
        {
          text: '那块地方什么都没有，页面其他部分照常显示',
          correct: true,
          why: '对。React 靠首字母判断：小写就当 HTML 标签名。浏览器不认识 namecard 这个标签，于是画出一个没有内容的空标签 —— 没有报错、不崩溃，只是空着。',
        },
        {
          text: '报错：找不到 nameCard 组件',
          why: '不报错。这正是它难找的原因：屏幕上一片空白，你会反复检查花括号、引号、括号，而问题就在名字的第一个字母上。',
        },
        {
          text: '页面上会显示文字 nameCard',
          why: '不会。React 不会把函数名当文字画出来，它是把这个名字当成了一个没有内容的 HTML 标签。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '想在页面上显示今年是第几年，哪一句是对的？',
      options: [
        {
          text: '`<p>今年是 {new Date().getFullYear()} 年</p>`',
          correct: true,
          why: '对。花括号是 JSX 留给 JavaScript 的插口，里面的表达式会先算出来，再把结果画到页面上。',
        },
        {
          text: '`<p>今年是 new Date().getFullYear() 年</p>`',
          why: '少了花括号，React 只当它是一串普通文字，屏幕上会原样显示这几个字符。',
        },
        {
          text: '`<p>今年是 {if (true) { 2026 }} 年</p>`',
          why: '花括号里只能放表达式，if 是语句，这段代码编译不过 —— 页面会直接报错。要判断就用三元 `? :`。',
        },
      ],
    },
    {
      type: 'code',
      title: '对照表：这些错法编译不过，所以只能放在这里给你看',
      code: `// ✗ 错的（一写就崩，别抄）
<div class="card">你好</div>     class 是 JS 关键字，要写 className
<p>第一行<br>第二行</p>          <br> 没闭合，要写 <br />
return (<p>1</p><p>2</p>)        两个并列的根标签，不行
<p>{ if (ok) { 1 } }</p>         花括号里不能放 if

// ✓ 对的
<div className="card">你好</div>
<p>第一行<br />第二行</p>
return (<><p>1</p><p>2</p></>)
<p>{ ok ? "在" : "不在" }</p>

// ✓ 注释也不一样
{/* 这是 JSX 的注释 */}
// 上面这种注释只能写在 JSX 外面`,
    },
    {
      type: 'code',
      title: '你写出来的答案（存档）',
      code: `function NameCard() {
  return (
    <div className="card">
      <h2>你的名字</h2>
      <p className="muted">Front End Developer</p>

      <div className="row">
        <span className="tag">JavaScript</span>
        <span className="tag">CSS</span>
        <span className="tag">React</span>
      </div>
    </div>
  )
}

export default function Lesson01() {
  return (
    <div className="lesson">
      {/* 写两遍，就是两张名片 */}
      <NameCard />
      <NameCard />

      <div className="card">
        <h2>小练习：把 JS 塞进 HTML</h2>
        <p>今年是 {new Date().getFullYear()}年</p>
        <p>1 + 1 等于 {1 + 1}</p>
      </div>
    </div>
  )
}`,
    },
    {
      type: 'text',
      md: [
        '这就是你上次的成果，这次的练习场把它升级成可以动手改的版本。名字和技能标签都是你当时自己填的，这里留成占位 —— **你可以在第二个练习场里继续改它。**',
      ],
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '第一个练习场里，把 `nameCard` 改成 `NameCard`（函数那一处、用它的那一处都要改），点「运行」确认那张名片真的出现了。',
        '第二个练习场里补齐两个 TODO：换成你自己的名字和一句话介绍，再加一个技能标签。做完页面上应该有两张名片，每张至少两个标签。',
        '故意删掉第二个练习场里的一个 `</div>`，点「运行」，把红色报错读一遍 —— 这就是语法错误的现场；然后把 `</div>` 补回来，确认又能跑。',
        '在第二个练习场里加一行 `<p>1 + 1 等于 {1 + 1}</p>`，运行看到 2；再把花括号去掉，看屏幕上变成什么样。',
      ],
    },
    {
      type: 'check',
      items: [
        '第一个练习场改完之后，原来空着的位置真的出现了一张名片，两个练习场都显示「✓ 运行成功」。',
        '第二个练习场里我看得到**两张**名片，每张上面都是我自己的名字和介绍，并且至少有 2 个技能标签。',
        '「今年是 ___ 年」显示的是真实年份，不是我在代码里手写死的数字。',
        '我故意删 `</div>` 时看到过红色报错，补回来报错就消失了 —— 我认得语法错误长什么样。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 再写一个组件 `function SkillCard()`：标题写「我的学习目标」，里面用 `<ul>` 列三条你这三个月想学会的东西，然后在页面上和 `<NameCard />` 一起用。体会一下「一处定义、多处使用」。',
        '- 想给名片加头像：照旧写 `<img src="https://..." alt="头像" width="80" />`（注意它是自闭合的）；练习场里更省事的做法是用 emoji，比如在名字前面加一个 `🧑‍💻`，不用等图片加载。',
        '- 想一想：`<br />` 为什么必须写成自闭合的 `<br />`，不能学 HTML 写 `<br>`？用一句话把答案发我，答对了这一课才算过关。',
      ],
    },
  ],
}