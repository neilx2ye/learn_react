import { pick, progress, useProgress } from './progress'
import { Md } from './md'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// 小测：点一下立刻有反馈，选错还能再选，答对之后锁定
export default function Quiz({ quizKey, question, options }) {
  const state = useProgress()
  const picked = pick.quiz(state, quizKey)
  const correctIndex = options.findIndex((o) => o.correct)
  const right = picked === correctIndex
  const locked = right
  const showWhy = picked !== undefined && picked >= 0 && options[picked]

  return (
    <div className="box">
      <div className="box-title">小测</div>
      <div className="quiz-question">
        <Md text={question} />
      </div>
      {options.map((option, i) => {
        const cls = ['quiz-option']
        if (picked !== undefined && i === picked) cls.push(option.correct ? 'correct' : 'wrong')
        else if (right && i === correctIndex) cls.push('correct')
        return (
          <button
            key={i}
            type="button"
            className={cls.join(' ')}
            disabled={locked}
            onClick={() => progress.setQuiz(quizKey, i)}
          >
            <span className="quiz-key">{LETTERS[i]}</span>
            <div className="quiz-text">
              <Md text={option.text} />
            </div>
          </button>
        )
      })}

      {showWhy ? (
        <div className={'quiz-why ' + (right ? 'ok' : 'err')}>
          <Md
            text={
              (right ? '✅ 答对了。' : '❌ 还不对，再选一个。') + (showWhy.why ? ' ' + showWhy.why : '')
            }
          />
        </div>
      ) : null}
    </div>
  )
}