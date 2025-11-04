# APIレスポンスバリデーション

ZodによるAPIレスポンスのランタイムバリデーション実装ガイド

---

## 概要

バックエンドAPIから返されるデータは、常に期待する形式とは限りません。ネットワークエラー、APIバージョンの不一致、データベースの破損などにより、予期しない形式のデータが返される可能性があります。

このガイドでは、Zodスキーマを使用してAPIレスポンスを検証し、型安全で信頼性の高いフロントエンドアプリケーションを構築する方法を説明します。

---

## なぜAPIレスポンスバリデーションが必要か

### 1. ランタイム型安全性

TypeScriptの型チェックはコンパイル時のみ有効です。実際のAPIレスポンスは実行時にしか判明しません。

```typescript
// ❌ TypeScriptの型は実行時には存在しない
interface User {
  id: string;
  name: string;
  email: string;
}

const response = await api.get<User>("/users/1"); // 型アサーションのみ
console.log(response.name.toUpperCase()); // ランタイムエラーの可能性
```

```typescript
// ✅ Zodスキーマは実行時に検証
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const response = await api.get("/users/1");
const user = UserSchema.parse(response); // ✅ ランタイムバリデーション
console.log(user.name.toUpperCase()); // 安全
```

### 2. 早期エラー検出

不正なデータは、APIレスポンス受信時に即座に検出・処理されます。

```typescript
// ❌ エラーが後で発生
const response = await api.get("/users/1");
setUser(response); // 不正なデータがストアに保存される
// ...（後で予期しないエラーが発生）

// ✅ 即座にエラー検出
try {
  const response = await api.get("/users/1");
  const user = UserSchema.parse(response);
  setUser(user); // 検証済みデータのみ保存
} catch (error) {
  // バリデーションエラーを適切に処理
  console.error("APIレスポンスが不正です:", error);
}
```

### 3. 型推論の一元化

Zodスキーマから TypeScript 型を自動生成できます。

```typescript
// ✅ スキーマから型を推論
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
});

export type User = z.infer<typeof UserSchema>; // TypeScript型を自動生成
```

---

## 基本パターン

### ステップ1: レスポンススキーマの定義

**ファイルパス**: `src/features/sample-users/api/lib/validationsuser-response.ts`

```typescript
import { z } from "zod";

/**
 * ユーザーロールスキーマ
 */
export const UserRoleSchema = z.enum(["user", "admin"]);

/**
 * ユーザースキーマ
 *
 * APIレスポンスから返されるユーザーオブジェクトを検証
 */
export const UserSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスではありません"),
  role: UserRoleSchema,
  createdAt: z.string().min(1, "作成日時は必須です"),
  updatedAt: z.string().optional(),
});

/**
 * ユーザー一覧レスポンススキーマ
 *
 * GET /api/v1/sample/users のレスポンス
 */
export const UsersResponseSchema = z.object({
  data: z.array(UserSchema),
});

/**
 * 型推論
 */
export type User = z.infer<typeof UserSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
```

### ステップ2: API関数でのバリデーション

**ファイルパス**: `src/features/sample-users/api/get-users.ts`

```typescript
import { api } from "@/lib/api-client";
import type { User } from "./lib/validationsuser-response.schema";
import { UsersResponseSchema } from "./lib/validationsuser-response.schema";

/**
 * ユーザー一覧取得
 *
 * @returns ユーザー一覧（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 */
export const getUsers = async (): Promise<{ data: User[] }> => {
  const response = await api.get("/sample/users");
  return UsersResponseSchema.parse(response); // ✅ Zodで検証
};
```

### ステップ3: TanStack Queryとの統合

**ファイルパス**: `src/features/sample-users/api/get-users.ts`（続き）

````typescript
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/tanstack-query";

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ["users"],
    queryFn: getUsers, // ✅ バリデーション済みデータが返される
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

/**
 * @example
 * ```tsx
 * const { data } = useUsers()
 * console.log(data.data) // User[] (型安全 + ランタイム検証済み)
 * ```
 */
export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
````

---

## スキーマ設計パターン

### 1. 単一リソースレスポンス

```typescript
// GET /users/:id → { data: User }
export const UserResponseSchema = z.object({
  data: UserSchema,
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
```

