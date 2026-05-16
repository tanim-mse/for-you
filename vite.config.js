import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ← Replace 'YOUR-REPO-NAME' with your actual GitHub repository name once created.
  // Example: if your repo is github.com/yourname/midnight-journal, set: '/midnight-journal/'
  base: '/for-you/',

  plugins: [react()],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
