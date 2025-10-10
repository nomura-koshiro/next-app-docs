# APIクライアント (api-client.ts)

このドキュメントでは、プロジェクトにおけるAPIクライアントの基本的な実装方法を説明します。

> **Note**: 実際のAPI呼び出しには [TanStack Query](./07-tanstack-query.md) を使用します。このドキュメントでは、その基盤となるAxiosクライアントの設定について説明します。

## 目次

1. [概要](#概要)
2. [実装](#実装)
3. [インターセプター](#インターセプター)
4. [基本的な使用方法](#基本的な使用方法)
5. [TanStack Queryとの連携](#tanstack-queryとの連携)

---

## 概要

### api-client.tsの役割

`src/lib/api-client.ts` は、Axiosを使用してAPIリクエストを一元管理するモジュールです。

| 機能 | 説明 |
|------|------|
| **ベースURL設定** | すべてのリクエストに共通のベースURLを自動付与 |
| **Cookie認証** | `withCredentials: true` でCookieベース認証を有効化 |
| **リクエストインターセプター** | 全リクエストに共通のヘッダーを自動付与 |
| **レスポンスインターセプター** | レスポンスデータの抽出とエラーハンドリング |

---

## 実装

### 完全な実装

```typescript
// src/lib/api-client.ts
import Axios, { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

/**
 * リクエストインターセプター
 * - Accept ヘッダーを設定
 * - Cookie を含むリクエストを有効化
 */
const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;

  return config;
};

/**
 * Axios インスタンスの作成
 * - ベースURL: env.API_URL
 * - Cookie ベース認証を使用
 */
export const api = Axios.create({
  baseURL: env.API_URL,
});

// リクエストインターセプターを適用
api.interceptors.request.use(authRequestInterceptor);

// レスポンスインターセプターを適用
api.interceptors.response.use(
  (response) => {
    // 成功時はレスポンスデータのみを返す
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    // クライアントサイドでエラーログ出力
    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`);
    }

    return Promise.reject(error);
  },
);
```

---

## インターセプター

### リクエストインターセプター

すべてのリクエストに対して共通の処理を行います。

```typescript
const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // 1. Accept ヘッダーの設定
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  // 2. Cookie を含むリクエストを有効化
  config.withCredentials = true;

  return config;
};
```

| 処理 | 説明 |
|------|------|
| **Accept ヘッダー** | JSON形式のレスポンスを要求 |
| **withCredentials** | Cookie を含むリクエストを送信（認証に必要） |

### レスポンスインターセプター

すべてのレスポンスに対して共通の処理を行います。

```typescript
api.interceptors.response.use(
  // 成功時の処理
  (response) => {
    return response.data;  // response.data のみを返す
  },

  // エラー時の処理
  (error) => {
    const message = error.response?.data?.message || error.message;

    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`);
    }

    return Promise.reject(error);
  },
);
```

#### 成功時の処理

通常、Axiosは以下の構造でレスポンスを返します:

```typescript
{
  data: { ... },      // APIレスポンス本体
  status: 200,
  statusText: 'OK',
  headers: { ... },
}
```

レスポンスインターセプターで `response.data` のみを返すことで、以下のようにシンプルに使えます:

```typescript
// ✅ インターセプター適用後
const users = await api.get<User[]>('/users');
// users は User[] 型

// ❌ インターセプターなし
const response = await api.get<User[]>('/users');
const users = response.data;  // 毎回 .data が必要
```

#### エラー時の処理

| 処理 | 説明 |
|------|------|
| **エラーメッセージ抽出** | `error.response?.data?.message` または `error.message` |
| **ログ出力** | クライアントサイドでコンソールにエラー表示 |
| **エラー再スロー** | `Promise.reject(error)` で呼び出し元にエラーを伝播 |

---

## 基本的な使用方法

API関数を作成する際の基本パターンです。

### GET

```typescript
import { api } from '@/lib/api-client';

type User = {
  id: string;
  name: string;
  email: string;
};

export const fetchUsers = async (): Promise<User[]> => {
  return api.get('/users');
};

export const fetchUser = async (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`);
};
```

### POST

```typescript
type CreateUserInput = {
  name: string;
  email: string;
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  return api.post('/users', data);
};
```

### PATCH

```typescript
type UpdateUserInput = {
  name?: string;
  email?: string;
};

export const updateUser = async (userId: string, data: UpdateUserInput): Promise<User> => {
  return api.patch(`/users/${userId}`, data);
};
```

### DELETE

```typescript
export const deleteUser = async (userId: string): Promise<void> => {
  return api.delete(`/users/${userId}`);
};
```

### クエリパラメータ

```typescript
type FetchUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const fetchUsers = async (params: FetchUsersParams): Promise<User[]> => {
  return api.get('/users', { params });
};

// 使用例
const users = await fetchUsers({ page: 1, limit: 10, search: 'John' });
// GET /users?page=1&limit=10&search=John
```

---

## TanStack Queryとの連携

実際のアプリケーションでは、API関数を直接呼び出すのではなく、TanStack Queryのフックを使用します。

### 推奨パターン

```typescript
// src/features/users/api/get-users.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/tanstack-query';

// 1. API関数
export const fetchUsers = async (): Promise<User[]> => {
  return api.get('/users');
};

// 2. クエリオプション
export const getUsersQueryOptions = () => ({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// 3. カスタムフック
export const useUsers = (config?: QueryConfig<typeof getUsersQueryOptions>) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...config,
  });
};
```

### コンポーネントでの使用

```typescript
'use client';

import { useUsers } from '@/features/users/api/get-users';

export const UserList = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

詳しくは [TanStack Query](./07-tanstack-query.md) のドキュメントを参照してください。

---

## Cookie認証について

このプロジェクトでは、Cookie ベースの認証を使用します。

### 設定

```typescript
config.withCredentials = true;
```

この設定により、以下が可能になります:

- **Cookie の自動送信**: リクエスト時に自動的に Cookie を送信
- **Cookie の自動保存**: レスポンスの `Set-Cookie` ヘッダーを自動的に保存

### サーバー側の設定

サーバー側でもCORSの設定が必要です（Express.js の例）:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // Cookie を許可
}));
```

---

## カスタマイズ例

### 認証トークンの追加（Bearer Token）

Cookie認証の代わりにBearerトークンを使用する場合:

```typescript
const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.headers) {
    config.headers.Accept = 'application/json';

    // Authorization ヘッダーを追加
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};
```

### 401エラー時のリダイレクト

認証エラー時にログインページへリダイレクト:

```typescript
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`);

      // 401エラー時、ログインページへリダイレクト
      if (error.response?.status === 401) {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  },
);
```

---

## 参考リンク

### プロジェクト内ドキュメント

- [TanStack Query](./07-tanstack-query.md) - API統合とデータフェッチング
- [環境変数管理](./05-environment-variables.md) - env.API_URLの設定
- [API統合](./08-api-integration.md) - Feature別のAPI実装パターン

### 外部リンク

- [Axios公式ドキュメント](https://axios-http.com/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [bulletproof-react - api-client](https://github.com/alan2207/bulletproof-react)
