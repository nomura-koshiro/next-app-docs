# フォーム実装（React Hook Form + Zod）

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
// src/features/users/schemas/user-schema.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上必要です')
    .regex(/[A-Z]/, '大文字を1文字以上含める必要があります')
    .regex(/[a-z]/, '小文字を1文字以上含める必要があります')
    .regex(/[0-9]/, '数字を1文字以上含める必要があります'),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['admin', 'user', 'guest']),
})

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

```typescript
// src/components/form/text-field.tsx
import { UseFormRegister, FieldError } from 'react-hook-form'

type TextFieldProps = {
  label: string
  name: string
  type?: 'text' | 'email' | 'password'
  register: UseFormRegister<any>
  error?: FieldError
  required?: boolean
}

export const TextField = ({
  label,
  name,
  type = 'text',
  register,
  error,
  required,
}: TextFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

// 使用例
<TextField
  label="名前"
  name="name"
  register={register}
  error={errors.name}
  required
/>
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
