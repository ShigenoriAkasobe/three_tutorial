import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sample00: resolve(__dirname, 'samples/00_cube_rotation/index.html'),
        sample01: resolve(__dirname, 'samples/01_metallic_cube_rotation/index.html'),
        sample02: resolve(__dirname, 'samples/02_lorenz_attractor/index.html'),
      }
    }
  }
})
