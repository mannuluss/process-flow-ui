/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  test: {
    globals: true, // Makes test functions (describe, it, expect, etc.) available globally without requiring explicit imports.
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    coverage: {
      provider: 'istanbul',
      reporter: [
        ['html', { subdir: './html-report' }],
        'lcov',
        ['cobertura', { file: './cobertura-report/cobertura.xml' }],
      ],
      all: true,
      exclude: [
        'node_modules/',
        'dist/',
        '.eslintrc.cjs',
        'vite.config.ts',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
      ],
    },
    reporters: ['default', 'vitest-sonar-reporter'],
    outputFile: {
      'vitest-sonar-reporter': './coverage/junit-report/junit.xml',
    },
  },
});
