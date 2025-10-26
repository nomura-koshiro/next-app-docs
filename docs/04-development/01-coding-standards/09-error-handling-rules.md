# エラーハンドリング規約

このドキュメントでは、プロジェクトで採用しているエラーハンドリングの規約について説明します。

## 目次

- [基本方針](#基本方針)
- [推奨パターン](#推奨パターン)
- [禁止パターン](#禁止パターン)
- [例外ケース](#例外ケース)
- [実装例](#実装例)

---

## 基本方針

### try-catchの禁止

このプロジェクトでは、**try-catch文の使用を原則禁止**とし、代わりに**`.catch()`メソッドの使用を強制**しています。

#### 理由

1. **コードの簡潔性**: ネストが深くならず、読みやすいコードになる
2. **一貫性**: Promiseベースの非同期処理で統一される
3. **チェーン可能**: エラーハンドリングを含めて処理をチェーンできる
4. **型安全性**: TypeScriptの型推論がより効果的に機能する

---

## 推奨パターン

### ✅ Good: `.catch()`メソッドを使用

```typescript
// ✅ 推奨: .catch()でエラーハンドリング
const handleSubmit = async (data: FormData) => {
  await createUser(data)
    .then((response) => {
      console.log('ユーザー作成成功:', response);
      router.push('/users');
    })
    .catch((error) => {
      console.error('ユーザー作成失敗:', error);
      setError('root', {
        message: 'ユーザーの作成に失敗しました',
      });
    });
};
```

### ✅ Good: awaitと.catch()の組み合わせ

```typescript
// ✅ 推奨: await + .catch()
const handleSubmit = async (data: FormData) => {
  const result = await createUser(data).catch((error) => {
    console.error('エラー:', error);
    return null; // エラー時のデフォルト値
  });

  if (result === null) {
    setError('root', { message: '処理に失敗しました' });
    return;
  }

  router.push('/users');
};
```

### ✅ Good: 複数のPromiseを処理

```typescript
// ✅ 推奨: Promise.all + .catch()
const fetchAllData = async () => {
  await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders(),
  ])
    .then(([users, products, orders]) => {
      setUsers(users);
      setProducts(products);
      setOrders(orders);
    })
    .catch((error) => {
      console.error('データ取得失敗:', error);
      alert('データの取得に失敗しました');
    });
};
```

---

## 禁止パターン

### ❌ Bad: try-catch文を使用

```typescript
// ❌ 禁止: try-catch文
const handleSubmit = async (data: FormData) => {
  try {
    const response = await createUser(data);
    console.log('成功:', response);
    router.push('/users');
  } catch (error) {
    console.error('エラー:', error);
    setError('root', { message: '作成失敗' });
  }
};

// ESLintエラー:
// try-catchは禁止されています。代わりに.catch()メソッドを使用してください。
// 例: await somePromise().catch(error => { ... })
```

---

## 例外ケース

以下のファイルでは、try-catch文の使用が**許可**されています：

### 1. Error Boundary

```typescript
// ✅ 許可: Error Boundaryコンポーネント
// ファイル: **/error.tsx, **/*-error-boundary.tsx

import { Component, ErrorInfo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### 2. Middleware

```typescript
// ✅ 許可: Next.js Middleware
// ファイル: **/middleware.ts, **/*.middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  try {
    // 認証チェックなど
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
};
```

---

## 実装例

### パターン1: フォーム送信

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '../../api/create-user';

export const useNewUser = () => {
  const router = useRouter();
  const createUserMutation = useCreateUser();

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

  // ✅ 推奨: .catch()でエラーハンドリング
  const onSubmit = handleSubmit(async (data) => {
    await createUserMutation
      .mutateAsync(data)
      .then(() => router.push('/sample-users'))
      .catch((error) => {
        console.error('ユーザー作成エラー:', error);
        setError('root', {
          message: 'ユーザーの作成に失敗しました',
        });
      });
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: createUserMutation.isPending,
  };
};
```

### パターン2: データ取得後の処理

```typescript
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '../../api/get-user';
import { useUpdateUser } from '../../api/update-user';

export const useEditUser = (userId: string) => {
  const router = useRouter();
  const { data } = useUser({ userId }); // useSuspenseQuery - データは常に存在
  const updateUserMutation = useUpdateUser();

  const { control, handleSubmit, setError } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: data.data, // useEffectなしで直接設定！
  });

  // ✅ 推奨: .catch()でエラーハンドリング
  const onSubmit = handleSubmit(async (formData) => {
    await updateUserMutation
      .mutateAsync({ userId, data: formData })
      .then(() => router.push('/sample-users'))
      .catch((error) => {
        console.error('ユーザー更新エラー:', error);
        setError('root', {
          message: 'ユーザーの更新に失敗しました',
        });
      });
  });

  return {
    control,
    onSubmit,
    isSubmitting: updateUserMutation.isPending,
  };
};
```

### パターン3: 楽観的更新

```typescript
import { useOptimistic } from 'react';
import { useUsers as useUsersQuery } from '../../api/get-users';
import { useDeleteUser as useDeleteUserMutation } from '../../api/delete-user';

export const useUsers = () => {
  const { data } = useUsersQuery();
  const deleteUserMutation = useDeleteUserMutation();

  const users = data?.data ?? [];

  const [optimisticUsers, removeOptimisticUser] = useOptimistic(
    users,
    (state, deletedUserId: string) => state.filter((user) => user.id !== deletedUserId)
  );

  // ✅ 推奨: .catch()でエラーハンドリング
  const handleDelete = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const confirmed = window.confirm(`${user.name} を削除してもよろしいですか？`);
    if (!confirmed) return;

    // 楽観的更新
    removeOptimisticUser(userId);

    // API呼び出し
    deleteUserMutation
      .mutateAsync(userId)
      .catch((error) => {
        console.error('削除エラー:', error);
        alert('ユーザーの削除に失敗しました。');
        // useOptimisticが自動でロールバック
      });
  };

  return {
    users: optimisticUsers,
    handleDelete,
    isDeleting: deleteUserMutation.isPending,
  };
};
```

---

## ESLint設定

この規約は、以下のESLintルールで強制されています：

```javascript
// eslint.config.mjs

{
  rules: {
    // try-catch文を禁止し、.catch()の使用を強制
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TryStatement",
        "message": "try-catchは禁止されています。代わりに.catch()メソッドを使用してください。例: await somePromise().catch(error => { ... })"
      }
    ],
    // floating Promiseを禁止（await忘れを防ぐ）
    "@typescript-eslint/no-floating-promises": "error",
  },
}
```

### 例外設定

以下のファイルパターンではtry-catchが許可されます：

- `**/error.tsx`
- `**/error.ts`
- `**/*.middleware.{ts,tsx}`
- `**/middleware.{ts,tsx}`
- `**/*-error-boundary.{ts,tsx}`
- `**/error-boundary.{ts,tsx}`

---

## まとめ

### 推奨事項

1. ✅ 常に`.catch()`メソッドを使用する
2. ✅ `await`と`.catch()`を組み合わせる
3. ✅ エラー時のデフォルト値を`.catch()`内で返す
4. ✅ `@typescript-eslint/no-floating-promises`ルールに従う

### 禁止事項

1. ❌ try-catch文を使用しない（例外ケースを除く）
2. ❌ Promiseを`await`せずに放置しない

### 例外

1. ✅ Error Boundaryコンポーネント
2. ✅ Next.js Middleware
3. ✅ その他、React/Next.jsのライフサイクルで必須の場所

---

## 関連ドキュメント

- [基本原則](./01-basic-principles.md)
- [TypeScript規約](./02-typescript.md)
- [React/Next.js規約](./07-react-nextjs-rules.md)
- [カスタムフック実装ガイド](../05-custom-hooks/guides/03-patterns/index.md)
