import { useEffect, useState } from 'react'
import HomeView from './learn/HomeView'
import LessonList from './learn/LessonList'
import LessonView from './learn/LessonView'
import { pick, progress, useProgress } from './learn/progress'

// 自动扫描 src/lessons/ 下所有 LessonNN.js，按编号排好做成课程列表。
// 加一节课 = 新建一个文件，这里不用动。
const modules = import.meta.glob('./lessons/Lesson*.js', { eager: true })

const lessons = Object.entries(modules)
  .map(([, mod]) => mod.default)
  .filter((lesson) => lesson && lesson.meta && Array.isArray(lesson.blocks))
  .sort((a, b) => a.meta.id - b.meta.id)

const FONT_SIZES = ['s', 'm', 'l']

function readRoute() {
  const hit = window.location.hash.match(/lesson\/(\d+)/)
  return hit ? Number(hit[1]) : null
}

export default function App() {
  const state = useProgress()
  const [routeId, setRouteId] = useState(readRoute)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const onHash = () => setRouteId(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.fs = state.fontSize || 'm'
  }, [state.fontSize])

  useEffect(() => {
    if (routeId !== null) progress.setLast(routeId)
    window.scrollTo(0, 0)
  }, [routeId])

  const current = lessons.find((lesson) => lesson.meta.id === routeId) || null
  const at = current ? lessons.indexOf(current) : -1
  const prev = at > 0 ? lessons[at - 1] : null
  const next = at >= 0 && at < lessons.length - 1 ? lessons[at + 1] : null
  const done = current ? pick.isDone(state, current.meta.id) : false

  const doneCount = lessons.filter((lesson) => pick.isDone(state, lesson.meta.id)).length
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0

  function open(id) {
    setDrawer(false)
    const hash = `#/lesson/${id}`
    if (window.location.hash === hash) setRouteId(id)
    else window.location.hash = hash
  }

  function goHome() {
    setDrawer(false)
    if (window.location.hash === '#/' || window.location.hash === '') setRouteId(null)
    else window.location.hash = '#/'
  }

  function cycleFont() {
    const index = FONT_SIZES.indexOf(state.fontSize || 'm')
    progress.setFontSize(FONT_SIZES[(index + 1) % FONT_SIZES.length])
  }

  if (lessons.length === 0) {
    return (
      <main className="content">
        <p>还没有课程文件。</p>
      </main>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <button type="button" className="icon-btn" onClick={() => setDrawer(true)}>
            目录
          </button>
          <div className="topbar-title">
            {current ? `第 ${current.meta.id} 课 · ${current.meta.title}` : 'React 以练代学'}
          </div>
          <button type="button" className="icon-btn" onClick={cycleFont}>
            字号 {(state.fontSize || 'm').toUpperCase()}
          </button>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: pct + '%' }} />
        </div>
      </header>

      <main className={current ? 'content' : 'content tight'}>
        {current ? (
          <LessonView lesson={current} />
        ) : (
          <HomeView lessons={lessons} currentId={routeId} onOpen={open} />
        )}
      </main>

      {current ? (
        <nav className="bottombar">
          <div className="bottombar-inner">
            <button
              type="button"
              className="btn"
              disabled={!prev}
              onClick={() => prev && open(prev.meta.id)}
            >
              上一课
            </button>
            <button
              type="button"
              className={'btn wide' + (done ? '' : ' primary')}
              onClick={() => progress.toggleDone(current.meta.id)}
            >
              {done ? '✓ 已完成' : '标记完成'}
            </button>
            <button
              type="button"
              className="btn"
              disabled={!next}
              onClick={() => next && open(next.meta.id)}
            >
              下一课
            </button>
          </div>
        </nav>
      ) : null}

      {drawer ? (
        <>
          <div className="drawer-mask" onClick={() => setDrawer(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <span className="drawer-title">全部课程</span>
              <button type="button" className="icon-btn" onClick={goHome}>
                首页
              </button>
              <button type="button" className="icon-btn" onClick={() => setDrawer(false)}>
                关闭
              </button>
            </div>
            <LessonList lessons={lessons} currentId={routeId} onOpen={open} />
          </aside>
        </>
      ) : null}
    </div>
  )
}