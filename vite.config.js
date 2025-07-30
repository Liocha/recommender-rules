import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Папка для сборки
    rollupOptions: {
      input: 'src/main.jsx', // Ваш входной файл
      output: {
        entryFileNames: 'react-flow-app.js', // Имя выходного файла
        format: 'iife', // Формат "самозапускающейся" функции
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'reactflow': 'ReactFlow'
        }
      },
      external: [] // Внешние зависимости
    }
  }
})