import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userFormSchema } from "@/features/sample-users/types/forms";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { UpdateUserInput, User } from "../types";
import { userSchema } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * ユーザー更新
 *
 * @param params - ユーザーIDと更新データ
 * @returns 更新されたユーザー（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const updatedUser = await updateUser({
 *   userId: '123',
 *   data: { name: 'John Doe', email: 'john@example.com' }
 * });
 * ```
 */
export const updateUser = async ({ userId, data }: { userId: string; data: UpdateUserInput }): Promise<User> => {
  const response = await api.put(`/sample/users/${userId}`, data);

  // PUT APIは { data: User } ではなく User を直接返すため userSchema を使用
  return userSchema.parse(response);
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

// ================================================================================
// バリデーション用のエクスポート
// ================================================================================
export { userFormSchema as updateUserInputSchema };
