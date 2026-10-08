import CodeBlock from './CodeBlock'
import Playground from './Playground'
import Quiz from './Quiz'
import TaskList from './TaskList'
import { Md } from './md'

// 课程内容的「积木」在这里落地：数据里写什么 type，这里就渲染成什么样。
// 支持的 type 清单在 blockTypes.js（自检脚本用它校验课程数据）
const BOX_TYPES = ['note', 'warn', 'tip', 'bonus']

export default function Block({ block, lessonId, index }) {
  const storeKey = `${lessonId}:${index}`

  if (block.type === 'text') {
    return (
      <div className="block">
        <Md text={block.md} />
      </div>
    )
  }

  if (BOX_TYPES.includes(block.type)) {
    return (
      <div className={'block box ' + block.type}>
        {block.title ? <div className="box-title">{block.title}</div> : null}
        <Md text={block.md} />
      </div>
    )
  }

  if (block.type === 'code') {
    return (
      <div className="block">
        {/* key：换课时同一个位置的积木会被 React 复用，加了 key 才会重新挂载 */}
        <CodeBlock key={storeKey} code={block.code} title={block.title} />
      </div>
    )
  }

  if (block.type === 'demo') {
    return (
      <div className="block">
        <Playground
          key={storeKey}
          demoKey={storeKey}
          code={block.code}
          task={block.task}
          height={block.height || 240}
        />
      </div>
    )
  }

  if (block.type === 'quiz') {
    return (
      <div className="block">
        <Quiz quizKey={storeKey} question={block.question} options={block.options} />
      </div>
    )
  }

  if (block.type === 'task' || block.type === 'check') {
    return (
      <div className="block">
        <TaskList
          storeKey={storeKey}
          title={block.title || (block.type === 'check' ? '自查清单' : '动手任务')}
          items={block.items}
          kind={block.type}
        />
      </div>
    )
  }

  return null
}