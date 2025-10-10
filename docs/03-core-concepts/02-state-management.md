# 状態管理戦略

このドキュメントでは、プロジェクトにおける状態管理の方針と実装方法について説明します。

## 目次

1. [状態管理の全体像](#状態管理の全体像)
2. [なぜ状態を分割するのか](#なぜ状態を分割するのか)
3. [グローバルステート（Zustand）](#グローバルステートzustand)
4. [サーバーステート（TanStack Query）](#サーバーステートtanstack-query)
5. [ローカルステート（useState）](#ローカルステートusestate)
6. [状態の使い分けフローチャート](#状態の使い分けフローチャート)
7. [実装例](#実装例)
8. [アンチパターン](#アンチパターン)

---

## 状態管理の全体像

このプロジェクトでは、状態を**3つのカテゴリ**に分類して管理します。

| 状態の種類 | ツール | 用途 | データの例 |
|-----------|--------|------|-----------|
| **ローカルステート** | useState | コンポーネント内部の一時的な状態 | モーダルの開閉、フォーム入力中の値、ローカルなUI状態 |
| **グローバルステート** | Zustand | アプリケーション全体で共有するクライアント側の状態 | 認証ユーザー情報、テーマ設定、サイドバーの開閉状態 |
| **サーバーステート** | TanStack Query | サーバーから取得するデータとその管理 | ユーザーリスト、商品データ、APIから取得する全てのデータ |

---

## なぜ状態を分割するのか

### 1. 責任の明確化

各状態管理ツールには明確な役割があります：

- **useState**: コンポーネントのローカルな振る舞い
- **Zustand**: アプリケーション全体の状態
- **TanStack Query**: サーバーとの通信・キャッシュ

これにより、「この状態はどこで管理すべきか？」が明確になり、コードの可読性が向上します。

### 2. パフォーマンスの最適化

```typescript
// ❌ すべてをグローバルステートで管理（アンチパターン）
const useAppStore = create((set) => ({
  modalOpen: false,          // ローカルで十分
  users: [],                 // サーバーから取得するデータ
  currentUser: null,         // グローバルで管理すべき
  searchQuery: '',           // ローカルで十分
}))
```

**問題点:**
- サーバーデータの更新・キャッシュ管理が複雑化
- 不要な再レンダリングが発生
- コンポーネントの再利用性が低下

```typescript
// ✅ 適切に分割
// ローカルステート
const [modalOpen, setModalOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')

// グローバルステート
const currentUser = useUserStore((state) => state.currentUser)

// サーバーステート
const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
```

**メリット:**
- 各状態が適切な場所で管理される
- 必要な箇所だけが再レンダリング
- サーバーデータの自動キャッシュ・更新

### 3. 開発体験の向上

- **デバッグが容易**: 各ツールに専用DevToolsがある
- **テストが簡単**: 状態の責任範囲が明確
- **再利用性**: コンポーネントが独立して動作

### 4. データの鮮度管理

**サーバーステート（TanStack Query）の利点:**

```typescript
// 自動的にキャッシュ・再取得・背景更新を管理
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,  // 5分間はキャッシュを使用
  refetchOnWindowFocus: true, // ウィンドウフォーカス時に再取得
})
```

グローバルステートで管理すると、これらの機能を自分で実装する必要があります。

---

## ローカルステート（useState）

### 概要

**useState**は、コンポーネント内部の一時的な状態を管理するReact標準のHookです。

### 使用すべき場合

- ✅ 他のコンポーネントと共有する必要がない
- ✅ コンポーネントがアンマウントされたら不要になる
- ✅ UIの一時的な状態（開閉、選択、入力中の値）

### 実装例

#### 1. モーダルの開閉状態

```typescript
import { useState } from 'react'

export const UserModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>ユーザー追加</button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        {/* モーダルコンテンツ */}
      </Dialog>
    </>
  )
}
```

#### 2. フォーム入力中の値

```typescript
import { useState } from 'react'

export const SearchForm = () => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 検索実行
    console.log('検索:', query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      <button type="submit">検索</button>
    </form>
  )
}
```

#### 3. タブの選択状態

```typescript
import { useState } from 'react'

export const TabPanel = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab('profile')}>プロフィール</button>
        <button onClick={() => setActiveTab('settings')}>設定</button>
      </div>

      {activeTab === 'profile' && <ProfilePanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </div>
  )
}
```

### useStateのベストプラクティス

```typescript
// ✅ Good: シンプルな状態
const [count, setCount] = useState(0)

// ✅ Good: 初期値を関数で遅延評価（重い計算の場合）
const [data, setData] = useState(() => expensiveComputation())

// ❌ Bad: 複数のコンポーネントで使う状態
const [currentUser, setCurrentUser] = useState(null) // Zustandを使うべき

// ❌ Bad: サーバーから取得したデータ
const [users, setUsers] = useState([]) // TanStack Queryを使うべき
```

---

## グローバルステート（Zustand）

### 概要

**Zustand**は、アプリケーション全体で共有する**クライアント側の状態**を管理する軽量ライブラリです。

### 使用すべき場合

- ✅ 複数のコンポーネント間で共有する状態
- ✅ アプリケーション全体で保持する必要がある
- ✅ サーバーから取得したデータではない（クライアント側のみ）

### 典型的なユースケース

- 認証ユーザー情報（ログイン中のユーザー）
- テーマ設定（ライト/ダークモード）
- サイドバーの開閉状態
- 通知設定
- ユーザー設定（言語、表示件数など）

### 実装例

#### 1. ユーザー認証ストア

```typescript
// src/core/stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface UserState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      logout: () => set({ currentUser: null }),

      isAuthenticated: () => get().currentUser !== null,
    }),
    {
      name: 'user-storage', // LocalStorageのキー名
    }
  )
)
```

**使用方法:**

```typescript
import { useUserStore } from '@/core/stores/userStore'

export const Header = () => {
  // 必要な状態だけを取得（最適化）
  const currentUser = useUserStore((state) => state.currentUser)
  const logout = useUserStore((state) => state.logout)

  if (!currentUser) {
    return <LoginButton />
  }

  return (
    <div>
      <span>ようこそ、{currentUser.name}さん</span>
      <button onClick={logout}>ログアウト</button>
    </div>
  )
}
```

#### 2. UIテーマストア

```typescript
// src/core/stores/themeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  mode: 'light' | 'dark'
  toggleMode: () => void
  setMode: (mode: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),

      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
)
```

#### 3. サイドバーストア

```typescript
// src/core/stores/sidebarStore.ts
import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
```

### Zustandのベストプラクティス

#### 1. ストアの分割

```typescript
// ✅ Good: 機能ごとにストアを分割
useUserStore      // ユーザー関連
useThemeStore     // テーマ関連
useSidebarStore   // サイドバー関連

// ❌ Bad: 1つの巨大なストア
useAppStore       // すべてを1つに詰め込む
```

#### 2. セレクターの使用

```typescript
// ✅ Good: 必要な状態だけを取得（再レンダリング最適化）
const userName = useUserStore((state) => state.currentUser?.name)

// ❌ Bad: ストア全体を取得（不要な再レンダリング）
const store = useUserStore()
const userName = store.currentUser?.name
```

#### 3. 永続化（persist）の活用

```typescript
// LocalStorageに保存したい状態にはpersistミドルウェアを使用
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      name: 'user-storage',
      // 一部のフィールドのみ永続化
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
)
```

---

## サーバーステート（TanStack Query）

### 概要

**TanStack Query（React Query）** は、サーバーから取得するデータとその管理を専門に扱うライブラリです。

### 使用すべき場合

- ✅ サーバーからAPIで取得するデータ
- ✅ キャッシュが必要なデータ
- ✅ 定期的に更新されるデータ
- ✅ バックグラウンドで再取得したいデータ

### なぜTanStack Queryを使うのか

従来のアプローチ（Zustand + useEffect）との比較：

```typescript
// ❌ 従来のアプローチ（アンチパターン）
import { api } from '@/lib/api-client'

const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/api/users')
      set({ users: response.data, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },
}))

// コンポーネント内で手動で呼び出し
const Component = () => {
  const { users, isLoading, fetchUsers } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [])

  // キャッシュ、再取得、エラーリトライなどを全て自分で実装する必要がある
}
```

```typescript
// ✅ TanStack Queryのアプローチ
const Component = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  // キャッシュ、再取得、エラーリトライなどが自動的に管理される
}
```

### 実装例

#### 1. データ取得の基本

```typescript
// src/api/queries/userQueries.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface User {
  id: string
  name: string
  email: string
}

// APIクライアント
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/api/users')

  return data
}

// カスタムHook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
    gcTime: 10 * 60 * 1000, // 10分後にキャッシュを破棄
  })
}
```

**使用方法:**

```typescript
import { useUsers } from '@/api/queries/userQueries'

export const UserList = () => {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラー: {error.message}</div>

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

#### 2. パラメータ付きクエリ

```typescript
// src/api/queries/userQueries.ts
import { api } from '@/lib/api-client'

const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await api.get(`/api/users/${userId}`)

  return data
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId], // ユーザーIDをキーに含める
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // userIdが存在する場合のみ実行
  })
}
```

#### 3. データ更新（Mutation）

```typescript
// src/api/mutations/userMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface CreateUserInput {
  name: string
  email: string
}

const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data } = await api.post('/api/users', input)

  return data
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

**使用方法:**

```typescript
import { useCreateUser } from '@/api/mutations/userMutations'

export const CreateUserForm = () => {
  const createUser = useCreateUser()

  const handleSubmit = async (data: CreateUserInput) => {
    try {
      await createUser.mutateAsync(data)
      alert('ユーザーを作成しました')
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* フォームフィールド */}
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? '作成中...' : '作成'}
      </button>
    </form>
  )
}
```

#### 4. 楽観的更新（Optimistic Update）

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,

    // 更新前に楽観的にUIを更新
    onMutate: async (newUser) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ['users', newUser.id] })

      // 現在のデータを取得（ロールバック用）
      const previousUser = queryClient.getQueryData(['users', newUser.id])

      // 楽観的にデータを更新
      queryClient.setQueryData(['users', newUser.id], newUser)

      return { previousUser }
    },

    // エラー時にロールバック
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users', newUser.id], context?.previousUser)
    },

    // 成功・失敗に関わらず再取得
    onSettled: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users', newUser?.id] })
    },
  })
}
```

### TanStack Queryのベストプラクティス

#### 1. クエリキーの命名規則

```typescript
// ✅ Good: 階層的な構造
['users']                    // すべてのユーザー
['users', userId]            // 特定のユーザー
['users', userId, 'posts']   // 特定のユーザーの投稿
['users', { status: 'active' }] // フィルター付きユーザー

