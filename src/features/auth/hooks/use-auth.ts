// ================================================================================
// Imports
// ================================================================================

import { env } from "@/config/env";

// 開発環境用
import { useAuth as useDevelopmentAuth } from "./use-auth.development";
// 本番環境用
import { useAuth as useProductionAuth } from "./use-auth.production";

// ================================================================================
// Auth Hook Entry Point
// ================================================================================

/**
 * 環境変数に応じて適切な実装をエクスポートします。
 * - development: モック認証
 * - production: Azure AD認証（MSAL）
 */
export const useAuth = env.AUTH_MODE === "development" ? useDevelopmentAuth : useProductionAuth;
