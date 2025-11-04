# 命名規則

プロジェクト全体で統一された命名規則を使用することで、コードの一貫性と可読性を向上させます。

## 命名規則一覧

### ファイル・コード要素

| タイプ               | 形式                             | 例                    |
| -------------------- | -------------------------------- | --------------------- |
| **コンポーネント**   | kebab-case                       | `user-form.tsx`       |
| **フック**           | kebab-case, `use-`プレフィックス | `use-users.ts`        |
| **ストア**           | kebab-case, `-store`サフィックス | `auth-store.ts`       |
| **API**              | kebab-case                       | `get-users.ts`        |
| **定数**             | UPPER_SNAKE_CASE                 | `MAX_RETRY_COUNT`     |
| **boolean変数/関数** | is/has/can/shouldプレフィックス  | `isActive`、`canEdit` |

### 型定義

| タイプ                   | 形式                   | 例                                    |
| ------------------------ | ---------------------- | ------------------------------------- |
| **Zodスキーマ**          | camelCase + `Schema`   | `createUserSchema`、`userSchema`      |
| **基本型/モデル**        | PascalCase             | `User`、`Project`、`Message`          |
| **入力型（フォーム等）** | PascalCase + `Input`   | `CreateUserInput`、`UpdateUserInput`  |
| **出力型（API等）**      | PascalCase + `Output`  | `UserOutput`、`UsersOutput`           |
| **状態型**               | PascalCase + `State`   | `AuthState`、`FormState`              |
| **アクション型**         | PascalCase + `Actions` | `AuthActions`、`UserActions`          |
| **ストア型**             | PascalCase + `Store`   | `AuthStore`、`UserStore`              |
| **その他のビジネス型**   | PascalCase             | `UploadedFile`、`DownloadProgress`    |
| **ユニオン型/列挙型的**  | PascalCase             | `UserRole`、`MessageRole`、`FileType` |

## 実例

### コンポーネント

```typescript
// ファイル名: user-form.tsx
export const UserForm = () => {
  /* ... */
};
```

### フック

```typescript
// ファイル名: use-users.ts
export const useUsers = () => {
  /* ... */
};
```

### ストア

```typescript
// ファイル名: auth-store.ts
export const useAuthStore = create<AuthStore>((set) => ({
  /* ... */
}));
```

### API関数

```typescript
// ファイル名: get-users.ts
export const getUsers = async (): Promise<User[]> => {
  /* ... */
};
```

### 型定義（Zodベース）

Zodスキーマを使用してバリデーションと型定義を一元管理します。

```typescript
import { z } from "zod";

// 1. Zodスキーマを定義（camelCase + Schema）
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  role: z.enum(["admin", "user", "guest"]),
});

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.enum(["admin", "user", "guest"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
});

// 2. スキーマから型を推論（PascalCase）
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// 3. API出力型（バックエンドからのレスポンス）
export type UserOutput = User; // 単一
export type UsersOutput = {
  data: User[];
  total: number;
  page: number;
};

// 4. 状態管理
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export type AuthStore = AuthState & AuthActions;
```

### 定数

```typescript
// UPPER_SNAKE_CASEで定義
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_PAGE_SIZE = 20;
```

### Boolean変数・関数

```typescript
// is/has/can/shouldプレフィックスを使用
const isActive = true;
const hasPermission = checkPermission();
const canEdit = user.role === "admin";
const shouldShowWarning = errors.length > 0;

// Boolean返り値の関数
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const hasAccess = (user: User, resource: string): boolean => {
  return user.permissions.includes(resource);
};
```

## 型定義のベストプラクティス

### 1. Zodスキーマファースト

```typescript
import { z } from "zod";

// ❌ Bad: 型定義だけでバリデーションがない
type CreateUser = {
  name: string;
  email: string;
};

// ✅ Good: Zodスキーマから型を推論
export const createUserSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// 使用例
const result = createUserSchema.safeParse(formData);
if (result.success) {
  // result.data は CreateUserInput 型
  await createUser(result.data);
}
```

### 2. Input/Output の使い分け

```typescript
// ❌ Bad: Request/Response は古い命名
type CreateUserRequest = { name: string };
type CreateUserResponse = { data: User };

// ✅ Good: Input/Output の方が意図が明確
type CreateUserInput = z.infer<typeof createUserSchema>;
type UserOutput = User; // APIからの出力
type UsersOutput = { data: User[]; total: number }; // リスト出力
```

### 3. スキーマの再利用

```typescript
// ベーススキーマ
const userBaseSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

// 作成用（ベース + パスワード）
export const createUserSchema = userBaseSchema.extend({
  password: z.string().min(8),
});

// 更新用（全てオプショナル）
export const updateUserSchema = userBaseSchema.partial();

// 完全なユーザー（ベース + ID）
export const userSchema = userBaseSchema.extend({
  id: z.string(),
  createdAt: z.iso.datetime(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userSchema>;
```

### 4. State/Actions/Store の使い分け

