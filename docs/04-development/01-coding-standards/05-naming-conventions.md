# 命名規則

プロジェクト全体で統一された命名規則を使用することで、コードの一貫性と可読性を向上させます。

## 命名規則一覧

### ファイル・関数・変数

| タイプ               | 形式                             | 例                    |
| -------------------- | -------------------------------- | --------------------- |
| **コンポーネント**   | kebab-case                       | `user-form.tsx`       |
| **フック**           | kebab-case, `use-`プレフィックス | `use-users.ts`        |
| **ストア**           | kebab-case, `-store`サフィックス | `auth-store.ts`       |
| **API**              | kebab-case                       | `get-users.ts`        |
| **定数**             | UPPER_SNAKE_CASE                 | `MAX_RETRY_COUNT`     |
| **boolean変数/関数** | is/has/can/shouldプレフィックス  | `isActive`、`canEdit` |

### 型定義

| タイプ                     | 形式                                      | 例                          |
| -------------------------- | ----------------------------------------- | --------------------------- |
| **ドメインモデル**         | PascalCase（サフィックスなし）            | `User`、`ProjectMember`     |
| **API入力型（単一）**      | PascalCase + `Input`サフィックス          | `AddProjectMemberInput`     |
| **API入力型（一括）**      | `Bulk` + PascalCase + `Input`サフィックス | `BulkUpdateMembersInput`    |
| **Props型**                | コンポーネント名 + `Props`サフィックス    | `EditRoleModalProps`        |
| **イベントハンドラー型**   | 動詞 + 対象 + `Handler`サフィックス       | `MemberRoleChangeHandler`   |
| **状態型**                 | 名詞 + `State`サフィックス                | `AuthState`、`FormState`    |
| **設定型**                 | 名詞 + `Config`サフィックス               | `MutationConfig`            |

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

## API関連の型命名規則

### Input型とドメインモデルパターン

**基本原則:**

- **API入力**: `Input`サフィックス（API境界で使用）
- **API出力**: ドメインモデル（サフィックスなし）
- **一括操作**: `Bulk`プレフィックス + `Input`サフィックス

**理由:**

- ドメインモデルはビジネスの概念を表現（技術的な詳細を含まない）
- `Input`は「何を送信するか」を明確に表現
- `Response`/`DTO`などの技術的なサフィックスは不要
- GraphQL、tRPC、REST APIすべてで使える汎用的なパターン

### ドメインモデル（レスポンス型）

**命名ルール:**

- サフィックスなし（例: `User`、`ProjectMember`）
- 複数形は使わず、配列として扱う（例: `ProjectMember[]`）

**理由:**

- ビジネスドメインの概念をシンプルに表現
- 技術的な詳細（HTTPなど）を含まない
- 再利用性が高い

```typescript
// ✅ Good: ドメインモデル（サフィックスなし）
export type ProjectMember = {
  id: string;
  user_id: string;
  role: ProjectRole;
  joined_at: string;
  updated_at: string;
  user?: User;
};

export type User = {
  id: string;
  email: string;
  display_name: string;
};

// API関数のレスポンス型
export const getProjectMember = (
  projectId: string,
  memberId: string
): Promise<ProjectMember> => {  // ドメインモデルをそのまま返す
  return api.get(`/projects/${projectId}/members/${memberId}`);
};

export const getProjectMembers = (
  projectId: string
): Promise<ProjectMember[]> => {  // 配列で複数を表現
  return api.get(`/projects/${projectId}/members`);
};

// ❌ Bad: 技術的なサフィックス
type ProjectMemberResponse = { data: ProjectMember };  // 冗長
type ProjectMembersList = { data: ProjectMember[] };   // 冗長
type ProjectMemberDetail = { data: ProjectMember };    // 冗長
```

---

### Input型（リクエスト型）

**命名ルール:**

- **単一操作**: `Input`サフィックス（例: `AddProjectMemberInput`）
- **一括操作**: `Bulk` + `Input`サフィックス（例: `BulkUpdateMembersInput`）

**理由:**

- `Input`は「API入力データ」として明確
- `Bulk`プレフィックスで一括操作を明示
- DTO/Request などの技術用語より直感的

```typescript
// ✅ Good: 単一操作
export type AddProjectMemberInput = {
  user_id: string;
  role: ProjectRole;
};

export type UpdateMemberRoleInput = {
  role: ProjectRole;
};

// ✅ Good: 一括操作（Bulkプレフィックス）
export type BulkUpdateMembersInput = {
  updates: Array<{
    member_id: string;
    role: ProjectRole;
  }>;
};

export type BulkAddMembersInput = {
  members: AddProjectMemberInput[];
};

// API関数
export const addProjectMember = (
  projectId: string,
  input: AddProjectMemberInput
): Promise<ProjectMember> => {
  return api.post(`/projects/${projectId}/members`, input);
};

// ❌ Bad: DTO、Request、Paramsなどの混在
type AddProjectMemberDTO = { /* ... */ };      // DTOは古い
type AddProjectMemberRequest = { /* ... */ };  // REST専用で汎用性が低い
type AddProjectMemberParams = { /* ... */ };   // 曖昧
```

