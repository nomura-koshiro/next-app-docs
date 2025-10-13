# フォーム用フック

このドキュメントでは、React Hook Formを使用したフォーム管理フックの実装パターンについて説明します。

## 目次

- [概要](#概要)
- [基本パターン](#基本パターン)
- [実装例](#実装例)
- [エラーハンドリング](#エラーハンドリング)
- [非同期送信処理](#非同期送信処理)
- [フォームのリセット](#フォームのリセット)
- [ベストプラクティス](#ベストプラクティス)

## 概要

フォーム用フックは、React Hook Formを使用してフォームの状態管理、バリデーション、送信処理を担当します。

### 主な責務

- フォームの初期化とデフォルト値の設定
- バリデーションスキーマの適用（Zodスキーマ）
- フォーム送信処理
- エラーハンドリング
- フォームのリセット処理

### 使用するライブラリ

- **React Hook Form**: フォーム状態管理
- **Zod**: スキーマバリデーション
- **@hookform/resolvers**: ZodとReact Hook Formの統合

## 基本パターン

フォーム用フックは以下の基本構造に従います。

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type SchemaValues } from "./schema";

export const useFeatureForm = () => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      // デフォルト値
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit(async (data) => {
    try {
      // 送信処理
    } catch (error) {
      // エラーハンドリング
    }
  });

  // ================================================================================
  // Return
  // ================================================================================
  return {
    control,
    onSubmit,
    errors,
    reset,
    isSubmitting: false, // 必要に応じて
  };
};
```

## 実装例

### 例1: シンプルなフォーム（ローカル処理のみ）

`src/features/sample-form/routes/sample-form/sample-form.hook.ts`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sampleFormSchema,
  type SampleFormValues,
} from "../../schemas/sample-form.schema";

/**
 * サンプルフォームページのカスタムフック
 *
 * フォームの状態管理とロジックを担当します。
 */
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
      age: "",
      country: "",
      bio: "",
      terms: false,
      newsletter: false,
      gender: "male",
      notifications: true,
      darkMode: false,
      birthdate: "",
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit(async (data) => {
    // フォームデータを表示
    console.log("Form Data:", data);
    alert(`フォームが送信されました！\n\n${JSON.stringify(data, null, 2)}`);

    // フォームをリセット
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

### 例2: API連携を含むフォーム

`src/features/sample-user/routes/new-user/new-user.hook.ts`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  userFormSchema,
  type UserFormValues,
} from "../../schemas/user-form.schema";
import { createUser } from "../../api/users.api";

/**
 * 新規ユーザー作成ページのカスタムフック
 */
export const useNewUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      country: "",
    },
  });

  // ================================================================================
  // Mutations
  // ================================================================================
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // ユーザー一覧ページに遷移
      router.push("/users");
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((values) => {
    createUserMutation.mutate(values, {
      onError: () => {
        setError("root", {
          message: "ユーザーの作成に失敗しました。もう一度お試しください。",
        });
      },
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

### 例3: 認証フォーム

`src/features/sample-auth/routes/sample-login/login.hook.ts`

```tsx
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  loginFormSchema,
  type LoginFormValues,
} from "../../schemas/login-form.schema";
import { loginUser } from "../../api/auth.api";
import { useAuthStore } from "@/features/sample-auth/stores/auth.store";

/**
 * ログインページのカスタムフック
 */
export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();

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
  // Mutations
  // ================================================================================
  const loginMutation = useMutation({
    mutationFn: loginUser,
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((values) => {
    loginMutation
      .mutateAsync(values)
      .then((data) => {
        // 認証トークンを保存
        localStorage.setItem("token", data.token);
        // ユーザー情報をストアに保存
        setUser(data.user);
        // ユーザー一覧ページに遷移
        router.push("/users");
      })
      .catch(() => {
        // ログイン失敗時のエラーメッセージ
        setError("root", {
          message:
            "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        });
      });
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending,
  };
};
```

## エラーハンドリング

### フォームレベルのエラー

フォーム全体に関するエラーは `root` にセットします。

```tsx
setError("root", {
  message: "ログインに失敗しました。",
});

// コンポーネント側で表示
{errors.root && <ErrorMessage message={errors.root.message} />}
```

### フィールドレベルのエラー

特定のフィールドに関するエラーは、フィールド名を指定します。

```tsx
setError("email", {
  message: "このメールアドレスは既に使用されています。",
});

// ControlledInputFieldが自動的にエラーを表示
```

### バリデーションエラー

Zodスキーマによるバリデーションエラーは自動的に `errors` に格納されます。

```tsx
// スキーマ定義
export const loginFormSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

// エラーは自動的に errors.email, errors.password に格納される
```

## 非同期送信処理

### TanStack Query を使用する場合

```tsx
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    // 成功時の処理
    queryClient.invalidateQueries({ queryKey: ["users"] });
    router.push("/users");
  },
});

const onSubmit = handleSubmit((values) => {
  createUserMutation.mutate(values, {
    onError: () => {
      setError("root", {
        message: "ユーザーの作成に失敗しました。",
      });
    },
  });
});

return {
  // ...
  isSubmitting: createUserMutation.isPending,
};
```

### Promise を直接使用する場合

```tsx
const onSubmit = handleSubmit(async (values) => {
  try {
    await createUser(values);
    router.push("/users");
  } catch (error) {
    setError("root", {
      message: "ユーザーの作成に失敗しました。",
    });
  }
});
```

## フォームのリセット

### 基本的なリセット

```tsx
const { reset } = useForm({...});

// デフォルト値にリセット
reset();
```

### 特定の値にリセット

```tsx
// 特定の値にリセット
reset({
  username: "",
  email: "",
  // ...
});
```

### 成功後の自動リセット

```tsx
const onSubmit = handleSubmit(async (data) => {
  try {
    await submitForm(data);
    // 成功後にリセット
    reset();
  } catch (error) {
    // エラーハンドリング
  }
});
```

### リセット関数を返す

```tsx
export const useSampleForm = () => {
  const { control, handleSubmit, reset } = useForm({...});

  const onSubmit = handleSubmit(async (data) => {
    // 処理
  });

  return {
    control,
    onSubmit,
    reset, // リセット関数を返す
  };
};

// コンポーネント側
const { control, onSubmit, reset } = useSampleForm();
<Button onClick={() => reset()}>リセット</Button>
```

## ベストプラクティス

### 1. デフォルト値を必ず設定する

すべてのフィールドに適切なデフォルト値を設定します。

```tsx
// ✅ 良い例
const { control } = useForm<UserFormValues>({
  resolver: zodResolver(userFormSchema),
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    country: "",
  },
});

// ❌ 悪い例: デフォルト値なし
const { control } = useForm<UserFormValues>({
  resolver: zodResolver(userFormSchema),
});
```

### 2. TypeScript型を活用する

スキーマから型を導出し、型安全性を確保します。

```tsx
// スキーマ定義
export const userFormSchema = z.object({
  firstName: z.string().min(1, "名前を入力してください"),
  lastName: z.string().min(1, "姓を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

// 型をスキーマから導出
export type UserFormValues = z.infer<typeof userFormSchema>;

// フックで使用
export const useNewUser = () => {
  const { control, handleSubmit } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    // ...
  });
};
```

### 3. エラーメッセージは日本語でユーザーフレンドリーに

```tsx
// ✅ 良い例
setError("root", {
  message: "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
});

// ❌ 悪い例
setError("root", {
  message: "Error: Authentication failed",
});
```

### 4. ローディング状態を返す

送信中の状態をコンポーネントに伝えます。

```tsx
export const useLogin = () => {
  const loginMutation = useMutation({...});

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending, // ローディング状態
  };
};

// コンポーネント側
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "ログイン中..." : "ログイン"}
</Button>
```

### 5. 成功時の処理を明確にする

フォーム送信成功時の処理（画面遷移、通知など）を明確にします。

```tsx
const onSubmit = handleSubmit((values) => {
  createUserMutation.mutate(values, {
    onSuccess: () => {
      // キャッシュの無効化
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // 画面遷移
      router.push("/users");
    },
    onError: () => {
      // エラー処理
      setError("root", {
        message: "ユーザーの作成に失敗しました。",
      });
    },
  });
});
```

### 6. JSDocコメントを追加する

フックの目的と責務を明確にします。

```tsx
/**
 * ログインページのカスタムフック
 *
 * ログインフォームの状態管理と認証処理を担当します。
 * ログイン成功時にはトークンを保存し、ユーザー一覧ページに遷移します。
 */
export const useLogin = () => {
  // ...
};
```

## 参考リソース

- [React Hook Form - useForm API](https://react-hook-form.com/docs/useform)
- [React Hook Form - handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit)
- [React Hook Form - setError](https://react-hook-form.com/docs/useform/seterror)
- [Zod - Schema validation](https://zod.dev/)
- [フォームとバリデーション](../04-forms-validation/index.md)
