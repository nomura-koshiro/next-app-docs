'use client';

import { useRouter } from 'next/navigation';

import { useUsers as useUsersQuery } from '@/features/sample-users/api/get-users';

/**
 * ユーザー一覧ページのロジックを管理するカスタムフック
 *
 * API層のuseUsersを呼び出し、ページ固有のビジネスロジック（ナビゲーション）を追加
 */
export const useUsers = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { data } = useUsersQuery();

  const users = data?.data ?? [];

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleEdit = (userId: string) => {
    router.push(`/sample-users/${userId}/edit`);
  };

  const handleDelete = (userId: string) => {
    router.push(`/sample-users/${userId}/delete`);
  };

  const handleCreateNew = () => {
    router.push('/sample-users/new');
  };

  return {
    users,
    handleEdit,
    handleDelete,
    handleCreateNew,
  };
};
