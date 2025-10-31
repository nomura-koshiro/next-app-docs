/**
 * ログアウトAPI
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 * TODO: サーバー側のセッション削除が必要な場合は実装してください
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@/lib/tanstack-query";

// ================================================================================
// API関数
// ================================================================================

/**
 * ログアウトAPI呼び出し
 *
 * エンドポイント: POST /api/v1/sample/auth/logout
 * TODO: バックエンドでセッション管理している場合、エンドポイントを実装してください
 * TODO: JWTのみの場合、クライアント側でトークン削除のみで十分な場合もあります
 *
 * @returns void（ログアウト完了）
 *
 * @example
 * ```tsx
 * await logout();
 * ```
 */
export const logout = (): Promise<void> => {
  // TODO: サーバー側のセッション削除が必要な場合は有効化
  // return api.post("/sample/auth/logout");

  // クライアント側のみでトークン削除する場合
  return Promise.resolve();
};

// ================================================================================
// Hooks
// ================================================================================

type UseLogoutOptions = {
  mutationConfig?: MutationConfig<typeof logout>;
};

/**
 * ログアウトMutation Hook
 *
 * ミューテーション成功時に以下の処理を実行:
 * - 全てのクエリキャッシュをクリア（ユーザー情報などを削除）
 *
 * @param options - フックオプション
 * @param options.mutationConfig - React Queryのミューテーション設定
 * @returns ログアウトミューテーションオブジェクト
 *
 * @example
 * ```tsx
 * import { useLogout } from '@/features/sample-auth/api/logout'
 * import { useAuthStore } from '@/features/sample-auth/stores/auth-store'
 * import { useRouter } from 'next/navigation'
 *
 * function LogoutButton() {
 *   const router = useRouter()
 *   const clearAuth = useAuthStore((state) => state.logout)
 *   const logoutMutation = useLogout({
 *     mutationConfig: {
 *       onSuccess: () => {
 *         // JWTトークンを削除
 *         localStorage.removeItem('token')
 *         // Zustandストアをクリア
 *         clearAuth()
 *         // ログインページへリダイレクト
 *         router.push('/auth/login')
 *       },
 *     },
 *   })
 *
 *   return (
 *     <button onClick={() => logoutMutation.mutate()}>
 *       Logout
 *     </button>
 *   )
 * }
 * ```
 */
export const useLogout = ({ mutationConfig }: UseLogoutOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // 全てのクエリキャッシュをクリア（ユーザー情報などを削除）
      queryClient.clear();

      // TODO: 必要に応じてグローバルな成功処理を追加
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: logout,
  });
};
