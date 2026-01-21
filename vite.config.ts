import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Remover console.logs em produção
    {
      name: 'remove-console',
      enforce: 'post',
      transform(code, id) {
        if (process.env.NODE_ENV === 'production' && !id.includes('node_modules')) {
          return {
            code: code.replace(/console\.(log|warn|error|debug|info|trace)\([^)]*\);?/g, ''),
            map: null
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
      }
    },
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
})
