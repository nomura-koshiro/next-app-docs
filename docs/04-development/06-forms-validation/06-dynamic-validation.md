# 動的バリデーション

フォームの状態やユーザーの選択によって、バリデーションルールや必須項目が動的に変わる場合の実装パターンを説明します。

---

## 1. 条件付き必須フィールド（refine）

特定の条件で必須項目が変わる最もシンプルなパターンです。

### スキーマ定義

```typescript
// src/lib/validations/fields/user-type.ts
import { z } from 'zod';

/**
 * ユーザータイプに応じて必須項目が変わるスキーマ
 */
export const userTypeFormSchema = z
  .object({
    userType: z.enum(['individual', 'company']),

    // 共通フィールド
    email: z.string().email(),

    // 条件付きで必須になるフィールド（optional）
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    taxId: z.string().optional(),
  })
  .refine(
    (data) => {
      // 個人の場合、firstName と lastName が必須
      if (data.userType === 'individual') {
        return !!data.firstName && !!data.lastName;
      }
      // 法人の場合、companyName と taxId が必須
      if (data.userType === 'company') {
        return !!data.companyName && !!data.taxId;
      }
      return true;
    },
    {
      message: '必須項目を入力してください',
      path: ['userType'], // エラー表示位置
    }
  );
```

### メリット・デメリット

**メリット:**

- シンプルで理解しやすい
- 簡単な条件分岐に最適

**デメリット:**

- エラーメッセージが1箇所にしか表示されない
- 複雑な条件には不向き

---

## 2. 細かいエラーメッセージ（superRefine）

各フィールドに個別のエラーメッセージを表示したい場合に使用します。

### スキーマ定義

```typescript
// src/features/users/lib/validationsuser-advanced.ts
import { z } from 'zod';

export const userAdvancedSchema = z
  .object({
    userType: z.enum(['individual', 'company']),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    taxId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 個人の場合のバリデーション
    if (data.userType === 'individual') {
      if (!data.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['firstName'],
          message: '個人の場合、名は必須です',
        });
      }
      if (!data.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lastName'],
          message: '個人の場合、姓は必須です',
        });
      }
    }

    // 法人の場合のバリデーション
    if (data.userType === 'company') {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['companyName'],
          message: '法人の場合、会社名は必須です',
        });
      }
      if (!data.taxId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['taxId'],
          message: '法人の場合、法人番号は必須です',
        });
      }
    }
  });

export type UserAdvancedFormValues = z.infer<typeof userAdvancedSchema>;
```

### メリット・デメリット

**メリット:**

- 各フィールドに個別のエラーメッセージを表示できる
- 複数の条件を柔軟に処理できる

**デメリット:**

- `refine`より複雑
- コード量が多くなる

---

## 3. 動的スキーマ生成

フォームの状態によって完全に異なるスキーマが必要な場合に使用します。

### スキーマ定義

```typescript
// src/lib/validations/fields/payment.ts
import { z } from 'zod';

/**
 * 支払い方法に応じて動的にスキーマを生成
 */
export const createPaymentSchema = (paymentMethod: 'card' | 'bank' | 'cash') => {
  const baseSchema = z.object({
    amount: z.number().min(1, '金額は1円以上で入力してください'),
    paymentMethod: z.literal(paymentMethod),
  });

  if (paymentMethod === 'card') {
    return baseSchema.extend({
      cardNumber: z.string().regex(/^\d{16}$/, '16桁のカード番号を入力してください'),
      cvv: z.string().regex(/^\d{3,4}$/, 'CVVを入力してください'),
      expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'MM/YY形式で入力してください'),
    });
  }

  if (paymentMethod === 'bank') {
    return baseSchema.extend({
      bankName: z.string().min(1, '銀行名は必須です'),
      accountNumber: z.string().min(1, '口座番号は必須です'),
    });
  }

  // cash の場合は baseSchema のまま
  return baseSchema;
};
```

### 使用例

```typescript
// src/features/payment/routes/new-payment/new-payment.hook.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { createPaymentSchema } from '@/lib/validations/fields/payment.schema';

export const useNewPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cash'>('card');

  const schema = createPaymentSchema(paymentMethod);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod,
      amount: 0,
    },
  });

  // paymentMethod が変わったらフォームをリセット
  useEffect(() => {
    reset({ paymentMethod, amount: 0 });
  }, [paymentMethod, reset]);

  return {
    register,
    handleSubmit,
    errors,
    paymentMethod,
    setPaymentMethod,
  };
};
```

### メリット・デメリット

**メリット:**

- 完全に異なるフォーム構造に対応できる
- 型安全性が高い

**デメリット:**

- 状態変更時にフォームのリセットが必要
- 実装が複雑

---

## 4. Discriminated Unions（推奨）

型安全性が最も高く、TypeScriptの型推論が効く方法です。

### スキーマ定義

