# コンポーネント設計原則

このドキュメントでは、Reactコンポーネントの設計原則と実装パターンについて説明します。

## 目次

1. [コンポーネント設計の全体像](#コンポーネント設計の全体像)
2. [単一責任の原則（SRP）](#単一責任の原則srp)
3. [Presentational/Containerパターン](#presentationalcontainerパターン)
4. [サーバーステートの取得ルール](#サーバーステートの取得ルール)
5. [更新・削除処理の実装](#更新削除処理の実装)
6. [コンポーネント分割の実践](#コンポーネント分割の実践)
7. [ディレクトリ構成](#ディレクトリ構成)
8. [アンチパターン](#アンチパターン)

---

## コンポーネント設計の全体像

### 設計原則の概要

このプロジェクトでは、**保守性**と**再利用性**を高めるために、以下の設計原則を採用しています。

| 原則 | 説明 | 目的 |
|------|------|------|
| **単一責任の原則** | 1つのコンポーネントは1つのことだけを行う | 責任範囲の明確化、テストの容易性 |
| **Presentational/Container分離** | 見た目とロジックを分離する | 再利用性の向上、関心の分離 |
| **サーバーステートはContainerで取得** | データ取得はContainer層で集中管理 | データフローの可視化、キャッシュの最適化 |

### コンポーネントの責任レイヤー

```
┌─────────────────────────────────────────┐
│ Container Component                     │
│ - データ取得（TanStack Query）          │
│ - 状態管理（useState, Zustand）         │
│ - ビジネスロジック                       │
│ - イベントハンドラ                       │
└─────────────────┬───────────────────────┘
                  │ Props渡し
                  ↓
┌─────────────────────────────────────────┐
│ Presentational Component                │
│ - UIレンダリング                         │
│ - スタイリング                           │
│ - イベント発火（親から受け取った関数）    │
└─────────────────────────────────────────┘
```

---

## 単一責任の原則（SRP）

### 概要

**単一責任の原則（Single Responsibility Principle）** は、1つのコンポーネントが1つのことだけを行うべきという考え方です。

### なぜ重要か

```typescript
// ❌ Bad: 複数の責任を持つコンポーネント
import { api } from '@/lib/api-client'

export const UserPage = () => {
  // データ取得
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const res = await api.get('/api/users')
      setUsers(res.data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  // フィルタリング
  const [searchQuery, setSearchQuery] = useState('')
  const filteredUsers = users.filter((u) => u.name.includes(searchQuery))

  // ソート
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  )

  // 削除処理
  const handleDelete = async (id: string) => {
    await api.delete(`/api/users/${id}`)
    setUsers(users.filter((u) => u.id !== id))
  }

  // UIレンダリング
  return (
    <div>
      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        並び替え
      </button>
      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>名前</th>
              <th>メール</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

**問題点:**
- データ取得、フィルタリング、ソート、削除、UIレンダリングが1つのコンポーネントに混在
- テストが困難（全ての機能をテストする必要がある）
- 再利用できない（ユーザーテーブルを別の場所で使えない）
- 変更の影響範囲が大きい

### 単一責任に分割

```typescript
// ✅ Good: 責任ごとにコンポーネントを分割

// 1. Container: データ取得とビジネスロジック
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleDelete = async (id: string) => {
    await deleteUser.mutateAsync(id)
  }

  return (
    <UserList
      users={users ?? []}
      loading={isLoading}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortOrder={sortOrder}
      onSortChange={setSortOrder}
      onDelete={handleDelete}
    />
  )
}

// 2. Presentational: UIレンダリングのみ
interface UserListProps {
  users: User[]
  loading: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOrder: 'asc' | 'desc'
  onSortChange: (order: 'asc' | 'desc') => void
  onDelete: (id: string) => void
}

export const UserList = ({
  users,
  loading,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  onDelete,
}: UserListProps) => {
  // フィルタリングとソートはUIロジックとして許容
  const filteredUsers = users.filter((u) => u.name.includes(searchQuery))
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  )

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      <SortButton order={sortOrder} onToggle={onSortChange} />
      <UserTable users={sortedUsers} onDelete={onDelete} />
    </div>
  )
}

// 3. さらに細分化: テーブルコンポーネント
interface UserTableProps {
  users: User[]
  onDelete: (id: string) => void
}

export const UserTable = ({ users, onDelete }: UserTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>名前</th>
          <th>メール</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserTableRow key={user.id} user={user} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  )
}

// 4. 行コンポーネント: 1つのユーザーの表示のみ
interface UserTableRowProps {
  user: User
  onDelete: (id: string) => void
}

export const UserTableRow = ({ user, onDelete }: UserTableRowProps) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <button onClick={() => onDelete(user.id)}>削除</button>
      </td>
    </tr>
  )
}
```

**メリット:**
- ✅ 各コンポーネントの責任が明確
- ✅ `UserTable`や`UserTableRow`を他の場所で再利用可能
- ✅ テストが容易（例: `UserTable`は`users`配列と`onDelete`関数だけテストすればOK）
- ✅ 変更の影響範囲が小さい（UIの変更はPresentational、ロジックの変更はContainer）

---

## Presentational/Containerパターン

### 概要

**Presentational/Containerパターン**は、コンポーネントを以下の2つに分離する設計パターンです。

| タイプ | 責任 | 扱うもの |
|--------|------|---------|
| **Container Component** | ロジック・データ取得 | TanStack Query, useState, Zustand, ビジネスロジック |
| **Presentational Component** | 見た目・UI | Props, JSX, CSS, UIロジック |

### Presentational Component（見た目）

**責任:**
- UIをレンダリングする
- Propsを受け取って表示する
- イベントを発火する（親から受け取った関数を呼ぶ）
- スタイリング

**特徴:**
- ステートレス（または最小限のUIステート）
- データ取得しない
- ビジネスロジックを持たない
- 再利用可能

```typescript
// ✅ Presentational Component の例
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

export const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  return (
    <Card className="p-6">
      <Avatar src={user.avatar} alt={user.name} className="w-16 h-16" />
      <h3 className="text-xl font-semibold mt-4">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => onEdit(user)}>編集</Button>
        <Button onClick={() => onDelete(user.id)} variant="destructive">
          削除
        </Button>
      </div>
    </Card>
  )
}
```

### Container Component（ロジック）

**責任:**
- データを取得する（TanStack Query）
- 状態を管理する（useState, Zustand）
- ビジネスロジックを処理する
- イベントハンドラを定義する
- Presentational Componentにデータを渡す

**特徴:**
- ステートフル
- データ取得・更新を行う
- 最小限のJSX（基本的にPresentational Componentを呼び出すのみ）

```typescript
// ✅ Container Component の例
export const UserCardContainer = ({ userId }: { userId: string }) => {
  // データ取得
  const { data: user, isLoading } = useUser(userId)
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  // ローカルステート
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // イベントハンドラ
  const handleEdit = (user: User) => {
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('本当に削除しますか？')) {
      await deleteUser.mutateAsync(userId)
    }
  }

  const handleUpdate = async (data: UpdateUserInput) => {
    await updateUser.mutateAsync({ userId, data })
    setIsEditDialogOpen(false)
  }

  if (isLoading) return <div className="h-48 w-full animate-pulse bg-muted rounded-lg" />
  if (!user) return <div>ユーザーが見つかりません</div>

  return (
    <>
      <UserCard user={user} onEdit={handleEdit} onDelete={handleDelete} />

      <UserEditDialog
        open={isEditDialogOpen}
        user={user}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdate}
      />
    </>
  )
}
```

### パターンの使い分け

```typescript
// ❌ Bad: Presentationalなのにデータをfetchしている
export const UserCard = ({ userId }: { userId: string }) => {
  const { data: user } = useUser(userId) // Presentationalでデータ取得はNG

  return <Card>...</Card>
}

