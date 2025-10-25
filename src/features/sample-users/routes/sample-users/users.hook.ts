'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic } from 'react';

import { useDeleteUser as useDeleteUserMutation } from '@/features/sample-users';
import { useUsers as useUsersQuery } from '@/features/sample-users/api/get-users';

/**
 * ユーザー一覧ページのロジックを管理するカスタムフック
 *
 * React 19のuseOptimisticを使用して、ユーザー削除時の即座のUI反映を実現します。
 * API層のuseUsersを呼び出し、ページ固有のビジネスロジック（ナビゲーション、削除）を追加
 */
export const useUsers = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { data } = useUsersQuery();
  const deleteUserMutation = useDeleteUserMutation();

  const users = data?.data ?? [];

  // 楽観的UI更新のためのuseOptimistic
  // ユーザー削除を即座に表示し、FastAPIのレスポンスを待たずにUIを更新
  const [optimisticUsers, removeOptimisticUser] = useOptimistic(users, (state: User[], deletedUserId: string) =>
    state.filter((user: User) => user.id !== deletedUserId)
  );

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleEdit = (userId: string) => {
    router.push(`/sample-users/${userId}/edit`);
  };

  /**
   * ユーザー削除ハンドラー（useOptimistic対応版）
   *
   * 処理フロー:
   * 1. 削除確認ダイアログを表示（ブラウザ標準のconfirm）
   * 2. 確認後、即座にUIからユーザーを削除（楽観的更新）
   * 3. FastAPIに削除リクエスト送信
   * 4. 成功時: TanStack Queryのキャッシュが自動更新
   * 5. エラー時: 楽観的更新が自動的にロールバック
   *
   * 注意: 削除確認ページ(/sample-users/[id]/delete)への遷移は廃止されました
   */
  const handleDelete = async (userId: string) => {
    const user = users.find((u: User) => u.id === userId);
    if (!user) return;

    // ブラウザ標準の確認ダイアログ
    const confirmed = window.confirm(`${user.name} を削除してもよろしいですか？\nこの操作は取り消せません。`);

    if (!confirmed) return;

    // 🚀 即座にUIから削除（楽観的更新）
    removeOptimisticUser(userId);

    try {
      // FastAPIに削除リクエスト
      await deleteUserMutation.mutateAsync(userId);
      // ✅ 削除成功（キャッシュ無効化はuseDeleteUserMutation内で実行）
    } catch (error) {
      // ❌ エラー時: 楽観的更新が自動的にロールバック
      console.error('ユーザーの削除に失敗しました:', error);
      // エラー通知を表示（オプション）
      alert('ユーザーの削除に失敗しました。もう一度お試しください。');
    }
  };

  /**
   * 削除確認ページへの遷移（レガシー）
   *
   * 注意: この関数は後方互換性のために残されていますが、
   * handleDeleteを使用することを推奨します。
   */
  const handleDeleteConfirmPage = (userId: string) => {
    router.push(`/sample-users/${userId}/delete`);
  };

  const handleCreateNew = () => {
    router.push('/sample-users/new');
  };

  return {
    users: optimisticUsers, // 楽観的更新を反映したユーザーリストを返す
    handleEdit,
    handleDelete,
    handleDeleteConfirmPage, // レガシー対応
    handleCreateNew,
    isDeleting: deleteUserMutation.isPending,
  };
};
