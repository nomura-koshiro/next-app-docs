# フォーム作成手順(React Hook Form + Zod)

このガイドでは、React Hook FormとZodを使用したフォームの作成手順を説明します。バリデーションスキーマの定義から、Controlled/非Controlledコンポーネントの使い分け、エラーハンドリングまで、フォーム開発に必要なすべてを網羅します。

## 目次

1. [作成するもの](#-作成するもの)
2. [ステップ1: バリデーションスキーマを作成](#ステップ1-バリデーションスキーマを作成)
3. [ステップ2: フォームコンポーネントを作成](#ステップ2-フォームコンポーネントを作成)
4. [ステップ3: Controlled Fieldコンポーネントの実装](#ステップ3-controlled-fieldコンポーネントの実装)
5. [ステップ4: 編集フォームの場合](#ステップ4-編集フォームの場合)
6. [Zodバリデーションパターン集](#zodバリデーションパターン集)
7. [エラーハンドリングパターン](#エラーハンドリングパターン)
8. [チェックリスト](#-チェックリスト)
9. [Tips](#-tips)

---

## 📋 作成するもの

- バリデーションスキーマ(`{resource}-form.schema.ts`)
- ルートコンポーネント(`routes/new-{resource}/new-{resource}.tsx` など)
- カスタムフック(`routes/new-{resource}/new-{resource}.hook.ts`)
- API Mutation(`create-{resource}.ts` など)

---

## ステップ1: バリデーションスキーマを作成

```bash
# スキーマファイルを作成
mkdir -p src/features/sample-users/schemas
```

```typescript
// src/features/sample-users/schemas/user-form.schema.ts
import { z } from 'zod'

/**
 * ユーザーフォームのバリデーションスキーマ
 */
export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: '名前は必須です' })
    .max(100, { message: '名前は100文字以内で入力してください' }),
  email: z
    .string()
    .min(1, { message: 'メールアドレスは必須です' })
    .email({ message: '有効なメールアドレスを入力してください' }),
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'ロールを選択してください' }),
  }),
})

/**
 * ユーザーフォームの型定義
 */
export type UserFormValues = z.infer<typeof userFormSchema>
```

---

## ステップ2: フォームコンポーネントを作成

### 基本パターン(Controlled Components)

```typescript
// src/features/sample-users/routes/new-user/new-user.tsx
'use client'

import { Button } from '@/components/sample-ui/button'
import { Card, CardContent } from '@/components/sample-ui/card'
import {
  ControlledInputField,
  ControlledSelectField,
} from '@/components/sample-ui/form-field/controlled-form-field'
import { ErrorMessage } from '@/components/sample-ui/error-message'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { useNewUser } from './new-user.hook'

export default function NewUserPage() {
  const {
    control,
    handleSubmit,
    createUserMutation,
    handleCancel,
  } = useNewUser()

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="新規ユーザー作成"
        description="新しいユーザーの情報を入力してください"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* フィールド */}
            <ControlledInputField
              control={control}
              name="name"
              label="名前"
              placeholder="山田太郎"
              required
            />

            <ControlledInputField
              control={control}
              name="email"
              label="メールアドレス"
              type="email"
              placeholder="yamada@example.com"
              required
            />

            <ControlledSelectField
              control={control}
              name="role"
              label="ロール"
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
              required
            />

            {/* エラー表示 */}
            {createUserMutation.isError && (
              <ErrorMessage message="ユーザーの作成に失敗しました" />
            )}

            {/* ボタン */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex-1"
              >
                {createUserMutation.isPending ? '作成中...' : '作成'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
```

```typescript
// src/features/sample-users/routes/new-user/new-user.hook.ts
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateUser } from '@/features/sample-users/api/create-user'
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema'

export const useNewUser = () => {
  const router = useRouter()

  // 1. useFormの設定
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  })

  // 2. Mutationの設定
  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        router.push('/sample-users')
      },
    },
  })

  // 3. Submit処理
  const onSubmit = (data: UserFormValues) => {
    createUserMutation.mutate(data)
  }

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="新規ユーザー作成"
        description="新しいユーザーの情報を入力してください"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 4. 各フィールド */}
            <ControlledInputField
              control={control}
              name="name"
              label="名前"
              placeholder="山田太郎"
              required
            />

            <ControlledInputField
              control={control}
              name="email"
              label="メールアドレス"
              type="email"
              placeholder="yamada@example.com"
              required
            />

            <ControlledSelectField
              control={control}
              name="role"
              label="ロール"
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
              required
            />

            {/* 5. エラー表示 */}
            {createUserMutation.isError && (
              <ErrorMessage message="ユーザーの作成に失敗しました" />
            )}

            {/* 6. ボタン */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex-1"
              >
                {createUserMutation.isPending ? '作成中...' : '作成'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/sample-users')}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
```

---

## ステップ3: Controlled Fieldコンポーネントの実装

### InputField

```typescript
// src/components/ui/form-field/controlled-form-field.tsx
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { Label } from '@/components/sample-ui/label'
import { Input } from '@/components/sample-ui/input'

type ControlledInputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}

export const ControlledInputField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: ControlledInputFieldProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.error ? 'true' : 'false'}
          />
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
```

### SelectField

```typescript
// src/components/ui/form-field/controlled-form-field.tsx(続き)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/sample-ui/select'

type ControlledSelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  options: Array<{ value: string; label: string }>
  required?: boolean
}

export const ControlledSelectField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
}: ControlledSelectFieldProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={name} aria-invalid={fieldState.error ? 'true' : 'false'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
```

---

## ステップ4: 編集フォームの場合

```typescript
// src/features/sample-users/routes/edit-user/edit-user.tsx
'use client'

import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/sample-ui/error-message'
import { Button } from '@/components/sample-ui/button'
import { Card, CardContent } from '@/components/sample-ui/card'
import {
  ControlledInputField,
  ControlledSelectField,
} from '@/components/sample-ui/form-field/controlled-form-field'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { useEditUser } from './edit-user.hook'

type Props = {
  userId: string
}

export default function EditUserPage({ userId }: Props) {
  const {
    control,
    handleSubmit,
    isLoading,
    error,
    updateUserMutation,
    handleCancel,
  } = useEditUser(userId)

  // ローディング・エラー処理
  if (isLoading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error.message} fullScreen />

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="ユーザー編集"
        description="ユーザー情報を更新してください"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
              required
            />

            {updateUserMutation.isError && (
              <ErrorMessage message="ユーザーの更新に失敗しました" />
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="flex-1"
              >
                {updateUserMutation.isPending ? '更新中...' : '更新'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
```

```typescript
// src/features/sample-users/routes/edit-user/edit-user.hook.ts
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/features/sample-users/api/get-user'
import { useUpdateUser } from '@/features/sample-users/api/update-user'
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema'

export const useEditUser = (userId: string) => {
  const router = useRouter()

  // 1. データ取得
  const { data, isLoading, error } = useUser({ userId })

  // 2. フォーム設定
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    // 既存データを設定
    values: data?.data
      ? {
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
        }
      : undefined,
  })

  // 3. 更新Mutation
  const updateUserMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        router.push('/sample-users')
      },
    },
  })

  const handleSubmit = handleFormSubmit((formData: UserFormValues) => {
    updateUserMutation.mutate({
      userId,
      data: formData,
    })
  })

  const handleCancel = () => {
    router.back()
  }

  return {
    control,
    handleSubmit,
    isLoading,
    error,
    updateUserMutation,
    handleCancel,
  }
}
```

---

## Zodバリデーションパターン集

### 文字列

```typescript
// 必須
name: z.string().min(1, { message: '必須項目です' })

// 最小・最大文字数
name: z.string().min(2, '2文字以上').max(50, '50文字以内')

// メールアドレス
email: z.string().email('正しいメールアドレスを入力してください')

// URL
website: z.string().url('正しいURLを入力してください')

// 正規表現
phone: z.string().regex(/^\d{3}-\d{4}-\d{4}$/, '形式: 000-0000-0000')
```

### 数値

```typescript
// 数値
age: z.number().min(0, '0以上').max(150, '150以下')

// 整数
count: z.number().int('整数を入力してください')

// 正の数
price: z.number().positive('正の数を入力してください')

// 文字列を数値に変換
age: z.coerce.number().min(0)
```

### 日付

```typescript
// 日付
birthDate: z.date()

// 文字列から日付に変換
birthDate: z.coerce.date()

// 未来の日付を禁止
birthDate: z.date().max(new Date(), '未来の日付は指定できません')
```

### 列挙型

```typescript
// enum
role: z.enum(['user', 'admin', 'moderator'])

// カスタムエラーメッセージ
role: z.enum(['user', 'admin'], {
  errorMap: () => ({ message: 'ロールを選択してください' }),
})
```

### オプショナル・Nullable

```typescript
// オプション(undefined許可)
bio: z.string().optional()

// nullable(null許可)
middleName: z.string().nullable()

// 両方許可
notes: z.string().nullable().optional()

// 空文字列をnullに変換
bio: z.string().transform((val) => val || null)
```

### 配列

```typescript
// 配列
tags: z.array(z.string())

// 最小・最大要素数
tags: z.array(z.string()).min(1, '最低1つ選択').max(5, '最大5つ')

// 非空配列
tags: z.array(z.string()).nonempty('最低1つ選択してください')
```

### オブジェクト

```typescript
// ネストしたオブジェクト
address: z.object({
  zip: z.string().regex(/^\d{3}-\d{4}$/),
  city: z.string().min(1),
  street: z.string().min(1),
})
```

### 条件付きバリデーション

```typescript
// refineで複雑な条件
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'], // エラー表示位置
  })

// superRefineで複数の条件
const schema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).superRefine((data, ctx) => {
  if (data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '終了日は開始日より後にしてください',
      path: ['endDate'],
    })
  }
})
```

---

## エラーハンドリングパターン

### フィールド単位のエラー

```typescript
const {
  control,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(schema),
})

// エラーメッセージの表示
{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
```

### フォーム全体のエラー

```typescript
const createUserMutation = useCreateUser()

{createUserMutation.isError && (
  <ErrorMessage message={createUserMutation.error.message || 'エラーが発生しました'} />
)}
```

### カスタムエラーメッセージ

```typescript
const onSubmit = async (data: FormValues) => {
  await createUserMutation.mutateAsync(data)
    .catch((error) => {
      if (error.response?.status === 409) {
        setError('email', {
          type: 'manual',
          message: 'このメールアドレスは既に使用されています',
        })
      }
    })
}
```

---

## 🎯 チェックリスト

### バリデーションスキーマ

- [ ] `schemas/` ディレクトリを作成
- [ ] Zodスキーマを定義(`{resource}-form.schema.ts`)
- [ ] 型を `z.infer` で生成
- [ ] エラーメッセージを日本語化

### フォームコンポーネント

- [ ] `'use client'` を追加
- [ ] `useForm` を設定
  - [ ] `resolver: zodResolver(schema)`
  - [ ] `defaultValues` を設定
- [ ] Mutationフックを設定(`useCreate*`, `useUpdate*`)
- [ ] `handleSubmit` で送信処理
- [ ] Controlled Fieldコンポーネントを使用
- [ ] エラー表示を実装
- [ ] ローディング状態を表示(`isPending`)

### 編集フォームの場合

- [ ] データ取得フック(`useGet*`)を追加
- [ ] `values` にデータを設定(`defaultValues` の代わり)
- [ ] ローディング・エラー処理を追加

---

## 💡 Tips

### defaultValues vs values

| 項目 | `defaultValues` | `values` |
|------|----------------|----------|
| **用途** | 新規作成フォーム | 編集フォーム |
| **データ** | 固定値 | 取得したデータ |
| **再レンダリング** | 初回のみ | データ変更時に再設定 |

```typescript
// 新規作成
useForm({
  defaultValues: { name: '', email: '' },
})

// 編集
useForm({
  values: data?.data, // データが変わると再設定される
})
```

### 非Controlled vs Controlled

| 項目 | 非Controlled(`register`) | Controlled(`Controller`) |
|------|--------------------------|---------------------------|
| **実装** | シンプル | やや複雑 |
| **パフォーマンス** | 良い | やや劣る |
| **使用場面** | Input, Textarea | Select, Checkbox, Custom |

```typescript
// 非Controlled(推奨: シンプルなInput)
const { register } = useForm()
<Input {...register('name')} />

// Controlled(推奨: Select, CustomUI)
const { control } = useForm()
<Controller
  control={control}
  name="role"
  render={({ field }) => <Select {...field} />}
/>
```

### mutate vs mutateAsync

```typescript
// mutate: エラーをcatchしない
const onSubmit = (data) => {
  createUser.mutate(data) // エラーはonErrorで処理
}

// mutateAsync: エラーをcatchできる
const onSubmit = async (data) => {
  await createUser.mutateAsync(data)
    .catch((error) => {
      // カスタムエラー処理
    })
}
```

---

## 参考リンク

- [フォームとバリデーション](../04-development/04-forms-validation.md)
- [API作成](./02-create-api.md)
- [React Hook Form公式ドキュメント](https://react-hook-form.com/)
- [Zod公式ドキュメント](https://zod.dev/)
