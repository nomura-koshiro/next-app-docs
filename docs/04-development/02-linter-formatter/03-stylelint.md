# Stylelint設定

Stylelintは、CSSの品質とスタイルをチェックするツールです。このプロジェクトでは、Tailwind CSS v4に最適化された設定を使用しています。

## 目次

1. [使用プラグイン](#使用プラグイン)
2. [Tailwind CSS対応](#tailwind-css対応)
3. [スタイリスティックルール](#スタイリスティックルール)
4. [論理プロパティ](#論理プロパティ)
5. [カスタムプロパティの命名規則](#カスタムプロパティの命名規則)
6. [CSS品質ルール](#css品質ルール)

---

## 使用プラグイン

```javascript
plugins: ['@stylistic/stylelint-plugin', 'stylelint-plugin-logical-css']
```

- **@stylistic/stylelint-plugin**: コードスタイル（インデント、スペースなど）のルール
- **stylelint-plugin-logical-css**: 論理プロパティ（start/end）の推奨

---

## Tailwind CSS対応

### @ルールの許可

```javascript
'at-rule-no-unknown': [
  true,
  {
    ignoreAtRules: ['tailwind', 'apply', 'layer', 'config', 'theme'],
  },
]
```

#### 設定の意図

Tailwind CSS特有の@ルールをエラーにしないようにします。

#### ✅ 許可される@ルール

```css
/* Tailwind CSSのディレクティブ */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムユーティリティの定義 */
@layer components {
  .btn-primary {
    @apply rounded-lg bg-blue-500 px-4 py-2 font-bold text-white;
  }
}

/* テーマ設定 */
@theme {
  --color-primary: #3b82f6;
  --font-sans: 'Inter', sans-serif;
}

/* 設定 */
@config './tailwind.config.js';
```

#### なぜこれらを許可するのか

Tailwind CSS v4では、これらの@ルールがフレームワークの中核機能です。標準CSSにはないため、明示的に許可する必要があります。

---

## スタイリスティックルール

### 1. インデント

```javascript
'@stylistic/indentation': 2
```

#### ✅ 正しいインデント（2スペース）

```css
.container {
  display: flex;
  flex-direction: column;
}

@layer components {
  .card {
    padding: 1rem;
    border-radius: 0.5rem;
  }
}
```

---

### 2. クォートのスタイル

```javascript
'@stylistic/string-quotes': 'double'
```

#### ❌ シングルクォート

```css
.background {
  background-image: url('/images/bg.jpg');
  font-family: 'Inter', sans-serif;
}
```

#### ✅ ダブルクォート

```css
.background {
  background-image: url("/images/bg.jpg");
  font-family: "Inter", sans-serif;
}
```

#### なぜダブルクォートなのか

1. **HTML/JSXとの一貫性**: HTML属性やJSXではダブルクォートが標準
2. **CSS慣習**: CSSではダブルクォートが一般的
3. **視覚的な区別**: JavaScriptとCSSで異なるクォートを使用することで区別しやすい

---

### 3. カラーコードの小文字化

```javascript
'@stylistic/color-hex-case': 'lower'
```

#### ❌ 大文字

```css
.text {
  color: #FF5733;
  background-color: #FFFFFF;
}
```

#### ✅ 小文字

```css
.text {
  color: #ff5733;
  background-color: #ffffff;
}
```

#### なぜ小文字なのか

1. **一貫性**: すべてのカラーコードが統一される
2. **可読性**: 小文字の方が読みやすい（主観的だが一般的な意見）
3. **短縮形**: 小文字の方が短縮形（`#fff`など）との違いが少ない

---

### 4. コロンの前後のスペース

```javascript
'@stylistic/declaration-colon-space-after': 'always',
'@stylistic/declaration-colon-space-before': 'never',
```

#### ❌ 間違ったスペース

```css
.element {
  color : red; /* beforeにスペース */
  margin:1rem; /* afterにスペースなし */
  padding :  2rem; /* 両方間違い */
}
```

#### ✅ 正しいスペース

```css
.element {
  color: red;
  margin: 1rem;
  padding: 2rem;
}
```

---

### 5. ブロックの開始括弧の前のスペース

```javascript
'@stylistic/block-opening-brace-space-before': 'always'
```

#### ❌ スペースなし

```css
.container{
  display: flex;
}

.card{
  padding: 1rem;
}
```

#### ✅ スペースあり

```css
.container {
  display: flex;
}

.card {
  padding: 1rem;
}
```

---

### 6. ブロックの閉じ括弧の後の改行

```javascript
'@stylistic/block-closing-brace-newline-after': 'always'
```

#### ❌ 改行なし

```css
.card { padding: 1rem; } .button { margin: 0.5rem; }
```

#### ✅ 改行あり

```css
.card {
  padding: 1rem;
}

.button {
  margin: 0.5rem;
}
```

---

## 論理プロパティ

```javascript
'plugin/use-logical-properties-and-values': [
  true,
  {
    severity: 'warning',
  },
]
```

### 設定の意図

物理的なプロパティ（left/right）ではなく、論理的なプロパティ（start/end）の使用を推奨します（警告レベル）。

### ❌ 物理的なプロパティ（警告）

```css
.element {
  margin-left: 1rem; /* 警告：margin-inline-startを使用すべき */
  padding-right: 2rem; /* 警告：padding-inline-endを使用すべき */
  border-left: 1px solid black; /* 警告 */
}
```

### ✅ 論理プロパティ

```css
.element {
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
  border-inline-start: 1px solid black;
}
```

### なぜ論理プロパティなのか

1. **国際化**: RTL（右から左）言語でも正しく動作
2. **保守性**: レイアウト方向が変わっても修正不要
3. **モダンな標準**: CSS Logical Propertiesは現代のWeb標準

### 方向の対応表

| 物理プロパティ        | 論理プロパティ         | 意味           |
| --------------------- | ---------------------- | -------------- |
| `margin-left`         | `margin-inline-start`  | 行内方向の開始 |
| `margin-right`        | `margin-inline-end`    | 行内方向の終了 |
| `margin-top`          | `margin-block-start`   | ブロック方向の開始 |
| `margin-bottom`       | `margin-block-end`     | ブロック方向の終了 |
| `padding-left`        | `padding-inline-start` | 行内方向の開始 |
| `border-left`         | `border-inline-start`  | 行内方向の開始 |
| `text-align: left`    | `text-align: start`    | 開始揃え |

### 実際の効果

```css
/* 物理プロパティ */
.nav-item {
  margin-left: 1rem; /* LTR: 左、RTL: そのまま左（問題！） */
}

/* 論理プロパティ */
.nav-item {
  margin-inline-start: 1rem; /* LTR: 左、RTL: 自動的に右 */
}
```

---

## カスタムプロパティの命名規則

```javascript
'custom-property-pattern': [
  '^(color|font|spacing|size|shadow)-[a-z0-9-]+$|^radius$',
  {
    message: 'カスタムプロパティは "color-", "font-", "spacing-", "size-", "shadow-" で始めるか、"radius" である必要があります',
  },
]
```

### 設定の意図

CSS変数の命名を統一し、shadcn/uiのデザインシステムに準拠します。

### ❌ 規則に違反する命名

```css
:root {
  --primary: #3b82f6; /* エラー：プレフィックスがない */
  --main-background: #ffffff; /* エラー：許可されていないプレフィックス */
  --buttonColor: #000000; /* エラー：キャメルケース */
}
```

### ✅ 正しい命名

```css
:root {
  /* カラー変数 */
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --color-foreground: #000000;

  /* フォント変数 */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* スペーシング変数 */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* サイズ変数 */
  --size-button-height: 2.5rem;
  --size-input-width: 20rem;

  /* シャドウ変数 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 特別な変数 */
  --radius: 0.5rem;
}
```

### なぜこの命名規則なのか

1. **shadcn/ui互換性**: shadcn/uiのデザインシステムと一貫性を保つ
2. **カテゴリ別**: プレフィックスにより変数の用途が一目でわかる
3. **保守性**: 関連する変数をグループ化しやすい

---

## CSS品質ルール

### 1. 重複セレクタの禁止

```javascript
'no-duplicate-selectors': true
```

#### ❌ 重複セレクタ

```css
.button {
  padding: 0.5rem 1rem;
  background: blue;
}

/* ... 他のCSS ... */

.button {
  /* エラー：重複 */
  font-size: 1rem;
}
```

#### ✅ セレクタを統合

```css
.button {
  padding: 0.5rem 1rem;
  background: blue;
  font-size: 1rem;
}
```

---

### 2. 空のブロックの禁止

```javascript
'block-no-empty': true
```

#### ❌ 空のブロック

```css
.container {
  /* エラー：空のブロック */
}

.wrapper {
}
```

#### ✅ プロパティを含める、または削除

```css
.container {
  display: flex;
}

/* 不要な場合は削除 */
```

---

### 3. 無効な16進数カラーの禁止

```javascript
'color-no-invalid-hex': true
```

#### ❌ 無効なカラーコード

```css
.text {
  color: #gg0000; /* エラー：ggは16進数ではない */
  background: #12345; /* エラー：5桁は無効 */
}
```

#### ✅ 有効なカラーコード

```css
.text {
  color: #ff0000;
  background: #123456;
}
```

---

### 4. ショートハンドプロパティの推奨

```javascript
'declaration-block-no-redundant-longhand-properties': true
```

#### ❌ 冗長な個別プロパティ

```css
.box {
  margin-top: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
}
```

#### ✅ ショートハンド

```css
.box {
  margin: 1rem;
}
```

---

### 5. フォント関連

```javascript
'font-family-no-duplicate-names': true,
'font-family-name-quotes': 'always-where-recommended'
```

#### ❌ 問題のあるフォント指定

```css
.text {
  font-family: Arial, Arial, sans-serif; /* エラー：重複 */
  font-family: Times New Roman, serif; /* 警告：スペースを含むのでクォートが必要 */
}
```

#### ✅ 正しいフォント指定

```css
.text {
  font-family: Arial, sans-serif;
  font-family: "Times New Roman", serif;
}
```

---

### 6. calc関数

```javascript
'function-calc-no-unspaced-operator': true
```

#### ❌ スペースのない演算子

```css
.element {
  width: calc(100%-2rem); /* エラー */
  height: calc(50vh+10px); /* エラー */
}
```

#### ✅ 演算子の前後にスペース

```css
.element {
  width: calc(100% - 2rem);
  height: calc(50vh + 10px);
}
```

---

### 7. セレクタの検証

```javascript
'selector-pseudo-class-no-unknown': true,
'selector-pseudo-element-no-unknown': true,
'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }]
```

#### ❌ 未知のセレクタ

```css
/* 未知の擬似クラス */
.element:hoverr {
  /* エラー：hoverのタイプミス */
}

/* 未知の擬似要素 */
.element::afterr {
  /* エラー：afterのタイプミス */
}

/* 未知の要素 */
unknownelement {
  /* エラー：存在しない要素 */
}
```

#### ✅ 正しいセレクタ

```css
.element:hover {
  color: blue;
}

.element::after {
  content: "";
}

/* カスタム要素は許可される */
my-custom-element {
  display: block;
}
```

---

### 8. 重複プロパティの制限

```javascript
'declaration-block-no-duplicate-properties': [
  true,
  {
    ignore: ['consecutive-duplicates-with-different-values'],
  },
]
```

#### ❌ 重複プロパティ（エラー）

```css
.element {
  color: red;
  font-size: 1rem;
  color: blue; /* エラー：重複 */
}
```

#### ✅ 許可される重複（フォールバック）

```css
.element {
  /* フォールバック値（古いブラウザ用） */
  background: red;
  background: linear-gradient(to right, red, blue); /* 許可される */
}

.grid {
  /* フォールバック */
  display: block;
  display: grid; /* 許可される */
}
```

---

## 設定ファイル

`stylelint.config.mjs`:

```javascript
export default {
  plugins: ['@stylistic/stylelint-plugin', 'stylelint-plugin-logical-css'],
  rules: {
    // Tailwind CSS対応
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

    // 論理プロパティ
    'plugin/use-logical-properties-and-values': [
      true,
      {
        severity: 'warning',
      },
    ],

    // カスタムプロパティの命名規則
    'custom-property-pattern': [
      '^(color|font|spacing|size|shadow)-[a-z0-9-]+$|^radius$',
      {
        message: 'カスタムプロパティは指定されたプレフィックスで始める必要があります',
      },
    ],

    // CSS品質ルール
    'no-duplicate-selectors': true,
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'font-family-no-duplicate-names': true,
    'font-family-name-quotes': 'always-where-recommended',
    'function-calc-no-unspaced-operator': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }],
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
  },
};
```

---

## 関連リンク

- [ESLint設定](./01-eslint.md) - JavaScriptのLint設定
- [Prettier設定](./02-prettier.md) - コードフォーマット設定
- [コマンド・IDE統合](./04-commands-ide.md) - Stylelintの実行方法
- [Stylelint公式ドキュメント](https://stylelint.io/) - 公式ドキュメント
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) - MDN
