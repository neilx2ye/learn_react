// 课程内容自检：把每节课的数据跑一遍。
// 只检查结构不够 —— 练习场里的代码是真编译、真渲染，跑不起来的示例会被抓出来。
//
//   node scripts/check-lessons.mjs        # 全部
//   node scripts/check-lessons.mjs 5      # 只看第 5 课
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { compileDemo, evaluate } from '../src/learn/compile.js'
import { BLOCK_TYPES } from '../src/learn/blockTypes.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const lessonDir = path.join(here, '..', 'src', 'lessons')

// 有些练习场用 localStorage 记住数据；Node 里给个空壳（Node 22 的 localStorage 会抛错，所以用 defineProperty）
try {
  Object.defineProperty(globalThis, 'localStorage', {
    value: { getItem: () => null, setItem() {}, removeItem() {}, clear() {} },
    configurable: true,
  })
} catch {
  // 定义不了就算了，相关示例会以「跑不起来」的形式报出来
}

const STAGES = ['阶段一 · 组件的思维', '阶段二 · 数据和状态往哪放', '阶段三 · 做一个真东西']

const only = process.argv[2] ? Number(process.argv[2]) : null
const files = (await readdir(lessonDir))
  .filter((name) => /^Lesson\d+\.js$/.test(name))
  .sort()

const problems = []
const summary = []

for (const file of files) {
  const id = Number(file.match(/Lesson(\d+)/)[1])
  if (only && id !== only) continue

  const tag = `Lesson${String(id).padStart(2, '0')}`
  const mod = await import(pathToFileURL(path.join(lessonDir, file)).href).catch((err) => {
    problems.push(`${tag}: 文件本身有语法错误 —— ${err.message}`)
    return null
  })
  if (!mod) continue
  const lesson = mod.default

  if (!lesson || typeof lesson !== 'object') {
    problems.push(`${tag}: 没有 default 导出对象`)
    continue
  }
  const { meta, blocks } = lesson
  if (!meta || !Array.isArray(blocks)) {
    problems.push(`${tag}: 缺少 meta 或 blocks`)
    continue
  }
  if (meta.id !== id) problems.push(`${tag}: meta.id 是 ${meta.id}，和文件名对不上`)
  for (const field of ['title', 'stage', 'goal']) {
    if (!meta[field]) problems.push(`${tag}: meta.${field} 缺失`)
  }
  if (meta.stage && !STAGES.includes(meta.stage)) {
    problems.push(`${tag}: meta.stage 「${meta.stage}」不在约定的三个阶段里`)
  }
  if (!(meta.minutes > 0)) problems.push(`${tag}: meta.minutes 应该是分钟数`)

  const stats = { demo: 0, quiz: 0, check: 0, task: 0, code: 0 }

  for (const [i, block] of blocks.entries()) {
    const at = `${tag} 第 ${i} 块(${block.type})`
    if (!BLOCK_TYPES.includes(block.type)) {
      problems.push(`${at}: 未知的 type`)
      continue
    }
    if (stats[block.type] !== undefined) stats[block.type] += 1

    if (['text', 'note', 'warn', 'tip', 'bonus'].includes(block.type)) {
      const ok = Array.isArray(block.md)
        ? block.md.length > 0 && block.md.every((line) => typeof line === 'string')
        : typeof block.md === 'string' && block.md.length > 0
      if (!ok) problems.push(`${at}: 缺 md 正文（字符串，或「一行一个字符串」的数组）`)
    }
    if (block.type === 'code' && !block.code) problems.push(`${at}: 缺 code`)
    if (block.type === 'demo' && !block.code) problems.push(`${at}: 缺 code`)
    if (block.type === 'demo' && block.code && block.code.split('\n').length > 48) {
      problems.push(`${at}: 示例代码超过 48 行，手机上太长了`)
    }
    if (block.type === 'quiz') {
      if (!block.question) problems.push(`${at}: 缺 question`)
      const options = block.options || []
      if (options.length < 2) problems.push(`${at}: 选项少于 2 个`)
      const correct = options.filter((o) => o.correct).length
      if (correct !== 1) problems.push(`${at}: 正确答案要正好 1 个，现在是 ${correct} 个`)
    }
    if (block.type === 'task' || block.type === 'check') {
      if (!Array.isArray(block.items) || block.items.length === 0) {
        problems.push(`${at}: items 是空的`)
      }
    }
  }

  // 反例里「故意写错」的地方会让 React 打开发警告，这里收起来只计数，避免自检输出被刷屏
  let seenWarnings = 0
  const realError = console.error
  console.error = () => {
    seenWarnings += 1
  }
  try {
    for (const [i, block] of blocks.entries()) {
      if (block.type !== 'demo') continue
      try {
        const Component = evaluate(await compileDemo(block.code))
        if (!Component) throw new Error('没有找到 App 组件，也没有 export default')
        renderToString(React.createElement(Component))
      } catch (err) {
        problems.push(`${tag} 第 ${i} 块(demo) 跑不起来: ${err.message}`)
      }
    }
  } finally {
    console.error = realError
  }

  if (stats.demo < 1) problems.push(`${tag}: 至少要有 1 个 demo`)
  if (stats.quiz < 1) problems.push(`${tag}: 至少要有 1 个小测`)
  if (stats.check < 1) problems.push(`${tag}: 至少要有 1 个自查清单`)

  summary.push(
    `${tag} 第 ${id} 课 ${meta.title} —— 练习场 ${stats.demo} · 小测 ${stats.quiz} · ` +
      `动手任务 ${stats.task} · 自查 ${stats.check} · 只读代码 ${stats.code}` +
      (seenWarnings ? `（收了 ${seenWarnings} 条 React 开发警告，来自故意写错的反例，正常）` : ''),
  )
}

console.log(summary.join('\n'))

if (problems.length) {
  console.log(`\n发现 ${problems.length} 个问题：`)
  for (const line of problems) console.log('  ✗ ' + line)
  process.exit(1)
}

console.log(`\n✓ ${summary.length} 节课全部通过（结构和示例代码都跑得通）`)