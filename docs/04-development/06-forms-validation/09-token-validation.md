# トークンバリデーション

JWTトークンとCSRFトークンのZodバリデーション実装ガイド

---

## 概要

トークン（JWT、CSRF）は認証・認可・セキュリティの要です。しかし、不正なトークンや改ざんされたトークンをアプリケーションが受け入れると、重大なセキュリティ問題が発生します。

このガイドでは、Zodスキーマを使用してトークンを検証し、不正なトークンを自動的に検出・削除する方法を説明します。

---

## JWT トークンバリデーション

### JWT形式とは

JWTトークンは3つのパート（ヘッダー、ペイロード、署名）から構成されます:

```
header.payload.signature
```

**正しいJWTトークンの例**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### JWT トークンスキーマ

**ファイルパス**: `src/features/sample-auth/stores/schemas/token-storage.schema.ts`

```typescript
import { z } from "zod";

/**
 * JWT トークンスキーマ
 *
 * 検証内容:
 * 1. 空文字列でないこと
 * 2. 3つのパート（header.payload.signature）から構成されること
 * 3. 各パートが空でないこと
 */
export const JWTTokenSchema = z
  .string()
  .min(1, "トークンは必須です")
  .regex(
    /^[\w-]+\.[\w-]+\.[\w-]+$/,
    "不正なJWTトークン形式です。正しい形式: header.payload.signature"
  )
  .refine(
    (token) => {
      // 3つのパートに分割できることを確認
      const parts = token.split(".");
      return parts.length === 3 && parts.every((part) => part.length > 0);
    },
    {
      message: "JWTトークンは3つの非空パート（header.payload.signature）で構成される必要があります",
    }
  );
```

### ヘルパー関数

#### トークンを安全に保存

```typescript
import { setValidatedToken } from "@/features/sample-auth/stores/schemas/token-storage.schema";

// ログイン成功時
try {
  setValidatedToken("token", data.token);
  console.log("トークンを安全に保存しました");
  router.push("/users");
} catch (error) {
  console.error("トークンバリデーションエラー:", error);
  setError("root", {
    message: "サーバーから不正なトークンが返されました。管理者に連絡してください。",
  });
}
```

#### トークンを安全に取得

```typescript
import { getValidatedToken } from "@/features/sample-auth/stores/schemas/token-storage.schema";

// APIリクエスト前
const token = getValidatedToken("token");
if (token) {
  // ✅ トークンは検証済み、安全に使用可能
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} else {
  // ❌ トークンなし、または不正
  router.push("/login");
}
```

#### トークンを削除

```typescript
import { removeToken } from "@/features/sample-auth/stores/schemas/token-storage.schema";

// ログアウト時
removeToken("token");
console.log("トークンを削除しました");
```

### 実装例: ログインフック

**ファイルパス**: `src/features/sample-auth/routes/sample-login/login.hook.ts`

```typescript
import { setValidatedToken } from "@/features/sample-auth/stores/schemas/token-storage.schema";

const onSubmit = handleSubmit(async (values: LoginFormValues) => {
  await loginMutation
    .mutateAsync(values)
    .then((data) => {
      try {
        // ✅ トークンをバリデーション後にlocalStorageに保存
        setValidatedToken("token", data.token);

        // ユーザー情報をZustandストアに保存
        setUser(data.user);

        // ユーザー一覧ページへ遷移
        router.push("/users");
      } catch (error) {
        // トークン形式が不正な場合
        console.error("トークンバリデーションエラー:", error);
        setError("root", {
          message: "サーバーから不正なトークンが返されました。管理者に連絡してください。",
        });
      }
    })
    .catch(() => {
      setError("root", {
        message: "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
      });
    });
});
```

---

## CSRF トークンバリデーション

### CSRF形式とは

CSRFトークンは、Cross-Site Request Forgery攻撃を防ぐためのランダムな文字列です。通常、以下の要件を満たします:

- 最小長: 8文字以上
- 許可文字: 英数字、ハイフン (`-`)、アンダースコア (`_`)

**正しいCSRFトークンの例**:
```
abc123def456ghi789
csrf_token_1234567890
a1b2-c3d4-e5f6-g7h8
```

### CSRF トークンスキーマ

**ファイルパス**: `src/lib/schemas/csrf-token.schema.ts`

