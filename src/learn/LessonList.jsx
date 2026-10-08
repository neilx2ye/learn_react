import { pick, useProgress } from './progress'

// 课程列表：首页和目录抽屉共用同一份，只是摆放位置不同。
export default function LessonList({ lessons, currentId, onOpen }) {
  const state = useProgress()

  const stages = []
  for (const lesson of lessons) {
    const last = stages[stages.length - 1]
    if (last && last.name === lesson.meta.stage) last.items.push(lesson)
    else stages.push({ name: lesson.meta.stage, items: [lesson] })
  }

  return (
    <>
      {stages.map((stage) => (
        <section key={stage.name}>
          <div className="stage-title">{stage.name}</div>
          {stage.items.map((lesson) => {
            const done = pick.isDone(state, lesson.meta.id)
            const cls = ['lesson-item']
            if (done) cls.push('done')
            if (lesson.meta.id === currentId) cls.push('active')
            return (
              <button
                key={lesson.meta.id}
                type="button"
                className={cls.join(' ')}
                onClick={() => onOpen(lesson.meta.id)}
              >
                <span className="lesson-no">{done ? '✓' : lesson.meta.id}</span>
                <span className="lesson-main">
                  <span className="lesson-name">{lesson.meta.title}</span>
                  <span className="lesson-goal">{lesson.meta.goal}</span>
                </span>
              </button>
            )
          })}
        </section>
      ))}
    </>
  )
}