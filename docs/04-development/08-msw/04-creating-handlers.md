# ハンドラーの作成

REST API、GraphQL、動的レスポンス、条件付きレスポンスなど、様々なハンドラーの作成方法を説明します。

---

## 1. REST API

### 基本的なCRUD操作

```typescript
import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  // GET - 一覧取得
  http.get('/api/trainings', () => {
    return HttpResponse.json([
      { id: 1, name: '胸トレ' },
      { id: 2, name: '背中トレ' },
    ])
  }),

  // GET - 個別取得（パスパラメータ）
  http.get('/api/trainings/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: `トレーニング ${params.id}`,
    })
  }),

  // GET - クエリパラメータ
  http.get('/api/trainings', ({ request }) => {
    const url = new URL(request.url)
    const date = url.searchParams.get('date')

    return HttpResponse.json({
      date,
      trainings: [/* データ */],
    })
  }),

  // POST - 作成（リクエストボディ）
  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: Date.now(), ...body },
      { status: 201 }
    )
  }),

  // PATCH - 更新
  http.patch('/api/trainings/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    return HttpResponse.json({ id, ...body })
  }),

  // DELETE - 削除
  http.delete('/api/trainings/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
```

---

## 2. レスポンスのパターン

### 遅延シミュレーション

```typescript
http.get('/api/trainings', async () => {
  await delay(1000) // 1秒遅延
  return HttpResponse.json([/* データ */])
})

// 無限ローディング（Storybookのローディングストーリー用）
import { delay as infiniteDelay } from 'msw'

http.get('/api/trainings', async () => {
  await infiniteDelay('infinite')
  return HttpResponse.json([])
})
```

### エラーレスポンス

```typescript
// バリデーションエラー（400）
http.post('/api/trainings', () => {
  return HttpResponse.json(
    { error: 'Validation failed', details: { name: ['名前は必須です'] } },
    { status: 400 }
  )
})

// 認証エラー（401）
http.get('/api/trainings', () => {
  return HttpResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
})

// 権限エラー（403）
http.delete('/api/trainings/:id', () => {
  return HttpResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  )
})

// 見つからない（404）
http.get('/api/trainings/:id', () => {
  return HttpResponse.json(
    { error: 'Not found' },
    { status: 404 }
  )
})

// サーバーエラー（500）
http.get('/api/trainings', () => {
  return HttpResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
})

// ネットワークエラー
http.get('/api/trainings', () => {
  return HttpResponse.error()
})
```

---

## 3. GraphQL

### クエリ

```typescript
import { graphql, HttpResponse } from 'msw'

export const handlers = [
  graphql.query('GetTrainings', ({ query, variables }) => {
    return HttpResponse.json({
      data: {
        trainings: [
          { id: '1', name: '胸トレ' },
          { id: '2', name: '背中トレ' },
        ],
      },
    })
  }),

  graphql.query('GetTraining', ({ variables }) => {
    return HttpResponse.json({
      data: {
        training: {
          id: variables.id,
          name: `トレーニング ${variables.id}`,
        },
      },
    })
  }),
]
```

### ミューテーション

```typescript
export const handlers = [
  graphql.mutation('CreateTraining', ({ variables }) => {
    return HttpResponse.json({
      data: {
        createTraining: {
          id: Date.now().toString(),
          ...variables.input,
        },
      },
    })
  }),

  graphql.mutation('UpdateTraining', ({ variables }) => {
    return HttpResponse.json({
      data: {
        updateTraining: {
          id: variables.id,
          ...variables.input,
        },
      },
    })
  }),
]
```

---

## 4. 動的レスポンス

### インメモリデータベース

```typescript
// src/mocks/data.ts
export const trainingDatabase = [
  { id: 1, name: '胸トレ', date: '2024-01-15' },
  { id: 2, name: '背中トレ', date: '2024-01-16' },
]

// src/mocks/handlers.ts
import { trainingDatabase } from './data'

export const handlers = [
  // 一覧取得
  http.get('/api/trainings', () => {
    return HttpResponse.json(trainingDatabase)
  }),

  // 作成（データベースに追加）
  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()
    const newTraining = {
      id: trainingDatabase.length + 1,
      ...body,
    }
    trainingDatabase.push(newTraining)
    return HttpResponse.json(newTraining, { status: 201 })
  }),

  // 更新
  http.patch('/api/trainings/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    const index = trainingDatabase.findIndex((t) => t.id === Number(id))

    if (index !== -1) {
      trainingDatabase[index] = { ...trainingDatabase[index], ...body }
      return HttpResponse.json(trainingDatabase[index])
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 })
  }),

  // 削除
  http.delete('/api/trainings/:id', ({ params }) => {
    const { id } = params
    const index = trainingDatabase.findIndex((t) => t.id === Number(id))

    if (index !== -1) {
      trainingDatabase.splice(index, 1)
      return new HttpResponse(null, { status: 204 })
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 })
  }),
]
```

