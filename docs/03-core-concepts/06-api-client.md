# APIクライアント (api-client.ts)

Axiosを使用してAPI通信を一元管理します。

## 実装

```typescript
// src/lib/api-client.ts
import Axios, { InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'

// リクエストインターセプター
const authRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (config.headers) {
    config.headers.Accept = 'application/json'
  }
  config.withCredentials = true  // Cookie認証を有効化
  return config
}

// Axiosインスタンス作成
export const api = Axios.create({
  baseURL: env.API_URL,
})

// リクエストインターセプター適用
api.interceptors.request.use(authRequestInterceptor)

// レスポンスインターセプター適用
api.interceptors.response.use(
  (response) => {
    return response.data  // response.dataのみを返す
  },
  (error) => {
    const message = error.response?.data?.message || error.message

    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`)
    }

    return Promise.reject(error)
  }
)
```

---

## インターセプターの役割

### リクエストインターセプター

すべてのリクエストに共通処理を追加します。

```typescript
const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 1. Acceptヘッダーを設定
  config.headers.Accept = 'application/json'

  // 2. Cookie認証を有効化
  config.withCredentials = true

  return config
}
```

### レスポンスインターセプター

すべてのレスポンスに共通処理を追加します。

```typescript
api.interceptors.response.use(
  // 成功時: response.dataのみを返す
  (response) => response.data,

  // エラー時: エラーログを出力
  (error) => {
    const message = error.response?.data?.message || error.message
    console.error(`[API Error] ${message}`)
    return Promise.reject(error)
  }
)
```

**メリット:**

```typescript
// ✅ インターセプター適用後
const users = await api.get<User[]>('/users')
// users は User[] 型

// ❌ インターセプターなし
const response = await api.get<User[]>('/users')
const users = response.data  // 毎回 .data が必要
```

---

## 基本的な使用方法

### GET

```typescript
import { api } from '@/lib/api-client'

type User = {
  id: string
  name: string
  email: string
}

export const getUsers = (): Promise<User[]> => {
  return api.get('/users')
}

export const getUser = (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`)
}
```

### POST

```typescript
type CreateUserInput = {
  name: string
  email: string
}

export const createUser = (data: CreateUserInput): Promise<User> => {
  return api.post('/users', data)
}
```

### PATCH

```typescript
type UpdateUserInput = {
  name?: string
  email?: string
}

export const updateUser = (
  userId: string,
  data: UpdateUserInput
): Promise<User> => {
  return api.patch(`/users/${userId}`, data)
}
```

### DELETE

```typescript
export const deleteUser = (userId: string): Promise<void> => {
  return api.delete(`/users/${userId}`)
}
```

### クエリパラメータ

```typescript
type GetUsersParams = {
  page?: number
  limit?: number
  search?: string
}

export const getUsers = (params: GetUsersParams): Promise<User[]> => {
  return api.get('/users', { params })
}

// 使用例
const users = await getUsers({ page: 1, limit: 10, search: 'John' })
// GET /users?page=1&limit=10&search=John
```

---

## TanStack Queryとの連携

実際のアプリケーションでは、TanStack Queryと組み合わせて使用します。

```typescript
// src/features/users/api/get-users.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

// 1. API関数
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/users')
}

// 2. クエリオプション
export const getUsersQueryOptions = () => ({
  queryKey: ['users'],
  queryFn: getUsers,
})

// 3. カスタムフック
export const useUsers = () => {
  return useQuery({
    ...getUsersQueryOptions(),
  })
}
```

**コンポーネントでの使用:**

```typescript
'use client'

import { useUsers } from '@/features/users/api/get-users'

export const UserList = () => {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラーが発生しました</div>

  return (
    <ul>
      {data?.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

詳しくは [TanStack Query](./07-tanstack-query.md) と [API統合](./08-api-integration.md) を参照してください。

---

## Cookie認証

```typescript
config.withCredentials = true
```

この設定により、リクエスト時に自動的にCookieを送信し、レスポンスの`Set-Cookie`ヘッダーを自動的に保存します。

---

## 参考リンク

- [Axios公式ドキュメント](https://axios-http.com/)
- [TanStack Query](./07-tanstack-query.md)
- [API統合](./08-api-integration.md)