// ✅ Good: Containerでデータを取得し、Presentationalに渡す
export const UserCardContainer = ({ userId }: { userId: string }) => {
  const { data: user } = useUser(userId)

  if (!user) return null

  return <UserCard user={user} />
}

export const UserCard = ({ user }: { user: User }) => {
  return <Card>...</Card>
}
```

---

## サーバーステートの取得ルール

### 原則: **サーバーステートはContainer Componentで取得する**

サーバーから取得するデータは、必ず**Container Component**で取得し、**Presentational Component**にPropsとして渡します。

### なぜこのルールが重要か

```typescript
// ❌ Bad: Presentational ComponentでTanStack Queryを使う
export const UserList = () => {
  // Presentationalなのにデータ取得している
  const { data: users, isLoading } = useUsers()

  if (isLoading) return <div>読み込み中...</div>

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

**問題点:**
- `UserList`が特定のデータソースに依存する（再利用できない）
- テストが複雑（APIモックが必要）
- Props経由でデータを渡せないため、柔軟性が低い

```typescript
// ✅ Good: ContainerでデータをfetchしてPresentationalに渡す

// Container: データ取得のみ
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers()

  if (isLoading) return <LoadingSpinner />

  return <UserList users={users ?? []} />
}

// Presentational: UIのみ
interface UserListProps {
  users: User[]
}

export const UserList = ({ users }: UserListProps) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

**メリット:**
- ✅ `UserList`がデータソースから独立（Storybookで簡単にテスト可能）
- ✅ 異なるデータソースで同じUIを再利用可能
- ✅ ローディング状態の管理がContainer層に集約される

### 複数のクエリを使う場合

```typescript
// ✅ Good: 複数のデータ取得もContainerで集約
export const UserDetailContainer = ({ userId }: { userId: string }) => {
  const { data: user, isLoading: isUserLoading } = useUser(userId)
  const { data: posts, isLoading: isPostsLoading } = useUserPosts(userId)
  const { data: followers, isLoading: isFollowersLoading } = useUserFollowers(userId)

  const isLoading = isUserLoading || isPostsLoading || isFollowersLoading

  if (isLoading) return <LoadingSpinner />
  if (!user) return <div>ユーザーが見つかりません</div>

  return (
    <UserDetail user={user} posts={posts ?? []} followers={followers ?? []} />
  )
}

// Presentational: すべてPropsで受け取る
interface UserDetailProps {
  user: User
  posts: Post[]
  followers: User[]
}

export const UserDetail = ({ user, posts, followers }: UserDetailProps) => {
  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <FollowerList followers={followers} />
    </div>
  )
}
```

---

## 更新・削除処理の実装

### 原則: **更新・削除もContainer Componentで行う**

サーバーステートの変更（Create, Update, Delete）は、Container Componentで`useMutation`を使って実装します。

### 削除処理の実装

```typescript
// ✅ Good: ContainerでMutationを使用

