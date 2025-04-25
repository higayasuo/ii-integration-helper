import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ii-integration-helpers',
      fileName: (format) => `ii-integration-helpers.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        '@dfinity/agent',
        '@dfinity/identity',
        '@dfinity/auth-client',
        'canister-manager',
      ],
    },
  },
});
