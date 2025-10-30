# 再利用可能なフォームコンポーネント

React Hook FormのControllerを使用した、型安全な再利用可能なフォームコンポーネント群について説明します。

---

## ControlledFormFieldコンポーネント

### 概要

`ControlledFormField`コンポーネントは以下の特徴を持ちます：

- React Hook FormのControllerベース
- 型安全（TypeScript完全対応）
- エラーメッセージ自動表示
- 統一されたUIデザイン
- 簡単に使用できるAPI

---

## 利用可能なコンポーネント

### 1. ControlledInputField

テキスト入力フィールド。

```typescript
import { ControlledInputField } from '@/components/sample-ui/form-field/controlled-form-field'

<ControlledInputField
  control={control}
  name="name"
  label="名前"
  placeholder="山田太郎"
  required
/>
```

**Props:**

- `control` - React Hook Formのcontrol
- `name` - フィールド名
- `label` - ラベルテキスト
- `placeholder` - プレースホルダー
- `type` - input type（text, email, password, number など）
- `required` - 必須マーク表示
- `disabled` - 無効化

---

### 2. ControlledSelectField

セレクトボックス。

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

**Props:**

- `options` - 選択肢の配列（`{ value: string, label: string }[]`）
- その他は`ControlledInputField`と同様

---

### 3. ControlledTextareaField

テキストエリア（複数行入力）。

```typescript
<ControlledTextareaField
  control={control}
  name="description"
  label="説明"
  placeholder="詳細を入力してください"
  rows={5}
/>
```

**Props:**

- `rows` - 行数
- その他は`ControlledInputField`と同様

---

### 4. ControlledCheckboxField

チェックボックス。

```typescript
<ControlledCheckboxField
  control={control}
  name="terms"
  label="利用規約に同意する"
  description="サービス利用規約とプライバシーポリシーに同意します"
/>
```

**Props:**

- `description` - 補足説明テキスト
- その他は`ControlledInputField`と同様

---

### 5. ControlledRadioGroupField

ラジオボタングループ。

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

**Props:**

- `options` - 選択肢の配列（`{ value: string, label: string, description?: string }[]`）

---

### 6. ControlledSwitchField

スイッチ（トグル）。

```typescript
<ControlledSwitchField
  control={control}
  name="notifications"
  label="通知を有効にする"
  description="新しいメッセージを受信した際に通知を表示します"
/>
```

**Props:**

- `description` - 補足説明テキスト

---

### 7. ControlledDateField

日付入力フィールド。

```typescript
<ControlledDateField
  control={control}
  name="birthDate"
  label="生年月日"
  required
/>
```

---

## 完全な使用例

### ユーザーフォーム

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userFormSchema, type UserFormValues } from '@/features/users/schemas/user-form.schema'
import {
  ControlledInputField,
  ControlledSelectField,
  ControlledTextareaField,
} from '@/components/sample-ui/form-field/controlled-form-field'

export const UserForm = () => {
  const { control, handleSubmit } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      bio: '',
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
        placeholder="山田太郎"
        required
      />

      <ControlledInputField
        control={control}
        name="email"
        label="メールアドレス"
        type="email"
        placeholder="example@example.com"
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

      <ControlledTextareaField
        control={control}
        name="bio"
        label="自己紹介"
        placeholder="自己紹介を入力してください"
        rows={5}
      />

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## 登録フォームの例

```typescript
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ControlledInputField,
  ControlledCheckboxField,
} from '@/components/sample-ui/form-field/controlled-form-field'
import { emailSchema, strongPasswordSchema, termsSchema } from '@/schemas/fields'

const signupSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
  terms: termsSchema,
})

type SignupFormValues = z.infer<typeof signupSchema>

export const SignupForm = () => {
  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      terms: false,
    },
  })

  const onSubmit = (data: SignupFormValues) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ControlledInputField
        control={control}
        name="email"
        label="メールアドレス"
        type="email"
        required
      />

      <ControlledInputField
        control={control}
        name="password"
        label="パスワード"
        type="password"
        required
      />

      <ControlledCheckboxField
        control={control}
        name="terms"
        label="利用規約に同意する"
      />

      <button type="submit">アカウントを作成</button>
    </form>
  )
}
```

---

## プロフィール設定フォームの例

```typescript
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ControlledInputField,
  ControlledRadioGroupField,
  ControlledSwitchField,
} from '@/components/sample-ui/form-field/controlled-form-field'

const profileSchema = z.object({
  displayName: z.string().min(1),
  plan: z.enum(['free', 'pro']),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export const ProfileSettingsForm = () => {
  const { control, handleSubmit } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ControlledInputField
        control={control}
        name="displayName"
        label="表示名"
        required
      />

      <ControlledRadioGroupField
        control={control}
        name="plan"
        label="プラン"
        options={[
          {
            value: 'free',
            label: '無料プラン',
            description: '基本機能のみ利用可能',
          },
          {
            value: 'pro',
            label: 'Proプラン',
            description: '全機能利用可能',
          },
        ]}
      />

      <ControlledSwitchField
        control={control}
        name="emailNotifications"
        label="メール通知"
        description="新しいメッセージをメールで受け取ります"
      />

      <ControlledSwitchField
        control={control}
        name="pushNotifications"
        label="プッシュ通知"
        description="ブラウザのプッシュ通知を有効にします"
      />

      <button type="submit">保存</button>
    </form>
  )
}
```

---

## メリット

### 1. 一貫したUI

全てのフォームで統一されたUIを提供します。

### 2. エラーハンドリング

エラーメッセージの表示が自動化されます。

### 3. 型安全性

TypeScriptの型推論が効きます。

```typescript
// nameの型がFormValuesから自動推論される
<ControlledInputField control={control} name="email" />
```

### 4. コード量の削減

手動でController、Label、Error表示を書く必要がありません。

---

## 関連リンク

- [基本パターン](./01-basic-patterns.md) - React Hook Formの基本
- [複雑なフォーム](./05-complex-forms.md) - ネストや配列フィールド
- [ベストプラクティス](./08-best-practices.md) - フォーム開発のまとめ
