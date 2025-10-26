# Next.js開発ベストプラクティス

Next.js 15 App Routerを使用した開発におけるベストプラクティスを説明します。

## 目次

1. [Server ComponentとClient Componentの使い分け](#1-server-componentとclient-componentの使い分け)
2. [データフェッチングの最適化](#2-データフェッチングの最適化)
3. [キャッシュ戦略の適切な使用](#3-キャッシュ戦略の適切な使用)
4. [ルーティングとナビゲーション](#4-ルーティングとナビゲーション)
5. [画像最適化](#5-画像最適化)
6. [メタデータとSEO](#6-メタデータとseo)
7. [エラーハンドリング](#7-エラーハンドリング)
8. [環境変数の適切な使用](#8-環境変数の適切な使用)
9. [パフォーマンス最適化](#9-パフォーマンス最適化)
10. [型安全性の確保](#10-型安全性の確保)

---

## 1. Server ComponentとClient Componentの使い分け

**原則:** デフォルトはServer Component、必要な場合のみClient Component。

```typescript
// ❌ Bad: 不必要にClient Component化
'use client';

type UserListProps = {
  users: User[];
};

export const UserList = ({ users }: UserListProps) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// ✅ Good: Server Componentとして実装（データフェッチも可能）
type UserListProps = {
  users: User[];
};

export const UserList = ({ users }: UserListProps) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// ✅ Good: 状態が必要な部分のみClient Component化
'use client';

type UserSearchProps = {
  onSearch: (query: string) => void;
};

export const UserSearch = ({ onSearch }: UserSearchProps) => {
  const [query, setQuery] = useState('');

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

**なぜ悪いのか:**

- 不要なJavaScriptがクライアントに送信される
- パフォーマンスが低下する
- サーバーサイドでのデータフェッチができない

**改善方法:**

- デフォルトはServer Component
- 状態管理、イベントハンドラ、ブラウザAPIが必要な場合のみClient Component
- Client Componentは可能な限り下位のコンポーネントに配置

---

## 2. データフェッチングの最適化

> ⚠️ **このプロジェクトでは使用しません**
> このプロジェクトはFastAPIバックエンドを使用するため、Next.jsのServer Componentでのデータフェッチは行いません。
> Client Component + TanStack Queryを使用してFastAPI APIを直接呼び出します。

**原則:** データは可能な限りサーバーで取得する。

```typescript
// ❌ Bad: Client Componentでデータフェッチ
'use client';

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
};

// ✅ Good: Server Componentでデータフェッチ
export const UserProfile = async () => {
  const user = await fetchUser();

  return <div>{user.name}</div>;
};

// ✅ Good: 並列データフェッチ
export const Dashboard = async () => {
  // 並列で実行
  const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()]);

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <CommentList comments={comments} />
    </div>
  );
};
```

**なぜ悪いのか:**

- クライアントサイドでのデータフェッチは遅い
- ローディング状態の管理が複雑
- SEOに不利

**改善方法:**

- Server Componentで`async/await`を使ってデータフェッチ
- 複数のデータフェッチは`Promise.all`で並列化
- キャッシュ戦略を適切に設定

---

## 3. キャッシュ戦略の適切な使用

> ⚠️ **このプロジェクトでは使用しません**
> Next.jsのServer Componentでのキャッシュ戦略は使用しません。
> TanStack Queryのキャッシュ機能を使用します。

**原則:** データの特性に応じてキャッシュ戦略を選択する。

```typescript
// ❌ Bad: キャッシュ設定なし（デフォルトキャッシュに依存）
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://api.example.com/users');

  return res.json();
};

// ✅ Good: 明示的なキャッシュ設定
// 静的データ（変更頻度が低い）
export const fetchStaticData = async (): Promise<Data[]> => {
  const res = await fetch('https://api.example.com/static-data', {
    cache: 'force-cache', // 永続的にキャッシュ
  });

  return res.json();
};

// 動的データ（リアルタイム性が重要）
export const fetchRealtimeData = async (): Promise<Data[]> => {
  const res = await fetch('https://api.example.com/realtime-data', {
    cache: 'no-store', // キャッシュしない
  });

  return res.json();
};

// 定期的に更新されるデータ
export const fetchPeriodicData = async (): Promise<Data[]> => {
  const res = await fetch('https://api.example.com/periodic-data', {
    next: { revalidate: 3600 }, // 1時間ごとに再検証
  });

  return res.json();
};
```

**なぜ悪いのか:**

- デフォルトキャッシュに依存すると予期しない動作が起きる
- データの特性を考慮しないとパフォーマンスやUXが悪化

**改善方法:**

- 静的データは`cache: 'force-cache'`
- 動的データは`cache: 'no-store'`
- 定期更新データは`next: { revalidate: 秒数 }`

---

## 4. ルーティングとナビゲーション

**原則:** App Routerの機能を最大限活用する。

```typescript
// ❌ Bad: window.locationを使った遷移
const navigateToUser = (userId: string) => {
  window.location.href = `/sample-users/${userId}`;
};

// ✅ Good: Next.jsのルーターを使用
'use client';

import { useRouter } from 'next/navigation';

export const UserCard = ({ user }: { user: User }) => {
  const router = useRouter();

  const navigateToUser = () => {
    router.push(`/sample-users/${user.id}`);
  };

  return <button onClick={navigateToUser}>詳細を見る</button>;
};

// ✅ Good: Linkコンポーネントを使用（推奨）
import Link from 'next/link';

export const UserCard = ({ user }: { user: User }) => {
  return (
    <Link href={`/sample-users/${user.id}`} className="button">
      詳細を見る
    </Link>
  );
};
```

**なぜ悪いのか:**

- `window.location`はページ全体がリロードされる
- クライアントサイドナビゲーションの利点が失われる
- プリフェッチが効かない

**改善方法:**

- `<Link>`コンポーネントを優先的に使用
- プログラマティックな遷移が必要な場合は`useRouter`
- `window.location`は外部サイトへの遷移のみに使用

---

## 5. 画像最適化

**原則:** next/imageを常に使用する。

```typescript
// ❌ Bad: imgタグを直接使用
export const UserAvatar = ({ user }: { user: User }) => {
  return <img src={user.avatarUrl} alt={user.name} width={100} height={100} />;
};

// ✅ Good: next/imageを使用
import Image from 'next/image';

export const UserAvatar = ({ user }: { user: User }) => {
  return <Image src={user.avatarUrl} alt={user.name} width={100} height={100} className="rounded-full" />;
};

// ✅ Good: 外部画像の場合はremotePatterns設定
// next.config.js
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}
```

**なぜ悪いのか:**

- 最適化されていない画像はパフォーマンスを低下させる
- レイアウトシフトが発生する
- レスポンシブ対応が手動で必要

**改善方法:**

- `next/image`を常に使用
- `width`と`height`を指定してレイアウトシフトを防ぐ
- 必要に応じて`priority`プロップでプリロード

---

## 6. メタデータとSEO

**原則:** メタデータは静的または動的に適切に設定する。

```typescript
// ❌ Bad: メタデータなし
export default function Page() {
  return <div>コンテンツ</div>;
}

// ✅ Good: 静的メタデータ
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー一覧',
  description: 'すべてのユーザーを表示します',
};

export default function UsersPage() {
  return <div>ユーザー一覧</div>;
}

// ✅ Good: 動的メタデータ
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};



// ✅ Good: サーバーコンポーネントでサーバー専用の環境変数を使用
export const fetchData = async (): Promise<Data> => {
  const apiKey = process.env.SECRET_API_KEY; // サーバーでのみアクセス可能

  const res = await fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  return res.json();
};

// ✅ Good: クライアントで公開する環境変数は NEXT_PUBLIC_ プレフィックス
// .env.local
// NEXT_PUBLIC_API_URL=https://api.example.com

'use client';

export const ApiClient = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // クライアントでアクセス可能

  return <div>API URL: {apiUrl}</div>;
};
```

**なぜ悪いのか:**

- クライアントで機密情報が漏洩する
- クライアントで環境変数が`undefined`になる

**改善方法:**

- 機密情報はサーバーコンポーネントでのみ使用
- クライアントで必要な環境変数は`NEXT_PUBLIC_`プレフィックスを付ける
- 環境変数の型定義を作成する

---

## 9. パフォーマンス最適化

**原則:** パフォーマンスを意識したコードを書く。

```typescript
// ❌ Bad: 不要な再レンダリング
'use client';

export const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild /> {/* countが変わるたびに再レンダリング */}
    </div>
  );
};