### 2. リソース一覧レスポンス

```typescript
// GET /users → { data: User[] }
export const UsersResponseSchema = z.object({
  data: z.array(UserSchema),
});

export type UsersResponse = z.infer<typeof UsersResponseSchema>;
```

### 3. ページネーションレスポンス

```typescript
// GET /users?page=1&limit=20 → { data: User[], total: 100, page: 1, limit: 20 }
export const PaginatedUsersResponseSchema = z.object({
  data: z.array(UserSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
});

export type PaginatedUsersResponse = z.infer<typeof PaginatedUsersResponseSchema>;
```

### 4. 作成・更新レスポンス

```typescript
// POST /users → User
export const CreateUserResponseSchema = UserSchema;

// PUT /users/:id → { data: User }
export const UpdateUserResponseSchema = z.object({
  data: UserSchema,
});

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;
```

---

## 高度なパターン

### 1. transform() による型変換

```typescript
/**
 * メッセージスキーマ
 *
 * timestampは文字列として受け取り、Dateオブジェクトに変換
 */
export const MessageSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
  timestamp: z
    .string()
    .min(1)
    .transform((val) => new Date(val)), // ✅ 文字列 → Date 変換
});

// 型推論結果:
// {
//   id: string;
//   content: string;
//   timestamp: Date; // ✅ Dateオブジェクト
// }
```

### 2. nullable() と optional()

```typescript
/**
 * ユーザー情報スキーマ
 */
export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string().nullable(), // ✅ null許可
  updatedAt: z.string().optional(), // ✅ フィールド自体が存在しない可能性
  lastLogin: z.string().nullable().optional(), // ✅ null許可 + フィールド存在しない可能性
});

// 型推論結果:
// {
//   id: string;
//   displayName: string | null;
//   updatedAt?: string;
//   lastLogin?: string | null;
// }
```

### 3. 入れ子スキーマ

```typescript
/**
 * プロジェクトメンバー情報スキーマ
 */
export const ProjectMemberSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  role: ProjectRoleSchema,
  user: UserSchema.optional(), // ✅ 入れ子オブジェクト
  project: ProjectSchema.optional(), // ✅ 入れ子オブジェクト
});
```

### 4. enum による制約

```typescript
/**
 * システムレベルのロールスキーマ
 */
export const SystemRoleSchema = z.enum(["system_admin", "user"]);

/**
 * プロジェクトレベルのロールスキーマ
 */
export const ProjectRoleSchema = z.enum(["project_manager", "project_moderator", "member", "viewer"]);

// 型推論結果:
// type SystemRole = "system_admin" | "user";
// type ProjectRole = "project_manager" | "project_moderator" | "member" | "viewer";
```

---

## ミューテーションでのバリデーション

### POST リクエスト（ログイン例）

**スキーマファイル**: `src/features/sample-auth/api/lib/validationsauth-response.ts`

```typescript
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string().min(1, "トークンは必須です"),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
```

**API関数**: `src/features/sample-auth/api/login.ts`

```typescript
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/api-client";
import { LoginResponseSchema } from "./lib/validationsauth-response.schema";
import type { LoginResponse } from "./lib/validationsauth-response.schema";

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

/**
 * ログインAPI呼び出し
 */
export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await api.post("/api/v1/sample/auth/login", data);
  return LoginResponseSchema.parse(response); // ✅ レスポンスバリデーション
};

/**
 * ログインMutation Hook
 */
export const useLogin = ({ mutationConfig }: UseLoginOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: login,
  });
};
```

---

## エラーハンドリング

### 1. try-catch でのエラー処理

```typescript
import { ZodError } from "zod";

try {
  const response = await api.get("/users/1");
  const user = UserSchema.parse(response);
  setUser(user);
} catch (error) {
  if (error instanceof ZodError) {
    // Zodバリデーションエラー
    console.error("APIレスポンスが不正です:", error.errors);
    // ユーザーに通知
    toast.error("サーバーから不正なデータが返されました。管理者に連絡してください。");
  } else {
    // その他のエラー（ネットワークエラーなど）
    console.error("APIエラー:", error);
    toast.error("通信エラーが発生しました。");
  }
}
```

