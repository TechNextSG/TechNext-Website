import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default defineConfig({
    plugins: [react(), vike()],
    server: {
        port: 5173,
        open: true
    },
    ssr: {
        noExternal: []
    }
})
