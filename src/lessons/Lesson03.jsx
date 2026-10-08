// ============================================================================
const PEOPLE = [
  { id: 'p1', name: 'X', role: 'Front End Developer', years: 1, skills: ['JavaScript', 'CSS'] },
  { id: 'p2', name: '小李', role: '产品经理', years: 3, skills: ['Axure', 'SQL'] },
  { id: 'p3', name: '老王', role: '后端工程师', years: 8, skills: ['Go', 'MySQL'] },
  { id: 'p4', name: '阿珍', role: 'UI 设计师', years: 5, skills: ['Figma', '插画'] },
]


function NameCard(props) {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p className="muted">{props.role}</p>
      <p className="small">从业 {props.years} 年</p>

      <div className="row">
        { props.skills.map((skill) => <span key={skill} className="tag"> { skill } </span>) }
      </div>
    </div>
  )
}

function SkillList(props){

}

export default function Lesson03() {
  let filtered = PEOPLE.filter((person) => person.years>=13 )
  return (
    <div className="lesson">
      <h1>第 3 课 · 列表渲染与 key</h1>

      <div className="hint">
        下面这些卡片是「手抄」出来的 —— <code>PEOPLE</code> 里几个人，就抄几行。
        <br />
        你的任务：把手抄的部分删掉，改成让数组自己渲染。
      </div>

      { PEOPLE.map((person) => <NameCard key={person.id} name={person.name} role={person.role} years={person.years} skills = {person.skills} />) }

      共{ PEOPLE.length }名成员
 
      
      { filtered.length>0? filtered.map((person) => 
        <NameCard key={person.id} name={person.name} role={person.role} years={person.years} skills = {person.skills} />
        ) : <p className="empty">没有符合条件的人</p> }
      {/* ============================================================
          🎯 加分题（做完说明你真的懂了）：
          · 筛完一个人都不剩的时候，页面会空一大片 —— 给个兜底提示，
            比如 <p className="empty">没有符合条件的人</p>
          · 把技能那一块抽成独立的小组件，比如 <SkillList skills={props.skills} />，
            在组件里再套一个组件
          ============================================================ */}
    </div>
  )
}