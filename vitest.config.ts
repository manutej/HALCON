import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts', 'src/__tests__/**/*.spec.ts'],
    exclude: [
      'node_modules',
      'dist',
      'claude-sdk-microservice',
      '**/*.config.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        'claude-sdk-microservice/',
        'src/__tests__/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/types/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    // Reporter
    reporters: ['verbose'],
    // Watch mode
    watch: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/commands': path.resolve(__dirname, './src/commands'),
      '@/mcp': path.resolve(__dirname, './src/mcp'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/tests': path.resolve(__dirname, './src/__tests__')
    }
  }
});
