import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'IIIntegrationHelper',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@dfinity/agent', '@dfinity/identity', '@dfinity/auth-client'],
      output: {
        globals: {
          '@dfinity/agent': 'agent',
          '@dfinity/identity': 'identity',
          '@dfinity/auth-client': 'authClient',
        },
      },
    },
  },
  plugins: [dts()],
});
