import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/*', 'creatures/**/*.png'],
      devOptions: {
        enabled: false
      }
    }),
  ],
});
