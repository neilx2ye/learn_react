// 第 14 课 · 实战：数据看板
// 把「等接口」这件事写完整：三态、清理、搜索排序。格式说明见同目录的 _FORMAT.md
export default {
  meta: {
    id: 14,
    title: '实战：数据看板',
    stage: '阶段三 · 做一个真东西',
    goal: '接口 + 加载 / 出错 / 搜索排序',
    minutes: 50,
  },

  blocks: [
    {
      type: 'note',
      title: '为什么要学这个',
      md: [
        '到第 13 课为止，你页面上的数据都是自己写死在文件里的：`const rows = [...]`。它永远在那儿，打开就有，不迟到、不失败。',
        '',
        '真实项目不是这样：数据住在别人的服务器上，**你要等它**。等的时候页面上写什么？等到一半失败了又写什么？',
        '',
        '这两件事不处理，用户看到的就是一片空白 —— 他分不清「正在加载」和「坏了」，三秒就关掉。这一课我们把它补完整。',
      ],
    },
    {
      type: 'note',
      title: '知识点 1 · 页面永远只有三种状态',
      md: [
        '一个从接口拿数据的页面，任何时刻都处在三种状态之一：',
        '',
        '1. **加载中**：请求发出去了，还没回来',
        '2. **出错**：请求失败了（断网、超时、服务器挂了）',
        '3. **有数据**：拿到了，正常显示',
        '',
        '新手最常见的写法是只做第 3 种：一个 `rows` state，初始值 `[]`，界面直接渲染 `rows.map(...)`。打开页面就是一片空白 —— 而空白同时意味着「还没加载」「加载失败」「本来就没有数据」，用户猜不出来。',
        '',
        '所以要另开一个 state **记住现在是哪一种状态**（这一课叫它 `phase`），而不是靠数据本身去猜。`rows.length === 0` 永远说不清是哪一种。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 2 · 请求写在 useEffect 里，还要会善后',
      md: [
        '请求是副作用，渲染过程中不能干，放进 `useEffect`。',
        '',
        '但有一件事必须处理：**先发出的请求，不保证先回来。** 你在第 9 课给定时器写过清理，请求也一样 —— 这次请求已经作废了，它回来的结果就不该再写进 state。',
        '',
        '```',
        'useEffect(() => {',
        '  let alive = true        // 这次请求的作废开关',
        '  fetchData().then((data) => {',
        '    if (!alive) return    // 作废了，结果直接丢掉',
        '    setRows(data)',
        '  })',
        '  return () => { alive = false }  // 清理',
        '}, [reload])',
        '```',
        '',
        '`return () => {...}` 就是清理函数。React 在两个时刻调用它：组件卸载时、以及这个 effect 下一次重跑之前（依赖变了）。',
        '',
        '更地道的写法是 `AbortController`：把 `signal` 传给 `fetch`，清理时 `abort()`，请求直接在网络层断掉。目的完全一样 —— **让作废的请求闭嘴**。',
      ],
    },
    {
      type: 'warn',
      title: '知识点 3 · sort 会偷偷改原数组',
      md: [
        '`sort` 是这一课最阴的一行：它**不生成新数组，而是当场把原数组的顺序改掉**。',
        '',
        '```',
        'const a = [3, 1, 2]',
        'a.sort()      // 返回 [1, 2, 3]',
        '// 但 a 自己也变成了 [1, 2, 3]',
        '```',
        '',
        '`filter` 和 `map` 干活前会先复制一份，`sort` 不复制。所以把 state 里的数组直接丢给它排，等于把 state 改了 —— 和第 11 课那句「不要 `push` 进 state 数组」是同一个道理。',
        '',
        '正确写法：先复制一份，排的是副本，原数组毫发无伤。',
        '',
        '```',
        'const sorted = [...rows].sort((a, b) => b.amount - a.amount)',
        '```',
      ],
    },
    {
      type: 'tip',
      title: '一句话记住',
      md: [
        '**第 8 课那条规矩在这儿最管用：搜索词是用户输进来的（存成 state），屏幕上那份列表是从它算出来的派生状态 —— 现算，不另存一份，也不碰原数据。**',
        '',
        '一段 `useMemo` 里把两件事做完：',
        '',
        '```',
        'const shown = useMemo(() => {',
        '  const hit = rows.filter((o) => o.name.includes(word))',
        '  return [...hit].sort((a, b) => b.amount - a.amount)',
        '}, [rows, word])',
        '```',
        '',
        '`filter` 和 `sort` 的每一步都不碰 `rows`，所以怎么搜怎么排都不会污染原数据。`useMemo`（第 13 课）管的是：依赖没变就不重算。',
      ],
    },
    {
      type: 'demo',
      title: '反例：直接 list.sort() 排了原数组',
      height: 380,
      task: [
        '先点一次 **按价格排**：上面的列表变成从贵到便宜，看起来一切正常。',
        '',
        '接着看**最后一行**：它显示的是 `DATA`（模块里的原始数据）现在的顺序。排序前是「键盘 → 支架 → 椅子 → 鼠标垫」。点完排序之后，它变了吗？',
        '',
        '再试一次：搜索框里打「椅」，清空。列表的顺序还回得到最初的样子吗？',
        '',
        '原因在这儿：`useState(DATA)` 拿到的**就是 `DATA` 本身**，不是副本。`list.sort()` 排的和 `DATA` 是同一个数组 —— 原始数据被排序污染了，而且再也回不去。',
        '',
        '改法只有一行：把 `list.sort(...)` 改成 `[...list].sort(...)`。改完点「还原」重来一次，看 `DATA` 的顺序还会不会变。',
      ],
      code: `import { useState } from 'react'

// 接口回来的顺序：按上架时间，不是按价格
const DATA = [
  { id: 1, name: '键盘', amount: 399 },
  { id: 2, name: '支架', amount: 129 },
  { id: 3, name: '椅子', amount: 1299 },
  { id: 4, name: '鼠标垫', amount: 29 },
]

export default function App() {
  // 初始值就是 DATA 本身，不是副本
  const [list, setList] = useState(DATA)
  const [word, setWord] = useState('')
  const [sorted, setSorted] = useState(false)

  function sortByAmount() {
    // 直接排：sort 把原数组的顺序改了
    list.sort((a, b) => b.amount - a.amount)
    setSorted(true)      // 借它触发一次重画
  }

  const shown = list.filter((o) => o.name.includes(word))

  return (
    <div className="card">
      <input className="field" value={word}
        placeholder="搜索商品"
        onChange={(e) => setWord(e.target.value)} />
      <button className="btn" onClick={sortByAmount}>
        {sorted ? '已排好' : '按价格排'}
      </button>
      <ul className="list">
        {shown.map((o) => (
          <li className="list-item" key={o.id}>
            {o.name} ¥{o.amount}
          </li>
        ))}
      </ul>
      <p className="small muted">
        DATA 现在的顺序：{DATA.map((o) => o.name).join(' → ')}
      </p>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '正解：迷你看板（加载中 / 出错 / 有数据）',
      height: 300,
      task: [
        '这是一个迷你商品看板。进来先「请求接口」：假接口 600 毫秒后回来，还有 3 成概率失败。回来之前显示「加载中…」，失败了显示「加载失败」。',
        '',
        '多运行几次，三种画面你都会碰上。**三种都写了，用户才不会以为页面坏了。**',
        '',
        'TODO 1：让排序真的生效 —— 把 `return hit` 换成排好序的副本，用 `[...hit].sort((a, b) => b.amount - a.amount)`。`[...hit]` 不能省，先复制再排。',
        '',
        'TODO 2：加一个「刷新」按钮，让出错之后能重新请求。三步：① 加 state `const [reload, setReload] = useState(0)`；② 在 `useEffect` 第一行加 `setPhase("loading")`，依赖数组 `[]` 改成 `[reload]`；③ 按钮写 `onClick={() => setReload(reload + 1)}`。',
        '',
        '这个正解的请求只发一次，不会出现「旧结果盖新结果」，所以这里先不做清理 —— 那是第三个练习场的事。改完点右上角「运行」（或按 `Ctrl + Enter`）。',
      ],
      code: `import { useEffect, useMemo, useState } from 'react'

// 假接口：真实项目里这里换成 fetch('/api/orders')
async function fetchOrders() {
  await new Promise((r) => setTimeout(r, 600))
  if (Math.random() < 0.3) throw new Error('断网')
  return [
    { id: 1, name: '键盘', amount: 399 },
    { id: 2, name: '椅子', amount: 1299 },
    { id: 3, name: '支架', amount: 129 },
  ]
}

export default function App() {
  const [rows, setRows] = useState([])
  const [phase, setPhase] = useState('loading')
  const [word, setWord] = useState('')

  useEffect(() => {
    fetchOrders().then(
      (d) => { setRows(d); setPhase('ok') },
      () => setPhase('error'),
    )
  }, [])
  // 搜索和排序都从 rows 现算，不另存一份
  const shown = useMemo(() => {
    const hit = rows.filter((o) => o.name.includes(word))
    // TODO 1：返回排好序的副本（先复制再排）
    return hit
  }, [rows, word])

  return (
    <div className="card">
      <input className="field" value={word}
        placeholder="搜索商品"
        onChange={(e) => setWord(e.target.value)} />
      {phase === 'loading' &&
        <p className="muted">加载中…</p>}
      {phase === 'error' && <p className="bad">加载失败</p>}
      {/* TODO 2：加个「刷新」按钮重新请求 */}
      <ul className="list">
        {shown.map((o) => (
          <li key={o.id}>{o.name} ¥{o.amount}</li>
        ))}
      </ul>
    </div>
  )
}`,
    },
    {
      type: 'demo',
      title: '进阶反例：回得晚的那次，把新数据盖了',
      height: 280,
      task: [
        '这是一个「按页看数据」的页面。假接口的设定是：**页码越大回得越快** —— 第 1 页 1.2 秒，第 2 页 0.6 秒，第 3 页几乎立刻。',
        '',
        '点 **一键复现**：它会替你自动点「第 2 页」，0.2 秒后再点「第 3 页」，模拟手快连点。',
        '',
        '然后看大字：页码已经停在「第 3 页」，数据却是「第 2 页的数据」—— 第 2 页回得晚，把第 3 页的结果盖掉了。这个坑在真实项目里天天发生，比如搜索框连续打字。',
        '',
        '原因：这个 `useEffect` 里少了一句清理。按上面那个模板补上 —— 开头 `let alive = true`，回来时 `if (!alive) return`，在 `}, [page])` 前面加 `return () => { alive = false }`。',
        '',
        '补完再点一键复现，大字应该稳稳停在「第 3 页的数据」，不再跳回第 2 页。',
      ],
      code: `import { useEffect, useState } from 'react'

// 假接口：页码越大回得越快（真实项目里换成 fetch）
function fetchPage(page) {
  return new Promise((ok) => {
    setTimeout(() => ok(page), 1800 - page * 600)
  })
}

export default function App() {
  const [page, setPage] = useState(1)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    // 少了「清理」：作废的请求照样往 state 里写
    fetchPage(page).then(setShown)
  }, [page])

  function replay() {
    setPage(2)
    setTimeout(() => setPage(3), 200)
  }

  return (
    <div className="card">
      <p className="muted">你点到了第 {page} 页</p>
      <p className="big">
        {shown ? '第 ' + shown + ' 页的数据' : '加载中…'}
      </p>
      <button className="btn" onClick={replay}>
        一键复现
      </button>
      <button className="btn" onClick={() => setPage(1)}>
        回到第 1 页
      </button>
      <p className="small bad">
        第 3 页先到，第 2 页后到，新结果被盖了
      </p>
    </div>
  )
}`,
    },
    {
      type: 'quiz',
      question: 'state 里的 `rows`，你写 `rows.sort(...)` 直接排序，会发生什么？',
      options: [
        {
          text: '原数组当场被改掉，顺序变了；而且常常看不到页面刷新',
          correct: true,
          why: '`sort` 是原地排序，返回的还是同一个数组。改完之后 rows 的引用没跟着变，React 认为「和之前一样」，可能连重画都不做 —— 数据已经乱了，页面却像没事。等下一次别的原因触发重画，乱掉的顺序才冒出来，这时你已经想不起来是谁干的。',
        },
        {
          text: '没事，`sort` 会返回一个排好序的新数组，原来那份不动',
          why: '这是最容易记混的一点。返回新数组的是 `filter` / `map` / `slice`；`sort` 和 `push` 一样，是**当场改**。所以要先 `[...rows]` 复制一份再排。',
        },
        {
          text: '会报错：state 不允许修改',
          why: '不报错。React 没有办法阻止你改，只能靠你自己记住：state 是只读的，要改就交给 `setXxx` 换一份新的。',
        },
      ],
    },
    {
      type: 'quiz',
      question: '只用一个 `rows` state（初始 `[]`）渲染列表，不写加载中和出错的界面，会怎样？',
      options: [
        {
          text: '三种情况长得一模一样：一片空白 —— 用户分不清是在加载、坏了，还是真没数据',
          correct: true,
          why: '空数组这一个现象，同时对应三种完全不同的处境。所以要用另一个 state 记住「现在是哪一种」，而不是看数据猜。用户分不清，就会以为页面坏了。',
        },
        {
          text: '没问题，只要接口够快，用户感觉不到那段空白',
          why: '再快也有那么一瞬间，而且一断网就是永久空白。更糟的是出错时你连「哪里错了」都说不出来，页面上没有任何线索。',
        },
        {
          text: '会让页面报错，控制台里能看到',
          why: '不报错。这类问题不在控制台里出现，只在真实用户那边出现 —— 所以它比报错更危险。',
        },
      ],
    },
    {
      type: 'code',
      title: '真实项目里就是这段（把假接口换成 fetch）',
      code: `useEffect(() => {
  const ctl = new AbortController()   // 这次请求的作废开关
  setPhase('loading')

  fetch('/api/orders', { signal: ctl.signal })
    .then((res) => {
      if (!res.ok) throw new Error('接口返回了 ' + res.status)
      return res.json()               // 真接口要再解一层 json
    })
    .then((data) => {
      setRows(data)                   // 假接口直接把数组给你了
      setPhase('ok')
    })
    .catch((err) => {
      if (err.name === 'AbortError') return   // 自己掐的，不算出错
      setPhase('error')
    })

  return () => ctl.abort()            // 卸载 / 重跑前，把请求掐掉
}, [reload])`,
    },
    {
      type: 'task',
      title: '动手任务',
      items: [
        '（第三个练习场）给 `useEffect` 补上清理：开头 `let alive = true`，回来时 `if (!alive) return`，在 `}, [page])` 前面加 `return () => { alive = false }`。补完点一键复现，大字稳稳停在「第 3 页的数据」。',
        '（正解练习场）做完 TODO 1 和 TODO 2：排序生效 + 出错能刷新。刷新点下去应该先闪一下「加载中…」再出数据（有 3 成概率又失败，多点几次）。',
        '把正解里 `Math.random() < 0.3` 的 `0.3` 临时改成 `1`，让假接口每次都失败，确认出错界面每次都出现；确认完改回 `0.3`。',
        '给正解加一个「只看 500 元以内」的过滤：再加一个 state，和 `word` 一起放进 `useMemo` 的依赖数组。这样你就有了两个派生条件。',
      ],
    },
    {
      type: 'check',
      items: [
        '正解练习场我多运行了几次，三种画面都亲眼见过：加载中、加载失败、商品列表。',
        '正解练习场里，搜索框打字列表跟着变少，清空搜索顺序不乱；完成 TODO 1 之后列表永远是从贵到便宜。',
        '反例练习场点一次「按价格排」，最后一行 `DATA` 的顺序跟着变了 —— 我能指着它说出「原数组被我排了」。',
        '第三个练习场补上清理后，点「一键复现」，大字最终停在「第 3 页的数据」，不再跳回第 2 页。',
      ],
    },
    {
      type: 'bonus',
      title: '加分题（做完说明你真的懂了）',
      md: [
        '- 把假的 `setTimeout(r, 600)` 改成 `setTimeout(r, [300, 900, 1500][Math.floor(Math.random() * 3)])`，让每次等待时间都不一样：加载态一闪而过的感觉会更真实，也更容易看清三态是怎么切换的。',
        '- 给正解加「空结果」提示：搜索没匹配到任何商品时，显示一行「没有找到商品」而不是空白。想一想：这是**第四种状态**吗？还是「有数据」里面的一个分支？想清楚了发我一句话。',
      ],
    },
  ],
}