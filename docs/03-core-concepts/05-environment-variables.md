# 環境変数管理 (env.ts)

このドキュメントでは、env.tsを使用した型安全な環境変数管理について説明します。Zodによるバリデーション、起動時の自動チェック、型変換など、環境変数を安全に扱うための実装方法を理解できます。

## 目次

1. [なぜenv.tsが必要か？](#なぜenvtsが必要か)
2. [セキュリティ上の重要性](#セキュリティ上の重要性)
3. [実装](#実装)
4. [.env.localの設定](#envlocalの設定)
5. [使用方法](#使用方法)
6. [エラーハンドリング](#エラーハンドリング)
7. [新しい環境変数の追加](#新しい環境変数の追加)
8. [セキュリティベストプラクティス](#セキュリティベストプラクティス)
9. [ベストプラクティス](#ベストプラクティス)

---

## なぜenv.tsが必要か？

| 問題                                       | 解決                    |
| ------------------------------------------ | ----------------------- |
| `process.env.*`は型が`string \| undefined` | ✅ 明示的な型定義       |
| 必須変数が未定義でも実行時まで気づかない   | ✅ 起動時に自動チェック |
| boolean/numberへの変換が必要               | ✅ 自動型変換           |
| 不正な値が設定されていてもエラーにならない | ✅ Zodでバリデーション  |

---

## セキュリティ上の重要性

### なぜ環境変数のバリデーションが重要か

環境変数は**外部から注入される設定値**であり、以下のセキュリティリスクがあります:

| リスク | 説明 | 影響 |
|--------|------|------|
| **不正なAPI URL** | 攻撃者が悪意のあるAPIエンドポイントを設定 | データ漏洩、認証情報の窃取 |
| **型不一致** | boolean期待の変数に任意文字列が設定 | アプリケーションクラッシュ |
| **必須変数の欠落** | 重要な設定が未定義のまま起動 | 予期しない動作、セキュリティ機能の無効化 |
| **不正な形式** | URLや数値に不正な形式の値が設定 | インジェクション攻撃、予期しない動作 |

### Zodバリデーションによる防御

```typescript
// ❌ バリデーションなし（セキュリティリスク）
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // string | undefined
// - 未定義でもエラーにならない
// - 不正なURL形式でも通過
// - 攻撃者が任意のURLを設定可能

// ✅ Zodバリデーション（安全）
const EnvSchema = z.object({
  API_URL: z.string().url("有効なURL形式である必要があります"), // ✅ URL形式検証
});

const env = EnvSchema.parse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
});
// ✅ 未定義の場合は起動時にエラー
// ✅ 不正なURL形式は拒否
// ✅ 型安全な値のみ使用可能
```

### 攻撃シナリオと防御

#### シナリオ1: 悪意のあるAPI URL注入

**攻撃**:
```bash
# 攻撃者が環境変数を操作
NEXT_PUBLIC_API_URL=https://attacker.com/api/v1
```

**結果 (バリデーションなし)**:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// → "https://attacker.com/api/v1"
// → すべてのAPIリクエストが攻撃者サーバーに送信される
// → 認証情報、個人情報が漏洩
```

**防御 (Zodバリデーション)**:
```typescript
const EnvSchema = z.object({
  API_URL: z
    .string()
    .url()
    .refine(
      (url) => url.startsWith("https://api.example.com") || url.startsWith("http://localhost"),
      "API URLは許可されたドメインのみ設定可能です"
    ),
});

// ✅ 不正なドメインは起動時に検出・拒否される
```

#### シナリオ2: boolean型の改ざん

**攻撃**:
```bash
# 攻撃者がセキュリティ機能を無効化
NEXT_PUBLIC_ENABLE_CSRF_PROTECTION=false
```

**結果 (バリデーションなし)**:
```typescript
const csrfEnabled = process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION === "true";
// → false
// → CSRF保護が無効化される
// → CSRF攻撃に脆弱になる
```

**防御 (デフォルト値 + Zodバリデーション)**:
```typescript
const EnvSchema = z.object({
  ENABLE_CSRF_PROTECTION: z
    .string()
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true")
    .default("true"), // ✅ デフォルトで有効
});

// ✅ 環境変数が未設定でもCSRF保護は有効
// ✅ "false"以外の値は拒否される
```

#### シナリオ3: 数値の不正設定

**攻撃**:
```bash
# 攻撃者が不正なポート番号を設定
NEXT_PUBLIC_PORT=99999999
```

**結果 (バリデーションなし)**:
```typescript
const port = parseInt(process.env.NEXT_PUBLIC_PORT!);
// → 99999999 (有効なポート範囲外)
// → アプリケーションが起動失敗
```

**防御 (Zodバリデーション)**:
```typescript
const EnvSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535)), // ✅ 有効なポート範囲のみ
});

// ✅ 不正なポート番号は起動時に検出・拒否
```

### セキュリティメリットのまとめ

| セキュリティ機能 | 効果 |
|-----------------|------|
| **起動時バリデーション** | 不正な設定でアプリが起動しない |
| **URL形式検証** | 悪意のあるエンドポイントへの接続を防止 |
| **ドメインホワイトリスト** | 許可されたドメインのみ使用可能 |
| **型検証** | 型不一致によるクラッシュを防止 |
| **デフォルト値** | セキュリティ機能のデフォルト有効化 |
| **範囲検証** | 不正な数値範囲を拒否 |

---

## 実装

```typescript
// src/config/env.ts
import * as z from 'zod';

const createEnv = () => {
  // Storybookポート番号を取得（Storybook環境でのみ設定される）
  const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT;

  // StorybookポートがあればAPI URLを動的に構築
  const apiUrl = storybookPort ? `http://localhost:${storybookPort}/api/v1` : process.env.NEXT_PUBLIC_API_URL;

  if (storybookPort) {
    console.log('[env] Storybook port detected:', storybookPort);
    console.log('[env] API_URL overridden to:', apiUrl);
  }

  // Schemas定義
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
  });

  // 環境変数を取得
  const envVars = {
    API_URL: apiUrl,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
    STORYBOOK_PORT: storybookPort,
  };

  // 検証
  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
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
import { env } from '@/config/env';

export const api = Axios.create({
  baseURL: env.API_URL, // 型安全: string
});
```

### boolean値の使用

```typescript
import { env } from '@/config/env';

if (env.ENABLE_API_MOCKING) {
  // boolean | undefined
  const { worker } = await import('@/mocks/browser');
  await worker.start();
}
```

### Storybookポートの自動検出

Storybook環境では、`NEXT_PUBLIC_STORYBOOK_PORT`を設定することでAPI URLが自動的に上書きされます。

```typescript
import { env } from '@/config/env';

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
});
```

### 2. envVarsに追加

```typescript
const envVars = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEW_FEATURE_ENABLED: process.env.NEXT_PUBLIC_NEW_FEATURE_ENABLED,
};
```

### 3. .env.localに追加

```bash
NEXT_PUBLIC_NEW_FEATURE_ENABLED=true
```

### 4. 使用

```typescript
import { env } from '@/config/env';

if (env.NEW_FEATURE_ENABLED) {
  // 新機能を有効化
}
```

---

## セキュリティベストプラクティス

### ✅ DO: URL形式とドメインを検証

```typescript
// ✅ URL形式検証 + ドメインホワイトリスト
const EnvSchema = z.object({
  API_URL: z
    .string()
    .url("有効なURL形式である必要があります")
    .refine(
      (url) =>
        url.startsWith("https://api.example.com") ||
        url.startsWith("http://localhost") ||
        url.startsWith("http://127.0.0.1"),
      "API URLは許可されたドメインのみ設定可能です"
    ),
});
```

### ❌ DON'T: 任意のURLを許可

```typescript
// ❌ 任意のURLを許可（セキュリティリスク）
const EnvSchema = z.object({
  API_URL: z.string(), // 任意の文字列
});
```

### ✅ DO: セキュリティ機能はデフォルトで有効化

```typescript
// ✅ CSRF保護はデフォルトで有効
const EnvSchema = z.object({
  ENABLE_CSRF_PROTECTION: z
    .string()
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true")
    .default("true"), // ✅ デフォルトで有効
});
```

### ❌ DON'T: セキュリティ機能を簡単に無効化可能にしない

```typescript
// ❌ デフォルトで無効（セキュリティリスク）
const EnvSchema = z.object({
  ENABLE_CSRF_PROTECTION: z
    .string()
    .optional()
    .default("false"), // ❌ デフォルトで無効
});
```

### ✅ DO: 本番環境では厳格な検証

```typescript
// ✅ 本番環境では HTTPSを強制
const EnvSchema = z.object({
  API_URL: z
    .string()
    .url()
    .refine(
      (url) => {
        // 本番環境ではHTTPSのみ許可
        if (process.env.NODE_ENV === "production") {
          return url.startsWith("https://");
        }
        // 開発環境ではlocalhostのHTTPも許可
        return url.startsWith("https://") || url.startsWith("http://localhost");
      },
      "本番環境ではHTTPS URLが必須です"
    ),
});
```

### ❌ DON'T: 本番環境でHTTPを許可

```typescript
// ❌ 本番環境でもHTTPを許可（セキュリティリスク）
const EnvSchema = z.object({
  API_URL: z.string().url(), // HTTPも許可される
});
```

### ✅ DO: 機密情報は NEXT_PUBLIC_ プレフィックスなし

```typescript
// ✅ サーバーサイド専用（ブラウザに公開されない）
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(), // ✅ NEXT_PUBLIC_ なし
  API_SECRET_KEY: z.string().min(32), // ✅ NEXT_PUBLIC_ なし
});

