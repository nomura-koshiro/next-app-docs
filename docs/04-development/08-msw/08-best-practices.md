# ベストプラクティス

MSW使用時のベストプラクティスとアンチパターンを説明します。

---

## 1. ハンドラーの整理

### ✅ Good: featureごとに分割

```typescript
// src/mocks/handlers/users.ts
export const userHandlers = [
  http.get('/api/users', () => { ... }),
  http.post('/api/users', () => { ... }),
]

// src/mocks/handlers/posts.ts
export const postHandlers = [
  http.get('/api/posts', () => { ... }),
]

// src/mocks/handlers.ts
import { userHandlers } from './handlers/users'
import { postHandlers } from './handlers/posts'

export const handlers = [...userHandlers, ...postHandlers]
```

### ❌ Bad: すべてを1ファイルに

```typescript
// src/mocks/handlers.ts
export const handlers = [
  http.get('/api/users', () => { ... }),
  http.post('/api/users', () => { ... }),
  http.get('/api/posts', () => { ... }),
  http.post('/api/posts', () => { ... }),
  // 100行以上...
]
```

---

## 2. モックデータの共有

### ✅ Good: モックデータを分離

```typescript
// src/mocks/data/users.ts
export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

// handlers, stories, testsで共通使用
import { mockUsers } from '@/mocks/data/users'

// ハンドラーで使用
http.get('/api/users', () => {
  return HttpResponse.json(mockUsers)
})

// Storyで使用
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json(mockUsers)
        }),
      ],
    },
  },
}
```

### ❌ Bad: データを各所で重複定義

```typescript
// handlers.ts
http.get('/api/users', () => {
  return HttpResponse.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
  ])
})

// users.stories.tsx
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json([
            { id: 1, name: 'John Doe', email: 'john@example.com' }, // 重複
          ])
        }),
      ],
    },
  },
}
```

---

## 3. 型安全なレスポンス

### ✅ Good: 型定義を使用

```typescript
import type { User } from '@/types'

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
]

http.get('/api/users', (): HttpResponse<User[]> => {
  return HttpResponse.json<User[]>(mockUsers)
})
```

### ❌ Bad: 型なし

```typescript
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
]

http.get('/api/users', () => {
  return HttpResponse.json(mockUsers) // 型チェックなし
})
```

---

## 4. エラーケースの定義

### ✅ Good: 各パターンを定義

```typescript
// 正常系
export const Default: Story = {}

// 空データ
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json([])
        }),
      ],
    },
  },
}

// エラー
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json(
            { error: 'Server error' },
            { status: 500 }
          )
        }),
      ],
    },
  },
}

// ローディング
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', async () => {
          await delay('infinite')
          return HttpResponse.json([])
        }),
      ],
    },
  },
}
```

---

## 5. ハンドラーにコメントを追加

### ✅ Good: わかりやすいコメント

```typescript
/**
 * ユーザー一覧取得
 * GET /api/users?search=keyword&page=1&limit=10
 *
 * @param search - 検索キーワード（オプション）
 * @param page - ページ番号（デフォルト: 1）
 * @param limit - 1ページあたりの件数（デフォルト: 10）
 */
http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 10)

  // ...
})
```

---

## 6. 動的レスポンスの実装

### ✅ Good: インメモリデータベース

```typescript
// src/mocks/db.ts
export const db = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
}

// src/mocks/handlers/users.ts
import { db } from '../db'

export const userHandlers = [
  // 一覧取得
  http.get('/api/users', () => {
    return HttpResponse.json(db.users)
  }),

  // 作成
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    const newUser = {
      id: db.users.length + 1,
      ...body,
    }
    db.users.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  // 削除
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params
    const index = db.users.findIndex((u) => u.id === Number(id))

    if (index !== -1) {
      db.users.splice(index, 1)
      return new HttpResponse(null, { status: 204 })
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 })
  }),
]
```

---

## 7. テストでのハンドラーリセット

### ✅ Good: afterEachでリセット

```typescript
import { afterEach } from 'vitest'
import { server } from '@/mocks/server'

afterEach(() => {
  server.resetHandlers() // グローバルハンドラーに戻す
})
```

### ❌ Bad: リセットしない

