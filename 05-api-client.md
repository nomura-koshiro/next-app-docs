# REST API通信の実装

このドキュメントでは、プロジェクトにおけるREST API通信の実装方法を説明します。

## 目次

1. [APIクライアントの設定](#apiクライアントの設定)
2. [認証とトークン管理](#認証とトークン管理)
3. [TanStack Queryとの統合](#tanstack-queryとの統合)
4. [エラーハンドリング](#エラーハンドリング)
5. [API型定義](#api型定義)
6. [実装例](#実装例)
7. [ベストプラクティス](#ベストプラクティス)

---

## APIクライアントの設定

### 基本設定

Axiosを使用してAPIクライアントを作成します。

```typescript
// src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'

// APIレスポンスの基本型
export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

// Axiosインスタンスの作成
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 認証トークンの付与
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiError>) => {
    // エラーハンドリング
    const message = error.response?.data?.message || error.message || 'An error occurred'

    // 401エラー（未認証）の場合
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }

    // 403エラー（権限不足）の場合
    if (error.response?.status === 403) {
      console.error('Permission denied:', message)
    }

    // エラーオブジェクトを整形して返す
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    })
  }
)
```

---

## 認証とトークン管理

### トークンストレージ

認証トークンはZustandで管理し、LocalStorageに永続化します。

```typescript
// src/stores/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  setToken: (token: string | null) => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,

      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem('token', token)
        }
      },

      clearToken: () => {
        set({ token: null })
        localStorage.removeItem('token')
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
```

### ログイン・ログアウト

```typescript
// src/features/auth/api/mutations.ts
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth'

interface LoginInput {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

const login = async (input: LoginInput): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', input)

  return data
}

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token)
    },
  })
}

export const useLogout = () => {
  const clearToken = useAuthStore((state) => state.clearToken)

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout')
    },
    onSuccess: () => {
      clearToken()
    },
  })
}
```

---

## TanStack Queryとの統合

### クエリ（データ取得）

```typescript
// src/features/users/api/queries.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { User } from '../types'

// ユーザー一覧取得
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/users')

  return data
}

export const useUsers = (options?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5分
    ...options,
  })
}

// 特定ユーザー取得
const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${userId}`)

  return data
}

export const useUser = (
  userId: string,
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // userIdが存在する場合のみ実行
    ...options,
  })
}

// クエリパラメータ付き
interface FetchUsersParams {
  page?: number
  limit?: number
  search?: string
}

const fetchUsersWithParams = async (params: FetchUsersParams): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/users', { params })

  return data
}

export const useUsersWithParams = (
  params: FetchUsersParams,
  options?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsersWithParams(params),
    ...options,
  })
}
```

### ミューテーション（データ更新）

```typescript
// src/features/users/api/mutations.ts
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { User } from '../types'

// ユーザー作成
interface CreateUserInput {
  name: string
  email: string
}

const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data } = await apiClient.post<User>('/users', input)

  return data
}

export const useCreateUser = (options?: Omit<UseMutationOptions<User, unknown, CreateUserInput>, 'mutationFn'>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['users'] })

      // または楽観的更新
      // queryClient.setQueryData<User[]>(['users'], (old) => [...(old ?? []), newUser])
    },
    ...options,
  })
}

// ユーザー更新
interface UpdateUserInput {
  id: string
  name?: string
  email?: string
}

const updateUser = async ({ id, ...input }: UpdateUserInput): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/users/${id}`, input)

  return data
}

export const useUpdateUser = (options?: Omit<UseMutationOptions<User, unknown, UpdateUserInput>, 'mutationFn'>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // 特定ユーザーのキャッシュを更新
      queryClient.setQueryData(['users', updatedUser.id], updatedUser)
      // ユーザー一覧も無効化
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    ...options,
  })
}

// ユーザー削除
const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`)
}

export const useDeleteUser = (options?: Omit<UseMutationOptions<void, unknown, string>, 'mutationFn'>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId) => {
      // 削除されたユーザーのキャッシュを削除
      queryClient.removeQueries({ queryKey: ['users', deletedUserId] })
      // ユーザー一覧を無効化
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    ...options,
  })
}
```

---

## エラーハンドリング

### グローバルエラーハンドリング

```typescript
// src/lib/api-client.ts（追加）

// エラー通知用のカスタムフック
export const useApiError = () => {
  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError
      // 通知ライブラリを使用してエラー表示
      console.error('API Error:', apiError.message)
      // toast.error(apiError.message)
    } else {
      console.error('Unexpected error:', error)
    }
  }

  return { handleError }
}
```

### コンポーネントでのエラーハンドリング

```typescript
// src/features/users/components/user-list.tsx
'use client'

