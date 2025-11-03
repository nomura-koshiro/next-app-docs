# バリデーションルール

Zodを使用した様々なバリデーションルールとカスタムバリデーションの実装方法を説明します。

---

## 基本的なスキーマ

```typescript
// src/features/users/types/forms.ts
import { z } from 'zod';

/**
 * ユーザーフォームのバリデーションスキーマ
 * 新規作成・編集フォームで使用
 */
export const userFormSchema = z.object({
  name: z.string().min(1, { message: '名前は必須です' }).max(100, { message: '名前は100文字以内で入力してください' }),
  email: z.string().min(1, { message: 'メールアドレスは必須です' }).email({ message: '有効なメールアドレスを入力してください' }),
  role: z.enum(['user', 'admin'], {
    message: 'ロールを選択してください',
  }),
});

/**
 * ユーザーフォームの型定義
 */
export type UserFormValues = z.infer<typeof userFormSchema>;
```

---

## 文字列のバリデーション

### 基本的な文字列

```typescript
// 必須
z.string().min(1, '必須項目です');

// 最小・最大文字数
z.string().min(3, '3文字以上').max(20, '20文字以内');

// 正確な文字数
z.string().length(10, '10文字で入力してください');

// 空文字を許可しない
z.string().nonempty('空欄は許可されません');
```

### メールアドレス

```typescript
z.string().email('正しいメールアドレスを入力してください');
```

### URL

```typescript
z.string().url('正しいURLを入力してください');
```

### 正規表現

```typescript
// 電話番号
z.string().regex(/^0\d{9,10}$/, '正しい電話番号を入力してください');

// 郵便番号
z.string().regex(/^\d{7}$/, '7桁の郵便番号を入力してください');

// 英数字のみ
z.string().regex(/^[a-zA-Z0-9]+$/, '英数字のみ使用できます');
```

---

## 数値のバリデーション

```typescript
// 数値
z.number();

// 最小・最大
z.number().min(0, '0以上').max(100, '100以下');

// 正の整数
z.number().int().positive();

// 0以上
z.number().nonnegative();
```

---

## 列挙型（Enum）

```typescript
// 文字列のenum
z.enum(['user', 'admin', 'guest']);

// カスタムエラーメッセージ
z.enum(['user', 'admin'], {
  message: 'userまたはadminを選択してください',
});
```

---

## 日付のバリデーション

```typescript
// 日付
z.date();

// 最小日付（過去の日付を禁止）
z.date().min(new Date(), '過去の日付は選択できません');

// 最大日付（未来の日付を禁止）
z.date().max(new Date(), '未来の日付は選択できません');

// 文字列から日付に変換
z.string().transform((val) => new Date(val));
```

---

## ブール値

```typescript
// チェックボックス（必ずtrue）
z.boolean().refine((val) => val === true, {
  message: '利用規約に同意してください',
});

// またはリテラル型
z.literal(true, {
  message: '利用規約に同意してください',
});
```

---

## オプショナルフィールド

```typescript
// オプショナル（undefined許可）
z.string().optional();

// nullを許可
z.string().nullable();

// undefinedとnullの両方を許可
z.string().nullish();

// デフォルト値を設定
z.string().default('デフォルト値');
```

---

## カスタムバリデーション

### refineメソッド

```typescript
// パスワード確認
export const passwordConfirmSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'], // エラー表示位置
  });
```

### ファイルバリデーション

```typescript
export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'ファイルサイズは5MB以下にしてください',
  })
  .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
    message: '画像ファイル（JPEG, PNG, WebP）のみアップロードできます',
  });
```

### 複数条件のカスタムバリデーション

```typescript
export const strongPasswordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上必要です')
  .refine((val) => /[A-Z]/.test(val), {
    message: '大文字を1文字以上含める必要があります',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: '小文字を1文字以上含める必要があります',
  })
  .refine((val) => /[0-9]/.test(val), {
    message: '数字を1文字以上含める必要があります',
  });
```

---

## スキーマの拡張・変換

### extend（拡張）

```typescript
const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Schemasを拡張
const userWithPasswordSchema = baseUserSchema.extend({
  password: z.string().min(8),
});
```

### partial（全てオプショナル）

```typescript
// 全てのフィールドをオプショナルに
export const updateUserSchema = userFormSchema.partial();

// 一部のフィールドのみオプショナルに
export const updateUserPartialSchema = userFormSchema.partial({
  name: true,
  email: true,
});
```

### pick（一部を選択）

```typescript
// 特定のフィールドのみ抽出
export const userNameOnlySchema = userFormSchema.pick({
  name: true,
});
```

### omit（一部を除外）

```typescript
// 特定のフィールドを除外
export const userWithoutEmailSchema = userFormSchema.omit({
  email: true,
});
```

---

## 型推論

```typescript
// Schemasから型を生成
export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
});

export type User = z.infer<typeof userSchema>;
// 型: { name: string; email: string; age: number }

// 入力値の型（transform前）
export type UserInput = z.input<typeof userSchema>;
```

---

## 関連リンク

- [スキーマ管理](./03-schema-management.md) - 共通スキーマの管理方法
- [動的バリデーション](./06-dynamic-validation.md) - 条件に応じたバリデーション
- [Zod公式ドキュメント](https://zod.dev/) - 詳細な使い方
