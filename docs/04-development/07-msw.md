# MSW (Mock Service Worker)

本ドキュメントでは、MSW (Mock Service Worker) を使用したAPIモックの実装方法について説明します。開発環境、Storybook、テスト環境でのAPIモック統合と、ハンドラーの作成方法を解説します。

## 目次

1. [MSWとは](#mswとは)
2. [導入メリット](#導入メリット)
3. [インストール](#インストール)
4. [基本設定](#基本設定)
5. [MSWProviderの実装](#mswproviderの実装)
6. [ハンドラーの作成](#ハンドラーの作成)
7. [Storybookとの統合](#storybookとの統合)
8. [テストとの統合](#テストとの統合)
9. [ベストプラクティス](#ベストプラクティス)
10. [トラブルシューティング](#トラブルシューティング)

---

## MSWとは

**Mock Service Worker (MSW)** は、Service Worker APIを利用してネットワークリクエストをインターセプトし、モックレスポンスを返すライブラリです。

### 公式サイト

https://mswjs.io/

### 特徴

| 特徴 | 説明 |
|------|------|
| **ブラウザ/Node.js両対応** | 開発環境とテスト環境で同じモック定義を使用 |
| **Service Worker活用** | 実際のHTTPリクエストをインターセプト |
| **型安全** | TypeScriptによる型定義サポート |
| **デバッグ容易** | Network Tabでリクエストを確認可能 |

---

## 導入メリット

### 1. 開発効率向上

```typescript
// バックエンド未完成でもフロントエンド開発可能
const { data } = useQuery({
  queryKey: ['trainings'],
  queryFn: () => api.get('/trainings'), // MSWがモックを返す
})
```

### 2. テスト品質向上

```typescript
// 異なるAPIレスポンスパターンを簡単にテスト
describe('TrainingList', () => {
  it('空データを表示', async () => {
    server.use(
      http.get('/trainings', () => HttpResponse.json([]))
    )
    // テストコード...
  })
})
```

### 3. プロジェクトでの使用目的

- 開発環境でのAPIモック
- Storybookでのコンポーネント開発
- E2Eテスト（Playwright）
- 統合テスト（Vitest）

---

## インストール

### 1. 依存関係の追加

```bash
# MSW本体
pnpm add -D msw@latest
```

### 2. Service Workerファイル生成

```bash
# publicディレクトリにService Worker生成
npx msw init public/ --save
```

**生成されるファイル:**
```
CAMP_front/
└── public/
    └── mockServiceWorker.js  # ← MSWのService Worker
```

### 3. `.gitignore`に追加

```bash
# public/mockServiceWorker.js
# MSWで自動生成されるため除外
echo "public/mockServiceWorker.js" >> .gitignore
```

---

## 基本設定

### ディレクトリ構造

```
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
└── lib/
    └── msw.tsx                 # MSWProvider実装
```

### 1. ハンドラーファイル作成

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

### 2. ブラウザ用セットアップ (開発環境)

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### 3. Node.js用セットアップ (テスト環境)

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**Vitestでの設定:**

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

## MSWProviderの実装

### 完全な実装

```typescript
// src/lib/msw.tsx
'use client'

import { useEffect, useState } from 'react'
import { env } from '@/config/env'

/**
 * MSW (Mock Service Worker) Provider
 *
 * 開発環境でAPIモックを有効にするためのプロバイダーコンポーネント。
 * env.ENABLE_API_MOCKING=trueの場合のみMSWを初期化します。
 *
 * @example
 * ```tsx
 * // provider.tsxで使用
 * <MSWProvider>
 *   <YourApp />
 * </MSWProvider>
 * ```
 */
export const MSWProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null => {
  // MSWの初期化が完了したかどうかを管理
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    /**
     * MSWを初期化する非同期関数
     * - ブラウザ環境でのみ実行
     * - env.ENABLE_API_MOCKING=trueの場合のみService Workerを起動
     */
    const initMSW = async (): Promise<void> => {
      if (typeof window !== 'undefined' && env.ENABLE_API_MOCKING === true) {
        // MSW workerを動的にインポート（本番環境でのバンドルサイズ削減）
        const { worker } = await import('@/mocks/browser')

        // Service Workerを起動
        await worker.start({
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
          onUnhandledRequest: (req) => {
            // APIリクエスト以外は警告を出さない
            if (!req.url.includes('/api/')) {
              return
            }
            console.warn('[MSW] Unhandled request:', req.method, req.url)
          },
        })

        console.log('[MSW] Mock Service Worker initialized')
        console.log('[MSW] Registered handlers:', worker.listHandlers().length)
      }

      // 初期化完了をマーク（モッキング無効時も即座に完了）
      setIsReady(true)
    }

    void initMSW()
  }, [])

  // MSWが有効で初期化未完了の場合は何も表示しない
  // これにより、MSW起動前のAPIリクエストを防ぐ
  if (!isReady && env.ENABLE_API_MOCKING === true) {
    return null
  }

  return <>{children}</>
}
```

### コードの構造

```
MSWProvider
├── useState(isReady)           MSW初期化状態の管理
├── useEffect                   MSW初期化処理
│   └── initMSW()
│       ├── 環境チェック        ブラウザ & ENABLE_API_MOCKING
│       ├── worker インポート   動的インポート
│       └── worker.start()     Service Worker起動
└── 条件付きレンダリング        初期化完了まで待機
```

### 重要なポイント

#### 1. クライアントコンポーネント

```typescript
'use client'
```

MSWはブラウザのService Workerを使用するため、クライアントコンポーネントとして実装します。

#### 2. 動的インポート

```typescript
const { worker } = await import('@/mocks/browser')
```

**理由:**
- 本番環境でMSW関連のコードがバンドルされるのを防ぐ
- 開発環境でのみMSWをロード

#### 3. 初期化完了の待機

```typescript
if (!isReady && env.ENABLE_API_MOCKING === true) {
  return null
}
```

**理由:**
- MSW起動前にAPIリクエストが発行されるのを防ぐ
- モックが適用されないリクエストを防止

#### 4. onUnhandledRequest設定

```typescript
onUnhandledRequest: (req) => {
  if (!req.url.includes('/api/')) {
    return
  }
  console.warn('[MSW] Unhandled request:', req.method, req.url)
}
```

**オプション:**

| 値 | 動作 |
|----|------|
| `'bypass'` | モックされていないリクエストは通常通り処理 |
| `'warn'` | 警告を出力し、リクエストを処理 |
| `'error'` | エラーを出力し、リクエストを処理 |
| カスタム関数 | 柔軟な制御が可能（APIリクエストのみ警告など） |

### 環境変数の設定

#### .env.local

```bash
# .env.local

# MSW (Mock Service Worker) 設定
# 開発環境でMSWを有効にする場合は'true'に設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

#### env.tsでの検証

```typescript
// src/config/env.ts
const EnvSchema = z.object({
  ENABLE_API_MOCKING: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional(),
})
```

#### MSWの有効/無効切り替え

```bash
# MSWを有効化
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# MSWを無効化
NEXT_PUBLIC_ENABLE_API_MOCKING=false
```

### AppProviderに統合

```typescript
// src/app/provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { MainErrorFallback } from '@/components/errors/main'
import { queryConfig } from '@/lib/tanstack-query'
import { MSWProvider } from '@/lib/msw'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig })
  )

  return (
    <MSWProvider>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </MSWProvider>
  )
}
```

---

## ハンドラーの作成

### 1. REST API

```typescript
import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  // 基本的なGET
  http.get('/api/trainings', () => {
    return HttpResponse.json([
      { id: 1, name: '胸トレ' },
      { id: 2, name: '背中トレ' },
    ])
  }),

  // パスパラメータ
  http.get('/api/trainings/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: `トレーニング ${params.id}`,
    })
  }),

  // クエリパラメータ
  http.get('/api/trainings', ({ request }) => {
    const url = new URL(request.url)
    const date = url.searchParams.get('date')

    return HttpResponse.json({
      date,
      trainings: [/* データ */],
    })
  }),

  // リクエストボディ
  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: Date.now(), ...body },
      { status: 201 }
    )
  }),

  // 遅延シミュレーション
  http.get('/api/trainings', async () => {
    await delay(1000) // 1秒遅延
    return HttpResponse.json([/* データ */])
  }),

  // エラーレスポンス
  http.post('/api/trainings', () => {
    return HttpResponse.json(
      { error: 'Validation failed' },
      { status: 400 }
    )
  }),

  // ネットワークエラー
  http.get('/api/trainings', () => {
    return HttpResponse.error()
  }),
]
```

### 2. GraphQL

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
]
```

