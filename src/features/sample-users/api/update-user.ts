import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userFormSchema } from '@/features/sample-users/schemas/user-form.schema';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';
import { logger } from '@/utils/logger';

import type { UpdateUserDTO, User } from '../types';

// ================================================================================
// API関数
// ================================================================================

export const updateUser = ({ userId, data }: { userId: string; data: UpdateUserDTO }): Promise<User> => {
  return api.put(`/sample/users/${userId}`, data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({ mutationConfig }: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] }).catch((error) => {
        logger.error('ユーザークエリの無効化に失敗しました', error);
      });
      queryClient.invalidateQueries({ queryKey: ['users', data.id] }).catch((error) => {
        logger.error('ユーザークエリの無効化に失敗しました', error, { userId: data.id });
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
