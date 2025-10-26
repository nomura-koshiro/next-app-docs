# スキーマ管理

アプリケーションが成長するにつれて、同じフィールド（例：email、password）が複数のフォームで使われるようになります。これらを個別に定義すると、バリデーションルールが不一致になったり、重複コードが増えたりする問題が発生します。

このプロジェクトでは、共通のバリデーションスキーマを `src/schemas/` ディレクトリで集中管理しています。

---

## ディレクトリ構造

```
src/schemas/
├── index.ts              # 全スキーマのバレルエクスポート
└── fields/               # フィールド単位のスキーマ
    ├── index.ts
    ├── email.schema.ts
    ├── password.schema.ts
    ├── username.schema.ts
    └── ...
```

---

## 使い方

### 基本的な使用例

```typescript
import { z } from "zod";
import { emailSchema, passwordSchema } from "@/schemas/fields/email.schema";

// フォームスキーマの作成
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
```

### まとめてインポート

```typescript
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/schemas/fields";
```

---

## 利用可能なフィールドスキーマ

### 基本フィールド

- **emailSchema** - メールアドレス（必須、email形式）
- **passwordSchema** - パスワード（必須、基本）
- **strongPasswordSchema** - 強力なパスワード（8文字以上、英数字含む）
- **usernameSchema** - ユーザー名（3〜20文字）
- **nameSchema** - 名前（1〜100文字）
- **ageSchema** - 年齢（0以上の数値）
- **bioSchema** - 自己紹介（10〜500文字）
- **birthdateSchema** - 生年月日（必須）
- **countrySchema** - 国選択（必須）

### 選択フィールド

- **genderSchema** - 性別（male/female/other）
- **roleSchema** - ユーザーロール（user/admin）

### チェックボックス

- **termsSchema** - 利用規約同意（必須でtrue）
- **optionalCheckboxSchema** - オプショナルなチェックボックス

---

## メリット

### 1. 一貫性の保証

同じフィールドは常に同じバリデーションルールが適用されます。

```typescript
// ❌ 以前：各featureでバラバラ
// feature A
email: z.string().min(1).email()

// feature B
email: z.string().email({ message: "..." })

// ✅ 現在：一貫したバリデーション
email: emailSchema
```

### 2. メンテナンス性の向上

バリデーションルールの変更が1箇所で済みます。

```typescript
// src/schemas/fields/email.schema.ts を編集するだけで
// アプリケーション全体のメールバリデーションが更新される
```

### 3. 再利用性

既存のスキーマを組み合わせて新しいフォームを簡単に作成できます。

```typescript
export const signupFormSchema = z.object({
  username: usernameSchema,           // 再利用
  email: emailSchema,                 // 再利用
  password: strongPasswordSchema,     // 強力なパスワード版
  terms: termsSchema,                 // 再利用
});
```

### 4. 型安全性

共通の型定義により、型の不一致を防ぎます。

```typescript
import { Gender, Role } from "@/schemas/fields";

// 型が自動的に推論される
const user: { gender: Gender; role: Role } = {
  gender: "male",
  role: "admin",
};
```

---

## 新しいスキーマの追加方法

### 1. スキーマファイルを作成

`src/schemas/fields/` に新しいスキーマファイルを作成します。

```typescript
// src/schemas/fields/phone.schema.ts
import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(1, { message: "電話番号は必須です" })
  .regex(/^\d{10,11}$/, { message: "10桁または11桁の数字で入力してください" });
```

### 2. エクスポートを追加

`src/schemas/fields/index.ts` にエクスポートを追加します。

```typescript
export * from "./phone.schema";
```

### 3. 各featureで使用

```typescript
import { phoneSchema } from "@/schemas/fields/phone.schema";
// または
import { phoneSchema } from "@/schemas/fields";
```

---

## スキーマの例

### email.schema.ts

```typescript
import { z } from "zod";

/**
 * メールアドレススキーマ
 */
export const emailSchema = z
  .string()
  .min(1, { message: "メールアドレスは必須です" })
  .email({ message: "有効なメールアドレスを入力してください" });
```

### password.schema.ts

