# フォーム実装（React Hook Form + Zod）

このドキュメントでは、React Hook FormとZodを組み合わせたフォーム実装方法を説明します。

## 目次

1. [基本的なフォーム](#基本的なフォーム)
2. [バリデーションルール](#バリデーションルール)
3. [複雑なフォーム](#複雑なフォーム)
4. [エラーハンドリング](#エラーハンドリング)
5. [再利用可能なフォームコンポーネント](#再利用可能なフォームコンポーネント)
6. [実装例](#実装例)
7. [ベストプラクティス](#ベストプラクティス)

---

## 基本的なフォーム

### シンプルなログインフォーム

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

// スキーマから型を推論
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
    try {
      console.log('ログインデータ:', data)
      // API呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('ログイン成功')
    } catch (error) {
      alert('ログイン失敗')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input id="email" type="email" {...register('email')} />
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

### Zodスキーマの定義

```typescript
// src/features/users/schemas/user-schema.ts
import { z } from 'zod'
import { VALIDATION } from '@/config/constants'

// 基本的なバリデーション
export const userSchema = z.object({
  // 必須フィールド
  name: z
    .string()
    .min(1, '名前は必須です')
    .max(VALIDATION.NAME_MAX_LENGTH, `名前は${VALIDATION.NAME_MAX_LENGTH}文字以内で入力してください`),

  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('正しいメールアドレスを入力してください')
    .max(VALIDATION.EMAIL_MAX_LENGTH),

  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `パスワードは${VALIDATION.PASSWORD_MIN_LENGTH}文字以上必要です`)
    .max(VALIDATION.PASSWORD_MAX_LENGTH)
    .regex(/[A-Z]/, 'パスワードには大文字を1文字以上含める必要があります')
    .regex(/[a-z]/, 'パスワードには小文字を1文字以上含める必要があります')
    .regex(/[0-9]/, 'パスワードには数字を1文字以上含める必要があります'),

  // オプショナルフィールド
  age: z.number().int().min(0).max(150).optional(),

  // 選択肢
  role: z.enum(['admin', 'user', 'guest'], {
    errorMap: () => ({ message: '有効な役割を選択してください' }),
  }),

  // 真偽値
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: '利用規約に同意する必要があります',
  }),

  // 日付
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付の形式が正しくありません（YYYY-MM-DD）'),
})

// パスワード確認付き
export const userWithPasswordConfirmSchema = userSchema
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'], // エラーを表示するフィールド
  })

// 更新用（全てオプショナル）
export const updateUserSchema = userSchema.partial()

// 型推論
export type UserFormData = z.infer<typeof userSchema>
export type UserWithPasswordConfirmData = z.infer<typeof userWithPasswordConfirmSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
```

### カスタムバリデーション

```typescript
// src/features/users/schemas/custom-validations.ts
import { z } from 'zod'

// 半角英数字チェック
export const alphanumericSchema = z.string().regex(/^[a-zA-Z0-9]+$/, '半角英数字のみ入力可能です')

// 電話番号チェック（日本）
export const phoneSchema = z
  .string()
  .regex(/^0\d{9,10}$/, '正しい電話番号を入力してください（例: 09012345678）')

// URLチェック
export const urlSchema = z.string().url('正しいURLを入力してください')

// カスタム非同期バリデーション（メールアドレスの重複チェック）
export const uniqueEmailSchema = z.string().email().refine(
  async (email) => {
    // API呼び出し（実装例）
    const response = await fetch(`/api/users/check-email?email=${email}`)
    const data = await response.json()

    return !data.exists
  },
  {
    message: 'このメールアドレスは既に使用されています',
  }
)

// ファイルバリデーション
export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'ファイルサイズは5MB以下にしてください')
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
    '画像ファイル（JPEG, PNG, GIF）のみアップロード可能です'
  )
```

---

## 複雑なフォーム

### ネストしたフィールド

```typescript
// src/features/users/schemas/profile-schema.ts
import { z } from 'zod'

export const profileSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, '名は必須です'),
    lastName: z.string().min(1, '姓は必須です'),
    birthDate: z.string(),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    address: z
      .object({
        postalCode: z.string().regex(/^\d{7}$/, '郵便番号は7桁で入力してください'),
        prefecture: z.string(),
        city: z.string(),
        street: z.string(),
      })
      .optional(),
  }),
})

export type ProfileFormData = z.infer<typeof profileSchema>
```

```typescript
// src/features/users/components/profile-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, ProfileFormData } from '../schemas/profile-schema'

export const ProfileForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = (data: ProfileFormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>個人情報</h2>
      <input {...register('personalInfo.firstName')} placeholder="名" />
      {errors.personalInfo?.firstName && <p>{errors.personalInfo.firstName.message}</p>}

      <input {...register('personalInfo.lastName')} placeholder="姓" />
      {errors.personalInfo?.lastName && <p>{errors.personalInfo.lastName.message}</p>}

      <h2>連絡先</h2>
      <input {...register('contact.email')} placeholder="メール" />
      {errors.contact?.email && <p>{errors.contact.email.message}</p>}

      <h3>住所（任意）</h3>
      <input {...register('contact.address.postalCode')} placeholder="郵便番号" />
      {errors.contact?.address?.postalCode && <p>{errors.contact.address.postalCode.message}</p>}

      <button type="submit">送信</button>
    </form>
  )
}
```

### 配列フィールド

```typescript
// src/features/tasks/schemas/task-schema.ts
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  items: z
    .array(
      z.object({
        description: z.string().min(1, '説明は必須です'),
        completed: z.boolean().default(false),
      })
    )
    .min(1, '少なくとも1つのアイテムを追加してください'),
})

export type TaskFormData = z.infer<typeof taskSchema>
```

```typescript
// src/features/tasks/components/task-form.tsx
'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, TaskFormData } from '../schemas/task-schema'

export const TaskForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
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

  const onSubmit = (data: TaskFormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>タイトル</label>
        <input {...register('title')} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <h3>アイテム</h3>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.description`)} placeholder="説明" />
          {errors.items?.[index]?.description && (
            <p>{errors.items[index]?.description?.message}</p>
          )}

          <label>
            <input type="checkbox" {...register(`items.${index}.completed`)} />
            完了
          </label>

          <button type="button" onClick={() => remove(index)}>
            削除
          </button>
        </div>
      ))}

      {errors.items && <p>{errors.items.message}</p>}

      <button type="button" onClick={() => append({ description: '', completed: false })}>
        アイテムを追加
      </button>

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## エラーハンドリング

### フィールドエラーの表示

```typescript
// src/components/form/form-error.tsx
interface FormErrorProps {
  error?: {
    message?: string
  }
}

export const FormError = ({ error }: FormErrorProps) => {
  if (!error?.message) return null

  return <p className="text-red-500 text-sm mt-1">{error.message}</p>
}
```

```typescript
// 使用例
import { FormError } from '@/components/form/form-error'

<input {...register('email')} />
<FormError error={errors.email} />
```

### サーバーエラーの表示

```typescript
// src/features/users/components/create-user-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useCreateUser } from '../api/mutations'
import { userSchema, UserFormData } from '../schemas/user-schema'

export const CreateUserForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const createUser = useCreateUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    setServerError(null)

    try {
      await createUser.mutateAsync(data)
      alert('ユーザーを作成しました')
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

      <div>
        <label>名前</label>
        <input {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label>メールアドレス</label>
        <input {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '作成'}
      </button>
    </form>
  )
}
```

---

## 再利用可能なフォームコンポーネント

### テキストフィールド

```typescript
// src/components/form/text-field.tsx
import { UseFormRegister, FieldError } from 'react-hook-form'

interface TextFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number'
  register: UseFormRegister<any>
  error?: FieldError
  placeholder?: string
  required?: boolean
}

export const TextField = ({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  required,
}: TextFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}
```

### セレクトフィールド

```typescript
// src/components/form/select-field.tsx
import { UseFormRegister, FieldError } from 'react-hook-form'

interface SelectFieldProps {
  label: string
  name: string
  options: { value: string; label: string }[]
  register: UseFormRegister<any>
  error?: FieldError
  required?: boolean
}

export const SelectField = ({ label, name, options, register, error, required }: SelectFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">選択してください</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}
```

### 使用例

```typescript
// src/features/users/components/user-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/components/form/text-field'
import { SelectField } from '@/components/form/select-field'
import { userSchema, UserFormData } from '../schemas/user-schema'

export const UserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = (data: UserFormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField label="名前" name="name" register={register} error={errors.name} required />

      <TextField
        label="メールアドレス"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        required
      />

      <SelectField
        label="役割"
        name="role"
        options={[
          { value: 'admin', label: '管理者' },
          { value: 'user', label: 'ユーザー' },
          { value: 'guest', label: 'ゲスト' },
        ]}
        register={register}
        error={errors.role}
        required
      />

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## 実装例

### 完全な実装例: ユーザー登録フォーム

```typescript
// src/features/auth/components/register-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { TextField } from '@/components/form/text-field'
import { useCreateUser } from '../api/mutations'

const registerSchema = z
  .object({
    name: z.string().min(1, '名前は必須です').max(100),
    email: z.string().email('正しいメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上必要です')
      .regex(/[A-Z]/, '大文字を1文字以上含める必要があります')
      .regex(/[a-z]/, '小文字を1文字以上含める必要があります')
      .regex(/[0-9]/, '数字を1文字以上含める必要があります'),
    passwordConfirm: z.string(),
    agreedToTerms: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'],
  })
  .refine((data) => data.agreedToTerms === true, {
    message: '利用規約に同意する必要があります',
    path: ['agreedToTerms'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const router = useRouter()
  const createUser = useCreateUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await createUser.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      alert('登録が完了しました')
      router.push('/login')
    } catch (error: any) {
      alert(error.message || '登録に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">ユーザー登録</h1>

      <TextField label="名前" name="name" register={register} error={errors.name} required />

      <TextField
        label="メールアドレス"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        required
      />

      <TextField
        label="パスワード"
        name="password"
        type="password"
        register={register}
        error={errors.password}
        required
      />

      <TextField
        label="パスワード（確認）"
        name="passwordConfirm"
        type="password"
        register={register}
        error={errors.passwordConfirm}
        required
      />

      <div className="mb-4">
        <label className="flex items-center">
          <input type="checkbox" {...register('agreedToTerms')} className="mr-2" />
          <span className="text-sm">
            <a href="/terms" className="text-blue-600 underline">
              利用規約
            </a>
            に同意します
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? '登録中...' : '登録'}
      </button>
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
// ✅ Good: スキーマから型を推論
type UserFormData = z.infer<typeof userSchema>

// ❌ Bad: 別々に型を定義
interface UserFormData {
  name: string
  email: string
}
```

### 3. デフォルト値を設定

```typescript
// ✅ Good: デフォルト値を設定
useForm<UserFormData>({
  defaultValues: {
    name: '',
    email: '',
    role: 'user',
  },
})
```

### 4. エラーメッセージは日本語で

```typescript
// ✅ Good: わかりやすい日本語メッセージ
z.string().min(8, 'パスワードは8文字以上必要です')

// ❌ Bad: 英語メッセージ
z.string().min(8, 'String must contain at least 8 character(s)')
```

### 5. 再利用可能なコンポーネント化

```typescript
// ✅ Good: TextField, SelectFieldなどのコンポーネントを作成
<TextField label="名前" name="name" register={register} error={errors.name} />

// ❌ Bad: 毎回同じコードを書く
<div>
  <label>名前</label>
  <input {...register('name')} />
  {errors.name && <p>{errors.name.message}</p>}
</div>
```

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[REST API通信](./05-api-client.md)** - フォームからのAPI呼び出し
- **[プロジェクト構成](./02-project-structure.md)** - スキーマファイルの配置場所
- **[使用ライブラリ一覧](./03-libraries.md)** - React Hook Form, Zodの説明

### 外部リンク

- [React Hook Form公式ドキュメント](https://react-hook-form.com/)
- [Zod公式ドキュメント](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
