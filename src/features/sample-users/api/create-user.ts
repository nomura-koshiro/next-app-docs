import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userFormSchema } from "@/features/sample-users/types/forms";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { CreateUserInput, User } from "../types";
import { createUserOutputSchema } from "../types/api";

// ================================================================================
// API関数
// ================================================================================

/**
 * ユーザー作成
 *
 * @param data - ユーザー作成データ
 * @returns 作成されたユーザー（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const newUser = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'user'
 * })
 * ```
 */
export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await api.post("/sample/users", data);

  return createUserOutputSchema.parse(response);
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

// ================================================================================
// バリデーション用のエクスポート
// ================================================================================
export { userFormSchema as createUserInputSchema };
