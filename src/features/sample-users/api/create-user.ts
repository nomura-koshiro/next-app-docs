import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';

import type { CreateUserInput, User } from '../types';

// ================================================================================
// Schemas
// ================================================================================

export const createUserInputSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().min(1, 'メールアドレスは必須です').email('正しいメールアドレスを入力してください'),
  role: z.string().min(1, 'ロールは必須です'),
});

// ================================================================================
// API Functions
// ================================================================================

export const createUser = (data: CreateUserInput): Promise<User> => {
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
        console.error('Failed to invalidate users query:', error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