// ❌ Bad: 一貫性のない命名
['getAllUsers']
['user-123']
['posts_by_user_123']
```

#### 2. カスタムHookの作成

```typescript
// ✅ Good: APIロジックをカスタムHookに分離
export const useUsers = () => useQuery({ ... })
export const useUser = (id: string) => useQuery({ ... })

// コンポーネントでは状態のみを扱う
const { data, isLoading } = useUsers()

// ❌ Bad: コンポーネント内にAPIロジックを記述
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await fetch('/api/users')
    return res.json()
  },
})
```

#### 3. staleTimeとgcTimeの設定

```typescript
// staleTime: データが「古い」と判断されるまでの時間
// gcTime: キャッシュがメモリから削除されるまでの時間

// 頻繁に更新されるデータ
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0, // すぐに古いと判断
  refetchInterval: 30 * 1000, // 30秒ごとに再取得
})

// あまり変わらないデータ
useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: 30 * 60 * 1000, // 30分間はキャッシュを使用
  gcTime: 60 * 60 * 1000, // 1時間後に破棄
})
```

---

## 状態の使い分けフローチャート

```
データを管理する必要がある
    ↓
┌───────────────────────────────────┐
│ サーバーから取得するデータ？        │
└───────────────────────────────────┘
    ↓ Yes                      ↓ No
