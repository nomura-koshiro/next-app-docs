# コンポーネント設計原則

本ドキュメントでは、Reactコンポーネントの設計原則とContainer/Presentationalパターンについて説明します。単一責任の原則に基づき、保守性と再利用性の高いコンポーネントを作成するためのガイドラインを提供します。

## 目次

1. [設計原則](#設計原則)
2. [Container/Presentationalパターン](#containerpresentationalパターン)
3. [Good/Bad例](#goodbad例)
4. [CRUD処理の実装パターン](#crud処理の実装パターン)
5. [コンポーネント分割の判断基準](#コンポーネント分割の判断基準)
6. [アンチパターン](#アンチパターン)
7. [ディレクトリ構成](#ディレクトリ構成)
8. [チェックリスト](#チェックリスト)

---

## 設計原則

| 原則 | 説明 |
|------|------|
| **単一責任の原則** | 1つのコンポーネントは1つの責任 |
| **Presentational/Container分離** | 見た目とロジックを分離 |
| **サーバーステートはContainerで取得** | データ取得はContainer層で管理 |

---

## Container/Presentationalパターン

### Container Component（ロジック）

**責任:**

- データ取得（TanStack Query）
- 状態管理（useState, Zustand）
- ビジネスロジック
- イベントハンドラ

```typescript
// Container: データ取得とロジック
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const handleDelete = async (userId: string) => {
    await deleteUser.mutateAsync(userId)
  }

  if (isLoading) return <LoadingSpinner />

  return <UserList users={users ?? []} onDelete={handleDelete} />
}
```

### Presentational Component（見た目）

**責任:**

- UIレンダリング
- スタイリング
- イベント発火（親の関数を呼ぶ）

```typescript
// Presentational: UIのみ
type UserListProps = {
  users: User[]
  onDelete: (userId: string) => void
}

export const UserList = ({ users, onDelete }: UserListProps) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDelete(user.id)}>削除</button>
        </li>
      ))}
    </ul>
  )
}
```

---

## 型安全性のベストプラクティス

### Props型は必ずエクスポート

コンポーネントのProps型は必ずエクスポートし、テストやStorybookで再利用できるようにします。

```typescript
// ❌ Bad: Props型がエクスポートされていない
type Props = {
  user: User
  onDelete: (userId: string) => void
}

export const UserCard = ({ user, onDelete }: Props) => {
  return <div>...</div>
}

// ✅ Good: Props型をエクスポート
export type UserCardProps = {
  user: User
  onDelete: (userId: string) => void
}

export const UserCard = ({ user, onDelete }: UserCardProps) => {
  return <div>...</div>
}
```

**メリット:**

- Storybookで型を再利用できる
- テストで型を参照できる
- 他のコンポーネントで同じ型を使える
- 型の変更が追跡しやすい

### イベントハンドラー型の明示的な定義

イベントハンドラーには`Handler`サフィックスを付けた明示的な型を定義します。

```typescript
// ❌ Bad: インライン型定義
export type MembersTableProps = {
  members: ProjectMember[]
  onRoleChange: (memberId: string, newRole: ProjectRole) => void
  onRemove: (memberId: string) => void
}

// ✅ Good: 明示的なHandler型
export type MemberRoleChangeHandler = (
  memberId: string,
  newRole: ProjectRole
) => void

export type MemberRemoveHandler = (memberId: string) => void

export type MembersTableProps = {
  members: ProjectMember[]
  onRoleChange: MemberRoleChangeHandler
  onRemove: MemberRemoveHandler
}
```

**メリット:**

- 型の再利用性が向上
- 型の意図が明確になる
- 複数のコンポーネントで同じイベント型を共有できる
- 型の変更が1箇所で済む

**完全な実装例:**

```typescript
// types/index.ts
export type MemberRoleChangeHandler = (
  memberId: string,
  newRole: ProjectRole
) => void

export type MemberRemoveHandler = (memberId: string) => void

export type RoleSaveHandler = (newRole: ProjectRole) => void

// components/members-table.tsx
export type MembersTableProps = {
  members: ProjectMember[]
  onRoleChange: MemberRoleChangeHandler
  onRemove: MemberRemoveHandler
}

export const MembersTable = ({
  members,
  onRoleChange,
  onRemove,
}: MembersTableProps) => {
  // ...
}

// components/members-container.tsx
export const MembersContainer = ({ projectId }: { projectId: string }) => {
  const { data: members } = useProjectMembers(projectId)
  const updateRole = useUpdateMemberRole({ projectId })
  const removeMember = useRemoveMember({ projectId })

  const handleRoleChange: MemberRoleChangeHandler = (memberId, newRole) => {
    updateRole.mutate({ memberId, data: { role: newRole } })
  }

  const handleRemove: MemberRemoveHandler = (memberId) => {
    removeMember.mutate({ memberId })
  }

  return (
    <MembersTable
      members={members ?? []}
      onRoleChange={handleRoleChange}
      onRemove={handleRemove}
    />
  )
}
```

### UI選択肢の定数化

UIで使用する選択肢（ドロップダウン、ラジオボタンなど）は、型と定数のペアとして定義します。

```typescript
// ❌ Bad: コンポーネント内にハードコード
export const RoleSelect = ({ value, onChange }: RoleSelectProps) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="project_manager">プロジェクトマネージャー</option>
      <option value="developer">開発者</option>
      <option value="viewer">閲覧者</option>
    </select>
  )
}

// ✅ Good: 型と定数で定義
// types/index.ts
export const PROJECT_ROLES = {
  PROJECT_MANAGER: 'project_manager',
  DEVELOPER: 'developer',
  VIEWER: 'viewer',
} as const

export type ProjectRole = (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES]

export type ProjectRoleOption = {
  value: ProjectRole
  label: string
  description: string
}

export const PROJECT_ROLE_OPTIONS: readonly ProjectRoleOption[] = [
  {
    value: PROJECT_ROLES.PROJECT_MANAGER,
    label: 'プロジェクトマネージャー',
    description: 'プロジェクトの全権限を持つ',
  },
  {
    value: PROJECT_ROLES.DEVELOPER,
    label: '開発者',
    description: '読み書き権限を持つ',
  },
  {
    value: PROJECT_ROLES.VIEWER,
    label: '閲覧者',
    description: '読み取り専用',
  },
] as const

// components/role-select.tsx
import { PROJECT_ROLE_OPTIONS } from '../types'

export const RoleSelect = ({ value, onChange }: RoleSelectProps) => {
  return (
    <select value={value} onChange={onChange}>
      {PROJECT_ROLE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
```

**メリット:**

- 選択肢の定義が1箇所に集約
- 複数のコンポーネントで再利用可能
- 型安全性が保証される
- テストやStorybookで使用しやすい
- ラベルや説明の変更が容易

---

## Good/Bad例

### ❌ Bad: 複数の責任が混在

```typescript
export const UserPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const res = await api.get('/sample/users')
      setUsers(res.data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    await api.delete(`/sample/users/${id}`)
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <table>
      {loading ? '読み込み中...' : users.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td><button onClick={() => handleDelete(user.id)}>削除</button></td>
        </tr>
      ))}
    </table>
  )
}
```

**問題点:**

- データ取得・削除・UIが1つに混在
- テストが困難
- 再利用不可

### ✅ Good: 責任を分離

```typescript
// Container: ロジック
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const handleDelete = async (userId: string) => {
    await deleteUser.mutateAsync(userId)
  }

  if (isLoading) return <LoadingSpinner />

  return <UserList users={users ?? []} onDelete={handleDelete} />
}

// Presentational: UI
type UserListProps = {
  users: User[]
  onDelete: (userId: string) => void
}

export const UserList = ({ users, onDelete }: UserListProps) => {
  return (
    <table>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td><button onClick={() => onDelete(user.id)}>削除</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

**メリット:**

- ✅ 責任が明確
- ✅ テストが容易
- ✅ 再利用可能
- ✅ 変更の影響範囲が小さい

---

## CRUD処理の実装パターン

### データ取得（Read）

```typescript
// Container
export const UserDetailContainer = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) return <LoadingSpinner />
  if (!user) return <div>ユーザーが見つかりません</div>

  return <UserDetail user={user} />
}

// Presentational
export const UserDetail = ({ user }: { user: User }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### データ作成（Create）

```typescript
// Container
export const UserCreateContainer = () => {
  const createUser = useCreateUser()

  const handleSubmit = async (data: CreateUserInput) => {
    await createUser.mutateAsync(data)
  }

  return (
    <UserForm onSubmit={handleSubmit} isSubmitting={createUser.isPending} />
  )
}

// Presentational
type UserFormProps = {
  onSubmit: (data: CreateUserInput) => void
  isSubmitting: boolean
}

export const UserForm = ({ onSubmit, isSubmitting }: UserFormProps) => {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '作成'}
      </button>
    </form>
  )
}
```

### データ更新（Update）

```typescript
// Container
export const UserEditContainer = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useUser(userId)
  const updateUser = useUpdateUser()

  const handleSubmit = async (data: UpdateUserInput) => {
    await updateUser.mutateAsync({ userId, data })
  }

  if (isLoading) return <LoadingSpinner />
  if (!user) return <div>ユーザーが見つかりません</div>

  return (
    <UserForm
      user={user}
      onSubmit={handleSubmit}
      isSubmitting={updateUser.isPending}
    />
  )
}
```

### データ削除（Delete）

```typescript
// Container
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const handleDelete = async (userId: string) => {
    if (!confirm('本当に削除しますか?')) return
    await deleteUser.mutateAsync(userId)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <UserList
      users={users ?? []}
      onDelete={handleDelete}
      isDeleting={deleteUser.isPending}
    />
  )
}
```

---

## コンポーネント分割の判断基準

### 分割すべきタイミング

- 50行を超えたら分割を検討
- 同じJSXパターンが2回以上現れたら分割
- 独立した責任が見えたら分割

### 段階的な分割例

```typescript
// ステップ1: Container/Presentational分離
export const ProductPageContainer = ({ productId }: { productId: string }) => {
  const { data: product } = useProduct(productId)
  const { data: reviews } = useReviews(productId)

  return <ProductPage product={product} reviews={reviews} />
}

export const ProductPage = ({ product, reviews }: ProductPageProps) => {
  return (
    <div>
      <ProductInfo product={product} />
      <ReviewList reviews={reviews} />
    </div>
  )
}

// ステップ2: さらに細分化
export const ProductInfo = ({ product }: { product: Product }) => {
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.price}円</p>
    </div>
  )
}

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  return (
    <ul>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ul>
  )
}

export const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <li>
      <Rating value={review.rating} />
      <p>{review.comment}</p>
    </li>
  )
}
```

---

## アンチパターン

### ❌ 1. PresentationalでTanStack Queryを使う

```typescript
// ❌ Bad
export const UserList = () => {
  const { data: users } = useUsers()  // NG
  return <ul>{users?.map(...)}</ul>
}

// ✅ Good
export const UserListContainer = () => {
  const { data: users } = useUsers()
  return <UserList users={users ?? []} />
}

export const UserList = ({ users }: { users: User[] }) => {
  return <ul>{users.map(...)}</ul>
}
```

### ❌ 2. Containerに複雑なJSX

```typescript
// ❌ Bad
export const UserListContainer = () => {
  const { data: users } = useUsers()

  return (
    <table>
      <thead>...</thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>...</tr>
        ))}
      </tbody>
    </table>
  )
}

// ✅ Good
export const UserListContainer = () => {
  const { data: users } = useUsers()
  return <UserList users={users ?? []} />
}
```

### ❌ 3. 複数の責任を持つコンポーネント

```typescript
// ❌ Bad: データ取得・フィルタリング・UIが混在
export const UserList = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  const filtered = users.filter((u) => u.name.includes(search))

  return <div>...</div>
}

// ✅ Good: 責任を分離
export const UserListContainer = () => {
  const { data: users } = useUsers()
  const [search, setSearch] = useState('')

  return (
    <UserList
      users={users ?? []}
      search={search}
      onSearchChange={setSearch}
    />
  )
}
```

---

## ディレクトリ構成

```text
features/users/
├── api/
│   ├── get-users.ts         # useUsers
│   ├── create-user.ts       # useCreateUser
│   ├── update-user.ts       # useUpdateUser
│   └── delete-user.ts       # useDeleteUser
├── components/
│   ├── user-list.tsx        # Presentational
│   ├── user-list-container.tsx  # Container
│   ├── user-form.tsx        # Presentational
│   └── user-card.tsx        # Presentational
└── types/
    └── index.ts             # User型定義
```

### ファイル命名規則

| タイプ | 命名規則 | 例 |
|--------|---------|---|
| **Container** | `{name}-container.tsx` | `user-list-container.tsx` |
| **Presentational** | `{name}.tsx` | `user-list.tsx` |
| **API Hook** | `{action}-{resource}.ts` | `get-users.ts` |

## チェックリスト

### Container Component

- [ ] TanStack QueryでデータをFetch
- [ ] useMutationで更新・削除を実装
- [ ] イベントハンドラを定義
- [ ] Presentational ComponentにPropsでデータを渡す
- [ ] JSXは最小限

### Presentational Component

- [ ] Propsでデータを受け取る
- [ ] UIをレンダリング
- [ ] データ取得しない
- [ ] ビジネスロジックを持たない
- [ ] 再利用可能

---

## 参考リンク

- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
