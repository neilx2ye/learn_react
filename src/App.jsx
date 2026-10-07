import { useState } from 'react'

// 自动扫描 src/lessons/ 下所有 LessonXX.jsx 文件，按编号排好做成左侧菜单。
// 这是课程的「外框」，属于进阶用法，现在不用看懂，专心改 lessons/ 里的文件就行。
const modules = import.meta.glob('./lessons/Lesson*.jsx', { eager: true })

const lessons = Object.entries(modules)
  .map(([path, mod]) => ({
    id: Number(path.match(/Lesson(\d+)/)[1]),
    Component: mod.default,
  }))
  .sort((a, b) => a.id - b.id)

export default function App() {
  const [currentId, setCurrentId] = useState(lessons[0]?.id)

  if (lessons.length === 0) {
    return <main className="main">还没有课程文件</main>
  }

  const Current = lessons.find((l) => l.id === currentId).Component

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-title">REACT 练习场</div>
        {lessons.map((l) => (
          <button
            key={l.id}
            type="button"
            className={l.id === currentId ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentId(l.id)}
          >
            第 {l.id} 课
          </button>
        ))}
      </aside>
      <main className="main">
        <Current />
      </main>
    </div>
  )
}