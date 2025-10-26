import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userFormSchema } from '@/features/sample-users/schemas/user-form.schema';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';
import { logger } from '@/utils/logger';

import type { CreateUserDTO, User } from '../types';

// ================================================================================
// API Functions
// ================================================================================

export const createUser = (data: CreateUserDTO): Promise<User> => {
  return api.post('/sample/users', data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({ mutationConfig }: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] }).catch((error) => {
        logger.error('Failed to invalidate users query', error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};

// ================================================================================
// Exports for validation
// ================================================================================
export { userFormSchema as createUserInputSchema };