### 3. 動的レスポンス

```typescript
// src/mocks/data.ts
export const trainingDatabase = [
  { id: 1, name: '胸トレ', date: '2024-01-15' },
  { id: 2, name: '背中トレ', date: '2024-01-16' },
]

// src/mocks/handlers.ts
import { trainingDatabase } from './data'

export const handlers = [
  http.get('/api/trainings', () => {
    return HttpResponse.json(trainingDatabase)
  }),

  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()
    const newTraining = {
      id: trainingDatabase.length + 1,
      ...body,
    }
    trainingDatabase.push(newTraining)
    return HttpResponse.json(newTraining, { status: 201 })
  }),
]
```

### 4. 条件付きレスポンス

```typescript
// エラーレスポンスのモック
http.get('/api/users/:id', ({ params }) => {
  const { id } = params

  // 存在しないユーザー
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

// クエリパラメータによるフィルタリング
http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')

  const filteredUsers = search
    ? users.filter((user) => user.name.includes(search))
    : users

  return HttpResponse.json(filteredUsers)
})
```

---

## Storybookとの統合

このプロジェクトでは、Storybook内でMSWを**AppProvider経由**で使用します。

### preview.tsでの設定

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite'
import { AppProvider } from '../src/app/provider'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
}

export default preview
```

### 仕組み

1. **AppProviderにMSWProviderが含まれている**
   - `src/app/provider.tsx`でMSWProviderをラップ
   - 環境変数`NEXT_PUBLIC_API_MOCKING=true`でMSWが有効化

2. **すべてのStoryで自動的にMSWが動作**
   - Story単位でハンドラーをオーバーライドする必要なし
   - `src/mocks/handlers.ts`で定義したグローバルハンドラーを使用

3. **統一された動作**
   - アプリケーション本体とStorybookで同じMSW設定
   - 一貫したモックデータと動作

### 利点

- **設定がシンプル**: `msw-storybook-addon`不要
- **保守性が高い**: AppProviderの変更がStorybookにも自動反映
- **動作が統一**: アプリとStorybookで同じ挙動

---

## テストとの統合

### 1. Vitest設定

```typescript
// src/features/training/components/__tests__/training-list.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { TrainingList } from '../training-list'

