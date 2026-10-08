// 学习进度：存在手机本地（localStorage），关掉页面再打开还在。
// 一个极简的「外部状态 + 订阅」实现，任何组件用 useProgress() 就能拿到最新数据。
import { useSyncExternalStore } from 'react'

const KEY = 'react-learn-progress-v1'

const EMPTY = {
  lastId: null,
  done: {}, // { [lessonId]: true }
  checks: {}, // { 'lessonId:blockIndex': { 0: true, 1: true } }
  quizzes: {}, // { 'lessonId:blockIndex': optionIndex }
  demos: {}, // { 'lessonId:blockIndex': '用户改过的代码' }
  fontSize: 'm',
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const saved = JSON.parse(raw)
    return {
      ...EMPTY,
      ...saved,
      done: { ...saved.done },
      checks: { ...saved.checks },
      quizzes: { ...saved.quizzes },
      demos: { ...saved.demos },
    }
  } catch {
    return { ...EMPTY }
  }
}

let state = read()
const listeners = new Set()

function commit(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // 无痕模式等场景写不了，忽略即可，本次会话内仍然能用
  }
  for (const fn of listeners) fn()
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

/** 给非 React 的地方（main.jsx）读一次当前值 */
export function getSnapshot() {
  return state
}

export const progress = {
  setLast(id) {
    if (state.lastId === id) return
    commit({ ...state, lastId: id })
  },
  toggleDone(id) {
    const done = { ...state.done }
    if (done[id]) delete done[id]
    else done[id] = true
    commit({ ...state, done })
  },
  toggleCheck(key, index) {
    const group = { ...(state.checks[key] || {}) }
    if (group[index]) delete group[index]
    else group[index] = true
    commit({ ...state, checks: { ...state.checks, [key]: group } })
  },
  setQuiz(key, option) {
    commit({ ...state, quizzes: { ...state.quizzes, [key]: option } })
  },
  setDemo(key, code) {
    commit({ ...state, demos: { ...state.demos, [key]: code } })
  },
  clearDemo(key) {
    const demos = { ...state.demos }
    delete demos[key]
    commit({ ...state, demos })
  },
  setFontSize(size) {
    commit({ ...state, fontSize: size })
  },
  resetAll() {
    commit({ ...EMPTY })
  },
}

export const pick = {
  isDone: (s, id) => !!s.done[id],
  checks: (s, key) => s.checks[key] || {},
  quiz: (s, key) => s.quizzes[key],
  demo: (s, key) => s.demos[key],
}