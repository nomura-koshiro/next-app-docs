# 命名規則

プロジェクト全体で統一された命名規則を使用することで、コードの一貫性と可読性を向上させます。

## 命名規則一覧

| タイプ               | 形式                             | 例                    |
| -------------------- | -------------------------------- | --------------------- |
| **コンポーネント**   | kebab-case                       | `user-form.tsx`       |
| **フック**           | kebab-case, `use-`プレフィックス | `use-users.ts`        |
| **ストア**           | kebab-case, `-store`サフィックス | `auth-store.ts`       |
| **API**              | kebab-case                       | `get-users.ts`        |
| **型定義**           | PascalCase                       | `User`、`UserProfile` |
| **定数**             | UPPER_SNAKE_CASE                 | `MAX_RETRY_COUNT`     |
| **boolean変数/関数** | is/has/can/shouldプレフィックス  | `isActive`、`canEdit` |

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

### 型定義

```typescript
// PascalCaseで定義
type User = {
  id: string;
  name: string;
};

type UserProfile = {
  user: User;
  bio: string;
};
```

### 定数

```typescript
// UPPER_SNAKE_CASEで定義
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;
```

### Boolean変数・関数

```typescript
// is/has/can/shouldプレフィックスを使用
const isActive = true;
const hasPermission = checkPermission();
const canEdit = user.role === 'admin';
const shouldShowWarning = errors.length > 0;

// Boolean返り値の関数
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const hasAccess = (user: User, resource: string): boolean => {
  return user.permissions.includes(resource);
};
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
const user = (id: string) => { /* ... */ };
const total = (items: Item[]) => { /* ... */ };

// ✅ Good: 動詞で始まる
const getUser = (id: string) => { /* ... */ };
const calculateTotal = (items: Item[]) => { /* ... */ };
```

### 4. 複数形・単数形を正確に

```typescript
// ❌ Bad: 複数形・単数形が不正確
const user = ['Alice', 'Bob']; // 配列なのに単数形
const users = 'Alice'; // 単数なのに複数形

// ✅ Good: 複数形・単数形が正確
const users = ['Alice', 'Bob']; // 配列は複数形
const user = 'Alice'; // 単数は単数形
```

### 5. 略語は避ける

```typescript
// ❌ Bad: 不明確な略語
const usrMgr = new UserManager();
const btnClk = handleClick();
const msg = 'Hello';

// ✅ Good: 完全な単語
const userManager = new UserManager();
const buttonClick = handleClick();
const message = 'Hello';

// ✅ 例外: 広く知られている略語はOK
const apiUrl = 'https://api.example.com';
const htmlContent = '<div>...</div>';
const userId = '123';
```

## ディレクトリ・ファイル構造

### コンポーネント

```
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

```
src/hooks/
├── use-users.ts       # kebab-case + use- prefix
├── use-auth.ts
└── use-form.ts
```

### ストア

```
src/stores/
├── auth-store.ts      # kebab-case + -store suffix
├── user-store.ts
└── cart-store.ts
```

### API

```
src/lib/api/
├── users/
│   ├── get-users.ts   # kebab-case + HTTP method
│   ├── create-user.ts
│   └── update-user.ts
└── posts/
    ├── get-posts.ts
    └── create-post.ts
```

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性と単一責任
- [リーダブルコード原則](./03-readable-code.md) - 読みやすい名前の付け方
- [TypeScript規約](./06-typescript-rules.md) - TypeScript固有の規約
