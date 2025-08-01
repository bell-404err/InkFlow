import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        port: 5173,      // жёстко фиксируем порт
        strictPort: true // упадёт, если 5173 занят
    }

})
