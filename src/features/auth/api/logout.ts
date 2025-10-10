/**
 * ログアウトAPI
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 * TODO: サーバー側のセッション削除が必要な場合は実装してください
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@/lib/tanstack-query";

/**
 * ログアウトAPI呼び出し
 *
 * TODO: バックエンドでセッション管理している場合、'/auth/logout' エンドポイントを実装してください
 * TODO: JWTのみの場合、クライアント側でトークン削除のみで十分な場合もあります
 */
export const logout = (): Promise<void> => {
  // TODO: サーバー側のセッション削除が必要な場合は有効化
  // return api.post("/auth/logout");

  // クライアント側のみでトークン削除する場合
  return Promise.resolve();
};

type UseLogoutOptions = {
  mutationConfig?: MutationConfig<typeof logout>;
};

/**
 * ログアウトMutation Hook
 *
 * @example
 * ```tsx
 * import { useLogout } from '@/features/auth/api/logout'
 * import { useAuthStore } from '@/features/auth/stores/auth-store'
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
