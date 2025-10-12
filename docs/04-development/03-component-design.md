# コンポーネント設計原則

本ドキュメントでは、Reactコンポーネントの設計原則とContainer/Presentationalパターンについて説明します。単一責任の原則に基づき、保守性と再利用性の高いコンポーネントを作成するためのガイドラインを提供します。

## 目次

1. [設計原則](#設計原則)
2. [Container/Presentationalパターン](#containerpresentationalパターン)
3. [Good/Bad例](#goodbad例)
4. [CRUD処理の実装パターン](#crud処理の実装パターン)
5. [コンポーネント分割の判断基準](#コンポーネント分割の判断基準)
6. [ディレクトリ構成](#ディレクトリ構成)
7. [アンチパターン](#アンチパターン)
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
interface UserListProps {
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

## Good/Bad例

### ❌ Bad: 複数の責任が混在

```typescript
export const UserPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const res = await api.get('/users')
      setUsers(res.data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    await api.delete(`/users/${id}`)
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
interface UserListProps {
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
interface UserFormProps {
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