### 2. safeParse() による安全なバリデーション

```typescript
const response = await api.get("/users/1");
const result = UserSchema.safeParse(response);

if (!result.success) {
  // バリデーション失敗
  console.error("バリデーションエラー:", result.error);
  return null;
}

// バリデーション成功
const user = result.data;
setUser(user);
```

### 3. TanStack Query でのエラーハンドリング

```typescript
export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
    // エラーハンドリング
    retry: (failureCount, error) => {
      // Zodバリデーションエラーはリトライしない
      if (error instanceof ZodError) {
        return false;
      }
      // その他のエラーは最大3回リトライ
      return failureCount < 3;
    },
  });
};
```

---

## スキーマの再利用

### 共通スキーマの分離

```typescript
// src/lib/lib/validationscommon.ts
export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
});

export const TimestampsSchema = z.object({
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
```

### 共通スキーマの利用

```typescript
// src/features/sample-users/api/lib/validationsuser-response.ts
import { TimestampsSchema } from "@/lib/lib/validationscommon.schema";

export const UserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .merge(TimestampsSchema); // ✅ 共通スキーマをマージ

// 型推論結果:
// {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: string;
//   updatedAt: string;
// }
```

---

## ベストプラクティス

### ✅ DO: スキーマファイルを feature/api/lib/validations に配置

```text
src/features/
  sample-users/
    api/
      schemas/
        user-response.ts   ✅ レスポンススキーマ
      get-users.ts                ✅ API関数
      create-user.ts
```

### ✅ DO: スキーマとTypeScript型を同じファイルに定義

```typescript
// ✅ スキーマと型を同じファイルに
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof UserSchema>;
```

### ✅ DO: API関数内で parse() を使用

```typescript
export const getUsers = async (): Promise<{ data: User[] }> => {
  const response = await api.get("/sample/users");
  return UsersResponseSchema.parse(response); // ✅ parse()
};
```

### ❌ DON'T: API関数の外でバリデーション

```typescript
// ❌ 呼び出し側でバリデーション（一貫性がなくなる）
const response = await getUsers(); // バリデーションなし
const validated = UsersResponseSchema.parse(response); // 呼び出し側でバリデーション
```

### ✅ DO: 詳細なエラーメッセージ

```typescript
export const UserSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"), // ✅ 詳細なメッセージ
  email: z.string().email("有効なメールアドレスではありません"), // ✅ 詳細なメッセージ
});
```

### ❌ DON'T: デフォルトエラーメッセージのみ

```typescript
// ❌ デフォルトメッセージのみ（デバッグが困難）
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});
```

---

## トラブルシューティング

### エラー: "Expected string, received number"

**原因**: APIレスポンスのデータ型が期待と異なる

**解決策**:

1. バックエンドAPIのレスポンス形式を確認
2. スキーマをAPIの実際のレスポンスに合わせて修正
3. transform() で型変換

```typescript
// 解決例: 数値を文字列に変換
export const UserSchema = z.object({
  id: z.number().transform((val) => String(val)), // ✅ number → string
});
```

### エラー: "Required field missing"

**原因**: APIレスポンスに必須フィールドが存在しない

**解決策**:

1. バックエンドAPIの実装を確認
2. フィールドを optional() にするか nullable() にする

```typescript
// 解決例: オプショナルに変更
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(), // ✅ オプショナル
  displayName: z.string().nullable(), // ✅ null許可
});
```

### エラー: "Invalid enum value"

**原因**: APIレスポンスのenum値がスキーマの定義と一致しない

**解決策**:

1. バックエンドAPIのenum定義を確認
2. フロントエンドのenumをバックエンドに合わせる

```typescript
// 解決例: バックエンドのenum値に合わせる
export const UserRoleSchema = z.enum(["USER", "ADMIN"]); // ✅ 大文字に変更
```

---

## 関連ドキュメント

- [トークンバリデーション](./09-token-validation.md)
- [サーバーエラーハンドリング](./07-server-errors.md)
- [状態管理とバリデーション](../../03-core-concepts/02-state-management.md)
- [APIクライアント](../../03-core-concepts/06-api-client.md)
- [環境変数バリデーション](../../03-core-concepts/05-environment-variables.md)
