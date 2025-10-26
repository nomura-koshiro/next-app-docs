# MSW (Mock Service Worker)

本ドキュメントでは、MSW (Mock Service Worker) を使用したAPIモックの実装方法について説明します。開発環境、Storybook、テスト環境でのAPIモック統合と、ハンドラーの作成方法を解説します。

## 📚 目次

1. **[MSWの紹介](./01-introduction.md)** - MSWとは、導入メリット
2. **[インストール](./02-installation.md)** - セットアップ手順
3. **[基本設定](./03-basic-configuration.md)** - ディレクトリ構造、ハンドラー作成
4. **[ハンドラーの作成](./04-creating-handlers.md)** - REST API、GraphQL、動的レスポンス
5. **[MSWProviderの実装](./05-msw-provider.md)** - 完全な実装コード
6. **[Storybookとの統合](./06-storybook-integration.md)** - preview.ts設定
7. **[テストとの統合](./07-testing-integration.md)** - Vitest、Playwright
8. **[ベストプラクティス](./08-best-practices.md)** - ハンドラー整理、データ共有
9. **[トラブルシューティング](./09-troubleshooting.md)** - よくある問題と解決策

---

## 🚀 クイックスタート

### 最小限のセットアップ

```bash
# 1. インストール
pnpm add -D msw@latest

# 2. Service Worker生成
npx msw init public/ --save

# 3. .gitignoreに追加
echo "public/mockServiceWorker.js" >> .gitignore
```

### ハンドラーの作成

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json({
      data: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
    })
  }),
]
```

### MSWの有効化

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

```typescript
// src/lib/msw.tsx
'use client'

import { useEffect, useState } from 'react'
import { env } from '@/config/env'

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initMSW = async () => {
      if (typeof window !== 'undefined' && env.ENABLE_API_MOCKING === true) {
        const { worker } = await import('@/mocks/browser')
        await worker.start()
        console.log('[MSW] Mock Service Worker initialized')
      }
      setIsReady(true)
    }
    void initMSW()
  }, [])

  if (!isReady && env.ENABLE_API_MOCKING === true) {
    return null
  }

  return <>{children}</>
}
```

---

## 📖 使用目的

このプロジェクトでは以下の目的でMSWを使用します：

| 環境 | 用途 |
|------|------|
| **開発環境** | バックエンドAPIのモック |
| **Storybook** | コンポーネント開発時のAPIモック |
| **E2Eテスト** | Playwrightでのテスト |
| **統合テスト** | Vitestでのテスト |

---

## 🔗 関連リンク

- [環境変数管理](../../03-core-concepts/05-environment-variables.md) - MSW有効化の設定
- [APIクライアント](../../03-core-concepts/06-api-client.md) - APIリクエストの実装
- [API統合](../07-api-integration/index.md) - TanStack Queryとの連携
- [Storybook](../04-storybook/index.md) - Storybookの設定
- [テスト戦略](../../05-testing/01-testing-strategy.md) - テストの実装方針
- [MSW公式ドキュメント](https://mswjs.io/) - 公式ドキュメント
