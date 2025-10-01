import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // Vite replaces this string during the build process with the value from your .env file.
      // This makes the API key available in your client-side code.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  }
});
