# ベストプラクティス

フォーム実装における推奨パターンとアンチパターンをまとめます。

---

## 1. 共通スキーマを再利用

複数のフォームで使われるフィールドは `src/lib/validations/fields/` の共通スキーマを使用します。

### ✅ Good: 共通スキーマを使用

```typescript
import { emailSchema, passwordSchema } from '@/lib/validations/fields';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
```

### ❌ Bad: 各featureで個別に定義

```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

**理由:**

- 一貫性が保たれる
- メンテナンスが容易
- バリデーションルールの変更が1箇所で済む

---

## 2. スキーマは別ファイルに分離

### ✅ Good: 別ファイルで管理

```typescript
// src/features/users/types/forms.ts
export const userFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
});

export type UserFormValues = z.infer<typeof userFormSchema>;

// src/features/users/components/user-form.tsx
import { userFormSchema, type UserFormValues } from '../types/forms.schema';
```

### ❌ Bad: コンポーネント内で定義

```typescript
const UserForm = () => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
  });
  // ...
};
```

**理由:**

- 再利用可能
- テストしやすい
- 型定義を共有できる

---

## 3. 型推論を活用

### ✅ Good: z.inferで型を生成

```typescript
export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
```

### ❌ Bad: 別々に型を定義

```typescript
interface User {
  name: string;
  email: string;
}

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
```

**理由:**

- スキーマと型が常に一致する
- メンテナンスの手間が減る
- DRY原則を守れる

---

## 4. デフォルト値を設定

### ✅ Good: defaultValuesを明示

```typescript
useForm<UserFormValues>({
  resolver: zodResolver(userFormSchema),
  defaultValues: {
    name: '',
    email: '',
    role: 'user',
  },
});
```

### ❌ Bad: デフォルト値なし

```typescript
useForm<UserFormValues>({
  resolver: zodResolver(userFormSchema),
});
```

**理由:**

- Controlled Componentとして動作する
- 初期値が明確
- 予期しない動作を防げる

---

## 5. エラーメッセージは日本語で明確に

### ✅ Good: わかりやすいエラーメッセージ

```typescript
z.string().min(1, { message: 'メールアドレスは必須です' }).email({ message: '有効なメールアドレスを入力してください' });
```

### ❌ Bad: 英語やあいまいなメッセージ

```typescript
z.string().min(1).email();
// エラー: "Invalid email" (デフォルトのエラーメッセージ)
```

**理由:**

- ユーザーが理解しやすい
- エラーメッセージが統一される

---

## 6. ローディング・送信中の状態を管理

### ✅ Good: isSubmittingを使用

```typescript
const { formState: { isSubmitting } } = useForm()

return (
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? '送信中...' : '送信'}
  </button>
)
```

### ❌ Bad: 状態管理なし

```typescript
<button type="submit">送信</button>
```

**理由:**

- 二重送信を防ぐ
- ユーザーにフィードバックを提供

---

## 7. Container/Presentationalパターンを適用

### ✅ Good: ロジックとUIを分離

```typescript
// Container: ロジック
export const UserFormContainer = () => {
  const createUser = useCreateUser()

  const onSubmit = async (data: UserFormValues) => {
    await createUser.mutateAsync(data)
  }

  return <UserForm onSubmit={onSubmit} />
}

// Presentational: UI
type UserFormProps = {
  onSubmit: (data: UserFormValues) => void
}

export const UserForm = ({ onSubmit }: UserFormProps) => {
  const { register, handleSubmit } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
    </form>
  )
}
```

### ❌ Bad: 全てを1つのコンポーネントに

```typescript
export const UserForm = () => {
  const createUser = useCreateUser()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: UserFormValues) => {
    await createUser.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
    </form>
  )
}
```

**理由:**

- テストしやすい
- 再利用可能
- 責任が明確

---

## 8. Controlled Componentを使用

### ✅ Good: ControlledFormFieldを使用

```typescript
import { ControlledInputField } from '@/components/sample-ui/form-field/controlled-form-field'

<ControlledInputField
  control={control}
  name="email"
  label="メールアドレス"
  required
/>
```

**理由:**

- UIが統一される
- エラーハンドリングが自動化される
- コード量が減る

---

## 9. バリデーションは段階的に

### ✅ Good: クライアント → サーバー

```typescript
// 1. クライアントサイドバリデーション（Zod）
const schema = z.object({
  email: z.string().email(),
});

// 2. サーバーサイドバリデーション
const onSubmit = async (data) => {
  await api.post('/users', data).catch((error) => {
    handleServerError(error, setError);
  });
};
```

**理由:**

- ユーザーエクスペリエンスの向上
- サーバー負荷の軽減
- セキュリティの確保

---

## 10. 動的バリデーションはDiscriminated Unionsを優先

### ✅ Good: Discriminated Unions

```typescript
const schema = z.discriminatedUnion('userType', [
  z.object({ userType: z.literal('individual'), firstName: z.string() }),
  z.object({ userType: z.literal('company'), companyName: z.string() }),
]);
```

### ❌ Bad: refineで全て処理

```typescript
const schema = z
  .object({
    userType: z.enum(['individual', 'company']),
    firstName: z.string().optional(),
    companyName: z.string().optional(),
  })
  .refine(/* 複雑な条件 */);
```

**理由:**

- 型安全性が高い
- TypeScriptの型推論が効く
- コンパイル時にエラーを検出できる

---

## まとめ

| ベストプラクティス       | メリット               |
| ------------------------ | ---------------------- |
| 共通スキーマを再利用     | 一貫性、メンテナンス性 |
| スキーマを別ファイルに   | 再利用性、テスト容易性 |
| 型推論を活用             | DRY、型安全性          |
| デフォルト値を設定       | 予期しない動作を防ぐ   |
| 明確なエラーメッセージ   | UX向上                 |
| 送信中の状態管理         | 二重送信防止           |
| Container/Presentational | 責任の明確化           |
| Controlled Component     | UI統一、コード量削減   |
| 段階的バリデーション     | UX向上、セキュリティ   |
| Discriminated Unions     | 型安全性、IDE補完      |

---

## チェックリスト

フォーム実装時に確認すべき項目:

- [ ] 共通スキーマ（`src/lib/validations/fields/`）を使用しているか
- [ ] スキーマを別ファイルに分離しているか
- [ ] `z.infer`で型を推論しているか
- [ ] `defaultValues`を設定しているか
- [ ] エラーメッセージは日本語でわかりやすいか
- [ ] `isSubmitting`でローディング状態を管理しているか
- [ ] Container/Presentationalパターンを適用しているか
- [ ] ControlledFormFieldを使用しているか
- [ ] サーバーエラーをハンドリングしているか
- [ ] 動的バリデーションが必要な場合はDiscriminated Unionsを検討したか

---

## 関連リンク

- [基本パターン](./01-basic-patterns.md) - フォームの基本実装
- [スキーマ管理](./03-schema-management.md) - 共通スキーマの管理方法
- [コンポーネント設計](../03-component-design.md) - Container/Presentationalパターン
- [コーディング規約](../01-coding-standards/) - プロジェクト全体のベストプラクティス
