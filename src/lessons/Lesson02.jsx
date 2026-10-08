// ============================================================================
// 第 2 课 · Props：让组件接收数据
// ----------------------------------------------------------------------------
// 【为什么要学这个】
//   上一课你写了两次 <NameCard />，两张名片一模一样。
//   现在如果想显示 3 个「不同的人」，你得把那段标签抄 3 遍 —— 改一次样式要改 3 个地方。
//   React 的解法：把「会变的部分」变成参数传进去。这个参数就叫 props。
//
// 【知识点 1】组件本质是函数，函数能收参数 —— props 就是组件的参数。
// 【知识点 2】组件里收到的是「一个对象」，属性名就是你传进去的 key。
//             function NameCard(props)   →   props.name
// 【知识点 3】两条必踩的坑：
//     · 字符串用引号 name="X"；数字 / 布尔 / 变量要用花括号 years={3}
//       years="3" 传进去是字符串 "3"，years={3} 才是数字 3
//     · props 是只读的！组件内部绝对不能改它。数据只能从上往下流。
// ============================================================================


// ① 数据。注意它和组件是分开的：
//    组件负责「长什么样」，数据从外面喂进来。
//    ⚠️ 现在先手写三次调用，第 3 课我们就会推翻这个写法。
const PEOPLE = [
  { name: 'X', role: 'Front End Developer', years: 1 },
  { name: '小李', role: '产品经理', years: 3 },
  { name: '老王', role: '后端工程师', years: 8 },
]


// ② 改造后的名片。参数已经给你了，但里面还没用起来。
function NameCard(props) {
  // 打印一下，打开 F12 控制台看看 props 到底长什么样（看懂后可以删掉这行）
  console.log('我收到的 props 是：', props)

  return (
    <div className="card">
      {/* TODO 1：把名字显示出来。提示：props.??? 把它放进花括号里 */}
      <h2> {props.name} </h2>

      {/* TODO 2：把职位显示出来 */}
      <p className="muted"> {props.role} </p>

      {/* TODO 3：把年限显示出来，输出成「从业 3 年」这种格式 */}
      <p className="small">从业 {props.years} 年</p>

      <div className="row">
        {/* 这里先不动。第 3 课学会用数组渲染，再回来改它 */}
        <span className="tag">{props.skills.join("/")}</span>
      </div>
    </div>
  )
}


export default function Lesson02() {
  return (
    <div className="lesson">
      <h1>第 2 课 · Props</h1>

      <div className="hint">
        下面三张卡片现在长一样、还显示不出数据。
        <br />
        你的任务：让它们分别显示 <code>PEOPLE</code> 里的那三个人。
      </div>

      {/* TODO 4：给这三次调用各自传一份数据
          · 属性名要和你组件里正在用的 key 对上
          · 第 3 个属性是数字，想清楚该用引号还是花括号 */}

      <NameCard name = {PEOPLE[0].name} role = {PEOPLE[0].role} years={PEOPLE[0].years} skills={['JavaScript',"CSS"]}/>
      <NameCard name = {PEOPLE[1].name} role = {PEOPLE[1].role} years={PEOPLE[1].years} skills={['JavaScript',"CSS"]}/>
      <NameCard name = {PEOPLE[2].name} role = {PEOPLE[2].role} years={PEOPLE[2].years} skills={['JavaScript',"CSS"]}/>

      {/* ============================================================
          ✅ 自查（4 条全过才算过关）：
          1. 三张卡片分别显示 X / 小李 / 老王，不再是占位文字
          2. 职位和年限也各自对得上，没有一个写错的
          3. F12 控制台里展开 props，能看到 { name, role, years } 三个 key
          4. 控制台没有红色报错

          🎯 加分题（做完说明你真的懂了）：
          给 props 再加一个 skills，值是数组 ['JavaScript', 'CSS']，
          然后在卡片里用 {'{props.skills.join(" / ")}'} 显示出来。
          提示：数组的 .join() 方法能把数组拼成字符串。
          ============================================================ */}
    </div>
  )
}