import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

  const isProd = mode === 'production';
  const plugins = [];

  const viteEnv = {};
  if (isProd) {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(`VITE_`)) {
        viteEnv[`import.meta.env.${key}`] = process.env[key];
      }
    });
  }

  if (mode === 'development') plugins.push(reactRefresh());

  return defineConfig({
    plugins,
    publicDir: './public',
    ...(isProd && { define: viteEnv }),
    server: {
      port: 4000,
    },
    build: {
      chunkSizeWarningLimit: 2500,
    },
    resolve: {
      alias: [
        {
          find: /^react-mapbox-gl/,
          replacement: 'react-mapbox-gl/lib',
        },
      ]
    }
  });
};
