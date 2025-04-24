import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ii-integration-helper',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
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
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
