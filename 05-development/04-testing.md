# テスト

アプリのテスト戦略と実装ガイドです。Vitest（ユニットテスト）とPlaywright（E2Eテスト）を使用します。

## 目次

1. [テスト戦略](#テスト戦略)
2. [ユニットテスト (Vitest)](#ユニットテスト-vitest)
3. [E2Eテスト (Playwright)](#e2eテスト-playwright)
4. [コンポーネントテスト](#コンポーネントテスト)
5. [APIテスト](#apiテスト)
6. [テストのベストプラクティス](#テストのベストプラクティス)

---

## テスト戦略

### テストピラミッド

```
       /\
      /  \     E2Eテスト (少)
     /____\    - Playwright
    /      \
   /        \  統合テスト (中)
  /__________\ - React Testing Library
 /            \
/______________\ ユニットテスト (多)
                - Vitest
```

### テストの種類と目的

| テストタイプ | ツール | 目的 | 実行速度 |
|------------|--------|------|---------|
| **ユニットテスト** | Vitest | 関数・フックの単体テスト | 高速 |
| **コンポーネントテスト** | Vitest + React Testing Library | UIコンポーネントのテスト | 中速 |
| **E2Eテスト** | Playwright | ユーザーフローの統合テスト | 低速 |

---

## ユニットテスト (Vitest)

### セットアップ

```bash
# 依存関係インストール済み
pnpm test
```

### 基本的なテスト

```typescript
// utils/format-date.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './format-date'

describe('formatDate', () => {
  it('日付を正しくフォーマットする', () => {
    const date = new Date('2025-01-15')
    const result = formatDate(date)

    expect(result).toBe('2025年1月15日')
  })

  it('無効な日付の場合は空文字を返す', () => {
    const result = formatDate(null)

    expect(result).toBe('')
  })
})
```

### カスタムフックのテスト

```typescript
// hooks/use-debounce.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  it('指定した時間後に値を更新する', async () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    // まだ更新されない
    expect(result.current).toBe('initial')

    // 500ms経過
    vi.advanceTimersByTime(500)

    await waitFor(() => {
      expect(result.current).toBe('updated')
    })

    vi.useRealTimers()
  })
})
```

### モックの活用

```typescript
// features/training/hooks/use-training.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useTraining } from './use-training'

// API関数をモック
vi.mock('@/lib/api-client', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('useTraining', () => {
  it('トレーニングデータを取得する', async () => {
    const mockData = { id: '1', name: 'ベンチプレス' }

    // モックの返り値を設定
    vi.mocked(api.get).mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useTraining('1'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })
  })
})
```

---

## E2Eテスト (Playwright)

### セットアップ

```bash
# Playwright インストール
pnpm create playwright

# ブラウザインストール
pnpm exec playwright install
```

### 基本的なE2Eテスト

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('ログイン機能', () => {
  test('正しい認証情報でログインできる', async ({ page }) => {
    // ログインページに移動
    await page.goto('http://localhost:3000/login')

    // フォーム入力
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')

    // ログインボタンクリック
    await page.click('button[type="submit"]')

    // ダッシュボードにリダイレクト
    await expect(page).toHaveURL('http://localhost:3000/dashboard')

    // ユーザー名が表示される
    await expect(page.locator('text=ようこそ')).toBeVisible()
  })

  test('無効な認証情報でログイン失敗する', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // エラーメッセージが表示される
    await expect(page.locator('text=認証に失敗しました')).toBeVisible()
  })
})
```

### ページオブジェクトパターン

```typescript
// e2e/pages/login-page.ts
import { Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3000/login')
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email)
    await this.page.fill('input[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }

  async getErrorMessage() {
    return this.page.locator('[role="alert"]').textContent()
  }
}

// 使用例
test('ログイン', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')

  await expect(page).toHaveURL('/dashboard')
})
```

### APIモック

```typescript
// e2e/training-list.spec.ts
import { test, expect } from '@playwright/test'

test('トレーニング一覧を表示する', async ({ page }) => {
  // APIレスポンスをモック
  await page.route('**/api/trainings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', name: 'ベンチプレス', date: '2025-01-15' },
        { id: '2', name: 'スクワット', date: '2025-01-16' },
      ]),
    })
  })

  await page.goto('http://localhost:3000/training')

  // トレーニングが表示される
  await expect(page.locator('text=ベンチプレス')).toBeVisible()
  await expect(page.locator('text=スクワット')).toBeVisible()
})
```

---

## コンポーネントテスト

### React Testing Libraryの使用

```typescript
// components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('子要素を表示する', () => {
    render(<Button>クリック</Button>)

    expect(screen.getByText('クリック')).toBeInTheDocument()
  })

  it('クリックイベントを発火する', () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>クリック</Button>)

    fireEvent.click(screen.getByText('クリック'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabledの場合はクリックできない', () => {
    const handleClick = vi.fn()

    render(
      <Button onClick={handleClick} disabled>
        クリック
      </Button>
    )

    fireEvent.click(screen.getByText('クリック'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('バリアントに応じたクラスが適用される', () => {
    const { container } = render(<Button variant="secondary">クリック</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-gray-200')
  })
})
```

### フォームコンポーネントのテスト

```typescript
// features/training/components/training-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TrainingForm } from './training-form'

describe('TrainingForm', () => {
  it('フォーム送信時にonSubmitが呼ばれる', async () => {
    const handleSubmit = vi.fn()

    render(<TrainingForm onSubmit={handleSubmit} />)

    // フォーム入力
    fireEvent.change(screen.getByLabelText('トレーニング名'), {
      target: { value: 'ベンチプレス' },
    })

    fireEvent.change(screen.getByLabelText('重量'), {
      target: { value: '80' },
    })

    // 送信
    fireEvent.click(screen.getByText('保存'))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'ベンチプレス',
        weight: 80,
      })
    })
  })

  it('バリデーションエラーを表示する', async () => {
    render(<TrainingForm onSubmit={vi.fn()} />)

    // 空のまま送信
    fireEvent.click(screen.getByText('保存'))

    await waitFor(() => {
      expect(screen.getByText('トレーニング名は必須です')).toBeInTheDocument()
    })
  })
})
```

---

## APIテスト

### MSW (Mock Service Worker)の使用

```typescript
// tests/setup.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { beforeAll, afterEach, afterAll } from 'vitest'