// Container Component
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const handleDelete = async (userId: string) => {
    if (!confirm('本当に削除しますか？')) return

    try {
      await deleteUser.mutateAsync(userId)
      // 成功時の処理（必要に応じて）
      toast.success('ユーザーを削除しました')
    } catch (error) {
      // エラーハンドリング
      toast.error('削除に失敗しました')
    }
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

// Presentational Component
interface UserListProps {
  users: User[]
  onDelete: (userId: string) => void
  isDeleting: boolean
}

export const UserList = ({ users, onDelete, isDeleting }: UserListProps) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDelete(user.id)} disabled={isDeleting}>
            {isDeleting ? '削除中...' : '削除'}
          </button>
        </li>
      ))}
    </ul>
  )
}
```

### Mutation Hookの定義

```typescript
// src/features/users/api/delete-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/api/users/${userId}`)
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,

    // 成功時にユーザーリストを再取得
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### 更新処理の実装

```typescript
// Container Component
export const UserEditContainer = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useUser(userId)
  const updateUser = useUpdateUser()

  const handleSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser.mutateAsync({ userId, data })
      toast.success('ユーザー情報を更新しました')
    } catch (error) {
      toast.error('更新に失敗しました')
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!user) return <div>ユーザーが見つかりません</div>

  return (
    <UserEditForm
      user={user}
      onSubmit={handleSubmit}
      isSubmitting={updateUser.isPending}
    />
  )
}

// Presentational Component
interface UserEditFormProps {
  user: User
  onSubmit: (data: UpdateUserInput) => void
  isSubmitting: boolean
}

export const UserEditForm = ({ user, onSubmit, isSubmitting }: UserEditFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: user,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">名前</label>
        <input
          {...register('name')}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">メール</label>
        <input
          {...register('email')}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '更新中...' : '更新'}
      </Button>
    </form>
  )
}
```

### Mutation Hookの定義（Update）

