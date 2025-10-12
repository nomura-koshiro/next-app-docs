# E2Eテスト (Playwright)

Playwrightを使用したエンドツーエンドテストについて説明します。ユーザーフロー全体のテスト、ページオブジェクトパターン、CI/CD統合について解説します。

## 目次

1. [Playwrightとは](#playwrightとは)
2. [セットアップ](#セットアップ)
3. [基本的なE2Eテスト](#基本的なe2eテスト)
4. [ページオブジェクトパターン](#ページオブジェクトパターン)
5. [APIモック](#apiモック)
6. [認証フローのテスト](#認証フローのテスト)
7. [ファイルアップロード](#ファイルアップロード)
8. [スクリーンショット・動画記録](#スクリーンショット動画記録)
9. [並列実行設定](#並列実行設定)
10. [CI/CD統合](#cicd統合)

---

## Playwrightとは

Playwrightは、Microsoftが開発した次世代のE2Eテストフレームワークです。

### 主な特徴

- **マルチブラウザ対応**: Chromium、Firefox、WebKitをサポート
- **自動待機**: 要素の準備が整うまで自動的に待機
- **強力なセレクタ**: テキスト、ロール、テストIDなど柔軟なセレクタ
- **並列実行**: 複数のテストを並列で高速実行
- **ネットワーク制御**: APIリクエストのモック・インターセプト
- **スクリーンショット・動画**: デバッグ用の視覚的記録

### 他ツールとの比較

| 機能 | Playwright | Cypress | Selenium |
|------|-----------|---------|----------|
| **速度** | 高速 | 中速 | 低速 |
| **並列実行** | ✅ | 有料版のみ | ✅ |
| **マルチブラウザ** | ✅ | 限定的 | ✅ |
| **APIモック** | ✅ | ✅ | ❌ |
| **学習コスト** | 低 | 低 | 高 |

---

## セットアップ

### インストール

```bash
# Playwright インストール
pnpm create playwright

# ブラウザインストール
pnpm exec playwright install
```

### 設定ファイル

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### ディレクトリ構造

```text
e2e/
├── fixtures/           # テストフィクスチャ
│   ├── auth.ts
│   └── test-data.ts
├── pages/              # ページオブジェクト
│   ├── login-page.ts
│   ├── dashboard-page.ts
│   └── training-page.ts
├── utils/              # ヘルパー関数
│   ├── auth-helpers.ts
│   └── test-helpers.ts
├── login.spec.ts
├── training.spec.ts
└── user.spec.ts
```

---

## 基本的なE2Eテスト

### シンプルなテスト

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('ログイン機能', () => {
  test('正しい認証情報でログインできる', async ({ page }) => {
    // ログインページに移動
    await page.goto('/login')

    // フォーム入力
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')

    // ログインボタンクリック
    await page.click('button[type="submit"]')

    // ダッシュボードにリダイレクト
    await expect(page).toHaveURL('/dashboard')

    // ユーザー名が表示される
    await expect(page.locator('text=ようこそ')).toBeVisible()
  })

  test('無効な認証情報でログイン失敗する', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // エラーメッセージが表示される
    await expect(page.locator('[role="alert"]')).toContainText('認証に失敗しました')
  })
})
```

### セレクタのベストプラクティス

```typescript
// ❌ Bad: 実装詳細に依存
await page.click('.css-abc123 > div > button')

// ✅ Good: ユーザー視点のセレクタ
await page.getByRole('button', { name: 'ログイン' }).click()

// ✅ Good: テストID（実装が変わっても安定）
await page.getByTestId('login-button').click()

// ✅ Good: テキストベース
await page.getByText('ログイン').click()

// ✅ Good: ラベル
await page.getByLabel('メールアドレス').fill('user@example.com')
```

### 待機処理

```typescript
// 自動待機（推奨）
await page.click('button') // 要素がクリック可能になるまで自動待機

// 明示的待機
await page.waitForSelector('text=読み込み完了')
await page.waitForURL('/dashboard')
await page.waitForLoadState('networkidle')

// カスタム待機条件
await page.waitForFunction(() => {
  return document.querySelectorAll('.list-item').length > 10
})
```

---

## ページオブジェクトパターン

### ページクラスの作成

```typescript
// e2e/pages/login-page.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('メールアドレス')
    this.passwordInput = page.getByLabel('パスワード')
    this.submitButton = page.getByRole('button', { name: 'ログイン' })
    this.errorMessage = page.locator('[role="alert"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async getErrorText() {
    return await this.errorMessage.textContent()
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible()
  }
}
```

```typescript
// e2e/pages/training-page.ts
import { Page, Locator } from '@playwright/test'

export class TrainingPage {
  readonly page: Page
  readonly addButton: Locator
  readonly trainingList: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = page.getByRole('button', { name: '追加' })
    this.trainingList = page.getByTestId('training-list')
  }

  async goto() {
    await this.page.goto('/training')
  }

  async addTraining(name: string, weight: number) {
    await this.addButton.click()
    await this.page.getByLabel('トレーニング名').fill(name)
    await this.page.getByLabel('重量').fill(weight.toString())
    await this.page.getByRole('button', { name: '保存' }).click()
  }

  async getTrainingByName(name: string) {
    return this.trainingList.locator(`text=${name}`)
  }

  async deleteTraining(name: string) {
    const training = await this.getTrainingByName(name)
    await training.locator('button[aria-label="削除"]').click()
    await this.page.getByRole('button', { name: '確認' }).click()
  }
}
```

### ページオブジェクトの使用

```typescript
// e2e/training.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login-page'
import { TrainingPage } from './pages/training-page'

test.describe('トレーニング管理', () => {
  test('トレーニングを追加できる', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const trainingPage = new TrainingPage(page)

    // ログイン
    await loginPage.goto()
    await loginPage.login('user@example.com', 'password123')

    // トレーニング追加
    await trainingPage.goto()
    await trainingPage.addTraining('ベンチプレス', 80)

    // 追加されたことを確認
    const training = await trainingPage.getTrainingByName('ベンチプレス')
    await expect(training).toBeVisible()
  })
})
```

---

## APIモック

### 基本的なモック

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
        { id: '1', name: 'ベンチプレス', weight: 80, date: '2025-01-15' },
        { id: '2', name: 'スクワット', weight: 100, date: '2025-01-16' },
      ]),
    })
  })

  await page.goto('/training')

  // モックデータが表示される
  await expect(page.getByText('ベンチプレス')).toBeVisible()
  await expect(page.getByText('スクワット')).toBeVisible()
})
```

### 条件付きモック

```typescript
test('エラー時の表示を確認', async ({ page }) => {
  // エラーレスポンスをモック
  await page.route('**/api/trainings', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    })
  })

  await page.goto('/training')

  // エラーメッセージが表示される
  await expect(page.getByText('データの取得に失敗しました')).toBeVisible()
})
```

### 動的なモック

```typescript
test('トレーニングを作成する', async ({ page }) => {
  let createdTraining: any = null

  // GET リクエストをモック
  await page.route('**/api/trainings', async (route) => {
    if (route.request().method() === 'GET') {
      const trainings = createdTraining ? [createdTraining] : []
      await route.fulfill({
        status: 200,
        body: JSON.stringify(trainings),
      })
    }
  })

  // POST リクエストをモック
  await page.route('**/api/trainings', async (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON()
      createdTraining = { id: '1', ...body }

      await route.fulfill({
        status: 201,
        body: JSON.stringify(createdTraining),
      })
    }
  })

  await page.goto('/training')

  // トレーニング追加
  await page.getByRole('button', { name: '追加' }).click()
  await page.getByLabel('トレーニング名').fill('ベンチプレス')
  await page.getByRole('button', { name: '保存' }).click()

  // 作成されたトレーニングが表示される
  await expect(page.getByText('ベンチプレス')).toBeVisible()
})
```

### ネットワーク監視

```typescript
test('APIリクエストを検証', async ({ page }) => {
  // リクエストを記録
  const requests: any[] = []

  page.on('request', (request) => {
    if (request.url().includes('/api/')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        body: request.postDataJSON(),
      })
    }
  })

  await page.goto('/training')
  await page.getByRole('button', { name: '追加' }).click()
  await page.getByLabel('トレーニング名').fill('ベンチプレス')
  await page.getByRole('button', { name: '保存' }).click()

  // POSTリクエストが送信されたことを確認
  const postRequest = requests.find((r) => r.method === 'POST')
  expect(postRequest).toBeDefined()
  expect(postRequest.body).toMatchObject({ name: 'ベンチプレス' })
})
```

---

## 認証フローのテスト

### フィクスチャの作成

```typescript
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/login-page'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)

    // ログイン処理
    await loginPage.goto()
    await loginPage.login('user@example.com', 'password123')

    // ログイン完了を待機
    await page.waitForURL('/dashboard')

    // テストで使用
    await use(page)

    // クリーンアップ（必要に応じて）
    await page.context().clearCookies()
  },
})
```

### 認証済みテスト

```typescript
// e2e/training.spec.ts
import { test } from './fixtures/auth'
import { expect } from '@playwright/test'

test('認証済みユーザーがトレーニングを表示できる', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/training')

  // トレーニング一覧が表示される
  await expect(authenticatedPage.getByTestId('training-list')).toBeVisible()
})
```

### ストレージステートの保存

```typescript
// e2e/global-setup.ts
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // ログイン
  await page.goto('http://localhost:3000/login')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard')

  // 認証状態を保存
  await page.context().storageState({ path: 'e2e/.auth/user.json' })

  await browser.close()
}

export default globalSetup
```

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./e2e/global-setup'),
  use: {
    storageState: 'e2e/.auth/user.json',
  },
})
```

---

## ファイルアップロード

### 基本的なアップロード

```typescript
test('ファイルをアップロードできる', async ({ page }) => {
  await page.goto('/profile')

  // ファイル選択
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/avatar.png')

  // アップロードボタンをクリック
  await page.getByRole('button', { name: 'アップロード' }).click()

  // 成功メッセージを確認
  await expect(page.getByText('アップロードしました')).toBeVisible()
})
```

### 複数ファイルのアップロード

```typescript
test('複数ファイルをアップロード', async ({ page }) => {
  await page.goto('/documents')

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles([
    'tests/fixtures/file1.pdf',
    'tests/fixtures/file2.pdf',
  ])

  await page.getByRole('button', { name: '送信' }).click()

  await expect(page.getByText('2件のファイルをアップロードしました')).toBeVisible()
})
```

### バッファからアップロード

```typescript
test('動的に生成したファイルをアップロード', async ({ page }) => {
  await page.goto('/upload')

  // ファイル内容を動的に生成
  const buffer = Buffer.from('テストデータ', 'utf-8')

  await page.locator('input[type="file"]').setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: buffer,
  })

  await page.getByRole('button', { name: 'アップロード' }).click()
  await expect(page.getByText('アップロード完了')).toBeVisible()
})
```

---

## スクリーンショット・動画記録

### スクリーンショット

```typescript
test('スクリーンショットを撮る', async ({ page }) => {
  await page.goto('/dashboard')

  // ページ全体のスクリーンショット
  await page.screenshot({ path: 'screenshots/dashboard.png' })

  // 特定の要素のスクリーンショット
  const element = page.getByTestId('training-chart')
  await element.screenshot({ path: 'screenshots/chart.png' })

  // フルページスクリーンショット
  await page.screenshot({
    path: 'screenshots/full-page.png',
    fullPage: true
  })
})
```

### 失敗時のスクリーンショット

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
```

### ビジュアルリグレッションテスト

```typescript
test('ビジュアルリグレッション', async ({ page }) => {
  await page.goto('/dashboard')

  // スクリーンショットを比較
  await expect(page).toHaveScreenshot('dashboard.png', {
    maxDiffPixels: 100, // 許容する差分ピクセル数
  })
})
```

### トレース記録

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // 最初のリトライ時にトレースを記録
  },
})
```

```bash
# トレースビューアーを開く
pnpm exec playwright show-trace trace.zip
```

---

## 並列実行設定

### 基本的な並列実行

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined, // CIでは1、ローカルでは自動
  fullyParallel: true, // ファイル内のテストも並列実行
})
```