// ✅ Good: メモ化で再レンダリングを防ぐ
'use client';

import { memo } from 'react';

const ExpensiveChild = memo(() => {
  // 重い処理
  return <div>Expensive Component</div>;
});

export const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild /> {/* 再レンダリングされない */}
    </div>
  );
};

// ✅ Good: useMemoで計算結果をメモ化
'use client';

import { useMemo } from 'react';

export const DataTable = ({ data }: { data: Item[] }) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <table>
      {sortedData.map((item) => (
        <tr key={item.id}>
          <td>{item.name}</td>
        </tr>
      ))}
    </table>
  );
};
```

**なぜ悪いのか:**

- 不要な再レンダリングはパフォーマンスを低下させる
- 重い計算が毎回実行される

**改善方法:**

- `memo`で不要な再レンダリングを防ぐ
- `useMemo`で計算結果をメモ化
- `useCallback`で関数をメモ化

---

## 10. 型安全性の確保

**原則:** APIレスポンスやフォームデータは厳密に型定義する。

```typescript
// ❌ Bad: any型の使用
export const fetchUsers = async (): Promise<any> => {
  const res = await fetch('/api/users');

  return res.json();
};

// ✅ Good: 明確な型定義
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type ApiResponse<T> = {
  data: T;
  error?: string;
};

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const res = await fetch('/api/users');

  return res.json();
};

// ✅ Good: Zodでランタイム検証と型推論
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('/api/users');
  const data = await res.json();

  return UserSchema.array().parse(data);
};
```

**なぜ悪いのか:**

- `any`型は型安全性を失う
- ランタイムエラーが発生しやすい
- IDEの補完が効かない

**改善方法:**

- すべてのデータに明確な型定義を付ける
- Zodなどでランタイム検証を行う
- APIレスポンスの型を統一する

---

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性と単一責任
- [React/Next.js規約](./07-react-nextjs-rules.md) - React/Next.js固有の規約
- [環境変数設定](../../02-setup/03-environment-variables.md) - 環境変数の詳細設定
- [Next.js Documentation](https://nextjs.org/docs)
