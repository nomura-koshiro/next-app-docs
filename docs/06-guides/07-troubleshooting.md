# トラブルシューティング

よくあるエラーと解決方法をまとめています。ビルドエラー、実行時エラー、各種ライブラリのエラーまで、開発中に遭遇する問題の解決方法を網羅しています。

## 目次

1. [ビルド・型エラー](#ビルド型エラー)
2. [React/Next.jsエラー](#reactnextjsエラー)
3. [TanStack Query エラー](#tanstack-query-エラー)
4. [React Hook Form エラー](#react-hook-form-エラー)
5. [MSW(Mock Service Worker)エラー](#mswmock-service-workerエラー)
6. [Zustand エラー](#zustand-エラー)
7. [スタイリング(Tailwind CSS)エラー](#スタイリングtailwind-cssエラー)
8. [パッケージ関連エラー](#パッケージ関連エラー)
9. [パフォーマンス問題](#パフォーマンス問題)
10. [デバッグ方法](#デバッグ方法)
11. [よくある質問](#よくある質問)
12. [参考コマンド](#参考コマンド)

---

## ビルド・型エラー

### ❌ Error: `Type 'X' is not assignable to type 'Y'`

**原因:**

- 型が一致していない

**解決方法:**

```typescript
// ❌ Bad
const user: User = {
  id: 1,        // number だが、User.id は string
  name: 'John',
}

// ✅ Good
const user: User = {
  id: '1',      // string に修正
  name: 'John',
}
```

---

### ❌ Error: `'interface' is not allowed. Use 'type' instead.`

**原因:**

- ESLintルールで `interface` が禁止されている

**解決方法:**

```typescript
// ❌ Bad
interface User {
  id: string
  name: string
}

// ✅ Good
type User = {
  id: string
  name: string
}
```

---

### ❌ Error: `Expected blank line before return statement`

**原因:**

- ESLintルールで `return` 文の前に空行が必須

**解決方法:**

```typescript
// ❌ Bad
export const getUser = (id: string): User => {
  const user = users.find((u) => u.id === id)
  return user
}

// ✅ Good
export const getUser = (id: string): User => {
  const user = users.find((u) => u.id === id)

  return user
}
```

**自動修正:**

```bash
pnpm lint:fix
```

---

### ❌ Error: `Use arrow functions instead of function declarations`

**原因:**

- 関数宣言（`function`）は禁止、アロー関数を使用

**解決方法:**

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

---

## React/Next.jsエラー

### ❌ Error: `You're importing a component that needs useState/useEffect. It only works in a Client Component but none of its parents are marked with "use client"`

**原因:**

- Server Component内で `useState` などのClient専用フックを使用

**解決方法:**

```typescript
// ❌ Bad: Server Component（デフォルト）で useState を使用
export const UserForm = () => {
  const [name, setName] = useState('')  // Error!
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

// ✅ Good: ファイルの先頭に 'use client' を追加
'use client'

export const UserForm = () => {
  const [name, setName] = useState('')
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

---

### ❌ Error: `Hydration failed because the initial UI does not match what was rendered on the server`

**原因:**

- サーバーとクライアントでレンダリング結果が異なる

**よくあるケース:**

1. **`Date.now()` や `Math.random()` を直接使用**

```typescript
// ❌ Bad
export const TimeDisplay = () => {
  return <div>{new Date().toLocaleString()}</div>  // サーバーとクライアで異なる
}

// ✅ Good: useEffect で クライアントのみで実行
'use client'

import { useEffect, useState } from 'react'

export const TimeDisplay = () => {
  const [time, setTime] = useState<string>()

  useEffect(() => {
    setTime(new Date().toLocaleString())
  }, [])

  return <div>{time || '読み込み中...'}</div>
}
```

1. **`localStorage` をServer Componentで使用**

```typescript
// ❌ Bad: Server Component で localStorage
export const UserGreeting = () => {
  const name = localStorage.getItem('userName')  // Error!
  return <div>こんにちは、{name}さん</div>
}

// ✅ Good: Client Component で useEffect 内で使用
'use client'

import { useEffect, useState } from 'react'

export const UserGreeting = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    setName(localStorage.getItem('userName'))
  }, [])

  return <div>こんにちは、{name ?? 'ゲスト'}さん</div>
}
```

---

### ❌ Warning: `Each child in a list should have a unique "key" prop`

**原因:**

- 配列の `map()` で `key` が不足または重複

**解決方法:**

```typescript
// ❌ Bad
{users.map((user) => (
  <div>{user.name}</div>
))}

// ❌ Bad: インデックスをkeyに使う（非推奨）
{users.map((user, index) => (
  <div key={index}>{user.name}</div>
))}

// ✅ Good: ユニークなIDを使用
{users.map((user) => (
  <div key={user.id}>{user.name}</div>
))}
```

---

## TanStack Query エラー

### ❌ Error: `No QueryClient set, use QueryClientProvider to set one`

**原因:**

- `QueryClientProvider` が設定されていない

**解決方法:**

```typescript
// src/app/provider.tsx を確認
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

### ❌ Error: `Cannot destructure property 'data' of 'useQuery(...)' as it is undefined`

**原因:**

- `useQuery` の戻り値を正しく扱っていない

**解決方法:**

```typescript
// ❌ Bad
const { data } = useUsers()
return <div>{data.data.map(...)}</div>  // data が undefined の可能性

// ✅ Good: ローディング・エラー処理を追加
const { data, isLoading, error } = useUsers()

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage message={error.message} />

return <div>{data?.data.map(...)}</div>
```

---

### ❌ Warning: `A query result with a stale time of 0ms is considered stale immediately`

**原因:**

- `staleTime` が設定されていないため、データが即座に古くなる

**解決方法:**

```typescript
// src/lib/tanstack-query.ts で設定
export const queryConfig = {
  queries: {
    staleTime: 1000 * 60, // 1分間キャッシュ
    refetchOnWindowFocus: false,
  },
} satisfies DefaultOptions
```

---

## React Hook Form エラー

### ❌ Error: `Uncaught Error: useForm() should be inside <FormProvider>`

**原因:**

- `useFormContext()` を使っているが `FormProvider` がない

**解決方法:**

```typescript
// ❌ Bad: FormProvider なしで useFormContext
export const FormField = () => {
  const { register } = useFormContext()  // Error!
  return <Input {...register('name')} />
}

// ✅ Good: Controller を使う、または FormProvider を追加
import { Control, Controller } from 'react-hook-form'

type Props = {
  control: Control<FormValues>
}

export const FormField = ({ control }: Props) => {
  return (
    <Controller
      control={control}
      name="name"
      render={({ field }) => <Input {...field} />}
    />
  )
}
```

---

### ❌ Error: `resolver is not a function`

**原因:**

- `@hookform/resolvers` がインストールされていない

**解決方法:**

```bash
pnpm add @hookform/resolvers
```

```typescript
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm({
  resolver: zodResolver(schema),  // これでエラー解消
})
```

---

## MSW（Mock Service Worker）エラー

### ❌ Error: `[MSW] Failed to register a Service Worker`

**原因:**

- `mockServiceWorker.js` が `/public` にない

**解決方法:**

```bash
# MSWワーカーファイルを生成
npx msw init public/ --save
```

**確認:**

```text
public/
└── mockServiceWorker.js  ← これが必要
```

---

### ❌ Warning: `[MSW] Unhandled request: GET /api/v1/users`

**原因:**

- MSWハンドラーが定義されていない

**解決方法:**

```typescript
// src/mocks/handlers/api/v1/user-handlers.ts
import { http, HttpResponse } from 'msw'

export const userHandlers = [
  http.get('/api/v1/users', () => {
    return HttpResponse.json({ data: [] })
  }),
]
```

```typescript
// src/mocks/handlers.ts
import { userHandlers } from './handlers/api/v1/user-handlers'

export const handlers = [
  ...userHandlers,  // ← 追加を忘れずに
]
```

---

### ❌ Error: `Failed to fetch` when using MSW in Storybook

**原因:**

- Storybookの MSW 設定が不足

**解決方法:**

```typescript
// .storybook/preview.tsx
import { initialize, mswLoader } from 'msw-storybook-addon'
import { handlers } from '../src/mocks/handlers'

initialize({
  onUnhandledRequest: 'bypass',
})

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers,
    },
  },
}

export default preview
```

---

## Zustand エラー

### ❌ Error: `Cannot read properties of undefined (reading 'getState')`

**原因:**

- ストアが正しく初期化されていない

**解決方法:**

```typescript
// ❌ Bad
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
)

// ✅ Good: persist の第2引数にオプション
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

---

### ❌ Warning: `localStorage is not defined` in Next.js

**原因:**

- Server Component で `localStorage` を使用

**解決方法:**

```typescript
// ❌ Bad: Server Component で直接 localStorage
export const UserName = () => {
  const name = localStorage.getItem('userName')  // Error!
  return <div>{name}</div>
}

// ✅ Good: Client Component + useEffect
'use client'

import { useEffect, useState } from 'react'

export const UserName = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    setName(localStorage.getItem('userName'))
  }, [])

  return <div>{name}</div>
}
```

---

## スタイリング（Tailwind CSS）エラー

### ❌ Tailwindクラスが効かない

**原因:**

1. `globals.css` で Tailwind をインポートしていない
2. `tailwind.config.ts` の `content` パスが正しくない

**解決方法:**

```css
/* src/styles/globals.css */
@import "tailwindcss";
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',  // ← features も追加
  ],
}

export default config
```

---

### ❌ `cn()` が undefined

**原因:**

- `cn` ユーティリティが定義されていない

**解決方法:**

```typescript
// src/utils/cn.ts を作成
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
```

```bash
# 必要なパッケージをインストール
pnpm add clsx tailwind-merge
```

---

## パッケージ関連エラー

### ❌ Error: `Cannot find module 'X'`

**原因:**

- パッケージがインストールされていない

**解決方法:**

```bash
# node_modules を削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install

# または特定のパッケージを追加
pnpm add パッケージ名
```

---

### ❌ Error: `Peer dependency warning`

**原因:**

- 依存関係のバージョンが合わない

**解決方法:**

```bash
# package.json の依存関係を確認
pnpm why パッケージ名

# 必要なら特定のバージョンをインストール
pnpm add パッケージ名@バージョン
```

---

## パフォーマンス問題

### ❌ ページが遅い、再レンダリングが多い

**チェック項目:**

1. **useQueryの不要な再実行**

```typescript
// ❌ Bad: 毎回クエリキーが変わる
const { data } = useQuery({
  queryKey: ['users', { filter: new Date() }],  // 毎回新しいDate
  queryFn: getUsers,
})

// ✅ Good: クエリキーを安定させる
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
})
```

1. **不要な状態管理**

```typescript
// ❌ Bad: サーバーデータを useState で管理
const [users, setUsers] = useState<User[]>([])
useEffect(() => {
  fetchUsers().then(setUsers)
}, [])

// ✅ Good: TanStack Query を使う
const { data } = useUsers()
```

---

## デバッグ方法

### React Query Devtools を使う

```typescript
// src/app/provider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

→ ブラウザで開発者ツールの右下にReact Queryアイコンが表示される

---

### React Hook Form DevTools を使う

```bash
pnpm add @hookform/devtools
```

```typescript
import { DevTool } from '@hookform/devtools'

export const UserForm = () => {
  const { control } = useForm()

  return (
    <>
      <form>...</form>
      <DevTool control={control} />
    </>
  )
}
```

---

### MSWのログを確認

```typescript
// src/lib/msw.tsx
await worker.start({
  onUnhandledRequest: (req) => {
    console.log('[MSW] Unhandled:', req.method, req.url)  // ← ここでログ確認
  },
})
```

→ ブラウザのコンソールで未処理リクエストを確認

---

## よくある質問

### Q: `pnpm dev` が起動しない

A: ポートが既に使用されている可能性

```bash
# 3000番ポートを使っているプロセスを確認
lsof -i :3000

# プロセスを停止
kill -9 <PID>

# または別のポートで起動
pnpm dev -- -p 3001
```

---

### Q: ビルドは成功するが、`pnpm dev` でエラーになる

A: Turbopack の問題の可能性

```bash
# Turbopack を無効化して起動
pnpm dev --no-turbopack
```

---

### Q: 型エラーは出ないが、実行時エラーになる

A: TypeScript の型チェック

```bash
# 型チェックを実行
pnpm typecheck
```

---

## 参考コマンド

```bash
# すべてのチェック
pnpm check

# すべてのチェック + 自動修正
pnpm check:fix

# 型チェック
pnpm typecheck

# ビルドテスト
pnpm build

# CI と同じチェック
pnpm ci
```

---

## 参考リンク

- [コーディング規約](../04-development/01-coding-standards.md)
- [TanStack Query](../03-core-concepts/07-tanstack-query.md)
- [MSW](../04-development/07-msw.md)
- [フォームとバリデーション](../04-development/04-forms-validation.md)
