import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { User } from "../types";
import { UserResponseSchema } from "./schemas/user-response.schema";

// ================================================================================
// API関数
// ================================================================================

/**
 * ユーザー詳細取得
 *
 * @param userId - ユーザーID
 * @returns ユーザー詳細（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const user = await getUser('123')
 * console.log(user.data) // User
 * ```
 */
export const getUser = async (userId: string): Promise<{ data: User }> => {
  const response = await api.get(`/sample/users/${userId}`);
  return UserResponseSchema.parse(response);
};

export const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseUserOptions = {
  userId: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

/**
 * @example
 * ```tsx
 * const { data } = useUser({ userId: '123' })
 * console.log(data.data) // User
 * ```
 */
export const useUser = ({ userId, queryConfig }: UseUserOptions) => {
  return useSuspenseQuery({
    ...getUserQueryOptions(userId),
    ...queryConfig,
  });
};
