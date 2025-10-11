# フォーム実装（React Hook Form + Zod）

本ドキュメントでは、React Hook FormとZodを使用したフォーム実装とバリデーションの方法について説明します。型安全なフォーム開発のためのベストプラクティスと実装パターンを提供します。

## 目次

1. [基本パターン](#基本パターン)
2. [バリデーションルール](#バリデーションルール)
3. [複雑なフォーム](#複雑なフォーム)
4. [サーバーエラーハンドリング](#サーバーエラーハンドリング)
5. [再利用可能なフォームコンポーネント](#再利用可能なフォームコンポーネント)
6. [ベストプラクティス](#ベストプラクティス)

---

## 基本パターン

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

## バリデーションルール

### 基本的なスキーマ

```typescript
// src/features/users/schemas/user-form.schema.ts
import { z } from 'zod'

/**
 * ユーザーフォームのバリデーションスキーマ
 * 新規作成・編集フォームで使用
 */
export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "名前は必須です" })
    .max(100, { message: "名前は100文字以内で入力してください" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  role: z.enum(["user", "admin"], {
    message: "ロールを選択してください",
  }),
})

/**
 * ユーザーフォームの型定義
 */
export type UserFormValues = z.infer<typeof userFormSchema>

// パスワード確認
export const userWithPasswordConfirmSchema = userSchema
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'],
  })

// 更新用（全てオプショナル)
export const updateUserSchema = userSchema.partial()

// 型推論
export type UserFormData = z.infer<typeof userSchema>
```

### カスタムバリデーション

```typescript
// 電話番号
export const phoneSchema = z
  .string()
  .regex(/^0\d{9,10}$/, '正しい電話番号を入力してください')

// ファイルバリデーション
export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'ファイルサイズは5MB以下')
  .refine(
    (file) => ['image/jpeg', 'image/png'].includes(file.type),
    '画像ファイル（JPEG, PNG）のみ'
  )
```

---

## 複雑なフォーム

### ネストしたフィールド

```typescript
export const profileSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
  contact: z.object({
    email: z.string().email(),
    address: z.object({
      postalCode: z.string().regex(/^\d{7}$/),
      city: z.string(),
    }).optional(),
  }),
})

// 使用例
<input {...register('personalInfo.firstName')} />
{errors.personalInfo?.firstName && <p>{errors.personalInfo.firstName.message}</p>}
```

### 配列フィールド

```typescript
import { useFieldArray } from 'react-hook-form'

export const taskSchema = z.object({
  title: z.string().min(1),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        completed: z.boolean().default(false),
      })
    )
    .min(1, '少なくとも1つのアイテムを追加してください'),
})

export const TaskForm = () => {
  const { register, control, handleSubmit } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      items: [{ description: '', completed: false }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />

      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.description`)} />
          <input type="checkbox" {...register(`items.${index}.completed`)} />
          <button type="button" onClick={() => remove(index)}>削除</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ description: '', completed: false })}>
        アイテムを追加
      </button>

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## サーバーエラーハンドリング

```typescript
export const CreateUserForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const createUser = useCreateUser()
  const { register, handleSubmit, setError } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    setServerError(null)

    try {
      await createUser.mutateAsync(data)
    } catch (error: any) {
      // サーバーからのエラーをフィールドにセット
      if (error.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          setError(field as keyof UserFormData, {
            message: Array.isArray(messages) ? messages[0] : String(messages),
          })
        })
      } else {
        setServerError(error.message || 'エラーが発生しました')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {serverError}
        </div>
      )}
      {/* フォームフィールド */}
    </form>
  )
}
```

---

## 再利用可能なフォームコンポーネント

### ControlledFormFieldコンポーネント

React Hook FormのControllerを使用した、型安全な再利用可能なフォームコンポーネント群です。

#### ControlledInputField

```typescript
import { ControlledInputField } from '@/components/ui/form-field/controlled-form-field'

// 使用例
<ControlledInputField
  control={control}
  name="name"
  label="名前"
  placeholder="山田太郎"
  required
/>
```

#### ControlledSelectField

```typescript
<ControlledSelectField
  control={control}
  name="role"
  label="ロール"
  options={[
    { value: 'user', label: 'ユーザー' },
    { value: 'admin', label: '管理者' },
  ]}
  required
/>
```

#### ControlledTextareaField

```typescript
<ControlledTextareaField
  control={control}
  name="description"
  label="説明"
  placeholder="詳細を入力してください"
  rows={5}
/>
```

#### ControlledCheckboxField

```typescript
<ControlledCheckboxField
  control={control}
  name="terms"
  label="利用規約に同意する"
  description="サービス利用規約とプライバシーポリシーに同意します"
/>
```

#### ControlledRadioGroupField

```typescript
<ControlledRadioGroupField
  control={control}
  name="plan"
  label="プラン"
  options={[
    { value: 'free', label: '無料プラン', description: '基本機能のみ利用可能' },
    { value: 'pro', label: 'Proプラン', description: '全機能利用可能' },
  ]}
/>
```

#### ControlledSwitchField

```typescript
<ControlledSwitchField
  control={control}
  name="notifications"
  label="通知を有効にする"
  description="新しいメッセージを受信した際に通知を表示します"
/>
```

#### ControlledDateField

```typescript
<ControlledDateField
  control={control}
  name="birthDate"
  label="生年月日"
  required
/>
```

### 完全な使用例

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userFormSchema, type UserFormValues } from '@/features/users/schemas/user-form.schema'
import {
  ControlledInputField,
  ControlledSelectField,
} from '@/components/ui/form-field/controlled-form-field'

export const UserForm = () => {
  const { control, handleSubmit } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  })

  const onSubmit = (data: UserFormValues) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ControlledInputField
        control={control}
        name="name"
        label="名前"
        required
      />

      <ControlledInputField
        control={control}
        name="email"
        label="メールアドレス"
        type="email"
        required
      />

      <ControlledSelectField
        control={control}
        name="role"
        label="ロール"
        options={[
          { value: 'user', label: 'ユーザー' },
          { value: 'admin', label: '管理者' },
        ]}
        required
      />

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## ベストプラクティス

### 1. スキーマは別ファイルに分離

```typescript
// ✅ Good: schemas/user-schema.ts
export const userSchema = z.object({ ... })

// ❌ Bad: コンポーネント内で定義
const UserForm = () => {
  const schema = z.object({ ... })
}
```

### 2. 型推論を活用

```typescript
// ✅ Good
type UserFormData = z.infer<typeof userSchema>

// ❌ Bad: 別々に型を定義
interface UserFormData {
  name: string
  email: string
}
```

### 3. デフォルト値を設定

```typescript
useForm<UserFormData>({
  defaultValues: {
    name: '',
    email: '',
    role: 'user',
  },
})
```

---

## 参考リンク

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
