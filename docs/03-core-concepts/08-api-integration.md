# REST API通信の実装

このドキュメントでは、プロジェクトにおけるREST API通信の実装方法を説明します。

## 目次

1. [APIクライアントの設定](#apiクライアントの設定)
2. [環境変数の管理](#環境変数の管理)
3. [TanStack Queryとの統合](#tanstack-queryとの統合)
4. [エラーハンドリング](#エラーハンドリング)
5. [API型定義](#api型定義)
6. [実装例](#実装例)
7. [高度な実装パターン](#高度な実装パターン)
8. [ベストプラクティス](#ベストプラクティス)

---

## APIクライアントの設定

### 基本設定

Axiosを使用してAPIクライアントを作成します。

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
      // TODO: 通知システムと統合
    }

    // 401エラー時の処理（将来的にログインページへリダイレクト）
    // if (error.response?.status === 401) {
    //   window.location.href = '/login';
    // }

    return Promise.reject(error);
  },
);
```

### インターセプターの役割

| インターセプター | 役割 |
|---------------|------|
| **リクエスト** | ヘッダー設定、認証トークン付与、Cookie有効化 |
| **レスポンス** | データ抽出（`response.data`）、エラーハンドリング |

---

## 環境変数の管理

### env.tsによる型安全な環境変数

環境変数はZodで検証し、型安全に管理します。

```typescript
// src/config/env.ts
import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
    APP_URL: z.string().optional().default('http://localhost:3000'),
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
  });

  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
```

### .env.localの設定

```bash
# .env.local

# API設定
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# MSW (Mock Service Worker) 設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# アプリケーション設定
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_API_PORT=8080
```

---

## TanStack Queryとの統合

### クエリ（データ取得）

```typescript
// src/features/users/api/queries.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { User } from '../types';

// ユーザー一覧取得
const fetchUsers = async (): Promise<User[]> => {
  return api.get('/users');
};

export const useUsers = (options?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5分
    ...options,
  });
};

// 特定ユーザー取得
const fetchUser = async (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`);
};

export const useUser = (userId: string, options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    ...options,
  });
};

// クエリパラメータ付き
interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

const fetchUsersWithParams = async (params: FetchUsersParams): Promise<User[]> => {
  return api.get('/users', { params });
};

export const useUsersWithParams = (
  params: FetchUsersParams,
  options?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsersWithParams(params),
    ...options,
  });
};
```

### ミューテーション（データ更新）

```typescript
// src/features/users/api/mutations.ts
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { User } from '../types';

// ユーザー作成
interface CreateUserInput {
  name: string;
  email: string;
}

const createUser = async (input: CreateUserInput): Promise<User> => {
  return api.post('/users', input);
};

export const useCreateUser = (
  options?: Omit<UseMutationOptions<User, unknown, CreateUserInput>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};

// ユーザー更新
interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
}

const updateUser = async ({ id, ...input }: UpdateUserInput): Promise<User> => {
  return api.patch(`/users/${id}`, input);
};

export const useUpdateUser = (
  options?: Omit<UseMutationOptions<User, unknown, UpdateUserInput>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};

// ユーザー削除
const deleteUser = async (userId: string): Promise<void> => {
  return api.delete(`/users/${userId}`);
};

export const useDeleteUser = (options?: Omit<UseMutationOptions<void, unknown, string>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId) => {
      queryClient.removeQueries({ queryKey: ['users', deletedUserId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};
```

---

## エラーハンドリング

### グローバルエラーハンドリング

レスポンスインターセプターでグローバルにエラーをハンドリングします。

```typescript
// src/lib/api-client.ts（レスポンスインターセプター）

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    // クライアントサイドでエラー通知
    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`);
      // 将来的に通知システムと統合
      // toast.error(message);
    }

    // 401エラー（未認証）の場合、ログインページへリダイレクト
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);
```

### コンポーネントでのエラーハンドリング

```typescript
// src/features/users/components/user-list.tsx
'use client';

import { useUsers } from '../api/queries';

export const UserList = () => {
  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return (
      <div>
        <p>エラーが発生しました: {error.message}</p>
        <button onClick={() => refetch()}>再試行</button>
      </div>
    );
  }

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

---

## API型定義

### レスポンス型の定義

```typescript
// src/types/api.ts

// ページネーション
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ページネーション付きレスポンス
export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

// APIレスポンスの共通型
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// エラーレスポンス
export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
};
```

---

## 実装例

### 完全な実装例: ユーザー管理

#### 1. 型定義

```typescript
// src/features/users/types/index.ts
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
};
```

#### 2. APIクエリ