import { useUsers } from '../api/queries'

export const UserList = () => {
  const { data: users, isLoading, error, refetch } = useUsers()

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return (
      <div>
        <p>エラーが発生しました: {error.message}</p>
        <button onClick={() => refetch()}>再試行</button>
      </div>
    )
  }

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

---

## API型定義

### レスポンス型の定義

```typescript
// src/types/api.ts

// ページネーション
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// APIレスポンスの共通型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// エラーレスポンス
export interface ApiErrorResponse {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
}
```

### 型安全なAPIクライアント

```typescript
// src/lib/api-client.ts（拡張版）

// 型安全なGETリクエスト
export const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const { data } = await apiClient.get<T>(url, { params })

  return data
}

// 型安全なPOSTリクエスト
export const post = async <T, D = unknown>(url: string, body?: D): Promise<T> => {
  const { data } = await apiClient.post<T>(url, body)

  return data
}

// 型安全なPATCHリクエスト
export const patch = async <T, D = unknown>(url: string, body?: D): Promise<T> => {
  const { data } = await apiClient.patch<T>(url, body)

  return data
}

// 型安全なDELETEリクエスト
export const del = async <T>(url: string): Promise<T> => {
  const { data } = await apiClient.delete<T>(url)

  return data
}
```

---

## 実装例

### 完全な実装例: ユーザー管理

#### 1. 型定義

```typescript
// src/features/users/types/index.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
}
```

#### 2. APIクエリ

```typescript
// src/features/users/api/queries.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { User } from '../types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/users')

  return data
}

export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
  })
}

const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${userId}`)

  return data
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  })
}
```

#### 3. APIミューテーション

```typescript
// src/features/users/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { User, CreateUserInput, UpdateUserInput } from '../types'
import { userKeys } from './queries'

const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data } = await apiClient.post<User>('/users', input)

  return data
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

const updateUser = async (userId: string, input: UpdateUserInput): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/users/${userId}`, input)

  return data
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateUserInput }) =>
      updateUser(userId, input),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`)
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedUserId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
```

#### 4. コンポーネントでの使用

```typescript
// src/features/users/components/user-list.tsx
'use client'

import { useUsers, useDeleteUser } from '../api'

export const UserList = () => {
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const handleDelete = async (userId: string) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await deleteUser.mutateAsync(userId)
        alert('削除しました')
      } catch (error) {
        alert('削除に失敗しました')
      }
    }
  }

  if (isLoading) return <div>読み込み中...</div>

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleDelete(user.id)}>削除</button>
        </li>
      ))}
    </ul>
  )
}
```

---

## ベストプラクティス

### 1. クエリキーの管理

```typescript
// ✅ Good: クエリキーを一箇所で管理
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}

// ❌ Bad: クエリキーをハードコード
useQuery({ queryKey: ['users'], ... })
useQuery({ queryKey: ['users', 'list'], ... })
```

### 2. 型の再利用

```typescript
// ✅ Good: 入力と出力で型を分ける
interface User {
  id: string
  name: string
  email: string
}

interface CreateUserInput {
  name: string
  email: string
  password: string
}

// ❌ Bad: 同じ型を使い回す
interface User {
  id?: string // CRUDで共用するために全てoptional
  name?: string
  email?: string
}
```

### 3. エラーハンドリング

```typescript
// ✅ Good: try-catchで適切にエラー処理
const handleSubmit = async (data: CreateUserInput) => {
  try {
    await createUser.mutateAsync(data)
    toast.success('作成しました')
  } catch (error) {
    toast.error('作成に失敗しました')
  }
}

// ❌ Bad: エラーを無視
const handleSubmit = (data: CreateUserInput) => {
  createUser.mutate(data)
}
```

### 4. キャッシュの最適化

```typescript
// ✅ Good: 適切なstaleTime設定
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // よく変わるデータは短く
})

useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: 30 * 60 * 1000, // あまり変わらないデータは長く
})
```

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[プロジェクト構成](./02-project-structure.md)** - APIファイルの配置場所
- **[使用ライブラリ一覧](./03-libraries.md)** - Axios, TanStack Queryの説明
- **[状態管理戦略](./04-state-management.md)** - サーバーステートの管理

### 外部リンク

- [Axios公式ドキュメント](https://axios-http.com/)
- [TanStack Query公式ドキュメント](https://tanstack.com/query/latest)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
