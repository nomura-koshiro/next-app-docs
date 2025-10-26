# React/Next.js規約

React 19とNext.js 15を使用した開発における規約について説明します。

## 目次

1. [Reactのimportは不要](#1-reactのimportは不要)
2. [Props型定義（type使用）](#2-props型定義type使用)
3. [Client Components（このプロジェクトの方針）](#3-client-componentsこのプロジェクトの方針)
4. [React 19の新機能](#4-react-19の新機能)

---

## 1. Reactのimportは不要

Next.js 15の新JSX変換により、Reactをimportする必要はありません。

```typescript
// ❌ Bad: Reactをimport（不要）
import React from 'react';

export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>;
};

// ✅ Good: Reactのimportなし
export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>;
};
```

### 例外: Reactの機能を直接使用する場合のみimport

```typescript
// ✅ Good: useState, useEffectなどを使用する場合のみimport
import { useState, useEffect } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

---

## 2. Props型定義（type使用）

Propsの型定義には`type`を使用します（`interface`は禁止）。

### 基本的なProps定義

```typescript
// ❌ Bad: interfaceを使用
interface UserFormProps {
  user: User;
  onSubmit: (data: UserFormData) => void;
}

// ✅ Good: typeを使用
type UserFormProps = {
  user: User;
  onSubmit: (data: UserFormData) => void;
};

export const UserForm = ({ user, onSubmit }: UserFormProps) => {
  return <form>...</form>;
};
```

### インラインProps定義

シンプルなコンポーネントの場合、インラインで定義してもOK:

```typescript
// ✅ Good: シンプルな場合はインライン定義
export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>;
};

// ✅ Good: 複雑な場合は別途型定義
type UserCardProps = {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  showActions?: boolean;
};

export const UserCard = ({ user, onEdit, onDelete, showActions = true }: UserCardProps) => {
  return <div>...</div>;
};
```

### children Props

```typescript
// ✅ Good: childrenを含む型定義
type CardProps = {
  title: string;
  children: React.ReactNode;
};

export const Card = ({ title, children }: CardProps) => {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
```

### Generic Props

```typescript
// ✅ Good: ジェネリクスを使用したProps
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
};

export const List = <T,>({ items, renderItem, keyExtractor }: ListProps<T>) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};
```

---

## 3. Client Components（このプロジェクトの方針）

### このプロジェクトでは Client Component のみ使用

**重要**: このプロジェクトは **FastAPI バックエンドと連携**するため、**全てのページを Client Component で実装**します。

Next.js の Server Component は使用せず、TanStack Query を使って FastAPI からデータを取得します。

```typescript
// ✅ このプロジェクトの標準パターン
'use client';

import { useUsers } from '@/features/users/api/get-users';

export const UserList = () => {
  const { data } = useUsers();
  const users = data?.data ?? [];

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

**Client Component での FastAPI 連携:**

- `'use client'` ディレクティブが必須
- TanStack Query でデータフェッチング
- `useParams()` で Next.js 15 の params を取得
- 状態管理（`useState`, `useReducer`）が使える
- イベントハンドラが使える

### Client Component の基本パターン

すべてのページコンポーネントは Client Component として実装します。

```typescript
// ✅ Client Component（必要な場合のみ）
'use client';

import { useState } from 'react';

export const UserForm = () => {
  const [data, setData] = useState<FormData>();

  return <form>...</form>;
};
```

**Client Componentの特徴:**

- `'use client'`ディレクティブが必要
- クライアント（ブラウザ）で実行される
- 状態管理（`useState`, `useReducer`）が使える
- ブラウザAPI（`window`, `document`）にアクセスできる
- イベントハンドラが使える
- 非同期コンポーネントにはできない

### Client Componentが必要なケース

```typescript
// ✅ 状態管理が必要
'use client';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

// ✅ ブラウザAPIが必要
'use client';

export const WindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>Window size: {size.width} x {size.height}</div>;
};

// ✅ イベントハンドラが必要
'use client';

export const SearchInput = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">検索</button>
    </form>
  );
};
```

### Next.js 15 の動的ルート対応

Next.js 15 では params が Promise 型ですが、Client Component では `useParams()` を使用します。

```typescript
// ✅ Client Component で動的パラメータを取得
'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@/features/users/api/get-user';

export const UserEditForm = () => {
  const params = useParams();
  const userId = params.id as string;

  // TanStack Query でデータ取得
  const { data } = useUser({ userId });
  const [formData, setFormData] = useState(data.data);

  return <form>...</form>;
};
```

### 状態管理は最小限の範囲で

このプロジェクトでは全て Client Component ですが、状態管理は必要最小限にとどめます。

```typescript
// ✅ Good: 状態はコンポーネント内で管理
'use client';

export const UserListPage = () => {
  const { data } = useUsers();
  const users = data?.data ?? [];

  return (
    <div>
      <Header />
      <SearchInput /> {/* 検索状態は内部で管理 */}
      <UserList users={users} />
      <Footer />
    </div>
  );
};

// 検索入力は独立したコンポーネントで状態管理
const SearchInput = () => {
  const [search, setSearch] = useState('');

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
};
```

---

## 4. React 19の新機能

React 19では、UXを向上させる新しいフックが追加されました。

### useOptimistic - 楽観的UI更新

サーバーレスポンスを待たずに即座にUIを更新し、エラー時は自動的にロールバックします。

```typescript
'use client';

import { useOptimistic } from 'react';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [optimisticUsers, removeOptimisticUser] = useOptimistic(
    users,
    (state, deletedUserId: string) => state.filter((user) => user.id !== deletedUserId)
  );

  const handleDelete = async (userId: string) => {
    // 🚀 即座にUIから削除
    removeOptimisticUser(userId);

    await deleteUser(userId).catch((error) => {
      // ❌ エラー時: 自動的にロールバック
      alert('削除に失敗しました');
    });
  };

  return (
    <div>
      {optimisticUsers.map((user) => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>削除</button>
        </div>
      ))}
    </div>
  );
};
```

**詳細ドキュメント**: [useOptimistic完全ガイド](../05-custom-hooks/learning/06-react19.md#useoptimistic)

### useTransition - ノンブロッキングなUI更新

画面遷移やタブ切り替えなどの重い処理をノンブロッキングにし、UIの応答性を保ちます。

```typescript
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export const UserForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: FormData) => {
    await saveUser(data);

    // 🚀 ノンブロッキングなページ遷移
    startTransition(() => {
      router.push('/users');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}>
        {isPending ? '保存中...' : '保存'}
      </button>
    </form>
  );
};
```

**詳細ドキュメント**: [useTransition完全ガイド](../05-custom-hooks/learning/06-react19.md#usetransition)

### React 19新機能の使い分け

このプロジェクトでは、React 19の新機能のうち**useOptimisticのみを使用**します。

| 機能 | このプロジェクトでの使用 | 理由 |
|-----|---------|-----|
| `useOptimistic` | ✅ 使用 | 即座のUI反映、体感速度向上 |
| `useTransition` | ❌ 不使用 | Next.js App Routerでは効果が薄い |
| `use()` | ❌ 不使用 | Client Componentでは`useParams()`を使用 |

---

## 追加のベストプラクティス

### 1. コンポーネントの命名

```typescript
// ✅ Good: PascalCaseでエクスポート
export const UserCard = () => {
  return <div>...</div>;
};

// ❌ Bad: キャメルケース
export const userCard = () => {
  return <div>...</div>;
};
```

### 2. key propを常に指定

```typescript
// ❌ Bad: keyがない
{users.map((user) => (
  <div>{user.name}</div>
))}

// ✅ Good: 一意のkeyを指定
{users.map((user) => (
  <div key={user.id}>{user.name}</div>
))}
```

### 3. Fragment使用時の省略記法

```typescript
// ✅ Good: 省略記法
export const UserInfo = () => {
  return (
    <>
      <p>Name</p>
      <p>Email</p>
    </>
  );
};

// ✅ Good: keyが必要な場合は完全な形式
import { Fragment } from 'react';

export const UserList = ({ users }: { users: User[] }) => {
  return (
    <>
      {users.map((user) => (
        <Fragment key={user.id}>
          <dt>{user.name}</dt>
          <dd>{user.email}</dd>
        </Fragment>
      ))}
    </>
  );
};
```

---

## 関連リンク

- [基本原則](./01-basic-principles.md) - typeのみ使用
- [Next.js開発ベストプラクティス](./04-nextjs-best-practices.md) - Next.js固有のベストプラクティス
- [命名規則](./05-naming-conventions.md) - コンポーネントの命名規則
- [useOptimistic完全ガイド](../05-custom-hooks/learning/06-react19.md#useoptimistic) - React 19楽観的UI更新
- [useTransition完全ガイド](../05-custom-hooks/learning/06-react19.md#usetransition) - React 19ノンブロッキング更新
- [use hook完全ガイド](../05-custom-hooks/learning/06-react19.md#use) - React 19 Promise/Context読み取り
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
