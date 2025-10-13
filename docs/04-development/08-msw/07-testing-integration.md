# テストとの統合

Vitest（単体テスト・統合テスト）とPlaywright（E2Eテスト）でのMSW使用方法を説明します。

---

## 1. Vitest設定

### vitest.setup.ts

```typescript
// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/server'

// すべてのテスト開始前にMSWサーバーを起動
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error', // 未処理リクエストでエラー
  })
})

// 各テスト後にハンドラーをリセット
afterEach(() => {
  server.resetHandlers()
})

// すべてのテスト終了後にMSWサーバーを停止
afterAll(() => {
  server.close()
})
```

### vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./vitest.setup.ts'], // セットアップファイルを指定
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## 2. 統合テストの例

### 基本的なテスト

```typescript
// src/features/users/components/__tests__/user-list.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { UserList } from '../user-list'
import { AppProvider } from '@/app/provider'

// テスト用のラッパー
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>)
}

describe('UserList', () => {
  it('ユーザー一覧を表示', async () => {
    // グローバルハンドラーをオーバーライド
    server.use(
      http.get('/api/v1/sample/users', () => {
        return HttpResponse.json({
          data: [
            { id: '1', name: 'John Doe', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          ],
        })
      })
    )

    renderWithProviders(<UserList />)

    // データが表示されるまで待つ
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('空データメッセージを表示', async () => {
    server.use(
      http.get('/api/v1/sample/users', () => {
        return HttpResponse.json({ data: [] })
      })
    )

    renderWithProviders(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('データがありません')).toBeInTheDocument()
    })
  })

  it('エラーメッセージを表示', async () => {
    server.use(
      http.get('/api/v1/sample/users', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        )
      })
    )

    renderWithProviders(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
    })
  })

  it('ローディング状態を表示', async () => {
    server.use(
      http.get('/api/v1/sample/users', async () => {
        // 遅延をシミュレーション
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ data: [] })
      })
    )

    renderWithProviders(<UserList />)

    // ローディング表示を確認
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()

    // データ読み込み完了を待つ
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument()
    })
  })
})
```

---

## 3. ユーザー操作のテスト

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { CreateUserForm } from '../create-user-form'
import { AppProvider } from '@/app/provider'

describe('CreateUserForm', () => {
  it('ユーザーを作成', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('/api/v1/sample/users', async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json(
          {
            data: {
              id: '123',
              ...body,
            },
          },
          { status: 201 }
        )
      })
    )

    render(
      <AppProvider>
        <CreateUserForm />
      </AppProvider>
    )

    // フォーム入力
    await user.type(screen.getByLabelText('名前'), 'John Doe')
    await user.type(screen.getByLabelText('メールアドレス'), 'john@example.com')

    // 送信
    await user.click(screen.getByRole('button', { name: '作成' }))

    // 成功メッセージを確認
    await waitFor(() => {
      expect(screen.getByText('ユーザーを作成しました')).toBeInTheDocument()
    })
  })

  it('バリデーションエラーを表示', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('/api/v1/sample/users', () => {
        return HttpResponse.json(
          {
            errors: {
              email: ['メールアドレスはすでに使用されています'],
            },
          },
          { status: 422 }
        )
      })
    )

    render(
      <AppProvider>
        <CreateUserForm />
      </AppProvider>
    )

    await user.type(screen.getByLabelText('名前'), 'John Doe')
    await user.type(screen.getByLabelText('メールアドレス'), 'john@example.com')
    await user.click(screen.getByRole('button', { name: '作成' }))

    await waitFor(() => {
      expect(screen.getByText('メールアドレスはすでに使用されています')).toBeInTheDocument()
    })
  })
})
```

---

## 4. Playwright E2Eテスト

### playwright.config.ts

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_ENABLE_API_MOCKING: 'true', // MSWを有効化
    },
  },
})
```

### E2Eテストの例

```typescript
// e2e/users.spec.ts
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // MSWを起動してからページ遷移
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test('ユーザー一覧ページ', async ({ page }) => {
  await page.goto('/users')

  // MSWがモックデータを返す
  await expect(page.locator('text=John Doe')).toBeVisible()
  await expect(page.locator('text=Jane Smith')).toBeVisible()
})

test('ユーザー作成', async ({ page }) => {
  await page.goto('/users/new')

  // フォーム入力
  await page.fill('input[name="name"]', 'New User')
  await page.fill('input[name="email"]', 'newuser@example.com')

  // 送信
  await page.click('button[type="submit"]')

  // MSWがPOSTリクエストをモック
  await expect(page.locator('text=ユーザーを作成しました')).toBeVisible()
})

test('ユーザー削除', async ({ page }) => {
  await page.goto('/users')

  // 削除ボタンをクリック
  await page.click('button:has-text("削除"):first')

  // 確認ダイアログ
  page.on('dialog', (dialog) => dialog.accept())

  // MSWがDELETEリクエストをモック
  await expect(page.locator('text=ユーザーを削除しました')).toBeVisible()
})
```

---

## 5. ハンドラーのリセット

### テストごとにハンドラーをリセット

```typescript
import { afterEach } from 'vitest'
import { server } from '@/mocks/server'

afterEach(() => {
  server.resetHandlers() // グローバルハンドラーに戻す
})
```

### 特定のテストでハンドラーを追加

```typescript
import { beforeEach } from 'vitest'

describe('特定の条件でのテスト', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/v1/users', () => {
        return HttpResponse.json({ data: [] })
      })
    )
  })

  it('テスト1', async () => {
    // このテストでは空データが返される
  })

  it('テスト2', async () => {
    // このテストでも空データが返される
  })
})
```

---

## 6. モックデータの共有

### テストとStorybookでモックデータを共有

```typescript
// src/mocks/data/users.ts
export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
]

// テストで使用
import { mockUsers } from '@/mocks/data/users'

server.use(
  http.get('/api/v1/sample/users', () => {
    return HttpResponse.json({ data: mockUsers })
  })
)

// Storybookで使用
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/sample/users', () => {
          return HttpResponse.json({ data: mockUsers })
        }),
      ],
    },
  },
}
```

---

## ベストプラクティス

### 1. グローバルハンドラーを基本とする

```typescript
// src/mocks/handlers.ts
// 基本的なレスポンスを定義
export const handlers = [
  http.get('/api/v1/sample/users', () => {
    return HttpResponse.json({ data: mockUsers })
  }),
]

// テストで必要に応じてオーバーライド
server.use(
  http.get('/api/v1/sample/users', () => {
    return HttpResponse.json({ data: [] })
  })
)
```

### 2. afterEachでハンドラーをリセット

```typescript
afterEach(() => {
  server.resetHandlers()
})
```

### 3. 型安全なモックデータ

```typescript
import type { User } from '@/types'

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
]
```

---

## 次のステップ

テストとの統合が完了したら、次はベストプラクティスとトラブルシューティングを確認します。

1. **[ベストプラクティス](./08-best-practices.md)** - MSW使用のベストプラクティス
2. **[トラブルシューティング](./09-troubleshooting.md)** - よくある問題と解決策

---

## 関連リンク

- [テスト戦略](../05-testing/01-testing-strategy.md) - テストの実装方針
- [MSW公式 - Testing](https://mswjs.io/docs/integrations/node) - 公式ドキュメント
