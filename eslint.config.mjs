// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    // interfaceを禁止し、typeを使用することを強制
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    // コールバック関数でアロー関数を強制
    "prefer-arrow-callback": ["error", { "allowNamedFunctions": false }],
    // 関数宣言を禁止し、アロー関数を含む関数式を強制
    "func-style": ["error", "expression", { "allowArrowFunctions": true }],
    // return文の前に空行を強制
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ],
    // 未使用変数をエラー（_で始まる変数は除外）
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    // Promiseの誤用を防ぐ
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    // 厳格なboolean式を強制
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        "allowNullableObject": true,
        "allowNullableString": true
      }
    ],
  },
}, {
  files: ["src/components/ui/**/*.{ts,tsx}", "src/components/layout/**/*.{ts,tsx}"],
  rules: {
    // UIコンポーネントでは関数宣言を許可
    "func-style": "off",
  },
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
