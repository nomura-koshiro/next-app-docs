# useTransition - ノンブロッキングな状態更新

React 19の`useTransition`フックを使用したノンブロッキングな状態更新のガイドです。

## 目次

- [概要](#概要)
- [基本的な使い方](#基本的な使い方)
- [Next.js App Routerでの活用](#nextjs-app-routerでの活用)
- [実装パターン](#実装パターン)
- [ベストプラクティス](#ベストプラクティス)
- [useOptimisticとの併用](#useoptimisticとの併用)

---

## 概要

### useTransitionとは

`useTransition`は、状態更新を**緊急でない（non-urgent）**ものとしてマークし、より優先度の高い更新がUIをブロックしないようにするReactフックです。

**ユースケース:**
- ページ遷移
- 大量データの処理
- 重い計算処理
- フィルタリング・検索

**メリット:**
- UIが応答性を保つ
- ユーザーがブロックされない
- より滑らかなユーザー体験

---

## 基本的な使い方

### 基本構文

```typescript
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
```

**返り値:**
- `isPending`: トランジション中かどうかを示すboolean
- `startTransition`: トランジションを開始する関数

### シンプルな例

```typescript
'use client';

import { useState, useTransition } from 'react';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (newQuery: string) => {
    // 入力はすぐに反映（緊急）
    setQuery(newQuery);

    // 検索処理はノンブロッキング（非緊急）
    startTransition(() => {
      const filtered = heavySearchOperation(newQuery);
      setResults(filtered);
    });
  };

  return (
    <>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && <p>検索中...</p>}
      <ResultsList results={results} />
    </>
  );
};
```

**動作:**
1. ユーザーが入力 → 即座に入力欄に反映
2. 検索処理はバックグラウンドで実行
3. 検索中でも入力は継続可能

---

## Next.js App Routerでの活用

### パターン1: フォーム送信後のページ遷移

**課題**: フォーム送信後のrouter.pushがUIをブロックする

**解決策**: useTransitionでノンブロッキングに

```typescript
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const useCreateUser = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const createUserMutation = useCreateUser();

  const onSubmit = async (data: UserFormValues) => {
    try {
      // FastAPIにリクエスト送信
      await createUserMutation.mutateAsync(data);

      // 🚀 ノンブロッキングなナビゲーション
      startTransition(() => {
        router.push('/users');
      });
    } catch (error) {
      setError('root', { message: '作成に失敗しました' });
    }
  };

  return {
    onSubmit,
    // MutationとTransitionのpendingを統合
    isSubmitting: createUserMutation.isPending || isPending,
  };
};
```

**実装例:**
- `src/features/sample-users/routes/sample-new-user/new-user.hook.ts`
- `src/features/sample-users/routes/sample-edit-user/edit-user.hook.ts`
- `src/features/sample-auth/routes/sample-login/login.hook.ts`

---

### パターン2: タブ切り替え

```typescript
'use client';

import { useState, useTransition } from 'react';

type Tab = 'overview' | 'details' | 'settings';

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab: Tab) => {
    // タブの切り替えをノンブロッキングに
    startTransition(() => {
      setActiveTab(newTab);
    });
  };

  return { activeTab, handleTabChange, isPending };
};

// 使用例
const TabsComponent = () => {
  const { activeTab, handleTabChange, isPending } = useTabs();

  return (
    <>
      <div>
        <button onClick={() => handleTabChange('overview')}>概要</button>
        <button onClick={() => handleTabChange('details')}>詳細</button>
        <button onClick={() => handleTabChange('settings')}>設定</button>
      </div>

      {isPending && <LoadingIndicator />}

      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'details' && <DetailsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </>
  );
};
```

---

## 実装パターン

### パターン1: フォーム送信 + ナビゲーション

**完全な実装例:**

```typescript
// src/features/sample-users/routes/sample-new-user/new-user.hook.ts
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateUser } from '@/features/sample-users';
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';

export const useNewUser = () => {
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      // FastAPIにユーザー作成リクエスト
      await createUserMutation.mutateAsync(data);

      // 🚀 Non-blocking navigation
      startTransition(() => {
        router.push('/sample-users');
      });
    } catch (error) {
      setError('root', {
        message: 'ユーザーの作成に失敗しました',
      });
    }
  });

  const handleCancel = () => {
    // キャンセル時もuseTransitionを使用
    startTransition(() => {
      router.push('/sample-users');
    });
  };

  return {
    control,
    onSubmit,
    handleCancel,
    errors,
    // Mutationのpending と Transitionのpending を統合
    isSubmitting: createUserMutation.isPending || isPending,
  };
};
```

**UIコンポーネント:**

```typescript
export const NewUserPage = () => {
  const { control, onSubmit, handleCancel, errors, isSubmitting } = useNewUser();

  return (
    <form onSubmit={onSubmit}>
      <UserFormFields control={control} errors={errors} />

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '作成中...' : '作成'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
};
```

---

### パターン2: ログイン後のリダイレクト

```typescript
// src/features/sample-auth/routes/sample-login/login.hook.ts
'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const loginMutation = useLoginMutation();
  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await loginMutation.mutateAsync(values);

      // トークンとユーザー情報を保存
      localStorage.setItem('token', data.token);
      setUser(data.user);

      // 🚀 Non-blocking navigation
      startTransition(() => {
        router.push('/users');
      });
    } catch (error) {
      setError('root', {
        message: 'ログインに失敗しました。',
      });
    }
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending || isPending,
  };
};
```

---

### パターン3: 検索・フィルタリング

```typescript
'use client';

import { useState, useTransition } from 'react';

export const useSearch = <T,>(items: T[], searchFn: (item: T, query: string) => boolean) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (newQuery: string) => {
    // 入力は即座に反映
    setQuery(newQuery);

    // フィルタリングはノンブロッキング
    startTransition(() => {
      const filtered = items.filter((item) => searchFn(item, newQuery));
      setFilteredItems(filtered);
    });
  };

  return {
    query,
    filteredItems,
    handleSearch,
    isPending,
  };
};

// 使用例
const UsersPage = () => {
  const { data } = useUsers();
  const users = data?.data ?? [];

  const { query, filteredItems, handleSearch, isPending } = useSearch(
    users,
    (user, query) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="ユーザーを検索..."
      />
      {isPending && <p>検索中...</p>}
      <UsersList users={filteredItems} />
    </>
  );
};
```

---

## ベストプラクティス

### 1. pending状態の統合

```typescript
// ✅ Good: MutationとTransitionのpendingを統合
const isSubmitting = createUserMutation.isPending || isPending;

return {
  onSubmit,
  isSubmitting, // 1つの状態として返す
};

// ❌ Bad: 別々に返す
return {
  onSubmit,
  isMutating: createUserMutation.isPending,
  isNavigating: isPending,
};
```

### 2. すべてのナビゲーションでstartTransitionを使用

```typescript
// ✅ Good: すべてのナビゲーションをラップ
const handleCancel = () => {
  startTransition(() => {
    router.push('/users');
  });
};

const onSubmit = async (data) => {
  await mutation.mutateAsync(data);
  startTransition(() => {
    router.push('/users');
  });
};

// ❌ Bad: 一部だけラップ
const handleCancel = () => {
  router.push('/users'); // ブロッキング
};
```

### 3. 適切なローディング表示

```typescript
// ✅ Good: pending中に適切なフィードバック
<Button disabled={isSubmitting}>
  {isSubmitting ? '作成中...' : '作成'}
</Button>

// ❌ Bad: フィードバックなし
<Button disabled={isSubmitting}>作成</Button>
```

### 4. エラーハンドリング

```typescript
// ✅ Good: エラーを適切にハンドリング
const onSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data);
    startTransition(() => {
      router.push('/users');
    });
  } catch (error) {
    // エラー時はナビゲーションしない
    setError('root', { message: '操作に失敗しました' });
  }
};

// ❌ Bad: エラーでもナビゲーション
const onSubmit = async (data) => {
  await mutation.mutateAsync(data);
  startTransition(() => {
    router.push('/users');
  });
};
```

---

## useOptimisticとの併用

### 併用パターン

useOptimisticとuseTransitionを組み合わせることで、最高のユーザー体験を実現できます。

```typescript
'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export const useItemsWithBothHooks = () => {
  const router = useRouter();
  const { data } = useItems();
  const createItemMutation = useCreateItem();

  const items = data?.data ?? [];
  const [isPending, startTransition] = useTransition();

  // 楽観的UI更新
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: Item) => [...state, newItem]
  );

  const handleCreate = async (data: CreateItemInput) => {
    const tempItem = { id: `temp-${Date.now()}`, ...data };

    // 🚀 即座にUIに反映（useOptimistic）
    addOptimisticItem(tempItem);

    try {
      await createItemMutation.mutateAsync(data);

      // 🚀 ノンブロッキングなナビゲーション（useTransition）
      startTransition(() => {
        router.push('/items');
      });
    } catch (error) {
      // エラー時: useOptimisticが自動ロールバック
      console.error(error);
    }
  };

  return {
    items: optimisticItems,
    handleCreate,
    isProcessing: createItemMutation.isPending || isPending,
  };
};
```

**効果:**
- データ追加が即座に反映（useOptimistic）
- ページ遷移がスムーズ（useTransition）
- エラー時は自動ロールバック
- ユーザーがブロックされない

---

## よくある質問

### Q1: useTransitionとSuspenseの違いは？

**A:** 用途が異なります

- **useTransition**: 状態更新を非緊急としてマーク（ユーザー操作で使用）
- **Suspense**: 非同期処理の完了を待つ（データ取得で使用）

```typescript
// useTransition: ユーザー操作
const handleClick = () => {
  startTransition(() => {
    setTab('details'); // 非緊急な状態更新
  });
};

// Suspense: データ取得
<Suspense fallback={<Loading />}>
  <UserList /> {/* データ取得を待つ */}
</Suspense>
```

### Q2: すべての状態更新でuseTransitionを使うべき？

**A:** いいえ、以下の場合のみ使用します

- ページ遷移
- 大量データの処理
- 重い計算処理
- ユーザー入力に影響しない更新

**使うべきでない例:**
- フォーム入力値の更新
- モーダルの開閉
- シンプルな状態のトグル

### Q3: Next.js App Routerでは必須？

**A:** 必須ではありませんが、推奨されます

特に以下のケースで効果的：
- フォーム送信後のナビゲーション
- タブ切り替え
- 検索・フィルタリング

---

## 参考リソース

- [React 19 - useTransition](https://react.dev/reference/react/useTransition)
- [Next.js - useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [実装例: ユーザー作成](../../features/sample-users/routes/sample-new-user/new-user.hook.ts)
- [実装例: ログイン](../../features/sample-auth/routes/sample-login/login.hook.ts)

---

## 関連ドキュメント

- [useOptimistic](./01-use-optimistic.md) - 楽観的UI更新
- [useフック](./03-use-hook.md) - Promiseの読み取り
- [Next.jsベストプラクティス](../01-coding-standards/04-nextjs-best-practices.md)