```typescript
// State: 状態データのみ
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

// Actions: アクションのみ
type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Store: StateとActionsを統合
type AuthStore = AuthState & AuthActions;

// ✅ Good: 分離することで再利用性が向上
const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    /* ... */
  },
  logout: () => {
    /* ... */
  },
}));
```

### 5. Enum vs Union Type vs Zod Enum

```typescript
// ❌ Bad: TypeScript Enum（実行時オーバーヘッドあり）
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// ✅ Good: Zod Enum（バリデーション + 型推論）
export const userRoleSchema = z.enum(["admin", "user", "guest"]);
export type UserRole = z.infer<typeof userRoleSchema>; // "admin" | "user" | "guest"

// ✅ Also Good: シンプルなUnion Type（バリデーション不要な場合）
export type MessageRole = "user" | "assistant";
```

### 6. フォームとAPIで型を共有

```typescript
import { z } from "zod";

// スキーマ定義
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// React Hook Formで使用
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function UserForm() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    // data は自動的にバリデーション済み
    await api.createUser(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>;
}

// API関数で使用
export async function createUser(input: CreateUserInput): Promise<UserOutput> {
  // input は既にバリデーション済みなので安全
  const response = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.json();
}
```

## 命名のベストプラクティス

### 1. 明確で具体的な名前

```typescript
// ❌ Bad: 曖昧な名前
const data = fetchData();
const temp = calculate();
const result = process();

// ✅ Good: 明確で具体的な名前
const userData = fetchUserData();
const totalPrice = calculateTotalPrice();
const validatedForm = processFormData();
```

### 2. 単位を含める

```typescript
// ❌ Bad: 単位が不明
type Config = {
  timeout: number;
  maxSize: number;
  delay: number;
};

// ✅ Good: 単位を明示
type Config = {
  timeoutInMilliseconds: number;
  maxSizeInBytes: number;
  delayInSeconds: number;
};
```

### 3. 動詞で始める関数名

```typescript
// ❌ Bad: 動詞がない
const user = (id: string) => {
  /* ... */
};
const total = (items: Item[]) => {
  /* ... */
};

// ✅ Good: 動詞で始まる
const getUser = (id: string) => {
  /* ... */
};
const calculateTotal = (items: Item[]) => {
  /* ... */
};
```

### 4. 複数形・単数形を正確に

```typescript
// ❌ Bad: 複数形・単数形が不正確
const user = ["Alice", "Bob"]; // 配列なのに単数形
const users = "Alice"; // 単数なのに複数形

// ✅ Good: 複数形・単数形が正確
const users = ["Alice", "Bob"]; // 配列は複数形
const user = "Alice"; // 単数は単数形
```

### 5. 略語は避ける

```typescript
// ❌ Bad: 不明確な略語
const usrMgr = new UserManager();
const btnClk = handleClick();
const msg = "Hello";

// ✅ Good: 完全な単語
const userManager = new UserManager();
const buttonClick = handleClick();
const message = "Hello";

// ✅ 例外: 広く知られている略語はOK
const apiUrl = "https://api.example.com";
const htmlContent = "<div>...</div>";
const userId = "123";
```

## ディレクトリ・ファイル構造

### コンポーネント

```text
src/components/
├── ui/
│   ├── button/
│   │   ├── button.tsx          # kebab-case
│   │   ├── button.stories.tsx
│   │   └── index.ts
│   └── modal/
│       ├── modal.tsx
│       └── index.ts
└── layout/
    └── header/
        ├── header.tsx
        └── index.ts
```

### フック

```text
src/hooks/
├── use-users.ts       # kebab-case + use- prefix
├── use-auth.ts
└── use-form.ts
```

### ストア

```text
src/stores/
├── auth-store.ts      # kebab-case + -store suffix
├── user-store.ts
└── cart-store.ts
```

### API

```text
src/lib/api/
├── users/
│   ├── get-users.ts   # kebab-case + HTTP method
│   ├── create-user.ts
│   └── update-user.ts
└── posts/
    ├── get-posts.ts
    └── create-post.ts
```

### 型定義（Zodスキーマベース）

```text
# 推奨: 機能ごとにスキーマと型をまとめる
src/features/
└── users/
    ├── schemas/
    │   └── user.ts      # Zodスキーマ（createUserSchema等）
    └── types/
        └── index.ts            # 型エクスポート（CreateUserInput等）

# または、スキーマと型を同じファイルに
src/features/
└── users/
    └── types/
        └── index.ts            # スキーマ + 型を一緒に定義

# 実装例
# src/features/users/types/index.ts
import { z } from "zod";

// Zodスキーマ
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const userSchema = createUserSchema.extend({
  id: z.string(),
  createdAt: z.iso.datetime(),
});

// 推論された型
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;

// API出力型
export type UserOutput = User;
export type UsersOutput = {
  data: User[];
  total: number;
};
```

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性と単一責任
- [リーダブルコード原則](./03-readable-code.md) - 読みやすい名前の付け方
- [TypeScript規約](./06-typescript-rules.md) - TypeScript固有の規約
