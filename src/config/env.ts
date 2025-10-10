import * as z from "zod";

/**
 * 環境変数を検証して型安全に取得する
 *
 * @returns 検証済みの環境変数オブジェクト
 * @throws {Error} 必須の環境変数が不足している、または不正な値が設定されている場合
 */
const createEnv = () => {
  // Storybookポート番号を取得（Storybook環境でのみ設定される）
  const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT;

  // StorybookポートがあればAPI URLを動的に構築
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (storybookPort) {
    apiUrl = `http://localhost:${storybookPort}/api/v1`;
    console.log('[env] Storybook port detected:', storybookPort);
    console.log('[env] API_URL overridden to:', apiUrl);
  }

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
    // Storybookポート番号（オプション、Storybook環境でのみ設定される）
    STORYBOOK_PORT: z.string().optional(),
  });

  // Next.jsの環境変数から値を取得
  const envVars = {
    API_URL: apiUrl,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
    STORYBOOK_PORT: storybookPort,
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