describe('TrainingList', () => {
  it('トレーニング一覧を表示', async () => {
    server.use(
      http.get('/api/trainings', () => {
        return HttpResponse.json([
          { id: 1, name: '胸トレ', date: '2024-01-15' },
          { id: 2, name: '背中トレ', date: '2024-01-16' },
        ])
      })
    )

    render(<TrainingList />)

    await waitFor(() => {
      expect(screen.getByText('胸トレ')).toBeInTheDocument()
      expect(screen.getByText('背中トレ')).toBeInTheDocument()
    })
  })

  it('空データメッセージを表示', async () => {
    server.use(
      http.get('/api/trainings', () => {
        return HttpResponse.json([])
      })
    )

    render(<TrainingList />)

    await waitFor(() => {
      expect(screen.getByText('データがありません')).toBeInTheDocument()
    })
  })

  it('エラーメッセージを表示', async () => {
    server.use(
      http.get('/api/trainings', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        )
      })
    )

    render(<TrainingList />)

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
    })
  })
})
```

### 2. Playwright E2Eテスト

```typescript
// e2e/training.spec.ts
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // MSWを起動してからページ遷移
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test('トレーニング一覧ページ', async ({ page }) => {
  await page.goto('/trainings')

  // MSWがモックデータを返す
  await expect(page.locator('text=胸トレ')).toBeVisible()
  await expect(page.locator('text=背中トレ')).toBeVisible()
})

test('トレーニング作成', async ({ page }) => {
  await page.goto('/trainings/new')

  await page.fill('input[name="name"]', '新しいトレーニング')
  await page.click('button[type="submit"]')

  // MSWがPOSTリクエストをモック
  await expect(page.locator('text=作成しました')).toBeVisible()
})
```

---

## ベストプラクティス

### 1. ハンドラーの整理

```typescript
// src/mocks/handlers/training.ts
export const trainingHandlers = [
  http.get('/api/trainings', () => { /* ... */ }),
  http.post('/api/trainings', () => { /* ... */ }),
]

// src/mocks/handlers/user.ts
export const userHandlers = [
  http.get('/api/user', () => { /* ... */ }),
]

// src/mocks/handlers/index.ts
import { trainingHandlers } from './training'
import { userHandlers } from './user'

export const handlers = [
  ...trainingHandlers,
  ...userHandlers,
]
```

### 2. モックデータの共有

```typescript
// src/mocks/data/trainings.ts
export const mockTrainings = [
  { id: 1, name: '胸トレ', date: '2024-01-15' },
  { id: 2, name: '背中トレ', date: '2024-01-16' },
]

// handlers, stories, testsで共通使用
import { mockTrainings } from '@/mocks/data/trainings'
```

### 3. 型安全なレスポンス

```typescript
import type { Training } from '@/types'

http.get('/api/trainings', (): HttpResponse<Training[]> => {
  return HttpResponse.json<Training[]>([
    { id: 1, name: '胸トレ', date: '2024-01-15' },
  ])
})
```

### 4. featureごとにハンドラーを分割

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

### 5. エラーケースの定義

```typescript
// 正常系
export const Default: Story = {}

// 空データ
export const Empty: Story = {
  parameters: { msw: { handlers: [emptyHandler] } },
}

// エラー
export const Error: Story = {
  parameters: { msw: { handlers: [errorHandler] } },
}