【TanStack Query】        ┌───────────────────────────────┐
                         │ 複数のコンポーネントで共有？    │
                         └───────────────────────────────┘
                             ↓ Yes              ↓ No
                         【Zustand】        【useState】
```

### 判断基準

| 質問 | Yes → | No → |
|------|-------|------|
| サーバーから取得するデータ？ | **TanStack Query** | 次の質問へ |
| 複数のコンポーネントで共有する？ | **Zustand** | **useState** |
| アプリケーション全体で保持する？ | **Zustand** | **useState** |
| ページ遷移後も保持する？ | **Zustand (persist)** | **useState** |

---

## 実装例

### 実際のアプリケーション例

```typescript
// src/app/users/page.tsx
import { useState } from 'react'
import { useUsers } from '@/api/queries/userQueries'
import { useUserStore } from '@/core/stores/userStore'
import { useSidebarStore } from '@/core/stores/sidebarStore'

export default function UsersPage() {
  // ローカルステート: このページ内でのみ使用
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // グローバルステート: アプリ全体で共有
  const currentUser = useUserStore((state) => state.currentUser)
  const isSidebarOpen = useSidebarStore((state) => state.isOpen)

  // サーバーステート: APIから取得
  const { data: users, isLoading } = useUsers()

  // 検索フィルター（ローカルで処理）
  const filteredUsers = users?.filter((user) => user.name.includes(searchQuery))

  return (
    <div>
      <h1>ユーザー管理</h1>
      <p>ログイン中: {currentUser?.name}</p>

      {/* 検索（ローカルステート） */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="ユーザーを検索..."
      />

      {/* ユーザーリスト（サーバーステート） */}
      {isLoading ? (
        <div>読み込み中...</div>
      ) : (
        <ul>
          {filteredUsers?.map((user) => (
            <li key={user.id} onClick={() => setSelectedUserId(user.id)}>
              {user.name}
            </li>
          ))}
        </ul>
      )}

      {/* 選択されたユーザーの詳細（ローカルステート） */}
      {selectedUserId && <UserDetail userId={selectedUserId} />}
    </div>
  )
}
```

---

## アンチパターン

### ❌ 1. サーバーデータをZustandで管理

```typescript
// ❌ Bad
const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    set({ users: data })
  },
}))

