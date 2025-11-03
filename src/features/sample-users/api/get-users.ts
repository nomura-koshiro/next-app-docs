import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { User } from "../types";
import { usersOutputSchema } from "../types/api";

// ================================================================================
// API関数
// ================================================================================

/**
 * ユーザー一覧取得
 *
 * @returns ユーザー一覧（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const users = await getUsers()
 * console.log(users.data) // User[]
 * ```
 */
export const getUsers = async (): Promise<{ data: User[] }> => {
  const response = await api.get("/sample/users");

  return usersOutputSchema.parse(response);
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

/**
 * @example
 * ```tsx
 * const { data } = useUsers()
 * console.log(data.data) // User[]
 * ```
 */
export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