### テストの分離

```typescript
test.describe.configure({ mode: 'parallel' })

test.describe('トレーニング管理', () => {
  test('テスト1', async ({ page }) => {
    // 並列実行される
  })

  test('テスト2', async ({ page }) => {
    // 並列実行される
  })
})
```

### シリアル実行

```typescript
test.describe.configure({ mode: 'serial' })

test.describe('順次実行が必要なテスト', () => {
  test('ステップ1: データ作成', async ({ page }) => {
    // ...
  })

  test('ステップ2: データ更新', async ({ page }) => {
    // ステップ1の後に実行
  })
})
```

### ワーカー間でのデータ共有

```typescript
// e2e/fixtures/test-data.ts
import { test as base } from '@playwright/test'

type WorkerFixtures = {
  sharedData: { userId: string }
}

export const test = base.extend<{}, WorkerFixtures>({
  sharedData: [
    async ({}, use, workerInfo) => {
      // ワーカーごとに一度だけ実行
      const userId = `worker-${workerInfo.workerIndex}`
      await use({ userId })
    },
    { scope: 'worker' },
  ],
})
```

---

## CI/CD統合

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm e2e

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Docker統合

```dockerfile
# Dockerfile.e2e
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

CMD ["pnpm", "e2e"]
```

```yaml
# docker-compose.yml
services:
  e2e:
    build:
      context: .
      dockerfile: Dockerfile.e2e
    volumes:
      - ./e2e:/app/e2e
      - ./playwright-report:/app/playwright-report
    environment:
      - CI=true
```

