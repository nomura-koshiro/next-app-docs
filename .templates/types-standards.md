# Types Files Standards

このドキュメントでは、プロジェクト全体で使用する型定義ファイルの標準形式を定義します。

## 1. Feature Types Index (`types/index.ts`)

機能のメインとなる型定義ファイル。モデルスキーマとビジネスロジック型を定義します。

```typescript
/**
 * {機能名}機能の型定義
 *
 * @module features/{feature-name}/types
 */

import { z } from "zod";

// ================================================================================
// {カテゴリ}スキーマ
// ================================================================================

/**
 * {スキーマの説明}
 *
 * @property {field} - {フィールドの説明}
 * @property {field2} - {フィールド2の説明}
 *
 * @example
 * ```typescript
 * const example: {TypeName} = {
 *   field: 'value',
 *   field2: 'value2'
 * }
 * ```
 */
export const {name}Schema = z.object({
  field: z.string(),
  field2: z.string(),
});

/**
 * {型の説明}
 */
export type {TypeName} = z.infer<typeof {name}Schema>;

// ================================================================================
// {カテゴリ}入力スキーマ
// ================================================================================

/**
 * {入力スキーマの説明}
 */
export const {name}InputSchema = z.object({...});

/**
 * {入力型の説明}
 */
export type {Name}Input = z.infer<typeof {name}InputSchema>;
```

**ルール:**
- 必ず @module を記載
- 大きなカテゴリごとに `// ================` で区切る
- スキーマには JSDoc コメントで説明と @property を記載
- 複雑な型には @example を追加
- 型定義は必ずスキーマの直後に配置
- 型名は PascalCase、スキーマ名は camelCase

## 2. API Response Schemas (`types/api.ts`)

API レスポンスのランタイムバリデーション用スキーマ。

```typescript
/**
 * {機能名} API レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ
 *
 * @module features/{feature-name}/types/api
 */

import { z } from "zod";

import { {schemas} } from "./index";

// ================================================================================
// API レスポンススキーマ
// ================================================================================

/**
 * {エンドポイント名}レスポンススキーマ
 *
 * {HTTP_METHOD} {endpoint_path} のレスポンス
 *
 * @example
 * ```typescript
 * // API レスポンス例
 * const response: {Name}Output = {
 *   data: {...}
 * }
 * ```
 */
export const {name}OutputSchema = z.object({
  data: {innerSchema},
});

/**
 * {エンドポイント名}レスポンス型
 */
export type {Name}Output = z.infer<typeof {name}OutputSchema>;
```

**ルール:**
- ファイルヘッダーに「API レスポンススキーマ」と明記
- スキーマ名は `{name}OutputSchema` (camelCase + OutputSchema)
- 型名は `{Name}Output` (PascalCase + Output)
- 必ず対応する HTTP メソッドとエンドポイントを記載
- Request/Response という命名は使用しない

## 3. Form Validation Schemas (`types/forms.ts`)

フォーム入力のバリデーションスキーマ。

```typescript
/**
 * {機能名}機能のフォームスキーマ
 *
 * @module features/{feature-name}/types/forms
 */

import { z } from "zod";

import { {fieldSchemas} } from "@/lib/validations/fields/{field}";

// ================================================================================
// フォームバリデーションスキーマ
// ================================================================================

/**
 * {フォーム名}フォームのバリデーションスキーマ
 *
 * {使用場所や目的の説明}
 *
 * @example
 * ```typescript
 * const formData: {Form}FormValues = {
 *   field1: 'value1',
 *   field2: 'value2'
 * }
 * const result = {form}FormSchema.safeParse(formData)
 * ```
 */
export const {form}FormSchema = z.object({
  field1: field1Schema,
  field2: field2Schema,
});

/**
 * {フォーム名}フォームの型定義
 */
export type {Form}FormValues = z.infer<typeof {form}FormSchema>;
```

**ルール:**
- ファイルヘッダーに「フォームスキーマ」と明記
- スキーマ名は `{form}FormSchema` (camelCase + FormSchema)
- 型名は `{Form}FormValues` (PascalCase + FormValues)
- 可能な限り lib/validations から再利用可能なフィールドスキーマをインポート

## 4. Field Validation Schemas (`lib/validations/fields/{field}.ts`)

再利用可能なフィールドバリデーションスキーマ。

