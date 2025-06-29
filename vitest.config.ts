import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      fileParallelism: false,
      // Arquivo executado antes de cada **arquivo de teste**
      // (ideal para configuração global como jest-dom e cleanup)
      setupFiles: ['vitest.setup.ts'],
      // Executado uma única vez antes (setup) e depois (tearDown) da suíte
      // inteira de testes
      globalSetup: ['vitest.global.setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/layout/**',
          'src/main.ts',
          'src/router/index.ts',
          'src/stores/**',
          'src/components/**',
          'src/plugins/**',
          'src/utils/**',
          'src/mocks/**',
          'src/assets/**',
          '**/config/**',
          '**/constants/**',
          '**/mocks/**',
          '**/providers/**',
          '**/types/**',
          '**/*.config.ts',
          '**/*.mock.ts',
          '**/*.type.ts',
          '**/*.types.ts',
          '**/*.interface.ts',
          '**/*.d.ts',
        ],
      },
    },
  }),
)
