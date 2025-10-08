# コード品質管理: ESLint & Prettier

このドキュメントでは、プロジェクトで使用しているコード品質管理ツール（ESLint、Prettier）の設定と使用方法について説明します。

## 目次

1. [なぜESLintとPrettierを使うのか](#なぜeslintとprettierを使うのか)
2. [ESLintとPrettierの違い](#eslintとprettierの違い)
3. [ESLint設定](#eslint設定)
4. [Prettier設定](#prettier設定)
5. [使用方法](#使用方法)
6. [VSCode統合](#vscode統合)
7. [CI/CD統合](#cicd統合)
8. [トラブルシューティング](#トラブルシューティング)

---

## なぜESLintとPrettierを使うのか

### コード品質管理の重要性

```typescript
// ❌ ツールなしのコード（バグの温床）
function getUserData(id) {
  const user = users.find(u => u.id === id)
  if (user) {
    return user
  }
}

// ❓ userがundefinedの場合の処理が抜けている
// ❓ 型定義がない
// ❓ コーディングスタイルが統一されていない
```

```typescript
// ✅ ESLint + Prettier + TypeScriptで管理されたコード
export const getUserData = (id: string): User | null => {
  const user = users.find((u) => u.id === id)

  return user ?? null
}

// ✅ 型安全
// ✅ 一貫したコーディングスタイル
// ✅ バグが起きにくい構造
```

### ESLintとPrettierを使うメリット

| メリット | 説明 |
|---------|------|
| **バグの早期発見** | コードを書いた瞬間に潜在的なバグを検出 |
| **コードの一貫性** | チーム全体で統一されたスタイル |
| **レビュー時間の短縮** | スタイルの議論が不要になる |
| **オンボーディングの高速化** | 新メンバーが既存のコードスタイルを自動で学べる |
| **保守性の向上** | 読みやすく、理解しやすいコードベース |
| **自動修正** | 多くの問題を自動で修正可能 |

### 具体的な効果

#### 1. バグの早期発見

```typescript
// ❌ ESLintなし: 実行時エラーになるまで気づかない
const fetchData = async () => {
  const data = await api.get('/users')
  // Promiseを返すべきところでreturnし忘れ
}

// ✅ ESLintあり: コード記述時点でエラー表示
// Error: Promises must be awaited, end with a call to .catch, or be explicitly marked as ignored with the `void` operator
```

#### 2. コードの一貫性

```typescript
// ❌ ツールなし: 開発者ごとにスタイルがバラバラ
const user1={name:"Alice",age:30};  // スペースなし、ダブルクォート
const user2 = { name: 'Bob', age: 25 }  // スペースあり、シングルクォート

// ✅ Prettierあり: 保存時に自動整形
const user1 = { name: 'Alice', age: 30 }
const user2 = { name: 'Bob', age: 25 }
```

#### 3. 型安全性の向上

```typescript
// ❌ ESLintなし: エクスポートする関数の型が曖昧
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ ESLintあり: 型を明示必須（`explicit-module-boundary-types`ルール）
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

---

## ESLintとPrettierの違い

### 役割分担

| ツール | 役割 | チェック内容 |
|--------|------|-------------|
| **ESLint** | **コード品質のチェック** | バグ、ロジック、型、セキュリティ、ベストプラクティス |
| **Prettier** | **コードスタイルの統一** | インデント、改行、クォート、セミコロン、括弧の位置 |

### 具体例

```typescript
// ESLintが検出する問題
const data = await fetchData()
console.log(data)  // ❌ ESLint: Promises must be awaited

const result = users.find(u => u.id === id)
if (result === undefined) {}  // ❌ ESLint: Use `!result` instead of `result === undefined`

// Prettierが修正する問題
const obj={a:1,b:2,c:3};  // ❌ Prettier: スペースがない
const obj = { a: 1, b: 2, c: 3 }  // ✅ 自動整形

function foo(){return 42;}  // ❌ Prettier: 改行がない
function foo() {
  return 42
}  // ✅ 自動整形
```

### 連携のしくみ

```
コード記述
    ↓
┌─────────────────────────────────────┐
│ ESLint                              │
│ - バグのチェック                     │
│ - 型のチェック                       │
│ - ベストプラクティス                 │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Prettier                            │
│ - インデント調整                     │
│ - 改行位置調整                       │
│ - クォート統一                       │
└─────────────────────────────────────┘
    ↓
整形されたコード
```

**重要:** ESLintとPrettierのルールが競合しないよう、`eslint-config-prettier`を使用しています。

---

## ESLint設定

### 設定ファイル

**ファイルパス:** `eslint.config.mjs`

### 採用している設定

| 設定 | 説明 |
|------|------|
| `next/core-web-vitals` | Next.jsのCore Web Vitals最適化ルール |
| `next/typescript` | Next.js + TypeScript推奨ルール |
| `prettier` | Prettierとの競合回避（必ず最後に配置） |

### カスタムルール一覧

#### 基本ルール

##### 1. `padding-line-between-statements`
**設定:** `return`文の前に空行を必須にする

**理由:** コードの可読性を向上させ、関数のロジック部分と戻り値を明確に分離する

```typescript
// ❌ Bad: return の前に空行がない
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return total
}

// ✅ Good: return の前に空行がある
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return total
}
```

#### TypeScriptルール

##### 1. `@typescript-eslint/consistent-type-definitions`
**設定:** `off`（型定義の形式を強制しない）

**理由:** `type`と`interface`のどちらでも使用可能。チーム内で柔軟に選択できる

```typescript
// ✅ どちらでもOK
type User = {
  id: string
  name: string
}

interface User {
  id: string
  name: string
}
```

##### 2. `@typescript-eslint/explicit-function-return-type`
**設定:** `off`（関数の戻り値の型を明示しなくてもOK）

**理由:** TypeScriptの型推論に任せて、コードをシンプルに保つ

```typescript
// ✅ Good: 型推論に任せる
const getUser = (id: string) => {
  return users.find((u) => u.id === id)
}

// ✅ Good: 明示的に書いてもOK
const getUser = (id: string): User | undefined => {
  return users.find((u) => u.id === id)
}
```

##### 3. `@typescript-eslint/explicit-module-boundary-types`
**設定:** `error`（エクスポートする関数・変数は型を明示必須）

**理由:** 外部から使用される関数は型を明示することで、APIの契約を明確にする

```typescript
// ❌ Bad: エクスポートする関数の型が不明
export const getUserData = (id) => {
  return users.find((u) => u.id === id)
}

// ✅ Good: 引数と戻り値の型を明示
export const getUserData = (id: string): User | undefined => {
  return users.find((u) => u.id === id)
}

// ⚠️ エクスポートしない関数は型推論でOK
const internalHelper = (value) => {
  return value * 2
}
```

##### 4. `@typescript-eslint/no-misused-promises`
**設定:** `error`（`checksVoidReturn: false`）

**理由:** Promiseの誤用を検出するが、イベントハンドラでの`async`関数は許可

```typescript
// ✅ Good: イベントハンドラでasync関数を使用可能
<button onClick={async () => {
  await saveData()
}}>
  保存
</button>

// ❌ Bad: if文の条件にPromiseを直接使用
if (fetchData()) {  // Error: Promises must be awaited
  // ...
}

// ✅ Good: Promiseをawait
const data = await fetchData()
if (data) {
  // ...
}
```

##### 5. `@typescript-eslint/no-unused-vars`
**設定:** `error`（`_`で始まる変数は許可）

**理由:** 未使用変数を検出して、コードのクリーンさを保つ

```typescript
// ❌ Bad: 未使用変数
const fetchUsers = async () => {
  const response = await api.get('/users')  // responseは使われていない

  return data
}

// ✅ Good: すべての変数を使用
const fetchUsers = async () => {
  const response = await api.get('/users')

  return response.data
}

// ✅ Good: 意図的に無視する場合は _ で始める
const [user, _setUser] = useState<User | null>(null)
```

#### Reactルール

##### 1. `react/react-in-jsx-scope`
**設定:** `off`（ReactをimportしなくてもOK）

**理由:** Next.js 13+の新JSX変換では、Reactのimportが不要

```typescript
// ✅ Good: React をimport しなくてもOK
export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>
}
```

##### 2. `react/prop-types`
**設定:** `off`（Propsの型検証はTypeScriptに任せる）

**理由:** TypeScriptを使っているため、PropTypesは不要

```typescript
// ✅ TypeScriptで型安全性を確保
interface UserCardProps {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>
}
```

#### Importルール

##### 1. `import/order`
**設定:** `error`（import文の並び順を強制）

**理由:** importの並び順を統一して、可読性を向上

**並び順:**

1. `builtin` - Node.js組み込みモジュール（`fs`, `path`など）
2. `external` - `node_modules`のパッケージ（`react`, `next`など）
3. `internal` - プロジェクト内部の絶対パス（`@/components`など）
4. `parent` - 親ディレクトリ（`../`）
5. `sibling` - 同一ディレクトリ（`./`）
6. `object`
7. `index`

**各グループ間に空行を挿入** (`newlines-between: 'always'`)

**アルファベット順にソート** (`alphabetize: { order: 'asc' }`)

```typescript
// ❌ Bad: 順序がバラバラ
import { UserCard } from './user-card'
import { useState } from 'react'
import { api } from '@/lib/api'
import axios from 'axios'

// ✅ Good: グループ分けされ、アルファベット順
// 1. external (node_modules)
import axios from 'axios'
import { useState } from 'react'

// 2. internal (プロジェクト内の絶対パス)
import { api } from '@/lib/api'

// 3. sibling (同一ディレクトリ)
import { UserCard } from './user-card'
```

---

## Prettier設定

### 設定ファイル

**ファイルパス:** `.prettierrc`

このプロジェクトでは、以下のカスタム設定を使用しています。

### プロジェクトの設定内容

| 設定項目 | 値 | 説明 |
|---------|---|------|
| `printWidth` | `140` | 1行の最大文字数 |
| `tabWidth` | `2` | インデント幅（スペース2つ） |
| `useTabs` | `false` | タブではなくスペースを使用 |
| `semi` | `false` | 文末にセミコロンを付けない |
| `singleQuote` | `true` | シングルクォートを使用 |
| `trailingComma` | `"es5"` | ES5で有効な箇所に末尾カンマを付ける |
| `bracketSpacing` | `true` | オブジェクトの括弧内にスペースを入れる |
| `arrowParens` | `"always"` | アロー関数の引数に常に括弧を付ける |

### 整形の具体例

```typescript
// ❌ 整形前
const user={name:"Alice",age:30,email:"alice@example.com"};

function calculateTotal(items){
const total=items.reduce((sum,item)=>sum+item.price,0);
return total;
}

// ✅ Prettierで整形後（プロジェクト設定）
const user = { name: 'Alice', age: 30, email: 'alice@example.com' }

function calculateTotal(items) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return total
}
```

### 設定の変更方法

`.prettierrc`ファイルを編集して、設定を変更できます。

```json
{
  "printWidth": 140,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

## 使用方法

### コマンドライン

#### ESLint

```bash
# コードをチェック（エラーを表示）
pnpm run lint

# コードをチェックして自動修正
pnpm run lint:fix
```

**実行対象:** `src/**/*.{ts,tsx,js,jsx}`

**出力例:**

```
C:\projects\CAMP_front\src\components\user-card.tsx
  12:7  error  Missing return type on function  @typescript-eslint/explicit-module-boundary-types
  15:9  error  Expected blank line before return statement  padding-line-between-statements

✖ 2 problems (2 errors, 0 warnings)
  1 error automatically fixable with the `--fix` option.
```

#### Prettier

```bash
# コードを整形（ファイルを上書き）
pnpm run format

# 整形が必要なファイルをチェックのみ（CI用）
pnpm run format:check
```

**実行対象:** `src/**/*.{ts,tsx,js,jsx,json,css,md}`

**出力例:**

```
Checking formatting...
[warn] src/components/user-card.tsx
[warn] src/utils/helpers.ts
[warn] Code style issues found in 2 files. Run Prettier to fix.
```

### CI用コマンド

```bash
# 型チェック → lint → format → build を連続実行
pnpm run ci
```

このコマンドは以下を順番に実行します：

1. **`pnpm typecheck`** - TypeScriptの型エラーをチェック
2. **`pnpm lint`** - ESLintでコード品質をチェック
3. **`pnpm format:check`** - Prettierでフォーマットをチェック
4. **`pnpm build`** - Next.jsアプリをビルド

すべて成功すればコードは本番環境にデプロイ可能です。

---

## VSCode統合

### 必要な拡張機能

| 拡張機能 | ID | 用途 |
|---------|---|------|
| **ESLint** | `dbaeumer.vscode-eslint` | リアルタイムでESLintエラーを表示 |
| **Prettier** | `esbenp.prettier-vscode` | 保存時に自動整形 |

### インストール方法

1. VSCodeの拡張機能タブを開く（`Ctrl+Shift+X`）
2. 「ESLint」で検索してインストール
3. 「Prettier」で検索してインストール

### VSCode設定（`.vscode/settings.json`）

このプロジェクトには既にVSCode設定が含まれています。

```json
{
  // ========== エディタ設定 ==========
  "editor.formatOnSave": true,  // 保存時に自動整形
  "editor.defaultFormatter": "esbenp.prettier-vscode",  // デフォルトフォーマッター
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"  // 保存時にESLintで自動修正
  },

  // ========== ESLint設定 ==========
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  // ========== Prettier設定 ==========
  "prettier.requireConfig": true,  // 設定ファイルがある場合のみ動作

  // ========== ファイル保存設定 ==========
  "files.eol": "\n",  // 改行コードをLFに統一
  "files.trimTrailingWhitespace": true,  // 末尾の空白を削除
  "files.insertFinalNewline": true  // ファイル末尾に改行を挿入
}
```

### 動作フロー

```
ファイル編集
    ↓
保存（Ctrl+S）
    ↓
┌─────────────────────────────────────┐
│ 1. ESLintで自動修正                  │
│    - 未使用変数の削除                │
│    - import順序の整理                │
│    - 空行の追加など                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. Prettierで整形                    │
│    - インデント調整                  │
│    - クォート統一                    │
│    - セミコロン追加など              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. ファイル整形                      │
│    - 末尾の空白削除                  │
│    - ファイル末尾に改行挿入          │
└─────────────────────────────────────┘
    ↓
整形完了
```

### リアルタイム検出

VSCodeでコードを書くと、リアルタイムで以下のように警告が表示されます。

```typescript
// 赤い波線が表示される
export const getUserData = (id) => {  // ← 型が不明
  return users.find(u => u.id === id)
}

// エラーメッセージ:
// Missing return type on function. @typescript-eslint/explicit-module-boundary-types
```

---

## CI/CD統合

### GitHub Actions での使用例

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Run CI checks
        run: pnpm run ci
```

このワークフローは以下をチェックします：

1. ✅ TypeScriptの型エラーがないか
2. ✅ ESLintのルール違反がないか
3. ✅ Prettierでフォーマットされているか
4. ✅ ビルドが成功するか

**すべて成功すればマージ可能です。**

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. ESLintエラー: `Parsing error: Cannot find module`

**原因:** TypeScriptの設定ファイル（`tsconfig.json`）が見つからない

**解決方法:**

```bash
# プロジェクトルートで実行しているか確認
pwd
# 出力: /c/developments/project/CAMP_front

# tsconfig.jsonが存在するか確認
ls tsconfig.json
```

#### 2. Prettier が動作しない

**原因:** VSCodeの設定で`prettier.requireConfig: true`になっているが、設定ファイルがない

**解決方法:**

プロジェクトルートに`.prettierrc`ファイルを作成：

```json
{}
```

または、`.vscode/settings.json`から`prettier.requireConfig`を削除：

```json
{
  // この行を削除
  // "prettier.requireConfig": true
}
```

#### 3. 保存時に自動整形されない

**原因:** VSCode拡張機能がインストールされていない

**解決方法:**

1. `Ctrl+Shift+X`で拡張機能タブを開く
2. 「Prettier - Code formatter」をインストール
3. 「ESLint」をインストール
4. VSCodeを再起動

#### 4. ESLintとPrettierが競合する

**症状:** ESLintで修正した後、Prettierが元に戻してしまう

**原因:** ESLintとPrettierのルールが競合している

**解決方法:**

`eslint.config.mjs`で`eslint-config-prettier`が最後に配置されているか確認：

```javascript
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // ✅ 必ず最後に配置
  ...compat.extends('prettier'),
]
```

#### 5. `import/order`エラーが自動修正されない

**症状:** ESLintエラーは表示されるが、`pnpm run lint:fix`で修正されない

**原因:** `eslint-plugin-import`のバグまたは設定不足

**解決方法:**

手動でimportを並び替えるか、以下のコマンドを試す：

```bash
# キャッシュを削除してから再実行
rm -rf .eslintcache
pnpm run lint:fix
```

#### 6. Windows環境で改行コードが統一されない

**症状:** Gitで改行コードの差分が大量に表示される

**原因:** WindowsのデフォルトはCRLF、プロジェクトはLFを使用

**解決方法:**

`.gitattributes`ファイルをプロジェクトルートに作成：

```
* text=auto eol=lf
```

その後、すべてのファイルを再正規化：

```bash
git rm --cached -r .
git reset --hard
```

#### 7. パフォーマンスが遅い

**症状:** ファイル保存時に数秒かかる

**原因:** プロジェクトが大きくなり、ESLintの実行に時間がかかる

**解決方法:**

`.vscode/settings.json`でESLintの実行対象を限定：

```json
{
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/build": true
  }
}
```

---

## まとめ

### ESLintとPrettierの役割

| ツール | 役割 | タイミング |
|--------|------|-----------|
| **ESLint** | コード品質のチェック | コード記述時、保存時、コミット前、CI |
| **Prettier** | コードスタイルの統一 | 保存時、コミット前、CI |

### 開発フロー

```
コードを書く
    ↓
保存（Ctrl+S）
    ↓
ESLint + Prettier が自動実行
    ↓
エラーがあれば修正
    ↓
git commit
    ↓
CI で再チェック
    ↓
すべて成功 → マージ
```

### ベストプラクティス

1. **コミット前に必ずチェック**
   ```bash
   pnpm run ci
   ```

2. **VSCode拡張機能を必ずインストール**
   - ESLint
   - Prettier

3. **保存時の自動修正を活用**
   - 手動で修正する必要が減る
   - コードレビューの時間短縮

4. **エラーを無視しない**
   - ESLintエラーは潜在的なバグの可能性
   - 必ず修正してからコミット

5. **ルールに疑問があればチームで議論**
   - `eslint.config.mjs`を修正してプロジェクト全体に適用

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[環境構築ガイド](./01-setup.md)** - 開発環境のセットアップ
- **[プロジェクト構成](./02-project-structure.md)** - ディレクトリ構造
- **[コンポーネント設計原則](./08-component-design.md)** - コード設計のベストプラクティス

### 外部リンク

- [ESLint公式ドキュメント](https://eslint.org/docs/latest/)
- [Prettier公式ドキュメント](https://prettier.io/docs/en/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint設定](https://nextjs.org/docs/app/api-reference/config/eslint)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