```typescript
// src/lib/validations/fields/user-discriminated.ts
import { z } from 'zod';
import { emailSchema } from './email.schema';

/**
 * 個人ユーザースキーマ
 */
const individualUserSchema = z.object({
  userType: z.literal('individual'),
  email: emailSchema,
  firstName: z.string().min(1, '名は必須です'),
  lastName: z.string().min(1, '姓は必須です'),
  dateOfBirth: z.string().min(1, '生年月日は必須です'),
});

/**
 * 法人ユーザースキーマ
 */
const companyUserSchema = z.object({
  userType: z.literal('company'),
  email: emailSchema,
  companyName: z.string().min(1, '会社名は必須です'),
  taxId: z.string().min(1, '法人番号は必須です'),
  representativeName: z.string().min(1, '代表者名は必須です'),
});

/**
 * ユーザースキーマ（discriminated union）
 */
export const userDiscriminatedSchema = z.discriminatedUnion('userType', [individualUserSchema, companyUserSchema]);

export type UserDiscriminatedFormValues = z.infer<typeof userDiscriminatedSchema>;
// 型推論される：
// { userType: "individual", email: string, firstName: string, ... } |
// { userType: "company", email: string, companyName: string, ... }
```

### フォーム実装

```typescript
// src/features/users/components/user-discriminated-form.tsx
export const UserDiscriminatedForm = () => {
  const { register, watch, formState: { errors }, handleSubmit } = useForm<UserDiscriminatedFormValues>({
    resolver: zodResolver(userDiscriminatedSchema),
    defaultValues: {
      userType: "individual",
      email: "",
    },
  });

  const userType = watch("userType");

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <select {...register("userType")}>
        <option value="individual">個人</option>
        <option value="company">法人</option>
      </select>

      {/* 共通フィールド */}
      <input {...register("email")} placeholder="メールアドレス" />
      {errors.email && <span>{errors.email.message}</span>}

      {/* 個人の場合のみ表示 */}
      {userType === "individual" && (
        <>
          <input {...register("firstName")} placeholder="名" />
          {errors.firstName && <span>{errors.firstName.message}</span>}

          <input {...register("lastName")} placeholder="姓" />
          {errors.lastName && <span>{errors.lastName.message}</span>}

          <input {...register("dateOfBirth")} type="date" />
          {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
        </>
      )}

      {/* 法人の場合のみ表示 */}
      {userType === "company" && (
        <>
          <input {...register("companyName")} placeholder="会社名" />
          {errors.companyName && <span>{errors.companyName.message}</span>}

          <input {...register("taxId")} placeholder="法人番号" />
          {errors.taxId && <span>{errors.taxId.message}</span>}

          <input {...register("representativeName")} placeholder="代表者名" />
          {errors.representativeName && <span>{errors.representativeName.message}</span>}
        </>
      )}

      <button type="submit">送信</button>
    </form>
  );
};
```

### メリット・デメリット

**メリット:**

- TypeScriptが`userType`の値に応じて型を自動で絞り込む
- コンパイル時に型エラーを検出できる
- IDEの補完が効く
- 型安全性が最も高い

**デメリット:**

- やや複雑
- Discriminated Unionの理解が必要

---

## 5. パターン選択ガイド

| 方法                     | 使用ケース             | 型安全性 | 複雑度   |
| ------------------------ | ---------------------- | -------- | -------- |
| **refine()**             | 簡単な条件分岐         | ⭐⭐     | ⭐       |
| **superRefine()**        | 細かいエラー制御が必要 | ⭐⭐     | ⭐⭐     |
| **動的スキーマ生成**     | 完全に異なるフォーム   | ⭐⭐⭐   | ⭐⭐⭐   |
| **Discriminated Unions** | 型安全性を最大限に     | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 推奨アプローチ

- **シンプルな条件分岐** → `refine()` または `superRefine()`
- **複雑な条件・型安全性重視** → **Discriminated Unions（推奨）**
- **ランタイムで完全に異なるフォーム** → **動的スキーマ生成**

---

## 実践例：配送先フォーム

```typescript
import { z } from 'zod';

const homeDeliverySchema = z.object({
  deliveryType: z.literal('home'),
  address: z.string().min(1, '住所は必須です'),
  postalCode: z.string().regex(/^\d{7}$/, '7桁の郵便番号を入力してください'),
  phoneNumber: z.string().min(1, '電話番号は必須です'),
});

const storePickupSchema = z.object({
  deliveryType: z.literal('store'),
  storeId: z.string().min(1, '店舗を選択してください'),
  pickupDate: z.string().min(1, '受取日を選択してください'),
});

export const deliverySchema = z.discriminatedUnion('deliveryType', [homeDeliverySchema, storePickupSchema]);

export type DeliveryFormValues = z.infer<typeof deliverySchema>;
```

---

## 関連リンク

- [バリデーションルール](./02-validation-rules.md) - refine, superRefineの詳細
- [複雑なフォーム](./05-complex-forms.md) - ネストや配列フィールド
- [Zod - Discriminated Unions](https://zod.dev/?id=discriminated-unions) - 公式ドキュメント
