# コーディング規約

本プロジェクトで使用しているコーディング規約、コード品質管理ツール（ESLint、Prettier）の設定と使用方法について説明します。

## 目次

1. [基本原則](#基本原則)
2. [命名規則](#命名規則)
3. [TypeScript規約](#typescript規約)
4. [React/Next.js規約](#reactnextjs規約)
5. [スタイリング規約](#スタイリング規約)
6. [ESLint設定](#eslint設定)
7. [Prettier設定](#prettier設定)
8. [StyleLint設定](#stylelint設定)
9. [コマンド一覧](#コマンド一覧)
10. [VSCode統合](#vscode統合)

---

## 基本原則

### 1. 型安全性の確保

```typescript
// ❌ Bad: any型の使用
export const fetchData = async (id: any) => {
  return await api.get(`/data/${id}`)
}

// ✅ Good: 明示的な型定義
export const fetchData = async (id: string): Promise<DataResponse> => {
  return await api.get<DataResponse>(`/data/${id}`)
}
```

### 2. 単一責任の原則

各関数・コンポーネントは1つの責任のみを持つ。

```typescript
// ❌ Bad: 複数の責任を持つ
export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchUser()
    fetchPosts()
  }, [])

  // ユーザー情報と投稿の両方を管理
}

// ✅ Good: 責任を分離
export const UserProfile = () => {
  return (
    <>
      <UserInfo />
      <UserPosts />
    </>
  )
}
```

### 3. 関心の分離

```typescript
// ✅ ビジネスロジック（hooks）
export const useTrainingData = (id: string) => {
  return useQuery({
    queryKey: ['training', id],
    queryFn: () => fetchTraining(id),
  })
}

// ✅ プレゼンテーション（components）
export const TrainingDetail = ({ id }: { id: string }) => {
  const { data, isLoading } = useTrainingData(id)

  if (isLoading) return <Spinner />

  return <div>{data?.name}</div>
}
```

---

## 命名規則

### ファイル・ディレクトリ

| タイプ | 形式 | 例 |
|--------|------|------|
| **コンポーネント** | kebab-case | `training-form.tsx` |
| **フック** | kebab-case, `use-`プレフィックス | `use-training.ts` |
| **ストア** | kebab-case, `-store`サフィックス | `auth-store.ts` |
| **ユーティリティ** | kebab-case | `format-date.ts` |
| **型定義** | kebab-case | `training-types.ts` |
| **API** | kebab-case | `queries.ts`, `mutations.ts` |

### 変数・関数

```typescript
// ✅ Good: 明確で意図が伝わる命名
const trainingData = useTraining(id)
const isLoading = useLoadingState()

export const calculateOneRepMax = (weight: number, reps: number): number => {
  return weight * (1 + reps / 30)
}

// ❌ Bad: 不明瞭な命名
const data = useTraining(id)
const flag = useLoadingState()

export const calc = (w: number, r: number): number => {
  return w * (1 + r / 30)
}
```

### コンポーネント

```typescript
// ファイル名: training-form.tsx
export const TrainingForm = () => { ... }

// ファイル名: use-training.ts
export const useTraining = () => { ... }

// ファイル名: auth-store.ts
export const useAuthStore = create(() => { ... })
```

---

## TypeScript規約

### 1. 型定義の明示

```typescript
// ❌ Bad: 型推論に頼りすぎ（export時）
export const getUserData = (id) => {
  return users.find((u) => u.id === id)
}

// ✅ Good: エクスポートする関数は型を明示
export const getUserData = (id: string): User | undefined => {
  return users.find((u) => u.id === id)
}

// ✅ Good: 内部関数は型推論でOK
const internalHelper = (value: number) => {
  return value * 2
}
```

### 2. typeとinterfaceの使い分け

**重要: このプロジェクトではinterfaceの使用を禁止し、typeのみを使用します。**

```typescript
// ✅ Good: typeを使用
type User = {
  id: string
  name: string
}

// ❌ Bad: interfaceは使用禁止
interface User {
  id: string
  name: string
}

// ✅ Good: Union型やIntersection型
type Status = 'active' | 'inactive' | 'pending'
type UserWithRole = User & { role: string }
```

### 3. ジェネリクスの活用

```typescript
// ✅ Good: 再利用可能な型定義
export const useFetch = <T>(url: string) => {
  return useQuery<T>({
    queryKey: [url],
    queryFn: () => api.get<T>(url),
  })
}

// 使用例
const { data } = useFetch<User>('/api/users/1')
```

### 4. 厳密なnullチェック

```typescript
// ✅ Good: Nullish coalescing演算子の使用
const userName = user?.name ?? 'ゲスト'

// ✅ Good: Optional chainingの使用
const email = user?.profile?.email

// ❌ Bad: 古いnullチェック
const userName = user && user.name ? user.name : 'ゲスト'
```

---

## React/Next.js規約

### 1. Reactのimportは不要

```typescript
// ✅ Good: Next.js 15の新JSX変換
export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>
}

// ❌ Bad: Reactをimport（不要）
import React from 'react'

export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>
}
```

### 2. Props型定義

```typescript
// ✅ Good: 明示的なProps型定義（typeを使用）
type TrainingFormProps = {
  training: Training
  onSubmit: (data: TrainingFormData) => void
}

export const TrainingForm = ({ training, onSubmit }: TrainingFormProps): JSX.Element => {
  return <form>...</form>
}

// ❌ Bad: interfaceの使用（禁止）
interface TrainingFormProps {
  training: Training
  onSubmit: (data: TrainingFormData) => void
}

// ❌ Bad: インライン型定義（複雑な場合）
export const TrainingForm = ({
  training,
  onSubmit
}: {
  training: Training
  onSubmit: (data: TrainingFormData) => void
}) => {
  return <form>...</form>
}
```

### 3. forwardRefの使用

```typescript
// ✅ Good: 再利用可能なコンポーネント（typeを使用）
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('rounded border', className)}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
```

### 4. Hooksの順序

```typescript
// ✅ Good: Hooksは常に同じ順序で呼び出す
export const TrainingPage = () => {
  // 1. State hooks
  const [isOpen, setIsOpen] = useState(false)

  // 2. Context hooks
  const { user } = useAuth()

  // 3. Custom hooks
  const { data, isLoading } = useTraining(id)

  // 4. Effects
  useEffect(() => {
    // ...
  }, [])

  return <div>...</div>
}
```

### 5. Server ComponentsとClient Components

```typescript
// ✅ Good: Server Component（デフォルト）
export const TrainingList = async () => {
  const trainings = await fetchTrainings()

  return <div>{trainings.map(...)}</div>
}

// ✅ Good: Client Component（必要な場合のみ）
'use client'

export const TrainingForm = () => {
  const [data, setData] = useState<FormData>()

  return <form>...</form>
}
```

---

## スタイリング規約

### 1. Tailwind CSSクラスの順序

```typescript
// ✅ Good: 論理的な順序（レイアウト → サイズ → スタイル → 状態）
<div className="flex items-center justify-between w-full rounded-lg bg-white p-4 shadow-md hover:shadow-lg">

// ❌ Bad: ランダムな順序
<div className="p-4 bg-white flex shadow-md w-full rounded-lg items-center hover:shadow-lg justify-between">
```

### 2. CVAの活用

```typescript
// ✅ Good: バリアント管理
import { cva } from 'class-variance-authority'

const buttonVariants = cva('rounded font-semibold transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
```

### 3. カスタムカラーの定義

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* ブランドカラー */
  --color-brand-primary: hsl(220 91% 63%);
  --color-brand-secondary: hsl(160 84% 39%);

  /* 筋肉部位別カラー */
  --color-muscle-chest: hsl(220 70% 50%);
  --color-muscle-back: hsl(160 70% 50%);
  --color-muscle-legs: hsl(280 70% 50%);
}
```

---

## ESLint設定

### 設定ファイル

`eslint.config.mjs`にフラット設定形式（ESLint v9）を使用しています。

### 主要ルール

#### 1. `@typescript-eslint/consistent-type-definitions`

interfaceを禁止し、typeの使用を強制します。

```typescript
// ❌ Bad: interfaceは使用禁止
interface User {
  id: string
  name: string
}

// ✅ Good: typeを使用
type User = {
  id: string
  name: string
}
```

#### 2. `prefer-arrow-callback` / `func-style`

アロー関数の使用を強制します。

```typescript
// ❌ Bad: function宣言
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Good: アロー関数
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Bad: functionキーワードのコールバック
items.map(function (item) {
  return item.price
})

// ✅ Good: アロー関数のコールバック
items.map((item) => item.price)
```

#### 3. `padding-line-between-statements`

return文の前に空行を必須にする。

```typescript
// ❌ Bad
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return total
}

// ✅ Good
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return total
}
```

#### 4. `@typescript-eslint/explicit-module-boundary-types`

エクスポートする関数・変数は型を明示必須。

```typescript
// ❌ Bad
export const getUserData = (id) => {
  return users.find((u) => u.id === id)
}

// ✅ Good
export const getUserData = (id: string): User | undefined => {
  return users.find((u) => u.id === id)
}
```

#### 5. `@typescript-eslint/no-unused-vars`

未使用変数を検出（`_`で始まる変数は許可）。

```typescript
// ❌ Bad
const fetchUsers = async () => {
  const response = await api.get('/users')  // responseは使われていない

  return data
}

// ✅ Good: _始まりの変数は許可
const [user, _setUser] = useState<User | null>(null)
```

#### 6. `@typescript-eslint/no-misused-promises`

Promiseの誤用を防ぐ。

```typescript
// ❌ Bad: 非同期関数をvoid型のイベントハンドラに使用
<button onClick={async () => await saveData()}>保存</button>

// ✅ Good: void returnを許可する設定（checksVoidReturn: false）
<button onClick={async () => { await saveData() }}>保存</button>
```

#### 7. `@typescript-eslint/strict-boolean-expressions`

厳格なboolean式を強制。

```typescript
// ❌ Bad: 曖昧な条件式
if (user) {
  console.log(user.name)
}

// ✅ Good: 明示的なnullチェック
if (user !== null && user !== undefined) {
  console.log(user.name)
}

// ✅ Good: オプショナルチェイニング
console.log(user?.name)
```

---

## Prettier設定

### 設定ファイル

`.prettierrc.config.mjs`に設定を記述しています。

### 設定内容

| 設定項目 | 値 | 説明 |
|---------|---|------|
| `printWidth` | `140` | 1行の最大文字数 |
| `tabWidth` | `2` | インデント幅（スペース2つ） |
| `useTabs` | `false` | タブではなくスペースを使用 |
| `semi` | `true` | 文末にセミコロンを付ける |
| `singleQuote` | `true` | シングルクォートを使用 |
| `trailingComma` | `"es5"` | ES5で有効な箇所に末尾カンマ |
| `arrowParens` | `"always"` | アロー関数の引数に常に括弧 |
| `endOfLine` | `"auto"` | 改行コードを自動判定 |

### 整形例

```typescript
// ❌ 整形前
const user={name:"Alice",age:30,email:"alice@example.com"}

const calculateTotal=(items)=>{
const total=items.reduce((sum,item)=>sum+item.price,0)
return total
}

// ✅ Prettierで整形後
const user = { name: 'Alice', age: 30, email: 'alice@example.com' };

const calculateTotal = (items) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return total;
};
```

---

## StyleLint設定

### 設定ファイル

`stylelint.config.mjs`にフラット設定形式を使用しています。

### 主要ルール

#### 1. Tailwind CSS v4対応

Tailwind CSS v4のディレクティブを許可します。

```css
/* ✅ Good: Tailwindディレクティブは許可 */
@import "tailwindcss";

@theme {
  --color-brand-primary: hsl(220 91% 63%);
}

/* ❌ Bad: 未知のat-ruleはエラー */
@unknownrule {
  color: red;
}
```

#### 2. 論理プロパティの推奨

物理プロパティよりも論理プロパティを推奨します。

```css
/* ⚠️ Warning: 物理プロパティ（警告のみ） */
.container {
  margin-left: 1rem;
  margin-right: 1rem;
}

/* ✅ Good: 論理プロパティ */
.container {
  margin-inline: 1rem;
}
```

#### 3. カスタムプロパティの命名規則

カスタムプロパティは特定のプレフィックスで始める必要があります。

```css
/* ✅ Good: 正しい命名規則 */
:root {
  --color-primary: blue;
  --font-heading: 'Inter';
  --spacing-md: 1rem;
  --size-button: 2.5rem;
  --radius-sm: 0.25rem;
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* ❌ Bad: プレフィックスなし */
:root {
  --primary: blue;
  --button-size: 2.5rem;
}
```

#### 4. スタイリスティックルール

コードスタイルの一貫性を保ちます。

```css
/* ✅ Good: 統一されたスタイル */
.button {
  color: #3b82f6;
  background-color: white;
  padding: 0.5rem 1rem;
}

/* ❌ Bad: 不統一なスタイル */
.button{color:#3B82F6;background-color:white;padding:0.5rem 1rem}
```

#### 5. 重複セレクタの禁止

同じセレクタの重複を禁止します。

```css
/* ❌ Bad: 重複セレクタ */
.button {
  color: blue;
}

.container {
  padding: 1rem;
}

.button {
  background: white;
}

/* ✅ Good: セレクタを統合 */
.button {
  color: blue;
  background: white;
}

.container {
  padding: 1rem;
}
```

#### 6. フォント関連ルール

```css
/* ✅ Good: フォント名にクォート */
.text {
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
}

/* ❌ Bad: 重複フォント名 */
.text {
  font-family: 'Inter', sans-serif, 'Inter';
}
```

#### 7. 単位とプロパティの検証

```css
/* ❌ Bad: 未知の単位 */
.box {
  width: 100unknown;
}

/* ❌ Bad: 未知のプロパティ */
.box {
  unknown-property: value;
}

/* ✅ Good */
.box {
  width: 100%;
  display: flex;
}
```

### 設定内容

| カテゴリ | ルール | 説明 |
|---------|--------|------|
| **Tailwind対応** | `at-rule-no-unknown` | `@tailwind`, `@apply`, `@layer`等を許可 |
| **スタイリング** | `@stylistic/indentation` | インデント2スペース |
| **スタイリング** | `@stylistic/string-quotes` | シングルクォート使用 |
| **スタイリング** | `@stylistic/color-hex-case` | 16進数カラーは小文字 |
| **論理プロパティ** | `plugin/use-logical-properties-and-values` | 物理プロパティの使用時に警告 |
| **命名規則** | `custom-property-pattern` | カスタムプロパティは特定のプレフィックス必須 |
| **品質** | `no-duplicate-selectors` | 重複セレクタ禁止 |
| **品質** | `block-no-empty` | 空のブロック禁止 |

---

## コマンド一覧

### 開発時

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# Storybookサーバー起動
npm run storybook
```

### コード品質管理

```bash
# ESLintチェック
npm run lint

# ESLint自動修正
npm run lint:fix

# StyleLintチェック
npm run stylelint

# StyleLint自動修正
npm run stylelint:fix

# Prettierで整形
npm run format

# Prettierチェックのみ（CI用）
npm run format:check
```

### CI用の推奨フロー

```bash
# コミット前に以下を実行することを推奨
npm run format        # コード整形
npm run lint:fix      # ESLintエラー修正
npm run stylelint:fix # StyleLintエラー修正
npm run build         # ビルド確認
```

---

## VSCode統合

### 必要な拡張機能

| 拡張機能 | ID | 用途 |
|---------|---|------|
| **ESLint** | `dbaeumer.vscode-eslint` | リアルタイムでESLintエラーを表示 |
| **Prettier** | `esbenp.prettier-vscode` | 保存時に自動整形 |
| **StyleLint** | `stylelint.vscode-stylelint` | リアルタイムでStyleLintエラーを表示 |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Tailwindクラス補完 |

### VSCode設定

`.vscode/settings.json`に以下を追加：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  },

  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  "stylelint.validate": ["css"],

  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": "explicit"
    }
  },

  "prettier.requireConfig": true,

  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

### 保存時の動作フロー

```
ファイル保存（Ctrl+S）
    ↓
1. ESLintで自動修正（TypeScript/JavaScript）
   - 未使用変数の削除
   - import順序の整理
   - 空行の追加
    ↓
2. StyleLintで自動修正（CSS）
   - インデント調整
   - セレクタ順序の整理
   - 論理プロパティの推奨
    ↓
3. Prettierで整形
   - インデント調整
   - クォート統一
   - セミコロン追加
    ↓
4. ファイル整形
   - 末尾の空白削除
   - ファイル末尾に改行挿入
    ↓
整形完了
```

---

## ベストプラクティス

### 1. コミット前チェック

```bash
# 必ず実行（推奨）
npm run format        # コード整形
npm run lint:fix      # ESLintエラー修正
npm run stylelint:fix # StyleLintエラー修正
npm run build         # ビルド確認
```

### 2. エラーを無視しない

ESLintやStyleLintのエラーは潜在的なバグの可能性があります。必ず修正してからコミットしてください。

**特に重要なルール:**
- **ESLint**
  - `@typescript-eslint/consistent-type-definitions`: interfaceは使用禁止
  - `prefer-arrow-callback` / `func-style`: アロー関数を使用
  - `@typescript-eslint/explicit-module-boundary-types`: エクスポート関数は型を明示
  - `@typescript-eslint/strict-boolean-expressions`: 厳格なboolean式
- **StyleLint**
  - `custom-property-pattern`: カスタムプロパティは特定のプレフィックス必須
  - `plugin/use-logical-properties-and-values`: 論理プロパティを推奨

### 3. 保存時の自動修正を活用

VSCode拡張機能をインストールして、手動修正の手間を減らしましょう。

### 4. ルールに疑問があればチームで議論

`eslint.config.mjs`、`.prettierrc.config.mjs`、`stylelint.config.mjs`を修正してプロジェクト全体に適用します。

---

## トラブルシューティング

### ESLintエラー: `Parsing error: Cannot find module`

```bash
# tsconfig.jsonが存在するか確認
ls tsconfig.json
```

### 保存時に自動整形されない

1. `Ctrl+Shift+X`で拡張機能タブを開く
2. 「Prettier - Code formatter」をインストール
3. 「ESLint」をインストール
4. 「StyleLint」をインストール
5. VSCodeを再起動

### Windows環境で改行コードが統一されない

`.gitattributes`ファイルをプロジェクトルートに作成：

```
* text=auto eol=lf
```

その後、すべてのファイルを再正規化：

```bash
git rm --cached -r .
git reset --hard
```

---

## 参考リンク

### 内部ドキュメント

- [プロジェクト構造](../02-architecture/01-project-structure.md)
- [技術スタック](../03-core-concepts/01-tech-stack.md)
- [コンポーネント設計](../04-implementation/01-component-design.md)

### 外部リンク

- [ESLint公式ドキュメント](https://eslint.org/docs/latest/)
- [Prettier公式ドキュメント](https://prettier.io/docs/en/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint設定](https://nextjs.org/docs/app/api-reference/config/eslint)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
