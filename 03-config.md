# 設定管理（Config）

このドキュメントでは、プロジェクトにおける設定管理の実装方法を説明します。

## 目次

1. [環境変数の管理](#環境変数の管理)
2. [定数の管理](#定数の管理)
3. [環境別設定](#環境別設定)
4. [実装例](#実装例)
5. [ベストプラクティス](#ベストプラクティス)

---

## 環境変数の管理

### 環境変数ファイル

Next.jsは複数の環境変数ファイルをサポートしています：

```
.env                # すべての環境で読み込まれる
.env.local          # ローカル環境（Gitにコミットしない）
.env.development    # 開発環境
.env.production     # 本番環境
.env.test           # テスト環境
```

### 環境変数の定義

```bash
# .env.local

# APIエンドポイント
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# アプリケーション環境
NEXT_PUBLIC_APP_ENV=development

# 機能フラグ
NEXT_PUBLIC_ENABLE_DEVTOOLS=true

# サーバーサイド専用（NEXT_PUBLIC_プレフィックスなし）
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET_KEY=your-secret-key
```

**重要:**

- **クライアント公開**: `NEXT_PUBLIC_`プレフィックスを付けるとブラウザで利用可能
- **サーバー専用**: プレフィックスなしはサーバーサイドのみ

---

### 型安全な環境変数

Zodを使用して環境変数をバリデーションします。

```typescript
// src/config/env.ts
import { z } from 'zod'

// 環境変数のスキーマ定義
const envSchema = z.object({
  // クライアント側で使用
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_ENABLE_DEVTOOLS: z
    .string()
    .transform((val) => val === 'true')
    .optional()
    .default('false'),

  // サーバーサイド専用
  DATABASE_URL: z.string().optional(),
  API_SECRET_KEY: z.string().optional(),
})

// 環境変数の型推論
export type Env = z.infer<typeof envSchema>

// 環境変数のパース
const parseEnv = (): Env => {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
      NEXT_PUBLIC_ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS,
      DATABASE_URL: process.env.DATABASE_URL,
      API_SECRET_KEY: process.env.API_SECRET_KEY,
    })
  } catch (error) {
    console.error('❌ 環境変数の検証に失敗しました:')
    if (error instanceof z.ZodError) {
      console.error(error.flatten().fieldErrors)
    }
    throw new Error('Invalid environment variables')
  }
}

// 環境変数をエクスポート（シングルトン）
export const env = parseEnv()
```

### 使用方法

```typescript
// src/lib/api-client.ts
import { env } from '@/config/env'

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL, // 型安全にアクセス
  timeout: 10000,
})
```

---

## 定数の管理

### アプリケーション定数

```typescript
// src/config/constants.ts

// アプリケーション情報
export const APP_NAME = 'CAMP' as const
export const APP_VERSION = '0.1.0' as const
export const APP_DESCRIPTION = 'キャンプ管理システム' as const

// ページネーション
export const DEFAULT_PAGE_SIZE = 20 as const
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

// ローカルストレージキー
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const

// APIタイムアウト
export const API_TIMEOUT = 10000 as const

// 日付フォーマット
export const DATE_FORMAT = 'yyyy-MM-dd' as const
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss' as const

// ファイルアップロード
export const MAX_FILE_SIZE = 10 * 1024 * 1024 as const // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
] as const

// ユーザーロール
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// バリデーション
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
} as const
```

---

## 環境別設定

### 環境判定ユーティリティ

```typescript
// src/utils/env.ts
import { env } from '@/config/env'

export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development'
export const isStaging = env.NEXT_PUBLIC_APP_ENV === 'staging'
export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production'

export const isServer = typeof window === 'undefined'
export const isClient = typeof window !== 'undefined'

export const isDevToolsEnabled = env.NEXT_PUBLIC_ENABLE_DEVTOOLS === true
```

### 環境別の設定

```typescript
// src/config/app.ts
import { env } from './env'

interface AppConfig {
  apiUrl: string
  enableLogging: boolean
  enableDevTools: boolean
  cacheTime: number
}

const developmentConfig: AppConfig = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  enableLogging: true,
  enableDevTools: true,
  cacheTime: 1000, // 1秒（開発時は短く）
}

const productionConfig: AppConfig = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  enableLogging: false,
  enableDevTools: false,
  cacheTime: 5 * 60 * 1000, // 5分
}

export const getAppConfig = (): AppConfig => {
  switch (env.NEXT_PUBLIC_APP_ENV) {
    case 'development':
      return developmentConfig
    case 'production':
      return productionConfig
    default:
      return developmentConfig
  }
}

export const appConfig = getAppConfig()
```

---

## 実装例

### 1. APIクライアントでの使用

```typescript
// src/lib/api-client.ts
import axios from 'axios'
import { env } from '@/config/env'
import { API_TIMEOUT } from '@/config/constants'

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 2. React Query設定での使用

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'
import { appConfig } from '@/config/app'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: appConfig.cacheTime,
      gcTime: appConfig.cacheTime * 2,
      retry: appConfig.enableLogging ? 1 : 3,
      refetchOnWindowFocus: !appConfig.enableDevTools,
    },
  },
})
```

### 3. コンポーネントでの使用

```typescript
// src/app/providers.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/react-query'
import { appConfig } from '@/config/app'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発環境でのみDevToolsを表示 */}
      {appConfig.enableDevTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
```

### 4. 機能フラグの使用

```typescript
// src/features/admin/components/admin-panel.tsx
import { isProduction } from '@/utils/env'

export const AdminPanel = () => {
  // 本番環境では表示しない
  if (isProduction) {
    return null
  }

  return (
    <div>
      <h2>管理者パネル（開発環境のみ）</h2>
      {/* 開発用の機能 */}
    </div>
  )
}
```

---

## ベストプラクティス

### 1. 環境変数は型安全に

```typescript
// ✅ Good: Zodでバリデーション
import { env } from '@/config/env'
const apiUrl = env.NEXT_PUBLIC_API_URL // 型安全

// ❌ Bad: 直接アクセス
const apiUrl = process.env.NEXT_PUBLIC_API_URL // string | undefined
```

### 2. 定数は一箇所で管理

```typescript
// ✅ Good: constants.tsで管理
import { DEFAULT_PAGE_SIZE } from '@/config/constants'

// ❌ Bad: ハードコード
const pageSize = 20
```

### 3. 環境別の設定を分離

```typescript
// ✅ Good: 環境別に設定を分ける
export const appConfig = getAppConfig()

// ❌ Bad: if文で分岐
if (process.env.NODE_ENV === 'production') {
  // ...
}
```

### 4. 機密情報は環境変数に

```typescript
// ✅ Good: 環境変数に保存
const apiKey = env.API_SECRET_KEY

// ❌ Bad: コードにハードコード
const apiKey = 'sk-1234567890abcdef' // 絶対にダメ！
```

### 5. .env.localをGitに含めない

```gitignore
# .gitignore
.env*.local
.env.local
```

### 6. 環境変数のサンプルファイルを用意

```bash
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_DEVTOOLS=true

# コピーして使用
# cp .env.example .env.local
```

---

## トラブルシューティング

### 環境変数が読み込まれない

1. **サーバーを再起動**
   ```bash
   # 環境変数を変更した場合は必ず再起動
   pnpm run dev
   ```

2. **`NEXT_PUBLIC_`プレフィックスを確認**
   ```typescript
   // クライアント側で使う場合は必須
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **ファイル名を確認**
   ```
   .env.local  ✅ 正しい
   .env-local  ❌ 間違い
   env.local   ❌ 間違い
   ```

### 型エラーが発生する

```typescript
// env.tsでパース時にエラーが表示される
// 環境変数が正しく設定されているか確認
console.log(process.env.NEXT_PUBLIC_API_URL)
```

---

## 環境変数の優先順位

Next.jsは以下の順序で環境変数を読み込みます（後のものが優先）：

1. `process.env`
2. `.env`
3. `.env.{environment}`（例: `.env.production`）
4. `.env.local`
5. `.env.{environment}.local`（例: `.env.production.local`）

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[環境構築ガイド](./01-setup.md)** - 開発環境のセットアップ
- **[REST API通信](./05-api-client.md)** - 環境変数を使ったAPI設定
- **[プロジェクト構成](./02-project-structure.md)** - configディレクトリの配置

### 外部リンク

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zod公式ドキュメント](https://zod.dev/)
- [bulletproof-react config](https://github.com/alan2207/bulletproof-react)
