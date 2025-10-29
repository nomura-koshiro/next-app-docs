// ================================================================================
// Imports
// ================================================================================

import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/tanstack-query';

import type { User } from '../stores/auth-store';

// ================================================================================
// 型定義
// ================================================================================

type UseGetMeOptions = {
  /** TanStack Queryの設定 */
  queryConfig?: QueryConfig<typeof getMeQueryOptions>;
  /** クエリを有効にするかどうか（デフォルト: true） */
  enabled?: boolean;
};

// ================================================================================
// API関数
// ================================================================================

/**
 * 認証済みユーザー情報を取得
 *
 * @returns ユーザー情報
 */
export const getMe = (): Promise<User> => {
  return api.get('/auth/me');
};

/**
 * 認証済みユーザー情報取得のクエリオプション
 *
 * @returns クエリオプション
 */
export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
  });
};

/**
 * 認証済みユーザー情報を取得するフック
 *
 * 注意: このフックは意図的に`useQuery`を使用しており、`useSuspenseQuery`ではありません。
 *
 * 理由:
 * - 条件付きフェッチ（`enabled`オプション）が必要
 * - ログイン前（アカウントなし）の状態ではユーザー情報を取得しない
 * - `useSuspenseQuery`は`enabled`オプションをサポートしていない
 * - `isLoading`状態を手動で管理し、ログインページや保護されたレイアウトでローディング表示を行う
 *
 * 使用例:
 * ```tsx
 * const { data: userData, isLoading } = useGetMe({
 *   enabled: accounts.length > 0, // アカウントがある場合のみフェッチ
 * });
 * ```
 *
 * @param options - クエリオプション
 * @param options.queryConfig - TanStack Queryの設定
 * @param options.enabled - クエリを有効にするかどうか（デフォルト: true）
 * @returns ユーザー情報のクエリ結果
 */
export const useGetMe = ({ queryConfig, enabled = true }: UseGetMeOptions = {}) => {
  return useQuery({
    ...getMeQueryOptions(),
    enabled,
    ...queryConfig,
  });
};
