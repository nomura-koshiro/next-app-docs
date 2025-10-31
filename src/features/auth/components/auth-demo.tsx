// ================================================================================
// Imports
// ================================================================================

"use client";

import { useAuth } from "../hooks/use-auth";

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * 認証デモコンポーネント（Storybook専用）
 *
 * useAuthフックの動作を確認するためのデモコンポーネント。
 * 実際のアプリケーションでは使用せず、Storybookでの動作確認・テスト用途です。
 *
 * 機能:
 * - 認証状態の表示
 * - ユーザー情報の表示
 * - ログイン/ログアウト操作
 *
 * @returns 認証デモコンポーネント要素
 */
export const AuthDemo = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // ================================================================================
  // Render
  // ================================================================================
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">認証状態</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <span className="font-medium text-gray-700">認証状態:</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                isAuthenticated ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isAuthenticated ? "認証済み" : "未認証"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <span className="font-medium text-gray-700">ローディング:</span>
            <span className="text-sm text-gray-600">{isLoading ? "はい" : "いいえ"}</span>
          </div>
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">ユーザー情報</h2>

          <div className="space-y-3">
            <div className="flex flex-col rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-500">名前</span>
              <span className="mt-1 text-gray-900">{user.name}</span>
            </div>

            <div className="flex flex-col rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-500">メールアドレス</span>
              <span className="mt-1 text-gray-900">{user.email}</span>
            </div>

            <div className="flex flex-col rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-500">Azure OID</span>
              <span className="mt-1 font-mono text-sm text-gray-900">{user.azureOid}</span>
            </div>

            <div className="flex flex-col rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-500">ロール</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <span key={role} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">アクション</h2>

        <div className="flex gap-3">
          {!isAuthenticated ? (
            <button
              onClick={login}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ログイン
            </button>
          ) : (
            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              ログアウト
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          開発モード（AUTH_MODE=development）では、ログインボタンをクリックすると自動的にモックユーザーとして認証されます。
        </p>
      </div>
    </div>
  );
};