// サーバーサイドのみで使用
// src/lib/db.ts (Server Component)
import { env } from '@/config/env';
const db = new Database(env.DATABASE_URL);
```

### ❌ DON'T: 機密情報を NEXT_PUBLIC_ プレフィックス付きで公開

```typescript
// ❌ ブラウザに機密情報が公開される（重大なセキュリティリスク）
const EnvSchema = z.object({
  NEXT_PUBLIC_DATABASE_URL: z.string().url(), // ❌ ブラウザに公開
  NEXT_PUBLIC_API_SECRET_KEY: z.string(), // ❌ ブラウザに公開
});
```

### ✅ DO: 数値範囲を制限

```typescript
// ✅ 有効な範囲のみ許可
const EnvSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535)), // ✅ 有効なポート範囲

  MAX_FILE_SIZE: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100)), // ✅ 1MB〜100MB
});
```

### ❌ DON'T: 無制限の数値を許可

```typescript
// ❌ 任意の数値を許可（セキュリティリスク）
const EnvSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)), // 範囲制限なし
  MAX_FILE_SIZE: z.number(), // 無制限
});
```

### ✅ DO: enum で選択肢を制限

```typescript
// ✅ 許可された値のみ
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  AUTH_MODE: z.enum(["development", "production"]),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]),
});
```

### ❌ DON'T: 任意の文字列を許可

```typescript
// ❌ 任意の文字列を許可（予期しない動作の原因）
const EnvSchema = z.object({
  NODE_ENV: z.string(), // 任意の文字列
  AUTH_MODE: z.string(), // 任意の文字列
});
```

### 機密情報管理のチェックリスト

- [ ] データベース接続文字列は `NEXT_PUBLIC_` なしで定義
- [ ] APIシークレットキーは `NEXT_PUBLIC_` なしで定義
- [ ] 暗号化キーは `NEXT_PUBLIC_` なしで定義
- [ ] OAuth クライアントシークレットは `NEXT_PUBLIC_` なしで定義
- [ ] 本番環境では HTTPS URL のみ許可
- [ ] セキュリティ機能はデフォルトで有効化
- [ ] 数値範囲は適切に制限
- [ ] 選択肢は enum で制限

---

## ベストプラクティス

### ✅ Good

```typescript
// 型安全で、バリデーション済み
import { env } from '@/config/env';
const apiUrl = env.API_URL;
```

### ❌ Bad

```typescript
// 型安全性がなく、バリデーションもない
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 参考リンク

### 外部リソース
- [Next.js - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zod公式ドキュメント](https://zod.dev/)

### 関連ドキュメント
- [Zodによるセキュリティ強化ガイド](../04-development/01-coding-standards/10-security-with-zod.md)
- [トークンバリデーション](../04-development/06-forms-validation/09-token-validation.md)
- [APIレスポンスバリデーション](../04-development/06-forms-validation/04-api-response-validation.md)
- [状態管理とZodバリデーション](./02-state-management.md#永続化とzodバリデーション)
- [APIクライアント](./06-api-client.md)
