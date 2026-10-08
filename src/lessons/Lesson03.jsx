// ============================================================================
// 第 3 课 · 列表渲染与 key
// ----------------------------------------------------------------------------
// 【为什么要学这个】
//   第 2 课你已经能让一张卡片显示不同的人，但 PEOPLE 里再加一个人，你就得再抄一行
//   <NameCard />。那要是有 20 个人呢？React 的答案是：把数组整个交给它，让它自己重复。
//
// 【知识点 1】数组 → 一堆标签，靠 .map()
//     花括号里可以放表达式，而 .map() 的返回值正好是一个数组 —— 里面装的又是 JSX，
//     React 会把它原样铺开渲染：
//       {PEOPLE.map((person) => <NameCard key={person.id} name={person.name} />)}
//
//     ⚠️ 坑 1：回调写成 (person) => { ... } 却忘了 return，页面会整片空白。
//        大括号是「函数体」不是「返回对象」；箭头函数想直接返回就别加大括号。
//     ⚠️ 坑 2：JSX 里不能写 for / if 这种语句 —— 语句不产生值。
//        要循环用 .map()，要筛选用 .filter()，它们都是「表达式」，有返回值。
//
// 【知识点 2】key 是发给 React 的身份证，不是给你看的。
//     列表会变（插入、删除、排序），React 得判断「这一项还是不是原来那一项」，
//     才能决定是复用还是重建那一段 DOM。没有 key 它认不出谁是谁，只会在控制台
//     提醒你：Each child in a list should have a unique "key" prop.
//
// 【知识点 3】key 要「唯一」并且「稳定」，用数据自带的 id。
//     拿数组下标当 key 是新手最常踩的坑：下标跟着位置走，一旦排序或者在中间插入，
//     下标就换了主人，React 会把内容和状态认错人（第 4 课学了 state 你会亲眼看到）。
// ============================================================================


// ① 数据。注意每个人都带了 id —— 这就是等下要喂给 key 的东西。
const PEOPLE = [
  { id: 'p1', name: 'X', role: 'Front End Developer', years: 1, skills: ['JavaScript', 'CSS'] },
  { id: 'p2', name: '小李', role: '产品经理', years: 3, skills: ['Axure', 'SQL'] },
  { id: 'p3', name: '老王', role: '后端工程师', years: 8, skills: ['Go', 'MySQL'] },
  { id: 'p4', name: '阿珍', role: 'UI 设计师', years: 5, skills: ['Figma', '插画'] },
]


// ② 名片组件。这部分是第 2 课你自己写出来的，我照你的答案补全了，可以直接用。
function NameCard(props) {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p className="muted">{props.role}</p>
      <p className="small">从业 {props.years} 年</p>

      <div className="row">
        {/* TODO 1：现在技能被 join 成了一整串文字。改成「一个技能一个标签」：
            用 props.skills.map(...) 生成多个 <span className="tag">
            （DOM 里就回到第 1 课那种一排小圆标了）
            动手前先默念两件事：回调要 return、每一项都要 key */}
        { props.skills.map((skill) => <span key={skill} className="tag"> { skill } </span>) }
      </div>
    </div>
  )
}


export default function Lesson03() {
  return (
    <div className="lesson">
      <h1>第 3 课 · 列表渲染与 key</h1>

      <div className="hint">
        下面这些卡片是「手抄」出来的 —— <code>PEOPLE</code> 里几个人，就抄几行。
        <br />
        你的任务：把手抄的部分删掉，改成让数组自己渲染。
      </div>

      {/* TODO 2：删掉下面四行手抄的卡片，换成一行 .map()：
          形如 {PEOPLE.map((person) => <NameCard key={...} ... />)}
          · 给 <NameCard> 传 name / role / years / skills，值从 person 上取
          · 别漏了 key，值用 person.id
          · 换完看一眼 F12：如果冒出 "unique key" 警告，就是 key 漏了 */}
      { PEOPLE.map((person) => <NameCard key={person.id} name={person.name} role={person.role} years={person.years} skills = {person.skills} />) }
      {/* TODO 3：在页面下方显示人数，形如「共 4 位成员」。
          提示：.length 就是长度；改改 PEOPLE 里的人数，数字要跟着变 */}
      共{ PEOPLE.length }名成员
      {/* TODO 4：只渲染「从业满 3 年」的人。
          在 TODO 2 那行前面接一个 .filter() 就行 —— 先筛出符合条件的新数组，再 map。
          ⚠️ filter 和 map 都不会改动 PEOPLE 本身，原数组还是 4 个人。
             改完 console.log(PEOPLE) 验证一下这个说法 */}
       { PEOPLE.filter((person) => person.years>=3 ).map((person) => 
        <NameCard key={person.id} name={person.name} role={person.role} years={person.years} skills = {person.skills} />
        ) }
      {/* ============================================================
          ✅ 自查（4 条全过才算过关）：
          1. 页面上 4 张名片都在，而且代码里没有一处重复抄写
          2. F12 控制台没有 "unique key" 警告，也没有红色报错
          3. 「共 N 位成员」的数字和实际卡片数对得上；往 PEOPLE 里加一个人，
             页面自动多一张卡，不用改任何 JSX
          4. 每张卡片里的技能是一个个独立的标签，不再是挤在一起的一串文字

          🎯 加分题（做完说明你真的懂了）：
          · 筛完一个人都不剩的时候，页面会空一大片 —— 给个兜底提示，
            比如 <p className="empty">没有符合条件的人</p>
          · 把技能那一块抽成独立的小组件，比如 <SkillList skills={props.skills} />，
            在组件里再套一个组件
          ============================================================ */}
    </div>
  )
}