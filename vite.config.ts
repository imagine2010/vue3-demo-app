import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
import { type UserConfigExport, type ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } = loadEnv(mode, process.cwd())
  return {
    base: VITE_PUBLIC_PATH, // 公共基础路径/ ./
    root: process.cwd(), // 项目根目录（index.html 文件所在的位置）
    mode: mode, // 模式development/production
    // 全局常量替换方式
    define: {},
    // 服务配置
    server: {
      port: Number(VITE_PORT),
      host: '0.0.0.0',
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {},
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    // 路径别名配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // css配置
    css: {
      // 预处理器配置
      // preprocessorOptions: {
      //   scss: {
      //     additionalData: `@import "@/styles/variables.scss";`,
      //   },
      // },
    },
    // 构建配置
    build: {
      // 最终构建的浏览器兼容目标
      target: 'es2015',
      sourcemap: false,
      minify: VITE_COMPRESSION === 'true',
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2000,
      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    // 优化配置
    optimizeDeps: {
      // 默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包
      include: ['vue', 'vue-router', '@vueuse/core'],
    },
    // ssr配置
    ssr: {},
  }
}
