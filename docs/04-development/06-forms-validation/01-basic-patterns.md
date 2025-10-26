# 基本パターン

React Hook FormとZodを使用した基本的なフォーム実装パターンを説明します。

---

## シンプルなログインフォーム

```typescript
// src/features/auth/components/login-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // API呼び出し
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input id="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">パスワード</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  )
}
```

---

## 基本パターンの構成要素

### 1. バリデーションスキーマの定義

```typescript
const loginSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})
```

Zodを使用してフォームのバリデーションルールを定義します。

### 2. 型の推論

```typescript
type LoginFormData = z.infer<typeof loginSchema>
```

`z.infer`を使用してスキーマから型を自動生成します。手動で型定義する必要はありません。

### 3. useFormの設定

```typescript
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
})
```

- `register`: 入力フィールドを登録
- `handleSubmit`: フォーム送信を処理
- `errors`: バリデーションエラー
- `isSubmitting`: 送信中の状態

### 4. フィールドの登録

```typescript
<input {...register('email')} />
```

スプレッド構文で入力フィールドをReact Hook Formに登録します。

### 5. エラーメッセージの表示

```typescript
{errors.email && <p>{errors.email.message}</p>}
```

バリデーションエラーがある場合にメッセージを表示します。

---

## フォーム送信の処理

```typescript
const onSubmit = async (data: LoginFormData) => {
  await loginUser(data)
    .then(() => {
      // 成功時の処理
    })
    .catch((error) => {
      // エラー処理
    })
}
```

`handleSubmit`がバリデーションを通過したデータを`onSubmit`に渡します。

---

## デフォルト値の設定

```typescript
const { register, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: '',
  },
})
```

初期値を設定する場合は`defaultValues`を使用します。

---

## 編集フォームの場合

```typescript
export const EditUserForm = ({ user }: { user: User }) => {
  const { register, handleSubmit } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })

  const onSubmit = async (data: UserFormData) => {
    await updateUser(user.id, data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
    </form>
  )
}
```

編集フォームでは、既存データを`defaultValues`にセットします。

---

## 関連リンク

- [バリデーションルール](./02-validation-rules.md) - Zodのバリデーションルール詳細
- [再利用可能なフォームコンポーネント](./04-reusable-components.md) - ControlledFormField
- [サーバーエラーハンドリング](./07-server-errors.md) - APIエラーの処理方法