```typescript
/**
 * {フィールド名}フィールドのバリデーションスキーマ
 *
 * {フィールドの説明、制約、用途}
 *
 * @module lib/validations/fields/{field}
 */

import { z } from "zod";

/**
 * {フィールド名}バリデーションスキーマ
 *
 * {バリデーションルールの詳細}
 *
 * @example
 * ```typescript
 * // 有効な値
 * {field}Schema.parse('valid value')
 * {field}Schema.parse('another valid')
 *
 * // 無効な値
 * {field}Schema.parse('') // エラー: {エラーメッセージ}
 * {field}Schema.parse('invalid') // エラー: {エラーメッセージ}
 * ```
 */
export const {field}Schema = z
  .string()
  .min(1, "エラーメッセージ")
  .{validations}("エラーメッセージ");
```

**ルール:**
- @module パスは `lib/validations/fields/{field}` 形式
- スキーマ名は `{field}Schema` (camelCase + Schema)
- 必ず有効な値と無効な値の例を含む @example を記載
- エラーメッセージは日本語で明確に記述
- 型推論が必要な場合のみ export type を追加

## 5. Model Validation Schemas (`src/types/models/{model}.ts`)

共通モデルの型定義とスキーマ。

```typescript
/**
 * {モデル名}モデルの型定義
 *
 * {モデルの説明、用途}
 *
 * @module types/models/{model}
 */

import { z } from "zod";

// ================================================================================
// {モデル名}スキーマ
// ================================================================================

/**
 * {モデル名}スキーマ
 *
 * @property {field} - {フィールドの説明}
 * @property {field2} - {フィールド2の説明}
 *
 * @example
 * ```typescript
 * const {model}: {Model} = {
 *   field: 'value',
 *   field2: 'value2'
 * }
 * ```
 */
export const {model}Schema = z.object({
  field: z.string(),
  field2: z.string(),
});

/**
 * {モデル名}型
 */
export type {Model} = z.infer<typeof {model}Schema>;

// ================================================================================
// {モデル名}入力スキーマ
// ================================================================================

/**
 * {操作名}{モデル名}用のスキーマ
 */
export const {operation}{Model}Schema = {model}BaseSchema.{transform}();

/**
 * {操作名}{モデル名}用の入力型
 */
export type {Operation}{Model}Input = z.infer<typeof {operation}{Model}Schema>;
```

**ルール:**
- @module パスは `types/models/{model}` 形式
- ベーススキーマを定義し、派生スキーマで extend/partial/omit を使用
- 入力型には Input サフィックスを使用
- 出力型には Output サフィックスを使用

## 共通ルール

### 命名規則

- **スキーマ名**: camelCase + Schema/OutputSchema/InputSchema/FormSchema
  - 例: `userSchema`, `userOutputSchema`, `createUserInputSchema`, `loginFormSchema`
- **型名**: PascalCase + Input/Output/FormValues (必要に応じて)
  - 例: `User`, `CreateUserInput`, `UserOutput`, `LoginFormValues`
- **使用禁止**: DTO, Request, Response サフィックス

### JSDoc 構造

1. **ファイルヘッダー**: 必須
   ```typescript
   /**
    * {簡潔なファイルの説明}
    *
    * {詳細な説明（任意）}
    *
    * @module {正確なモジュールパス}
    */
   ```

2. **スキーマ/型コメント**: 推奨
   ```typescript
   /**
    * {スキーマ/型の説明}
    *
    * @property {field} - {説明} (複雑な場合のみ)
    *
    * @example (推奨)
    * ```typescript
    * {使用例}
    * ```
    */
   ```

3. **セクション区切り**: 推奨
   ```typescript
   // ================================================================================
   // {セクション名}
   // ================================================================================
   ```

### インポート順序

1. 外部ライブラリ (zod など)
2. 空行
3. 内部インポート (絶対パス @/)
4. 相対インポート (./)

### エクスポート順序

1. スキーマ定義とその型推論をペアで配置
2. 関連するスキーマをグループ化
3. より基本的なものから派生したものへ順番に配置

## 適用対象ファイル

- `src/features/*/types/index.ts`
- `src/features/*/types/api.ts`
- `src/features/*/types/forms.ts`
- `src/types/models/*.ts`
- `src/lib/validations/fields/*.ts`
- `src/lib/validations/models/*.ts`
