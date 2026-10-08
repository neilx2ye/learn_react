import { Md } from './md'
import { pick, progress, useProgress } from './progress'

// 打勾清单：动手任务和自查清单共用。勾上的状态存在手机上。
export default function TaskList({ storeKey, title, items, kind = 'task' }) {
  const state = useProgress()
  const checked = pick.checks(state, storeKey)
  const count = items.filter((_, i) => checked[i]).length

  return (
    <div className={'box ' + (kind === 'check' ? 'tip' : 'bonus')}>
      <div className="box-title">
        {title}
        <span className="check-count">
          {count}/{items.length}
        </span>
      </div>
      {items.map((item, i) => (
        <label key={i} className={checked[i] ? 'check-item on' : 'check-item'}>
          <input
            type="checkbox"
            className="checkbox"
            checked={!!checked[i]}
            onChange={() => progress.toggleCheck(storeKey, i)}
          />
          <Md text={item} />
        </label>
      ))}
    </div>
  )
}