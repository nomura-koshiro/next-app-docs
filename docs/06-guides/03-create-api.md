# API関数作成手順(TanStack Query)

このガイドでは、TanStack Queryを使用した新しいAPI関数の作成手順を説明します。データ取得(Query)とデータ更新(Mutation)の両方のパターンを網羅し、キャッシュ管理の最適な方法まで解説します。

## 目次

1. [作成するもの](#作成するもの)
2. [パターン1: データ取得(Query)](#パターン1-データ取得query)
3. [パターン2: データ作成(Mutation - POST)](#パターン2-データ作成mutation---post)
4. [パターン3: データ更新(Mutation - PATCH)](#パターン3-データ更新mutation---patch)
5. [パターン4: データ削除(Mutation - DELETE)](#パターン4-データ削除mutation---delete)
6. [ステップ2: index.tsでエクスポート](#ステップ2-indextsでエクスポート)
7. [ステップ3: コンポーネントで使用](#ステップ3-コンポーネントで使用)
8. [チェックリスト](#チェックリスト)
9. [Tips](#tips)

---

## 📋 作成するもの

- API関数(Query または Mutation)
- queryOptions(Queryの場合)
- カスタムフック

---

## パターン1: データ取得(Query)

### ステップ1: API関数ファイルを作成

#### 一覧取得

```typescript
// src/features/users/api/get-users.ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/tanstack-query'
import type { User } from '../types'

// 1. API関数
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/users')
}

// 2. クエリオプション
export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

// 3. カスタムフック
type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>
}

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  })
}
```

#### 個別取得

```typescript
// src/features/users/api/get-user.ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/tanstack-query'
import type { User } from '../types'

// 1. API関数
export const getUser = (userId: string): Promise<{ data: User }> => {
  return api.get(`/users/${userId}`)
}

// 2. クエリオプション
export const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  })
}

// 3. カスタムフック
type UseUserOptions = {
  userId: string
  queryConfig?: QueryConfig<typeof getUserQueryOptions>
}

export const useUser = ({ userId, queryConfig }: UseUserOptions) => {
  return useQuery({
    ...getUserQueryOptions(userId),
    enabled: !!userId, // userIdが存在する場合のみ実行
    ...queryConfig,
  })
}
```

---

## パターン2: データ作成(Mutation - POST)

```typescript
// src/features/users/api/create-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'
import type { User } from '../types'

// 入力型定義
export type CreateUserInput = {
  name: string
  email: string
}

// 1. API関数
export const createUser = (data: CreateUserInput): Promise<{ data: User }> => {
  return api.post('/users', data)
}

// 2. カスタムフック
type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>
}

export const useCreateUser = ({ mutationConfig }: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data, ...args) => {
      // ユーザーリストのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onSuccess?.(data, ...args)
    },
    ...restConfig,
  })
}
```

---

## パターン3: データ更新(Mutation - PATCH)

```typescript
// src/features/users/api/update-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'
import type { User } from '../types'

// 入力型定義
export type UpdateUserInput = {
  name?: string
  email?: string
}

// 1. API関数
export const updateUser = ({
  userId,
  data,
}: {
  userId: string
  data: UpdateUserInput
}): Promise<{ data: User }> => {
  return api.patch(`/users/${userId}`, data)
}

// 2. カスタムフック
type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>
}

export const useUpdateUser = ({ mutationConfig }: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (response, variables, ...args) => {
      const updatedUser = response.data

      // 個別ユーザーのキャッシュを更新
      queryClient.setQueryData(['users', updatedUser.id], updatedUser)

      // ユーザーリストのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['users'] })

      onSuccess?.(response, variables, ...args)
    },
    ...restConfig,
  })
}
```

---

## パターン4: データ削除(Mutation - DELETE)

```typescript
// src/features/users/api/delete-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'

// 1. API関数
export const deleteUser = (userId: string): Promise<void> => {
  return api.delete(`/users/${userId}`)
}

// 2. カスタムフック
type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>
}

export const useDeleteUser = ({ mutationConfig }: UseDeleteUserOptions = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, deletedUserId, ...args) => {
      // 削除されたユーザーのキャッシュを削除
      queryClient.removeQueries({ queryKey: ['users', deletedUserId] })

      // ユーザーリストのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['users'] })

      onSuccess?.(data, deletedUserId, ...args)
    },
    ...restConfig,
  })
}
```

---

## ステップ2: index.tsでエクスポート

```typescript
// src/features/users/api/index.ts
export * from './get-users'
export * from './get-user'
export * from './create-user'
export * from './update-user'
export * from './delete-user'
```

---

## ステップ3: コンポーネントで使用

### Query(データ取得)の使用

```typescript
// src/features/users/routes/users/users.tsx
'use client'

import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { useUsers } from './users.hook'

export default function UsersPage() {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error.message} fullScreen />

  return (
    <div>
      <h1>ユーザー一覧</h1>
      <ul>
        {data?.data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

```typescript
// src/features/users/routes/users/users.hook.ts
import { useUsers as useUsersQuery } from '@/features/users/api/get-users'

export const useUsers = () => {
  const usersQuery = useUsersQuery()

  return {
    data: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
  }
}
```

### Mutation(データ作成)の使用

```typescript
// src/features/users/routes/new-user/new-user.tsx
'use client'

import { UserForm } from '@/features/users/components/user-form'
import { useNewUser } from './new-user.hook'

export default function NewUserPage() {
  const { handleSubmit, isPending } = useNewUser()

  return <UserForm onSubmit={handleSubmit} isSubmitting={isPending} />
}
```

```typescript
// src/features/users/routes/new-user/new-user.hook.ts
import { useRouter } from 'next/navigation'
import { useCreateUser, type CreateUserInput } from '@/features/users/api/create-user'

export const useNewUser = () => {
  const router = useRouter()
  const createUser = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        router.push('/users')
      },
    },
  })

  const handleSubmit = async (data: CreateUserInput) => {
    try {
      await createUser.mutateAsync(data)
    } catch (error) {
      // エラーハンドリング
    }
  }

  return {
    handleSubmit,
    isPending: createUser.isPending,
  }
}
```

---

## 🎯 チェックリスト

### Query(データ取得)

- [ ] API関数を作成(`getXxx`)
- [ ] queryOptionsを作成(`getXxxQueryOptions`)
- [ ] カスタムフックを作成(`useXxx`)
- [ ] `queryKey`を適切に設定
  - [ ] 一覧: `['resource']`
  - [ ] 個別: `['resource', id]`
- [ ] 型定義を追加
- [ ] `index.ts`でエクスポート

### Mutation(データ更新)

- [ ] API関数を作成(`createXxx`, `updateXxx`, `deleteXxx`)
- [ ] 入力型を定義(`CreateXxxInput`, `UpdateXxxInput`)
- [ ] カスタムフックを作成(`useCreateXxx`, `useUpdateXxx`, `useDeleteXxx`)
- [ ] `onSuccess`でキャッシュを更新
  - [ ] `invalidateQueries`: リストを再取得
  - [ ] `setQueryData`: 個別データを直接更新
  - [ ] `removeQueries`: 削除されたデータのキャッシュを削除
- [ ] `index.ts`でエクスポート

---

## 💡 Tips

### queryKeyの命名規則

| パターン | queryKey | 例 |
|---------|----------|---|
| **リスト** | `[resource]` | `['users']` |
| **個別** | `[resource, id]` | `['users', '123']` |
| **フィルター付き** | `[resource, filter]` | `['users', { status: 'active' }]` |
| **ネスト** | `[parent, parentId, child]` | `['users', '123', 'posts']` |

### キャッシュ更新戦略

| 操作 | 推奨方法 | 理由 |
|------|---------|------|
| **作成** | `invalidateQueries` | リストに新しい項目を追加 |
| **更新** | `setQueryData` + `invalidateQueries` | 即座に反映 + リストも更新 |
| **削除** | `removeQueries` + `invalidateQueries` | キャッシュ削除 + リスト更新 |

### エラーハンドリング

```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      // グローバルエラーハンドリング
      console.error('Failed to create user:', error)
    },
  })
}
```

---

## 参考リンク

- [API統合](../04-development/05-api-integration.md)
- [TanStack Query](../03-core-concepts/07-tanstack-query.md)
- [APIクライアント](../03-core-concepts/06-api-client.md)
