# use フック - Promise、Context、その他の値を読み取る

React 19で導入された`use`フックを使用したPromise、Context、その他の値の読み取りガイドです。

## 目次

- [概要](#概要)
- [Promiseの読み取り](#promiseの読み取り)
- [Next.js 15でのparams活用](#nextjs-15でのparams活用)
- [Contextの読み取り](#contextの読み取り)
- [実装パターン](#実装パターン)
- [ベストプラクティス](#ベストプラクティス)

---

## 概要

### useフックとは

React 19で導入された`use`フックは、Promise、Context、その他の値を読み取るための統一的なAPIです。

**主な機能:**
1. **Promiseの読み取り**: 非同期データの取得
2. **Contextの読み取り**: useContextの代替
3. **条件付き呼び出し可能**: if文の中でも使用可能

**従来のフックとの違い:**

| 機能 | 従来 | React 19 (use) |
|------|------|----------------|
| Promise読み取り | Suspenseのみ | use()で直接読み取り |
| Context読み取り | useContext() | use()で読み取り |
| 条件付き | ❌ 不可 | ✅ 可能 |

---

## Promiseの読み取り

### 基本的な使い方

```typescript
import { use } from 'react';

// Promiseを読み取る
const data = use(promise);
```

**特徴:**
- Promiseが解決されるまでSuspenseで待機
- エラー時はErrorBoundaryでキャッチ
- 条件付きで呼び出し可能

### シンプルな例

```typescript
'use client';

import { use, Suspense } from 'react';

// データフェッチ関数（Promiseを返す）
const fetchUser = async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

const UserProfile = ({ userPromise }: { userPromise: Promise<User> }) => {
  // Promiseを読み取る
  const user = use(userPromise);

  return <div>{user.name}</div>;
};

const Page = ({ params }: { params: { id: string } }) => {
  const userPromise = fetchUser(params.id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
};
```

---

## Next.js 15でのparams活用

### Next.js 15の変更点

Next.js 15では、動的ルートの`params`が`Promise`型になりました。

```typescript
// Next.js 14以前
type PageProps = {
  params: { id: string };
};

// Next.js 15以降
type PageProps = {
  params: Promise<{ id: string }>;
};
```

### useフックでの解決

```typescript
'use client';

import { use } from 'react';

export const useEditUser = (params: Promise<{ id: string }>) => {
  // Promiseを解決してidを取得
  const { id: userId } = use(params);

  // userIdを使用した処理
  const { data } = useUser({ userId });

  return { data, userId };
};
```

**実装例:**
- `src/features/sample-users/routes/sample-edit-user/edit-user.hook.ts`
- `src/features/sample-users/routes/sample-delete-user/delete-user.hook.ts`

---

## 実装パターン

### パターン1: 動的ルートでのパラメータ取得

**完全な実装例:**

```typescript
// src/features/sample-users/routes/sample-edit-user/edit-user.hook.ts
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { use, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateUser } from '@/features/sample-users';
import { useUser } from '@/features/sample-users/api/get-user';
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';

/**
 * ユーザー編集ページのロジックを管理するカスタムフック
 *
 * React 19のuseフックとuseTransitionを使用して、
 * Promise型のparamsの解決とノンブロッキングなページ遷移を実現します。
 */
export const useEditUser = (params: Promise<{ id: string }>) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();

  // 🔑 React 19のuseフックでPromiseを解決
  const { id: userId } = use(params);

  const { data } = useUser({ userId });
  const updateUserMutation = useUpdateUser();
  const [isPending, startTransition] = useTransition();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  });

  // 取得したユーザーデータをフォームの初期値として設定
  useEffect(() => {
    if (data?.data !== null && data?.data !== undefined) {
      reset({
        name: data.data.name,
        email: data.data.email,
        role: data.data.role as 'user' | 'admin',
      });
    }
  }, [data, reset]);

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit(async (formData: UserFormValues) => {
    try {
      await updateUserMutation.mutateAsync({
        userId, // useフックで取得したuserIdを使用
        data: formData,
      });

      startTransition(() => {
        router.push('/sample-users');
      });
    } catch (error) {
      setError('root', {
        message: 'ユーザーの更新に失敗しました',
      });
    }
  });

  const handleCancel = () => {
    startTransition(() => {
      router.push('/sample-users');
    });
  };

  return {
    control,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting: updateUserMutation.isPending || isPending,
  };
};
```

**ページコンポーネント:**

```typescript
// src/app/(sample)/sample-users/[id]/edit/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー編集',
};

export { default } from '@/features/sample-users/routes/sample-edit-user';
```

**フィーチャーコンポーネント:**

```typescript
// src/features/sample-users/routes/sample-edit-user/edit-user.tsx
'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserForm } from '@/features/sample-users/components/user-form';

import { useEditUser } from './edit-user.hook';

const EditUserPageContent = ({ params }: { params: Promise<{ id: string }> }) => {
  // paramsをそのままフックに渡す
  const { control, onSubmit, handleCancel, errors, isSubmitting } = useEditUser(params);

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader title="ユーザー情報編集" />
      <UserForm
        control={control}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        errors={errors}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    </PageLayout>
  );
};

const EditUserPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <EditUserPageContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default EditUserPage;
```

---

### パターン2: 削除確認ページ

```typescript
// src/features/sample-users/routes/sample-delete-user/delete-user.hook.ts
'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';

import { useDeleteUser as useDeleteUserMutation } from '@/features/sample-users';
import { useUser } from '@/features/sample-users/api/get-user';

export const useDeleteUser = (params: Promise<{ id: string }>) => {
  const router = useRouter();

  // 🔑 React 19のuseフックでPromiseを解決
  const { id: userId } = use(params);

  const { data } = useUser({ userId });
  const deleteUserMutation = useDeleteUserMutation();

  const user = data?.data;

  const handleDelete = () => {
    deleteUserMutation
      .mutateAsync(userId)
      .then(() => {
        router.push('/sample-users');
      })
      .catch(() => {
        // エラーハンドリング
      });
  };

  const handleCancel = () => {
    router.push('/sample-users');
  };

  return {
    user,
    handleDelete,
    handleCancel,
    isDeleting: deleteUserMutation.isPending,
  };
};
```

---

### パターン3: 条件付きPromise読み取り

`use`フックは条件付きで呼び出すことができます。

```typescript
'use client';

import { use } from 'react';

const UserProfile = ({
  userPromise,
  shouldFetch,
}: {
  userPromise: Promise<User>;
  shouldFetch: boolean;
}) => {
  // 条件付きでPromiseを読み取る
  const user = shouldFetch ? use(userPromise) : null;

  if (!user) {
    return <div>ユーザー情報はありません</div>;
  }

  return <div>{user.name}</div>;
};
```

**注意**: 従来のフック（useState、useEffectなど）は条件付き呼び出し不可

---

## Contextの読み取り

### useContextの代替

```typescript
import { use } from 'react';

// 従来の方法
import { useContext } from 'react';
const theme = useContext(ThemeContext);

// React 19のuse
const theme = use(ThemeContext);
```

### 条件付きContext読み取り

```typescript
'use client';

import { use } from 'react';

const Component = ({ shouldUseTheme }: { shouldUseTheme: boolean }) => {
  // 条件付きでContextを読み取る
  const theme = shouldUseTheme ? use(ThemeContext) : null;

  return <div>{theme?.color}</div>;
};
```

---

## ベストプラクティス

### 1. paramsの型定義

```typescript
// ✅ Good: Promise型を明示
export const useEditUser = (params: Promise<{ id: string }>) => {
  const { id: userId } = use(params);
  // ...
};

// ❌ Bad: any型
export const useEditUser = (params: any) => {
  const { id: userId } = use(params);
  // ...
};
```

### 2. Suspenseとの組み合わせ

```typescript
// ✅ Good: SuspenseとErrorBoundaryで囲む
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <PageContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
};

// ❌ Bad: Suspenseなし（エラー発生）
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  return <PageContent params={params} />;
};
```

### 3. 分割代入で必要な値だけ取得

```typescript
// ✅ Good: 必要な値だけ取得
const { id: userId } = use(params);

// ❌ Bad: すべて取得してから使用
const allParams = use(params);
const userId = allParams.id;
```

### 4. ドキュメントコメント

```typescript
// ✅ Good: useフックの使用を明記
/**
 * ユーザー編集ページのロジックを管理するカスタムフック
 *
 * React 19のuseフックを使用して、Promise型のparamsを解決します。
 *
 * @param params - Next.js 15のPromise型params
 */
export const useEditUser = (params: Promise<{ id: string }>) => {
  const { id: userId } = use(params);
  // ...
};
```

---

## Next.js 15移行ガイド

### 移行前（Next.js 14）

```typescript
type PageProps = {
  params: { id: string };
};

export default function Page({ params }: PageProps) {
  const userId = params.id; // 同期的に取得
  // ...
}
```

### 移行後（Next.js 15 + React 19）

```typescript
import { use } from 'react';

type PageProps = {
  params: Promise<{ id: string }>; // Promise型に変更
};

export default function Page({ params }: PageProps) {
  const { id: userId } = use(params); // useフックで解決
  // ...
}
```

### カスタムフックでの使用

```typescript
// カスタムフックに移動
export const usePageData = (params: Promise<{ id: string }>) => {
  const { id: userId } = use(params);

  // データ取得やロジック処理
  const { data } = useUser({ userId });

  return { data, userId };
};

// ページコンポーネントで使用
export default function Page({ params }: PageProps) {
  const { data, userId } = usePageData(params);

  return <div>{data?.name}</div>;
}
```

---

## よくある質問

### Q1: useフックとuseEffectの違いは？

**A:** 用途が異なります

- **use**: Promise、Contextの読み取り（同期的）
- **useEffect**: 副作用の実行（非同期的）

```typescript
// use: Promiseを読み取る
const { id } = use(params);

// useEffect: 副作用を実行
useEffect(() => {
  console.log('Component mounted');
}, []);
```

### Q2: すべてのPromiseでuseフックを使うべき？

**A:** いいえ、以下の場合のみ使用します

**使うべき:**
- Next.js 15のparams（Promise型）
- コンポーネントに渡されたPromise
- Context の読み取り

**使うべきでない:**
- データフェッチ → TanStack Query（useSuspenseQuery）
- 副作用 → useEffect
- 状態管理 → useState、useReducer

### Q3: エラーハンドリングはどうする？

**A:** ErrorBoundaryで包む

```typescript
<ErrorBoundary FallbackComponent={MainErrorFallback}>
  <Suspense fallback={<LoadingSpinner />}>
    <ComponentUsingUse />
  </Suspense>
</ErrorBoundary>
```

---

## トラブルシューティング

### 問題1: "Uncaught Error: use() called outside of Suspense"

**原因**: Suspenseで囲んでいない

**解決策**:

```typescript
// ❌ Bad
<ComponentUsingUse />

// ✅ Good
<Suspense fallback={<Loading />}>
  <ComponentUsingUse />
</Suspense>
```

### 問題2: paramsがundefinedになる

**原因**: Next.js 15でparams型が変更されていない

**解決策**:

```typescript
// ❌ Bad: Next.js 14の型
params: { id: string }

// ✅ Good: Next.js 15の型
params: Promise<{ id: string }>
```

### 問題3: 条件付き呼び出しでエラー

**原因**: Promiseが未解決の状態で条件分岐

**解決策**:

```typescript
// ❌ Bad
const data = use(promise);
if (condition) {
  // dataを使用
}

// ✅ Good
if (condition) {
  const data = use(promise);
  // dataを使用
}
```

---

## 参考リソース

- [React 19 - use](https://react.dev/reference/react/use)
- [Next.js 15 - Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [実装例: ユーザー編集](../../features/sample-users/routes/sample-edit-user/edit-user.hook.ts)
- [実装例: ユーザー削除](../../features/sample-users/routes/sample-delete-user/delete-user.hook.ts)

---

## 関連ドキュメント

- [useOptimistic](./01-use-optimistic.md) - 楽観的UI更新
- [useTransition](./02-use-transition.md) - ノンブロッキングな状態更新
- [Next.jsベストプラクティス](../01-coding-standards/04-nextjs-best-practices.md)
- [React/Next.js規約](../01-coding-standards/07-react-nextjs-rules.md)
