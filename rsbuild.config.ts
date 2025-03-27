import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    // 相当于 Vite 的 base 配置
    template: './index.html',
  },
  output: {
    assetPrefix: '/', // 对应 vite.base
  },
  source: {
    entry: {
      index: './src/main.tsx'
    }
  },
  performance: {
    chunkSplit: { 
      strategy: 'split-by-size',
      minSize: 300000,
      maxSize: 500000,
    }
  }
});
