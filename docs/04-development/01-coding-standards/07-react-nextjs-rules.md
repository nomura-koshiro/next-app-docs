# React/Next.js規約

React 19とNext.js 15を使用した開発における規約について説明します。

## 目次

1. [Reactのimportは不要](#1-reactのimportは不要)
2. [Props型定義（type使用）](#2-props型定義type使用)
3. [Server/Client Components](#3-serverclient-components)

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

**例外: Reactの機能を直接使用する場合のみimport**

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

## 3. Server/Client Components

### Server Component（デフォルト）

デフォルトではServer Componentとして実装します。

```typescript
// ✅ Server Component（デフォルト）
// 'use client' ディレクティブなし

export const UserList = async () => {
  const users = await fetchUsers();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

**Server Componentの特徴:**

- 非同期コンポーネントにできる（`async/await`が使える）
- サーバーでのみ実行される
- クライアントにJavaScriptを送信しない
- データベースや外部APIに直接アクセスできる
- 状態管理やブラウザAPIは使用できない

### Client Component（必要な場合のみ）

状態管理やブラウザAPIが必要な場合のみClient Componentにします。

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

### Server/Client Componentの組み合わせ

```typescript
// ✅ Server Component（親）
export const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await fetchUser(id);

  return (
    <div>
      <h1>{user.name}</h1>
      {/* Client Componentを子として配置 */}
      <UserEditForm user={user} />
    </div>
  );
};

// ✅ Client Component（子）
'use client';

type UserEditFormProps = {
  user: User;
};

export const UserEditForm = ({ user }: UserEditFormProps) => {
  const [formData, setFormData] = useState(user);

  return <form>...</form>;
};
```

### Client Componentは可能な限り下位に配置

```typescript
// ❌ Bad: ページ全体をClient Component化
'use client';

export default function Page() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <Header />
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <UserList />
      <Footer />
    </div>
  );
}

// ✅ Good: 状態が必要な部分のみClient Component化
export default function Page() {
  return (
    <div>
      <Header />
      <SearchInput /> {/* Client Component */}
      <UserList />
      <Footer />
    </div>
  );
}

'use client';

const SearchInput = () => {
  const [search, setSearch] = useState('');

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
};
```

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
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
