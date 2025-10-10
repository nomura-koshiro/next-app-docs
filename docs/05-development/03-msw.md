# MSW (Mock Service Worker)

MSW (Mock Service Worker) を使用したAPIモックの実装ガイドです。

## 目次

1. [MSWとは](#mswとは)
2. [導入メリット](#導入メリット)
3. [インストール](#インストール)
4. [基本設定](#基本設定)
5. [ハンドラーの作成](#ハンドラーの作成)
6. [Storybookとの統合](#storybookとの統合)
7. [テストとの統合](#テストとの統合)
8. [ベストプラクティス](#ベストプラクティス)
9. [トラブルシューティング](#トラブルシューティング)

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

### 1. ハンドラーファイル作成

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // GET /api/trainings
  http.get('/api/trainings', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: '胸トレ',
        date: '2024-01-15',
        exercises: [
          {
            id: 101,
            name: 'ベンチプレス',
            sets: [
              { reps: 10, weight: 80, rpe: 8 },
              { reps: 8, weight: 85, rpe: 9 },
            ],
          },
        ],
      },
    ])
  }),

  // POST /api/trainings
  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: Date.now(), ...body },
      { status: 201 }
    )
  }),

  // エラーレスポンス例
  http.get('/api/trainings/:id', ({ params }) => {
    const { id } = params
    if (id === '999') {
      return HttpResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({
      id: Number(id),
      name: 'サンプルトレーニング',
    })
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

**Next.js 15での起動:**

```typescript
// src/app/providers.tsx
'use client'

import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const initMSW = async () => {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass', // モックなしリクエストはそのまま通す
        })
        setMswReady(true)
      } else {
        setMswReady(true)
      }
    }

    initMSW()
  }, [])

  if (!mswReady) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
```

```typescript
// src/app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
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

---

## Storybookとの統合

このプロジェクトでは、Storybook内でMSWを**AppProvider経由**で使用します。

### preview.tsでの設定

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite'
import { AppProvider } from '../src/app/provider'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
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

### 4. 環境変数による切り替え

```typescript
// src/app/providers.tsx
const shouldUseMSW =
  process.env.NEXT_PUBLIC_USE_MSW === 'true' ||
  process.env.NODE_ENV === 'development'

if (shouldUseMSW) {
  const { worker } = await import('@/mocks/browser')
  await worker.start()
}
```

```bash
# .env.local
NEXT_PUBLIC_USE_MSW=true  # MSW有効化
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

---

## チェックリスト

### セットアップ時

- [ ] `pnpm add -D msw`
- [ ] `npx msw init public/ --save`
- [ ] `src/mocks/handlers.ts`作成
- [ ] `src/mocks/browser.ts`作成（ブラウザ用）
- [ ] `src/mocks/server.ts`作成（Node.js用）
- [ ] Next.js AppProvider設定（MSWProvider含む）
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

### 内部ドキュメント

- [Storybook](./02-storybook.md)
- [テスト](./04-testing.md)
- [API統合](../03-core-concepts/03-api-integration.md)

### 外部リンク

- [MSW公式ドキュメント](https://mswjs.io/)
- [MSW Storybook Addon](https://storybook.js.org/addons/msw-storybook-addon)
- [MSW Examples](https://github.com/mswjs/examples)
