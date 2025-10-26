import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';
import { userFormSchema } from '@/features/sample-users/schemas/user-form.schema';
import { logger } from '@/utils/logger';

import type { UpdateUserDTO, User } from '../types';

// ================================================================================
// API Functions
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
        logger.error('Failed to invalidate users query', error);
      });
      queryClient.invalidateQueries({ queryKey: ['users', data.id] }).catch((error) => {
        logger.error('Failed to invalidate user query', error, { userId: data.id });
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};

// ================================================================================
// Exports for validation
// ================================================================================
export { userFormSchema as updateUserInputSchema };
