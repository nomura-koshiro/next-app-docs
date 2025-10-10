import * as z from "zod";

/**
 * 環境変数を検証して型安全に取得する
 *
 * @returns 検証済みの環境変数オブジェクト
 * @throws {Error} 必須の環境変数が不足している、または不正な値が設定されている場合
 */
const createEnv = () => {
  // 環境変数のスキーマ定義
  const EnvSchema = z.object({
    // APIエンドポイントURL（必須、例: http://localhost:3000/api/v1）
    API_URL: z.string(),
    // MSWモックAPIの有効/無効フラグ（オプション）
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .optional(),
    // アプリケーションURL（オプション、デフォルト: http://localhost:3000）
    APP_URL: z.string().optional().default("http://localhost:3000"),
    // モックAPIポート番号（オプション、デフォルト: 8080）
    APP_MOCK_API_PORT: z.string().optional().default("8080"),
  });

  // Next.jsの環境変数から値を取得
  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
  };

  // スキーマで検証
  const parsedEnv = EnvSchema.safeParse(envVars);

  // 検証失敗時はエラーメッセージを出力
  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n")}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

/**
 * 型安全な環境変数オブジェクト
 *
 * @example
 * import { env } from '@/config/env';
 *
 * const apiUrl = env.API_URL;
 * const isMocking = env.ENABLE_API_MOCKING;
 */
export const env = createEnv();
