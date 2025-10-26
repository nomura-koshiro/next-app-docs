# トラブルシューティング

MSW使用時によくある問題と解決策をまとめます。

---

## 1. Service Workerが起動しない

### 症状

```text
[MSW] Failed to register a Service Worker
```

### 原因

- `public/mockServiceWorker.js`が存在しない
- HTTPSでない（localhostは除く）

### 解決策

```bash
# Service Workerファイルを再生成
npx msw init public/ --save

# HTTPSでないとService Workerは動作しない
# ローカル開発はlocalhostならOK
```

---

## 2. Next.js 15でハイドレーションエラー

### 症状

```text
Hydration failed because the initial UI does not match what was rendered on the server
```

### 原因

MSW起動前にコンポーネントがレンダリングされている

### 解決策

MSWの初期化を待ってからレンダリングする（既に実装済み）：

```typescript
// src/lib/msw.tsx
export function MSWProvider({ children }: { children: React.ReactNode }) {
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

---

## 3. Storybookでモックが動かない

### 症状

実際のAPIリクエストが発生してしまう

### 原因

- 環境変数が設定されていない
- MSWProviderが配置されていない

### 解決策

**1. 環境変数の確認**

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

**2. preview.tsの確認**

```typescript
// .storybook/preview.ts
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

**3. Storybookの再起動**

```bash
# Storybookを停止（Ctrl+C）して再起動
pnpm storybook
```

---

## 4. テストでリクエストがバイパスされる

### 症状

モックが適用されず実際のAPIにリクエストが飛ぶ

### 原因

- MSWサーバーが起動していない
- ハンドラーがリセットされていない

### 解決策

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

---

## 5. ネットワークタブにリクエストが表示されない

### 原因

Service Workerがリクエストをインターセプトしているため

### 確認方法

ブラウザコンソールにMSWログを表示：

```typescript
// src/mocks/browser.ts
worker.start({
  onUnhandledRequest: 'warn',
  quiet: false, // MSWログを表示
})
```

---

## 6. MSWが起動しない

### 症状

コンソールに `[MSW] Mock Service Worker initialized` が表示されない

### 原因と解決策

**1. 環境変数が設定されていない**

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

**2. 開発サーバーを再起動していない**

```bash
# サーバーを停止（Ctrl+C）して再起動
pnpm dev
```

**3. MSWProviderが配置されていない**

```typescript
// provider.tsx
<MSWProvider>
  {children}
</MSWProvider>
```

---

## 7. モックが適用されない

### 症状

実際のAPIにリクエストが送信される

### 原因と解決策

**1. ハンドラーのURLが間違っている**

```typescript
// ❌ Bad
http.get('users', ...)  // 相対パス

// ✅ Good
http.get('/api/sample/users', ...)  // 絶対パス
```

**2. baseURLとの整合性**

```typescript
// env.API_URL が '/api' の場合
http.get('/api/sample/users', ...)  // ✅ 正しい
http.get('/sample/users', ...)      // ❌ マッチしない
```

**3. ハンドラーの優先順位**

```typescript
// ✅ Good: 具体的なパスを先に
export const handlers = [
  http.get('/api/users/me', () => { ... }),
  http.get('/api/users/:id', () => { ... }),
]

// ❌ Bad: 汎用的なパスが先
export const handlers = [
  http.get('/api/users/:id', () => { ... }), // /api/users/me もマッチ
  http.get('/api/users/me', () => { ... }),  // 到達しない
]
```

---

## 8. CORS エラー

### 症状

```text
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### 原因

MSWがCORSヘッダーを返していない

### 解決策

```typescript
http.get('/api/sample/users', () => {
  return HttpResponse.json(
    { data: [...] },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
})
```

---

## 9. TypeScriptエラー

### 症状

```text
Property 'worker' does not exist on type 'typeof import("@/mocks/browser")'
```

### 原因

型定義が読み込まれていない

### 解決策

```bash
# MSWを再インストール
pnpm add -D msw@latest

# 型定義を確認
pnpm tsc --noEmit
```

---

## 10. Service Workerが古いバージョン

### 症状

MSWの新機能が使えない

### 原因

Service Workerファイルが古い

### 解決策

```bash
# Service Workerを再生成
npx msw init public/ --save

# ブラウザのキャッシュをクリア
# Chrome: DevTools > Application > Service Workers > Unregister
```

---

## 11. Playwrightでモックが動かない

### 症状

E2EテストでMSWが機能しない

### 原因

環境変数が設定されていない

### 解決策

```typescript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    env: {
      NEXT_PUBLIC_ENABLE_API_MOCKING: 'true', // MSWを有効化
    },
  },
})
```

---

## 12. パラメータが取得できない

### 症状

`params.id`や`url.searchParams`が`undefined`

### 原因

パラメータの取得方法が間違っている

### 解決策

**パスパラメータ:**

```typescript
// ✅ Good
http.get('/api/sample/users/:id', ({ params }) => {
  const { id } = params
  console.log(id) // '123'
})
```

**クエリパラメータ:**

```typescript
// ✅ Good
http.get('/api/sample/users', ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  console.log(search) // 'john'
})
```

---

## 13. リクエストボディが取得できない

### 症状

`await request.json()`で`undefined`が返る

### 原因

- リクエストがGETメソッド
- `request.json()`を複数回呼んでいる

### 解決策

```typescript
// ✅ Good
http.post('/api/sample/users', async ({ request }) => {
  const body = await request.json() // 一度だけ呼ぶ
  console.log(body)
  return HttpResponse.json({ id: 1, ...body })
})
```

---

## 14. 動的インポートエラー

### 症状

```text
Cannot find module '@/mocks/browser'
```

### 原因

- パスエイリアスが設定されていない
- ファイルが存在しない

### 解決策

**1. ファイルの確認**

```bash
ls src/mocks/browser.ts
```

**2. パスエイリアスの確認**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## デバッグのヒント

### 1. コンソールログを追加

```typescript
http.get('/api/sample/users', ({ request }) => {
  console.log('[MSW] GET /api/sample/users', request.url)
  return HttpResponse.json({ data: [...] })
})
```

### 2. worker.listHandlers()

```typescript
// 登録されているハンドラーを確認
console.log('[MSW] Handlers:', worker.listHandlers().length)

worker.listHandlers().forEach((handler) => {
  console.log('[MSW] Handler:', handler.info)
})
```

### 3. onUnhandledRequestで警告

```typescript
worker.start({
  onUnhandledRequest: 'warn', // すべてのリクエストを表示
})
```

---

## チェックリスト

問題が発生した場合、以下を確認してください：

- [ ] `NEXT_PUBLIC_ENABLE_API_MOCKING=true`が設定されている
- [ ] 開発サーバーを再起動した
- [ ] `public/mockServiceWorker.js`が存在する
- [ ] MSWProviderが配置されている
- [ ] ハンドラーのパスが正しい（絶対パス）
- [ ] afterEachでハンドラーをリセットしている
- [ ] ブラウザのキャッシュをクリアした
- [ ] コンソールにMSWのログが表示されている

---

## 関連リンク

- [インストール](./02-installation.md) - セットアップ手順
- [MSWProviderの実装](./05-msw-provider.md) - MSWProviderの詳細
- [ベストプラクティス](./08-best-practices.md) - 推奨パターン
- [MSW公式 - Troubleshooting](https://mswjs.io/docs/troubleshooting) - 公式トラブルシューティング
