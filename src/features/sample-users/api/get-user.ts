import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/tanstack-query';

import type { User } from '../types';

// ================================================================================
// API関数
// ================================================================================

/**
 * @example
 * ```tsx
 * const user = await getUser('123')
 * console.log(user.data) // User
 * ```
 */
export const getUser = (userId: string): Promise<{ data: User }> => {
  return api.get(`/sample/users/${userId}`);
};

export const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseUserOptions = {
  userId: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

/**
 * @example
 * ```tsx
 * const { data } = useUser({ userId: '123' })
 * console.log(data.data) // User
 * ```
 */
export const useUser = ({ userId, queryConfig }: UseUserOptions) => {
  return useSuspenseQuery({
    ...getUserQueryOptions(userId),
    ...queryConfig,
  });
};
