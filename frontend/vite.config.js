import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Increase chunk size warning limit to 1000kb to reduce noise
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries chunk
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled', 'lucide-react', 'react-icons'],
          
          // PDF and canvas utilities
          'pdf-utils': ['html2canvas', 'jspdf'],
          
          // Markdown and syntax highlighting
          'markdown-vendor': ['react-markdown', 'rehype-highlight', 'remark-gfm', 'highlight.js'],
          
          // Communication libraries
          'socket-vendor': ['socket.io-client', 'axios'],
          
          // Utility libraries
          'utils-vendor': ['prop-types']
        }
      }
    }
  }
})