const handlers = [
  http.get('/api/trainings', () => {
    return HttpResponse.json([
      { id: '1', name: 'ベンチプレス' },
      { id: '2', name: 'スクワット' },
    ])
  }),

  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json(
      { id: '3', ...body },
      { status: 201 }
    )
  }),
]

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

```typescript
// features/training/api/queries.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { useTrainings } from './queries'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTrainings', () => {
  it('トレーニング一覧を取得する', async () => {
    const { result } = renderHook(() => useTrainings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([
      { id: '1', name: 'ベンチプレス' },
      { id: '2', name: 'スクワット' },
    ])
  })
})
```

---

## テストのベストプラクティス

### 1. AAA (Arrange-Act-Assert) パターン

```typescript
it('トレーニングを作成する', async () => {
  // Arrange: テストの準備
  const newTraining = { name: 'ベンチプレス', weight: 80 }

  // Act: 実行
  const result = await createTraining(newTraining)

  // Assert: 検証
  expect(result).toEqual({ id: '1', ...newTraining })
})
```

### 2. テストは独立させる

```typescript
// ❌ Bad: テスト間で状態を共有
let training: Training

it('トレーニングを作成', () => {
  training = createTraining({ name: 'ベンチプレス' })
})

it('トレーニングを更新', () => {
  updateTraining(training.id, { weight: 90 })  // trainingに依存
})

// ✅ Good: 各テストで初期化
it('トレーニングを作成', () => {
  const training = createTraining({ name: 'ベンチプレス' })
  expect(training).toBeDefined()
})

it('トレーニングを更新', () => {
  const training = createTraining({ name: 'ベンチプレス' })
  const updated = updateTraining(training.id, { weight: 90 })
  expect(updated.weight).toBe(90)
})
```

### 3. ユーザー視点でテストする

```typescript
// ❌ Bad: 実装詳細をテスト
it('useState が正しく動作する', () => {
  const { result } = renderHook(() => useState(0))
  expect(result.current[0]).toBe(0)
})

// ✅ Good: ユーザー視点でテスト
it('カウンターが増加する', () => {
  render(<Counter />)

  fireEvent.click(screen.getByText('+'))

  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### 4. テストの可読性を重視

```typescript
// ✅ Good: 明確なテスト名と構造
describe('TrainingForm', () => {
  describe('送信時', () => {
    it('有効なデータでonSubmitが呼ばれる', () => {
      // ...
    })

    it('無効なデータでエラーを表示する', () => {
      // ...
    })
  })

  describe('キャンセル時', () => {
    it('onCancelが呼ばれる', () => {
      // ...
    })
  })
})
```

---

## コマンド一覧

### ユニットテスト

```bash
# すべてのテスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# カバレッジ
pnpm test:coverage

# UI モード
pnpm test:ui
```

### E2Eテスト

```bash
# すべてのE2Eテスト実行
pnpm e2e

# ヘッドモード（ブラウザ表示）
pnpm e2e:headed

# UIモード
pnpm e2e:ui

# 特定のブラウザ
pnpm e2e --project=chromium
```

---

## 参考リンク

### 内部ドキュメント

- [コーディング規約](./01-coding-standards.md)
- [コンポーネント設計](../04-implementation/01-component-design.md)

### 外部リンク

- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW (Mock Service Worker)](https://mswjs.io/)