### リトライ戦略

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // CIでは2回リトライ

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      retries: 3, // プロジェクト別のリトライ設定
    },
  ],
})
```

### テストシャーディング

```bash
# 4つのシャードに分割して実行
pnpm exec playwright test --shard=1/4
pnpm exec playwright test --shard=2/4
pnpm exec playwright test --shard=3/4
pnpm exec playwright test --shard=4/4
```

```yaml
# GitHub Actionsでのシャーディング
jobs:
  test:
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - name: Run E2E tests
        run: pnpm exec playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

---

## コマンド一覧

```bash
# すべてのE2Eテスト実行
pnpm e2e

# ヘッドモード（ブラウザ表示）
pnpm e2e:headed

# UIモード（インタラクティブ）
pnpm e2e:ui

# 特定のブラウザで実行
pnpm e2e --project=chromium
pnpm e2e --project=firefox
pnpm e2e --project=webkit

# 特定のファイルを実行
pnpm e2e login.spec.ts

# デバッグモード
pnpm exec playwright test --debug

# レポート表示
pnpm exec playwright show-report

# コードジェネレーター
pnpm exec playwright codegen http://localhost:3000
```

---

## 参考リンク

- [テスト戦略](./01-testing-strategy.md)
- [ユニットテスト](./02-unit-testing.md)
- [テストのベストプラクティス](./06-best-practices.md)
- [Playwright 公式ドキュメント](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
