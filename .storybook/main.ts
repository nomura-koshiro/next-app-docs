import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    // Storybook用の環境変数を追加
    // NEXT_PUBLIC_STORYBOOK_PORTを設定して、env.tsで検出できるようにする
    config.define = {
      ...config.define,
      'process.env.NEXT_PUBLIC_STORYBOOK_PORT': JSON.stringify('6006'),
    };

    return config;
  },
};
export default config;
