# useOptimistic - 楽観的UI更新

React 19で導入された`useOptimistic`フックを使用した楽観的UI更新のガイドです。

## 目次

- [概要](#概要)
- [基本的な使い方](#基本的な使い方)
- [実装パターン](#実装パターン)
- [FastAPI連携](#fastapi連携)
- [TanStack Queryとの統合](#tanstack-queryとの統合)
- [ベストプラクティス](#ベストプラクティス)
- [トラブルシューティング](#トラブルシューティング)

---

## 概要

### 楽観的UI更新とは

楽観的UI更新（Optimistic UI Update）は、サーバーのレスポンスを待たずに、操作が成功すると仮定してUIを先に更新する手法です。

**メリット:**
- ユーザー操作に対する即座のフィードバック
- サーバーのレスポンス遅延を感じさせない
- より滑らかなユーザー体験

**デメリット:**
- サーバーでエラーが発生した場合、ロールバックが必要
- 複雑な状態管理が必要になる場合がある

### React 19のuseOptimistic

React 19では`useOptimistic`フックが導入され、楽観的更新を簡単に実装できるようになりました。

```typescript
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (currentState, optimisticValue) => {
    // 楽観的更新のロジック
    return newState;
  }
);
```

**特徴:**
- エラー時の自動ロールバック
- シンプルなAPI
- TypeScriptの完全サポート

---

## 基本的な使い方

### ステップ1: 基本セットアップ

```typescript
'use client';

import { useOptimistic, useState } from 'react';

export const useBasicOptimistic = () => {
  // ベースとなる状態
  const [items, setItems] = useState<string[]>([]);

  // 楽観的UI更新用の状態
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: string) => [...state, newItem]
  );

  return { optimisticItems, addOptimisticItem, setItems };
};
```

### ステップ2: 楽観的更新の実行

```typescript
const handleAdd = async (newItem: string) => {
  // 🚀 即座にUIに反映
  addOptimisticItem(newItem);

  try {
    // サーバーにリクエスト
    await api.post('/items', { item: newItem });

    // ✅ 成功時: ベース状態を更新
    setItems((prev) => [...prev, newItem]);
  } catch (error) {
    // ❌ エラー時: 自動的にロールバック
    console.error('Failed to add item:', error);
  }
};
```

### ステップ3: UIで使用

```typescript
export const ItemList = () => {
  const { optimisticItems, handleAdd } = useItems();

  return (
    <ul>
      {optimisticItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};
```

---

## 実装パターン

### パターン1: チャット機能

**ユースケース**: メッセージ送信時の即座のUI反映

```typescript
// src/features/sample-chat/routes/sample-chat/sample-chat.hook.ts
import { useOptimistic, useState } from 'react';

export const useSampleChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const sendMessageMutation = useSendMessage();

  // 楽観的UI更新
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );

  const handleSendMessage = async () => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // 🚀 即座にUIに反映
    addOptimisticMessage(userMessage);

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: userMessage.content,
        conversationId,
      });

      // ✅ 成功時: 実際のメッセージで更新
      setMessages((prev) => [...prev, userMessage, response.message]);
    } catch (error) {
      // ❌ エラー時: 自動的にロールバック
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'エラーが発生しました。',
        timestamp: new Date(),
      }]);
    }
  };

  return {
    messages: optimisticMessages,
    handleSendMessage,
  };
};
```

**効果:**
- メッセージ送信が即座に画面に反映
- FastAPIのレスポンスを待たずに次のメッセージを入力可能
- ネイティブアプリのような滑らかなUX

---

### パターン2: リスト項目の削除

**ユースケース**: ユーザー削除時の即座のUI反映

```typescript
// src/features/sample-users/routes/sample-users/users.hook.ts
import { useOptimistic } from 'react';

export const useUsers = () => {
  const { data } = useUsersQuery();
  const deleteUserMutation = useDeleteUser();

  const users = data?.data ?? [];

  // 楽観的UI更新（削除）
  const [optimisticUsers, removeOptimisticUser] = useOptimistic(
    users,
    (state, deletedUserId: string) =>
      state.filter((user) => user.id !== deletedUserId)
  );

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // 確認ダイアログ
    const confirmed = window.confirm(
      `${user.name} を削除してもよろしいですか？`
    );
    if (!confirmed) return;

    // 🚀 即座にUIから削除
    removeOptimisticUser(userId);

    try {
      // FastAPIに削除リクエスト
      await deleteUserMutation.mutateAsync(userId);
      // ✅ 削除成功（キャッシュは自動更新）
    } catch (error) {
      // ❌ エラー時: 自動的にロールバック
      console.error('削除に失敗しました:', error);
      alert('ユーザーの削除に失敗しました。');
    }
  };

  return {
    users: optimisticUsers,
    handleDelete,
  };
};
```

**効果:**
- 削除ボタンを押した瞬間にリストから消える
- FastAPIの処理を待たずに次の操作が可能
- エラー時は元に戻る

---

### パターン3: ファイルアップロード

**ユースケース**: ファイル選択後の即座のリスト表示

```typescript
// src/features/sample-file/routes/sample-file/sample-file.hook.ts
import { useOptimistic, useState } from 'react';

export const useSampleFile = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // 楽観的UI更新（複数ファイル追加）
  const [optimisticFiles, addOptimisticFiles] = useOptimistic(
    uploadedFiles,
    (state, newFiles: UploadedFile[]) => [...state, ...newFiles]
  );

  const handleFileDrop = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    // 🚀 即座にリストに表示
    addOptimisticFiles(newFiles);

    // ベース状態も更新（楽観的更新を確定）
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // バックグラウンドでアップロード
    for (let i = 0; i < files.length; i++) {
      const fileIndex = uploadedFiles.length + i;

      try {
        await uploadFile(files[i], (progress) => {
          setUploadedFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex ? { ...f, progress } : f
            )
          );
        });

        // ✅ 成功: ステータス更新
        setUploadedFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: 'success' } : f
          )
        );
      } catch (error) {
        // ❌ エラー: ステータス更新
        setUploadedFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: 'error' } : f
          )
        );
      }
    }
  };

  return {
    uploadedFiles: optimisticFiles,
    handleFileDrop,
  };
};
```

**効果:**
- ファイル選択後、即座にリストに表示
- アップロード進行状況がリアルタイム更新
- 複数ファイルの同時アップロードに対応

---

## FastAPI連携

### FastAPIとの統合パターン

```typescript
// FastAPIエンドポイント: POST /api/v1/items
const handleCreate = async (data: CreateItemInput) => {
  // 楽観的更新用の一時ID
  const tempId = `temp-${Date.now()}`;

  const optimisticItem = {
    id: tempId,
    ...data,
    createdAt: new Date().toISOString(),
  };

  // 🚀 即座にUIに反映
  addOptimisticItem(optimisticItem);

  try {
    // FastAPIにPOSTリクエスト
    const response = await api.post('/items', data);

    // ✅ 成功時: 一時IDを実際のIDで置き換え
    setItems((prev) =>
      prev.map((item) =>
        item.id === tempId ? response.data : item
      )
    );
  } catch (error) {
    // ❌ エラー時: 自動的にロールバック
    console.error('Failed to create item:', error);
  }
};
```

### エラーハンドリング

```typescript
const handleUpdate = async (id: string, data: UpdateInput) => {
  const original = items.find((item) => item.id === id);

  // 🚀 楽観的更新
  updateOptimisticItem({ id, ...data });

  try {
    await api.patch(`/items/${id}`, data);
    // ✅ 成功
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, ...data } : item)
    );
  } catch (error) {
    // ❌ エラー: ロールバック + 通知
    console.error('Update failed:', error);

    // ユーザーに通知
    toast.error('更新に失敗しました');

    // 必要に応じて元の値に戻す処理を追加
  }
};
```

---

## TanStack Queryとの統合

### Queryキャッシュとの連携

```typescript
import { useQueryClient } from '@tanstack/react-query';

export const useItemsWithOptimistic = () => {
  const queryClient = useQueryClient();
  const { data } = useItems();
  const createItemMutation = useCreateItem();

  const items = data?.data ?? [];

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: Item) => [...state, newItem]
  );

  const handleCreate = async (data: CreateItemInput) => {
    const tempItem = { id: `temp-${Date.now()}`, ...data };

    // 🚀 楽観的更新
    addOptimisticItem(tempItem);

    try {
      await createItemMutation.mutateAsync(data);

      // ✅ TanStack Queryのキャッシュを無効化
      // （useCreateItemMutation内で自動実行）
    } catch (error) {
      // ❌ エラー時: 自動ロールバック
      console.error(error);
    }
  };

  return { items: optimisticItems, handleCreate };
};
```

### Mutationとの統合

```typescript
// api/create-item.ts
export const useCreateItem = ({ mutationConfig }: UseCreateItemOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // キャッシュを無効化（自動的に再取得）
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    ...mutationConfig,
  });
};
```

---

## ベストプラクティス

### 1. 型安全性の確保

```typescript
// ✅ Good: 型パラメータを明示
const [optimisticItems, addOptimisticItem] = useOptimistic<Item[], Item>(
  items,
  (state, newItem) => [...state, newItem]
);

// ❌ Bad: 型推論に頼りすぎる
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (state, newItem) => [...state, newItem]
);
```

### 2. 一時IDの管理

```typescript
// ✅ Good: 識別可能な一時ID
const tempId = `temp-${Date.now()}-${Math.random()}`;

// ❌ Bad: 衝突の可能性がある
const tempId = Date.now().toString();
```

### 3. エラーハンドリング

```typescript
// ✅ Good: 詳細なエラー情報
try {
  await mutation.mutateAsync(data);
} catch (error) {
  console.error('Mutation failed:', error);

  // ユーザーフレンドリーなメッセージ
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('予期しないエラーが発生しました');
  }
}

// ❌ Bad: エラーを無視
try {
  await mutation.mutateAsync(data);
} catch (error) {
  // エラーハンドリングなし
}
```

### 4. ロールバック後の通知

```typescript
// ✅ Good: ユーザーに通知
catch (error) {
  console.error('Failed:', error);
  alert('操作に失敗しました。もう一度お試しください。');
}

// ❌ Bad: 何も通知しない
catch (error) {
  console.error('Failed:', error);
}
```

### 5. ベース状態の更新タイミング

```typescript
// ✅ Good: 成功時のみベース状態を更新
try {
  await mutation.mutateAsync(data);
  setItems((prev) => [...prev, newItem]); // ここで更新
} catch (error) {
  // エラー時は更新しない
}

// ❌ Bad: 楽観的更新と同時にベース状態を更新
addOptimisticItem(newItem);
setItems((prev) => [...prev, newItem]); // ここで更新（早すぎる）
```

---

## トラブルシューティング

### 問題1: ロールバックが効かない

**原因**: ベース状態を楽観的更新と同時に更新している

```typescript
// ❌ Bad
addOptimisticItem(newItem);
setItems((prev) => [...prev, newItem]); // 即座に更新

// ✅ Good
addOptimisticItem(newItem);
try {
  await mutation.mutateAsync(data);
  setItems((prev) => [...prev, newItem]); // 成功時のみ更新
} catch (error) {
  // エラー時は自動ロールバック
}
```

### 問題2: 複数の楽観的更新が競合する

**原因**: 非同期処理の順序が保証されていない

**解決策**: キューイングまたはロック機構を実装

```typescript
const [isProcessing, setIsProcessing] = useState(false);

const handleAction = async (data: ActionInput) => {
  if (isProcessing) {
    console.warn('Already processing');
    return;
  }

  setIsProcessing(true);
  addOptimisticItem(data);

  try {
    await mutation.mutateAsync(data);
    setItems((prev) => [...prev, data]);
  } catch (error) {
    console.error(error);
  } finally {
    setIsProcessing(false);
  }
};
```

### 問題3: TanStack Queryのキャッシュと同期がずれる

**原因**: キャッシュ無効化のタイミングが不適切

**解決策**: Mutationのonsuccessでキャッシュを無効化

```typescript
// API層でキャッシュ無効化を設定
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // キャッシュを無効化（自動的に再取得）
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
```

---

## 参考リソース

- [React 19 - useOptimistic](https://react.dev/reference/react/useOptimistic)
- [TanStack Query - Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [実装例: チャット機能](../../features/sample-chat/routes/sample-chat/sample-chat.hook.ts)
- [実装例: ユーザー削除](../../features/sample-users/routes/sample-users/users.hook.ts)

---

## 関連ドキュメント

- [useTransition](./02-use-transition.md) - ノンブロッキングな状態更新
- [useフック](./03-use-hook.md) - Promiseの読み取り
- [TanStack Query設定](../../03-core-concepts/07-tanstack-query.md)
