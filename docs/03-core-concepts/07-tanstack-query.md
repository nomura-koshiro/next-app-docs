# TanStack Query 設定 (tanstack-query.ts)

このドキュメントでは、`src/lib/tanstack-query.ts` の設定と型ユーティリティについて説明します。

> **Note**: 実際のAPI呼び出しの実装方法については [API統合](./08-api-integration.md) を参照してください。

## 目次

1. [概要](#概要)
2. [デフォルト設定](#デフォルト設定)
3. [型ユーティリティ](#型ユーティリティ)
4. [プロバイダー設定](#プロバイダー設定)

---

## 概要

### tanstack-query.tsの役割

`src/lib/tanstack-query.ts` は、TanStack Queryの共通設定と型安全な開発を支援するユーティリティ型を提供します。

| 機能 | 説明 |
|------|------|
| **queryConfig** | アプリ全体で使用するデフォルト設定 |
| **ApiFnReturnType** | API関数の戻り値の型を抽出 |
| **QueryConfig** | クエリオプションの型を生成 |
| **MutationConfig** | Mutationオプションの型を生成 |

---

## デフォルト設定

### queryConfig

```typescript
// src/lib/tanstack-query.ts
import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

/**
 * React Query のデフォルト設定
 *
 * アプリケーション全体で使用されるReact Queryの共通設定を定義します。
 *
 * @property queries.refetchOnWindowFocus - ウィンドウフォーカス時の自動再取得を無効化
 * @property queries.retry - エラー時の自動リトライを無効化
 * @property queries.staleTime - データが古いと判断されるまでの時間（1分）
 */
export const queryConfig = {
  queries: {
    // throwOnError: true,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;
```

### 設定項目の詳細

#### 1. refetchOnWindowFocus

```typescript
refetchOnWindowFocus: false
```

| 設定値 | 動作 |
|--------|------|
| `true` | ブラウザのタブがフォーカスされた時、自動的にデータを再取得 |
| `false` | フォーカス時の自動再取得を無効化（デフォルト） |

**無効化する理由:**
- 不要なAPIリクエストを削減
- ユーザー体験の向上（意図しないローディング状態を防ぐ）

#### 2. retry

```typescript
retry: false
```

| 設定値 | 動作 |
|--------|------|
| `false` | エラー時、リトライしない |
| `true` | エラー時、3回までリトライ |
| `number` | エラー時、指定回数リトライ |

**無効化する理由:**
- エラーを即座に表示し、ユーザーに通知
- 重要なエラーを見逃さない

**必要に応じて個別に有効化:**
```typescript
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  retry: 3,  // このクエリのみリトライ
});
```

#### 3. staleTime

```typescript
staleTime: 1000 * 60  // 1分
```

| 設定値 | 動作 |
|--------|------|
| `0` | 即座にデータが古いと判断（デフォルト） |
| `1000 * 60` | 1分間はデータが新鮮と判断 |
| `Infinity` | データが常に新鮮と判断 |

**1分に設定する理由:**
- 頻繁な再取得を防ぐ
- パフォーマンス向上
- サーバー負荷軽減

---

## 型ユーティリティ

### 1. ApiFnReturnType

API関数の戻り値の型を自動抽出します。

```typescript
/**
 * API関数の戻り値の型を抽出するユーティリティ型
 *
 * @template FnType - Promise を返す関数の型
 * @example
 * ```ts
 * const fetchUser = async (id: string) => { ... }
 * type UserData = ApiFnReturnType<typeof fetchUser>
 * ```
 */
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;
```

#### 使用例

```typescript
// API関数
const fetchUser = async (userId: string): Promise<User> => {
  return api.get(`/users/${userId}`);
};

// 戻り値の型を抽出
type UserData = ApiFnReturnType<typeof fetchUser>;  // User

// 使用
const user: UserData = await fetchUser('123');
```

#### メリット

✅ **DRY原則** - 型を二重定義しない
✅ **保守性** - API関数の戻り値が変わっても自動追従
✅ **型安全** - コンパイル時に型エラーを検出

---

### 2. QueryConfig

クエリフックのオプション型を生成します。

```typescript
/**
 * クエリ設定のユーティリティ型
 *
 * queryKey と queryFn を除いたクエリオプションの型を生成します。
 *
 * @template T - クエリフック関数の型
 */
export type QueryConfig<T extends (...args: any[]) => any> =
  Omit<ReturnType<T>, 'queryKey' | 'queryFn'>;
```

#### 使用例

```typescript
// クエリオプション
export const getUserQueryOptions = (userId: string) => ({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
});

// カスタムフック
export const useUser = (
  userId: string,
  config?: QueryConfig<typeof getUserQueryOptions>
) => {
  return useQuery({
    ...getUserQueryOptions(userId),
    ...config,
  });
};

// 使用
const { data } = useUser('123', {
  staleTime: 5000,    // ✅ OK
  enabled: !!userId,  // ✅ OK
  // queryKey: ['foo']  // ❌ エラー: queryKey は上書き不可
});
```

#### メリット

✅ **型安全なオプション** - 許可されたオプションのみ受け付ける
✅ **queryKey/queryFnの保護** - 重要な設定の上書きを防ぐ

---

### 3. MutationConfig

Mutation関数の型安全なオプションを生成します。

```typescript
/**
 * Mutation設定のユーティリティ型
 *
 * React QueryのuseMutationで使用する型安全な設定オプションを提供します。
 *
 * @template MutationFnType - Promise を返すMutation関数の型
 * @example
 * ```ts
 * const createUser = async (data: CreateUserDTO) => { ... }
 * type CreateUserConfig = MutationConfig<typeof createUser>
 * ```
 */
export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,  // 戻り値の型
    Error,                             // エラーの型
    Parameters<MutationFnType>[0]      // 引数の型
  >;
```

#### 使用例

```typescript
// Mutation関数
type CreateUserInput = {
  name: string;
  email: string;
};

const createUser = async (data: CreateUserInput): Promise<User> => {
  return api.post('/users', data);
};

// Mutationフック
export const useCreateUser = (config?: MutationConfig<typeof createUser>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...config,
  });
};

// 使用
const createUserMutation = useCreateUser({
  onSuccess: (data) => {
    console.log('User created:', data);  // data は User 型
  },
  onError: (error) => {
    console.error('Failed:', error);     // error は Error 型
  },
});

// 実行
createUserMutation.mutate({
  name: 'John',   // ✅ OK
  email: 'john@example.com',  // ✅ OK
  // age: 30      // ❌ エラー: 余分なプロパティ
});
```

#### メリット

✅ **引数の型安全** - mutate() の引数が型チェックされる
✅ **戻り値の型推論** - onSuccess の data が正しく型推論される
✅ **エラー型の明示** - onError の error が Error 型

---

## プロバイダー設定

### QueryClientProviderの設定

```typescript
// src/app/provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryConfig } from '@/lib/tanstack-query';

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

### ReactQueryDevtools

開発環境でTanStack Queryの状態を可視化するツールです。

- **initialIsOpen: false** - デフォルトで閉じた状態
- クエリの状態、キャッシュ、リフェッチのタイミングなどを確認可能
- 本番環境では自動的に無効化

---

## 設定のカスタマイズ

### throwOnError の有効化

クエリエラーをスローする場合:

```typescript
export const queryConfig = {
  queries: {
    throwOnError: true,  // クエリエラーをスロー
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;
```

### gcTime の設定

キャッシュの保持時間を設定する場合:

```typescript
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,  // 5分間キャッシュを保持
  },
} satisfies DefaultOptions;
```

---

## ベストプラクティス

### 1. クエリオプションを分離

```typescript
// ✅ Good: クエリオプションを関数として分離
export const getUsersQueryOptions = () => ({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

export const useUsers = (config?: QueryConfig<typeof getUsersQueryOptions>) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...config,
  });
};

// ❌ Bad: クエリオプションをハードコード
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
```

### 2. 型ユーティリティの活用

```typescript
// ✅ Good: 型を再利用
export type UsersData = ApiFnReturnType<typeof fetchUsers>;

const users: UsersData = await fetchUsers();

// ❌ Bad: 型を二重定義
type UsersData = User[];  // fetchUsers の戻り値と重複
```

### 3. カスタム設定の上書き

```typescript
// ✅ Good: 個別のクエリで設定を上書き
const { data } = useUsers({
  staleTime: 10 * 60 * 1000,  // 10分（デフォルトの1分を上書き）
  retry: 3,                   // 3回リトライ（デフォルトの0を上書き）
});

// ❌ Bad: グローバル設定に依存しすぎる
const { data } = useUsers();  // 常にデフォルト設定
```

---

## 参考リンク

### プロジェクト内ドキュメント

- [API統合](./08-api-integration.md) - 実際のAPI呼び出しの実装方法
- [APIクライアント](./06-api-client.md) - Axiosの設定

### 外部リンク

- [TanStack Query公式ドキュメント](https://tanstack.com/query/latest)
- [Default Options](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [TypeScript](https://tanstack.com/query/latest/docs/react/typescript)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
