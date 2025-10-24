# APIクライアント (api-client.ts)

このドキュメントでは、Axiosを使用したAPIクライアントの実装について説明します。リクエスト/レスポンスインターセプター、Cookie認証、TanStack Queryとの連携など、API通信を一元管理する方法を理解できます。

## 目次

1. [実装](#実装)
2. [インターセプターの役割](#インターセプターの役割)
3. [基本的な使用方法](#基本的な使用方法)
4. [TanStack Queryとの連携](#tanstack-queryとの連携)
5. [Cookie認証](#cookie認証)

---

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

### リクエスト/レスポンスフロー

```mermaid
sequenceDiagram
    participant Comp as Component
    participant ReqInt as Request<br/>Interceptor
    participant Axios as Axios Instance
    participant ResInt as Response<br/>Interceptor
    participant Server as Backend API

    Note over Comp,Server: リクエスト時
    Comp->>Axios: api.get('/users')
    Axios->>ReqInt: リクエスト前処理
    ReqInt->>ReqInt: Accept: application/json<br/>withCredentials: true
    ReqInt->>Server: HTTP Request<br/>(Cookieを自動送信)

    Note over Comp,Server: レスポンス時
    Server-->>ResInt: HTTP Response<br/>(Set-Cookie含む)
    ResInt->>ResInt: response.dataのみ抽出
    ResInt-->>Axios: data返却
    Axios-->>Comp: User[] 型のデータ<br/>(.dataアクセス不要)

    Note over Comp,Server: エラー時
    Server--xResInt: Error Response
    ResInt->>ResInt: エラーメッセージ抽出<br/>console.error出力
    ResInt--xComp: Promise.reject(error)
```

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
  return api.get('/sample/users')
}

export const getUser = (userId: string): Promise<User> => {
  return api.get(`/sample/users/${userId}`)
}
```

### POST

```typescript
type CreateUserInput = {
  name: string
  email: string
}

export const createUser = (data: CreateUserInput): Promise<User> => {
  return api.post('/sample/users', data)
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
  return api.patch(`/sample/users/${userId}`, data)
}
```

### DELETE

```typescript
export const deleteUser = (userId: string): Promise<void> => {
  return api.delete(`/sample/users/${userId}`)
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
  return api.get('/sample/users', { params })
}

// 使用例
const users = await getUsers({ page: 1, limit: 10, search: 'John' })
// GET /sample/users?page=1&limit=10&search=John
```

---

## TanStack Queryとの連携

実際のアプリケーションでは、TanStack Queryと組み合わせて使用します。
bulletproof-reactの構造に従い、React QueryのカスタムフックもAPI層に含めます。

**API層（`api/get-users.ts`）:**

```typescript
// src/features/sample-users/api/get-users.ts
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/tanstack-query'

// 1. API関数
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/sample/users')
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
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  })
}
```

**コンポーネントでの使用（Suspenseパターン）:**

```typescript
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { MainErrorFallback } from '@/components/errors/main'
import { useUsers } from '@/features/sample-users/api/get-users'

// データフェッチを含むコンポーネント
const UserListContent = () => {
  const { data } = useUsers()  // isLoading, error は不要
  const users = data?.data ?? []

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// メインコンポーネント
export const UserList = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <UserListContent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

詳しくは [TanStack Query](./07-tanstack-query.md) と [API統合](../04-development/07-api-integration/index.md) を参照してください。

---

## Cookie認証

```typescript
config.withCredentials = true
```

この設定により、リクエスト時に自動的にCookieを送信し、レスポンスの`Set-Cookie`ヘッダーを自動的に保存します。

### Cookie認証のフロー

```mermaid
sequenceDiagram
    participant Browser as Browser<br/>(Cookie Storage)
    participant Client as API Client<br/>(withCredentials: true)
    participant Server as Backend API

    Note over Browser,Server: 初回ログイン
    Client->>Server: POST /auth/login<br/>{ email, password }
    Server->>Server: 認証処理
    Server-->>Client: Set-Cookie: session=abc123<br/>HttpOnly, Secure
    Client->>Browser: Cookieを自動保存

    Note over Browser,Server: 以降のリクエスト
    Client->>Browser: Cookie取得
    Browser-->>Client: session=abc123
    Client->>Server: GET /api/users<br/>Cookie: session=abc123
    Server->>Server: Cookieから認証確認
    Server-->>Client: ユーザーデータ返却

    Note over Browser,Server: ログアウト
    Client->>Server: POST /auth/logout<br/>Cookie: session=abc123
    Server-->>Client: Set-Cookie: session=; Max-Age=0<br/>Cookieを削除
    Client->>Browser: Cookie削除

    style Browser fill:#ffe0b2,stroke:#e65100,stroke-width:2px,color:#000
    style Client fill:#b3e5fc,stroke:#01579b,stroke-width:2px,color:#000
    style Server fill:#a5d6a7,stroke:#1b5e20,stroke-width:2px,color:#000
```

---

## 参考リンク

- [Axios公式ドキュメント](https://axios-http.com/)
- [TanStack Query](./07-tanstack-query.md)
- [API統合](../04-development/05-api-integration.md)
