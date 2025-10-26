# 環境変数管理 (env.ts)

このドキュメントでは、env.tsを使用した型安全な環境変数管理について説明します。Zodによるバリデーション、起動時の自動チェック、型変換など、環境変数を安全に扱うための実装方法を理解できます。

## 目次

1. [なぜenv.tsが必要か？](#なぜenvtsが必要か)
2. [実装](#実装)
3. [.env.localの設定](#envlocalの設定)
4. [使用方法](#使用方法)
5. [エラーハンドリング](#エラーハンドリング)
6. [新しい環境変数の追加](#新しい環境変数の追加)
7. [ベストプラクティス](#ベストプラクティス)

---

## なぜenv.tsが必要か？

| 問題 | 解決 |
|------|------|
| `process.env.*`は型が`string \| undefined` | ✅ 明示的な型定義 |
| 必須変数が未定義でも実行時まで気づかない | ✅ 起動時に自動チェック |
| boolean/numberへの変換が必要 | ✅ 自動型変換 |
| 不正な値が設定されていてもエラーにならない | ✅ Zodでバリデーション |

---

## 実装

```typescript
// src/config/env.ts
import * as z from 'zod'

const createEnv = () => {
  // Storybookポート番号を取得（Storybook環境でのみ設定される）
  const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT;

  // StorybookポートがあればAPI URLを動的に構築
  const apiUrl = storybookPort
    ? `http://localhost:${storybookPort}/api/v1`
    : process.env.NEXT_PUBLIC_API_URL;

  if (storybookPort) {
    console.log('[env] Storybook port detected:', storybookPort);
    console.log('[env] API_URL overridden to:', apiUrl);
  }

  // スキーマ定義
  const EnvSchema = z.object({
    // 必須の環境変数
    API_URL: z.string(),

    // オプションのboolean（自動変換）
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),

    // デフォルト値付き
    APP_URL: z.string().optional().default('http://localhost:3000'),
    APP_MOCK_API_PORT: z.string().optional().default('8080'),

    // Storybookポート番号（オプション、Storybook環境でのみ設定される）
    STORYBOOK_PORT: z.string().optional(),
  })

  // 環境変数を取得
  const envVars = {
    API_URL: apiUrl,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
    STORYBOOK_PORT: storybookPort,
  }

  // 検証
  const parsedEnv = EnvSchema.safeParse(envVars)

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `
    )
  }

  return parsedEnv.data
}

export const env = createEnv()
```

---

## .env.localの設定

```bash
# .env.local

# API設定（必須）
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# MSW設定（オプション）
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# アプリ設定（オプション、デフォルト値あり）
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_API_PORT=8080

# Storybook設定（オプション、Storybookでのみ使用）
# Storybookポート番号を指定すると、API URLが自動的に上書きされます
# 例: http://localhost:6006/api/v1
NEXT_PUBLIC_STORYBOOK_PORT=6006
```

---

## 使用方法

### APIクライアントで使用

```typescript
import { env } from '@/config/env'

export const api = Axios.create({
  baseURL: env.API_URL,  // 型安全: string
})
```

### boolean値の使用

```typescript
import { env } from '@/config/env'

if (env.ENABLE_API_MOCKING) {  // boolean | undefined
  const { worker } = await import('@/mocks/browser')
  await worker.start()
}
```

### Storybookポートの自動検出

Storybook環境では、`NEXT_PUBLIC_STORYBOOK_PORT`を設定することでAPI URLが自動的に上書きされます。

```typescript
import { env } from '@/config/env'

// NEXT_PUBLIC_STORYBOOK_PORT=6006 の場合
// env.API_URL は "http://localhost:6006/api/v1" に自動変更される
```

**動作:**

1. `NEXT_PUBLIC_STORYBOOK_PORT`が設定されている場合
2. `API_URL`が `http://localhost:${STORYBOOK_PORT}/api/v1` に自動上書き
3. コンソールにログが出力される

```text
[env] Storybook port detected: 6006
[env] API_URL overridden to: http://localhost:6006/api/v1
```

**利点:**

- StorybookでMSWを使用する際、ポート番号を自動検出
- `.env.local`のAPI_URLを手動で変更する必要がない
- 開発環境とStorybook環境でシームレスに切り替え可能

---

## エラーハンドリング

### 必須変数が未定義の場合

```bash
# NEXT_PUBLIC_API_URLがない場合
npm run dev
```

**エラー出力:**

```text
Error: Invalid env provided.
  The following variables are missing or invalid:
  - API_URL: Required
```

### 不正な値が設定されている場合

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=yes  # 'true' か 'false' のみ
```

**エラー出力:**

```text
Error: Invalid env provided.
  The following variables are missing or invalid:
  - ENABLE_API_MOCKING: Invalid input
```

---

## 新しい環境変数の追加

### 1. スキーマに追加

```typescript
const EnvSchema = z.object({
  API_URL: z.string(),

  // 新規追加
  NEW_FEATURE_ENABLED: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional(),
})
```

### 2. envVarsに追加

```typescript
const envVars = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEW_FEATURE_ENABLED: process.env.NEXT_PUBLIC_NEW_FEATURE_ENABLED,
}
```

### 3. .env.localに追加

```bash
NEXT_PUBLIC_NEW_FEATURE_ENABLED=true
```

### 4. 使用

```typescript
import { env } from '@/config/env'

if (env.NEW_FEATURE_ENABLED) {
  // 新機能を有効化
}
```

---

## ベストプラクティス

### ✅ Good

```typescript
// 型安全で、バリデーション済み
import { env } from '@/config/env'
const apiUrl = env.API_URL
```

### ❌ Bad

```typescript
// 型安全性がなく、バリデーションもない
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

---

## 参考リンク

- [Next.js - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zod](https://zod.dev/)
