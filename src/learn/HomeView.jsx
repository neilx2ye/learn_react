import LessonList from './LessonList'
import { pick, progress, useProgress } from './progress'

export default function HomeView({ lessons, currentId, onOpen }) {
  const state = useProgress()
  const doneCount = lessons.filter((l) => pick.isDone(state, l.meta.id)).length
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0

  const last = lessons.find((l) => l.meta.id === state.lastId) || null
  const resume =
    last || lessons.find((l) => !pick.isDone(state, l.meta.id)) || lessons[0]

  return (
    <>
      <div className="hero">
        <h1>React 以练代学</h1>
        <p className="muted">
          一共 {lessons.length} 课。每课都是「读一小段 → 改代码看结果 → 打勾自查」，
          手机上随时能学，进度自动存在这台手机里。
        </p>
        <div className="card">
          <div className="hero-stat">
            <span className="num">{doneCount}</span>
            <span className="muted">/ {lessons.length} 课已完成</span>
          </div>
          <div className="progress-track" style={{ marginTop: 8, borderRadius: 4 }}>
            <div className="progress-fill" style={{ width: pct + '%' }} />
          </div>
          {resume ? (
            <p className="lesson-goal" style={{ marginTop: 10 }}>
              {last ? '上次学到' : doneCount === lessons.length ? '可以复习' : '建议从这里开始'}：第{' '}
              {resume.meta.id} 课 · {resume.meta.title}
            </p>
          ) : null}
          {resume ? (
            <button
              type="button"
              className="btn primary"
              style={{ width: '100%', marginTop: 6 }}
              onClick={() => onOpen(resume.meta.id)}
            >
              {doneCount === 0 ? '从第一课开始' : '继续第 ' + resume.meta.id + ' 课'}
            </button>
          ) : null}
        </div>
      </div>

      <LessonList lessons={lessons} currentId={currentId} onOpen={onOpen} />

      <div className="box bonus" style={{ marginTop: 18 }}>
        <div className="box-title">怎么学最有效</div>
        <ul>
          <li>一次只学一课，20 分钟左右。学完立刻把练习场里的代码改一遍。</li>
          <li>不要复制粘贴。哪怕只改一个数字，也要自己敲一次。</li>
          <li>看到红字报错先读一遍，再去对照自查清单，最后才来问我。</li>
        </ul>
        <button
          type="button"
          className="btn"
          onClick={() => {
            if (window.confirm('清空全部学习进度和练习代码？这个操作不能撤销。')) {
              progress.resetAll()
            }
          }}
        >
          清空学习进度
        </button>
      </div>
    </>
  )
}