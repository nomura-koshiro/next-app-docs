// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
// import tailwindcss from "eslint-plugin-tailwindcss"; // Tailwind CSS v4と互換性がないため一時的にコメントアウト

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...tanstackQuery.configs["flat/recommended"],
  // ...tailwindcss.configs["flat/recommended"], // Tailwind CSS v4と互換性がないため一時的にコメントアウト
  {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  plugins: {
    "simple-import-sort": simpleImportSort,
    "unused-imports": unusedImports,
  },
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    // ================================================================================
    // TypeScript - 型と型安全性
    // ================================================================================
    // interfaceを禁止し、typeを使用することを強制
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    // 未使用変数をエラー（_で始まる変数は除外）
    "@typescript-eslint/no-unused-vars": "off", // unused-importsプラグインを使用
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    // 命名規則の強制
    "@typescript-eslint/naming-convention": [
      "error",
      // デフォルト: camelCase
      {
        "selector": "default",
        "format": ["camelCase"],
        "leadingUnderscore": "allow",
        "trailingUnderscore": "forbid"
      },
      // import: camelCase または PascalCase (ライブラリのimportに対応)
      {
        "selector": "import",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"]
      },
      // 変数: camelCase または PascalCase (Reactコンポーネント用)
      {
        "selector": "variable",
        "format": ["camelCase", "PascalCase"],
        "leadingUnderscore": "allow"
      },
      // const変数: camelCase, PascalCase, UPPER_CASE
      {
        "selector": "variable",
        "modifiers": ["const"],
        "format": ["camelCase", "PascalCase", "UPPER_CASE"]
      },
      // 関数: camelCase または PascalCase (Reactコンポーネント用)
      {
        "selector": "function",
        "format": ["camelCase", "PascalCase"]
      },
      // パラメータ: camelCase (未使用は_で始めることを許可)
      {
        "selector": "parameter",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      // Type/Interface: PascalCase
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
      // Enum: PascalCase
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      // Enumメンバー: UPPER_CASE
      {
        "selector": "enumMember",
        "format": ["UPPER_CASE"]
      },
      // クラス: PascalCase
      {
        "selector": "class",
        "format": ["PascalCase"]
      },
      // オブジェクトのプロパティ: 制限なし（API responseなど外部データ対応）
      {
        "selector": "objectLiteralProperty",
        "format": null
      },
      // Type内のプロパティ: 制限なし（API responseなど外部データ対応）
      {
        "selector": "typeProperty",
        "format": null
      }
    ],

    // ================================================================================
    // TypeScript - 非同期処理とPromise
    // ================================================================================
    // Promiseの誤用を防ぐ
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    // floating Promiseを禁止（await忘れを防ぐ）
    "@typescript-eslint/no-floating-promises": "error",
    // try-catch文を禁止し、.catch()の使用を強制
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TryStatement",
        "message": "try-catchは禁止されています。代わりに.catch()メソッドを使用してください。例: await somePromise().catch(error => { ... })"
      }
    ],
    // 厳格なboolean式を強制
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        "allowNullableObject": true,
        "allowNullableString": true,
        "allowNullableBoolean": true
      }
    ],

    // ================================================================================
    // コードスタイル - 関数
    // ================================================================================
    // 関数宣言を禁止し、アロー関数を含む関数式を強制
    "func-style": ["error", "expression", { "allowArrowFunctions": true }],
    // コールバック関数でアロー関数を強制
    "prefer-arrow-callback": ["error", { "allowNamedFunctions": false }],

    // ================================================================================
    // コードスタイル - フォーマット
    // ================================================================================
    // return文の前に空行を強制
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ],

    // ================================================================================
    // コードスタイル - インポート/エクスポート
    // ================================================================================
    // インポートの自動ソート
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
},
  {
    files: ["src/components/ui/**/*.{ts,tsx}", "src/components/sample-ui/**/*.{ts,tsx}", "src/components/layout/**/*.{ts,tsx}"],
    rules: {
      // UIコンポーネントでは関数宣言を許可
      "func-style": "off",
    },
  },
  {
    // Error BoundaryやMiddlewareなど、try-catchが必須の場所では許可
    files: [
      "**/error.tsx",
      "**/error.ts",
      "**/*.middleware.{ts,tsx}",
      "**/middleware.{ts,tsx}",
      "**/*-error-boundary.{ts,tsx}",
      "**/error-boundary.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    // Storybookファイルでは、デモ用のaction呼び出しでfloating promiseを許可
    files: ["**/*.stories.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TanStack Query: exhaustive-deps を warn に変更（厳格すぎる場合）
      "@tanstack/query/exhaustive-deps": "warn",
    },
  },
  ...storybook.configs["flat/recommended"]
];

export default eslintConfig;
