# コーディング規約

## 基本原則

### 1. 型安全性の確保

```typescript
// ❌ Bad
export const fetchData = async (id: any) => {
  return await api.get(`/data/${id}`)
}

// ✅ Good
export const fetchData = async (id: string): Promise<DataResponse> => {
  return await api.get<DataResponse>(`/data/${id}`)
}
```

### 2. 単一責任の原則

各関数・コンポーネントは1つの責任のみを持つ。

### 3. typeのみ使用（interface禁止）

```typescript
// ✅ Good
type User = {
  id: string
  name: string
}

// ❌ Bad: interfaceは使用禁止
interface User {
  id: string
  name: string
}
```

---

## 命名規則

| タイプ | 形式 | 例 |
|--------|------|---|
| **コンポーネント** | kebab-case | `user-form.tsx` |
| **フック** | kebab-case, `use-`プレフィックス | `use-users.ts` |
| **ストア** | kebab-case, `-store`サフィックス | `auth-store.ts` |
| **API** | kebab-case | `get-users.ts` |

```typescript
// ファイル名: user-form.tsx
export const UserForm = () => { ... }

// ファイル名: use-users.ts
export const useUsers = () => { ... }
```

---

## TypeScript規約

### 1. エクスポート関数は型を明示

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

### 2. Nullish coalescing演算子

```typescript
// ✅ Good
const userName = user?.name ?? 'ゲスト'

// ❌ Bad
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
```

### 2. Props型定義（type使用）

```typescript
// ✅ Good
type UserFormProps = {
  user: User
  onSubmit: (data: UserFormData) => void
}

export const UserForm = ({ user, onSubmit }: UserFormProps) => {
  return <form>...</form>
}
```

### 3. Server/Client Components

```typescript
// ✅ Server Component（デフォルト）
export const UserList = async () => {
  const users = await fetchUsers()
  return <div>{users.map(...)}</div>
}

// ✅ Client Component（必要な場合のみ）
'use client'

export const UserForm = () => {
  const [data, setData] = useState<FormData>()
  return <form>...</form>
}
```

---

## ESLint主要ルール

### 1. `@typescript-eslint/consistent-type-definitions`

interfaceを禁止し、typeの使用を強制。

### 2. `prefer-arrow-callback` / `func-style`

```typescript
// ❌ Bad
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Good
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### 3. `padding-line-between-statements`

return文の前に空行を必須。

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

---

## Prettier設定

| 設定項目 | 値 |
|---------|---|
| `printWidth` | `140` |
| `tabWidth` | `2` |
| `semi` | `true` |
| `singleQuote` | `true` |
| `trailingComma` | `"es5"` |

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

### 推奨フロー

**コミット前:**

```bash
# すべてのチェックと自動修正を実行
pnpm check:fix

# ビルド確認
pnpm build
```

---

## VSCode設定

### 必要な拡張機能

| 拡張機能 | ID |
|---------|---|
| **ESLint** | `dbaeumer.vscode-eslint` |
| **Prettier** | `esbenp.prettier-vscode` |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` |

### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## 参考リンク

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
