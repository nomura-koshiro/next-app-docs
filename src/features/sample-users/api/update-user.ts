import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { UpdateUserInput, User } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * @example
 * ```tsx
 * const updatedUser = await updateUser({
 *   userId: '123',
 *   data: { name: 'John Doe', email: 'john@example.com' }
 * });
 * ```
 */
export const updateUser = ({ userId, data }: { userId: string; data: UpdateUserInput }): Promise<User> => {
  return api.put(`/sample/users/${userId}`, data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

/**
 * ミューテーション成功時に以下の処理を実行:
 * - ユーザー一覧のクエリキャッシュを無効化
 * - 更新したユーザーの詳細クエリキャッシュを無効化
 *
 * @example
 * ```tsx
 * import { useUpdateUser } from '@/features/sample-users/api/update-user';
 *
 * function UpdateUserForm({ userId }: { userId: string }) {
 *   const updateUserMutation = useUpdateUser({
 *     mutationConfig: {
 *       onSuccess: (data) => {
 *         console.log('ユーザーが更新されました:', data);
 *       },
 *     },
 *   });
 *
 *   const handleSubmit = (values: UpdateUserInput) => {
 *     updateUserMutation.mutate({ userId, data: values });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export const useUpdateUser = ({ mutationConfig }: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] }).catch((error) => {
        logger.error("ユーザークエリの無効化に失敗しました", error);
      });
      queryClient.invalidateQueries({ queryKey: ["users", data.id] }).catch((error) => {
        logger.error("ユーザークエリの無効化に失敗しました", error, { userId: data.id });
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