### Props型

**命名ルール:**

- コンポーネント名 + `Props`サフィックス
- 必ずエクスポートする（`export type`）

**理由:**

- Storybookやテストで型を再利用可能
- コンポーネントとProps型の関連が明確

```typescript
// ✅ Good: Props型をエクスポート
export type EditRoleModalProps = {
  isOpen: boolean
  onClose: () => void
  member: ProjectMember | null
  onSave: RoleSaveHandler
}

export const EditRoleModal = ({ isOpen, onClose, member, onSave }: EditRoleModalProps) => {
  // ...
}

// ❌ Bad: Props型がエクスポートされていない
type Props = { /* ... */ }  // 1. 汎用的すぎる名前
const EditRoleModal = ({ isOpen, onClose }: Props) => { /* ... */ }  // 2. exportされていない

// ❌ Bad: Props型が定義されていない
const EditRoleModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // インライン型定義は再利用できない
}
```

---

### イベントハンドラー型

**命名ルール:**

- 動詞 + 対象 + `Handler`サフィックス
- 明示的に型定義してエクスポート

**理由:**

- イベントハンドラーの責務が明確になる
- 複数のコンポーネントで同じハンドラー型を共有可能
- Props型でインライン定義するより可読性が高い

```typescript
// ✅ Good: 明示的なHandler型
export type MemberRoleChangeHandler = (memberId: string, newRole: ProjectRole) => void
export type MemberRemoveHandler = (memberId: string) => void
export type RoleSaveHandler = (newRole: ProjectRole) => void

// 使用例
export type MembersTableProps = {
  members: ProjectMember[]
  onRoleChange: MemberRoleChangeHandler
  onRemove: MemberRemoveHandler
}

// ❌ Bad: インライン型定義
export type MembersTableProps = {
  members: ProjectMember[]
  onRoleChange: (memberId: string, newRole: ProjectRole) => void  // 再利用できない
  onRemove: (memberId: string) => void  // 再利用できない
}

// ❌ Bad: 曖昧な命名
export type ChangeHandler = (id: string, value: string) => void  // 何を変更？
export type RemoveCallback = (id: string) => void  // HandlerかCallbackか不統一
```

---

### Zodスキーマパターン（推奨）

**命名ルール:**

- スキーマ: `camelCase` + `Schema`サフィックス
- 型: スキーマから`z.infer`で推論

**理由:**

- ランタイムバリデーション + 型安全性の両立
- 単一の情報源（DRY原則の徹底）
- OpenAPI/Swaggerとの統合が容易
- フロントエンド・バックエンド間での型共有が可能

```typescript
import { z } from 'zod';

// ✅ Good: Zodスキーマ定義
export const addProjectMemberInputSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(['project_manager', 'project_moderator', 'member', 'viewer']),
});

// 型は自動推論
export type AddProjectMemberInput = z.infer<typeof addProjectMemberInputSchema>;

// ドメインモデルスキーマ
export const projectMemberSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['project_manager', 'project_moderator', 'member', 'viewer']),
  joined_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;

// API関数でバリデーション
export const addProjectMember = (
  projectId: string,
  input: AddProjectMemberInput
): Promise<ProjectMember> => {
  // ランタイムバリデーション
  const validatedInput = addProjectMemberInputSchema.parse(input);
  return api.post(`/projects/${projectId}/members`, validatedInput);
};

// ❌ Bad: 手動で型を定義（DRYではない）
export type AddProjectMemberInput = {
  user_id: string;  // バリデーションロジックと型が分離
  role: ProjectRole;
};

const validate = (input: AddProjectMemberInput) => {
  if (!isUUID(input.user_id)) throw new Error('Invalid UUID');  // 重複
  // ...
};
```

**Zodの段階的導入:**

```typescript
// Phase 1: 既存の型にZodを追加（並行運用）
export type LoginInput = {
  email: string;
  password: string;
};

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Phase 2: z.inferで型を置き換え
export type LoginInput = z.infer<typeof loginInputSchema>;

// Phase 3: すべての型をZodスキーマから生成
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

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性と単一責任
- [リーダブルコード原則](./03-readable-code.md) - 読みやすい名前の付け方
- [TypeScript規約](./06-typescript-rules.md) - TypeScript固有の規約
