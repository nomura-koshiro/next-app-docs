/**
 * 現在のユーザー情報取得API
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";
import type { User } from "../types";

/**
 * 現在のユーザー情報を取得
 *
 * TODO: 実際のAPIエンドポイント '/auth/me' または '/users/me' を実装してください
 * TODO: JWTトークンがヘッダーに自動的に含まれることを確認してください（api-client.tsで設定）
 */
export const getUser = (): Promise<{ data: User }> => {
  // TODO: 実際のAPI呼び出しに置き換える
  return api.get("/auth/me");

  // モック実装（テスト用）
  // return Promise.resolve({
  //   data: {
  //     id: "1",
  //     email: "user@example.com",
  //     name: "Sample User",
  //     role: "user",
  //   },
  // });
};

/**
 * ユーザー情報のクエリオプション
 */
export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth-user"],
    queryFn: getUser,
  });
};

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

/**
 * 現在のユーザー情報を取得するHook
 *
 * @example
 * ```tsx
 * import { useUser } from '@/features/auth/api/get-user'
 *
 * function UserProfile() {
 *   const { data, isLoading, error } = useUser()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error loading user</div>
 *
 *   return (
 *     <div>
 *       <h1>{data?.data.name}</h1>
 *       <p>{data?.data.email}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  return useQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
  });
};
