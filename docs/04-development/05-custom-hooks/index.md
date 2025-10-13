# カスタムフック

このセクションでは、プロジェクトで使用するカスタムフックの実装パターンとベストプラクティスについて説明します。

## 目次

1. [フックの実装パターン](./01-hook-patterns.md) - カスタムフックの統一的な実装パターン
2. [フォーム用フック](./02-form-hooks.md) - React Hook Formを使用したフォーム管理フック
3. [データ取得フック](./03-data-hooks.md) - TanStack Query（React Query）を使用したデータ取得フック

## 概要

カスタムフックは、コンポーネントからロジックを分離し、再利用可能にするための重要な設計パターンです。
このプロジェクトでは、以下の原則に基づいてカスタムフックを実装します。

### 基本原則

#### 1. 関心の分離

コンポーネント（プレゼンテーション層）とロジック（ビジネスロジック層）を明確に分離します。

```tsx
// ❌ 悪い例: コンポーネントにロジックが混在
export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  return <UserList users={users} loading={loading} />;
}

// ✅ 良い例: ロジックをフックに分離
export default function UserPage() {
  const { users, isLoading } = useUsers();
  return <UserList users={users} loading={isLoading} />;
}
```

#### 2. 単一責任の原則

各フックは単一の責任を持つべきです。複雑なロジックは複数のフックに分割します。

```tsx
// ✅ 良い例: 責任を分離
export const useUserForm = () => {
  // フォーム管理のみに集中
  const form = useForm<UserFormValues>({...});
  return { control, onSubmit, errors };
};

export const useUserMutation = () => {
  // データ更新のみに集中
  const mutation = useMutation({...});
  return { createUser, updateUser, deleteUser };
};
```

#### 3. 予測可能な API

フックの戻り値は一貫性のある形式で、使用する側が予測しやすいようにします。

```tsx
// ✅ 良い例: 予測可能な戻り値
export const useUsers = () => {
  return {
    users,           // データ
    isLoading,       // ローディング状態
    error,           // エラー
    refetch,         // 再取得関数
  };
};
```

### フックの種類

このプロジェクトでは、主に以下の3種類のフックを使用します。

#### 1. フォーム管理フック

React Hook Formを使用したフォームの状態管理とバリデーション。

- **例**: `useLogin`, `useSampleForm`, `useNewUser`, `useEditUser`
- **詳細**: [フォーム用フック](./02-form-hooks.md)

#### 2. データ取得フック

TanStack Query（React Query）を使用したサーバーデータの取得とキャッシュ管理。

- **例**: `useUsers`, `useUser`
- **詳細**: [データ取得フック](./03-data-hooks.md)

#### 3. UI状態管理フック

コンポーネント内のローカルなUI状態を管理。

- **例**: モーダルの開閉、アコーディオンの展開状態など
- **実装**: 基本的なuseStateやuseReducerを使用

## 統一された実装パターン

プロジェクト全体でフックの実装を統一するために、以下のパターンに従ってください。

### 1. "use client" ディレクティブ

**原則**: カスタムフック自体には `"use client"` ディレクティブを**含めません**。

```tsx
// ❌ 悪い例
"use client";

export const useLogin = () => {
  // ...
};
```

```tsx
// ✅ 良い例
export const useLogin = () => {
  // ...
};
```

`"use client"` は、フックを使用するコンポーネント側で宣言します。

### 2. フックの戻り値

**原則**: フォームオブジェクト全体ではなく、**必要なプロパティを分割して返します**。

```tsx
// ❌ 悪い例
export const useLogin = () => {
  const form = useForm<LoginFormValues>({...});
  return { form };
};

// ✅ 良い例
export const useLogin = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({...});
  return { control, onSubmit, errors, isSubmitting };
};
```

### 3. handleSubmit の処理

**原則**: `handleSubmit` でラップした関数を `onSubmit` として返します。

```tsx
// ✅ 良い例
export const useLogin = () => {
  const { control, handleSubmit, setError } = useForm<LoginFormValues>({...});

  const onSubmit = handleSubmit((values) => {
    // 送信処理
  });

  return { control, onSubmit, errors };
};
```

### 4. エラーハンドリング

**原則**:
- **フォーム関連**: `setError` を使用してフォームエラーとして管理
- **データ取得**: mutation/query の状態を使用

詳細は各フックタイプのページを参照してください。

### 5. データ変換

**原則**: データ変換は**フック内で実行**します。

```tsx
// ✅ 良い例
export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // フック内で変換
  const users = data?.map(user => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  })) ?? [];

  return { users, isLoading };
};
```

## 実装例

実際のプロジェクトでの実装例は、各セクションで詳しく説明しています。

- **フォームフック**: [02-form-hooks.md](./02-form-hooks.md)
- **データフック**: [03-data-hooks.md](./03-data-hooks.md)

## 参考リソース

- [React公式 - カスタムフックの作成](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React Hook Form - カスタムフック](https://react-hook-form.com/docs/useform)
- [TanStack Query - カスタムフック](https://tanstack.com/query/latest/docs/framework/react/guides/custom-hooks)
