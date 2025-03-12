import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async () => {
  const config = await viteConfig({ mode: 'test', command: 'build' })
  // 确保 config 是 UserConfig 类型
  const resolvedConfig =
    typeof config === 'function' ? await config({ mode: 'test', command: 'build' }) : config

  return mergeConfig(resolvedConfig, {
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
})
