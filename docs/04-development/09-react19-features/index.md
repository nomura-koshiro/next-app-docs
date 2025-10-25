# React 19の新機能

React 19で導入された新しいフック（useOptimistic、useTransition、use）の実装ガイドです。

## 📚 目次

1. **[useOptimistic - 楽観的UI更新](./01-use-optimistic.md)** - サーバーレスポンスを待たずに即座にUIを更新
2. **[useTransition - ノンブロッキングな状態更新](./02-use-transition.md)** - 重い処理をノンブロッキングに実行
3. **[use フック - Promise/Contextの読み取り](./03-use-hook.md)** - Promise、Context、その他の値を読み取る

---

## 🚀 概要

React 19では、ユーザー体験を向上させるための新しいフックが追加されました。これらのフックを活用することで、より滑らかで応答性の高いアプリケーションを構築できます。

### React 19の主要な新機能

| フック | 用途 | 効果 |
|--------|------|------|
| **useOptimistic** | チャット送信、削除、いいね | サーバーレスポンスを待たずに即座にUI反映、体感速度向上 |
| **useTransition** | ページ遷移、タブ切り替え、検索 | 重い処理をノンブロッキングに実行、UI応答性の維持 |
| **use** | Next.js 15 params、Context | Promise、Contextを直接読み取り、条件付き呼び出し可能 |

---

## 🎯 使用場面の判断基準

### useOptimisticを使うべき場面

以下のような操作で、ユーザーに即座のフィードバックを提供したい場合に使用します。

```typescript
// ✅ 適切な使用例
- チャットメッセージの送信
- ユーザーの削除
- いいね・お気に入りのトグル
- ファイルアップロード開始時のリスト追加
- コメントの投稿
```

**判断ポイント:**
- サーバーへの送信が必要な操作
- ほぼ確実に成功する操作
- 即座のフィードバックがUXを向上させる

### useTransitionを使うべき場面

以下のようなUIをブロックしたくない重い処理に使用します。

```typescript
// ✅ 適切な使用例
- フォーム送信後のページ遷移
- タブの切り替え
- 大量データのフィルタリング・検索
- ログイン後のリダイレクト
- 複雑な計算処理
```

**判断ポイント:**
- 処理に時間がかかる可能性がある
- 処理中もUIの応答性を保ちたい
- ユーザーがブロックされるべきではない

### useフックを使うべき場面

以下のような場面で、Promise、Context、その他の値を読み取るために使用します。

```typescript
// ✅ 適切な使用例
- Next.js 15のPromise型paramsの読み取り
- Next.js 15のPromise型searchParamsの読み取り
- コンポーネント内でのContextの読み取り
- 条件付きでのPromise読み取り
```

**判断ポイント:**
- Next.js 15の新しいparams型に対応する必要がある
- 条件付きでPromiseを読み取りたい
- useContextの代替として使用したい

---

## 💡 クイックスタート

### useOptimistic - チャット機能の例

```typescript
'use client';

import { useOptimistic, useState } from 'react';

export const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );

  const sendMessage = async (content: string) => {
    const newMessage = { id: Date.now(), content, timestamp: new Date() };

    // 🚀 即座にUIに反映
    addOptimisticMessage(newMessage);

    try {
      await api.post('/messages', newMessage);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      // ❌ エラー時: 自動的にロールバック
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      {optimisticMessages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
};
```

**詳細**: [useOptimistic完全ガイド](./01-use-optimistic.md)

---

### useTransition - ページ遷移の例

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

**詳細**: [useTransition完全ガイド](./02-use-transition.md)

---

### use - Next.js 15 paramsの例

```typescript
'use client';

import { use } from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const UserPage = ({ params }: PageProps) => {
  // ✅ Promise型paramsを直接読み取り
  const { id } = use(params);

  return <div>User ID: {id}</div>;
};
```

**詳細**: [use hook完全ガイド](./03-use-hook.md)

---

## 🔄 useOptimistic + useTransition の組み合わせ

