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
 * const users = await getUsers()
 * console.log(users.data) // User[]
 * ```
 */
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/sample/users');
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

/**
 * @example
 * ```tsx
 * const { data } = useUsers()
 * console.log(data.data) // User[]
 * ```
 */
export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
