# Linter・Formatter設定

本ドキュメントでは、プロジェクトで使用しているESLint、Prettier、Stylelintの設定について詳しく説明します。各ルールの意図、良い例と悪い例、そしてなぜそのルールが必要なのかを解説します。

## 📚 目次

### ツール別設定

1. **[ESLint設定](./01-eslint.md)**
   - 基本設定とプラグイン
   - TypeScript関連ルール
   - 関数スタイルルール
   - コードフォーマットルール
   - UIコンポーネント用の例外設定

2. **[Prettier設定](./02-prettier.md)**
   - セミコロンの使用
   - 末尾カンマ
   - クォートのスタイル
   - 1行の最大文字数
   - インデント幅
   - タブ文字の使用
   - アロー関数の引数の括弧
   - 改行コード

3. **[Stylelint設定](./03-stylelint.md)**
   - Tailwind CSS対応
   - スタイリスティックルール
   - 論理プロパティ
   - カスタムプロパティの命名規則
   - CSS品質ルール

4. **[コマンド・IDE統合](./04-commands-ide.md)**
   - Lintコマンド一覧
   - VS Code設定
   - 推奨拡張機能
   - 設定変更時の注意点

---

## 🚀 クイックリファレンス

### よく使うコマンド

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

### 主要ルール一覧

| ツール | ルール | 内容 |
|--------|--------|------|
| ESLint | `@typescript-eslint/consistent-type-definitions` | typeを強制（interface禁止） |
| ESLint | `prefer-arrow-callback` | アロー関数を強制 |
| ESLint | `func-style` | 関数宣言を禁止 |
| ESLint | `padding-line-between-statements` | return前に空行 |
| Prettier | `singleQuote` | シングルクォート使用 |
| Prettier | `printWidth` | 1行140文字 |
| Prettier | `semi` | セミコロン使用 |
| Stylelint | `custom-property-pattern` | CSS変数の命名規則 |
| Stylelint | `plugin/use-logical-properties-and-values` | 論理プロパティ推奨 |

---

## 💡 ヒント

### コミット前のチェック

```bash
# 自動修正を含む全チェック
pnpm check:fix

# ビルド確認
pnpm build
```

### よくあるエラーと対処法

#### エラー: "interface is not allowed"

```typescript
// ❌ Bad
interface User {
  id: string;
}

// ✅ Good
type User = {
  id: string;
};
```

#### エラー: "Expected blank line before return"

```typescript
// ❌ Bad
const calculate = () => {
  const result = 1 + 2;
  return result;
};

// ✅ Good
const calculate = () => {
  const result = 1 + 2;

  return result;
};
```

#### エラー: "Function declaration is not allowed"

```typescript
// ❌ Bad
function greet(name: string) {
  return `Hello, ${name}`;
}

// ✅ Good
const greet = (name: string) => {
  return `Hello, ${name}`;
};
```

---

## 📋 設定ファイル一覧

| ツール | ファイル名 | 場所 |
|--------|-----------|------|
| ESLint | `eslint.config.mjs` | プロジェクトルート |
| Prettier | `.prettierrc.config.mjs` | プロジェクトルート |
| Stylelint | `stylelint.config.mjs` | プロジェクトルート |

---

## 🔌 使用中のプラグイン

### ESLint

- ✅ **@tanstack/eslint-plugin-query** - TanStack Queryのベストプラクティス
- ✅ **eslint-plugin-storybook** - Storybookストーリーの品質チェック
- ⚠️ **eslint-plugin-tailwindcss** - Tailwind CSS v4対応待ち（一時無効）

### Stylelint

- ✅ **@stylistic/stylelint-plugin** - コードスタイルルール
- ✅ **stylelint-plugin-logical-css** - 論理プロパティの推奨

---

## 🎯 推奨ワークフロー

### 開発時

1. ファイル保存時に自動フォーマット（VS Code設定）
2. 定期的に `pnpm lint` でチェック
3. エラーが出たら `pnpm lint:fix` で自動修正

### コミット前

1. `pnpm check:fix` で全チェック＋自動修正
2. `pnpm build` でビルド確認
3. すべて成功したらコミット

### Pull Request作成前

1. すべてのLintエラーを解消
2. ビルドが成功することを確認
3. 新しいルールを追加した場合はドキュメント更新

---

## 🔗 関連リンク

### 内部ドキュメント

- [コーディング規約](../01-coding-standards/) - プロジェクトのコーディング規約
- [コンポーネント設計](../03-component-design/) - コンポーネント設計ガイド

### 外部リソース

- [ESLint公式ドキュメント](https://eslint.org/)
- [Prettier公式ドキュメント](https://prettier.io/)
- [Stylelint公式ドキュメント](https://stylelint.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)

---

**次のステップ:** [ESLint設定](./01-eslint.md) から始めましょう
