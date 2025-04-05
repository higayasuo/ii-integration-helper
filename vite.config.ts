import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ii-integration-helper',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@dfinity/agent', '@dfinity/identity', '@dfinity/auth-client'],
      output: {
        globals: {
          '@dfinity/agent': 'dfinityAgent',
          '@dfinity/identity': 'dfinityIdentity',
          '@dfinity/auth-client': 'dfinityAuthClient',
        },
      },
    },
  },
  plugins: [
    dts({
      include: ['src'],
      exclude: ['src/**/*.spec.ts'],
      rollupTypes: true,
      copyDtsFiles: false,
    }),
  ],
});
