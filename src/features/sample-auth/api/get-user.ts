/**
 * 現在のユーザー情報取得API
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { GetUserOutput } from "../types/api";
import { getUserOutputSchema } from "../types/api";

// ================================================================================
// API関数
// ================================================================================

/**
 * 現在のユーザー情報を取得
 *
 * エンドポイント: GET /api/v1/sample/auth/me
 * TODO: JWTトークンがヘッダーに自動的に含まれることを確認してください（api-client.tsで設定）
 *
 * @returns ユーザー情報を含むレスポンス
 *
 * @example
 * ```tsx
 * const response = await getUser();
 * console.log(response.data);
 * ```
 */
export const getUser = async (): Promise<GetUserOutput> => {
  const response = await api.get("/api/v1/sample/auth/me");

  return getUserOutputSchema.parse(response);
};

/**
 * ユーザー情報のクエリオプション
 *
 * @returns React Queryのクエリオプション
 *
 * @example
 * ```tsx
 * const queryOptions = getUserQueryOptions();
 * ```
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
 * ユーザー情報取得Query Hook
 *
 * Suspenseを使用して現在のユーザー情報を取得します。
 *
 * @param options - フックオプション
 * @param options.queryConfig - React Queryのクエリ設定
 * @returns ユーザー情報クエリオブジェクト
 *
 * @example
 * ```tsx
 * import { useUser } from '@/features/sample-auth/api/get-user';
 *
 * function UserProfile() {
 *   const { data } = useUser();
 *
 *   return (
 *     <div>
 *       <h1>{data.data.name}</h1>
 *       <p>{data.data.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  return useSuspenseQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
  });
};
