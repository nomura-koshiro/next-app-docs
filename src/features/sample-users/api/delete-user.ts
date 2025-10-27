import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';
import { logger } from '@/utils/logger';

// ================================================================================
// API関数
// ================================================================================

export const deleteUser = (userId: string): Promise<void> => {
  return api.delete(`/sample/users/${userId}`);
};

// ================================================================================
// フック
// ================================================================================

type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ mutationConfig }: UseDeleteUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] }).catch((error) => {
        logger.error('ユーザークエリの無効化に失敗しました', error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUser,
  });
};
