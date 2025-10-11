import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useUser,
  useDeleteUser as useDeleteUserMutation,
} from "@/features/users";

/**
 * ユーザー削除確認ページのロジックを管理するカスタムフック
 */
export const useDeleteUser = (params: Promise<{ id: string }>) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Next.js 15のApp Routerではparamsが非同期Promiseになる
  useEffect(() => {
    params
      .then((resolvedParams) => {
        setUserId(resolvedParams.id);
      })
      .catch((error: unknown) => {
        console.error("Failed to resolve params:", error);
      });
  }, [params]);

  const { data, isLoading, error } = useUser({
    userId: userId ?? "",
    queryConfig: {
      enabled: userId !== null,
    },
  });

  const deleteUserMutation = useDeleteUserMutation();

  const handleDelete = () => {
    if (userId === null) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    return deleteUserMutation
      .mutateAsync(userId)
      .then(() => {
        router.push("/users");
      })
      .catch(() => {
        setDeleteError("ユーザーの削除に失敗しました");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleCancel = () => {
    router.push("/users");
  };

  const user = data?.data;

  return {
    userId,
    user,
    isLoading,
    error,
    handleDelete,
    handleCancel,
    isDeleting,
    deleteError,
  };
};
