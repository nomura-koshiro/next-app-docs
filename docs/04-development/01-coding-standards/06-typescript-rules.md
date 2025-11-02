# TypeScript規約

TypeScript固有の規約とベストプラクティスについて説明します。

## 目次

1. [エクスポート関数は型を明示](#1-エクスポート関数は型を明示)
2. [Nullish coalescing演算子](#2-nullish-coalescing演算子)
3. [Optional Chaining](#3-optional-chaining)
4. [Type Guards](#4-type-guards)
5. [enum禁止パターン](#5-enum禁止パターン)
6. [グローバル型の配置](#6-グローバル型の配置)

---

## 1. エクスポート関数は型を明示

エクスポートされる関数は、引数と戻り値の型を明示的に定義します。

```typescript
// ❌ Bad: 型推論に依存
export const getUserData = (id) => {
  return users.find((u) => u.id === id);
};

// ✅ Good: 明示的な型定義
export const getUserData = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};
```

**なぜ重要か:**

- エクスポートされた関数は他のファイルから使用される
- 型が明示的だと、利用側で型推論が正確に機能する
- ドキュメントとしての役割も果たす

**例外:**

内部の private 関数は型推論に任せてもよい（ただし、明示的な型定義を推奨）

```typescript
// ✅ OK: 内部関数は型推論でも可
const formatName = (name: string) => {
  return name.trim().toLowerCase();
};

// ✅ Better: 内部関数でも型を明示
const formatName = (name: string): string => {
  return name.trim().toLowerCase();
};
```

---

## 2. Nullish coalescing演算子

`??`演算子を使用して、`null`または`undefined`の場合のデフォルト値を設定します。

```typescript
// ❌ Bad: 複雑な条件分岐
const userName = user && user.name ? user.name : 'ゲスト';

// ❌ Bad: ||演算子（0や''もfalthyとして扱われる）
const count = userCount || 10; // userCountが0の場合、10になってしまう

// ✅ Good: ??演算子
const userName = user?.name ?? 'ゲスト';
const count = userCount ?? 10; // userCountが0の場合、0のまま
```

**??と||の違い:**

- `||`: falsy値（`0`, `''`, `false`, `null`, `undefined`, `NaN`）でデフォルト値を返す
- `??`: `null`または`undefined`の場合のみデフォルト値を返す

```typescript
// 違いを明確にする例
const value1 = 0 || 10; // 10（0はfalsyなので）
const value2 = 0 ?? 10; // 0（0はnullでもundefinedでもない）

const value3 = '' || 'デフォルト'; // 'デフォルト'（''はfalsyなので）
const value4 = '' ?? 'デフォルト'; // ''（''はnullでもundefinedでもない）
```

---

## 3. Optional Chaining

`?.`演算子を使用して、ネストされたプロパティに安全にアクセスします。

```typescript
// ❌ Bad: 複数の条件チェック
const city = user && user.address && user.address.city;

// ❌ Bad: ネストした条件分岐
let city;
if (user) {
  if (user.address) {
    city = user.address.city;
  }
}

// ✅ Good: Optional Chaining
const city = user?.address?.city;
```

**配列要素へのアクセス:**

```typescript
// ❌ Bad
const firstUser = users && users[0] && users[0].name;

// ✅ Good
const firstUser = users?.[0]?.name;
```

**メソッド呼び出し:**

```typescript
// ❌ Bad
const result = obj && obj.method && obj.method();

// ✅ Good
const result = obj?.method?.();
```

**Optional Chaining + Nullish Coalescing:**

```typescript
// ✅ 組み合わせて使用
const userName = user?.profile?.name ?? 'ゲスト';
const userAge = user?.profile?.age ?? 0;
```

---

## 4. Type Guards

型ガードを使用して、型の絞り込みを行います。

### ユーザー定義Type Guard

```typescript
// ✅ Good: 型ガードを使用
const isUser = (value: unknown): value is User => {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
};

if (isUser(data)) {
  console.log(data.name); // 型安全
}
```

### typeof Type Guard

```typescript
// ✅ Good: typeofで型を絞り込み
const processValue = (value: string | number): string => {
  if (typeof value === 'string') {
    return value.toUpperCase(); // valueはstring型
  }

  return value.toString(); // valueはnumber型
};
```

### instanceof Type Guard

```typescript
// ✅ Good: instanceofで型を絞り込み
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message; // errorはError型
  }

  return '不明なエラー';
};
```

### in Type Guard

```typescript
type Dog = {
  bark: () => void;
};

type Cat = {
  meow: () => void;
};

// ✅ Good: inで型を絞り込み
const makeSound = (animal: Dog | Cat): void => {
  if ('bark' in animal) {
    animal.bark(); // animalはDog型
  } else {
    animal.meow(); // animalはCat型
  }
};
```

### Array.isArray Type Guard

```typescript
// ✅ Good: Array.isArrayで配列かどうか判定
const processData = (data: string | string[]): string[] => {
  if (Array.isArray(data)) {
    return data; // dataはstring[]型
  }

  return [data]; // dataはstring型
};
```

### 複合Type Guard

```typescript
type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: string;
};

// ✅ Good: 複合的な型ガード
const isSuccessResponse = <T>(response: ApiResponse<T>): response is { data: T; error?: never } => {
  return 'data' in response && response.data !== undefined;
};

const handleResponse = <T>(response: ApiResponse<T>): T => {
  if (isSuccessResponse(response)) {
    return response.data; // 型安全にdataにアクセス
  }

  throw new Error(response.error);
};
```

---

## 5. enum禁止パターン

このプロジェクトでは`enum`を使用せず、`const`と`type`の組み合わせを使用します。

**理由:**

- **Tree Shaking**: enumは完全にTree Shakingされない場合がある
- **バンドルサイズ削減**: constはランタイムコードを生成しない
- **シンプルさ**: TypeScriptの複雑な機能を避ける

```typescript
// ❌ Bad: enumを使用
enum ProjectRole {
  OWNER = 'owner',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

// ✅ Good: const + typeを使用
export const PROJECT_ROLES = {
  OWNER: 'owner',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const

export type ProjectRole = (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES]
// 型: "owner" | "member" | "viewer"
```

**型ガード関数の追加:**

```typescript
// 型ガード関数で安全な型変換
export const isProjectRole = (value: unknown): value is ProjectRole => {
  return Object.values(PROJECT_ROLES).includes(value as ProjectRole)
}

// 使用例
const role = 'owner'
if (isProjectRole(role)) {
  // roleはProjectRole型として扱われる
  console.log(role) // "owner" | "member" | "viewer"
}
```

**UI選択肢の定数化:**

```typescript
// UIで使用する選択肢も定数化
export type ProjectRoleOption = {
  value: ProjectRole
  label: string
  description: string
}

export const PROJECT_ROLE_OPTIONS: readonly ProjectRoleOption[] = [
  {
    value: PROJECT_ROLES.OWNER,
    label: 'オーナー',
    description: 'プロジェクトの全権限を持つ',
  },
  {
    value: PROJECT_ROLES.MEMBER,
    label: 'メンバー',
    description: '読み書き権限を持つ',
  },
  {
    value: PROJECT_ROLES.VIEWER,
    label: '閲覧者',
    description: '読み取り専用',
  },
] as const
```

---

## 6. グローバル型の配置

型定義は**使用範囲**に応じて配置場所を決定します。

### グローバル型: `/src/types/models/`

複数のfeatureで使用される型は`/src/types/models/`に配置します。

```typescript
// src/types/models/user.ts
export const SYSTEM_ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  USER: 'user',
} as const

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]

export const isSystemRole = (value: unknown): value is SystemRole => {
  return Object.values(SYSTEM_ROLES).includes(value as SystemRole)
}

export type User = {
  id: string
  azure_oid: string
  email: string
  display_name: string | null
  roles: SystemRole[]
  is_active: boolean
  created_at: string
  updated_at: string
  last_login: string | null
}
```

```typescript
// src/types/models/project.ts
export type Project = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
}
```

### 共通API型: `/src/types/api.ts`

API関連の共通型は`/src/types/api.ts`に配置します。

```typescript
// src/types/api.ts
export type ApiErrorResponse = {
  message: string
  detail?: string
  code?: string
  errors?: Record<string, string[]>
}
```

### Feature固有の型: `/src/features/{feature}/types/`

特定のfeatureでのみ使用される型は、そのfeature内に配置します。

```typescript
// src/features/projects/types/index.ts
import type { Project } from '@/types/models/project'
import type { User, SystemRole } from '@/types/models/user'

// グローバル型を再エクスポート
export type { Project } from '@/types/models/project'
export type { User, SystemRole } from '@/types/models/user'
export { isSystemRole, SYSTEM_ROLES } from '@/types/models/user'

// Feature固有の型定義
export const PROJECT_ROLES = {
  PROJECT_MANAGER: 'project_manager',
  DEVELOPER: 'developer',
  VIEWER: 'viewer',
} as const

export type ProjectRole = (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES]

export type ProjectMember = {
  id: string
  project_id: string
  user_id: string
  role: ProjectRole
  user?: User
  created_at: string
  updated_at: string
}
```

**型の配置フローチャート:**

```
型を定義する必要がある
  ↓
複数のfeatureで使用される？
  ↓ YES → /src/types/models/{model}.ts (例: user.ts, project.ts)
  ↓ NO
  ↓
API共通のエラー型など？
  ↓ YES → /src/types/api.ts
  ↓ NO
  ↓
特定のfeatureでのみ使用
  → /src/features/{feature}/types/index.ts
```

**メリット:**

- **一貫性**: 同じ型を複数箇所で定義しない
- **保守性**: 型の変更が1箇所で済む
- **明確な責任**: グローバル型とfeature固有型が明確に分離
- **型安全性**: インポート元が統一され、型の不整合が起きにくい

---

## 追加のベストプラクティス

### 1. strictモードを有効化

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true
  }
}
```

### 2. any型を避ける

```typescript
// ❌ Bad
const processData = (data: any): any => {
  return data.value;
};

// ✅ Good: unknownを使用
const processData = (data: unknown): string => {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String(data.value);
  }

  throw new Error('Invalid data');
};

// ✅ Good: ジェネリクスを使用
const processData = <T extends { value: string }>(data: T): string => {
  return data.value;
};
```

### 3. as型アサーションは最小限に

```typescript
// ❌ Bad: 不必要な型アサーション
const userName = (getUserName() as string).toUpperCase();

// ✅ Good: 型ガードを使用
const name = getUserName();
if (typeof name === 'string') {
  const userName = name.toUpperCase();
}
```

---

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性の確保
- [命名規則](./05-naming-conventions.md) - 型定義の命名規則
- [React/Next.js規約](./07-react-nextjs-rules.md) - React/Next.js固有の型使用
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