```typescript
import { z } from "zod";

/**
 * CSRF トークンスキーマ
 *
 * 検証内容:
 * 1. 空文字列でないこと
 * 2. 前後の空白を削除
 * 3. 最小長8文字
 * 4. 英数字、ハイフン、アンダースコアのみ
 */
export const CsrfTokenSchema = z
  .string()
  .min(1, "CSRFトークンは必須です")
  .trim() // 前後の空白を削除
  .min(8, "CSRFトークンは8文字以上である必要があります")
  .regex(
    /^[\w-]+$/,
    "CSRFトークンは英数字、ハイフン、アンダースコアのみを含む必要があります"
  );
```

### CSRF トークン取得時の自動バリデーション

**ファイルパス**: `src/lib/csrf.ts`

```typescript
import { CsrfTokenSchema } from "./schemas/csrf-token.schema";

/**
 * CSRFトークンを取得し、バリデーション実行
 *
 * @returns 検証済みCSRFトークン、または null（トークンなし/不正な場合）
 */
export const getCsrfToken = (): string | null => {
  const rawToken = getCookie(CSRF_COOKIE_NAME);
  if (!rawToken) return null;

  // ✅ Zodスキーマでバリデーション
  const result = CsrfTokenSchema.safeParse(rawToken);

  if (!result.success) {
    console.warn(`[CSRF] 不正なCSRFトークンを検出しました: ${result.error.message}`);
    return null;
  }

  return result.data;
};
```

### API クライアントでの使用

**ファイルパス**: `src/lib/api-client.ts`

```typescript
const authRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (config.headers !== undefined) {
    // CSRFトークンをヘッダーに追加
    const csrfToken = getCsrfToken();
    if (csrfToken !== null) {
      // ✅ トークンは検証済み、安全に使用可能
      config.headers[getCsrfHeaderName()] = csrfToken;
    }
  }

  return config;
};
```

---

## セキュリティメリット

### 1. 不正トークンの自動検出

**JWT の場合**:
- 形式不正（3パート未満・超過）
- 空のパート
- 不正な文字列

**CSRF の場合**:
- 長さ不足（8文字未満）
- 不正な文字種

### 2. 不正トークンの自動削除

```typescript
// JWT トークン
const token = getValidatedToken("token");
if (!token) {
  // 不正なトークンは自動削除済み
  router.push("/login");
}

// CSRF トークン
const csrfToken = getCsrfToken();
if (!csrfToken) {
  // 不正なトークンはヘッダーに追加されない
}
```

### 3. 明示的なエラーメッセージ

```typescript
// 開発者向けログ
console.warn("[CSRF] 不正なCSRFトークンを検出しました: 8文字以上必要です");

// ユーザー向けメッセージ
setError("root", {
  message: "サーバーから不正なトークンが返されました。管理者に連絡してください。",
});
```

---

## ベストプラクティス

### ✅ DO: safeParse()を使用

```typescript
const result = JWTTokenSchema.safeParse(token);
if (!result.success) {
  console.warn("バリデーションエラー:", result.error);
  return null;
}
return result.data;
```

### ❌ DON'T: parse()を直接使用（try-catchなし）

```typescript
// ❌ エラーハンドリングなし
return JWTTokenSchema.parse(token); // ZodErrorがスローされる可能性
```

### ✅ DO: 不正トークンをログ出力

```typescript
if (!result.success) {
  console.warn(`[TokenValidation] 不正なトークンを検出: ${result.error.message}`);
  localStorage.removeItem("token");
}
```

### ❌ DON'T: 機微情報をログ出力

```typescript
// ❌ トークン本体をログ出力しない
console.log(`トークン内容: ${token}`); // セキュリティリスク
```

---

## トラブルシューティング

### エラー: "不正なJWTトークン形式です"

**原因**: トークンが3パート構成ではない

**解決策**:
1. サーバーからのレスポンスを確認
2. トークンが正しくBase64URLエンコードされているか確認
3. ネットワークエラーでトークンが破損していないか確認

### エラー: "CSRFトークンは8文字以上である必要があります"

**原因**: トークンの長さが不足

**解決策**:
1. サーバー側のCSRFトークン生成ロジックを確認
2. 最小32文字以上を推奨
3. セキュアなランダム文字列生成を使用

---

## 関連ドキュメント

- [環境変数バリデーション](../../03-core-concepts/05-environment-variables.md)
- [APIレスポンスバリデーション](./04-api-response-validation.md)
- [状態管理とバリデーション](../../03-core-concepts/02-state-management.md)
- [APIクライアント](../../03-core-concepts/06-api-client.md)
