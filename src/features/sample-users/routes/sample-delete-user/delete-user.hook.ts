'use client';

import { useRouter } from 'next/navigation';

import { useDeleteUser as useDeleteUserMutation } from '@/features/sample-users';
import { useUser } from '@/features/sample-users/api/get-user';

/**
 * ユーザー削除確認ページのロジックを管理するカスタムフック
 *
 * API層のuseUserを呼び出し、削除処理とナビゲーションを追加
 */
export const useDeleteUser = (userId: string) => {
  // ================================================================================
  // フック
  // ================================================================================
  const router = useRouter();

  const { data } = useUser({ userId });

  const deleteUserMutation = useDeleteUserMutation();

  const user = data?.data;

  // ================================================================================
  // ハンドラー
  // ================================================================================
  /**
   * ユーザー削除ハンドラー
   *
   * 処理フロー:
   * 1. FastAPIにユーザー削除リクエスト送信
   * 2. 成功時: ユーザー一覧ページへ遷移
   * 3. エラー時: mutationのエラー状態で管理
   */
  const handleDelete = () => {
    deleteUserMutation
      .mutateAsync(userId)
      .then(() => {
        router.push('/sample-users');
      })
      .catch(() => {
        // エラーハンドリング: mutationのエラー状態で管理
      });
  };

  const handleCancel = () => {
    router.push('/sample-users');
  };

  return {
    user,
    handleDelete,
    handleCancel,
    isDeleting: deleteUserMutation.isPending,
  };
};
