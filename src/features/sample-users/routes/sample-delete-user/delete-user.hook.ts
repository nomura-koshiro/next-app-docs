import { useRouter } from "next/navigation";
import { use } from "react";

import {
  useDeleteUser as useDeleteUserMutation,
  useUser,
} from "@/features/sample-users";

/**
 * ユーザー削除確認ページのロジックを管理するカスタムフック
 */
export const useDeleteUser = (params: Promise<{ id: string }>) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { id: userId } = use(params);

  const { data, isLoading, error } = useUser({
    userId,
  });

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
    isLoading,
    error,
    handleDelete,
    handleCancel,
    isDeleting,
  };
};
