# 基本設定

MSWの基本的なディレクトリ構造とハンドラーの作成方法を説明します。

---

## ディレクトリ構造

```text
src/
├── mocks/
│   ├── browser.ts              # ブラウザ用のworker設定
│   ├── server.ts               # Node.js用のserver設定（テスト用）
│   ├── handlers.ts             # ハンドラー統合
│   └── handlers/
│       └── api/
│           └── v1/
│               ├── auth-handlers.ts
│               └── user-handlers.ts
├── lib/
│   └── msw.tsx                 # MSWProvider実装
└── schemas/                    # 共通バリデーションスキーマ
    └── fields/                 # フィールド単位のスキーマ
```

---

## 1. ハンドラーファイルの作成

### handlers.ts（統合ファイル）

```typescript
// src/mocks/handlers.ts
import { authHandlers } from './handlers/api/v1/auth-handlers'
import { userHandlers } from './handlers/api/v1/user-handlers'

/**
 * MSW (Mock Service Worker) リクエストハンドラー
 *
 * 機能ごとにファイルを分割し、ここで統合します。
 * 各ハンドラーファイルでは /api/v1 プレフィックスを含めたパスを定義しています。
 */
export const handlers = [
  ...authHandlers, // 認証関連 (/api/v1/auth/*)
  ...userHandlers, // ユーザー管理 (/api/v1/users/*)
]
```

### user-handlers.ts（個別ハンドラー）

```typescript
// src/mocks/handlers/api/v1/user-handlers.ts
import { http, HttpResponse, delay } from 'msw'

export const userHandlers = [
  // GET /api/v1/users - ユーザー一覧取得
  http.get('/api/v1/users', async () => {
    await delay(500) // 遅延シミュレーション

    return HttpResponse.json({
      data: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
    })
  }),

  // GET /api/v1/users/:id - 特定ユーザー取得
  http.get('/api/v1/users/:id', ({ params }) => {
    const { id } = params

    if (id === '999') {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      data: {
        id,
        name: 'John Doe',
        email: 'john@example.com',
      },
    })
  }),

  // POST /api/v1/users - ユーザー作成
  http.post('/api/v1/users', async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json(
      {
        data: {
          id: String(Date.now()),
          ...body,
        },
      },
      { status: 201 }
    )
  }),

  // PATCH /api/v1/users/:id - ユーザー更新
  http.patch('/api/v1/users/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    return HttpResponse.json({
      data: {
        id,
        ...body,
      },
    })
  }),

  // DELETE /api/v1/users/:id - ユーザー削除
  http.delete('/api/v1/users/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
```

---

## 2. ブラウザ用セットアップ（開発環境）

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

**用途:**
- 開発環境（`pnpm dev`）
- Storybook

---

## 3. Node.js用セットアップ（テスト環境）

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**用途:**
- Vitestでの単体テスト
- Vitestでの統合テスト

### Vitestでの設定

```typescript
// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
  },
})
```

---

## ハンドラーの基本構造

### HTTPメソッドごとの定義

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // GET
  http.get('/api/resource', () => {
    return HttpResponse.json({ data: [...] })
  }),

  // POST
  http.post('/api/resource', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ data: body }, { status: 201 })
  }),

  // PATCH/PUT
  http.patch('/api/resource/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    return HttpResponse.json({ data: { id, ...body } })
  }),

  // DELETE
  http.delete('/api/resource/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
```

---

## パスパラメータとクエリパラメータ

### パスパラメータ

```typescript
// /api/users/:id
http.get('/api/users/:id', ({ params }) => {
  const { id } = params
  return HttpResponse.json({ id, name: 'John Doe' })
})
```

### クエリパラメータ

```typescript
// /api/users?search=john
http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')

  return HttpResponse.json({
    search,
    users: [/* フィルタリングされたデータ */],
  })
})
```

---

## レスポンスの種類

### 成功レスポンス

```typescript
// 200 OK
http.get('/api/users', () => {
  return HttpResponse.json({ data: [...] })
})

// 201 Created
http.post('/api/users', async ({ request }) => {
  const body = await request.json()
  return HttpResponse.json({ data: body }, { status: 201 })
})

// 204 No Content
http.delete('/api/users/:id', () => {
  return new HttpResponse(null, { status: 204 })
})
```

### エラーレスポンス

```typescript
// 400 Bad Request
http.post('/api/users', () => {
  return HttpResponse.json(
    { error: 'Validation failed' },
    { status: 400 }
  )
})

// 404 Not Found
http.get('/api/users/:id', () => {
  return HttpResponse.json(
    { error: 'User not found' },
    { status: 404 }
  )
})

// 500 Internal Server Error
http.get('/api/users', () => {
  return HttpResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
})

// Network Error
http.get('/api/users', () => {
  return HttpResponse.error()
})
```

---

## 遅延のシミュレーション

```typescript
import { http, HttpResponse, delay } from 'msw'

http.get('/api/users', async () => {
  await delay(1000) // 1秒遅延
  return HttpResponse.json({ data: [...] })
})
```

**用途:**
- ローディング状態のテスト
- タイムアウトのテスト
- ネットワーク遅延のシミュレーション

---

## 次のステップ

基本設定が完了したら、次は詳細なハンドラーの作成方法を学びます。

1. **[ハンドラーの作成](./04-creating-handlers.md)** - REST API、GraphQL、動的レスポンス
2. **[MSWProviderの実装](./05-msw-provider.md)** - アプリケーションへの統合

---

## 関連リンク

- [ハンドラーの作成](./04-creating-handlers.md) - 詳細なハンドラー作成方法
- [MSW公式 - API Reference](https://mswjs.io/docs/api) - API詳細
