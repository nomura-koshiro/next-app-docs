# コマンド・IDE統合

Linter・Formatterの実行コマンドとIDE統合について説明します。

## 目次

1. [コマンド一覧](#コマンド一覧)
2. [IDEとの連携](#ideとの連携)
3. [設定変更時の注意点](#設定変更時の注意点)

---

## コマンド一覧

### 基本コマンド

```bash
# すべてのLintチェック
pnpm lint

# ESLintのみ
pnpm lint:eslint

# Prettierチェック
pnpm lint:prettier

# Stylelintのみ
pnpm lint:stylelint

# 自動修正
pnpm lint:fix
```

### コマンドの詳細

#### `pnpm lint`

すべてのLintツール（ESLint、Prettier、Stylelint）を実行します。エラーがある場合は終了コード1で終了します。

```bash
$ pnpm lint
Running ESLint... ✓
Running Prettier... ✓
Running Stylelint... ✓
All checks passed!
```

#### `pnpm lint:eslint`

ESLintのみを実行します。

```bash
$ pnpm lint:eslint
✓ No ESLint errors found!
```

#### `pnpm lint:prettier`

Prettierでコードフォーマットをチェックします。

```bash
$ pnpm lint:prettier
Checking formatting...
All matched files use Prettier code style!
```

#### `pnpm lint:stylelint`

Stylelintのみを実行します。

```bash
$ pnpm lint:stylelint
✓ No Stylelint errors found!
```

#### `pnpm lint:fix`

すべてのLintツールで自動修正可能なエラーを修正します。

```bash
$ pnpm lint:fix
Running ESLint with fix... ✓
Running Prettier with write... ✓
Running Stylelint with fix... ✓
All checks passed and fixes applied!
```

### 統合コマンド

```bash
# すべてのチェックを一括実行
pnpm check

# すべてのチェックと自動修正を一括実行
pnpm check:fix
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

## IDEとの連携

### VS Code

#### 必要な拡張機能

| 拡張機能                    | ID                               | 説明                       |
| --------------------------- | -------------------------------- | -------------------------- |
| **ESLint**                  | `dbaeumer.vscode-eslint`         | ESLintの統合               |
| **Prettier**                | `esbenp.prettier-vscode`         | Prettierの統合             |
| **Stylelint**               | `stylelint.vscode-stylelint`     | Stylelintの統合            |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss`    | TailwindCSSの補完          |

#### 拡張機能のインストール

```bash
# コマンドパレット（Ctrl+Shift+P または Cmd+Shift+P）を開き
# "Extensions: Install Extensions" を選択

# または、以下のコマンドで一括インストール
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension stylelint.vscode-stylelint
code --install-extension bradlc.vscode-tailwindcss
```

#### プロジェクト設定（.vscode/settings.json）

```json
{
  // 保存時に自動フォーマット
  "editor.formatOnSave": true,

  // デフォルトフォーマッターをPrettierに設定
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 保存時にESLintとStylelintの自動修正を実行
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
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

#### ユーザー設定の推奨

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

#### キーボードショートカット

便利なショートカット:

| 操作                   | Windows/Linux       | Mac                |
| ---------------------- | ------------------- | ------------------ |
| フォーマット           | `Shift+Alt+F`       | `Shift+Option+F`   |
| クイックフィックス     | `Ctrl+.`            | `Cmd+.`            |
| すべてのインポート整理 | `Shift+Alt+O`       | `Shift+Option+O`   |
| コマンドパレット       | `Ctrl+Shift+P`      | `Cmd+Shift+P`      |

---

## 設定変更時の注意点

### 1. ESLint設定を変更する場合

- 必ず`pnpm lint`を実行して、既存コードへの影響を確認
- UIコンポーネント用の例外設定を考慮
- チーム全体で合意を得る

```bash
# 設定変更後の確認
pnpm lint

# 自動修正可能なエラーを修正
pnpm lint:fix
```

### 2. Prettier設定を変更する場合

- プロジェクト全体に影響するため、チーム全体で合意を得る
- `pnpm format`で全ファイルを再フォーマット
- 大きな差分が発生する可能性があるため、別コミットで実施

```bash
# 全ファイルを再フォーマット
pnpm format

# 差分を確認
git diff
```

### 3. Stylelint設定を変更する場合

- Tailwind CSSとの互換性を確認
- カスタムプロパティの命名規則はshadcn/uiとの整合性を保つ

```bash
# 設定変更後の確認
pnpm lint:stylelint

# 自動修正
pnpm lint:fix
```

---

## トラブルシューティング

### ESLintが動作しない

1. ESLint拡張機能がインストールされているか確認
2. プロジェクトルートで`pnpm install`を実行
3. VSCodeを再起動

```bash
# 依存関係の再インストール
pnpm install

# ESLintの実行確認
pnpm lint:eslint
```

### Prettierが動作しない

1. Prettier拡張機能がインストールされているか確認
2. `.vscode/settings.json`で`editor.defaultFormatter`が正しく設定されているか確認
3. ファイルの種類がPrettierでサポートされているか確認

### 保存時に自動フォーマットされない

1. `editor.formatOnSave`が`true`になっているか確認
2. 特定のファイルタイプでフォーマットが無効になっていないか確認
3. VSCodeの出力パネルでエラーメッセージを確認

```json
// .vscode/settings.json で確認
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Stylelintのエラーが消えない

1. Stylelint拡張機能がインストールされているか確認
2. `stylelint.config.mjs`の構文エラーを確認
3. VSCodeを再起動

---

## 設定ファイルの場所

| ツール | ファイル名 | 場所 |
|--------|-----------|------|
| ESLint | `eslint.config.mjs` | プロジェクトルート |
| Prettier | `.prettierrc.config.mjs` | プロジェクトルート |
| Stylelint | `stylelint.config.mjs` | プロジェクトルート |
| VS Code | `settings.json` | `.vscode/` ディレクトリ |

---

## 使用中のプラグイン一覧

### ESLint

- ✅ **@tanstack/eslint-plugin-query** - TanStack Queryのベストプラクティスチェック
- ✅ **eslint-plugin-storybook** - Storybookストーリーファイルの品質チェック
- ⚠️ **eslint-plugin-tailwindcss** - Tailwind CSS v4対応待ち（一時無効）
- **eslint-config-next に含まれるプラグイン**:
  - `@next/eslint-plugin-next` - Next.js専用ルール
  - `eslint-plugin-react` - React
  - `eslint-plugin-react-hooks` - React Hooks
  - `eslint-plugin-jsx-a11y` - アクセシビリティ
  - `eslint-plugin-import` - import文の管理

### Stylelint

- ✅ **@stylistic/stylelint-plugin** - コードスタイルルール
- ✅ **stylelint-plugin-logical-css** - 論理プロパティの推奨

---

## 関連リンク

- [ESLint設定](./01-eslint.md) - ESLintの詳細設定
- [Prettier設定](./02-prettier.md) - Prettierの詳細設定
- [Stylelint設定](./03-stylelint.md) - Stylelintの詳細設定
- [コーディング規約](../01-coding-standards/) - プロジェクトのコーディング規約
