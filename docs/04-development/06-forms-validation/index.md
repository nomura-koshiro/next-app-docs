# フォーム実装（React Hook Form + Zod）

本ドキュメントでは、React Hook FormとZodを使用したフォーム実装とバリデーションの方法について説明します。型安全なフォーム開発のためのベストプラクティスと実装パターンを提供します。

## 📚 目次

1. **[基本パターン](./01-basic-patterns.md)** - React Hook Form + Zodの基本的な使い方
2. **[バリデーションルール](./02-validation-rules.md)** - Zodスキーマとカスタムバリデーション
3. **[スキーマ管理](./03-schema-management.md)** - 共通スキーマの管理方法
4. **[再利用可能なフォームコンポーネント](./04-reusable-components.md)** - ControlledFormFieldコンポーネント群
5. **[複雑なフォーム](./05-complex-forms.md)** - ネストしたフィールドと配列フィールド
6. **[動的バリデーション](./06-dynamic-validation.md)** - 条件に応じたバリデーション
7. **[サーバーエラーハンドリング](./07-server-errors.md)** - APIエラーの処理
8. **[ベストプラクティス](./08-best-practices.md)** - フォーム開発のまとめ

---

## 🚀 よく使うパターン

### シンプルなログインフォーム

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // API呼び出し
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>ログイン</button>
    </form>
  )
}
```

### 共通スキーマを使ったフォーム

```typescript
import { emailSchema, passwordSchema } from '@/lib/validations/fields'

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
```

### Controlled Componentを使ったフォーム

```typescript
import { ControlledInputField } from '@/components/sample-ui/form-field/controlled-form-field'

<ControlledInputField
  control={control}
  name="email"
  label="メールアドレス"
  type="email"
  required
/>
```

---

## 📖 関連リンク

- [コンポーネント設計](../03-component-design.md) - Container/Presentationalパターン
- [API統合](../05-api-integration/) - TanStack Queryとの連携
- [React Hook Form公式](https://react-hook-form.com/) - React Hook Form公式ドキュメント
- [Zod公式](https://zod.dev/) - Zod公式ドキュメント
