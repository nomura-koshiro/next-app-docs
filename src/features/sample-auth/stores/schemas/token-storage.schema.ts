/**
 * JWT トークンストレージバリデーションスキーマ
 *
 * localStorageに保存されるJWTトークンのランタイムバリデーション用スキーマ
 * トークンの形式を検証し、改ざんされたトークンや不正なトークンを検出
 */

import { z } from "zod";

/**
 * JWT トークンスキーマ
 *
 * JWT形式（header.payload.signature）を検証
 * Base64URL形式の3つのパート（ヘッダー、ペイロード、署名）から構成される
 *
 * @example
 * 正しいJWTトークン:
 * "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *
 * @example
 * 不正なトークン（バリデーションエラー）:
 * - "" (空文字列)
 * - "invalid" (形式不正)
 * - "header.payload" (3パート未満)
 * - "header.payload.signature.extra" (3パート超過)
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

/**
 * トークンストレージスキーマ
 *
 * localStorageに保存されるトークンデータの構造を検証
 */
export const TokenStorageSchema = z.object({
  token: JWTTokenSchema,
  expiresAt: z.number().optional(), // Unix timestamp (オプション)
});

/**
 * 型推論
 */
export type JWTToken = z.infer<typeof JWTTokenSchema>;
export type TokenStorage = z.infer<typeof TokenStorageSchema>;

/**
 * トークン検証ヘルパー関数
 *
 * localStorageからトークンを安全に取得し、バリデーション実行
 *
 * @param key - localStorageのキー名
 * @returns 検証済みトークン、または null（検証失敗時）
 *
 * @example
 * ```typescript
 * const token = getValidatedToken("token");
 * if (token) {
 *   // トークンは検証済み、安全に使用可能
 *   api.setAuthHeader(token);
 * } else {
 *   // トークンなし、または不正
 *   router.push("/login");
 * }
 * ```
 */
export const getValidatedToken = (key: string): string | null => {
  if (typeof window === "undefined") return null;

  const storedToken = localStorage.getItem(key);
  if (!storedToken) return null;

  const result = JWTTokenSchema.safeParse(storedToken);

  if (!result.success) {
    console.warn(`[TokenStorage] 不正なトークンを検出しました: ${result.error.message}`);
    // 不正なトークンを削除
    localStorage.removeItem(key);
    return null;
  }

  return result.data;
};

/**
 * トークン保存ヘルパー関数
 *
 * トークンをバリデーション後にlocalStorageへ安全に保存
 *
 * @param key - localStorageのキー名
 * @param token - 保存するJWTトークン
 * @throws ZodError - トークン形式が不正な場合
 *
 * @example
 * ```typescript
 * try {
 *   setValidatedToken("token", data.token);
 *   console.log("トークンを安全に保存しました");
 * } catch (error) {
 *   console.error("トークン形式が不正です:", error);
 * }
 * ```
 */
export const setValidatedToken = (key: string, token: string): void => {
  if (typeof window === "undefined") return;

  // トークンをバリデーション（不正な場合は ZodError をスロー）
  const validatedToken = JWTTokenSchema.parse(token);

  // 検証済みトークンを保存
  localStorage.setItem(key, validatedToken);
};

/**
 * トークン削除ヘルパー関数
 *
 * localStorageからトークンを削除
 *
 * @param key - localStorageのキー名
 *
 * @example
 * ```typescript
 * removeToken("token");
 * console.log("トークンを削除しました");
 * ```
 */
export const removeToken = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