```typescript
// テストごとにハンドラーが残り、他のテストに影響
it('test1', () => {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json([])
    })
  )
})

it('test2', () => {
  // test1のハンドラーが残っている
})
```

---

## 8. 環境変数での制御

### ✅ Good: 環境変数で制御

```typescript
// src/lib/msw.tsx
if (typeof window !== 'undefined' && env.ENABLE_API_MOCKING === true) {
  const { worker } = await import('@/mocks/browser')
  await worker.start()
}
```

**メリット:**
- MSWの有効/無効を簡単に切り替え
- 本番環境で誤って有効化されることを防ぐ

---

## 9. ハンドラーの優先順位

### ✅ Good: 具体的なパスを先に定義

```typescript
export const handlers = [
  // 具体的なパスを先に
  http.get('/api/users/me', () => { ... }),

  // 汎用的なパスを後に
  http.get('/api/users/:id', () => { ... }),
]
```

### ❌ Bad: 順序が間違っている

```typescript
export const handlers = [
  // 汎用的なパスが先だと、/api/users/me もマッチしてしまう
  http.get('/api/users/:id', () => { ... }),

  // この定義には到達しない
  http.get('/api/users/me', () => { ... }),
]
```

---

## 10. onUnhandledRequestの設定

### ✅ Good: カスタム関数で制御

```typescript
worker.start({
  onUnhandledRequest: (req) => {
    // 静的ファイル、Next.jsの内部リクエストは無視
    if (
      req.url.includes('/_next/') ||
      req.url.includes('/static/') ||
      !req.url.includes('/api/')
    ) {
      return
    }

    // APIリクエストのみ警告
    console.warn('[MSW] Unhandled API request:', req.method, req.url)
  },
})
```

**メリット:**
- 不要な警告を減らす
- 本当に問題のあるリクエストのみ表示

---

## アンチパターン

### ❌ 1. ハンドラー内でfetchを使う

```typescript
// ❌ Bad
http.get('/api/users', async () => {
  const res = await fetch('https://example.com/users') // 外部APIを呼ぶ
  const data = await res.json()
  return HttpResponse.json(data)
})
```

**問題:**
- モックの意味がない
- 外部APIに依存してしまう

### ❌ 2. 複雑すぎるロジック

```typescript
// ❌ Bad
http.get('/api/users', async ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 10)

  // 複雑なフィルタリング処理
  let filtered = users.filter((u) => { ... })

  // ソート処理
  filtered = filtered.sort((a, b) => { ... })

  // ページネーション処理
  const start = (page - 1) * limit
  const end = start + limit
  const paginated = filtered.slice(start, end)

  // 集計処理
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)

  return HttpResponse.json({
    data: paginated,
    meta: { total, page, limit, totalPages },
  })
})
```

**問題:**
- ハンドラーが複雑すぎる
- 保守が困難

**解決策:**
- ロジックを関数に分離
- シンプルなモックデータを返す

### ❌ 3. 実際のAPIと異なる形式

```typescript
// ❌ Bad: 実際のAPIと形式が異なる
http.get('/api/users', () => {
  return HttpResponse.json([
    { id: 1, username: 'john' }, // 実際のAPIは 'name' フィールド
  ])
})
```

**問題:**
- 本番環境で動作しない
- バグの原因になる

**解決策:**
- 実際のAPIと同じ形式を返す
- 型定義を使用して一致させる

---

## チェックリスト

MSW使用時に確認すべき項目:

- [ ] ハンドラーをfeatureごとに分割している
- [ ] モックデータを共有している
- [ ] 型安全なレスポンスを定義している
- [ ] エラーケースも定義している
- [ ] ハンドラーにコメントを追加している
- [ ] 環境変数で制御している
- [ ] afterEachでハンドラーをリセットしている
- [ ] onUnhandledRequestをカスタマイズしている
- [ ] 実際のAPIと同じ形式を返している

---

## 次のステップ

ベストプラクティスを理解したら、次はトラブルシューティングを確認します。

1. **[トラブルシューティング](./09-troubleshooting.md)** - よくある問題と解決策

---

## 関連リンク

- [ハンドラーの作成](./04-creating-handlers.md) - ハンドラーの詳細
- [テストとの統合](./07-testing-integration.md) - テストでの使用
- [MSW公式 - Best Practices](https://mswjs.io/docs/best-practices) - 公式ベストプラクティス
