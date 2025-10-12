# ツール設定

ESLint、Prettier、VSCodeの設定とコマンド一覧について説明します。

## 目次

1. [ESLint主要ルール](#eslint主要ルール)
2. [Prettier設定](#prettier設定)
3. [コマンド一覧](#コマンド一覧)
4. [VSCode設定](#vscode設定)

---

## ESLint主要ルール

プロジェクトで有効になっている主要なESLintルールを説明します。

### 1. `@typescript-eslint/consistent-type-definitions`

interfaceを禁止し、typeの使用を強制します。

```typescript
// ❌ Bad: interface（エラー）
interface User {
  id: string;
  name: string;
}

// ✅ Good: type
type User = {
  id: string;
  name: string;
};
```

**設定:**

```json
{
  "@typescript-eslint/consistent-type-definitions": ["error", "type"]
}
```

---

### 2. `prefer-arrow-callback` / `func-style`

関数宣言を禁止し、アロー関数の使用を強制します。

```typescript
// ❌ Bad: 関数宣言（エラー）
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: アロー関数
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

**設定:**

```json
{
  "prefer-arrow-callback": "error",
  "func-style": ["error", "expression"]
}
```

---

### 3. `padding-line-between-statements`

return文の前に空行を必須とします。

```typescript
// ❌ Bad: return前に空行なし（エラー）
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total;
};

// ✅ Good: return前に空行
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return total;
};
```

**設定:**

```json
{
  "padding-line-between-statements": [
    "error",
    { "blankLine": "always", "prev": "*", "next": "return" }
  ]
}
```

---

### 4. `@typescript-eslint/no-explicit-any`

any型の使用を禁止します。

```typescript
// ❌ Bad: any型（エラー）
const fetchData = async (id: any): Promise<any> => {
  return await api.get(`/data/${id}`);
};

// ✅ Good: 明確な型定義
const fetchData = async (id: string): Promise<DataResponse> => {
  return await api.get<DataResponse>(`/data/${id}`);
};
```

---

### 5. `@typescript-eslint/no-unused-vars`

未使用の変数を禁止します（`_`で始まる変数は例外）。

```typescript
// ❌ Bad: 未使用の変数（エラー）
const fetchUser = (id: string) => {
  const timestamp = Date.now(); // 未使用

  return api.get(`/users/${id}`);
};

// ✅ Good: 未使用の変数なし
const fetchUser = (id: string) => {
  return api.get(`/users/${id}`);
};

// ✅ Good: _プレフィックスで意図的に無視
const handleClick = (_event: React.MouseEvent) => {
  console.log('clicked');
};
```

---

## Prettier設定

プロジェクトで使用しているPrettier設定を説明します。

### 設定一覧

| 設定項目         | 値      | 説明                       |
| ---------------- | ------- | -------------------------- |
| `printWidth`     | `140`   | 1行の最大文字数            |
| `tabWidth`       | `2`     | インデントのスペース数     |
| `semi`           | `true`  | セミコロンを常に付ける     |
| `singleQuote`    | `true`  | シングルクォートを使用     |
| `trailingComma`  | `"es5"` | ES5互換のトレイリングカンマ |
| `bracketSpacing` | `true`  | オブジェクトの括弧内にスペース |
| `arrowParens`    | `always`| アロー関数の引数を括弧で囲む |

### 設定ファイル

`.prettierrc`:

```json
{
  "printWidth": 140,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### フォーマット例

```typescript
// Prettierによるフォーマット結果

// シングルクォート
const message = 'Hello, World!';

// トレイリングカンマ（ES5）
const user = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com', // ← カンマあり
};

// 括弧内のスペース
const obj = { key: 'value' }; // ← スペースあり

// アロー関数の引数を括弧で囲む
const double = (x) => x * 2; // ← 引数が1つでも括弧
```

---

## コマンド一覧

### コード品質管理

```bash
# ESLintチェック
pnpm lint

# ESLint自動修正
pnpm lint:fix

# Prettierで整形
pnpm format

# すべてのチェックを一括実行
pnpm check

# すべてのチェックと自動修正を一括実行
pnpm check:fix
```

### コマンドの詳細

#### `pnpm lint`

ESLintでコードをチェックします。エラーがある場合は終了コード1で終了します。

```bash
$ pnpm lint
✓ No ESLint errors found!
```

#### `pnpm lint:fix`

ESLintで自動修正可能なエラーを修正します。

```bash
$ pnpm lint:fix
✓ Fixed 12 errors automatically
```

#### `pnpm format`

Prettierでコードを整形します。

```bash
$ pnpm format
✓ Formatted 45 files
```

#### `pnpm check`

ESLint、Prettier、TypeScriptのすべてのチェックを実行します。

```bash
$ pnpm check
Running ESLint... ✓
Running Prettier... ✓
Running TypeScript... ✓
All checks passed!
```

#### `pnpm check:fix`

すべてのチェックと自動修正を実行します。

```bash
$ pnpm check:fix
Running ESLint with fix... ✓
Running Prettier with write... ✓
All checks passed and fixes applied!
```

### 推奨フロー

**コミット前:**

```bash
# すべてのチェックと自動修正を実行
pnpm check:fix

# ビルド確認
pnpm build
```

**コミット時:**

Husky + lint-stagedにより、自動的にステージングされたファイルがチェックされます。

```bash
$ git commit -m "feat: add new feature"
✓ Running lint-staged
✓ ESLint passed
✓ Prettier passed
[main abc1234] feat: add new feature
```

---

## VSCode設定

### 必要な拡張機能

| 拡張機能                    | ID                               | 説明                       |
| --------------------------- | -------------------------------- | -------------------------- |
| **ESLint**                  | `dbaeumer.vscode-eslint`         | ESLintの統合               |
| **Prettier**                | `esbenp.prettier-vscode`         | Prettierの統合             |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss`    | TailwindCSSの補完          |

### 拡張機能のインストール

```bash
# コマンドパレット（Ctrl+Shift+P または Cmd+Shift+P）を開き
# "Extensions: Install Extensions" を選択

# または、以下のコマンドで一括インストール
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

### .vscode/settings.json

プロジェクトのVSCode設定:

```json
{
  // 保存時に自動フォーマット
  "editor.formatOnSave": true,

  // デフォルトフォーマッターをPrettierに設定
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 保存時にESLintの自動修正を実行
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // TypeScriptの設定
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // Tailwind CSSの設定
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### ユーザー設定の推奨

個人の`settings.json`に追加を推奨する設定:

```json
{
  // ファイル保存時の動作
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // エディターの表示
  "editor.rulers": [140],
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "boundary",

  // TypeScript/JavaScript
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### キーボードショートカット

便利なショートカット:

| 操作                   | Windows/Linux       | Mac                |
| ---------------------- | ------------------- | ------------------ |
| フォーマット           | `Shift+Alt+F`       | `Shift+Option+F`   |
| クイックフィックス     | `Ctrl+.`            | `Cmd+.`            |
| すべてのインポート整理 | `Shift+Alt+O`       | `Shift+Option+O`   |
| コマンドパレット       | `Ctrl+Shift+P`      | `Cmd+Shift+P`      |

---

## トラブルシューティング

### ESLintが動作しない

1. ESLint拡張機能がインストールされているか確認
2. プロジェクトルートで`pnpm install`を実行
3. VSCodeを再起動

### Prettierが動作しない

1. Prettier拡張機能がインストールされているか確認
2. `.vscode/settings.json`で`editor.defaultFormatter`が正しく設定されているか確認
3. ファイルの種類がPrettierでサポートされているか確認

### 保存時に自動フォーマットされない

1. `editor.formatOnSave`が`true`になっているか確認
2. 特定のファイルタイプでフォーマットが無効になっていないか確認
3. VSCodeの出力パネルでエラーメッセージを確認

---

## 関連リンク

- [基本原則](./01-basic-principles.md) - typeのみ使用
- [リンター・フォーマッター詳細](../../02-linter-formatter/) - より詳細な設定情報
- [ESLint公式ドキュメント](https://eslint.org/)
- [Prettier公式ドキュメント](https://prettier.io/)
- [VSCode公式ドキュメント](https://code.visualstudio.com/docs)
