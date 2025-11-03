// ================================================================================
// Imports
// ================================================================================

import { http, HttpResponse } from "msw";

import type { User } from "@/features/auth/stores/auth-store";

// ================================================================================
// モックデータ
// ================================================================================

/**
 * 開発モード用のモック認証データ
 *
 * MSWハンドラーとStorybookで使用されます
 */
export const MOCK_AUTH = {
  TOKEN: "mock-access-token-dev-12345",
  USER: {
    id: "dev-user-uuid",
    email: "dev.user@example.com",
    name: "Development User",
    azureOid: "dev-azure-oid-12345",
    roles: ["User"],
  } satisfies User,
} as const;

// ================================================================================
// MSWハンドラー
// ================================================================================

/**
 * Azure AD認証関連のMSWハンドラー
 *
 * 開発モードで使用するモックAPI
 */
export const authHandlers = [
  // ユーザー情報取得
  http.get("*/auth/me", ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    // Bearer Tokenのチェック
    if (!authHeader || !authHeader.includes("mock-access-token")) {
      return HttpResponse.json(
        {
          type: "https://api.example.com/problems/unauthorized",
          title: "Unauthorized",
          status: 401,
          detail: "Authentication is required to access this resource",
          instance: "/auth/me",
        },
        {
          status: 401,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    }

    return HttpResponse.json(MOCK_AUTH.USER);
  }),

  // ログアウト
  http.post("*/auth/logout", () => {
    return HttpResponse.json({ message: "Logged out successfully" });
  }),
];