// ローディング
export const Loading: Story = {
  parameters: { msw: { handlers: [loadingHandler] } },
}
```

---

## トラブルシューティング

### 1. Service Workerが起動しない

**症状:**
```
[MSW] Failed to register a Service Worker
```

**解決策:**
```bash
# Service Workerファイルを再生成
npx msw init public/ --save

# HTTPSでないとService Workerは動作しない
# ローカル開発はlocalhostならOK
```

### 2. Next.js 15でハイドレーションエラー

**症状:**
```
Hydration failed because the initial UI does not match what was rendered on the server
```

**解決策:**
```typescript
// MSWの初期化を待ってからレンダリング
export function Providers({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const initMSW = async () => {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/mocks/browser')
        await worker.start()
      }
      setMswReady(true)
    }
    initMSW()
  }, [])

  if (!mswReady) return null // または <Loading />

  return <>{children}</>
}
```

### 3. Storybookでモックが動かない

**症状:**
実際のAPIリクエストが発生してしまう

**解決策:**
```bash
# .env.localでMSWを有効化
NEXT_PUBLIC_API_MOCKING=true
```

```typescript
// .storybook/preview.tsでAppProviderを使用していることを確認
import { AppProvider } from '../src/app/provider'

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
}
```

### 4. テストでリクエストがバイパスされる

**症状:**
モックが適用されず実際のAPIにリクエストが飛ぶ

**解決策:**
```typescript
// vitest.setup.ts
import { server } from './src/mocks/server'

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error', // 未処理リクエストでエラー
  })
})

afterEach(() => {
  server.resetHandlers() // 各テスト後にハンドラーリセット
})

afterAll(() => {
  server.close()
})
```

### 5. ネットワークタブにリクエストが表示されない

**原因:**
Service Workerがリクエストをインターセプトしているため

**確認方法:**
```typescript
// ブラウザコンソールに表示
worker.start({
  onUnhandledRequest: 'warn',
  quiet: false, // MSWログを表示
})
```

### 6. MSWが起動しない

**症状:** コンソールに `[MSW] Mock Service Worker initialized` が表示されない

**原因と解決策:**

1. **環境変数が設定されていない**
   ```bash
   # .env.local
   NEXT_PUBLIC_ENABLE_API_MOCKING=true
   ```

2. **開発サーバーを再起動していない**
   ```bash
   # サーバーを停止（Ctrl+C）して再起動
   npm run dev
   ```

3. **MSWProviderが配置されていない**
   ```typescript
   // provider.tsx
   <MSWProvider>
     {children}
   </MSWProvider>
   ```

### 7. モックが適用されない

**症状:** 実際のAPIにリクエストが送信される

**原因と解決策:**

1. **ハンドラーのURLが間違っている**
   ```typescript
   // ❌ Bad
   http.get('users', ...)  // 相対パス

   // ✅ Good
   http.get('/api/users', ...)  // 絶対パス
   ```

2. **baseURLとの整合性**
   ```typescript
   // env.API_URL が '/api' の場合
   http.get('/api/users', ...)  // ✅ 正しい
   http.get('/users', ...)      // ❌ マッチしない
   ```

---

## チェックリスト

### セットアップ時

- [ ] `pnpm add -D msw`
- [ ] `npx msw init public/ --save`
- [ ] `src/mocks/handlers.ts`作成
- [ ] `src/mocks/browser.ts`作成（ブラウザ用）
- [ ] `src/mocks/server.ts`作成（Node.js用）
- [ ] `src/lib/msw.tsx`作成（MSWProvider実装）
- [ ] AppProviderに統合（MSWProvider含む）
- [ ] Vitest setup設定
- [ ] `.env.local`に`NEXT_PUBLIC_API_MOCKING=true`設定

### 開発時

- [ ] ハンドラーは機能別に整理
- [ ] モックデータは共有可能に
- [ ] 型安全なレスポンス定義
- [ ] エラーパターンも定義

### Storybook

- [ ] `.storybook/preview.ts`でAppProviderを使用
- [ ] 環境変数`NEXT_PUBLIC_API_MOCKING=true`を設定

### テスト

- [ ] `server.listen()`をbeforeAll
- [ ] `server.resetHandlers()`をafterEach
- [ ] `server.close()`をafterAll
- [ ] 各テストで`server.use()`

---

## 参考リンク

- [環境変数管理](../03-core-concepts/05-environment-variables.md)
- [APIクライアント](../03-core-concepts/06-api-client.md)
- [API統合](./05-api-integration.md)
- [Storybook](./06-storybook.md)
- [テスト戦略](../05-testing/01-testing-strategy.md)
- [MSW公式ドキュメント](https://mswjs.io/)
- [MSW - Getting Started](https://mswjs.io/docs/getting-started)
- [MSW Examples](https://github.com/mswjs/examples)
- [bulletproof-react - MSW](https://github.com/alan2207/bulletproof-react)
