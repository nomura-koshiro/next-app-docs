/** @type {import('stylelint').Config} */
const config = {
  plugins: ['@stylistic/stylelint-plugin', 'stylelint-plugin-logical-css'],
  ignoreFiles: ['src/stories/**/*.css'],
  rules: {
    // Tailwind CSS v4用の基本ルール
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'config', 'theme'],
      },
    ],

    // スタイリスティックルール
    '@stylistic/indentation': 2,
    '@stylistic/string-quotes': 'double',
    '@stylistic/color-hex-case': 'lower',
    '@stylistic/declaration-colon-space-after': 'always',
    '@stylistic/declaration-colon-space-before': 'never',
    '@stylistic/block-opening-brace-space-before': 'always',
    '@stylistic/block-closing-brace-newline-after': 'always',
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/declaration-block-semicolon-space-after': 'always-single-line',
    '@stylistic/declaration-block-semicolon-space-before': 'never',

    // 論理プロパティの推奨
    'plugin/use-logical-properties-and-values': [
      true,
      {
        severity: 'warning',
      },
    ],

    // カスタムプロパティの命名規則（shadcn/ui対応）
    'custom-property-pattern': [
      '^(color|font|spacing|size|shadow)-[a-z0-9-]+$|^radius$',
      {
        message: 'カスタムプロパティは "color-", "font-", "spacing-", "size-", "shadow-" で始めるか、"radius" である必要があります',
      },
    ],

    // 重複セレクタの禁止
    'no-duplicate-selectors': true,

    // 空のブロックの禁止
    'block-no-empty': true,

    // 無効な16進数カラーの禁止
    'color-no-invalid-hex': true,

    // ショートハンドプロパティの推奨
    'declaration-block-no-redundant-longhand-properties': true,

    // フォント関連
    'font-family-no-duplicate-names': true,
    'font-family-name-quotes': 'always-where-recommended',

    // 関数
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,

    // セレクタ
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements'],
      },
    ],

    // 単位
    'unit-no-unknown': true,

    // プロパティ
    'property-no-unknown': true,

    // 宣言ブロック
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],

    // メディアクエリ
    'media-feature-name-no-unknown': true,
  },
};

export default config;
