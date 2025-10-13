# フックの実装パターン

このドキュメントでは、プロジェクト全体で統一されたカスタムフックの実装パターンについて説明します。

## 目次

- [基本構造](#基本構造)
- [実装パターンの決定事項](#実装パターンの決定事項)
- [命名規則](#命名規則)
- [ディレクトリ構成](#ディレクトリ構成)

## 基本構造

カスタムフックは以下の基本構造に従います。

```tsx
export const useFeatureName = () => {
  // ================================================================================
  // State / Form Setup
  // ================================================================================
  // 状態管理、フォーム初期化など

  // ================================================================================
  // Queries / Mutations
  // ================================================================================
  // データ取得、更新のためのクエリやミューテーション

  // ================================================================================
  // Data Transformation
  // ================================================================================
  // データの変換処理

  // ================================================================================
  // Handlers
  // ================================================================================
  // イベントハンドラー、コールバック関数

  // ================================================================================
  // Return
  // ================================================================================
  return {
    // 必要なプロパティのみを分割して返す
  };
};
```

## 実装パターンの決定事項

プロジェクト全体で統一するために、以下の5つの実装パターンを標準化しました。

### 1. "use client" ディレクティブの扱い

#### 決定事項

**カスタムフック自体には `"use client"` ディレクティブを含めない。**

#### 理由

- フックは純粋なロジックの単位であり、クライアント/サーバーの境界はコンポーネント側で決定すべき
- フックの再利用性を高める
- Server Componentsでも使用可能なフックを作れる可能性を残す

#### 実装例

```tsx
// ❌ 悪い例
"use client";

export const useLogin = () => {
  const form = useForm<LoginFormValues>({...});
  // ...
};
```

```tsx
// ✅ 良い例
export const useLogin = () => {
  const form = useForm<LoginFormValues>({...});
  // ...
};
```

フックを使用するコンポーネント側で `"use client"` を宣言します。

```tsx
// コンポーネント側
"use client";

import { useLogin } from "./login.hook";

export default function LoginPage() {
  const { control, onSubmit } = useLogin();
  // ...
}
```

### 2. フォームの返し方

#### 決定事項

**Pattern B: フォームオブジェクト全体ではなく、必要なプロパティを分割して返す。**

#### 比較

```tsx
// Pattern A: フォームオブジェクト全体を返す
export const useLogin = () => {
  const form = useForm<LoginFormValues>({...});
  return { form };
};

// 使用側
const { form } = useLogin();
<LoginForm control={form.control} errors={form.formState.errors} />

// Pattern B: 必要なプロパティを分割して返す ✅
export const useLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({...});

  return { control, errors, setError };
};

// 使用側
const { control, errors } = useLogin();
<LoginForm control={control} errors={errors} />
```

#### 理由

- コンポーネント側で必要なものだけを使用できる（明示的な依存関係）
- プロパティのドリリングが減少
- TypeScriptの型補完が効きやすい
- 使用する側のコードが簡潔になる

#### 実装例

```tsx
export const useLogin = () => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((values) => {
    // 送信処理
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending,
  };
};
```

### 3. handleSubmit の処理方法

#### 決定事項

**Pattern C: `handleSubmit` でラップした関数を `onSubmit` として返す。**

#### 比較

```tsx
// Pattern A: handleSubmit を直接返す
export const useLogin = () => {
  const { control, handleSubmit } = useForm<LoginFormValues>({...});

  const submit = (values: LoginFormValues) => {
    // 処理
  };

  return { control, handleSubmit: handleSubmit(submit) };
};

// Pattern B: handleSubmit とsubmit関数を別々に返す
export const useLogin = () => {
  const { control, handleSubmit } = useForm<LoginFormValues>({...});

  const submit = (values: LoginFormValues) => {
    // 処理
  };

  return { control, handleSubmit, submit };
};

// 使用側
const { control, handleSubmit, submit } = useLogin();
<form onSubmit={handleSubmit(submit)}>

// Pattern C: ラップ済みの関数を onSubmit として返す ✅
export const useLogin = () => {
  const { control, handleSubmit } = useForm<LoginFormValues>({...});

  const onSubmit = handleSubmit((values) => {
    // 処理
  });

  return { control, onSubmit };
};

// 使用側
const { control, onSubmit } = useLogin();
<form onSubmit={onSubmit}>
```

#### 理由

- コンポーネント側でhandleSubmitを呼び出す必要がない
- フォームの送信処理がフック内で完結
- 使用する側のコードが簡潔
- `onSubmit` という直感的な命名

#### 実装例

```tsx
export const useSampleForm = () => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      username: "",
      email: "",
      // ...
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit(async (data) => {
    console.log("Form Data:", data);
    alert(`フォームが送信されました！\n\n${JSON.stringify(data, null, 2)}`);
    reset();
  });

  return {
    control,
    onSubmit,
    errors,
    reset,
  };
};
```

### 4. エラーハンドリングの方法

#### 決定事項

**使用するケースに応じて適切な方法を選択:**

1. **フォーム関連エラー** → `setError` を使用してフォームエラーとして管理
2. **データ取得/更新エラー** → mutation/query の状態を使用

#### 理由

- フォームバリデーションエラーと同じ仕組みで表示できる
- エラー表示の一貫性が保たれる
- React Hook Formのエラー管理機能を最大限活用

#### 実装例

##### フォーム関連エラー

```tsx
export const useLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({...});

  const loginMutation = useMutation({
    mutationFn: loginUser,
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation
      .mutateAsync(values)
      .then((data) => {
        // 成功処理
      })
      .catch(() => {
        // フォームエラーとして設定
        setError("root", {
          message: "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        });
      });
  });

  return {
    control,
    onSubmit,
    errors, // errors.root にエラーメッセージが含まれる
    isSubmitting: loginMutation.isPending,
  };
};
```

##### データ取得/更新エラー

```tsx
export const useDeleteUser = () => {
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
    error: deleteUserMutation.error, // mutation の error を直接返す
  };
};
```

### 5. データ変換の場所

#### 決定事項

**Pattern A: データ変換はフック内で実行する。**

#### 比較

```tsx
// Pattern A: フック内で変換 ✅
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

// 使用側
const { users } = useUsers();
// usersは既に変換済み

// Pattern B: コンポーネント内で変換
export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return { users: data, isLoading };
};

// 使用側
const { users: rawUsers } = useUsers();
const users = rawUsers?.map(user => ({
  ...user,
  fullName: `${user.firstName} ${user.lastName}`,
})) ?? [];
```

#### 理由

- ビジネスロジックをコンポーネントから分離
- データ変換ロジックの再利用性
- コンポーネントのテストが容易
- 変換ロジックの一元管理

#### 実装例

```tsx
export const useUsers = () => {
  // ================================================================================
  // Queries
  // ================================================================================
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // ================================================================================
  // Data Transformation
  // ================================================================================
  const users =
    usersQuery.data?.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      displayAge: user.age ? `${user.age}歳` : "未設定",
    })) ?? [];

  return {
    users,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
  };
};
```

## 命名規則

### フック名

- **必ず `use` プレフィックスを使用**
- **機能を表す名詞または動詞を使用**
- **キャメルケース**

```tsx
// ✅ 良い例
useLogin
useUsers
useNewUser
useEditUser
useDeleteUser
useSampleForm

// ❌ 悪い例
loginHook
handleLogin
fetchUsers
```

### 戻り値のプロパティ名

戻り値のプロパティは、以下の命名規則に従います。

#### データ

```tsx
// 単数形
user
product

// 複数形
users
products
```

#### ローディング状態

```tsx
isLoading
isSubmitting
isDeleting
```

#### エラー

```tsx
error
errors // フォームの場合
```

#### 関数

```tsx
// イベントハンドラー
onSubmit
onReset

// 操作関数
createUser
updateUser
deleteUser
refetch
```

## ディレクトリ構成

カスタムフックは機能ごとに配置します。

```
src/
  features/
    sample-auth/
      routes/
        sample-login/
          login.hook.ts          # ページ固有のフック
          login.tsx              # ページコンポーネント
    sample-user/
      routes/
        users/
          users.hook.ts          # ユーザー一覧フック
          users.tsx
        new-user/
          new-user.hook.ts       # 新規ユーザーフック
          new-user.tsx
        edit-user/
          edit-user.hook.ts      # ユーザー編集フック
          edit-user.tsx
```

### ファイル命名

```tsx
// ページ固有のフック
{feature-name}.hook.ts

// 例
login.hook.ts
users.hook.ts
new-user.hook.ts
```

## まとめ

カスタムフックの実装では、以下の5つのパターンを標準として使用します。

1. ✅ **"use client" ディレクティブ**: フック自体には含めない
2. ✅ **フォームの返し方**: 必要なプロパティを分割して返す
3. ✅ **handleSubmit の処理**: ラップ済みの関数を `onSubmit` として返す
4. ✅ **エラーハンドリング**: フォーム関連は `setError`、データ取得は mutation/query の状態
5. ✅ **データ変換**: フック内で実行

これらのパターンに従うことで、プロジェクト全体で一貫性のある、保守しやすいコードを実現できます。
