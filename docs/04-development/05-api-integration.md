# API統合

本ドキュメントでは、REST API通信の実装パターンとTanStack Queryを使用したデータフェッチングについて説明します。API関数、クエリオプション、カスタムフックの3つのパートに分けた実装方法を解説します。

## 目次

1. [基本パターン](#基本パターン)
2. [データ取得（Query）](#データ取得query)
3. [データ更新（Mutation）](#データ更新mutation)
4. [ベストプラクティス](#ベストプラクティス)
5. [エラーハンドリング](#エラーハンドリング)

---

## 基本パターン

API関数は以下の3つのパートで構成します。

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
export const useUsers = ({ queryConfig }: { queryConfig?: QueryConfig<typeof getUsersQueryOptions> } = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  })
}
```

---

## データ取得（Query）

### 基本的な取得

```typescript
// src/features/users/api/get-users.ts
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/users')
}

export const getUsersQueryOptions = () => ({
  queryKey: ['users'],
  queryFn: getUsers,
})

export const useUsers = () => {
  return useQuery({
    ...getUsersQueryOptions(),
  })
}
```

### パラメータ付き取得

```typescript
// src/features/users/api/get-user.ts
export const getUser = (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`)
}

export const getUserQueryOptions = (userId: string) => ({
  queryKey: ['users', userId],
  queryFn: () => getUser(userId),
})

export const useUser = ({ userId }: { userId: string }) => {
  return useQuery({
    ...getUserQueryOptions(userId),
    enabled: !!userId,  // userIdが存在する場合のみ実行
  })
}
```

### コンポーネントでの使用

```typescript
'use client'

import { useUsers } from '@/features/users/api/get-users'

export const UserList = () => {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラー: {error.message}</div>

  return (
    <ul>
      {data?.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

---

## データ更新（Mutation）

### 作成

```typescript
// src/features/users/api/create-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'
import type { User, CreateUserInput } from '../types'

export const createUser = (data: CreateUserInput): Promise<User> => {
  return api.post('/users', data)
}

export const useCreateUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createUser>
} = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: createUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onSuccess?.(...args)
    },
    ...restConfig,
  })
}
```

### 更新

```typescript
// src/features/users/api/update-user.ts
export const updateUser = ({
  userId,
  data,
}: {
  userId: string
  data: UpdateUserInput
}): Promise<User> => {
  return api.patch(`/users/${userId}`, data)
}

export const useUpdateUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateUser>
} = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser, ...args) => {
      queryClient.setQueryData(['users', updatedUser.id], updatedUser)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onSuccess?.(updatedUser, ...args)
    },
    ...restConfig,
  })
}
```

### 削除

```typescript
// src/features/users/api/delete-user.ts
export const deleteUser = (userId: string): Promise<void> => {
  return api.delete(`/users/${userId}`)
}

export const useDeleteUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteUser>
} = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId, ...args) => {
      queryClient.removeQueries({ queryKey: ['users', deletedUserId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onSuccess?.(_, deletedUserId, ...args)
    },
    ...restConfig,
  })
}
```

### コンポーネントでの使用

```typescript
'use client'

import { useCreateUser } from '@/features/users/api/create-user'

export const CreateUserForm = () => {
  const createUser = useCreateUser()

  const handleSubmit = async (data: CreateUserInput) => {
    try {
      await createUser.mutateAsync(data)
      alert('作成しました')
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## ベストプラクティス

### ✅ Good

```typescript
// API関数、クエリオプション、カスタムフックを分離
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/users')
}

export const getUsersQueryOptions = () => ({
  queryKey: ['users'],
  queryFn: getUsers,
})

export const useUsers = () => {
  return useQuery({
    ...getUsersQueryOptions(),
  })
}
```

### ❌ Bad

```typescript
// すべてを1つの関数に詰め込む
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      return res.json()
    },
  })
}
```

---

## エラーハンドリング

### グローバルエラー処理

```typescript
// src/lib/api-client.ts
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message

    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`)
    }

    return Promise.reject(error)
  }
)
```

### コンポーネントでのエラー処理

```typescript
const { data, isLoading, error, refetch } = useUsers()

if (error) {
  return (
    <div>
      <p>エラーが発生しました: {error.message}</p>
      <button onClick={() => refetch()}>再試行</button>
    </div>
  )
}
```

---

## 参考リンク

- [TanStack Query公式](https://tanstack.com/query/latest)
- [APIクライアント](../03-core-concepts/06-api-client.md)
- [TanStack Query設定](../03-core-concepts/07-tanstack-query.md)