```typescript
// src/features/users/api/queries.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { User } from '../types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

const fetchUsers = async (): Promise<User[]> => {
  return api.get('/users');
};

export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
  });
};

const fetchUser = async (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`);
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};
```

#### 3. APIミューテーション

```typescript
// src/features/users/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { User, CreateUserInput, UpdateUserInput } from '../types';
import { userKeys } from './queries';

const createUser = async (input: CreateUserInput): Promise<User> => {
  return api.post('/users', input);
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

const updateUser = async (userId: string, input: UpdateUserInput): Promise<User> => {
  return api.patch(`/users/${userId}`, input);
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateUserInput }) => updateUser(userId, input),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

const deleteUser = async (userId: string): Promise<void> => {
  return api.delete(`/users/${userId}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedUserId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
```

#### 4. コンポーネントでの使用

```typescript
// src/features/users/components/user-list.tsx
'use client';

import { useUsers, useDeleteUser } from '../api';

export const UserList = () => {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();

  const handleDelete = async (userId: string) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await deleteUser.mutateAsync(userId);
        alert('削除しました');
      } catch (error) {
        alert('削除に失敗しました');
      }
    }
  };

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleDelete(user.id)}>削除</button>
        </li>
      ))}
    </ul>
  );
};
```

## 高度な実装パターン

このセクションでは、TanStack Queryを使った高度な実装パターンを紹介します。これらのパターンは、プロジェクトの要件に応じて選択的に適用してください。

### 主要なパターン

1. **条件付きクエリ**: `enabled`オプションを使用し、特定の条件下でのみクエリを実行
2. **依存クエリ**: 前のクエリの結果を使って次のクエリを実行
3. **並列クエリ**: 複数のクエリを同時に実行してパフォーマンスを向上
4. **Optimistic Updates**: サーバーレスポンス前にUIを更新し、UXを改善
5. **無限スクロール**: `useInfiniteQuery`を使用したページネーション実装
6. **キャッシュ戦略**: `setQueryData`や`invalidateQueries`を使った効率的なキャッシュ管理
7. **プリフェッチ**: `prefetchQuery`で次に必要なデータを事前取得
8. **エラーリトライ**: 条件に基づいたリトライロジックのカスタマイズ

詳細な実装例については、[TanStack Query公式ドキュメント](https://tanstack.com/query/latest)を参照してください。

---

## ベストプラクティス

### 1. クエリキーの管理

```typescript
// ✅ Good: クエリキーを一箇所で管理
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// ❌ Bad: クエリキーをハードコード
useQuery({ queryKey: ['users'], ... })
useQuery({ queryKey: ['users', 'list'], ... })
```

### 2. 型の再利用

```typescript
// ✅ Good: 入力と出力で型を分ける
type User = {
  id: string;
  name: string;
  email: string;
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

// ❌ Bad: 同じ型を使い回す
type User = {
  id?: string; // CRUDで共用するために全てoptional
  name?: string;
  email?: string;
};
```

### 3. エラーハンドリング

```typescript
// ✅ Good: try-catchで適切にエラー処理
const handleSubmit = async (data: CreateUserInput) => {
  try {
    await createUser.mutateAsync(data);
    // toast.success('作成しました');
  } catch (error) {
    // toast.error('作成に失敗しました');
  }
};

// ❌ Bad: エラーを無視
const handleSubmit = (data: CreateUserInput) => {
  createUser.mutate(data);
};
```

### 4. キャッシュの最適化

```typescript
// ✅ Good: 適切なstaleTime設定
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // よく変わるデータは短く
});

useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: 30 * 60 * 1000, // あまり変わらないデータは長く
});
```

### 5. インターセプターの活用

```typescript
// ✅ Good: インターセプターで共通処理を一元化
api.interceptors.request.use((config) => {
  // 全リクエストに共通のヘッダーを追加
  config.headers.Accept = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 全エラーで共通のハンドリング
    console.error('[API Error]', error.message);
    return Promise.reject(error);
  },
);
```

---

## 参考リンク

### プロジェクト内ドキュメント

- [TanStack Query設定](./07-tanstack-query.md) - queryConfigと型ユーティリティ
- [APIクライアント](./06-api-client.md) - Axiosの基本設定
- [環境変数管理](./05-environment-variables.md) - env.tsの設定
- [プロジェクト構成](../02-architecture/01-project-structure.md)
- [技術スタック](./01-tech-stack.md)
- [状態管理戦略](./02-state-management.md)

### 外部リンク

- [Axios公式ドキュメント](https://axios-http.com/)
- [TanStack Query公式ドキュメント](https://tanstack.com/query/latest)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
