import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Exclude node_modules from Fast Refresh
        exclude: /node_modules/,
      }),
    ],

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@context': resolve(__dirname, 'src/context'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@styles': resolve(__dirname, 'src/styles'),
      },
    },

    // Development server configuration
    server: {
      port: 5173,
      host: true,
      cors: true,
      open: false,
      hmr: {
        overlay: true,
      },
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },

    // Build optimization
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react'],
            utils: ['date-fns', 'lodash-es'],
            charts: ['recharts'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-hot-toast',
        'lucide-react',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    // Environment variables
    envPrefix: ['VITE_', 'NODE_ENV'],

    // Performance optimizations
    esbuild: {
      target: 'esnext',
      platform: 'browser',
      format: 'esm',
    },
  };
});
