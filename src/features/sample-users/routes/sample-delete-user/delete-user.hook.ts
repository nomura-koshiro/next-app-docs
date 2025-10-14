import { use } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/features/sample-users/api/get-user";
import { useDeleteUser as useDeleteUserMutation } from "@/features/sample-users";

/**
 * ユーザー削除確認ページのロジックを管理するカスタムフック
 *
 * API層のuseUserを呼び出し、削除処理とナビゲーションを追加
 */
export const useDeleteUser = (params: Promise<{ id: string }>) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { id: userId } = use(params);

  const { data } = useUser({ userId });

  const deleteUserMutation = useDeleteUserMutation();
  const isDeleting = deleteUserMutation.isPending;

  const user = data?.data;

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleDelete = () => {
    deleteUserMutation
      .mutateAsync(userId)
      .then(() => {
        router.push("/sample-users");
      })
      .catch(() => {
        // エラーハンドリング: mutationのエラー状態で管理
      });
  };

  const handleCancel = () => {
    router.push("/sample-users");
  };

  return {
    user,
    handleDelete,
    handleCancel,
    isDeleting,
  };
};