---

## 5. 条件付きレスポンス

### パラメータによる分岐

```typescript
// 存在しないユーザーのエラーレスポンス
http.get('/api/users/:id', ({ params }) => {
  const { id } = params

  // 特定のIDでエラーを返す
  if (id === '999') {
    return HttpResponse.json(
      { message: 'User not found' },
      { status: 404 }
    )
  }

  return HttpResponse.json({
    id,
    name: 'John Doe',
    email: 'john@example.com',
  })
})
```

### クエリパラメータによるフィルタリング

```typescript
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
]

http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')

  const filteredUsers = search
    ? users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    : users

  return HttpResponse.json(filteredUsers)
})
```

### リクエストヘッダーによる分岐

```typescript
http.get('/api/users', ({ request }) => {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader) {
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return HttpResponse.json({ users: [...] })
})
```

---

## 6. ページネーション

```typescript
const allUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}))

http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 10)

  const start = (page - 1) * limit
  const end = start + limit

  return HttpResponse.json({
    data: allUsers.slice(start, end),
    meta: {
      total: allUsers.length,
      page,
      limit,
      totalPages: Math.ceil(allUsers.length / limit),
    },
  })
})
```

---

## 7. ファイルアップロード

```typescript
http.post('/api/upload', async ({ request }) => {
  const formData = await request.formData()
  const file = formData.get('file') as File

  return HttpResponse.json({
    filename: file.name,
    size: file.size,
    type: file.type,
  }, { status: 201 })
})
```

---

## 8. ストリーミングレスポンス

```typescript
http.get('/api/stream', () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('data chunk 1\n')
      controller.enqueue('data chunk 2\n')
      controller.close()
    },
  })

  return new HttpResponse(stream, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
})
```

---

## 9. ランダムなレスポンス

```typescript
// 成功/失敗をランダムに返す
http.get('/api/users', () => {
  const shouldFail = Math.random() < 0.3 // 30%の確率で失敗

  if (shouldFail) {
    return HttpResponse.json(
      { error: 'Random error' },
      { status: 500 }
    )
  }

  return HttpResponse.json({ users: [...] })
})
```

---

## 10. リクエストのログ出力

```typescript
http.post('/api/users', async ({ request }) => {
  const body = await request.json()

  // デバッグ用のログ
  console.log('[MSW] POST /api/users', body)

  return HttpResponse.json({ id: 1, ...body }, { status: 201 })
})
```

---

## ベストプラクティス

### 1. 型安全なレスポンス

```typescript
import type { User } from '@/types'

http.get('/api/users', (): HttpResponse<User[]> => {
  return HttpResponse.json<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
  ])
})
```

### 2. モックデータの分離

```typescript
// src/mocks/data/users.ts
export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

// src/mocks/handlers/users.ts
import { mockUsers } from '../data/users'

http.get('/api/users', () => {
  return HttpResponse.json(mockUsers)
})
```

### 3. ハンドラーのコメント

```typescript
/**
 * ユーザー一覧取得
 * GET /api/users?search=keyword&page=1&limit=10
 */
http.get('/api/users', ({ request }) => {
  // クエリパラメータの取得
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 10)

  // ...
})
```

---

## 次のステップ

ハンドラーの作成方法を理解したら、次はMSWProviderの実装方法を学びます。

1. **[MSWProviderの実装](./05-msw-provider.md)** - アプリケーションへの統合
2. **[Storybookとの統合](./06-storybook-integration.md)** - Storybookでの使用

---

## 関連リンク

- [基本設定](./03-basic-configuration.md) - ハンドラーの基本
- [ベストプラクティス](./08-best-practices.md) - ハンドラー整理の方法
- [MSW公式 - Request Handler](https://mswjs.io/docs/basics/request-handler) - 公式ドキュメント