```typescript
import { z } from "zod";

/**
 * 基本的なパスワードスキーマ
 */
export const passwordSchema = z
  .string()
  .min(1, { message: "パスワードは必須です" });

/**
 * 強力なパスワードスキーマ（8文字以上、英数字含む）
 */
export const strongPasswordSchema = z
  .string()
  .min(8, { message: "パスワードは8文字以上必要です" })
  .regex(/[A-Z]/, { message: "大文字を1文字以上含めてください" })
  .regex(/[a-z]/, { message: "小文字を1文字以上含めてください" })
  .regex(/[0-9]/, { message: "数字を1文字以上含めてください" });
```

### username.schema.ts

```typescript
import { z } from "zod";

/**
 * ユーザー名スキーマ（3〜20文字、英数字とアンダースコアのみ）
 */
export const usernameSchema = z
  .string()
  .min(3, { message: "ユーザー名は3文字以上必要です" })
  .max(20, { message: "ユーザー名は20文字以内で入力してください" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "ユーザー名は英数字とアンダースコアのみ使用できます",
  });
```

### name.schema.ts

```typescript
import { z } from "zod";

/**
 * 名前スキーマ（1〜100文字）
 */
export const nameSchema = z
  .string()
  .min(1, { message: "名前は必須です" })
  .max(100, { message: "名前は100文字以内で入力してください" });
```

### role.schema.ts

```typescript
import { z } from "zod";

/**
 * ユーザーロール
 */
export const roleSchema = z.enum(["user", "admin"], {
  message: "ロールを選択してください",
});

export type Role = z.infer<typeof roleSchema>;
```

### gender.schema.ts

```typescript
import { z } from "zod";

/**
 * 性別スキーマ
 */
export const genderSchema = z.enum(["male", "female", "other"], {
  message: "性別を選択してください",
});

export type Gender = z.infer<typeof genderSchema>;
```

### terms.schema.ts

```typescript
import { z } from "zod";

/**
 * 利用規約同意スキーマ（必ずtrueである必要がある）
 */
export const termsSchema = z.literal(true, {
  message: "利用規約に同意する必要があります",
});

/**
 * オプショナルなチェックボックス
 */
export const optionalCheckboxSchema = z.boolean().default(false);
```

### age.schema.ts

```typescript
import { z } from "zod";

/**
 * 年齢スキーマ（0以上）
 */
export const ageSchema = z
  .number({ message: "年齢を入力してください" })
  .nonnegative({ message: "年齢は0以上で入力してください" });
```

### bio.schema.ts

```typescript
import { z } from "zod";

/**
 * 自己紹介スキーマ（10〜500文字）
 */
export const bioSchema = z
  .string()
  .min(10, { message: "自己紹介は10文字以上入力してください" })
  .max(500, { message: "自己紹介は500文字以内で入力してください" });
```

---

## 複合スキーマの例

### ユーザー登録フォーム

```typescript
import { z } from "zod";
import {
  usernameSchema,
  emailSchema,
  strongPasswordSchema,
  termsSchema,
} from "@/schemas/fields";

export const signupFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
  terms: termsSchema,
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
```

### プロフィール編集フォーム

```typescript
import { z } from "zod";
import {
  nameSchema,
  bioSchema,
  genderSchema,
  ageSchema,
} from "@/schemas/fields";

export const profileFormSchema = z.object({
  name: nameSchema,
  bio: bioSchema.optional(),
  gender: genderSchema,
  age: ageSchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
```

---

## 注意事項

### feature固有のバリデーション

**共通性の高いフィールド**は`src/schemas/fields/`に配置しますが、**feature固有のバリデーション**は各featureのschemasディレクトリに配置してもOKです。

```
src/features/orders/
└── schemas/
    └── order-form.schema.ts   # 注文フォーム固有のスキーマ
```

### スキーマ変更時の注意

既存のスキーマを変更する際は、影響範囲を確認してから変更してください。

```bash
# スキーマが使用されている箇所を検索
pnpm grep "emailSchema"
```

---

## 関連リンク

- [バリデーションルール](./02-validation-rules.md) - Zodのバリデーション詳細
- [ベストプラクティス](./08-best-practices.md) - スキーマ管理のベストプラクティス
