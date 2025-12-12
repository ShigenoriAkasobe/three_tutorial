import { defineConfig } from 'vite'

export default defineConfig({
  preview: {
    allowedHosts: [
      'three-tutorial.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})
