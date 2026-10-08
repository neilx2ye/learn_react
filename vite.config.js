import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true 让同一 Wi-Fi 下的手机能直接打开（终端里会打印 Network 地址）
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    // @babel/standalone（练习场用的编译器）单独分块，约 3MB：第一次点「运行」时才会下载
    chunkSizeWarningLimit: 3200,
  },
})