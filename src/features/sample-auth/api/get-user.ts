/**
 * 現在のユーザー情報取得API
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 */

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/tanstack-query';

import type { User } from '../types';

// ================================================================================
// API関数
// ================================================================================

/**
 * 現在のユーザー情報を取得
 *
 * エンドポイント: GET /api/v1/sample/auth/me
 * TODO: JWTトークンがヘッダーに自動的に含まれることを確認してください（api-client.tsで設定）
 */
export const getUser = (): Promise<{ data: User }> => {
  // TODO: 実際のAPI呼び出しに置き換える
  return api.get('/api/v1/sample/auth/me');

  // モック実装（テスト用）
  // return Promise.resolve({
  //   data: {
  //     id: "1",
  //     email: "user@example.com",
  //     name: "Sample User",
  //     role: "user",
  //   },
  // });
};

/**
 * ユーザー情報のクエリオプション
 */
export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: ['auth-user'],
    queryFn: getUser,
  });
};

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  return useSuspenseQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
  });
};
