import Block from './Blocks'
import { pick, useProgress } from './progress'

// 一节课 = 课头 + 一串积木。进度（自查打了几个勾）直接显示在课头。
export default function LessonView({ lesson }) {
  const { meta, blocks } = lesson
  const state = useProgress()
  const done = pick.isDone(state, meta.id)

  let total = 0
  let hit = 0
  blocks.forEach((block, i) => {
    if (block.type !== 'check') return
    const checked = pick.checks(state, `${meta.id}:${i}`)
    total += block.items.length
    hit += block.items.filter((_, j) => checked[j]).length
  })

  return (
    <>
      <div className="lesson-head">
        <div className="lesson-meta">
          <span className="chip">第 {meta.id} 课</span>
          <span className="chip">{meta.stage}</span>
          {meta.minutes ? <span className="chip">约 {meta.minutes} 分钟</span> : null}
          {done ? <span className="chip good">✓ 已完成</span> : null}
        </div>
        <h1>{meta.title}</h1>
        {meta.goal ? <p className="lesson-goal">{meta.goal}</p> : null}
        {total > 0 ? (
          <p className="lesson-goal">
            自查进度 {hit}/{total}
          </p>
        ) : null}
      </div>

      {blocks.map((block, i) => (
        <Block key={i} block={block} lessonId={meta.id} index={i} />
      ))}

      <div className="box bonus">
        <div className="box-title">卡住了怎么办</div>
        <p>
          把下面两样东西发给我，一次就能讲清楚：
        </p>
        <ul>
          <li>你把代码改成什么样了（练习场里的代码可以整段复制）</li>
          <li>报错原文，或者「我以为会 A，结果是 B」</li>
        </ul>
        <p className="muted">不用怕问得太基础。</p>
      </div>
    </>
  )
}