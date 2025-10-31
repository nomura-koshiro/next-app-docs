import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

// ================================================================================
// API関数
// ================================================================================

/**
 * @example
 * ```tsx
 * await deleteUser('123');
 * ```
 */
export const deleteUser = (userId: string): Promise<void> => {
  return api.delete(`/sample/users/${userId}`);
};

// ================================================================================
// Hooks
// ================================================================================

type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

/**
 * ミューテーション成功時にユーザー一覧のクエリキャッシュを無効化します。
 *
 * @example
 * ```tsx
 * import { useDeleteUser } from '@/features/sample-users/api/delete-user';
 *
 * function DeleteUserButton({ userId }: { userId: string }) {
 *   const deleteUserMutation = useDeleteUser({
 *     mutationConfig: {
 *       onSuccess: () => {
 *         console.log('ユーザーが削除されました');
 *       },
 *     },
 *   });
 *
 *   const handleDelete = () => {
 *     if (confirm('本当に削除しますか?')) {
 *       deleteUserMutation.mutate(userId);
 *     }
 *   };
 *
 *   return <button onClick={handleDelete}>削除</button>;
 * }
 * ```
 */
export const useDeleteUser = ({ mutationConfig }: UseDeleteUserOptions = {}) => {
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
    mutationFn: deleteUser,
  });
};
