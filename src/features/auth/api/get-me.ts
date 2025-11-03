// ================================================================================
// Imports
// ================================================================================

import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { User } from "./schemas/user-response.schema";
import { UserSchema } from "./schemas/user-response.schema";

// ================================================================================
// 型定義
// ================================================================================

type UseGetMeOptions = {
  queryConfig?: QueryConfig<typeof getMeQueryOptions>;
  enabled?: boolean;
};

// ================================================================================
// API関数
// ================================================================================

export const getMe = async (): Promise<User> => {
  const response = await api.get("/auth/me");

  return UserSchema.parse(response);
};

export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth", "me"],
    queryFn: getMe,
  });
};

/**
 * 注意: このフックは意図的に`useQuery`を使用しており、`useSuspenseQuery`ではありません。
 *
 * 理由:
 * - 条件付きフェッチ（`enabled`オプション）が必要
 * - ログイン前（アカウントなし）の状態ではユーザー情報を取得しない
 * - `useSuspenseQuery`は`enabled`オプションをサポートしていない
 * - `isLoading`状態を手動で管理し、ログインページや保護されたレイアウトでローディング表示を行う
 *
 * @example
 * ```tsx
 * const { data: userData, isLoading } = useGetMe({
 *   enabled: accounts.length > 0, // アカウントがある場合のみフェッチ
 * });
 * ```
 */
export const useGetMe = ({ queryConfig, enabled = true }: UseGetMeOptions = {}) => {
  return useQuery({
    ...getMeQueryOptions(),
    enabled,
    ...queryConfig,
  });
};
