import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Remover console.logs em produção usando esbuild (mais eficiente que terser)
  esbuild: mode === 'production' ? {
    drop: ['console', 'debugger'],
  } : undefined,
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
      '/users': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        secure: true,
      },
      '/tasks': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        secure: true,
      },
      '/clone': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
      '/users': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        secure: true,
      },
      '/tasks': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        secure: true,
      },
      '/clone': {
        target: process.env.VITE_API_BASE_URL || 'https://bclone.fabricadelowticket.com.br',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    // Usar esbuild para minificação (padrão do Vite, mais rápido e já remove console.logs via drop acima)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Garantir que arquivos JS tenham extensão .js
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.js')) {
            return 'assets/[name]-[hash].js'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
}))