```typescript
// src/features/users/api/update-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface UpdateUserParams {
  userId: string
  data: UpdateUserInput
}

const updateUser = async ({ userId, data }: UpdateUserParams): Promise<User> => {
  const response = await api.put(`/api/users/${userId}`, data)

  return response.data
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,

    // 楽観的更新（オプション）
    onMutate: async ({ userId, data }) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ['users', userId] })

      // 現在のデータを取得（ロールバック用）
      const previousUser = queryClient.getQueryData(['users', userId])

      // 楽観的にUIを更新
      queryClient.setQueryData(['users', userId], (old: User) => ({
        ...old,
        ...data,
      }))

      return { previousUser }
    },

    // エラー時にロールバック
    onError: (err, { userId }, context) => {
      queryClient.setQueryData(['users', userId], context?.previousUser)
    },

    // 成功時にキャッシュを更新
    onSuccess: (updatedUser, { userId }) => {
      queryClient.setQueryData(['users', userId], updatedUser)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### 作成処理の実装

```typescript
// Container Component
export const UserCreateContainer = () => {
  const createUser = useCreateUser()
  const navigate = useNavigate()

  const handleSubmit = async (data: CreateUserInput) => {
    try {
      const newUser = await createUser.mutateAsync(data)
      toast.success('ユーザーを作成しました')
      navigate(`/users/${newUser.id}`)
    } catch (error) {
      toast.error('作成に失敗しました')
    }
  }

  return (
    <UserCreateForm onSubmit={handleSubmit} isSubmitting={createUser.isPending} />
  )
}

// Presentational Component
interface UserCreateFormProps {
  onSubmit: (data: CreateUserInput) => void
  isSubmitting: boolean
}

export const UserCreateForm = ({ onSubmit, isSubmitting }: UserCreateFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">名前</label>
        <input
          {...register('name')}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">メール</label>
        <input
          {...register('email')}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '作成'}
      </Button>
    </form>
  )
}
```

### Mutation Hookの定義（Create）

```typescript
// src/features/users/api/create-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await api.post('/api/users', data)

  return response.data
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,

    // 成功時にユーザーリストを再取得
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

---

## コンポーネント分割の実践

### どこまで分割すべきか

**原則:**
- 50行を超えたら分割を検討
- 同じJSXパターンが2回以上現れたら分割
- 独立した責任が見えたら分割

### 段階的な分割例

#### ステップ1: 単一コンポーネント（分割前）

```typescript
// ❌ 大きすぎるコンポーネント
export const ProductPage = () => {
  const { data: product } = useProduct()
  const { data: reviews } = useReviews(product?.id)
  const addToCart = useAddToCart()

  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}円</span>
      <button onClick={() => addToCart(product.id)}>カートに追加</button>

      <h2>レビュー</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <div>
              {[...Array(review.rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p>{review.comment}</p>
            <span>{review.author}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### ステップ2: Container/Presentational に分離

```typescript
// Container: データ取得
export const ProductPageContainer = ({ productId }: { productId: string }) => {
  const { data: product, isLoading: isProductLoading } = useProduct(productId)
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(productId)
  const addToCart = useAddToCart()

  const handleAddToCart = () => {
    addToCart.mutate(productId)
  }

  if (isProductLoading || isReviewsLoading) return <LoadingSpinner />

  return (
    <ProductPage
      product={product}
      reviews={reviews}
      onAddToCart={handleAddToCart}
    />
  )
}

// Presentational: UIレンダリング
interface ProductPageProps {
  product: Product
  reviews: Review[]
  onAddToCart: () => void
}

