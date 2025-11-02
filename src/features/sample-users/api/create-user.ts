import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { CreateUserInput, User } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * @example
 * ```tsx
 * const newUser = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'user'
 * })
 * ```
 */
export const createUser = (data: CreateUserInput): Promise<User> => {
  return api.post("/sample/users", data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

/**
 * ユーザー作成成功時に自動でユーザー一覧クエリを無効化します。
 *
 * @example
 * ```tsx
 * const { mutate } = useCreateUser()
 * mutate({ name: 'John', email: 'john@example.com', role: 'user' })
 * ```
 */
export const useCreateUser = ({ mutationConfig }: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] }).catch((error) => {
        logger.error("ユーザークエリの無効化に失敗しました", error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
