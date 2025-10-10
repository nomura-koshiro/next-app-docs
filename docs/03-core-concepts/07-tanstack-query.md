# TanStack Query設定 (tanstack-query.ts)

`src/lib/tanstack-query.ts` の設定と型ユーティリティについて説明します。

## デフォルト設定

```typescript
// src/lib/tanstack-query.ts
import { DefaultOptions } from '@tanstack/react-query'

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,  // フォーカス時の再取得を無効化
    retry: false,                 // エラー時のリトライを無効化
    staleTime: 1000 * 60,         // 1分間はデータが新鮮
  },
} satisfies DefaultOptions
```

### 設定項目の説明

| 設定 | デフォルト値 | 説明 |
|------|-------------|------|
| **refetchOnWindowFocus** | `false` | ブラウザのタブがフォーカスされた時に再取得しない |
| **retry** | `false` | エラー時にリトライしない（即座にエラー表示） |
| **staleTime** | `1000 * 60` | 1分間はキャッシュを使用（パフォーマンス向上） |

---

## 型ユーティリティ

### 1. ApiFnReturnType

API関数の戻り値の型を自動抽出します。

```typescript
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>
```

**使用例:**

```typescript
const getUser = async (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`)
}

// 戻り値の型を抽出
type UserData = ApiFnReturnType<typeof getUser>  // User
```

### 2. QueryConfig

クエリフックのオプション型を生成します。

```typescript
export type QueryConfig<T extends (...args: any[]) => any> =
  Omit<ReturnType<T>, 'queryKey' | 'queryFn'>
```

**使用例:**

```typescript
export const getUserQueryOptions = (userId: string) => ({
  queryKey: ['users', userId],
  queryFn: () => getUser(userId),
})

export const useUser = (
  userId: string,
  config?: QueryConfig<typeof getUserQueryOptions>
) => {
  return useQuery({
    ...getUserQueryOptions(userId),
    ...config,
  })
}

// 使用
const { data } = useUser('123', {
  staleTime: 5000,    // ✅ OK
  enabled: !!userId,  // ✅ OK
  // queryKey: ['foo']  // ❌ エラー: queryKey は上書き不可
})
```

### 3. MutationConfig

Mutation関数の型安全なオプションを生成します。

```typescript
export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,  // 戻り値の型
    Error,                             // エラーの型
    Parameters<MutationFnType>[0]      // 引数の型
  >
```

**使用例:**

```typescript
const createUser = async (data: CreateUserInput): Promise<User> => {
  return api.post('/users', data)
}

export const useCreateUser = (config?: MutationConfig<typeof createUser>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    ...config,
  })
}

// 使用
const createUserMutation = useCreateUser({
  onSuccess: (data) => {
    console.log('User created:', data)  // data は User 型
  },
  onError: (error) => {
    console.error('Failed:', error)     // error は Error 型
  },
})

createUserMutation.mutate({
  name: 'John',
  email: 'john@example.com',
})
```

---

## プロバイダー設定

```typescript
// src/app/provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryConfig } from '@/lib/tanstack-query'

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### ReactQueryDevtools

開発環境でTanStack Queryの状態を可視化するツールです。

- クエリの状態、キャッシュ、リフェッチのタイミングなどを確認可能
- 本番環境では自動的に無効化

---

## 設定のカスタマイズ

### 個別のクエリで設定を上書き

```typescript
const { data } = useUsers({
  staleTime: 10 * 60 * 1000,  // 10分（デフォルトの1分を上書き）
  retry: 3,                   // 3回リトライ（デフォルトの0を上書き）
})
```

### データの種類に応じた設定

```typescript
// 頻繁に更新されるデータ
const { data } = useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0,                   // すぐに古いと判断
  refetchInterval: 30 * 1000,     // 30秒ごとに再取得
})

// あまり変わらないデータ
const { data } = useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: 30 * 60 * 1000,      // 30分間はキャッシュを使用
})
```

---

## 参考リンク

- [TanStack Query公式](https://tanstack.com/query/latest)
- [API統合](./08-api-integration.md)
- [APIクライアント](./06-api-client.md)
