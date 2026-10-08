import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import './styles/app.css'
import App from './App.jsx'
import { getSnapshot } from './learn/progress'

document.documentElement.dataset.fs = getSnapshot().fontSize || 'm'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 装到手机桌面后离线也能学（第一次要联网打开一次）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}