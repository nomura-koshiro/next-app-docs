# MSWProviderの実装

アプリケーションにMSWを統合するためのMSWProviderの完全な実装方法を説明します。

---

## 完全な実装

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

---

## コードの構造

```text
MSWProvider
├── useState(isReady)           MSW初期化状態の管理
├── useEffect                   MSW初期化処理
│   └── initMSW()
│       ├── 環境チェック        ブラウザ & ENABLE_API_MOCKING
│       ├── worker インポート   動的インポート
│       └── worker.start()     Service Worker起動
└── 条件付きレンダリング        初期化完了まで待機
```

---

## 重要なポイント

### 1. クライアントコンポーネント

```typescript
'use client'
```

MSWはブラウザのService Workerを使用するため、クライアントコンポーネントとして実装する必要があります。

**理由:**
- Service WorkerはブラウザAPIのため、サーバーサイドでは動作しない
- `window`オブジェクトにアクセスする必要がある

---

### 2. 動的インポート

```typescript
const { worker } = await import('@/mocks/browser')
```

**メリット:**
- 本番環境でMSW関連のコードがバンドルされるのを防ぐ
- 開発環境でのみMSWをロード
- バンドルサイズの削減

**仕組み:**
```typescript
// ENABLE_API_MOCKING=false の場合
// → import('@/mocks/browser') は実行されない
// → MSWのコードは本番バンドルに含まれない
```

---

### 3. 初期化完了の待機

```typescript
if (!isReady && env.ENABLE_API_MOCKING === true) {
  return null
}
```

**理由:**
- MSW起動前にAPIリクエストが発行されるのを防ぐ
- モックが適用されないリクエストを防止

**動作:**
```text
1. MSWProviderマウント
2. isReady = false
3. children をレンダリングしない（null）
4. worker.start() 完了
5. setIsReady(true)
6. children をレンダリング
```

---

### 4. onUnhandledRequest設定

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

**カスタム関数の例:**
```typescript
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
}
```

---

## 環境変数の設定

### .env.local

```bash
# MSW (Mock Service Worker) 設定
# 開発環境でMSWを有効にする場合は'true'に設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

### env.tsでの検証

```typescript
// src/config/env.ts
import { z } from 'zod'

const EnvSchema = z.object({
  ENABLE_API_MOCKING: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional(),
  // その他の環境変数...
})

export const env = EnvSchema.parse({
  ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
  // その他の環境変数...
})
```

---

## AppProviderに統合

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

**ポイント:**
- MSWProviderを最外側に配置
- MSW初期化後に他のプロバイダーを初期化

---

## MSWの有効/無効切り替え

### 開発時の切り替え

```bash
# MSWを有効化（モックデータを使用）
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# MSWを無効化（実際のAPIを使用）
NEXT_PUBLIC_ENABLE_API_MOCKING=false
```

### 使い分け

| 設定 | 用途 |
|------|------|
| `true` | バックエンドが未完成、モックデータで開発 |
| `false` | 実際のAPIで動作確認 |

---

## デバッグ

### MSWの起動確認

ブラウザのコンソールに以下のメッセージが表示されれば成功です：

```text
[MSW] Mock Service Worker initialized
[MSW] Registered handlers: 10
```

### ハンドラーの一覧表示

```typescript
// src/lib/msw.tsx
await worker.start({ ... })

console.log('[MSW] Registered handlers:', worker.listHandlers().length)

// 各ハンドラーの詳細を表示
worker.listHandlers().forEach((handler) => {
  console.log('[MSW] Handler:', handler.info)
})
```

### リクエストのログ表示

```typescript
onUnhandledRequest: 'warn', // すべてのリクエストを表示
quiet: false, // MSWの内部ログも表示
```

---

## トラブルシューティング

### MSWが起動しない

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
   pnpm dev
   ```

3. **MSWProviderが配置されていない**

   ```typescript
   // provider.tsx
   <MSWProvider>
     {children}
   </MSWProvider>
   ```

### ハイドレーションエラー

**症状:**
```text
Hydration failed because the initial UI does not match what was rendered on the server
```

**解決策:**

MSWの初期化を待ってからレンダリングする（既に実装済み）：

```typescript
if (!isReady && env.ENABLE_API_MOCKING === true) {
  return null // MSW起動まで待機
}
```

---

## 次のステップ

MSWProviderの実装が完了したら、次はStorybookやテストとの統合方法を学びます。

1. **[Storybookとの統合](./06-storybook-integration.md)** - Storybookでの使用
2. **[テストとの統合](./07-testing-integration.md)** - Vitest、Playwrightでの使用

---

## 関連リンク

- [基本設定](./03-basic-configuration.md) - ハンドラーの作成
- [環境変数管理](../03-core-concepts/05-environment-variables.md) - 環境変数の詳細
- [MSW公式 - Integration](https://mswjs.io/docs/integrations) - 統合ガイド
