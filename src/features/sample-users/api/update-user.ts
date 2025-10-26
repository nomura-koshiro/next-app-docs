import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';

import type { UpdateUserInput, User } from '../types';

// ================================================================================
// Schemas
// ================================================================================

export const updateUserInputSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().min(1, 'メールアドレスは必須です').email('正しいメールアドレスを入力してください'),
  role: z.string().min(1, 'ロールは必須です'),
});

// ================================================================================
// API Functions
// ================================================================================

export const updateUser = ({ userId, data }: { userId: string; data: UpdateUserInput }): Promise<User> => {
  return api.put(`/users/${userId}`, data);
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
        console.error('Failed to invalidate users query:', error);
      });
      queryClient.invalidateQueries({ queryKey: ['users', data.id] }).catch((error) => {
        console.error('Failed to invalidate user query:', error);
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