より高度なUXを実現するために、useOptimisticとuseTransitionを組み合わせることができます。

```typescript
'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export const UserForm = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  const [optimisticUsers, addOptimisticUser] = useOptimistic(
    users,
    (state, newUser: User) => [...state, newUser]
  );

  const handleSubmit = async (data: UserFormData) => {
    const newUser = { id: Date.now(), ...data };

    // 🚀 即座にUIに反映（楽観的更新）
    addOptimisticUser(newUser);

    try {
      await createUser(newUser);
      setUsers(prev => [...prev, newUser]);

      // 🚀 ノンブロッキングなページ遷移
      startTransition(() => {
        router.push('/users');
      });
    } catch (error) {
      // ❌ エラー時: 自動的にロールバック
      console.error('Failed to create user:', error);
    }
  };

  return (
    <div>
      <UserList users={optimisticUsers} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? '保存中...' : '保存'}
      </button>
    </div>
  );
};
```

---

## 📊 FastAPI連携での活用

このプロジェクトではFastAPIバックエンドを使用しているため、Server Actionsは使用しませんが、React 19の新機能を活用することで、バックエンドのレスポンス遅延を感じさせないUXを実現できます。

### TanStack Queryとの統合

React 19の新機能は、TanStack Query（React Query）と組み合わせることで、より強力なデータ管理が可能になります。

```typescript
import { useOptimistic } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUserDelete = () => {
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<User[]>([]);

  const [optimisticUsers, removeOptimisticUser] = useOptimistic(
    users,
    (state, deletedUserId: string) => state.filter(user => user.id !== deletedUserId)
  );

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = async (userId: string) => {
    removeOptimisticUser(userId);

    try {
      await deleteMutation.mutateAsync(userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return { users: optimisticUsers, handleDelete };
};
```

詳細は各フックのドキュメントの「FastAPI連携」「TanStack Queryとの統合」セクションを参照してください。

---

## 🔗 関連リンク

- [React/Next.js規約](../01-coding-standards/07-react-nextjs-rules.md) - React 19機能の使い方のルール
- [カスタムフック](../05-custom-hooks/index.md) - フックの実装パターン
- [フォームとバリデーション](../06-forms-validation/index.md) - フォーム管理との統合
- [API統合](../07-api-integration/index.md) - TanStack Queryとの連携
- [React 19公式ドキュメント](https://react.dev/blog/2025/01/09/react-19) - React 19の公式発表

---

## 📝 実装時の注意点

### 1. Server ComponentとClient Componentの区別

React 19の新しいフック（useOptimistic、useTransition、use）は、すべて**Client Component**でのみ使用できます。

```typescript
// ✅ 正しい使用
'use client';

import { useOptimistic } from 'react';

export const Component = () => {
  const [optimisticState, addOptimistic] = useOptimistic(/* ... */);
  // ...
};
```

### 2. エラーハンドリング

楽観的更新を使用する場合、エラーハンドリングが重要です。

- useOptimisticはエラー時に自動的にロールバックします
- ユーザーにエラーを通知する仕組みを実装してください

### 3. TypeScriptの型安全性

すべてのフックで型を明示的に指定することを推奨します。

```typescript
// ✅ 型を明示的に指定
const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[], Message>(
  messages,
  (state, newMessage) => [...state, newMessage]
);
```

### 4. パフォーマンス最適化

- useOptimisticとuseTransitionを組み合わせる場合、状態更新のタイミングに注意
- 不要な再レンダリングを避けるため、useMemoやuseCallbackを活用

---

## 🎓 学習リソース

- [React 19 公式ブログ](https://react.dev/blog/2025/01/09/react-19)
- [useOptimistic API リファレンス](https://react.dev/reference/react/useOptimistic)
- [useTransition API リファレンス](https://react.dev/reference/react/useTransition)
- [use フック API リファレンス](https://react.dev/reference/react/use)
- [Next.js 15 ドキュメント](https://nextjs.org/docs)