// ✅ Good: TanStack Queryを使う
export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
```

### ❌ 2. ローカルステートをZustandで管理

```typescript
// ❌ Bad: モーダルの開閉状態をグローバルで管理
const useModalStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

// ✅ Good: useStateを使う
const [isOpen, setIsOpen] = useState(false)
```

### ❌ 3. すべてを1つのストアに詰め込む

```typescript
// ❌ Bad
const useAppStore = create((set) => ({
  // グローバルステート
  currentUser: null,
  theme: 'light',

  // ローカルステート（本来はuseStateで管理すべき）
  modalOpen: false,
  searchQuery: '',

  // サーバーステート（本来はTanStack Queryで管理すべき）
  users: [],
  posts: [],
}))

// ✅ Good: 適切に分割
useUserStore      // グローバルステート
useThemeStore     // グローバルステート
useState          // ローカルステート
useUsers()        // サーバーステート
usePosts()        // サーバーステート
```

---

## まとめ

| 状態の種類 | ツール | 使用場面 | 例 |
|-----------|--------|---------|---|
| **ローカル** | useState | コンポーネント内部の一時的な状態 | モーダル開閉、フォーム入力、タブ選択 |
| **グローバル** | Zustand | アプリ全体で共有するクライアント側の状態 | ユーザー情報、テーマ、サイドバー |
| **サーバー** | TanStack Query | サーバーから取得するデータ | ユーザーリスト、商品データ、API全般 |

### 選定のポイント

1. **まずサーバーデータかを判断** → TanStack Query
2. **次に共有が必要かを判断** → Zustand
3. **どちらでもなければ** → useState

この方針に従うことで：
- ✅ コードの可読性が向上
- ✅ パフォーマンスが最適化
- ✅ デバッグが容易
- ✅ テストが簡単
- ✅ 保守性が向上

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[環境構築ガイド](./01-setup.md)** - 開発環境のセットアップ
- **[プロジェクト構成](./02-project-structure.md)** - ストアやAPIの配置場所
- **[使用ライブラリ一覧](./03-libraries.md)** - Zustand, TanStack Queryの概要

### 外部リンク

- [Zustand公式ドキュメント](https://zustand-demo.pmnd.rs/)
- [TanStack Query公式ドキュメント](https://tanstack.com/query/latest)
- [React Hooks公式ドキュメント](https://react.dev/reference/react/hooks)
- [状態管理ライブラリの比較記事](https://blog.logrocket.com/comparing-react-state-management-libraries/)