export const ProductPage = ({ product, reviews, onAddToCart }: ProductPageProps) => {
  return (
    <div>
      {/* 商品情報 */}
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}円</span>
      <button onClick={onAddToCart}>カートに追加</button>

      {/* レビュー */}
      <h2>レビュー</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <div>
              {[...Array(review.rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p>{review.comment}</p>
            <span>{review.author}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### ステップ3: さらに細分化（推奨）

```typescript
// Container
export const ProductPageContainer = ({ productId }: { productId: string }) => {
  const { data: product, isLoading: isProductLoading } = useProduct(productId)
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(productId)
  const addToCart = useAddToCart()

  const handleAddToCart = () => {
    addToCart.mutate(productId)
  }

  if (isProductLoading || isReviewsLoading) return <LoadingSpinner />

  return (
    <ProductPage
      product={product}
      reviews={reviews}
      onAddToCart={handleAddToCart}
    />
  )
}

// Presentational: メインレイアウト
export const ProductPage = ({ product, reviews, onAddToCart }: ProductPageProps) => {
  return (
    <div>
      <ProductInfo product={product} onAddToCart={onAddToCart} />
      <ReviewList reviews={reviews} />
    </div>
  )
}

// 商品情報コンポーネント
interface ProductInfoProps {
  product: Product
  onAddToCart: () => void
}

export const ProductInfo = ({ product, onAddToCart }: ProductInfoProps) => {
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}円</span>
      <button onClick={onAddToCart}>カートに追加</button>
    </div>
  )
}

// レビューリストコンポーネント
interface ReviewListProps {
  reviews: Review[]
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div>
      <h2>レビュー</h2>
      <ul>
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </div>
  )
}

// レビューアイテムコンポーネント
interface ReviewItemProps {
  review: Review
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <li>
      <Rating value={review.rating} />
      <p>{review.comment}</p>
      <span>{review.author}</span>
    </li>
  )
}

// 星評価コンポーネント
interface RatingProps {
  value: number
}

export const Rating = ({ value }: RatingProps) => {
  return (
    <div>
      {[...Array(value)].map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  )
}
```

**メリット:**
- ✅ 各コンポーネントが小さくシンプル
- ✅ `Rating`, `ReviewItem`, `ProductInfo` が他の場所で再利用可能
- ✅ テストが容易（各コンポーネント単体でテスト可能）
- ✅ Storybookでコンポーネントカタログを作成しやすい

---

## ディレクトリ構成

### Feature-Based Organization

このプロジェクトでは、Feature-Based Organizationを採用しています。

```
src/
├── features/
│   └── users/
│       ├── api/
│       │   ├── get-users.ts         # useUsers hook
│       │   ├── get-user.ts          # useUser hook
│       │   ├── create-user.ts       # useCreateUser hook
│       │   ├── update-user.ts       # useUpdateUser hook
│       │   └── delete-user.ts       # useDeleteUser hook
│       ├── components/
│       │   ├── user-list.tsx        # Presentational
│       │   ├── user-list-container.tsx  # Container
│       │   ├── user-card.tsx        # Presentational
│       │   ├── user-card-container.tsx  # Container
│       │   ├── user-form.tsx        # Presentational
│       │   └── user-table-row.tsx   # Presentational
│       ├── types/
│       │   └── index.ts             # User型定義
│       └── index.ts                 # エクスポート
└── components/                      # 共通コンポーネント
    ├── ui/
    │   ├── button.tsx
    │   ├── card.tsx
    │   └── input.tsx
    └── layout/
        ├── header.tsx
        └── sidebar.tsx
```

### ファイル命名規則

| タイプ | 命名規則 | 例 |
|--------|---------|---|
| **Container** | `{name}-container.tsx` | `user-list-container.tsx` |
| **Presentational** | `{name}.tsx` | `user-list.tsx` |
| **API Hook** | `{action}-{resource}.ts` | `get-users.ts`, `create-user.ts` |

### エクスポートパターン

```typescript
// src/features/users/index.ts
// Containerだけをエクスポート（外部からはContainerを使う）
export { UserListContainer } from './components/user-list-container'
export { UserCardContainer } from './components/user-card-container'

// API Hooksもエクスポート
export { useUsers } from './api/get-users'
export { useUser } from './api/get-user'
export { useCreateUser } from './api/create-user'
export { useUpdateUser } from './api/update-user'
export { useDeleteUser } from './api/delete-user'

// 型定義もエクスポート
export type { User, CreateUserInput, UpdateUserInput } from './types'
```

**使用例:**

```typescript
// src/app/users/page.tsx
import { UserListContainer } from '@/features/users'

export default function UsersPage() {
  return <UserListContainer />
}
```

---

## アンチパターン

### ❌ 1. PresentationalでTanStack Queryを使う

```typescript
// ❌ Bad: PresentationalなのにデータをFetch
export const UserList = () => {
  const { data: users } = useUsers() // NG

  return <ul>{users?.map(...)}</ul>
}

// ✅ Good: ContainerでFetchしてPropsで渡す
export const UserListContainer = () => {
  const { data: users } = useUsers()

  return <UserList users={users ?? []} />
}

export const UserList = ({ users }: { users: User[] }) => {
  return <ul>{users.map(...)}</ul>
}
```

### ❌ 2. Containerに複雑なJSXを書く

```typescript
// ❌ Bad: Containerに複雑なJSXがある
export const UserListContainer = () => {
  const { data: users } = useUsers()

  return (
    <div>
      <h1>ユーザーリスト</h1>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>メール</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ✅ Good: JSXはPresentationalに分離
export const UserListContainer = () => {
  const { data: users } = useUsers()

  return <UserList users={users ?? []} />
}
```

### ❌ 3. 1つのコンポーネントに複数の責任

```typescript
// ❌ Bad: データ取得・フィルタリング・ソート・UIが混在
export const UserList = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('asc')

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  const filtered = users.filter((u) => u.name.includes(search))
  const sorted = [...filtered].sort(...)

  return <div>...</div>
}

// ✅ Good: 責任を分離
export const UserListContainer = () => {
  const { data: users } = useUsers()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('asc')

  return (
    <UserList
      users={users ?? []}
      search={search}
      onSearchChange={setSearch}
      sort={sort}
      onSortChange={setSort}
    />
  )
}
```

### ❌ 4. Presentationalに複雑なビジネスロジック

```typescript
// ❌ Bad: Presentationalに価格計算ロジック
export const ProductCard = ({ product }: { product: Product }) => {
  // 複雑な価格計算（ビジネスロジック）
  const discountedPrice =
    product.price * (1 - product.discount / 100) * (product.isMember ? 0.9 : 1)

  return <div>{discountedPrice}円</div>
}

// ✅ Good: ロジックはContainerで処理
export const ProductCardContainer = ({ productId }: { productId: string }) => {
  const { data: product } = useProduct(productId)

  // ビジネスロジック
  const calculatePrice = (product: Product) => {
    return product.price * (1 - product.discount / 100) * (product.isMember ? 0.9 : 1)
  }

  const finalPrice = calculatePrice(product)

  return <ProductCard product={product} price={finalPrice} />
}

export const ProductCard = ({ product, price }: { product: Product; price: number }) => {
  return <div>{price}円</div>
}
```

### ❌ 5. 深いネスト（Props Drilling）

```typescript
// ❌ Bad: Propsを何層も渡す
<UserPage>
  <UserList users={users} onDelete={onDelete}>
    <UserCard user={user} onDelete={onDelete}>
      <UserActions onDelete={onDelete} />
    </UserCard>
  </UserList>
</UserPage>

// ✅ Good: 必要な層でContainerを使う
<UserPage>
  <UserListContainer>
    <UserCardContainer userId={userId} />
  </UserListContainer>
</UserPage>
```

---

## まとめ

### コンポーネント設計のチェックリスト

#### Container Component
- [ ] TanStack QueryでサーバーステートをFetch
- [ ] useMutationで更新・削除を実装
- [ ] useState/Zustandでローカル/グローバルステートを管理
- [ ] イベントハンドラを定義
- [ ] Presentational ComponentにPropsでデータを渡す
- [ ] JSXは最小限（基本的にPresentationalを呼ぶのみ）

#### Presentational Component
- [ ] Propsでデータを受け取る
- [ ] UIをレンダリング
- [ ] イベントを発火（親から受け取った関数を呼ぶ）
- [ ] データ取得しない（TanStack Query/Zustandを使わない）
- [ ] ビジネスロジックを持たない
- [ ] 再利用可能

### 設計の流れ

1. **機能を定義する** - 何を作るか明確にする
2. **データフローを設計する** - どのデータが必要か洗い出す
3. **Containerを作る** - データ取得・状態管理・ビジネスロジックを実装
4. **Presentationalを作る** - UIをレンダリング
5. **さらに分割する** - 50行を超えたら小さく分割
6. **再利用性を確認する** - 他の場所で使えるか検討

### メリットの再確認

| メリット | 説明 |
|---------|------|
| **再利用性** | Presentationalコンポーネントは他の場所で使える |
| **テストしやすさ** | Propsを渡すだけでテスト可能 |
| **保守性** | 責任が明確で変更の影響範囲が小さい |
| **開発速度** | Storybookでコンポーネントカタログを作成しやすい |
| **チーム開発** | 役割分担しやすい（Container担当/Presentational担当） |

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[プロジェクト構成](./02-project-structure.md)** - Feature-Based Organizationの詳細
- **[状態管理戦略](./06-state-management.md)** - useState/Zustand/TanStack Queryの使い分け
- **[REST API通信](./05-api-client.md)** - API通信の実装方法

### 外部リンク

- [Presentational and Container Components (Dan Abramov)](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [React Component Patterns](https://dev.to/alexkhismatulin/react-component-patterns-49ho)
- [Bulletproof React - Component Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/components-and-styling.md)
- [SOLID Principles in React](https://dev.to/tkirwa/solid-principles-in-react-3jhk)
